import { nodeLaunchCommands } from "../lib/localStudio";
import type { WebFiles } from "./webCourseTypes";

const css = `* { box-sizing: border-box; }
body { margin: 0; padding: clamp(1rem, 5vw, 3rem); background: #eef5fb; color: #173850; font: 1rem/1.55 system-ui, sans-serif; }
main { max-width: 52rem; margin: auto; }
h1, h2 { line-height: 1.2; }
a { color: #14558d; }
code { overflow-wrap: anywhere; }
label { display: grid; gap: .3rem; margin-block: .65rem; }
button, input, select { font: inherit; }
button { background: #1b609a; color: white; border: 0; border-radius: .6rem; padding: .5rem .9rem; cursor: pointer; }
button:disabled { opacity: .6; cursor: wait; }
input, select { max-width: 100%; padding: .5rem; border: 1px solid #9cb5cb; border-radius: .45rem; }
.card { background: white; border: 1px solid #c8daea; border-radius: .9rem; margin-block: .8rem; padding: 1rem; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; }
.messages { min-height: 8rem; max-height: 19rem; overflow: auto; }
.messages li { overflow-wrap: anywhere; margin-block: .35rem; }
[hidden] { display: none !important; }
:focus-visible { outline: 3px solid #48a3ed; outline-offset: 3px; }
`;

export function nodePage(title: string, body: string, scripts: string[] = []) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="/atelier.css">
</head>
<body>
  <main>
    <p>DEVAFRICA · ATELIER EXPRESS</p>
    <h1>${title}</h1>
    ${body}
  </main>
${scripts.map((src) => `  <script src="${src}" defer></script>`).join("\n")}
</body>
</html>
`;
}

type NodeOptions = {
  entry?: string;
  sources: Record<string, string>;
  home?: string;
  database?: string;
  secure?: boolean;
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  notes?: string;
};

function serverCode(database: string | undefined, secure: boolean) {
  return `const express = require("express");
const { createServer } = require("node:http");
const path = require("node:path");
${
  database
    ? `const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({ quiet: true });
`
    : ""
}${secure ? 'const helmet = require("helmet");\n' : ""}
class HttpError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

function createApp() {
  const app = express();
  app.disable("x-powered-by");
${
  secure
    ? `  app.use(helmet(process.env.NODE_ENV === "production" ? {} : {
    contentSecurityPolicy: { directives: { upgradeInsecureRequests: null } },
  }));
`
    : ""
}${
    database
      ? `  app.use(cors({ origin: process.env.CLIENT_ORIGIN || false }));
  app.use(morgan("tiny", { skip: () => process.env.NODE_ENV === "test" }));
`
      : ""
  }  app.use(express.json({ limit: "16kb" }));
  app.use(express.static(path.join(__dirname, "public")));
  return app;
}

function finish(app) {
  app.use((req, res, next) => next(new HttpError(404, "Route introuvable.")));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof HttpError) {
      return res.status(error.status).json({ message: error.message, fields: error.fields });
    }
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({ message: "Le corps JSON est invalide." });
    }
    if (error.type === "entity.too.large") {
      return res.status(413).json({ message: "Le corps de la requête est trop volumineux." });
    }
${
  database
    ? `    if (error.code === 11000) {
      return res.status(409).json({ message: "Cette valeur existe déjà." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Les données ne respectent pas le modèle." });
    }
`
    : ""
}    console.error("Erreur serveur", error.name);
    return res.status(500).json({ message: "Une erreur serveur est survenue." });
  });
}

${
  database
    ? `async function connect() {
  const uri = process.env.MONGODB_URI ||
    (process.env.NODE_ENV !== "production" ? "mongodb://127.0.0.1:27017/${database}" : "");
  if (!uri) throw new Error("Renseigne MONGODB_URI dans l’environnement.");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  await Promise.all(Object.values(mongoose.models).map(model => model.init()));
}

`
    : ""
}async function start(target) {
  try {
${database ? "    await connect();\n" : ""}    const port = Number(process.env.PORT || 3000);
    const host = process.env.HOST || "127.0.0.1";
    const server = typeof target === "function" ? createServer(target) : target;
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, host, () => {
        server.off("error", reject);
        resolve();
      });
    });
    console.log("Atelier en cours sur http://" + host + ":" + port);
  } catch (error) {
    console.error("Démarrage impossible.", error.code || error.name);
${database ? "    await mongoose.disconnect();\n" : ""}    process.exitCode = 1;
  }
}

