import { jsFiles, lesson, levelColors, quiz, section } from "./courseAuthoring";
import { javascriptProjects } from "./javascriptProjects";
import type { WebLevel } from "./webCourseTypes";

const mdn = "https://developer.mozilla.org/fr/docs/";
const js = mdn + "Web/JavaScript/";

export const javascriptLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Logique et manipulation du HTML",
    color: levelColors[0],
    objective:
      "Écrire tes premiers scripts et rendre une page interactive en réagissant aux actions de l’utilisateur.",
    prerequisites:
      "Savoir créer une petite page HTML et modifier ses styles CSS.",
    outcomes: [
      "Lier un fichier JavaScript et utiliser la console.",
      "Manipuler variables, conditions, boucles et fonctions.",
      "Écouter un événement et modifier le DOM.",
    ],
    projects: javascriptProjects.debutant,
    chapters: [
      {
        id: "fondations",
        title: "Fondations et rôle de JavaScript",
        description: "Faire le lien entre une page et son comportement.",
        lessons: [
          lesson({
            id: "navigateur",
            title: "JavaScript dans le navigateur",
            minutes: 12,
            summary:
              "JavaScript transforme une page statique en interface capable de réagir à un clic, à une saisie ou à des données reçues.",
            sections: [
              section(
                "Trois rôles dans une page",
                "Imagine un bouton de vote. HTML place le bouton et le score, CSS dessine leur apparence et JavaScript fait évoluer le score quand quelqu’un clique.",
                [
                  "Le navigateur interprète le script sur l’appareil de l’utilisateur.",
                  "Le DOM représente les éléments de la page sous forme d’objets accessibles au script.",
                  "Un environnement comme Node.js permet aussi d’utiliser JavaScript en dehors du navigateur.",
                ],
              ),
              section(
                "Observer une interaction",
                "Dans l’exemple, le script trouve un bouton et un paragraphe. Il associe une fonction au clic. La fonction change le texte à l’écran et écrit une trace dans la console.",
                [
                  "Lis index.html pour retrouver les identifiants message et saluer.",
                  "Exécute le code, clique sur le bouton puis observe le texte.",
                  "La console explique le passage du clic au changement visible.",
                ],
              ),
            ],
            files: jsFiles(
              "Première interaction",
              '<main><h1>Première interaction</h1><p id="message" aria-live="polite">Prêt à essayer ?</p><button id="saluer">Dire bonjour</button></main>',
              `const message = document.querySelector("#message");
const bouton = document.querySelector("#saluer");
bouton.addEventListener("click", () => {
  message.textContent = "Bonjour, bienvenue sur DevAfrica !";
  console.log("Le bouton a reçu un clic.");
});`,
            ),
            task: "Remplace le texte affiché après le clic par un message de bienvenue pour ton projet.",
            takeaway:
              "Une interaction relie une action, une fonction et une mise à jour de l’interface.",
            quiz: quiz(
              "Quel fichier décrit le comportement du bouton ?",
              ["styles.css", "script.js", "Une image PNG"],
              1,
              "Le script associe une fonction au clic. HTML fournit le bouton et CSS peut lui donner un style.",
            ),
            link: js + "Guide",
          }),
          lesson({
            id: "liaison-console",
            title: "Relier script.js et lire la console",
            minutes: 16,
            summary:
              "Prépare trois fichiers dans VS Code et utilise la console pour vérifier ce que fait ton programme.",
            sections: [
              section(
                "Relier les fichiers",
                "Crée index.html, styles.css et script.js dans le même dossier. À la fin de body, la balise script dont src vaut ./script.js indique au navigateur où trouver le code.",
                [
                  "Le chemin ./script.js désigne un fichier dans le dossier courant.",
                  'Les exemples utilisent type="module" pour permettre les imports dans les leçons suivantes.',
                  "Avec un serveur local comme Live Server, enregistre tes fichiers avant de vérifier la page.",
                ],
              ),
              section(
                "Déboguer à partir d’un indice",
                "Sur ton ordinateur, ouvre les outils de développement avec F12 puis l’onglet Console. Ici, la console de l’atelier affiche aussi les traces. Commence par vérifier que le script démarre, puis affiche les valeurs qui te surprennent.",
                [
                  "console.log affiche une valeur utile au diagnostic.",
                  "Une erreur ReferenceError peut signaler un nom mal écrit ou indisponible.",
                  "Lis le premier message d’erreur et la ligne indiquée avant de modifier plusieurs fichiers.",
                ],
              ),
            ],
            files: jsFiles(
              "Lire la console",
              '<main><h1>Lire la console</h1><p id="etat">Le script va démarrer.</p></main>',
              `console.log("script.js est chargé");
const projet = "Mon premier site";
console.info("Projet :", projet);
document.querySelector("#etat").textContent = projet;`,
            ),
            task: "Change la valeur de projet, relance l’aperçu et vérifie le texte dans les deux panneaux.",
            takeaway:
              "La console aide à distinguer un problème de chargement d’un problème de logique.",
            quiz: quiz(
              "Quel attribut donne le chemin du fichier JavaScript ?",
              ["class", "href", "src"],
              2,
              "La balise script utilise src pour charger un fichier externe.",
            ),
            link: mdn + "Web/HTML/Reference/Elements/script",
          }),
        ],
      },
      {
        id: "syntaxe",
        title: "Syntaxe moderne et logique de base",
        description: "Stocker, comparer et transformer des valeurs.",
        lessons: [
          lesson({
            id: "variables",
            title: "Variables, constantes et types",
            minutes: 18,
            summary:
              "Choisis un nom de variable qui décrit sa valeur et distingue les chaînes, les nombres et les booléens.",
            sections: [
              section(
                "Choisir let ou const",
                "Utilise let quand une variable doit recevoir une nouvelle valeur, comme un compteur. Utilise const quand la liaison reste la même, comme le nom d’un projet. Les propriétés d’un objet déclaré avec const peuvent encore changer.",
                [
                  'Une chaîne représente du texte, par exemple "DevAfrica".',
                  "Un nombre permet un calcul, par exemple 3 + 2.",
                  "Un booléen vaut true ou false et sert souvent à représenter un état.",
                ],
              ),
              section(
                "Lire et convertir une saisie",
                "La valeur d’un champ de formulaire est une chaîne. Convertis-la avec Number lorsque tu veux calculer et vérifie le résultat avec Number.isFinite.",
                [
                  "typeof aide à connaître le type d’une valeur.",
                  'Number("12") donne le nombre 12.',
                  'Vérifie séparément une chaîne vide avant de la convertir, car Number("") vaut 0.',
                ],
              ),
            ],
            files: jsFiles(
              "Variables",
              '<main><h1>Variables</h1><pre id="resultat" class="output"></pre></main>',
              `const nom = "DevAfrica";
let score = 2;
score += 3;
const objectifAtteint = score >= 5;
const lignes = [nom, "Score : " + score, "Objectif atteint : " + objectifAtteint];
document.querySelector("#resultat").textContent = lignes.join("\\n");
console.log(typeof nom, typeof score, typeof objectifAtteint);`,
            ),
            task: "Change le score initial et observe quand objectifAtteint passe de true à false.",
            takeaway:
              "Les noms décrivent les données et les types déterminent les opérations possibles.",
            quiz: quiz(
              "Quelle déclaration permet de réaffecter un compteur ?",
              ["let", "const", "type"],
              0,
              "let permet d’attribuer une nouvelle valeur à la variable.",
            ),
            link: js + "Guide/Grammar_and_types",
          }),
          lesson({
            id: "conditions-boucles",
            title: "Conditions, comparaisons et boucles",
            minutes: 20,
            summary:
              "Décide quoi afficher selon une condition, puis parcours une liste pour appliquer la même logique à plusieurs valeurs.",
            sections: [
              section(
                "Choisir une branche",
                "if teste une condition. else if permet de tester un autre cas et else traite les cas restants. Place la condition la plus spécifique avant une condition plus générale.",
                [
                  "=== compare la valeur et le type.",
                  "!== signifie que les valeurs sont différentes au sens strict.",
                  "&& exige que deux conditions soient vraies. || accepte qu’au moins une le soit.",
                ],
              ),
              section(
                "Répéter une opération",
                "for...of parcourt directement les valeurs d’un tableau. Une boucle for avec un compteur aide quand tu as besoin de l’indice. Vérifie la condition d’arrêt pour les boucles à compteur.",
                [
                  "Utilise une variable descriptive pour la valeur courante.",
                  "break quitte la boucle lorsqu’une recherche a réussi.",
                  "Teste les seuils, par exemple un score de 4, de 5 et de 6.",
                ],
              ),
            ],
            files: jsFiles(
              "Décisions et boucles",
              '<main><h1>Résultats du groupe</h1><ul id="liste"></ul></main>',
              `const scores = [2, 5, 8, 10];
const liste = document.querySelector("#liste");
for (const score of scores) {
  let niveau;
  if (score >= 8) niveau = "Objectif dépassé";
  else if (score >= 5) niveau = "Objectif atteint";
  else niveau = "À retravailler";
  const item = document.createElement("li");
  item.textContent = score + " points · " + niveau;
  liste.append(item);
}
console.log(5 === "5");`,
            ),
            task: "Ajoute 4 et 6 au tableau. Explique pourquoi ils ne suivent pas la même branche.",
            takeaway:
              "Une condition permet un choix. Une boucle applique ce choix à plusieurs éléments.",
            quiz: quiz(
              'Quelle est la valeur de 5 === "5" ?',
              ["true", "false", "5"],
              1,
              'Le nombre 5 et la chaîne "5" n’ont pas le même type, donc l’égalité stricte vaut false.',
            ),
            link: js + "Guide/Control_flow_and_error_handling",
          }),
          lesson({
            id: "fonctions",
            title: "Fonctions fléchées et valeurs de retour",
            minutes: 16,
            summary:
              "Regroupe un calcul dans une fonction, donne-lui des paramètres et réutilise le résultat retourné.",
            sections: [
              section(
                "Donner un rôle à chaque fonction",
                "Une fonction prend éventuellement des paramètres. Elle peut calculer une valeur et la retourner. Un nom comme calculerTotal décrit ce que l’appelant obtient.",
                [
                  "Avec une expression seule, la flèche peut retourner directement le résultat.",
                  "Avec un bloc entre accolades, écris return pour produire une valeur.",
                  "Appelle calculerTotal(12, 3) pour transmettre deux arguments.",
                ],
              ),
              section(
                "Séparer calcul et affichage",
                "La fonction de calcul peut être testée avec plusieurs valeurs. Une autre partie du programme décide comment afficher le résultat dans le DOM.",
                [
                  "Teste aussi une quantité de zéro.",
                  "Déclare une valeur par défaut avec quantite = 1.",
                  "Réutilise la même fonction au lieu de répéter le calcul dans plusieurs écouteurs.",
                ],
              ),
            ],
            files: jsFiles(
              "Fonctions fléchées",
              '<main><h1>Calculer un total</h1><output id="total" class="output"></output></main>',
              `const calculerTotal = (prix, quantite = 1) => prix * quantite;
const afficherMontant = montant => {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(montant);
};
const total = calculerTotal(12, 3);
document.querySelector("#total").textContent = afficherMontant(total);
console.log(calculerTotal(12), calculerTotal(12, 0));`,
            ),
            task: "Ajoute une fonction qui applique une remise de 10 % et affiche le nouveau total.",
            takeaway:
              "Une fonction réutilisable a des entrées et une responsabilité claires.",
            quiz: quiz(
              "Dans une fonction fléchée avec accolades, que faut-il écrire pour renvoyer une valeur ?",
              ["break", "continue", "return"],
              2,
              "return termine la fonction et transmet la valeur à l’appelant.",
            ),
            link: js + "Reference/Functions/Arrow_functions",
          }),
        ],
      },
      {
        id: "dom",
        title: "DOM et événements",
        description: "Réagir aux actions et rendre les changements visibles.",
        lessons: [
          lesson({
            id: "selection-dom",
            title: "Sélectionner et modifier le DOM",
            minutes: 17,
            summary:
              "Retrouve un élément avec un sélecteur puis modifie son texte, son style ou ses classes.",
            sections: [
              section(
                "Retrouver un élément",
                'document.querySelector prend un sélecteur CSS et renvoie le premier élément correspondant. Par exemple, #titre vise l’élément qui porte id="titre".',
                [
                  "La méthode renvoie null si rien ne correspond.",
                  "document.querySelectorAll permet de récupérer plusieurs éléments.",
                  "Choisis des identifiants cohérents entre index.html et script.js.",
                ],
              ),
              section(
                "Mettre à jour l’interface",
                "textContent remplace le texte. style.color modifie une propriété de style. Pour plusieurs états visuels, définis les styles dans CSS et change une classe avec classList.",
                [
                  "Affiche une saisie comme texte avec textContent.",
                  "Ajoute ou enlève une classe avec classList.toggle.",
                  "Utilise aria-live pour signaler certains résultats qui changent après une action.",
                ],
              ),
            ],
            files: jsFiles(
              "Modifier le DOM",
              '<main><h1 id="titre" aria-live="polite">Un titre à transformer</h1><button id="modifier">Modifier le titre</button></main>',
              `const titre = document.querySelector("#titre");
const bouton = document.querySelector("#modifier");
bouton.addEventListener("click", () => {
  titre.textContent = "Le DOM vient de changer";
  titre.style.color = "#2468ad";
});`,
            ),
            task: "Ajoute une classe CSS puis remplace le changement de style direct par classList.toggle.",
            takeaway:
              "Le DOM est la représentation vivante des éléments que ton script manipule.",
            quiz: quiz(
              "Que renvoie querySelector quand le sélecteur ne correspond à rien ?",
              ["Une liste vide", "null", "Le premier bouton"],
              1,
              "Vérifie le sélecteur et l’existence de l’élément avant de lire ses propriétés.",
            ),
            link: mdn + "Web/API/Document/querySelector",
          }),
          lesson({
            id: "evenements",
            title: "Clic, saisie et soumission de formulaire",
            minutes: 20,
            summary:
              "Attache une fonction à l’événement adapté et récupère la valeur saisie au moment où elle change.",
            sections: [
              section(
                "Écouter une action",
                "addEventListener associe un type d’événement à une fonction. Le navigateur appelle la fonction lorsque l’action se produit. L’objet événement fournit des informations sur cette action.",
                [
                  "click convient à l’activation d’un bouton.",
                  "input est déclenché pendant la saisie.",
                  "submit se produit lorsque le formulaire est soumis, aussi au clavier.",
                ],
              ),
              section(
                "Prendre en charge un formulaire",
                "Dans cet exercice, preventDefault permet de gérer la soumission dans la page. Lis et nettoie la saisie avec trim, puis affiche un retour compréhensible.",
                [
                  "Donne un label au champ.",
                  'Garde un bouton type="submit" pour permettre la validation au clavier.',
                  "Un formulaire relié à un serveur exige aussi une validation côté serveur.",
                ],
              ),
            ],
            files: jsFiles(
              "Événements",
              '<main><h1>Message personnalisé</h1><form id="formulaire" class="actions"><label>Prénom <input id="prenom" required maxlength="30"></label><button>Saluer</button></form><p id="saisie"></p><p id="reponse" aria-live="polite"></p></main>',
              `const champ = document.querySelector("#prenom");
champ.addEventListener("input", () => {
  document.querySelector("#saisie").textContent = champ.value.length + " caractères";
});
document.querySelector("#formulaire").addEventListener("submit", evenement => {
  evenement.preventDefault();
  const prenom = champ.value.trim();
  document.querySelector("#reponse").textContent = prenom ? "Bienvenue, " + prenom + " !" : "Écris ton prénom.";
});`,
            ),
            task: 'Ajoute un bouton type="button" qui vide le champ et le résultat.',
            takeaway:
              "Écoute submit pour les formulaires afin de prendre en charge la souris et le clavier.",
            quiz: quiz(
              "Quel événement suivre pour afficher un compteur pendant la saisie ?",
              ["input", "load", "submit"],
              0,
              "input se déclenche à chaque modification de la valeur par l’utilisateur.",
            ),
            link: mdn + "Web/API/EventTarget/addEventListener",
          }),
        ],
      },
    ],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Tableaux, objets et données distantes",
    color: levelColors[1],
    objective:
      "Organiser des données, les transformer puis lire une API ou un stockage local sans recharger la page.",
    prerequisites:
      "Savoir écrire une fonction, traiter un événement et modifier le DOM.",
    outcomes: [
      "Transformer des tableaux d’objets.",
      "Attendre une réponse et traiter les erreurs réseau.",
      "Sauvegarder des données et séparer le code en modules.",
    ],
    projects: javascriptProjects.intermediaire,
    chapters: [
      {
        id: "donnees",
        title: "Objets, tableaux et JSON",
        description: "Donner une forme lisible à des données plus riches.",
        lessons: [
          lesson({
            id: "objets-json",
            title: "Objets et format JSON",
            minutes: 19,
            summary:
              "Un objet JavaScript regroupe des propriétés. JSON représente des données sous forme de texte, pour les échanger ou les enregistrer.",
            sections: [
              section(
                "Nommer les propriétés",
                'Un objet comme { nom: "Léa", age: 28 } donne un nom à chaque information. Lis nom avec utilisateur.nom et emploie les crochets quand le nom de la propriété est calculé.',
                [
                  "Une propriété peut contenir une liste ou un autre objet.",
                  "Un tableau d’objets représente bien une collection de projets ou de personnes.",
                  "La déstructuration extrait des propriétés dans des variables.",
                ],
              ),
              section(
                "Passer du texte aux données",
                "JSON.stringify transforme des données en texte. JSON.parse lit du JSON et reconstruit les valeurs correspondantes. Le JSON impose notamment des guillemets doubles autour des noms de propriétés.",
                [
                  "Vérifie la forme des données après un JSON.parse.",
                  "Utilise try/catch si le texte peut être invalide.",
                  "Les fonctions et les méthodes ne font pas partie du format JSON.",
                ],
              ),
            ],
            files: jsFiles(
              "Objets et JSON",
              '<main><h1>De l’objet au JSON</h1><pre class="output" id="json"></pre></main>',
              `const utilisateur = { nom: "Léa", age: 28, competences: ["HTML", "JavaScript"] };
const texte = JSON.stringify(utilisateur, null, 2);
const { nom, competences } = JSON.parse(texte);
document.querySelector("#json").textContent = texte;
console.log(nom, competences.join(", "));`,
            ),
            task: "Ajoute une propriété projets qui contient deux objets avec un titre et un état.",
            takeaway:
              "Tu manipules des objets dans le programme et tu échanges leur représentation JSON sous forme de texte.",
            quiz: quiz(
              "Quelle méthode lit une chaîne JSON ?",
              ["JSON.stringify", "Object.keys", "JSON.parse"],
              2,
              "JSON.parse transforme le texte JSON en valeur JavaScript.",
            ),
            link: js + "Reference/Global_Objects/JSON",
          }),
          lesson({
            id: "methodes-tableaux",
            title: "map, filter, forEach et reduce",
            minutes: 24,
            summary:
              "Choisis une méthode de tableau selon le résultat attendu. Cela rend l’intention du code visible au premier regard.",
            sections: [
              section(
                "Transformer et sélectionner",
                "map fabrique un nouveau tableau à partir des résultats de la fonction. filter garde les éléments pour lesquels la fonction renvoie une valeur vraie.",
                [
                  "map transforme chaque projet en un titre.",
                  "filter sélectionne les projets déjà publiés.",
                  "Tu peux enchaîner filter puis map pour préparer une liste de titres.",
                ],
              ),
              section(
                "Parcourir et accumuler",
                "forEach appelle une fonction pour chaque élément, par exemple pour écrire dans la console. reduce accumule une valeur en traversant le tableau, comme une somme ou un regroupement.",
                [
                  "Donne une valeur initiale à reduce, par exemple 0 pour une somme.",
                  "Quand une fonction reçoit un objet du tableau, évite de le modifier par inadvertance.",
                  "Une boucle for...of reste pratique si tu dois t’arrêter en cours de parcours.",
                ],
              ),
            ],
            files: jsFiles(
              "Méthodes de tableaux",
              '<main><h1>Projets publiés</h1><pre class="output" id="resultat"></pre></main>',
              `const projets = [
  { titre: "Portfolio", publie: true, vues: 12 },
  { titre: "Carnet", publie: false, vues: 0 },
  { titre: "Météo", publie: true, vues: 8 }
];
const publies = projets.filter(projet => projet.publie);
const titres = publies.map(projet => projet.titre);
const total = publies.reduce((somme, projet) => somme + projet.vues, 0);
publies.forEach(projet => console.log(projet.titre, projet.vues));
document.querySelector("#resultat").textContent = titres.join(", ") + " · " + total + " vues";`,
            ),
            task: "Ajoute un projet publié de 5 vues et affiche seulement les titres dont le nombre de vues dépasse 10.",
            takeaway:
              "Sélectionne avec filter, transforme avec map et calcule une valeur finale avec reduce.",
            quiz: quiz(
              "Quelle méthode garde seulement les éléments qui satisfont une condition ?",
              ["forEach", "filter", "map"],
              1,
              "filter renvoie un nouveau tableau contenant les éléments retenus.",
            ),
            link: js + "Reference/Global_Objects/Array",
          }),
        ],
      },
      {
        id: "asynchrone",
        title: "Promesses et appels API",
        description: "Attendre des données et réagir aux états d’une requête.",
        lessons: [
          lesson({
            id: "promesses",
            title: "Promesses, async et await",
            minutes: 22,
            summary:
              "Une promesse représente le résultat futur d’une opération. Avec await, une fonction async attend le résultat pendant que l’interface peut continuer à répondre.",
            sections: [
              section(
                "Lire les états d’une promesse",
                "Une promesse est en attente, puis résolue avec une valeur ou rejetée avec une erreur. Une fonction async retourne toujours une promesse.",
                [
                  "await reprend l’exécution de cette fonction quand le résultat arrive.",
                  "try/catch permet de traiter un rejet attendu.",
                  "finally remet l’interface dans un état utilisable après un succès ou un échec.",
                ],
              ),
              section(
                "Informer pendant l’attente",
                "Avant de démarrer une opération lente, indique l’attente dans l’interface. Remplace cette indication par le résultat ou par un message d’erreur précis.",
                [
                  "L’exemple simule une opération de 700 ms pour observer l’ordre des événements.",
                  "Évite les demandes en double quand un bouton lance la même tâche.",
                  "Définis ce que l’utilisateur peut encore faire pendant le chargement.",
                ],
              ),
            ],
            files: jsFiles(
              "Attendre une promesse",
              '<main><h1>Une opération asynchrone</h1><button id="charger">Lancer</button><p id="etat" role="status">Prêt.</p></main>',
              `const bouton = document.querySelector("#charger");
const etat = document.querySelector("#etat");
const attendre = delai => new Promise(resolve => setTimeout(resolve, delai));
bouton.addEventListener("click", async () => {
  bouton.disabled = true;
  etat.textContent = "Chargement simulé…";
  try {
    await attendre(700);
    etat.textContent = "Les données simulées sont prêtes.";
  } catch (erreur) {
    etat.textContent = erreur.message;
  } finally {
    bouton.disabled = false;
  }
});`,
            ),
            task: "Remplace la résolution par un rejet pour vérifier le message d’erreur et la réactivation du bouton.",
            takeaway:
              "Les états d’attente, de réussite et d’échec font partie du fonctionnement d’une interface.",
            quiz: quiz(
              "Quelle partie s’exécute après le try ou le catch ?",
              ["finally", "await", "else"],
              0,
              "finally sert ici à réactiver le bouton dans les deux cas.",
            ),
            link: js + "Guide/Using_promises",
          }),
          lesson({
            id: "fetch-api",
            title: "Interroger une API avec fetch",
            minutes: 24,
            summary:
              "Envoie une requête HTTP, vérifie la réponse puis utilise le JSON pour mettre à jour la page.",
            sections: [
              section(
                "Comprendre une requête",
                "Une API expose des adresses appelées endpoints. Avec GET, tu peux lire des informations. L’API de géocodage accepte ici un nom de ville et renvoie des coordonnées.",
                [
                  "URLSearchParams encode les paramètres de recherche.",
                  "await fetch renvoie un objet Response.",
                  "response.ok indique une réponse HTTP de succès. Vérifie-le avant response.json().",
                ],
              ),
              section(
                "Traiter les résultats",
                "Un service peut répondre avec une liste vide, une erreur ou une structure différente de celle attendue. Vérifie chaque cas et explique-le dans la page.",
                [
                  "Sépare l’erreur HTTP du cas où aucune ville ne correspond.",
                  "Le mini-projet météo enchaîne deux appels, géocodage puis mesures actuelles.",
                  "L’atelier autorise les API utilisées dans les exercices. Tu peux changer d’API dans ton propre projet local.",
                ],
              ),
            ],
            files: jsFiles(
              "Une requête fetch",
              '<main><h1>Trouver des coordonnées</h1><button id="charger">Chercher Toamasina</button><p id="etat" role="status"></p></main>',
              `const bouton = document.querySelector("#charger");
const etat = document.querySelector("#etat");
bouton.addEventListener("click", async () => {
  etat.textContent = "Recherche en cours…";
  bouton.disabled = true;
  try {
    const params = new URLSearchParams({ name: "Toamasina", count: "1", language: "fr" });
    const reponse = await fetch("https://geocoding-api.open-meteo.com/v1/search?" + params, { signal: AbortSignal.timeout(8000) });
    if (!reponse.ok) throw new Error("HTTP " + reponse.status);
    const { results } = await reponse.json();
    const ville = results?.[0];
    etat.textContent = ville ? ville.name + " · " + ville.latitude + ", " + ville.longitude : "Ville introuvable.";
  } catch (erreur) { etat.textContent = "Recherche indisponible : " + erreur.message; }
  finally { bouton.disabled = false; }
});`,
            ),
            task: "Remplace le nom de la ville par une autre puis ajoute un champ pour que l’utilisateur choisisse le lieu.",
            takeaway:
              "Lis le contrat de l’API et traite les réponses possibles avant d’afficher un résultat.",
            quiz: quiz(
              "Quelle propriété vérifier pour détecter un code HTTP 404 ?",
              ["response.style", "response.length", "response.ok"],
              2,
              "fetch peut fournir une réponse HTTP en erreur. response.ok permet d’identifier les réponses de succès.",
            ),
            link: mdn + "Web/API/Fetch_API/Using_Fetch",
          }),
        ],
      },
      {
        id: "stockage-modules",
        title: "Stockage local et premiers modules",
        description: "Retrouver les données et partager les fonctions.",
        lessons: [
          lesson({
            id: "local-storage",
            title: "Conserver des données avec localStorage",
            minutes: 20,
            summary:
              "Enregistre une petite valeur dans le navigateur et recharge-la au démarrage. Les clés et les valeurs de localStorage sont des chaînes.",
            sections: [
              section(
                "Sauvegarder et relire",
                "setItem enregistre une valeur sous une clé. getItem relit la valeur et renvoie null si la clé n’existe pas. Pour une liste ou un objet, utilise JSON.stringify et JSON.parse.",
                [
                  "Choisis une clé stable, par exemple prefere-theme.",
                  "Définis une valeur par défaut à la première ouverture.",
                  "removeItem efface une clé précise.",
                ],
              ),
              section(
                "Limiter ce que tu conserves",
                "Le stockage local convient aux préférences et aux petits brouillons. Dans l’atelier, il est propre à l’exercice. Dans une application, pense à la taille disponible et aux données à partager entre appareils.",
                [
                  "Enregistre quand une valeur change.",
                  "Traite le cas d’une ancienne sauvegarde invalide.",
                  "Teste une relance de l’aperçu pour vérifier que la préférence revient.",
                ],
              ),
            ],
            files: jsFiles(
              "Préférence enregistrée",
              '<main><h1>Une préférence locale</h1><label>Mode <select id="mode"><option value="clair">Clair</option><option value="sombre">Sombre</option></select></label><p id="etat" role="status"></p></main>',
              `const mode = document.querySelector("#mode");
const cle = "theme-exercice";
const sauvegarde = localStorage.getItem(cle);
mode.value = sauvegarde === "sombre" ? "sombre" : "clair";
function afficher() {
  document.body.classList.toggle("sombre", mode.value === "sombre");
  document.querySelector("#etat").textContent = "Mode choisi : " + mode.value;
}
mode.addEventListener("change", () => {
  localStorage.setItem(cle, mode.value);
  afficher();
});
afficher();`,
              { css: "body.sombre { background: #122b43; color: #edf6ff; }" },
            ),
            task: "Choisis Sombre, relance l’aperçu puis ajoute un bouton qui supprime la préférence et remet le mode Clair.",
            takeaway:
              "Sauvegarde une petite donnée utile et prévois toujours son absence au premier lancement.",
            quiz: quiz(
              "Que renvoie getItem pour une clé absente ?",
              ["Une chaîne vide", "null", "false"],
              1,
              "getItem renvoie null lorsque la clé n’a pas encore été enregistrée.",
            ),
            link: mdn + "Web/API/Window/localStorage",
          }),
          lesson({
            id: "modules-es",
            title: "Exporter et importer une fonction",
            minutes: 18,
            summary:
              "Découpe le code en fichiers et indique explicitement quelles fonctions les autres fichiers peuvent utiliser.",
            sections: [
              section(
                "Créer un module",
                "Un module a sa propre portée. export rend une valeur disponible. import la récupère à partir du chemin du fichier ou d’un paquet géré par l’outillage.",
                [
                  "Place la fonction de calcul dans calcul.js.",
                  'Dans script.js, importe-la avec import { calculer } from "./calcul.js".',
                  "Utilise un serveur local pour tester les modules sur ton ordinateur.",
                ],
              ),
              section(
                "Vérifier les noms et chemins",
                "Un import nommé doit reprendre le nom exporté, sauf renommage explicite avec as. Un import relatif commence généralement par ./ ou ../.",
                [
                  "Ouvre calcul.js dans l’explorateur de l’atelier pour voir son contenu.",
                  "Vérifie les majuscules dans les noms de fichiers.",
                  'Utilise type="module" dans le HTML pour charger ton fichier d’entrée.',
                ],
              ),
            ],
            files: jsFiles(
              "Deux fichiers JavaScript",
              '<main><h1>Un calcul réutilisé</h1><output id="total" class="output"></output></main>',
              `import { calculer } from "./calcul.js";
document.querySelector("#total").textContent = "Total : " + calculer(7, 4);`,
              {
                modules: {
                  "calcul.js":
                    "export const calculer = (prix, quantite) => prix * quantite;",
                },
              },
            ),
            task: "Ajoute un fichier format.js avec une fonction pour afficher le total puis importe-la.",
            takeaway:
              "Un module rend les dépendances entre tes fichiers explicites.",
            quiz: quiz(
              "Quel mot-clé expose une fonction à un autre fichier ?",
              ["return", "import", "export"],
              2,
              "export rend la fonction disponible pour un import depuis un autre module.",
            ),
            link: js + "Guide/Modules",
          }),
        ],
      },
    ],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Modules, performance et écosystème",
    color: levelColors[2],
    objective:
      "Rendre une application plus fiable en comprenant l’ordre d’exécution, la durée de vie des objets et les frontières entre modules.",
    prerequisites:
      "Être à l’aise avec les tableaux, les objets, les promesses et les premiers modules ES.",
    outcomes: [
      "Prévoir l’ordre des tâches et nettoyer les ressources.",
      "Utiliser classes, prototypes, champs privés et modules.",
      "Situer Node.js, npm, React, Vue et TypeScript dans un projet.",
    ],
    projects: javascriptProjects.avance,
    chapters: [
      {
        id: "execution",
        title: "Mécanique interne et asynchronisme",
        description: "Comprendre quand le code s’exécute et ce qu’il conserve.",
        lessons: [
          lesson({
            id: "event-loop",
            title: "Pile d’exécution et boucle d’événements",
            minutes: 22,
            summary:
              "Observe la différence entre les instructions immédiates, les microtâches de promesses et les tâches de temporisation.",
            sections: [
              section(
                "Suivre la pile d’appels",
                "Quand une fonction en appelle une autre, JavaScript garde la trace des appels en cours dans une pile. Une fois la fonction terminée, l’exécution reprend à l’appel précédent.",
                [
                  "Le code synchrone courant va jusqu’à la fin de sa tâche.",
                  "Un long calcul synchrone peut rendre la page momentanément moins réactive.",
                  "setTimeout demande une exécution ultérieure, même avec un délai de zéro.",
                ],
              ),
              section(
                "Prédire l’ordre",
                "Une fois la pile vide, les réactions de promesses sont exécutées dans la file des microtâches avant la prochaine tâche. Vérifie cet ordre dans la console.",
                [
                  "Dans l’exemple, Début et Fin sont synchrones.",
                  "Le then de la promesse s’exécute ensuite.",
                  "Le timer affiche son message après ces microtâches.",
                ],
              ),
            ],
            files: jsFiles(
              "Event Loop",
              '<main><h1>Dans quel ordre ?</h1><pre class="output" id="ordre"></pre></main>',
              `function tracer(texte) {
  console.log(texte);
  document.querySelector("#ordre").textContent += texte + "\\n";
}
tracer("Début");
setTimeout(() => tracer("Tâche du timer"), 0);
Promise.resolve().then(() => tracer("Microtâche de promesse"));
tracer("Fin");`,
            ),
            task: "Prédit l’ordre avant de lancer l’aperçu. Ajoute queueMicrotask et explique sa position.",
            takeaway:
              "Finir le code synchrone libère la pile. Les microtâches passent avant la prochaine tâche.",
            quiz: quiz(
              "Après Début et Fin, quel message arrive dans cet exemple ?",
              [
                "Tâche du timer",
                "Microtâche de promesse",
                "Un message au hasard",
              ],
              1,
              "La réaction then rejoint la file des microtâches, traitée avant la prochaine tâche du timer.",
            ),
            link: js + "Event_loop",
          }),
          lesson({
            id: "closures-memoire",
            title: "Portée, closures et durée de vie",
            minutes: 24,
            summary:
              "Une closure permet à une fonction de retrouver les variables qui existaient à sa création. Cette propriété aide à organiser l’état et demande d’en comprendre la durée de vie.",
            sections: [
              section(
                "Conserver une variable dans une fonction",
                "creerCompteur crée une variable nombre puis retourne une fonction qui la modifie. Chaque appel à creerCompteur crée un compteur indépendant.",
                [
                  "let et const ont une portée de bloc.",
                  "La fonction retournée garde accès aux variables de son environnement lexical.",
                  "Deux fonctions créées par deux appels distincts peuvent garder des valeurs différentes.",
                ],
              ),
              section(
                "Relâcher les ressources",
                "Le ramasse-miettes peut récupérer les objets devenus inaccessibles. Un timer ou un écouteur encore actif peut maintenir des références dont l’interface n’a plus besoin.",
                [
                  "Garde l’identifiant d’un intervalle pour appeler clearInterval.",
                  "Retire un écouteur lorsqu’un composant disparaît ou annule-le avec un signal.",
                  "Le Memory nettoie ses timers avant une nouvelle partie.",
                ],
              ),
            ],
            files: jsFiles(
              "Deux closures",
              '<main><h1>Compteurs indépendants</h1><div class="actions"><button id="a">Compteur A</button><button id="b">Compteur B</button><button id="arreter">Détacher les écouteurs</button></div><p id="etat" role="status"></p></main>',
              `function creerCompteur(nom) {
  let nombre = 0;
  return () => {
    nombre += 1;
    document.querySelector("#etat").textContent = nom + " : " + nombre;
  };
}
const controleur = new AbortController();
for (const nom of ["a", "b"]) {
  document.querySelector("#" + nom).addEventListener("click", creerCompteur(nom), { signal: controleur.signal });
}
document.querySelector("#arreter").addEventListener("click", () => {
  controleur.abort();
  document.querySelector("#etat").textContent = "Les deux écouteurs sont détachés.";
});`,
            ),
            task: "Clique plusieurs fois sur A puis sur B. Donne à chaque compteur une valeur initiale différente.",
            takeaway:
              "Une closure conserve une référence à son environnement. Nettoie les tâches qui gardent inutilement cet environnement en vie.",
            quiz: quiz(
              "Pourquoi A et B ont-ils des scores distincts ?",
              [
                "Chaque appel crée sa propre variable nombre",
                "Le navigateur mélange les scores",
                "Les deux boutons partagent une variable globale",
              ],
              0,
              "creerCompteur crée un nouvel environnement à chaque appel.",
            ),
            link: js + "Guide/Closures",
          }),
          lesson({
            id: "requetes-paralleles",
            title: "Promise.all et gestion des erreurs",
            minutes: 21,
            summary:
              "Démarre plusieurs opérations indépendantes ensemble et traite un échec en conservant une interface compréhensible.",
            sections: [
              section(
                "Lancer des tâches indépendantes",
                "Promise.all attend toutes les promesses qui lui sont fournies. Le tableau final garde l’ordre des entrées, même quand une opération se termine avant une autre.",
                [
                  "Appelle les fonctions avant d’attendre le groupe.",
                  "Regroupe les opérations qui doivent toutes réussir ensemble.",
                  "Utilise Promise.allSettled quand des résultats partiels restent utiles.",
                ],
              ),
              section(
                "Gérer un rejet",
                "Si l’une des promesses échoue, await Promise.all déclenche le catch. Les autres opérations peuvent continuer. Annule les requêtes qui deviennent inutiles si elles acceptent un signal.",
                [
                  "Affiche un message d’erreur contextualisé.",
                  "Réactive les commandes dans finally.",
                  "Utilise la console pour conserver les détails techniques du diagnostic.",
                ],
              ),
            ],
            files: jsFiles(
              "Travail en parallèle",
              '<main><h1>Deux tâches en parallèle</h1><button id="lancer">Charger les deux</button><label><input id="echec" type="checkbox"> Simuler un échec</label><p id="etat" role="status"></p></main>',
              `const bouton = document.querySelector("#lancer");
const etat = document.querySelector("#etat");
const tache = (nom, delai, echoue = false) => new Promise((resolve, reject) => {
  setTimeout(() => echoue ? reject(new Error(nom + " indisponible")) : resolve(nom), delai);
});
bouton.addEventListener("click", async () => {
  bouton.disabled = true;
  etat.textContent = "Deux opérations simulées en cours…";
  try {
    const resultats = await Promise.all([tache("Profil", 550), tache("Projets", 250, document.querySelector("#echec").checked)]);
    etat.textContent = resultats.join(" et ") + " chargés.";
  } catch (erreur) { etat.textContent = erreur.message; }
  finally { bouton.disabled = false; }
});`,
            ),
            task: "Remplace Promise.all par Promise.allSettled et affiche uniquement les valeurs qui ont réussi.",
            takeaway:
              "Choisis le regroupement selon ce que l’interface peut faire avec des données partielles.",
            quiz: quiz(
              "Que fait Promise.all si une des opérations rejette ?",
              [
                "Il ignore l’erreur",
                "Il transforme le résultat en chaîne vide",
                "La promesse du groupe est rejetée",
              ],
              2,
              "Le rejet du groupe permet de traiter l’échec dans catch.",
            ),
            link: js + "Reference/Global_Objects/Promise/all",
          }),
        ],
      },
      {
        id: "architecture",
        title: "Classes, prototypes et modules",
        description: "Isoler les responsabilités et les données internes.",
        lessons: [
          lesson({
            id: "classes-prototypes",
            title: "Classes, héritage et champs privés",
            minutes: 24,
            summary:
              "Définis les données et les actions d’un objet avec une classe. Les méthodes définies dans la classe sont partagées via son prototype.",
            sections: [
              section(
                "Construire une instance",
                "constructor initialise les propriétés de chaque instance créée avec new. Les méthodes définies dans la classe agissent sur cette instance à travers this.",
                [
                  "Une classe Score peut porter la logique d’un compteur.",
                  "extends permet à une classe de spécialiser une autre classe.",
                  "super appelle le constructeur parent ou une méthode de la classe parente.",
                ],
              ),
              section(
                "Protéger les invariants",
                "Un champ privé commence par #. Il peut être lu ou modifié depuis la classe qui le déclare. Propose une méthode publique pour modifier sa valeur avec une règle.",
                [
                  "Garde les détails de calcul à l’intérieur de la classe.",
                  "Teste les méthodes sans dépendre de la page HTML.",
                  "Le Memory sépare les données d’une carte et les règles de la partie.",
                ],
              ),
            ],
            files: jsFiles(
              "Classe Score",
              '<main><h1>Une classe de score</h1><button id="gagner">Gagner une manche</button><output class="output" id="score">0</output></main>',
              `class Score {
  #points = 0;
  ajouter(points) { this.#points += points; }
  lire() { return this.#points; }
}
class ScoreAvecBonus extends Score {
  gagner() { super.ajouter(2); }
}
const partie = new ScoreAvecBonus();
document.querySelector("#gagner").addEventListener("click", () => {
  partie.gagner();
  document.querySelector("#score").textContent = partie.lire() + " points";
});`,
            ),
            task: "Ajoute une méthode remettreAZero dans Score. Appelle-la depuis un nouveau bouton.",
            takeaway:
              "Une classe rend les règles d’un objet explicites et garde ses données internes sous contrôle.",
            quiz: quiz(
              "Quel préfixe déclare un champ privé dans une classe ?",
              ["$", "#", "@"],
              1,
              "Un nom comme #points déclare un champ privé propre à la classe.",
            ),
            link: js + "Reference/Classes",
          }),
          lesson({
            id: "architecture-modules",
            title: "Organiser le code par responsabilité",
            minutes: 22,
            summary:
              "Sépare les calculs, les données et l’affichage. Tu peux alors relire ou réutiliser une partie du programme sans parcourir tout le projet.",
            sections: [
              section(
                "Tracer des frontières claires",
                "Un fichier de calcul peut recevoir des valeurs et retourner un résultat. Un fichier d’interface lit le DOM et appelle le calcul. Cette séparation facilite les essais avec plusieurs entrées.",
                [
                  "Expose les seules fonctions dont les autres modules ont besoin.",
                  "Évite les dépendances circulaires entre fichiers de haut niveau.",
                  "Donne aux modules un nom qui décrit leur rôle, comme pistes.js ou jeu.js.",
                ],
              ),
              section(
                "Utiliser les exports adaptés",
                "Un fichier peut avoir plusieurs exports nommés et au plus un export default. Préfère une convention cohérente dans le projet. Lis la déclaration export pour écrire l’import correspondant.",
                [
                  "L’import d’un export par défaut s’écrit sans accolades.",
                  "Les exports nommés s’importent avec accolades.",
                  "Teste l’import et le contrat de chaque fonction avant d’ajouter de l’interface.",
                ],
              ),
            ],
            files: jsFiles(
              "Organiser des modules",
              '<main><h1>Une fonction de formatage</h1><p id="sortie" class="output"></p></main>',
              `import formater from "./format.js";
import { projets } from "./projets.js";
document.querySelector("#sortie").textContent = formater(projets.length);`,
              {
                modules: {
                  "format.js":
                    'export default function formater(nombre) { return nombre + " projets disponibles"; }',
                  "projets.js":
                    'export const projets = [{ titre: "Météo" }, { titre: "Memory" }];',
                },
              },
            ),
            task: "Ajoute un export nommé dans format.js pour afficher un résultat au singulier quand nombre vaut 1.",
            takeaway:
              "Des modules courts et orientés vers un rôle simplifient les changements à venir.",
            quiz: quiz(
              "Comment importer un export par défaut ?",
              [
                'import formater from "./format.js"',
                "import { default() }",
                "export formater",
              ],
              0,
              "L’import par défaut choisit un nom local, sans accolades.",
            ),
            link: js + "Guide/Modules",
          }),
        ],
      },
      {
        id: "ecosysteme",
        title: "Outillage et écosystème moderne",
        description: "Passer d’un script à un projet organisé.",
        lessons: [
          lesson({
            id: "node-npm-build",
            title: "Node.js, npm et outils de build",
            minutes: 23,
            summary:
              "Comprends le rôle de chaque outil dans un projet local avant de lancer des commandes dans le terminal.",
            sections: [
              section(
                "Préparer un projet",
                "Node.js exécute JavaScript sur ton ordinateur ou sur un serveur. npm installe les paquets du projet. package.json décrit les dépendances et les scripts. package-lock.json garde les versions résolues.",
                [
                  "Ouvre le terminal dans le dossier qui contient package.json.",
                  "npm ci installe les versions du fichier de verrouillage lorsqu’il est présent et synchronisé.",
                  "npm run dev appelle le script dev défini dans package.json.",
                ],
              ),
              section(
                "Développer et préparer une livraison",
                "Vite fournit un serveur de développement puis une commande de build. Webpack assemble aussi des modules et des ressources selon sa configuration. Le résultat peut ensuite être servi par un hébergement web adapté.",
                [
                  "Le serveur local permet de tester pendant l’écriture du code.",
                  "Une commande de build prépare les fichiers à servir.",
                  "L’exemple ci-dessous affiche les commandes pour ton terminal. L’atelier exécute le JavaScript de la page.",
                ],
              ),
            ],
            files: jsFiles(
              "Repères pour VS Code",
              '<main><h1>Dans le terminal du projet</h1><pre id="commandes" class="output"></pre></main>',
              `const commandes = ["npm ci", "npm run dev", "npm run build"];
document.querySelector("#commandes").textContent = commandes.join("\\n");
console.log("Repère le dossier qui contient package.json avant de lancer ces commandes.");`,
            ),
            task: "Ouvre le package.json de DevAfrica et retrouve les scripts dev et build. Explique quand utiliser chacun.",
            takeaway:
              "Node exécute les outils, npm installe les dépendances et Vite prépare l’application.",
            quiz: quiz(
              "Quel fichier déclare les scripts dev et build ?",
              ["styles.css", "package.json", "index.html"],
              1,
              "La propriété scripts de package.json définit les commandes disponibles via npm run.",
            ),
            link: "https://vite.dev/guide/",
          }),
          lesson({
            id: "react-vue-typescript",
            title: "React, Vue et TypeScript",
            minutes: 19,
            summary:
              "Situe les outils d’interface et le typage pour choisir la suite de ton apprentissage.",
            sections: [
              section(
                "Construire en composants",
                "React est une bibliothèque d’interface centrée sur les composants. Vue propose un cadre progressif avec composants et réactivité. Avec ces outils, des données et un état déterminent ce que l’écran affiche.",
                [
                  "Les compétences en JavaScript, DOM et événements restent utiles.",
                  "Un composant réunit une responsabilité d’interface identifiable.",
                  "Le parcours React reprend les concepts avec des exemples JSX exécutables.",
                ],
              ),
              section(
                "Décrire les formes des données",
                "TypeScript ajoute des types vérifiés par ses outils avant exécution. Le code livré au navigateur est du JavaScript. Les données reçues d’une API demandent toujours des contrôles à l’exécution.",
                [
                  "Commence par typer les paramètres, les retours et les objets de ton domaine.",
                  "Utilise un type union quand une donnée a plusieurs états possibles.",
                  "L’atelier peut transformer un fichier .ts en JavaScript. VS Code et le compilateur TypeScript vérifient les types.",
                ],
              ),
            ],
            files: jsFiles(
              "Une notion de TypeScript",
              '<main><h1>Choisir la suite</h1><p id="suite" class="output"></p></main>',
              `import { decrire } from "./outils.ts";
document.querySelector("#suite").textContent = decrire({ nom: "React", role: "bibliothèque d’interface" });`,
              {
                modules: {
                  "outils.ts":
                    'type Outil = { nom: string; role: string };\n\nexport function decrire(outil: Outil): string {\n  return outil.nom + " · " + outil.role;\n}',
                },
              },
            ),
            task: "Ajoute une propriété optionnelle au type Outil et affiche-la quand elle est renseignée.",
            takeaway:
              "Les composants organisent l’interface. Les types décrivent la forme des données utilisées par le code.",
            quiz: quiz(
              "Quel outil ajoute des annotations de types à JavaScript ?",
              ["Vue", "React", "TypeScript"],
              2,
              "TypeScript étend JavaScript avec une syntaxe de types et des vérifications statiques.",
            ),
            link: "https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html",
          }),
        ],
      },
    ],
  },
];
