import {
  lesson,
  levelColors,
  quiz,
  reactFiles,
  section,
} from "./courseAuthoring";
import { reactProjects } from "./reactProjects";
import type { WebLevel } from "./webCourseTypes";

const react = "https://react.dev/";
const router = "https://reactrouter.com/";

export const reactLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Composants et état local",
    color: levelColors[0],
    objective:
      "Découper une interface en composants, écrire du JSX et mettre à jour l’écran à partir d’un état local.",
    prerequisites:
      "Connaître HTML, CSS, les fonctions JavaScript, les tableaux et les événements.",
    outcomes: [
      "Comprendre le rendu React et le DOM du navigateur.",
      "Utiliser JSX, props, conditions et listes avec des clés.",
      "Déclencher une mise à jour avec useState et des événements.",
    ],
    projects: reactProjects.debutant,
    chapters: [
      {
        id: "fondations",
        title: "Fondations et environnement React",
        description:
          "Comprendre React, sa philosophie, son écosystème et préparer un projet.",
        lessons: [
          lesson({
            id: "introduction-react",
            title: "Qu'est-ce que React ?",
            minutes: 20,
            summary:
              "React est une bibliothèque JavaScript pour construire des interfaces utilisateur. Comprends sa philosophie, son architecture, son écosystème et sa différence avec Vue.",
            sections: [
              section(
                "React : Bibliothèque UI",
                "React se distingue comme une bibliothèque UI : elle se concentre sur le rendu de composants. Pour d'autres besoins (routage, state management), tu ajoutes des outils externes selon tes préférences.",
                [
                  "React est une BIBLIOTHÈQUE UI créée par Facebook (Meta) en 2013. Elle gère le rendu des composants.",
                  "Vue est un FRAMEWORK complet avec un écosystème officiel intégré (Vue Router, Pinia, Vite).",
                  "React laisse le choix : React Router OU TanStack Router, Redux OU Zustand OU Jotai pour le state management.",
                  "Cette flexibilité donne plus de liberté mais nécessite de choisir et configurer les outils soi-même.",
                ],
              ),
              section(
                "Philosophie React : UI as a function of state",
                "React considère l'interface utilisateur comme une fonction de l'état : UI = f(state). Quand l'état change, React recalcule l'interface et met à jour le DOM efficacement.",
                [
                  "Composants : blocs de construction réutilisables qui retournent du JSX.",
                  "JSX : syntaxe qui mélange JavaScript et HTML dans le même fichier.",
                  "Unidirectionnalité des données : les données descendent (parent → enfant via props).",
                  "Virtual DOM : React crée une représentation en mémoire, calcule les différences et met à jour le DOM réel.",
                ],
              ),
              section(
                "Écosystème React",
                "L'écosystème React est vaste et diversifié. Tu choisis les outils qui correspondent à tes besoins.",
                [
                  "React DOM : pour les applications web dans le navigateur.",
                  "React Native : pour créer des applications mobiles iOS et Android.",
                  "Next.js : framework fullstack avec SSR (Server-Side Rendering), SSG (Static Site Generation), API routes.",
                  "Remix : framework fullstack moderne axé sur les standards web.",
                  "React Router / TanStack Router : routage côté client pour les SPA.",
                  "Redux / Zustand / Jotai : state management global.",
                  "TanStack Query : gestion des données serveur (fetch, cache, synchronisation).",
                  "Vite : build tool ultra-rapide pour développement et production.",
                ],
              ),
              section(
                "React vs Vue : Différences clés",
                "Bien que les deux permettent de construire des interfaces modernes, leurs approches diffèrent fondamentalement.",
                [
                  "Bibliothèque vs Framework : React = bibliothèque UI, tu choisis tes outils. Vue = framework complet avec écosystème officiel.",
                  "JSX vs Templates : React mélange JavaScript et HTML dans JSX. Vue sépare HTML (template), JS (script), CSS (style) dans des fichiers .vue.",
                  "Hooks vs Composition API : React utilise useState, useEffect. Vue utilise ref, reactive avec Proxies.",
                  "Popularité : React a un écosystème massif et plus d'offres d'emploi. Vue est plus simple pour les débutants.",
                  "Flexibilité vs Convention : React offre plus de liberté (et de décisions). Vue guide avec des conventions officielles.",
                ],
              ),
              section(
                "Concepts clés React",
                "Quelques concepts fondamentaux pour comprendre comment React fonctionne.",
                [
                  "Virtual DOM : représentation en mémoire du DOM. React compare les versions et met à jour uniquement ce qui a changé.",
                  "Reconciliation : algorithme qui calcule les différences entre deux versions du Virtual DOM.",
                  "Composants fonctionnels : fonctions JavaScript qui retournent du JSX (approche moderne).",
                  "Hooks : fonctions spéciales (useState, useEffect, etc.) qui ajoutent des capacités aux composants fonctionnels.",
                  "Re-render : quand l'état change, React réexécute le composant pour recalculer l'interface.",
                ],
              ),
            ],
            files: reactFiles(
              "Première impression React",
              `function App() {
  const bibliotheque = "React";
  const type = "Bibliothèque UI";
  const createur = "Facebook (Meta)";
  const annee = 2013;
  
  return (
    <main>
      <div className="card">
        <h2>{bibliotheque}</h2>
        <p>Type : {type}</p>
        <p>Créateur : {createur} ({annee})</p>
        <p>Philosophie : UI = f(state)</p>
        <p>Syntaxe : JSX (JavaScript + HTML)</p>
        <p>Écosystème : React Router, Next.js, Redux, TanStack Query</p>
      </div>
    </main>
  );
}`,
            ),
            task: "Observe comment les variables JavaScript sont insérées dans le JSX avec des accolades {}. Modifie les valeurs et vois le résultat.",
            takeaway:
              "React est une bibliothèque UI flexible qui te laisse choisir tes outils. Il utilise JSX et considère l'interface comme une fonction de l'état.",
            quiz: quiz(
              "Quelle est la différence principale entre React et Vue ?",
              [
                "React est une bibliothèque UI, Vue est un framework complet",
                "React ne peut pas faire de SPA",
                "Vue est plus populaire que React",
              ],
              0,
              "React laisse le choix des outils externes. Vue fournit un écosystème officiel intégré.",
            ),
            link: react + "learn",
          }),
          lesson({
            id: "structure-projet-react",
            title: "Créer un projet React et comprendre sa structure",
            minutes: 22,
            summary:
              "Utilise Vite pour créer un projet React moderne. Comprends la structure des dossiers, les fichiers clés et le rôle de JSX.",
            sections: [
              section(
                "Prérequis et création du projet",
                "Node.js version 18+ est nécessaire. La commande npm create vite@latest utilise Vite pour générer un projet React rapide et moderne.",
                [
                  "npm create vite@latest mon-app -- --template react crée un projet React.",
                  "cd mon-app puis npm install pour installer les dépendances.",
                  "npm run dev lance le serveur de développement Vite.",
                  "L'URL (souvent http://localhost:5173/) s'affiche dans le terminal.",
                ],
              ),
              section(
                "Structure des dossiers React",
                "Un projet React suit une organisation flexible. Voici les conventions courantes.",
                [
                  "📁 src/ : Code source de ton application.",
                  "📁 src/components/ : Composants réutilisables (Button.jsx, Card.jsx, Modal.jsx).",
                  "📁 src/pages/ ou src/views/ : Pages principales de l'application (Home.jsx, About.jsx, Profile.jsx).",
                  "📁 src/hooks/ : Custom hooks réutilisables (useAuth.js, useFetch.js).",
                  "📁 src/utils/ : Fonctions utilitaires JavaScript (formatDate.js, validation.js).",
                  "📁 src/assets/ : Images, fonts, fichiers statiques traités par Vite.",
                  "📁 public/ : Fichiers statiques servis tels quels (favicon.ico, robots.txt). Non traités par Vite.",
                ],
              ),
              section(
                "Fichiers principaux du projet",
                "Certains fichiers jouent un rôle central dans le fonctionnement de l'application React.",
                [
                  "📄 index.html : Point d'entrée HTML. Contient <div id='root'></div> où React monte l'application.",
                  "📄 src/main.jsx : Point d'entrée JavaScript. Appelle createRoot et render pour monter App dans #root.",
                  "📄 src/App.jsx : Composant racine de l'application. Point de départ de l'arbre de composants.",
                  "📄 vite.config.js : Configuration Vite (plugins, alias, optimisations).",
                  "📄 package.json : Dépendances npm et scripts. Lance npm run dev, npm run build.",
                ],
              ),
              section(
                "JSX : JavaScript + HTML",
                "JSX est une extension de syntaxe JavaScript qui ressemble à du HTML. Il est transpilé en appels React.createElement.",
                [
                  "JSX permet d'écrire du HTML dans JavaScript : return <div>Hello</div>",
                  "Utilise className au lieu de class (mot réservé JavaScript).",
                  "Insère des expressions JavaScript avec {} : <p>{name}</p>",
                  "Fragments <></> pour grouper des éléments sans nœud DOM supplémentaire.",
                  "JSX est transpilé : <div>Hello</div> devient React.createElement('div', null, 'Hello').",
                ],
              ),
              section(
                "Composants React : Blocs de construction",
                "Un composant React est une fonction JavaScript qui retourne du JSX.",
                [
                  "Nom de composant avec majuscule : function Button() {} (convention).",
                  "Props = entrées du composant (en lecture seule).",
                  "State = données internes modifiables avec useState.",
                  "Re-render : quand state/props changent, React réexécute le composant.",
                  "Export/Import : export default App puis import App from './App'.",
                ],
              ),
            ],
            files: reactFiles(
              "Structure projet React",
              `// Dans src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Dans src/App.jsx
function App() {
  const projectName = "Mon App React";
  const folders = "components, pages, hooks, utils, assets";
  
  return (
    <main>
      <div className="card">
        <h2>{projectName}</h2>
        <p><strong>📁 Dossiers clés :</strong> {folders}</p>
        <p><strong>📄 Fichiers :</strong> main.jsx, App.jsx, vite.config.js</p>
        <p><strong>🔧 Commandes :</strong> npm run dev, npm run build</p>
        <p><strong>🧩 JSX :</strong> JavaScript + HTML dans le même fichier</p>
      </div>
    </main>
  );
}`,
            ),
            task: "Crée un projet React avec npm create vite@latest. Explore src/components, src/main.jsx et src/App.jsx.",
            takeaway:
              "Un projet React suit une structure flexible : components (réutilisables), pages (vues principales), hooks (logique), utils (fonctions). JSX mélange JavaScript et HTML.",
            quiz: quiz(
              "Quel dossier contient les composants réutilisables ?",
              ["src/pages/", "src/components/", "src/assets/"],
              1,
              "src/components/ contient les composants réutilisables. src/pages/ contient les pages principales.",
            ),
            link: "https://vite.dev/guide/",
          }),
          lesson({
            id: "composants-dom",
            title: "Composants, rendu React et DOM",
            minutes: 17,
            summary:
              "React est une bibliothèque d’interface créée chez Facebook, aujourd’hui Meta. Ses composants décrivent des portions d’interface à partir de données.",
            sections: [
              section(
                "Découper un design",
                "Observe ton écran. Un en-tête, une carte de projet et une liste de cartes sont des responsabilités distinctes. En React, une fonction peut décrire chacune d’elles, puis un composant parent les assemble.",
                [
                  "Un composant fonctionnel retourne du JSX.",
                  "Un même composant peut afficher plusieurs projets avec des données différentes.",
                  "Les interfaces React peuvent être des SPA ou s’intégrer à un site rendu côté serveur.",
                ],
              ),
              section(
                "Du rendu à l’écran",
                "Le DOM réel est l’arbre d’éléments du navigateur. Pendant le rendu, React calcule une description de l’interface. L’expression DOM virtuel désigne couramment cette représentation en mémoire. React applique ensuite les changements nécessaires au DOM.",
                [
                  "Une fonction de composant peut être réexécutée pour recalculer le résultat.",
                  "React conserve ou remplace des éléments selon leur type, leur position et leurs clés.",
                  "Décris le résultat attendu pour chaque état. React se charge de synchroniser le DOM.",
                ],
              ),
            ],
            files: reactFiles(
              "Assembler des composants",
              `function Entete() { return <header><h1>Projets DevAfrica</h1><p>Une interface en composants.</p></header>; }
function Carte() { return <article className="card"><h2>Atelier de découverte</h2><p>Ce bloc est décrit par une fonction.</p></article>; }
function App() { return <main><Entete /><Carte /></main>; }`,
            ),
            task: "Crée un composant PiedDePage qui contient un court message et ajoute-le à App.",
            takeaway:
              "React calcule ce qui doit apparaître, puis met à jour le DOM réel.",
            quiz: quiz(
              "Que retourne normalement un composant fonctionnel dans cet exemple ?",
              [
                "Un fichier CSS",
                "Une description d’interface en JSX",
                "Une réponse HTTP",
              ],
              1,
              "Le JSX produit une description que React utilise pour mettre à jour l’interface.",
            ),
            link: react + "learn/render-and-commit",
          }),
          lesson({
            id: "vite",
            title: "Démarrer un projet React avec Vite",
            minutes: 20,
            summary:
              "Crée un projet dans VS Code, repère son fichier d’entrée et lance le serveur de développement depuis le bon dossier.",
            sections: [
              section(
                "Créer le dossier",
                "Dans ton terminal, lance npm create vite@latest mon-app -- --template react. Ouvre mon-app dans VS Code, puis exécute npm install et npm run dev dans ce dossier.",
                [
                  "Repère package.json avant de lancer npm.",
                  "Le terminal affiche l’adresse à ouvrir dans le navigateur.",
                  "Laisse le serveur de développement en cours pendant tes essais.",
                ],
              ),
              section(
                "Lire l’arborescence",
                "index.html contient un élément racine. main.jsx appelle createRoot pour y afficher App. Tu peux remplacer le composant App du modèle par une page simple et supprimer les ressources de démonstration devenues inutiles.",
                [
                  "Garde les imports des fichiers que tu utilises.",
                  "Repère les feuilles CSS chargées par main.jsx ou App.jsx.",
                  "Dans l’atelier, les onglets te permettent de lire les trois fichiers correspondants.",
                ],
              ),
            ],
            files: reactFiles(
              "Premier projet React",
              `function App() {
  return <main><h1>Mon premier projet React</h1><p>Le composant App est monté dans #root.</p>
    <pre className="output">npm create vite@latest mon-app -- --template react{"\\n"}cd mon-app{"\\n"}npm install{"\\n"}npm run dev</pre>
  </main>;
}`,
            ),
            task: "Modifie le titre dans main.jsx. Reproduis ensuite ce composant dans src/App.jsx de ton projet Vite avec export default.",
            takeaway:
              "Le fichier d’entrée relie le composant racine à un élément du document HTML.",
            quiz: quiz(
              "Depuis quel dossier lancer npm run dev ?",
              [
                "Le dossier qui contient package.json",
                "Le sous-dossier des images",
                "N’importe quel dossier",
              ],
              0,
              "npm lit les scripts du package.json du projet courant.",
            ),
            link: "https://vite.dev/guide/",
          }),
        ],
      },
      {
        id: "jsx-props",
        title: "JSX, composants et props",
        description: "Composer une interface et lui transmettre des données.",
        lessons: [
          lesson({
            id: "jsx",
            title: "Écrire tes premiers composants en JSX",
            minutes: 18,
            summary:
              "JSX est une syntaxe qui permet de décrire une interface à l’intérieur d’un fichier JavaScript ou TypeScript.",
            sections: [
              section(
                "Lire une expression JSX",
                "Le balisage ressemble à du HTML. Les accolades permettent d’insérer une expression JavaScript, par exemple {prenom}. Une balise sans contenu peut se fermer avec />.",
                [
                  "Utilise className pour une classe CSS.",
                  "Écris les noms de tes composants avec une majuscule.",
                  "Regroupe plusieurs éléments dans un parent ou dans un fragment <>…</>.",
                ],
              ),
              section(
                "Structurer les fonctions",
                "Le composant Bouton retourne un élément button. App compose ce bouton avec un titre et un paragraphe. Le code de montage affiche App dans le document.",
                [
                  "Utilise return pour produire le JSX.",
                  "Place le JSX sur plusieurs lignes entre parenthèses si cela améliore la lecture.",
                  "Utilise les expressions JSX pour afficher du texte à partir des données.",
                ],
              ),
            ],
            files: reactFiles(
              "Découvrir JSX",
              `const Bouton = () => <button className="btn" type="button">Clique ici</button>;
function App() {
  const titre = "Mon premier composant";
  return <main><h1>{titre}</h1><p>Voici un bouton décrit en JSX.</p><Bouton /></main>;
}`,
            ),
            task: "Ajoute un composant Titre et affiche le nom du projet avec des accolades JSX.",
            takeaway:
              "Une fonction de composant décrit un morceau d’interface et peut utiliser des valeurs JavaScript.",
            quiz: quiz(
              "Quel attribut JSX applique une classe CSS ?",
              ["cssClass", "styleName", "className"],
              2,
              "className associe une classe CSS à l’élément rendu.",
            ),
            link: react + "learn/writing-markup-with-jsx",
          }),
          lesson({
            id: "props",
            title: "Transmettre des données avec les props",
            minutes: 17,
            summary:
              "Un parent transmet des valeurs à ses enfants pour réutiliser une même structure avec plusieurs contenus.",
            sections: [
              section(
                "Lire les propriétés",
                'Quand tu écris <Bouton texte="Valider" />, React donne au composant Bouton un objet de props. La déstructuration { texte } permet de nommer directement la valeur utilisée.',
                [
                  "Passe un texte entre guillemets.",
                  "Passe une expression JavaScript entre accolades, par exemple score={3}.",
                  "Définis une valeur par défaut pour une prop facultative.",
                ],
              ),
              section(
                "Garder un flux clair",
                "Le parent décide des valeurs et l’enfant les lit. Une fonction passée en prop permet à l’enfant de signaler une action au parent. Les props sont traitées comme des valeurs en lecture seule.",
                [
                  "Prépare une prop par information utile.",
                  "Réutilise le composant avec plusieurs valeurs.",
                  "Les données imbriquées dans une balise de composant arrivent dans children.",
                ],
              ),
            ],
            files: reactFiles(
              "Réutiliser un bouton",
              `function Bouton({ texte = "Continuer", onAction }) {
  return <button type="button" onClick={onAction}>{texte}</button>;
}
function App() {
  return <main><h1>Deux usages du même composant</h1><div className="actions">
    <Bouton texte="Valider" onAction={() => console.log("Validation demandée")} />
    <Bouton texte="Enregistrer" onAction={() => console.log("Enregistrement demandé")} />
  </div></main>;
}`,
            ),
            task: "Ajoute un troisième bouton avec une action différente et teste les trois traces dans la console.",
            takeaway:
              "Les props personnalisent un composant. Le parent garde la responsabilité des données qu’il lui transmet.",
            quiz: quiz(
              'Qui choisit la valeur de texte dans <Bouton texte="Valider" /> ?',
              [
                "Le composant parent",
                "La feuille CSS",
                "Le navigateur au hasard",
              ],
              0,
              "Le parent fournit la prop et Bouton l’utilise dans son rendu.",
            ),
            link: react + "learn/passing-props-to-a-component",
          }),
          lesson({
            id: "conditions-listes",
            title: "Rendu conditionnel et listes avec key",
            minutes: 21,
            summary:
              "Affiche un résultat selon une condition et transforme un tableau d’objets en composants avec map.",
            sections: [
              section(
                "Choisir ce qui s’affiche",
                "Une condition peut choisir entre deux éléments avec un ternaire. Utilise && quand un bloc doit apparaître seulement si une condition booléenne est vraie.",
                [
                  "Teste explicitement liste.length > 0.",
                  "Prévois un message lorsque la liste est vide.",
                  "Place un calcul complexe avant return pour garder le JSX lisible.",
                ],
              ),
              section(
                "Identifier les éléments",
                "key aide React à retrouver le même élément entre deux rendus. Prends un identifiant stable lié à la donnée, surtout si des éléments peuvent être ajoutés, retirés ou déplacés.",
                [
                  "Les clés doivent être uniques parmi les éléments frères.",
                  "Place key sur le composant retourné directement par map.",
                  "Les identifiants d’un projet sont plus stables que sa position dans le tableau.",
                ],
              ),
            ],
            files: reactFiles(
              "Afficher une liste",
              `const projets = [{ id: "p1", titre: "Portfolio", publie: true }, { id: "p2", titre: "Météo", publie: false }, { id: "p3", titre: "Memory", publie: true }];
function App() {
  const visibles = projets.filter(projet => projet.publie);
  return <main><h1>Projets publiés</h1>{visibles.length > 0 ? <ul>{visibles.map(projet => <li key={projet.id}>{projet.titre}</li>)}</ul> : <p>Aucun projet publié.</p>}</main>;
}`,
            ),
            task: "Dépublie tous les projets, vérifie le message vide, puis ajoute un projet avec un nouvel identifiant.",
            takeaway:
              "Les conditions choisissent un rendu et les clés associent chaque élément à son identité.",
            quiz: quiz(
              "Quel choix de key convient à une liste réordonnée ?",
              [
                "Math.random() à chaque rendu",
                "L’identifiant stable du projet",
                "La même clé pour tous",
              ],
              1,
              "Une clé stable permet de retrouver la même donnée après un changement d’ordre.",
            ),
            link: react + "learn/rendering-lists",
          }),
        ],
      },
      {
        id: "etat",
        title: "useState et événements",
        description: "Décrire une interface qui réagit aux actions.",
        lessons: [
          lesson({
            id: "use-state",
            title: "Mettre à jour un état avec useState",
            minutes: 22,
            summary:
              "useState associe une valeur conservée par React à une fonction qui demande sa mise à jour.",
            sections: [
              section(
                "Comprendre un instantané d’état",
                "Dans un rendu, score représente la valeur de cet instant. setScore demande un nouveau rendu avec une autre valeur. Quand le résultat dépend du score précédent, passe une fonction à setScore.",
                [
                  "Déclare useState au niveau principal de ton composant.",
                  "Choisis une valeur initiale qui correspond à l’écran de départ.",
                  "setScore(ancien => ancien + 1) calcule à partir de la valeur précédente.",
                ],
              ),
              section(
                "Dériver ce qui peut être calculé",
                "Le texte et la couleur du score peuvent être calculés pendant le rendu. Pour un objet ou un tableau d’état, crée une nouvelle valeur avec un nouveau tableau ou une copie modifiée.",
                [
                  "Garde une source de vérité par donnée.",
                  "Utilise map pour remplacer un élément dans un tableau.",
                  "Évite un état supplémentaire pour un total que tu peux calculer.",
                ],
              ),
            ],
            files: reactFiles(
              "État local",
              `import { useState } from "react";
function App() {
  const [score, setScore] = useState(0);
  return <main><h1>Score réactif</h1><p role="status">Score : {score}</p><div className="actions">
    <button onClick={() => setScore(ancien => ancien + 1)}>Ajouter un point</button>
    <button onClick={() => setScore(0)}>Remettre à zéro</button>
  </div></main>;
}`,
            ),
            task: "Ajoute un bouton qui retire un point et un style qui change quand le score devient négatif.",
            takeaway:
              "Appelle la fonction de mise à jour de l’état pour que React recalcule l’interface.",
            quiz: quiz(
              "Quelle expression incrémente à partir de la valeur précédente ?",
              [
                "score = score + 1",
                "console.log(score)",
                "setScore(ancien => ancien + 1)",
              ],
              2,
              "La fonction passée à setScore reçoit la valeur précédente au moment de la mise à jour.",
            ),
            link: react + "reference/react/useState",
          }),
          lesson({
            id: "evenements",
            title: "Réagir à onClick, onChange et onSubmit",
            minutes: 20,
            summary:
              "Transmets des fonctions aux événements React et mets à jour l’interface au moment de l’action.",
            sections: [
              section(
                "Brancher les fonctions",
                "onClick reçoit une fonction à appeler lors du clic. Écris onClick={enregistrer} pour transmettre la fonction. Une flèche est pratique lorsque tu veux lui passer un argument.",
                [
                  "onChange reçoit l’événement d’un champ modifié.",
                  "onSubmit gère la validation d’un formulaire, y compris avec Entrée.",
                  "e.preventDefault() permet de gérer l’envoi dans l’application.",
                ],
              ),
              section(
                "Relier saisie et résultat",
                "Le formulaire de l’exemple maintient le texte saisi dans l’état. À la soumission, il enregistre un message affiché dans un paragraphe annoncé après la mise à jour.",
                [
                  "Utilise un label pour expliquer le champ.",
                  "Applique trim avant de traiter le texte.",
                  "Sépare la valeur en cours de saisie et le message déjà validé.",
                ],
              ),
            ],
            files: reactFiles(
              "Événements React",
              `import { useState } from "react";
function App() {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  function soumettre(e) {
    e.preventDefault();
    if (nom.trim()) setMessage("Bienvenue, " + nom.trim() + " !");
  }
  return <main><h1>Un formulaire React</h1><form className="actions" onSubmit={soumettre}>
    <label>Prénom <input value={nom} onChange={e => setNom(e.target.value)} required /></label><button>Saluer</button>
    <button type="button" onClick={() => { setNom(""); setMessage(""); }}>Effacer</button>
  </form><p role="status">{message}</p></main>;
}`,
            ),
            task: "Ajoute une limite de caractères et affiche le nombre de caractères saisis en direct.",
            takeaway:
              "Transmets une fonction à un événement. Elle pourra lire la saisie et mettre à jour l’état.",
            quiz: quiz(
              "Que faut-il donner à onClick pour appeler enregistrer au clic ?",
              [
                "onClick={enregistrer}",
                "onClick={enregistrer()}",
                'onClick="enregistrer()"',
              ],
              0,
              "onClick attend une fonction. Écrire enregistrer() l’appellerait pendant le rendu.",
            ),
            link: react + "learn/responding-to-events",
          }),
        ],
      },
    ],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Effets, API, formulaires et navigation",
    color: levelColors[1],
    objective:
      "Synchroniser des composants avec des systèmes externes et organiser une application qui possède plusieurs écrans.",
    prerequisites:
      "Savoir écrire des composants JSX, transmettre des props et gérer un état local.",
    outcomes: [
      "Utiliser les effets avec leurs dépendances et leur nettoyage.",
      "Construire un formulaire contrôlé et partager l’état entre composants.",
      "Définir des routes et lire un paramètre de navigation.",
    ],
    projects: reactProjects.intermediaire,
    chapters: [
      {
        id: "effets-api",
        title: "Effets et requêtes réseau",
        description:
          "Synchroniser l’interface et traiter les réponses asynchrones.",
        lessons: [
          lesson({
            id: "use-effect",
            title: "Synchroniser et nettoyer un effet",
            minutes: 23,
            summary:
              "useEffect sert à synchroniser un composant avec un système externe, par exemple un abonnement, un timer ou une connexion réseau.",
            sections: [
              section(
                "Choisir les dépendances",
                "React exécute l’effet après le rendu appliqué à l’écran. Les dépendances décrivent les valeurs utilisées dans l’effet. Quand elles changent, React nettoie l’ancien effet avant d’installer le nouveau.",
                [
                  "[] correspond à un effet qui ne dépend d’aucune valeur réactive.",
                  "Une valeur dérivée peut être calculée pendant le rendu.",
                  "Inclure les dépendances réelles évite de capturer une ancienne valeur.",
                ],
              ),
              section(
                "Préparer la fin de vie",
                "Le nettoyage est la fonction retournée par l’effet. Il retire l’abonnement, arrête le timer ou annule la requête lorsque le composant disparaît. En développement, Strict Mode peut faire un cycle supplémentaire pour vérifier ce nettoyage.",
                [
                  "Garde l’identifiant d’un timer dans l’effet qui le crée.",
                  "Utilise la mise à jour fonctionnelle de l’état dans un intervalle.",
                  "Masque puis réaffiche le compteur pour vérifier qu’un seul timer tourne.",
                ],
              ),
            ],
            files: reactFiles(
              "Un effet avec nettoyage",
              `import { useEffect, useState } from "react";
function Chrono() {
  const [secondes, setSecondes] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSecondes(avant => avant + 1), 1000);
    console.log("Timer démarré");
    return () => { clearInterval(timer); console.log("Timer arrêté"); };
  }, []);
  return <p>Secondes : {secondes}</p>;
}
function App() {
  const [visible, setVisible] = useState(true);
  return <main><h1>Un effet nettoyé</h1><button onClick={() => setVisible(avant => !avant)}>{visible ? "Masquer le compteur" : "Afficher le compteur"}</button>{visible && <Chrono />}</main>;
}`,
            ),
            task: "Masque le compteur et lis la console. Ajoute une prop intervalle puis utilise-la dans les dépendances.",
            takeaway:
              "L’effet et son nettoyage décrivent ensemble la durée de vie d’une synchronisation.",
            quiz: quiz(
              "Où arrêter un intervalle créé par un effet ?",
              [
                "Dans le JSX",
                "Dans la fonction retournée par l’effet",
                "Dans package.json",
              ],
              1,
              "React appelle le nettoyage avant de réinstaller l’effet et au démontage.",
            ),
            link: react + "reference/react/useEffect",
          }),
          lesson({
            id: "api",
            title: "Charger une API et afficher ses états",
            minutes: 25,
            summary:
              "Récupère un JSON après le montage puis affiche un chargement, des données ou un message d’erreur.",
            sections: [
              section(
                "Écrire un effet asynchrone",
                "Déclare une fonction async à l’intérieur de useEffect. Elle utilise fetch et vérifie response.ok. La fonction principale de l’effet peut alors retourner son nettoyage immédiatement.",
                [
                  "Crée un AbortController pour annuler une requête devenue inutile.",
                  "Lis et vérifie le format des données reçues.",
                  "axios est une autre bibliothèque HTTP. Ici, fetch suffit pour le même objectif pédagogique.",
                ],
              ),
              section(
                "Rendre les états compréhensibles",
                "Un indicateur d’attente, une erreur explicite et un résultat lisible évitent de laisser un écran vide. Si l’URL change, annule la requête précédente et évite d’afficher une réponse devenue obsolète.",
                [
                  "Le code de l’exemple lit une petite liste de produits de démonstration.",
                  "Teste l’interface sans réseau pour observer l’état d’erreur.",
                  "Dans une application avec beaucoup de requêtes, étudie les caches dédiés et les mécanismes du framework.",
                ],
              ),
            ],
            files: reactFiles(
              "Une API dans React",
              `import { useEffect, useState } from "react";
function App() {
  const [etat, setEtat] = useState({ chargement: true, produits: [], erreur: "" });
  useEffect(() => {
    const controleur = new AbortController();
    const limite = setTimeout(() => controleur.abort("Délai dépassé"), 8000);
    let actif = true;
    async function lire() {
      try {
        const reponse = await fetch("https://dummyjson.com/products?limit=3", { signal: controleur.signal });
        if (!reponse.ok) throw new Error("HTTP " + reponse.status);
        const donnees = await reponse.json();
        if (!Array.isArray(donnees.products)) throw new Error("Format inattendu");
        if (actif) setEtat({ chargement: false, produits: donnees.products, erreur: "" });
      } catch (erreur) {
        if (actif) setEtat({ chargement: false, produits: [], erreur: "Impossible de charger les produits." });
        console.warn(erreur);
      } finally { clearTimeout(limite); }
    }
    void lire();
    return () => { actif = false; clearTimeout(limite); controleur.abort(); };
  }, []);
  return <main><h1>Produits de démonstration</h1>
    {etat.chargement && <p role="status">Chargement…</p>}{etat.erreur && <p role="alert">{etat.erreur}</p>}
    <ul>{etat.produits.map(produit => <li key={produit.id}>{produit.title}</li>)}</ul>
  </main>;
}`,
            ),
            task: "Ajoute un bouton Réessayer qui change une valeur de relance utilisée dans les dépendances de l’effet.",
            takeaway:
              "Traite la réponse, les erreurs et l’annulation comme des parties du même cycle de requête.",
            quiz: quiz(
              "Que transmet-on à fetch pour pouvoir annuler sa requête ?",
              [
                "Le signal d’un AbortController",
                "Le résultat de map",
                "Une prop CSS",
              ],
              0,
              "fetch reçoit le signal. Appeler abort sur le contrôleur annule la requête.",
            ),
            link:
              react + "reference/react/useEffect#fetching-data-with-effects",
          }),
        ],
      },
      {
        id: "formulaires",
        title: "Formulaires contrôlés et état partagé",
        description: "Organiser la saisie et les données communes.",
        lessons: [
          lesson({
            id: "champs-controles",
            title: "Construire des champs contrôlés",
            minutes: 21,
            summary:
              "Un champ contrôlé reçoit sa valeur de l’état React et transmet chaque changement à une fonction.",
            sections: [
              section(
                "Définir la source de vérité",
                "Avec value={formulaire.nom}, React pilote ce qui apparaît dans le champ. onChange lit la nouvelle saisie et met à jour l’état. Initialise un champ texte avec une chaîne vide.",
                [
                  "Prends checked pour une case à cocher.",
                  "Utilise une fonction de mise à jour pour modifier un champ d’un objet.",
                  "Fais correspondre la validation aux données effectivement saisies.",
                ],
              ),
              section(
                "Vérifier et restituer",
                "Le formulaire de l’exemple garde séparément la saisie et le dernier résumé validé. Le bouton soumet le formulaire et la fonction lit les valeurs nettoyées.",
                [
                  "Étiquette tous les champs.",
                  "Affiche une indication après la validation.",
                  "Prévois aussi une réponse lorsque le résultat de la validation est vide.",
                ],
              ),
            ],
            files: reactFiles(
              "Formulaire contrôlé",
              `import { useState } from "react";
function App() {
  const [form, setForm] = useState({ nom: "", domaine: "Web" });
  const [resume, setResume] = useState("");
  function mettreAJour(champ, valeur) { setForm(avant => ({ ...avant, [champ]: valeur })); }
  function soumettre(e) {
    e.preventDefault();
    setResume(form.nom.trim() ? form.nom.trim() + " · " + form.domaine : "Indique ton nom.");
  }
  return <main><h1>Préparer un profil</h1><form className="card" onSubmit={soumettre}>
    <p><label>Nom <input value={form.nom} onChange={e => mettreAJour("nom", e.target.value)} required /></label></p>
    <p><label>Domaine <select value={form.domaine} onChange={e => mettreAJour("domaine", e.target.value)}><option>Web</option><option>Mobile</option></select></label></p>
    <button>Créer un résumé</button>
  </form><p role="status">{resume}</p></main>;
}`,
            ),
            task: "Ajoute un champ ville et inclue-le dans le résumé validé.",
            takeaway:
              "Le champ montre une valeur provenant de l’état. onChange maintient cette valeur en accord avec la saisie.",
            quiz: quiz(
              "Quel attribut lie un input texte à sa valeur dans l’état ?",
              ["key", "href", "value"],
              2,
              "value indique à React le texte que le champ doit afficher.",
            ),
            link: react + "reference/react-dom/components/input",
          }),
          lesson({
            id: "levee-etat",
            title: "Partager l’état entre composants frères",
            minutes: 20,
            summary:
              "Quand plusieurs composants dépendent de la même information, place-la dans leur parent commun.",
            sections: [
              section(
                "Repérer l’information partagée",
                "Le champ Recherche et la liste Resultats dépendent du même texte. Le parent possède ce texte et le transmet aux deux composants. La liste peut alors se recalculer après chaque frappe.",
                [
                  "Identifie le parent commun le plus proche.",
                  "Transmets la valeur à l’enfant par une prop.",
                  "Transmets une fonction de mise à jour au composant qui reçoit les actions.",
                ],
              ),
              section(
                "Éviter la duplication",
                "Un résultat filtré peut être calculé à partir du texte et du tableau source. Quand chaque enfant conserve sa propre copie, les copies peuvent diverger.",
                [
                  "Garde les données communes dans un seul état.",
                  "Calcule la liste filtrée pendant le rendu.",
                  "Le Kanban reprend le même principe pour les colonnes et les tâches.",
                ],
              ),
            ],
            files: reactFiles(
              "État remonté",
              `import { useState } from "react";
const projets = ["Portfolio", "Météo", "Memory", "Lecteur audio"];
function Recherche({ texte, onTexte }) { return <label>Rechercher <input value={texte} onChange={e => onTexte(e.target.value)} /></label>; }
function Resultats({ titres }) { return <ul>{titres.map(titre => <li key={titre}>{titre}</li>)}</ul>; }
function App() {
  const [texte, setTexte] = useState("");
  const titres = projets.filter(titre => titre.toLowerCase().includes(texte.trim().toLowerCase()));
  return <main><h1>Recherche partagée</h1><Recherche texte={texte} onTexte={setTexte} /><p>{titres.length} résultat(s)</p><Resultats titres={titres} /></main>;
}`,
            ),
            task: "Crée un composant Résumé qui affiche la saisie courante et le nombre de résultats via ses props.",
            takeaway:
              "Une donnée partagée a un propriétaire commun. Ses enfants reçoivent la même valeur.",
            quiz: quiz(
              "Où placer la recherche utilisée par deux composants frères ?",
              [
                "Dans deux états séparés",
                "Dans leur parent commun",
                "Dans un style CSS",
              ],
              1,
              "Le parent commun peut fournir la valeur et le moyen de la mettre à jour.",
            ),
            link: react + "learn/sharing-state-between-components",
          }),
        ],
      },
      {
        id: "routes",
        title: "Navigation et routes dynamiques",
        description: "Afficher plusieurs écrans dans une application React.",
        lessons: [
          lesson({
            id: "react-router",
            title: "Créer des routes avec React Router",
            minutes: 23,
            summary:
              "React Router associe un chemin à un écran. Link et useNavigate permettent de changer d’écran pendant que l’application reste montée.",
            sections: [
              section(
                "Déclarer les écrans",
                "Dans ton projet Vite, installe react-router-dom avec npm install react-router-dom. Déclare des Route dans Routes et place-les dans un routeur. L’atelier fournit déjà les composants utilisés dans l’exemple.",
                [
                  "Chaque route associe path à un élément JSX.",
                  "Link décrit un lien interne à l’application.",
                  "useNavigate permet de naviguer depuis une fonction après une action.",
                ],
              ),
              section(
                "Choisir le routeur adapté",
                "Dans l’atelier, MemoryRouter garde l’historique en mémoire dans l’aperçu. Dans une application hébergée, BrowserRouter utilise l’adresse du navigateur et le serveur doit servir l’application aux chemins frontend.",
                [
                  "Dans l’exemple, clique sur À propos puis sur Revenir par navigation.",
                  "Une route peut conserver un en-tête partagé autour de ses écrans.",
                  "Garde la navigation simple et indique où l’utilisateur se trouve.",
                ],
              ),
            ],
            files: reactFiles(
              "Deux pages React",
              `import { MemoryRouter, Route, Routes, Link, useNavigate } from "react-router-dom";
function APropos() {
  const naviguer = useNavigate();
  return <section><h2>À propos</h2><p>Cette page est un composant React.</p><button onClick={() => naviguer("/")}>Revenir par navigation</button></section>;
}
function App() {
  return <MemoryRouter><main><h1>Navigation React</h1><nav className="actions"><Link to="/">Accueil</Link><Link to="/a-propos">À propos</Link></nav>
    <Routes><Route path="/" element={<h2>Accueil</h2>} /><Route path="/a-propos" element={<APropos />} /></Routes>
  </main></MemoryRouter>;
}`,
            ),
            task: "Ajoute une page Contact et un lien pour y accéder depuis l’en-tête.",
            takeaway:
              "Les routes choisissent un écran. Les liens et les fonctions de navigation changent la route active.",
            quiz: quiz(
              "Quel composant permet de créer un lien interne ?",
              ["Link", "useState", "Fragment"],
              0,
              "Link connaît le routeur et déclenche la navigation vers le chemin donné.",
            ),
            link: router + "start/declarative/routing",
          }),
          lesson({
            id: "route-dynamique",
            title: "Lire l’identifiant d’une route dynamique",
            minutes: 21,
            summary:
              "Une route comme /profil/:id utilise le même écran de détail pour plusieurs profils.",
            sections: [
              section(
                "Définir et lire un paramètre",
                "Dans le chemin /profil/:id, id représente une partie variable de l’adresse. useParams permet de récupérer sa valeur et de retrouver le profil associé.",
                [
                  "Les paramètres de chemin sont des chaînes.",
                  "Utilise encodeURIComponent si l’identifiant contient des caractères réservés.",
                  "Une même route peut afficher plusieurs éléments de la collection.",
                ],
              ),
              section(
                "Traiter un profil absent",
                "L’adresse peut contenir un identifiant supprimé ou saisi à la main. Affiche un message et un moyen de revenir à la liste. Pour des données distantes, traite aussi le chargement de la fiche.",
                [
                  'Garde une route de repli avec path="*".',
                  "Vérifie le résultat de find avant d’accéder à ses propriétés.",
                  "Le projet de films réutilise ce modèle avec /films/:id.",
                ],
              ),
            ],
            files: reactFiles(
              "Un profil par identifiant",
              `import { MemoryRouter, Route, Routes, Link, useParams } from "react-router-dom";
const profils = [{ id: "amina", nom: "Amina" }, { id: "bako", nom: "Bako" }];
function Profil() {
  const { id } = useParams();
  const profil = profils.find(personne => personne.id === id);
  return <section><h2>{profil ? "Profil de " + profil.nom : "Profil introuvable"}</h2><Link to="/">Retour à la liste</Link></section>;
}
function App() {
  return <MemoryRouter><main><h1>Profils du groupe</h1><Routes>
    <Route path="/" element={<ul>{profils.map(profil => <li key={profil.id}><Link to={"/profil/" + profil.id}>{profil.nom}</Link></li>)}</ul>} />
    <Route path="/profil/:id" element={<Profil />} /><Route path="*" element={<p>Page introuvable.</p>} />
  </Routes></main></MemoryRouter>;
}`,
            ),
            task: "Ajoute un lien vers /profil/inconnu et vérifie le message de la page de détail.",
            takeaway:
              "Un paramètre de route identifie une donnée. L’écran traite aussi le cas où cette donnée est absente.",
            quiz: quiz(
              "Quel hook lit id dans /profil/:id ?",
              ["useEffect", "useMemo", "useParams"],
              2,
              "useParams retourne les paramètres de la route active.",
            ),
            link: router + "api/hooks/useParams",
          }),
        ],
      },
    ],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "État global, performance et frameworks",
    color: levelColors[2],
    objective:
      "Organiser le partage d’état, mesurer les rendus et comprendre les usages de TypeScript et de Next.js.",
    prerequisites:
      "Maîtriser les composants, useState, les effets, les formulaires et les routes de base.",
    outcomes: [
      "Partage d’état par contexte et distinction entre données locales et distantes.",
      "Mesure des rendus et création de hooks réutilisables.",
      "Typage des props et compréhension du rendu serveur.",
    ],
    projects: reactProjects.avance,
    chapters: [
      {
        id: "etat-global",
        title: "Contexte et état de l’application",
        description:
          "Partager une information sans la faire transiter par chaque composant.",
        lessons: [
          lesson({
            id: "context",
            title: "Context API et useContext",
            minutes: 23,
            summary:
              "Le contexte rend une valeur accessible aux descendants d’un fournisseur. Il convient à un thème ou à un profil partagé.",
            sections: [
              section(
                "Choisir le bon périmètre",
                "Des props sont pratiques pour les données proches. Le contexte aide lorsqu’une information doit traverser plusieurs composants intermédiaires qui n’en ont pas besoin. Cette succession de transmissions est appelée prop drilling.",
                [
                  "Crée un contexte avec createContext.",
                  "Place le fournisseur autour des composants concernés.",
                  "Lis la valeur du fournisseur le plus proche avec useContext.",
                ],
              ),
              section(
                "Garder la valeur maîtrisable",
                "Le contexte transporte une valeur, qui peut venir de useState ou d’un reducer. Les consommateurs se mettent à jour quand la valeur du fournisseur change. Sépare les contextes dont les rythmes de changement sont différents.",
                [
                  "Un thème commun est un bon premier exemple.",
                  "Le panier partage des lignes et des actions dans son propre contexte.",
                  "Choisis un périmètre qui correspond aux écrans utilisateurs de la donnée.",
                ],
              ),
            ],
            files: reactFiles(
              "Thème partagé",
              `import { createContext, useContext, useState } from "react";
const Theme = createContext("clair");
function Carte() { const theme = useContext(Theme); return <article className={"card " + theme}><h2>Carte du projet</h2><p>Thème : {theme}</p></article>; }
function Contenu() { return <section><Carte /></section>; }
function App() {
  const [theme, setTheme] = useState("clair");
  return <Theme.Provider value={theme}><main><h1>Contexte de thème</h1><button onClick={() => setTheme(avant => avant === "clair" ? "sombre" : "clair")}>Changer le thème</button><Contenu /></main></Theme.Provider>;
}`,
              { css: ".card.sombre { color: #f4f9ff; background: #163551; }" },
            ),
            task: "Ajoute un composant EnTete qui lit le même thème, sans transmettre une prop à travers Contenu.",
            takeaway:
              "Place le fournisseur au niveau où la donnée doit être partagée.",
            quiz: quiz(
              "Quel hook lit la valeur d’un contexte ?",
              ["useContext", "useParams", "useRef"],
              0,
              "useContext lit la valeur du fournisseur correspondant au-dessus du composant.",
            ),
            link: react + "reference/react/useContext",
          }),
          lesson({
            id: "redux-query",
            title: "État d’interface et données serveur",
            minutes: 24,
            summary:
              "Choisis où conserver une donnée selon son propriétaire. Un menu ouvert et un catalogue reçu du serveur suivent des cycles différents.",
            sections: [
              section(
                "Centraliser des transitions",
                "useReducer regroupe les transitions d’un état autour d’actions. Redux Toolkit reprend ce principe pour un store partagé, avec des outils de configuration, de découpage en slices et de diagnostic.",
                [
                  "Décris l’action avec un type explicite.",
                  "Calcule la nouvelle valeur à partir de l’état reçu.",
                  "Utilise le store pour les données dont plusieurs fonctionnalités dépendent.",
                ],
              ),
              section(
                "Gérer des données distantes",
                "TanStack Query organise la récupération et le cache de données serveur par clés. Il aide à définir la fraîcheur, la relance et l’invalidation des requêtes. Le thème ou un champ de formulaire gardent souvent un état local.",
                [
                  "Un cache peut restituer des données déjà reçues et les actualiser.",
                  "Une clé de requête inclut les paramètres qui distinguent les résultats.",
                  "Après une modification sur le serveur, l’invalidation signale les données à relire.",
                ],
              ),
            ],
            files: reactFiles(
              "Comprendre les actions",
              `import { useReducer } from "react";
function reducer(etat, action) {
  switch (action.type) {
    case "ajouter": return { ...etat, quantite: etat.quantite + 1 };
    case "retirer": return { ...etat, quantite: Math.max(0, etat.quantite - 1) };
    default: return etat;
  }
}
function App() {
  const [panier, envoyer] = useReducer(reducer, { quantite: 0 });
  return <main><h1>État d’un panier</h1><p role="status">Articles : {panier.quantite}</p><div className="actions"><button onClick={() => envoyer({ type: "ajouter" })}>Ajouter</button><button onClick={() => envoyer({ type: "retirer" })}>Retirer</button></div></main>;
}`,
            ),
            task: "Ajoute une action vider. Compare ce reducer avec un slice Redux Toolkit puis lis le rôle de queryKey dans TanStack Query.",
            takeaway:
              "Les actions structurent les mises à jour locales. Une bibliothèque de requêtes organise la synchronisation des données serveur.",
            quiz: quiz(
              "Quel besoin correspond à un cache de requêtes ?",
              [
                "Changer la couleur d’un bouton au survol",
                "Partager un catalogue distant entre plusieurs écrans",
                "Modifier directement une balise HTML",
              ],
              1,
              "Un catalogue distant a une durée de vie, une clé et des règles de rafraîchissement.",
            ),
            link: "https://tanstack.com/query/latest/docs/framework/react/overview",
          }),
        ],
      },
      {
        id: "performance-hooks",
        title: "Performance et hooks réutilisables",
        description: "Mesurer ce qui coûte et isoler des comportements.",
        lessons: [
          lesson({
            id: "memo",
            title: "Mesurer les rendus et mémoriser",
            minutes: 25,
            summary:
              "Mesure une interaction avant d’ajouter une optimisation. La mémorisation aide surtout quand un calcul ou un rendu observé coûte réellement du temps.",
            sections: [
              section(
                "Comparer calcul, fonction et composant",
                "useMemo conserve le résultat d’un calcul tant que ses dépendances sont identiques. useCallback conserve une référence de fonction. memo peut éviter le rendu d’un composant si ses props restent identiques.",
                [
                  "Un objet créé à chaque rendu change de référence.",
                  "Les changements de state ou de contexte du composant peuvent toujours provoquer un rendu.",
                  "Les dépendances doivent contenir les valeurs réellement utilisées.",
                ],
              ),
              section(
                "Vérifier avec le Profiler",
                "Observe l’interaction avec React DevTools Profiler. Compare un scénario reproductible, par exemple filtrer une liste puis changer un thème indépendant. Garde l’optimisation si elle améliore ce scénario.",
                [
                  "Une opération courte peut rester calculée directement.",
                  "Dans l’exemple, la console indique quand le calcul du filtre s’exécute.",
                  "Évite de dépendre d’un résultat mémorisé pour la correction du programme.",
                ],
              ),
            ],
            files: reactFiles(
              "Mémoriser un filtre",
              `import { memo, useCallback, useMemo, useState } from "react";
const titres = ["Portfolio", "Météo", "Memory", "Lecteur audio"];
const Resultats = memo(function Resultats({ visibles, onEffacer }) {
  console.log("Rendu de Resultats");
  return <section><ul>{visibles.map(titre => <li key={titre}>{titre}</li>)}</ul><button onClick={onEffacer}>Effacer la recherche</button></section>;
});
function App() {
  const [texte, setTexte] = useState("");
  const [compteur, setCompteur] = useState(0);
  const visibles = useMemo(() => { console.log("Calcul du filtre"); return titres.filter(titre => titre.toLowerCase().includes(texte.toLowerCase())); }, [texte]);
  const effacer = useCallback(() => setTexte(""), []);
  return <main><h1>Observer les rendus</h1><label>Recherche <input value={texte} onChange={e => setTexte(e.target.value)} /></label><p><button onClick={() => setCompteur(avant => avant + 1)}>Autre état : {compteur}</button></p><Resultats visibles={visibles} onEffacer={effacer} /></main>;
}`,
            ),
            task: "Clique sur Autre état puis modifie la recherche. Compare les traces de la console et explique les dépendances.",
            takeaway:
              "La mémorisation est une optimisation mesurable. Le programme doit rester correct sans elle.",
            quiz: quiz(
              "Que conserve useMemo tant que les dépendances sont identiques ?",
              [
                "L’adresse du site",
                "Le résultat du calcul",
                "Une réponse réseau automatiquement",
              ],
              1,
              "useMemo conserve la valeur calculée, selon les dépendances fournies.",
            ),
            link: react + "reference/react/useMemo",
          }),
          lesson({
            id: "custom-hooks",
            title: "Extraire un hook personnalisé",
            minutes: 25,
            summary:
              "Un hook personnalisé regroupe une logique fondée sur les hooks pour la réutiliser dans plusieurs composants.",
            sections: [
              section(
                "Donner un contrat au hook",
                "useFetch peut recevoir une URL et fournir les données, l’attente et l’erreur. Le composant choisit le rendu. Les appels au hook gardent chacun leur propre état.",
                [
                  "Nomme le hook avec un préfixe use.",
                  "Appelle les hooks au niveau principal de la fonction.",
                  "Évite de créer un hook pour une simple fonction de calcul indépendante de React.",
                ],
              ),
              section(
                "Garder les effets au bon endroit",
                "Le hook gère la requête et son annulation. Le composant décide ce qu’il montre pendant la requête. Une modification d’URL relance l’effet et nettoie le précédent.",
                [
                  "Examine useFetch.js dans l’atelier.",
                  "Passe une URL dont le contenu correspond au contrat attendu.",
                  "Le mini réseau social utilise un autre hook, useFlux, pour ses publications.",
                ],
              ),
            ],
            files: reactFiles(
              "Réutiliser une requête",
              `import { useState } from "react";
import { useFetch } from "./useFetch.js";
function App() {
  const [limite, setLimite] = useState(2);
  const { donnees, attente, erreur } = useFetch("https://dummyjson.com/products?limit=" + limite);
  return <main><h1>Hook de requête</h1><button onClick={() => setLimite(avant => avant === 2 ? 4 : 2)}>Afficher {limite === 2 ? 4 : 2} produits</button>
    {attente ? <p role="status">Chargement…</p> : erreur ? <p role="alert">{erreur}</p> : <ul>{(donnees?.products ?? []).map(produit => <li key={produit.id}>{produit.title}</li>)}</ul>}
  </main>;
}`,
              {
                modules: {
                  "useFetch.js": `import { useEffect, useState } from "react";
export function useFetch(url) {
  const [etat, setEtat] = useState({ url: "", donnees: null, erreur: "" });
  useEffect(() => {
    const controleur = new AbortController();
    let actif = true;
    const limite = setTimeout(() => controleur.abort(), 8000);
    fetch(url, { signal: controleur.signal })
      .then(reponse => { if (!reponse.ok) throw new Error("HTTP " + reponse.status); return reponse.json(); })
      .then(donnees => { if (actif) setEtat({ url, donnees, erreur: "" }); })
      .catch(() => { if (actif) setEtat({ url, donnees: null, erreur: "Requête indisponible." }); })
      .finally(() => clearTimeout(limite));
    return () => { actif = false; clearTimeout(limite); controleur.abort(); };
  }, [url]);
  return etat.url === url ? { ...etat, attente: false } : { donnees: null, erreur: "", attente: true };
}`,
                },
              },
            ),
            task: "Ajoute un deuxième composant qui appelle useFetch avec une autre limite et observe son état séparé.",
            takeaway:
              "Un hook réutilise un comportement et donne un contrat stable au composant qui l’appelle.",
            quiz: quiz(
              "Que partagent deux composants qui appellent le même hook personnalisé ?",
              [
                "La logique du hook",
                "Toujours le même état local",
                "Le même élément DOM",
              ],
              0,
              "Les composants réutilisent la logique. Chacun conserve son propre état pour cet appel.",
            ),
            link: react + "learn/reusing-logic-with-custom-hooks",
          }),
        ],
      },
      {
        id: "typescript-next",
        title: "TypeScript et rendu avec Next.js",
        description:
          "Découvrir les outils utilisés dans des projets plus grands.",
        lessons: [
          lesson({
            id: "typescript",
            title: "Typer les props et les états en TSX",
            minutes: 24,
            summary:
              "TypeScript aide à détecter les appels incompatibles avant l’exécution. Les fichiers TSX associent les types à la syntaxe JSX.",
            sections: [
              section(
                "Décrire les données",
                "Un type Props précise les propriétés attendues par un composant. Une union de chaînes peut limiter les états possibles à des valeurs cohérentes, comme brouillon ou publie.",
                [
                  "Décris les props obligatoires et optionnelles.",
                  "Utilise useState<Statut> pour préciser les valeurs autorisées.",
                  "Le compilateur et VS Code signalent les erreurs de types.",
                ],
              ),
              section(
                "Vérifier les données reçues",
                "Les types disparaissent du JavaScript exécuté. Une réponse d’API peut contenir une valeur inattendue. Vérifie sa structure avant de l’utiliser. L’atelier transforme le TSX pour l’aperçu et tu peux vérifier les types dans ton projet local.",
                [
                  "Choisis un modèle clair pour chaque objet métier.",
                  "Évite any quand tu connais la forme attendue.",
                  "Une union permet aussi de distinguer chargement, réussite et erreur.",
                ],
              ),
            ],
            files: reactFiles(
              "Props typées",
              `import { useState } from "react";
type Statut = "brouillon" | "publie";
type Props = { titre: string; statut: Statut; onPublier: () => void };
function Carte({ titre, statut, onPublier }: Props) {
  return <article className="card"><h2>{titre}</h2><p>État : {statut}</p><button disabled={statut === "publie"} onClick={onPublier}>Publier</button></article>;
}
function App() {
  const [statut, setStatut] = useState<Statut>("brouillon");
  return <main><h1>Un projet typé</h1><Carte titre="Portfolio" statut={statut} onPublier={() => setStatut("publie")} /></main>;
}`,
              { entry: "main.tsx" },
            ),
            task: "Ajoute un statut archive, puis crée une commande pour passer à cet état. Vérifie les types dans un projet Vite React TypeScript.",
            takeaway:
              "Les types clarifient les contrats entre composants. La validation à l’exécution protège l’entrée des données externes.",
            quiz: quiz(
              "Quel type limite statut à deux valeurs précises ?",
              ["number", "string[]", '"brouillon" | "publie"'],
              2,
              "L’union de littéraux accepte seulement les deux chaînes déclarées.",
            ),
            link: react + "learn/typescript",
          }),
          lesson({
            id: "next-ssr",
            title: "Comprendre Next.js et le rendu serveur",
            minutes: 26,
            summary:
              "Next.js ajoute un cadre pour les routes, le chargement des données et les choix de rendu. Une page peut être préparée côté serveur ou construite au moment du build selon son besoin.",
            sections: [
              section(
                "Situer le rendu initial",
                "Dans une application rendue côté client, le navigateur exécute le code pour produire l’interface. Avec le rendu serveur, une partie du HTML initial est préparée sur le serveur. L’hydratation relie ensuite les parties interactives au code client.",
                [
                  "Le premier HTML peut déjà contenir le titre et les données utiles.",
                  "Le référencement dépend aussi du contenu, des métadonnées, des liens et des performances réelles.",
                  "Un rendu à la demande et une page statique répondent à des besoins différents.",
                ],
              ),
              section(
                "Séparer serveur et interaction",
                "Dans l’App Router, app/page.tsx définit une page. Les composants serveur peuvent préparer les données. Un composant qui utilise useState ou des événements appartient à la partie client, signalée avec la directive use client.",
                [
                  "Ouvre page.tsx dans l’atelier pour lire un exemple à placer dans un projet Next.js.",
                  "main.jsx montre comment un composant client reçoit et affiche des données initiales.",
                  "L’atelier exécute cet exemple client. Le code de serveur se lance dans un projet Next.js avec Node.js.",
                ],
              ),
            ],
            files: reactFiles(
              "Données initiales et interaction",
              `import { useState } from "react";
const donneesInitiales = [{ id: 1, titre: "Projet déjà disponible" }, { id: 2, titre: "Deuxième carte" }];
function ListeInteractive({ projets }) {
  const [visible, setVisible] = useState(true);
  return <section><button onClick={() => setVisible(avant => !avant)}>{visible ? "Masquer" : "Afficher"} les projets</button>{visible && <ul>{projets.map(projet => <li key={projet.id}>{projet.titre}</li>)}</ul>}</section>;
}
function App() { return <main><h1>Données initiales, interaction client</h1><ListeInteractive projets={donneesInitiales} /></main>; }`,
              {
                modules: {
                  "page.tsx": `// Dans un projet Next.js, place ce fichier dans app/page.tsx.
export default async function Page() {
  const reponse = await fetch("https://dummyjson.com/products?limit=3", { cache: "no-store" });
  if (!reponse.ok) return <p>Catalogue indisponible.</p>;
  const { products } = await reponse.json();
  return <main><h1>Catalogue préparé côté serveur</h1><ul>{products.map((produit: { id: number; title: string }) => <li key={produit.id}>{produit.title}</li>)}</ul></main>;
}`,
                },
              },
            ),
            task: "Indique quelles données pourraient être préparées côté serveur dans le projet boutique et quelles interactions doivent rester côté client.",
            takeaway:
              "Le rendu et la récupération des données peuvent être répartis entre serveur et client selon la page.",
            quiz: quiz(
              "Où placer un composant qui utilise useState dans Next.js App Router ?",
              [
                "Dans la partie client",
                "Dans un fichier CSS",
                "Dans le fichier de verrouillage npm",
              ],
              0,
              "Les hooks d’état et les événements exigent un composant client.",
            ),
            link: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
          }),
        ],
      },
    ],
  },
];
