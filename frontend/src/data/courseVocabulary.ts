import { findLearningTerms, learningGlossary, type LearningTerm } from "./learningGlossary";
import type { DetailedCourseId, WebCurriculum, WebLevelId } from "./webCourseTypes";

export type VocabularyOrigin = { levelId: WebLevelId; lessonId: string; lessonTitle: string; number: string };
export type LessonVocabularyPlan = { introduced: LearningTerm[]; review: { term: LearningTerm; origin: VocabularyOrigin }[] };
export type CourseVocabularyPlan = Record<string, LessonVocabularyPlan>;
type Placement = Record<string, string[]>;

/** Explicit placements keep incidental mentions from stealing a later topic’s definitions. */
export const vocabularyIntroductions: Partial<Record<DetailedCourseId, Placement>> = {
  "html-css-web": {
    "debutant/roles": ["html", "css", "balise", "head", "body", "h1", "propriete-css"],
    "debutant/environnement": ["dom", "fichier-web", "ide", "url"],
    "debutant/structure": ["doctype", "utf8", "attribut", "orpheline", "viewport"],
    "debutant/balises": ["lien-hypertexte"], "debutant/texte-couleurs": ["css-typographie"],
    "debutant/selecteurs": ["selecteur"], "debutant/boites": ["boite"],
    "intermediaire/semantique": ["semantique", "seo"],
    "intermediaire/formulaires": ["formulaire"],
    "intermediaire/flexbox": ["flexbox"],
    "intermediaire/media-queries": ["responsive"],
    "avance/accessibilite": ["aria"],
  },
  "javascript-web": {
    "debutant/navigateur": ["javascript", "dom"], "debutant/liaison-console": ["console", "module"],
    "debutant/variables": ["variable", "type"], "debutant/conditions-boucles": ["condition", "boucle"],
    "debutant/fonctions": ["fonction", "portee"], "debutant/selection-dom": ["selecteur", "null"],
    "debutant/evenements": ["evenement", "callback"],
    "intermediaire/objets-json": ["objet", "json"],
    "intermediaire/methodes-tableaux": ["map-filter-reduce"],
    "intermediaire/promesses": ["asynchrone"], "intermediaire/fetch-api": ["fetch", "api", "http"],
  },
  "react-web": {
    "debutant/composants-dom": ["bibliotheque", "composant", "dom"], "debutant/vite": ["vite", "npm", "module"],
    "debutant/jsx": ["jsx"], "debutant/props": ["props"], "debutant/conditions-listes": ["key", "tableau"],
    "debutant/use-state": ["state"], "debutant/evenements": ["evenement", "callback"],
    "avance/typescript": ["typescript", "interface"], "avance/next-ssr": ["ssr"],
  },
  "vue-web": {
    "debutant/vue-premier-composant": ["framework", "sfc", "composant"], "debutant/reactivite-ref": ["reactivite", "ref"],
    "debutant/conditions-vue": ["directive", "condition"], "debutant/listes-et-attributs": ["key", "tableau", "attribut"],
    "debutant/evenements-vue": ["evenement", "callback"], "debutant/v-model": ["v-model", "state"],
    "avance/vue-typescript": ["typescript", "interface"],
  },
  "django-web": {
    "debutant/http-mtv": ["django", "http", "url", "mtv", "template", "vue-django"],
    "debutant/installer-django": ["projet-django", "application-django", "venv", "cli"],
    "debutant/urls-django": ["route", "fonction"], "debutant/vues-fonctions": ["exception"],
    "debutant/heritage-django": ["heritage-template"],
    "intermediaire/modeles-migrations": ["orm", "modele", "migration", "sqlite", "table", "classe", "instance", "heritage"],
    "intermediaire/requeter-orm": ["queryset"], "intermediaire/django-admin": ["admin", "authentification"],
    "intermediaire/crud-django": ["crud", "methode"], "intermediaire/model-form": ["modelform"],
    "intermediaire/csrf-django": ["csrf"], "avance/serialiseurs-drf": ["drf"],
  },
  "node-web": {
    "debutant/node-v8-callback": ["node", "javascript", "callback", "asynchrone"],
    "debutant/npm-scripts": ["npm", "bibliotheque", "cli"],
    "debutant/premier-serveur": ["express", "http", "url", "route"],
    "debutant/verbes-express": ["crud", "tableau"], "debutant/body-json": ["json"],
    "intermediaire/schemas-requetes": ["odm"],
  },
  "php-web": {
    "debutant/composer-artisan": ["php", "framework", "composer", "artisan"],
    "debutant/routes-laravel": ["http", "url", "route"], "debutant/controleur-mvc": ["mvc"],
    "debutant/html-json-laravel": ["html", "json"], "debutant/blade-directives": ["template"],
    "debutant/blade-layouts": ["heritage-template"],
    "intermediaire/requeter-eloquent": ["orm", "eloquent", "modele", "crud"],
    "intermediaire/csrf-laravel": ["csrf"],
  },
  "java-web": {
    "debutant/initializr-maven": ["java", "jdk", "jvm", "maven", "bibliotheque"],
    "debutant/injection-java": ["classe", "instance", "injection"],
    "debutant/mappings-rest": ["http", "api", "route", "annotation", "crud"],
    "debutant/dto-request-body": ["dto", "json"], "intermediaire/entite-jpa": ["jpa", "orm", "modele"],
  },
  "kotlin-mobile": {
    "debutant/val-var": ["variable", "main", "console"], "debutant/types-fonctions": ["type", "fonction"],
    "debutant/conditions-when": ["condition"], "debutant/boucles-plages": ["boucle"],
    "debutant/types-nullables": ["null"],
  },
  "compose-mobile": {
    "debutant/android-studio-activite": ["ide", "sdk", "emulateur", "activity", "gradle"],
    "debutant/composable-text-image-icon": ["composable", "composant", "annotation"],
    "debutant/column-row-box": ["modifier"], "debutant/boutons-compose": ["state", "evenement", "callback"],
  },
  "java-mobile": {
    "debutant/ouvrir-projet-java": ["java", "jdk", "gradle", "apk", "sdk", "emulateur"],
    "debutant/composer-xml": ["xml"], "debutant/classe-score-java": ["classe", "instance", "constructeur", "methode"],
    "debutant/vues-et-clics-java": ["evenement", "callback"], "debutant/cycle-activite-java": ["activity"],
  },
  "swift-mobile": {
    "debutant/ouvrir-xcode-ios": ["swift", "ide", "emulateur", "compilation"],
    "debutant/variables-et-optionnels-swift": ["variable", "type", "optionnel"],
    "debutant/protocole-view-swiftui": ["protocole", "composant"], "debutant/state-score-swiftui": ["state"],
  },
  "flutter-mobile": {
    "debutant/sdk-flutter-et-appareil": ["flutter", "dart", "sdk", "compilation", "emulateur"],
    "debutant/dart-types-et-constructeurs": ["type", "null", "constructeur"],
    "debutant/statelesswidget-carte": ["gui", "composant"], "debutant/statefulwidget-compteur": ["state", "instance"],
  },
  "react-native-mobile": {
    "debutant/demarrer-expo-go": ["expo", "sdk", "native"], "debutant/structure-projet-react-native": ["composant", "jsx", "module"],
    "debutant/view-text-image-pressable": ["props"], "debutant/styles-flexbox-react-native": ["flexbox-native"],
    "debutant/usestate-et-votes": ["state"],
  },
  "lang-c": {
    "debutant/c-premiere-compilation": ["compilation", "entete-c", "main", "console"],
    "debutant/c-types-variables": ["variable", "type"], "debutant/c-saisie": ["pointeur"],
    "debutant/c-conditions": ["condition"], "debutant/c-boucles": ["boucle"],
    "debutant/c-fonctions": ["fonction", "portee"], "debutant/c-tableaux": ["tableau"],
  },
  "lang-cpp": {
    "debutant/cpp-demarrer": ["compilation", "entete-c", "main", "std", "console"],
    "debutant/cpp-entrees": ["variable", "type"], "debutant/cpp-conditions-boucles": ["condition", "boucle"],
    "debutant/cpp-fonctions": ["fonction", "portee"], "debutant/cpp-references": ["reference"],
    "debutant/cpp-classe": ["classe", "methode", "poo"], "debutant/cpp-constructeur-instances": ["constructeur", "instance", "self-this"],
    "debutant/cpp-string-vector": ["tableau"],
  },
  "lang-java": {
    "debutant/java-demarrer": ["java", "jdk", "jvm", "bytecode", "main", "console"],
    "debutant/java-variables": ["variable", "type"], "debutant/java-scanner": ["instance"],
    "debutant/java-conditions-boucles": ["condition", "boucle", "portee"], "debutant/java-methodes": ["methode", "fonction"],
    "debutant/java-arraylist": ["tableau"], "debutant/java-classes-instances": ["classe", "constructeur", "self-this", "poo"],
  },
  "lang-python": {
    "debutant/py-interpreteur": ["python", "interpreteur", "bytecode", "indentation", "console"],
    "debutant/py-types-saisie": ["variable", "type"], "debutant/py-conditions": ["condition"],
    "debutant/py-boucles": ["boucle"], "debutant/py-fonctions": ["fonction", "portee"],
    "debutant/py-listes": ["tableau"], "intermediaire/py-instances": ["classe", "instance", "constructeur", "self-this", "poo"],
  },
  "lang-javascript": {
    "debutant/js-node-runtime": ["javascript", "node", "console", "bytecode"],
    "debutant/js-let-const-portee": ["variable", "portee"], "debutant/js-objets-litteraux": ["objet", "json"],
    "debutant/js-array-push-pop": ["tableau"], "debutant/js-controle-strict": ["condition", "boucle", "type"],
    "debutant/js-fleche-retour": ["fonction"], "intermediaire/js-map": ["map-filter-reduce"],
  },
  "lang-typescript": {
    "debutant/ts-compilation": ["typescript", "compilation", "javascript"],
    "debutant/ts-types-explicites": ["type", "inference", "variable"], "debutant/ts-interfaces": ["interface", "objet"],
    "debutant/ts-optionnels-unions": ["union", "null"], "debutant/ts-fonctions-typees": ["fonction"],
    "debutant/ts-unknown-validation": ["unknown"], "intermediaire/ts-qode": ["nodegui"],
  },
  "lang-php": {
    "debutant/php-script-cli": ["php", "cli", "console", "interpreteur"],
    "debutant/php-types-readline": ["variable", "type"], "debutant/php-conditions": ["condition"],
    "debutant/php-boucles": ["boucle"], "debutant/php-fonctions": ["fonction", "portee"],
    "debutant/php-texte-tableaux": ["tableau", "utf8"], "intermediaire/php-constructeur": ["classe", "instance", "constructeur", "self-this"],
    "intermediaire/php-session-post": ["session", "http"],
  },
  "lang-sql": {
    "debutant/sql-base-table": ["sql", "sgbd", "sqlite", "table"],
    "debutant/sql-types-cle": ["type", "cle-primaire", "null"], "debutant/sql-create-table": ["contrainte"],
    "debutant/sql-insert-select": ["crud"], "intermediaire/sql-foreign-key": ["cle-etrangere"],
    "debutant/sql-where-like": ["sql-filtre"], "debutant/sql-order-limit": ["sql-pagination"],
    "intermediaire/sql-inner-join": ["jointure"], "avance/sql-agregations": ["agregation"],
    "avance/sql-index": ["index"],
  },
};

