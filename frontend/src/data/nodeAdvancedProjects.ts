import { nodeFiles, nodePage } from "./nodeAuthoring";
import {
  nodeAuthScripts,
  nodeAuthSources,
  nodeProductionNotes,
} from "./nodeAuth";
import type { WebProject } from "./webCourseTypes";

const shop: WebProject = {
  id: "commandes-express-jwt",
  title: "L’API e-commerce sécurisée",
  description:
    "Organise le catalogue, les comptes et les commandes en MVC, avec des droits selon le rôle.",
  minutes: 105,
  requirements: [
    "Lister le catalogue publiquement et réserver ses modifications à un administrateur.",
    "Créer une commande authentifiée avec un prix figé dans la commande.",
    "Retrouver uniquement les commandes du compte connecté et reconnaître une requête rejouée.",
  ],
  hints: [
    "Le README contient les requêtes PowerShell et la commande pour attribuer le rôle de test.",
    "L’identité vient du jeton. Le rôle courant vient de MongoDB.",
    "Réutilise le même requestId pour simuler un nouvel essai de la même commande.",
  ],
  files: nodeFiles("Commandes Express avec JWT", {
    database: "atelier_commandes",
    secure: true,
    scripts: nodeAuthScripts,
    entry: "routes/shop.js",
    home: `<p>Le catalogue est lisible par tous. Les clients connectés créent leurs commandes. Le rôle admin gère les produits.</p>
<ul class="card"><li><a href="/api/products">GET /api/products</a></li><li>POST /api/auth/register et /api/auth/login</li><li>POST, PUT et DELETE sur les produits avec le rôle admin</li><li>POST /api/orders et GET /api/orders avec un jeton</li></ul>
<p>Le README.md donne les commandes de test.</p>`,
    sources: {
      ...nodeAuthSources,
      "index.js": `const { createApp, finish, start } = require("./server");
const app = createApp();

app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/shop"));

finish(app);
start(app);
`,
      "models/Product.js": `const { Schema, model } = require("mongoose");

module.exports = model("Product", new Schema({
  name: { type: String, trim: true, required: true, maxlength: 120 },
  priceCents: { type: Number, min: 1, required: true },
}, { timestamps: true, versionKey: false }));
`,
      "models/Order.js": `const { Schema, model } = require("mongoose");

const order = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  requestId: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, required: true },
  productName: { type: String, required: true },
  unitPriceCents: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalCents: { type: Number, required: true },
}, { timestamps: true, versionKey: false });
order.index({ owner: 1, requestId: 1 }, { unique: true });
module.exports = model("Order", order);
`,
      "routes/shop.js": `const { Router } = require("express");
const { authenticate, adminOnly } = require("../middlewares/auth");
const shop = require("../controllers/shop");

const router = Router();
router.get("/products", shop.list);
router.post("/products", authenticate, adminOnly, shop.createProduct);
router.put("/products/:id", authenticate, adminOnly, shop.updateProduct);
router.delete("/products/:id", authenticate, adminOnly, shop.deleteProduct);
router.get("/orders", authenticate, shop.history);
router.post("/orders", authenticate, shop.order);
module.exports = router;
`,
      "controllers/shop.js": `const Joi = require("joi");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { check, id } = require("../validation");
const { HttpError } = require("../server");

const productInput = Joi.object({
  name: Joi.string().trim().min(1).max(120).required(),
  priceCents: Joi.number().integer().min(1).max(100000000).required(),
}).required();
const orderInput = Joi.object({
  productId: id,
  quantity: Joi.number().integer().min(1).max(100).required(),
  requestId: Joi.string().guid({ version: ["uuidv4"] }).required(),
}).required();

async function list(req, res) {
  res.json(await Product.find().sort({ name: 1 }).limit(100).lean());
}

async function createProduct(req, res) {
  res.status(201).json(await Product.create(check(productInput, req.body)));
}

async function updateProduct(req, res) {
  const product = await Product.findByIdAndUpdate(check(id, req.params.id), check(productInput, req.body),
    { new: true, runValidators: true });
  if (!product) throw new HttpError(404, "Produit introuvable.");
  res.json(product);
}

async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(check(id, req.params.id));
  if (!product) throw new HttpError(404, "Produit introuvable.");
  res.sendStatus(204);
}

async function history(req, res) {
  res.json(await Order.find({ owner: req.identity.id }).sort({ createdAt: -1 }).limit(100).lean());
}

function replay(res, previous, input) {
  if (String(previous.productId) !== input.productId || previous.quantity !== input.quantity) {
    throw new HttpError(409, "Cet identifiant de requête appartient à une autre commande.");
  }
  return res.json(previous);
}

async function order(req, res) {
  const input = check(orderInput, req.body);
  input.productId = input.productId.toLowerCase();
  const key = { owner: req.identity.id, requestId: input.requestId };
  const previous = await Order.findOne(key);
  if (previous) return replay(res, previous, input);
  const product = await Product.findById(input.productId);
  if (!product) throw new HttpError(404, "Produit introuvable.");
  try {
    const saved = await Order.create({
      ...key, productId: product.id, productName: product.name,
      quantity: input.quantity, unitPriceCents: product.priceCents,
      totalCents: input.quantity * product.priceCents,
    });
    return res.status(201).json(saved);
  } catch (error) {
    if (error.code !== 11000) throw error;
    const existing = await Order.findOne(key);
    if (!existing) throw error;
    return replay(res, existing, input);
  }
}

module.exports = { list, createProduct, updateProduct, deleteProduct, history, order };
`,
    },
    notes: `## Essayer les permissions

Inscris un administrateur et un client de test dans le deuxième terminal.

\`\`\`powershell
$base = 'http://127.0.0.1:3000/api'
$adminCompte = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -ContentType 'application/json' -Body '{"email":"admin@example.test","password":"DevAfrica-Local-42"}'
$clientCompte = Invoke-RestMethod -Uri "$base/auth/register" -Method Post -ContentType 'application/json' -Body '{"email":"alice@example.test","password":"DevAfrica-Local-42"}'
npm run admin -- admin@example.test
$admin = @{Authorization = "Bearer $($adminCompte.token)"}
$client = @{Authorization = "Bearer $($clientCompte.token)"}
$product = Invoke-RestMethod -Uri "$base/products" -Method Post -Headers $admin -ContentType 'application/json' -Body '{"name":"Carnet","priceCents":1250}'
$body = @{productId=$product._id; quantity=2; requestId=[guid]::NewGuid().ToString()} | ConvertTo-Json -Compress
Invoke-RestMethod -Uri "$base/orders" -Method Post -Headers $client -ContentType 'application/json' -Body $body
Invoke-RestMethod -Uri "$base/orders" -Headers $client
\`\`\`

Si les comptes existent déjà, utilise /api/auth/login. L’identifiant requestId
permet de rejouer la même commande en retrouvant le résultat précédent.
${nodeProductionNotes}`,
  }),
};

