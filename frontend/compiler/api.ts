import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  isCompilerLanguage,
  isCompilerResult,
  maxCompilerStdin,
  sourceExtensions,
  type CompilerRequest,
  type CompilerResult,
} from "../src/lib/compilerProtocol.ts";

const image = "devafrica-compiler:1";
const maxBody = 196_608;
const maxRunOutput = 224 * 1024;
const filename = /^(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.[a-z]+$/;
const unitExtensions = {
  ...sourceExtensions,
  c: /\.c$/,
  cpp: /\.(?:cpp|cc|cxx)$/,
};
const entryFiles = {
  java: "Main.java",
  python: "main.py",
  nodejs: "main.mjs",
  typescript: "main.ts",
  php: "main.php",
};
const recent: number[] = [];
let running = 0;

function parsePayload(value: unknown): CompilerRequest | null {
  if (!value || typeof value !== "object") return null;
  const { language, sources, stdin } = value as Record<string, unknown>;
  if (
    !isCompilerLanguage(language) ||
    typeof stdin !== "string" ||
    Buffer.byteLength(stdin) > maxCompilerStdin ||
    !sources ||
    typeof sources !== "object" ||
    Array.isArray(sources)
  )
    return null;

  const entries = Object.entries(sources);
  if (entries.length < 1 || entries.length > 24) return null;
  if (
    !entries.every(
      ([name, code]) =>
        filename.test(name) &&
        name.length <= 100 &&
        sourceExtensions[language].test(name) &&
        typeof code === "string" &&
        Buffer.byteLength(code) <= 64 * 1024,
    )
  )
    return null;
  if (!entries.some(([name]) => unitExtensions[language].test(name)))
    return null;
  if (
    language !== "c" &&
    language !== "cpp" &&
    !Object.hasOwn(sources, entryFiles[language])
  )
    return null;
  return { language, stdin, sources: Object.fromEntries(entries) };
}

function docker(
  args: string[],
  {
    input,
    timeout,
    signal,
  }: { input?: string; timeout: number; signal?: AbortSignal },
) {
  return new Promise<string>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Request aborted"));
      return;
    }
    const child = spawn("docker", args, {
      windowsHide: true,
      stdio: ["pipe", "pipe", "ignore"],
    });
    const output: Buffer[] = [];
    let size = 0;
    let interrupted = false;

    function abort() {
      interrupted = true;
      child.kill();
    }

    const timer = setTimeout(abort, timeout);
    function cleanup() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }

    signal?.addEventListener("abort", abort, { once: true });
    child.stdout.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > maxRunOutput) abort();
      else output.push(chunk);
    });
    child.stdin.on("error", () => undefined);
    child.once("error", (error) => {
      cleanup();
      reject(error);
    });
    child.once("close", (code) => {
      cleanup();
      if (interrupted || code !== 0)
        reject(new Error("Docker invocation failed"));
      else resolve(Buffer.concat(output).toString("utf8"));
    });
    child.stdin.end(input);
  });
}

async function execute(
  request: CompilerRequest,
  signal: AbortSignal,
): Promise<CompilerResult> {
  const name = "devafrica-atelier-" + randomUUID();
  try {
    await docker(
      [
        "create",
        "--interactive",
        "--pull=never",
        "--name",
        name,
        "--network=none",
        "--read-only",
        "--user=65532:65532",
        "--cap-drop=ALL",
        "--security-opt=no-new-privileges:true",
        "--pids-limit=64",
        "--memory=384m",
        "--memory-swap=384m",
        "--cpus=1",
        "--shm-size=4m",
        "--ulimit=core=0:0",
        "--ulimit=nofile=128:128",
        "--tmpfs=/work:rw,exec,nosuid,nodev,size=32m,mode=1777",
        "--tmpfs=/tmp:rw,noexec,nosuid,nodev,size=16m,mode=1777",
        image,
      ],
      { timeout: 5000 },
    );
    const raw = await docker(["start", "--attach", "--interactive", name], {
      input: JSON.stringify(request),
      timeout: 18_000,
      signal,
    });
    const result: unknown = JSON.parse(raw);
    if (!isCompilerResult(result)) throw new Error("Invalid compiler response");
    return result;
  } finally {
    await docker(["rm", "--force", name], { timeout: 4000 }).catch(
      () => undefined,
    );
  }
}

function reply(response: ServerResponse, status: number, value: unknown) {
  if (response.destroyed || response.writableEnded) return;
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(value));
}

async function readBody(request: IncomingMessage) {
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > maxBody) {
      request.resume();
      return null;
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

export async function handleCompiler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  if (
    !/^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(
      request.headers.host ?? "",
    )
  ) {
    reply(response, 403, { error: "origin" });
    return;
  }
  const origin = request.headers.origin;
  if (
    origin &&
    origin !== "http://" + request.headers.host &&
    origin !== "https://" + request.headers.host
  ) {
    reply(response, 403, { error: "origin" });
    return;
  }
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    reply(response, 405, { error: "method" });
    return;
  }
  const site = request.headers["sec-fetch-site"];
  if (site && site !== "same-origin" && site !== "none") {
    reply(response, 403, { error: "origin" });
    return;
  }
  if (
    request.headers["content-type"]?.split(";")[0].trim() !== "application/json"
  ) {
    reply(response, 415, { error: "invalid" });
    return;
  }
  if (Number(request.headers["content-length"]) > maxBody) {
    request.resume();
    reply(response, 413, { error: "invalid" });
    return;
  }

  let payload;
  try {
    payload = parsePayload(await readBody(request));
  } catch {
    reply(response, 400, { error: "invalid" });
    return;
  }
  if (!payload) {
    reply(response, 400, { error: "invalid" });
    return;
  }

  const now = Date.now();
  while (recent.length && now - recent[0] >= 60_000) recent.shift();
  if (running >= 2 || recent.length >= 30) {
    response.setHeader("Retry-After", "5");
    reply(response, 429, { error: "busy" });
    return;
  }

  if (response.destroyed) return;
  recent.push(now);
  running += 1;
  const controller = new AbortController();
  function disconnect() {
    controller.abort();
  }
  response.once("close", disconnect);
  try {
    reply(response, 200, await execute(payload, controller.signal));
  } catch {
    reply(response, 503, { error: "unavailable" });
  } finally {
    response.removeListener("close", disconnect);
    running -= 1;
  }
}
