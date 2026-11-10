export const nodeAuthScripts = {
  setup: "node scripts/setup.js",
  admin: "node scripts/promote.js",
};

export const nodeAuthSources = {
  "models/User.js": `const { Schema, model } = require("mongoose");

module.exports = model("User", new Schema({
  email: { type: String, trim: true, lowercase: true, required: true, unique: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer", required: true },
}, { timestamps: true }));
`,
  "middlewares/auth.js": `const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { HttpError } = require("../server");

const secret = process.env.JWT_SECRET;
if (!secret || Buffer.byteLength(secret) < 32) {
  throw new Error("JWT_SECRET doit contenir au moins 32 octets. Lance npm run setup.");
}
const issuer = "devafrica-atelier";
const audience = "devafrica-api";

function issueToken(userId) {
  return jwt.sign({}, secret, {
    algorithm: "HS256", issuer, audience, subject: userId, expiresIn: "30m",
  });
}

async function readIdentity(token) {
  let claims;
  try {
    claims = jwt.verify(token, secret, { algorithms: ["HS256"], issuer, audience });
  } catch {
    throw new HttpError(401, "Jeton absent, expiré ou invalide.");
  }
  if (typeof claims?.sub !== "string" || !/^[0-9a-f]{24}$/i.test(claims.sub) ||
      !Number.isFinite(claims.exp)) {
    throw new HttpError(401, "Jeton invalide.");
  }
  const user = await User.findById(claims.sub).select("email role");
  if (!user) throw new HttpError(401, "Compte introuvable.");
  return { id: user.id, email: user.email, role: user.role, expiresAt: claims.exp * 1000 };
}

async function authenticate(req, res, next) {
  const match = /^Bearer (\\S+)$/i.exec(req.get("authorization") ?? "");
  if (!match) throw new HttpError(401, "Envoie un jeton Bearer.");
  req.identity = await readIdentity(match[1]);
  next();
}

function adminOnly(req, res, next) {
  if (req.identity.role !== "admin") throw new HttpError(403, "Cette action est réservée aux administrateurs.");
  next();
}

module.exports = { issueToken, readIdentity, authenticate, adminOnly };
`,
  "controllers/auth.js": `const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { HttpError } = require("../server");
const { account, check } = require("../validation");
const { issueToken } = require("../middlewares/auth");

async function register(req, res) {
  const data = check(account, req.body);
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await User.create({ email: data.email, passwordHash });
  res.status(201).json({ token: issueToken(user.id) });
}

async function login(req, res) {
  const data = check(account, req.body);
  const user = await User.findOne({ email: data.email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    throw new HttpError(401, "Identifiants incorrects.");
  }
  res.json({ token: issueToken(user.id) });
}

module.exports = { register, login };
`,
  "routes/auth.js": `const { Router } = require("express");
const { rateLimit } = require("express-rate-limit");
const controller = require("../controllers/auth");

const router = Router();
const limit = rateLimit({
  windowMs: 10 * 60 * 1000, limit: 12,
  message: { message: "Réessaie dans quelques minutes." },
});
router.post("/register", limit, controller.register);
router.post("/login", limit, controller.login);
module.exports = router;
`,
  "scripts/setup.js": `const { readFileSync, writeFileSync } = require("node:fs");
const { randomBytes } = require("node:crypto");

const example = readFileSync(".env.example", "utf8");
const contents = example.replace("JWT_SECRET=", "JWT_SECRET=" + randomBytes(32).toString("hex"));
try {
  writeFileSync(".env", contents, { flag: "wx", mode: 0o600 });
  console.log("Configuration locale créée.");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log("Configuration locale déjà présente.");
}
`,
  "scripts/promote.js": `const mongoose = require("mongoose");
const { connect } = require("../server");
const User = require("../models/User");

async function run() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Utilisation : npm run admin -- membre@example.test");
  try {
    await connect();
    const user = await User.findOneAndUpdate({ email }, { role: "admin" });
    if (!user) throw new Error("Crée d’abord le compte de test via l’API.");
    console.log("Rôle administrateur attribué.");
  } finally {
    await mongoose.disconnect();
  }
}

run().catch(error => { console.error(error.message); process.exitCode = 1; });
`,
  "ecosystem.config.cjs": `module.exports = {
  apps: [{ name: "atelier-express", script: "index.js", instances: 1, autorestart: true,
    env: { NODE_ENV: "production" } }],
};
`,
};

export const nodeProductionNotes = `
## Préparer le déploiement

Configure NODE_ENV=production, MONGODB_URI et JWT_SECRET dans l’environnement du service.
Place l’application derrière HTTPS et choisis HOST et PORT selon ton hébergement.
CLIENT_ORIGIN sert si un client web utilise une autre origine. Configure le nombre de
proxies de confiance selon le déploiement avant d’utiliser leurs adresses pour le rate limit.
Sur un VPS, PM2 peut superviser le processus avec pm2 start ecosystem.config.cjs.
Un hébergement géré peut lancer npm start et superviser le processus lui-même.
`;