module.exports = { createApp, finish, start, HttpError${database ? ", connect" : ""} };
`;
}

export const nodeValidation = `const Joi = require("joi");
const { HttpError } = require("./server");

function check(schema, input) {
  const { value, error } = schema.validate(input, { abortEarly: false });
  if (!error) return value;
  const fields = error.details.map(item => ({ field: item.path.join("."), message: item.message }));
  throw new HttpError(400, "Corrige les champs indiqués.", fields);
}

const account = Joi.object({
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).max(254).required()
    .messages({ "string.email": "Saisis une adresse e-mail valide.", "any.required": "L’adresse e-mail est requise." }),
  password: Joi.string().min(8).max(72).custom((value, helpers) =>
    Buffer.byteLength(value, "utf8") <= 72 ? value : helpers.error("any.invalid")
  ).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
    "any.invalid": "Le mot de passe dépasse 72 octets.",
    "any.required": "Le mot de passe est requis.",
  }),
}).required();

const id = Joi.string().hex().length(24).required();
module.exports = { check, account, id };
`;

export function nodeFiles(title: string, options: NodeOptions): WebFiles {
  const { sources, database, secure = false, notes } = options;
  return {
    html: "",
    css: "",
    entry: options.entry ?? "index.js",
    local: {
      runtime: "node",
      sources: {
        "package.json": JSON.stringify(
          {
            name: "devafrica-atelier-express",
            version: "1.0.0",
            private: true,
            type: "commonjs",
            engines: { node: ">=24" },
            scripts: {
              start: "node index.js",
              dev: "node --watch index.js",
              ...options.scripts,
            },
            dependencies: {
              express: "^5.1.0",
              ...(database
                ? {
                    mongoose: "^9.0.0",
                    joi: "^18.0.0",
                    dotenv: "^17.0.0",
                    cors: "^2.8.5",
                    morgan: "^1.10.0",
                  }
                : {}),
              ...(secure
                ? {
                    helmet: "^8.0.0",
                    bcryptjs: "^3.0.0",
                    jsonwebtoken: "^9.0.2",
                    "express-rate-limit": "^8.0.0",
                  }
                : {}),
              ...options.dependencies,
            },
          },
          null,
          2,
        ),
        "server.js": serverCode(database, secure),
        "public/atelier.css": css,
        "public/index.html": nodePage(
          title,
          options.home ?? "<p>L’atelier Express est en cours.</p>",
        ),
        ".gitignore": "node_modules/\n.env\n",
        ...(database
          ? {
              "validation.js": nodeValidation,
              ".env.example": `PORT=3000
HOST=127.0.0.1
MONGODB_URI=mongodb://127.0.0.1:27017/${database}
CLIENT_ORIGIN=
${secure ? "JWT_SECRET=\n" : ""}`,
            }
          : {}),
        "README.md": `# ${title}

Installe Node.js 24 et ouvre le dossier qui contient package.json dans VS Code.
${database ? "Démarre MongoDB Community sur le port 27017, ou renseigne l’URI de ta base dans MONGODB_URI. Tu peux utiliser un fichier .env à partir de .env.example.\n" : ""}

\`\`\`powershell
${nodeLaunchCommands}
\`\`\`

Ouvre http://127.0.0.1:3000/. Les exemples de requêtes se lancent dans un second terminal. Arrête le serveur avec Ctrl+C. npm run dev relance Node.js à chaque modification.
${secure ? "\nLe script setup crée .env s’il manque et génère une clé de signature. Si tu as déjà créé .env, renseigne JWT_SECRET avec une valeur secrète d’au moins 32 octets. Ne partage pas .env.\n" : ""}
${notes ?? ""}`,
        ...sources,
      },
    },
  };
}
