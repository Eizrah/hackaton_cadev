import { courses } from "./learning";
// Les suggestions correspondent aux fiches visibles, pas à tous les outils
// mentionnés à l'intérieur des leçons. Les autres noms restent saisissables.
const cardNames: Record<string, string> = {
  "html-css-web": "HTML5 & CSS3",
  "node-web": "Node.js & Express",
  "swift-mobile": "Swift & SwiftUI",
  "flutter-mobile": "Flutter & Dart",
};
export const learningSkills = courses.map(course => ({
  courseId: course.id,
  name: cardNames[course.id] || course.tech,
}));
export const skillCatalog = Array.from(new Set(learningSkills.map(skill => skill.name)))
  .sort((a,b) => a.localeCompare(b,"fr"));
export const skillKey = (value: any): string => {
  if (typeof value !== "string") {
    // Si c'est un objet avec une propriété name, utiliser celle-ci
    if (value && typeof value === "object" && "name" in value) {
      return skillKey(value.name);
    }
    // Sinon, convertir en string ou retourner vide
    return value ? String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";
  }
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};
export function skillDomain(name: string) {
  const course = courses.find(c => skillKey(cardNames[c.id] || c.tech) === skillKey(name));
  return course?.domain === "mobile" ? "Mobile" : course?.domain === "langages" ? "Langages de programmation" : course ? "Web" : "";
}
