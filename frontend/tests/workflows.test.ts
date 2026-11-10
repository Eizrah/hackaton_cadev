import assert from "node:assert/strict";
import test from "node:test";
import { courses } from "../src/data/learning";
import { learningSkills, skillCatalog } from "../src/data/skillCatalog";
import { confirmPasswordReset, expiredResetError, parseResetLink, requestPasswordReset, resetPasswordProblem, verifyRecoveryCode } from "../src/lib/passwordRecovery";
import { askTutor } from "../src/lib/agents";
import { completeProfile, migrateProfile, skillError } from "../src/data/profile";
import { isSavedBy, migrateGroups, migratePosts, orderedComments, type PostComment } from "../src/data/models";
import { chatKey, groupAdmin } from "../src/data/chat";
import { blockedPostNotice, deleteGroupResult } from "../src/data/lifecycle";
import { attachmentsFrom } from "../src/lib/attachments";
import { ApiError } from "../src/lib/api";
import { bannedLoginError, loginWithDjango } from "../src/lib/auth";
import { inlineEnglish } from "../src/i18n/inline";
import { catalogEnglish } from "../src/i18n/catalog";

const file = { id: "file-test", name: "certificat.pdf", type: "application/pdf", size: 800 };
const profile = completeProfile(
  { firstName: "Test", lastName: "Dev", age: "25", level: "Intermédiaire", country: "Madagascar", pseudo: "TestDev" },
  [], [{ id: "react", name: "React", difficulty: "", domain: "" }],
  "test@example.test", [{ id: "doc", kind: "certificate", file }],
);

test("Les réponses suivent leur parent, même avec des données anciennes incomplètes", () => {
  const comment = (id: string, parentId?: string): PostComment => ({ id, parentId, authorId: "test", author: "Test", country: "Madagascar", text: id, createdAt: null });
  const thread = orderedComments([comment("A"), comment("B"), comment("replyB", "B"), comment("replyA", "A"), comment("deep", "replyA")]);
  assert.deepEqual(thread.map(x => x.comment.id), ["A", "replyA", "deep", "B", "replyB"]);
  assert.deepEqual(thread.map(x => x.depth), [0, 1, 2, 0, 1]);
  assert.equal(orderedComments([comment("cycle1", "cycle2"), comment("cycle2", "cycle1"), comment("orphan", "absent")]).length, 3);
});

test("Le profil conserve ses documents et accepte les compétences sans niveau ni domaine", () => {
  assert.equal(attachmentsFrom([file, null, {}, { ...file, size: -1 }]).length, 1);
  assert.equal(profile.documents[0].file.id, file.id);
  assert.equal(skillError(profile.skillDetails), null);
  assert.equal(migrateProfile(profile).documents[0].kind, "certificate");
  assert.equal(JSON.stringify(profile).includes("password"), false);
});

test("Les identifiants et niveaux de profil venant de Django sont normalisés", () => {
  const migrated = migrateProfile({ ...profile, id: 17, level: "advanced", first_name: "Test", last_name: "Dev" });
  assert.equal(migrated.id, "17");
  assert.equal(migrated.level, "Avancé");
  assert.equal(migrateProfile({ ...profile, level: "intermediate" }).level, "Intermédiaire");
});

test("La recherche correspond aux fiches visibles et exclut les outils annexes", () => {
  assert.equal(learningSkills.length,courses.length);
  for (const course of courses) {
    const skill=learningSkills.find(skill=>skill.courseId===course.id);
    assert.ok(skill&&skillCatalog.includes(skill.name),course.id);
  }
  for (const name of ["Java", "React", "Django", "Node.js & Express", "Spring Boot", "SQL", "HTML5 & CSS3", "Flutter & Dart"]) assert.ok(skillCatalog.includes(name), name);
  for (const name of ["Artisan","Android SDK","Live Server","Visual Studio Code","ORM","Maven","JavaFX","SQLite"]) assert.equal(skillCatalog.includes(name),false,name);
});

