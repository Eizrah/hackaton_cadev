import { initialProfile, migrateProfile, type Profile } from "./profile";
import { useLocalData } from "../lib/storage";
const member = (id:string,name:string,country:string,skills:string,role:string): Profile => migrateProfile({...initialProfile,id,name,firstName:name.split(" ")[0],lastName:name.split(" ").slice(1).join(" "),country,skills,skillDetails:undefined,role,bio:"Un profil de démonstration de la communauté DevAfrica.",experience:"",experiences:[],level:"Intermédiaire"});
export const initialPeople = [member("dev-amina","Amina Diallo","Sénégal","React, Django, TypeScript","Développeuse web · projets collaboratifs"),member("dev-tiana","Tiana Rakoto","Madagascar","Python, Django, Figma","Développeur backend · Django"),member("dev-koffi","Koffi Mensah","Côte d’Ivoire","JavaScript, Figma, SQL","Développeur web · cartographie")];
export function usePeople() { return useLocalData<Profile[]>("people",initialPeople,saved=>Array.isArray(saved)?saved.map(migrateProfile):initialPeople); }
export function findPerson(people: Profile[], idOrName: string, current: Profile): Profile | undefined { return [current,...people].find(p=>p.id===idOrName || p.name===idOrName); }
