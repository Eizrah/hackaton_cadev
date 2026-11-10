# Langages de programmation

## Cette mise à jour

Ce guide décrit les salles C, C++ et Java. Les parcours Python, JavaScript, TypeScript, PHP et SQL sont décrits dans `docs/APPRENTISSAGE_SCRIPTS_SQL.md`. Chaque salle reprend le sommaire, les niveaux, les quiz, la progression locale, l’éditeur et les exports des cours existants.

| Cours | Débutant | Intermédiaire | Avancé |
| --- | --- | --- | --- |
| C | 8 leçons sur GCC, types, saisie, logique, fonctions et tableaux | 6 leçons sur pointeurs, structures, GTK 4 et rappels | 6 leçons sur allocations, chaînes, grille et document GTK |
| C++ | 8 leçons sur flux, fonctions, références, classes et instances | 6 leçons sur héritage, Qt 6, widgets et signaux | 6 leçons sur polymorphisme, propriété, Designer et modèles |
| Java | 8 leçons sur JVM, types, Scanner, méthodes, listes et instances | 6 leçons sur exceptions, JavaFX et actions | 6 leçons sur références, records, FXML et contrôleurs |

Les exemples distinguent la définition d’un type, la création d’une instance et l’appel d’une fonction ou méthode. Les exercices demandent de prédire le résultat, modifier une donnée puis compiler pour vérifier.

| Cours | Projets débutants | Projet intermédiaire | Projet avancé |
| --- | --- | --- | --- |
| C | Calculatrice et jeu du plus ou moins | Compteur GTK | Bloc-notes GTK |
| C++ | Compte bancaire en console | Progression Qt | Profils d’employés avec Qt Designer |
| Java | Liste de tâches en console | Convertisseur JavaFX | Carnet de contacts avec FXML |