test("La récupération lit un lien complet et refuse un lien incomplet",()=>{
  assert.deepEqual(parseResetLink("reset?uid=NDI&token=test-token"),{uid:"NDI",token:"test-token"});
  assert.deepEqual(parseResetLink("reset?uidb64=NDI&token=test-token"),{uid:"NDI",token:"test-token"});
  for(const route of ["forgot","reset","reset?uid=NDI","reset?token=abc","reset?uid=%20&token=abc"])assert.equal(parseResetLink(route),undefined);
  assert.equal(parseResetLink(`reset?uid=NDI&token=${"x".repeat(2049)}`),undefined);
});

test("La confirmation du mot de passe et le refus de lien expiré sont contrôlés",()=>{
  assert.equal(resetPasswordProblem("court","court"),"short");
  assert.equal(resetPasswordProblem("fixture-test-one","fixture-test-two"),"mismatch");
  assert.equal(resetPasswordProblem("x".repeat(129),"x".repeat(129)),"long");
  assert.equal(resetPasswordProblem("fixture-test-one","fixture-test-one"),null);
  assert.equal(expiredResetError(new ApiError(410,{})),true);
  assert.equal(expiredResetError(new ApiError(400,{code:"expired_token"})),true);
  assert.equal(expiredResetError(new ApiError(400,{code:"weak_password"})),false);
});

test("Le point d’interrogation explique la leçon et le robot garde le contexte de code",async()=>{
  const base={courseId:"html-css-web" as const,courseTitle:"HTML5 & CSS3",level:"debutant" as const,lessonTitle:"Le navigateur",explanation:"Le navigateur construit le DOM à partir du document.",returnPath:"apprentissage/cours/html-css-web/debutant/lecon/test"};
  const lesson=await askTutor([{role:"user",content:"Que signifie DOM ?"}],"fr",{...base,kind:"lesson"});
  assert.match(lesson,/Document Object Model/);
  assert.match(lesson,/Passage de la leçon en cours/);
  assert.doesNotMatch(lesson,/Fichier :/);
  const code=await askTutor([{role:"user",content:"Que signifie h1 ?"}],"fr",{...base,file:"index.html",code:"<h1>Bonjour</h1>"});
  assert.match(code,/Fichier : index.html/);
  assert.match(code,/heading/);
});

test("Les trois étapes de récupération utilisent CSRF et échangent le code contre un jeton",async()=>{
  const originalFetch=globalThis.fetch, originalDocument=Object.getOwnPropertyDescriptor(globalThis,"document");
  const calls:{url:string;options?:RequestInit}[]=[];
  Object.defineProperty(globalThis,"document",{configurable:true,value:{cookie:"csrftoken=test-csrf"}});
  globalThis.fetch=async(input,options)=>{const url=String(input);calls.push({url,options});return url.endsWith("/verify/")?new Response(JSON.stringify({reset_token:"test-reset-proof"}),{status:200,headers:{"content-type":"application/json"}}):new Response(null,{status:204});};
  try{
    await requestPasswordReset("test@example.test");
    const proof=await verifyRecoveryCode("test@example.test","test-temporary-password","temporary_password");
    await confirmPasswordReset(proof,"fixture-password","fixture-password");
    await confirmPasswordReset({uid:"NDI",token:"test-link-proof"},"fixture-password","fixture-password");
    assert.equal(calls.length,8);
    assert.ok(calls.filter((_,index)=>index%2===0).every(call=>call.url.endsWith("/auth/csrf/")));
    const verifyBody=JSON.parse(String(calls[3].options?.body));
    assert.equal(verifyBody.method,"temporary_password");
    const confirmBody=JSON.parse(String(calls[5].options?.body));
    assert.equal(confirmBody.reset_token,"test-reset-proof");
    assert.equal(confirmBody.code,undefined);
    assert.deepEqual(JSON.parse(String(calls[7].options?.body)),{uid:"NDI",token:"test-link-proof",new_password1:"fixture-password",new_password2:"fixture-password"});
    assert.equal(new Headers(calls[5].options?.headers).get("X-CSRFToken"),"test-csrf");
  }finally{globalThis.fetch=originalFetch;if(originalDocument)Object.defineProperty(globalThis,"document",originalDocument);else Reflect.deleteProperty(globalThis,"document");}
});

