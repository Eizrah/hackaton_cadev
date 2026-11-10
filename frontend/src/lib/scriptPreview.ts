import type { WebFiles, WebEditorMode } from "../data/webCourseTypes";
import { buildWebDocument } from "./webPreview";

const channel = "devafrica:studio";
const storageLimit = 60_000;
const storageKeyLimit = 40;
const runtimes: Partial<Record<"react" | "vue", Promise<string>>> = {};

function loadRuntime(mode: "react" | "vue") {
  runtimes[mode] ??= fetch(
    `${import.meta.env.BASE_URL}learning/${mode}-runtime.js`,
  )
    .then((response) => {
      if (!response.ok)
        throw new Error(
          `Le moteur ${mode === "vue" ? "Vue" : "React"} de l’atelier est indisponible.`,
        );
      return response.text();
    })
    .catch((error: unknown) => {
      delete runtimes[mode];
      throw error;
    });
  return runtimes[mode];
}

function json(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function readStudioStorage(key: string): Record<string, string> {
  try {
    return (
      parseStudioStorage(JSON.parse(localStorage.getItem(key) ?? "{}")) ?? {}
    );
  } catch {
    return {};
  }
}

function parseStudioStorage(
  value: unknown,
): Record<string, string> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const entries = Object.entries(value);
  if (
    entries.length > storageKeyLimit ||
    entries.some(([, item]) => typeof item !== "string") ||
    JSON.stringify(value).length > storageLimit
  )
    return;
  return Object.fromEntries(entries);
}

export type StudioLog = {
  level: "log" | "info" | "warn" | "error";
  text: string;
};
export type StudioMessage =
  | { log: StudioLog }
  | { storage: Record<string, string> };

export function parseStudioMessage(
  event: MessageEvent,
  frame: Window | null | undefined,
  runId: string,
): StudioMessage | undefined {
  if (!frame || event.source !== frame || event.origin !== "null") return;
  const data = event.data;
  if (!data || data.channel !== channel || data.runId !== runId) return;
  if (data.kind === "storage") {
    const storage = parseStudioStorage(data.value);
    if (storage) return { storage };
  }
  if (
    data.kind === "log" &&
    ["log", "info", "warn", "error"].includes(data.level) &&
    typeof data.text === "string"
  ) {
    return { log: { level: data.level, text: data.text.slice(0, 1500) } };
  }
}

function bootstrap(runId: string, storage: Record<string, string>) {
  return `(() => {
  const report = (kind, details) => parent.postMessage({
    channel: ${json(channel)}, runId: ${json(runId)}, kind, ...details
  }, "*");
  const printable = (value) => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.name + ": " + value.message;
    try { return JSON.stringify(value) ?? String(value); }
    catch { return String(value); }
  };
  for (const level of ["log", "info", "warn", "error"]) {
    const original = console[level].bind(console);
    console[level] = (...values) => {
      original(...values);
      report("log", { level, text: values.map(printable).join(" ").slice(0, 1500) });
    };
  }
  addEventListener("error", (event) => console.error(event.message));
  addEventListener("unhandledrejection", (event) => console.error(event.reason));
  let values = Object.assign(Object.create(null), ${json(storage)});
  Object.defineProperty(window, "localStorage", { value: {
    get length() { return Object.keys(values).length; },
    key(index) { return Object.keys(values)[index] ?? null; },
    getItem(key) { return values[String(key)] ?? null; },
    setItem(key, value) {
      const next = Object.assign(Object.create(null), values, { [String(key)]: String(value) });
      if (Object.keys(next).length > ${storageKeyLimit} || JSON.stringify(next).length > ${storageLimit}) {
        throw new DOMException("L’espace de stockage de l’atelier est plein.", "QuotaExceededError");
      }
      values = next;
      report("storage", { value: values });
    },
    removeItem(key) {
      delete values[String(key)];
      report("storage", { value: values });
    },
    clear() {
      values = Object.create(null);
      report("storage", { value: values });
    }
  }});
})();`;
}

export async function buildScriptPreview(
  files: WebFiles,
  mode: WebEditorMode,
  runId: string,
  storage: Record<string, string>,
  preview = true,
) {
  if (!files.entry || !Object.hasOwn(files.scripts ?? {}, files.entry))
    throw new Error("Le fichier de démarrage est introuvable.");
  const [{ transform }, vendor, vueCompiler] = await Promise.all([
    import("sucrase"),
    mode === "react" || mode === "vue" ? loadRuntime(mode) : "",
    mode === "vue" ? import("./vueStudioCompiler") : undefined,
  ]);
  const styles = [files.css];
  const factories = Object.entries(files.scripts ?? {}).map(
    ([name, code], index) => {
      try {
        const component = name.endsWith(".vue")
          ? vueCompiler?.compileVueFile(code, name, index)
          : undefined;
        if (component) styles.push(component.css);
        const result = transform(component?.code ?? code, {
          transforms: [
            "imports",
            ...(/\.[jt]sx$/.test(name) ? ["jsx" as const] : []),
            ...(component?.typescript || /\.tsx?$/.test(name)
              ? ["typescript" as const]
              : []),
          ],
          jsxRuntime: "automatic",
          production: true,
          filePath: name,
        });
        return `${json(name)}: function(require, module, exports) {\n${result.code}\n}`;
      } catch (error) {
        throw new Error(
          `${name} · ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  );
  const runner = `(() => {
  const files = { ${factories.join(",\n")} };
  const packages = globalThis.__devafricaPackages ?? {};
  const cache = Object.create(null);
  function load(name) {
    if (Object.hasOwn(cache, name)) return cache[name].exports;
    const module = { exports: {} };
    cache[name] = module;
    const require = (specifier) => {
      if (Object.hasOwn(packages, specifier)) return packages[specifier];
      if (specifier.startsWith(".")) {
        const target = new URL(specifier, "https://atelier.invalid/" + name).pathname.slice(1);
        const match = [target, ...[".js", ".jsx", ".ts", ".tsx", ".vue"].map((ext) => target + ext)]
          .find((file) => Object.hasOwn(files, file));
        if (match) return load(match);
      }
      throw new Error("Module introuvable dans l’atelier : " + specifier);
    };
    try { files[name](require, module, module.exports); }
    catch (error) { delete cache[name]; throw error; }
    return module.exports;
  }
  try { load(${json(files.entry)}); }
  catch (error) { console.error(error); }
})();`;
  const sources = preview ? [bootstrap(runId, storage)] : [];
  if (vendor) sources.push(vendor);
  sources.push(runner);
  return buildWebDocument({ ...files, css: styles.join("\n") }, preview, {
    nonce: runId,
    sources,
  });
}
