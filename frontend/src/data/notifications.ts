import { useLocalData } from "../lib/storage";
import { normalizeText, type Job, type Profile } from "./models";
export type Notification = { id:string; recipientId:string; title:string; text:string; textEn?:string; target:string; createdAt:string; read:boolean; kind:"job"|"application"|"decision"|"moderation"|"group" };
export function useNotifications() { return useLocalData<Notification[]>("notifications",[], saved=>Array.isArray(saved)?saved.filter(n=>n && typeof n.id==="string" && typeof n.recipientId==="string"):[]); }
export function notification(value: Omit<Notification,"read"|"createdAt">): Notification {return {...value,read:false,createdAt:new Date().toISOString()};}
export function matchesJob(job: Job, profile: Profile) {
 const skills = Array.from(new Set([...profile.skillDetails.map(s=>s.name),...profile.skills.split(/[,·]/)])).map(normalizeText).filter(Boolean);
 const text = normalizeText(`${job.title} ${job.skills}`);
 return skills.some(skill=>{const start=text.indexOf(skill);if(start<0)return false;const before=text[start-1],after=text[start+skill.length];return (!before || !/[a-z0-9]/.test(before)) && (!after || !/[a-z0-9]/.test(after));});
}
