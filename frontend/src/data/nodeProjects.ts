import { nodeFiles, nodePage } from "./nodeAuthoring";
import type { WebProject } from "./webCourseTypes";

const tasks: WebProject = {
  id: "express-taches",
  title: "L’API d’une liste de tâches",
  description:
    "Crée, lis, modifie et supprime des tâches gardées dans un tableau pendant la session du serveur.",
  minutes: 55,
  requirements: [
    "Créer et lister des tâches en mémoire.",
    "Modifier et supprimer la tâche identifiée dans l’URL.",
    "Refuser un titre vide et renvoyer 404 pour un identifiant inconnu.",
  ],
  hints: [
    "Le corps JSON contient title et éventuellement done.",
    "Redémarre le serveur pour constater que le tableau repart des données initiales.",
  ],
  files: nodeFiles("Liste de tâches Express", {
    home: `<p>Le serveur conserve les tâches dans un tableau JavaScript.</p>
<ul class="card"><li><a href="/api/tasks">GET /api/tasks</a></li><li>POST /api/tasks</li><li>PUT et DELETE /api/tasks/:id</li></ul>
<p>Copie les commandes PowerShell du README.md pour envoyer les requêtes d’écriture.</p>`,
    sources: {
      "index.js": `const { createApp, finish, start, HttpError } = require("./server");
const app = createApp();
const tasks = [{ id: 1, title: "Lire une route Express", done: false }];
let nextId = 2;

function input(body) {
  if (typeof body?.title !== "string" || !body.title.trim() || body.title.trim().length > 120 ||
      (body.done !== undefined && typeof body.done !== "boolean")) {
    throw new HttpError(400, "Donne un titre de 1 à 120 caractères et un état booléen.");
  }
  return { title: body.title.trim(), done: body.done ?? false };
}

function position(id) {
  const index = tasks.findIndex(task => String(task.id) === id);
  if (index === -1) throw new HttpError(404, "Tâche introuvable.");
  return index;
}

app.get("/api/tasks", (req, res) => {
  const search = req.query.search ?? "";
  if (typeof search !== "string") throw new HttpError(400, "Le filtre search doit être du texte.");
  res.json(tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase())));
});

app.get("/api/tasks/:id", (req, res) => res.json(tasks[position(req.params.id)]));

app.post("/api/tasks", (req, res) => {
  const task = { ...input(req.body), id: nextId++ };
  tasks.push(task);
  res.location("/api/tasks/" + task.id).status(201).json(task);
});

app.put("/api/tasks/:id", (req, res) => {
  const index = position(req.params.id);
  tasks[index] = { id: tasks[index].id, ...input(req.body) };
  res.json(tasks[index]);
});

app.delete("/api/tasks/:id", (req, res) => {
  tasks.splice(position(req.params.id), 1);
  res.sendStatus(204);
});

finish(app);
start(app);
`,
      "examples/callback.js": `const fs = require("node:fs");
const path = require("node:path");

console.log("1. Début");
fs.readFile(path.join(__dirname, "../package.json"), "utf8", (error, text) => {
  if (error) {
    console.error("Lecture impossible.", error.code);
    return;
  }
  console.log("3. Le fichier contient", text.length, "caractères.");
});
console.log("2. La lecture se poursuit en arrière-plan.");
`,
    },
    notes: `\`\`\`powershell
$base = 'http://127.0.0.1:3000/api/tasks'
$task = Invoke-RestMethod -Uri $base -Method Post -ContentType 'application/json' -Body '{"title":"Coder","done":false}'
Invoke-RestMethod -Uri $base
Invoke-RestMethod -Uri "$base/$($task.id)" -Method Put -ContentType 'application/json' -Body '{"title":"Coder","done":true}'
Invoke-RestMethod -Uri "$base/$($task.id)" -Method Delete
\`\`\`

Essaie aussi node examples/callback.js pour observer l’ordre des messages dans le terminal.
`,
  }),
};

