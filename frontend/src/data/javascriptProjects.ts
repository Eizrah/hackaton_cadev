import { jsFiles } from "./courseAuthoring";
import type { WebProject } from "./webCourseTypes";

const counter: WebProject = {
  id: "compteur",
  title: "Compteur interactif",
  minutes: 45,
  description:
    "Relie deux boutons à un score qui change de couleur lorsqu’il devient négatif.",
  requirements: [
    "Augmenter et diminuer le score à chaque clic.",
    "Afficher le nombre actuel et signaler les valeurs négatives.",
    "Ajouter un bouton pour remettre le compteur à zéro.",
  ],
  hints: [
    "Garde la valeur dans une variable déclarée avec let.",
    "Appelle une seule fonction d’affichage après chaque changement.",
    "Ajoute le bouton dans index.html puis branche son événement dans script.js.",
  ],
  files: jsFiles(
    "Compteur interactif",
    `<main><h1>Compteur interactif</h1>
<p>Change le score puis ajoute une remise à zéro.</p>
<output id="score" class="score" aria-live="polite">0</output>
<div class="actions"><button id="moins" aria-label="Diminuer">−</button><button id="plus" aria-label="Augmenter">+</button></div></main>`,
    `const score = document.querySelector("#score");
let valeur = 0;

function afficher() {
  score.textContent = String(valeur);
  score.classList.toggle("negatif", valeur < 0);
}

document.querySelector("#plus").addEventListener("click", () => {
  valeur += 1;
  afficher();
});
document.querySelector("#moins").addEventListener("click", () => {
  valeur -= 1;
  afficher();
});
// À toi : ajoute un bouton Réinitialiser et réutilise afficher().`,
    {
      css: ".score { display: block; font-size: 4rem; font-weight: 750; color: #174e88; } .negatif { color: #ae263b; }",
    },
  ),
};

const quotes: WebProject = {
  id: "citations",
  title: "Générateur de citations",
  minutes: 45,
  description:
    "Pioche une phrase dans un tableau et actualise la citation à chaque clic.",
  requirements: [
    "Définir un tableau d’au moins cinq phrases.",
    "Choisir un indice aléatoire valide et afficher le texte.",
    "Éviter de répéter deux fois de suite la même phrase.",
  ],
  hints: [
    "Math.floor(Math.random() * liste.length) donne un indice dans le tableau.",
    "Garde le dernier indice pour exclure la phrase déjà affichée.",
  ],
  files: jsFiles(
    "Générateur de citations",
    `<main><h1>Une idée pour avancer</h1>
<blockquote id="citation" class="card" aria-live="polite">Une petite étape suffit pour commencer.</blockquote>
<button id="tirer">Nouvelle citation</button></main>`,
    `const citations = [
  "Une petite étape suffit pour commencer.",
  "Un exemple compris vaut mieux que dix exemples copiés.",
  "Le code devient plus clair quand on explique son intention.",
  "Teste une idée avant de la compliquer.",
  "Une erreur bien lue indique souvent la prochaine étape."
];
const cible = document.querySelector("#citation");
document.querySelector("#tirer").addEventListener("click", () => {
  const indice = Math.floor(Math.random() * citations.length);
  cible.textContent = citations[indice];
  // À toi : garde le dernier indice et évite une répétition immédiate.
});`,
    { css: "blockquote { margin-inline: 0; font-size: 1.25rem; }" },
  ),
};

