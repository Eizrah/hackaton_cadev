import { lesson, levelColors, quiz, section } from "./courseAuthoring";
import { laravelFoundationProjects } from "./laravelProjects";
import { laravelAdvancedProjects } from "./laravelAdvancedProjects";
import type { WebLevel, WebProject } from "./webCourseTypes";

const docs = "https://laravel.com/docs/12.x/";
const [[directory, blog], [projects, meetups]] = laravelFoundationProjects;
const [forum, support] = laravelAdvancedProjects;
const example = (project: WebProject, entry: string) => ({
  ...project.files,
  entry,
});

const beginner: WebLevel["chapters"] = [
  {
    id: "introduction-laravel",
    title: "Introduction à Laravel",
    description:
      "Découvre Laravel, son écosystème et sa philosophie avant de créer ton premier projet.",
    lessons: [
      lesson({
        id: "quest-ce-que-laravel",
        title: "Qu'est-ce que Laravel ?",
        minutes: 18,
        summary:
          "Laravel est un framework PHP full-stack qui suit le principe \"Convention over Configuration\". Il offre une architecture MVC complète avec Eloquent ORM, Blade templates et Artisan CLI.",
        files: {
          html: "",
          css: "",
          entry: "notes.md",
          local: {
            runtime: "php",
            sources: {
              "notes.md": `# Laravel

## Framework PHP full-stack
- Architecture MVC (Model-View-Controller)
- Philosophie "Convention over Configuration"
- Eloquent ORM élégant
- Blade templates
- Artisan CLI

## Écosystème
- Composer (dépendances PHP)
- Eloquent ORM (base de données)
- Blade (templates)
- Artisan (ligne de commande)
- Laravel Sail (Docker)
- Laravel Forge/Vapor (déploiement)
`,
            },
          },
        },
        sections: [
          section(
            "Laravel : Framework PHP moderne",
            "Laravel est un framework web PHP qui facilite le développement d'applications en fournissant des outils et des conventions. Il suit l'architecture MVC et inclut tout ce dont tu as besoin pour créer une application web complète.",
            [
              "PHP 8.2+ requis : Laravel profite des dernières fonctionnalités PHP (typage, attributs, enums).",
              "Framework full-stack : contrairement à des micro-frameworks, Laravel fournit auth, validation, queue, cache, email, etc.",
              "Convention over Configuration : Laravel impose des conventions (noms de fichiers, structure) qui accélèrent le développement.",
            ],
          ),
          section(
            "Architecture MVC de Laravel",
            "Laravel organise ton code selon le pattern MVC : les Modèles gèrent les données, les Vues affichent l'interface, les Contrôleurs orchestrent la logique.",
            [
              "Model (app/Models/) : classes Eloquent qui représentent tes tables (Animal, User, Post).",
              "View (resources/views/) : templates Blade (.blade.php) qui génèrent le HTML.",
              "Controller (app/Http/Controllers/) : classes qui reçoivent les requêtes, préparent les données et choisissent la vue.",
            ],
          ),
          section(
            "Eloquent ORM : accès élégant aux données",
            "Eloquent est l'ORM de Laravel. Il transforme les tables en classes PHP et les lignes en objets. Tu manipules la base avec des méthodes PHP au lieu d'écrire du SQL.",
            [
              "Active Record pattern : chaque instance d'un modèle correspond à une ligne de table.",
              "Syntaxe expressive : Animal::where('disponible', true)->get() au lieu de SELECT * FROM animals WHERE disponible = 1.",
              "Relations simples : hasMany(), belongsTo(), belongsToMany() définissent les liens entre modèles.",
            ],
          ),
          section(
            "Artisan CLI : productivité maximale",
            "Artisan est l'outil en ligne de commande de Laravel. Il génère des fichiers, gère les migrations, démarre le serveur et bien plus.",
            [
              "php artisan make:controller AnimalController : génère un contrôleur.",
              "php artisan make:model Animal -m : crée un modèle + migration.",
              "php artisan migrate : exécute les migrations (crée/modifie les tables).",
              "php artisan serve : démarre un serveur de développement sur http://127.0.0.1:8000.",
            ],
          ),
          section(
            "Blade : templates expressifs",
            "Blade est le moteur de templates de Laravel. Il ajoute des directives (@ syntax) au HTML pour afficher des données, boucler, conditionner.",
            [
              "@foreach($animals as $animal) ... @endforeach : boucle sur une collection.",
              "{{ $animal->nom }} : affiche une variable (échappement automatique).",
              "@if($animal->disponible) ... @endif : condition.",
              "Les templates Blade sont compilés en PHP pur pour les performances.",
            ],
          ),
          section(
            "Écosystème Laravel",
            "Laravel dispose d'un écosystème riche d'outils officiels et communautaires pour tous les besoins.",
            [
              "Laravel Sail : environnement Docker pré-configuré (PHP, MySQL, Redis).",
              "Laravel Breeze/Jetstream : authentification complète (login, register, 2FA).",
              "Laravel Sanctum : authentification API (tokens, SPA).",
              "Laravel Horizon : supervision des queues (jobs asynchrones).",
              "Laravel Forge : déploiement automatisé sur serveurs (AWS, DigitalOcean).",
              "Laravel Vapor : déploiement serverless sur AWS Lambda.",
            ],
          ),
          section(
            "Avantages de Laravel",
            "Laravel accélère le développement grâce à ses conventions, sa documentation et son écosystème intégré.",
            [
              "Développement rapide : conventions pré-établies, génération de code via Artisan.",
              "Documentation excellente : docs.laravel.com est claire, complète et à jour.",
              "Communauté active : Laracasts (vidéos), forums, packages Packagist.",
              "Sécurité intégrée : CSRF protection, SQL injection prevention, XSS protection.",
              "Tests facilitésLaravel inclut PHPUnit et des helpers pour tester routes, DB, vues.",
            ],
          ),
          section(
            "Comparaison avec d'autres frameworks backend",
            "Laravel se distingue par son élégance et ses conventions, contrairement aux approches plus flexibles ou strictes d'autres frameworks.",
            [
              "vs Django (Python) : Les deux suivent MVC/MTV et incluent un ORM puissant. Laravel est plus flexible sur la structure, Django plus strict. Laravel utilise Blade, Django utilise Jinja2.",
              "vs Express (Node.js) : Express est \"unopinionated\" (peu de conventions), Laravel impose structure et conventions. Express demande plus de décisions, Laravel guide le développement.",
              "vs Spring Boot (Java) : Spring Boot est orienté entreprise, plus verbeux. Laravel est plus accessible, syntax PHP plus légère. Les deux offrent injection de dépendances et écosystème complet.",
              "Tous permettent de créer des APIs REST et des applications web complètes.",
            ],
          ),
        ],
        task: "Lis la documentation officielle Laravel et Eloquent. Compare les philosophies : Laravel \"Convention over Configuration\" vs Express \"Unopinionated\".",
        takeaway:
          "Laravel est un framework PHP MVC complet qui accélère le développement avec Eloquent ORM, Blade templates et Artisan CLI.",
        quiz: quiz(
          "Quelle est la principale philosophie de Laravel ?",
          [
            "Convention over Configuration : conventions pré-établies",
            "Unopinionated : peu de conventions imposées",
            "Batteries included : tout fourni sans conventions",
          ],
          0,
          "Laravel impose des conventions qui accélèrent le développement.",
        ),
        link: docs + "structure",
      }),
      lesson({
        id: "structure-projet-laravel",
        title: "Créer un projet Laravel et comprendre sa structure",
        minutes: 20,
        summary:
          "Un projet Laravel commence par Composer et Artisan. La structure organise modèles (Eloquent), vues (Blade), contrôleurs (MVC), routes, migrations et configuration.",
        files: {
          html: "",
          css: "",
          entry: "structure.md",
          local: {
            runtime: "php",
            sources: {
              "structure.md": `# Structure Laravel

## Dossiers principaux
- app/Models/ : Modèles Eloquent
- app/Http/Controllers/ : Contrôleurs
- routes/ : Définition des routes
- resources/views/ : Templates Blade
- database/migrations/ : Schéma DB
- config/ : Configuration

## Fichiers clés
- artisan : CLI Laravel
- composer.json : Dépendances
- .env : Variables d'environnement
`,
            },
          },
        },
        sections: [
          section(
            "Installation et prérequis",
            "Pour créer un projet Laravel, installe PHP 8.2+ et Composer, puis utilise la commande create-project.",
            [
              "Télécharge PHP depuis php.net (version 8.2 ou supérieure recommandée).",
              "Installe Composer depuis getcomposer.org (gestionnaire de dépendances PHP).",
              "Vérifie l'installation avec php -v et composer -V.",
              "Dans un dossier, exécute composer create-project laravel/laravel nom-projet.",
              "Entre dans nom-projet et lance php artisan serve.",
            ],
          ),
          section(
            "Structure type d'un projet Laravel",
            "Laravel impose une structure de dossiers claire. Chaque dossier a un rôle précis dans l'architecture MVC.",
            [
              "app/ : code métier de l'application (Models, Controllers, Services).",
              "app/Models/ : modèles Eloquent (Animal.php, User.php).",
              "app/Http/Controllers/ : contrôleurs qui gèrent les requêtes.",
              "bootstrap/ : fichiers d'initialisation du framework (ne pas modifier).",
              "config/ : fichiers de configuration (database.php, app.php, etc.).",
              "database/ : migrations, seeders (données de test), factories.",
              "public/ : point d'entrée web (index.php), assets (CSS, JS, images).",
              "resources/views/ : templates Blade (.blade.php).",
              "routes/ : définition des routes (web.php pour pages, api.php pour APIs).",
              "storage/ : fichiers générés (logs, cache, sessions, uploads).",
              "vendor/ : dépendances Composer (ignoré par Git).",
            ],
          ),
          section(
            "Fichiers clés à comprendre",
            "Certains fichiers sont essentiels pour comprendre et configurer ton application Laravel.",
            [
              "artisan : CLI Laravel. Tape php artisan list pour voir toutes les commandes.",
              "composer.json : liste des dépendances PHP. composer install les installe dans vendor/.",
              ".env : variables d'environnement (DB_CONNECTION, DB_DATABASE, APP_KEY). Ne jamais committer ce fichier !",
              ".env.example : template pour .env, committé dans Git.",
              "routes/web.php : routes pour les pages web (avec sessions, CSRF, cookies).",
              "routes/api.php : routes pour les APIs (sans état, préfixe /api).",
              "config/database.php : configuration des connexions DB (MySQL, SQLite, PostgreSQL).",
            ],
          ),
          section(
            "Architecture MVC dans Laravel",
            "Laravel suit strictement le pattern MVC. Comprendre ce découpage est essentiel.",
            [
              "Model (app/Models/) : représente une table. Animal.php ↔ table animals.",
              "View (resources/views/) : templates Blade. animals/index.blade.php affiche la liste.",
              "Controller (app/Http/Controllers/) : AnimalController gère les requêtes CRUD.",
              "Routes (routes/) : associent URLs et contrôleurs. Route::get('/animals', [AnimalController::class, 'index']).",
            ],
          ),
          section(
            "Exemple : Structure avec le modèle Animal",
            "Prenons un exemple concret : une API de gestion d'animaux (refuge ou zoo) avec SQLite et Eloquent.",
            [
              "app/Models/Animal.php : modèle Eloquent (extends Model).",
              "app/Http/Controllers/AnimalController.php : contrôleur avec méthodes CRUD.",
              "routes/api.php : Route::apiResource('animals', AnimalController::class).",
              "database/migrations/xxxx_create_animals_table.php : schéma de la table.",
              ".env : DB_CONNECTION=sqlite, DB_DATABASE=/absolute/path/database.sqlite.",
            ],
          ),
          section(
            "Premier projet Laravel minimal",
            "Un projet Laravel minimal démarre un serveur et affiche une page. Artisan génère la structure.",
            [
              "composer create-project laravel/laravel mon-projet : crée le projet.",
              "cd mon-projet : entre dans le dossier.",
              "php artisan serve : démarre le serveur sur http://127.0.0.1:8000.",
              "Ouvre http://127.0.0.1:8000 dans ton navigateur.",
              "Modifier routes/web.php : Route::get('/', fn() => 'Bonjour Laravel !').",
            ],
          ),
          section(
            "Exemple complet : API CRUD avec Animal",
            "Avec Eloquent et SQLite, tu peux créer une API CRUD complète en quelques commandes Artisan. Cet exemple sera le fil rouge du cours.",
            [
              "php artisan make:model Animal -m : crée le modèle + migration.",
              "Édite database/migrations/xxxx_create_animals_table.php : ajoute colonnes nom, espece, age, disponible, date_ajout.",
              "php artisan migrate : crée la table animals dans SQLite.",
              "php artisan make:controller AnimalController --api : génère le contrôleur API.",
              "Dans routes/api.php : Route::apiResource('animals', AnimalController::class).",
              "GET /api/animals : liste, POST /api/animals : création, PUT /api/animals/{id} : modification, DELETE /api/animals/{id} : suppression.",
              "Ce modèle Animal sera utilisé dans tous les frameworks backend (Django, Express, Laravel, Spring Boot) pour faciliter la comparaison.",
            ],
          ),
        ],
        task: "Crée un projet Laravel avec composer create-project. Lance php artisan serve et ouvre http://127.0.0.1:8000. Consulte la documentation Eloquent pour comprendre les modèles.",
        takeaway:
          "Un projet Laravel s'organise selon MVC : Models (Eloquent), Views (Blade), Controllers. Artisan génère les fichiers, Eloquent gère la base de données.",
        quiz: quiz(
          "Quel fichier définit les routes API dans Laravel ?",
          ["routes/web.php", "routes/api.php", "app/Models/Animal.php"],
          1,
          "routes/api.php définit les endpoints API (préfixe /api).",
        ),
        link: docs + "eloquent",
      }),
    ],
  },
  {
    id: "laravel-initialisation",
    title: "Initialisation et routage",
    description: "Installe un projet PHP et relie une URL à une réponse.",
    lessons: [
      lesson({
        id: "composer-artisan",
        title: "Créer un projet avec Composer et Artisan",
        minutes: 17,
        summary:
          "Composer installe les bibliothèques PHP. Artisan regroupe les commandes propres à ton projet Laravel, du serveur local aux migrations.",
        sections: [
          section(
            "Préparer ton dossier",
            'Vérifie php -v et composer -V. Pour créer un projet vide avec Laravel 12, lance composer create-project laravel/laravel mon-projet "^12.0". Entre ensuite dans mon-projet.',
            [
              "composer.json décrit les dépendances. Composer installe leurs fichiers dans vendor/.",
              "php artisan list affiche les commandes. php artisan serve démarre un serveur de développement.",
              "Le ZIP de l’atelier contient une application prête à configurer. Suis les commandes de lancement depuis le dossier contenant composer.json.",
            ],
          ),
        ],
        files: example(directory, "composer.json"),
        task: "Lance l’annuaire exporté, ouvre l’adresse indiquée dans le guide et essaie php artisan route:list dans un second terminal.",
        takeaway:
          "Composer gère les paquets PHP. Artisan agit sur ton application.",
        quiz: quiz(
          "Quel outil installe les dépendances de composer.json ?",
          ["Artisan", "Composer", "Blade"],
          1,
          "Composer lit composer.json et installe les dépendances.",
        ),
        link: docs + "installation",
      }),
      lesson({
        id: "routes-laravel",
        title: "URLs, verbes HTTP et noms de routes",
        minutes: 17,
        summary:
          "Laravel associe une méthode HTTP et une URL à une action. routes/web.php décrit les pages et les formulaires du site.",
        sections: [
          section(
            "Lire une route",
            "Route::get('/categories/{slug}', ...) répond à une lecture. Le segment {slug} est transmis à l’action. Le nom categories.show sert à générer le lien dans Blade.",
            [
              "GET lit les données. POST en crée ou déclenche une action. PUT et PATCH modifient. DELETE supprime.",
              "La même URL peut avoir des actions différentes selon la méthode.",
              "Les routes web profitent notamment de la session et du contrôle CSRF.",
            ],
          ),
        ],
        files: example(directory, "routes/web.php"),
        task: "Ouvre /categories/outils et /categories/inconnue. Observe les statuts dans l’onglet Réseau du navigateur.",
        takeaway: "Méthode et chemin identifient ensemble la route.",
        quiz: quiz(
          "Quelle méthode convient à la lecture d’une catégorie ?",
          ["POST", "DELETE", "GET"],
          2,
          "GET demande une représentation de la catégorie.",
        ),
        link: docs + "routing",
      }),
    ],
  },
  {
    id: "laravel-mvc",
    title: "Contrôleurs et architecture MVC",
    description: "Sépare la réponse HTTP, les données et leur présentation.",
    lessons: [
      lesson({
        id: "controleur-mvc",
        title: "Les rôles du modèle, de la vue et du contrôleur",
        minutes: 18,
        summary:
          "MVC signifie Modèle, Vue, Contrôleur. Le modèle représente les données. La vue les présente. Le contrôleur reçoit la requête, prépare les données et choisit une réponse.",
        sections: [
          section(
            "Relier une classe PHP à une route",
            "php artisan make:controller MonController crée une classe de contrôleur. Dans la route, [DirectoryController::class, 'show'] désigne sa classe et sa méthode.",
            [
              "Une classe rassemble des données et des comportements. public rend une méthode appelable depuis l’extérieur de la classe.",
              "private protège un détail interne, comme le tableau GROUPS.",
              "Un service peut porter une règle métier plus longue, appelée ensuite par le contrôleur.",
            ],
          ),
        ],
        files: example(
          directory,
          "app/Http/Controllers/DirectoryController.php",
        ),
        task: "Ajoute une catégorie dans GROUPS. Retrouve le même tableau dans l’accueil, la page de catégorie et la réponse JSON.",
        takeaway:
          "Le contrôleur coordonne l’action. La vue décide de la présentation.",
        quiz: quiz(
          "Où choisir la réponse à renvoyer pour une route ?",
          ["Dans le contrôleur", "Dans composer.json", "Dans le CSS"],
          0,
          "L’action du contrôleur renvoie une vue, du JSON ou une autre réponse.",
        ),
        link: docs + "controllers",
      }),
      lesson({
        id: "html-json-laravel",
        title: "Renvoyer une page HTML ou du JSON",
        minutes: 16,
        summary:
          "Une action peut rendre un template avec view() ou structurer des données avec response()->json(). Un navigateur, React ou une application mobile peut lire la réponse adaptée.",
        sections: [
          section(
            "Choisir une forme de réponse",
            "L’annuaire transmet groups à sa vue HTML. La route /api/categories retourne les mêmes données au format JSON.",
            [
              "Le contexte de view('directory', ['groups' => ...]) rend $groups disponible dans le template.",
              "abort_unless(..., 404) arrête la réponse si la catégorie demandée est inconnue.",
              "Lis les en-têtes et le corps de la réponse pour distinguer HTML et JSON.",
            ],
          ),
        ],
        files: example(
          directory,
          "app/Http/Controllers/DirectoryController.php",
        ),
        task: "Compare les réponses de / et /api/categories. Ajoute un nom à l’une des catégories et compare à nouveau.",
        takeaway: "Une même donnée peut alimenter un document HTML ou une API.",
        quiz: quiz(
          "Quel appel retourne une réponse JSON ?",
          ["view('directory')", "response()->json($data)", "route('home')"],
          1,
          "response()->json prépare le contenu JSON et son type MIME.",
        ),
        link: docs + "responses",
      }),
    ],
  },
  {
    id: "laravel-blade",
    title: "Templates et mises en page Blade",
    description:
      "Affiche des données, itère sur des listes et partage la structure.",
    lessons: [
      lesson({
        id: "blade-directives",
        title: "Variables, conditions et boucles",
        minutes: 18,
        summary:
          "Dans Blade, {{ $variable }} affiche du texte. Les directives @if et @foreach rendent les parties qui dépendent des données.",
        sections: [
          section(
            "Traiter une liste vide",
            "@forelse parcourt les liens quand ils existent. Sa branche @empty affiche un message quand il n’y a rien à parcourir.",
            [
              "Ferme les blocs avec @endif, @endforeach ou @endforelse.",
              "Blade échappe les expressions entre doubles accolades. Garde cet affichage pour les données saisies par les utilisateurs.",
              "Le contrôleur prépare les données. Le template les lit.",
            ],
          ),
        ],
        files: example(directory, "resources/views/category.blade.php"),
        task: "Ajoute une catégorie sans lien dans le contrôleur et vérifie que le message de la branche @empty apparaît.",
        takeaway:
          "Les directives expriment les décisions d’affichage dans le template.",
        quiz: quiz(
          "Quelle directive d’un bloc @forelse gère une liste vide ?",
          ["@yield", "@csrf", "@empty"],
          2,
          "@empty prépare le contenu de remplacement lorsque la boucle ne produit aucune ligne.",
        ),
        link: docs + "blade",
      }),
      lesson({
        id: "blade-layouts",
        title: "Partager un layout et des composants",
        minutes: 19,
        summary:
          "Le layout Blade définit la structure commune. Chaque page indique le layout à étendre puis remplit les sections propres à son contenu.",
        sections: [
          section(
            "Réutiliser la présentation",
            "layout.blade.php fournit l’en-tête et la feuille de style. @yield('content') réserve une place que le template enfant remplit avec @section.",
            [
              "Utilise @extends('layout') pour reprendre cette structure.",
              "Un composant Blade comme <x-card> peut aussi factoriser un bloc plus petit, avec des attributs et un contenu.",
              "Le blog relie un slug à un fichier connu. Le template échappe le texte lu et conserve les retours à la ligne.",
            ],
          ),
        ],
        files: example(blog, "resources/views/article.blade.php"),
        task: "Ajoute un pied de page au layout et vérifie qu’il apparaît sur l’accueil et sur chaque article.",
        takeaway:
          "Un layout partage l’ossature des pages. Un composant partage un élément plus petit.",
        quiz: quiz(
          "Quelle directive choisit le layout parent ?",
          ["@extends", "@forelse", "@csrf"],
          0,
          "@extends indique la vue dont hérite la page.",
        ),
        link: docs + "blade#template-inheritance",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "laravel-eloquent",
    title: "Migrations et ORM Eloquent",
    description: "Crée les tables et lis leurs données avec des modèles.",
    lessons: [
      lesson({
        id: "migrations-laravel",
        title: "Créer et faire évoluer les tables",
        minutes: 20,
        summary:
          "Une migration décrit une modification du schéma SQL. Laravel conserve celles qui ont déjà été exécutées.",
        sections: [
          section(
            "Décrire le schéma en PHP",
            "Dans up(), Schema::create définit les colonnes, les clés et les index. down() décrit l’opération inverse pour le développement.",
            [
              "php artisan make:migration add_priority_to_tasks_table prépare un fichier de migration.",
              "php artisan migrate applique les changements en attente. php artisan migrate:status indique leur état.",
              "Ajoute une nouvelle migration pour faire évoluer une table déjà partagée.",
            ],
          ),
        ],
        files: example(
          projects,
          "database/migrations/2026_01_01_000100_create_projects.php",
        ),
        task: "Lance les migrations et observe leur état. Crée une migration pour un champ priority avec une valeur par défaut.",
        takeaway:
          "Les migrations versionnent le schéma indépendamment des données saisies.",
        quiz: quiz(
          "Quelle commande applique les migrations en attente ?",
          ["php artisan serve", "php artisan migrate", "composer install"],
          1,
          "migrate exécute les opérations de schéma encore en attente.",
        ),
        link: docs + "migrations",
      }),
      lesson({
        id: "requeter-eloquent",
        title: "Créer un modèle et interroger les données",
        minutes: 20,
        summary:
          "Eloquent est l’ORM de Laravel. Un modèle représente les lignes d’une table et construit des requêtes à partir de méthodes PHP.",
        sections: [
          section(
            "Composer une requête",
            "php artisan make:model MonModele génère une classe. Project::all() lit toutes les lignes. Project::where('title', 'DevAfrica')->get() sélectionne un titre.",
            [
              "where compose le filtre et get exécute la lecture.",
              "Déclare les attributs acceptés par create dans $fillable. Utilise les données validées par le contrôleur.",
              "with(['tasks', 'labels']) précharge les relations pour le rendu de la liste.",
            ],
          ),
        ],
        files: example(projects, "app/Http/Controllers/ProjectController.php"),
        task: "Crée deux projets et remplace la requête d’accueil par un filtre sur l’un de leurs titres.",
        takeaway:
          "Le modèle expose des requêtes lisibles qui peuvent être combinées avant leur exécution.",
        quiz: quiz(
          "Quel appel exécute le filtre et retourne les résultats ?",
          ["where()", "get()", "with()"],
          1,
          "get exécute le Query Builder et renvoie sa collection.",
        ),
        link: docs + "eloquent",
      }),
    ],
  },
  {
    id: "laravel-relations",
    title: "Relations entre modèles",
    description: "Rattache une tâche à son projet et partage des étiquettes.",
    lessons: [
      lesson({
        id: "has-many-belongs-to",
        title: "Un projet et plusieurs tâches",
        minutes: 19,
        summary:
          "Une tâche appartient à un projet et un projet peut avoir plusieurs tâches. La clé project_id est stockée dans la table tasks.",
        sections: [
          section(
            "Lire et créer par la relation",
            "Project::tasks() définit hasMany. Task::project() définit belongsTo. $project->tasks()->create($data) renseigne automatiquement la clé du projet.",
            [
              "La route /projets/{project}/taches récupère le projet demandé. Un identifiant absent produit 404.",
              "La contrainte de clé étrangère garantit que la tâche pointe vers un projet existant.",
            ],
          ),
        ],
        files: example(projects, "app/Models/Project.php"),
        task: "Crée deux projets et une tâche différente dans chacun. Vérifie que la page regroupe les tâches par projet.",
        takeaway:
          "hasMany lit du parent vers ses enfants. belongsTo lit de l’enfant vers son parent.",
        quiz: quiz(
          "Où se trouve project_id dans cet exemple ?",
          ["Dans tasks", "Dans le layout", "Dans composer.json"],
          0,
          "La table du côté multiple porte la clé étrangère.",
        ),
        link: docs + "eloquent-relationships#one-to-many",
      }),
      lesson({
        id: "belongs-to-many",
        title: "Partager des étiquettes entre projets",
        minutes: 21,
        summary:
          "Plusieurs projets peuvent partager une étiquette. Un projet peut aussi en recevoir plusieurs. Laravel associe les deux modèles via une table pivot.",
        sections: [
          section(
            "Lire la table label_project",
            "Chaque ligne de la table pivot relie un label_id à un project_id. belongsToMany décrit la relation dans les deux modèles.",
            [
              "attach crée une liaison. sync remplace l’ensemble des liaisons d’un objet par les identifiants donnés.",
              "La clé primaire composée empêche d’associer deux fois la même étiquette au même projet.",
              "La transaction garde la création du projet et son association cohérentes.",
            ],
          ),
        ],
        files: example(projects, "app/Models/Label.php"),
        task: "Crée deux projets avec la même étiquette. Observe la relation et ajoute dans la vue le nombre d’étiquettes d’un projet.",
        takeaway:
          "Une table pivot représente les associations plusieurs-à-plusieurs.",
        quiz: quiz(
          "Quelle méthode Eloquent décrit les étiquettes partagées ?",
          ["belongsToMany", "belongsTo", "save"],
          0,
          "belongsToMany utilise une table intermédiaire.",
        ),
        link: docs + "eloquent-relationships#many-to-many",
      }),
    ],
  },
  {
    id: "laravel-formulaires",
    title: "Formulaires, validation et CSRF",
    description:
      "Vérifie les entrées côté serveur et protège les formulaires de session.",
    lessons: [
      lesson({
        id: "validation-laravel",
        title: "Valider les entrées et les dates",
        minutes: 22,
        summary:
          "$request->validate() applique les règles côté serveur avant l’écriture. Une règle d’interface, comme required sur un champ HTML, aide la saisie.",
        sections: [
          section(
            "Décrire les données attendues",
            "Pour publier un meetup, exige titre, lieu, description et date. after:now impose une heure future dans le fuseau utilisé par le serveur.",
            [
              "required, string et max contrôlent la forme. unique peut vérifier une adresse déjà enregistrée.",
              "En cas d’échec, un formulaire web revient avec les erreurs. Une API JSON peut répondre 422.",
              "Garde les contraintes de base et les paramètres des requêtes Eloquent. La validation décrit les règles métier.",
            ],
          ),
        ],
        files: example(meetups, "app/Http/Controllers/MeetupController.php"),
        task: "Inscris-toi dans l’atelier, essaie une date passée puis une date future et compare les résultats.",
        takeaway:
          "La validation côté serveur décide ce qui peut être enregistré.",
        quiz: quiz(
          "Quelle règle impose une date future ?",
          ["unique", "after:now", "required"],
          1,
          "after:now compare la valeur avec le moment courant.",
        ),
        link: docs + "validation",
      }),
      lesson({
        id: "csrf-laravel",
        title: "Protéger un formulaire avec @csrf",
        minutes: 18,
        summary:
          "Un navigateur peut joindre ses cookies à une requête déclenchée ailleurs. Le contrôle CSRF vérifie qu’un formulaire de modification possède le jeton attendu par la session.",
        sections: [
          section(
            "Envoyer le jeton depuis Blade",
            "La directive @csrf ajoute un champ caché. Le middleware de la route web compare la valeur à celle de la session.",
            [
              "Place @csrf dans les formulaires POST de l’application.",
              "L’authentification et les permissions s’appliquent aussi à la route.",
              "Un jeton manquant ou expiré peut donner une réponse 419.",
            ],
          ),
        ],
        files: example(meetups, "resources/views/meetups.blade.php"),
        task: "Ouvre les outils du navigateur et repère le champ _token généré dans le formulaire de publication.",
        takeaway:
          "La route authentifiée identifie le compte. Le contrôle CSRF vérifie la provenance de l’action liée à la session.",
        quiz: quiz(
          "Que génère @csrf dans un formulaire Blade ?",
          [
            "Un champ de jeton",
            "Une table de données",
            "Un cookie de connexion",
          ],
          0,
          "Blade rend le champ caché que vérifie le middleware.",
        ),
        link: docs + "csrf",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "laravel-auth-api",
    title: "Authentification et API REST",
    description:
      "Identifie les membres et prépare des réponses JSON explicites.",
    lessons: [
      lesson({
        id: "sessions-sanctum",
        title: "Sessions, starter kits et jetons Sanctum",
        minutes: 23,
        summary:
          "Un site Blade peut utiliser une session et un cookie. Sanctum fournit aussi des jetons personnels pour un client API, avec une durée et des capacités.",
        sections: [
          section(
            "Choisir comment le client s’identifie",
            "Le projet de tickets utilise la session de Laravel. Le forum reçoit un jeton dans l’en-tête Authorization: Bearer, puis auth:sanctum retrouve son compte.",
            [
              "Pour une SPA de première partie, Sanctum sait aussi utiliser des cookies et la protection CSRF.",
              "Les starter kits de Laravel accélèrent l’inscription et la connexion. Tu rencontreras Breeze et Jetstream dans des projets existants. Vérifie leur compatibilité et les kits proposés pour ta version.",
              "Le serveur hache les mots de passe, limite les tentatives et peut révoquer un jeton.",
            ],
          ),
        ],
        files: example(forum, "app/Http/Controllers/TokenController.php"),
        task: "Crée un compte de test, essaie une publication avec son jeton, révoque-le puis réessaie.",
        takeaway:
          "Le client prouve son identité et les routes décident quelles actions cette identité permet.",
        quiz: quiz(
          "Quel en-tête transmet le jeton dans ce projet ?",
          ["Content-Type", "Authorization", "Accept-Language"],
          1,
          "Authorization porte le préfixe Bearer suivi du jeton.",
        ),
        link: docs + "sanctum",
      }),
      lesson({
        id: "api-resources",
        title: "Structurer le JSON avec une API Resource",
        minutes: 20,
        summary:
          "Une API Resource transforme un modèle en représentation publique. Tu choisis les champs exposés et la façon de présenter les relations.",
        sections: [
          section(
            "Définir le contrat de sortie",
            "TopicResource renvoie le titre, le contenu, le nom public de l’auteur et l’URL des commentaires. Le client n’a pas besoin de connaître la table users.",
            [
              "php artisan make:resource TopicResource prépare une classe.",
              "Resource::collection peut transformer une liste paginée tout en conservant ses liens et métadonnées.",
              "Valide l’entrée séparément, puis renvoie 201 après la création.",
            ],
          ),
        ],
        files: example(forum, "app/Http/Resources/TopicResource.php"),
        task: "Publie un sujet et inspecte /api/topics. Ajoute à la ressource un champ public extrait du modèle.",
        takeaway:
          "Les ressources de l’API définissent un contrat stable pour le frontend.",
        quiz: quiz(
          "Où choisir les champs du JSON de sortie ?",
          [
            "Dans TopicResource",
            "Dans le fichier CSS",
            "Dans le transport mail",
          ],
          0,
          "La ressource transforme les champs du modèle en données de réponse.",
        ),
        link: docs + "eloquent-resources",
      }),
    ],
  },
  {
    id: "laravel-queues",
    title: "Jobs, files d’attente et événements",
    description: "Déplace l’envoi du courriel hors de la requête HTTP.",
    lessons: [
      lesson({
        id: "job-queue",
        title: "Confier un travail à un worker",
        minutes: 23,
        summary:
          "Un Job décrit un travail à exécuter. L’application place une tâche dans une file et un worker la récupère, par exemple pour envoyer un courriel ou générer un PDF.",
        sections: [
          section(
            "Suivre la confirmation du ticket",
            "Le contrôleur sauvegarde le ticket et place SendTicketConfirmation dans la file database. Le worker exécute ensuite handle().",
            [
              "php artisan make:job prépare une classe. ShouldQueue indique que le travail passe par la file.",
              "php artisan queue:work --stop-when-empty traite les tâches présentes et quitte quand la file est vide.",
              "Le transport de développement log écrit le courriel dans storage/logs/laravel.log.",
            ],
          ),
        ],
        files: example(support, "app/Jobs/SendTicketConfirmation.php"),
        task: "Ouvre un ticket, lance le worker puis cherche « Confirmation du ticket » dans le journal.",
        takeaway:
          "La réponse HTTP peut arriver dès que le travail de fond est enregistré.",
        quiz: quiz(
          "Qui exécute la méthode handle du job en attente ?",
          ["Le navigateur", "Le worker Laravel", "Blade"],
          1,
          "Le worker lit la file puis appelle handle.",
        ),
        link: docs + "queues",
      }),
      lesson({
        id: "evenements-laravel",
        title: "Déclencher un traitement au bon moment",
        minutes: 20,
        summary:
          "Un événement annonce qu’une action s’est produite. Plusieurs listeners peuvent y réagir. Un listener peut lui-même rejoindre une file.",
        sections: [
          section(
            "Relier l’action et ses conséquences",
            "Dans ce projet, le contrôleur distribue directement un job. Une variante peut publier TicketCreated et laisser un listener préparer le courriel.",
            [
              "Avec la file database de l’atelier, le ticket et le job sont écrits dans la même transaction.",
              "Avec une file externe, utilise afterCommit lorsque le job dépend des lignes de la transaction. Prévois la reprise si la mise en file échoue.",
              "Un worker peut réessayer un job. Conçois les effets pour éviter des doublons gênants.",
            ],
          ),
        ],
        files: example(support, "app/Http/Controllers/TicketController.php"),
        task: "Repère l’endroit où le ticket est créé. Décris le contenu minimal d’un événement TicketCreated et le rôle de son listener.",
        takeaway:
          "Le traitement en arrière-plan doit pouvoir lire des données déjà enregistrées.",
        quiz: quiz(
          "Quand un job externe dépendant d’un ticket doit-il être distribué ?",
          [
            "Après la validation de la transaction",
            "Avant la création du ticket",
            "À chaque lecture de la liste",
          ],
          0,
          "Le worker doit pouvoir retrouver le ticket validé.",
        ),
        link: docs + "events#queued-event-listeners",
      }),
    ],
  },
  {
    id: "laravel-tests-deploiement",
    title: "Tests et déploiement",
    description:
      "Vérifie les routes, les comptes et les jobs, puis prépare l’environnement du serveur.",
    lessons: [
      lesson({
        id: "feature-tests-laravel",
        title: "Tester une fonctionnalité avec PHPUnit ou Pest",
        minutes: 23,
        summary:
          "Un test de fonctionnalité traverse l’application. Il peut faire une requête, vérifier son statut, lire le JSON et inspecter les données en base.",
        sections: [
          section(
            "Définir un scénario qui prouve un droit",
            "ForumTest essaie une publication anonyme, obtient un jeton puis publie et révoque son accès. Les tests utilisent SQLite en mémoire.",
            [
              "RefreshDatabase isole l’état de test. postJson prépare une requête JSON.",
              "Queue::fake permet de vérifier l’enregistrement du job pendant un test de ticket.",
              "Le projet utilise PHPUnit via composer test. Pest permet d’écrire des scénarios équivalents avec une autre syntaxe.",
            ],
          ),
        ],
        files: example(forum, "tests/ForumTest.php"),
        task: "Lance composer test puis ajoute une vérification de la réponse quand le titre d’un sujet manque.",
        takeaway:
          "Un test vérifie à la fois le résultat attendu et les accès qui doivent être refusés.",
        quiz: quiz(
          "Qu’est-ce qu’un test de fonctionnalité peut vérifier ici ?",
          [
            "Le statut d’une requête réelle dans l’application de test",
            "Le débit de la connexion Internet",
            "La couleur de l’éditeur",
          ],
          0,
          "Le test envoie une requête à Laravel et inspecte la réponse.",
        ),
        link: docs + "http-tests",
      }),
      lesson({
        id: "production-laravel",
        title: "Préparer les variables, les caches et le worker",
        minutes: 24,
        summary:
          "Un serveur de production possède sa configuration, sa base et ses processus. Le dossier public/ sert de racine web. Les secrets sont fournis à l’application par son environnement.",
        sections: [
          section(
            "Construire une procédure de livraison",
            "Configure APP_KEY, APP_DEBUG=false et les paramètres de base et de mail. Installe les dépendances avec composer install --no-dev --optimize-autoloader.",
            [
              "Après configuration, php artisan config:cache et php artisan route:cache préparent les caches. Après une mise à jour, reconstruis-les.",
              "Applique les migrations et redémarre les workers avec un superviseur. Teste les routes et les jobs sur un environnement de préproduction.",
              "Un serveur Linux avec PHP-FPM ou un service comme Laravel Forge peut héberger le projet. Le guide officiel détaille les réglages.",
            ],
          ),
        ],
        files: example(support, ".env.example"),
        task: "Dans un dossier d’exercice, liste les variables à fournir au serveur et explique comment vérifier le worker après une mise à jour.",
        takeaway:
          "Le déploiement prépare la configuration, le schéma, les caches et les processus du serveur.",
        quiz: quiz(
          "Quel dossier le serveur web doit-il exposer ?",
          ["vendor/", "public/", "storage/"],
          1,
          "public/ contient le point d’entrée HTTP et les ressources publiques.",
        ),
        link: docs + "deployment",
      }),
    ],
  },
];

export const laravelLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "MVC, routes et vues Blade",
    definition:
      "Laravel est un framework web écrit en PHP. Il fournit les outils pour recevoir une requête, organiser le code du serveur et renvoyer une page HTML ou du JSON. Blade compose les pages et Eloquent relie le code à la base de données.",
    objective:
      "Installe une application, relie ses URLs à des contrôleurs et affiche des pages qui utilisent un layout commun.",
    color: levelColors[0],
    prerequisites:
      "Pour démarrer, révise les tableaux, les fonctions et les classes PHP, ainsi que la structure HTML.",
    outcomes: [
      "Installer les dépendances avec Composer et utiliser Artisan.",
      "Relier les verbes et URLs à un contrôleur MVC.",
      "Produire une réponse HTML ou JSON.",
      "Écrire des templates Blade avec des directives et un layout.",
    ],
    chapters: beginner,
    projects: laravelFoundationProjects[0],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Eloquent, migrations et formulaires",
    objective:
      "Enregistre des projets et des événements en base et applique des règles de validation côté serveur.",
    color: levelColors[1],
    prerequisites:
      "Pour démarrer, sache lire une route Laravel et transmettre ses données à Blade.",
    outcomes: [
      "Créer et appliquer des migrations.",
      "Filtrer une table avec Eloquent et charger des relations.",
      "Relier des modèles par clés étrangères et tables pivot.",
      "Valider des formulaires et ajouter le jeton CSRF.",
    ],
    chapters: intermediate,
    projects: laravelFoundationProjects[1],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Authentification, API, jobs et déploiement",
    objective:
      "Protège les écritures d’une API, prépare son JSON et confie un traitement à une file testée.",
    color: levelColors[2],
    prerequisites:
      "Pour démarrer, pratique les modèles, les formulaires et les relations Eloquent.",
    outcomes: [
      "Utiliser une session ou un jeton Sanctum selon le client.",
      "Formater les réponses avec les API Resources.",
      "Enregistrer un job et le traiter avec un worker.",
      "Tester les permissions et préparer la configuration du serveur.",
    ],
    chapters: advanced,
    projects: laravelAdvancedProjects,
  },
];
