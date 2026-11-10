import {
  compilerEndpoint,
  isCompilerResult,
  sourceExtensions,
  type CompilerLanguage,
} from "./compilerProtocol";

export async function compileInStudio(
  language: CompilerLanguage,
  sources: Record<string, string>,
  stdin: string,
  signal: AbortSignal,
) {
  const files = Object.fromEntries(
    Object.entries(sources).filter(([name]) =>
      sourceExtensions[language].test(name),
    ),
  );
  const response = await fetch(compilerEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, sources: files, stdin }),
    signal,
  });
  if (response.status === 429) throw new Error("busy");
  if (response.status === 400 || response.status === 413)
    throw new Error("invalid");
  if (!response.ok) throw new Error("unavailable");

  const result: unknown = await response.json();
  if (!isCompilerResult(result)) throw new Error("unavailable");
  return result;
}
