import { jsFiles, lesson, levelColors, quiz, section } from "./courseAuthoring";
import { javascriptProjects } from "./javascriptProjects";
import type { WebLevel } from "./webCourseTypes";

const mdn = "https://developer.mozilla.org/fr/docs/";
const js = mdn + "Web/JavaScript/";

// ═══════════════════════════════════════════════════════════════════════════
// 🟢 NIVEAU DÉBUTANT - Fondamentaux JavaScript ES6+
// ═══════════════════════════════════════════════════════════════════════════

const beginner: WebLevel["chapters"] = [
  {
    id: "js-introduction",
    title: "Introduction à JavaScript",
    description: "Découvrir JavaScript et son environnement",
    lessons: [
      lesson({
        id: "js-intro-langage",
        title: "Qu'est-ce que JavaScript ?",
        minutes: 15,
        summary:
          "JavaScript est le langage de programmation du web. Il rend les pages interactives et peut aussi créer des serveurs avec Node.js. Ce cours te mènera des bases jusqu'aux applications web complètes.",
        sections: [
          section(
            "JavaScript : Le langage du web",
            "JavaScript est partout sur le web : sites interactifs, applications mobiles, serveurs.",
            [
              "Frontend : interactions dans le navigateur (clics, animations)",
              "Backend : serveurs avec Node.js",
              "JavaScript = JS (abréviation courante)",
              "ECMAScript = standard du langage (ES6, ES2020, etc.)",
              "Interprété : pas besoin de compilation",
              "Syntaxe proche de C/Java mais plus flexible",
            ]
          ),
          section(
            "Déroulement de la formation",
            "Trois niveaux progressifs sans framework pour comprendre les bases.",
            [
              "🟢 Débutant : Variables, fonctions, tableaux, objets",
              "🟡 Intermédiaire : POO, méthodes avancées, modules",
              "🔴 Avancé : DOM, événements, CSS dynamique, Async/Await, Fetch API",
            ]
          ),
          section(
            "Premiers pas",
            "Deux environnements pour exécuter JavaScript.",
            [
              "Console navigateur : F12 → Console (pour tests rapides)",
              "Node.js : exécuter JS dans le terminal (npm, serveurs)",
              "VS Code : éditeur recommandé",
              "Extensions utiles : Live Server, ESLint",
            ]
          ),
        ],
        files: jsFiles(
          "Premier programme",
          '<h1>JavaScript</h1><p id="demo">Prêt à démarrer ?</p>',
          `// Premier programme JavaScript
console.log("Bonjour DevAfrica !");
console.log("Je commence JavaScript 🚀");

// Modifier le DOM
const paragraphe = document.querySelector("#demo");
paragraphe.textContent = "JavaScript fonctionne !";`,
        ),
        task: "Modifie le message affiché dans le paragraphe avec ton propre texte.",
        takeaway:
          "JavaScript rend les pages web interactives. Console pour tester, Node.js pour serveurs. ES6+ = syntaxe moderne.",
        quiz: quiz(
          "Où s'exécute principalement JavaScript ?",
          ["Seulement serveur", "Navigateur et serveur (Node.js)", "Base de données"],
          1,
          "JavaScript s'exécute dans le navigateur (frontend) et peut aussi tourner sur serveur avec Node.js (backend)."
        ),
        link: js + "Guide",
      }),
    ],
  },
  {
    id: "js-variables-types",
    title: "Variables et types",
    description: "let, const, var et types primitifs",
    lessons: [
      lesson({
        id: "js-let-const-var",
        title: "let, const et var : les différences",
        minutes: 20,
        summary:
          "En JavaScript moderne (ES6+), on utilise let et const. var est l'ancienne syntaxe. const pour valeurs constantes, let pour variables modifiables.",
        sections: [
          section(
            "const : valeur constante",
            "const déclare une variable dont la valeur ne change pas.",
            [
              "const nom = 'Alice'; // Ne peut pas être réassigné",
              "Utiliser const par défaut",
              "Erreur si tentative de réassignation",
              "Portée : block scope (entre {})",
              "Must avoir une valeur initiale",
            ]
          ),
          section(
            "let : valeur modifiable",
            "let pour variables qui changeront.",
            [
              "let compteur = 0; compteur++; // OK",
              "Portée : block scope (comme const)",
              "Peut être réassigné",
              "Peut être déclaré sans valeur initiale",
            ]
          ),
          section(
            "var : ancienne syntaxe (à éviter)",
            "var était utilisé avant ES6. Évitez-le.",
            [
              "Portée : function scope (problématique)",
              "Hoisting : déclaration remontée en haut",
              "Peut causer bugs subtils",
              "Utiliser let ou const à la place",
            ]
          ),
        ],
        files: jsFiles(
          "Variables let et const",
          '<h1>Variables</h1><div id="output"></div>',
          `// const : constante
const pi = 3.14159;
console.log("Pi:", pi);
// pi = 3.14; // ❌ Erreur !

// let : variable modifiable
let compteur = 0;
console.log("Début:", compteur);
compteur = compteur + 1;
compteur++; // Équivalent à compteur = compteur + 1
console.log("Après incrémentation:", compteur);

// var : ancien (à éviter)
var ancienneVariable = "Utiliser let ou const à la place";

// Afficher dans le DOM
const output = document.querySelector("#output");
output.innerHTML = \`
  <p>Pi (const): \${pi}</p>
  <p>Compteur (let): \${compteur}</p>
\`;`,
        ),
        task: "Déclare 3 constantes pour ton nom, âge et ville, puis une variable compteur qui s'incrémente.",
        takeaway:
          "const par défaut, let si besoin de réassigner. Éviter var. Block scope pour const et let.",
        quiz: quiz(
          "Quelle différence entre let et const ?",
          ["Aucune", "const ne peut pas être réassigné, let oui", "let est plus rapide"],
          1,
          "const crée une constante (valeur fixe). let permet de réassigner la variable."
        ),
        link: js + "Reference/Statements/const",
      }),
      lesson({
        id: "js-types-primitifs",
        title: "Types primitifs : string, number, boolean",
        minutes: 20,
        summary:
          "JavaScript a plusieurs types primitifs : string (texte), number (nombres), boolean (vrai/faux), null, undefined. typeof pour vérifier le type.",
        sections: [
          section(
            "Les types de base",
            "Types primitifs en JavaScript.",
            [
              "string : 'texte' ou \"texte\" ou `template`",
              "number : 42, 3.14, -10 (int et float = number)",
              "boolean : true ou false",
              "null : absence de valeur intentionnelle",
              "undefined : variable déclarée sans valeur",
              "typeof variable : obtenir le type",
            ]
          ),
          section(
            "Template literals (ES6)",
            "Backticks pour chaînes avec variables.",
            [
              "const nom = 'Alice'; `Bonjour ${nom}` → 'Bonjour Alice'",
              "Multi-lignes possibles",
              "Expressions dans ${...}",
              "Plus pratique que concaténation (+)",
            ]
          ),
        ],
        files: jsFiles(
          "Types primitifs",
          '<h1>Types</h1><pre id="output"></pre>',
          `// Types primitifs
const nom = "Alice";           // string
const age = 25;                // number
const estMajeur = true;        // boolean
const adresse = null;          // null
let ville;                     // undefined

// typeof
console.log(typeof nom);       // "string"
console.log(typeof age);       // "number"
console.log(typeof estMajeur); // "boolean"
console.log(typeof adresse);   // "object" (bug historique JS)
console.log(typeof ville);     // "undefined"

// Template literals
const message = \`Je m'appelle \${nom} et j'ai \${age} ans.\`;
console.log(message);

// Affichage
document.querySelector("#output").textContent = \`
Nom: \${nom} (type: \${typeof nom})
Âge: \${age} (type: \${typeof age})
Majeur: \${estMajeur} (type: \${typeof estMajeur})
Message: \${message}
\`;`,
        ),
        task: "Crée des variables pour ton profil : nom, age, estEtudiant. Utilise template literals pour afficher.",
        takeaway:
          "Types : string, number, boolean, null, undefined. Template literals avec backticks. typeof pour vérifier type.",
        quiz: quiz(
          "Comment insérer une variable dans une string ?",
          ["'Bonjour ' + nom", "`Bonjour ${nom}`", "Les deux"],
          2,
          "Les deux fonctionnent. Template literals (`${nom}`) sont plus modernes et lisibles."
        ),
        link: js + "Data_structures",
      }),
      lesson({
        id: "js-operateurs",
        title: "Opérateurs arithmétiques et comparaison",
        minutes: 15,
        summary:
          "Opérateurs : +, -, *, /, % pour calculs. ==, ===, !=, !== pour comparaisons. === recommandé (compare valeur ET type).",
        sections: [
          section(
            "Opérateurs arithmétiques",
            "Calculs mathématiques de base.",
            [
              "+ : addition", "- : soustraction", "* : multiplication",
              "/ : division", "% : modulo (reste)", "** : puissance",
              "++ : incrémentation", "-- : décrémentation",
            ]
          ),
          section(
            "Comparaison : == vs ===",
            "Différence importante en JavaScript.",
            [
              "=== : égalité stricte (valeur ET type)",
              "== : égalité souple (conversion automatique)",
              "5 === '5' → false (types différents)",
              "5 == '5' → true (conversion en nombre)",
              "Toujours préférer ===",
              "!==, !=, <, >, <=, >=",
            ]
          ),
        ],
        files: jsFiles(
          "Opérateurs",
          '<h1>Calculs</h1><pre id="output"></pre>',
          `// Arithmétique
const a = 10, b = 3;
console.log("Addition:", a + b);      // 13
console.log("Soustraction:", a - b);  // 7
console.log("Multiplication:", a * b); // 30
console.log("Division:", a / b);       // 3.333...
console.log("Modulo:", a % b);         // 1
console.log("Puissance:", a ** 2);     // 100

// Comparaison === vs ==
console.log("\\n=== vs ==");
console.log(5 === 5);     // true
console.log(5 === "5");   // false (types différents)
console.log(5 == "5");    // true (conversion automatique)

// Logiques
console.log("\\nLogiques");
console.log(true && false);  // false (ET)
console.log(true || false);  // true (OU)
console.log(!true);          // false (NON)

document.querySelector("#output").textContent = \`
10 + 3 = \${a + b}
10 === 10: \${10 === 10}
10 === "10": \${10 === "10"}
\`;`,
        ),
        task: "Calcule l'aire d'un rectangle (largeur * hauteur). Compare deux valeurs avec ===.",
        takeaway:
          "Opérateurs : +, -, *, /, %. === strict (type + valeur), == souple (conversion). Préférer ===.",
        quiz: quiz(
          "Quelle différence entre == et === ?",
          ["Aucune", "=== compare type aussi, == non", "== est plus rapide"],
          1,
          "=== est strict : vérifie valeur ET type. == convertit automatiquement les types avant comparaison."
        ),
        link: js + "Reference/Operators",
      }),
    ],
  },
  {
    id: "js-conditions",
    title: "Structures conditionnelles",
    description: "if, else, switch et ternaire",
    lessons: [
      lesson({
        id: "js-if-else",
        title: "Conditions if, else if, else",
        minutes: 20,
        summary:
          "if exécute code selon condition. else if pour tester autre condition. else pour cas par défaut. Accolades {} recommandées.",
        sections: [
          section(
            "Syntaxe if/else",
            "Brancher l'exécution selon condition.",
            [
              "if (condition) { code }",
              "else if (autreCondition) { code }",
              "else { code }",
              "Accolades recommandées même pour une ligne",
              "&& pour ET, || pour OU, ! pour NON",
            ]
          ),
        ],
        files: jsFiles(
          "Conditions",
          '<h1>Notes</h1><input id="note" type="number" value="15"><button id="verifier">Vérifier</button><p id="resultat"></p>',
          `const noteInput = document.querySelector("#note");
const bouton = document.querySelector("#verifier");
const resultat = document.querySelector("#resultat");

bouton.addEventListener("click", () => {
  const note = Number(noteInput.value);
  let mention;
  
  if (note >= 16) {
    mention = "Très bien 🌟";
  } else if (note >= 14) {
    mention = "Bien 👍";
  } else if (note >= 12) {
    mention = "Assez bien ✓";
  } else if (note >= 10) {
    mention = "Passable";
  } else {
    mention = "Insuffisant";
  }
  
  resultat.textContent = \`Note \${note}/20 : \${mention}\`;
});`,
        ),
        task: "Crée un système de réduction : 20% si prix > 100€, 10% si > 50€, 0% sinon.",
        takeaway:
          "if/else branche l'exécution. && pour ET, || pour OU. Accolades recommandées.",
        quiz: quiz(
          "Que fait && ?",
          ["OU logique", "ET logique", "NON logique"],
          1,
          "&& retourne true seulement si les deux conditions sont vraies."
        ),
        link: js + "Reference/Statements/if...else",
      }),
      lesson({
        id: "js-switch-ternaire",
        title: "Switch et opérateur ternaire",
        minutes: 15,
        summary:
          "switch teste une variable contre plusieurs valeurs. Ternaire : condition ? vrai : faux pour if/else court.",
        sections: [
          section(
            "Switch",
            "Alternative à if/else multiples.",
            [
              "switch (variable) { case valeur: break; }",
              "break obligatoire !",
              "default pour cas par défaut",
              "Bon pour : valeurs exactes",
              "Pas bon pour : intervalles",
            ]
          ),
          section(
            "Opérateur ternaire",
            "if/else en une ligne.",
            [
              "condition ? siVrai : siFaux",
              "const statut = age >= 18 ? 'majeur' : 'mineur'",
              "Plus concis qu'un if/else",
              "À utiliser pour cas simples",
            ]
          ),
        ],
        files: jsFiles(
          "Switch et ternaire",
          '<h1>Jour</h1><input id="jour" type="number" value="3"><button id="afficher">Afficher</button><p id="resultat"></p>',
          `const jourInput = document.querySelector("#jour");
const bouton = document.querySelector("#afficher");
const resultat = document.querySelector("#resultat");

bouton.addEventListener("click", () => {
  const jour = Number(jourInput.value);
  let nom;
  
  // Switch
  switch (jour) {
    case 1: nom = "Lundi"; break;
    case 2: nom = "Mardi"; break;
    case 3: nom = "Mercredi"; break;
    case 4: nom = "Jeudi"; break;
    case 5: nom = "Vendredi"; break;
    case 6:
    case 7:
      nom = "Week-end !";
      break;
    default:
      nom = "Jour invalide";
  }
  
  // Ternaire
  const travail = (jour >= 1 && jour <= 5) ? "Jour de travail" : "Repos";
  
  resultat.innerHTML = \`
    <strong>Jour \${jour}</strong>: \${nom}<br>
    Statut: \${travail}
  \`;
});`,
        ),
        task: "Crée un switch pour notes (A, B, C, D, F). Utilise ternaire pour dire si note >= C.",
        takeaway:
          "switch pour valeurs multiples. break obligatoire. Ternaire : condition ? vrai : faux.",
        quiz: quiz(
          "Pourquoi break dans switch ?",
          ["Optionnel", "Empêche fall-through dans case suivant", "Termine programme"],
          1,
          "Sans break, l'exécution continue dans les case suivants (fall-through), ce qui est rarement voulu."
        ),
        link: js + "Reference/Statements/switch",
      }),
      lesson({
        id: "js-truthy-falsy",
        title: "Truthy et Falsy : spécificité JavaScript",
        minutes: 15,
        summary:
          "En JavaScript, certaines valeurs sont 'falsy' (considérées comme false) : 0, '', null, undefined, NaN, false. Tout le reste est 'truthy'.",
        sections: [
          section(
            "Valeurs falsy",
            "Valeurs considérées comme false.",
            [
              "false : booléen faux",
              "0 : zéro",
              "'' : string vide",
              "null : absence de valeur",
              "undefined : non défini",
              "NaN : Not a Number",
            ]
          ),
          section(
            "Valeurs truthy",
            "Tout le reste est truthy.",
            [
              "true, 1, -1, 'texte'",
              "[], {} : tableaux et objets vides",
              "'0', 'false' : strings non vides",
              "Utilisation dans if : if (valeur) {...}",
            ]
          ),
        ],
        files: jsFiles(
          "Truthy et Falsy",
          '<h1>Truthy/Falsy</h1><pre id="output"></pre>',
          `// Test truthy/falsy
const valeurs = [
  false, 0, "", null, undefined, NaN,  // Falsy
  true, 1, "texte", [], {}, "0"        // Truthy
];

let resultat = "Valeurs falsy:\\n";
valeurs.slice(0, 6).forEach(v => {
  resultat += \`  \${JSON.stringify(v)} → \${v ? "truthy" : "falsy"}\\n\`;
});

resultat += "\\nValeurs truthy:\\n";
valeurs.slice(6).forEach(v => {
  resultat += \`  \${JSON.stringify(v)} → \${v ? "truthy" : "falsy"}\\n\`;
});

// Utilisation pratique
const nom = "";
if (nom) {
  console.log("Nom fourni:", nom);
} else {
  console.log("Nom vide (falsy)");
}

// Opérateur || pour valeur par défaut
const pseudo = nom || "Anonyme";
console.log("Pseudo:", pseudo);

document.querySelector("#output").textContent = resultat;`,
        ),
        task: "Teste plusieurs valeurs avec if (valeur) pour voir lesquelles sont truthy/falsy.",
        takeaway:
          "Falsy : false, 0, '', null, undefined, NaN. Truthy : tout le reste. Utile pour valeurs par défaut.",
        quiz: quiz(
          "[] (tableau vide) est truthy ou falsy ?",
          ["Falsy", "Truthy", "Dépend du contexte"],
          1,
          "[] est truthy ! Seuls false, 0, '', null, undefined, NaN sont falsy. Tableau vide est un objet (truthy)."
        ),
        link: js + "Glossary/Truthy",
      }),
    ],
  },
  {
    id: "js-boucles",
    title: "Boucles",
    description: "for, while, for...of, for...in",
    lessons: [
      lesson({
        id: "js-for-while",
        title: "Boucles for et while",
        minutes: 20,
        summary:
          "for pour nombre connu d'itérations. while pour condition. break sort de la boucle, continue passe à l'itération suivante.",
        sections: [
          section(
            "Boucle for",
            "La plus courante pour itérations connues.",
            [
              "for (let i = 0; i < 10; i++) { }",
              "i++ équivaut à i = i + 1",
              "i < array.length pour parcourir tableau",
              "break : sortir de la boucle",
              "continue : passer à l'itération suivante",
            ]
          ),
          section(
            "Boucle while",
            "Tant que condition vraie.",
            [
              "while (condition) { }",
              "Attention aux boucles infinies",
              "do { } while (condition) : au moins une fois",
            ]
          ),
        ],
        files: jsFiles(
          "Boucles for et while",
          '<h1>Boucles</h1><button id="executer">Exécuter</button><pre id="output"></pre>',
          `const bouton = document.querySelector("#executer");
const output = document.querySelector("#output");

bouton.addEventListener("click", () => {
  let resultat = "";
  
  // Boucle for
  resultat += "For 0 à 4:\\n";
  for (let i = 0; i < 5; i++) {
    resultat += \`  i = \${i}\\n\`;
  }
  
  // Table de multiplication
  resultat += "\\nTable de 7:\\n";
  for (let i = 1; i <= 10; i++) {
    resultat += \`  7 x \${i} = \${7 * i}\\n\`;
  }
  
  // While
  resultat += "\\nWhile (compte à rebours):\\n";
  let compteur = 5;
  while (compteur > 0) {
    resultat += \`  \${compteur}...\\n\`;
    compteur--;
  }
  resultat += "  Décollage ! 🚀\\n";
  
  // break et continue
  resultat += "\\nBreak et continue:\\n";
  for (let i = 0; i < 10; i++) {
    if (i === 3) {
      resultat += "  (3 sauté)\\n";
      continue;
    }
    if (i === 7) {
      resultat += "  (arrêt à 7)\\n";
      break;
    }
    resultat += \`  \${i}\\n\`;
  }
  
  output.textContent = resultat;
});`,
        ),
        task: "Affiche tous les nombres pairs de 0 à 20. Calcule leur somme avec une boucle.",
        takeaway:
          "for pour itérations connues. while pour condition. break sort, continue passe à la suivante.",
        quiz: quiz(
          "Que fait continue ?",
          ["Sort de la boucle", "Passe à l'itération suivante", "Relance la boucle"],
          1,
          "continue passe immédiatement à l'itération suivante sans exécuter le reste du code de la boucle."
        ),
        link: js + "Reference/Statements/for",
      }),
      lesson({
        id: "js-for-of-in",
        title: "for...of et for...in",
        minutes: 15,
        summary:
          "for...of parcourt valeurs d'un tableau. for...in parcourt clés d'un objet. for...of recommandé pour tableaux.",
        sections: [
          section(
            "for...of : valeurs",
            "Parcourir valeurs d'un itérable.",
            [
              "for (const element of tableau) { }",
              "Plus simple que for classique",
              "Fonctionne sur : arrays, strings, Map, Set",
              "Ne fonctionne PAS sur objets simples",
            ]
          ),
          section(
            "for...in : clés",
            "Parcourir clés d'un objet.",
            [
              "for (const cle in objet) { }",
              "Utilisé pour objets",
              "Éviter pour tableaux (utiliser for...of)",
            ]
          ),
        ],
        files: jsFiles(
          "for...of et for...in",
          '<h1>Boucles modernes</h1><button id="executer">Exécuter</button><pre id="output"></pre>',
          `const bouton = document.querySelector("#executer");
const output = document.querySelector("#output");

bouton.addEventListener("click", () => {
  let resultat = "";
  
  // for...of : valeurs d'un tableau
  const villes = ["Dakar", "Abidjan", "Lagos", "Nairobi"];
  resultat += "for...of (valeurs):\\n";
  for (const ville of villes) {
    resultat += \`  - \${ville}\\n\`;
  }
  
  // for...in : clés d'un objet
  const personne = {
    nom: "Alice",
    age: 25,
    ville: "Dakar"
  };
  
  resultat += "\\nfor...in (clés d'objet):\\n";
  for (const cle in personne) {
    resultat += \`  \${cle}: \${personne[cle]}\\n\`;
  }
  
  // Comparaison for classique vs for...of
  resultat += "\\nfor classique:\\n";
  for (let i = 0; i < villes.length; i++) {
    resultat += \`  [\${i}] \${villes[i]}\\n\`;
  }
  
  resultat += "\\nfor...of (plus simple):\\n";
  for (const ville of villes) {
    resultat += \`  \${ville}\\n\`;
  }
  
  output.textContent = resultat;
});`,
        ),
        task: "Crée un tableau de nombres. Utilise for...of pour afficher chaque nombre et sa racine carrée.",
        takeaway:
          "for...of pour valeurs de tableaux. for...in pour clés d'objets. for...of plus simple que for classique.",
        quiz: quiz(
          "Pour parcourir un tableau, préférer ?",
          ["for...in", "for...of", "Les deux"],
          1,
          "for...of est fait pour parcourir valeurs de tableaux. for...in pour clés d'objets."
        ),
        link: js + "Reference/Statements/for...of",
      }),
    ],
  },
  {
    id: "js-fonctions",
    title: "Fonctions",
    description: "Fonctions classiques, fléchées, scope et closures",
    lessons: [
      lesson({
        id: "js-fonctions-base",
        title: "Fonctions classiques et return",
        minutes: 20,
        summary:
          "function nomFonction() {} pour définir. return renvoie valeur. Paramètres par défaut possibles.",
        sections: [
          section(
            "Définir et appeler",
            "Regrouper code réutilisable.",
            [
              "function nom(params) { return valeur; }",
              "Appel : nom(arguments)",
              "return termine fonction et renvoie valeur",
              "Paramètres par défaut : function f(a = 0) {}",
            ]
          ),
        ],
        files: jsFiles(
          "Fonctions",
          '<h1>Calculatrice</h1><input id="a" type="number" value="5"><input id="b" type="number" value="3"><button id="calculer">+</button><p id="resultat"></p>',
          `function addition(a, b) {
  return a + b;
}

function multiplication(a, b) {
  return a * b;
}

// Valeur par défaut
function saluer(nom = "visiteur") {
  return \`Bonjour \${nom} !\`;
}

const bouton = document.querySelector("#calculer");
bouton.addEventListener("click", () => {
  const a = Number(document.querySelector("#a").value);
  const b = Number(document.querySelector("#b").value);
  const somme = addition(a, b);
  const produit = multiplication(a, b);
  
  document.querySelector("#resultat").innerHTML = \`
    \${a} + \${b} = \${somme}<br>
    \${a} × \${b} = \${produit}<br>
    \${saluer("Alice")}
  \`;
});`,
        ),
        task: "Créez fonction calculerMoyenne(notes) qui retourne moyenne d'un tableau de notes.",
        takeaway:
          "function nom() {} pour définir. return renvoie valeur. Paramètres par défaut possibles.",
        quiz: quiz(
          "À quoi sert return ?",
          ["Afficher valeur", "Renvoyer valeur au code appelant", "Terminer script"],
          1,
          "return renvoie une valeur et termine la fonction. Sans return, fonction retourne undefined."
        ),
        link: js + "Reference/Statements/function",
      }),
      lesson({
        id: "js-arrow-functions",
        title: "Fonctions fléchées (Arrow functions)",
        minutes: 20,
        summary:
          "Syntaxe moderne et concise : const f = () => {}. Parfait pour callbacks. Différence avec function : this.",
        sections: [
          section(
            "Syntaxe fléchée",
            "Plus courte que function.",
            [
              "const f = () => { return valeur; }",
              "const f = () => valeur; // return implicite",
              "const f = x => x * 2; // un paramètre, pas de ()",
              "Utilisées souvent dans map, filter, callbacks",
            ]
          ),
        ],
        files: jsFiles(
          "Arrow functions",
          '<h1>Map/Filter</h1><button id="executer">Exécuter</button><pre id="output"></pre>',
          `// Fonction classique
function doubler(x) {
  return x * 2;
}

// Arrow function équivalente
const doublerArrow = x => x * 2;

// Avec map
const nombres = [1, 2, 3, 4, 5];
const doubles = nombres.map(x => x * 2);
const carres = nombres.map(x => x ** 2);

// Avec filter
const pairs = nombres.filter(x => x % 2 === 0);

document.querySelector("#executer").addEventListener("click", () => {
  const output = document.querySelector("#output");
  output.textContent = \`
Nombres: \${nombres.join(", ")}
Doubles: \${doubles.join(", ")}
Carrés: \${carres.join(", ")}
Pairs: \${pairs.join(", ")}
  \`;
});`,
        ),
        task: "Utilisez arrow function avec filter pour extraire nombres > 10 d'un tableau.",
        takeaway:
          "Arrow functions : () => {}. Plus courtes. Return implicite si une expression. Idéales pour callbacks.",
        quiz: quiz(
          "Quelle syntaxe est arrow function ?",
          ["function f() {}", "const f = () => {}", "def f():"],
          1,
          "const f = () => {} est la syntaxe arrow function ES6."
        ),
        link: js + "Reference/Functions/Arrow_functions",
      }),
      lesson({
        id: "js-scope-closures",
        title: "Scope et closures",
        minutes: 20,
        summary:
          "Scope = portée des variables. Block scope (let/const). Closures = fonction qui capture variables externes.",
        sections: [
          section(
            "Scope (portée)",
            "Où une variable est accessible.",
            [
              "Global scope : partout",
              "Block scope : entre {} (let/const)",
              "Function scope : dans la fonction",
              "Variables locales masquent globales",
            ]
          ),
          section(
            "Closures",
            "Fonction qui se souvient de son environnement.",
            [
              "Fonction interne accède variables fonction externe",
              "Utile pour : compteurs, factory functions",
              "Encapsulation de données",
            ]
          ),
        ],
        files: jsFiles(
          "Scope et Closures",
          '<h1>Compteur</h1><button id="incrementer">+1</button><button id="decrementer">-1</button><p id="compteur">0</p>',
          `// Closure : compteur privé
function creerCompteur() {
  let valeur = 0; // Variable privée
  
  return {
    incrementer: () => ++valeur,
    decrementer: () => --valeur,
    getValeur: () => valeur
  };
}

const compteur = creerCompteur();

document.querySelector("#incrementer").addEventListener("click", () => {
  compteur.incrementer();
  document.querySelector("#compteur").textContent = compteur.getValeur();
});

document.querySelector("#decrementer").addEventListener("click", () => {
  compteur.decrementer();
  document.querySelector("#compteur").textContent = compteur.getValeur();
});

// valeur n'est pas accessible directement (encapsulé)
console.log("Valeur actuelle:", compteur.getValeur());`,
        ),
        task: "Créez fonction creerMultiplicateur(facteur) qui retourne fonction multipliant par facteur.",
        takeaway:
          "Scope : global, block, function. Closures = fonctions qui capturent variables externes. Encapsulation.",
        quiz: quiz(
          "Qu'est-ce qu'une closure ?",
          ["Boucle fermée", "Fonction qui capture variables externes", "Tableau"],
          1,
          "Closure = fonction qui se souvient des variables de son environnement de création."
        ),
        link: js + "Closures",
      }),
    ],
  },
  {
    id: "js-tableaux",
    title: "Tableaux (Arrays)",
    description: "Création, manipulation, méthodes courantes",
    lessons: [
      lesson({
        id: "js-array-base",
        title: "Création et manipulation basique",
        minutes: 20,
        summary:
          "const arr = [1, 2, 3] pour créer. arr[0] pour accéder. length pour taille. push, pop, shift, unshift pour modifier.",
        sections: [
          section(
            "Créer et accéder",
            "Tableaux = listes ordonnées.",
            [
              "const arr = [1, 2, 3]",
              "arr[0] : premier élément (index 0)",
              "arr.length : nombre d'éléments",
              "arr[arr.length - 1] : dernier",
            ]
          ),
          section(
            "Méthodes de base",
            "Ajouter/retirer éléments.",
            [
              "push(el) : ajoute à la fin",
              "pop() : retire dernier",
              "unshift(el) : ajoute au début",
              "shift() : retire premier",
              "includes(el) : vérifie présence",
              "indexOf(el) : trouve index",
            ]
          ),
        ],
        files: jsFiles(
          "Tableaux",
          '<h1>Liste de courses</h1><input id="item"><button id="ajouter">Ajouter</button><ul id="liste"></ul>',
          `const input = document.querySelector("#item");
const bouton = document.querySelector("#ajouter");
const liste = document.querySelector("#liste");

const courses = ["Pain", "Lait", "Œufs"];

function afficher() {
  liste.innerHTML = "";
  courses.forEach((item, index) => {
    liste.innerHTML += \`<li>[\${index}] \${item}</li>\`;
  });
}

bouton.addEventListener("click", () => {
  const item = input.value.trim();
  if (item) {
    courses.push(item);
    input.value = "";
    afficher();
  }
});

afficher();
console.log("Nombre d'articles:", courses.length);
console.log("Premier:", courses[0]);
console.log("Dernier:", courses[courses.length - 1]);`,
        ),
        task: "Créez tableau de villes. Ajoutez-en 2 avec push, retirez la dernière avec pop.",
        takeaway:
          "Tableaux : []. Index commence à 0. push/pop fin, unshift/shift début. length pour taille.",
        quiz: quiz(
          "Comment accéder au dernier élément ?",
          ["arr[0]", "arr[arr.length - 1]", "arr.last"],
          1,
          "arr[arr.length - 1] car dernier index = length - 1 (index commence à 0)."
        ),
        link: js + "Reference/Global_Objects/Array",
      }),
      lesson({
        id: "js-array-iteration",
        title: "forEach, map, filter",
        minutes: 25,
        summary:
          "forEach pour itérer. map pour transformer. filter pour filtrer. Retournent nouveau tableau (sauf forEach).",
        sections: [
          section(
            "Méthodes d'itération",
            "Plus modernes que for.",
            [
              "forEach(fn) : exécute fonction pour chaque",
              "map(fn) : transforme et retourne nouveau tableau",
              "filter(fn) : filtre et retourne nouveau tableau",
              "find(fn) : trouve premier élément",
              "some(fn) : au moins un vrai",
              "every(fn) : tous vrais",
            ]
          ),
        ],
        files: jsFiles(
          "map, filter",
          '<h1>Nombres</h1><button id="executer">Exécuter</button><pre id="output"></pre>',
          `const nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map : transformer
const doubles = nombres.map(n => n * 2);
const carres = nombres.map(n => n ** 2);

// filter : filtrer
const pairs = nombres.filter(n => n % 2 === 0);
const grands = nombres.filter(n => n > 5);

// forEach : itérer (ne retourne rien)
let somme = 0;
nombres.forEach(n => {
  somme += n;
});

// find : trouver premier
const premierGrand = nombres.find(n => n > 5);

// some et every
const aPair = nombres.some(n => n % 2 === 0);
const tousPairs = nombres.every(n => n % 2 === 0);

document.querySelector("#executer").addEventListener("click", () => {
  document.querySelector("#output").textContent = \`
Nombres: \${nombres.join(", ")}

map (doubles): \${doubles.join(", ")}
map (carrés): \${carres.join(", ")}

filter (pairs): \${pairs.join(", ")}
filter (>5): \${grands.join(", ")}

Somme (forEach): \${somme}
find (>5): \${premierGrand}

some (a pair): \${aPair}
every (tous pairs): \${tousPairs}
  \`;
});`,
        ),
        task: "Tableau de prix. Utilisez map pour appliquer 20% TVA, filter pour garder < 50€.",
        takeaway:
          "forEach itère. map transforme. filter filtre. find trouve. some/every testent. Immutables (nouveau tableau).",
        quiz: quiz(
          "Quelle méthode crée nouveau tableau ?",
          ["forEach", "map", "Les deux"],
          1,
          "map retourne nouveau tableau transformé. forEach ne retourne rien, juste itère."
        ),
        link: js + "Reference/Global_Objects/Array/map",
      }),
    ],
  },
  {
    id: "js-objets",
    title: "Objets",
    description: "Création, propriétés, méthodes",
    lessons: [
      lesson({
        id: "js-objets-base",
        title: "Objets : propriétés et méthodes",
        minutes: 25,
        summary:
          "Objets = paires clé:valeur. const obj = {cle: valeur}. obj.cle ou obj['cle'] pour accéder. Méthodes = fonctions dans objets.",
        sections: [
          section(
            "Créer et accéder",
            "Objets = dictionnaires.",
            [
              "const obj = {nom: 'Alice', age: 25}",
              "obj.nom ou obj['nom'] : accès",
              "obj.nouvelleCle = valeur : ajouter",
              "delete obj.cle : supprimer",
              "Object.keys(obj) : clés",
              "Object.values(obj) : valeurs",
            ]
          ),
          section(
            "Méthodes d'objets",
            "Fonctions dans objets.",
            [
              "Méthode : fonction dans objet",
              "this : référence l'objet",
              "Arrow functions n'ont pas leur this",
            ]
          ),
        ],
        files: jsFiles(
          "Objets",
          '<h1>Profil</h1><button id="afficher">Afficher</button><div id="output"></div>',
          `const personne = {
  nom: "Alice",
  age: 25,
  ville: "Dakar",
  
  // Méthode
  sePresenter() {
    return \`Je suis \${this.nom}, \${this.age} ans, de \${this.ville}.\`;
  },
  
  vieillir() {
    this.age++;
  }
};

// Accès propriétés
console.log("Nom:", personne.nom);
console.log("Âge:", personne["age"]);

// Ajouter propriété
personne.email = "alice@test.com";

// Clés et valeurs
console.log("Clés:", Object.keys(personne));
console.log("Valeurs:", Object.values(personne));

document.querySelector("#afficher").addEventListener("click", () => {
  personne.vieillir();
  document.querySelector("#output").innerHTML = \`
    <p><strong>Présentation:</strong> \${personne.sePresenter()}</p>
    <p><strong>Email:</strong> \${personne.email}</p>
  \`;
});`,
        ),
        task: "Créez objet produit {nom, prix, stock} avec méthode calculerTVA() qui retourne prix * 1.2.",
        takeaway:
          "Objets : {cle: valeur}. obj.cle pour accéder. Méthodes = fonctions. this = objet courant.",
        quiz: quiz(
          "Comment accéder propriété ?",
          ["obj.nom", "obj['nom']", "Les deux"],
          2,
          "Les deux fonctionnent. obj.nom plus courant, obj['nom'] pour clés dynamiques ou avec espaces."
        ),
        link: js + "Reference/Global_Objects/Object",
      }),
    ],
  },
  {
    id: "js-erreurs",
    title: "Gestion d'erreurs",
    description: "try, catch, throw",
    lessons: [
      lesson({
        id: "js-try-catch",
        title: "try/catch et throw",
        minutes: 15,
        summary:
          "try/catch gère erreurs. throw lance erreur. finally toujours exécuté. Utile pour valider données.",
        sections: [
          section(
            "Gérer erreurs",
            "Empêcher crash du programme.",
            [
              "try { code_risque } catch (error) { gestion }",
              "throw new Error('message') : lancer erreur",
              "finally { } : toujours exécuté",
              "error.message : message d'erreur",
            ]
          ),
        ],
        files: jsFiles(
          "Gestion erreurs",
          '<h1>Division</h1><input id="a" type="number" value="10"><input id="b" type="number" value="2"><button id="diviser">Diviser</button><p id="resultat"></p>',
          `function diviser(a, b) {
  if (b === 0) {
    throw new Error("Division par zéro impossible !");
  }
  return a / b;
}

document.querySelector("#diviser").addEventListener("click", () => {
  try {
    const a = Number(document.querySelector("#a").value);
    const b = Number(document.querySelector("#b").value);
    const resultat = diviser(a, b);
    document.querySelector("#resultat").textContent = \`\${a} / \${b} = \${resultat}\`;
    document.querySelector("#resultat").style.color = "green";
  } catch (error) {
    document.querySelector("#resultat").textContent = \`Erreur: \${error.message}\`;
    document.querySelector("#resultat").style.color = "red";
  } finally {
    console.log("Opération terminée (finally)");
  }
});`,
        ),
        task: "Créez fonction racineCarree(n) qui lance erreur si n < 0. Testez avec try/catch.",
        takeaway:
          "try/catch gère erreurs. throw lance erreur personnalisée. finally toujours exécuté.",
        quiz: quiz(
          "Quand s'exécute finally ?",
          ["Seulement si erreur", "Toujours", "Jamais"],
          1,
          "finally s'exécute TOUJOURS, qu'il y ait erreur ou non. Idéal pour nettoyage."
        ),
        link: js + "Reference/Statements/try...catch",
      }),
    ],
  },
  {
    id: "js-projet-debutant",
    title: "Projet final débutant",
    description: "Mini-application console",
    lessons: [
      lesson({
        id: "js-projet-todo-console",
        title: "Projet : Todo List console",
        minutes: 30,
        summary:
          "Application complète utilisant toutes les notions : variables, fonctions, tableaux, objets, boucles. Todo list en console.",
        sections: [
          section(
            "Objectif",
            "Créer gestionnaire de tâches.",
            [
              "Ajouter, lister, compléter tâches",
              "Utilise tableaux et objets",
              "Fonctions pour chaque action",
              "Validation et gestion erreurs",
            ]
          ),
        ],
        files: jsFiles(
          "Todo List",
          '<h1>Todo List</h1><input id="tache"><button id="ajouter">Ajouter</button><ul id="liste"></ul><button id="afficherConsole">Voir console</button>',
          `// Structure de données
const todos = [
  {id: 1, texte: "Apprendre JavaScript", complete: false},
  {id: 2, texte: "Créer un projet", complete: false}
];
let nextId = 3;

// Ajouter tâche
function ajouterTodo(texte) {
  if (!texte.trim()) {
    throw new Error("Texte vide");
  }
  const todo = {
    id: nextId++,
    texte: texte.trim(),
    complete: false
  };
  todos.push(todo);
  return todo;
}

// Compléter tâche
function completerTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.complete = !todo.complete;
  }
}

// Afficher
function afficherTodos() {
  const liste = document.querySelector("#liste");
  liste.innerHTML = "";
  
  todos.forEach(todo => {
    const style = todo.complete ? "text-decoration: line-through" : "";
    liste.innerHTML += \`
      <li style="\${style}" onclick="completerTodo(\${todo.id}); afficherTodos()">
        [\${todo.id}] \${todo.texte} \${todo.complete ? "✓" : ""}
      </li>
    \`;
  });
}

// Interface
document.querySelector("#ajouter").addEventListener("click", () => {
  try {
    const input = document.querySelector("#tache");
    ajouterTodo(input.value);
    input.value = "";
    afficherTodos();
  } catch (e) {
    alert(e.message);
  }
});

document.querySelector("#afficherConsole").addEventListener("click", () => {
  console.log("=== Todo List ===");
  todos.forEach(t => {
    const statut = t.complete ? "✓" : "⬜";
    console.log(\`\${statut} [\${t.id}] \${t.texte}\`);
  });
});

// Rendre completerTodo global pour onclick
window.completerTodo = completerTodo;

afficherTodos();`,
        ),
        task: "Ajoutez fonction supprimerTodo(id) qui retire une tâche du tableau.",
        takeaway:
          "Projet complet utilisant : tableaux, objets, fonctions, boucles, try/catch. Félicitations niveau débutant ! 🎉",
        quiz: quiz(
          "Quel concept n'est pas utilisé ici ?",
          ["Tableaux", "Async/Await", "Objets"],
          1,
          "Async/await sera au niveau avancé. Ce projet utilise bases : tableaux, objets, fonctions."
        ),
        link: js + "Guide",
      }),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🟡 NIVEAU INTERMÉDIAIRE - POO et méthodes avancées
// ═══════════════════════════════════════════════════════════════════════════

const intermediate: WebLevel["chapters"] = [
  {
    id: "js-poo",
    title: "POO en JavaScript",
    description: "Classes ES6, constructeur, héritage",
    lessons: [
      lesson({
        id: "js-classes-es6",
        title: "Classes ES6 : syntaxe moderne",
        minutes: 25,
        summary:
          "class pour créer classes. constructor pour initialiser. new pour créer instances. Méthodes définies directement dans la classe.",
        sections: [
          section(
            "Définir une classe",
            "Syntaxe moderne pour POO.",
            [
              "class NomClasse { constructor() {} }",
              "constructor : initialise l'objet",
              "Méthodes sans function",
              "new NomClasse() : créer instance",
              "this : référence l'instance",
            ]
          ),
        ],
        files: jsFiles(
          "Classes ES6",
          '<h1>Produits</h1><button id="creer">Créer produits</button><ul id="liste"></ul>',
          `class Produit {
  constructor(nom, prix, stock) {
    this.nom = nom;
    this.prix = prix;
    this.stock = stock;
  }
  
  afficher() {
    return \`\${this.nom}: \${this.prix}€ (stock: \${this.stock})\`;
  }
  
  estDisponible() {
    return this.stock > 0;
  }
  
  calculerTVA() {
    return this.prix * 0.20;
  }
  
  getPrixTTC() {
    return this.prix + this.calculerTVA();
  }
}

// Créer instances
const p1 = new Produit("Laptop", 999, 10);
const p2 = new Produit("Souris", 25, 0);

console.log(p1.afficher());
console.log("Disponible:", p1.estDisponible());
console.log("Prix TTC:", p1.getPrixTTC());

document.querySelector("#creer").addEventListener("click", () => {
  const produits = [
    new Produit("Clavier", 75, 5),
    new Produit("Écran", 299, 3),
    new Produit("Webcam", 89, 0)
  ];
  
  const liste = document.querySelector("#liste");
  liste.innerHTML = produits.map(p => \`
    <li>\${p.afficher()} - \${p.estDisponible() ? "✅" : "❌"}</li>
  \`).join("");
});`,
        ),
        task: "Créez classe Utilisateur avec nom, email, age. Ajoutez méthode estMajeur().",
        takeaway:
          "class NomClasse {}. constructor initialise. Méthodes sans function. new pour créer instances.",
        quiz: quiz(
          "À quoi sert constructor ?",
          ["Détruire objet", "Initialiser objet", "Copier objet"],
          1,
          "constructor initialise l'objet lors de sa création avec new."
        ),
        link: js + "Reference/Classes",
      }),
      lesson({
        id: "js-heritage",
        title: "Héritage avec extends",
        minutes: 25,
        summary:
          "extends pour hériter d'une classe. super() appelle constructeur parent. Surcharge de méthodes possible.",
        sections: [
          section(
            "Héritage",
            "Classe enfant hérite de classe parent.",
            [
              "class Enfant extends Parent {}",
              "super() : appelle constructeur parent",
              "super.methode() : appelle méthode parent",
              "Surcharge : redéfinir méthode",
            ]
          ),
        ],
        files: jsFiles(
          "Héritage",
          '<h1>Animaux</h1><button id="creer">Créer animaux</button><pre id="output"></pre>',
          `class Animal {
  constructor(nom, age) {
    this.nom = nom;
    this.age = age;
  }
  
  parler() {
    return \`\${this.nom} fait un bruit.\`;
  }
  
  decrire() {
    return \`\${this.nom} (\${this.age} ans)\`;
  }
}

class Chien extends Animal {
  constructor(nom, age, race) {
    super(nom, age); // Appel constructeur parent
    this.race = race;
  }
  
  parler() {
    return \`\${this.nom} aboie: Woof!\`;
  }
  
  getRace() {
    return this.race;
  }
}

class Chat extends Animal {
  parler() {
    return \`\${this.nom} miaule: Miaou!\`;
  }
}

document.querySelector("#creer").addEventListener("click", () => {
  const animaux = [
    new Chien("Rex", 5, "Berger"),
    new Chat("Minou", 3),
    new Chien("Max", 2, "Labrador")
  ];
  
  let output = "";
  animaux.forEach(a => {
    output += a.decrire() + "\\n";
    output += a.parler() + "\\n";
    if (a instanceof Chien) {
      output += \`Race: \${a.getRace()}\\n\`;
    }
    output += "\\n";
  });
  
  document.querySelector("#output").textContent = output;
});`,
        ),
        task: "Créez classe Vehicule puis Voiture et Moto qui héritent. Surchargez méthode demarrer().",
        takeaway:
          "extends hérite. super() appelle parent. Surcharge = redéfinir méthode. instanceof vérifie type.",
        quiz: quiz(
          "Comment appeler constructeur parent ?",
          ["parent()", "super()", "this.parent()"],
          1,
          "super() dans constructor appelle le constructeur de la classe parent."
        ),
        link: js + "Reference/Classes/extends",
      }),
      lesson({
        id: "js-getters-setters",
        title: "Getters et setters",
        minutes: 20,
        summary:
          "get et set pour propriétés calculées ou validées. Syntaxe : get nom() {} et set nom(valeur) {}. Accès comme propriété normale.",
        sections: [
          section(
            "Getters et Setters",
            "Contrôler accès aux propriétés.",
            [
              "get nom() { return ... } : lecture",
              "set nom(v) { ... } : écriture",
              "Accès comme propriété : obj.nom",
              "Validation dans setter",
              "Propriétés calculées dans getter",
            ]
          ),
        ],
        files: jsFiles(
          "Getters/Setters",
          '<h1>Rectangle</h1><input id="l" value="10"><input id="h" value="5"><button id="calculer">Calculer</button><p id="resultat"></p>',
          `class Rectangle {
  constructor(largeur, hauteur) {
    this._largeur = largeur;
    this._hauteur = hauteur;
  }
  
  get largeur() {
    return this._largeur;
  }
  
  set largeur(v) {
    if (v <= 0) throw new Error("Largeur doit être > 0");
    this._largeur = v;
  }
  
  get hauteur() {
    return this._hauteur;
  }
  
  set hauteur(v) {
    if (v <= 0) throw new Error("Hauteur doit être > 0");
    this._hauteur = v;
  }
  
  // Propriété calculée
  get aire() {
    return this._largeur * this._hauteur;
  }
  
  get perimetre() {
    return 2 * (this._largeur + this._hauteur);
  }
}

const rect = new Rectangle(10, 5);

document.querySelector("#calculer").addEventListener("click", () => {
  try {
    rect.largeur = Number(document.querySelector("#l").value);
    rect.hauteur = Number(document.querySelector("#h").value);
    
    document.querySelector("#resultat").innerHTML = \`
      Largeur: \${rect.largeur}<br>
      Hauteur: \${rect.hauteur}<br>
      Aire: \${rect.aire}<br>
      Périmètre: \${rect.perimetre}
    \`;
  } catch (e) {
    alert(e.message);
  }
});`,
        ),
        task: "Créez classe Cercle avec getter/setter rayon (validation > 0) et getter aire.",
        takeaway:
          "get pour lecture, set pour écriture. Validation dans setters. Propriétés calculées dans getters.",
        quiz: quiz(
          "Comment accéder getter ?",
          ["obj.getNom()", "obj.nom", "obj.get('nom')"],
          1,
          "Getter s'utilise comme propriété : obj.nom (pas de parenthèses)."
        ),
        link: js + "Reference/Functions/get",
      }),
    ],
  },
  {
    id: "js-array-advanced",
    title: "Méthodes avancées tableaux",
    description: "map, filter, reduce, find, chaînage",
    lessons: [
      lesson({
        id: "js-map-filter-reduce",
        title: "map, filter, reduce : trio puissant",
        minutes: 30,
        summary:
          "map transforme. filter filtre. reduce agrège. Retournent nouveau tableau (immutables). Chaînables.",
        sections: [
          section(
            "Les trois méthodes",
            "Programmation fonctionnelle.",
            [
              "map(fn) : transforme chaque élément",
              "filter(fn) : garde éléments selon condition",
              "reduce(fn, initial) : réduit à une valeur",
              "Immutables : nouveau tableau",
              "Chaînables : .map().filter().reduce()",
            ]
          ),
        ],
        files: jsFiles(
          "map/filter/reduce",
          '<h1>Produits</h1><button id="calculer">Calculer</button><pre id="output"></pre>',
          `const produits = [
  {nom: "Laptop", prix: 999, categorie: "tech"},
  {nom: "Souris", prix: 25, categorie: "tech"},
  {nom: "Chaise", prix: 150, categorie: "mobilier"},
  {nom: "Bureau", prix: 299, categorie: "mobilier"},
  {nom: "Clavier", prix: 75, categorie: "tech"}
];

document.querySelector("#calculer").addEventListener("click", () => {
  // map : ajouter TVA
  const avecTVA = produits.map(p => ({
    ...p,
    prixTTC: p.prix * 1.20
  }));
  
  // filter : tech seulement
  const tech = produits.filter(p => p.categorie === "tech");
  
  // reduce : somme des prix
  const total = produits.reduce((sum, p) => sum + p.prix, 0);
  
  // Chaînage : tech > 50€ avec TVA
  const result = produits
    .filter(p => p.categorie === "tech")
    .filter(p => p.prix > 50)
    .map(p => ({
      nom: p.nom,
      prixTTC: (p.prix * 1.20).toFixed(2)
    }));
  
  document.querySelector("#output").textContent = \`
MAP (avec TVA):
\${JSON.stringify(avecTVA, null, 2)}

FILTER (tech):
\${JSON.stringify(tech, null, 2)}

REDUCE (total): \${total}€

CHAÎNAGE (tech > 50€ avec TVA):
\${JSON.stringify(result, null, 2)}
  \`;
});`,
        ),
        task: "Tableau de nombres. Utilisez map pour doubler, filter pour > 10, reduce pour somme.",
        takeaway:
          "map transforme, filter filtre, reduce agrège. Immutables. Chaînables. Programmation fonctionnelle.",
        quiz: quiz(
          "Que retourne reduce ?",
          ["Tableau", "Une seule valeur", "Objet"],
          1,
          "reduce agrège tableau en une seule valeur (somme, produit, objet, etc.)."
        ),
        link: js + "Reference/Global_Objects/Array/reduce",
      }),
      lesson({
        id: "js-find-some-every",
        title: "find, findIndex, some, every",
        minutes: 20,
        summary:
          "find trouve premier élément. findIndex trouve index. some teste si au moins un. every teste si tous.",
        sections: [
          section(
            "Recherche et test",
            "Méthodes utilitaires.",
            [
              "find(fn) : premier élément trouvé",
              "findIndex(fn) : index premier trouvé",
              "some(fn) : au moins un vrai",
              "every(fn) : tous vrais",
              "Retournent booléen (some/every)",
            ]
          ),
        ],
        files: jsFiles(
          "find/some/every",
          '<h1>Utilisateurs</h1><button id="tester">Tester</button><pre id="output"></pre>',
          `const users = [
  {nom: "Alice", age: 25, premium: true},
  {nom: "Bob", age: 17, premium: false},
  {nom: "Charlie", age: 30, premium: true},
  {nom: "David", age: 22, premium: false}
];

document.querySelector("#tester").addEventListener("click", () => {
  // find : premier premium
  const premierPremium = users.find(u => u.premium);
  
  // findIndex : index premier mineur
  const indexMineur = users.findIndex(u => u.age < 18);
  
  // some : au moins un premium
  const aPremium = users.some(u => u.premium);
  
  // every : tous majeurs
  const tousMajeurs = users.every(u => u.age >= 18);
  
  // every : tous premium
  const tousPremium = users.every(u => u.premium);
  
  document.querySelector("#output").textContent = \`
find (premier premium): \${premierPremium.nom}

findIndex (premier < 18): \${indexMineur} (\${indexMineur >= 0 ? users[indexMineur].nom : "aucun"})

some (au moins un premium): \${aPremium}

every (tous >= 18): \${tousMajeurs}
every (tous premium): \${tousPremium}
  \`;
});`,
        ),
        task: "Tableau produits. Utilisez find pour trouver premier > 100€, some pour vérifier si stock > 0.",
        takeaway:
          "find trouve élément. findIndex trouve index. some au moins un. every tous. Booléens.",
        quiz: quiz(
          "Différence some et every ?",
          ["Aucune", "some = au moins un, every = tous", "some plus rapide"],
          1,
          "some retourne true si AU MOINS UN élément respecte condition. every si TOUS."
        ),
        link: js + "Reference/Global_Objects/Array/find",
      }),
    ],
  },
  {
    id: "js-destructuring-spread",
    title: "Destructuring et Spread",
    description: "Syntaxe moderne pour extraction et copie",
    lessons: [
      lesson({
        id: "js-destructuring",
        title: "Destructuring : arrays et objets",
        minutes: 25,
        summary:
          "Destructuring extrait valeurs facilement. const [a, b] = array ou const {nom} = obj. Valeurs par défaut possibles.",
        sections: [
          section(
            "Destructuring",
            "Extraire valeurs facilement.",
            [
              "const [a, b] = [1, 2] : arrays",
              "const {nom, age} = obj : objets",
              "Valeurs par défaut : {nom = 'Anonyme'}",
              "Rest : const [first, ...rest] = array",
              "Renommer : const {nom: n} = obj",
            ]
          ),
        ],
        files: jsFiles(
          "Destructuring",
          '<h1>Destructuring</h1><button id="demo">Démonstration</button><pre id="output"></pre>',
          `document.querySelector("#demo").addEventListener("click", () => {
  // Array destructuring
  const nombres = [1, 2, 3, 4, 5];
  const [premier, deuxieme, ...reste] = nombres;
  
  // Object destructuring
  const personne = {nom: "Alice", age: 25, ville: "Dakar"};
  const {nom, age, pays = "Sénégal"} = personne;
  
  // Renommer
  const {nom: pseudo} = personne;
  
  // Fonction avec destructuring
  function afficherUser({nom, age}) {
    return \`\${nom}, \${age} ans\`;
  }
  
  // Swap variables
  let a = 1, b = 2;
  [a, b] = [b, a];
  
  document.querySelector("#output").textContent = \`
Array destructuring:
  premier: \${premier}
  deuxieme: \${deuxieme}
  reste: [\${reste.join(", ")}]

Object destructuring:
  nom: \${nom}
  age: \${age}
  pays (défaut): \${pays}
  pseudo (renommé): \${pseudo}

Fonction: \${afficherUser(personne)}

Swap: a=\${a}, b=\${b}
  \`;
});`,
        ),
        task: "Créez objet produit, extrayez nom et prix avec destructuring. Ajoutez valeur par défaut stock = 0.",
        takeaway:
          "Destructuring extrait valeurs : [a, b] = array, {nom} = obj. Valeurs par défaut. Rest ...",
        quiz: quiz(
          "Que fait const [a, ...rest] = [1,2,3] ?",
          ["Erreur", "a=1, rest=[2,3]", "a=[1,2,3]"],
          1,
          "a prend premier élément, ...rest collecte le reste dans un tableau."
        ),
        link: js + "Reference/Operators/Destructuring_assignment",
      }),
      lesson({
        id: "js-spread-rest",
        title: "Spread operator (...)",
        minutes: 20,
        summary:
          "Spread ... étale éléments. Copie tableaux/objets. Concat. Passer arguments. Rest parameters dans fonctions.",
        sections: [
          section(
            "Spread operator",
            "Étaler éléments.",
            [
              "[...array] : copie tableau",
              "{...obj} : copie objet",
              "[...a, ...b] : concat",
              "func(...args) : passer arguments",
              "Rest parameters : function f(...args) {}",
            ]
          ),
        ],
        files: jsFiles(
          "Spread",
          '<h1>Spread</h1><button id="demo">Démonstration</button><pre id="output"></pre>',
          `document.querySelector("#demo").addEventListener("click", () => {
  // Copie tableau
  const original = [1, 2, 3];
  const copie = [...original];
  copie.push(4);
  
  // Concat
  const a = [1, 2], b = [3, 4];
  const concat = [...a, ...b];
  
  // Copie objet
  const user = {nom: "Alice", age: 25};
  const userCopie = {...user, ville: "Dakar"};
  
  // Rest parameters
  function somme(...nombres) {
    return nombres.reduce((sum, n) => sum + n, 0);
  }
  
  // Math.max avec spread
  const nums = [5, 2, 9, 1];
  const max = Math.max(...nums);
  
  document.querySelector("#output").textContent = \`
Copie tableau:
  original: [\${original.join(", ")}]
  copie: [\${copie.join(", ")}]

Concat:
  [\${concat.join(", ")}]

Copie objet:
  \${JSON.stringify(userCopie, null, 2)}

Rest parameters:
  somme(1,2,3,4,5) = \${somme(1,2,3,4,5)}

Math.max:
  max([\${nums.join(", ")}]) = \${max}
  \`;
});`,
        ),
        task: "Créez fonction max(...nombres) qui retourne le plus grand avec spread et Math.max.",
        takeaway:
          "Spread ... étale éléments. Copie tableaux/objets. Concat. Rest parameters ...args dans fonctions.",
        quiz: quiz(
          "Que fait {...obj} ?",
          ["Détruit objet", "Copie superficielle objet", "Affiche objet"],
          1,
          "{...obj} crée copie superficielle (shallow copy) de l'objet."
        ),
        link: js + "Reference/Operators/Spread_syntax",
      }),
    ],
  },
  {
    id: "js-modules",
    title: "Modules ES6",
    description: "Export et import pour organiser code",
    lessons: [
      lesson({
        id: "js-modules-es6",
        title: "Export et import",
        minutes: 20,
        summary:
          "Modules organisent code. export pour exposer. import pour utiliser. type='module' dans script. export default pour export principal.",
        sections: [
          section(
            "Modules ES6",
            "Organiser code en fichiers.",
            [
              "export const var = ... : nommé",
              "export default ... : défaut",
              "import {var} from './file.js' : nommé",
              "import name from './file.js' : défaut",
              "import * as name from './file.js' : tout",
              "type='module' dans <script>",
            ]
          ),
        ],
        files: jsFiles(
          "Modules (concept)",
          '<h1>Modules</h1><p>Modules = fichiers séparés. Voir console.</p>',
          `// math.js (simulation)
// export const add = (a, b) => a + b;
// export const multiply = (a, b) => a * b;
// export default function square(x) { return x ** 2; }

// main.js (simulation)
// import square from './math.js';
// import {add, multiply} from './math.js';

// Simulation inline
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const square = x => x ** 2;

console.log("Modules ES6 (simulés):");
console.log("add(5, 3):", add(5, 3));
console.log("multiply(4, 7):", multiply(4, 7));
console.log("square(5):", square(5));

console.log(\`
Structure recommandée:
  src/
    ├── utils.js    (export const helper = ...)
    ├── math.js     (export default function)
    └── main.js     (import from './utils.js')
    
HTML: <script type="module" src="main.js"></script>
\`);`,
        ),
        task: "Concepts seulement. Modules nécessitent serveur web pour fonctionner (CORS).",
        takeaway:
          "Modules organisent code. export expose, import utilise. export default pour principal. type='module' requis.",
        quiz: quiz(
          "Quelle différence export vs export default ?",
          ["Aucune", "export default = un seul par fichier", "export plus rapide"],
          1,
          "export default = export principal (un seul). export nommé = plusieurs possibles."
        ),
        link: js + "Guide/Modules",
      }),
    ],
  },
  {
    id: "js-json-storage",
    title: "JSON et LocalStorage",
    description: "Sérialisation et stockage navigateur",
    lessons: [
      lesson({
        id: "js-json",
        title: "JSON : parse et stringify",
        minutes: 20,
        summary:
          "JSON = format texte pour échanger données. JSON.stringify(obj) convertit en string. JSON.parse(string) convertit en objet.",
        sections: [
          section(
            "JSON",
            "JavaScript Object Notation.",
            [
              "JSON.stringify(obj) : objet → string",
              "JSON.parse(string) : string → objet",
              "Format : {\"cle\": \"valeur\"}",
              "Utilisé pour API, storage, fichiers",
            ]
          ),
        ],
        files: jsFiles(
          "JSON",
          '<h1>JSON</h1><textarea id="json" rows="5"></textarea><button id="parser">Parser</button><pre id="output"></pre>',
          `const user = {
  nom: "Alice",
  age: 25,
  hobbies: ["lecture", "code", "sport"]
};

// Objet → JSON
const jsonString = JSON.stringify(user, null, 2);
document.querySelector("#json").value = jsonString;

document.querySelector("#parser").addEventListener("click", () => {
  try {
    const text = document.querySelector("#json").value;
    const parsed = JSON.parse(text);
    
    document.querySelector("#output").textContent = \`
Type: \${typeof parsed}
Nom: \${parsed.nom}
Age: \${parsed.age}
Hobbies: \${parsed.hobbies.join(", ")}

Objet complet:
\${JSON.stringify(parsed, null, 2)}
    \`;
  } catch (e) {
    document.querySelector("#output").textContent = "Erreur: " + e.message;
  }
});`,
        ),
        task: "Créez objet produit, convertissez en JSON avec stringify, puis reparsez avec parse.",
        takeaway:
          "JSON.stringify objet → string. JSON.parse string → objet. Format échange données universel.",
        quiz: quiz(
          "À quoi sert JSON ?",
          ["Afficher objets", "Échanger données (format texte)", "Compiler code"],
          1,
          "JSON = format texte standard pour échanger données entre applications, API, fichiers."
        ),
        link: js + "Reference/Global_Objects/JSON",
      }),
      lesson({
        id: "js-localstorage",
        title: "LocalStorage : persistance navigateur",
        minutes: 20,
        summary:
          "localStorage stocke données dans navigateur. setItem(key, value), getItem(key), removeItem(key). Persiste après fermeture. Stocke strings uniquement.",
        sections: [
          section(
            "LocalStorage",
            "Stockage persistent navigateur.",
            [
              "localStorage.setItem(key, value) : sauver",
              "localStorage.getItem(key) : récupérer",
              "localStorage.removeItem(key) : supprimer",
              "localStorage.clear() : tout effacer",
              "Stocke strings uniquement (JSON pour objets)",
              "Persiste après fermeture navigateur",
            ]
          ),
        ],
        files: jsFiles(
          "LocalStorage",
          '<h1>Compteur persistent</h1><p id="compteur">0</p><button id="incrementer">+1</button><button id="reset">Reset</button>',
          `// Charger compteur
let compteur = Number(localStorage.getItem("compteur")) || 0;
const afficher = () => {
  document.querySelector("#compteur").textContent = compteur;
};

afficher();

// Incrémenter
document.querySelector("#incrementer").addEventListener("click", () => {
  compteur++;
  localStorage.setItem("compteur", compteur);
  afficher();
  console.log("Compteur sauvegardé:", compteur);
});

// Reset
document.querySelector("#reset").addEventListener("click", () => {
  compteur = 0;
  localStorage.setItem("compteur", compteur);
  afficher();
  console.log("Compteur réinitialisé");
});

// Stocker objet (avec JSON)
const user = {nom: "Alice", visites: 1};
localStorage.setItem("user", JSON.stringify(user));

// Récupérer objet
const userSauve = JSON.parse(localStorage.getItem("user") || "{}");
console.log("User sauvegardé:", userSauve);`,
        ),
        task: "Créez système de thème (clair/sombre) sauvegardé dans localStorage. Persiste au rechargement.",
        takeaway:
          "localStorage persiste données navigateur. setItem/getItem. Strings uniquement (JSON pour objets). Pas de sécurité.",
        quiz: quiz(
          "Que stocke localStorage ?",
          ["Objets", "Strings", "Les deux"],
          1,
          "localStorage stocke uniquement strings. Utiliser JSON.stringify/parse pour objets."
        ),
        link: mdn + "Web/API/Window/localStorage",
      }),
    ],
  },
  {
    id: "js-dates-math",
    title: "Dates et Math",
    description: "Manipuler dates et calculs mathématiques",
    lessons: [
      lesson({
        id: "js-date",
        title: "Objet Date",
        minutes: 20,
        summary:
          "new Date() pour créer date. getFullYear(), getMonth(), getDate() pour lire. toLocaleDateString() pour formater.",
        sections: [
          section(
            "Date",
            "Manipuler dates en JavaScript.",
            [
              "new Date() : maintenant",
              "new Date('2024-01-15') : date spécifique",
              "getFullYear(), getMonth() (0-11), getDate()",
              "getHours(), getMinutes(), getSeconds()",
              "toLocaleDateString() : format local",
              "getTime() : timestamp",
            ]
          ),
        ],
        files: jsFiles(
          "Dates",
          '<h1>Dates</h1><button id="afficher">Afficher dates</button><pre id="output"></pre>',
          `document.querySelector("#afficher").addEventListener("click", () => {
  const maintenant = new Date();
  const anniversaire = new Date("2000-05-15");
  
  // Extraire composants
  const annee = maintenant.getFullYear();
  const mois = maintenant.getMonth() + 1; // 0-11 → 1-12
  const jour = maintenant.getDate();
  
  // Formater
  const formatted = maintenant.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  // Calcul âge
  const age = annee - anniversaire.getFullYear();
  
  // Différence jours
  const diff = maintenant - anniversaire;
  const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  document.querySelector("#output").textContent = \`
Maintenant: \${maintenant}

Composants:
  Année: \${annee}
  Mois: \${mois}
  Jour: \${jour}

Formaté: \${formatted}

Anniversaire: \${anniversaire.toLocaleDateString("fr-FR")}
Âge: \${age} ans
Jours depuis naissance: \${jours}
  \`;
});`,
        ),
        task: "Créez countdown qui affiche jours restants jusqu'à une date future (ex: Noël).",
        takeaway:
          "new Date() crée date. get* pour extraire. toLocaleDateString() formate. Calculs avec timestamps.",
        quiz: quiz(
          "getMonth() retourne ?",
          ["1-12", "0-11", "0-12"],
          1,
          "getMonth() retourne 0-11 (janvier=0). Ajouter +1 pour affichage humain."
        ),
        link: js + "Reference/Global_Objects/Date",
      }),
    ],
  },
  {
    id: "js-projet-intermediaire",
    title: "Projet final intermédiaire",
    description: "Application POO avec localStorage",
    lessons: [
      lesson({
        id: "js-projet-notes",
        title: "Projet : Gestionnaire de notes (POO + LocalStorage)",
        minutes: 40,
        summary:
          "Application complète : classes ES6, localStorage, JSON, méthodes array. Gestionnaire de notes avec catégories et recherche.",
        sections: [
          section(
            "Objectif",
            "App complète utilisant toutes notions intermédiaires.",
            [
              "Classes Note et GestionnaireNotes",
              "Persistence localStorage",
              "Recherche et filtrage",
              "Export/import JSON",
            ]
          ),
        ],
        files: jsFiles(
          "Gestionnaire Notes",
          '<h1>Notes</h1><input id="titre" placeholder="Titre"><textarea id="contenu"></textarea><select id="categorie"><option>Perso</option><option>Travail</option></select><button id="ajouter">Ajouter</button><input id="recherche" placeholder="Rechercher"><div id="notes"></div>',
          `class Note {
  constructor(id, titre, contenu, categorie) {
    this.id = id;
    this.titre = titre;
    this.contenu = contenu;
    this.categorie = categorie;
    this.date = new Date();
  }
  
  afficher() {
    return \`
      <div class="note" style="border:1px solid #ccc; padding:10px; margin:10px 0">
        <h3>\${this.titre} <span style="color:#666">[\${this.categorie}]</span></h3>
        <p>\${this.contenu}</p>
        <small>\${this.date.toLocaleDateString()}</small>
        <button onclick="gestionnaire.supprimer(\${this.id})">❌</button>
      </div>
    \`;
  }
}

class GestionnaireNotes {
  constructor() {
    this.notes = this.charger();
    this.nextId = Math.max(...this.notes.map(n => n.id), 0) + 1;
  }
  
  ajouter(titre, contenu, categorie) {
    const note = new Note(this.nextId++, titre, contenu, categorie);
    this.notes.push(note);
    this.sauvegarder();
    this.afficher();
  }
  
  supprimer(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.sauvegarder();
    this.afficher();
  }
  
  rechercher(terme) {
    return this.notes.filter(n => 
      n.titre.toLowerCase().includes(terme.toLowerCase()) ||
      n.contenu.toLowerCase().includes(terme.toLowerCase())
    );
  }
  
  sauvegarder() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }
  
  charger() {
    const data = localStorage.getItem("notes");
    return data ? JSON.parse(data) : [];
  }
  
  afficher(notes = this.notes) {
    const div = document.querySelector("#notes");
    div.innerHTML = notes.length 
      ? notes.map(n => new Note(n.id, n.titre, n.contenu, n.categorie).afficher()).join("")
      : "<p>Aucune note</p>";
  }
}

const gestionnaire = new GestionnaireNotes();
gestionnaire.afficher();
window.gestionnaire = gestionnaire;

document.querySelector("#ajouter").addEventListener("click", () => {
  const titre = document.querySelector("#titre").value;
  const contenu = document.querySelector("#contenu").value;
  const categorie = document.querySelector("#categorie").value;
  if (titre && contenu) {
    gestionnaire.ajouter(titre, contenu, categorie);
    document.querySelector("#titre").value = "";
    document.querySelector("#contenu").value = "";
  }
});

document.querySelector("#recherche").addEventListener("input", e => {
  const results = gestionnaire.rechercher(e.target.value);
  gestionnaire.afficher(results);
});`,
        ),
        task: "Ajoutez bouton 'Exporter JSON' qui télécharge toutes les notes en fichier JSON.",
        takeaway:
          "Projet POO + localStorage complet. Classes, persistence, recherche. Félicitations niveau intermédiaire ! 🎉",
        quiz: quiz(
          "Pourquoi JSON.stringify dans localStorage ?",
          ["Obligatoire", "localStorage stocke strings uniquement", "Plus rapide"],
          1,
          "localStorage ne stocke que strings. JSON.stringify convertit objets en strings."
        ),
        link: js + "Guide",
      }),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🔴 NIVEAU AVANCÉ - DOM, CSS dynamique, Async et Fetch API
// ═══════════════════════════════════════════════════════════════════════════

const advanced: WebLevel["chapters"] = [
  {
    id: "js-dom",
    title: "Manipulation du DOM",
    description: "Sélectionner et modifier les éléments HTML",
    lessons: [
      lesson({
        id: "js-dom-selection",
        title: "Sélectionner des éléments",
        minutes: 25,
        summary:
          "querySelector() sélectionne le premier élément correspondant. querySelectorAll() retourne tous les éléments. getElementById(), getElementsByClassName() sont aussi disponibles.",
        sections: [
          section(
            "Méthodes de sélection",
            "Accéder aux éléments HTML depuis JavaScript.",
            [
              "querySelector('#id') : sélectionne par ID",
              "querySelector('.classe') : premier élément de classe",
              "querySelectorAll('.classe') : tous les éléments",
              "getElementById('id') : plus rapide pour ID",
              "getElementsByClassName('classe') : collection live",
              "getElementsByTagName('p') : tous les <p>",
            ]
          ),
          section(
            "Parcourir NodeList",
            "querySelectorAll retourne NodeList, pas Array.",
            [
              "forEach() disponible sur NodeList",
              "Array.from(nodeList) pour convertir en Array",
              "Spread : [...nodeList]",
              "for...of fonctionne sur NodeList",
            ]
          ),
        ],
        files: jsFiles(
          "Sélection DOM",
          `<h1>Titre principal</h1>
<p class="texte">Paragraphe 1</p>
<p class="texte">Paragraphe 2</p>
<p class="texte">Paragraphe 3</p>
<div id="resultat"></div>`,
          `// querySelector : premier élément
const titre = document.querySelector("h1");
console.log("Titre:", titre.textContent);

// querySelectorAll : tous les éléments
const paragraphes = document.querySelectorAll(".texte");
console.log("Nombre de paragraphes:", paragraphes.length);

// Parcourir avec forEach
paragraphes.forEach((p, index) => {
  console.log(\`Paragraphe \${index + 1}: \${p.textContent}\`);
});

// Afficher dans le DOM
const resultat = document.querySelector("#resultat");
resultat.innerHTML = \`
  <h3>Résultats</h3>
  <p>Titre: \${titre.textContent}</p>
  <p>Paragraphes: \${paragraphes.length}</p>
\`;`,
        ),
        task: "Ajoutez 3 divs avec classe 'carte'. Sélectionnez-les et affichez leur nombre.",
        takeaway:
          "querySelector() pour un élément, querySelectorAll() pour plusieurs. forEach pour parcourir.",
        quiz: quiz(
          "Différence entre querySelector et querySelectorAll ?",
          ["Aucune", "querySelector retourne 1 élément, querySelectorAll tous", "querySelector est plus lent"],
          1,
          "querySelector retourne le premier élément trouvé, querySelectorAll retourne tous les éléments (NodeList)."
        ),
        link: js + "Reference/Global_Objects/Document/querySelector",
      }),
      lesson({
        id: "js-dom-manipulation",
        title: "Modifier le DOM",
        minutes: 30,
        summary:
          "textContent modifie le texte. innerHTML modifie le HTML. createElement() crée élément. appendChild() l'ajoute. classList.add/remove pour les classes CSS.",
        sections: [
          section(
            "Modifier contenu",
            "Changer texte et HTML des éléments.",
            [
              "textContent : contenu texte pur",
              "innerHTML : contenu HTML (attention XSS)",
              "innerText : texte visible (respecte CSS)",
              "value : valeur des inputs",
            ]
          ),
          section(
            "Créer et ajouter éléments",
            "Construire le DOM dynamiquement.",
            [
              "createElement('div') : créer élément",
              "appendChild(element) : ajouter à la fin",
              "prepend(element) : ajouter au début",
              "remove() : supprimer élément",
              "replaceWith(newElement) : remplacer",
            ]
          ),
          section(
            "Manipuler classes CSS",
            "Ajouter/retirer classes pour styling dynamique.",
            [
              "classList.add('classe') : ajouter",
              "classList.remove('classe') : retirer",
              "classList.toggle('classe') : basculer",
              "classList.contains('classe') : vérifier",
              "className : toutes les classes (string)",
            ]
          ),
        ],
        files: jsFiles(
          "Manipulation DOM",
          `<div id="container">
  <h2>Liste de tâches</h2>
  <button id="ajouter">Ajouter tâche</button>
  <ul id="liste"></ul>
</div>`,
          `let compteur = 1;

document.querySelector("#ajouter").addEventListener("click", () => {
  // Créer nouvel élément
  const li = document.createElement("li");
  li.textContent = \`Tâche \${compteur}\`;
  li.classList.add("tache");
  
  // Bouton supprimer
  const btnSupprimer = document.createElement("button");
  btnSupprimer.textContent = "✕";
  btnSupprimer.style.marginLeft = "10px";
  
  btnSupprimer.addEventListener("click", () => {
    li.remove();
  });
  
  li.appendChild(btnSupprimer);
  
  // Ajouter à la liste
  document.querySelector("#liste").appendChild(li);
  
  compteur++;
});

// Styling
const style = document.createElement("style");
style.textContent = \`
  .tache {
    padding: 8px;
    margin: 5px 0;
    background: #f0f0f0;
    border-radius: 4px;
  }
\`;
document.head.appendChild(style);`,
        ),
        task: "Modifiez pour que cliquer sur une tâche la barre (toggle classe 'complete' avec text-decoration: line-through).",
        takeaway:
          "textContent/innerHTML modifient contenu. createElement/appendChild créent éléments. classList pour classes CSS.",
        quiz: quiz(
          "Quelle méthode pour ajouter classe CSS ?",
          ["className.add()", "classList.add()", "addClass()"],
          1,
          "classList.add('classe') ajoute une classe CSS à un élément."
        ),
        link: js + "Reference/Global_Objects/Element/classList",
      }),
    ],
  },
  {
    id: "js-evenements",
    title: "Gestion des événements",
    description: "Réagir aux interactions utilisateur",
    lessons: [
      lesson({
        id: "js-events-base",
        title: "addEventListener et types d'événements",
        minutes: 25,
        summary:
          "addEventListener('event', callback) écoute événements. Types : click, input, submit, keydown, mouseover. event.preventDefault() empêche comportement par défaut.",
        sections: [
          section(
            "Écouter événements",
            "Réagir aux actions utilisateur.",
            [
              "addEventListener('click', callback)",
              "callback reçoit event object",
              "event.target : élément cliqué",
              "event.type : type d'événement",
              "removeEventListener : arrêter écoute",
            ]
          ),
          section(
            "Types d'événements courants",
            "Souris, clavier, formulaires.",
            [
              "click, dblclick : clic souris",
              "input, change : champs formulaire",
              "submit : envoi formulaire",
              "keydown, keyup : touches clavier",
              "mouseover, mouseout : survol souris",
              "focus, blur : focus input",
            ]
          ),
        ],
        files: jsFiles(
          "Événements",
          `<button id="btn">Clique-moi</button>
<input type="text" id="champ" placeholder="Tape quelque chose">
<p id="compteur">Clics: 0</p>
<p id="saisie"></p>`,
          `let clics = 0;

// Événement click
document.querySelector("#btn").addEventListener("click", (event) => {
  clics++;
  document.querySelector("#compteur").textContent = \`Clics: \${clics}\`;
  console.log("Clic sur:", event.target);
});

// Événement input (temps réel)
document.querySelector("#champ").addEventListener("input", (event) => {
  const valeur = event.target.value;
  document.querySelector("#saisie").textContent = \`Tu tapes: "\${valeur}"\`;
});

// Événement keydown
document.querySelector("#champ").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    alert(\`Tu as tapé: \${event.target.value}\`);
  }
});`,
        ),
        task: "Ajoutez bouton 'Réinitialiser' qui remet compteur à 0 et vide le champ.",
        takeaway:
          "addEventListener écoute événements. event.target est l'élément. click, input, submit, keydown sont événements courants.",
        quiz: quiz(
          "Comment empêcher envoi d'un formulaire ?",
          ["event.stop()", "event.preventDefault()", "return false"],
          1,
          "event.preventDefault() dans le listener 'submit' empêche l'envoi par défaut."
        ),
        link: js + "Reference/Global_Objects/EventTarget/addEventListener",
      }),
      lesson({
        id: "js-events-delegation",
        title: "Event delegation et propagation",
        minutes: 25,
        summary:
          "Événements remontent (bubbling). Event delegation : écouter sur parent au lieu de chaque enfant. event.stopPropagation() arrête propagation.",
        sections: [
          section(
            "Bubbling (remontée)",
            "Événements remontent de l'élément cliqué vers parents.",
            [
              "Phase capture : descend vers cible",
              "Phase target : sur élément ciblé",
              "Phase bubbling : remonte vers parents",
              "Par défaut : addEventListener en phase bubbling",
              "event.stopPropagation() : arrête remontée",
            ]
          ),
          section(
            "Event Delegation",
            "Écouter sur parent pour gérer enfants dynamiques.",
            [
              "Utile pour listes dynamiques",
              "Un seul listener au lieu de plusieurs",
              "Fonctionne avec éléments ajoutés après",
              "Vérifier event.target pour filtrer",
            ]
          ),
        ],
        files: jsFiles(
          "Event Delegation",
          `<div id="app">
  <h3>Liste (event delegation)</h3>
  <button id="ajouter">Ajouter item</button>
  <ul id="liste"></ul>
</div>`,
          `let compteur = 1;

// Event delegation : un seul listener sur parent
document.querySelector("#liste").addEventListener("click", (event) => {
  // Vérifier que c'est un LI qui a été cliqué
  if (event.target.tagName === "LI") {
    event.target.classList.toggle("actif");
  }
});

// Ajouter items dynamiquement
document.querySelector("#ajouter").addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = \`Item \${compteur}\`;
  li.style.padding = "8px";
  li.style.cursor = "pointer";
  document.querySelector("#liste").appendChild(li);
  compteur++;
});

// Style pour classe actif
const style = document.createElement("style");
style.textContent = \`.actif { background: #4CAF50; color: white; }\`;
document.head.appendChild(style);

console.log("Clique sur les items pour les activer");`,
        ),
        task: "Ajoutez bouton '×' dans chaque item. Utilisez delegation pour supprimer item cliqué (event.stopPropagation pour ne pas activer).",
        takeaway:
          "Événements remontent (bubbling). Event delegation : écouter sur parent. event.target indique élément cliqué.",
        quiz: quiz(
          "Avantage de event delegation ?",
          ["Plus rapide", "Fonctionne avec éléments ajoutés dynamiquement", "Aucun"],
          1,
          "Event delegation fonctionne automatiquement avec les éléments ajoutés après le chargement."
        ),
        link: js + "Learn/Events/Event_delegation",
      }),
    ],
  },
  {
    id: "js-css-dynamique",
    title: "CSS dynamique",
    description: "Modifier styles avec JavaScript",
    lessons: [
      lesson({
        id: "js-style-inline",
        title: "Propriété style et CSS inline",
        minutes: 20,
        summary:
          "element.style.property modifie CSS inline. Noms CSS en camelCase : background-color → backgroundColor. style.cssText pour plusieurs propriétés.",
        sections: [
          section(
            "Modifier styles inline",
            "Changer CSS directement depuis JS.",
            [
              "element.style.color = 'red'",
              "CSS en camelCase : backgroundColor, fontSize",
              "style.cssText = 'color: red; font-size: 20px'",
              "Priorité : inline > classes > feuille",
              "Vider : style.property = ''",
            ]
          ),
          section(
            "Lire styles calculés",
            "Obtenir style appliqué (pas seulement inline).",
            [
              "getComputedStyle(element).property",
              "Retourne valeur finale après cascade CSS",
              "Inclut styles de feuille externe",
              "Valeurs calculées (ex: em → px)",
            ]
          ),
        ],
        files: jsFiles(
          "Style inline",
          `<div id="boite" style="width: 100px; height: 100px; background: blue;"></div>
<button id="rouge">Rouge</button>
<button id="grand">Agrandir</button>
<button id="reset">Reset</button>
<p id="info"></p>`,
          `const boite = document.querySelector("#boite");

// Changer couleur
document.querySelector("#rouge").addEventListener("click", () => {
  boite.style.backgroundColor = "red";
  boite.style.borderRadius = "50%";
});

// Agrandir
document.querySelector("#grand").addEventListener("click", () => {
  const largeur = parseInt(boite.style.width);
  boite.style.width = (largeur + 20) + "px";
  boite.style.height = (largeur + 20) + "px";
});

// Reset
document.querySelector("#reset").addEventListener("click", () => {
  boite.style.cssText = "width: 100px; height: 100px; background: blue;";
});

// Lire style calculé
const styles = getComputedStyle(boite);
document.querySelector("#info").textContent = \`
  Largeur: \${styles.width}
  Couleur: \${styles.backgroundColor}
\`;`,
        ),
        task: "Ajoutez bouton 'Aléatoire' qui applique couleur RGB aléatoire à la boîte.",
        takeaway:
          "element.style.property modifie CSS inline. CamelCase pour noms CSS. getComputedStyle() lit styles appliqués.",
        quiz: quiz(
          "Comment écrire background-color en JS ?",
          ["background-color", "backgroundColor", "bgColor"],
          1,
          "Les propriétés CSS avec tiret deviennent camelCase : backgroundColor."
        ),
        link: js + "Reference/Global_Objects/HTMLElement/style",
      }),
      lesson({
        id: "js-css-classes",
        title: "Animations et transitions CSS",
        minutes: 25,
        summary:
          "Animations CSS déclenchées par classes JS. transition pour animations simples. @keyframes pour animations complexes. classList.toggle pour basculer.",
        sections: [
          section(
            "CSS Transitions",
            "Animer changements de propriétés CSS.",
            [
              "transition: property duration easing",
              "Ex: transition: all 0.3s ease",
              "Déclencher en changeant classe/style JS",
              "Propriétés animables : opacity, transform, colors",
            ]
          ),
          section(
            "CSS Animations",
            "Animations avec keyframes.",
            [
              "@keyframes nom { from {} to {} }",
              "Étapes : 0%, 50%, 100%",
              "animation: nom duration easing",
              "Ajouter classe pour déclencher",
            ]
          ),
        ],
        files: jsFiles(
          "Animations CSS + JS",
          `<button id="animer">Animer</button>
<div id="carre"></div>`,
          `// CSS dans style tag
const style = document.createElement("style");
style.textContent = \`
  #carre {
    width: 100px;
    height: 100px;
    background: #4CAF50;
    transition: all 0.3s ease;
  }
  
  #carre.anime {
    transform: scale(1.5) rotate(45deg);
    background: #FF5722;
    border-radius: 50%;
  }
  
  @keyframes rebond {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-50px); }
  }
  
  #carre.rebond {
    animation: rebond 0.5s ease;
  }
\`;
document.head.appendChild(style);

// Toggle animation
document.querySelector("#animer").addEventListener("click", () => {
  const carre = document.querySelector("#carre");
  
  // Toggle classe anime
  carre.classList.toggle("anime");
  
  // Animation rebond au clic
  carre.classList.add("rebond");
  setTimeout(() => carre.classList.remove("rebond"), 500);
});`,
        ),
        task: "Créez animation 'pulse' (échelle 1 → 1.2 → 1) sur 1s. Appliquez au survol du carré.",
        takeaway:
          "CSS transitions pour changements simples. @keyframes pour animations complexes. JS ajoute/retire classes pour déclencher.",
        quiz: quiz(
          "Quelle propriété CSS pour transition simple ?",
          ["animation", "transition", "transform"],
          1,
          "transition définit comment animer les changements de propriété CSS."
        ),
        link: mdn + "Web/CSS/CSS_Transitions/Using_CSS_transitions",
      }),
    ],
  },
  {
    id: "js-async",
    title: "Programmation asynchrone",
    description: "Async/Await et Promises",
    lessons: [
      lesson({
        id: "js-promises",
        title: "Promises : then et catch",
        minutes: 25,
        summary:
          "Promise représente opération asynchrone. États : pending, fulfilled, rejected. .then() pour succès, .catch() pour erreur. Chaînage avec .then().",
        sections: [
          section(
            "Comprendre Promises",
            "Gérer opérations asynchrones (réseau, timers).",
            [
              "new Promise((resolve, reject) => {})",
              "resolve(valeur) : succès",
              "reject(erreur) : échec",
              "États : pending → fulfilled ou rejected",
              ".then(callback) : exécute si succès",
              ".catch(callback) : exécute si erreur",
            ]
          ),
          section(
            "Chaînage",
            "Enchaîner opérations asynchrones.",
            [
              ".then retourne nouvelle Promise",
              "Chaîner : .then().then().then()",
              ".catch attrape erreurs de toute chaîne",
              ".finally() : exécute dans tous cas",
            ]
          ),
        ],
        files: jsFiles(
          "Promises",
          `<button id="demarrer">Démarrer</button>
<p id="status">En attente...</p>`,
          `// Fonction retournant Promise
function attendre(ms, valeur) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ms > 0) {
        resolve(valeur);
      } else {
        reject(new Error("Durée invalide"));
      }
    }, ms);
  });
}

document.querySelector("#demarrer").addEventListener("click", () => {
  const status = document.querySelector("#status");
  
  status.textContent = "⏳ Étape 1...";
  
  attendre(1000, "Étape 1 OK")
    .then(result => {
      console.log(result);
      status.textContent = "⏳ Étape 2...";
      return attendre(1000, "Étape 2 OK");
    })
    .then(result => {
      console.log(result);
      status.textContent = "⏳ Étape 3...";
      return attendre(1000, "Étape 3 OK");
    })
    .then(result => {
      console.log(result);
      status.textContent = "✅ Terminé !";
    })
    .catch(error => {
      status.textContent = "❌ Erreur: " + error.message;
      console.error(error);
    });
});`,
        ),
        task: "Modifiez pour qu'étape 2 rejette (reject) après 500ms. Observez catch.",
        takeaway:
          "Promise gère async. .then() pour succès, .catch() pour erreur. Chaînage avec .then().",
        quiz: quiz(
          "Que fait .catch() ?",
          ["Arrête Promise", "Attrape erreurs", "Crée Promise"],
          1,
          ".catch(callback) exécute callback si Promise est rejetée (erreur)."
        ),
        link: js + "Reference/Global_Objects/Promise",
      }),
      lesson({
        id: "js-async-await",
        title: "async/await : syntaxe moderne",
        minutes: 30,
        summary:
          "async function retourne Promise. await attend résolution. Code asynchrone ressemble à code synchrone. try/catch pour erreurs.",
        sections: [
          section(
            "async/await",
            "Syntaxe plus lisible pour Promises.",
            [
              "async function : retourne Promise automatiquement",
              "await expression : attend Promise",
              "await uniquement dans async function",
              "Code linéaire au lieu de .then()",
              "try/catch pour gérer erreurs",
            ]
          ),
          section(
            "Avantages",
            "Code plus facile à lire et débugger.",
            [
              "Syntaxe synchrone pour code async",
              "Meilleure gestion erreurs",
              "Stack traces plus claires",
              "Facilite conditions et boucles async",
            ]
          ),
        ],
        files: jsFiles(
          "async/await",
          `<button id="demarrer">Démarrer</button>
<p id="status">En attente...</p>
<ul id="logs"></ul>`,
          `// Fonction async helper
function attendre(ms, valeur) {
  return new Promise(resolve => setTimeout(() => resolve(valeur), ms));
}

function log(message) {
  const li = document.createElement("li");
  li.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
  document.querySelector("#logs").prepend(li);
}

// Fonction async/await
async function executerTaches() {
  const status = document.querySelector("#status");
  
  try {
    status.textContent = "⏳ Démarrage...";
    log("Démarrage");
    
    status.textContent = "⏳ Tâche 1...";
    const resultat1 = await attendre(1000, "Tâche 1 terminée");
    log(resultat1);
    
    status.textContent = "⏳ Tâche 2...";
    const resultat2 = await attendre(1000, "Tâche 2 terminée");
    log(resultat2);
    
    status.textContent = "⏳ Tâche 3...";
    const resultat3 = await attendre(1000, "Tâche 3 terminée");
    log(resultat3);
    
    status.textContent = "✅ Tout est terminé !";
    log("✅ Succès total");
    
  } catch (error) {
    status.textContent = "❌ Erreur: " + error.message;
    log("❌ " + error.message);
  }
}

document.querySelector("#demarrer").addEventListener("click", () => {
  executerTaches();
});`,
        ),
        task: "Ajoutez tâche 4 qui simule erreur : throw new Error('Problème'). Observez try/catch.",
        takeaway:
          "async function retourne Promise. await attend résultat. try/catch pour erreurs. Syntaxe linéaire vs .then().",
        quiz: quiz(
          "Où utiliser await ?",
          ["N'importe où", "Seulement dans async function", "Seulement au top-level"],
          1,
          "await ne peut être utilisé que dans une fonction marquée async."
        ),
        link: js + "Reference/Statements/async_function",
      }),
    ],
  },
  {
    id: "js-fetch",
    title: "Fetch API",
    description: "Récupérer données via API REST",
    lessons: [
      lesson({
        id: "js-fetch-get",
        title: "fetch() et requêtes GET",
        minutes: 30,
        summary:
          "fetch(url) récupère données. Retourne Promise. .json() parse réponse JSON. async/await simplifie code. Gestion erreurs réseau et HTTP.",
        sections: [
          section(
            "Fetch API",
            "Requêtes HTTP modernes en JavaScript.",
            [
              "fetch(url) : Promise<Response>",
              "response.json() : parse JSON",
              "response.ok : true si 200-299",
              "response.status : code HTTP",
              "Async par défaut",
            ]
          ),
          section(
            "Pattern async/await",
            "Syntaxe recommandée avec fetch.",
            [
              "await fetch(url)",
              "await response.json()",
              "try/catch pour erreurs",
              "Vérifier response.ok",
            ]
          ),
        ],
        files: jsFiles(
          "Fetch GET",
          `<h2>API Publique</h2>
<button id="charger">Charger utilisateurs</button>
<div id="resultat"></div>`,
          `async function chargerUtilisateurs() {
  const resultat = document.querySelector("#resultat");
  
  try {
    resultat.innerHTML = "⏳ Chargement...";
    
    // Requête GET
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    
    // Vérifier statut
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    
    // Parser JSON
    const users = await response.json();
    
    // Afficher (5 premiers)
    const html = users.slice(0, 5).map(user => \`
      <div style="border: 1px solid #ddd; padding: 10px; margin: 5px;">
        <strong>\${user.name}</strong> (@\${user.username})<br>
        📧 \${user.email}<br>
        🏙️ \${user.address.city}
      </div>
    \`).join("");
    
    resultat.innerHTML = \`<h3>Utilisateurs</h3>\${html}\`;
    
  } catch (error) {
    resultat.innerHTML = \`❌ Erreur: \${error.message}\`;
    console.error(error);
  }
}

document.querySelector("#charger").addEventListener("click", () => {
  chargerUtilisateurs();
});`,
        ),
        task: "Utilisez https://jsonplaceholder.typicode.com/posts pour afficher 10 posts (title, body).",
        takeaway:
          "fetch(url) fait requête HTTP. response.json() parse JSON. async/await + try/catch pour gérer.",
        quiz: quiz(
          "fetch retourne quoi ?",
          ["JSON directement", "Promise<Response>", "Array"],
          1,
          "fetch() retourne Promise qui résout en Response. Il faut .json() pour parser."
        ),
        link: js + "Reference/Global_Objects/fetch",
      }),
      lesson({
        id: "js-fetch-post",
        title: "POST, PUT, DELETE",
        minutes: 30,
        summary:
          "fetch avec options : method, headers, body. POST pour créer, PUT pour modifier, DELETE pour supprimer. JSON.stringify() pour body. Headers Content-Type application/json.",
        sections: [
          section(
            "Options fetch",
            "Personnaliser requêtes HTTP.",
            [
              "method: 'POST', 'PUT', 'DELETE'",
              "headers: { 'Content-Type': 'application/json' }",
              "body: JSON.stringify(data)",
              "Options par défaut : GET, no body",
            ]
          ),
          section(
            "CRUD complet",
            "Create, Read, Update, Delete.",
            [
              "GET : lire (par défaut)",
              "POST : créer (avec body)",
              "PUT/PATCH : modifier (avec body)",
              "DELETE : supprimer",
            ]
          ),
        ],
        files: jsFiles(
          "Fetch POST",
          `<h2>CRUD API</h2>
<input id="titre" placeholder="Titre post">
<button id="creer">Créer</button>
<button id="modifier">Modifier ID 1</button>
<button id="supprimer">Supprimer ID 1</button>
<pre id="resultat"></pre>`,
          `const API = "https://jsonplaceholder.typicode.com/posts";

// POST : Créer
document.querySelector("#creer").addEventListener("click", async () => {
  try {
    const titre = document.querySelector("#titre").value;
    
    const response = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: titre,
        body: "Contenu du post",
        userId: 1
      })
    });
    
    const data = await response.json();
    document.querySelector("#resultat").textContent = 
      "✅ Créé:\\n" + JSON.stringify(data, null, 2);
      
  } catch (error) {
    document.querySelector("#resultat").textContent = "❌ " + error.message;
  }
});

// PUT : Modifier
document.querySelector("#modifier").addEventListener("click", async () => {
  try {
    const response = await fetch(API + "/1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 1,
        title: "Titre modifié",
        body: "Contenu modifié",
        userId: 1
      })
    });
    
    const data = await response.json();
    document.querySelector("#resultat").textContent = 
      "✅ Modifié:\\n" + JSON.stringify(data, null, 2);
      
  } catch (error) {
    document.querySelector("#resultat").textContent = "❌ " + error.message;
  }
});

// DELETE : Supprimer
document.querySelector("#supprimer").addEventListener("click", async () => {
  try {
    const response = await fetch(API + "/1", {
      method: "DELETE"
    });
    
    if (response.ok) {
      document.querySelector("#resultat").textContent = "✅ Supprimé (ID 1)";
    }
    
  } catch (error) {
    document.querySelector("#resultat").textContent = "❌ " + error.message;
  }
});`,
        ),
        task: "Créez interface avec liste, formulaire ajout, boutons modifier/supprimer par item.",
        takeaway:
          "fetch avec method, headers, body pour POST/PUT/DELETE. JSON.stringify pour body. Content-Type: application/json.",
        quiz: quiz(
          "Comment envoyer données JSON en POST ?",
          ["body: data", "body: JSON.stringify(data)", "data: JSON"],
          1,
          "body doit être string : body: JSON.stringify(data) pour envoyer JSON."
        ),
        link: js + "Reference/Global_Objects/fetch#parameters",
      }),
    ],
  },
  {
    id: "js-projet-avance",
    title: "Projet final avancé",
    description: "Application web complète",
    lessons: [
      lesson({
        id: "js-projet-meteo",
        title: "Projet : Application Météo (Fetch + DOM + CSS)",
        minutes: 60,
        summary:
          "Application complète : Fetch API météo, manipulation DOM, CSS dynamique, événements, async/await. Interface interactive avec recherche ville et affichage données.",
        sections: [
          section(
            "Objectif",
            "Application météo utilisant toutes notions avancées.",
            [
              "Fetch : API météo OpenWeatherMap (gratuite)",
              "DOM : affichage dynamique résultats",
              "Événements : recherche, boutons",
              "CSS : animations, responsive",
              "Async : gestion appels API",
              "Erreurs : messages utilisateur clairs",
            ]
          ),
          section(
            "Fonctionnalités",
            "Interface utilisateur complète.",
            [
              "Recherche ville par nom",
              "Affichage : température, description, icône",
              "Prévisions 5 jours",
              "Gestion erreurs (ville inexistante, réseau)",
              "Animation chargement",
              "Design responsive",
            ]
          ),
          section(
            "Architecture",
            "Code organisé et réutilisable.",
            [
              "Fonctions async pour API",
              "Fonctions DOM séparées",
              "Gestion d'état simple",
              "Event delegation",
              "Classes CSS pour states",
            ]
          ),
        ],
        files: jsFiles(
          "App Météo",
          `<div id="app">
  <h1>🌤️ Météo App</h1>
  <div class="recherche">
    <input id="ville" placeholder="Entrez une ville" />
    <button id="chercher">Rechercher</button>
  </div>
  <div id="resultat"></div>
  <div id="previsions"></div>
</div>`,
          `// Configuration API (utilisez votre clé gratuite sur openweathermap.org)
const API_KEY = "VOTRE_CLE_API";
const API_URL = "https://api.openweathermap.org/data/2.5";

// Fonction : Récupérer météo
async function obtenirMeteo(ville) {
  const url = \`\${API_URL}/weather?q=\${ville}&appid=\${API_KEY}&units=metric&lang=fr\`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(response.status === 404 ? "Ville introuvable" : "Erreur réseau");
  }
  
  return await response.json();
}

// Fonction : Afficher météo
function afficherMeteo(data) {
  const resultat = document.querySelector("#resultat");
  
  resultat.innerHTML = \`
    <div class="meteo-card">
      <h2>\${data.name}, \${data.sys.country}</h2>
      <div class="temperature">\${Math.round(data.main.temp)}°C</div>
      <div class="description">\${data.weather[0].description}</div>
      <div class="details">
        💧 Humidité: \${data.main.humidity}%<br>
        💨 Vent: \${data.wind.speed} m/s<br>
        🌡️ Ressenti: \${Math.round(data.main.feels_like)}°C
      </div>
    </div>
  \`;
  
  resultat.classList.add("visible");
}

// Fonction : Afficher erreur
function afficherErreur(message) {
  const resultat = document.querySelector("#resultat");
  resultat.innerHTML = \`<div class="erreur">❌ \${message}</div>\`;
  resultat.classList.add("visible");
}

// Fonction : Afficher chargement
function afficherChargement() {
  const resultat = document.querySelector("#resultat");
  resultat.innerHTML = '<div class="chargement">⏳ Chargement...</div>';
  resultat.classList.add("visible");
}

// Event : Recherche
document.querySelector("#chercher").addEventListener("click", async () => {
  const ville = document.querySelector("#ville").value.trim();
  
  if (!ville) {
    afficherErreur("Entrez un nom de ville");
    return;
  }
  
  try {
    afficherChargement();
    const data = await obtenirMeteo(ville);
    afficherMeteo(data);
  } catch (error) {
    afficherErreur(error.message);
  }
});

// Event : Enter dans input
document.querySelector("#ville").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.querySelector("#chercher").click();
  }
});

// Styles CSS
const style = document.createElement("style");
style.textContent = \`
  #app {
    max-width: 500px;
    margin: 50px auto;
    font-family: system-ui;
  }
  
  .recherche {
    display: flex;
    gap: 10px;
    margin: 20px 0;
  }
  
  #ville {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 8px;
  }
  
  #chercher {
    padding: 10px 20px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
  }
  
  #chercher:hover {
    background: #1976D2;
  }
  
  #resultat {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  #resultat.visible {
    opacity: 1;
  }
  
  .meteo-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }
  
  .temperature {
    font-size: 64px;
    font-weight: bold;
    margin: 20px 0;
  }
  
  .description {
    font-size: 24px;
    text-transform: capitalize;
    margin-bottom: 20px;
  }
  
  .details {
    text-align: left;
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
    line-height: 1.8;
  }
  
  .erreur {
    background: #f44336;
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  
  .chargement {
    background: #FF9800;
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
\`;
document.head.appendChild(style);

console.log("🌤️ App Météo chargée !");
console.log("Note: Obtenez une clé API gratuite sur openweathermap.org");`,
        ),
        task: "Extensions : 1) Prévisions 5 jours 2) Géolocalisation navigateur 3) Historique recherches (localStorage) 4) Mode sombre",
        takeaway:
          "Application complète DOM + Fetch + CSS + Async. Architecture modulaire. Gestion erreurs. UX fluide.",
        quiz: quiz(
          "Quelles notions avancées sont utilisées ?",
          ["Seulement Fetch", "Fetch + DOM + Events + CSS + Async", "Seulement CSS"],
          1,
          "Le projet combine toutes les notions avancées : Fetch API, manipulation DOM, événements, CSS dynamique, async/await."
        ),
        link: "https://openweathermap.org/api",
      }),
    ],
  },
];

export const javascriptLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Fondamentaux JavaScript ES6+",
    color: levelColors[0],
    objective:
      "Maîtriser les bases de JavaScript : variables, fonctions, tableaux, objets. Syntaxe moderne ES6+.",
    prerequisites:
      "Aucun. Connaissances HTML/CSS recommandées mais pas obligatoires.",
    outcomes: [
      "Écrire des scripts JavaScript",
      "Utiliser let, const, fonctions fléchées",
      "Manipuler tableaux et objets",
      "Comprendre scope et closures",
    ],
    projects: javascriptProjects.debutant,
    chapters: beginner,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "POO et méthodes avancées",
    color: levelColors[1],
    objective:
      "Maîtriser la POO en JavaScript, méthodes array modernes, destructuring, modules ES6.",
    prerequisites:
      "Niveau débutant complété. Bases JavaScript solides.",
    outcomes: [
      "Créer classes ES6 avec héritage",
      "Utiliser map, filter, reduce",
      "Maîtriser destructuring et spread",
      "Organiser code en modules",
    ],
    projects: [],
    chapters: intermediate,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "DOM, CSS, Async et Fetch API",
    color: levelColors[2],
    objective:
      "Créer applications web complètes : manipuler DOM, gérer événements, CSS dynamique, appels API avec Fetch.",
    prerequisites:
      "Niveaux débutant et intermédiaire complétés. Maîtrise POO.",
    outcomes: [
      "Comprendre et manipuler le DOM",
      "Gérer événements utilisateur",
      "Modifier CSS dynamiquement",
      "Programmer de manière asynchrone (async/await)",
      "Consommer API REST avec Fetch",
      "Créer application web interactive",
    ],
    projects: [],
    chapters: advanced,
  },
];

