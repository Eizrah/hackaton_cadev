import type { Group } from "./models";
export type ChatPreference = { muted?:boolean; blocked?:boolean; hiddenMessages?:(number|string)[]; hiddenLinks?:string[] };
export function groupAdmin(group:Group|undefined,profileId:string) { return !!group && !group.deletedAt && group.adminId === profileId; }
export function chatKey(value:string,groups:Group[]) { if(value.startsWith("Groupe : ")){const group=groups.find(g=>g.name===value.slice(9));if(group)return `group:${group.id}`;}return value; }
