export { initialProfile, migrateProfile } from "./profile";
export type {
  Profile,
  PersonalInformation,
  Experience,
  DeveloperSkill,
} from "./profile";
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
  starCount: number;
  saved: boolean;
  owned?: boolean;
  moderation?: "pending" | "approved" | "rejected";
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
    starCount: 10,
    saved: false,
    moderation: "approved",
    starred: false,
  },
  {
    id: 2,
    author: "Tiana Rakoto",
    country: "Madagascar",
    tag: "Question & découverte",
    title: "Votre première interface responsive ?",
    text: "Quelle est votre méthode pour rendre une interface responsive ? Je partage bientôt mon premier portfolio !",
    comments: [],
    publishedAt: "2026-10-27T14:10:00+03:00",
    collaboration: false,
    starCount: 0,
    saved: false,
    moderation: "approved",
    starred: false,
  },
  {
    id: 3,
    author: "Koffi Mensah",
    country: "Côte d’Ivoire",
    tag: "Question & découverte",
    title: "Une carte ouverte pour nos quartiers",
    text: "J’explore les données OpenStreetMap pour rendre les services de proximité plus faciles à trouver. Qui souhaite tester cette idée ou partager ses connaissances en cartographie ?",
    comments: [],
    publishedAt: "2026-10-28T08:30:00+03:00",
    collaboration: true,
    starCount: 5,
    saved: false,
    moderation: "approved",
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
      tag: p.tag === "Projet" ? "Projet" : "Question & découverte",
      title: typeof p.title === "string" ? p.title : "",
      text: p.text,
      comments: Array.isArray(p.comments)
        ? p.comments.filter((c: unknown) => typeof c === "string")
        : [],
      publishedAt: typeof p.publishedAt === "string" ? p.publishedAt : null,
      collaboration: p.collaboration === true,
      starCount: Number.isFinite(p.starCount)
        ? Math.max(0, Math.floor(p.starCount))
        : Number.isFinite(p.ratingCount)
          ? Math.max(0, Math.floor(p.ratingCount))
          : Number.isFinite(p.likes)
            ? Math.max(0, Math.floor(p.likes))
            : 0,
      starred:
        (p.starred === true && (p.tag !== "Question" || "starCount" in p)) ||
        (p.myRating ?? 0) > 0 ||
        p.liked === true,
      saved:
        p.saved === true ||
        (p.tag === "Question" && p.starred === true && !("starCount" in p)),
      owned: p.owned === true,
      moderation: ["pending", "approved", "rejected"].includes(p.moderation)
        ? p.moderation
        : "approved",
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
  author?: string;
  mine?: boolean;
  id: number;
  conversation: string;
  text: string;
  file?: string;
  sentAt?: string;
};
export type Job = {
  moderation?: "pending" | "approved" | "rejected";
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