const todo: WebProject = {
  id: "todo",
  title: "Todo List persistante",
  minutes: 85,
  description:
    "Ajoute, coche et supprime des tâches. Retrouve-les après avoir relancé ton atelier.",
  requirements: [
    "Ajouter une tâche non vide depuis le formulaire.",
    "Cocher une tâche, actualiser son état et pouvoir la supprimer.",
    "Sauvegarder puis relire la liste au lancement avec localStorage.",
    "Afficher le nombre de tâches restantes.",
  ],
  hints: [
    "JSON.stringify transforme le tableau en texte pour setItem.",
    "Relance l’aperçu après avoir ajouté une tâche pour vérifier la persistance.",
    "Calcule le nombre restant avec filter et length dans afficher().",
  ],
  files: jsFiles(
    "Todo List persistante",
    `<main><h1>Mes tâches</h1>
<form id="ajout" class="actions"><label for="texte">Nouvelle tâche</label><input id="texte" required maxlength="100"><button>Ajouter</button></form>
<ul id="liste" aria-label="Liste des tâches"></ul>
<p id="etat" role="status"></p></main>`,
    `const cle = "todo-devafrica";
const liste = document.querySelector("#liste");
const champ = document.querySelector("#texte");
let taches = [];
try {
  const sauvegarde = JSON.parse(localStorage.getItem(cle) ?? "[]");
  if (Array.isArray(sauvegarde)) {
    taches = sauvegarde.filter(tache => tache && typeof tache.texte === "string");
  }
} catch (erreur) {
  console.warn("La sauvegarde précédente n’a pas pu être lue.", erreur);
}

function enregistrer() {
  localStorage.setItem(cle, JSON.stringify(taches));
  afficher();
}
function afficher() {
  liste.replaceChildren();
  for (const tache of taches) {
    const ligne = document.createElement("li");
    const label = document.createElement("label");
    const coche = document.createElement("input");
    coche.type = "checkbox";
    coche.checked = Boolean(tache.faite);
    coche.addEventListener("change", () => {
      tache.faite = coche.checked;
      enregistrer();
    });
    label.append(coche, " " + tache.texte);
    const supprimer = document.createElement("button");
    supprimer.textContent = "Supprimer";
    supprimer.setAttribute("aria-label", "Supprimer « " + tache.texte + " »");
    supprimer.addEventListener("click", () => {
      taches = taches.filter(item => item !== tache);
      enregistrer();
    });
    ligne.append(label, supprimer);
    liste.append(ligne);
  }
  // À toi : mets #etat à jour avec le nombre de tâches restantes.
}

document.querySelector("#ajout").addEventListener("submit", evenement => {
  evenement.preventDefault();
  const texte = champ.value.trim();
  if (!texte) return;
  taches.push({ texte, faite: false });
  champ.value = "";
  enregistrer();
  champ.focus();
});
afficher();`,
    {
      css: "ul { padding: 0; } li { list-style: none; display: flex; justify-content: space-between; flex-wrap: wrap; gap: .5rem; margin-block: .6rem; padding: .7rem; background: white; border-radius: .6rem; } label:has(:checked) { text-decoration: line-through; }",
    },
  ),
};

export const weatherApiModule = `export async function lireJson(url) {
  const reponse = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!reponse.ok) throw new Error("Le serveur a répondu " + reponse.status + ".");
  return reponse.json();
}

export async function trouverVille(nom) {
  const params = new URLSearchParams({ name: nom, count: "1", language: "fr" });
  const donnees = await lireJson("https://geocoding-api.open-meteo.com/v1/search?" + params);
  const ville = donnees.results?.[0];
  if (!ville) throw new Error("Ville introuvable. Vérifie son nom.");
  return ville;
}

export async function lireMeteo(ville) {
  const params = new URLSearchParams({
    latitude: String(ville.latitude),
    longitude: String(ville.longitude),
    current: "temperature_2m,relative_humidity_2m,weather_code",
    timezone: "auto"
  });
  const donnees = await lireJson("https://api.open-meteo.com/v1/forecast?" + params);
  if (!donnees.current) throw new Error("Mesures momentanément indisponibles.");
  return donnees.current;
}`;

