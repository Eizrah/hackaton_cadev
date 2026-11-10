# Python, JavaScript, TypeScript, PHP et SQL

Les cinq fiches du domaine Langages de programmation ouvrent chacune une salle de cours avec trois niveaux, 18 leçons, des quiz, des activités, un sommaire et trois mini-projets. Les explications suivent les deux documents de référence fournis.

| Parcours | Débutant | Intermédiaire | Avancé |
| --- | --- | --- | --- |
| Python | Interpréteur, indentation, types, saisies, boucles, fonctions et listes | Classes, instances, modules, fenêtre CustomTkinter et rappels | Fichiers UTF-8, JSON, grilles, formulaires et chiffrement |
| JavaScript | Scripts Node.js, let, const, objets, tableaux et fonctions fléchées | map, filter, reduce et architecture Electron | Promesses, async/await, preload, IPC et mesures système |
| TypeScript | Compilation, annotations, interfaces, champs facultatifs et validation de unknown | Visibilité, constructeurs, NodeGui et événements Qt | Génériques, contraintes, enums, FlexLayout et tableau |
| PHP | CLI, variables $, saisies, conditions, boucles, fonctions et UTF-8 | Tableaux associatifs, foreach, classes, session et PHP Desktop | strict_types, exceptions, prix en centimes et formulaires |
| SQL | Tables, types, contraintes, INSERT, SELECT, filtres, tri et pagination | UPDATE, DELETE, relations, clés étrangères et jointures | Agrégations, GROUP BY, HAVING, sous-requêtes, index et plans |

Les fiches JavaScript et TypeScript de ce domaine étudient la programmation avec des scripts et les applications de bureau. Les cours Web présentent les usages d’interface web de ces technologies.

## Projets fournis

| Langage | Projet débutant | Projet intermédiaire | Projet avancé |
| --- | --- | --- | --- |
| Python | Gestionnaire de notes et moyenne | Compteur sombre CustomTkinter | Coffre pédagogique chiffré |
| JavaScript | Facture en console | Fenêtre autonome Electron | Moniteur système avec IPC |
| TypeScript | Validateur de profils | Application de vote NodeGui | Logiciel de tickets avec dépôt générique |
| PHP | Analyseur de texte en console | Compteur PHP Desktop | Caisse avec validation et exceptions |
| SQL | Répertoire de cinq contacts | Commandes reliées aux clients | Rapport de ventes par catégorie |

## Démarrer le frontend dans VS Code

Ouvre le dossier `frontend` qui contient `package.json` et `package-lock.json`. Dans son terminal, installe les dépendances puis lance le site.

```powershell
npm ci
npm run dev
```

Depuis le dossier parent `hackaton_cadev`, entre d’abord `cd frontend`. Le projet utilise Node.js 24. Garde le terminal ouvert et ouvre l’adresse affichée par Vite.

## Pratiquer SQL dans le navigateur

Le terminal embarque SQLite grâce à sql.js et WebAssembly. Il charge son moteur depuis les fichiers du frontend.

1. Ouvre Apprentissage puis Langages de programmation et SQL.
2. Choisis ton niveau, une leçon, puis Essayer dans l’atelier.
3. Consulte `schema.sql` pour comprendre les tables initiales et modifie `requete.sql` pour écrire ton essai.
4. Clique sur Exécuter le SQL pour lancer le fichier SQL actif. Le terminal à droite permet aussi de saisir une autre requête. Ctrl + Entrée l’exécute depuis ce champ.
5. Ouvre Résultats pour consulter les tableaux. Tables montre les colonnes et ouvre un aperçu des 50 premières lignes de la table choisie.
6. Historique conserve les vingt dernières requêtes réussies. Un clic reprend le texte dans le terminal pour le modifier avant un nouvel essai.

L’export CSV porte sur le résultat affiché. L’export `.sqlite` fournit la base complète et peut être ouvert avec DB Browser for SQLite. L’export ZIP conserve les scripts de l’éditeur.

La base et son historique sont mémorisés par atelier dans ce navigateur avec IndexedDB. Un rechargement retrouve les modifications acceptées. Réinitialiser la base restaure le schéma et les données de départ après confirmation. Le bouton de remise à zéro de l’éditeur restaure aussi son code et sa base.

Un lot réussi remplace la base courante. Un lot échoué conserve la dernière base acceptée, même si une première instruction du lot avait déjà modifié des lignes. Une requête dépassant trois secondes est arrêtée et le moteur retrouve le dernier état validé. Les transactions BEGIN, COMMIT et ROLLBACK peuvent être étudiées dans un même lot.

Pour garder l’interface réactive, un résultat affiche jusqu’à 200 lignes, 100 colonnes et 256 Kio. Un lot contient jusqu’à huit résultats et quarante instructions. La base est limitée à 2 Mio. WHERE, LIMIT et les colonnes nommées permettent de cibler une recherche.

### Syntaxe du moteur utilisé

| Concept | Dans le terminal SQLite | Repère dans d’autres moteurs |
| --- | --- | --- |
| Création de base | Ouverture d’une base SQLite | MySQL possède CREATE DATABASE |
| Identifiant généré | INTEGER PRIMARY KEY | MySQL possède AUTO_INCREMENT |
| Texte | TEXT, avec contraintes selon le besoin | VARCHAR(n) peut définir une taille selon le moteur |
| Date d’exercice | Texte ISO comme `2026-11-07` | Certains moteurs proposent un type DATE dédié |
| Clé étrangère | Activée lors de la préparation de chaque essai | La configuration dépend du moteur |
| Jointures | INNER, LEFT et RIGHT JOIN | Vérifier les différences du dialecte étudié |

