import type { CompilerLanguage } from "../lib/compilerProtocol";

export type WebLevelId = "debutant" | "intermediaire" | "avance";
export type WebEditorMode =
  | "html-css"
  | "javascript"
  | "react"
  | "vue"
  | "django"
  | "laravel"
  | "spring"
  | "node"
  | "kotlin"
  | "compose"
  | "java-android"
  | "swift"
  | "flutter"
  | "expo"
  | "sql"
  | CompilerLanguage;
export type LocalRuntime =
  | "django"
  | "nuxt"
  | "laravel"
  | "spring"
  | "node"
  | "kotlin"
  | "compose"
  | "java-android"
  | "swift"
  | "flutter"
  | "expo"
  | "gtk"
  | "qt"
  | "javafx"
  | "customtkinter"
  | "electron"
  | "nodegui"
  | "php-desktop"
  | "sql"
  | CompilerLanguage;
export type WebFiles = {
  html: string;
  css: string;
  entry?: string;
  scripts?: Record<string, string>;
  local?: {
    runtime: LocalRuntime;
    sources: Record<string, string>;
    assets?: Readonly<Record<string, string>>;
    stdin?: string;
  };
};
export type WebLesson = {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  sections: { title: string; text: string; points: string[] }[];
  files: WebFiles;
  task: string;
  takeaway: string;
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  resource: { label: string; url: string };
};
export type WebChapter = {
  id: string;
  title: string;
  description: string;
  lessons: WebLesson[];
};
export type WebProject = {
  id: string;
  title: string;
  description: string;
  minutes: number;
  requirements: string[];
  hints: string[];
  files: WebFiles;
};
export type WebLevel = {
  id: WebLevelId;
  title: string;
  subtitle: string;
  objective: string;
  definition?: string;
  color: string;
  prerequisites: string;
  outcomes: string[];
  chapters: WebChapter[];
  projects: WebProject[];
};

export type WebTool = { name: string; role: string; url: string };
export type WebCurriculum = {
  title: string;
  intro: string;
  mode: WebEditorMode;
  path?:
    | "frontend"
    | "backend"
    | "android"
    | "ios"
    | "multiplateforme"
    | "langages";
  icons: string[];
  levels: WebLevel[];
  toolbox: WebTool[];
};

export function lessonsInLevel(level: WebLevel) {
  return level.chapters.flatMap((chapter) => chapter.lessons);
}

const detailedCourseIds = [
  "html-css-web",
  "javascript-web",
  "react-web",
  "vue-web",
  "django-web",
  "php-web",
  "java-web",
  "node-web",
  "kotlin-mobile",
  "compose-mobile",
  "java-mobile",
  "swift-mobile",
  "flutter-mobile",
  "react-native-mobile",
  "lang-c",
  "lang-cpp",
  "lang-java",
  "lang-python",
  "lang-javascript",
  "lang-typescript",
  "lang-php",
  "lang-sql",
] as const;
export type DetailedCourseId = (typeof detailedCourseIds)[number];

export function isDetailedCourse(id: string): id is DetailedCourseId {
  return detailedCourseIds.some((courseId) => courseId === id);
}

export function completionKey(id: string) {
  if (id === "lang-swift") id = "swift-mobile";
  return isDetailedCourse(id) && id !== "html-css-web" ? `${id}-programme` : id;
}
