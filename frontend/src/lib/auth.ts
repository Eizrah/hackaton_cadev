import { authApi, type DjangoProfile } from "../api/auth";
import { apiError, mediaUrl } from "../api/client";
import { ApiError } from "./api";
import { migrateProfile, type DeveloperSkill, type Experience, type Profile } from "../data/profile";
import { readAttachment } from "./attachments";

export function bannedLoginError(error: unknown): boolean {
  if (error instanceof ApiError) return /banni|banned/i.test(JSON.stringify(error.details));
  return /banni|banned/i.test(apiError(error, ""));
}

export function mapDjangoProfile(data: DjangoProfile): Profile {
  const skillDetails: DeveloperSkill[] = (data.possessions || []).map(skill => ({
    id: skill.competence,
    name: skill.competence_nom,
    difficulty: skill.competence_difficulte,
    domain: skill.competence_domaine,
    competenceId: skill.competence,
  }));
  for (const name of data.competences_personnalisees || []) {
    skillDetails.push({ id: `custom-${name}`, name, difficulty: "", domain: "" });
  }
  return migrateProfile({
    id: `dev-${data.identifiant || data.email}`,
    publicId: data.identifiant,
    email: data.email,
    firstName: data.prenom || "",
    lastName: data.nom,
    name: [data.prenom, data.nom].filter(Boolean).join(" ") || data.pseudo,
    pseudo: data.pseudo,
    level: { D: "Débutant", I: "Intermédiaire", A: "Avancé" }[data.niveau],
    country: data.pays || "",
    age: data.age ? String(data.age) : "",
    sexe: data.sexe as "M" | "F" | undefined,
    bio: data.presentation || "",
    portfolio: data.lien_portfolio || "",
    photo: mediaUrl(data.photoprofil) || "",
    skillDetails,
    nombre_publications: data.nombre_publications,
    experiences: (data.experiences ?? []).map(experience => ({
      id: `experience-${experience.id}`,
      serverId: experience.id,
      position: experience.nom_poste,
      description: experience.description,
      nbr_annee_exp: String(experience.nbr_annee_exp),
      diploma: experience.diplome ?? "",
      certificate: experience.certificat ?? "",
      diplomaUrl: mediaUrl(experience.fichier_diplome_url),
      certificateUrl: mediaUrl(experience.fichier_certificat_url),
    })),
  });
}

export function withLocalProfile(
  profile: Profile,
  local: Profile,
  writtenExperienceIds?: Array<number | undefined>,
): Profile {
  const legacyYears = new Map(
    local.experiences.map((row, i) => [writtenExperienceIds?.[i] ?? row.serverId, row.year]),
  );
  const drafts = writtenExperienceIds === undefined ? local.experiences.filter(row => row.serverId === undefined) : [];
  return {
    ...profile,
    id: local.id,
    role: local.role,
    experience: local.experience,
    documents: local.documents,
    experiences: [
      ...profile.experiences.map(row => {
        const year = legacyYears.get(row.serverId);
        // L'année civile d'un ancien profil reste visible sans devenir une durée.
        return year ? { ...row, year, nbr_annee_exp: row.nbr_annee_exp === "0" ? "" : row.nbr_annee_exp } : row;
      }),
      ...drafts,
    ],
  };
}

export async function profileForm(
  fields: Record<string, string | number | Blob | string[] | number[] | null>,
  experienceField: "experiences" | "experiences_a_enregistrer",
  experiences: Experience[],
): Promise<FormData> {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (key === "noms_competences") form.append(key, JSON.stringify(value));
    else if (Array.isArray(value)) value.forEach(entry => form.append(key, String(entry)));
    else if (value instanceof Blob) form.append(key, value, "profil.jpg");
    else form.append(key, String(value ?? ""));
  }

  for (const [index, row] of experiences.entries()) {
    const prefix = `${experienceField}[${index}]`;
    form.append(prefix + "nom_poste", row.position.trim());
    form.append(prefix + "description", row.description.trim());
    form.append(prefix + "nbr_annee_exp", row.nbr_annee_exp || "0");
    form.append(prefix + "diplome", row.diploma.trim());
    form.append(prefix + "certificat", row.certificate.trim());
    if (row.serverId !== undefined) form.append(prefix + "id", String(row.serverId));
    for (const [field, file] of [
      ["fichier_diplome", row.diplomaFile],
      ["fichier_certificat", row.certificateFile],
    ] as const) {
      if (file === null) form.append(prefix + field, "");
      if (!file) continue;
      const blob = await readAttachment(file.id);
      if (!blob) throw new Error("Fichier introuvable sur cet appareil.");
      form.append(prefix + field, blob, file.name);
    }
  }
  return form;
}

export async function loadOwnProfile(): Promise<Profile> {
  const { data } = await authApi.getProfil();
  const profile = mapDjangoProfile(data);
  const previous = localProfiles().find(entry => entry.publicId
    ? entry.publicId === profile.publicId
    : entry.email && entry.email === profile.email);
  if (!previous) return profile;

  if (data.competences_personnalisees !== null || profile.skillDetails.length || !previous.skillDetails.length) {
    return withLocalProfile(profile, previous);
  }

  // Récupère une seule fois les compétences de cet ancien compte depuis le même navigateur.
  try {
    const { data } = await authApi.updateProfil({ noms_competences: previous.skillDetails.map(skill => skill.name.trim()) });
    return withLocalProfile(mapDjangoProfile(data.profil), previous);
  } catch {
    // Conserve le brouillon pour permettre une sauvegarde depuis l'éditeur de profil.
    return { ...withLocalProfile(profile, previous), skills: previous.skills, skillDetails: previous.skillDetails };
  }
}

function localProfiles(): Profile[] {
  try {
    const current: unknown = JSON.parse(localStorage.getItem("devafrica:profile") || "null");
    const history: unknown = JSON.parse(localStorage.getItem("devafrica:people") || "[]");
    return [current, ...(Array.isArray(history) ? history.slice().reverse() : [])].filter(Boolean).map(migrateProfile);
  } catch {
    return [];
  }
}

export async function loginWithDjango(email: string, password: string, _remember: boolean): Promise<Profile> {
  const { data } = await authApi.connexion(email, password);
  localStorage.setItem("access_token", data.tokens.access);
  localStorage.setItem("refresh_token", data.tokens.refresh);
  try {
    return await loadOwnProfile();
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    throw error;
  }
}