const languageTerms = "variable type fonction condition boucle tableau objet classe instance constructeur methode heritage portee null exception console compilation interpreteur bytecode memoire reference bibliotheque ide cli module main poo self-this utf8 gui stockage".split(" ");
const webTerms = "html css balise orpheline head body h1 attribut utf8 doctype dom selecteur responsive flexbox grid semantique formulaire aria seo url http route api json asynchrone callback evenement module bibliotheque framework ide cli npm stockage deploiement".split(" ");
const serverTerms = "framework http url route api json asynchrone callback bibliotheque ide cli modele orm migration crud authentification csrf mvc template session cle-primaire cle-etrangere table contrainte transaction sql sgbd sqlite index hachage jwt cors deploiement".split(" ");
const allowedTerms: Record<DetailedCourseId, Set<string>> = Object.fromEntries(Object.entries({
  "html-css-web": "html css balise orpheline head body h1 attribut utf8 doctype dom selecteur boite responsive flexbox grid semantique formulaire aria seo ide url propriete-css fichier-web lien-hypertexte css-typographie viewport",
  "javascript-web": [...languageTerms, ...webTerms, "javascript", "fetch", "map-filter-reduce", "ssr"],
  "react-web": [...languageTerms, ...webTerms, "javascript", "composant", "jsx", "props", "state", "hook", "vite", "key", "store", "ssr", "memoisation", "typescript", "interface", "inference", "union", "fetch", "map-filter-reduce"],
  "vue-web": [...languageTerms, ...webTerms, "javascript", "composant", "sfc", "reactivite", "ref", "directive", "v-model", "props", "state", "hook", "vite", "key", "store", "ssr", "typescript", "interface", "fetch", "map-filter-reduce"],
  "django-web": [...languageTerms, ...serverTerms, "html", "css", "balise", "h1", "heritage-template", "django", "mtv", "projet-django", "application-django", "vue-django", "venv", "queryset", "modelform", "admin", "drf", "python", "indentation"],
  "node-web": [...languageTerms, ...serverTerms, "javascript", "node", "express", "npm", "odm", "socket"],
  "php-web": [...languageTerms, ...serverTerms, "html", "css", "balise", "php", "composer", "artisan", "eloquent", "heritage-template"],
  "java-web": [...languageTerms, ...serverTerms, "java", "jdk", "jvm", "maven", "annotation", "injection", "dto", "jpa"],
  "kotlin-mobile": [...languageTerms, "jvm", "coroutine", "viewmodel", "evenement"],
  "compose-mobile": [...languageTerms, "sdk", "emulateur", "activity", "gradle", "apk", "composable", "composant", "modifier", "state", "viewmodel", "annotation", "evenement", "callback", "coroutine", "native"],
  "java-mobile": [...languageTerms, "java", "jdk", "gradle", "apk", "sdk", "emulateur", "xml", "activity", "viewmodel", "http", "api", "json", "asynchrone", "evenement", "callback", "native"],
  "swift-mobile": [...languageTerms, "swift", "sdk", "emulateur", "protocole", "optionnel", "state", "composant", "viewmodel", "asynchrone", "json", "http", "api", "native"],
  "flutter-mobile": [...languageTerms, "flutter", "dart", "sdk", "emulateur", "state", "composant", "viewmodel", "asynchrone", "json", "http", "api", "native"],
  "react-native-mobile": [...languageTerms, "javascript", "typescript", "interface", "union", "asynchrone", "http", "api", "json", "evenement", "callback", "expo", "jsx", "composant", "props", "state", "hook", "key", "flexbox-native", "native", "sdk", "store"],
  "lang-c": "compilation entete-c main console variable type pointeur condition boucle fonction portee tableau memoire reference bibliotheque ide cli utf8 gui gtk evenement callback stockage",
  "lang-cpp": [...languageTerms, "entete-c", "std", "pointeur", "qt-cpp", "xml", "evenement", "callback"],
  "lang-java": [...languageTerms, "java", "jdk", "jvm", "annotation", "javafx", "xml", "evenement", "callback", "maven"],
  "lang-python": [...languageTerms, "python", "indentation", "venv", "customtkinter", "json", "hachage", "evenement", "callback"],
  "lang-javascript": [...languageTerms, "javascript", "node", "npm", "asynchrone", "json", "api", "evenement", "callback", "map-filter-reduce", "electron"],
  "lang-typescript": [...languageTerms, "javascript", "typescript", "interface", "inference", "unknown", "union", "generique", "npm", "asynchrone", "evenement", "callback", "nodegui"],
  "lang-php": [...languageTerms, "php", "json", "http", "session", "formulaire", "authentification", "hachage", "html", "mvc"],
  "lang-sql": "sql sgbd sqlite table type cle-primaire cle-etrangere null contrainte crud jointure transaction index agregation sql-filtre sql-pagination",
}).map(([id, terms]) => [id, new Set(typeof terms === "string" ? terms.split(" ") : terms)])) as Record<DetailedCourseId, Set<string>>;

