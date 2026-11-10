import { vueFiles } from "./courseAuthoring";
import type { WebFiles, WebProject } from "./webCourseTypes";

export const cryptoDashboard = `<script setup>
import { computed, onMounted, ref } from "vue";

const demo = [
  { id: "btc-bitcoin", name: "Bitcoin", symbol: "BTC", quotes: { USD: { price: 64000 } } },
  { id: "eth-ethereum", name: "Ethereum", symbol: "ETH", quotes: { USD: { price: 3100 } } },
  { id: "sol-solana", name: "Solana", symbol: "SOL", quotes: { USD: { price: 145 } } },
];
const coins = ref([]);
const search = ref("");
const status = ref("Chargement des cours…");
const filtered = computed(() => coins.value.filter((coin) =>
  (coin.name + " " + coin.symbol).toLowerCase().includes(search.value.trim().toLowerCase())
));
const usd = new Intl.NumberFormat("fr", { style: "currency", currency: "USD" });

async function load() {
  status.value = "Chargement des cours…";
  try {
    coins.value = await Promise.all(demo.map(async ({ id }) => {
      const response = await fetch("https://api.coinpaprika.com/v1/tickers/" + id, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    }));
    status.value = "Cours reçus de CoinPaprika, en dollars américains.";
  } catch {
    coins.value = demo;
    status.value = "API indisponible. Prix fictifs pour l’exercice.";
  }
}

onMounted(load);
</script>

<template>
  <main>
    <h1>Observatoire crypto</h1>
    <div class="actions">
      <label>Rechercher <input v-model="search" placeholder="Bitcoin ou BTC" /></label>
      <button @click="load">Actualiser</button>
    </div>
    <p role="status">{{ status }}</p>
    <p v-if="coins.length && !filtered.length">Aucun résultat.</p>
    <div class="grid">
      <article v-for="coin in filtered" :key="coin.id" class="card">
        <h2>{{ coin.name }}</h2>
        <p>{{ coin.symbol }} · {{ usd.format(coin.quotes.USD.price) }}</p>
      </article>
    </div>
  </main>
</template>`;

export function nuxtBlogFiles(): WebFiles {
  return {
    html: "",
    css: "",
    entry: "app/pages/index.vue",
    local: {
      runtime: "nuxt",
      sources: {
        "app/pages/index.vue": `<script setup lang="ts">
import type { Article } from "~/types/article";

const { data: articles, error } = await useFetch<Article[]>("/api/articles");
useSeoMeta({
  title: "Carnet DevAfrica",
  description: "Des articles pour apprendre à développer des applications web.",
});
</script>

<template>
  <main>
    <p class="eyebrow">ÉDITION DEVAFRICA</p>
    <h1>Carnet DevAfrica</h1>
    <p>Trois lectures pour progresser sur le web.</p>
    <p v-if="error" role="alert">Le serveur n’a pas pu charger les articles.</p>
    <article v-for="article in articles" :key="article.slug">
      <h2><NuxtLink :to="'/articles/' + article.slug">{{ article.title }}</NuxtLink></h2>
      <p>{{ article.description }}</p>
    </article>
  </main>
</template>`,
        "app/pages/articles/[slug].vue": `<script setup lang="ts">
import type { Article } from "~/types/article";

const route = useRoute();
const { data: articles, error } = await useFetch<Article[]>("/api/articles");
if (error.value) throw createError({ statusCode: 503, statusMessage: "Articles indisponibles" });
const article = computed(() => articles.value?.find((item) => item.slug === route.params.slug));
if (!article.value) throw createError({ statusCode: 404, statusMessage: "Article introuvable" });
useSeoMeta({ title: () => article.value?.title, description: () => article.value?.description });
</script>

<template>
  <main v-if="article">
    <NuxtLink to="/">← Tous les articles</NuxtLink>
    <h1>{{ article.title }}</h1>
    <p>{{ article.description }}</p>
    <article>{{ article.body }}</article>
  </main>
</template>`,
        "app/types/article.ts": `export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
};`,
        "server/api/articles.get.ts": `import type { Article } from "../../app/types/article";

export default defineEventHandler((): Article[] => [
  {
    slug: "premiers-composants",
    title: "Tes premiers composants",
    description: "Découpe une interface en responsabilités simples.",
    body: "Commence par repérer les éléments répétés. Donne à chaque composant des props utiles et un nom qui décrit son rôle.",
  },
  {
    slug: "reactivite-vue",
    title: "Suivre les données réactives",
    description: "Comprends le passage de ref à computed.",
    body: "Une ref porte une valeur qui change. Une propriété calculée exprime une valeur dérivée à partir de cette donnée.",
  },
  {
    slug: "rendu-serveur",
    title: "Voir le HTML du rendu serveur",
    description: "Ouvre le code source pour inspecter ce que Nuxt envoie.",
    body: "Le serveur produit le HTML de la page. Le navigateur affiche le document puis active les interactions Vue.",
  },
]);`,
        "nuxt.config.ts": `export default defineNuxtConfig({
  ssr: true,
  css: ["~/assets/blog.css"],
  app: { head: { htmlAttrs: { lang: "fr" } } },
});`,
        "app/assets/blog.css": `body { margin: 0; background: #eef5fc; color: #173653; font: 1rem/1.6 system-ui; }
main { max-width: 48rem; margin: auto; padding: clamp(1rem, 5vw, 3rem); }
article { background: white; border: 1px solid #ceddeb; border-radius: 1rem; margin: 1rem 0; padding: 1.2rem; }
article h2 { margin: 0; font-size: 1.25rem; }
a { color: #145898; }
.eyebrow { font-size: .78rem; font-weight: 700; letter-spacing: .15em; }`,
        "package.json": JSON.stringify(
          {
            name: "carnet-devafrica",
            private: true,
            type: "module",
            scripts: {
              dev: "nuxt dev",
              build: "nuxt build",
              preview: "nuxt preview",
            },
            dependencies: {
              nuxt: "^4.2.0",
              vue: "^3.5.0",
              "vue-router": "^4.6.0",
            },
          },
          null,
          2,
        ),
        "README.md": `# Carnet DevAfrica

Utilise Node 24 à jour. Dans ce dossier, lance npm install puis npm run dev.
Ouvre http://localhost:3000/ et vérifie les pages d’articles. Le point d’accès
/api/articles renvoie les données de démonstration du serveur Nuxt.
Compare le code source de la page avec la réponse JSON. Tu peux remplacer la
source de données dans server/api/articles.get.ts par une API distante.

Pour tester la compilation, lance npm run build puis npm run preview.`,
      },
    },
  };
}