const currencies: WebProject = {
  id: "convertisseur-express",
  title: "Le convertisseur de devises",
  description:
    "Lis un montant et deux codes de devise dans une requête POST, puis retourne le résultat en JSON.",
  minutes: 45,
  requirements: [
    "Vérifier le montant et les deux codes.",
    "Calculer la conversion et arrondir le résultat à deux décimales.",
    "Identifier les taux comme données d’exercice.",
  ],
  hints: [
    "Les taux représentent une valeur par unité de la devise de référence.",
    "Essaie un code inconnu et compare le statut de réponse.",
  ],
  files: nodeFiles("Convertisseur de devises", {
    sources: {
      "index.js": `const { createApp, finish, start, HttpError } = require("./server");
const app = createApp();
const rates = { EUR: 1, USD: 1.1, MGA: 5000 };

app.post("/api/convert", (req, res) => {
  const { amount, from, to } = req.body ?? {};
  if (!Number.isFinite(amount) || amount < 0 || amount > 1e9) {
    throw new HttpError(400, "Le montant doit être un nombre positif ou nul, jusqu’à un milliard.");
  }
  if (typeof from !== "string" || typeof to !== "string" ||
      !Object.hasOwn(rates, from) || !Object.hasOwn(rates, to)) {
    throw new HttpError(400, "Choisis EUR, USD ou MGA.");
  }
  const converted = Number((amount / rates[from] * rates[to]).toFixed(2));
  res.json({ amount, from, to, converted, source: "Taux fictifs pour l’exercice" });
});

finish(app);
start(app);
`,
      "public/index.html": nodePage(
        "Convertisseur de devises",
        `<p>Teste l’API avec des taux fictifs pour l’exercice.</p>
<form id="conversion" class="card">
  <label>Montant <input name="amount" type="number" min="0" max="1000000000" step="0.01" required></label>
  <label>Devise de départ <select name="from"><option>EUR</option><option>USD</option><option>MGA</option></select></label>
  <label>Devise cible <select name="to"><option>MGA</option><option>EUR</option><option>USD</option></select></label>
  <button>Convertir</button>
</form>
<p id="result" role="status"></p>`,
        ["/conversion.js"],
      ),
      "public/conversion.js": `const form = document.querySelector("#conversion");
const output = document.querySelector("#result");
form.addEventListener("submit", async event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  try {
    const response = await fetch("/api/convert", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, amount: Number(data.amount) }),
    });
    const result = await response.json();
    output.textContent = response.ok ? result.converted + " " + result.to + " · " + result.source : result.message;
  } catch {
    output.textContent = "Le serveur ne répond pas.";
  }
});
`,
    },
    notes: `\`\`\`powershell
Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/convert' -Method Post -ContentType 'application/json' -Body '{"amount":10,"from":"EUR","to":"MGA"}'
\`\`\`
`,
  }),
};

export const nodeBeginnerProjects = [tasks, currencies];

const shoes: WebProject = {
  id: "magasin-chaussures",
  title: "L’API du magasin de chaussures",
  description:
    "Enregistre des chaussures dans MongoDB, modifie les articles et filtre la collection par marque et pointure.",
  minutes: 75,
  requirements: [
    "Créer et modifier un article avec son code SKU.",
    "Combiner les filtres marque et pointure.",
    "Retrouver les articles après avoir redémarré Express et traiter un SKU en double.",
  ],
  hints: [
    "Démarre MongoDB avant npm start.",
    "L’index unique impose un seul document par SKU. Le middleware traduit une collision en 409.",
  ],
  files: nodeFiles("Magasin de chaussures", {
    database: "atelier_chaussures",
    home: `<p>Chaque article est enregistré dans MongoDB avec une marque, une pointure, un prix en centimes et un stock.</p>
<ul class="card"><li><a href="/api/shoes">GET /api/shoes</a></li><li>GET /api/shoes?brand=Kibo&amp;size=42</li><li>POST /api/shoes</li><li>PUT /api/shoes/:id</li></ul>
<p>Les requêtes de création et de mise à jour sont dans README.md.</p>`,
    sources: {
      "models/Shoe.js": `const { Schema, model } = require("mongoose");

const shoeSchema = new Schema({
  sku: { type: String, required: true, unique: true, trim: true, uppercase: true, maxlength: 40 },
  brand: { type: String, required: true, trim: true, maxlength: 70 },
  size: { type: Number, required: true, min: 20, max: 60 },
  priceCents: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
}, { timestamps: true, versionKey: false });

module.exports = model("Shoe", shoeSchema);
`,
      "index.js": `const Joi = require("joi");
const { createApp, finish, start, HttpError } = require("./server");
const { check, id } = require("./validation");
const Shoe = require("./models/Shoe");
const app = createApp();

const brand = Joi.string().trim().max(70);
const size = Joi.number().integer().min(20).max(60);
const filters = Joi.object({ brand, size }).required();
const body = Joi.object({
  sku: Joi.string().trim().uppercase().pattern(/^[A-Z0-9-]{1,40}$/).required(),
  brand: brand.required(),
  size: size.required(),
  priceCents: Joi.number().integer().min(0).max(100000000).required(),
  stock: Joi.number().integer().min(0).max(10000).required(),
}).required();

app.get("/api/shoes", async (req, res) => {
  const criteria = check(filters, req.query);
  const shoes = await Shoe.find(criteria).sort({ sku: 1 }).limit(100).lean();
  res.json(shoes);
});

app.post("/api/shoes", async (req, res) => {
  const shoe = await Shoe.create(check(body, req.body));
  res.location("/api/shoes/" + shoe.id).status(201).json(shoe);
});

app.get("/api/shoes/:id", async (req, res) => {
  const shoe = await Shoe.findById(check(id, req.params.id)).lean();
  if (!shoe) throw new HttpError(404, "Chaussure introuvable.");
  res.json(shoe);
});

app.put("/api/shoes/:id", async (req, res) => {
  const shoe = await Shoe.findByIdAndUpdate(check(id, req.params.id), check(body, req.body),
    { new: true, runValidators: true });
  if (!shoe) throw new HttpError(404, "Chaussure introuvable.");
  res.json(shoe);
});

app.delete("/api/shoes/:id", async (req, res) => {
  const shoe = await Shoe.findByIdAndDelete(check(id, req.params.id));
  if (!shoe) throw new HttpError(404, "Chaussure introuvable.");
  res.sendStatus(204);
});

finish(app);
start(app);
`,
    },
    notes: `\`\`\`powershell
$base = 'http://127.0.0.1:3000/api/shoes'
$article = Invoke-RestMethod -Uri $base -Method Post -ContentType 'application/json' -Body '{"sku":"KIBO-42","brand":"Kibo","size":42,"priceCents":4500,"stock":5}'
Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/shoes?brand=Kibo&size=42'
Invoke-RestMethod -Uri "$base/$($article._id)" -Method Put -ContentType 'application/json' -Body '{"sku":"KIBO-42","brand":"Kibo","size":42,"priceCents":4500,"stock":7}'
\`\`\`
`,
  }),
};

