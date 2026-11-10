import { readFileSync, existsSync } from "node:fs";
import { build } from "esbuild";

const reactPackages = [
  "react",
  "react-dom",
  "scheduler",
  "react-router",
  "react-router-dom",
  "cookie",
  "set-cookie-parser",
];
const vuePackages = [
  "vue",
  "@vue/shared",
  "@vue/runtime-core",
  "@vue/runtime-dom",
  "@vue/reactivity",
  "vue-router",
  "pinia",
];

async function buildRuntime(name, packages) {
  const notices = packages.map((packageName) => {
    const paths = ["LICENSE", "LICENSE.md"].map(
      (file) => `node_modules/${packageName}/${file}`,
    );
    const path = paths.find((file) => existsSync(file));
    return path
      ? `${packageName}\n${readFileSync(path, "utf8").trim()}`
      : packageName;
  });
  await build({
    entryPoints: [`scripts/learning-${name}-runtime.mjs`],
    outfile: `public/learning/${name}-runtime.js`,
    bundle: true,
    platform: "browser",
    target: "es2022",
    format: "iife",
    minify: true,
    legalComments: "inline",
    banner: { js: `/*\n${notices.join("\n\n").replace(/\*\//g, "* /")}\n*/` },
    define: {
      "process.env.NODE_ENV": '"production"',
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    },
    logLevel: "warning",
  });
}

await Promise.all([
  buildRuntime("react", reactPackages),
  buildRuntime("vue", vuePackages),
]);
