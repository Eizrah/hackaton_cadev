import { pythonLevels } from "./pythonCourse";
import { scriptJsLevels } from "./scriptJsCourse";
import { typescriptLevels } from "./typescriptCourse";
import { phpLanguageLevels } from "./phpLanguageCourse";
import { sqlLevels } from "./sqlCourse";
import { webLevels, webTools } from "./htmlCssCourse";
import { javascriptLevels } from "./javascriptCourse";
import { reactLevels } from "./reactCourse";
import { vueLevels } from "./vueCourse";
import { djangoLevels } from "./djangoCourse";
import { laravelLevels } from "./laravelCourse";
import { springLevels } from "./springCourse";
import { nodeLevels } from "./nodeCourse";
import { kotlinLevels } from "./kotlinCourse";
import { composeLevels } from "./composeCourse";
import { javaAndroidLevels } from "./androidJavaCourse";
import { swiftLevels } from "./swiftCourse";
import { flutterLevels } from "./flutterCourse";
import { expoLevels } from "./expoCourse";
import { cLevels } from "./cCourse";
import { cppLevels } from "./cppCourse";
import { javaLevels } from "./javaCourse";
import type { DetailedCourseId, WebCurriculum } from "./webCourseTypes";
import { enrichCurricula } from "./coursePedagogy";

