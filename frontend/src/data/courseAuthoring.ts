import { webPage } from "./htmlCssCourse";
import type { WebFiles, WebLesson, WebProject } from "./webCourseTypes";

const baseCss = `* { box-sizing: border-box; }
body { margin: 0; padding: clamp(1rem, 4vw, 2.5rem); background: #eef5fc; color: #18334e; font: 1rem/1.55 system-ui, sans-serif; }
main { max-width: 50rem; margin: auto; }
h1, h2, h3 { line-height: 1.2; }
h1 { font-size: clamp(1.65rem, 5vw, 2.5rem); margin-top: 0; }
button, input, select, textarea { font: inherit; max-width: 100%; }
button { background: #175f9b; border: 1px solid #175f9b; border-radius: .6rem; color: white; padding: .48rem .8rem; cursor: pointer; }
button:disabled { opacity: .55; cursor: wait; }
input:not([type=checkbox]):not([type=range]), select, textarea { padding: .5rem .6rem; border: 1px solid #9bb5cc; border-radius: .5rem; background: white; color: inherit; }
:focus-visible { outline: 3px solid #1d73c9; outline-offset: 3px; }
a { color: #154f91; }
img { max-width: 100%; }
.actions { display: flex; flex-wrap: wrap; gap: .55rem; align-items: center; }
.card { background: #fff; border: 1px solid #caddec; border-radius: .8rem; padding: 1rem; margin-block: .75rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 11rem), 1fr)); gap: .7rem; }
.muted { color: #476881; }
.output { white-space: pre-wrap; overflow-wrap: anywhere; background: white; border-radius: .7rem; padding: 1rem; }
`;
type FileOptions = {
  css?: string;
  modules?: Record<string, string>;
  entry?: string;
};

export function jsFiles(
  title: string,
  content: string,
  script: string,
  options: FileOptions = {},
): WebFiles {
  const entry = options.entry ?? "script.js";
  return {
    html: webPage(
      title,
      `${content}\n<script type="module" src="./${entry}"></script>`,
    ),
    css: `${baseCss}\n${options.css ?? ""}`,
    entry,
    scripts: { [entry]: script.trim(), ...options.modules },
  };
}

export function reactFiles(
  title: string,
  script: string,
  options: FileOptions = {},
) {
  return jsFiles(
    title,
    '<div id="root"></div>',
    `import { createRoot } from "react-dom/client";\n${script.trim()}\n\nconst root = document.getElementById("root");\nif (root) createRoot(root).render(<App />);`,
    { ...options, entry: options.entry ?? "main.jsx" },
  );
}

export function vueFiles(
  title: string,
  app: string,
  options: FileOptions & { bootstrap?: string } = {},
) {
  return jsFiles(
    title,
    '<div id="app"></div>',
    options.bootstrap ??
      'import { createApp } from "vue";\nimport App from "./App.vue";\n\ncreateApp(App).mount("#app");',
    {
      ...options,
      entry: options.entry ?? "main.js",
      modules: { "App.vue": app.trim(), ...options.modules },
    },
  );
}

export function section(title: string, text: string, points: string[]) {
  return { title, text, points };
}

export function quiz(
  question: string,
  options: string[],
  answer: number,
  explanation: string,
) {
  return { question, options, answer, explanation };
}

export function lesson(
  specification: Omit<WebLesson, "resource"> & {
    link: string;
    linkLabel?: string;
  },
): WebLesson {
  const { link, linkLabel, ...content } = specification;
  return {
    ...content,
    resource: { label: linkLabel ?? "Lire la documentation", url: link },
  };
}

export function projectExample(
  project: WebProject,
  entry = project.files.entry,
): WebFiles {
  return { ...project.files, entry };
}

export const levelColors = ["#1a75b8", "#2863a6", "#244a83"];
