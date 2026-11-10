import type { WebFiles } from "./webCourseTypes";

type GuiRuntime = "customtkinter" | "electron" | "nodegui" | "php-desktop";
export function scriptGuiFiles(
  runtime: GuiRuntime,
  title: string,
  entry: string,
  sources: Record<string, string>,
): WebFiles {
  const instructions = {
    customtkinter: `Installe Python 3.11 ou plus récent. Sous Windows, ouvre PowerShell dans le dossier extrait.

\`\`\`powershell
py -m venv .venv
.\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt
.\\.venv\\Scripts\\python.exe main.py
\`\`\`

Sous Linux, installe le module Tk de Python, crée le venv avec python3 -m venv .venv puis utilise .venv/bin/python.
`,
    electron: `Installe Node.js 24. Ouvre le dossier extrait contenant package.json.

\`\`\`text
npm install
npm start
\`\`\`

Electron télécharge son moteur de bureau pendant l’installation. La fenêtre charge uniquement les fichiers de cet atelier. Le processus principal et le preload définissent les actions disponibles pour la vue.
`,
    nodegui: `Installe Node.js 24 et les outils natifs du guide NodeGui.
Sous Windows, prépare Visual Studio Build Tools avec le développement C++ pour bureau, Python et CMake.
Sous Linux, installe la chaîne C++ et les dépendances Qt indiquées dans le guide.

\`\`\`text
npm install
npm start
\`\`\`

npm start vérifie le TypeScript puis lance Qode, le moteur de NodeGui qui gère aussi les événements Qt. Le projet utilise NodeGui 0.74.2 et la version de Qode fournie par ce paquet.
Guide officiel https://docs.nodegui.org/docs/guides/getting-started/
`,
    "php-desktop": `Installe PHP 8.2 ou plus récent pour les essais en ligne de commande.

Pour ouvrir une fenêtre autonome sous Windows, télécharge une distribution PHP Desktop Chrome intégrant PHP 8.2 ou plus récent depuis le dépôt officiel. Garde son settings.json et son moteur dans leur dossier. Copie le contenu du dossier www de cet atelier dans son dossier www puis lance son exécutable.

Pour essayer la même interface dans ton navigateur pendant le développement, ouvre le dossier de cet atelier.

\`\`\`text
php -S 127.0.0.1:8027 -t www
\`\`\`

Ouvre http://127.0.0.1:8027/. Les classes PHP portent la logique et la session conserve l’état pendant les actions du formulaire.
Distribution officielle https://github.com/cztomczak/phpdesktop/releases
`,
  }[runtime];
  return {
    html: "",
    css: "",
    entry,
    local: {
      runtime,
      sources: { ...sources, "README.md": `# ${title}\n\n${instructions}` },
    },
  };
}
export function sqlFiles(setup: string, query: string): WebFiles {
  return {
    html: "",
    css: "",
    entry: "requete.sql",
    local: {
      runtime: "sql",
      sources: {
        "schema.sql": setup.trim() + "\n",
        "requete.sql": query.trim() + "\n",
        "README.md": `# Atelier SQL DevAfrica

Le terminal utilise SQLite. schema.sql prépare les tables de départ pour cet atelier. requete.sql contient la requête à modifier et à exécuter.

Clique sur Exécuter le SQL pour lancer le fichier actif. Le terminal permet aussi de saisir des requêtes, consulter les tables, reprendre une requête de l’historique, exporter les résultats en CSV et la base au format .sqlite.

Pour repartir des données initiales, utilise Réinitialiser la base. Un lot échoué conserve la base de la dernière exécution réussie. Les instructions BEGIN, COMMIT et ROLLBACK peuvent être essayées dans un même lot.

SQLite crée une base en ouvrant un fichier. INTEGER PRIMARY KEY fournit ici les identifiants. MySQL utilise notamment CREATE DATABASE et AUTO_INCREMENT, avec sa propre syntaxe. Les types TEXT et les dates ISO sont utilisés dans ces exercices SQLite.

Pour pratiquer dans un logiciel local, ouvre les scripts ou la base exportée avec DB Browser for SQLite.
https://sqlitebrowser.org/
`,
      },
    },
  };
}