export const vueProjects: WebProject[][] = [
  [
    {
      id: "liste-courses",
      title: "La liste de courses interactive",
      description: "Prépare une liste réactive pour ton prochain marché.",
      minutes: 40,
      requirements: [
        "Ajouter un article depuis un champ v-model sans accepter de valeur vide.",
        "Cocher un article et barrer son nom avec une classe dynamique.",
        "Vider la liste et afficher un message quand elle est vide.",
      ],
      hints: [
        "Utilise v-model.trim et @submit.prevent.",
        "Donne un id distinct à chaque article, puis utilise-le comme :key.",
      ],
      files: vueFiles(
        "Liste de courses",
        `<script setup>
import { ref } from "vue";

const draft = ref("");
const items = ref([{ id: 1, name: "Mangues", done: false }]);
let nextId = 2;

function add() {
  if (!draft.value.trim()) return;
  items.value.push({ id: nextId++, name: draft.value.trim(), done: false });
  draft.value = "";
}
</script>

<template>
  <main>
    <h1>Ma liste de courses</h1>
    <form class="actions" @submit.prevent="add">
      <label>Article <input v-model.trim="draft" placeholder="Ex. riz" required /></label>
      <button>Ajouter</button>
    </form>
    <p v-if="!items.length" role="status">La liste est vide.</p>
    <ul>
      <li v-for="item in items" :key="item.id">
        <label :class="{ done: item.done }">
          <input v-model="item.done" type="checkbox" /> {{ item.name }}
        </label>
      </li>
    </ul>
    <button :disabled="!items.length" @click="items = []">Vider la liste</button>
  </main>
</template>

<style scoped>
.done { text-decoration: line-through; color: #547089; }
</style>`,
      ),
    },
    {
      id: "carte-visite",
      title: "Le générateur de cartes de visite",
      description:
        "Relie un formulaire à un aperçu qui se met à jour au fil de la saisie.",
      minutes: 45,
      requirements: [
        "Saisir le nom, le prénom et le métier.",
        "Changer la couleur à partir d’un choix accessible.",
        "Mettre à jour l’aperçu à chaque saisie et le rendre lisible sur mobile.",
      ],
      hints: [
        "Rassemble les champs avec reactive.",
        "Utilise :style pour passer une couleur à une variable CSS.",
      ],
      files: vueFiles(
        "Carte de visite",
        `<script setup>
import { reactive } from "vue";

const card = reactive({ first: "Tiana", last: "Rakoto", job: "Développeuse", color: "#1c5a95" });
</script>

<template>
  <main>
    <h1>Crée ta carte</h1>
    <div class="grid">
      <form class="fields card" @submit.prevent>
        <label>Prénom <input v-model="card.first" /></label>
        <label>Nom <input v-model="card.last" /></label>
        <label>Métier <input v-model="card.job" /></label>
        <label>Couleur <input v-model="card.color" type="color" /></label>
      </form>
      <article class="card preview" :style="{ '--accent': card.color }">
        <p>DEVAFRICA CONNECT</p>
        <h2>{{ card.first }} {{ card.last }}</h2>
        <p>{{ card.job || "Ton métier" }}</p>
      </article>
    </div>
  </main>
</template>

<style scoped>
.fields, .fields label { display: grid; gap: .45rem; }
.preview { border-top: .65rem solid var(--accent); align-self: start; }
</style>`,
      ),
    },
  ],
  [
    {
      id: "tableau-crypto",
      title: "Le tableau de bord de cryptomonnaies",
      description:
        "Récupère des cours publics puis retrouve une devise par son nom ou son symbole.",
      minutes: 60,
      requirements: [
        "Démarrer le chargement depuis onMounted et afficher son état.",
        "Filtrer les résultats avec computed, sans relancer de requête à chaque caractère.",
        "Afficher le prix, le symbole et un message explicite en cas d’échec réseau.",
      ],
      hints: [
        "Vérifie response.ok avant de lire le JSON.",
        "Utilise les prix fictifs clairement identifiés pour travailler hors connexion.",
      ],
      files: vueFiles("Observatoire crypto", cryptoDashboard),
    },
    {
      id: "quiz-composants",
      title: "Le quiz à choix multiples",
      description:
        "Organise les questions en composants et fais remonter chaque réponse au parent.",
      minutes: 55,
      requirements: [
        "Transmettre une question au composant enfant avec des props.",
        "Émettre la réponse depuis l’enfant et mettre le score à jour dans le parent.",
        "Afficher un résultat final et proposer de recommencer.",
      ],
      hints: [
        "Le parent conserve l’index et le score.",
        "Passe une :key à l’enfant si son état doit redémarrer à chaque question.",
      ],
      files: vueFiles(
        "Quiz Vue",
        `<script setup>
import { computed, ref } from "vue";
import QuestionCard from "./QuestionCard.vue";

const questions = [
  { text: "Quel outil lie un champ à une valeur ?", options: ["v-for", "v-model"], answer: 1 },
  { text: "Quel outil dérive une valeur réactive ?", options: ["computed", "onMounted"], answer: 0 },
  { text: "Qui garde le score ?", options: ["Le composant parent", "Le bouton"], answer: 0 },
];
const index = ref(0);
const score = ref(0);
const current = computed(() => questions[index.value]);

function answer(choice) {
  if (choice === current.value.answer) score.value++;
  index.value++;
}
</script>

<template>
  <main>
    <h1>Quiz Vue</h1>
    <p role="status">Score : {{ score }} / {{ questions.length }}</p>
    <QuestionCard v-if="current" :key="index" :question="current" @answer="answer" />
    <button v-else @click="index = 0; score = 0">Recommencer</button>
  </main>
</template>`,
        {
          modules: {
            "QuestionCard.vue": `<script setup>
defineProps({ question: { type: Object, required: true } });
const emit = defineEmits(["answer"]);
</script>

<template>
  <article class="card">
    <h2>{{ question.text }}</h2>
    <div class="actions">
      <button v-for="(option, index) in question.options" :key="option" @click="emit('answer', index)">
        {{ option }}
      </button>
    </div>
  </article>
</template>`,
          },
        },
      ),
    },
  ],
  [
    {
      id: "lecteur-pinia",
      title: "Le studio musical avec Pinia",
      description:
        "Garde le mini-lecteur et la file d’attente synchronisés quand tu changes de page.",
      minutes: 85,
      requirements: [
        "Centraliser le morceau, le volume et la file d’attente dans Pinia.",
        "Naviguer entre les morceaux et la file avec Vue Router.",
        "Lire un extrait, régler le volume et passer au titre suivant depuis le lecteur persistant.",
      ],
      hints: [
        "Installe le store avant de monter l’application.",
        "Le lecteur est placé à côté de RouterView pour rester monté entre les routes.",
        "Les trois sons sont synthétisés localement. Remplace-les par des fichiers audio que tu peux diffuser.",
      ],
      files: vueFiles(
        "Studio musical",
        `<script setup>
import { usePlayer } from "./player.js";
const player = usePlayer();
</script>

<template>
  <main>
    <h1>Studio musical</h1>
    <nav class="actions" aria-label="Navigation du lecteur">
      <RouterLink to="/">Explorer</RouterLink>
      <RouterLink to="/file">File d’attente ({{ player.queue.length }})</RouterLink>
    </nav>
    <RouterView />
    <section class="card player" aria-label="Mini-lecteur">
      <strong>{{ player.current.title }}</strong>
      <audio :src="player.current.source" :volume="player.volume" controls @ended="player.next()" />
      <div class="actions">
        <label>Volume <input v-model.number="player.volume" type="range" min="0" max="1" step=".05" /></label>
        <button @click="player.next()">Suivant</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.player { position: sticky; bottom: 0; box-shadow: 0 -8px 24px #15305018; }
audio { display: block; width: 100%; margin-block: .5rem; }
</style>`,
        {
          bootstrap: `import { createApp } from "vue";
import { createPinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import App from "./App.vue";
import Explorer from "./Explorer.vue";
import Queue from "./Queue.vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: "/", component: Explorer }, { path: "/file", component: Queue }],
});
const app = createApp(App).use(createPinia()).use(router);
router.push("/").then(() => app.mount("#app"));`,
          modules: {
            "Explorer.vue": `<script setup>
import { tracks, usePlayer } from "./player.js";
const player = usePlayer();
</script>

<template>
  <section class="grid">
    <article v-for="(track, index) in tracks" :key="track.title" class="card">
      <h2>{{ track.title }}</h2>
      <div class="actions">
        <button @click="player.select(index)">Choisir</button>
        <button @click="player.enqueue(index)">Ajouter à la file</button>
      </div>
    </article>
  </section>
</template>`,
            "Queue.vue": `<script setup>
import { tracks, usePlayer } from "./player.js";
const player = usePlayer();
</script>

<template>
  <section class="card">
    <h2>File d’attente</h2>
    <p v-if="!player.queue.length">Ajoute des extraits depuis Explorer.</p>
    <ol>
      <li v-for="track in player.queue" :key="track">{{ tracks[track].title }}</li>
    </ol>
  </section>
</template>`,
            "player.js": `import { defineStore } from "pinia";
import { tone } from "./tone.js";

export const tracks = [
  { title: "Aube", source: tone(261.63) },
  { title: "Horizon", source: tone(329.63) },
  { title: "Océan", source: tone(392) },
];

export const usePlayer = defineStore("player", {
  state: () => ({ index: 0, volume: 0.5, queue: [] }),
  getters: { current: (state) => tracks[state.index] },
  actions: {
    select(index) { this.index = index; },
    enqueue(index) {
      if (!this.queue.includes(index)) this.queue.push(index);
    },
    next() {
      this.index = this.queue.shift() ?? (this.index + 1) % tracks.length;
    },
  },
});`,
            "tone.js": `export function tone(frequency) {
  const rate = 8000;
  const count = rate * 4;
  const bytes = new ArrayBuffer(44 + count * 2);
  const view = new DataView(bytes);
  const text = (offset, value) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, bytes.byteLength - 8, true);
  text(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, count * 2, true);
  for (let i = 0; i < count; i++) {
    const time = i / rate;
    const step = Math.floor(time * 2) % 4;
    const envelope = Math.sin(Math.PI * ((time * 2) % 1));
    const wave = Math.sin(2 * Math.PI * frequency * [1, 1.25, 1.5, 2][step] * time);
    view.setInt16(44 + i * 2, 7000 * envelope * wave, true);
  }
  return URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
}`,
          },
        },
      ),
    },
    {
      id: "blog-nuxt",
      title: "Le blog d’actualités avec Nuxt et TypeScript",
      description:
        "Rends un carnet d’articles côté serveur et donne à chaque page une URL et des métadonnées.",
      minutes: 90,
      requirements: [
        "Charger des articles typés depuis /api/articles et créer une page par slug.",
        "Ajouter un titre et une description avec useSeoMeta.",
        "Lancer le projet Nuxt exporté et retrouver un titre d’article dans le HTML de la réponse initiale.",
      ],
      hints: [
        "Les fichiers de app/pages définissent les routes.",
        "Vérifie le HTML avec Afficher le code source, puis ouvre /api/articles pour comparer les données JSON.",
        "Le serveur Nuxt fournit des articles de départ. Essaie ensuite une API distante dans le gestionnaire serveur.",
      ],
      files: nuxtBlogFiles(),
    },
  ],
];
