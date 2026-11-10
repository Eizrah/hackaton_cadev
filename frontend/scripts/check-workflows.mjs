import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const temporary = await mkdtemp(path.join(tmpdir(), "devafrica-check-"));
try {
  const outfile = path.join(temporary, "workflows.cjs");
  await build({
    absWorkingDir: root,
    entryPoints: ["tests/workflows.test.ts"],
    outfile,
    bundle: true,
    platform: "node",
    format: "cjs",
    define: { "import.meta.env": "{}" },
    logLevel: "error",
  });
  const result = spawnSync(process.execPath, ["--test", outfile], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  await rm(temporary, { recursive: true, force: true });
}
