import type { DetailedCourseId } from "./webCourseTypes";

export type CourseFoundation = {
  definition: string;
  execution: string;
  journey: string[];
  terms: string[];
};

const javascriptExecution = "JavaScript est généralement interprété puis compilé à la volée par un moteur comme V8 : JIT signifie Just-In-Time, « juste à temps ». Le moteur peut transformer les passages souvent utilisés en instructions machine pendant l’exécution. Dans le navigateur, il agit sur la page ; avec Node.js, il s’exécute aussi hors du navigateur. Java et JavaScript sont deux langages distincts.";
const javaExecution = "Java passe par deux étapes : javac compile les fichiers .java en bytecode .class ; la JVM (Java Virtual Machine, machine virtuelle Java) exécute ce bytecode, par interprétation et compilation JIT. Le JDK (Java Development Kit, kit de développement Java) contient le compilateur et les outils nécessaires. Un programme Java n’est donc pas simplement un texte lu ligne par ligne.";
const pythonExecution = "Python est habituellement qualifié d’interprété. Avec CPython, le code source .py est d’abord compilé en bytecode, puis exécuté par une machine virtuelle Python. Tu lances un script avec python main.py : tu n’as pas à fabriquer toi-même un exécutable avant chaque essai. Une erreur de syntaxe et une erreur rencontrée pendant l’exécution sont deux situations différentes.";
const phpExecution = "PHP signifie PHP: Hypertext Preprocessor, un acronyme récursif : son développement reprend le nom PHP lui-même. C’est un langage généralement interprété : son moteur transforme le source en instructions intermédiaires puis les exécute. En CLI (Command-Line Interface, interface en ligne de commande), le résultat va dans le terminal ; sur un serveur web, le résultat est envoyé au navigateur. Le navigateur ne reçoit pas le code PHP du serveur.";

