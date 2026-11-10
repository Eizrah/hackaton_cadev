export const compilerEndpoint = "/api/atelier/compilation";
export const compilerLanguages = [
  "c",
  "cpp",
  "java",
  "python",
  "nodejs",
  "typescript",
  "php",
] as const;
export type CompilerLanguage = (typeof compilerLanguages)[number];

export const sourceExtensions: Record<CompilerLanguage, RegExp> = {
  c: /\.(?:c|h)$/,
  cpp: /\.(?:cpp|cc|cxx|h|hpp|hh)$/,
  java: /\.java$/,
  python: /\.py$/,
  nodejs: /\.(?:mjs|cjs|js)$/,
  typescript: /\.ts$/,
  php: /\.php$/,
};

export const maxCompilerStdin = 4096;

export function isCompilerLanguage(value: unknown): value is CompilerLanguage {
  return compilerLanguages.some((language) => language === value);
}

export type CompilerRequest = {
  language: CompilerLanguage;
  sources: Record<string, string>;
  stdin: string;
};

export const compilerStatuses = [
  "ok",
  "compile-error",
  "runtime-error",
  "timeout",
  "output-limit",
] as const;
export type CompilerResult = {
  status: (typeof compilerStatuses)[number];
  stage: "compile" | "run";
  diagnostics: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
};

export function isCompilerResult(value: unknown): value is CompilerResult {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    compilerStatuses.some((status) => status === item.status) &&
    (item.stage === "compile" || item.stage === "run") &&
    typeof item.diagnostics === "string" &&
    typeof item.stdout === "string" &&
    typeof item.stderr === "string" &&
    (item.exitCode === null || Number.isInteger(item.exitCode))
  );
}
