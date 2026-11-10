import { isCompilerLanguage, maxCompilerStdin } from "./compilerProtocol";
import type { WebEditorMode, WebFiles } from "../data/webCourseTypes";

export const maxWebFileLength = 250_000;
export const maxAddedFiles = 16;
const scriptFilenamePattern = /^[a-zA-Z0-9_-]+\.(?:js|jsx|ts|tsx)$/;
const vueFilenamePattern =
  /^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:vue|js|ts)$/;
const projectFilenamePattern =
  /^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*\.(?:py|php|java|c|cpp|cc|cxx|h|hpp|hh|ui|fxml|swift|dart|kts?|html|css|[cm]?js|jsx|tsx?|vue|txt|md|json|xml|properties|sql|ya?ml)$/;

export function validEditorFilename(
  name: string,
  files: WebFiles,
  mode: WebEditorMode,
) {
  if (name.length > 100) return false;
  if (files.local)
    return (
      projectFilenamePattern.test(name) &&
      !Object.keys(files.local.assets ?? {}).some(
        (asset) => asset.toLowerCase() === name.toLowerCase(),
      ) &&
      !name
        .split("/")
        .some((part) =>
          /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part),
        )
    );
  if (mode === "vue") return vueFilenamePattern.test(name);
  return scriptFilenamePattern.test(name);
}

export function editorFilenames(files: WebFiles) {
  if (files.local) {
    const names = Object.keys(files.local.sources);
    return files.entry
      ? [files.entry, ...names.filter((file) => file !== files.entry)]
      : names;
  }
  return ["index.html", "styles.css", ...Object.keys(files.scripts ?? {})];
}

export function firstEditorFile(files: WebFiles) {
  return Object.hasOwn(files.scripts ?? {}, "App.vue")
    ? "App.vue"
    : (files.entry ?? "index.html");
}

export function editorFilenameKey(name: string, files: WebFiles) {
  return files.local ? name.toLowerCase() : name;
}

export function readEditorFile(files: WebFiles, filename: string) {
  if (files.local) return files.local.sources[filename] ?? "";
  if (filename === "index.html") return files.html;
  if (filename === "styles.css") return files.css;
  return files.scripts?.[filename] ?? "";
}

export function writeEditorFile(
  files: WebFiles,
  filename: string,
  code: string,
): WebFiles {
  if (files.local)
    return {
      ...files,
      local: {
        ...files.local,
        sources: { ...files.local.sources, [filename]: code },
      },
    };
  if (filename === "index.html") return { ...files, html: code };
  if (filename === "styles.css") return { ...files, css: code };
  return { ...files, scripts: { ...files.scripts, [filename]: code } };
}

export function removeEditorFile(
  files: WebFiles,
  initial: WebFiles,
  filename: string,
): WebFiles {
  if (editorFilenames(initial).includes(filename)) return files;
  const sources = { ...(files.local?.sources ?? files.scripts) };
  delete sources[filename];
  return files.local
    ? { ...files, local: { ...files.local, sources } }
    : { ...files, scripts: sources };
}

export function readEditorDraft(
  key: string,
  initial: WebFiles,
  mode: WebEditorMode,
): WebFiles {
  try {
    const saved = JSON.parse(
      localStorage.getItem(key) ?? "null",
    ) as Partial<WebFiles> | null;
    if (
      !saved ||
      typeof saved.html !== "string" ||
      typeof saved.css !== "string" ||
      saved.html.length > maxWebFileLength ||
      saved.css.length > maxWebFileLength
    )
      return initial;
    if (!initial.entry) return { html: saved.html, css: saved.css };
    const original = initial.local?.sources ?? initial.scripts ?? {};
    const draft = initial.local ? saved.local?.sources : saved.scripts;
    const sources = { ...original };
    const names = new Set(
      Object.keys(original).map((name) => editorFilenameKey(name, initial)),
    );
    let added = 0;
    for (const [name, code] of Object.entries(draft ?? {})) {
      if (typeof code !== "string" || code.length > maxWebFileLength) continue;
      const fileKey = editorFilenameKey(name, initial);
      if (Object.hasOwn(original, name)) {
        sources[name] = code;
      } else if (
        added < maxAddedFiles &&
        validEditorFilename(name, initial, mode) &&
        !names.has(fileKey) &&
        (initial.local || !["index.html", "styles.css"].includes(name))
      ) {
        sources[name] = code;
        names.add(fileKey);
        added += 1;
      }
    }
    if (initial.local)
      return {
        ...initial,
        local: {
          ...initial.local,
          sources,
          ...(isCompilerLanguage(initial.local.runtime) &&
          typeof saved.local?.stdin === "string" &&
          new TextEncoder().encode(saved.local.stdin).length <= maxCompilerStdin
            ? { stdin: saved.local.stdin }
            : {}),
        },
      };
    return {
      html: saved.html,
      css: saved.css,
      entry: initial.entry,
      scripts: sources,
    };
  } catch {
    return initial;
  }
}