const weather: WebProject = {
  id: "meteo",
  title: "Météo dynamique",
  minutes: 100,
  description:
    "Cherche une ville et affiche les conditions actuelles renvoyées par Open-Meteo.",
  requirements: [
    "Transformer le nom d’une ville en coordonnées avec l’API de géocodage.",
    "Afficher température, humidité et un symbole accompagné d’un texte.",
    "Distinguer attente, ville introuvable et résultat valide.",
    "Tester deux villes et ajouter l’heure locale des mesures.",
  ],
  hints: [
    "Une première requête trouve la latitude et la longitude. La seconde lit les mesures.",
    "Utilise response.ok avant de lire le JSON.",
    "La propriété current.time donne l’heure locale demandée avec timezone=auto.",
  ],
  files: jsFiles(
    "Météo dynamique",
    `<main><h1>Météo dynamique</h1>
<form id="recherche" class="actions"><label for="ville">Ville</label><input id="ville" value="Toamasina" required minlength="2"><button>Voir la météo</button></form>
<p id="message" role="status">Recherche une ville pour lire les données en direct.</p>
<section class="card" id="resultat" hidden><h2 id="lieu"></h2><p id="ciel"></p><p id="mesures"></p></section>
<p class="muted">Source : Open-Meteo. L’accès aux mesures nécessite une connexion.</p></main>`,
    `import { trouverVille, lireMeteo } from "./meteo-api.js";

const form = document.querySelector("#recherche");
const message = document.querySelector("#message");
const resultat = document.querySelector("#resultat");
const bouton = form.querySelector("button");

function ciel(code) {
  if (code === 0) return "☀️ Ciel dégagé";
  if (code <= 3) return "⛅ Nuages";
  if (code <= 48) return "🌫️ Brouillard";
  if (code >= 95) return "⛈️ Orage";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "❄️ Neige";
  return "🌧️ Précipitations";
}

form.addEventListener("submit", async (evenement) => {
  evenement.preventDefault();
  const nom = document.querySelector("#ville").value.trim();
  if (!nom || bouton.disabled) return;
  bouton.disabled = true;
  resultat.hidden = true;
  message.textContent = "Chargement des mesures…";
  try {
    const ville = await trouverVille(nom);
    const conditions = await lireMeteo(ville);
    document.querySelector("#lieu").textContent = [ville.name, ville.country].filter(Boolean).join(", ");
    document.querySelector("#ciel").textContent = ciel(conditions.weather_code);
    document.querySelector("#mesures").textContent = conditions.temperature_2m + " °C · humidité " + conditions.relative_humidity_2m + " %";
    resultat.hidden = false;
    message.textContent = "Conditions actuelles chargées.";
    // À toi : affiche conditions.time sous les mesures.
  } catch (erreur) {
    message.textContent = erreur.message || "Connexion indisponible.";
    console.warn(erreur);
  } finally {
    bouton.disabled = false;
  }
});`,
    { modules: { "meteo-api.js": weatherApiModule } },
  ),
};

