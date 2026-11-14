import { attachmentsFrom, type StoredAttachment } from "../lib/attachments";
import { createLocalId } from "../lib/format";
export type CredentialAttachment = { id:string; kind:"diploma"|"certificate"; file:StoredAttachment };
export type DeveloperLevel = "Débutant" | "Intermédiaire" | "Avancé";
export type Experience = {
  id: string;
  position: string;
  description: string;
  nbr_annee_exp: string;   // nombre d'années d'expérience (0–50)
  diploma: string;
  certificate: string;
};
export type DeveloperSkill = {
  id: string;
  name: string;
  difficulty: string;
  domain: string;
  competenceId?: string;  // UUID backend
};
export type PersonalInformation = {
  firstName: string;
  lastName: string;
  age: string;
  level: string;
  country: string;
  pseudo: string;
};
export type Profile = PersonalInformation & {
  id: string;
  name: string;
  email: string;
  skills: string;
  skillDetails: DeveloperSkill[];
  experience: string;
  experiences: Experience[];
  bio: string;
  role: string;
  portfolio: string;
  photo: string;
  documents: CredentialAttachment[];
  accountStatus?: "active" | "banned";
};
export const currentYear = new Date().getFullYear();
export const skillDomains = [
  "Web",
  "Desktop",
  "Mobile",
  "Design",
  "Langages de programmation",
];
export const skillDifficulties = ["Débutant", "Intermédiaire", "Avancé"];
export const emptyPersonal: PersonalInformation = {
  firstName: "",
  lastName: "",
  age: "",
  level: "",
  country: "",
  pseudo: "",
};
export const initialProfile: Profile = {
  id: "dev-juliana",
  name: "Juliana",
  firstName: "Juliana",
  lastName: "",
  age: "",
  email: "",
  pseudo: "",
  level: "Débutant",
  country: "Madagascar",
  skills: "React, TypeScript, Figma, Blender",
  skillDetails: [],
  experience:
    "Étudiante en informatique\nDesign UI/UX et développement d'interfaces React.",
  experiences: [],
  bio: "J'aime transformer des idées en interfaces utiles et partager ce que j'apprends avec la communauté.",
  role: "Développeuse frontend · UI/UX",
  portfolio: "",
  photo: "",
  documents: [],
};
export function newExperience(): Experience {
  return {
    id: `exp-${createLocalId()}`,
    position: "",
    description: "",
    nbr_annee_exp: "",
    diploma: "",
    certificate: "",
  };
}
export function newSkill(name = "", competenceId?: string): DeveloperSkill {
  return {
    id: competenceId ?? `skill-${createLocalId()}`,
    name,
    difficulty: "",
    domain: "",
    competenceId,
  };
}
function strings(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}
export function migrateProfile(saved: unknown): Profile {
  const value = strings(saved);
  if (!Object.keys(value).length) return initialProfile;
  const text = (key: string, fallback = "") =>
    typeof value[key] === "string" ? (value[key] as string) : fallback;
  const name = text("name", initialProfile.name),
    firstName = text("firstName", text("first_name", name.split(" ")[0])),
    lastName = text("lastName", text("last_name", name.split(" ").slice(1).join(" ")));
  const experiences: Experience[] = Array.isArray(value.experiences)
    ? value.experiences.map((entry, index) => {
        const row = strings(entry);
        const get = (key: string) =>
          typeof row[key] === "string" ? (row[key] as string) : "";
        return {
          id: get("id") || `legacy-exp-${index}`,
          position: get("position"),
          description: get("description"),
          // supporte les anciens profils locaux (year) et l'API backend (nbr_annee_exp)
          nbr_annee_exp: get("nbr_annee_exp") || get("year"),
          diploma: get("diploma"),
          certificate: get("certificate"),
        };
      })
    : [];
  const skillDetails: DeveloperSkill[] = Array.isArray(value.skillDetails)
    ? value.skillDetails.map((entry, index) => {
        const row = strings(entry);
        const get = (key: string) =>
          typeof row[key] === "string" ? (row[key] as string) : "";
        return {
          id: get("id") || `legacy-skill-${index}`,
          name: get("name"),
          difficulty: get("difficulty") === "Facile" ? "Débutant" : get("difficulty") === "Avancée" ? "Avancé" : get("difficulty"),
          domain: get("domain"),
          ...(get("competenceId") ? { competenceId: get("competenceId") } : {}),
        };
      })
    : text("skills")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name, index) => ({
          id: `legacy-skill-${index}`,
          name,
          difficulty: "",
          domain: "",
        }));
  return {
    id: (typeof value.id === "number" ? String(value.id) : text("id")) || (text("email") || text("pseudo") ? `dev-${text("email") || text("pseudo")}` : "dev-juliana"),
    name: text("name") || `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    age: text("age"),
    email: text("email"),
    pseudo: text("pseudo", text("username")),
    level: ["Intermédiaire","intermediate"].includes(text("level")) ? "Intermédiaire" : ["Senior", "Avancé", "advanced"].includes(text("level")) ? "Avancé" : "Débutant",
    country: text("country", initialProfile.country),
    skills: skillDetails.length
      ? skillDetails.map((s) => s.name).join(", ")
      : text("skills"),
    skillDetails,
    experience: text("experience"),
    experiences,
    bio: text("bio"),
    role: text("role"),
    portfolio: text("portfolio", text("lien_portfolio")),
    photo: text("photo"),
    documents: Array.isArray(value.documents) ? value.documents.flatMap(row => {
      if (!row || !["diploma", "certificate"].includes(row.kind)) return [];
      const file = attachmentsFrom([row.file])[0];
      return file ? [{id: typeof row.id === "string" ? row.id : file.id, kind: row.kind, file}] : [];
    }) : [],
    accountStatus: value.accountStatus === "banned" || value.status === "banned" || value.banned === true ? "banned" : "active",
  };
}
export function completeProfile(
  personal: PersonalInformation,
  experiences: Experience[],
  skillDetails: DeveloperSkill[],
  email: string,
  documents: CredentialAttachment[] = [],
): Profile {
  return {
    ...initialProfile,
    ...personal,
    documents,
    id: `dev-${createLocalId()}`,
    name: `${personal.firstName.trim()} ${personal.lastName.trim()}`.trim(),
    firstName: personal.firstName.trim(),
    lastName: personal.lastName.trim(),
    pseudo: personal.pseudo.trim(),
    email: email.trim(),
    level: personal.level as DeveloperLevel,
    experiences,
    experience: "",
    skillDetails,
    skills: skillDetails.map((s) => s.name.trim()).join(", "),
    bio: "",
    role: `Développeur ${personal.level}`,
    portfolio: "",
    photo: "",
  };
}
export function validPseudo(value: string) {
  return /^[A-Za-z\d]{3,30}$/.test(value);
}
export function experienceError(rows: Experience[]): string | null {
  for (const row of rows) {
    if (!row.position.trim() || !row.description.trim())
      return "Renseigne le poste et la description de chaque expérience, ou retire l'entrée vide.";
    const n = Number(row.nbr_annee_exp);
    if (row.nbr_annee_exp === "" || isNaN(n) || n < 0 || n > 50)
      return "Saisis un nombre d'années d'expérience valide (0 à 50).";
  }
  return null;
}
export function skillError(rows: DeveloperSkill[]): string | null {
  const names = new Set<string>();
  for (const row of rows) {
    if (!row.name.trim()) return "Renseigne le nom de chaque compétence, ou retire l'entrée vide.";
    const name = row.name.trim().toLocaleLowerCase();
    if (names.has(name)) return "Cette compétence apparaît plusieurs fois.";
    names.add(name);
  }
  return null;
}