Les dix projets suivent le programme fourni. Les explications et les exemples DevAfrica ont été rédigés pour cette plateforme. La boîte à outils renvoie aux formations de Jason Champagne ainsi qu’aux documentations des technologies. L’index public de ses formations est disponible sur [EvoluNoob](https://github.com/jasonchampagne/EvoluNoob).

## Activer Compiler et exécuter sous Windows

1. Installe Docker Desktop et choisis le moteur de conteneurs Linux. Suis les prérequis Windows et WSL 2 de sa documentation.
2. Démarre Docker Desktop et attends que son moteur soit prêt.
3. Dans VS Code, ouvre le dossier `frontend` contenant `package.json`, puis ouvre son terminal.
4. Installe les dépendances, construis l’image une fois et lance le site.

```powershell
npm ci
npm run compiler:build
npm run dev
```

Le premier build télécharge Debian et les compilateurs. Le bouton de console utilise ensuite l’image locale `devafrica-compiler:1`. Relance `npm run compiler:build` après une modification de `compiler/Dockerfile` ou `compiler/runner.py`.

La commande `npm ci` s’exécute dans `frontend`, où se trouve le `package-lock.json` fourni. Depuis `hackaton_cadev`, commence par `cd frontend`.

Documentation d’installation de [Docker Desktop sous Windows](https://docs.docker.com/desktop/setup/install/windows-install/).

## Utiliser la console de l’atelier

1. Ouvre Apprentissage, Langages de programmation, puis C, C++ ou Java.
2. Choisis un niveau et une leçon puis clique sur **Essayer dans l’atelier**.
3. Écris les valeurs demandées dans **Entrée standard (stdin)**, dans l’ordre des lectures du programme. L’exemple est prérempli lorsqu’une saisie est nécessaire.
4. Clique sur **Compiler et exécuter** ou utilise Ctrl + Entrée.
5. Lis les diagnostics du compilateur, la sortie et les éventuelles erreurs d’exécution.

Les entrées sont fournies en une fois au démarrage. Pour tester une autre saisie, modifie cette zone puis relance. Les fichiers ajoutés peuvent être supprimés avec la corbeille et leurs noms sont affichés en blanc.

| Langage | Outils de la console | Fichier d’entrée |
| --- | --- | --- |
| C | GCC, standard C17 | `main.c` |
| C++ | G++, standard C++20 | `main.cpp` |
| Java | JDK 17 | `Main.java`, classe publique `Main` |
| Python | Python 3 | `main.py` |
| JavaScript | Node.js 24 | `main.mjs` |
| TypeScript | tsc 6.0.3 puis Node.js 24 | `main.ts` |
| PHP | PHP CLI avec mbstring et readline | `main.php` |

Le compilateur reçoit les unités source et en-têtes de l’atelier. Les fichiers texte de consignes restent disponibles dans l’éditeur et dans le ZIP. Les exercices C et C++ peuvent comporter plusieurs unités source. Java compile toutes les classes fournies puis lance `Main`.

## Comprendre les interfaces graphiques

Les leçons intermédiaires et avancées introduisent progressivement le framework graphique de leur langage. Le bouton **Guide de lancement** présente les outils et commandes. **Exporter le ZIP** fournit les sources, la configuration et un README propre au projet.

| Interface | Préparation sur ton ordinateur | Lancement |
| --- | --- | --- |
| GTK 4 en C | MSYS2, terminal UCRT64, GCC, GTK 4 et pkg-config | Commande GCC du README, puis `./atelier` dans UCRT64 |
| Qt 6 en C++ | Qt Creator, Qt Widgets et kit Desktop compatible | Ouvrir `CMakeLists.txt`, sélectionner le kit puis Exécuter |
| JavaFX 21 | JDK 17 ou plus récent et Maven | `mvn javafx:run` depuis le dossier du projet |
| FXML | Les outils JavaFX et Scene Builder | Ouvrir `contacts.fxml` pour la disposition et lancer le projet avec Maven |

Les fenêtres graphiques s’affichent sur l’ordinateur où le projet exporté est lancé. Les exercices de variables, de fonctions et d’instances utilisent la console intégrée.

Le convertisseur applique un taux fictif fixe de 5 000 Ar pour un euro. Les listes de tâches, profils et contacts restent en mémoire pendant leur session.

## Service de compilation et Django

Pendant `npm run dev` et `npm run preview`, le middleware Vite reçoit les requêtes de la console à `/api/atelier/compilation`. Les autres routes `/api` du serveur de développement continuent d’utiliser le proxy Django configuré dans `vite.config.ts`.

Chaque essai crée un conteneur Docker séparé, le lance avec les fichiers reçus et le supprime à la fin. Le conteneur utilise un utilisateur dédié, un système racine en lecture seule, des répertoires temporaires bornés, une limite de mémoire de 384 Mio, un processeur, 64 processus et un réseau isolé. La compilation dispose de 10 secondes et l’exécution de 3 secondes. Chaque étape limite ses sorties à 16 Kio. Le courtier local accepte deux essais simultanés et trente demandes par minute.

Pour servir le frontend construit derrière Django, lance le courtier séparé sur l’interface locale du serveur.

```bash
npm run compiler:serve
```

Django ou le reverse proxy doit transmettre l’URL de compilation à `http://127.0.0.1:8026/api/atelier/compilation`. L’en-tête Host de la requête transmise doit devenir `127.0.0.1:8026`. Le courtier vérifie Host, Origin et Sec-Fetch-Site. Le proxy doit d’abord vérifier l’origine publique autorisée et l’utilisateur, puis supprimer ces deux derniers en-têtes sur la requête interne. Conserve le courtier sur loopback et installe les limites et droits par utilisateur au niveau de la passerelle publique. Prévois un hôte de compilation dédié pour la plateforme publiée.

Le dossier `dist` contient le frontend construit. Le service de compilation est démarré séparément sur l’hôte disposant de Docker.

## Fichiers à lire

| Fichier | Responsabilité |
| --- | --- |
| `src/data/cCourse.ts` | Programme C en trois niveaux |
| `src/data/cppCourse.ts` | Programme C++ en trois niveaux |
| `src/data/javaCourse.ts` | Programme Java en trois niveaux |
| `src/data/desktopAuthoring.ts` | Génération des fichiers console, GTK, Qt et JavaFX |
| `src/data/cProjects.ts`, `cppProjects.ts`, `javaProjects.ts` | Dix projets avec leurs sources |
| `src/components/learning/CompiledStudioPanel.tsx` | Entrées, résultats et aide de configuration |
| `src/lib/compileInStudio.ts` | Appel HTTP depuis le frontend |
| `compiler/api.ts` | Validation des demandes et cycle des conteneurs |
| `compiler/runner.py` | Appels réels à GCC, G++, javac et java |
| `compiler/server.ts` | Courtier autonome pour l’intégration Django |
| `compiler/Dockerfile` | Image des compilateurs |
