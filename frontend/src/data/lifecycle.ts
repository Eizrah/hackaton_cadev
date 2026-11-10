import type { Group, Post } from "./models";
import { groupAdmin } from "./chat";
import { notification } from "./notifications";
export function blockedPostNotice(post:Post,recipientId:string|undefined) {
 if(!recipientId||post.moderation==="rejected")return;
 return notification({id:`post-blocked:${post.id}:${Date.now()}`,recipientId,title:"Publication bloquée",text:`La modération a bloqué ta publication : ${post.title||post.text.slice(0,70)}`,textEn:`Moderation blocked your post: ${post.title||post.text.slice(0,70)}`,target:`communaute/publication/${post.id}`,kind:"moderation"});
}
export function deleteGroupResult(group:Group,actorId:string,deletedAt=new Date().toISOString()) {
 if(!groupAdmin(group,actorId))return;
 const ids=new Set<string>();
 const notices=(group.members||[]).filter(member=>{if(!member.id||ids.has(member.id))return false;ids.add(member.id);return true;}).map(member=>notification({id:`group-deleted:${group.id}:${member.id}`,recipientId:member.id,title:"Groupe supprimé",text:`Le groupe ${group.name} auquel tu participais a été supprimé par son administrateur.`,textEn:`The group ${group.name} you belonged to was deleted by its administrator.`,target:"messages/groupes",kind:"group"}));
 return {group:{...group,deletedAt,joined:false},notifications:notices};
}