const baseCurricula: Record<DetailedCourseId, WebCurriculum> = {
  "html-css-web": {
    title: "HTML5 & CSS3",
    intro:
      "De ta première page à une interface qui prend vie. Un chapitre, un essai, un projet à la fois.",
    mode: "html-css",
    icons: ["HTML5", "CSS3"],
    levels: webLevels,
    toolbox: webTools,
  },
  "javascript-web": {
    title: "JavaScript",
    intro:
      "Fais réagir tes pages, travaille avec des données et organise de vraies applications dans l’atelier.",
    mode: "javascript",
    icons: ["JavaScript"],
    levels: javascriptLevels,
    toolbox: [
      ...webTools.slice(0, 3),
      {
        name: "MDN JavaScript",
        role: "Retrouver les notions de syntaxe, les exemples et les méthodes du langage.",
        url: "https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide",
      },
    ],
  },
  "react-web": {
    title: "React",
    intro:
      "Construis en composants, gère les interactions et relie tes écrans avec des routes et des données.",
    mode: "react",
    icons: ["React"],
    levels: reactLevels,
    toolbox: [
      webTools[0],
      {
        name: "Vite",
        role: "Créer un projet React et le lancer sur ton ordinateur.",
        url: "https://vite.dev/guide/",
      },
      {
        name: "React Learn",
        role: "Relire les composants, le JSX et les hooks dans le guide de React.",
        url: "https://react.dev/learn",
      },
      {
        name: "React Developer Tools",
        role: "Inspecter l’arbre des composants, les props et les rendus.",
        url: "https://react.dev/learn/react-developer-tools",
      },
    ],
  },
  "vue-web": {
    title: "Vue.js",
    intro:
      "Relie ton interface à des données réactives, assemble des composants et découvre Pinia, Vue Router et Nuxt.",
    mode: "vue",
    icons: ["Vue.js"],
    levels: vueLevels,
    toolbox: [
      webTools[0],
      {
        name: "Vue - Official",
        role: "Obtenir la coloration, les suggestions et la vérification des types pour les fichiers .vue dans VS Code.",
        url: "https://marketplace.visualstudio.com/items?itemName=Vue.volar",
      },
      {
        name: "Guide Vue 3",
        role: "Revoir les directives et les composants avec des exemples de Composition API.",
        url: "https://vuejs.org/guide/introduction.html",
      },
      {
        name: "Vue DevTools",
        role: "Observer les composants, leur état et les stores Pinia.",
        url: "https://devtools.vuejs.org/guide/installation",
      },
    ],
  },
  "django-web": {
    title: "Django",
    intro:
      "Construis des pages dynamiques et des API avec Python. Modifie les fichiers dans l’atelier puis lance le projet exporté sur ton ordinateur.",
    mode: "django",
    path: "backend",
    icons: ["Django", "Python"],
    levels: djangoLevels,
    toolbox: [
      webTools[0],
      {
        name: "Python et venv",
        role: "Installer Python et créer un environnement séparé pour les dépendances du projet.",
        url: "https://docs.python.org/fr/3/library/venv.html",
      },
      {
        name: "Guide Django",
        role: "Suivre le tutoriel officiel, du premier serveur aux vues et aux modèles.",
        url: "https://docs.djangoproject.com/fr/5.2/intro/tutorial01/",
      },
      {
        name: "Django REST Framework",
        role: "Construire une API et essayer ses réponses avec l’interface navigable.",
        url: "https://www.django-rest-framework.org/tutorial/quickstart/",
      },
    ],
  },
  "node-web": {
    title: "Node.js & Express",
    intro:
      "Crée des API JavaScript, relie-les à MongoDB puis construis des routes privées et un chat en temps réel.",
    mode: "node",
    path: "backend",
    icons: ["Node.js", "Express"],
    levels: nodeLevels,
    toolbox: [
      webTools[0],
      {
        name: "Node.js et npm",
        role: "Installer l’environnement qui exécute JavaScript sur ton ordinateur.",
        url: "https://nodejs.org/fr/download",
      },
      {
        name: "Guide Express",
        role: "Retrouver les routes, middlewares et exemples de serveur.",
        url: "https://expressjs.com/fr/starter/installing.html",
      },
      {
        name: "MongoDB Community",
        role: "Installer la base locale pour les ateliers intermédiaires et avancés.",
        url: "https://www.mongodb.com/docs/manual/administration/install-community/",
      },
    ],
  },
  "kotlin-mobile": {
    title: "Kotlin",
    intro:
      "Apprends le langage en console, des premières variables aux coroutines et aux flux de données.",
    mode: "kotlin",
    path: "android",
    icons: ["Kotlin"],
    levels: kotlinLevels,
    toolbox: [
      webTools[0],
      {
        name: "Kotlin Help",
        role: "Retrouver la syntaxe et les concepts du langage.",
        url: "https://kotlinlang.org/docs/basic-syntax.html",
      },
      {
        name: "Apache Maven",
        role: "Compiler et exécuter les exemples Kotlin/JVM de l’atelier.",
        url: "https://maven.apache.org/install.html",
      },
      {
        name: "Coroutines et Flow",
        role: "Approfondir la suspension et les flux asynchrones.",
        url: "https://kotlinlang.org/docs/coroutines-guide.html",
      },
    ],
  },
  "compose-mobile": {
    title: "Jetpack Compose",
    intro:
      "Applique tes bases Kotlin à des écrans Android avec Material 3, la navigation et les animations.",
    mode: "compose",
    path: "android",
    icons: ["Jetpack Compose", "Kotlin"],
    levels: composeLevels,
    toolbox: [
      {
        name: "Android Studio",
        role: "Ouvrir, compiler et lancer les projets Android de l’atelier.",
        url: "https://developer.android.com/studio",
      },
      {
        name: "Guide Jetpack Compose",
        role: "Relire les composables, l’état et les composants d’interface.",
        url: "https://developer.android.com/develop/ui/compose/documentation",
      },
      {
        name: "Émulateur Android",
        role: "Configurer un appareil virtuel pour essayer les écrans.",
        url: "https://developer.android.com/studio/run/emulator",
      },
      {
        name: "Material 3",
        role: "Retrouver les composants et les thèmes utilisés par les projets.",
        url: "https://developer.android.com/develop/ui/compose/designsystems/material3",
      },
    ],
  },
  "java-mobile": {
    title: "Java pour Android",
    intro:
      "Construis des écrans XML, ajoute des listes et relie tes applications à des données réseau et locales.",
    mode: "java-android",
    path: "android",
    icons: ["Java"],
    levels: javaAndroidLevels,
    toolbox: [
      {
        name: "Android Studio",
        role: "Ouvrir et compiler les projets Java, puis les lancer sur un appareil Android.",
        url: "https://developer.android.com/studio",
      },
      {
        name: "Vues et layouts Android",
        role: "Retrouver les conteneurs et composants utilisés dans les fichiers XML.",
        url: "https://developer.android.com/develop/ui/views/layout/declaring-layout",
      },
      {
        name: "Apprendre Java",
        role: "Revoir les types, classes, objets, méthodes et expressions lambda.",
        url: "https://dev.java/learn/",
      },
      {
        name: "Émulateur Android",
        role: "Créer un téléphone virtuel et tester les écrans, le réseau et la position.",
        url: "https://developer.android.com/studio/run/emulator",
      },
    ],
  },
  "swift-mobile": {
    title: "Swift & SwiftUI",
    intro:
      "Apprends la syntaxe Swift puis crée des écrans iOS avec la navigation, des données distantes et un stockage local.",
    mode: "swift",
    path: "ios",
    icons: ["Swift"],
    levels: swiftLevels,
    toolbox: [
      {
        name: "Xcode",
        role: "Installer l’environnement Apple sur Mac et lancer les ateliers sur un simulateur.",
        url: "https://developer.apple.com/xcode/",
      },
      {
        name: "Swift sur Windows",
        role: "Installer le compilateur pour exécuter le script de syntaxe de l’atelier débutant.",
        url: "https://www.swift.org/install/windows/",
      },
      {
        name: "Guide du langage Swift",
        role: "Revoir les types, les optionnels et les fonctions asynchrones.",
        url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/",
      },
      {
        name: "SwiftUI et SwiftData",
        role: "Retrouver les API des vues, de l’état, de la navigation et du stockage.",
        url: "https://developer.apple.com/tutorials/develop-in-swift",
      },
    ],
  },
  "flutter-mobile": {
    title: "Flutter & Dart",
    intro:
      "Construis des interfaces avec des widgets, partage un état et relie tes écrans à des API et à un stockage hors ligne.",
    mode: "flutter",
    path: "multiplateforme",
    icons: ["Flutter", "Dart"],
    levels: flutterLevels,
    toolbox: [
      {
        name: "SDK Flutter",
        role: "Installer le SDK et préparer un appareil Android ou un simulateur iOS.",
        url: "https://docs.flutter.dev/install",
      },
      {
        name: "Langage Dart",
        role: "Revoir les types, le null safety et les constructeurs utilisés dans les ateliers.",
        url: "https://dart.dev/language",
      },
      {
        name: "BLoC",
        role: "Organiser les événements et les états du catalogue de films.",
        url: "https://bloclibrary.dev/",
      },
      {
        name: "Isar Community",
        role: "Définir une collection et enregistrer la dernière météo sur l’appareil.",
        url: "https://pub.dev/packages/isar_community",
      },
    ],
  },
  "react-native-mobile": {
    title: "React Native",
    intro:
      "Compose des écrans natifs avec Expo, partage les données et construis des ateliers connectés en TypeScript.",
    mode: "expo",
    path: "multiplateforme",
    icons: ["React Native", "TypeScript"],
    levels: expoLevels,
    toolbox: [
      {
        name: "Expo Go",
        role: "Choisir la version compatible SDK 54 pour lancer l’atelier sur un appareil.",
        url: "https://expo.dev/go",
      },
      {
        name: "React Native",
        role: "Retrouver les composants de base, Flexbox et les listes virtualisées.",
        url: "https://reactnative.dev/docs/getting-started",
      },
      {
        name: "React Navigation",
        role: "Créer des onglets et configurer les routes et leurs paramètres.",
        url: "https://reactnavigation.org/docs/getting-started/",
      },
      {
        name: "Reanimated",
        role: "Animer des styles et respecter les préférences de mouvement.",
        url: "https://docs.swmansion.com/react-native-reanimated/",
      },
    ],
  },
  "php-web": {
    title: "Laravel",
    intro:
      "Construis des pages Blade, stocke tes données avec Eloquent puis crée des API et des jobs Laravel.",
    mode: "laravel",
    path: "backend",
    icons: ["Laravel", "PHP"],
    levels: laravelLevels,
    toolbox: [
      webTools[0],
      {
        name: "PHP",
        role: "Installer PHP et retrouver la syntaxe des classes, fonctions et tableaux.",
        url: "https://www.php.net/manual/fr/",
      },
      {
        name: "Composer",
        role: "Installer les dépendances décrites dans composer.json.",
        url: "https://getcomposer.org/doc/00-intro.md",
      },
      {
        name: "Guide Laravel",
        role: "Lire les commandes Artisan, les routes et les exemples Blade.",
        url: "https://laravel.com/docs/12.x/installation",
      },
    ],
  },
  "java-web": {
    title: "Spring Boot",
    intro:
      "Écris une API Java, relie-la à une base puis vérifie ses permissions avec Spring Security et des tests.",
    mode: "spring",
    path: "backend",
    icons: ["Spring Boot", "Java"],
    levels: springLevels,
    toolbox: [
      webTools[0],
      {
        name: "Spring Initializr",
        role: "Générer un projet Maven ou Gradle et choisir ses dépendances.",
        url: "https://start.spring.io/",
      },
      {
        name: "Apache Maven",
        role: "Installer Maven et comprendre les étapes de compilation et de test.",
        url: "https://maven.apache.org/install.html",
      },
      {
        name: "Guide REST avec Spring",
        role: "Suivre un premier contrôleur REST et lancer le serveur.",
        url: "https://spring.io/guides/gs/rest-service",
      },
    ],
  },
  "lang-c": {
    title: "C",
    intro:
      "Compile tes premières variables et fonctions, puis construis des fenêtres GTK 4 en comprenant la mémoire à chaque étape.",
    mode: "c",
    path: "langages",
    icons: ["C"],
    levels: cLevels,
    toolbox: [
      webTools[0],
      {
        name: "MSYS2 et GCC",
        role: "Préparer le compilateur C sous Windows et le terminal UCRT64 pour GTK 4.",
        url: "https://www.msys2.org/",
      },
      {
        name: "GTK 4",
        role: "Retrouver les widgets, les signaux et les règles de propriété des objets.",
        url: "https://docs.gtk.org/gtk4/getting_started.html",
      },
      {
        name: "Docker Desktop",
        role: "Activer le service local utilisé par le bouton Compiler et exécuter.",
        url: "https://docs.docker.com/desktop/setup/install/windows-install/",
      },
      {
        name: "Jason Champagne · C",
        role: "Approfondir les bases avec la formation C référencée dans son index public.",
        url: "https://www.youtube.com/playlist?list=PLrSOXFDHBtfHHRAZc013y4xNA6Y4B1CWP",
      },
    ],
  },
  "lang-cpp": {
    title: "C++",
    intro:
      "Maîtrise les pointeurs, l'héritage multiple et SQLite en console, puis construis des interfaces graphiques légères avec FLTK.",
    mode: "cpp",
    path: "langages",
    icons: ["C++"],
    levels: cppLevels,
    toolbox: [
      {
        name: "FLTK Documentation",
        role: "Explorer les widgets et les événements de l'interface graphique légère utilisée dans le niveau avancé.",
        url: "https://www.fltk.org/documentation.php",
      },
      {
        name: "SQLite C/C++",
        role: "Comprendre l'API sqlite3 pour les opérations CRUD dans les applications C++.",
        url: "https://www.sqlite.org/cintro.html",
      },
      {
        name: "C++ Reference",
        role: "Vérifier la syntaxe des classes, les références, les pointeurs et les conteneurs standard.",
        url: "https://en.cppreference.com/w/cpp.html",
      },
      {
        name: "Docker Desktop",
        role: "Activer la compilation et la console dans DevAfrica.",
        url: "https://docs.docker.com/desktop/setup/install/windows-install/",
      },
      {
        name: "Jason Champagne · C++",
        role: "Revoir la progression des bases aux classes dans sa formation C++.",
        url: "https://www.youtube.com/playlist?list=PLrSOXFDHBtfH0zk6o4qEOIMgCAy9hIurm",
      },
    ],
  },
  "lang-java": {
    title: "Java",
    intro:
      "Compile des classes, crée plusieurs instances et construis des interfaces JavaFX avec FXML et Scene Builder.",
    mode: "java",
    path: "langages",
    icons: ["Java"],
    levels: javaLevels,
    toolbox: [
      {
        name: "JDK 17 et Java",
        role: "Installer les outils de compilation et revoir les bases de Java.",
        url: "https://dev.java/learn/getting-started/",
      },
      {
        name: "OpenJFX et Maven",
        role: "Configurer et lancer les projets JavaFX 21 avec le JDK 17 ou une version plus récente.",
        url: "https://openjfx.io/openjfx-docs/",
      },
      {
        name: "Scene Builder",
        role: "Éditer les fichiers FXML et leurs composants avec un outil visuel.",
        url: "https://gluonhq.com/products/scene-builder/",
      },
      {
        name: "Docker Desktop",
        role: "Activer les exercices de console directement dans l’éditeur DevAfrica.",
        url: "https://docs.docker.com/desktop/setup/install/windows-install/",
      },
      {
        name: "Jason Champagne · Java",
        role: "Revoir les méthodes, les classes et les instances dans sa formation Java.",
        url: "https://www.youtube.com/playlist?list=PLrSOXFDHBtfGh4I9gaRvDA_A6JCO9iNDN",
      },
      {
        name: "Jason Champagne · JavaFX",
        role: "Prolonger la découverte des fenêtres et des événements graphiques.",
        url: "https://www.youtube.com/playlist?list=PLrSOXFDHBtfGs40s2u_cspUO4UPeVTrO4",
      },
    ],
  },
  "lang-python": {
    title: "Python",
    intro:
      "Des scripts de console aux fenêtres CustomTkinter. Comprends les données, les instances et la persistance dans un projet chiffré.",
    mode: "python",
    path: "langages",
    icons: ["Python"],
    levels: pythonLevels,
    toolbox: [
      webTools[0],
      {
        name: "Python",
        role: "Installer Python et relire les types, les fonctions et les classes.",
        url: "https://docs.python.org/fr/3/tutorial/",
      },
      {
        name: "CustomTkinter",
        role: "Préparer les widgets et leurs options de disposition et d’apparence.",
        url: "https://customtkinter.tomschimansky.com/documentation/",
      },
      {
        name: "Cryptography",
        role: "Comprendre Fernet et la dérivation de clé dans le coffre pédagogique.",
        url: "https://cryptography.io/en/48.0.1/fernet/",
      },
    ],
  },
  "lang-javascript": {
    title: "JavaScript",
    intro:
      "Étudie la logique des scripts avec Node.js puis construis une application de bureau Electron avec un pont IPC.",
    mode: "nodejs",
    path: "langages",
    icons: ["JavaScript", "Node.js"],
    levels: scriptJsLevels,
    toolbox: [
      webTools[0],
      {
        name: "Node.js",
        role: "Installer l’environnement de console et comprendre les modules et les scripts.",
        url: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
      },
      {
        name: "MDN JavaScript",
        role: "Relire objets, tableaux, fonctions et promesses.",
        url: "https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide",
      },
      {
        name: "Electron",
        role: "Créer une fenêtre et comprendre les processus, le preload et les échanges IPC.",
        url: "https://www.electronjs.org/docs/latest/tutorial/ipc",
      },
    ],
  },
  "lang-typescript": {
    title: "TypeScript",
    intro:
      "Exprime les contrats des données, vérifie les valeurs reçues et crée des fenêtres Qt avec NodeGui.",
    mode: "typescript",
    path: "langages",
    icons: ["TypeScript"],
    levels: typescriptLevels,
    toolbox: [
      webTools[0],
      {
        name: "TypeScript Handbook",
        role: "Comprendre types, interfaces, classes et génériques.",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
      },
      {
        name: "NodeGui",
        role: "Préparer l’outillage natif et parcourir l’API des widgets Qt.",
        url: "https://docs.nodegui.org/docs/guides/getting-started/",
      },
      {
        name: "Qode",
        role: "Comprendre le moteur qui combine la boucle Node et les événements Qt.",
        url: "https://github.com/nodegui/qodejs",
      },
    ],
  },
  "lang-php": {
    title: "PHP",
    intro:
      "Écris des scripts CLI, organise des objets puis construis un compteur et une caisse avec PHP Desktop.",
    mode: "php",
    path: "langages",
    icons: ["PHP"],
    levels: phpLanguageLevels,
    toolbox: [
      webTools[0],
      {
        name: "PHP CLI",
        role: "Lancer un script et retrouver les fonctions et les types PHP.",
        url: "https://www.php.net/manual/fr/features.commandline.php",
      },
      {
        name: "PHP Desktop",
        role: "Installer le moteur de bureau et y placer le dossier www de l’atelier.",
        url: "https://github.com/cztomczak/phpdesktop",
      },
      {
        name: "PHP et les classes",
        role: "Relire constructeurs, visibilité et méthodes.",
        url: "https://www.php.net/manual/fr/language.oop5.php",
      },
    ],
  },
  "lang-sql": {
    title: "SQL",
    intro:
      "Écris tes requêtes dans un terminal, observe les tables et construis des rapports avec SQLite dans ton navigateur.",
    mode: "sql",
    path: "langages",
    icons: ["SQL"],
    levels: sqlLevels,
    toolbox: [
      {
        name: "SQLite",
        role: "Retrouver la syntaxe des tables, des jointures et des agrégations du moteur utilisé ici.",
        url: "https://www.sqlite.org/lang.html",
      },
      {
        name: "DB Browser for SQLite",
        role: "Ouvrir sur ton ordinateur la base .sqlite exportée depuis l’atelier.",
        url: "https://sqlitebrowser.org/",
      },
      {
        name: "Plan d’exécution SQLite",
        role: "Comprendre SCAN, SEARCH et les index utilisés par les requêtes.",
        url: "https://www.sqlite.org/eqp.html",
      },
      {
        name: "PostgreSQL et SQL",
        role: "Comparer les concepts relationnels et identifier les différences de dialecte.",
        url: "https://www.postgresql.org/docs/current/tutorial-sql.html",
      },
    ],
  },
};

export const webCurricula = enrichCurricula(baseCurricula);
