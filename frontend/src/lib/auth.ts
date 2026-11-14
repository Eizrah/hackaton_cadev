import { authApi, type DjangoProfile } from "../api/auth";
import { apiError, mediaUrl } from "../api/client";
import { ApiError } from "./api";
import { migrateProfile, type Profile } from "../data/profile";

export function bannedLoginError(error: unknown): boolean {
  if (error instanceof ApiError) return /banni|banned/i.test(JSON.stringify(error.details));
  return /banni|banned/i.test(apiError(error, ""));
}

export function mapDjangoProfile(data: DjangoProfile): Profile {
  const skillDetails = (data.possessions || []).map(skill => ({
    id: skill.competence,
    name: skill.competence_nom,
    difficulty: skill.competence_difficulte,
    domain: skill.competence_domaine,
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
    bio: data.presentation || "",
    portfolio: data.lien_portfolio || "",
    photo: mediaUrl(data.photoprofil) || "",
    skillDetails,
  });
}

export async function loadOwnProfile(): Promise<Profile> {
  const { data } = await authApi.getProfil();
  const profile = mapDjangoProfile(data);
  const previous = localProfiles().find(entry => entry.publicId
    ? entry.publicId === profile.publicId
    : entry.email && entry.email === profile.email);
  if (!previous) return profile;

  const local = {
    id: previous.id,
    role: previous.role,
    experiences: previous.experiences,
    experience: previous.experience,
    documents: previous.documents,
  };
  if (data.competences_personnalisees !== null || profile.skillDetails.length || !previous.skillDetails.length) {
    return { ...profile, ...local };
  }

  // Récupère une seule fois les compétences de cet ancien compte depuis le même navigateur.
  try {
    const { data } = await authApi.updateProfil({ noms_competences: previous.skillDetails.map(skill => skill.name.trim()) });
    return { ...mapDjangoProfile(data.profil), ...local };
  } catch {
    // Conserve le brouillon pour permettre une sauvegarde depuis l'éditeur de profil.
    return { ...profile, ...local, skills: previous.skills, skillDetails: previous.skillDetails };
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
