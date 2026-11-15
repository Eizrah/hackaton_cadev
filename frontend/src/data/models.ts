import { attachmentsFrom, type StoredAttachment } from "../lib/attachments";
export { initialProfile, migrateProfile } from "./profile";
export type {
  Profile,
  PersonalInformation,
  Experience,
  DeveloperSkill,
} from "./profile";
export type PostComment = {
  id: string; authorId: string; author: string; country: string; photo?: string;
  text: string; createdAt: string | null; parentId?: string;
};
export type Post = {
  attachments?:StoredAttachment[]; links?:string[]; savedBy?:string[];
  authorId?: string;
  authorPhoto?: string;
  id: number;
  author: string;
  country: string;
  tag: string;
  title: string;
  text: string;
  comments: PostComment[];
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
    comments: [{ id: "comment-demo-1", authorId: "dev-tiana", author: "Tiana Rakoto", country: "Madagascar", text: "Très belle idée ! Vous cherchez aussi des designers ?", createdAt: "2026-10-26T10:10:00+03:00" }],
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
      authorId: typeof p.authorId === "string" ? p.authorId : undefined,
      author: typeof p.author === "string" ? p.author : "Membre",
      country: typeof p.country === "string" ? p.country : "",
      tag: typeof p.tag === "string" ? p.tag : "Publication",
      title: typeof p.title === "string" ? p.title : "",
      text: p.text,
      attachments: attachmentsFrom(p.attachments),
      links: Array.isArray(p.links) ? p.links.filter((url:unknown)=>typeof url === "string" && /^https?:\/\//i.test(url)) : [],
      savedBy: Array.isArray(p.savedBy) ? p.savedBy.filter((id:unknown)=>typeof id === "string") : p.saved ? ["dev-juliana"] : [],
      comments: Array.isArray(p.comments)
        ? p.comments.flatMap((c: unknown, index: number): PostComment[] => {
            if (typeof c === "string") return [{id: `legacy-${p.id}-${index}`, authorId: "", author: "Membre", country: "", text: c, createdAt: null}];
            if (!c || typeof c !== "object" || !("text" in c) || typeof c.text !== "string") return [];
            const row = c as Record<string, unknown>;
            const str = (key: string) => typeof row[key] === "string" ? row[key] as string : "";
            return [{id: str("id") || `legacy-${p.id}-${index}`, authorId: str("authorId"), author: str("author") || "Membre", country: str("country"), photo: str("photo"), text: c.text, createdAt: str("createdAt") || null, parentId: str("parentId") || undefined}];
          })
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
export type GroupMember = {id:string;name:string;country:string;photo?:string};
export type Group = {
  adminId?:string; members?:GroupMember[]; photo?:StoredAttachment; deletedAt?:string;
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
  authorId?:string; attachments?:StoredAttachment[];
  author?: string;
  mine?: boolean;
  id: number;
  conversation: string;
  text: string;
  file?: string;
  sentAt?: string;
};
export type Job = {
  ownerId?: string; ownerName?: string; description?: string; contactEmail?: string; createdAt?: string; duration?:number; durationUnit?:"days"|"weeks"|"months";

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
    id: 1, ownerId: "dev-amina", ownerName: "Amina Diallo", moderation: "approved",
    description: "Rejoins notre équipe pour concevoir des interfaces accessibles et responsive avec React et TypeScript. Tu travailleras avec notre designer et les développeurs backend : intégration des maquettes, connexion aux API et amélioration des parcours. Un portfolio ou quelques projets personnels sont les bienvenus.",
    createdAt: "2026-11-01T09:00:00Z",
    title: "Développeur frontend React",
    company: "Baobab Studio",
    country: "Sénégal",
    contract: "CDI",
    mode: "Remote",
    skills: "React · TypeScript",
  },
  {
    id: 2, ownerId: "dev-tiana", ownerName: "Tiana Rakoto", moderation: "approved",
    description: "Un stage accompagné pour construire une API Django. Tu participeras à la création des modèles, des vues et des tests, avec des revues de code régulières. Des bases en Python et une première réalisation avec Django suffisent pour candidater.",
    createdAt: "2026-11-02T09:00:00Z",
    title: "Stage développeur Django",
    company: "MadaTech",
    country: "Madagascar",
    contract: "Stage",
    mode: "Hybride",
    skills: "Python · Django",
  },
  {
    id: 3, ownerId: "dev-koffi", ownerName: "Koffi Mensah", moderation: "approved",
    description: "Imagine les parcours d’une application utile à la communauté. Missions : recherche utilisateur, wireframes, maquettes Figma et documentation du design system. Présente-nous une réalisation et explique tes choix.",
    createdAt: "2026-11-03T09:00:00Z",
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

export function migrateJobs(saved: unknown): Job[] {
 if (!Array.isArray(saved)) return initialJobs;
 return saved.filter(j => j && typeof j.id === "number" && typeof j.title === "string").map(j => ({...j, company: j.company || "Organisation", country: j.country || "", skills: j.skills || "", contract: j.contract || "CDD", mode: j.mode || "Remote", moderation: j.moderation || "approved", description: typeof j.description === "string" ? j.description : "Le recruteur n’a pas encore renseigné de description détaillée.", ownerId: j.ownerId || initialJobs.find(seed => seed.id === j.id)?.ownerId, ownerName: j.ownerName || initialJobs.find(seed => seed.id === j.id)?.ownerName}));
}

export function isSavedBy(post:Post,profileId:string) { return post.savedBy ? post.savedBy.includes(profileId) : !!post.saved && profileId === "dev-juliana"; }
export function migrateGroups(saved:unknown):Group[] {
 const rows=Array.isArray(saved)?saved:initialGroups;
 return rows.filter(g=>g&&typeof g.id==="number"&&typeof g.name==="string").map(g=>({...g,adminId:g.adminId || (g.id===2?"dev-tiana":g.id===1?"dev-amina":""),members:Array.isArray(g.members)?g.members:[{id:"dev-amina",name:"Amina Diallo",country:"Sénégal"},{id:"dev-tiana",name:"Tiana Rakoto",country:"Madagascar"},...(g.joined?[{id:"dev-juliana",name:"Juliana",country:"Madagascar"}]:[])],photo:attachmentsFrom([g.photo])[0]}));
}
export function orderedComments(comments:PostComment[]):{comment:PostComment;depth:number}[] {
 const ids=new Set(comments.map(c=>c.id)),seen=new Set<string>(),result:{comment:PostComment;depth:number}[]=[];
 const visit=(comment:PostComment,depth:number)=>{if(seen.has(comment.id))return;seen.add(comment.id);result.push({comment,depth});comments.filter(c=>c.parentId===comment.id).forEach(c=>visit(c,depth+1));};
 comments.filter(c=>!c.parentId||!ids.has(c.parentId)).forEach(c=>visit(c,0));
 comments.forEach(c=>visit(c,0));return result;
}