const chat: WebProject = {
  id: "chat-salons-socketio",
  title: "Le chat en temps réel avec salons",
  description:
    "Connecte deux clients authentifiés, garde les messages dans MongoDB et diffuse chaque message dans le bon salon.",
  minutes: 110,
  requirements: [
    "Créer deux comptes de test et rejoindre un salon.",
    "Envoyer un message qui s’affiche dans les deux onglets de ce salon.",
    "Retrouver l’historique après reconnexion et vérifier l’isolement entre salons.",
  ],
  hints: [
    "Utilise deux onglets et deux adresses fictives.",
    "Le serveur valide le message, l’enregistre, puis le diffuse.",
    "Le jeton est transmis au moment de la connexion Socket.IO.",
  ],
  files: nodeFiles("Salons DevAfrica", {
    database: "atelier_chat",
    secure: true,
    dependencies: { "socket.io": "^4.8.0" },
    scripts: { setup: nodeAuthScripts.setup },
    entry: "chat.js",
    sources: {
      ...Object.fromEntries(
        Object.entries(nodeAuthSources).filter(
          ([name]) => name !== "scripts/promote.js",
        ),
      ),
      "index.js": `const { createServer } = require("node:http");
const { createApp, finish, start } = require("./server");
const { attachChat } = require("./chat");

const app = createApp();
app.use("/api/auth", require("./routes/auth"));
finish(app);
const server = createServer(app);
attachChat(server);
start(server);
`,
      "models/Message.js": `const { Schema, model } = require("mongoose");

const schema = new Schema({
  room: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  label: { type: String, required: true },
  text: { type: String, required: true, maxlength: 500 },
}, { timestamps: true });
schema.index({ room: 1, createdAt: -1, _id: -1 });
module.exports = model("Message", schema);
`,
      "chat.js": `const { Server } = require("socket.io");
const Joi = require("joi");
const Message = require("./models/Message");
const { readIdentity } = require("./middlewares/auth");
const { check } = require("./validation");

const rooms = ["general", "entraide", "projets"];
const content = Joi.object({
  room: Joi.string().valid(...rooms).required(),
  text: Joi.string().trim().min(1).max(500).required(),
}).required();

function publicMessage(message) {
  return { id: String(message._id), room: message.room, label: message.label,
    text: message.text, date: message.createdAt.toISOString() };
}

function attachChat(server) {
  const io = new Server(server, { maxHttpBufferSize: 16000 });
  io.use(async (socket, next) => {
    try {
      socket.data.identity = await readIdentity(socket.handshake.auth?.token);
      next();
    } catch {
      next(new Error("Connecte-toi avec un jeton valide."));
    }
  });

  io.on("connection", socket => {
    const identity = socket.data.identity;
    const expiry = setTimeout(() => socket.disconnect(true), Math.max(0, identity.expiresAt - Date.now()));
    let windowStart = Date.now();
    let sends = 0;
    socket.on("disconnect", () => clearTimeout(expiry));

    socket.on("room:join", async (room, reply) => {
      if (typeof reply !== "function") return;
      if (!rooms.includes(room)) return reply({ error: "Salon inconnu." });
      try {
        for (const joined of socket.rooms) if (joined !== socket.id) await socket.leave(joined);
        await socket.join(room);
        const history = await Message.find({ room }).sort({ createdAt: -1, _id: -1 }).limit(50);
        reply({ history: history.reverse().map(publicMessage) });
      } catch {
        reply({ error: "Impossible de charger le salon." });
      }
    });

    socket.on("message:send", async (payload, reply) => {
      if (typeof reply !== "function") return;
      if (Date.now() >= identity.expiresAt) return reply({ error: "Session expirée." });
      if (Date.now() - windowStart >= 5000) { windowStart = Date.now(); sends = 0; }
      if (++sends > 8) return reply({ error: "Attends quelques secondes." });
      let input;
      try {
        input = check(content, payload);
      } catch {
        return reply({ error: "Envoie un texte de 1 à 500 caractères." });
      }
      if (!socket.rooms.has(input.room)) return reply({ error: "Rejoins d’abord ce salon." });
      try {
        const message = await Message.create({
          ...input, author: identity.id, label: identity.email.split("@")[0],
        });
        io.to(input.room).emit("message:new", publicMessage(message));
        reply({ ok: true });
      } catch {
        reply({ error: "Le message n’a pas pu être enregistré." });
      }
    });
  });
}

module.exports = { attachChat };
`,
      "public/index.html": nodePage(
        "Salons DevAfrica",
        `<p>Ouvre deux onglets et utilise des comptes fictifs pour essayer un salon commun.</p>
<form id="auth" class="card">
  <label>E-mail <input name="email" type="email" required autocomplete="email"></label>
  <label>Mot de passe <input name="password" type="password" required minlength="8"></label>
  <div class="actions"><button value="login">Se connecter</button><button value="register">Créer un compte</button></div>
</form>
<p id="status" role="status"></p>
<section class="card" id="chat" hidden>
  <label>Salon <select id="room"><option value="general">Général</option><option value="entraide">Entraide</option><option value="projets">Projets</option></select></label>
  <ul id="messages" class="messages" aria-label="Messages du salon"></ul>
  <form id="send">
    <label>Message <input name="text" maxlength="500" required></label>
    <button>Envoyer</button>
  </form>
</section>`,
        ["/socket.io/socket.io.js", "/client.js"],
      ),
      "public/client.js": `const auth = document.querySelector("#auth");
const chat = document.querySelector("#chat");
const status = document.querySelector("#status");
const room = document.querySelector("#room");
const messages = document.querySelector("#messages");
const send = document.querySelector("#send");
const items = new Map();
let socket;
let joinVersion = 0;

function render() {
  const ordered = [...items.values()].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  for (const item of ordered.slice(0, -100)) items.delete(item.id);
  messages.replaceChildren(...ordered.slice(-100).map(message => {
    const item = document.createElement("li");
    item.textContent = message.label + " · " + message.text;
    return item;
  }));
  messages.scrollTop = messages.scrollHeight;
}

function join() {
  const version = ++joinVersion;
  const target = room.value;
  items.clear();
  render();
  send.querySelector("button").disabled = true;
  socket.timeout(5000).emit("room:join", target, (error, response) => {
    if (version !== joinVersion) return;
    if (error || response?.error) {
      status.textContent = response?.error ?? "Le salon ne répond pas.";
      return;
    }
    for (const message of response.history) items.set(message.id, message);
    render();
    send.querySelector("button").disabled = false;
    status.textContent = "Salon connecté.";
  });
}

auth.addEventListener("submit", async event => {
  event.preventDefault();
  const action = event.submitter?.value ?? "login";
  auth.querySelectorAll("button").forEach(button => { button.disabled = true; });
  try {
    const response = await fetch("/api/auth/" + action, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(auth))),
    });
    const result = await response.json();
    if (!response.ok) { status.textContent = result.fields?.[0]?.message ?? result.message; return; }
    socket?.disconnect();
    socket = io({ auth: { token: result.token } });
    socket.on("connect", () => { chat.hidden = false; auth.hidden = true; join(); });
    socket.on("connect_error", error => { status.textContent = error.message; });
    socket.on("disconnect", () => { chat.hidden = true; auth.hidden = false; status.textContent = "Connexion interrompue. Tu peux te reconnecter."; });
    socket.on("message:new", message => {
      if (message.room !== room.value) return;
      items.set(message.id, message);
      render();
    });
    auth.reset();
  } catch {
    status.textContent = "Le serveur ne répond pas.";
  } finally {
    auth.querySelectorAll("button").forEach(button => { button.disabled = false; });
  }
});

room.addEventListener("change", join);
send.addEventListener("submit", event => {
  event.preventDefault();
  const button = send.querySelector("button");
  button.disabled = true;
  socket.timeout(5000).emit("message:send", { room: room.value, text: send.elements.text.value }, (error, response) => {
    button.disabled = false;
    status.textContent = response?.error ?? (error ? "Le serveur ne répond pas." : "Message envoyé.");
    if (response?.ok) send.reset();
  });
});
`,
    },
    notes: `Ouvre la page d’accueil dans deux onglets. Crée des comptes fictifs distincts,
rejoins le même salon, puis envoie un message. Bascule l’un des onglets dans
un autre salon. Reviens au premier pour relire les derniers messages.
${nodeProductionNotes}`,
  }),
};

export const nodeAdvancedProjects = [shop, chat];
