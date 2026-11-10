import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Check,
  Bot,
  CheckCircle2,
  ChevronRight,
  Code2,
  Download,
  FileCode2,
  FolderOpen,
  ImagePlus,
  Monitor,
  Play,
  Plus,
  Terminal,
  RotateCcw,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useI18n } from "../../i18n/context";
import type {
  WebEditorMode,
  WebFiles,
  WebProject,
} from "../../data/webCourseTypes";
import {
  editorFilenameKey,
  editorFilenames,
  firstEditorFile,
  maxAddedFiles,
  maxWebFileLength,
  readEditorDraft,
  readEditorFile,
  removeEditorFile,
  validEditorFilename,
  writeEditorFile,
} from "../../lib/webEditorFiles";
import {
  buildScriptPreview,
  parseStudioMessage,
  readStudioStorage,
  type StudioLog,
} from "../../lib/scriptPreview";
import { buildWebDocument } from "../../lib/webPreview";
import StudioLocalGuide from "./StudioLocalGuide";
import CompiledStudioPanel from "./CompiledStudioPanel";
import { compileInStudio } from "../../lib/compileInStudio";
import {
  isCompilerLanguage,
  type CompilerResult,
} from "../../lib/compilerProtocol";
import SqlStudioPanel from "./SqlStudioPanel";
import { useSqlStudio } from "../../lib/sql/useSqlStudio";
import "./web-learning.css";

const codeKeywords =
  /^(const|let|function|def|return|if|elif|else|for|of|in|class|extends|import|export|default|async|await|try|catch|except|finally|new|type|interface|true|false|null|True|False|None|throw|from|public|private|protected|static|record|package|namespace|use|implements|fun|val|when|object|suspend|override|data|is|init|var|struct|enum|protocol|guard|nil|some|case|switch|defer|throws|final|super|void|dynamic|required|late|sealed|factory|with)$/;
const localFilenameExamples = {
  django: "atelier/exemple.py",
  nuxt: "app/pages/exemple.vue",
  laravel: "app/Models/Exemple.php",
  spring: "src/main/java/devafrica/atelier/Exemple.java",
  node: "routes/exemple.js",
  kotlin: "src/main/kotlin/Exemple.kt",
  compose: "app/src/main/java/devafrica/atelier/Exemple.kt",
  "java-android": "app/src/main/java/devafrica/atelier/Exemple.java",
  swift: "Atelier/Exemple.swift",
  flutter: "lib/exemple.dart",
  expo: "src/Exemple.tsx",
  c: "utilitaires.c",
  cpp: "outils.cpp",
  java: "Exemple.java",
  gtk: "utilitaires.c",
  qt: "employe.hpp",
  javafx: "src/main/resources/atelier.fxml",
  python: "outils.py",
  nodejs: "outils.mjs",
  typescript: "Outils.ts",
  php: "outils.php",
  customtkinter: "outils.py",
  electron: "outils.cjs",
  nodegui: "src/outils.ts",
  "php-desktop": "www/outils.php",
  sql: "exercice.sql",
};
function Highlight({ code, file }: { code: string; file: string }) {
  const css = file.endsWith(".css");
  const python = file.endsWith(".py");
  const tokens = /\.(html|xml|fxml|ui)$/.test(file)
    ? code.split(/(<!--[\s\S]*?-->|<[^>]*>|"[^"\n]*"|'[^'\n]*')/g)
    : css
      ? code.split(
          /(\/\*[\s\S]*?\*\/|"[^"\n]*"|'[^'\n]*'|#[\da-fA-F]{3,8}\b|@[\w-]+|--[\w-]+|[\w-]+(?=\s*:)|[{};])/g,
        )
      : python
        ? code.split(
            /(#[^\n]*|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\b(?:def|return|if|elif|else|for|in|class|import|from|async|await|try|except|finally|True|False|None)\b)/g,
          )
        : code.split(
            /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|`[^`]*`|\b(?:const|let|function|return|if|else|for|of|class|extends|import|export|default|async|await|try|catch|finally|new|type|interface|true|false|null|throw|from|public|private|protected|static|record|package|namespace|use|implements|fun|val|when|object|suspend|override|data|is|init|var|struct|enum|protocol|guard|nil|some|case|switch|defer|throws|final|super|void|dynamic|required|late|sealed|factory|with)\b|<\/?[A-Za-z][\w-]*|@[A-Za-z][\w-]*)/g,
          );
  return (
    <>
      {tokens.map((token, index) => {
        let kind = "plain";
        if (
          /^(<!--|\/\*|\/\/)/.test(token) ||
          (python && token.startsWith("#"))
        )
          kind = "comment";
        else if (/^(<|@)/.test(token)) kind = "tag";
        else if (/^["'`]/.test(token)) kind = "string";
        else if (/^(#|--)/.test(token)) kind = "value";
        else if (css && /^[\w-]+$/.test(token)) kind = "property";
        else if (codeKeywords.test(token)) kind = "keyword";
        return (
          <span key={index} className={`syntax-${kind}`}>
            {token}
          </span>
        );
      })}
      {"\n"}
    </>
  );
}