const glossaryById = new Map(learningGlossary.map((term) => [term.id, term]));
const cache = new WeakMap<WebCurriculum, CourseVocabularyPlan>();
export function vocabularyKey(levelId: string, lessonId: string) { return levelId + "/" + lessonId; }

export function buildCourseVocabulary(courseId: DetailedCourseId, course: WebCurriculum): CourseVocabularyPlan {
  const placements = vocabularyIntroductions[courseId] ?? {};
  const preferred = new Map(Object.entries(placements).flatMap(([key, ids]) => ids.map((id) => [id, key] as const)));
  const seen = new Map<string, VocabularyOrigin>();
  const plan: CourseVocabularyPlan = {};
  for (const level of course.levels) for (const [chapterIndex, chapter] of level.chapters.entries()) for (const [lessonIndex, lesson] of chapter.lessons.entries()) {
    const key = vocabularyKey(level.id, lesson.id);
    const text = [lesson.title, lesson.summary, ...lesson.sections.map((section) => section.title + " " + section.text + " " + section.points.join(" "))].join(" ");
    const matched = findLearningTerms(text, courseId).filter((term) => allowedTerms[courseId].has(term.id));
    const chosen = [
      ...(placements[key] ?? []).map((id) => glossaryById.get(id)).filter((term): term is LearningTerm => !!term && allowedTerms[courseId].has(term.id)),
      ...matched.filter((term) => !preferred.has(term.id)),
    ];
    const introduced: LearningTerm[] = [];
    for (const term of chosen) if (!seen.has(term.id)) {
      seen.set(term.id, { levelId: level.id, lessonId: lesson.id, lessonTitle: lesson.title, number: (chapterIndex + 1) + "." + (lessonIndex + 1) });
      introduced.push(term);
    }
    plan[key] = { introduced, review: matched.filter((term) => seen.has(term.id) && !introduced.some((item) => item.id === term.id)).map((term) => ({ term, origin: seen.get(term.id)! })) };
  }
  return plan;
}

export function lessonVocabulary(courseId: DetailedCourseId, course: WebCurriculum, levelId: WebLevelId, lessonId: string): LessonVocabularyPlan {
  if (!cache.has(course)) cache.set(course, buildCourseVocabulary(courseId, course));
  return cache.get(course)![vocabularyKey(levelId, lessonId)] ?? { introduced: [], review: [] };
}
