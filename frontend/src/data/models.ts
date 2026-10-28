export type Profile = {
  name: string;
  country: string;
  level: string;
  skills: string;
  bio: string;
  experience: string;
  role: string;
  portfolio: string;
  photo: string;
};
export const initialProfile: Profile = {
  name: "Juliana",
  country: "Madagascar",
  level: "Débutant",
  skills: "React, TypeScript, Figma, Blender",
  role: "Développeuse frontend · UI/UX",
  bio: "J’aime transformer des idées en interfaces utiles et partager ce que j’apprends avec la communauté.",
  experience:
    "Étudiante en informatique\nDesign UI/UX et développement d’interfaces React.",
  portfolio: "",
  photo: "",
};
export function migrateProfile(saved: unknown): Profile {
  if (!saved || typeof saved !== "object") return initialProfile;
  const profile = { ...initialProfile };
  for (const key of Object.keys(profile) as (keyof Profile)[]) {
    const value = (saved as Record<string, unknown>)[key];
    if (typeof value === "string") profile[key] = value;
  }
  return profile;
}
export type Post = {
  id: number;
  author: string;
  country: string;
  tag: string;
  title: string;
  text: string;
  comments: string[];
  publishedAt: string | null;
  collaboration: boolean;
  ratingTotal: number;
  ratingCount: number;
  myRating: number;
  starred: boolean;
};
export const initialPosts: Post[] = [
  {
    id: 1,
    author: "Amina Diallo",
    country: "Sénégal",
    tag: "Projet",
    title: "Un pont entre artisans et clients",
    text: "Je développe une application pour connecter les artisans locaux à leurs clients. Je cherche des personnes motivées en React et Django pour construire une première version ensemble.",
    comments: ["Très belle idée ! Vous cherchez aussi des designers ?"],
    publishedAt: "2026-10-26T09:20:00+03:00",
    collaboration: true,
    ratingTotal: 47,
    ratingCount: 10,
    myRating: 0,
    starred: false,
  },
  {
    id: 2,
    author: "Tiana Rakoto",
    country: "Madagascar",
    tag: "Question",
    title: "Votre première interface responsive ?",
    text: "Quelle est votre méthode pour rendre une interface responsive ? Je partage bientôt mon premier portfolio !",
    comments: [],
    publishedAt: "2026-10-27T14:10:00+03:00",
    collaboration: false,
    ratingTotal: 0,
    ratingCount: 0,
    myRating: 0,
    starred: false,
  },
  {
    id: 3,
    author: "Koffi Mensah",
    country: "Côte d’Ivoire",
    tag: "Découverte",
    title: "Une carte ouverte pour nos quartiers",
    text: "J’explore les données OpenStreetMap pour rendre les services de proximité plus faciles à trouver. Qui souhaite tester cette idée ou partager ses connaissances en cartographie ?",
    comments: [],
    publishedAt: "2026-10-28T08:30:00+03:00",
    collaboration: true,
    ratingTotal: 23,
    ratingCount: 5,
    myRating: 0,
    starred: false,
  },
];
// Les anciens « j’aime » ne sont pas convertis artificiellement en notes.
export function migratePosts(saved: unknown): Post[] {
  if (!Array.isArray(saved)) return initialPosts;
  return saved
    .filter((p) => p && typeof p.id === "number" && typeof p.text === "string")
    .map((p) => ({
      id: p.id,
      author: typeof p.author === "string" ? p.author : "Membre",
      country: typeof p.country === "string" ? p.country : "",
      tag: typeof p.tag === "string" ? p.tag : "Projet",
      title: typeof p.title === "string" ? p.title : "",
      text: p.text,
      comments: Array.isArray(p.comments)
        ? p.comments.filter((c: unknown) => typeof c === "string")
        : [],
      publishedAt: typeof p.publishedAt === "string" ? p.publishedAt : null,
      collaboration: p.collaboration === true,
      ratingTotal: Number.isFinite(p.ratingTotal)
        ? Math.max(0, p.ratingTotal)
        : 0,
      ratingCount: Number.isInteger(p.ratingCount)
        ? Math.max(0, p.ratingCount)
        : 0,
      myRating:
        Number.isInteger(p.myRating) && p.myRating >= 1 && p.myRating <= 5
          ? p.myRating
          : 0,
      starred: p.starred === true,
    }));
}
export type Group = {
  id: number;
  name: string;
  description: string;
  joined: boolean;
};
export const initialGroups: Group[] = [
  {
    id: 1,
    name: "React Africa",
    description: "Composants, entraide et interfaces qui font la différence.",
    joined: false,
  },
  {
    id: 2,
    name: "Python & Django",
    description: "Du premier script à une API, apprenons ensemble.",
    joined: true,
  },
];
export type ChatMessage = {
  id: number;
  conversation: string;
  text: string;
  file?: string;
  sentAt?: string;
};
export type Job = {
  id: number;
  title: string;
  company: string;
  country: string;
  contract: string;
  mode: string;
  skills: string;
};
export const initialJobs: Job[] = [
  {
    id: 1,
    title: "Développeur frontend React",
    company: "Baobab Studio",
    country: "Sénégal",
    contract: "CDI",
    mode: "Remote",
    skills: "React · TypeScript",
  },
  {
    id: 2,
    title: "Stage développeur Django",
    company: "MadaTech",
    country: "Madagascar",
    contract: "Stage",
    mode: "Hybride",
    skills: "Python · Django",
  },
  {
    id: 3,
    title: "Designer UI / UX",
    company: "Ubuntu Digital",
    country: "Kenya",
    contract: "Freelance",
    mode: "Remote",
    skills: "Figma · Design system",
  },
];
export function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .trim();
}
