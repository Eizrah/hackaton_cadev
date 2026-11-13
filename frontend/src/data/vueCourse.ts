import {
  lesson,
  levelColors,
  quiz,
  section,
  vueFiles,
} from "./courseAuthoring";
import { cryptoDashboard, nuxtBlogFiles, vueProjects } from "./vueProjects";
import type { WebLevel } from "./webCourseTypes";

const guide = "https://vuejs.org/guide/";
const piniaGuide = "https://pinia.vuejs.org/core-concepts/";
const routerGuide = "https://router.vuejs.org/guide/";

function demo(
  title: string,
  script: string,
  markup: string,
  options?: Parameters<typeof vueFiles>[2],
  typed = false,
) {
  return vueFiles(
    title,
    `<script setup${typed ? ' lang="ts"' : ""}>
${script.trim()}
</script>

<template>
  <main>
    <h1>${title}</h1>
    ${markup.trim()}
  </main>
</template>`,
    options,
  );
}

const beginner: WebLevel["chapters"] = [
  {
    id: "fondations-vue",
    title: "Fondations et syntaxe",
    description:
      "Comprends Vue.js, sa philosophie, son architecture et crée ton premier composant.",
    lessons: [
      lesson({
        id: "introduction-vue",
        title: "Qu'est-ce que Vue.js ?",
        minutes: 20,
        summary:
          "Vue.js est un framework JavaScript progressif pour construire des interfaces utilisateur. Comprends sa philosophie, son architecture SPA, son écosystème officiel et sa différence avec React.",
        sections: [
          section(
            "Vue : Framework progressif",
            "Vue se distingue par sa philosophie progressive : tu peux l'adopter partiellement pour améliorer une page HTML existante, ou l'utiliser pour construire une Single-Page Application (SPA) complète.",
            [
              "Vue est un FRAMEWORK complet avec des solutions officielles intégrées : Vue Router (routage), Pinia (state management), Vite (build tool).",
              "React est une BIBLIOTHÈQUE UI qui se concentre sur le rendu de composants. Pour le routage ou la gestion d'état, tu dois ajouter des librairies tierces.",
              "Vue fournit une approche batteries included : l'équipe core maintient les outils officiels, garantissant cohérence et compatibilité.",
            ],
          ),
          section(
            "Architecture SPA (Single-Page Application)",
            "Une SPA charge une seule page HTML au démarrage puis met à jour dynamiquement le contenu sans rechargement complet. Vue contrôle l'ensemble de la page et gère les mises à jour et la navigation.",
            [
              "Avantages SPA : Navigation fluide sans rechargement, expérience utilisateur rapide, état persistant entre les vues.",
              "Vue Router gère la navigation : il change l'URL et affiche le composant correspondant sans appel serveur.",
              "Le serveur expose des API REST/GraphQL pour les données. Vue récupère et affiche ces données avec fetch ou axios.",
            ],
          ),
          section(
            "Écosystème Vue officiel",
            "L'équipe Vue maintient un ensemble cohérent d'outils pour chaque besoin d'une application moderne.",
            [
              "Vue Router : Gestion du routage et navigation (routes dynamiques, guards, lazy loading).",
              "Pinia : Store centralisé pour l'état partagé entre composants (remplace Vuex depuis Vue 3).",
              "Vite : Build tool ultra-rapide pour développement et production avec HMR instantané.",
              "Vue DevTools : Extension navigateur pour inspecter composants, état Pinia, événements.",
              "Nuxt : Framework fullstack pour SSR (Server-Side Rendering), SSG (Static Site Generation) et SEO.",
            ],
          ),
          section(
            "Vue vs React : Différences clés",
            "Bien que les deux permettent de construire des interfaces modernes, leurs philosophies diffèrent fondamentalement.",
            [
              "Framework vs Bibliothèque : Vue = framework complet avec routeur/store officiels. React = bibliothèque UI, tu choisis tes propres outils.",
              "Templates vs JSX : Vue sépare HTML (template), JS (script), CSS (style) dans les fichiers .vue. React mélange tout dans JSX.",
              "Réactivité : Vue détecte automatiquement les changements avec des Proxies (ref, reactive). React nécessite useState et hooks.",
              "Courbe d'apprentissage : Vue est plus accessible avec des templates HTML familiers. React exige de comprendre JSX.",
              "Écosystème : React a un écosystème plus vaste. Vue offre une intégration officielle plus cohérente.",
            ],
          ),
        ],
        files: demo(
          "Première impression Vue",
          'const framework = "Vue.js";\nconst type = "Framework progressif";',
          '<div class="card">\n      <h2>{{ framework }}</h2>\n      <p>Type : {{ type }}</p>\n      <p>Architecture : SPA (Single-Page Application)</p>\n      <p>Écosystème : Vue Router, Pinia, Vite, Nuxt</p>\n    </div>',
        ),
        task: "Observe comment les variables JavaScript sont affichées dans le template avec les doubles accolades {{ }}.",
        takeaway:
          "Vue est un framework progressif avec un écosystème officiel intégré. Il se distingue de React par ses templates déclaratifs et sa philosophie batteries included.",
        quiz: quiz(
          "Quelle est la différence principale entre Vue et React ?",
          [
            "Vue est un framework complet, React est une bibliothèque UI",
            "Vue ne peut pas faire de SPA",
            "React est plus simple que Vue",
          ],
          0,
          "Vue fournit routeur et store officiels. React laisse le choix des outils externes.",
        ),
        link: `${guide}introduction.html`,
        linkLabel: "Introduction à Vue",
      }),
      lesson({
        id: "structure-projet-vue",
        title: "Créer un projet Vue et comprendre sa structure",
        minutes: 22,
        summary:
          "Utilise create-vue pour générer un projet moderne avec Vite. Comprends la structure des dossiers, les fichiers clés, les composants .vue et les templates.",
        sections: [
          section(
            "Prérequis et création du projet",
            "Node.js version 18+ est nécessaire. La commande npm create vue@latest utilise l'outil officiel create-vue pour générer un projet basé sur Vite.",
            [
              "npm create vue@latest lance un assistant interactif : TypeScript ? Router ? Pinia ? Tests ?",
              "Pour apprendre, recommandation : TypeScript=Non, Router=Oui, Pinia=Oui, Tests=Non.",
              "Après génération : cd nom-projet puis npm install pour installer les dépendances.",
              "npm run dev lance Vite. L'URL (souvent http://localhost:5173/) s'affiche dans le terminal.",
            ],
          ),
          section(
            "Structure des dossiers Vue",
            "Un projet Vue suit une organisation claire qui sépare le code source, les ressources et la configuration.",
            [
              "📁 src/ : Code source de ton application (composants, vues, stores, styles).",
              "📁 src/components/ : Composants réutilisables (ButtonPrimary.vue, UserCard.vue, Modal.vue).",
              "📁 src/views/ : Pages/vues principales liées aux routes (HomeView.vue, AboutView.vue, ProfileView.vue).",
              "📁 src/assets/ : Ressources statiques (images, fonts, CSS globaux). Traités par Vite.",
              "📁 src/router/ : Configuration Vue Router (routes, navigation guards).",
              "📁 src/stores/ : Stores Pinia pour état global (userStore.js, cartStore.js).",
              "📁 public/ : Fichiers statiques servis tels quels (favicon.ico, robots.txt). Non traités par Vite.",
            ],
          ),
          section(
            "Fichiers principaux du projet",
            "Certains fichiers jouent un rôle central dans le fonctionnement de l'application Vue.",
            [
              "📄 index.html : Point d'entrée HTML. Contient <div id='app'></div> où Vue monte l'application.",
              "📄 src/main.js : Point d'entrée JavaScript. Crée l'app Vue avec createApp, installe plugins (router, pinia) et monte sur #app.",
              "📄 src/App.vue : Composant racine. Contient généralement <RouterView /> pour afficher les pages selon la route.",
              "📄 vite.config.js : Configuration Vite (alias @/, plugins, proxy API, optimisations build).",
              "📄 package.json : Dépendances npm et scripts. Lance npm run dev, npm run build, npm run preview.",
            ],
          ),
          section(
            "Le fichier .vue : Single-File Component (SFC)",
            "Un composant monofichier regroupe template HTML, logique JavaScript et styles CSS dans un seul fichier .vue.",
            [
              "<template> : Section HTML déclarative. Utilise {{ variable }} pour interpolation, v-if pour conditions, v-for pour listes.",
              "<script setup> : Composition API moderne. Les variables/fonctions définies ici sont automatiquement disponibles dans le template.",
              "<style scoped> : CSS isolé au composant. L'attribut scoped évite les conflits de styles entre composants.",
              "Exemple : Badge.vue contient son template, script et style. Tu l'importes et l'utilises avec <Badge />.",
            ],
          ),
          section(
            "Templates Vue : Syntaxe déclarative",
            "Les templates Vue utilisent HTML standard enrichi de directives pour lier données et UI de manière déclarative.",
            [
              "{{ variable }} : Interpolation de texte. Affiche la valeur de variable dans le HTML.",
              ":src ou v-bind:src : Lie un attribut HTML à une expression JavaScript. Exemple : :src='imageUrl'.",
              "v-if / v-else-if / v-else : Affichage conditionnel. Le bloc est ajouté ou retiré du DOM.",
              "v-for='item in items' :key='item.id' : Boucle pour afficher une liste. La key identifie chaque élément.",
              "@click ou v-on:click : Écoute d'événements. Exemple : @click='handleClick'.",
              "v-model : Liaison bidirectionnelle pour formulaires. Synchronise input avec variable réactive.",
            ],
          ),
        ],
        files: demo(
          "Structure projet Vue",
          `// Dans src/main.js\nimport { createApp } from 'vue';\nimport { createPinia } from 'pinia';\nimport { createRouter } from 'vue-router';\nimport App from './App.vue';\n\n// Simulation de la structure\nconst projectName = "Mon App Vue";\nconst folders = "components, views, assets, stores, router";`,
          `<div class="card">
      <h2>{{ projectName }}</h2>
      <p><strong>📁 Dossiers clés :</strong> {{ folders }}</p>
      <p><strong>📄 Fichiers :</strong> main.js, App.vue, vite.config.js</p>
      <p><strong>🔧 Commandes :</strong> npm run dev, npm run build</p>
      <p><strong>🧩 SFC :</strong> template + script + style dans .vue</p>
    </div>`,
        ),
        task: "Crée un projet Vue avec npm create vue@latest. Explore src/components, src/views et lis main.js et App.vue.",
        takeaway:
          "Un projet Vue suit une structure claire : components (réutilisables), views (pages), assets (ressources), stores (état global). Les fichiers .vue regroupent template, script et style.",
        quiz: quiz(
          "Quel dossier contient les composants réutilisables ?",
          ["src/views/", "src/components/", "src/assets/"],
          1,
          "src/components/ contient les composants réutilisables. src/views/ contient les pages liées aux routes.",
        ),
        link: `${guide}quick-start.html`,
        linkLabel: "Démarrage rapide Vue",
      }),
      lesson({
        id: "vue-premier-composant",
        title: "Vue, Vite et le premier composant",
        minutes: 14,
        summary:
          "Vue relie les données JavaScript au HTML. Tu peux l’adopter pour un seul élément d’une page ou l’utiliser pour construire une application composée de nombreux fichiers.",
        sections: [
          section(
            "Créer un projet dans VS Code",
            "Avec Node.js installé, ouvre un terminal et lance npm create vue@latest. L’assistant officiel create-vue prépare un projet qui utilise Vite.",
            [
              "Ouvre le dossier créé, lance npm install puis npm run dev. L’URL locale s’affiche dans le terminal.",
              "Installe Vue - Official dans VS Code pour les suggestions et les erreurs dans les fichiers .vue.",
              "Un essai très court peut charger Vue depuis un CDN dans une page HTML. Les fichiers .vue et leur compilation sont plus adaptés à un projet structuré.",
            ],
          ),
          section(
            "Lire App.vue",
            "Le bloc script prépare les données. Le template indique ce que l’écran affiche. Les doubles accolades interpolent une valeur comme du texte.",
            [
              "La Composition API regroupe la logique dans <script setup>. Les variables définies ici sont disponibles dans le template.",
              "L’Options API organise le même composant avec data, methods et computed. Le guide Vue montre les deux syntaxes.",
            ],
          ),
        ],
        files: demo(
          "Bonjour Vue",
          'const name = "DevAfrica";',
          "<p>Bienvenue sur {{ name }} !</p>",
        ),
        task: "Change le nom dans App.vue, exécute puis retrouve ta valeur à l’écran.",
        takeaway:
          "Le fichier main.js monte le composant App.vue. Le template affiche les données préparées par le script.",
        quiz: quiz(
          "Que fait {{ name }} dans le template ?",
          [
            "Elle affiche la valeur de name",
            "Elle ajoute un champ de formulaire",
            "Elle crée une route",
          ],
          0,
          "Les doubles accolades affichent la valeur sous forme de texte.",
        ),
        link: `${guide}quick-start.html`,
        linkLabel: "Démarrage rapide Vue",
      }),
      lesson({
        id: "reactivite-ref",
        title: "Réactivité avec ref() et Options API",
        minutes: 16,
        summary:
          "Une valeur réactive indique à Vue que le rendu doit être actualisé quand cette valeur change. ref() crée ce lien pour un nombre, un texte, un objet ou une liste.",
        sections: [
          section(
            "Écrire une valeur réactive",
            "En Composition API, lis et modifie une ref via .value dans le code JavaScript. Le template déballe automatiquement les refs définies au premier niveau.",
            [
              "const count = ref(0) crée l’état du compteur.",
              "count.value += 1 change le nombre et Vue met à jour le texte concerné.",
            ],
          ),
          section(
            "Reconnaître l’autre syntaxe",
            "Dans un composant Options API, data() renvoie l’état et une méthode utilise this.count pour le modifier. Le résultat visuel est le même.",
            [
              "Pour la suite, les exercices utilisent surtout <script setup>.",
              "Essaie le fichier OptionsCounter.vue pour repérer data et methods.",
            ],
          ),
        ],
        files: demo(
          "Deux façons de compter",
          `import { ref } from "vue";
import OptionsCounter from "./OptionsCounter.vue";
const count = ref(0);
function add() { count.value++; }`,
          `<div class="card">
      <p>Composition API · {{ count }}</p>
      <button @click="add">Ajouter un point</button>
    </div>
    <OptionsCounter />`,
          {
            modules: {
              "OptionsCounter.vue": `<script>
export default {
  data() { return { count: 0 }; },
  methods: { add() { this.count++; } },
};
</script>
<template>
  <div class="card">
    <p>Options API · {{ count }}</p>
    <button @click="add">Ajouter avec Options API</button>
  </div>
</template>`,
            },
          },
        ),
        task: "Fais avancer les deux compteurs, puis change la valeur initiale de celui en Composition API.",
        takeaway:
          "L’état appartient à chaque composant. Un clic dans le premier compteur laisse le second à sa valeur actuelle.",
        quiz: quiz(
          "Comment incrémenter une ref dans le script ?",
          ["count++", "count.value++", "count.textContent++"],
          1,
          "La ref contient sa valeur dans la propriété value.",
        ),
        link: `${guide}essentials/reactivity-fundamentals.html`,
      }),
    ],
  },
  {
    id: "directives-vue",
    title: "Les directives Vue",
    description:
      "Affiche des blocs selon les données et relie des attributs au script.",
    lessons: [
      lesson({
        id: "conditions-vue",
        title: "Afficher selon une condition",
        minutes: 14,
        summary:
          "v-if affiche un bloc lorsque son expression est vraie. Ajoute v-else-if et v-else juste après pour traiter les autres états.",
        sections: [
          section(
            "Choisir une branche",
            "Une liste peut être en chargement, vide ou prête. Donne à chaque état un texte que la personne comprend.",
            [
              "v-if crée et retire le bloc, ainsi que ses composants enfants.",
              "v-show garde l’élément dans la page et bascule son affichage CSS. Il est pratique pour ouvrir et fermer souvent un panneau.",
            ],
          ),
        ],
        files: demo(
          "Un cours, trois états",
          `import { ref } from "vue";
const status = ref("pret");
const showHint = ref(false);`,
          `<label>État <select v-model="status">
      <option value="pret">Prêt</option><option value="attente">En attente</option><option value="ferme">Fermé</option>
    </select></label>
    <p v-if="status === 'pret'">Le cours est disponible.</p>
    <p v-else-if="status === 'attente'">Il sera bientôt publié.</p>
    <p v-else>Les inscriptions sont fermées.</p>
    <button @click="showHint = !showHint">Afficher ou masquer le conseil</button>
    <p v-show="showHint">Commence par un seul composant.</p>`,
        ),
        task: "Sélectionne les trois états. Inspecte le paragraphe de conseil dans DevTools quand il est masqué.",
        takeaway:
          "v-if monte ou démonte un bloc. v-show modifie la visibilité du bloc déjà monté.",
        quiz: quiz(
          "Quelle directive convient à un panneau basculé très souvent ?",
          ["v-for", "v-show", "v-bind"],
          1,
          "v-show évite de recréer le bloc à chaque bascule.",
        ),
        link: `${guide}essentials/conditional.html`,
      }),
      lesson({
        id: "listes-et-attributs",
        title: "Répéter avec v-for, lier avec v-bind",
        minutes: 16,
        summary:
          "v-for transforme une liste de données en éléments visibles. v-bind, abrégé en deux-points, calcule la valeur d’un attribut à partir du script.",
        sections: [
          section(
            "Identifier chaque élément",
            "Vue s’appuie sur key pour retrouver le même élément lorsque l’ordre de la liste change. Utilise l’identifiant métier ou un identifiant créé à l’ajout.",
            [
              'v-for="resource in resources" expose chaque objet.',
              ':key="resource.id" donne une identité stable à la ligne.',
              ":href, :src, :class et :style relient un attribut à une expression JavaScript.",
            ],
          ),
        ],
        files: demo(
          "Carnet de ressources",
          `import { ref } from "vue";
const resources = ref([
  { id: "vue", title: "Vue", url: "https://vuejs.org/", featured: true },
  { id: "mdn", title: "MDN", url: "https://developer.mozilla.org/", featured: false },
]);`,
          `<button @click="resources.reverse()">Inverser l’ordre</button>
    <ul>
      <li v-for="item in resources" :key="item.id" :class="{ card: item.featured }">
        <a :href="item.url" target="_blank" rel="noreferrer">{{ item.title }}</a>
      </li>
    </ul>`,
        ),
        task: "Ajoute une ressource avec un nouvel id et inverse l’ordre.",
        takeaway:
          "Les clés stables aident Vue à suivre les éléments quand une liste évolue.",
        quiz: quiz(
          "Quelle clé reste stable si tu inverses une liste ?",
          [
            "La position dans la liste",
            "Un nombre aléatoire à chaque rendu",
            "L’identifiant de l’élément",
          ],
          2,
          "L’identifiant reste le même après un tri ou un déplacement.",
        ),
        link: `${guide}essentials/list.html`,
      }),
    ],
  },
  {
    id: "evenements-formulaires",
    title: "Événements et formulaires",
    description: "Réagis aux interactions et synchronise les champs.",
    lessons: [
      lesson({
        id: "evenements-vue",
        title: "Écouter un clic ou une soumission",
        minutes: 14,
        summary:
          "@click est le raccourci de v-on:click. Tu peux le relier à une fonction et utiliser des modificateurs pour préciser le comportement.",
        sections: [
          section(
            "De l’action à l’état",
            "Écris une fonction claire dans le script et connecte-la à l’événement sur l’élément adapté.",
            [
              "Un bouton déclenche @click. Un formulaire déclenche @submit lorsque tu valides ou appuies sur Entrée.",
              "@submit.prevent appelle preventDefault avant ton traitement, ce qui conserve la page dans l’atelier.",
            ],
          ),
        ],
        files: demo(
          "Carnet de session",
          `import { ref } from "vue";
const messages = ref(0);
function send() { messages.value++; }`,
          `<form class="actions" @submit.prevent="send">
      <button>Noter une participation</button>
      <button type="button" @click="messages = 0">Remettre à zéro</button>
    </form>
    <p role="status">Participations : {{ messages }}</p>`,
        ),
        task: "Soumets au clavier, puis ajoute un bouton qui enlève un point tant que le compteur est positif.",
        takeaway:
          "Un événement appelle ton traitement. Le traitement modifie la valeur réactive.",
        quiz: quiz(
          "Quel modificateur évite la navigation native d’un formulaire ?",
          [".trim", ".prevent", ".number"],
          1,
          ".prevent appelle preventDefault sur l’événement.",
        ),
        link: `${guide}essentials/event-handling.html`,
      }),
      lesson({
        id: "v-model",
        title: "Synchroniser les champs avec v-model",
        minutes: 16,
        summary:
          "Une liaison bidirectionnelle recopie la valeur JavaScript vers le champ et répercute la saisie du champ vers cette valeur.",
        sections: [
          section(
            "Relier les valeurs",
            "v-model fait le travail d’une liaison et de son écouteur. Le comportement s’adapte à un texte, un select ou une case à cocher.",
            [
              "v-model.trim retire les espaces en bordure d’une saisie textuelle.",
              "v-model.number est pratique pour un prix ou une quantité. Vérifie les entrées vides et les limites avant un calcul.",
            ],
          ),
        ],
        files: demo(
          "Ton badge DevAfrica",
          `import { ref } from "vue";
const name = ref("");
const specialty = ref("Frontend");`,
          `<label>Prénom <input v-model.trim="name" /></label>
    <label>Spécialité <select v-model="specialty"><option>Frontend</option><option>Backend</option></select></label>
    <p class="card">{{ name || "Ton prénom" }} · {{ specialty }}</p>`,
        ),
        task: "Tape un prénom, change de spécialité puis ajoute une case « Disponible » et son aperçu.",
        takeaway:
          "v-model relie l’entrée utilisateur à une source d’état réactive.",
        quiz: quiz(
          "Quel outil synchronise un select et une ref ?",
          ["v-if", "v-model", "v-for"],
          1,
          "v-model relie la valeur du select à la ref dans les deux sens.",
        ),
        link: `${guide}essentials/forms.html`,
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "architecture-composants",
    title: "Architecture par composants",
    description:
      "Découpe l’écran et définis comment les composants communiquent.",
    lessons: [
      lesson({
        id: "fichiers-vue",
        title: "Découper l’interface en fichiers .vue",
        minutes: 16,
        summary:
          "Un composant monofichier, ou SFC, rassemble son template, son script et ses styles. Il peut être importé à plusieurs endroits.",
        sections: [
          section(
            "Choisir les responsabilités",
            "Une carte décrit un élément. L’écran qui l’utilise organise les cartes et les actions qui les entourent.",
            [
              "Importe Badge.vue depuis App.vue et utilise <Badge /> dans le template.",
              "Ajoute scoped au bloc style pour limiter les règles au composant.",
            ],
          ),
        ],
        files: demo(
          "Assemblage de composants",
          'import Badge from "./Badge.vue";',
          "<Badge /><p>Ce paragraphe garde le style général.</p>",
          {
            modules: {
              "Badge.vue": `<template>
  <p>Apprenant · DevAfrica</p>
</template>
<style scoped>
p { background: #dbeeff; border-radius: 1rem; padding: .7rem; color: #194675; }
</style>`,
            },
          },
        ),
        task: "Crée un second fichier .vue, importe-le et essaie une couleur différente pour son paragraphe.",
        takeaway:
          "Un SFC isole une responsabilité et facilite sa réutilisation.",
        quiz: quiz(
          "À quoi sert scoped sur le style d’un SFC ?",
          [
            "Limiter les règles au composant",
            "Installer le routeur",
            "Déclarer une prop",
          ],
          0,
          "Le compilateur ajoute des sélecteurs qui ciblent ce composant.",
        ),
        link: `${guide}scaling-up/sfc.html`,
      }),
      lesson({
        id: "props-emits",
        title: "Passer des props et émettre un événement",
        minutes: 18,
        summary:
          "Le parent transmet les données à son enfant via des props. L’enfant informe le parent d’une action via un événement.",
        sections: [
          section(
            "Faire circuler une intention",
            "Une carte de vote peut recevoir un titre et émettre vote. Le parent garde le score pour que tous les composants voient la même valeur.",
            [
              "defineProps décrit les valeurs acceptées par l’enfant. Traite les props comme des entrées en lecture seule.",
              "defineEmits déclare les événements disponibles. emit('vote') avertit le parent qui écoute @vote.",
            ],
          ),
        ],
        files: demo(
          "Vote pour une idée",
          `import { ref } from "vue";
import VoteCard from "./VoteCard.vue";
const votes = ref(0);`,
          '<VoteCard title="Une bibliothèque de composants" :votes="votes" @vote="votes++" />',
          {
            modules: {
              "VoteCard.vue": `<script setup>
defineProps({ title: String, votes: Number });
const emit = defineEmits(["vote"]);
</script>
<template>
  <article class="card">
    <h2>{{ title }}</h2>
    <p>Votes : {{ votes }}</p>
    <button @click="emit('vote')">Voter</button>
  </article>
</template>`,
            },
          },
        ),
        task: "Ajoute une autre carte avec un compteur indépendant. Essaie ensuite d’afficher le total dans le parent.",
        takeaway:
          "Les props descendent. Les événements expriment une demande au parent.",
        quiz: quiz(
          "Qui modifie ici la variable votes ?",
          ["Le composant parent", "Le bouton natif", "Le fichier CSS"],
          0,
          "Le parent reçoit vote et modifie l’état qu’il possède.",
        ),
        link: `${guide}components/events.html`,
      }),
    ],
  },
  {
    id: "computed-watch",
    title: "Propriétés calculées et observateurs",
    description:
      "Sépare les valeurs dérivées des effets déclenchés par un changement.",
    lessons: [
      lesson({
        id: "computed-vue",
        title: "Calculer une valeur avec computed",
        minutes: 17,
        summary:
          "Une propriété calculée décrit une valeur dérivée de l’état. Vue garde son résultat en cache tant que ses dépendances réactives restent identiques.",
        sections: [
          section(
            "Faire le calcul à un seul endroit",
            "Le total TTC dépend du prix hors taxe, de la quantité et du taux. Le template lit le total comme une autre donnée.",
            [
              "Utilise computed pour les filtres, tris et totaux dérivés.",
              "Garde le calcul sans appel réseau et sans écriture dans une autre variable.",
            ],
          ),
        ],
        files: demo(
          "Total du panier",
          `import { computed, ref } from "vue";
const count = ref(1);
const price = 15;
const vat = 0.2;
const total = computed(() => Math.max(0, Number(count.value)) * price * (1 + vat));`,
          `<label>Quantité <input v-model.number="count" type="number" min="0" /></label>
    <p class="card">Total TTC : {{ total.toFixed(2) }} €</p>`,
        ),
        task: "Ajoute un taux de taxe sélectionnable et vérifie que le total réagit au taux et à la quantité.",
        takeaway:
          "computed exprime une relation entre plusieurs valeurs et évite de répéter le calcul dans le template.",
        quiz: quiz(
          "Quand le résultat calculé doit-il être recalculé ?",
          [
            "À chaque clic dans la page",
            "Quand une dépendance lue a changé",
            "Seulement au redémarrage",
          ],
          1,
          "Vue observe les valeurs réactives que le calcul utilise.",
        ),
        link: `${guide}essentials/computed.html`,
      }),
      lesson({
        id: "watch-vue",
        title: "Déclencher un effet avec watch",
        minutes: 17,
        summary:
          "watch observe une valeur réactive et appelle une fonction quand elle change. C’est adapté à un enregistrement, une requête ou une trace.",
        sections: [
          section(
            "Enregistrer une préférence",
            "Lis le thème sauvegardé au départ. Quand la personne sélectionne un thème, écris le nouveau choix dans le stockage de l’exercice.",
            [
              "Le callback reçoit la nouvelle valeur et l’ancienne.",
              "Pour une requête déclenchée par watch, prévois l’annulation ou ignore les réponses dépassées.",
            ],
          ),
        ],
        files: demo(
          "Mémoriser une préférence",
          `import { ref, watch } from "vue";
const theme = ref(localStorage.getItem("theme") ?? "clair");
watch(theme, (next, previous) => {
  localStorage.setItem("theme", next);
  console.log("Thème", previous, "→", next);
});`,
          `<label>Thème <select v-model="theme"><option>clair</option><option>sombre</option></select></label>
    <p class="card">Préférence : {{ theme }}</p>`,
        ),
        task: "Choisis le thème sombre et relance l’aperçu pour vérifier que la préférence a été mémorisée.",
        takeaway:
          "watch déclenche un effet. computed prépare une donnée à afficher.",
        quiz: quiz(
          "Quel outil convient pour enregistrer une préférence modifiée ?",
          ["v-show", "computed", "watch"],
          2,
          "L’écriture dans le stockage est un effet déclenché par le changement.",
        ),
        link: `${guide}essentials/watchers.html`,
      }),
    ],
  },
  {
    id: "cycle-et-routes",
    title: "Cycle de vie et Vue Router",
    description: "Charge des données et crée plusieurs écrans.",
    lessons: [
      lesson({
        id: "on-mounted-api",
        title: "Charger des données avec onMounted",
        minutes: 19,
        summary:
          "onMounted lance un traitement lorsque le composant est monté côté navigateur. Un appel fetch peut alors remplir une liste.",
        sections: [
          section(
            "Prévoir les états d’une requête",
            "Affiche que les données arrivent, vérifie le statut de la réponse puis traite le JSON. Axios est une autre option si ton projet l’utilise.",
            [
              "Le filtrage local avec computed fonctionne après la réception des données.",
              "Le starter utilise CoinPaprika. Quand l’API est indisponible, il affiche des prix fictifs et indique leur origine.",
            ],
          ),
        ],
        files: vueFiles("Données au montage", cryptoDashboard),
        task: "Teste la recherche avec « BTC ». Simule un échec en modifiant l’adresse de l’API et observe le message.",
        takeaway:
          "La réponse réseau, l’attente et l’échec font partie de la conception de l’écran.",
        quiz: quiz(
          "Quel hook convient pour lancer ce chargement au montage ?",
          ["onMounted", "defineEmits", "v-bind"],
          0,
          "onMounted appelle ta fonction après le montage du composant.",
        ),
        link: `${guide}essentials/lifecycle.html`,
      }),
      lesson({
        id: "vue-router",
        title: "Naviguer entre les vues",
        minutes: 20,
        summary:
          "Vue Router associe des chemins à des composants. RouterLink crée les liens internes et RouterView indique où rendre la page active.",
        sections: [
          section(
            "Une route, plusieurs fiches",
            "Avec /cours/:id, la partie :id varie selon le lien. L’option props transmet le paramètre à la page sous forme de prop.",
            [
              "Installe Vue Router avec npm install vue-router dans un projet local, puis ajoute app.use(router).",
              "L’atelier utilise l’historique en mémoire et lance la première navigation avec router.push('/').",
              "Sur un site avec historique web, configure le serveur pour renvoyer la page d’entrée sur les URLs de l’application.",
            ],
          ),
        ],
        files: vueFiles(
          "Routes dynamiques",
          `<template>
  <main>
    <h1>Le catalogue Vue</h1>
    <nav class="actions">
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink to="/cours/vue">Vue</RouterLink>
      <RouterLink to="/cours/django">Django</RouterLink>
    </nav>
    <RouterView />
  </main>
</template>`,
          {
            bootstrap: `import { createApp, h } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import App from "./App.vue";
import CoursePage from "./CoursePage.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: { render: () => h("p", "Choisis un cours.") } },
    { path: "/cours/:id", component: CoursePage, props: true },
  ],
});
const app = createApp(App).use(router);
router.push("/").then(() => app.mount("#app"));`,
            modules: {
              "CoursePage.vue": `<script setup>
defineProps({ id: String });
</script>
<template><article class="card"><h2>Fiche {{ id }}</h2></article></template>`,
            },
          },
        ),
        task: "Clique sur Vue puis Django. Ajoute un lien vers un autre identifiant.",
        takeaway:
          "Le chemin peut changer tout en gardant le même composant de page.",
        quiz: quiz(
          "Où s’affiche le composant associé à la route active ?",
          ["RouterLink", "RouterView", "defineProps"],
          1,
          "RouterView est l’emplacement où Vue Router rend la vue active.",
        ),
        link: `${routerGuide}essentials/dynamic-matching.html`,
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "pinia",
    title: "Centraliser l’état avec Pinia",
    description:
      "Partage la même source de données entre plusieurs composants.",
    lessons: [
      lesson({
        id: "premier-store",
        title: "Installer Pinia et créer un store",
        minutes: 18,
        summary:
          "Pinia centralise les données partagées, comme un panier ou le profil d’une personne connectée. Des composants éloignés peuvent consulter le même store.",
        sections: [
          section(
            "Brancher Pinia",
            "Dans un projet Vue, installe pinia puis ajoute createPinia() à l’application. defineStore donne un nom unique et une structure au store.",
            [
              "Garde les champs d’un formulaire local dans le composant tant qu’ils sont propres à cet écran.",
              "Le store est utile quand plusieurs écrans doivent lire ou modifier les mêmes valeurs.",
            ],
          ),
        ],
        files: demo(
          "Objectif partagé",
          `import { defineStore } from "pinia";
const useGoal = defineStore("goal", { state: () => ({ points: 0 }) });
const goal = useGoal();`,
          `<div class="card">Objectif · {{ goal.points }} / 10</div>
    <button @click="goal.points++">Valider un point</button>`,
          {
            bootstrap: `import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
createApp(App).use(createPinia()).mount("#app");`,
          },
        ),
        task: "Ajoute une deuxième zone qui lit goal.points et vérifie qu’un clic actualise les deux affichages.",
        takeaway:
          "Un store appartient à l’application et peut être utilisé par plusieurs composants.",
        quiz: quiz(
          "Que faut-il installer sur l’application avant useGoal() ?",
          ["createPinia()", "Un RouterView", "Un composant Teleport"],
          0,
          "app.use(createPinia()) fournit l’instance de Pinia.",
        ),
        link: piniaGuide,
      }),
      lesson({
        id: "state-actions-getters",
        title: "State, actions et getters",
        minutes: 20,
        summary:
          "Le state stocke les valeurs. Les actions décrivent les opérations. Les getters calculent ce qui dépend de l’état.",
        sections: [
          section(
            "Organiser un panier",
            "Le store conserve la quantité. Une action vérifie qu’elle reste positive. Un getter en déduit le montant total.",
            [
              "Un getter ressemble à une propriété computed à l’échelle du store.",
              "Accède à store.total directement. Utilise storeToRefs si tu déstructures un getter ou un champ réactif.",
            ],
          ),
        ],
        files: demo(
          "Panier partagé",
          `import { useCart } from "./cart.js";
const cart = useCart();`,
          `<p class="card">{{ cart.quantity }} articles · {{ cart.total }} €</p>
    <div class="actions">
      <button @click="cart.change(1)">Ajouter</button>
      <button @click="cart.change(-1)">Retirer</button>
    </div>`,
          {
            bootstrap: `import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
createApp(App).use(createPinia()).mount("#app");`,
            modules: {
              "cart.js": `import { defineStore } from "pinia";

export const useCart = defineStore("cart", {
  state: () => ({ quantity: 0, price: 12 }),
  getters: { total: (state) => state.quantity * state.price },
  actions: {
    change(delta) { this.quantity = Math.max(0, this.quantity + delta); },
  },
});`,
            },
          },
        ),
        task: "Ajoute une action vider et relie-la à un bouton. Vérifie que le total revient à zéro.",
        takeaway:
          "Les opérations et les calculs partagés restent au même endroit.",
        quiz: quiz(
          "Quel membre dérive le total à partir du state ?",
          ["Un getter", "Un événement DOM", "Le routeur"],
          0,
          "Un getter expose une valeur calculée à partir de l’état.",
        ),
        link: `${piniaGuide}getters.html`,
      }),
    ],
  },
  {
    id: "moteur-vue",
    title: "Composables et moteur de rendu",
    description:
      "Factorise la logique réactive et contrôle la façon dont l’interface se monte.",
    lessons: [
      lesson({
        id: "composables",
        title: "Réutiliser la logique avec un composable",
        minutes: 18,
        summary:
          "Un composable est une fonction qui assemble de la logique réactive. On le nomme souvent avec le préfixe use, comme useFetch ou useAuth.",
        sections: [
          section(
            "Extraire une logique",
            "Écris useCounter dans un fichier séparé. Chaque appel crée un compteur indépendant et renvoie son état et les actions utiles.",
            [
              "Une fonction composable peut s’appuyer sur ref, computed ou les hooks de cycle de vie.",
              "Si tu installes un écouteur global au montage, retire-le avec onUnmounted.",
            ],
          ),
        ],
        files: demo(
          "Deux compteurs réutilisables",
          `import { useCounter } from "./useCounter.js";
const { count: first, add: addFirst } = useCounter(0);
const { count: second, add: addSecond } = useCounter(10);`,
          `<div class="actions">
      <button @click="addFirst">Groupe A · {{ first }}</button>
      <button @click="addSecond">Groupe B · {{ second }}</button>
    </div>`,
          {
            modules: {
              "useCounter.js": `import { ref } from "vue";

export function useCounter(initial = 0) {
  const count = ref(initial);
  const add = () => { count.value++; };
  return { count, add };
}`,
            },
          },
        ),
        task: "Ajoute une action reset au composable. Branche-la sur un bouton pour chaque groupe.",
        takeaway:
          "La logique peut être partagée tout en gardant des instances d’état distinctes.",
        quiz: quiz(
          "Combien de refs sont créées ici par deux appels à useCounter() ?",
          ["Une", "Deux", "Aucune"],
          1,
          "Chaque appel exécute ref(initial) pour créer sa propre valeur.",
        ),
        link: `${guide}reusability/composables.html`,
      }),
      lesson({
        id: "shallow-teleport",
        title: "shallowRef, composants dynamiques et Teleport",
        minutes: 22,
        summary:
          "shallowRef observe le remplacement de la valeur entière. Il convient à un gros objet traité comme immuable ou à une référence de composant.",
        sections: [
          section(
            "Afficher des panneaux à la demande",
            "Le composant dynamique rend la valeur choisie via :is. Le composant reste une définition que Vue n’a pas besoin d’observer en profondeur.",
            [
              "Pour mettre à jour un gros tableau en shallowRef, remplace .value par un nouveau tableau.",
              "Teleport place un bloc ailleurs dans le DOM, tout en gardant sa relation avec son composant parent.",
              "Pour une boîte de dialogue modale, gère aussi le focus et la fermeture au clavier.",
            ],
          ),
        ],
        files: demo(
          "Panneaux à la demande",
          `import { h, ref, shallowRef } from "vue";
const Summary = { render: () => h("p", "Deux leçons terminées.") };
const Details = { render: () => h("p", "Prochaine étape : un mini-projet.") };
const panel = shallowRef(Summary);
const help = ref(false);`,
          `<div class="actions">
      <button @click="panel = Summary">Résumé</button>
      <button @click="panel = Details">Détails</button>
      <button @click="help = !help">Aide</button>
    </div>
    <component :is="panel" />
    <Teleport to="body">
      <aside v-if="help" class="card" role="status">Ce conseil est placé à la fin du body.</aside>
    </Teleport>`,
        ),
        task: "Ajoute un troisième panneau. Ouvre l’aide et localise son élément dans DevTools.",
        takeaway:
          "Le rendu dynamique choisit le composant. Teleport choisit où un bloc apparaît dans le DOM.",
        quiz: quiz(
          "Quand une shallowRef signale-t-elle directement un changement ?",
          [
            "À chaque modification imbriquée",
            "Quand on remplace sa valeur",
            "Quand une autre page s’ouvre",
          ],
          1,
          "La réactivité se concentre sur .value.",
        ),
        link: `${guide}built-ins/teleport.html`,
      }),
    ],
  },
  {
    id: "typescript-nuxt",
    title: "TypeScript et Nuxt",
    description:
      "Définis des contrats de données puis explore le rendu côté serveur.",
    lessons: [
      lesson({
        id: "vue-typescript",
        title: "Typer les props et les événements",
        minutes: 20,
        summary:
          'Dans <script setup lang="ts">, TypeScript décrit la forme des props et des données envoyées par les événements.',
        sections: [
          section(
            "Donner une forme aux données",
            "Un composant d’article attend un titre, un nombre de minutes et un identifiant. Le parent sait quel type il recevra au clic.",
            [
              "defineProps<{ title: string }>() décrit les props avec des types.",
              "defineEmits<{ select: [id: number] }>() décrit les événements et leur contenu.",
              "L’atelier transforme le TypeScript pour l’aperçu. Dans VS Code, utilise Vue - Official et vue-tsc pour contrôler les types du projet.",
            ],
          ),
        ],
        files: demo(
          "Une carte typée",
          `import { ref } from "vue";
import ArticleCard from "./ArticleCard.vue";
const picked = ref<number | null>(null);`,
          `<ArticleCard :id="12" title="Comprendre Vue" :minutes="9" @select="picked = $event" />
    <p role="status">Identifiant choisi : {{ picked ?? "aucun" }}</p>`,
          {
            modules: {
              "ArticleCard.vue": `<script setup lang="ts">
defineProps<{ id: number; title: string; minutes: number }>();
const emit = defineEmits<{ select: [id: number] }>();
</script>
<template>
  <article class="card">
    <h2>{{ title }}</h2>
    <p>{{ minutes }} min</p>
    <button @click="emit('select', id)">Choisir l’article</button>
  </article>
</template>`,
            },
          },
          true,
        ),
        task: "Ajoute une prop facultative category et un texte par défaut dans le template.",
        takeaway:
          "Les types décrivent le contrat entre composants. Les données venant d’une API demandent aussi une validation à l’exécution.",
        quiz: quiz(
          "Quel attribut active TypeScript dans le script du SFC ?",
          ['lang="ts"', "scoped", 'type="json"'],
          0,
          'lang="ts" indique au compilateur le langage du script.',
        ),
        link: `${guide}typescript/composition-api.html`,
      }),
      lesson({
        id: "nuxt-ssr",
        title: "Nuxt, routage par fichiers et rendu serveur",
        minutes: 25,
        summary:
          "Nuxt ajoute une structure d’application à Vue. Avec le rendu côté serveur, le navigateur reçoit un HTML déjà rempli, puis Vue active les interactions.",
        sections: [
          section(
            "Repérer les fichiers du blog",
            "La page app/pages/index.vue charge les articles via useFetch. app/pages/articles/[slug].vue définit les URLs d’articles. Le code de chaque page est chargé selon la route.",
            [
              "Le gestionnaire server/api/articles.get.ts renvoie les données en JSON.",
              "useSeoMeta donne un titre et une description propres à chaque page.",
              "Le HTML initial aide les lecteurs et les robots à accéder au texte. La qualité du contenu, les liens et les métadonnées comptent aussi.",
            ],
          ),
          section(
            "Vérifier le rendu",
            "Ouvre l’atelier et exporte le ZIP Nuxt. Lance le serveur puis affiche le code source de l’accueil.",
            [
              "Cherche le titre « Tes premiers composants » dans le HTML reçu.",
              "Ouvre /api/articles pour voir le JSON que la page consomme.",
            ],
          ),
        ],
        files: nuxtBlogFiles(),
        task: "Ajoute un article côté serveur et vérifie son URL et ses métadonnées.",
        takeaway:
          "Nuxt peut rendre la page côté serveur et exposer ses données depuis un point d’accès séparé.",
        quiz: quiz(
          "Quel fichier crée une route d’article avec un paramètre ?",
          [
            "app/pages/articles/[slug].vue",
            "app/types/article.ts",
            "app/assets/blog.css",
          ],
          0,
          "Le segment entre crochets devient un paramètre de route.",
        ),
        link: "https://nuxt.com/docs/4.x/guide/concepts/rendering",
      }),
    ],
  },
];

export const vueLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "La réactivité et les directives de base",
    objective:
      "Relie les données JavaScript au HTML et construis des formulaires qui réagissent à la saisie.",
    color: levelColors[0],
    prerequisites:
      "Pour démarrer, révise les variables et événements JavaScript ainsi que les formulaires HTML.",
    outcomes: [
      "Afficher du texte avec les doubles accolades et créer un état avec ref.",
      "Rendre un bloc conditionnel et parcourir une liste avec des clés stables.",
      "Lier les attributs et synchroniser un champ avec v-model.",
      "Réagir aux clics et aux soumissions de formulaire.",
    ],
    chapters: beginner,
    projects: vueProjects[0],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Composants, calculs et appels API",
    objective:
      "Découpe un écran en composants, dérive des données et charge une liste distante en gérant ses différents états.",
    color: levelColors[1],
    prerequisites:
      "Pour démarrer, entraîne-toi avec ref, les directives et les formulaires Vue.",
    outcomes: [
      "Assembler des SFC et organiser la communication avec les props et les événements.",
      "Choisir entre computed et watch.",
      "Utiliser onMounted pour charger des données et gérer un échec.",
      "Créer des pages et des routes avec un paramètre.",
    ],
    chapters: intermediate,
    projects: vueProjects[1],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "État global, TypeScript et Nuxt",
    objective:
      "Centralise l’état partagé, réutilise la logique et explore le rendu serveur d’un site Vue.",
    color: levelColors[2],
    prerequisites:
      "Pour démarrer, connais les composants, le chargement de données et Vue Router.",
    outcomes: [
      "Créer des stores avec state, actions et getters.",
      "Écrire des composables et maîtriser shallowRef, Teleport et les composants dynamiques.",
      "Typer les props et les événements dans un SFC.",
      "Construire un blog Nuxt avec des routes, des métadonnées et du HTML rendu côté serveur.",
    ],
    chapters: advanced,
    projects: vueProjects[2],
  },
];
