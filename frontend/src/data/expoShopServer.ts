export const expoShopServer = String.raw`const express = require('express');
const { rateLimit } = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { randomBytes, randomUUID, scrypt, timingSafeEqual } = require('node:crypto');
const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { promisify } = require('node:util');

const dataFolder = join(__dirname, 'data');
mkdirSync(dataFolder, { recursive: true, mode: 0o700 });

function signingKey() {
  if (process.env.JWT_SECRET) {
    if (Buffer.byteLength(process.env.JWT_SECRET) < 32) {
      throw new Error('JWT_SECRET doit contenir au moins 32 octets aléatoires.');
    }
    return process.env.JWT_SECRET;
  }
  const file = join(dataFolder, 'jwt-secret');
  try {
    writeFileSync(file, randomBytes(48).toString('hex'), { flag: 'wx', mode: 0o600 });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
  return readFileSync(file, 'utf8');
}

const secret = signingKey();
const db = new DatabaseSync(join(dataFolder, 'boutique.sqlite'));
db.exec([
  'PRAGMA foreign_keys = ON;',
  'PRAGMA journal_mode = WAL;',
  'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL);',
  'CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);',
  'CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),',
  'request_id TEXT NOT NULL, created_at TEXT NOT NULL, total INTEGER NOT NULL, items TEXT NOT NULL, UNIQUE(user_id, request_id));',
].join('\n'));

const products = [
  { id: 1, name: 'Carnet', price: 6000 },
  { id: 2, name: 'Sac en toile', price: 18000 },
  { id: 3, name: 'Gourde', price: 24000 },
];
const findProduct = new Map(products.map((item) => [item.id, item]));

const issueOptions = { algorithm: 'HS256', issuer: 'devafrica-atelier', audience: 'devafrica-expo' };
const lifetime = 3600;
const derive = promisify(scrypt);
const scryptOptions = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const dummySalt = randomBytes(16).toString('hex');

function parseCredentials(body) {
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = body?.password;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== 'string' || password.length < 12 || Buffer.byteLength(password) > 128) return null;
  return { email, password };
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await derive(password, salt, 64, scryptOptions);
  return salt + ':' + hash.toString('hex');
}

async function validPassword(password, stored) {
  const [salt, hex] = stored ? stored.split(':') : [dummySalt, '0'.repeat(128)];
  const candidate = await derive(password, salt, 64, scryptOptions);
  return timingSafeEqual(candidate, Buffer.from(hex, 'hex')) && Boolean(stored);
}

function newSession(user) {
  const now = Math.floor(Date.now() / 1000);
  const id = randomUUID();
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(id, user.id, now + lifetime);
  const token = jwt.sign({}, secret, {
    ...issueOptions, subject: String(user.id), jwtid: id, expiresIn: lifetime,
  });
  return { token, email: user.email };
}

function authenticated(req, res, next) {
  const authorization = req.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Connecte-toi pour continuer.' });
  }
  let payload;
  try {
    payload = jwt.verify(authorization.slice(7), secret, {
      algorithms: ['HS256'], issuer: issueOptions.issuer, audience: issueOptions.audience,
    });
  } catch {
    return res.status(401).json({ message: 'Session expirée ou invalide.' });
  }
  if (!payload || typeof payload !== 'object' || typeof payload.jti !== 'string' ||
      typeof payload.sub !== 'string' || typeof payload.exp !== 'number') {
    return res.status(401).json({ message: 'Session invalide.' });
  }
  const user = db.prepare(
    'SELECT users.id, users.email FROM sessions JOIN users ON users.id = sessions.user_id ' +
    'WHERE sessions.id = ? AND sessions.user_id = ? AND sessions.expires_at > ?',
  ).get(payload.jti, payload.sub, Math.floor(Date.now() / 1000));
  if (!user) return res.status(401).json({ message: 'Session terminée.' });
  req.session = { id: payload.jti, user };
  next();
}

function cleanOrder(body) {
  if (typeof body?.requestId !== 'string' || !/^[a-f0-9-]{36}$/i.test(body.requestId) ||
      !Array.isArray(body?.items) || body.items.length === 0 || body.items.length > products.length) return null;
  const seen = new Set();
  const items = [];
  for (const item of body.items) {
    const product = findProduct.get(item?.id);
    if (!product || seen.has(product.id) || !Number.isInteger(item.quantity) ||
        item.quantity < 1 || item.quantity > 20) return null;
    seen.add(product.id);
    items.push({ ...product, quantity: item.quantity });
  }
  items.sort((a, b) => a.id - b.id);
  return { requestId: body.requestId, items, total: items.reduce((sum, item) => sum + item.price * item.quantity, 0) };
}

function orderJson(row) {
  return { id: row.id, date: row.created_at, total: row.total, items: JSON.parse(row.items) };
}

const api = express();
api.disable('x-powered-by');
api.use(express.json({ limit: '12kb' }));
api.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });

const authLimit = rateLimit({
  windowMs: 10 * 60_000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false,
  message: { message: 'Trop de tentatives. Réessaie plus tard.' },
});

api.get('/health', (_req, res) => res.json({ status: 'ok' }));
api.get('/products', (_req, res) => res.json(products));

api.post('/register', authLimit, async (req, res) => {
  const data = parseCredentials(req.body);
  if (!data) return res.status(400).json({ message: 'Vérifie le courriel et utilise au moins 12 caractères.' });
  const password = await hashPassword(data.password);
  const result = db.prepare(
    'INSERT INTO users (email, password) VALUES (?, ?) ON CONFLICT(email) DO NOTHING',
  ).run(data.email, password);
  if (!result.changes) return res.status(409).json({ message: 'Adresse déjà utilisée.' });
  return res.status(201).json(newSession({ id: Number(result.lastInsertRowid), email: data.email }));
});

api.post('/login', authLimit, async (req, res) => {
  const data = parseCredentials(req.body);
  if (!data) return res.status(400).json({ message: 'Vérifie les champs saisis.' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(data.email);
  if (!await validPassword(data.password, user?.password)) {
    return res.status(401).json({ message: 'Courriel ou mot de passe incorrect.' });
  }
  return res.json(newSession(user));
});

api.get('/session', authenticated, (req, res) => res.json({ email: req.session.user.email }));
api.delete('/session', authenticated, (req, res) => {
  db.prepare('DELETE FROM sessions WHERE id = ?').run(req.session.id);
  res.sendStatus(204);
});

api.get('/orders', authenticated, (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT 50',
  ).all(req.session.user.id);
  res.json(rows.map(orderJson));
});

api.post('/orders', authenticated, (req, res) => {
  const order = cleanOrder(req.body);
  if (!order) return res.status(400).json({ message: 'Vérifie les articles et leurs quantités.' });

  const owner = req.session.user.id;
  const items = JSON.stringify(order.items);
  const inserted = db.prepare(
    'INSERT INTO orders (id, user_id, request_id, created_at, total, items) VALUES (?, ?, ?, ?, ?, ?) ' +
    'ON CONFLICT(user_id, request_id) DO NOTHING',
  ).run(randomUUID(), owner, order.requestId, new Date().toISOString(), order.total, items);
  const saved = db.prepare('SELECT * FROM orders WHERE user_id = ? AND request_id = ?').get(owner, order.requestId);
  if (saved.items !== items) {
    return res.status(409).json({ message: 'Cette commande a déjà été envoyée avec un autre panier.' });
  }
  return res.status(inserted.changes ? 201 : 200).json(orderJson(saved));
});

api.use((error, _req, res, _next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'JSON invalide.' });
  if (error.type === 'entity.too.large') return res.status(413).json({ message: 'Requête trop grande.' });
  console.error('Erreur interne de l’atelier.', error.code || error.name);
  return res.status(500).json({ message: 'Erreur interne. Réessaie.' });
});

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
api.listen(port, host, () => console.log('API DevAfrica sur http://' + host + ':' + port));
`;
