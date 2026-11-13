import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { tsProfiles, tsSupport, tsVotes } from "./typescriptProjects";
import type { WebLevel } from "./webCourseTypes";

const docs = "https://www.typescriptlang.org/docs/handbook/";
const gui = "https://docs.nodegui.org/docs/";

// ═══════════════════════════════════════════════════════════════════════════
// 🟢 NIVEAU DÉBUTANT - Fondamentaux TypeScript
// ═══════════════════════════════════════════════════════════════════════════

const beginner: WebLevel["chapters"] = [
  {
    id: "ts-introduction",
    title: "Introduction à TypeScript",
    description: "Comprendre TypeScript, l'installer et préparer NodeGUI",
    lessons: [
      lesson({
        id: "ts-intro-langage",
        title: "Qu'est-ce que TypeScript et à quoi sert NodeGUI ?",
        minutes: 20,
        summary:
          "TypeScript est JavaScript avec des types statiques. Il détecte les erreurs AVANT l'exécution. Ce cours utilise TypeScript avec NodeGUI pour créer des applications desktop (GUI natives), PAS pour du backend Node.js ni pour React.",
        sections: [
          section(
            "TypeScript vs JavaScript",
            "TypeScript = JavaScript + système de types. Tout code JavaScript valide est du TypeScript valide.",
            [
              "JavaScript : typage dynamique (types vérifiés à l'exécution)",
              "TypeScript : typage statique (types vérifiés à la compilation)",
              "TypeScript se compile en JavaScript avant exécution",
              "Avantages : autocomplétion, détection erreurs, refactoring sûr",
              "TypeScript est un superset de JavaScript (ajoute des fonctionnalités)",
            ]
          ),
          section(
            "Pourquoi ce cours utilise NodeGUI ?",
            "Ce cours NE COUVRE PAS backend Node.js ni React. Focus = applications desktop GUI natives.",
            [
              "NodeGUI : créer interfaces graphiques natives (comme JavaFX pour Java)",
              "Utilise Qt (bibliothèque C++ pour GUI) pilotée par TypeScript",
              "Applications desktop : fenêtres, boutons, formulaires natifs",
              "Comparaison : Java → JavaFX, C++ → FLTK, TypeScript → NodeGUI",
              "Qode : runtime qui combine Node.js + boucle événements Qt",
              "PAS de HTML/CSS : vrais widgets natifs du système",
            ]
          ),
          section(
            "À quoi sert TypeScript seul ?",
            "TypeScript est puissant pour projets complexes et en équipe.",
            [
              "Backend API (Node.js + Express + TypeScript)",
              "Frontend frameworks (React, Vue, Angular avec TypeScript)",
              "Applications CLI (outils en ligne de commande)",
              "Applications desktop (Electron, NodeGUI)",
              "Détection bugs avant exécution (pas en production !)",
              "Ce cours : TypeScript + NodeGUI pour apps desktop GUI",
            ]
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// JavaScript classique (sans types)
let nom = "Tiana";
let age = 25;
console.log(nom, age);

// TypeScript (avec types explicites)
let nomTyped: string = "Tiana";
let ageTyped: number = 25;

// Erreur détectée à la compilation :
// ageTyped = "vingt-cinq"; // ❌ Type 'string' is not assignable to type 'number'

console.log("TypeScript = JavaScript + Types");
console.log("Ce cours : TypeScript + NodeGUI pour GUI desktop");`,
        ),
        task: "Essayez d'assigner une string à ageTyped et observez l'erreur de compilation.",
        takeaway:
          "TypeScript = JavaScript + types statiques. NodeGUI = GUI desktop natives avec TypeScript (comme JavaFX pour Java).",
        quiz: quiz(
          "Quelle est la différence principale entre TypeScript et JavaScript ?",
          ["TypeScript est plus rapide", "TypeScript ajoute typage statique", "TypeScript est un langage différent"],
          1,
          "TypeScript ajoute un système de types statiques vérifié à la compilation. C'est un superset de JavaScript."
        ),
        link: docs + "typescript-from-scratch.html",
      }),
      lesson({
        id: "ts-installation",
        title: "Installer TypeScript et compiler son premier programme",
        minutes: 25,
        summary:
          "Installation de TypeScript avec npm. Commande tsc pour compiler .ts en .js. Fichier tsconfig.json pour configurer le compilateur. Exécuter avec node.",
        sections: [
          section(
            "Installer TypeScript",
            "TypeScript s'installe avec npm (Node Package Manager).",
            [
              "Prérequis : Node.js installé (inclut npm)",
              "Installation globale : npm install -g typescript",
              "Vérifier version : tsc --version",
              "tsc = TypeScript Compiler",
              "Installation locale projet : npm install --save-dev typescript",
              "Préférer installation locale pour projets partagés",
            ]
          ),
          section(
            "Compiler et exécuter",
            "Workflow TypeScript : .ts → tsc → .js → node.",
            [
              "Écrire code dans fichier .ts (ex: main.ts)",
              "Compiler : tsc main.ts (génère main.js)",
              "Exécuter : node main.js",
              "TypeScript = temps de compilation, JavaScript = temps d'exécution",
              "Les types disparaissent dans le .js généré",
              "Le .js généré est du JavaScript standard",
            ]
          ),
          section(
            "Configuration tsconfig.json",
            "Fichier de configuration du compilateur TypeScript.",
            [
              "Créer : tsc --init",
              "target : version JavaScript cible (ES2020, ES2022)",
              "module : système de modules (commonjs, ES2015)",
              "outDir : dossier de sortie pour .js",
              "strict : active vérifications strictes (recommandé)",
              "tsconfig.json évite de passer options à chaque compilation",
            ]
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// main.ts - Premier programme TypeScript
const message: string = "Bonjour DevAfrica depuis TypeScript !";
const annee: number = 2024;
const estActif: boolean = true;

console.log(message);
console.log(\`Année: \${annee}\`);
console.log(\`Actif: \${estActif}\`);

// Fonction avec types
function saluer(nom: string): string {
  return \`Bonjour \${nom} !\`;
}

console.log(saluer("Tiana"));

// INSTRUCTIONS DE COMPILATION :
// 1. Enregistrer ce fichier : main.ts
// 2. Compiler : tsc main.ts
// 3. Exécuter : node main.js

// Dans l'atelier DevAfrica, clic sur "Exécuter" fait tout automatiquement !`,
        ),
        task: "Créez un fichier hello.ts, compilez-le avec tsc, puis exécutez le .js généré avec node.",
        takeaway:
          "tsc compile .ts en .js. Le JavaScript généré est exécuté par node. tsconfig.json configure le compilateur.",
        quiz: quiz(
          "Quelle commande compile un fichier TypeScript ?",
          ["node main.ts", "tsc main.ts", "npm run main.ts"],
          1,
          "tsc (TypeScript Compiler) compile .ts en .js. Ensuite node exécute le .js."
        ),
        link: docs + "typescript-tooling-in-5-minutes.html",
      }),
      lesson({
        id: "ts-nodegui-setup",
        title: "Préparer NodeGUI pour interfaces graphiques",
        minutes: 30,
        summary:
          "NodeGUI permet de créer GUI natives avec TypeScript. Installation : npm install @nodegui/nodegui. Prérequis système : CMake, compilateur C++. Qode = runtime NodeGUI.",
        sections: [
          section(
            "Qu'est-ce que NodeGUI ?",
            "NodeGUI = bindings TypeScript/JavaScript pour Qt (bibliothèque GUI C++).",
            [
              "Qt : framework C++ pour créer interfaces graphiques",
              "NodeGUI : pilote Qt depuis TypeScript/JavaScript",
              "Widgets natifs : vrais boutons/fenêtres du système (pas HTML)",
              "Qode : runtime custom (Node.js + boucle événements Qt)",
              "Alternative à Electron (plus léger, widgets natifs)",
              "Comparaison : Electron = HTML/CSS, NodeGUI = widgets natifs",
            ]
          ),
          section(
            "Installation NodeGUI",
            "NodeGUI nécessite outils natifs (compilation C++).",
            [
              "Créer projet : npm init -y",
              "Installer : npm install @nodegui/nodegui",
              "ATTENTION : compilation native = temps long (5-15 min)",
              "Prérequis Windows : Visual Studio Build Tools, CMake",
              "Prérequis Linux : build-essential, CMake, Qt5",
              "Prérequis macOS : Xcode Command Line Tools",
              "Suivre guide officiel : docs.nodegui.org",
            ]
          ),
          section(
            "Première fenêtre NodeGUI",
            "Structure minimale d'une application NodeGUI.",
            [
              "QMainWindow : fenêtre principale",
              "QWidget : conteneur central",
              "QLabel : afficher texte",
              "QPushButton : bouton cliquable",
              "show() : afficher fenêtre",
              "Qode exécute le code (pas node directement)",
            ]
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Installation NodeGUI (dans terminal)
// npm init -y
// npm install @nodegui/nodegui
// npm install --save-dev typescript @types/node

// main.ts - Première fenêtre NodeGUI
import { QMainWindow, QWidget, QLabel, FlexLayout } from "@nodegui/nodegui";

// Créer fenêtre principale
const win = new QMainWindow();
win.setWindowTitle("Ma première app NodeGUI");
win.resize(400, 300);

// Créer widget central
const central = new QWidget();
const layout = new FlexLayout();
central.setLayout(layout);

// Ajouter label
const label = new QLabel();
label.setText("Bonjour depuis NodeGUI + TypeScript !");
label.setInlineStyle("font-size: 18px; padding: 20px;");

layout.addWidget(label);
win.setCentralWidget(central);

// Afficher fenêtre
win.show();

// REMARQUE : Ce code s'exécute avec Qode (pas node)
// Commande : npx qode main.js (après compilation tsc)

console.log("✅ NodeGUI installé et prêt !");
console.log("Ce cours utilise NodeGUI pour GUI desktop natives");
console.log("PAS pour backend Node.js, PAS pour React");`,
        ),
        task: "Suivez le guide d'installation NodeGUI, créez votre première fenêtre et changez le titre.",
        takeaway:
          "NodeGUI = GUI natives avec TypeScript. Qode = runtime. Installation nécessite outils natifs (CMake, compilateur C++).",
        quiz: quiz(
          "Qu'est-ce que NodeGUI ?",
          ["Framework backend", "Bindings TypeScript pour Qt (GUI natives)", "Alternative à MySQL"],
          1,
          "NodeGUI permet de créer des interfaces graphiques natives en pilotant Qt depuis TypeScript."
        ),
        link: gui + "guides/getting-started/",
      }),
    ],
  },
  {
    id: "ts-bases",
    title: "Compilation et types primitifs",
    description:
      "Comprendre la vérification statique et les types de base",
    lessons: [
      lesson({
        id: "ts-compilation",
        title: "TypeScript, tsc et JavaScript produit",
        minutes: 20,
        summary:
          "TypeScript ajoute des informations de type à JavaScript. tsc vérifie leur cohérence et produit du JavaScript. Le runtime exécute ensuite ce JavaScript. Les types n'existent QU'À LA COMPILATION.",
        sections: [
          section(
            "Suivre les deux étapes",
            "main.ts contient une annotation string. Après compilation, le JavaScript conserve les instructions utiles à l'exécution mais les types disparaissent.",
            [
              "Étape 1 : tsc vérifie les types (compilation)",
              "Étape 2 : node exécute le .js généré (exécution)",
              "Les types sont EFFACÉS dans le .js final",
              "Une erreur de type empêche ici le lancement grâce à noEmitOnError",
              "TypeScript = sécurité développement, JavaScript = exécution",
            ],
          ),
          section(
            "Comprendre ce qui est vérifié",
            "Les types détectent des incompatibilités AVANT l'exécution. Les résultats mathématiques et les données externes demandent encore des règles et des essais.",
            [
              "Le compilateur explique la propriété ou le paramètre incompatible",
              "Erreur de type = erreur de compilation (pas d'exécution)",
              "Les types NE vérifient PAS la logique métier",
              "Exemple : type number accepte NaN et Infinity",
              "Le projet exporté fournit package.json et tsconfig.json",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `const message: string = "Bonjour DevAfrica";
console.log(message);

// ❌ Erreur de compilation détectée :
// const nombre: number = "42"; // Type 'string' is not assignable to type 'number'

// ✅ Correct :
const nombre: number = 42;
console.log(nombre);

// Le fichier .js généré ne contient PAS les types :
// const message = "Bonjour DevAfrica";
// console.log(message);
// const nombre = 42;
// console.log(nombre);`,
        ),
        task: "Change le texte puis remplace volontairement sa valeur par un nombre et lis le diagnostic tsc.",
        takeaway:
          "TypeScript vérifie les types puis produit du JavaScript SANS types. Les types n'existent qu'à la compilation.",
        quiz: quiz(
          "Quel outil vérifie ce fichier TypeScript ?",
          ["php", "tsc", "GtkApplication"],
          1,
          "tsc est le compilateur TypeScript utilisé pour cet atelier.",
        ),
        link: docs + "typescript-in-5-minutes.html",
      }),
      lesson({
        id: "ts-types-explicites",
        title: "Types primitifs : string, number, boolean",
        minutes: 22,
        summary:
          "Une annotation de type décrit les valeurs autorisées. string = texte, number = nombres (int ET float en JavaScript), boolean = true/false. TypeScript peut aussi INFÉRER un type depuis l'initialisation.",
        sections: [
          section(
            "Types primitifs TypeScript",
            "TypeScript utilise les mêmes types que JavaScript mais les vérifie statiquement.",
            [
              "string : chaîne de caractères (\"texte\" ou 'texte')",
              "number : TOUS les nombres JavaScript (42, 3.14, NaN, Infinity)",
              "boolean : true ou false uniquement",
              "DIFFÉRENCE JS : JavaScript a ces types mais vérifiés à l'exécution",
              "TypeScript : vérification à la compilation = erreurs AVANT exécution",
            ],
          ),
          section(
            "Inférence de type",
            "TypeScript peut DEVINER le type si vous ne l'écrivez pas explicitement.",
            [
              "let nom = \"Tiana\" → TypeScript infère string",
              "let age = 25 → TypeScript infère number",
              "Inférence = types implicites (TypeScript les devine)",
              "Annotations explicites : let nom: string = \"Tiana\"",
              "Préférer inférence quand c'est clair",
              "Annotations explicites utiles pour : paramètres, propriétés, retours",
            ],
          ),
          section(
            "const vs let avec types",
            "const et let ont des comportements d'inférence différents.",
            [
              "const : type LITTÉRAL (const x = 5 → type = 5, pas number)",
              "let : type LARGE (let x = 5 → type = number)",
              "const empêche réaffectation (comme en JavaScript)",
              "let permet réaffectation (compatible avec le type)",
              "TypeScript élargit types const en paramètres",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Types explicites (annotations)
let pseudo: string = "Tiana";
let points: number = 3;
const actif: boolean = true;

// Inférence de type (TypeScript devine)
let ville = "Dakar"; // TypeScript infère string
let population = 3139000; // TypeScript infère number

// Opérations typées
points += 2;
pseudo = pseudo.toUpperCase();

console.log(pseudo, points, actif);
console.log(ville, population);

// ❌ Erreurs de type :
// points = "cinq"; // Type 'string' is not assignable to type 'number'
// pseudo = 123; // Type 'number' is not assignable to type 'string'

// DIFFÉRENCE JAVASCRIPT :
// JavaScript accepterait ces erreurs et planterait À L'EXÉCUTION
// TypeScript les détecte À LA COMPILATION

// const vs let avec inférence :
const role = "admin"; // Type: "admin" (littéral)
let statut = "actif"; // Type: string (large)
statut = "inactif"; // ✅ OK
// role = "user"; // ❌ Cannot assign to 'role' because it is a constant`,
        ),
        task: "Ajoute une variable pays puis une fonction qui affiche les données du profil.",
        takeaway:
          "string, number, boolean = types primitifs. Inférence = TypeScript devine le type. Types vérifiés à la compilation (DIFFÉRENT de JavaScript).",
        quiz: quiz(
          "Quelle différence entre TypeScript et JavaScript pour les types ?",
          ["Aucune", "TypeScript vérifie à la compilation, JS à l'exécution", "TypeScript est plus lent"],
          1,
          "TypeScript vérifie les types à la COMPILATION (avant exécution). JavaScript les vérifie à l'EXÉCUTION (après déploiement).",
        ),
        link: docs + "2/everyday-types.html",
      }),
    ],
  },
  {
    id: "ts-structures",
    title: "Interfaces et formes de données",
    description: "Décrire la structure des objets avec interfaces",
    lessons: [
      lesson({
        id: "ts-interfaces",
        title: "Définir le contrat d'un objet avec interface",
        minutes: 23,
        summary:
          "Une interface décrit la FORME attendue d'un objet. Ses propriétés obligatoires doivent être présentes et leurs valeurs doivent correspondre aux types déclarés. Les interfaces n'existent QU'À LA COMPILATION.",
        sections: [
          section(
            "Décrire un objet TypeScript",
            "CompteUtilisateur annonce id, pseudo et email. L'objet tiana est vérifié au moment de son affectation à ce type.",
            [
              "Interface = contrat de structure d'objet",
              "Propriétés : nom + type",
              "Le compilateur vérifie TOUTES les propriétés",
              "Le compilateur indique un champ obligatoire manquant",
              "Interface effacée dans le .js (n'existe qu'à la compilation)",
              "DIFFÉRENCE JS : JavaScript n'a PAS d'interfaces",
            ],
          ),
          section(
            "Interfaces vs types JavaScript",
            "Les objets JavaScript ont une forme dynamique. TypeScript fixe cette forme.",
            [
              "JavaScript : objets = collections dynamiques de propriétés",
              "TypeScript : interfaces = contrat statique de forme",
              "Erreur si propriété manquante ou type incorrect",
              "Plusieurs objets peuvent implémenter même interface",
              "Interface ≠ classe (pas de constructeur, pas d'instance)",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Définir l'interface (contrat)
interface CompteUtilisateur {
  id: number;
  pseudo: string;
  email: string;
}

// Créer objet respectant l'interface
const tiana: CompteUtilisateur = { 
  id: 1, 
  pseudo: "Tiana", 
  email: "tiana@example.com" 
};

console.log(tiana.pseudo, tiana.email);

// Fonction acceptant l'interface
function afficherProfil(compte: CompteUtilisateur): void {
  console.log(\`ID: \${compte.id}\`);
  console.log(\`Pseudo: \${compte.pseudo}\`);
  console.log(\`Email: \${compte.email}\`);
}

afficherProfil(tiana);

// ❌ Erreurs détectées :
// const invalide: CompteUtilisateur = { 
//   id: 2, 
//   pseudo: "Soa" 
//   // ❌ Property 'email' is missing
// };

// const invalide2: CompteUtilisateur = {
//   id: "3", // ❌ Type 'string' is not assignable to type 'number'
//   pseudo: "Amina",
//   email: "amina@example.com"
// };

// DIFFÉRENCE JAVASCRIPT :
// JavaScript n'a PAS d'interfaces. Tout est vérifié à l'exécution.
// TypeScript détecte ces erreurs À LA COMPILATION.`,
        ),
        task: "Retire temporairement email pour lire le diagnostic puis restaure un objet valide.",
        takeaway:
          "Interface = contrat de structure d'objet. Vérifié à la compilation. N'existe PAS en JavaScript.",
        quiz: quiz(
          "Quand une interface vérifie-t-elle les propriétés ?",
          [
            "Après chaque clic automatiquement",
            "Dans le moteur SQL",
            "Pendant la vérification TypeScript (compilation)",
          ],
          2,
          "Le compilateur TypeScript vérifie les usages de l'interface À LA COMPILATION (pas à l'exécution).",
        ),
        link: docs + "2/objects.html",
      }),
      lesson({
        id: "ts-optionnels-unions",
        title: "Propriétés facultatives (?) et types union (|)",
        minutes: 23,
        summary:
          "Le symbole ? marque une propriété facultative (peut être absente). Une union (|) exprime plusieurs possibilités de types. La lecture d'une valeur facultative doit tenir compte de son éventuelle absence.",
        sections: [
          section(
            "Propriétés facultatives avec ?",
            "portfolio?: string signifie que portfolio peut être absent ou de type string.",
            [
              "? = propriété optionnelle (peut être undefined)",
              "Propriété obligatoire : doit toujours exister",
              "?? = opérateur null coalescing (valeur par défaut)",
              "Vérifier avec if (objet.prop) avant utilisation",
              "DIFFÉRENCE JS : JavaScript accepte tout, TypeScript force la vérification",
            ],
          ),
          section(
            "Types union avec |",
            "Une union 'junior' | 'senior' décrit des choix textuels précis (littéraux).",
            [
              "Union : type1 | type2 | type3",
              "Exemple : string | number (peut être l'un OU l'autre)",
              "Littéraux : 'admin' | 'user' (valeurs exactes)",
              "Le contrôle de flux réduit les possibilités (narrowing)",
              "Union ≠ intersection (& pour intersection)",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Interface avec propriété facultative et union
interface Profil {
  nom: string;
  niveau: "junior" | "senior"; // Union de littéraux
  portfolio?: string; // Propriété facultative
}

// Profil sans portfolio (valide)
const profil1: Profil = { 
  nom: "Soa", 
  niveau: "junior" 
};

// Profil avec portfolio (valide)
const profil2: Profil = {
  nom: "Tiana",
  niveau: "senior",
  portfolio: "https://tiana.dev"
};

// Affichage avec gestion de l'absence
console.log(profil1.nom, profil1.portfolio ?? "Portfolio à ajouter");
console.log(profil2.nom, profil2.portfolio ?? "Portfolio à ajouter");

// ❌ Erreurs détectées :
// const invalide: Profil = {
//   nom: "Amina",
//   niveau: "expert" // ❌ Type '"expert"' is not assignable to type '"junior" | "senior"'
// };

// Type union nombre | string
function afficher(valeur: string | number): void {
  console.log(\`Valeur: \${valeur}\`);
}

afficher("texte"); // ✅
afficher(42); // ✅
// afficher(true); // ❌ Argument of type 'boolean' is not assignable

// DIFFÉRENCE JAVASCRIPT :
// JavaScript accepterait n'importe quelle valeur pour 'niveau'
// TypeScript limite aux choix définis ("junior" | "senior")`,
        ),
        task: "Ajoute un portfolio puis essaie un niveau hors des deux choix autorisés.",
        takeaway:
          "? = propriété facultative. | = union (plusieurs types possibles). Littéraux = valeurs exactes.",
        quiz: quiz(
          "Que signifie portfolio?: string ?",
          [
            "La propriété peut être absente ou de type string",
            "La propriété est toujours un nombre",
            "La propriété contient toujours une liste",
          ],
          0,
          "Le point d'interrogation marque une propriété facultative qui peut être absente (undefined).",
        ),
        link: docs + "2/everyday-types.html",
      }),
    ],
  },
  {
    id: "ts-fonctions",
    title: "Fonctions typées et validation de données",
    description: "Typer les paramètres, retours et valider données externes",
    lessons: [
      lesson({
        id: "ts-fonctions-typees",
        title: "Paramètres et type de retour des fonctions",
        minutes: 23,
        summary:
          "Une fonction typée annonce les données qu'elle reçoit (paramètres) et le résultat qu'elle renvoie (type de retour). Le compilateur vérifie les arguments fournis lors de ses appels. void = aucun retour.",
        sections: [
          section(
            "Typer une fonction TypeScript",
            "calculerTaxe reçoit un prix numérique et renvoie un nombre. Une chaîne doit être convertie et validée avant son utilisation comme prix.",
            [
              "Syntaxe : function nom(param: type): typeRetour { }",
              "Le type de retour suit la liste des paramètres",
              "void = fonction sans valeur de retour (actions)",
              "TypeScript vérifie TOUS les appels de fonction",
              "Erreur si type d'argument incorrect",
              "DIFFÉRENCE JS : JavaScript ne vérifie PAS les types",
            ],
          ),
          section(
            "Types vs validation métier",
            "Le taux de cet exercice est une constante fictive. Les prix utilisent des centimes entiers pour rendre l'arrondi visible.",
            [
              "Types : vérification STATIQUE (compilation)",
              "Validation métier : vérification DYNAMIQUE (exécution)",
              "Exemple : number accepte NaN, mais métier refuse NaN",
              "Number.isInteger vérifie la contrainte sur les centimes",
              "Une erreur de règle métier peut être levée à l'exécution",
              "Types ≠ logique métier (complémentaires)",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Fonction avec types de paramètres et retour
function calculerTaxe(prixCentimes: number): number {
  // Validation métier (exécution)
  if (!Number.isInteger(prixCentimes) || prixCentimes < 0) {
    throw new Error("Prix en centimes entier positif attendu.");
  }
  
  // Calcul avec taux fictif de 20%
  return Math.round(prixCentimes * 0.20);
}

console.log("Taxe:", calculerTaxe(1250), "centimes"); // ✅ 250

// ❌ Erreur de compilation :
// calculerTaxe("1250"); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'

// Fonction void (pas de retour)
function afficherFacture(montant: number): void {
  console.log(\`Montant: \${montant} centimes\`);
  // Pas de return (ou return sans valeur)
}

afficherFacture(1250);

// Fonction avec plusieurs paramètres
function totalTTC(montant: number, tauxTaxe: number): number {
  return montant + Math.round(montant * tauxTaxe);
}

console.log("Total TTC:", totalTTC(1250, 0.20), "centimes");

// Paramètres optionnels avec ?
function saluer(nom: string, titre?: string): string {
  if (titre) {
    return \`Bonjour \${titre} \${nom}\`;
  }
  return \`Bonjour \${nom}\`;
}

console.log(saluer("Tiana")); // "Bonjour Tiana"
console.log(saluer("Soa", "Dr")); // "Bonjour Dr Soa"

// DIFFÉRENCE JAVASCRIPT :
// JavaScript accepterait n'importe quel type d'argument
// TypeScript vérifie À LA COMPILATION`,
        ),
        task: "Ajoute une fonction remise qui calcule une réduction de 10% puis vérifie le résultat avec un prix de 1 250 centimes.",
        takeaway:
          "Fonctions typées : paramètres + type de retour. Types ≠ logique métier. void = pas de retour.",
        quiz: quiz(
          "Que décrit : number après les paramètres ?",
          [
            "Le nom du fichier",
            "Le type de retour de la fonction",
            "Le nombre d'appels autorisés",
          ],
          1,
          "Cette annotation annonce un résultat numérique retourné par la fonction.",
        ),
        link: docs + "2/functions.html",
      }),
      lesson({
        id: "ts-unknown-validation",
        title: "Valider unknown (données externes) avant utilisation",
        minutes: 27,
        summary:
          "Une donnée reçue de JSON ou d'un système externe peut avoir une forme inconnue. unknown demande de vérifier cette forme avant d'utiliser ses propriétés. Type guard = fonction de validation avec prédicat 'is'.",
        sections: [
          section(
            "Type unknown vs any",
            "unknown = type sûr pour données inconnues. any = désactive TypeScript (à éviter).",
            [
              "unknown : doit vérifier avant utilisation",
              "any : accepte tout, désactive vérification (dangereux)",
              "Préférer unknown à any (sécurité)",
              "JSON.parse retourne any par défaut (typage faible)",
              "Valider données externes (API, formulaires, JSON)",
            ],
          ),
          section(
            "Type guard avec prédicat 'is'",
            "estCompte examine l'objet et les types des champs. La fonction vérifie aussi des règles métier.",
            [
              "Type guard : fonction de validation qui retourne boolean",
              "Prédicat : valeur is Type (relie validation au type)",
              "TypeScript comprend le type après validation vraie",
              "Narrowing : réduction du type dans branche vraie",
              "Vérifie : typeof, propriétés, règles métier",
              "DIFFÉRENCE JS : pas de type guards (vérification manuelle)",
            ],
          ),
        ],
        files: tsProfiles.files,
        task: "Ajoute un essai avec un email mal formé puis observe le rejet à l'exécution.",
        takeaway:
          "unknown = type sûr pour données externes. Type guard avec 'is' = validation + narrowing. any = dangereux.",
        quiz: quiz(
          "Que fait un prédicat 'valeur is CompteUtilisateur' ?",
          [
            "Il chiffre le compte",
            "Il installe NodeGui",
            "Il relie le test à la réduction du type dans la branche vraie",
          ],
          2,
          "Le prédicat permet au compilateur de reconnaître le type après une validation vraie (narrowing).",
        ),
        link: docs + "2/narrowing.html",
      }),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🟡 NIVEAU INTERMÉDIAIRE - Classes TypeScript et NodeGUI
// ═══════════════════════════════════════════════════════════════════════════

const intermediate: WebLevel["chapters"] = [
  {
    id: "ts-objets",
    title: "Classes typées et visibilité",
    description: "Protéger les opérations du modèle avec POO TypeScript",
    lessons: [
      lesson({
        id: "ts-classe-privee",
        title: "Classes TypeScript : private, public, readonly",
        minutes: 24,
        summary:
          "Une classe rassemble un état (propriétés) et des méthodes. private limite l'accès direct à un attribut pendant la vérification TypeScript (compilation). readonly empêche modification après initialisation. Les méthodes publiques présentent les opérations prévues.",
        sections: [
          section(
            "Classes TypeScript vs JavaScript",
            "JavaScript ES6+ a des classes. TypeScript ajoute types + modificateurs de visibilité.",
            [
              "JavaScript : classes depuis ES6 (2015)",
              "TypeScript : classes + types + private/public/protected",
              "private TypeScript : vérification à la compilation",
              "#private JavaScript : vérification à l'exécution",
              "readonly : propriété non modifiable après initialisation",
              "public : accès depuis partout (par défaut)",
            ],
          ),
          section(
            "Modifier la visibilité",
            "Urne conserve nombreVotes et propose voter ainsi que total. La vue demande un vote par la méthode prévue.",
            [
              "private : accessible SEULEMENT dans la classe",
              "public : accessible partout (défaut si non spécifié)",
              "protected : accessible dans classe + sous-classes",
              "readonly : lecture seule après initialisation",
              "Encapsulation : cacher détails internes",
              "DIFFÉRENCE JS : JavaScript ES2022+ a #private (syntaxe différente)",
            ],
          ),
          section(
            "Observer l'état des instances",
            "Deux Urne possèdent leurs propres totaux. Une action sur l'une utilise la même logique tout en conservant l'état de l'autre.",
            [
              "Chaque instance a son propre état (propriétés)",
              "Les méthodes sont partagées (prototype)",
              "this = référence à l'instance courante",
              "Une méthode peut renvoyer le nouveau résultat à afficher",
              "Instances indépendantes",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Classe TypeScript avec visibilité
class Urne {
  // Propriété privée (TypeScript)
  private nombreVotes: number = 0;
  
  // Méthode publique
  public voter(): number {
    this.nombreVotes++;
    return this.nombreVotes;
  }
  
  public total(): number {
    return this.nombreVotes;
  }
  
  // ❌ Cette méthode ne compile pas :
  // private accederDepuisExterieur() {
  //   const urne = new Urne();
  //   urne.nombreVotes; // ❌ Property 'nombreVotes' is private
  // }
}

// Créer instances
const premiere = new Urne();
const seconde = new Urne();

// Voter sur la première
premiere.voter();
premiere.voter();

console.log("Première:", premiere.total()); // 2
console.log("Seconde:", seconde.total()); // 0

// ❌ Erreur de compilation :
// console.log(premiere.nombreVotes); // ❌ Property 'nombreVotes' is private

// Classe avec readonly
class Profil {
  readonly id: number; // Ne peut pas changer après construction
  nom: string;
  
  constructor(id: number, nom: string) {
    this.id = id;
    this.nom = nom;
  }
}

const profil = new Profil(1, "Tiana");
profil.nom = "Tiana Andriamanana"; // ✅ OK
// profil.id = 2; // ❌ Cannot assign to 'id' because it is a read-only property

// DIFFÉRENCE JAVASCRIPT ES2022+ :
// class UrneJS {
//   #nombreVotes = 0; // #private JavaScript (vérification exécution)
//   voter() { return ++this.#nombreVotes; }
// }
// TypeScript private = compilation, JS #private = exécution`,
        ),
        task: "Ajoute une méthode reinitialiser puis teste les deux urnes.",
        takeaway:
          "Classes TypeScript : private/public/protected + readonly. Différent de JavaScript ES6 classes (qui n'ont pas ces modificateurs sauf #private en ES2022+).",
        quiz: quiz(
          "Que vérifie private dans cet exemple TypeScript ?",
          [
            "Les droits du système d'exploitation",
            "Les accès directs à l'attribut dans le code vérifié (compilation)",
            "La présence du réseau",
          ],
          1,
          "Le compilateur TypeScript contrôle l'accès à cet attribut privé À LA COMPILATION.",
        ),
        link: docs + "2/classes.html",
      }),
      lesson({
        id: "ts-constructeur",
        title: "Constructeur et paramètres raccourcis TypeScript",
        minutes: 25,
        summary:
          "Le constructeur prépare une nouvelle instance. TypeScript offre une syntaxe raccourcie : constructor(private nom: string) déclare ET initialise la propriété. protected rend un membre accessible à la classe et à ses classes dérivées.",
        sections: [
          section(
            "Constructeur TypeScript",
            "Le constructeur initialise l'objet. TypeScript permet paramètres avec modificateurs de visibilité (raccourci).",
            [
              "constructor : méthode spéciale d'initialisation",
              "Raccourci TS : constructor(private x: number) déclare + initialise",
              "Équivalent long : déclarer propriété puis this.x = x",
              "Fonctionne avec private, public, protected, readonly",
              "super() : appel constructeur classe parent (héritage)",
              "DIFFÉRENCE JS : JavaScript n'a pas ce raccourci",
            ],
          ),
          section(
            "Héritage avec extends",
            "Profil reçoit un nom que Developpeur réutilise dans sa méthode de présentation. Le constructeur dérivé transmet les données à super.",
            [
              "extends : créer sous-classe (héritage)",
              "super() : appeler constructeur parent",
              "protected : accessible dans classe + sous-classes",
              "public : accessible partout",
              "private : accessible SEULEMENT dans classe",
              "super() doit être appelé AVANT this dans constructeur dérivé",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Classe de base
class Profil {
  // Raccourci TypeScript : déclare + initialise protected nom
  constructor(protected nom: string) {}
  
  afficherNom(): string {
    return this.nom;
  }
}

// Classe dérivée
class Developpeur extends Profil {
  // Raccourci : private outil déclaré + initialisé
  constructor(nom: string, private outil: string) {
    super(nom); // Appel constructeur parent
  }
  
  presenter(): string {
    // Peut accéder à this.nom (protected)
    return \`\${this.nom} utilise \${this.outil}\`;
  }
}

const dev = new Developpeur("Tiana", "NodeGUI");
console.log(dev.presenter()); // "Tiana utilise NodeGUI"
console.log(dev.afficherNom()); // "Tiana"

// ❌ Erreurs :
// console.log(dev.nom); // ❌ Property 'nom' is protected
// console.log(dev.outil); // ❌ Property 'outil' is private

// Équivalent SANS raccourci TypeScript :
class ProfilLong {
  protected nom: string; // Déclaration
  
  constructor(nom: string) {
    this.nom = nom; // Initialisation
  }
}

// Classe avec tous modificateurs
class Exemple {
  public titre: string; // Public explicite
  private compteur = 0; // Private avec valeur par défaut
  protected readonly id: number; // Protected + readonly
  
  constructor(titre: string, id: number) {
    this.titre = titre;
    this.id = id;
  }
}

// DIFFÉRENCE JAVASCRIPT :
// JavaScript n'a PAS le raccourci constructor(private x)
// Il faut toujours : constructor(x) { this.x = x; }`,
        ),
        task: "Crée une seconde classe dérivée Designer avec propriété outil, puis teste l'héritage.",
        takeaway:
          "Constructeur TypeScript : raccourci avec modificateurs. extends = héritage. super() = appel parent. protected = accès sous-classes.",
        quiz: quiz(
          "Quel appel initialise la partie de base ?",
          ["super(nom)", "console.log(nom)", "private(nom)"],
          0,
          "super() appelle le constructeur de la classe de base (parent).",
        ),
        link: docs + "2/classes.html",
      }),
    ],
  },
  {
    id: "ts-nodegui",
    title: "Fenêtre native NodeGUI",
    description: "Créer interfaces graphiques avec widgets Qt",
    lessons: [
      lesson({
        id: "ts-qode",
        title: "NodeGui, Qt et le moteur Qode",
        minutes: 27,
        summary:
          "NodeGui relie TypeScript/JavaScript aux widgets Qt (bibliothèque C++ pour GUI). Qode fournit le runtime qui fait fonctionner ensemble la boucle Node.js et la boucle d'événements Qt. DIFFÉRENT d'Electron (qui utilise HTML/CSS).",
        sections: [
          section(
            "Architecture NodeGUI",
            "NodeGUI = pont entre TypeScript et Qt (C++). Widgets natifs du système.",
            [
              "Qt : framework C++ pour interfaces graphiques (1995)",
              "NodeGUI : bindings Node.js pour Qt",
              "Qode : runtime custom (Node.js + Qt event loop)",
              "Widgets natifs : vrais composants du système d'exploitation",
              "DIFFÉRENT d'Electron : pas de HTML/CSS, widgets natifs",
              "Plus léger qu'Electron (pas de navigateur embarqué)",
            ],
          ),
          section(
            "Préparer le lancement",
            "Le ZIP déclare NodeGui et TypeScript dans package.json. Le guide décrit les outils natifs requis par la plateforme. npm start compile puis lance Qode.",
            [
              "package.json : dépendances (@nodegui/nodegui)",
              "tsconfig.json : configuration TypeScript",
              "Compilation : tsc compile .ts en .js",
              "Exécution : qode (pas node) exécute le .js",
              "La compilation vérifie le code TypeScript",
              "Le module natif et son runtime doivent être compatibles",
            ],
          ),
          section(
            "Construire la fenêtre",
            "QMainWindow reçoit un widget central. show() demande son affichage. Une référence conservée maintient la fenêtre pendant la session.",
            [
              "QMainWindow : fenêtre principale de l'application",
              "Widget central : contenu de la fenêtre",
              "show() : afficher la fenêtre",
              "Référence conservée : empêche garbage collection",
              "Le titre et la taille initiale sont définis avant l'affichage",
              "Les composants sont de vrais widgets Qt",
            ],
          ),
        ],
        files: tsVotes.files,
        task: "Exporte le projet et suis son README puis modifie le titre de la fenêtre.",
        takeaway:
          "NodeGui utilise widgets Qt natifs. Qode = runtime (Node.js + Qt). Différent d'Electron (HTML/CSS).",
        quiz: quiz(
          "Quel runtime lance la fenêtre de cet atelier ?",
          ["JVM", "PHP", "Qode"],
          2,
          "Qode est le runtime utilisé par les scripts de lancement NodeGui.",
        ),
        link: gui + "guides/getting-started/",
      }),
      lesson({
        id: "ts-widgets",
        title: "QLabel, QPushButton et layouts",
        minutes: 24,
        summary:
          "QLabel affiche du texte. QPushButton est un bouton cliquable. Le conteneur central reçoit un layout (FlexLayout) qui distribue ces composants. Layouts gèrent positionnement et redimensionnement.",
        sections: [
          section(
            "Widgets de base Qt",
            "QLabel affiche le total et QPushButton propose l'action de vote. Le conteneur central reçoit un layout qui distribue ces composants.",
            [
              "QLabel : afficher texte ou image",
              "QPushButton : bouton cliquable",
              "QLineEdit : champ de saisie",
              "QWidget : conteneur générique",
              "setText() : définir le texte",
              "setInlineStyle() : style CSS-like (limité)",
            ],
          ),
          section(
            "Layouts Qt : organiser l'espace",
            "La direction column place les éléments l'un sous l'autre. Les marges et le padding créent une hiérarchie lisible.",
            [
              "FlexLayout : layout flexible (comme CSS Flexbox)",
              "Direction : row (horizontal) ou column (vertical)",
              "addWidget() : ajouter widget au layout",
              "Marges : espace autour du layout",
              "Padding : espace interne des widgets",
              "Le parent et le layout organisent les widgets",
            ],
          ),
          section(
            "Styling des widgets",
            "setInlineStyle permet d'appliquer styles CSS-like.",
            [
              "setInlineStyle('font-size: 18px; color: blue;')",
              "Supporte sous-ensemble CSS (pas tout)",
              "Propriétés : font-size, color, background, padding, margin",
              "Alternative : feuilles de style Qt (.qss)",
              "Styles natifs du système par défaut",
            ],
          ),
        ],
        files: tsVotes.files,
        task: "Ajoute un second label expliquant le thème du vote et change sa couleur.",
        takeaway:
          "QLabel = texte, QPushButton = bouton. FlexLayout organise widgets. setInlineStyle pour styles CSS-like.",
        quiz: quiz(
          "Quel composant affiche le total ?",
          ["QLabel", "QLineEdit", "QComboBox"],
          0,
          "Le QLabel présente la valeur textuelle du total.",
        ),
        link: gui + "api/generated/classes/qlabel/",
      }),
    ],
  },
  {
    id: "ts-actions",
    title: "Événements typés et affichage",
    description: "Relier la vue aux méthodes du modèle",
    lessons: [
      lesson({
        id: "ts-clicked",
        title: "Écouter clicked avec addEventListener",
        minutes: 25,
        summary:
          "Le bouton émet le signal 'clicked' lors de son activation. addEventListener enregistre la fonction callback qui demande un vote au modèle puis présente le total obtenu. Les types TypeScript garantissent la cohérence.",
        sections: [
          section(
            "Système d'événements Qt",
            "Qt utilise signaux et slots. NodeGUI expose ça avec addEventListener.",
            [
              "Signal : événement émis par widget (clicked, textChanged)",
              "addEventListener : enregistrer callback pour signal",
              "Callback : fonction appelée quand signal émis",
              "Types TypeScript : callback typé selon signal",
              "Événements Qt ≠ événements DOM (HTML)",
              "Plusieurs listeners peuvent écouter même signal",
            ],
          ),
          section(
            "Suivre l'événement",
            "Le rappel appelle urne.voter() et transmet le résultat au label. L'instance urne existe pendant toute la session de cette fenêtre.",
            [
              "addEventListener('clicked', callback)",
              "Le callback accède aux variables de portée (closure)",
              "this dans callback peut différer (utiliser fonction fléchée)",
              "Le modèle porte les données et la vue présente le résultat",
              "TypeScript vérifie types de callback",
              "Le nom du signal est défini par le widget Qt",
            ],
          ),
          section(
            "Vérifier l'effet",
            "Trois clics doivent afficher trois votes. Un second lancement construit une nouvelle urne initialisée à zéro.",
            [
              "Chaque clic déclenche le callback",
              "État maintenu entre clics (closure)",
              "Une fonction fléchée conserve les références utilisées par le rappel",
              "La fonction est enregistrée avant les interactions de l'utilisateur",
              "Instances indépendantes entre lancements",
            ],
          ),
        ],
        files: tsVotes.files,
        task: "Clique trois fois puis modifie pour ajouter deux votes à chaque action pour observer le changement.",
        takeaway:
          "addEventListener('clicked', callback) écoute événement. Callback typé par TypeScript. Closure conserve état.",
        quiz: quiz(
          "Quand le rappel est-il appelé ?",
          [
            "À chaque compilation",
            "Lors de l'émission de clicked",
            "À chaque import du fichier CSS",
          ],
          1,
          "Le widget appelle le rappel enregistré lorsque son signal clicked est émis.",
        ),
        link: gui + "api/generated/classes/qpushbutton/",
      }),
      lesson({
        id: "ts-contrat-vue",
        title: "Séparer modèle et présentation (MVC-like)",
        minutes: 23,
        summary:
          "urne.ts contient la logique métier (modèle). main.ts construit les widgets et appelle cette logique (vue + contrôleur). Les deux fichiers partagent les signatures contrôlées par TypeScript. Architecture MVC-like.",
        sections: [
          section(
            "Architecture MVC avec TypeScript",
            "Modèle = logique métier. Vue = widgets NodeGUI. Contrôleur = événements.",
            [
              "Modèle : classe avec logique métier (urne.ts)",
              "Vue : widgets NodeGUI (main.ts)",
              "Contrôleur : addEventListener relie vue et modèle",
              "export/import : partager entre fichiers",
              "TypeScript vérifie cohérence entre modules",
              "Séparation des responsabilités",
            ],
          ),
          section(
            "Lire les imports TypeScript",
            "export rend Urne disponible au module de la vue. import la récupère depuis le fichier voisin.",
            [
              "export class Urne : exporter classe",
              "import { Urne } from './urne' : importer classe",
              "Chemins relatifs : ./ ou ../",
              "TypeScript vérifie imports à la compilation",
              "Le modèle peut être testé en console",
              "Les composants graphiques restent dans le module d'interface",
            ],
          ),
          section(
            "Faire évoluer un contrat TypeScript",
            "Si voter() change son type de résultat, les usages peuvent être vérifiés par le compilateur. L'interface doit ensuite présenter la valeur attendue.",
            [
              "Changer signature = erreur de compilation aux usages",
              "TypeScript force mise à jour de tous les appelants",
              "Refactoring sûr grâce aux types",
              "Un nombre devient une chaîne pour le label",
              "Une opération de validation doit rester proche des données qu'elle protège",
            ],
          ),
        ],
        files: projectExample(tsVotes, "src/urne.ts"),
        task: "Ajoute un constructeur recevant le nombre initial de votes puis adapte main.ts.",
        takeaway:
          "Séparer modèle (logique) et vue (GUI). export/import pour modules. TypeScript vérifie cohérence entre fichiers.",
        quiz: quiz(
          "Quel fichier porte la logique de vote ?",
          ["src/urne.ts", "tsconfig.json", "README.md"],
          0,
          "Urne est définie dans src/urne.ts puis importée par la vue.",
        ),
        link: docs + "2/modules.html",
      }),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🔴 NIVEAU AVANCÉ - Génériques, Enums et CRUD SQLite
// ═══════════════════════════════════════════════════════════════════════════

const advanced: WebLevel["chapters"] = [
  {
    id: "ts-generiques",
    title: "Collections génériques",
    description: "Réutiliser du code en conservant les types",
    lessons: [
      lesson({
        id: "ts-generique",
        title: "Définir un paramètre de type <T>",
        minutes: 26,
        summary:
          "Un générique représente une relation entre les types d'entrée et de sortie. <T> est un paramètre de type qui permet de conserver l'information de type pendant le traitement. Comme des 'variables de types'. DIFFÉRENT de JavaScript (pas de génériques).",
        sections: [
          section(
            "Comprendre les génériques TypeScript",
            "<T> = paramètre de type (comme paramètre de fonction, mais pour types).",
            [
              "Générique : fonction/classe qui fonctionne avec plusieurs types",
              "<T> : paramètre de type (convention : lettre majuscule)",
              "T peut être remplacé par n'importe quel type",
              "TypeScript infère T depuis l'argument",
              "Évite duplication de code (DRY)",
              "DIFFÉRENCE JS : JavaScript n'a PAS de génériques",
            ],
          ),
          section(
            "Conserver le type du résultat",
            "premier<T> reçoit une collection de T et renvoie un T ou undefined si la liste est vide. Le même code fonctionne avec des textes ou des nombres.",
            [
              "function premier<T>(valeurs: T[]): T | undefined",
              "T capturé depuis l'argument passé",
              "Résultat garde le type T (pas any)",
              "TypeScript sait que premier(['a']) retourne string | undefined",
              "TypeScript sait que premier([1]) retourne number | undefined",
              "Le paramètre de type peut être inféré depuis l'argument",
            ],
          ),
          section(
            "Éviter perte d'information",
            "Le résultat texte peut être utilisé comme une chaîne après vérification de sa présence. Le résultat numérique conserve ses opérations de nombre.",
            [
              "Sans génériques : retour any (perte de type)",
              "Avec génériques : type conservé",
              "TypeScript vérifie opérations selon type retourné",
              "Le générique décrit une relation de types",
              "La logique de la fonction doit rester valide pour toutes les possibilités acceptées",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Fonction générique avec <T>
function premier<T>(valeurs: readonly T[]): T | undefined {
  return valeurs[0];
}

// TypeScript infère T depuis l'argument
const nom = premier(["Tiana", "Soa"]); // T = string
const note = premier([12, 16]); // T = number

// TypeScript sait que nom est string | undefined
console.log(nom?.toUpperCase()); // ✅ méthode string disponible

// TypeScript sait que note est number | undefined
console.log(note); // ✅ type number

// ❌ Sans génériques (avec any) :
function premierAny(valeurs: any[]): any {
  return valeurs[0];
}

const resultat = premierAny(["texte"]); // Type: any (perte d'info)
// resultat.toUpperCase(); // Aucune autocomplétion, aucune vérification

// Fonction générique avec plusieurs paramètres
function paire<K, V>(cle: K, valeur: V): { cle: K; valeur: V } {
  return { cle, valeur };
}

const p1 = paire("id", 42); // { cle: string, valeur: number }
const p2 = paire(1, "admin"); // { cle: number, valeur: string }

console.log(p1.cle.toUpperCase()); // ✅ TypeScript sait que cle est string
console.log(p2.valeur.toLowerCase()); // ✅ TypeScript sait que valeur est string

// Classe générique
class Boite<T> {
  constructor(private contenu: T) {}
  
  lire(): T {
    return this.contenu;
  }
  
  modifier(nouveau: T): void {
    this.contenu = nouveau;
  }
}

const boiteNombre = new Boite<number>(42);
console.log(boiteNombre.lire() + 10); // ✅ Type number

const boiteTexte = new Boite<string>("hello");
console.log(boiteTexte.lire().toUpperCase()); // ✅ Type string

// DIFFÉRENCE JAVASCRIPT :
// JavaScript n'a PAS de génériques
// Il faut dupliquer code ou perdre types (any)`,
        ),
        task: "Créez une fonction dernier<T> qui retourne le dernier élément d'un tableau.",
        takeaway:
          "<T> = paramètre de type pour génériques. Conserve informations de type. Évite duplication. JavaScript n'a pas ça.",
        quiz: quiz(
          "Que décrit <T> ?",
          [
            "Une variable globale de texte",
            "Un paramètre de type (générique)",
            "Le nom du compilateur",
          ],
          1,
          "T représente le type choisi pour cet usage de la fonction (paramètre de type).",
        ),
        link: docs + "2/generics.html",
      }),
      lesson({
        id: "ts-contraintes",
        title: "Contraindre un générique avec extends",
        minutes: 27,
        summary:
          "Une contrainte générique demande que les valeurs possèdent une forme minimale. <T extends {id: number}> signifie 'T doit avoir au minimum une propriété id de type number'. Depot<T extends {id: number}> peut ainsi comparer les identifiants de tous ses éléments.",
        sections: [
          section(
            "Contraintes génériques",
            "extends dans un générique = contrainte (pas héritage ici).",
            [
              "<T extends Type> : T doit respecter Type",
              "Garantit que T possède certaines propriétés",
              "Permet d'accéder à ces propriétés dans le code générique",
              "extends ici ≠ héritage de classe",
              "extends ici = contrainte de type",
              "Exemple : <T extends {length: number}> pour tableaux/strings",
            ],
          ),
          section(
            "Exprimer le besoin minimal",
            "Le dépôt conserve les objets de type T et refuse les identifiants déjà présents. Les autres propriétés dépendent du modèle fourni.",
            [
              "Depot<T extends {id: number}> accepte tout objet avec id",
              "La contrainte rend item.id accessible dans le code générique",
              "Le type complet de l'élément est conservé lors de la lecture",
              "Autres propriétés de T conservées",
              "Type minimal requis, type complet utilisable",
            ],
          ),
          section(
            "Relier au support",
            "Support construit un Ticket puis le fournit au dépôt. La classe métier valide le titre et choisit le prochain identifiant.",
            [
              "Le dépôt porte la collection générique",
              "Le modèle métier (Ticket) porte les règles",
              "Depot<Ticket> : dépôt spécialisé pour Ticket",
              "Réutilisable avec autres types (Profil, Commande, etc.)",
              "Séparation : logique collection vs logique métier",
            ],
          ),
        ],
        files: projectExample(tsSupport, "src/modeles.ts"),
        task: "Repère la contrainte sur T et explique pourquoi le dépôt peut lire item.id.",
        takeaway:
          "<T extends Type> = contrainte générique. Garantit propriétés minimales. Permet accès dans code générique.",
        quiz: quiz(
          "Que garantit <T extends {id: number}> ?",
          [
            "Chaque élément possède une propriété id de type number",
            "Chaque élément est un nombre seul",
            "Chaque tableau reste vide",
          ],
          0,
          "La contrainte exige une propriété id de type number (minimum).",
        ),
        link: docs + "2/generics.html#generic-constraints",
      }),
    ],
  },
  {
    id: "ts-choix-modeles",
    title: "Enums et règles du modèle",
    description: "Modéliser choix fixes avec enums TypeScript",
    lessons: [
      lesson({
        id: "ts-enums",
        title: "Enums : priorités et statuts nommés",
        minutes: 24,
        summary:
          "Un enum donne des noms aux choix d'un ensemble. Le projet distingue la priorité Basse, Moyenne ou Haute du statut Ouvert, En cours ou Fermé. Les enums TypeScript sont compilés en objets JavaScript. DIFFÉRENT de JavaScript (pas d'enums natifs).",
        sections: [
          section(
            "Enums TypeScript vs littéraux",
            "Enum = ensemble de constantes nommées. Alternative : union de littéraux.",
            [
              "enum : type TypeScript pour choix fixes",
              "Membres : valeurs nommées de l'enum",
              "Enums numériques : valeurs 0, 1, 2, ... (par défaut)",
              "Enums string : valeurs textuelles explicites",
              "Alternative : type Priorite = 'basse' | 'moyenne' | 'haute'",
              "DIFFÉRENCE JS : JavaScript n'a pas d'enums (utiliser const obj)",
            ],
          ),
          section(
            "Nommer les valeurs",
            "Les enums textuels rendent les libellés lisibles dans le modèle et dans la vue. Un nouveau ticket commence avec StatutTicket.Ouvert.",
            [
              "enum StatutTicket { Ouvert = 'ouvert', ... }",
              "Accès : StatutTicket.Ouvert",
              "Valeur string : garantit stabilité sérialisation",
              "Le menu présente les choix de Priorite",
              "Compilation : enum → objet JavaScript",
              "Une union de littéraux constitue aussi une option de modélisation de choix fixes",
            ],
          ),
          section(
            "Associer le choix à l'objet",
            "Le formulaire lit l'index courant puis récupère la priorité correspondante dans sa liste de choix.",
            [
              "Propriété de classe utilise enum comme type",
              "Valeur par défaut depuis enum",
              "Menu déroulant peuplé depuis membres enum",
              "Object.values(Enum) pour lister membres",
              "Une valeur de repli couvre un index absent",
              "Les données provenant de l'extérieur doivent être validées avant leur utilisation",
            ],
          ),
        ],
        files: projectExample(tsSupport, "src/modeles.ts"),
        task: "Ajoute une priorité Urgente puis adapte la liste des choix du formulaire.",
        takeaway:
          "enum = choix fixes nommés. Enums string recommandés. Alternative : union de littéraux. JavaScript n'a pas d'enums natifs.",
        quiz: quiz(
          "Différence entre enum et union de littéraux ?",
          ["Aucune", "Enum est objet JS compilé, union est juste types", "Enum est plus rapide"],
          1,
          "Enum existe à l'exécution (objet JS). Union de littéraux n'existe qu'à la compilation (types effacés).",
        ),
        link: docs + "2/enums.html",
      }),
    ],
  },
  {
    id: "ts-crud-sqlite",
    title: "CRUD avec TypeScript + NodeGUI + SQLite",
    description: "Application complète : interface graphique + base de données",
    lessons: [
      lesson({
        id: "ts-sqlite-intro",
        title: "SQLite avec better-sqlite3 et TypeScript",
        minutes: 30,
        summary:
          "SQLite est une base de données embarquée (fichier .db). better-sqlite3 est la bibliothèque Node.js pour SQLite (bindings natifs). TypeScript permet de typer les requêtes et résultats. Base de données relationnelle dans un fichier local.",
        sections: [
          section(
            "SQLite vs autres bases",
            "SQLite = base embarquée (pas de serveur). Parfaite pour apps desktop.",
            [
              "SQLite : base relationnelle dans un fichier",
              "Pas de serveur : base embarquée dans l'app",
              "Fichier .db contient toute la base",
              "Parfait pour : apps desktop, mobile, embedded",
              "Alternative : PostgreSQL, MySQL (serveur requis)",
              "better-sqlite3 : plus rapide que sqlite3 (synchrone)",
            ],
          ),
          section(
            "Installation better-sqlite3",
            "Installation nécessite compilation native (comme NodeGUI).",
            [
              "npm install better-sqlite3",
              "npm install --save-dev @types/better-sqlite3",
              "Compilation native requise (Node-gyp)",
              "Types TypeScript pour autocomplétion",
              "API synchrone (plus simple que sqlite3)",
              "Prérequis : mêmes que NodeGUI (compilateur C++)",
            ],
          ),
          section(
            "Créer et ouvrir base de données",
            "Database() crée/ouvre fichier .db. exec() exécute SQL.",
            [
              "new Database('contacts.db') : créer/ouvrir base",
              "exec(sql) : exécuter SQL (CREATE TABLE, etc.)",
              "prepare(sql) : préparer statement (sécurité)",
              "run(), get(), all() : exécuter requêtes",
              "close() : fermer base (important)",
              "Transactions : begin(), commit(), rollback()",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// Installation :
// npm install better-sqlite3
// npm install --save-dev @types/better-sqlite3

import Database from "better-sqlite3";

// Interface TypeScript pour les données
interface Contact {
  id?: number; // ? car généré par base
  nom: string;
  email: string;
  telephone: string;
}

// Créer/ouvrir base de données
const db = new Database("contacts.db");

// Créer table (si n'existe pas)
db.exec(\`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT NOT NULL
  )
\`);

console.log("✅ Base de données créée/ouverte");
console.log("📁 Fichier : contacts.db");

// Exemple : insérer données
const insert = db.prepare(\`
  INSERT INTO contacts (nom, email, telephone)
  VALUES (?, ?, ?)
\`);

insert.run("Tiana", "tiana@example.com", "+261 34 00 000 00");
insert.run("Soa", "soa@example.com", "+261 34 11 111 11");

console.log("✅ Contacts insérés");

// Exemple : lire toutes les données
const selectAll = db.prepare("SELECT * FROM contacts");
const contacts: Contact[] = selectAll.all() as Contact[];

console.log("\\n📋 Contacts :");
contacts.forEach(c => {
  console.log(\`  ID: \${c.id}, Nom: \${c.nom}, Email: \${c.email}\`);
});

// Fermer base
db.close();

// TYPAGE TYPESCRIPT :
// Interface Contact garantit structure des données
// TypeScript vérifie types des paramètres SQL
// Autocomplétion sur propriétés (c.nom, c.email, etc.)

// DIFFÉRENCE JAVASCRIPT :
// JavaScript accepterait n'importe quelle structure
// TypeScript force cohérence entre interface et SQL`,
        ),
        task: "Créez une base produits.db avec table produits (nom, prix, stock). Insérez 3 produits.",
        takeaway:
          "SQLite = base embarquée dans fichier. better-sqlite3 pour Node.js. TypeScript type les requêtes. Parfait pour apps desktop.",
        quiz: quiz(
          "Quelle différence entre SQLite et PostgreSQL ?",
          ["Aucune", "SQLite = fichier embarqué, PostgreSQL = serveur", "SQLite est plus lent"],
          1,
          "SQLite est une base embarquée (fichier .db). PostgreSQL nécessite un serveur de base de données.",
        ),
        link: "https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md",
      }),
      lesson({
        id: "ts-crud-operations",
        title: "CRUD : Create, Read, Update, Delete",
        minutes: 35,
        summary:
          "CRUD = 4 opérations fondamentales sur base de données. Create (INSERT), Read (SELECT), Update (UPDATE), Delete (DELETE). Prepared statements pour sécurité (éviter injection SQL). TypeScript type les résultats.",
        sections: [
          section(
            "Les 4 opérations CRUD",
            "CRUD = Create, Read, Update, Delete (opérations de base).",
            [
              "CREATE : INSERT INTO table VALUES (...)",
              "READ : SELECT * FROM table WHERE ...",
              "UPDATE : UPDATE table SET ... WHERE ...",
              "DELETE : DELETE FROM table WHERE ...",
              "Prepared statements : db.prepare(sql).run/get/all()",
              "Placeholders (?) : éviter injection SQL",
            ],
          ),
          section(
            "Prepared statements (sécurité)",
            "Préparer requête une fois, exécuter plusieurs fois. Sécurisé contre injection SQL.",
            [
              "prepare(sql) : compiler requête SQL",
              "Placeholders ? remplacés par valeurs",
              "run(params) : exécuter (INSERT, UPDATE, DELETE)",
              "get(params) : retourner 1 ligne (SELECT)",
              "all(params) : retourner toutes lignes (SELECT)",
              "JAMAIS concaténer valeurs dans SQL (injection !)",
            ],
          ),
          section(
            "Typage TypeScript des résultats",
            "Interface définit structure, cast 'as' applique type aux résultats SQL.",
            [
              "Interface décrit structure table",
              "SELECT retourne any par défaut",
              "Cast 'as Contact[]' pour typage",
              "TypeScript vérifie accès propriétés",
              "Autocomplétion sur résultats",
              "Type guard pour validation runtime si besoin",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `import Database from "better-sqlite3";

interface Contact {
  id?: number;
  nom: string;
  email: string;
  telephone: string;
}

const db = new Database("contacts.db");

// Créer table
db.exec(\`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT NOT NULL
  )
\`);

// ═══════════════════════════════════════════════════════════════
// CREATE : Insérer contact
// ═══════════════════════════════════════════════════════════════
function creerContact(nom: string, email: string, telephone: string): number {
  const stmt = db.prepare(\`
    INSERT INTO contacts (nom, email, telephone)
    VALUES (?, ?, ?)
  \`);
  
  const info = stmt.run(nom, email, telephone);
  return info.lastInsertRowid as number; // ID du contact créé
}

const id1 = creerContact("Tiana", "tiana@example.com", "+261 34 00 000 00");
console.log("✅ Contact créé, ID:", id1);

// ═══════════════════════════════════════════════════════════════
// READ : Lire tous les contacts
// ═══════════════════════════════════════════════════════════════
function lireTousContacts(): Contact[] {
  const stmt = db.prepare("SELECT * FROM contacts");
  return stmt.all() as Contact[]; // Cast TypeScript
}

const contacts = lireTousContacts();
console.log("\\n📋 Tous les contacts:", contacts);

// ═══════════════════════════════════════════════════════════════
// READ : Lire un contact par ID
// ═══════════════════════════════════════════════════════════════
function lireContact(id: number): Contact | undefined {
  const stmt = db.prepare("SELECT * FROM contacts WHERE id = ?");
  return stmt.get(id) as Contact | undefined;
}

const contact = lireContact(id1);
console.log("\\n📄 Contact ID", id1, ":", contact);

// ═══════════════════════════════════════════════════════════════
// UPDATE : Modifier contact
// ═══════════════════════════════════════════════════════════════
function modifierContact(id: number, nom: string, email: string, telephone: string): boolean {
  const stmt = db.prepare(\`
    UPDATE contacts
    SET nom = ?, email = ?, telephone = ?
    WHERE id = ?
  \`);
  
  const info = stmt.run(nom, email, telephone, id);
  return info.changes > 0; // true si ligne modifiée
}

const modifie = modifierContact(id1, "Tiana Andriamanana", "tiana.new@example.com", "+261 34 00 000 00");
console.log("\\n✏️ Modification:", modifie ? "succès" : "échec");

// ═══════════════════════════════════════════════════════════════
// DELETE : Supprimer contact
// ═══════════════════════════════════════════════════════════════
function supprimerContact(id: number): boolean {
  const stmt = db.prepare("DELETE FROM contacts WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0; // true si ligne supprimée
}

// (Ne supprimons pas pour l'exemple)
// const supprime = supprimerContact(id1);
// console.log("\\n🗑️ Suppression:", supprime ? "succès" : "échec");

db.close();

// SÉCURITÉ : Placeholders (?) évitent injection SQL
// ❌ DANGEREUX : "SELECT * FROM contacts WHERE nom = '" + nom + "'"
// ✅ SÛR : prepare("SELECT * FROM contacts WHERE nom = ?").get(nom)`,
        ),
        task: "Implémentez CRUD complet pour table produits : créer, lire, modifier, supprimer.",
        takeaway:
          "CRUD = Create/Read/Update/Delete. Prepared statements sécurisent. TypeScript type résultats. Placeholders (?) évitent injection SQL.",
        quiz: quiz(
          "Pourquoi utiliser prepared statements ?",
          ["Plus joli", "Éviter injection SQL + performance", "Obligatoire"],
          1,
          "Prepared statements évitent injection SQL (sécurité) et sont plus rapides (compilés une fois).",
        ),
        link: "https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md",
      }),
      lesson({
        id: "ts-nodegui-sqlite-gui",
        title: "Interface NodeGUI pour gérer contacts (liste + formulaire)",
        minutes: 45,
        summary:
          "Application complète : liste contacts avec QTableWidget, formulaire ajout/modification avec QLineEdit, boutons actions. Architecture MVC : modèle (SQLite), vue (NodeGUI), contrôleur (événements). Projet final du cours TypeScript.",
        sections: [
          section(
            "Architecture de l'application",
            "Modèle = base SQLite. Vue = widgets NodeGUI. Contrôleur = événements.",
            [
              "Modèle : classe ContactManager avec CRUD SQLite",
              "Vue : QMainWindow + QTableWidget + formulaire",
              "Contrôleur : addEventListener relie vue et modèle",
              "Séparation des responsabilités (MVC)",
              "main.ts : vue + contrôleur",
              "contactManager.ts : modèle + CRUD",
            ],
          ),
          section(
            "Widgets utilisés",
            "QTableWidget pour liste, QLineEdit pour formulaire, QPushButton pour actions.",
            [
              "QTableWidget : tableau de données (lignes/colonnes)",
              "QLineEdit : champ de saisie texte",
              "QPushButton : boutons (Ajouter, Modifier, Supprimer)",
              "QVBoxLayout/QHBoxLayout : organiser widgets",
              "QLabel : titres et labels formulaire",
              "FlexLayout : alternative layout flexible",
            ],
          ),
          section(
            "Fonctionnalités complètes",
            "CRUD complet avec interface graphique utilisateur.",
            [
              "Afficher liste contacts dans tableau",
              "Ajouter nouveau contact via formulaire",
              "Modifier contact sélectionné",
              "Supprimer contact sélectionné",
              "Actualiser tableau après chaque opération",
              "Validation formulaire (champs requis)",
              "Messages feedback utilisateur",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          `// ═══════════════════════════════════════════════════════════════
// contactManager.ts - Modèle (CRUD SQLite)
// ═══════════════════════════════════════════════════════════════
import Database from "better-sqlite3";

export interface Contact {
  id?: number;
  nom: string;
  email: string;
  telephone: string;
}

export class ContactManager {
  private db: Database.Database;
  
  constructor(dbPath: string = "contacts.db") {
    this.db = new Database(dbPath);
    this.initialiserBase();
  }
  
  private initialiserBase(): void {
    this.db.exec(\`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        email TEXT NOT NULL,
        telephone TEXT NOT NULL
      )
    \`);
  }
  
  creer(nom: string, email: string, telephone: string): number {
    const stmt = this.db.prepare(\`
      INSERT INTO contacts (nom, email, telephone)
      VALUES (?, ?, ?)
    \`);
    const info = stmt.run(nom, email, telephone);
    return info.lastInsertRowid as number;
  }
  
  lireTous(): Contact[] {
    const stmt = this.db.prepare("SELECT * FROM contacts ORDER BY nom");
    return stmt.all() as Contact[];
  }
  
  lireUn(id: number): Contact | undefined {
    const stmt = this.db.prepare("SELECT * FROM contacts WHERE id = ?");
    return stmt.get(id) as Contact | undefined;
  }
  
  modifier(id: number, nom: string, email: string, telephone: string): boolean {
    const stmt = this.db.prepare(\`
      UPDATE contacts SET nom = ?, email = ?, telephone = ?
      WHERE id = ?
    \`);
    const info = stmt.run(nom, email, telephone, id);
    return info.changes > 0;
  }
  
  supprimer(id: number): boolean {
    const stmt = this.db.prepare("DELETE FROM contacts WHERE id = ?");
    const info = stmt.run(id);
    return info.changes > 0;
  }
  
  fermer(): void {
    this.db.close();
  }
}

// ═══════════════════════════════════════════════════════════════
// main.ts - Vue + Contrôleur (NodeGUI)
// ═══════════════════════════════════════════════════════════════
import {
  QMainWindow, QWidget, QTableWidget, QTableWidgetItem,
  QLineEdit, QPushButton, QLabel, FlexLayout, Direction
} from "@nodegui/nodegui";
import { ContactManager } from "./contactManager";

// Créer gestionnaire contacts
const manager = new ContactManager();

// Fenêtre principale
const win = new QMainWindow();
win.setWindowTitle("Gestionnaire de Contacts - TypeScript + NodeGUI + SQLite");
win.resize(800, 600);

const central = new QWidget();
const layout = new FlexLayout();
layout.setFlexDirection(Direction.TopToBottom);
central.setLayout(layout);

// ═══ Formulaire ═══
const formLabel = new QLabel();
formLabel.setText("📝 Ajouter/Modifier Contact");
formLabel.setInlineStyle("font-size: 16px; font-weight: bold; padding: 10px;");

const inputNom = new QLineEdit();
inputNom.setPlaceholderText("Nom complet");

const inputEmail = new QLineEdit();
inputEmail.setPlaceholderText("Email");

const inputTel = new QLineEdit();
inputTel.setPlaceholderText("Téléphone");

const btnAjouter = new QPushButton();
btnAjouter.setText("➕ Ajouter");

const btnModifier = new QPushButton();
btnModifier.setText("✏️ Modifier");

const btnSupprimer = new QPushButton();
btnSupprimer.setText("🗑️ Supprimer");

// ═══ Tableau contacts ═══
const table = new QTableWidget();
table.setColumnCount(4);
table.setHorizontalHeaderLabels(["ID", "Nom", "Email", "Téléphone"]);

// Fonction : actualiser tableau
function actualiserTableau() {
  const contacts = manager.lireTous();
  table.setRowCount(contacts.length);
  
  contacts.forEach((contact, index) => {
    table.setItem(index, 0, new QTableWidgetItem(\`\${contact.id}\`));
    table.setItem(index, 1, new QTableWidgetItem(contact.nom));
    table.setItem(index, 2, new QTableWidgetItem(contact.email));
    table.setItem(index, 3, new QTableWidgetItem(contact.telephone));
  });
}

// ═══ Événements ═══

// Ajouter contact
btnAjouter.addEventListener("clicked", () => {
  const nom = inputNom.text();
  const email = inputEmail.text();
  const tel = inputTel.text();
  
  if (!nom || !email || !tel) {
    console.log("❌ Tous les champs sont requis");
    return;
  }
  
  manager.creer(nom, email, tel);
  actualiserTableau();
  
  // Vider formulaire
  inputNom.clear();
  inputEmail.clear();
  inputTel.clear();
  
  console.log("✅ Contact ajouté");
});

// Modifier contact
btnModifier.addEventListener("clicked", () => {
  const row = table.currentRow();
  if (row < 0) {
    console.log("⚠️ Sélectionnez un contact");
    return;
  }
  
  const idItem = table.item(row, 0);
  if (!idItem) return;
  
  const id = parseInt(idItem.text());
  const nom = inputNom.text();
  const email = inputEmail.text();
  const tel = inputTel.text();
  
  if (!nom || !email || !tel) {
    console.log("❌ Tous les champs sont requis");
    return;
  }
  
  manager.modifier(id, nom, email, tel);
  actualiserTableau();
  console.log("✅ Contact modifié");
});

// Supprimer contact
btnSupprimer.addEventListener("clicked", () => {
  const row = table.currentRow();
  if (row < 0) {
    console.log("⚠️ Sélectionnez un contact");
    return;
  }
  
  const idItem = table.item(row, 0);
  if (!idItem) return;
  
  const id = parseInt(idItem.text());
  manager.supprimer(id);
  actualiserTableau();
  
  inputNom.clear();
  inputEmail.clear();
  inputTel.clear();
  
  console.log("✅ Contact supprimé");
});

// Clic sur ligne tableau : remplir formulaire
table.addEventListener("cellClicked", (row: number) => {
  const idItem = table.item(row, 0);
  if (!idItem) return;
  
  const id = parseInt(idItem.text());
  const contact = manager.lireUn(id);
  
  if (contact) {
    inputNom.setText(contact.nom);
    inputEmail.setText(contact.email);
    inputTel.setText(contact.telephone);
  }
});

// ═══ Assembler interface ═══
layout.addWidget(formLabel);
layout.addWidget(inputNom);
layout.addWidget(inputEmail);
layout.addWidget(inputTel);
layout.addWidget(btnAjouter);
layout.addWidget(btnModifier);
layout.addWidget(btnSupprimer);
layout.addWidget(table);

win.setCentralWidget(central);

// Initialiser
actualiserTableau();
win.show();

console.log("🚀 Application lancée !");
console.log("📊 CRUD complet : Create, Read, Update, Delete");
console.log("💾 Base de données : contacts.db");

// ARCHITECTURE :
// - ContactManager : modèle (logique + SQLite)
// - main.ts : vue (NodeGUI) + contrôleur (événements)
// - TypeScript : types garantissent cohérence
// - MVC-like : séparation des responsabilités`,
        ),
        task: "Extension : ajoutez champ 'adresse', bouton 'Rechercher', export CSV, ou validation email avec regex.",
        takeaway:
          "Application complète TypeScript + NodeGUI + SQLite. CRUD avec GUI. Architecture MVC. Projet final du cours.",
        quiz: quiz(
          "Quels sont les 3 composants de l'architecture MVC ?",
          ["HTML, CSS, JS", "Modèle, Vue, Contrôleur", "Tableau, Formulaire, Bouton"],
          1,
          "MVC = Modèle (données/logique), Vue (interface), Contrôleur (événements/coordination).",
        ),
        link: gui + "api/generated/classes/qtablewidget/",
      }),
    ],
  },
];


// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DES NIVEAUX
// ═══════════════════════════════════════════════════════════════════════════

export const typescriptLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "TypeScript et NodeGUI pour GUI desktop",
    color: levelColors[0],
    definition:
      "TypeScript enrichit JavaScript avec une vérification statique des types et produit du JavaScript exécutable. NodeGUI permet de créer des interfaces graphiques natives avec TypeScript.",
    objective:
      "Installer TypeScript et NodeGUI. Comprendre types, interfaces, fonctions typées. Créer premières fenêtres GUI.",
    prerequisites: "Comprendre les variables et fonctions JavaScript de base. Node.js installé.",
    outcomes: [
      "Installer TypeScript et compiler avec tsc",
      "Installer NodeGUI pour créer GUI desktop natives",
      "Utiliser types primitifs et interfaces TypeScript",
      "Différencier TypeScript de JavaScript",
      "Typer fonctions et valider données externes avec type guards",
      "Créer première application GUI avec NodeGUI",
    ],
    chapters: beginner,
    projects: [tsProfiles],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Classes TypeScript et widgets NodeGUI",
    color: levelColors[1],
    definition:
      "NodeGUI permet de piloter des widgets Qt avec TypeScript et utilise Qode (Node.js + Qt) pour sa boucle d'événements.",
    objective: "Maîtriser POO TypeScript (classes, visibilité, héritage). Construire interfaces GUI avec widgets et événements NodeGUI.",
    prerequisites:
      "Niveau débutant complété. Connaître les interfaces et les fonctions TypeScript. NodeGUI installé.",
    outcomes: [
      "Créer classes TypeScript avec modificateurs de visibilité",
      "Utiliser constructeur, private, public, protected, readonly",
      "Comprendre différence TypeScript classes vs JavaScript classes",
      "Assembler fenêtre Qt avec widgets (QLabel, QPushButton)",
      "Gérer événements avec addEventListener",
      "Séparer modèle (logique) et vue (GUI) avec modules",
    ],
    chapters: intermediate,
    projects: [tsVotes],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Génériques, Enums et CRUD SQLite",
    color: levelColors[2],
    definition:
      "Les génériques conservent les relations de types dans un traitement réutilisable. Les enums donnent des noms aux choix du modèle. SQLite permet stockage persistant.",
    objective:
      "Maîtriser génériques TypeScript. Utiliser enums pour choix fixes. Créer application CRUD complète avec NodeGUI + SQLite (comme Java/JavaFX et C++/FLTK).",
    prerequisites: "Niveaux débutant et intermédiaire complétés. Comprendre classes, callbacks et widgets NodeGUI.",
    outcomes: [
      "Créer fonctions et classes génériques avec <T>",
      "Contraindre génériques avec extends",
      "Utiliser enums pour modéliser choix fixes",
      "Installer et utiliser SQLite avec better-sqlite3",
      "Implémenter CRUD complet (Create, Read, Update, Delete)",
      "Créer interface GUI complète : formulaire + tableau + base de données",
      "Construire application desktop TypeScript complète (MVC)",
    ],
    chapters: advanced,
    projects: [tsSupport],
  },
];