function newRunId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export default function WebCodeStudio({
  draftId,
  title,
  initialFiles,
  mode,
  project,
  completed,
  onComplete,
  onAskCode,
}: {
  draftId: string;
  title: string;
  initialFiles: WebFiles;
  mode: WebEditorMode;
  project?: WebProject;
  completed?: boolean;
  onComplete?: () => void;
  onAskCode?: (file: string, code: string, anchor?: HTMLElement) => void;
}) {
  const { t } = useI18n();
  const localRuntime = initialFiles.local?.runtime;
  const compilerLanguage = isCompilerLanguage(localRuntime)
    ? localRuntime
    : null;
  const [compilerResult, setCompilerResult] = useState<CompilerResult | null>(
    null,
  );
  const [compilerError, setCompilerError] = useState("");
  const compilerRequest = useRef<AbortController | null>(null);

  useEffect(() => () => compilerRequest.current?.abort(), []);
  const sqlRuntime = localRuntime === "sql";
  const sql = useSqlStudio(
    sqlRuntime ? draftId : null,
    initialFiles.local?.sources["schema.sql"] ?? "",
  );
  const interactive = mode !== "html-css" && !localRuntime;
  const studioName =
    localRuntime === "nuxt"
      ? "Nuxt · Vue / TypeScript"
      : {
          react: "React · JSX / TSX",
          javascript: "JavaScript",
          vue: "Vue.js · SFC",
          django: "Django · Python",
          laravel: "Laravel · PHP / Blade",
          spring: "Spring Boot · Java",
          node: "Node.js · Express",
          kotlin: "Kotlin · JVM",
          compose: "Jetpack Compose · Android",
          "java-android": "Java et XML · Android",
          swift: "Swift et SwiftUI · iOS",
          flutter: "Flutter · Dart",
          expo: "React Native · Expo / TypeScript",
          c: "C · GCC / GTK",
          cpp: "C++ · G++ / Qt",
          java: "Java · JVM / JavaFX",
          python: "Python · console / CustomTkinter",
          nodejs: "JavaScript · Node.js / Electron",
          typescript: "TypeScript · tsc / NodeGui",
          php: "PHP · CLI / PHP Desktop",
          sql: "SQL · SQLite",
          "html-css": "HTML / CSS",
        }[mode];
  const defaultFile = firstEditorFile(initialFiles);
  const exampleFilename = localRuntime
    ? localFilenameExamples[localRuntime]
    : mode === "vue"
      ? "MaCarte.vue"
      : "utilitaires.js";
  const storageKey = `devafrica:web-draft:${draftId}`;
  const runtimeKey = `devafrica:web-runtime:${draftId}`;
  const [files, setFiles] = useState(() =>
    readEditorDraft(storageKey, initialFiles, mode),
  );
  const stdin = files.local?.stdin ?? "";
  const latestFiles = useRef(files);
  const [active, setActive] = useState(defaultFile);
  const [preview, setPreview] = useState<string | null>(() =>
    interactive || localRuntime ? null : buildWebDocument(files),
  );
  const [runId, setRunId] = useState("initial");
  const [ranFiles, setRanFiles] = useState(
    interactive || localRuntime ? null : files,
  );
  const [logs, setLogs] = useState<StudioLog[]>([]);
  const [busy, setBusy] = useState(false);
  const [creatingFile, setCreatingFile] = useState(false);
  const [filename, setFilename] = useState("");
  const [fileError, setFileError] = useState("");
  const [viewport, setViewport] = useState("desktop");
  const [tab, setTab] = useState<"code" | "preview">("code");
  const [notice, setNotice] = useState("");
  const [saveState, setSaveState] = useState<"initial" | "saved" | "error">(
    "initial",
  );
  const [resetting, setResetting] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string>();
  const [removedFile, setRemovedFile] = useState<{ name: string; code: string }>();
  const [review, setReview] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileTabs = useRef<HTMLDivElement>(null);
  const localOutput = useRef<HTMLElement>(null);
  const highlight = useRef<HTMLPreElement>(null);
  const numbers = useRef<HTMLDivElement>(null);
  const runButton = useRef<HTMLButtonElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const previewFrame = useRef<HTMLIFrameElement>(null);
  const activeRun = useRef("");
  const building = useRef(false);
  const names = editorFilenames(files);
  const starterNames = editorFilenames(initialFiles);
  const addedNames = names.filter((file) => !starterNames.includes(file));
  const code = readEditorFile(files, active);
  const changed = ranFiles !== null && files !== ranFiles;

  useEffect(() => {
    const strip = fileTabs.current;
    const selected = strip?.querySelector('button[aria-pressed="true"]');
    if (!strip || !selected) return;
    const bounds = strip.getBoundingClientRect();
    const file = selected.getBoundingClientRect();
    if (file.left < bounds.left) strip.scrollLeft += file.left - bounds.left;
    else if (file.right > bounds.right)
      strip.scrollLeft += file.right - bounds.right;
  }, [active, tab]);

  useEffect(() => {
    if (!interactive) return;
    function receive(event: MessageEvent) {
      const message = parseStudioMessage(
        event,
        previewFrame.current?.contentWindow,
        activeRun.current,
      );
      if (!message) return;
      if ("log" in message)
        setLogs((current) => [...current.slice(-79), message.log]);
      else {
        try {
          localStorage.setItem(runtimeKey, JSON.stringify(message.storage));
        } catch {
          setSaveState("error");
        }
      }
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [interactive, runtimeKey]);

  function commit(next: WebFiles) {
    latestFiles.current = next;
    setFiles(next);
    setNotice("");
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }
  async function runSql(query: string, reset = false) {
    if (building.current || !sql.ready) return;
    building.current = true;
    setBusy(true);
    setTab("preview");
    try {
      await sql.execute(query, reset);
      setRanFiles(files);
    } finally {
      building.current = false;
      setBusy(false);
    }
  }
  async function run() {
    if (building.current) return;
    setTab("preview");
    if (sqlRuntime && files.local) {
      await runSql(
        active.endsWith(".sql")
          ? code
          : (files.local.sources["requete.sql"] ?? ""),
      );
      return;
    }
    if (compilerLanguage && files.local) {
      const controller = new AbortController();
      compilerRequest.current = controller;
      building.current = true;
      setBusy(true);
      setCompilerError("");
      setCompilerResult(null);
      requestAnimationFrame(() =>
        localOutput.current?.focus({ preventScroll: true }),
      );
      try {
        setCompilerResult(
          await compileInStudio(
            compilerLanguage,
            files.local.sources,
            stdin,
            AbortSignal.any([controller.signal, AbortSignal.timeout(30_000)]),
          ),
        );
        setRanFiles(files);
      } catch (error) {
        if (!controller.signal.aborted) {
          setCompilerError(
            error instanceof Error ? error.message : "unavailable",
          );
        }
      } finally {
        compilerRequest.current = null;
        building.current = false;
        setBusy(false);
      }
      return;
    }
    if (localRuntime) {
      requestAnimationFrame(() =>
        localOutput.current?.focus({ preventScroll: true }),
      );
      return;
    }
    if (!interactive) {
      setPreview(buildWebDocument(files));
      setRanFiles(files);
      setNotice(t("Aperçu mis à jour.", "Preview updated."));
      runButton.current?.focus({ preventScroll: true });
      return;
    }
    building.current = true;
    setBusy(true);
    setNotice("");
    setLogs([]);
    activeRun.current = "";
    try {
      const id = newRunId();
      const document = await buildScriptPreview(
        files,
        mode,
        id,
        readStudioStorage(runtimeKey),
      );
      activeRun.current = id;
      setRunId(id);
      setPreview(document);
      setRanFiles(files);
    } catch (error) {
      setPreview(null);
      setLogs([
        {
          level: "error",
          text: error instanceof Error ? error.message : String(error),
        },
      ]);
    } finally {
      building.current = false;
      setBusy(false);
    }
  }
  function keydown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      void run();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      runButton.current?.focus();
    }
    if (event.key === "Tab" && !event.shiftKey) {
      event.preventDefault();
      const target = event.currentTarget,
        start = target.selectionStart,
        end = target.selectionEnd;
      const nextCode = code.slice(0, start) + "  " + code.slice(end);
      if (nextCode.length > maxWebFileLength) return;
      commit(writeEditorFile(files, active, nextCode));
      requestAnimationFrame(() =>
        target.setSelectionRange(start + 2, start + 2),
      );
    }
  }
  function changeFile(file: string) {
    setActive(file);
    setTab("code");
    requestAnimationFrame(() => {
      textarea.current?.scrollTo(0, 0);
      highlight.current?.scrollTo(0, 0);
      if (numbers.current) numbers.current.scrollTop = 0;
    });
  }
  async function addImage(file?: File) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
        file.type,
      ) ||
      file.size > 120_000
    ) {
      setNotice(
        t(
          "Choisis une image PNG, JPEG, WebP ou GIF de 120 ko maximum pour cet exercice.",
          "Choose a PNG, JPEG, WebP or GIF image up to 120 KB for this exercise.",
        ),
      );
      return;
    }
    const reader = new FileReader();
    reader.onerror = () =>
      setNotice(
        t("Cette image n’a pas pu être lue.", "This image could not be read."),
      );
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const current = latestFiles.current;
      const element = `\n<img src="${reader.result}" alt="Décris ton image ici" style="max-width:100%;height:auto">\n`;
      const html = /<\/body\s*>/i.test(current.html)
        ? current.html.replace(/<\/body\s*>/i, element + "</body>")
        : current.html + element;
      if (html.length > maxWebFileLength) {
        setNotice(
          t(
            "Le fichier HTML est trop long. Réduis l’image avant de l’ajouter.",
            "The HTML file is too large. Reduce the image before adding it.",
          ),
        );
        return;
      }
      commit({ ...current, html });
      changeFile("index.html");
      setNotice(
        t(
          "Image ajoutée au HTML. Remplace son texte alt puis lance l’aperçu.",
          "Image added to HTML. Edit its alt text, then run the preview.",
        ),
      );
    };
    reader.readAsDataURL(file);
  }
  async function download() {
    if (building.current) return;
    building.current = true;
    setBusy(true);
    try {
      let blob: Blob;
      if (files.local) {
        const { sources, assets } = files.local;
        const { strToU8, zipSync } = await import("fflate");
        const staticFiles = await Promise.all(
          Object.entries(assets ?? {}).map(async ([name, path]) => {
            const response = await fetch(import.meta.env.BASE_URL + path);
            if (!response.ok)
              throw new Error(
                t(
                  `Fichier d’atelier indisponible : ${name}`,
                  `Studio file unavailable: ${name}`,
                ),
              );
            return [
              name,
              new Uint8Array(await response.arrayBuffer()),
            ] as const;
          }),
        );
        const archive = zipSync(
          Object.fromEntries([
            ...Object.entries(sources).map(
              ([name, code]) => [name, strToU8(code)] as const,
            ),
            ...staticFiles,
          ]),
        );
        blob = new Blob([Uint8Array.from(archive)], {
          type: "application/zip",
        });
      } else {
        const documentContent = interactive
          ? await buildScriptPreview(files, mode, newRunId(), {}, false)
          : buildWebDocument(files, false);
        blob = new Blob([documentContent], { type: "text/html;charset=utf-8" });
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `devafrica-${draftId.replace(/[^a-z0-9-]/gi, "-")}.${localRuntime ? "zip" : "html"}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(
        localRuntime
          ? t("Projet ZIP téléchargé.", "Project ZIP downloaded.")
          : t(
              "Page HTML exportée avec ses styles et ses fichiers intégrés.",
              "HTML exported with embedded styles and files.",
            ),
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : String(error));
    } finally {
      building.current = false;
      setBusy(false);
    }
  }
  function addModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = filename.trim();
    if (
      !validEditorFilename(name, files, mode) ||
      names.some(
        (file) =>
          editorFilenameKey(file, files) === editorFilenameKey(name, files),
      )
    ) {
      setFileError(
        localRuntime
          ? t(
              `Choisis un nom unique, comme ${exampleFilename}.`,
              `Choose a unique name such as ${exampleFilename}.`,
            )
          : mode === "vue"
            ? t(
                "Choisis un nom unique, comme MaCarte.vue ou utilitaires.ts.",
                "Choose a unique name such as MyCard.vue or helpers.ts.",
              )
            : t(
                "Choisis un nom unique terminé par .js, .jsx, .ts ou .tsx, sans espace.",
                "Choose a unique filename ending in .js, .jsx, .ts or .tsx, without spaces.",
              ),
      );
      return;
    }
    if (addedNames.length >= maxAddedFiles) return;
    commit(writeEditorFile(files, name, ""));
    changeFile(name);
    setCreatingFile(false);
    setFilename("");
    setFileError("");
  }
  function deleteFile(name = deletingFile) {
    if (!name || !addedNames.includes(name)) return;
    setRemovedFile({ name, code: readEditorFile(files, name) });
    commit(removeEditorFile(files, initialFiles, name));
    if (name === active) changeFile(defaultFile);
    setDeletingFile(undefined);
    requestAnimationFrame(() =>
      textarea.current?.focus({ preventScroll: true }),
    );
  }
  const checked = project && review.length === project.requirements.length;
  return (
    <div className="web-studio-wrap">
      {project && (
        <details className="studio-project-instructions"><summary><Code2 size={16} />{t("Consignes du mini-projet", "Mini-project instructions")} · {project.title}</summary>
        <section className="web-project-brief">
          <div className="web-eyebrow">
            <Code2 size={15} />
            {t("MINI-PROJET · À TOI DE CRÉER", "MINI PROJECT · YOUR TURN")}
          </div>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <div className="web-brief-list">
            <strong>{t("Ta mission", "Your mission")}</strong>
            <ol>
              {project.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <button
            className="web-text-button"
            aria-expanded={showHints}
            onClick={() => setShowHints(!showHints)}
          >
            {t("Besoin d’une piste ?", "Need a hint?")}
            <ChevronRight className={showHints ? "rotate" : ""} size={16} />
          </button>
          {showHints && (
            <ul className="web-project-hints">
              {project.hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          )}
        </section>
        </details>
      )}
      <section
        className="web-studio"
        aria-label={`${t("Atelier de code", "Code studio")} · ${studioName}`}
      >
        <header className="studio-titlebar">
          <div className="studio-window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>
            <Code2 size={15} />
            {title}
          </span>
          <small>DevAfrica Studio</small>
        </header>
        <div className="studio-toolbar">
          <div className="studio-tools-left">
            {onAskCode && <button type="button" className="studio-tutor-button" onClick={event => onAskCode(active, code, event.currentTarget)} aria-label={t("Demander à l’agent d’expliquer le fichier actif", "Ask the agent to explain the active file")} title={t("Demander à l’agent d’expliquer le fichier actif", "Ask the agent to explain the active file")}><Bot size={18} /></button>}
            <button onClick={() => void download()} disabled={busy}>
              <Download size={15} />
              {localRuntime
                ? t("Exporter le ZIP", "Export ZIP")
                : t("Exporter .html", "Export .html")}
            </button>
            {!localRuntime && (
              <>
                <button onClick={() => imageInput.current?.click()}>
                  <ImagePlus size={15} />
                  {t("Image", "Image")}
                </button>
                <input
                  ref={imageInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  aria-label={t(
                    "Ajouter une image au projet",
                    "Add an image to the project",
                  )}
                  onChange={(event) => {
                    void addImage(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </>
            )}
            {(interactive || localRuntime) &&
              addedNames.length < maxAddedFiles && (
                <button
                  type="button"
                  onClick={() => setCreatingFile(!creatingFile)}
                  aria-expanded={creatingFile}
                  aria-label={t("Ajouter un fichier", "Add a file")}
                  title={t("Ajouter un fichier", "Add a file")}
                >
                  <Plus size={16} />
                </button>
              )}
            {addedNames.includes(active) && (
              <button
                type="button"
                aria-label={t(`Supprimer ${active}`, `Delete ${active}`)}
                title={t(`Supprimer ${active}`, `Delete ${active}`)}
                onClick={() => {
                  setResetting(false);
                  setDeletingFile(active);
                }}
              >
                <Trash2 size={15} />
              </button>
            )}
            <button
              aria-label={t("Réinitialiser cet atelier", "Reset this studio")}
              disabled={busy}
              onClick={() => {
                setDeletingFile(undefined);
                setResetting(!resetting);
              }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
          <button
            ref={runButton}
            className="studio-run"
            disabled={busy || (sqlRuntime && !sql.ready)}
            onClick={() => void run()}
          >
            {localRuntime ? (
              <Terminal size={15} />
            ) : (
              <Play size={15} fill="currentColor" />
            )}
            {busy
              ? t("Préparation…", "Preparing…")
              : sqlRuntime
                ? t("Exécuter le SQL", "Run SQL")
                : compilerLanguage
                  ? ["python", "nodejs", "php"].includes(compilerLanguage)
                    ? t("Exécuter le script", "Run script")
                    : t("Compiler et exécuter", "Compile and run")
                  : localRuntime
                    ? t("Guide de lancement", "Run guide")
                    : interactive
                      ? t("Exécuter", "Run")
                      : t("Lancer l’aperçu", "Run preview")}
          </button>
        </div>
      {removedFile && <div className="studio-undo-file" role="status"><span>{t(`Le fichier ${removedFile.name} a été supprimé.`, `${removedFile.name} was deleted.`)}</span><button type="button" disabled={addedNames.length >= maxAddedFiles || names.some((name) => editorFilenameKey(name, files) === editorFilenameKey(removedFile.name, files))} onClick={() => { commit(writeEditorFile(files, removedFile.name, removedFile.code)); changeFile(removedFile.name); setRemovedFile(undefined); setNotice(t("Fichier restauré avec son contenu.", "File and its contents restored.")); }}><Undo2 size={15} />{t("Annuler la suppression", "Undo deletion")}</button><button type="button" aria-label={t("Fermer l’annulation", "Dismiss undo")} onClick={() => setRemovedFile(undefined)}><X size={14} /></button></div>}
        {resetting && (
          <div className="studio-reset">
            <span>
              {t(
                "Revenir au code de départ ? Cela remplacera ton brouillon de cet atelier.",
                "Restore the starter code? This replaces this studio’s draft.",
              )}
            </span>
            <button
              onClick={() => {
                commit(initialFiles);
                setRemovedFile(undefined);
                if (sqlRuntime) void runSql("", true);
                activeRun.current = "";
                setLogs([]);
                setCompilerResult(null);
                setCompilerError("");
                setPreview(
                  interactive || localRuntime
                    ? null
                    : buildWebDocument(initialFiles),
                );
                setRanFiles(interactive || localRuntime ? null : initialFiles);
                changeFile(defaultFile);
                setResetting(false);
                setReview([]);
              }}
            >
              {t("Réinitialiser", "Reset")}
            </button>
            <button onClick={() => setResetting(false)}>
              {t("Annuler", "Cancel")}
            </button>
          </div>
        )}
        {deletingFile && (
          <div className="studio-reset studio-delete">
            <span>
              {t(
                `Supprimer le fichier ${deletingFile} ?`,
                `Delete the file ${deletingFile}?`,
              )}
            </span>
            <button onClick={() => deleteFile()}>
              {t("Supprimer le fichier", "Delete file")}
            </button>
            <button onClick={() => setDeletingFile(undefined)}>
              {t("Annuler", "Cancel")}
            </button>
          </div>
        )}
        {creatingFile && (
          <form className="studio-create-file" onSubmit={addModule}>
            <label>
              {t("Nom du fichier", "Filename")}{" "}
              <input
                value={filename}
                onChange={(event) => setFilename(event.target.value)}
                placeholder={exampleFilename}
                maxLength={100}
                required
              />
            </label>
            <button type="submit">{t("Créer", "Create")}</button>
            <button
              type="button"
              onClick={() => {
                setCreatingFile(false);
                setFileError("");
              }}
            >
              {t("Annuler", "Cancel")}
            </button>
            {fileError && <span role="alert">{fileError}</span>}
          </form>
        )}
        <div
          className="studio-mobile-tabs"
          role="group"
          aria-label={t("Affichage de l’atelier", "Studio view")}
        >
          <button aria-pressed={tab === "code"} onClick={() => setTab("code")}>
            <Code2 size={16} />
            Code
          </button>
          <button
            aria-pressed={tab === "preview"}
            onClick={() => setTab("preview")}
          >
            <Monitor size={16} />
            {sqlRuntime || compilerLanguage
              ? t("Console", "Console")
              : localRuntime
                ? t("Lancement", "Run guide")
                : t("Aperçu", "Preview")}
          </button>
        </div>
        <div className={`studio-main studio-show-${tab}`}>
          <aside
            className="studio-files"
            aria-label={t("Fichiers du projet", "Project files")}
          >
            <h3>
              <FolderOpen size={14} />
              {t("EXPLORATEUR", "EXPLORER")}
            </h3>
            <span>{localRuntime ?? "mon-projet"}</span>
            {names.map((file) => (
              <div key={file} className={`studio-file-row ${active === file ? "active" : ""}`}>
              <button
                key={file}
                aria-pressed={active === file}
                onClick={() => changeFile(file)}
                title={file}
              >
                <FileCode2 size={15} />
                <span
                  className={`studio-file-name ${addedNames.includes(file) ? "studio-user-file" : ""}`}
                >
                  {file}
                </span>
              </button>
              {addedNames.includes(file) && <button type="button" className="studio-file-delete" aria-label={t(`Supprimer ${file}`, `Delete ${file}`)} title={t(`Supprimer ${file}`, `Delete ${file}`)} onClick={() => deleteFile(file)}><X size={15} /></button>}
              </div>
            ))}
          </aside>
          <div className="studio-code-pane">
            <div
              className="studio-file-tabs"
              ref={fileTabs}
              role="group"
              aria-label={t("Choisir un fichier", "Choose a file")}
            >
              {names.map((file) => (
                <div className={`studio-file-tab ${active === file ? "active" : ""}`} key={file}>
                <button
                  key={file}
                  aria-pressed={active === file}
                  onClick={() => changeFile(file)}
                >
                  <FileCode2 size={14} />
                  <span
                    className={`studio-file-name ${addedNames.includes(file) ? "studio-user-file" : ""}`}
                  >
                    {file}
                  </span>
                  {active === file && <span aria-hidden="true">●</span>}
                </button>
                {addedNames.includes(file) && <button type="button" className="studio-file-delete" aria-label={t(`Supprimer ${file}`, `Delete ${file}`)} title={t(`Supprimer ${file}`, `Delete ${file}`)} onClick={() => deleteFile(file)}><X size={15} /></button>}
                </div>
              ))}
            </div>
            <div className="studio-editor-shell">
              <div
                className="studio-line-numbers"
                ref={numbers}
                aria-hidden="true"
              >
                {code.split("\n").map((_, index) => (
                  <span key={index}>{index + 1}</span>
                ))}
              </div>
              <div className="studio-text-layer">
                <pre
                  ref={highlight}
                  className="studio-highlight"
                  aria-hidden="true"
                >
                  <Highlight code={code} file={active} />
                </pre>
                <textarea
                  ref={textarea}
                  className="studio-textarea"
                  aria-label={`${t("Éditeur", "Editor")} ${active}`}
                  value={code}
                  onChange={(event) =>
                    commit(writeEditorFile(files, active, event.target.value))
                  }
                  onKeyDown={keydown}
                  onScroll={(event) => {
                    if (highlight.current) {
                      highlight.current.scrollTop =
                        event.currentTarget.scrollTop;
                      highlight.current.scrollLeft =
                        event.currentTarget.scrollLeft;
                    }
                    if (numbers.current)
                      numbers.current.scrollTop = event.currentTarget.scrollTop;
                  }}
                  maxLength={maxWebFileLength}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  wrap="off"
                />
              </div>
            </div>
            <div className="studio-code-footer">
              <span>{active} · UTF-8</span>
              <span>
                {code.split("\n").length} {t("lignes", "lines")}
              </span>
            </div>
          </div>
          <section
            className="studio-preview-pane"
            ref={localRuntime ? localOutput : undefined}
            tabIndex={localRuntime ? -1 : undefined}
            aria-label={
              sqlRuntime
                ? t("Terminal SQL", "SQL terminal")
                : compilerLanguage
                  ? t("Console de l’atelier", "Workshop console")
                  : localRuntime
                    ? t("Guide de lancement", "Run guide")
                    : t("Résultat de ton code", "Your code output")
            }
          >
            <div className="studio-preview-toolbar">
              <span>
                <span className="studio-live-dot" />
                {sqlRuntime
                  ? "SQLITE"
                  : compilerLanguage
                    ? t("COMPILATION", "COMPILATION")
                    : localRuntime
                      ? t("EXÉCUTION LOCALE", "LOCAL EXECUTION")
                      : t("RÉSULTAT", "OUTPUT")}
              </span>
              {!localRuntime && (
                <div
                  role="group"
                  aria-label={t("Largeur de l’aperçu", "Preview width")}
                >
                  {[
                    {
                      id: "desktop",
                      Icon: Monitor,
                      label: t("Bureau", "Desktop"),
                    },
                    { id: "tablet", Icon: Tablet, label: "Tablette · 768 px" },
                    {
                      id: "mobile",
                      Icon: Smartphone,
                      label: "Mobile · 375 px",
                    },
                  ].map(({ id, Icon, label }) => (
                    <button
                      key={id}
                      aria-label={label}
                      title={label}
                      aria-pressed={viewport === id}
                      onClick={() => setViewport(id)}
                    >
                      <Icon size={15} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="studio-preview-stage">
              {sqlRuntime ? (
                <SqlStudioPanel
                  studio={sql}
                  busy={busy}
                  onRun={(query) => void runSql(query)}
                  onReset={() => void runSql("", true)}
                />
              ) : compilerLanguage ? (
                <CompiledStudioPanel
                  language={compilerLanguage}
                  stdin={stdin}
                  onInput={(text) => {
                    if (latestFiles.current.local) {
                      commit({
                        ...latestFiles.current,
                        local: { ...latestFiles.current.local, stdin: text },
                      });
                    }
                    setCompilerResult(null);
                    setCompilerError("");
                  }}
                  busy={busy}
                  result={compilerResult}
                  error={compilerError}
                />
              ) : localRuntime ? (
                <StudioLocalGuide runtime={localRuntime} />
              ) : preview ? (
                <iframe
                  key={runId}
                  ref={previewFrame}
                  title={
                    interactive
                      ? t("Aperçu interactif", "Interactive preview")
                      : t("Aperçu HTML et CSS", "HTML and CSS preview")
                  }
                  sandbox={interactive ? "allow-scripts allow-forms" : ""}
                  referrerPolicy="no-referrer"
                  srcDoc={preview}
                  style={{
                    width:
                      viewport === "mobile"
                        ? 375
                        : viewport === "tablet"
                          ? 768
                          : "100%",
                  }}
                />
              ) : (
                <div className="studio-preview-empty">
                  <Monitor size={26} />
                  <p>
                    {t(
                      "Exécute ton code pour afficher le résultat.",
                      "Run your code to see the result.",
                    )}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
        {interactive && (
          <section
            className="studio-console"
            aria-label={t("Console du programme", "Program console")}
          >
            <header>
              <span>
                <Terminal size={15} /> {t("Console", "Console")}
              </span>
              <button onClick={() => setLogs([])}>
                {t("Effacer la console", "Clear console")}
              </button>
            </header>
            <div
              role="log"
              aria-label={t("Messages et erreurs", "Messages and errors")}
            >
              {logs.length ? (
                logs.map((line, index) => (
                  <div
                    key={index}
                    className={`console-line console-${line.level}`}
                  >
                    <small>{line.level}</small>
                    <code>{line.text}</code>
                  </div>
                ))
              ) : (
                <span className="console-empty">
                  {t(
                    "Les traces console.log et les erreurs s’affichent ici.",
                    "Console messages and errors appear here.",
                  )}
                </span>
              )}
            </div>
          </section>
        )}
        <footer className="studio-status">
          <span>
            {changed
              ? t(
                  compilerLanguage
                    ? "Modifications à compiler. Lance la console."
                    : "Modifications à afficher. Lance l’aperçu.",
                  compilerLanguage
                    ? "Changes pending. Compile and run."
                    : "Changes pending. Run the preview.",
                )
              : `${studioName} · ${t("atelier local", "local studio")}`}
          </span>
          <span>
            {saveState === "saved" ? (
              <>
                <Check size={13} />
                {t("Brouillon enregistré", "Draft saved")}
              </>
            ) : saveState === "error" ? (
              t(
                "Sauvegarde indisponible : exporte ton travail.",
                "Save unavailable: export your work.",
              )
            ) : sqlRuntime ? (
              t("Ctrl + Entrée pour exécuter le SQL", "Ctrl + Enter to run SQL")
            ) : compilerLanguage ? (
              t(
                "Ctrl + Entrée : compiler et exécuter",
                "Ctrl + Enter: compile and run",
              )
            ) : localRuntime ? (
              t(
                "Ctrl + Entrée : guide · Échap : quitter l’éditeur",
                "Ctrl + Enter: run guide · Escape: leave editor",
              )
            ) : (
              t(
                "Ctrl + Entrée : aperçu · Échap : quitter l’éditeur",
                "Ctrl + Enter: preview · Escape: leave editor",
              )
            )}
          </span>
        </footer>
      </section>
      <p className="web-studio-note">
        {sqlRuntime
          ? t(
              "Les requêtes s’exécutent avec SQLite dans ce navigateur. Exporte la base et les résultats pour poursuivre ton projet.",
              "Queries run with SQLite in this browser. Export the database and results to continue your project.",
            )
          : compilerLanguage
            ? t(
                "Le code et les valeurs d’entrée sont transmis au compilateur DevAfrica. Ton brouillon reste dans ce navigateur et peut être exporté en ZIP.",
                "Code and standard input are sent to the DevAfrica compiler. Your draft stays in this browser and can be exported as a ZIP.",
              )
            : localRuntime
              ? t(
                  "Ton brouillon est conservé dans ce navigateur. Le ZIP contient tous les fichiers actuels de l’atelier. Pour tester une nouvelle modification, reporte-la dans ton dossier local ou exporte à nouveau.",
                  "Your draft is saved in this browser. The ZIP contains the current studio files. To test a new change, apply it in your local folder or export again.",
                )
              : interactive
                ? t(
                    "L’atelier exécute les fichiers dans un aperçu isolé. Le code et le stockage de l’exercice sont enregistrés dans ce navigateur. Les exercices avec une API utilisent une connexion Internet.",
                    "The studio runs files in an isolated preview. Exercise code and storage are saved in this browser. API exercises use an Internet connection.",
                  )
                : t(
                    "L’aperçu HTML/CSS affiche la structure et les styles. Les images ajoutées avec le bouton Image sont incluses dans la page exportée.",
                    "The HTML/CSS preview displays structure and styles. Images added with the Image button are included in the exported page.",
                  )}
      </p>
      {notice && (
        <div className="web-notice" role="status">
          <CheckCircle2 size={17} />
          {notice}
          <button
            aria-label={t("Fermer le message", "Dismiss message")}
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {project && (
        <section className="web-project-review">
          <div className="web-eyebrow">
            {t("AVANT DE TERMINER", "BEFORE FINISHING")}
          </div>
          <h2>
            {compilerLanguage
              ? t(
                  "Teste ton programme dans la console.",
                  "Test your program in the console.",
                )
              : localRuntime
                ? t(
                    "Teste le projet exporté sur ton ordinateur.",
                    "Test the exported project on your computer.",
                  )
                : t(
                    "Relis, teste, puis fais le point.",
                    "Review, test, then reflect.",
                  )}
          </h2>
          <p>
            {t(
              "Coche chaque critère après avoir vérifié ton résultat.",
              "Check off each criterion after verifying your result.",
            )}
          </p>
          <div>
            {project.requirements.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={Boolean(completed) || review.includes(item)}
                  disabled={completed}
                  onChange={(event) =>
                    setReview((current) =>
                      event.target.checked
                        ? [...current, item]
                        : current.filter((x) => x !== item),
                    )
                  }
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
          <button
            className="web-primary-button"
            disabled={!checked || completed}
            onClick={onComplete}
          >
            <CheckCircle2 size={17} />
            {completed
              ? t("Projet terminé", "Project completed")
              : t("Marquer ce projet terminé", "Mark project complete")}
          </button>
          {completed && (
            <p role="status">
              {t(
                "Ta progression est conservée sur cet appareil. Tu peux continuer à améliorer ton projet.",
                "Your progress is saved on this device. You can keep improving your project.",
              )}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
