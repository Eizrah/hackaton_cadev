import type { DetailedCourseId, WebLevelId } from "../data/webCourseTypes";
import { isDetailedCourse } from "../data/webCourseTypes";
import { findLearningTerms } from "../data/learningGlossary";

export type LearningCodeContext = {
  courseId: DetailedCourseId; courseTitle: string; level: WebLevelId;
  lessonTitle: string; file: string; code: string; returnPath: string; explanation: string;
};
export type LearningLessonContext = {
  kind: "lesson";
  courseId: DetailedCourseId;
  courseTitle: string;
  level: WebLevelId;
  lessonTitle: string;
  explanation: string;
  returnPath: string;
};
export type LearningTutorContext = LearningCodeContext | LearningLessonContext;
export function isLessonContext(context?: LearningTutorContext): context is LearningLessonContext {
  return !!context && "kind" in context && context.kind === "lesson";
}

export function localLessonExplanation(question: string, context?: LearningLessonContext, english = false) {
  const terms = findLearningTerms(question, context?.courseId).slice(0, 6);
  const definitions = terms.map(term => `${term.label} : ${term.meaning}\nExemple : ${term.example}`).join("\n\n");
  const intro = english
    ? "Local learning help — no AI model is connected. The available definitions and course extracts are currently in French."
    : "Aide locale à la leçon — aucun modèle IA connecté.";
  const heading = context ? `\n\n${context.courseTitle} · ${context.lessonTitle}` : "";
  const answer = definitions || (english
    ? "This word or sentence has no exact definition in the local glossary. A personalized explanation requires the connected learning agent."
    : "Ce mot ou cette phrase n’a pas de définition exacte dans le lexique local. Une explication personnalisée demande l’agent apprentissage connecté.");
  const excerpt = context ? `\n\n${english ? "Passage from the current lesson:" : "Passage de la leçon en cours :"}\n${context.explanation.slice(0, 4500)}` : "";
  return `${intro}${heading}\n\n${answer}${excerpt}`;
}
const key = "devafrica:tutor-code-context";
export function saveLearningCodeContext(context: LearningCodeContext) {
  const bounded = { ...context, code: context.code.slice(0, 12_000), explanation: context.explanation.slice(0, 8_000) };
  try { sessionStorage.setItem(key, JSON.stringify(bounded)); } catch { /* Navigation remains available without browser storage. */ }
}
export function readLearningCodeContext(): LearningCodeContext | undefined {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) ?? "null");
    if (!value || !isDetailedCourse(value.courseId) || !["debutant", "intermediaire", "avance"].includes(value.level)) return;
    for (const name of ["courseTitle", "lessonTitle", "file", "code", "returnPath", "explanation"]) if (typeof value[name] !== "string") return;
    if (!value.returnPath.startsWith("apprentissage/cours/" + value.courseId + "/") || value.returnPath.length > 500) return;
    return { ...value, code: value.code.slice(0, 12_000), explanation: value.explanation.slice(0, 8_000) };
  } catch { return; }
}
export function tutorCodeQuestion(context: LearningCodeContext, english = false) {
  const intro = english
    ? "Explain this code step by step for a beginner. Define each acronym and symbol before using it, explain the inputs and expected output. I can also ask about one part, such as h1."
    : "Explique-moi ce code pas à pas comme à un débutant. Définis les acronymes et les symboles avant de les utiliser, puis explique les entrées et le résultat attendu. Je peux aussi te demander une partie précise, par exemple h1.";
  return intro + "\n\n" + context.courseTitle + " · " + context.lessonTitle + "\n" + context.file + "\n\n```\n" + context.code.slice(0, 3_000) + "\n```";
}
export function localContextExplanation(question: string, context: LearningCodeContext, english: boolean) {
  const questionOnly = question.split("```")[0];
  const specific = !questionOnly.includes("Explique-moi ce code pas à pas") && !questionOnly.includes("Explain this code step by step");
  const terms = findLearningTerms(specific ? questionOnly : context.code, context.courseId).slice(0, specific ? 6 : 10);
  const definitions = terms.map((term) => term.label + " : " + term.meaning + "\nExemple : " + term.example).join("\n\n");
  return (english ? "Local demonstration — no AI model is connected. The learning material and definitions below are currently in French.\n\n" : "Démonstration locale — aucun modèle IA connecté. Voici les définitions du cours liées à ta question ; cette aide ne prétend pas analyser tout programme arbitraire.\n\n")
    + context.courseTitle + " · " + context.lessonTitle + "\nFichier : " + context.file + "\n\n"
    + (definitions || "Aucune définition locale ne correspond exactement à cette question. Le cours associé ci-dessous peut t’aider ; une réponse personnalisée demande l’agent Django connecté.")
    + "\n\nLe passage du cours à relire :\n" + context.explanation.slice(0, 4_000)
    + "\n\nPour explorer : repère le point de départ, les données lues, les opérations et la sortie. Modifie une seule valeur dans l’atelier et compare ce que tu attendais avec le résultat.";
}
