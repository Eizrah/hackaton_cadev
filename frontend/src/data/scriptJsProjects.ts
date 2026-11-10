import { consoleFiles } from "./desktopAuthoring";
import { scriptGuiFiles } from "./scriptAuthoring";
import type { WebProject } from "./webCourseTypes";

const invoice = `const articles = [
    { nom: "Clavier", prixCentimes: 2500, quantite: 2 },
    { nom: "Souris", prixCentimes: 1200, quantite: 1 },
];
const tauxExercice = 0.20;
let totalHT = 0;
for (const article of articles) {
    if (!Number.isInteger(article.prixCentimes) || article.prixCentimes < 0 || !Number.isInteger(article.quantite) || article.quantite < 1) {
        throw new Error("Vérifie les prix et les quantités.");
    }
    const ligne = article.prixCentimes * article.quantite;
    totalHT += ligne;
    console.log(article.nom + " x" + article.quantite + " = " + (ligne / 100).toFixed(2) + " EUR");
}
const taxe = Math.round(totalHT * tauxExercice);
console.log("HT " + (totalHT / 100).toFixed(2) + " EUR");
console.log("Taxe d’exercice 20 % : " + (taxe / 100).toFixed(2) + " EUR");
console.log("TTC " + ((totalHT + taxe) / 100).toFixed(2) + " EUR");
`;
const electronPackage = JSON.stringify(
  {
    name: "atelier-electron",
    version: "1.0.0",
    private: true,
    main: "main.cjs",
    scripts: { start: "electron ." },
    devDependencies: { electron: "45.2.3" },
  },
  null,
  2,
);
const page = (title: string, content: string, script = "") => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'"><title>${title}</title><link rel="stylesheet" href="style.css"></head><body><main>${content}</main>${script ? `<script src="${script}"></script>` : ""}</body></html>`;
const style = `* { box-sizing: border-box; } body { margin: 0; font: 16px/1.6 system-ui; background: #0f2036; color: #eaf5ff; padding: 32px; } main { max-width: 800px; margin: auto; } h1 { line-height: 1.2; } .card { padding: 24px; border: 1px solid #365c83; border-radius: 18px; margin-block: 20px; background: #183551; } strong { color: #87caff; } progress { width: 100%; accent-color: #3997e9; } button { padding: 10px 18px; color: white; background: #1769ab; border: 0; border-radius: 8px; cursor: pointer; } :focus-visible { outline: 3px solid #8ccaff; outline-offset: 4px; }`;
const windowMain = `const { app, BrowserWindow } = require("electron");
const path = require("node:path");

function creerFenetre() {
    const fenetre = new BrowserWindow({ width: 800, height: 600, minWidth: 420, minHeight: 360,
        backgroundColor: "#0f2036", title: "Mon premier logiciel",
        webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true }
    });
    fenetre.center();
    fenetre.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    fenetre.webContents.on("will-navigate", event => event.preventDefault());
    fenetre.loadFile(path.join(__dirname, "index.html"));
}
app.whenReady().then(() => {
    creerFenetre();
    app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) creerFenetre(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
`;
const monitoringMain = `const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const os = require("node:os");
let fenetre;
const page = path.join(__dirname, "index.html");

async function lireSysteme() {
    const total = os.totalmem();
    const disponible = os.freemem();
    return { total, disponible, utilisee: total - disponible, coeurs: os.availableParallelism(), date: new Date().toISOString() };
}
function creerFenetre() {
    fenetre = new BrowserWindow({ width: 820, height: 620, minWidth: 430, minHeight: 400,
        backgroundColor: "#0f2036", webPreferences: { preload: path.join(__dirname, "preload.cjs"), contextIsolation: true, nodeIntegration: false, sandbox: true }
    });
    fenetre.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    fenetre.webContents.on("will-navigate", event => event.preventDefault());
    fenetre.loadFile(page);
    fenetre.on("closed", () => { fenetre = null; });
}
app.whenReady().then(() => {
    ipcMain.handle("systeme:mesure", async event => {
        if (!fenetre || event.sender !== fenetre.webContents || event.senderFrame !== fenetre.webContents.mainFrame || event.senderFrame.url !== pathToFileURL(page).href) {
            throw new Error("Fenêtre inconnue.");
        }
        return lireSysteme();
    });
    creerFenetre();
    app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) creerFenetre(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
`;
const preload = `const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("atelier", {
    lireSysteme: () => ipcRenderer.invoke("systeme:mesure"),
});
`;
const monitoringRenderer = `const statut = document.querySelector("#statut");
let arrete = false;
let timer;
const gib = valeur => (valeur / 1024 ** 3).toFixed(2) + " Gio";
async function actualiser() {
    try {
        const mesure = await window.atelier.lireSysteme();
        if (arrete) return;
        const pourcentage = Math.round(mesure.utilisee / mesure.total * 100);
        document.querySelector("#ram").textContent = gib(mesure.utilisee) + " / " + gib(mesure.total);
        document.querySelector("#barre").value = pourcentage;
        document.querySelector("#coeurs").textContent = mesure.coeurs;
        statut.textContent = "Mesure à " + new Date(mesure.date).toLocaleTimeString("fr-FR");
    } catch {
        if (!arrete) statut.textContent = "La mesure est indisponible. Une nouvelle tentative arrive.";
    } finally {
        if (!arrete) timer = setTimeout(actualiser, 1000);
    }
}
window.addEventListener("beforeunload", () => { arrete = true; clearTimeout(timer); });
actualiser();
`;
export const jsInvoice: WebProject = {
  id: "facture-nodejs",
  title: "Le générateur de factures en console",
  description: "Calcule les lignes, le total HT et une taxe d’exercice fixe.",
  minutes: 65,
  requirements: [
    "Parcourir un tableau d’articles avec nom, prix et quantité.",
    "Utiliser des prix en centimes entiers.",
    "Afficher les lignes, le HT, la taxe et le TTC.",
  ],
  hints: [
    "Décompose le calcul de chaque ligne.",
    "Arrondis la taxe au centime avec Math.round.",
  ],
  files: consoleFiles("nodejs", invoice),
};
export const jsWindow: WebProject = {
  id: "fenetre-electron",
  title: "Le lanceur de fenêtre autonome",
  description:
    "Configure Electron et ouvre une fenêtre centrée avec une page locale.",
  minutes: 90,
  requirements: [
    "Ouvrir une fenêtre de 800 × 600.",
    "Charger une page locale stylisée.",
    "Gérer la fermeture et la réactivation de l’application.",
  ],
  hints: [
    "Crée la fenêtre après app.whenReady.",
    "BrowserWindow et la page affichée appartiennent à des processus distincts.",
  ],
  files: scriptGuiFiles("electron", "Première fenêtre Electron", "main.cjs", {
    "main.cjs": windowMain,
    "index.html": page(
      "Mon logiciel",
      '<p>DEVAfrica · MON PREMIER LOGICIEL</p><h1>Une fenêtre pour mes idées.</h1><section class="card"><strong>Electron est prêt.</strong><p>Cette interface est chargée depuis le dossier de ton projet.</p></section>',
    ),
    "style.css": style,
    "package.json": electronPackage,
  }),
};
export const jsMonitor: WebProject = {
  id: "monitoring-electron",
  title: "Le moniteur système Electron",
  description:
    "Observe la mémoire vive avec un pont IPC et une actualisation asynchrone.",
  minutes: 145,
  requirements: [
    "Lire la mémoire depuis le processus principal.",
    "Exposer une action précise par le preload.",
    "Actualiser l’interface après chaque mesure.",
    "Arrêter le minuteur à la fermeture.",
  ],
  hints: [
    "ipcMain.handle et ipcRenderer.invoke forment une demande avec réponse.",
    "Un setTimeout après await évite les mesures qui se chevauchent.",
  ],
  files: scriptGuiFiles("electron", "Moniteur système", "main.cjs", {
    "main.cjs": monitoringMain,
    "preload.cjs": preload,
    "renderer.js": monitoringRenderer,
    "index.html": page(
      "Moniteur système",
      '<p>DEVAfrica · MONITEUR SYSTÈME</p><h1>Ton ordinateur en direct.</h1><section class="card"><h2>Mémoire utilisée</h2><strong id="ram">Mesure en cours</strong><progress id="barre" max="100" value="0" aria-label="Pourcentage de mémoire utilisée"></progress></section><section class="card">Cœurs disponibles <strong id="coeurs">…</strong></section><p id="statut" role="status">Connexion au processus principal…</p>',
      "renderer.js",
    ),
    "style.css": style,
    "package.json": electronPackage,
  }),
};