export const courseFoundations: Record<DetailedCourseId, CourseFoundation> = {
  "html-css-web": {
    definition: "HTML signifie HyperText Markup Language, « langage de balisage hypertexte ». Il nomme le rôle du contenu : titre, paragraphe, lien, image. CSS signifie Cascading Style Sheets, « feuilles de style en cascade ». Il règle l’apparence : couleur, taille, espacement et disposition. HTML5 désigne une évolution majeure de HTML ; CSS3 regroupe des évolutions de CSS organisées aujourd’hui en modules. Tu apprendras les bases utilisées dans les navigateurs actuels.",
    execution: "HTML est un langage de balisage et CSS un langage de style, pas des langages de programmation généralistes à classer comme C ou Python. Le navigateur analyse le HTML, construit une représentation du document, applique le CSS puis dessine la page. Tu peux commencer sans compilateur et sans JavaScript.",
    journey: ["Crée un dossier, c’est-à-dire un emplacement qui regroupe tes fichiers. Un fichier .html contient le document ; un fichier .css contient ses styles. L’extension est la partie après le dernier point dans le nom.", "Écris un titre dans index.html et une règle de couleur dans styles.css. Le lien entre les deux fichiers se déclare dans head, la partie du document qui décrit la page. Le contenu visible se trouve dans body.", "Ouvre l’exemple, modifie une seule valeur, lance l’aperçu puis compare. Enregistrer conserve ton texte ; exécuter ou actualiser demande au navigateur de relire ce texte."],
    terms: ["html", "css", "balise", "head", "body", "dom", "attribut"],
  },
  "javascript-web": {
    definition: "JavaScript est un langage de programmation : il permet d’écrire des instructions, de calculer et de réagir aux actions. HTML décrit un bouton, CSS le dessine, JavaScript décide ce qui se passe quand on clique. Dans ce cours, ton programme s’exécute dans le navigateur et peut modifier le document visible.",
    execution: javascriptExecution,
    journey: ["Repère d’abord le HTML qui présente le contenu, puis le fichier script.js qui contient les instructions. Les deux fichiers sont liés par un élément script.", "Une variable nomme une donnée ; une fonction regroupe des instructions ; un événement signale une action, par exemple un clic. Tu découvriras chaque mot avec un exemple avant de les combiner.", "La console montre les messages de console.log et les erreurs. Elle est différente du texte affiché dans la page. Fais un essai, lis le résultat puis change une donnée."],
    terms: ["javascript", "dom", "variable", "fonction", "evenement", "console"],
  },
  "react-web": {
    definition: "React est une bibliothèque JavaScript pour construire une interface avec des composants, des morceaux réutilisables comme une carte ou un bouton. Une bibliothèque propose des fonctions que ton code utilise. React ne remplace pas HTML, CSS et JavaScript : il les organise autour de composants et de données.",
    execution: "React n’est pas un langage compilé ou interprété : c’est une bibliothèque. Le JSX, syntaxe qui ressemble à du HTML dans JavaScript, est transformé par l’outillage en JavaScript exécutable. Le moteur JavaScript du navigateur exécute ensuite le résultat, généralement avec interprétation et compilation JIT.",
    journey: ["Observe comment une page entière se découpe en petits composants. Le nom d’un composant React commence par une majuscule, comme CarteProfil.", "Les props sont des données reçues ; le state, ou état, est une mémoire qui peut évoluer. Changer cet état avec sa fonction dédiée demande à React de mettre l’affichage à jour.", "Dans l’atelier, les outils sont prêts. Sur ton ordinateur, Vite prépare le projet et npm installe ses dépendances : des bibliothèques dont le projet a besoin."],
    terms: ["composant", "jsx", "props", "state", "dom", "npm", "vite"],
  },
  "vue-web": {
    definition: "Vue.js est un framework JavaScript progressif pour créer des interfaces. Un framework fournit une organisation et des outils communs. Vue relie des données à une présentation : quand une donnée réactive change, le contenu qui en dépend peut être mis à jour. Un composant .vue regroupe généralement sa présentation, sa logique et ses styles.",
    execution: "Vue n’est pas un langage indépendant. Avec Vite, les fichiers .vue sont transformés en JavaScript et en CSS. Le navigateur exécute ce JavaScript avec son moteur. La version CDN peut aussi compiler certains templates dans le navigateur. Le parcours privilégie la Composition API et script setup.",
    journey: ["Lis template comme la partie qui décrit la présentation, script setup comme la logique et style comme les règles d’apparence.", "ref crée une donnée réactive. Dans le script on accède à sa valeur avec .value ; dans le template Vue expose cette valeur automatiquement.", "Une directive est une instruction spéciale dans le template : v-if choisit ce qui apparaît, v-for répète, v-model relie un champ et une donnée."],
    terms: ["framework", "composant", "template", "reactivite", "directive", "ref", "v-model"],
  },
  "django-web": {
    definition: "Django est un framework web écrit en Python qui s’exécute sur le serveur. Le serveur est le programme qui reçoit une demande du navigateur et prépare une réponse. Django fournit une organisation pour les URL, les données, les pages et les utilisateurs. MTV signifie Model–Template–View : modèle pour les données, gabarit pour la présentation, vue pour la logique de la requête.",
    execution: "Django est un framework, pas un nouveau langage. Il utilise Python, généralement interprété après une compilation interne en bytecode. Le serveur exécute Python ; le navigateur reçoit du HTML ou des données JSON, jamais les instructions Python du serveur.",
    journey: ["Un projet est la configuration globale du site : réglages, URL principales et démarrage. Une application est un module fonctionnel, par exemple blog ou comptes. Un projet peut contenir plusieurs applications.", "Le trajet est : navigateur → URL → vue Python → données du modèle si nécessaire → template si nécessaire → réponse. Une vue peut aussi renvoyer directement du texte ou du JSON.", "Commence par un projet et une application, puis une URL et une vue simples. Les modèles, migrations et comptes d’administration arrivent ensuite, avec un exemple de gestion de tâches."],
    terms: ["django", "http", "mtv", "projet-django", "application-django", "template", "vue-django", "orm"],
  },
  "node-web": {
    definition: "Node.js est un environnement qui exécute JavaScript hors du navigateur, par exemple pour lire un fichier ou créer un serveur. Express est un framework qui simplifie l’écriture de ce serveur : une route associe une adresse et une méthode HTTP à une fonction de réponse. Node.js et Express n’ajoutent pas un nouveau langage.",
    execution: javascriptExecution,
    journey: ["package.json décrit le projet et ses dépendances. npm est le gestionnaire de paquets livré avec Node.js ; un paquet est du code réutilisable que tu installes.", "Un client envoie une requête ; le serveur l’écoute sur un port, comme 3000, et répond. Un port est un numéro qui permet de joindre un service sur une machine.", "Commence par une réponse texte. Ajoute ensuite un tableau de tâches en mémoire, puis des routes pour créer, lire, modifier et supprimer une tâche. Une base durable viendra plus tard."],
    terms: ["node", "express", "npm", "http", "route", "callback", "asynchrone"],
  },
  "php-web": {
    definition: "Laravel est un framework web PHP. Il organise un site en routes, contrôleurs, modèles et vues. MVC signifie Model–View–Controller : le modèle travaille avec les données, la vue présente le résultat et le contrôleur coordonne une action. Blade est son moteur de templates : il fabrique du HTML à partir d’un gabarit et de données.",
    execution: phpExecution,
    journey: ["Composer installe les dépendances PHP du projet. Artisan est l’outil de commande de Laravel : php artisan lance une action dans ce projet.", "Une route reçoit une requête, un contrôleur choisit le traitement, un modèle Eloquent lit ou écrit en base et une vue Blade prépare le HTML.", "Commence par une page qui répond, puis transmets-lui une donnée. Les migrations et les opérations CRUD seront expliquées sur des modèles concrets."],
    terms: ["php", "framework", "mvc", "composer", "artisan", "template", "eloquent", "crud"],
  },
  "java-web": {
    definition: "Spring Boot aide à créer des applications Java en configurant des composants Spring. Une application serveur reçoit des requêtes HTTP et renvoie des réponses. Une API expose des adresses permettant à un autre programme, comme notre frontend, de demander des données ou des opérations. Un contrôleur associe ces adresses à des méthodes Java.",
    execution: javaExecution,
    journey: ["Spring Initializr génère la structure du projet. Maven lit pom.xml pour télécharger les dépendances et lancer les étapes de compilation.", "Une classe est un plan ; un objet est une instance construite d’après ce plan. Spring peut créer ces objets et les fournir à d’autres objets : c’est l’injection de dépendances.", "Commence par une route qui renvoie du texte ou du JSON. Observe ensuite les paramètres reçus et leur validation avant d’ajouter une base de données."],
    terms: ["java", "jvm", "jdk", "maven", "api", "injection", "annotation", "dto"],
  },
  "kotlin-mobile": {
    definition: "Kotlin est un langage de programmation utilisé notamment pour Android. Une instruction réalise une action, une variable conserve une donnée et une fonction regroupe un traitement. Dans ce premier parcours, tu pratiques en console pour comprendre le langage avant de construire des écrans.",
    execution: "Dans ces exemples Kotlin/JVM, le compilateur transforme le code .kt en bytecode exécuté par la JVM. Sur Android, l’outillage produit du bytecode DEX exécuté par ART (Android Runtime). Kotlin possède aussi d’autres cibles, comme Kotlin/Native ; ce n’est pas l’environnement de ces premiers exercices.",
    journey: ["main est le point d’entrée du programme, l’endroit où l’exécution commence. println écrit une ligne dans la console.", "val empêche de réaffecter une variable ; var autorise une nouvelle affectation. Un type indique les données attendues : Int pour un entier, String pour un texte.", "Le signe ? dans String? autorise l’absence de valeur, appelée null. On apprend à traiter ce cas avant de lire la valeur."],
    terms: ["variable", "type", "fonction", "main", "console", "null", "jvm"],
  },
  "compose-mobile": {
    definition: "Jetpack Compose est une boîte à outils pour décrire des interfaces Android en Kotlin. Une fonction composable décrit une partie de l’écran. L’approche est déclarative : tu décris ce que l’écran doit montrer pour un état donné, puis Compose met la présentation à jour quand cet état change.",
    execution: "Compose n’est pas un langage : il utilise Kotlin compilé par les outils Android. Le programme est lancé dans l’environnement Android sur un appareil ou un émulateur. Les projets exportés se compilent dans Android Studio ; une fenêtre Android native n’est pas exécutée dans l’aperçu web.",
    journey: ["Android Studio est l’environnement de développement ; un émulateur simule un téléphone sur ton ordinateur. Choisir un appareil est nécessaire pour afficher l’application.", "Une Activity représente un point d’entrée d’interface Android. setContent installe le contenu Compose, puis Text affiche du texte et Button représente un bouton.", "Row range horizontalement, Column verticalement et Box superpose. Modifier décrit la taille, les espaces ou le fond d’un composant."],
    terms: ["ide", "emulateur", "activity", "composable", "state", "modifier", "sdk"],
  },
  "java-mobile": {
    definition: "Java pour Android combine le langage Java et les outils Android. Un fichier XML décrit des éléments d’interface, appelés vues ; une Activity Java les prépare et réagit aux actions. XML signifie eXtensible Markup Language, « langage de balisage extensible ». Ici XML décrit une interface, tandis que Java décrit son comportement.",
    execution: "Le code Java est compilé puis transformé par l’outillage Android en bytecode DEX, exécuté par ART (Android Runtime). Android ne lance pas directement le fichier .java. Gradle orchestre la construction du projet et de l’APK (Android Package), le paquet d’installation.",
    journey: ["Repère app/src/main/java pour les classes et app/src/main/res/layout pour les fichiers XML d’écran. Le manifeste déclare les composants de l’application.", "Une vue possède un identifiant comme @+id/bouton. findViewById retrouve cette vue ; un écouteur de clic relie une action à ce bouton.", "Une Activity a un cycle de vie : elle peut être créée, interrompue puis recréée. L’état important doit être restauré au bon moment."],
    terms: ["java", "xml", "activity", "classe", "instance", "evenement", "gradle", "apk"],
  },
  "swift-mobile": {
    definition: "Swift est un langage de programmation, SwiftUI une boîte à outils pour les interfaces des plateformes Apple. Une View décrit une partie de la présentation. Un protocole est un contrat de capacités : en adoptant View, une structure fournit un contenu body que SwiftUI sait afficher.",
    execution: "Swift est généralement compilé à l’avance en code machine. Xcode construit et lance l’application iOS sur un simulateur ou un appareil. Le compilateur Swift existe aussi sur Windows pour les scripts ; les interfaces SwiftUI iOS de ce cours se testent avec les outils Apple sur Mac.",
    journey: ["Une variable déclarée avec var peut être réaffectée ; let définit une valeur qui ne sera pas réaffectée. Un optionnel comme String? peut contenir une valeur ou nil, l’absence de valeur.", "Text affiche un texte. VStack, HStack et ZStack organisent les vues verticalement, horizontalement ou en superposition.", "@State donne à SwiftUI une mémoire locale. Modifier cet état déclenche une nouvelle description de l’interface."],
    terms: ["swift", "protocole", "optionnel", "state", "compilation", "emulateur"],
  },
  "flutter-mobile": {
    definition: "Flutter est une boîte à outils d’interface multiplateforme et Dart est le langage utilisé pour écrire ses programmes. Un widget décrit un morceau d’interface : texte, bouton ou groupe d’éléments. Un arbre de widgets est une organisation où chaque composant peut contenir d’autres composants.",
    execution: "Dart peut utiliser la compilation JIT pendant le développement pour accélérer les essais, et AOT (Ahead-Of-Time, à l’avance) en code machine pour les applications natives de production. Pour le web, Dart peut être compilé en JavaScript ou WebAssembly selon la cible. Flutter ne constitue pas un nouveau langage.",
    journey: ["Le SDK (Software Development Kit, kit de développement logiciel) regroupe les outils Flutter. flutter doctor vérifie leur installation et les cibles disponibles.", "main démarre le programme et runApp installe le widget racine. StatelessWidget décrit une interface sans état local modifiable dans ce widget.", "StatefulWidget est associé à un objet State. setState signale qu’une donnée de cet état a changé et que l’interface doit être reconstruite."],
    terms: ["flutter", "dart", "sdk", "gui", "state", "constructeur", "compilation"],
  },
  "react-native-mobile": {
    definition: "React Native utilise React pour décrire des interfaces natives mobiles en JavaScript ou TypeScript. View est un conteneur, Text affiche du texte et Pressable réagit à une pression. Ces composants correspondent à des éléments natifs, ils ne sont pas les balises HTML div ou p du navigateur. Expo fournit des outils autour de React Native.",
    execution: "Le JavaScript s’exécute dans un moteur embarqué, souvent Hermes, selon la configuration du projet. TypeScript est transformé en JavaScript par l’outillage ; vérifier ses types est une étape distincte. Les parties Android et iOS sont construites avec leurs outils natifs. Ce n’est pas une simple page HTML placée dans le téléphone.",
    journey: ["Un composant est une fonction qui décrit une partie de l’écran. Les props sont ses paramètres de présentation ; useState conserve une donnée modifiable.", "StyleSheet organise des styles écrits en objets JavaScript. Les règles ressemblent parfois au CSS, mais toutes les propriétés et unités du web ne sont pas disponibles.", "Expo Go lance les projets compatibles sur un téléphone. Une fonctionnalité native absente d’Expo Go demande une construction de développement adaptée."],
    terms: ["composant", "props", "state", "jsx", "expo", "native", "sdk"],
  },
  "lang-c": {
    definition: "C est un langage de programmation permettant de calculer, de manipuler des données et de contrôler précisément la mémoire. Tu écris un fichier source .c, puis un compilateur le transforme en un programme que la machine peut lancer. Au début, le programme échange avec toi dans une console, sans fenêtre graphique.",
    execution: "C est généralement compilé à l’avance : prétraitement, compilation, assemblage puis édition des liens produisent un exécutable. GCC (GNU Compiler Collection) fournit les outils utilisés ici. Une erreur de compilation empêche la construction ; une erreur de logique peut exister même si le programme compile.",
    journey: ["main est le point d’entrée du programme. Les accolades délimitent un bloc d’instructions et le point-virgule termine de nombreuses instructions.", "Un type décrit la catégorie et la représentation d’une donnée. Une déclaration crée une variable nommée ; une affectation lui donne une valeur.", "printf écrit dans la console. Lis sa chaîne de format et les valeurs associées, puis observe les entrées et la sortie avant de changer le programme."],
    terms: ["compilation", "main", "variable", "type", "fonction", "console", "memoire"],
  },
  "lang-cpp": {
    definition: "C++ est un langage de programmation généraliste. Il permet d’écrire des fonctions et des classes pour organiser les données et les comportements. Une classe est un plan, une instance est un objet créé à partir de ce plan. Tu commenceras par des programmes de console avant les fenêtres Qt.",
    execution: "C++ est généralement compilé à l’avance : le compilateur traduit chaque source .cpp, puis l’éditeur de liens assemble les parties et les bibliothèques en exécutable. Un fichier d’en-tête .hpp déclare des éléments partagés ; il ne devient pas à lui seul une application.",
    journey: ["main indique où le programme commence. std désigne l’espace de noms de la bibliothèque standard ; std::cout écrit une sortie et std::cin lit une entrée.", "Une valeur copiée est indépendante ; une référence permet de désigner un objet existant. const exprime une interdiction de modifier à travers le nom concerné.", "Une classe regroupe des attributs (données) et des méthodes (fonctions). Un constructeur initialise chaque nouvelle instance."],
    terms: ["compilation", "main", "classe", "instance", "constructeur", "reference", "bibliotheque"],
  },
  "lang-java": {
    definition: "Java est un langage de programmation organisé autour de classes. Une classe décrit des données et des méthodes ; une instance est un objet concret créé à partir de ce plan. Les premiers exercices écrivent dans une console. JavaFX sera utilisé ensuite pour construire des interfaces graphiques.",
    execution: javaExecution,
    journey: ["Le fichier Main.java contient la classe Main. La méthode main est le point d’entrée. System.out.println écrit une ligne dans la console.", "Un type précise la donnée attendue, par exemple int pour un entier et String pour un texte. Une méthode reçoit des paramètres et peut renvoyer un résultat.", "new construit une instance. Deux instances de la même classe peuvent conserver des valeurs différentes dans leurs attributs."],
    terms: ["java", "jdk", "jvm", "bytecode", "classe", "instance", "methode", "main"],
  },
  "lang-python": {
    definition: "Python est un langage de programmation généraliste. Un script est un fichier texte contenant des instructions exécutables. Tu peux l’utiliser pour des calculs, des automatisations, des serveurs ou des interfaces. Dans les premiers exercices, print écrit un résultat dans la console et input lit une saisie.",
    execution: pythonExecution,
    journey: ["Écris les instructions dans un fichier .py. L’indentation, c’est-à-dire le décalage en début de ligne, regroupe les instructions d’un bloc : elle fait partie de la syntaxe.", "Une variable est un nom associé à une valeur. Le type appartient à la valeur ; input renvoie toujours du texte, même quand tu tapes des chiffres.", "Une fonction définie avec def regroupe des instructions. Un appel lui fournit des arguments ; return renvoie un résultat que le reste du programme peut utiliser."],
    terms: ["python", "interpreteur", "bytecode", "indentation", "variable", "type", "fonction"],
  },
  "lang-javascript": {
    definition: "Dans ce parcours, JavaScript s’exécute avec Node.js dans une console, puis dans des applications graphiques avec Electron. Un script est un fichier d’instructions ; un objet rassemble des propriétés ; un tableau est une liste de valeurs. Tu peux apprendre la logique sans avoir à construire d’abord une page HTML.",
    execution: javascriptExecution,
    journey: ["Node.js est le programme qui lance ton script : node main.js ou node main.mjs. console.log affiche une valeur dans le terminal.", "let permet de réaffecter un nom ; const bloque sa réaffectation, sans rendre automatiquement immuable le contenu d’un objet ou d’un tableau.", "Une fonction reçoit des données et peut renvoyer un résultat. Un objet et un tableau servent à regrouper plusieurs données liées."],
    terms: ["javascript", "node", "variable", "portee", "objet", "tableau", "fonction"],
  },
  "lang-typescript": {
    definition: "TypeScript ajoute à JavaScript une description des types pour détecter des incohérences avant l’exécution. Une annotation comme : number indique qu’une valeur doit être numérique. Une interface décrit la forme attendue d’un objet ; elle ne crée pas une classe ni une validation automatique des données reçues.",
    execution: "TypeScript est compilé, aussi appelé transpilé, en JavaScript par un outil comme tsc (TypeScript Compiler). La plupart des annotations de types sont effacées. Le JavaScript produit est ensuite exécuté par Node.js ou le navigateur, avec leurs mécanismes d’interprétation et de compilation JIT. Le terminal de ce cours vérifie réellement les types avant d’exécuter le résultat.",
    journey: ["Écris dans un fichier .ts. tsc vérifie les types et produit du JavaScript ; Node.js exécute ce résultat. Ces deux opérations ont des rôles différents.", "Un type indique ce qui est autorisé : string pour un texte, number pour un nombre, boolean pour vrai ou faux. L’inférence permet au compilateur de déduire certains types.", "Une donnée externe n’est pas fiable parce qu’on l’a annotée. unknown impose de vérifier sa forme avec des conditions avant de lire ses propriétés."],
    terms: ["typescript", "compilation", "type", "interface", "inference", "unknown", "union"],
  },
  "lang-php": {
    definition: "PHP est un langage de programmation utilisé notamment sur les serveurs web. Il peut aussi fonctionner en ligne de commande. Une variable commence par $, echo écrit une sortie, une fonction regroupe des instructions. Le parcours commence dans la console, puis relie formulaires, sessions et modèles dans une interface locale.",
    execution: phpExecution,
    journey: ["Le fichier .php commence par <?php pour signaler du code PHP. En mode console, php main.php lance le script et affiche la sortie dans le terminal.", "Les textes sont placés entre guillemets ; les variables comme $nom désignent des valeurs. La plupart des instructions se terminent par un point-virgule.", "Dans une page web, une requête POST transporte un formulaire. Une session conserve des données côté serveur entre deux requêtes ; elle n’est pas une variable magique permanente."],
    terms: ["php", "cli", "variable", "fonction", "tableau", "session", "http"],
  },
  "lang-sql": {
    definition: "SQL signifie Structured Query Language, « langage de requêtes structuré ». Il sert à définir, lire et modifier des données dans des tables. Une base regroupe des tables ; une table rassemble des lignes de même structure ; une colonne décrit un champ comme nom. Un SGBD (système de gestion de base de données) est le logiciel qui gère cette base.",
    execution: "SQL est un langage déclaratif : tu décris le résultat souhaité, puis le SGBD analyse, planifie et exécute la requête. La distinction compilé/interprété ne s’applique pas ici comme pour un script Python ou un programme C. Ce cours et son terminal utilisent SQLite, embarqué dans le navigateur grâce à sql.js. PostgreSQL, MySQL et SQL Server ont des différences de syntaxe et de fonctionnement.",
    journey: ["Commence par observer les tables et leurs colonnes. Une ligne correspond à un enregistrement, par exemple un contact ; une clé primaire l’identifie de manière unique.", "CREATE TABLE décrit la structure. INSERT ajoute une ligne, SELECT lit, UPDATE modifie et DELETE supprime : ces quatre dernières opérations forment le CRUD.", "Écris une requête terminée par un point-virgule, exécute-la, puis lis les colonnes et les lignes du résultat. Une requête qui modifie les données ne produit pas nécessairement un tableau de résultats."],
    terms: ["sql", "sgbd", "sqlite", "table", "cle-primaire", "null", "crud"],
  },
};