const memory: WebProject = {
  id: "memory",
  title: "Jeu du Memory",
  minutes: 120,
  description:
    "Retourne des cartes, trouve les paires et gère les tentatives avant la fin du temps.",
  requirements: [
    "Organiser le jeu avec les classes Jeu et Carte.",
    "Mélanger les cartes et comparer les deux cartes choisies.",
    "Compter les paires, les tentatives et le temps restant.",
    "Vérifier les fins de partie et ajouter un niveau de difficulté.",
  ],
  hints: [
    "Garde une seule sélection temporaire de deux cartes.",
    "Bloque les clics pendant la comparaison puis nettoie les timers au redémarrage.",
    "Le nombre de symboles et le temps de départ peuvent devenir des options.",
  ],
  files: jsFiles(
    "Jeu du Memory",
    `<main><h1>Jeu du Memory</h1>
<div class="actions"><button id="commencer">Nouvelle partie</button><strong id="temps">60 s</strong><span id="score">0 paire · 0 tentative</span></div>
<p id="statut" role="status">Clique sur Nouvelle partie pour démarrer.</p>
<div id="plateau" aria-label="Cartes du jeu"></div></main>`,
    `import { Jeu } from "./jeu.js";
const jeu = new Jeu(document.querySelector("#plateau"));
document.querySelector("#commencer").addEventListener("click", () => jeu.demarrer());
// À toi : ajoute une difficulté et transmets sa durée à demarrer().`,
    {
      css: "#plateau { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .45rem; } .carte { min-height: 3rem; padding: .35rem; font-size: 1.35rem; transition: transform .18s, background .18s; } .carte.ouverte { background: #e1eeff; color: #18334e; transform: rotateY(10deg); } .carte.trouvee { opacity: .7; } @media (prefers-reduced-motion: reduce) { .carte { transition: none; transform: none; } }",
      modules: {
        "jeu.js": `export class Carte {
  constructor(symbole, id) {
    this.symbole = symbole;
    this.id = id;
    this.trouvee = false;
  }
}

export class Jeu {
  constructor(plateau) {
    this.plateau = plateau;
    this.cartes = [];
    this.selection = [];
    this.actif = false;
  }
  demarrer(duree = 60) {
    this.arreter();
    const symboles = ["🌍", "📚", "🧩", "🚀"];
    this.cartes = [...symboles, ...symboles].map((symbole, id) => new Carte(symbole, id));
    for (let i = this.cartes.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartes[i], this.cartes[j]] = [this.cartes[j], this.cartes[i]];
    }
    this.selection = [];
    this.paires = 0;
    this.tentatives = 0;
    this.secondes = duree;
    this.actif = true;
    document.querySelector("#statut").textContent = "Trouve les quatre paires.";
    this.horloge = setInterval(() => {
      this.secondes -= 1;
      if (this.secondes <= 0) this.finir("Temps écoulé. Rejoue pour t’améliorer !");
      this.afficherScore();
    }, 1000);
    this.afficher();
  }
  arreter() {
    clearInterval(this.horloge);
    clearTimeout(this.pause);
    this.actif = false;
  }
  finir(message) {
    this.arreter();
    document.querySelector("#statut").textContent = message;
    this.afficher();
  }
  choisir(carte) {
    if (!this.actif || carte.trouvee || this.selection.includes(carte) || this.selection.length >= 2) return;
    this.selection.push(carte);
    this.afficher();
    if (this.selection.length !== 2) return;
    this.tentatives += 1;
    this.afficherScore();
    this.pause = setTimeout(() => {
      const [a, b] = this.selection;
      if (a.symbole === b.symbole) {
        a.trouvee = b.trouvee = true;
        this.paires += 1;
      }
      this.selection = [];
      if (this.paires === this.cartes.length / 2) this.finir("Bravo, toutes les paires sont trouvées !");
      else this.afficher();
    }, 650);
  }
  afficherScore() {
    document.querySelector("#temps").textContent = this.secondes + " s";
    document.querySelector("#score").textContent = this.paires + (this.paires > 1 ? " paires" : " paire") + " · " + this.tentatives + (this.tentatives > 1 ? " tentatives" : " tentative");
  }
  afficher() {
    this.afficherScore();
    this.plateau.replaceChildren(...this.cartes.map(carte => {
      const visible = carte.trouvee || this.selection.includes(carte);
      const bouton = document.createElement("button");
      bouton.className = "carte" + (visible ? " ouverte" : "") + (carte.trouvee ? " trouvee" : "");
      bouton.textContent = visible ? carte.symbole : "?";
      bouton.setAttribute("aria-label", "Carte " + (carte.id + 1) + (visible ? " " + carte.symbole : " cachée"));
      bouton.disabled = !this.actif || carte.trouvee;
      bouton.addEventListener("click", () => this.choisir(carte));
      return bouton;
    }));
  }
}`,
      },
    },
  ),
};