## Exécuter Python, JavaScript, TypeScript et PHP

La console réutilise le service de compilation du projet. Démarre Docker Desktop en mode conteneurs Linux puis reconstruis son image depuis `frontend` pour installer les moteurs ajoutés.

```powershell
npm run compiler:build
npm run dev
```

Le premier build télécharge les outils. L’image contient Node.js 24, TypeScript 6.0.3, Python 3, PHP avec mbstring et readline, ainsi que GCC, G++ et le JDK déjà utilisés par les ateliers C, C++ et Java.

| Cours | Bouton de l’éditeur | Étapes réalisées | Entrée du programme |
| --- | --- | --- | --- |
| Python | Exécuter le script | Vérification de syntaxe puis Python | `main.py` |
| JavaScript | Exécuter le script | Vérification Node puis exécution | `main.mjs` |
| TypeScript | Compiler et exécuter | tsc strict puis Node sur le JavaScript produit | `main.ts` |
| PHP | Exécuter le script | Analyse syntaxique puis PHP CLI | `main.php` |

La zone Entrée standard contient les lignes que le programme doit lire. Prépare-les avant de lancer. Les fichiers créés pendant un essai vivent dans son environnement temporaire. Le projet exporté peut utiliser des fichiers durables sur l’ordinateur de l’apprenant.

Une erreur TypeScript bloque le lancement. Les annotations expriment le contrat du code et les données externes doivent encore être validées à l’exécution. Le projet de profils illustre ces deux étapes avec `unknown` et un prédicat de type.

Le service HTTP utilise la route `/api/atelier/compilation`. Son raccordement derrière Django et le lancement autonome sont expliqués dans `docs/APPRENTISSAGE_LANGAGES.md`.

## Ouvrir les fenêtres des projets exportés

Les exports contiennent les sources et un README avec les commandes adaptées à leur runtime.

| Interface | Préparation | Lancement |
| --- | --- | --- |
| CustomTkinter | Python 3.11 ou plus récent avec Tk, venv et requirements.txt | Sous Windows, utiliser le Python du venv pour lancer main.py |
| Electron | Node.js 24 et les dépendances du projet | `npm install`, puis `npm start` |
| NodeGui | Node.js 24, outils C++ et prérequis du guide NodeGui | `npm install`, puis `npm start`, qui compile et lance Qode |
| PHP Desktop | Distribution PHP Desktop Chrome avec PHP 8.2 ou plus récent | Copier www dans la distribution puis lancer son exécutable |
| Vue PHP en développement | PHP 8.2 ou plus récent | `php -S 127.0.0.1:8027 -t www` puis ouvrir l’adresse locale |

Sous Windows, NodeGui peut demander Visual Studio Build Tools avec C++ pour bureau, Python et CMake. La version du module natif est associée au runtime Qode fourni. Le paquet de projet fixe NodeGui 0.74.2 et ses dépendances de compilation.

Le coffre Python utilise Scrypt et Fernet de cryptography pour dériver la clé, chiffrer et authentifier les entrées d’exercice. La phrase maîtresse est saisie dans un champ masqué. Le sel et le contenu chiffré sont stockés dans `coffre.json`. Le modèle prépare une nouvelle sauvegarde dans un fichier temporaire puis remplace le coffre après réussite. Utilise des données fictives pour ce projet pédagogique.

Le moniteur Electron expose une action de mesure par le preload et le pont IPC. Son rendu conserve l’isolation de contexte, utilise les mesures reçues et termine son minuteur à la fermeture.

Les prix des projets de facture et de caisse utilisent des centimes entiers. Leur taxe fixe de 20 % est une donnée fictive d’exercice.

## Retrouver les changements dans le code

| Fichiers | Rôle |
| --- | --- |
| `src/data/pythonCourse.ts` et `pythonProjects.ts` | Leçons et trois projets Python |
| `src/data/scriptJsCourse.ts` et `scriptJsProjects.ts` | Scripts et projets Electron |
| `src/data/typescriptCourse.ts` et `typescriptProjects.ts` | Typage, modèles et fenêtres NodeGui |
| `src/data/phpLanguageCourse.ts` et `phpLanguageProjects.ts` | Logique PHP et projets PHP Desktop |
| `src/data/sqlCourse.ts` et `sqlProjects.ts` | Programme SQL, schémas et requêtes |
| `src/data/scriptAuthoring.ts` | Exports de projets graphiques et de scripts SQL |
| `src/components/learning/SqlStudioPanel.tsx` | Terminal, tables, résultats, historique et exports |
| `src/lib/sql/worker.ts` | Exécution SQLite dans un worker et validation d’un lot |
| `src/lib/sql/useSqlStudio.ts` et `storage.ts` | Cycle du moteur et mémorisation par atelier |
| `src/lib/compilerProtocol.ts`, `compiler/api.ts` et `compiler/runner.py` | Nouveaux moteurs de console et vérification des requêtes |
| `compiler/Dockerfile` | Installation des moteurs dans l’image d’exécution |
