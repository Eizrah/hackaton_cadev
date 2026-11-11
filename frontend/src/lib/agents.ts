import { courses } from "../data/learning";
import { normalizeText } from "../data/models";
import { apiRequest } from "./api";
import type { Language } from "../i18n/context";
import { isLessonContext, localContextExplanation, localLessonExplanation, type LearningTutorContext } from "./learningTutorContext";
import { findLearningTerms } from "../data/learningGlossary";
export type TutorMessage = { role: "user" | "assistant"; content: string };

function mentionsTopic(question: string, topic: string) {
  const escaped = normalizeText(topic).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return !!escaped && new RegExp(`(?:^|[^a-z0-9+])${escaped}(?=$|[^a-z0-9+])`).test(question);
}

export async function askTutor(
  messages: TutorMessage[],
  language: Language,
  context?: LearningTutorContext,
): Promise<string> {
  if (import.meta.env.VITE_AGENT_MODE === "api") {
    const response = await apiRequest<{ answer: string }>(
      "agents/learning/chat/",
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
  const choose = (fr: string, english: string) => (en ? english : fr);
  const intro = choose(
    "Réponse de démonstration locale — aucun modèle IA connecté.",
    "Local demonstration reply — no AI model is connected.",
  );
  const backend = /\b(back[ -]?end|cote serveur|server[ -]side)\b/.test(q);
  const frontend = /\bfront[ -]?end\b/.test(q);
  if (/\bfull[ -]?stack\b/.test(q))
    return `${intro}\n\n${choose("Un développeur fullstack travaille sur les deux parties d’une application. Dans un forum, il crée par exemple le formulaire où tu écris un commentaire (frontend), puis la route qui reçoit, vérifie et enregistre ce commentaire (backend).\n\nLes deux parties communiquent souvent via une API, c’est-à-dire une interface qui définit les requêtes que le navigateur peut envoyer au serveur. Pour débuter, construis une petite page HTML, CSS et JavaScript, puis relie-la à une API Django ou Express.", "A full-stack developer works on both parts of an application. In a forum, they might build the comment form you type into (frontend) and the route that receives, validates and stores the comment (backend).\n\nThe two parts often communicate through an API, an interface that defines which requests the browser can send to the server. Start with a small HTML, CSS and JavaScript page, then connect it to a Django or Express API.")}`;
  if (backend && /debut|commenc|devenir|parcours|apprend|start|learn|roadmap/.test(q))
    return `${intro}\n\n${choose("1. Choisis un langage, par exemple Python. Apprends les variables, les conditions et les fonctions.\n2. Découvre HTTP, le protocole d’échange entre le navigateur et le serveur. GET sert à lire des données et POST à en transmettre.\n3. Apprends les bases de SQL, le langage des bases de données relationnelles. SQLite te permet de pratiquer sur un seul fichier.\n4. Dans le cours Django, crée une liste de tâches. Affiche les tâches, ajoute une nouvelle tâche via un formulaire et enregistre-la en base. Tu verras comment les routes, les vues et les modèles travaillent ensemble.", "1. Pick a language such as Python. Learn variables, conditionals and functions.\n2. Learn HTTP, the protocol browsers and servers use to exchange information. GET reads data and POST submits it.\n3. Learn the basics of SQL, the language of relational databases. SQLite lets you practice with a single file.\n4. In the Django course, build a task list. Display tasks, add one through a form and store it in a database. You’ll see how routes, views and models work together.")}`;
  if (frontend && backend)
    return `${intro}\n\n${choose("Le frontend est la partie visible dans le navigateur : HTML structure, CSS présente et JavaScript rend l’interface interactive. React aide à composer cette interface.\n\nLe backend traite les requêtes, contrôle les droits et accède aux données. Django est un framework Python pour cette partie. Les deux communiquent souvent avec une API JSON.", "The frontend is the visible part in the browser: HTML provides structure, CSS controls presentation, and JavaScript adds interaction. React helps compose the interface.\n\nThe backend handles requests, permissions and data. Django is a Python framework for that part. They often communicate through a JSON API.")}`;
  if (backend)
    return `${intro}\n\n${choose("Le backend est la partie d’une application qui s’exécute sur le serveur. Quand tu ouvres une offre, le navigateur demande ses détails. Le serveur cherche l’offre en base de données, vérifie les permissions si nécessaire et renvoie la réponse. Django et Express aident à écrire cette logique.", "The backend is the part of an application that runs on a server. When you open a job listing, your browser requests its details. The server looks up the listing in the database, checks permissions if needed and returns the response. Django and Express help you write that logic.")}`;
  if (/\b(html5?)\b/.test(q) && (/quest.ce|cest quoi|quoi|what is|define|definition|signifie/.test(q) || q === "html" || q === "html5"))
    return `${intro}\n\n${choose("HTML signifie HyperText Markup Language, ou langage de balisage hypertexte. Le navigateur lit des balises pour comprendre le rôle de chaque élément. <h1> indique le titre principal et <p> un paragraphe. La balise fermante commence par </ et marque la fin de l’élément. CSS permet ensuite de choisir sa présentation.", "HTML stands for HyperText Markup Language. The browser reads tags to understand each element’s role. <h1> identifies the main heading and <p> identifies a paragraph. A closing tag starts with </ and marks the element’s end. CSS then controls its appearance.")}\n\n\`\`\`html\n<h1>${choose("Mon premier site", "My first website")}</h1>\n<p>${choose("Bienvenue sur ma page.", "Welcome to my page.")}</p>\n\`\`\``;
  if (/\b(dev|developpeur|developpeuse|developer)\b/.test(q) && /quoi|quest.ce|role|what|metier/.test(q))
    return `${intro}\n\n${choose("Un développeur conçoit, écrit et teste des logiciels. Pour une messagerie, par exemple, il transforme le besoin « envoyer un message » en interface, en instructions pour l’enregistrer et en tests pour vérifier que le destinataire peut le lire. Le frontend s’occupe de l’interface, le backend du serveur et des données.", "A developer designs, writes and tests software. In a chat app, for example, they turn the need to send a message into an interface, instructions for storing it and tests to check that the recipient can read it. Frontend development deals with the interface, while backend development deals with the server and data.")}`;
  if (q.includes("usestate"))
    return `${intro}\n\n${choose("useState conserve un état local React. La fonction setCompteur met à jour cet état et React actualise l’affichage.", "useState stores local React state. setCount updates it and React updates the interface.")}\n\n\`\`\`tsx\nconst [compteur, setCompteur] = useState(0);\n<button onClick={() => setCompteur(compteur + 1)}>{compteur}</button>\n\`\`\``;
  if (findLearningTerms(question).length) return localLessonExplanation(question, undefined, en);
  const candidates = courses.filter(
    (c) =>
      mentionsTopic(q, c.tech) || mentionsTopic(q, c.title.split(":")[0]),
  );
  const course =
    candidates.find((c) => c.domain !== "langages") || candidates[0];
  if (course)
    return `${intro}\n\n${course.title}\n${course.lesson}\n\n${choose("Exemple à lire (non exécuté ici) :", "Reading example (not executed here):")}\n\`\`\`\n${course.example}\n\`\`\`\n\n${choose("Outils associés", "Related tools")} : ${course.frameworks.join(", ") || choose("les bases, sans framework", "basics, without a framework")}.${en ? "\n\nThis course excerpt is currently available in French." : ""}`;
  if (/code|boucle|loop|for\s|range\(/.test(q))
    return `${intro}\n\n${choose("Pour expliquer ton code, donne le langage et le passage qui te pose problème. Dans cette démo, je reconnais notamment React, useState, Python, Django, HTML, CSS, JavaScript, Kotlin et Java.\n\nExemple Python : range(3) produit 0, 1, 2 ; la boucle affiche chaque valeur.", "To explain your code, include its language and the part you need help with. This demo recognizes React, useState, Python, Django, HTML, CSS, JavaScript, Kotlin and Java.\n\nPython example: range(3) produces 0, 1, 2; the loop prints each value.")}\n\n\`\`\`python\nfor i in range(3):\n    print(i)\n\`\`\``;
  return `${intro}\n\n${choose("Pour débuter dans le web :\n1. HTML pour structurer une page.\n2. CSS pour son apparence et son adaptation aux écrans.\n3. JavaScript pour les interactions.\n4. React ou Vue après ces bases.\n\nPose-moi une question précise ou colle un petit extrait de code. Les questions non couvertes par ces exemples demanderont l’agent Django connecté.", "To start web development:\n1. HTML for page structure.\n2. CSS for appearance and responsive layout.\n3. JavaScript for interaction.\n4. React or Vue after those foundations.\n\nAsk a specific question or paste a short code snippet. Questions outside these examples require the connected Django agent.")}`;
}
