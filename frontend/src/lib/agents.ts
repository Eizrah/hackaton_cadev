import { courses } from "../data/learning";
import { normalizeText } from "../data/models";
import { apiRequest } from "./api";
import type { Language } from "../i18n/context";
import { isLessonContext, localContextExplanation, localLessonExplanation, type LearningTutorContext } from "./learningTutorContext";
import { findLearningTerms } from "../data/learningGlossary";
export type TutorMessage = { role: "user" | "assistant"; content: string };
export async function askTutor(
  messages: TutorMessage[],
  language: Language,
  context?: LearningTutorContext,
): Promise<string> {
  if (import.meta.env.VITE_AGENT_MODE === "api") {
    const response = await apiRequest<{ answer: string }>(
      "api/agents/learning/chat/",
      { method: "POST", body: JSON.stringify({ messages, language, ...(context ? { context } : {}) }) },
    );
    if (typeof response.answer !== "string")
      throw new Error("Réponse de l’agent invalide.");
    return response.answer;
  }
  const question =
    messages.filter((m) => m.role === "user").at(-1)?.content || "";
  const q = normalizeText(question);
  const en = language === "en";
  if (isLessonContext(context)) return localLessonExplanation(question, context, en);
  if (context) return localContextExplanation(question, context, en);
  if (findLearningTerms(question).length) return localLessonExplanation(question, undefined, en);
  const choose = (fr: string, english: string) => (en ? english : fr);
  const intro = choose(
    "Réponse de démonstration locale — aucun modèle IA connecté.",
    "Local demonstration reply — no AI model is connected.",
  );
  if (/frontend.*backend|backend.*frontend|fullstack/.test(q))
    return `${intro}\n\n${choose("Le frontend est la partie visible dans le navigateur : HTML structure, CSS présente et JavaScript rend l’interface interactive. React aide à composer cette interface.\n\nLe backend traite les requêtes, contrôle les droits et accède aux données. Django est un framework Python pour cette partie. Les deux communiquent souvent avec une API JSON.", "The frontend is the visible part in the browser: HTML provides structure, CSS controls presentation, and JavaScript adds interaction. React helps compose the interface.\n\nThe backend handles requests, permissions and data. Django is a Python framework for that part. They often communicate through a JSON API.")}`;
  if (q.includes("usestate"))
    return `${intro}\n\n${choose("useState conserve un état local React. La fonction setCompteur met à jour cet état et React actualise l’affichage.", "useState stores local React state. setCount updates it and React updates the interface.")}\n\n\`\`\`tsx\nconst [compteur, setCompteur] = useState(0);\n<button onClick={() => setCompteur(compteur + 1)}>{compteur}</button>\n\`\`\``;
  const candidates = courses.filter(
    (c) =>
      q.includes(normalizeText(c.tech)) ||
      q.includes(normalizeText(c.title.split(":")[0])),
  );
  const course =
    candidates.find((c) => c.domain !== "langages") || candidates[0];
  if (course)
    return `${intro}\n\n${course.title}\n${course.lesson}\n\n${choose("Exemple à lire (non exécuté ici) :", "Reading example (not executed here):")}\n\`\`\`\n${course.example}\n\`\`\`\n\n${choose("Outils associés", "Related tools")} : ${course.frameworks.join(", ") || choose("les bases, sans framework", "basics, without a framework")}.${en ? "\n\nThis course excerpt is currently available in French." : ""}`;
  if (/code|boucle|loop|for\s|range\(/.test(q))
    return `${intro}\n\n${choose("Pour expliquer ton code, donne le langage et le passage qui te pose problème. Dans cette démo, je reconnais notamment React, useState, Python, Django, HTML, CSS, JavaScript, Kotlin et Java.\n\nExemple Python : range(3) produit 0, 1, 2 ; la boucle affiche chaque valeur.", "To explain your code, include its language and the part you need help with. This demo recognizes React, useState, Python, Django, HTML, CSS, JavaScript, Kotlin and Java.\n\nPython example: range(3) produces 0, 1, 2; the loop prints each value.")}\n\n\`\`\`python\nfor i in range(3):\n    print(i)\n\`\`\``;
  return `${intro}\n\n${choose("Pour débuter dans le web :\n1. HTML pour structurer une page.\n2. CSS pour son apparence et son adaptation aux écrans.\n3. JavaScript pour les interactions.\n4. React ou Vue après ces bases.\n\nPose-moi une question précise ou colle un petit extrait de code. Les questions non couvertes par ces exemples demanderont l’agent Django connecté.", "To start web development:\n1. HTML for page structure.\n2. CSS for appearance and responsive layout.\n3. JavaScript for interaction.\n4. React or Vue after those foundations.\n\nAsk a specific question or paste a short code snippet. Questions outside these examples require the connected Django agent.")}`;
}
