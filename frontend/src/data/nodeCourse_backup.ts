import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { nodeFiles } from "./nodeAuthoring";
import { nodeAdvancedProjects } from "./nodeAdvancedProjects";
import { nodeBeginnerProjects, nodeIntermediateProjects } from "./nodeProjects";
import type { WebLevel } from "./webCourseTypes";

const [tasks, conversion] = nodeBeginnerProjects;
const [shoes, signup] = nodeIntermediateProjects;
const [shop, chat] = nodeAdvancedProjects;
const express = "https://expressjs.com/en/";
const mongoose = "https://mongoosejs.com/docs/";
const firstServer = nodeFiles("Premier serveur Express", {
  home: '<p><a href="/bonjour">Voir la réponse du serveur</a></p>',
  sources: {
    "index.js": `const express = require("express");
const app = express();

app.get("/bonjour", (req, res) => {
  res.send("Serveur opérationnel !");
});

app.use(express.static("public"));
app.listen(3000, "127.0.0.1", error => {
  if (error) { console.error("Impossible d’écouter sur le port 3000.", error.code); process.exitCode = 1; return; }
  console.log("Serveur démarré sur http://127.0.0.1:3000/");
});
`,
  },
});

const beginner: WebLevel["chapters"] = [
  {
    id: "node-fondations",
    title: "Fondations de Node.js et npm",
    description:
      "Exécute du JavaScript dans le terminal et lis la structure d’un projet.",
    lessons: [
      lesson({
        id: "node-v8-callback",
        title: "Exécuter JavaScript et comprendre les callbacks",
        minutes: 16,
        summary:
          "Node.js exécute JavaScript hors du navigateur avec V8. Pour une opération d’entrée-sortie, une fonction de rappel peut recevoir le résultat plus tard.",
        sections: [
          section(
            "Suivre une lecture de fichier",
            "fs.readFile lance une lecture asynchrone. Node continue le code courant et appelle la fonction de rappel une fois le fichier lu.",
            [
              "Un callback est une fonction passée à une autre fonction.",
              "Dans cet exemple, le premier argument du callback représente l’erreur éventuelle.",
              "Une opération JavaScript longue et synchrone peut bloquer la boucle d’événements.",
            ],
          ),
        ],
        files: projectExample(tasks, "examples/callback.js"),
        task: "Dans le projet exporté, lance node examples/callback.js. Compare l’ordre des trois messages.",
        takeaway:
          "Le callback exécute le traitement du résultat quand l’entrée-sortie est prête.",
        quiz: quiz(
          "Quel message s’affiche en dernier ?",
          [
            "Le résultat de la lecture",
            "Le premier console.log",
            "Le lancement du programme",
          ],
          0,
          "Le callback s’exécute après le code synchrone courant.",
        ),
        link: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
      }),
      lesson({
        id: "npm-scripts",
        title: "Initialiser et lancer le projet avec npm",
        minutes: 17,
        summary:
          "npm gère les dépendances et les scripts du projet. package.json décrit le nom, les commandes et les bibliothèques.",
        sections: [
          section(
            "Créer le dossier et ses commandes",
            "Dans un dossier vide, npm init -y initialise package.json. npm install express installe Express et enregistre la dépendance.",
            [
              "node index.js exécute le fichier d’entrée. npm start lance la commande start du projet.",
              "npm run dev utilise ici node --watch. Nodemon fournit aussi un redémarrage automatique.",
              "package-lock.json fixe les versions résolues après l’installation.",
            ],
          ),
        ],
        files: { ...firstServer, entry: "package.json" },
        task: "Exporte le projet, installe les dépendances et lance npm start. Repère le script start dans package.json.",
        takeaway:
          "Le fichier package.json décrit comment installer et démarrer le projet.",
        quiz: quiz(
          "Que crée npm init -y dans un dossier vide ?",
          ["package.json", "Une route HTTP", "Une base MongoDB"],
          0,
          "npm init écrit les paramètres initiaux du projet.",
        ),
        link: "https://docs.npmjs.com/cli/commands/npm-init",
      }),
    ],
  },
  {
    id: "express-routes",
    title: "Express et routage de base",
    description:
      "Démarre un serveur et relie les méthodes HTTP à des traitements.",
    lessons: [
      lesson({
        id: "premier-serveur",
        title: "Écrire le premier serveur Express",
        minutes: 17,
        summary:
          "Express associe un chemin et une méthode HTTP à une fonction. Une route lit la requête req et construit la réponse res.",
        sections: [
          section(
            "Lire le code du serveur",
            "require('express') charge le paquet. express() crée l’application. app.get('/bonjour', ...) traite la lecture de cette URL.",
            [
              "res.send renvoie une réponse texte ou HTML. res.json sérialise une donnée JavaScript en JSON.",
              "app.listen démarre l’écoute sur un port. L’exemple écoute sur 127.0.0.1.",
              "Dans le navigateur, ajoute /bonjour à l’adresse du serveur.",
            ],
          ),
        ],
        files: firstServer,
        task: "Change le texte de /bonjour, relance le serveur et recharge l’URL.",
        takeaway: "Une route Express traite une requête et choisit sa réponse.",
        quiz: quiz(
          "Quel appel démarre l’écoute du serveur ?",
          ["app.listen", "res.send", "npm init"],
          0,
          "app.listen ouvre le port et accepte les requêtes HTTP.",
        ),
        link: express + "starter/hello-world.html",
      }),
      lesson({
        id: "verbes-express",
        title: "Créer un CRUD avec GET, POST, PUT et DELETE",
        minutes: 20,
        summary:
          "Le CRUD regroupe création, lecture, modification et suppression. Le même chemin peut répondre différemment selon le verbe HTTP.",
        sections: [
          section(
            "Associer chaque action à une route",
            "Le tableau tasks sert de stockage pendant l’exécution. La route POST crée un identifiant, PUT remplace une tâche et DELETE la retire.",
            [
              "GET /api/tasks renvoie la liste.",
              "Une création réussie répond 201. Une suppression sans contenu répond 204.",
              "Un identifiant absent produit 404.",
            ],
          ),
        ],
        files: tasks.files,
        task: "Exécute les requêtes du README. Vérifie le tableau avant et après la suppression.",
        takeaway:
          "La méthode et l’URL indiquent ensemble ce que le client demande.",
        quiz: quiz(
          "Quel verbe crée une tâche dans cet atelier ?",
          ["GET", "DELETE", "POST"],
          2,
          "POST soumet une nouvelle tâche à la collection.",
        ),
        link: express + "guide/routing.html",
      }),
    ],
  },
  {
    id: "entrees-express",
    title: "Paramètres, filtres et corps JSON",
    description: "Récupère les trois sources de données d’une requête.",
    lessons: [
      lesson({
        id: "params-et-query",
        title: "Identifier une ressource ou filtrer une liste",
        minutes: 16,
        summary:
          "req.params lit les valeurs prises dans le chemin. req.query lit les paramètres après le point d’interrogation.",
        sections: [
          section(
            "Comparer deux URLs",
            "GET /api/tasks/1 utilise req.params.id. GET /api/tasks?search=route utilise req.query.search pour filtrer les titres.",
            [
              "Un identifiant sert à cibler une tâche.",
              "Un filtre est souvent facultatif et n’identifie pas une tâche unique.",
              "Vérifie le type du filtre avant de l’utiliser.",
            ],
          ),
        ],
        files: tasks.files,
        task: "Essaie un filtre qui trouve une tâche puis un filtre sans résultat.",
        takeaway:
          "Le chemin cible une ressource. Les paramètres de requête précisent la recherche.",
        quiz: quiz(
          "Où Express expose search dans ?search=route ?",
          ["req.body", "req.params", "req.query"],
          2,
          "La chaîne après ? est disponible dans req.query.",
        ),
        link: express + "api.html#req.query",
      }),
      lesson({
        id: "body-json",
        title: "Lire et vérifier un corps JSON",
        minutes: 19,
        summary:
          "express.json() analyse le JSON envoyé avec le bon Content-Type et place sa valeur dans req.body. La route contrôle ensuite la forme des données.",
        sections: [
          section(
            "Transmettre un calcul au serveur",
            "POST /api/convert reçoit amount, from et to. La route vérifie le montant et applique des taux fictifs.",
            [
              "Ajoute Content-Type: application/json aux requêtes JSON.",
              "Un JSON valide peut contenir des valeurs incompatibles avec la route. Vérifie les champs.",
              "Le parseur a une limite de taille et renvoie une erreur pour un JSON mal formé.",
            ],
          ),
        ],
        files: conversion.files,
        task: "Envoie 10 EUR vers MGA, puis teste un montant négatif et un code inconnu.",
        takeaway:
          "Lire le JSON et valider son contenu sont deux étapes distinctes.",
        quiz: quiz(
          "Quel middleware remplit req.body pour le JSON ?",
          ["morgan", "express.json()", "res.json()"],
          1,
          "express.json analyse le corps JSON des requêtes correspondantes.",
        ),
        link: express + "api.html#express.json",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "express-middlewares",
    title: "La chaîne des middlewares",
    description: "Prépare la requête avant la route et observe les appels.",
    lessons: [
      lesson({
        id: "req-res-next",
        title: "Comprendre req, res et next",
        minutes: 19,
        summary:
          "Un middleware peut lire la requête, ajouter des informations, envoyer une réponse ou transmettre le traitement au suivant.",
        sections: [
          section(
            "Placer chaque étape dans le bon ordre",
            "createApp configure la journalisation, puis le parseur JSON et les fichiers statiques. Les routes sont montées ensuite.",
            [
              "Appelle next() quand le traitement doit continuer.",
              "Quand une étape envoie la réponse, retourne depuis cette étape.",
              "next(error) passe à la gestion des erreurs.",
            ],
          ),
        ],
        files: projectExample(shoes, "server.js"),
        task: "Repère l’ordre des appels à app.use. Ajoute un en-tête de test via un middleware placé avant les routes.",
        takeaway: "L’ordre des middlewares détermine le trajet de la requête.",
        quiz: quiz(
          "Comment transmettre la requête au middleware suivant ?",
          ["next()", "res.json()", "app.listen()"],
          0,
          "next() demande à Express de continuer la chaîne.",
        ),
        link: express + "guide/using-middleware.html",
      }),
      lesson({
        id: "cors-morgan",
        title: "Configurer CORS et lire les journaux Morgan",
        minutes: 18,
        summary:
          "CORS indique aux navigateurs quelles origines peuvent lire les réponses. Morgan résume les requêtes reçues par le serveur.",
        sections: [
          section(
            "Configurer un frontend de test",
            "CLIENT_ORIGIN peut désigner le frontend séparé. La page fournie par Express utilise déjà la même origine que son API.",
            [
              "Une origine combine protocole, hôte et port.",
              "Les routes privées ont besoin d’un contrôle d’accès côté serveur.",
              "Les journaux d’exercice contiennent méthode, URL et statut. Garde les secrets dans les en-têtes ou la configuration.",
            ],
          ),
        ],
        files: projectExample(shoes, "server.js"),
        task: "Ouvre le catalogue, puis provoque un 404 et observe les deux lignes dans le terminal.",
        takeaway:
          "CORS règle la lecture entre origines dans le navigateur. Morgan permet de suivre les appels.",
        quiz: quiz(
          "Quel outil journalise la méthode et le statut ?",
          ["Morgan", "Mongoose", "Joi"],
          0,
          "Morgan est le middleware de journalisation HTTP de l’atelier.",
        ),
        link: express + "resources/middleware/cors.html",
      }),
    ],
  },
  {
    id: "mongoose-donnees",
    title: "Connexion et modèles MongoDB",
    description: "Stocke des documents et effectue des requêtes asynchrones.",
    lessons: [
      lesson({
        id: "connexion-mongodb",
        title: "Connecter Express à MongoDB",
        minutes: 20,
        summary:
          "MongoDB enregistre des documents dans des collections. Mongoose est un ODM qui relie ces documents à des modèles JavaScript.",
        sections: [
          section(
            "Attendre la connexion",
            "start attend mongoose.connect avant d’ouvrir le port. MONGODB_URI peut pointer vers MongoDB sur ton ordinateur ou vers Atlas.",
            [
              "Chaque atelier utilise son propre nom de base par défaut.",
              "Garde l’URI et ses identifiants dans un fichier .env local ou dans l’environnement du serveur.",
              "Redémarrer Express conserve les documents déjà enregistrés.",
            ],
          ),
        ],
        files: projectExample(shoes, ".env.example"),
        task: "Démarre MongoDB puis Express. Crée un article et retrouve-le après redémarrage.",
        takeaway:
          "La base continue d’exister quand le processus Express s’arrête.",
        quiz: quiz(
          "Que doit attendre le serveur avant d’accepter les requêtes ?",
          [
            "La connexion à MongoDB",
            "La fermeture de VS Code",
            "Un clic sur le logo",
          ],
          0,
          "La connexion doit être prête avant les routes qui en dépendent.",
        ),
        link: mongoose + "connections.html",
      }),
      lesson({
        id: "schemas-requetes",
        title: "Créer un schéma et requêter avec async/await",
        minutes: 22,
        summary:
          "Un schéma définit types, contraintes et index. Le modèle construit les requêtes. await attend le résultat sans bloquer les autres opérations d’entrée-sortie.",
        sections: [
          section(
            "Décrire puis retrouver une chaussure",
            "Shoe définit le SKU, la marque et la taille. La route transforme les filtres validés en un objet de recherche pour Shoe.find.",
            [
              "required et type vérifient des propriétés du modèle. unique demande un index unique dans MongoDB.",
              "L’index empêche deux documents d’utiliser le même SKU.",
              "Les opérations asynchrones utilisent await dans une fonction async.",
            ],
          ),
        ],
        files: projectExample(shoes, "models/Shoe.js"),
        task: "Crée deux tailles d’une même marque et essaie les filtres séparément puis ensemble.",
        takeaway:
          "Le schéma décrit la collection. La requête sélectionne les documents.",
        quiz: quiz(
          "Quel mécanisme empêche deux SKU identiques en base ?",
          ["L’index unique", "Le titre HTML", "Une ligne Morgan"],
          0,
          "MongoDB impose l’unicité au moment de l’écriture.",
        ),
        link: mongoose + "guide.html",
      }),
    ],
  },
  {
    id: "express-validation-erreurs",
    title: "Validation et erreurs",
    description: "Protège les écritures et renvoie une réponse claire.",
    lessons: [
      lesson({
        id: "valider-joi",
        title: "Valider les champs avec Joi",
        minutes: 22,
        summary:
          "Joi décrit la forme des données attendues. L’API d’inscription vérifie l’e-mail et la longueur du mot de passe avant le hachage et l’écriture.",
        sections: [
          section(
            "Retourner les champs à corriger",
            "check utilise abortEarly: false pour remonter plusieurs problèmes. La route poursuit uniquement avec les valeurs validées.",
            [
              "Les schémas Joi peuvent normaliser un e-mail ou convertir un nombre.",
              "express-validator propose aussi des règles de validation pour Express.",
              "Le mot de passe est haché et la réponse de création expose uniquement l’identifiant et l’e-mail.",
            ],
          ),
        ],
        files: projectExample(signup, "validation.js"),
        task: "Saisis un e-mail et un mot de passe invalides. Vérifie les messages puis crée un compte fictif.",
        takeaway:
          "La validation côté serveur s’applique même si la requête vient d’un autre client.",
        quiz: quiz(
          "Quand valider les données reçues ?",
          [
            "Avant le hachage et l’écriture",
            "Après l’insertion en base",
            "Pendant le rendu de la page d’accueil",
          ],
          0,
          "Les données rejetées doivent être arrêtées avant le traitement.",
        ),
        link: "https://joi.dev/api/",
      }),
      lesson({
        id: "erreur-centralisee",
        title: "Renvoyer des erreurs JSON cohérentes",
        minutes: 20,
        summary:
          "Le middleware d’erreur final reçoit error, req, res et next. Express 5 transmet aussi les rejets des promesses retournées par les handlers.",
        sections: [
          section(
            "Distinguer les échecs",
            "L’atelier renvoie 400 pour un JSON ou des champs invalides, 404 pour une ressource absente et 409 pour une valeur unique déjà utilisée.",
            [
              "Un callback peut transmettre une erreur via next(error).",
              "Une erreur inattendue donne un message générique et un statut 500.",
              "Place le middleware après les routes pour centraliser leur traitement.",
            ],
          ),
        ],
        files: projectExample(signup, "server.js"),
        task: "Refais une inscription avec la même adresse et compare la réponse avec celle d’une adresse invalide.",
        takeaway:
          "Une réponse d’erreur stable aide le frontend à indiquer ce qu’il faut corriger.",
        quiz: quiz(
          "Quelle signature identifie le middleware d’erreur ?",
          ["(error, req, res, next)", "(req, res)", "(res, port)"],
          0,
          "Express reconnaît le middleware d’erreur par ses quatre arguments.",
        ),
        link: express + "guide/error-handling.html",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "express-mvc-jwt",
    title: "Architecture MVC et authentification JWT",
    description: "Sépare les responsabilités et protège les routes privées.",
    lessons: [
      lesson({
        id: "express-mvc-bcrypt",
        title: "Organiser le code et hacher les mots de passe",
        minutes: 22,
        summary:
          "Les modèles décrivent les données. Les contrôleurs portent les traitements. Les routes associent ces traitements aux URLs et aux middlewares.",
        sections: [
          section(
            "Suivre une inscription",
            "routes/auth.js appelle le contrôleur après la limite de requêtes. Le contrôleur valide l’entrée, hache le mot de passe puis crée le modèle User.",
            [
              "bcryptjs implémente l’algorithme bcrypt. hash crée une empreinte et compare vérifie la saisie.",
              "Le modèle exclut passwordHash des lectures courantes.",
              "Les réponses JSON jouent le rôle de représentation des données pour le frontend.",
            ],
          ),
        ],
        files: projectExample(shop, "controllers/auth.js"),
        task: "Repère où la route appelle register, puis où le contrôleur crée l’utilisateur.",
        takeaway:
          "Le découpage sépare la route, la validation, les droits et l’accès aux données.",
        quiz: quiz(
          "Quelle valeur stocke le modèle User ?",
          [
            "Le hachage du mot de passe",
            "Le mot de passe en clair",
            "Le code du formulaire",
          ],
          0,
          "Le serveur conserve l’empreinte calculée par bcrypt.",
        ),
        link: express + "guide/routing.html#express-router",
      }),
      lesson({
        id: "signer-verifier-jwt",
        title: "Signer un JWT et contrôler le rôle",
        minutes: 25,
        summary:
          "Après la connexion, jsonwebtoken signe un jeton à durée limitée. Les routes privées vérifient ce jeton avant de charger le compte et ses droits.",
        sections: [
          section(
            "Parcourir les deux contrôles",
            "authenticate lit Authorization: Bearer, vérifie la signature, l’émetteur, l’audience et l’expiration, puis retrouve l’utilisateur. adminOnly vérifie son rôle courant.",
            [
              "Le jeton permet d’identifier le compte. La base fournit son rôle actuel.",
              "401 indique que l’identification manque ou a échoué. 403 indique que le compte identifié n’a pas le droit demandé.",
              "L’historique filtre sur l’identifiant fourni par le serveur. Une saisie du client ne choisit pas le propriétaire.",
            ],
          ),
        ],
        files: projectExample(shop, "middlewares/auth.js"),
        task: "Essaie un jeton invalide, un client et un administrateur sur la route d’ajout de produit.",
        takeaway:
          "Vérifier l’identité précède la vérification des permissions.",
        quiz: quiz(
          "Quel statut reçoit le client connecté qui tente d’ajouter un produit ?",
          ["201", "403", "404"],
          1,
          "Le compte est identifié mais son rôle ne permet pas l’action.",
        ),
        link: "https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback",
      }),
    ],
  },
  {
    id: "express-temps-reel",
    title: "Temps réel avec Socket.IO",
    description:
      "Authentifie une connexion puis publie des messages par salon.",
    lessons: [
      lesson({
        id: "socketio-connexion",
        title: "Partager un serveur HTTP entre Express et Socket.IO",
        minutes: 20,
        summary:
          "Express traite les requêtes HTTP. Socket.IO échange des événements avec les clients connectés et peut utiliser WebSocket pour le transport.",
        sections: [
          section(
            "Connecter le navigateur au serveur",
            "createServer(app) partage l’écoute HTTP. attachChat attache Socket.IO. Le navigateur transmet le jeton dans auth et le middleware le contrôle.",
            [
              "Un événement possède un nom et une charge utile.",
              "Un accusé de réception indique le résultat d’une action du client.",
              "Le serveur coupe la connexion quand le jeton de test arrive à expiration.",
            ],
          ),
        ],
        files: chat.files,
        task: "Connecte deux onglets avec deux comptes de test et observe le statut de connexion.",
        takeaway:
          "L’API identifie le compte, puis Socket.IO ouvre une connexion pour échanger des événements.",
        quiz: quiz(
          "Où le middleware Socket.IO reçoit-il le jeton ici ?",
          [
            "Dans socket.handshake.auth",
            "Dans le nom de la base",
            "Dans un fichier CSS",
          ],
          0,
          "Le client transmet auth lors de la tentative de connexion.",
        ),
        link: "https://socket.io/docs/v4/middlewares/",
      }),
      lesson({
        id: "socketio-salons",
        title: "Diffuser dans un salon et retrouver l’historique",
        minutes: 24,
        summary:
          "Un salon groupe les clients abonnés. L’atelier enregistre le message dans MongoDB puis le diffuse aux clients connectés au salon ciblé.",
        sections: [
          section(
            "Choisir le destinataire",
            "socket.join(room) abonne le client. io.to(room).emit envoie un événement aux membres du salon. Un autre salon reçoit son propre flux.",
            [
              "Le serveur vérifie que l’émetteur a rejoint le salon et valide la taille du texte.",
              "Le client déduplique les messages par identifiant quand il reçoit l’historique et des événements rapprochés.",
              "La diffusion en direct et l’historique persistant répondent à deux besoins.",
            ],
          ),
        ],
        files: projectExample(chat, "chat.js"),
        task: "Envoie un message pendant que les deux onglets sont dans le même salon. Change l’un d’eux de salon et recommence.",
        takeaway:
          "Le salon fixe le périmètre de diffusion. MongoDB conserve les messages.",
        quiz: quiz(
          "Quel appel envoie l’événement au salon ciblé ?",
          ["io.to(room).emit(...)", "app.listen(...)", "npm run dev"],
          0,
          "io.to(room) cible les sockets abonnés au salon.",
        ),
        link: "https://socket.io/docs/v4/rooms/",
      }),
    ],
  },
  {
    id: "express-production",
    title: "Configuration, sécurité et déploiement",
    description:
      "Prépare l’environnement et teste le processus avant la mise en ligne.",
    lessons: [
      lesson({
        id: "dotenv-helmet-limites",
        title: "Gérer les secrets, les en-têtes et les limites",
        minutes: 22,
        summary:
          "dotenv charge une configuration locale. Helmet ajoute des en-têtes HTTP. express-rate-limit borne le nombre de tentatives de connexion par fenêtre de temps.",
        sections: [
          section(
            "Repérer les protections du projet",
            "npm run setup crée une clé de test dans .env. Le déploiement fournit ses propres variables à Node.js. Le routeur applique la limite sur la connexion et l’inscription.",
            [
              ".env.example contient les noms des paramètres. .env est ignoré par Git.",
              "Les en-têtes Helmet complètent les permissions et la validation.",
              "Derrière un proxy, configure la confiance de façon explicite avant de compter les appels par adresse.",
            ],
          ),
        ],
        files: projectExample(shop, "routes/auth.js"),
        task: "Ouvre routes/auth.js, server.js puis .env.example. Relie chaque réglage à son rôle.",
        takeaway:
          "Les secrets appartiennent à l’environnement. La limitation s’applique aux actions qui en ont besoin.",
        quiz: quiz(
          "Où fournir JWT_SECRET sur le serveur ?",
          [
            "Dans les variables d’environnement",
            "Dans le script public du navigateur",
            "Dans le texte d’un message",
          ],
          0,
          "La clé doit rester accessible au processus du serveur.",
        ),
        link: express + "advanced/best-practice-security.html",
      }),
      lesson({
        id: "express-pm2-deploiement",
        title: "Préparer un démarrage supervisé",
        minutes: 22,
        summary:
          "Un hébergement configure les variables, ouvre un port et supervise le processus. Sur un VPS, PM2 peut relancer Node.js et centraliser ses journaux.",
        sections: [
          section(
            "Relier code et configuration",
            "Le README décrit NODE_ENV, PORT, HOST, MONGODB_URI et JWT_SECRET. Le fichier ecosystem.config.cjs décrit le processus Node à PM2.",
            [
              "Un hébergement géré peut utiliser directement npm start et fournir sa propre supervision.",
              "Vérifie HTTPS, les permissions, les erreurs et les données persistantes en préproduction.",
              "Pour plusieurs instances de chat, étudie le partage des salons et l’adaptateur Socket.IO.",
            ],
          ),
        ],
        files: projectExample(shop, "ecosystem.config.cjs"),
        task: "Dresse la liste des variables que demanderait ton hébergeur. Explique comment confirmer que MongoDB est prêt.",
        takeaway:
          "Le déploiement configure l’environnement puis vérifie que le serveur et la base démarrent ensemble.",
        quiz: quiz(
          "À quoi sert PM2 dans l’exemple VPS ?",
          [
            "Superviser le processus Node.js",
            "Créer les vues Blade",
            "Hacher les mots de passe",
          ],
          0,
          "PM2 peut démarrer, suivre et relancer un processus Node.js.",
        ),
        link: "https://pm2.keymetrics.io/docs/usage/quick-start/",
      }),
    ],
  },
];

export const nodeLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Node.js, asynchronisme et routes Express",
    definition:
      "Node.js est un environnement qui exécute JavaScript en dehors du navigateur. Il s’appuie sur le moteur V8 et traite les entrées-sorties de façon asynchrone. Express est une bibliothèque qui simplifie les routes HTTP et les réponses du serveur.",
    objective:
      "Démarre un serveur local, lis les données d’une requête et écris tes premières routes.",
    color: levelColors[0],
    prerequisites:
      "Pour démarrer, révise les fonctions, les objets et les tableaux JavaScript.",
    outcomes: [
      "Lancer JavaScript avec Node.js et gérer les paquets avec npm.",
      "Observer un callback asynchrone.",
      "Créer des routes pour les principaux verbes HTTP.",
      "Lire le chemin, la recherche et le corps JSON.",
    ],
    chapters: beginner,
    projects: nodeBeginnerProjects,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Middlewares, MongoDB et validation",
    objective:
      "Relie une API Express à MongoDB et gère les entrées et les erreurs côté serveur.",
    color: levelColors[1],
    prerequisites:
      "Pour démarrer, sache écrire une route Express et envoyer du JSON.",
    outcomes: [
      "Comprendre l’ordre des middlewares.",
      "Décrire un modèle Mongoose et attendre une requête avec await.",
      "Valider des champs avec Joi.",
      "Structurer les réponses d’erreur en JSON.",
    ],
    chapters: intermediate,
    projects: nodeIntermediateProjects,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "MVC, JWT, Socket.IO et déploiement",
    objective:
      "Protège les routes, ajoute une connexion temps réel et prépare les réglages du serveur.",
    color: levelColors[2],
    prerequisites:
      "Pour démarrer, maîtrise les middlewares, les modèles et les erreurs asynchrones.",
    outcomes: [
      "Découper le projet en modèles, contrôleurs, routes et middlewares.",
      "Hacher les mots de passe et vérifier un JWT.",
      "Gérer les messages et les salons avec Socket.IO.",
      "Préparer les variables et le démarrage supervisé.",
    ],
    chapters: advanced,
    projects: nodeAdvancedProjects,
  },
];