const signup: WebProject = {
  id: "inscription-joi",
  title: "L’inscription validée avec Joi",
  description:
    "Teste un formulaire relié à l’API et vérifie que la base enregistre uniquement les comptes validés.",
  minutes: 70,
  requirements: [
    "Refuser un e-mail invalide et un mot de passe de moins de huit caractères.",
    "Afficher des messages pour les champs à corriger.",
    "Enregistrer un mot de passe haché et refuser l’e-mail déjà utilisé.",
  ],
  hints: [
    "La validation a lieu avant le hachage et l’écriture.",
    "Teste plusieurs champs invalides à la fois pour observer abortEarly: false.",
  ],
  files: nodeFiles("Inscription avec Joi", {
    database: "atelier_inscription",
    dependencies: { bcryptjs: "^3.0.0", "express-rate-limit": "^8.0.0" },
    sources: {
      "models/User.js": `const { Schema, model } = require("mongoose");

module.exports = model("User", new Schema({
  email: { type: String, trim: true, lowercase: true, required: true, unique: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true }));
`,
      "index.js": `const bcrypt = require("bcryptjs");
const { rateLimit } = require("express-rate-limit");
const { createApp, finish, start } = require("./server");
const { check, account } = require("./validation");
const User = require("./models/User");
const app = createApp();

const limit = rateLimit({
  windowMs: 10 * 60 * 1000, limit: 10,
  message: { message: "Réessaie dans quelques minutes." },
});

app.post("/api/register", limit, async (req, res) => {
  const data = check(account, req.body);
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await User.create({ email: data.email, passwordHash });
  res.status(201).json({ id: user.id, email: user.email });
});

finish(app);
start(app);
`,
      "public/index.html": nodePage(
        "Inscription avec Joi",
        `<p>Crée un compte de test et observe les réponses de validation du serveur.</p>
<form id="signup" class="card" novalidate>
  <label>E-mail <input name="email" type="email" autocomplete="email"></label>
  <label>Mot de passe <input name="password" type="password" autocomplete="new-password"></label>
  <button>S’inscrire</button>
</form>
<p id="status" role="status"></p>
<ul id="fields"></ul>`,
        ["/signup.js"],
      ),
      "public/signup.js": `const form = document.querySelector("#signup");
const status = document.querySelector("#status");
const fields = document.querySelector("#fields");

form.addEventListener("submit", async event => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  fields.replaceChildren();
  try {
    const response = await fetch("/api/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const result = await response.json();
    status.textContent = response.ok ? "Compte de test créé pour " + result.email : result.message;
    for (const issue of result.fields ?? []) {
      const item = document.createElement("li");
      item.textContent = issue.message;
      fields.append(item);
    }
    if (response.ok) form.reset();
  } catch {
    status.textContent = "Le serveur ne répond pas.";
  } finally {
    button.disabled = false;
  }
});
`,
    },
    notes:
      "Ouvre le formulaire depuis la page d’accueil. Utilise une adresse et un mot de passe fictifs. Le formulaire affiche les erreurs de Joi renvoyées par le serveur.",
  }),
};

export const nodeIntermediateProjects = [shoes, signup];