const audio: WebProject = {
  id: "lecteur-audio",
  title: "Lecteur audio personnalisé",
  minutes: 120,
  description:
    "Construis un lecteur avec des pistes de synthèse, les commandes de lecture et une progression interactive.",
  requirements: [
    "Organiser les pistes et le lecteur dans des modules distincts.",
    "Gérer lecture, pause, piste suivante et volume.",
    "Synchroniser la barre avec currentTime et permettre le déplacement.",
    "Ajouter une commande Piste précédente et vérifier la fin de piste.",
  ],
  hints: [
    "Le module pistes.js crée deux échantillons audio locaux pour tes essais.",
    "L’événement timeupdate donne la position actuelle. loadedmetadata fournit la durée.",
    "Lance la lecture à partir d’un clic et traite le rejet éventuel de play().",
  ],
  files: jsFiles(
    "Lecteur audio personnalisé",
    `<main><h1>Lecteur audio</h1><section class="card">
<h2 id="titre"></h2><audio id="audio" preload="metadata"></audio>
<div class="actions"><button id="lire">Lire</button><button id="pause">Pause</button><button id="suivant">Suivant</button></div>
<p><label>Volume <input id="volume" type="range" min="0" max="1" step="0.01" value="0.65"></label></p>
<p><label>Progression <input id="position" type="range" min="0" max="100" step="0.1" value="0"></label> <output id="duree">0 / 0 s</output></p>
<p id="info" role="status">Appuie sur Lire pour écouter une piste.</p></section></main>`,
    `import { pistes } from "./pistes.js";
const audio = document.querySelector("#audio");
const position = document.querySelector("#position");
const info = document.querySelector("#info");
let indice = 0;

function charger() {
  audio.src = pistes[indice].url;
  document.querySelector("#titre").textContent = pistes[indice].titre;
  position.value = "0";
  document.querySelector("#duree").textContent = "0 / 0 s";
}
async function lire() {
  try { await audio.play(); info.textContent = "Lecture en cours."; }
  catch (erreur) { info.textContent = "Impossible de lancer la lecture."; console.warn(erreur); }
}
function suivant() {
  indice = (indice + 1) % pistes.length;
  charger();
  void lire();
}
function afficherPosition() {
  if (!Number.isFinite(audio.duration)) return;
  position.value = String(audio.currentTime / audio.duration * 100);
  document.querySelector("#duree").textContent = audio.currentTime.toFixed(1) + " / " + audio.duration.toFixed(1) + " s";
}
document.querySelector("#lire").addEventListener("click", lire);
document.querySelector("#pause").addEventListener("click", () => { audio.pause(); info.textContent = "En pause."; });
document.querySelector("#suivant").addEventListener("click", suivant);
document.querySelector("#volume").addEventListener("input", evenement => { audio.volume = Number(evenement.target.value); });
position.addEventListener("input", () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(position.value) / 100 * audio.duration; });
audio.addEventListener("timeupdate", afficherPosition);
audio.addEventListener("loadedmetadata", afficherPosition);
audio.addEventListener("ended", suivant);
window.addEventListener("pagehide", () => pistes.forEach(piste => URL.revokeObjectURL(piste.url)));
audio.volume = 0.65;
charger();
// À toi : ajoute un bouton Précédent qui recharge la piste précédente.`,
    {
      modules: {
        "pistes.js": `// Deux mélodies de synthèse courtes, générées en WAV pour l’atelier.
function wav(notes) {
  const taux = 8000;
  const parNote = 3600;
  const longueur = notes.length * parNote;
  const octets = new Uint8Array(44 + longueur);
  const vue = new DataView(octets.buffer);
  const texte = (offset, valeur) => octets.set(new TextEncoder().encode(valeur), offset);
  texte(0, "RIFF"); vue.setUint32(4, 36 + longueur, true);
  texte(8, "WAVEfmt "); vue.setUint32(16, 16, true);
  vue.setUint16(20, 1, true); vue.setUint16(22, 1, true);
  vue.setUint32(24, taux, true); vue.setUint32(28, taux, true);
  vue.setUint16(32, 1, true); vue.setUint16(34, 8, true);
  texte(36, "data"); vue.setUint32(40, longueur, true);
  notes.forEach((note, indice) => {
    for (let i = 0; i < parNote; i += 1) {
      const enveloppe = Math.sin(Math.PI * i / parNote);
      const onde = Math.sin(2 * Math.PI * note * i / taux);
      octets[44 + indice * parNote + i] = 128 + 38 * enveloppe * onde;
    }
  });
  return URL.createObjectURL(new Blob([octets], { type: "audio/wav" }));
}

export const pistes = [
  { titre: "Premières lignes", url: wav([262, 330, 392, 523, 392, 330, 294, 349, 440, 523, 440, 349, 330, 392, 523, 392]) },
  { titre: "Navigation bleue", url: wav([220, 262, 330, 440, 392, 330, 262, 247, 294, 349, 494, 440, 349, 294, 262, 220]) }
];`,
      },
    },
  ),
};

export const javascriptProjects = {
  debutant: [counter, quotes],
  intermediaire: [todo, weather],
  avance: [memory, audio],
};