test("Seul l’administrateur peut supprimer un groupe, et chaque membre reçoit une notification", () => {
  const [group] = migrateGroups([{ id: 2, name: "Python & Django", description: "Test", joined: true }]);
  assert.ok(group.members?.some(m => m.id === "dev-juliana"));
  assert.equal(chatKey("Groupe : Python & Django", [group]), "group:2");
  assert.equal(groupAdmin(group, "dev-juliana"), false);
  assert.equal(deleteGroupResult(group, "dev-juliana"), undefined);
  const result = deleteGroupResult(group, "dev-tiana", "2026-11-10T12:00:00Z")!;
  assert.equal(result.group.deletedAt, "2026-11-10T12:00:00Z");
  assert.equal(result.notifications.length, group.members?.length);
  assert.ok(result.notifications.every(n => n.kind === "group" && n.textEn));
  assert.equal(groupAdmin(result.group, "dev-tiana"), false);
});

test("Les enregistrements sont personnels et le blocage d’une publication crée sa notification", () => {
  const [post] = migratePosts([{ id: 17, author: "Test", authorId: profile.id, text: "Publication à modérer", moderation: "pending", comments: [], attachments: [file], links: ["https://example.test", "javascript:alert(1)"], savedBy: [profile.id] }]);
  assert.equal(post.attachments?.length, 1);
  assert.equal(post.links?.length, 1);
  assert.equal(isSavedBy(post, profile.id), true);
  assert.equal(isSavedBy(post, "autre-membre"), false);
  const notice = blockedPostNotice(post, profile.id)!;
  assert.equal(notice.kind, "moderation");
  assert.match(notice.target, /publication\/17/);
  assert.equal(blockedPostNotice({ ...post, moderation: "rejected" }, profile.id), undefined);
});

test("Un refus pour compte banni reste distinct d’une erreur CSRF ou de mot de passe", () => {
  assert.equal(bannedLoginError(new ApiError(403, { code: "account_banned" })), true);
  assert.equal(bannedLoginError(new ApiError(423, { detail: "Compte banni" })), true);
  assert.equal(bannedLoginError(new ApiError(403, { detail: "CSRF verification failed" })), false);
  assert.equal(bannedLoginError(new ApiError(401, { code: "invalid_credentials" })), false);
  assert.equal(migrateProfile({ ...profile, banned: true }).accountStatus, "banned");
});

test("Le client de connexion initialise CSRF et reconnaît le statut banni renvoyé", async () => {
  const requests: { url: string; options?: RequestInit }[] = [];
  const originalFetch = globalThis.fetch;
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", { configurable: true, value: { cookie: "" } });
  globalThis.fetch = async (input, options) => {
    requests.push({ url: String(input), options });
    return requests.length === 1 ? new Response(null, { status: 204 }) : new Response(JSON.stringify({ profile: { ...profile, accountStatus: "banned" } }), { status: 200, headers: { "content-type": "application/json" } });
  };
  try {
    const result = await loginWithDjango("test@example.test", "test-fixture-only", false);
    assert.equal(result.accountStatus, "banned");
    assert.match(requests[0].url, /auth\/csrf\/$/);
    assert.match(requests[1].url, /auth\/login\/$/);
    assert.equal(requests[1].options?.credentials, "include");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});

test("Les nouveaux contrôles et toutes les cartes du catalogue possèdent leur traduction", () => {
  for (const key of ["Accès au compte", "Joindre un certificat", "Effacer la discussion", "Sourdine", "Supprimer le groupe", "Chargement du fichier…"]) assert.ok(inlineEnglish[key], key);
  for (const course of courses) {
    assert.ok(catalogEnglish[course.title], course.title);
    assert.ok(catalogEnglish[course.description], course.id);
  }
});
