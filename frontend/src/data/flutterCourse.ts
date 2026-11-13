import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { flutterAdvancedProjects } from "./flutterAdvancedProjects";
import {
  dartBasics,
  flutterBeginnerProjects,
  flutterIntermediateProjects,
} from "./flutterProjects";
import type { WebLevel } from "./webCourseTypes";

const [profile, counter] = flutterBeginnerProjects;
const [todo, cart] = flutterIntermediateProjects;
const [movies] = flutterAdvancedProjects; // weather project will be added later
const docs = "https://docs.flutter.dev/";
const dartDocs = "https://dart.dev/";

const beginner: WebLevel["chapters"] = [
  {
    id: "installation-flutter",
    title: "Installation et configuration Flutter",
    description:
      "Installe Flutter, configure ton environnement et comprends ce qui rend Flutter unique.",
    lessons: [
      lesson({
        id: "introduction-flutter",
        title: "Qu'est-ce que Flutter et comment l'installer ?",
        minutes: 30,
        summary:
          "Flutter est un framework UI multi-plateforme de Google pour créer des applications natives pour mobile (iOS/Android), web ET desktop (Windows/macOS/Linux) avec un seul code base.",
        sections: [
          section(
            "Flutter : Framework UI multi-plateforme",
            "Flutter se distingue par sa capacité à créer des applications natives pour mobile, web, desktop et embedded avec un seul code base. Contrairement à React Native qui utilise des composants natifs, Flutter dessine tous les pixels à l'écran avec son propre moteur de rendu.",
            [
              "Flutter utilise Dart comme langage de programmation, optimisé par Google pour le développement UI.",
              "Flutter compile en code natif (ARM pour mobile, x86 pour desktop) pour des performances maximales.",
              "Le MÊME code Flutter fonctionne sur iOS, Android, Web, Windows, macOS et Linux sans modification.",
              "Flutter inclut son propre moteur de rendu (Skia/Impeller) : il contrôle chaque pixel, garantissant un rendu IDENTIQUE sur toutes les plateformes.",
              "Mobile : Applications iOS et Android avec performances natives.",
              "Web : Compile en JavaScript/WebAssembly pour tourner dans les navigateurs modernes.",
              "Desktop : Applications Windows, macOS et Linux natives avec interface fluide.",
            ],
          ),
          section(
            "Ce qui rend Flutter différent et unique",
            "Flutter adopte une approche révolutionnaire dans le développement cross-platform qui le distingue de tous ses concurrents.",
            [
              "Hot Reload : Voir les changements en moins d'une seconde sans perdre l'état de l'application (gain de temps énorme).",
              "Widget Everything : Tout est un widget (boutons, padding, layout, animations). Cette composition permet une flexibilité extrême.",
              "Performance native : Flutter compile en code machine natif, pas de bridge JavaScript comme React Native (plus rapide).",
              "Rendu identique : Le même code produit EXACTEMENT la même interface sur iOS et Android (pas de surprises).",
              "Material Design et Cupertino : Flutter inclut des widgets qui imitent parfaitement iOS et Android.",
              "Dart AOT et JIT : Compilation Ahead-Of-Time pour la production (rapide), Just-In-Time pour le développement (hot reload).",
              "Un seul code base pour 6 plateformes : économie de temps et de maintenance considérable.",
            ],
          ),
          section(
            "Prérequis système minimum détaillés",
            "Avant d'installer Flutter, vérifie que ton système répond aux exigences minimales selon ta plateforme de développement.",
            [
              "Windows : Windows 10 ou supérieur (64-bit), 2.5 GB d'espace disque pour SDK, Git pour Windows, PowerShell 5.0+.",
              "macOS : macOS 10.14 (Mojave) ou supérieur, 2.8 GB d'espace disque, Xcode pour iOS/macOS, CocoaPods installé.",
              "Linux : Ubuntu 18.04+ ou Debian 10+, 600 MB d'espace disque, bibliothèques système (libgtk, etc.).",
              "Tous : 8 GB RAM minimum (16 GB fortement recommandés), éditeur de code (VS Code ou Android Studio recommandés).",
              "Pour iOS : Mac obligatoire avec Xcode (Windows/Linux ne peuvent pas compiler pour iOS).",
              "Pour Android : Android Studio ou SDK Android sur Windows/Mac/Linux.",
            ],
          ),
          section(
            "Installation complète du SDK Flutter",
            "Télécharge et installe le SDK Flutter selon ton système d'exploitation. Le SDK inclut la commande flutter, le compilateur Dart et tous les outils nécessaires.",
            [
              "Télécharge le SDK depuis flutter.dev et extrais-le dans un dossier SANS ESPACES (ex: C:\\src\\flutter ou ~/development/flutter).",
              "Ajoute flutter/bin à ton PATH système pour accéder à la commande flutter partout dans le terminal.",
              "Lance flutter doctor pour vérifier l'installation complète et identifier les outils manquants.",
              "flutter doctor --android-licenses accepte toutes les licences Android SDK si nécessaire.",
              "Installe Android Studio pour le SDK Android et l'émulateur Android.",
              "Sur Mac : installe Xcode depuis l'App Store pour compiler pour iOS/macOS.",
              "flutter config --enable-windows-desktop (Windows), --enable-macos-desktop (Mac), --enable-linux-desktop (Linux) pour activer le support desktop.",
              "flutter doctor doit afficher tous les checks verts avant de continuer.",
            ],
          ),
          section(
            "Configuration émulateur, simulateur et appareils",
            "Configure un émulateur Android, un simulateur iOS ou connecte un appareil physique pour tester tes applications sur toutes les plateformes.",
            [
              "Android : Ouvre Android Studio > Tools > AVD Manager, crée un appareil virtuel (ex: Pixel 6, API 34+).",
              "iOS (Mac uniquement) : Lance Xcode > Open Developer Tool > Simulator, choisis un iPhone récent (14+).",
              "Appareil physique Android : Active le mode développeur (7 taps sur numéro de build), active le débogage USB.",
              "Appareil physique iOS : Connecte l'iPhone, ouvre Xcode, configure le signing, active le mode développeur.",
              "Web : Aucune configuration nécessaire, flutter run -d chrome lance directement dans Chrome.",
              "Desktop : flutter run -d windows (ou macos/linux) lance l'application native desktop.",
              "Vérifie toutes les cibles disponibles avec flutter devices. Tu dois voir au moins un appareil listé.",
              "flutter run lance l'application sur l'appareil sélectionné par défaut.",
            ],
          ),
          section(
            "Premier projet Flutter et structure",
            "Crée ton premier projet Flutter et explore sa structure pour comprendre l'organisation des fichiers sur toutes les plateformes.",
            [
              "flutter create mon_app crée un nouveau projet avec une structure complète multi-plateforme.",
              "pubspec.yaml : fichier de configuration central du projet (dépendances, assets, nom, version, description).",
              "lib/main.dart : point d'entrée unique de l'application où se trouve main() et runApp() pour toutes les plateformes.",
              "android/ : code natif Android, configuration Gradle, permissions AndroidManifest.xml.",
              "ios/ : code natif iOS, configuration Xcode, Info.plist pour permissions.",
              "web/ : fichiers HTML, CSS et JavaScript pour le web, index.html, manifest.json.",
              "windows/, macos/, linux/ : code natif pour chaque plateforme desktop.",
              "test/ : dossier pour les tests unitaires, tests de widgets et tests d'intégration.",
              "build/ : dossier généré contenant les compilations (ignoré par git).",
            ],
          ),
        ],
        files: projectExample(profile, "pubspec.yaml"),
        task: "Installe Flutter, lance flutter doctor jusqu'à voir tous les checks verts, crée un nouveau projet avec flutter create test_app, lance-le sur un émulateur Android puis sur le web avec flutter run -d chrome.",
        takeaway:
          "Flutter est multi-plateforme : UN SEUL code pour mobile (iOS/Android), web ET desktop (Windows/macOS/Linux). Il dessine tous les pixels lui-même, garantissant un rendu identique partout avec des performances natives.",
        quiz: quiz(
          "Sur combien de plateformes différentes Flutter peut-il compiler ?",
          ["2 (iOS et Android)", "4 (iOS, Android, Web, Desktop)", "6 (iOS, Android, Web, Windows, macOS, Linux)"],
          2,
          "Flutter compile sur 6 plateformes : iOS, Android, Web, Windows, macOS et Linux avec le même code.",
        ),
        link: docs + "get-started/install",
      }),
    ],
  },
  {
    id: "dart-variables-affichage",
    title: "Variables, types et affichage en Dart",
    description:
      "Maîtrise les fondamentaux de Dart : variables, types, null safety et affichage.",
    lessons: [
      lesson({
        id: "dart-variables-types",
        title: "Variables, types de base et déclarations",
        minutes: 25,
        summary:
          "Dart est le langage de Flutter. Apprends à déclarer des variables avec var/final/const, utiliser les types de base et comprendre l'inférence de type.",
        sections: [
          section(
            "Déclaration de variables en Dart",
            "Dart est un langage typé avec inférence automatique. Comprends les trois façons de déclarer des variables et leurs différences.",
            [
              "var : déclare une variable dont le type est déduit automatiquement. Exemple : var nom = 'Alice'; (type String déduit). La variable PEUT être réaffectée.",
              "final : variable assignée UNE SEULE FOIS à l'exécution, ne peut pas être réaffectée. Exemple : final prix = 100; Le type est déduit.",
              "const : constante compile-time, valeur FIGÉE à la compilation (doit être connue avant l'exécution). Exemple : const pi = 3.14159;",
              "Différence clé : var peut changer (count = 5; puis count = 10;), final est fixé une fois (final age = 25; puis age = 26; → ERREUR), const est une vraie constante.",
              "Préfère final par défaut, utilise var seulement si la valeur doit changer, const pour les vraies constantes.",
            ],
          ),
          section(
            "Types de base en Dart",
            "Dart fournit des types fondamentaux pour représenter les données les plus courantes dans tes applications.",
            [
              "String : chaînes de caractères. Exemple : String nom = 'Bob'; ou var nom = 'Bob';",
              "int : nombres entiers (42, -10, 0). Exemple : int age = 25;",
              "double : nombres décimaux (3.14, -2.5, 0.0). Exemple : double taille = 1.75;",
              "bool : booléens true ou false. Exemple : bool estActif = true;",
              "num : type parent de int et double, accepte les deux. Exemple : num valeur = 42; valeur = 3.14; (les deux fonctionnent).",
              "Types explicites : String nom = 'Bob'; int age = 25; double taille = 1.75; bool estActif = true;",
              "Inférence de type : Dart déduit automatiquement avec var. var nom = 'Bob'; crée un String.",
            ],
          ),
          section(
            "Null safety en Dart : gérer l'absence de valeur",
            "Dart impose la sûreté nulle depuis la version 2.12 : une variable ne peut PAS être null sauf si tu le spécifies explicitement avec ?.",
            [
              "Type non-nullable (par défaut) : String ne peut JAMAIS être null. Exemple : String nom = 'Alice'; nom = null; → ERREUR de compilation.",
              "Type nullable : String? peut contenir une chaîne OU null. Exemple : String? email = null; (OK)",
              "Pourquoi c'est important : évite les erreurs NullPointerException qui plantent l'application. Dart force à gérer les cas null.",
              "Valeur par défaut : Les variables non-nullables DOIVENT être initialisées. final String nom; print(nom); → ERREUR.",
              "Variables nullable : peuvent rester non-initialisées (valeur null par défaut). String? email; print(email); → affiche null.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée un fichier bin/variables.dart, déclare des variables avec var (nom), final (dateNaissance) et const (maxUtilisateurs). Essaie de réassigner une variable final pour voir l'erreur.",
        takeaway:
          "Dart combine typage fort et inférence. var permet la réaffectation, final fixe une fois, const est une constante. Le null safety force à gérer explicitement les valeurs absentes.",
        quiz: quiz(
          "Quelle déclaration permet de réassigner la variable ?",
          ["const", "final", "var"],
          2,
          "var permet de changer la valeur d'une variable. final et const la figent.",
        ),
        link: dartDocs + "language/variables",
      }),
      lesson({
        id: "dart-affichage-interpolation",
        title: "Affichage dans la console et interpolation de chaînes",
        minutes: 20,
        summary:
          "Affiche des données dans la console avec print() et compose des messages dynamiques avec l'interpolation de chaînes pour créer des interfaces textuelles.",
        sections: [
          section(
            "print() et affichage console",
            "La fonction print() affiche des informations dans la console, essentielle pour le débogage et la compréhension du flux d'exécution.",
            [
              "Syntaxe de base : print('Bonjour Flutter'); affiche le texte dans la console.",
              "Afficher des variables : print(nom); affiche la valeur de la variable nom.",
              "Afficher plusieurs valeurs : print('Nom: $nom, Age: $age'); (avec interpolation).",
              "Affichage de debug : print('DEBUG: valeur de count = $count'); pour suivre l'état.",
              "Types automatiquement convertis : print(42); print(3.14); print(true); tous affichent correctement.",
            ],
          ),
          section(
            "Interpolation de chaînes",
            "Compose des chaînes dynamiques en insérant des variables et des expressions directement dans le texte avec $ et ${}.",
            [
              "Interpolation simple avec $ : 'Mon nom est $nom' insère la valeur de nom.",
              "Exemple : var nom = 'Alice'; print('Bonjour $nom!'); affiche 'Bonjour Alice!'",
              "Interpolation d'expression avec ${} : Pour des calculs ou des appels de méthode. 'J\\'ai ${age + 1} ans l\\'an prochain'.",
              "Appel de méthode : 'Majuscules: ${nom.toUpperCase()}' appelle toUpperCase() sur nom.",
              "Expressions complexes : 'Total: ${prix * quantite} €' calcule le total.",
              "Échappement de $ : Si tu veux afficher $ littéralement, utilise \\$. 'Prix: \\$${montant}'.",
            ],
          ),
          section(
            "Opérateurs sur chaînes et formatage",
            "Dart offre plusieurs façons de manipuler et formater les chaînes de caractères.",
            [
              "Concaténation avec + : 'Bonjour ' + nom + '!' combine des chaînes.",
              "Préfère l'interpolation : 'Bonjour $nom!' est plus lisible que 'Bonjour ' + nom + '!'.",
              "Chaînes multi-lignes : Utilise triple quotes ''' ou \"\"\". var texte = '''Ligne 1\\nLigne 2\\nLigne 3''';",
              "Chaînes brutes (raw strings) : r'C:\\Users\\nom' ne traite pas \\n comme retour à la ligne. Utile pour les chemins Windows.",
              "length : nom.length donne le nombre de caractères.",
              "isEmpty : nom.isEmpty retourne true si la chaîne est vide.",
            ],
          ),
          section(
            "Opérateurs null-aware",
            "Travaille en toute sécurité avec des valeurs potentiellement null en utilisant les opérateurs spéciaux de Dart.",
            [
              "Opérateur ?? (null-coalescing) : Fournit une valeur par défaut si la variable est null. var affichage = email ?? 'Non renseigné';",
              "Opérateur ?. (safe navigation) : Accède à une propriété SEULEMENT si la variable n'est pas null. var longueur = email?.length; (longueur est null si email est null).",
              "Opérateur ! (null assertion) : Force un type nullable en non-nullable (DANGEREUX, peut planter). var longueur = email!.length; Si email est null, l'app plante.",
              "Opérateur ??= (assign if null) : Assigne une valeur SEULEMENT si la variable est null. nom ??= 'Anonyme'; (assigne 'Anonyme' si nom est null).",
              "Évite ! : Préfère ?. et ?? pour gérer null en toute sécurité.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée bin/affichage.dart, déclare nom, age, ville (peut être null). Utilise l'interpolation pour créer une phrase 'Je m\\'appelle $nom, j\\'ai $age ans et j\\'habite ${ville ?? 'quelque part'}'. Affiche avec print().",
        takeaway:
          "print() affiche dans la console. L'interpolation avec $ et ${} crée des chaînes dynamiques. Les opérateurs null-aware (??, ?., ??=) gèrent les valeurs absentes en sécurité.",
        quiz: quiz(
          "Quel opérateur fournit une valeur par défaut si la variable est null ?",
          ["!!", "??", "?."],
          1,
          "L'opérateur ?? (null-coalescing) retourne la valeur de gauche si non-null, sinon la valeur de droite.",
        ),
        link: dartDocs + "language/operators#other-operators",
      }),
    ],
  },
  {
    id: "dart-conditions",
    title: "Structures conditionnelles en Dart",
    description:
      "Contrôle le flux d'exécution avec if/else, switch et les opérateurs conditionnels.",
    lessons: [
      lesson({
        id: "dart-if-else",
        title: "Conditions if, else if, else et opérateurs",
        minutes: 22,
        summary:
          "Exécute du code conditionnellement avec if/else, utilise les opérateurs de comparaison et logiques pour construire des expressions booléennes complexes.",
        sections: [
          section(
            "Structure if/else de base",
            "La structure if/else permet d'exécuter du code selon qu'une condition booléenne est vraie ou fausse.",
            [
              "Syntaxe simple : if (condition) { /* code si vrai */ } else { /* code si faux */ }",
              "Exemple : if (age >= 18) { print('Majeur'); } else { print('Mineur'); }",
              "Condition sans else : if (estConnecte) { print('Bienvenue!'); } Le bloc else est optionnel.",
              "Bloc avec accolades : Même pour une ligne, utilise les accolades {} en production pour la clarté.",
              "Conditions multiples avec else if : if (note >= 16) { 'Excellent'; } else if (note >= 14) { 'Bien'; } else if (note >= 10) { 'Passable'; } else { 'Insuffisant'; }",
            ],
          ),
          section(
            "Opérateurs de comparaison",
            "Compare des valeurs avec les opérateurs relationnels pour créer des conditions booléennes.",
            [
              "Égalité == : age == 18 retourne true si age vaut exactement 18.",
              "Inégalité != : age != 18 retourne true si age est différent de 18.",
              "Supérieur > et >= : age > 18 (strictement supérieur), age >= 18 (supérieur ou égal).",
              "Inférieur < et <= : age < 18 (strictement inférieur), age <= 18 (inférieur ou égal).",
              "Comparaison de chaînes : nom == 'Alice' compare les chaînes caractère par caractère.",
              "Attention à == vs = : == compare, = assigne. if (age = 18) → ERREUR, if (age == 18) → correct.",
            ],
          ),
          section(
            "Opérateurs logiques : ET, OU, NON",
            "Combine plusieurs conditions avec les opérateurs logiques pour créer des expressions complexes.",
            [
              "ET logique && : Les DEUX conditions doivent être vraies. if (age >= 18 && estInscrit) { 'Accès autorisé'; }",
              "OU logique || : Au moins UNE condition doit être vraie. if (estAdmin || estModerateur) { 'Peut modérer'; }",
              "NON logique ! : Inverse une condition. if (!estConnecte) { 'Veuillez vous connecter'; }",
              "Priorité des opérateurs : ! (priorité haute), puis &&, puis ||. Utilise des parenthèses pour clarifier : if ((age > 18 && estInscrit) || estAdmin)",
              "Court-circuit : && et || évaluent de gauche à droite et s'arrêtent dès que le résultat est connu. if (user != null && user.age > 18) (safe).",
            ],
          ),
          section(
            "Opérateur ternaire",
            "Écris des conditions courtes sur une seule ligne avec l'opérateur ternaire condition ? valeurSiVrai : valeurSiFaux.",
            [
              "Syntaxe : var resultat = condition ? valeurSiVrai : valeurSiFaux;",
              "Exemple : var statut = age >= 18 ? 'Majeur' : 'Mineur'; Équivaut à if/else mais plus concis.",
              "Utilisé pour affecter : var couleur = score > 50 ? Colors.green : Colors.red;",
              "Imbrication possible (évite) : var note = score > 90 ? 'A' : score > 80 ? 'B' : 'C'; (peu lisible).",
              "Préfère if/else pour la logique complexe : Le ternaire est pour les cas simples.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une fonction categoriserAge(int age) qui retourne 'Enfant' (<13), 'Ado' (13-17), 'Adulte' (18-64), 'Senior' (65+) avec if/else. Réécris-la avec des ternaires imbriqués et compare la lisibilité.",
        takeaway:
          "if/else contrôle le flux. Les opérateurs de comparaison (==, !=, <, >) et logiques (&&, ||, !) créent des conditions. Le ternaire (? :) est concis pour les cas simples.",
        quiz: quiz(
          "Quel opérateur logique nécessite que les DEUX conditions soient vraies ?",
          ["||", "!", "&&"],
          2,
          "L'opérateur && (ET logique) retourne true seulement si les deux conditions sont vraies.",
        ),
        link: dartDocs + "language/branches",
      }),
      lesson({
        id: "dart-switch",
        title: "Switch, case et pattern matching moderne",
        minutes: 23,
        summary:
          "Utilise switch/case pour comparer une valeur à plusieurs cas possibles. Dart 3.0 introduit les switch expressions et le pattern matching puissant.",
        sections: [
          section(
            "Switch classique avec case",
            "switch compare une valeur à plusieurs cas possibles, plus lisible que plusieurs if/else pour des valeurs discrètes.",
            [
              "Syntaxe : switch (variable) { case valeur1: /* code */; break; case valeur2: /* code */; break; default: /* si aucun cas */ }",
              "Le break est OBLIGATOIRE pour sortir du case, sinon erreur de compilation en Dart.",
              "default : Gère le cas où aucune valeur ne correspond (optionnel mais recommandé).",
              "Exemple : switch (jour) { case 1: print('Lundi'); break; case 2: print('Mardi'); break; default: print('Autre jour'); }",
              "Types supportés : int, String, enum principalement.",
            ],
          ),
          section(
            "Switch expressions (Dart 3.0+)",
            "Dart 3.0 introduit les switch expressions : plus concises, retournent une valeur directement, pattern matching puissant.",
            [
              "Syntaxe expression : var resultat = switch (valeur) { pattern1 => expression1, pattern2 => expression2, _ => defaut };",
              "Pas besoin de break : Chaque cas retourne directement une valeur.",
              "Underscore _ : Cas par défaut (équivalent de default).",
              "Exemple simple : var message = switch (code) { 200 => 'OK', 404 => 'Not Found', _ => 'Erreur inconnue' };",
              "Avec opérateurs : var niveau = switch (score) { >= 90 => 'Excellent', >= 80 => 'Bien', >= 60 => 'Passable', _ => 'Insuffisant' };",
              "Patterns multiples : case 1 || 2 || 3 => 'Trimestre 1' (Dart 3.0).",
            ],
          ),
          section(
            "Pattern matching avancé",
            "Dart 3.0 permet de déconstruire des valeurs et tester des patterns complexes directement dans switch.",
            [
              "Test de type : switch (valeur) { case int n => 'Nombre: $n', case String s => 'Texte: $s', _ => 'Autre' }",
              "Test de conditions : case int n when n > 0 => 'Positif', case int n when n < 0 => 'Négatif', case 0 => 'Zéro'",
              "Déconstruction de records : case (int x, int y) when x == y => 'Égaux'",
              "Null checking : case String? s when s != null => 'Valeur: $s', case null => 'Pas de valeur'",
              "Le pattern matching rend le code plus expressif et sûr.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une fonction evaluerNote(int note) avec switch classique (A pour 90+, B pour 80+, etc.). Réécris-la avec switch expression et opérateurs >= de Dart 3.0.",
        takeaway:
          "switch compare une valeur à plusieurs cas. Les switch expressions de Dart 3 sont plus concises et retournent directement une valeur. Le pattern matching permet des tests complexes.",
        quiz: quiz(
          "Dans les switch expressions de Dart 3, que représente le underscore _ ?",
          ["Une variable privée", "Le cas par défaut", "Une erreur"],
          1,
          "_ dans un switch expression représente le cas par défaut, équivalent de default.",
        ),
        link: dartDocs + "language/branches#switch-statements",
      }),
    ],
  },
  {
    id: "dart-boucles",
    title: "Boucles et itération en Dart",
    description:
      "Répète des opérations avec for, while et parcours des collections.",
    lessons: [
      lesson({
        id: "dart-for-loops",
        title: "Boucles for : classique, for-in et range",
        minutes: 22,
        summary:
          "Répète un bloc de code un nombre déterminé de fois avec for classique, parcours des collections avec for-in.",
        sections: [
          section(
            "Boucle for classique",
            "La boucle for répète un bloc de code en contrôlant précisément l'initialisation, la condition et l'incrémentation.",
            [
              "Syntaxe : for (initialisation; condition; incrémentation) { /* code */ }",
              "Exemple : for (var i = 0; i < 5; i++) { print('Itération $i'); } affiche 0, 1, 2, 3, 4.",
              "Initialisation : var i = 0; crée la variable de boucle (locale au for).",
              "Condition : i < 5; testée AVANT chaque itération. Si false, la boucle s'arrête.",
              "Incrémentation : i++ exécutée APRÈS chaque itération (peut être i += 2, i--, etc.).",
              "Boucle infinie : for (;;) { } crée une boucle infinie (condition toujours vraie).",
            ],
          ),
          section(
            "Boucle for-in pour parcourir des collections",
            "for-in parcourt tous les éléments d'une liste, d'un ensemble ou d'un itérable sans gérer d'index.",
            [
              "Syntaxe : for (var element in collection) { /* utilise element */ }",
              "Exemple : var fruits = ['pomme', 'banane', 'orange']; for (var fruit in fruits) { print(fruit); }",
              "Pas d'index : Tu reçois directement l'élément, pas sa position. Plus simple que for classique.",
              "Type déduit : var element déduit le type depuis la collection. Ou explicite : for (String fruit in fruits)",
              "Fonctionne avec : List, Set, Map.keys, Map.values, tout Iterable.",
              "Modification interdite : Ne modifie pas la collection pendant l'itération (ajouter/supprimer → erreur).",
            ],
          ),
          section(
            "Range et List.generate",
            "Dart n'a pas de fonction range() native, mais List.generate crée des séquences de nombres facilement.",
            [
              "List.generate : Crée une liste en appelant une fonction pour chaque index.",
              "Exemple range : for (var i in List.generate(10, (index) => index)) { print(i); } affiche 0 à 9.",
              "Range avec step : List.generate(5, (i) => i * 2) crée [0, 2, 4, 6, 8].",
              "Alternative simple : for (var i = 0; i < 10; i++) reste la plus directe pour les ranges.",
              "Iterable.generate : Version lazy (évaluation à la demande) pour grandes séquences.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une liste de nombres [1, 2, 3, 4, 5], utilise for classique pour afficher les carrés, puis for-in pour afficher uniquement les pairs.",
        takeaway:
          "for classique contrôle précisément l'itération. for-in parcourt directement les éléments. List.generate simule un range. Choisis for-in pour la simplicité, for classique pour le contrôle.",
        quiz: quiz(
          "Quelle boucle est la plus simple pour parcourir tous les éléments d'une liste ?",
          ["for classique", "for-in", "goto"],
          1,
          "for-in parcourt directement les éléments sans gérer l'index, plus simple et lisible.",
        ),
        link: dartDocs + "language/loops#for-loops",
      }),
      lesson({
        id: "dart-while-iterateurs",
        title: "While, do-while et méthodes fonctionnelles",
        minutes: 23,
        summary:
          "Utilise while et do-while pour les boucles avec condition. Découvre forEach, map, where et reduce pour manipuler les collections de manière fonctionnelle.",
        sections: [
          section(
            "Boucles while et do-while",
            "while vérifie la condition AVANT chaque itération, do-while garantit AU MOINS une exécution.",
            [
              "while : while (condition) { /* code */ } Vérifie AVANT, peut ne jamais s'exécuter.",
              "Exemple : var i = 0; while (i < 5) { print(i); i++; } affiche 0, 1, 2, 3, 4.",
              "do-while : do { /* code */ } while (condition); Exécute AU MOINS UNE FOIS, puis vérifie.",
              "Exemple : var i = 0; do { print(i); i++; } while (i < 5); Même résultat mais garantit 1 exécution.",
              "Utilisation : while pour les boucles normales, do-while pour les menus (affiche au moins une fois).",
              "Boucle infinie : while (true) { } crée une boucle qui tourne indéfiniment (attention).",
            ],
          ),
          section(
            "break et continue",
            "Contrôle le flux d'une boucle en sortant prématurément (break) ou en passant à l'itération suivante (continue).",
            [
              "break : Sort IMMÉDIATEMENT de la boucle, ignore les itérations restantes.",
              "Exemple : for (var i = 0; i < 10; i++) { if (i == 5) break; print(i); } affiche 0 à 4, puis sort.",
              "continue : Passe IMMÉDIATEMENT à l'itération suivante, ignore le reste du code.",
              "Exemple : for (var i = 0; i < 5; i++) { if (i == 2) continue; print(i); } affiche 0, 1, 3, 4 (saute 2).",
              "Utilisation : break pour sortir dès qu'on trouve, continue pour ignorer certains cas.",
              "Labels (avancé) : Nomme une boucle externe pour break/continue dans des boucles imbriquées.",
            ],
          ),
          section(
            "forEach : itérer avec une fonction",
            "forEach exécute une fonction pour chaque élément d'une collection, style fonctionnel.",
            [
              "Syntaxe : collection.forEach((element) => /* code */);",
              "Exemple : ['a', 'b', 'c'].forEach((lettre) => print(lettre)); affiche a, b, c.",
              "Avec fonction fléchée : Si une ligne, utilise => au lieu de {}. Plus concis.",
              "Avec fonction bloc : fruits.forEach((fruit) { print('Fruit: $fruit'); }); pour plusieurs lignes.",
              "Pas de return : forEach retourne void, ne transforme pas la liste (contrairement à map).",
              "Préfère for-in : for-in est souvent plus lisible que forEach sauf dans les chaînes de méthodes.",
            ],
          ),
          section(
            "map, where et reduce : transformations fonctionnelles",
            "Ces méthodes transforment et filtrent les collections de manière élégante et fonctionnelle.",
            [
              "map() : Transforme CHAQUE élément. var doubles = [1, 2, 3].map((n) => n * 2).toList(); donne [2, 4, 6].",
              "where() : Filtre les éléments selon condition. var pairs = [1, 2, 3, 4].where((n) => n % 2 == 0).toList(); donne [2, 4].",
              "reduce() : Accumule une valeur. var somme = [1, 2, 3, 4].reduce((a, b) => a + b); donne 10.",
              "Chaînage : [1, 2, 3, 4].where((n) => n > 1).map((n) => n * 2).toList(); donne [4, 6, 8].",
              "Retourne Iterable : map et where retournent un Iterable lazy. Utilise .toList() pour une List.",
              "Style fonctionnel : Plus concis que les boucles for, mais peut être moins performant pour très grandes listes.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une liste de nombres [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]. Utilise where pour filtrer les pairs, map pour les doubler, reduce pour faire la somme. Affiche le résultat.",
        takeaway:
          "while vérifie avant, do-while garantit une exécution. break sort, continue passe à la suite. map transforme, where filtre, reduce accumule. Le style fonctionnel est concis et expressif.",
        quiz: quiz(
          "Quelle méthode transforme chaque élément d'une liste en appliquant une fonction ?",
          ["forEach", "where", "map"],
          2,
          "map() transforme chaque élément avec une fonction et retourne une nouvelle collection transformée.",
        ),
        link: dartDocs + "language/loops#while-and-do-while",
      }),
    ],
  },
  {
    id: "dart-fonctions",
    title: "Fonctions en Dart",
    description:
      "Crée des fonctions réutilisables avec paramètres nommés, optionnels et fonctions fléchées.",
    lessons: [
      lesson({
        id: "dart-fonctions-base",
        title: "Déclaration, paramètres et valeurs de retour",
        minutes: 25,
        summary:
          "Découpe ton code en fonctions réutilisables. Comprends les paramètres positionnels, nommés, optionnels et les valeurs par défaut.",
        sections: [
          section(
            "Déclaration et appel de fonctions",
            "Les fonctions encapsulent du code réutilisable. Dart supporte les fonctions avec type de retour et paramètres typés pour plus de sûreté.",
            [
              "Syntaxe de base : TypeRetour nomFonction(TypeParam1 param1, TypeParam2 param2) { /* code */ return valeur; }",
              "Exemple simple : int additionner(int a, int b) { return a + b; }",
              "Fonction sans retour : void afficherMessage(String message) { print(message); } Le type void indique aucun retour.",
              "Appel de fonction : var resultat = additionner(5, 3); print(resultat); affiche 8.",
              "Type de retour obligatoire : En Dart, le type de retour doit être spécifié (int, String, void, etc.) sauf pour les fonctions locales très courtes.",
              "Paramètres typés : Les types des paramètres sont obligatoires pour la sûreté du code.",
            ],
          ),
          section(
            "Paramètres positionnels",
            "Les paramètres positionnels sont fournis dans l'ordre de déclaration, position par position.",
            [
              "Ordre obligatoire : int diviser(int dividende, int diviseur) { } doit être appelé diviser(10, 2) (pas diviser(2, 10)).",
              "Tous obligatoires : Les paramètres positionnels doivent TOUS être fournis lors de l'appel.",
              "Lisibilité limitée : diviser(100, 5) ne montre pas ce que signifient 100 et 5. Les paramètres nommés sont plus clairs.",
            ],
          ),
          section(
            "Paramètres nommés : clarté et flexibilité",
            "Les paramètres nommés rendent les appels explicites et permettent de choisir l'ordre des arguments.",
            [
              "Syntaxe : void creerUtilisateur({String nom, int age, String email}) { } Les paramètres sont entre {}.",
              "Appel explicite : creerUtilisateur(nom: 'Alice', age: 25, email: 'alice@example.com'); L'ordre n'a pas d'importance.",
              "Paramètres optionnels : Par défaut, les paramètres nommés sont optionnels (peuvent être omis).",
              "required : Force à fournir un paramètre nommé. void creerUtilisateur({required String nom, int age = 18}) { }",
              "Valeurs par défaut : {String pays = 'France'} donne une valeur si non fournie. creerUtilisateur(nom: 'Bob'); pays vaudra 'France'.",
              "Préfère required aux optionnels : Pour les paramètres essentiels, utilise required plutôt qu'un type nullable.",
            ],
          ),
          section(
            "Paramètres optionnels positionnels",
            "Dart permet des paramètres positionnels optionnels avec [], mais les paramètres nommés sont généralement préférables.",
            [
              "Syntaxe : int somme(int a, [int b = 0, int c = 0]) => a + b + c; Les [] rendent b et c optionnels.",
              "Appel : somme(5); retourne 5, somme(5, 3); retourne 8, somme(5, 3, 2); retourne 10.",
              "Valeurs par défaut obligatoires : Les paramètres optionnels positionnels doivent avoir une valeur par défaut OU être nullables.",
              "Moins lisible : somme(5, 3) ne montre pas que 3 est le deuxième nombre. Préfère les paramètres nommés.",
              "Cas d'usage rare : Utilisé principalement dans les API standards Dart, rarement dans le code applicatif.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une fonction calculerPrix({required double prixBase, double taxe = 0.2, double remise = 0.0}) qui calcule le prix final. Teste avec différentes combinaisons de paramètres.",
        takeaway:
          "Les fonctions encapsulent du code réutilisable. Les paramètres nommés avec required rendent les appels explicites et sûrs. Les valeurs par défaut évitent de répéter les arguments courants.",
        quiz: quiz(
          "Quel mot-clé force à fournir un paramètre nommé lors de l'appel ?",
          ["optional", "required", "final"],
          1,
          "required dans les paramètres nommés oblige l'appelant à fournir une valeur, évitant les oublis.",
        ),
        link: dartDocs + "language/functions",
      }),
      lesson({
        id: "dart-fonctions-avancees",
        title: "Fonctions fléchées, anonymes et comme valeurs",
        minutes: 23,
        summary:
          "Simplifie ton code avec les fonctions fléchées =>, utilise des fonctions anonymes et passe des fonctions comme paramètres.",
        sections: [
          section(
            "Fonctions fléchées (arrow functions)",
            "Pour les fonctions courtes d'une seule expression, utilise la syntaxe fléchée => pour plus de concision.",
            [
              "Syntaxe : TypeRetour nomFonction(params) => expression; La valeur de l'expression est retournée automatiquement.",
              "Exemple : int doubler(int x) => x * 2; Équivalent à : int doubler(int x) { return x * 2; }",
              "Une seule expression : => peut contenir UNE SEULE expression, pas de ; à la fin avant le corps.",
              "Utilisations courantes : map, where, forEach. nombres.map((n) => n * 2) est plus concis que .map((n) { return n * 2; })",
              "Paramètres nommés : String saluer({required String nom}) => 'Bonjour $nom!'; Fonctionne aussi.",
              "Attention : Si tu as besoin de plusieurs instructions, utilise { } au lieu de =>.",
            ],
          ),
          section(
            "Fonctions anonymes (closures)",
            "Les fonctions anonymes n'ont pas de nom et sont souvent utilisées comme callbacks ou dans les méthodes de collections.",
            [
              "Syntaxe : (paramètres) { /* code */ } ou (paramètres) => expression",
              "Exemple avec forEach : ['a', 'b', 'c'].forEach((lettre) { print('Lettre: $lettre'); });",
              "Sans nom : La fonction n'a pas de nom, elle est définie directement là où elle est utilisée.",
              "Capture de variables : La fonction peut accéder aux variables de la portée englobante. var multiplicateur = 2; nombres.map((n) => n * multiplicateur);",
              "Closures : Une fonction qui capture des variables externes est une closure.",
            ],
          ),
          section(
            "Fonctions comme valeurs : first-class functions",
            "Dart traite les fonctions comme des valeurs : tu peux les assigner à des variables, les passer en paramètres, les retourner.",
            [
              "Assigner à une variable : var operation = (int a, int b) => a + b; var resultat = operation(5, 3); resultat vaut 8.",
              "Passer comme paramètre : void executer(int Function(int, int) op, int a, int b) { print(op(a, b)); } executer(operation, 5, 3);",
              "Type Function : int Function(int, int) est le type d'une fonction qui prend 2 int et retourne un int.",
              "Retourner une fonction : Function creerMultiplicateur(int facteur) { return (int n) => n * facteur; } var doubler = creerMultiplicateur(2); doubler(5); // 10",
              "Callbacks : Très utilisé pour les événements, animations, API asynchrones.",
            ],
          ),
          section(
            "typedef : nommer les types de fonctions",
            "typedef crée un alias pour un type de fonction, rendant le code plus lisible et réutilisable.",
            [
              "Syntaxe : typedef Operation = int Function(int, int);",
              "Utilisation : void executer(Operation op, int a, int b) { print(op(a, b)); } Plus lisible que int Function(int, int).",
              "Réutilisable : Operation peut être utilisé partout. var addition = (int a, int b) => a + b; Operation op = addition;",
              "Documentation : typedef rend le code autodocumenté. typedef ValiderChamp = bool Function(String valeur);",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée un typedef Transformateur = int Function(int); Écris des fonctions doubler, tripler, puis une fonction appliquer(List<int> nombres, Transformateur t) qui applique t à chaque nombre.",
        takeaway:
          "Les fonctions fléchées => simplifient les expressions courtes. Les fonctions sont des valeurs : tu peux les stocker, les passer, les retourner. typedef nomme les types de fonctions pour plus de clarté.",
        quiz: quiz(
          "Que fait la syntaxe => dans une fonction ?",
          ["Déclare un paramètre", "Retourne automatiquement l'expression", "Crée une boucle"],
          1,
          "=> retourne automatiquement la valeur de l'expression qui suit, pour les fonctions d'une seule ligne.",
        ),
        link: dartDocs + "language/functions#arrow-syntax",
      }),
    ],
  },
  {
    id: "dart-programmation-modulaire",
    title: "Programmation modulaire en Dart",
    description:
      "Organise ton code en modules réutilisables avec imports, exports et bibliothèques.",
    lessons: [
      lesson({
        id: "dart-imports-exports",
        title: "Imports, exports et organisation du code",
        minutes: 20,
        summary:
          "Structure ton projet en fichiers séparés. Utilise import pour utiliser du code externe et export pour exposer du code.",
        sections: [
          section(
            "Import : utiliser du code externe",
            "import permet d'accéder à du code défini dans d'autres fichiers ou packages.",
            [
              "Import relatif : import 'utils.dart'; importe un fichier dans le même dossier.",
              "Import avec chemin : import 'lib/models/user.dart'; importe depuis un sous-dossier.",
              "Import de package : import 'package:flutter/material.dart'; importe un package externe.",
              "Import avec alias : import 'package:http/http.dart' as http; Accès via http.get(), évite les conflits de noms.",
              "Import partiel : import 'utils.dart' show fonction1, fonction2; Importe seulement ces fonctions.",
              "Import hide : import 'utils.dart' hide fonctionObsolete; Importe tout sauf cette fonction.",
            ],
          ),
          section(
            "Export : exposer du code",
            "export rend le code d'un fichier disponible à travers un autre fichier, créant des points d'entrée clairs.",
            [
              "Syntaxe : export 'models/user.dart'; dans lib/models.dart rend User accessible via import 'models.dart';",
              "Agrégation : Un fichier peut exporter plusieurs autres. lib/models.dart : export 'user.dart'; export 'post.dart';",
              "Barrel files : Un fichier qui exporte plusieurs modules pour simplifier les imports. Au lieu de 3 imports, un seul.",
              "Export partiel : export 'utils.dart' show fonction1; Exporte seulement cette fonction.",
              "Cas d'usage : Créer une API publique claire pour une bibliothèque.",
            ],
          ),
          section(
            "Organisation d'un projet Flutter",
            "Structure ton projet Flutter en dossiers logiques pour faciliter la maintenance et la collaboration.",
            [
              "lib/ : Code source principal de l'application.",
              "lib/main.dart : Point d'entrée unique de l'application.",
              "lib/models/ : Classes de données (User, Post, Product).",
              "lib/screens/ ou lib/pages/ : Écrans de l'application (HomePage, ProfilePage).",
              "lib/widgets/ : Widgets réutilisables (CustomButton, UserCard).",
              "lib/services/ : Services métier (AuthService, ApiService).",
              "lib/utils/ : Fonctions utilitaires (formatDate, validateEmail).",
              "lib/constants/ : Constantes globales (couleurs, URLs API).",
            ],
          ),
          section(
            "Packages et pubspec.yaml",
            "Les packages ajoutent des fonctionnalités à ton projet. pubspec.yaml gère les dépendances.",
            [
              "pubspec.yaml : Fichier de configuration du projet, déclare les dépendances.",
              "Ajouter un package : dependencies:\\n  http: ^1.1.0 dans pubspec.yaml, puis flutter pub get pour télécharger.",
              "Import du package : import 'package:http/http.dart' as http; pour l'utiliser.",
              "Packages officiels : flutter, material, cupertino sont inclus par défaut.",
              "pub.dev : Site officiel des packages Dart/Flutter (pub.dev). Plus de 40 000 packages disponibles.",
              "Versions : ^1.1.0 accepte 1.1.x et 1.x.x (compatibles), 1.1.0 exact, >= 1.1.0 toute version supérieure.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée un fichier lib/utils/math_utils.dart avec des fonctions (additionner, multiplier). Importe-le dans main.dart avec import 'utils/math_utils.dart'; et utilise les fonctions.",
        takeaway:
          "import accède à du code externe, export l'expose. Organise ton projet en dossiers logiques (models, screens, widgets, services). pubspec.yaml gère les dépendances de packages.",
        quiz: quiz(
          "Quel fichier gère les dépendances d'un projet Flutter ?",
          ["main.dart", "pubspec.yaml", "README.md"],
          1,
          "pubspec.yaml déclare toutes les dépendances, assets et configuration du projet.",
        ),
        link: dartDocs + "language/libraries",
      }),
    ],
  },
  {
    id: "dart-poo",
    title: "Programmation Orientée Objet en Dart",
    description:
      "Maîtrise les classes, objets, attributs, méthodes et encapsulation.",
    lessons: [
      lesson({
        id: "dart-classes-objets",
        title: "Classes, constructeurs et instanciation",
        minutes: 28,
        summary:
          "Crée des classes pour modéliser des entités. Utilise les constructeurs pour initialiser les objets et instancie des classes pour créer des objets concrets.",
        sections: [
          section(
            "Déclaration de classes",
            "Une classe est un modèle pour créer des objets. Elle définit les données (attributs) et les comportements (méthodes).",
            [
              "Syntaxe : class NomClasse { /* attributs et méthodes */ }",
              "Exemple simple : class Personne { String nom; int age; }",
              "Convention de nommage : Les classes commencent par une MAJUSCULE (PascalCase). Personne, UtilisateurAdmin.",
              "Fichier séparé : Une classe par fichier recommandé. Fichier user.dart contient class User.",
            ],
          ),
          section(
            "Constructeurs par défaut et nommés",
            "Les constructeurs initialisent les objets lors de leur création. Dart propose plusieurs types de constructeurs.",
            [
              "Constructeur par défaut : class Personne { String nom; int age; Personne(this.nom, this.age); } Syntaxe courte this.nom assigne directement.",
              "Constructeur long : Personne(String nom, int age) { this.nom = nom; this.age = age; } Équivalent mais plus verbeux.",
              "Constructeur nommé : Personne.invite() : nom = 'Invité', age = 0; Crée avec des valeurs par défaut.",
              "Plusieurs constructeurs : class Point { int x, y; Point(this.x, this.y); Point.origine() : x = 0, y = 0; }",
              "Paramètres nommés : Personne({required this.nom, this.age = 18}); Construction explicite avec noms.",
              "Initializer list : Point.fromJson(Map json) : x = json['x'], y = json['y']; Initialise AVANT le corps.",
            ],
          ),
          section(
            "Instanciation : créer des objets",
            "Instancier une classe crée un objet concret en mémoire avec ses propres valeurs d'attributs.",
            [
              "Syntaxe : var objet = NomClasse(arguments); ou NomClasse objet = NomClasse(arguments);",
              "Exemple : var alice = Personne('Alice', 25); Crée une personne nommée Alice de 25 ans.",
              "new optionnel : Dart 2+ n'a plus besoin de new. var alice = Personne('Alice', 25); suffit.",
              "Constructeur nommé : var invité = Personne.invite(); Utilise le constructeur nommé invite.",
              "Accès aux attributs : print(alice.nom); print(alice.age); Accède aux valeurs.",
              "Chaque objet est indépendant : var bob = Personne('Bob', 30); alice et bob sont distincts.",
            ],
          ),
          section(
            "this : référence à l'objet courant",
            "this fait référence à l'instance courante de la classe, utile pour lever l'ambiguïté.",
            [
              "Dans le constructeur : Personne(String nom) { this.nom = nom; } this.nom est l'attribut, nom est le paramètre.",
              "Syntaxe courte : Personne(this.nom, this.age); Assigne automatiquement sans ambiguïté.",
              "Dans les méthodes : void afficher() { print('Je suis ${this.nom}'); } this est optionnel si pas d'ambiguïté.",
              "Éviter : Si pas de conflit de noms, this est optionnel. void afficher() { print(nom); } fonctionne.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une classe Voiture avec attributs marque, modele, annee. Ajoute un constructeur par défaut, un constructeur nommé Voiture.neuve() avec annee = 2024, puis instancie 2 voitures différentes.",
        takeaway:
          "Les classes modélisent des entités avec attributs et méthodes. Les constructeurs initialisent les objets. this référence l'objet courant. L'instanciation crée des objets concrets.",
        quiz: quiz(
          "Que fait this dans un constructeur ?",
          ["Importe une classe", "Référence l'instance courante", "Crée une boucle"],
          1,
          "this référence l'instance courante de la classe, permettant d'accéder à ses attributs et méthodes.",
        ),
        link: dartDocs + "language/classes",
      }),
      lesson({
        id: "dart-attributs-methodes",
        title: "Attributs d'instance, de classe et méthodes",
        minutes: 25,
        summary:
          "Comprends les différences entre attributs d'instance et de classe (static). Ajoute des comportements avec les méthodes.",
        sections: [
          section(
            "Attributs d'instance",
            "Les attributs d'instance sont propres à chaque objet. Chaque instance a ses propres valeurs.",
            [
              "Déclaration : class Personne { String nom; int age; } Chaque Personne a son propre nom et age.",
              "Valeurs distinctes : var alice = Personne('Alice', 25); var bob = Personne('Bob', 30); alice.nom != bob.nom.",
              "Accès : objet.attribut. alice.nom retourne 'Alice'.",
              "Modification : alice.age = 26; Change l'âge d'Alice sans affecter Bob.",
              "Initialisation : Les attributs peuvent avoir des valeurs par défaut. int compteur = 0;",
            ],
          ),
          section(
            "Attributs de classe (static)",
            "Les attributs static appartiennent à la CLASSE, pas aux instances. Une seule valeur partagée par toutes les instances.",
            [
              "Déclaration : class Compteur { static int total = 0; } static avant le type.",
              "Accès via la classe : print(Compteur.total); PAS via une instance.",
              "Partagé : Toutes les instances voient la MÊME valeur. Modifier Compteur.total affecte tous.",
              "Utilisation : Constantes globales, compteurs, configuration partagée.",
              "Exemple : class Config { static const String apiUrl = 'https://api.example.com'; }",
            ],
          ),
          section(
            "Méthodes d'instance",
            "Les méthodes d'instance définissent les comportements d'un objet. Elles peuvent accéder aux attributs de l'instance.",
            [
              "Syntaxe : TypeRetour nomMethode(params) { /* code */ } dans la classe.",
              "Exemple : void sePresenter() { print('Je suis $nom, j\\\\'ai $age ans'); }",
              "Appel : alice.sePresenter(); Affiche 'Je suis Alice, j\\\\'ai 25 ans'.",
              "Accès aux attributs : Les méthodes accèdent directement aux attributs de l'instance (nom, age).",
              "Modification d'état : void vieillir() { age++; } Modifie l'attribut age de l'instance.",
              "Retour de valeur : bool estMajeur() => age >= 18; Retourne un booléen.",
            ],
          ),
          section(
            "Méthodes de classe (static)",
            "Les méthodes static appartiennent à la classe et ne peuvent PAS accéder aux attributs d'instance.",
            [
              "Déclaration : static TypeRetour nomMethode(params) { } avec static.",
              "Exemple : static int comparer(Personne p1, Personne p2) => p1.age - p2.age;",
              "Appel via la classe : var diff = Personne.comparer(alice, bob);",
              "Pas d'accès aux attributs d'instance : static void afficher() { print(nom); } → ERREUR (nom est d'instance).",
              "Utilisation : Fonctions utilitaires, factory methods, constantes calculées.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une classe CompteBancaire avec attribut d'instance solde et attribut static nbComptes. Ajoute méthodes deposer(montant), retirer(montant) et une méthode static afficherNbComptes().",
        takeaway:
          "Les attributs d'instance sont propres à chaque objet, les attributs static sont partagés par toutes les instances. Les méthodes d'instance accèdent aux attributs, les méthodes static ne le peuvent pas.",
        quiz: quiz(
          "Comment accède-t-on à un attribut static ?",
          ["objet.attribut", "NomClasse.attribut", "this.attribut"],
          1,
          "Les attributs static s'accèdent via le nom de la classe, pas via une instance.",
        ),
        link: dartDocs + "language/classes#static-variables",
      }),
      lesson({
        id: "dart-encapsulation",
        title: "Encapsulation : private, getters et setters",
        minutes: 25,
        summary:
          "Protège les données de tes classes avec l'encapsulation. Utilise le préfixe _, les getters et setters pour contrôler l'accès.",
        sections: [
          section(
            "Modificateurs d'accès : public et private",
            "Dart n'a pas de mot-clé private/public. L'underscore _ rend un membre privé au niveau de la BIBLIOTHÈQUE (fichier).",
            [
              "Public par défaut : class Personne { String nom; } nom est accessible partout.",
              "Private avec _ : class Personne { String _nom; } _nom est privé, accessible seulement dans le fichier.",
              "Au niveau bibliothèque : _nom est accessible dans le même fichier, mais pas depuis un autre fichier.",
              "Classes privées : class _HelperInterne { } Cette classe est privée, inaccessible depuis l'extérieur.",
              "Pas de protected : Dart n'a pas de protected. Seulement public et private (avec _).",
            ],
          ),
          section(
            "Getters : lire des données calculées",
            "Les getters permettent de lire des valeurs comme des attributs, mais avec une logique de calcul derrière.",
            [
              "Syntaxe : Type get nomGetter => expression; ou Type get nomGetter { /* code */ return valeur; }",
              "Exemple : String get nomComplet => '$prenom $nom'; Combine deux attributs.",
              "Accès comme attribut : print(personne.nomComplet); PAS de () pour l'appel.",
              "Getter calculé : int get ageAnneeProchaine => age + 1; Calcule à chaque accès.",
              "Getter sur private : String _nom; String get nom => _nom; Expose _nom en lecture seule.",
            ],
          ),
          section(
            "Setters : contrôler la modification",
            "Les setters permettent de valider ou transformer des données avant de les assigner.",
            [
              "Syntaxe : set nomSetter(Type valeur) { /* validation */ attribut = valeur; }",
              "Exemple : set age(int valeur) { if (valeur >= 0) _age = valeur; }",
              "Utilisation : personne.age = 30; Appelle le setter, valide et assigne.",
              "Validation : Le setter peut rejeter des valeurs invalides. set email(String val) { if (val.contains('@')) _email = val; }",
              "Setter + Getter : Souvent utilisés ensemble pour encapsuler un attribut privé. int _age; int get age => _age; set age(int val) => _age = val;",
            ],
          ),
          section(
            "Encapsulation : pourquoi et comment",
            "L'encapsulation protège les données et garantit la cohérence de l'état de l'objet.",
            [
              "Cacher les détails : Les attributs privés cachent l'implémentation interne.",
              "Contrôle d'accès : Les setters valident les données avant modification.",
              "Flexibilité : Tu peux changer l'implémentation interne sans casser le code externe.",
              "Exemple : class Rectangle { double _largeur, _hauteur; double get aire => _largeur * _hauteur; }",
              "Lecture seule : Un getter sans setter crée un attribut en lecture seule.",
              "Bonnes pratiques : Attributs privés par défaut, expose via getters/setters si nécessaire.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une classe Temperature avec attribut privé _celsius. Ajoute un getter celsius et un setter celsius qui rejette les températures < -273.15 (zéro absolu). Ajoute un getter fahrenheit qui calcule depuis _celsius.",
        takeaway:
          "L'underscore _ rend un membre privé à la bibliothèque. Les getters lisent des valeurs calculées, les setters valident avant modification. L'encapsulation protège et contrôle l'accès aux données.",
        quiz: quiz(
          "Comment rendre un attribut privé en Dart ?",
          ["Mot-clé private", "Préfixe _", "Mot-clé protected"],
          1,
          "Le préfixe _ rend un membre privé au niveau de la bibliothèque (fichier).",
        ),
        link: dartDocs + "language/classes#getters-and-setters",
      }),
    ],
  },
  {
    id: "dart-structures-donnees",
    title: "Structures de données en Dart",
    description:
      "Maîtrise les collections : List (tableaux), Set (ensembles) et Map (dictionnaires).",
    lessons: [
      lesson({
        id: "dart-list",
        title: "List : tableaux dynamiques",
        minutes: 28,
        summary:
          "Les List sont des collections ordonnées et indexées. Apprends à créer, manipuler et parcourir des listes avec les méthodes essentielles.",
        sections: [
          section(
            "Création et initialisation de List",
            "Les List sont des tableaux dynamiques qui peuvent grandir ou rétrécir. Elles sont ordonnées (index 0, 1, 2...) et peuvent contenir des doublons.",
            [
              "List littérale : var fruits = ['pomme', 'banane', 'orange']; Création directe avec [].",
              "Type explicite : List<String> fruits = ['pomme', 'banane']; Force le type des éléments.",
              "List vide : var liste = <int>[]; ou List<int> liste = []; Liste vide typée.",
              "List.filled : var zeros = List.filled(5, 0); Crée [0, 0, 0, 0, 0], 5 éléments à 0.",
              "List.generate : var carres = List.generate(5, (i) => i * i); Crée [0, 1, 4, 9, 16].",
              "Inférence de type : var nombres = [1, 2, 3]; Dart déduit List<int>.",
            ],
          ),
          section(
            "Accès et modification",
            "Accède aux éléments par index (0-based), modifie-les et vérifie les limites.",
            [
              "Accès par index : var premier = fruits[0]; Retourne 'pomme'. Index commence à 0.",
              "Modification : fruits[1] = 'fraise'; Remplace 'banane' par 'fraise'.",
              "first et last : fruits.first retourne le premier, fruits.last le dernier.",
              "Hors limites : fruits[10] → RangeError si l'index n'existe pas. Toujours vérifier.",
              "length : fruits.length retourne le nombre d'éléments. Utilise pour boucler jusqu'à length - 1.",
              "isEmpty / isNotEmpty : fruits.isEmpty retourne true si la liste est vide.",
            ],
          ),
          section(
            "Ajout et suppression",
            "Modifie la taille des List en ajoutant ou supprimant des éléments.",
            [
              "add : fruits.add('kiwi'); Ajoute à la fin de la liste.",
              "insert : fruits.insert(1, 'mangue'); Insère 'mangue' à l'index 1, décale les suivants.",
              "addAll : fruits.addAll(['poire', 'cerise']); Ajoute plusieurs éléments.",
              "remove : fruits.remove('banane'); Retire la première occurrence de 'banane'.",
              "removeAt : fruits.removeAt(0); Retire l'élément à l'index 0.",
              "removeLast : fruits.removeLast(); Retire et retourne le dernier élément.",
              "clear : fruits.clear(); Vide complètement la liste.",
            ],
          ),
          section(
            "Méthodes utiles sur List",
            "Dart offre de nombreuses méthodes pour manipuler, transformer et rechercher dans les List.",
            [
              "contains : fruits.contains('pomme') retourne true si présent.",
              "indexOf : fruits.indexOf('banane') retourne l'index ou -1 si absent.",
              "reversed : fruits.reversed retourne un Iterable inversé. Utilise .toList() pour une List.",
              "sort : nombres.sort(); Trie en place (modifie la liste). nombres.sort((a, b) => b - a); pour ordre décroissant.",
              "sublist : fruits.sublist(1, 3) retourne une sous-liste de l'index 1 à 3 (exclu).",
              "join : fruits.join(', ') retourne 'pomme, banane, orange' (String).",
              "map, where, reduce : Vues précédemment dans les boucles. Transforment et filtrent.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une List de nombres [5, 2, 8, 1, 9, 3]. Ajoute 7, retire 2, trie la liste, puis affiche seulement les nombres pairs avec where.",
        takeaway:
          "Les List sont des tableaux dynamiques ordonnés et indexés. Utilise add/remove pour modifier, length pour la taille, et les méthodes map/where/sort pour manipuler.",
        quiz: quiz(
          "Quelle méthode ajoute un élément à la fin d'une List ?",
          ["insert", "add", "push"],
          1,
          "add() ajoute un élément à la fin de la liste. insert() insère à un index précis.",
        ),
        link: dartDocs + "library/dart-core/List-class",
      }),
      lesson({
        id: "dart-set",
        title: "Set : ensembles sans doublons",
        minutes: 22,
        summary:
          "Les Set stockent des valeurs uniques sans ordre garanti. Utilise-les pour éliminer les doublons et effectuer des opérations ensemblistes.",
        sections: [
          section(
            "Création et caractéristiques des Set",
            "Un Set est une collection NON ORDONNÉE de valeurs UNIQUES. Pas de doublons autorisés.",
            [
              "Set littéral : var nombres = {1, 2, 3, 4}; Attention : {} crée un Set, pas une Map.",
              "Set vide : var ensemble = <int>{}; ou Set<int> ensemble = {}; Pour un Set vide typé.",
              "Set.from : var ensemble = Set.from([1, 2, 2, 3]); Crée {1, 2, 3}, élimine doublons.",
              "Pas d'ordre garanti : L'ordre d'insertion peut ne pas être préservé (selon l'implémentation).",
              "Unicité : Ajouter 2 fois la même valeur ne crée qu'une seule entrée.",
            ],
          ),
          section(
            "Ajout, suppression et recherche",
            "Manipule les ensembles avec des opérations simples.",
            [
              "add : nombres.add(5); Ajoute 5 au Set (ignoré si déjà présent).",
              "addAll : nombres.addAll([6, 7, 8]); Ajoute plusieurs valeurs.",
              "remove : nombres.remove(3); Retire 3 du Set.",
              "contains : nombres.contains(2) retourne true si 2 est présent.",
              "length : nombres.length retourne le nombre d'éléments uniques.",
              "clear : nombres.clear(); Vide le Set.",
            ],
          ),
          section(
            "Opérations ensemblistes",
            "Les Set supportent les opérations mathématiques sur les ensembles : union, intersection, différence.",
            [
              "Union : var union = setA.union(setB); Tous les éléments des deux Sets.",
              "Intersection : var inter = setA.intersection(setB); Éléments communs aux deux.",
              "Différence : var diff = setA.difference(setB); Éléments dans A mais pas dans B.",
              "Exemple : {1, 2, 3}.union({3, 4, 5}) donne {1, 2, 3, 4, 5}.",
              "Exemple : {1, 2, 3}.intersection({2, 3, 4}) donne {2, 3}.",
            ],
          ),
          section(
            "Quand utiliser Set vs List",
            "Choisis Set pour les valeurs uniques et les opérations ensemblistes, List pour l'ordre et l'indexation.",
            [
              "Utilise Set : Éliminer les doublons, tester l'appartenance rapidement, opérations ensemblistes.",
              "Utilise List : Besoin d'ordre, accès par index, doublons autorisés.",
              "Performance : contains() est plus rapide sur Set (O(1)) que List (O(n)).",
              "Conversion : Set vers List : setA.toList(); List vers Set : listA.toSet(); (élimine doublons).",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée une List avec doublons [1, 2, 2, 3, 3, 3, 4]. Convertis-la en Set pour éliminer les doublons. Crée un autre Set {3, 4, 5, 6} et calcule l'intersection.",
        takeaway:
          "Les Set stockent des valeurs UNIQUES sans ordre garanti. Utilise-les pour éliminer les doublons et faire des opérations ensemblistes (union, intersection, différence).",
        quiz: quiz(
          "Que se passe-t-il si tu ajoutes la même valeur deux fois dans un Set ?",
          ["Erreur de compilation", "La valeur est ajoutée deux fois", "La deuxième tentative est ignorée"],
          2,
          "Un Set ne peut contenir qu'une seule instance de chaque valeur. Les ajouts en double sont ignorés.",
        ),
        link: dartDocs + "library/dart-core/Set-class",
      }),
      lesson({
        id: "dart-map",
        title: "Map : dictionnaires clé-valeur",
        minutes: 25,
        summary:
          "Les Map associent des clés à des valeurs. Apprends à créer, accéder et manipuler des dictionnaires pour stocker des données structurées.",
        sections: [
          section(
            "Création et structure des Map",
            "Un Map associe des CLÉS uniques à des VALEURS. Comme un dictionnaire : tu cherches par clé, tu obtiens la valeur.",
            [
              "Map littérale : var ages = {'Alice': 25, 'Bob': 30, 'Charlie': 35}; Clés String, valeurs int.",
              "Map vide : var map = <String, int>{}; ou Map<String, int> map = {}; Type clé et valeur.",
              "Map() : var map = Map<String, int>(); Constructeur explicite.",
              "Types mixtes : var data = {'nom': 'Alice', 'age': 25, 'actif': true}; Type Map<String, dynamic>.",
              "Clés uniques : Chaque clé n'apparaît qu'une fois. Ajouter la même clé écrase la valeur précédente.",
            ],
          ),
          section(
            "Accès et modification",
            "Accède aux valeurs par clé, modifie-les, ajoute de nouvelles paires clé-valeur.",
            [
              "Accès par clé : var ageAlice = ages['Alice']; Retourne 25. Si clé absente, retourne null.",
              "Modification : ages['Alice'] = 26; Change la valeur associée à 'Alice'.",
              "Ajout : ages['Diana'] = 28; Ajoute une nouvelle paire clé-valeur.",
              "Suppression : ages.remove('Bob'); Retire la paire avec clé 'Bob'.",
              "Accès sûr : var age = ages['Inconnu'] ?? 0; Utilise 0 si la clé n'existe pas.",
              "Vérification : ages.containsKey('Alice') retourne true si la clé existe.",
            ],
          ),
          section(
            "Itération sur Map",
            "Parcours les clés, les valeurs ou les paires clé-valeur d'un Map.",
            [
              "Parcourir les clés : for (var nom in ages.keys) { print(nom); } Affiche 'Alice', 'Bob', 'Charlie'.",
              "Parcourir les valeurs : for (var age in ages.values) { print(age); } Affiche 25, 30, 35.",
              "Parcourir les entrées : for (var entry in ages.entries) { print('${entry.key}: ${entry.value}'); }",
              "forEach : ages.forEach((nom, age) => print('$nom a $age ans')); Style fonctionnel.",
              "map sur Map : var doubles = ages.map((nom, age) => MapEntry(nom, age * 2)); Transforme les valeurs.",
            ],
          ),
          section(
            "Méthodes utiles sur Map",
            "Dart offre de nombreuses méthodes pour manipuler, transformer et rechercher dans les Map.",
            [
              "length : ages.length retourne le nombre de paires clé-valeur.",
              "isEmpty / isNotEmpty : ages.isEmpty retourne true si le Map est vide.",
              "containsKey : ages.containsKey('Alice') teste l'existence d'une clé.",
              "containsValue : ages.containsValue(25) teste l'existence d'une valeur.",
              "clear : ages.clear(); Vide complètement le Map.",
              "putIfAbsent : ages.putIfAbsent('Eve', () => 22); Ajoute seulement si la clé n'existe pas.",
              "update : ages.update('Alice', (age) => age + 1); Met à jour la valeur avec une fonction.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Crée un Map de produits {'pomme': 2.5, 'banane': 1.8, 'orange': 3.0}. Ajoute 'kiwi': 4.2, augmente le prix de 'pomme' de 10%, affiche tous les produits avec leur prix.",
        takeaway:
          "Les Map associent des clés uniques à des valeurs. Utilise [] pour accéder, containsKey pour vérifier, forEach pour parcourir. Idéal pour stocker des données structurées.",
        quiz: quiz(
          "Que retourne ages['Inconnu'] si la clé n'existe pas ?",
          ["0", "null", "Erreur"],
          1,
          "Accéder à une clé inexistante retourne null. Utilise ?? pour fournir une valeur par défaut.",
        ),
        link: dartDocs + "library/dart-core/Map-class",
      }),
    ],
  },
  {
    id: "flutter-widgets-intro",
    title: "Introduction aux Widgets Flutter",
    description:
      "Comprends les widgets, la différence FONDAMENTALE entre StatelessWidget et StatefulWidget, et crée tes premières interfaces.",
    lessons: [
      lesson({
        id: "stateless-vs-stateful-detaille",
        title: "StatelessWidget vs StatefulWidget : Différences fondamentales",
        minutes: 35,
        summary:
          "Comprends EN DÉTAIL la différence entre StatelessWidget et StatefulWidget. Apprends QUAND utiliser chacun, leur cycle de vie, et comment ils gèrent les données. Concept ESSENTIEL de Flutter.",
        sections: [
          section(
            "Qu'est-ce qu'un Widget ?",
            "Dans Flutter, TOUT est un widget. C'est le concept central : les widgets décrivent l'interface utilisateur de manière DÉCLARATIVE.",
            [
              "Widget = Description : Un widget décrit à QUOI l'interface doit ressembler, pas COMMENT la construire.",
              "Immutable : Les widgets sont immutables (ne changent jamais). Pour changer l'interface, Flutter crée de NOUVEAUX widgets.",
              "Arbre de widgets : L'interface est un arbre de widgets imbriqués. Scaffold contient AppBar qui contient Text, etc.",
              "Widget Everything : Boutons, textes, paddings, layouts, animations... TOUT est un widget.",
              "Build method : Chaque widget a une méthode build() qui retourne l'arbre de widgets à afficher.",
            ],
          ),
          section(
            "StatelessWidget : Widget SANS état interne",
            "Un StatelessWidget est un widget qui NE CHANGE PAS dans le temps. Il affiche des données mais ne les modifie jamais.",
            [
              "Définition : StatelessWidget = widget SANS état mutable. Une fois construit, il ne change plus.",
              "Données en lecture seule : Peut RECEVOIR des données via le constructeur, mais ne peut PAS les modifier.",
              "Reconstruit par le parent : Si l'affichage doit changer, c'est le PARENT qui reconstruit le StatelessWidget avec de nouvelles données.",
              "Exemple : Text, Icon, Image sont des StatelessWidget. Ils affichent ce qu'on leur donne, sans changer.",
              "Syntaxe : class MonWidget extends StatelessWidget { @override Widget build(BuildContext context) { return Text('Hello'); } }",
              "Cycle de vie simple : Constructeur → build() → affiché. Pas de méthode de cycle de vie complexe.",
            ],
          ),
          section(
            "StatefulWidget : Widget AVEC état interne",
            "Un StatefulWidget est un widget qui PEUT CHANGER dans le temps. Il possède un État (State) mutable qui peut évoluer.",
            [
              "Définition : StatefulWidget = widget AVEC état mutable. Peut changer pendant qu'il est affiché.",
              "Deux classes : StatefulWidget (immutable) + State (mutable). Le widget crée son State.",
              "État mutable : La classe State contient les données qui peuvent changer (compteur, formulaire, etc.).",
              "setState() : Pour modifier l'état, appelle setState(() { }). Flutter reconstruit l'interface automatiquement.",
              "Exemple : Checkbox, TextField, Counter sont des StatefulWidget. Ils changent quand l'utilisateur interagit.",
              "Syntaxe : class MonWidget extends StatefulWidget { @override State<MonWidget> createState() => _MonWidgetState(); } class _MonWidgetState extends State<MonWidget> { }",
            ],
          ),
          section(
            "Différences FONDAMENTALES : Tableau comparatif",
            "Voici les différences ESSENTIELLES entre StatelessWidget et StatefulWidget à comprendre absolument.",
            [
              "État : StatelessWidget = AUCUN état interne. StatefulWidget = État mutable dans la classe State.",
              "Changement : StatelessWidget = Ne change JAMAIS seul. StatefulWidget = Peut changer avec setState().",
              "Reconstruction : StatelessWidget = Reconstruit par le parent uniquement. StatefulWidget = Se reconstruit lui-même avec setState().",
              "Complexité : StatelessWidget = 1 classe simple. StatefulWidget = 2 classes (Widget + State).",
              "Performance : StatelessWidget = Plus léger (pas d'état). StatefulWidget = Légèrement plus lourd (gestion état).",
              "Cycle de vie : StatelessWidget = Simple (constructeur + build). StatefulWidget = Complexe (initState, dispose, etc.).",
              "Utilisation : StatelessWidget = Affichage pur, composants réutilisables. StatefulWidget = Interactions, formulaires, animations.",
            ],
          ),
          section(
            "QUAND utiliser StatelessWidget ?",
            "Utilise StatelessWidget quand ton widget n'a PAS BESOIN de changer par lui-même.",
            [
              "Affichage pur : Textes, images, icônes qui affichent des données sans les modifier.",
              "Composants réutilisables : Boutons personnalisés, cartes, layouts qui reçoivent des props.",
              "Pas d'interaction : Si le widget ne répond pas aux interactions utilisateur (ou les délègue au parent).",
              "Données du parent : Le widget affiche des données PASSÉES par le parent via le constructeur.",
              "Exemple : class TitreSection extends StatelessWidget { final String titre; TitreSection(this.titre); }",
              "Performance : Préfère StatelessWidget quand possible, c'est plus léger.",
            ],
          ),
          section(
            "QUAND utiliser StatefulWidget ?",
            "Utilise StatefulWidget quand ton widget DOIT gérer des données qui changent dans le temps.",
            [
              "Interactions utilisateur : Checkbox, Switch, TextField qui changent quand l'utilisateur agit.",
              "Compteurs, timers : Valeurs qui évoluent automatiquement dans le temps.",
              "Formulaires : Champs de saisie, validation, état de soumission.",
              "Animations : Widgets qui animent des valeurs (position, couleur, taille).",
              "État local : Données qui n'appartiennent QU'À ce widget (pas partagées avec d'autres).",
              "Exemple : Compteur, panier d'achat, lecteur audio avec lecture/pause.",
            ],
          ),
          section(
            "Cycle de vie de StatefulWidget : Étapes détaillées",
            "Comprends les méthodes de cycle de vie pour gérer correctement l'initialisation, les mises à jour et la destruction.",
            [
              "1. createState() : Appelé UNE SEULE FOIS quand le widget est inséré dans l'arbre. Crée l'objet State.",
              "2. initState() : Appelé UNE SEULE FOIS après createState. Initialise les données, abonnements, controllers. super.initState() OBLIGATOIRE en premier.",
              "3. build() : Appelé À CHAQUE fois que l'état change (setState) ou que le parent reconstruit. Retourne l'arbre de widgets.",
              "4. setState() : Marque le State comme 'dirty'. Flutter rappellera build() pour reconstruire l'interface.",
              "5. didUpdateWidget() : Appelé quand le widget parent change ses paramètres. Permet de réagir aux changements de props.",
              "6. dispose() : Appelé UNE SEULE FOIS quand le widget est DÉFINITIVEMENT retiré. Libère les ressources (controllers, listeners, timers). super.dispose() OBLIGATOIRE en dernier.",
              "Ordre complet : createState → initState → build → (setState → build)* → dispose.",
            ],
          ),
          section(
            "Exemple concret : StatelessWidget",
            "Créons un widget de carte de profil SANS état. Il affiche juste ce qu'on lui donne.",
            [
              "Un StatelessWidget simple qui reçoit des données et les affiche sans pouvoir les modifier.",
              "```dart",
              "class CarteProfilStateless extends StatelessWidget {",
              "  final String nom;",
              "  final String metier;",
              "  CarteProfilStateless({required this.nom, required this.metier});",
              "  Widget build(context) => Card(child: Column(children: [Text(nom), Text(metier)]));",
              "}",
              "```",
              "Usage : CarteProfilStateless(nom: 'Alice', metier: 'Développeuse')",
              "La carte ne change JAMAIS par elle-même. Pour changer le contenu, le PARENT doit reconstruire avec de nouvelles données.",
            ],
          ),
          section(
            "Exemple concret : StatefulWidget",
            "Créons un compteur AVEC état. Il peut incrémenter/décrémenter par lui-même.",
            [
              "Un StatefulWidget avec état mutable (_compteur) qui change quand l'utilisateur appuie sur le bouton.",
              "```dart",
              "class Compteur extends StatefulWidget {",
              "  State createState() => _CompteurState();",
              "}",
              "class _CompteurState extends State<Compteur> {",
              "  int _compteur = 0;",
              "  void _incrementer() { setState(() { _compteur++; }); }",
              "  Widget build(context) => Column(children: [",
              "    Text('$_compteur'),",
              "    ElevatedButton(onPressed: _incrementer, child: Text('+'))",
              "  ]);",
              "}",
              "```",
              "Le compteur change LOCALEMENT quand on appuie sur le bouton. setState() déclenche la reconstruction.",
              "Sans setState(), modifier _compteur ne change PAS l'affichage. setState() est OBLIGATOIRE.",
            ],
          ),
          section(
            "Erreurs courantes et bonnes pratiques",
            "Évite ces pièges fréquents avec les StatefulWidget et StatelessWidget.",
            [
              "❌ Utiliser StatefulWidget pour tout : Si pas besoin d'état, utilise StatelessWidget (plus léger).",
              "❌ Oublier setState() : Modifier _compteur++ SANS setState() ne reconstruit PAS l'interface.",
              "❌ setState() asynchrone : setState(() async { await ... }); → ERREUR. Await AVANT setState : var data = await fetch(); setState(() { _data = data; });",
              "❌ Oublier dispose() : Ne pas libérer les controllers/listeners cause des fuites mémoire.",
              "❌ State dans StatelessWidget : StatelessWidget ne peut PAS avoir de variables mutables (final seulement).",
              "✅ const constructors : Utilise const quand possible pour optimiser : const Text('Hello');",
              "✅ Sépare les widgets : Crée des petits widgets réutilisables au lieu de tout mettre dans build().",
              "✅ Vérifie mounted : Avant setState() après un async, vérifie if (mounted) setState(() {});",
            ],
          ),
        ],
        files: projectExample(counter, "lib/main.dart"),
        task: "Crée un StatelessWidget 'BoutonPersonnalise' qui affiche un bouton avec un texte et une couleur passés en paramètres. Puis crée un StatefulWidget 'CompteurAvance' avec boutons +1, -1 et Reset. Observe la différence.",
        takeaway:
          "StatelessWidget = SANS état, ne change jamais seul, reconstruit par le parent. StatefulWidget = AVEC état mutable, change avec setState(). Utilise StatelessWidget par défaut, StatefulWidget seulement si besoin d'état local.",
        quiz: quiz(
          "Quelle méthode appelles-tu pour reconstruire l'interface après avoir modifié l'état ?",
          ["build()", "setState()", "initState()"],
          1,
          "setState() marque l'état comme modifié et déclenche la reconstruction de l'interface via build().",
        ),
        link: docs + "ui/interactivity",
      }),
      lesson({
        id: "widgets-base-composition",
        title: "Widgets de base et composition",
        minutes: 25,
        summary:
          "Découvre les widgets de base (Text, Icon, Image, Container) et apprends à les composer pour créer des interfaces complexes.",
        sections: [
          section(
            "Text : afficher du texte",
            "Text est le widget le plus simple pour afficher du texte dans Flutter.",
            [
              "Syntaxe simple : Text('Bonjour Flutter') affiche du texte basique.",
              "Style : Text('Titre', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue))",
              "TextStyle : Contrôle police, taille, poids, couleur, décoration (underline, lineThrough).",
              "Multiligne : Text('Ligne 1\\nLigne 2') ou textAlign: TextAlign.center pour centrer.",
              "Overflow : overflow: TextOverflow.ellipsis pour couper avec ... si trop long.",
              "Rich text : RichText et TextSpan pour mixer plusieurs styles dans un même Text.",
            ],
          ),
          section(
            "Icon : afficher des icônes",
            "Icon affiche des icônes Material Design (30 000+ disponibles).",
            [
              "Syntaxe : Icon(Icons.home) affiche l'icône 'home'.",
              "Taille et couleur : Icon(Icons.favorite, size: 48, color: Colors.red)",
              "Icons.* : Explore Icons.search, Icons.settings, Icons.add, Icons.close, etc. (pub.dev/packages/flutter_icons)",
              "IconButton : Bouton cliquable avec icône. IconButton(icon: Icon(Icons.add), onPressed: () {})",
              "Custom icons : Utilise des icônes custom avec IconData ou packages (font_awesome_flutter).",
            ],
          ),
          section(
            "Image : afficher des images",
            "Image affiche des images depuis différentes sources (assets, réseau, mémoire).",
            [
              "Asset (local) : Image.asset('assets/images/logo.png') Déclare dans pubspec.yaml : assets: - assets/images/",
              "Réseau : Image.network('https://example.com/image.jpg') Charge depuis internet.",
              "Mémoire : Image.memory(bytes) Affiche depuis bytes (Uint8List).",
              "Fit : fit: BoxFit.cover (remplit), BoxFit.contain (contient), BoxFit.fill (étire).",
              "Placeholder : FadeInImage ou cached_network_image pour placeholder pendant le chargement.",
              "CircleAvatar : Pour image de profil circulaire. CircleAvatar(backgroundImage: NetworkImage(url))",
            ],
          ),
          section(
            "Container : boîte polyvalente",
            "Container est le widget le plus polyvalent : couleur, padding, margin, bordure, décoration.",
            [
              "Syntaxe : Container(child: Text('Contenu')) Enveloppe n'importe quel widget.",
              "Couleur : Container(color: Colors.blue, child: Text('Bleu'))",
              "Padding : Container(padding: EdgeInsets.all(16), child: ...) Marge intérieure.",
              "Margin : Container(margin: EdgeInsets.all(8), child: ...) Marge extérieure.",
              "Width/Height : Container(width: 100, height: 100, color: Colors.red) Taille fixe.",
              "Decoration : BoxDecoration pour bordures, radius, gradient. decoration: BoxDecoration(borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.grey))",
              "Alignment : alignment: Alignment.center pour centrer le child.",
            ],
          ),
          section(
            "Composition : imbriquer les widgets",
            "La force de Flutter est la composition : imbrique des widgets pour créer des interfaces complexes.",
            [
              "Principe : Chaque widget retourne UN widget. Pour plusieurs, utilise Column, Row, Stack.",
              "Exemple : Container(child: Column(children: [Icon(Icons.star), Text('Étoile')])) Icône au-dessus du texte.",
              "Réutilisabilité : Extrais des widgets complexes en sous-widgets. Au lieu de tout dans build(), crée _buildHeader(), _buildBody().",
              "const : Utilise const pour les widgets qui ne changent jamais. const Text('Hello') optimise les performances.",
              "Extract widget : Dans VS Code, Alt+Enter sur un widget → Extract Widget pour créer un nouveau widget.",
            ],
          ),
        ],
        files: profile.files,
        task: "Crée un widget 'CarteArticle' avec Image en haut, titre (Text bold), description (Text normal), et un Container avec padding/margin/bordure arrondie. Compose tous ces widgets.",
        takeaway:
          "Text, Icon, Image, Container sont les widgets de base. Container est polyvalent (color, padding, margin, decoration). La composition (imbriquer des widgets) est la clé pour créer des interfaces complexes.",
        quiz: quiz(
          "Quel widget utilises-tu pour ajouter du padding autour d'un widget ?",
          ["Padding ou Container avec padding", "Margin", "Spacer"],
          0,
          "Padding ou Container(padding: ...) ajoutent de l'espace intérieur autour d'un widget.",
        ),
        link: docs + "ui/widgets",
      }),
      lesson({
        id: "layout-widgets-flutter",
        title: "Layout : Row, Column, Stack et alignement",
        minutes: 28,
        summary:
          "Maîtrise les widgets de layout pour positionner et aligner tes widgets. Row (horizontal), Column (vertical), Stack (superposition).",
        sections: [
          section(
            "Column : empiler verticalement",
            "Column empile ses enfants VERTICALEMENT (de haut en bas).",
            [
              "Syntaxe : Column(children: [widget1, widget2, widget3]) Liste d'enfants.",
              "MainAxisAlignment : Alignement sur l'axe principal (vertical pour Column). start (haut), center, end (bas), spaceBetween, spaceAround, spaceEvenly.",
              "CrossAxisAlignment : Alignement sur l'axe transversal (horizontal pour Column). start (gauche), center, end (droite), stretch (étire).",
              "Exemple : Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.start, children: [Text('1'), Text('2')])",
              "mainAxisSize : MainAxisSize.min (prend le minimum), MainAxisSize.max (prend tout l'espace, défaut).",
            ],
          ),
          section(
            "Row : aligner horizontalement",
            "Row aligne ses enfants HORIZONTALEMENT (de gauche à droite).",
            [
              "Syntaxe : Row(children: [widget1, widget2, widget3]) Liste d'enfants.",
              "MainAxisAlignment : Alignement sur l'axe principal (horizontal pour Row). start (gauche), center, end (droite), spaceBetween, spaceAround, spaceEvenly.",
              "CrossAxisAlignment : Alignement sur l'axe transversal (vertical pour Row). start (haut), center, end (bas), stretch.",
              "Exemple : Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Icon(Icons.home), Text('Accueil'), Icon(Icons.settings)])",
              "Overflow : Si les enfants dépassent, erreur d'overflow. Utilise Expanded ou Flexible pour adapter.",
            ],
          ),
          section(
            "Stack : superposer des widgets",
            "Stack superpose ses enfants en COUCHES (z-index). Le premier est en arrière, le dernier devant.",
            [
              "Syntaxe : Stack(children: [fond, milieu, devant]) Ordre = profondeur.",
              "Alignment : alignment: Alignment.topRight positionne tous les enfants en haut à droite.",
              "Positioned : Positionne précisément un enfant. Stack(children: [Positioned(top: 10, left: 20, child: Text('Coin'))])",
              "Positioned.fill : Remplit tout le Stack. Positioned.fill(child: Container(color: Colors.blue))",
              "Exemple : Stack(children: [Image.network(url), Positioned(bottom: 0, child: Text('Légende'))]) Texte sur l'image.",
              "Use case : Badges, overlays, images avec texte superposé.",
            ],
          ),
          section(
            "Expanded et Flexible : gérer l'espace",
            "Expanded et Flexible permettent aux enfants de Row/Column de prendre l'espace restant.",
            [
              "Expanded : Prend TOUT l'espace disponible. Row(children: [Expanded(child: Container(color: Colors.red)), Icon(Icons.star)]) Container prend le reste.",
              "flex : Contrôle la proportion. Row(children: [Expanded(flex: 2, child: A), Expanded(flex: 1, child: B)]) A prend 2/3, B prend 1/3.",
              "Flexible : Comme Expanded mais peut être plus petit que l'espace. fit: FlexFit.loose (peut rétrécir), FlexFit.tight (comme Expanded).",
              "Spacer : Crée un espace vide flexible. Row(children: [Text('Gauche'), Spacer(), Text('Droite')]) Pousse à gauche et droite.",
            ],
          ),
          section(
            "Scaffold : structure d'écran Material",
            "Scaffold fournit la structure de base d'un écran Material Design (AppBar, Body, FloatingActionButton).",
            [
              "Syntaxe : Scaffold(appBar: AppBar(...), body: Container(...), floatingActionButton: FloatingActionButton(...))",
              "AppBar : Barre en haut avec titre, actions. AppBar(title: Text('Titre'), actions: [IconButton(icon: Icon(Icons.search), onPressed: () {})])",
              "body : Contenu principal de l'écran. Peut être Column, ListView, SingleChildScrollView, etc.",
              "FloatingActionButton : Bouton flottant en bas à droite. floatingActionButton: FloatingActionButton(onPressed: () {}, child: Icon(Icons.add))",
              "Drawer : Menu latéral. drawer: Drawer(child: ListView(...)) Ouvert avec l'icône hamburger.",
              "BottomNavigationBar : Barre de navigation en bas. bottomNavigationBar: BottomNavigationBar(items: [...])",
            ],
          ),
        ],
        files: profile.files,
        task: "Crée un écran avec Scaffold : AppBar avec titre, body avec Column contenant 3 cartes (Row avec image + texte), et un FloatingActionButton. Utilise Expanded dans un des Row.",
        takeaway:
          "Column empile verticalement, Row aligne horizontalement, Stack superpose. MainAxisAlignment et CrossAxisAlignment contrôlent l'alignement. Expanded prend l'espace restant. Scaffold structure les écrans Material.",
        quiz: quiz(
          "Quel widget utilises-tu pour qu'un enfant de Row prenne tout l'espace restant ?",
          ["Spacer", "Expanded", "Padding"],
          1,
          "Expanded fait en sorte qu'un enfant de Row ou Column prenne tout l'espace disponible restant.",
        ),
        link: docs + "ui/layout",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "etat-local-flutter",
    title: "Gestion d'état local avec setState",
    description: "Maîtrise setState pour gérer l'état local de tes widgets.",
    lessons: [
      lesson({
        id: "setstate-pratique",
        title: "setState en pratique : patterns et bonnes pratiques",
        minutes: 25,
        summary:
          "Apprends à utiliser setState correctement pour mettre à jour l'interface. Découvre les patterns courants et les pièges à éviter.",
        sections: [
          section(
            "setState : comment ça marche ?",
            "setState marque l'état comme modifié et déclenche la reconstruction du widget.",
            [
              "Syntaxe : setState(() { _variable = nouvelleValeur; }); Le callback modifie l'état.",
              "Synchrone : Le callback de setState DOIT être SYNCHRONE. Pas de await dedans.",
              "Reconstruction : Après setState, Flutter appelle build() pour reconstruire l'interface.",
              "Scope : setState ne reconstruit QUE le widget où il est appelé (pas tout l'arbre).",
              "Multiple setState : Plusieurs setState successifs sont fusionnés en une reconstruction.",
            ],
          ),
          section(
            "Patterns courants avec setState",
            "Voici les patterns les plus courants pour gérer l'état local avec setState.",
            [
              "Toggle booléen : setState(() { _estActive = !_estActive; }); Inverse un booléen.",
              "Compteur : setState(() { _compteur++; }); ou setState(() { _compteur += valeur; });",
              "Liste : setState(() { _items.add(nouvelItem); }); Ajoute à une liste.",
              "Form : setState(() { _nom = nouvelleValeur; }); Met à jour depuis un TextField.",
              "Async puis setState : var data = await fetchData(); if (mounted) setState(() { _data = data; });",
            ],
          ),
          section(
            "Erreurs courantes et solutions",
            "Évite ces pièges fréquents avec setState.",
            [
              "❌ setState async : setState(() async { await ... }); → ERREUR. Fais await AVANT setState.",
              "❌ setState après dispose : Appeler setState après que le widget est détruit → crash. Vérifie if (mounted) avant.",
              "❌ setState dans build : Ne JAMAIS appeler setState dans build() → boucle infinie.",
              "❌ setState trop souvent : setState à chaque frame → performance. Limite les setState.",
              "✅ Vérifie mounted : if (mounted) setState(() {}); après async.",
              "✅ Regroupe les changements : Une seule setState pour plusieurs variables.",
            ],
          ),
        ],
        files: counter.files,
        task: "Crée un widget avec 3 boutons : Incrémenter, Décrémenter, Reset. Gère le compteur avec setState. Ajoute un bouton async qui attend 2s puis incrémente (vérifie mounted).",
        takeaway:
          "setState(() {}) marque l'état comme modifié et reconstruit le widget. Le callback doit être synchrone. Vérifie mounted après async. Ne jamais appeler setState dans build().",
        quiz: quiz(
          "Que fais-tu après un await et avant setState ?",
          ["Rien", "Vérifie if (mounted)", "Appelle dispose()"],
          1,
          "Après un await, vérifie if (mounted) avant setState pour éviter un crash si le widget est détruit.",
        ),
        link: docs + "ui/interactivity#managing-state",
      }),
    ],
  },
  {
    id: "listes-flutter",
    title: "ListView et affichage de listes",
    description: "Affiche des listes dynamiques avec ListView.builder.",
    lessons: [
      lesson({
        id: "listview-builder",
        title: "ListView.builder : listes efficaces",
        minutes: 23,
        summary:
          "ListView.builder construit les éléments à la demande (lazy loading) pour des listes performantes, même avec des milliers d'éléments.",
        sections: [
          section(
            "ListView vs ListView.builder",
            "ListView crée TOUS les éléments d'un coup, ListView.builder les crée à la demande (quand ils apparaissent à l'écran).",
            [
              "ListView : ListView(children: [item1, item2, ...]) Crée tous les éléments immédiatement. OK pour petites listes (<20).",
              "ListView.builder : ListView.builder(itemCount: 1000, itemBuilder: (context, index) => ...) Crée seulement les visibles. Essentiel pour grandes listes.",
              "Performance : builder est BEAUCOUP plus performant (lazy loading). Utilise-le par défaut.",
              "itemCount : Nombre total d'éléments. itemBuilder est appelé pour chaque index visible.",
              "itemBuilder : (BuildContext context, int index) => Widget. Retourne le widget pour cet index.",
            ],
          ),
          section(
            "Exemple pratique : liste de tâches",
            "Créons une liste de tâches scrollable avec ListView.builder.",
            [
              "```dart",
              "List<String> _taches = ['Tâche 1', 'Tâche 2', 'Tâche 3'];",
              "",
              "ListView.builder(",
              "  itemCount: _taches.length,",
              "  itemBuilder: (context, index) {",
              "    return ListTile(",
              "      leading: Icon(Icons.check_circle),",
              "      title: Text(_taches[index]),",
              "      onTap: () { print('Tâche $index tappée'); },",
              "    );",
              "  },",
              ")",
              "```",
              "ListTile : Widget pratique pour items de liste (leading, title, subtitle, trailing, onTap).",
            ],
          ),
        ],
        files: todo.files,
        task: "Crée une liste de 100 éléments avec ListView.builder. Affiche 'Item 0', 'Item 1'... Ajoute un bouton pour supprimer un élément (setState).",
        takeaway:
          "ListView.builder crée les éléments à la demande (lazy). itemCount fixe le nombre, itemBuilder construit chaque élément. Utilise toujours builder pour grandes listes.",
        quiz: quiz(
          "Pourquoi préfère-t-on ListView.builder à ListView ?",
          ["Plus joli", "Lazy loading (performance)", "Obligatoire"],
          1,
          "ListView.builder crée seulement les éléments visibles (lazy loading), bien plus performant pour grandes listes.",
        ),
        link: docs + "cookbook/lists/long-lists",
      }),
    ],
  },
  {
    id: "navigation-flutter",
    title: "Navigation entre écrans",
    description: "Navigue entre plusieurs écrans avec Navigator.",
    lessons: [
      lesson({
        id: "navigator-push-pop",
        title: "Navigator.push et Navigator.pop",
        minutes: 20,
        summary:
          "Navigator gère une pile d'écrans. push() ouvre un nouvel écran, pop() revient en arrière.",
        sections: [
          section(
            "Navigation de base",
            "Navigator.push ouvre un nouvel écran par-dessus le courant. Navigator.pop revient en arrière.",
            [
              "push : Navigator.push(context, MaterialPageRoute(builder: (context) => NouvelEcran()));",
              "pop : Navigator.pop(context); Retourne à l'écran précédent.",
              "Pile : Les écrans s'empilent. push empile, pop dépile.",
              "MaterialPageRoute : Transition Material Design (slide de droite).",
              "CupertinoPageRoute : Transition iOS (slide de bas).",
            ],
          ),
          section(
            "Passer des données",
            "Passe des données au nouvel écran via le constructeur, récupère des données avec pop.",
            [
              "Passer : Navigator.push(context, MaterialPageRoute(builder: (context) => DetailEcran(id: 123)));",
              "Recevoir : class DetailEcran extends StatelessWidget { final int id; DetailEcran({required this.id}); }",
              "Retourner données : Navigator.pop(context, 'Résultat'); Le push retourne un Future<dynamic>.",
              "Récupérer : var resultat = await Navigator.push(...); print(resultat);",
            ],
          ),
        ],
        files: todo.files,
        task: "Crée 2 écrans : Liste et Détail. Liste affiche une ListView, tap ouvre Détail avec Navigator.push. Détail a un bouton Retour qui appelle Navigator.pop.",
        takeaway:
          "Navigator.push() ouvre un écran, Navigator.pop() revient. Passe des données via le constructeur, retourne avec pop(context, data).",
        quiz: quiz(
          "Quelle méthode utilises-tu pour revenir à l'écran précédent ?",
          ["Navigator.push()", "Navigator.pop()", "Navigator.back()"],
          1,
          "Navigator.pop(context) retire l'écran courant de la pile et revient au précédent.",
        ),
        link: docs + "cookbook/navigation/navigation-basics",
      }),
    ],
  },
  {
    id: "formulaires-flutter",
    title: "Formulaires et validation",
    description: "Crée des formulaires avec TextField et valide les données.",
    lessons: [
      lesson({
        id: "textfield-controller",
        title: "TextField et TextEditingController",
        minutes: 22,
        summary:
          "TextField permet la saisie de texte. TextEditingController contrôle et récupère le contenu.",
        sections: [
          section(
            "TextField de base",
            "TextField est le widget de saisie de texte dans Flutter.",
            [
              "Syntaxe : TextField(decoration: InputDecoration(labelText: 'Nom', hintText: 'Entrez votre nom'))",
              "decoration : InputDecoration contrôle le style (label, hint, border, icon, etc.).",
              "onChanged : TextField(onChanged: (valeur) { print(valeur); }) Callback à chaque changement.",
              "obscureText : TextField(obscureText: true) Pour les mots de passe (masque le texte).",
              "keyboardType : TextInputType.emailAddress, .number, .phone pour le clavier adapté.",
            ],
          ),
          section(
            "TextEditingController",
            "Controller pour lire et modifier le contenu d'un TextField.",
            [
              "Création : final _controller = TextEditingController(); dans initState.",
              "Lier : TextField(controller: _controller) Lie le controller au TextField.",
              "Lire : _controller.text retourne le contenu actuel.",
              "Modifier : _controller.text = 'Nouveau texte'; Change le contenu programmatiquement.",
              "Dispose : _controller.dispose(); dans dispose() pour libérer les ressources. OBLIGATOIRE.",
              "Listener : _controller.addListener(() { print(_controller.text); }); Écoute les changements.",
            ],
          ),
        ],
        files: projectExample(todo, "lib/task_form_page.dart"),
        task: "Crée un formulaire avec TextField (nom), bouton Soumettre qui affiche 'Bonjour $nom' avec le contenu du TextField. Utilise TextEditingController.",
        takeaway:
          "TextField pour saisie, TextEditingController pour contrôler. Lie avec controller:, lis avec .text, n'oublie PAS dispose().",
        quiz: quiz(
          "Que dois-tu faire avec un TextEditingController dans dispose() ?",
          ["Rien", "Appeler .dispose()", "Le réinitialiser"],
          1,
          "Tu DOIS appeler controller.dispose() dans dispose() pour libérer les ressources et éviter les fuites mémoire.",
        ),
        link: docs + "cookbook/forms/text-input",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "http-api-flutter",
    title: "HTTP et récupération d'API",
    description:
      "Récupère des données depuis des API REST avec le package http.",
    lessons: [
      lesson({
        id: "http-get-post",
        title: "GET, POST et gestion des requêtes HTTP",
        minutes: 30,
        summary:
          "Utilise le package http pour communiquer avec des API REST. Envoie des requêtes GET, POST, gère les erreurs et les timeout.",
        sections: [
          section(
            "Installation du package http",
            "Le package http n'est pas inclus par défaut, il faut l'ajouter dans pubspec.yaml.",
            [
              "pubspec.yaml : Ajoute dependencies:\\n  http: ^1.1.0 puis lance flutter pub get.",
              "Import : import 'package:http/http.dart' as http; Le as http évite les conflits de noms.",
              "Permissions : Android nécessite <uses-permission android:name='android.permission.INTERNET'/> dans AndroidManifest.xml (déjà présent par défaut).",
              "iOS : Ajoute App Transport Security dans Info.plist pour HTTP (HTTPS fonctionne par défaut).",
            ],
          ),
          section(
            "GET : récupérer des données",
            "http.get() envoie une requête GET pour récupérer des données depuis une API.",
            [
              "Syntaxe : var response = await http.get(Uri.parse('https://api.example.com/users'));",
              "Uri.parse : Convertit l'URL String en Uri (requis par http).",
              "Response : La réponse contient statusCode (200, 404, 500...) et body (String JSON).",
              "Vérifier le statut : if (response.statusCode == 200) { /* succès */ } else { /* erreur */ }",
              "Body : response.body contient la réponse en String (souvent JSON).",
              "Headers : http.get(uri, headers: {'Authorization': 'Bearer token'}) Ajoute des headers.",
            ],
          ),
          section(
            "POST : envoyer des données",
            "http.post() envoie une requête POST pour créer ou modifier des données.",
            [
              "Syntaxe : var response = await http.post(Uri.parse('https://api.example.com/users'), body: {'nom': 'Alice', 'age': '25'});",
              "body : Map<String, String> des données à envoyer (form data).",
              "JSON : Pour envoyer du JSON, utilise json.encode() et headers Content-Type.",
              "Exemple JSON : var response = await http.post(uri, headers: {'Content-Type': 'application/json'}, body: jsonEncode({'nom': 'Alice', 'age': 25}));",
              "import 'dart:convert' : Pour jsonEncode() et jsonDecode().",
            ],
          ),
          section(
            "Gestion des erreurs et timeout",
            "Gère les erreurs réseau, les timeout et les codes d'erreur HTTP.",
            [
              "Timeout : var response = await http.get(uri).timeout(Duration(seconds: 10)); Lance TimeoutException après 10s.",
              "try-catch : Entoure les requêtes de try-catch pour capturer les exceptions (réseau, timeout, etc.).",
              "Codes HTTP : 200-299 = succès, 400-499 = erreur client (404 not found), 500-599 = erreur serveur.",
              "Exemple : try { var response = await http.get(uri).timeout(Duration(seconds: 5)); if (response.statusCode == 200) { /* OK */ } else { /* Erreur HTTP */ } } on TimeoutException { /* Timeout */ } catch (e) { /* Autre erreur */ }",
              "Retry : Implémenter une logique de retry en cas d'échec (boucle avec await Future.delayed()).",
            ],
          ),
        ],
        files: projectExample(movies, "lib/movie_repository.dart"),
        task: "Crée une fonction fetchUsers() qui fait un GET sur 'https://jsonplaceholder.typicode.com/users'. Parse le JSON avec jsonDecode(), affiche les noms dans une ListView. Gère les erreurs.",
        takeaway:
          "http.get() récupère, http.post() envoie. Vérifie statusCode == 200. Utilise timeout() et try-catch pour gérer les erreurs. jsonDecode() parse le JSON.",
        quiz: quiz(
          "Quel code HTTP indique un succès ?",
          ["404", "200", "500"],
          1,
          "200 OK indique que la requête a réussi. 404 = not found, 500 = erreur serveur.",
        ),
        link: docs + "cookbook/networking/fetch-data",
      }),
      lesson({
        id: "json-parsing",
        title: "Parsing JSON et modèles de données",
        minutes: 25,
        summary:
          "Transforme le JSON en objets Dart avec jsonDecode() et des classes de modèles pour un code type-safe.",
        sections: [
          section(
            "jsonDecode : JSON vers Map",
            "jsonDecode() transforme une String JSON en Map<String, dynamic> ou List.",
            [
              "Import : import 'dart:convert'; pour jsonDecode() et jsonEncode().",
              "String vers Map : var data = jsonDecode(response.body); // Map<String, dynamic>",
              "Exemple : String jsonString = '{\"nom\": \"Alice\", \"age\": 25}'; var map = jsonDecode(jsonString); print(map['nom']); // Alice",
              "Array JSON : String jsonArray = '[{\"nom\": \"Alice\"}, {\"nom\": \"Bob\"}]'; List<dynamic> list = jsonDecode(jsonArray);",
              "dynamic : Le type est dynamic, pas type-safe. Mieux : créer des classes de modèles.",
            ],
          ),
          section(
            "Classes de modèles : type-safe",
            "Crée des classes Dart pour représenter les données JSON de manière type-safe.",
            [
              "Exemple : class User { final String nom; final int age; User({required this.nom, required this.age}); }",
              "fromJson : factory User.fromJson(Map<String, dynamic> json) { return User(nom: json['nom'], age: json['age']); }",
              "Usage : var map = jsonDecode(response.body); var user = User.fromJson(map);",
              "Liste : List<User> users = (jsonDecode(body) as List).map((json) => User.fromJson(json)).toList();",
              "Avantages : Autocomplete, détection d'erreurs à la compilation, code plus sûr.",
            ],
          ),
          section(
            "json_serializable : génération automatique",
            "Le package json_serializable génère automatiquement fromJson et toJson.",
            [
              "Installation : pubspec.yaml : dev_dependencies:\\n  json_serializable: ^6.7.0\\n  build_runner: ^2.4.0",
              "Annotations : @JsonSerializable() class User { final String nom; final int age; User({required this.nom, required this.age}); factory User.fromJson(Map json) => _$UserFromJson(json); Map toJson() => _$UserToJson(this); }",
              "Génération : flutter pub run build_runner build Génère le fichier user.g.dart.",
              "Import : part 'user.g.dart'; dans le fichier du modèle.",
            ],
          ),
        ],
        files: movies.files,
        task: "Crée une classe Product avec name, price. Ajoute fromJson(). Fetch 'https://fakestoreapi.com/products', parse en List<Product>, affiche dans ListView.",
        takeaway:
          "jsonDecode() parse le JSON en Map. Crée des classes de modèles avec fromJson() pour du code type-safe. json_serializable automatise la génération.",
        quiz: quiz(
          "Pourquoi créer des classes de modèles au lieu d'utiliser Map directement ?",
          ["C'est obligatoire", "Type-safe, autocomplete, moins d'erreurs", "Plus rapide"],
          1,
          "Les classes de modèles rendent le code type-safe avec autocomplete et détection d'erreurs à la compilation.",
        ),
        link: docs + "data-and-backend/serialization/json",
      }),
    ],
  },
  {
    id: "provider-etat-global",
    title: "Provider : gestion d'état globale",
    description:
      "Partage des données entre plusieurs widgets avec Provider et ChangeNotifier.",
    lessons: [
      lesson({
        id: "provider-setup",
        title: "Installation et premier Provider",
        minutes: 28,
        summary:
          "Provider est LA solution recommandée par Flutter pour la gestion d'état. Installe Provider, crée un ChangeNotifier et partage des données entre widgets.",
        sections: [
          section(
            "Pourquoi Provider ?",
            "setState gère l'état LOCAL. Pour partager des données entre PLUSIEURS widgets (état global), utilise Provider.",
            [
              "Problème : Passer des données via constructeurs sur 5 niveaux de widgets (prop drilling) = cauchemar.",
              "Solution : Provider met les données ACCESSIBLES partout dans l'arbre, sans passer par constructeurs.",
              "Recommandé : Provider est recommandé par l'équipe Flutter. Simple, performant, testé.",
              "Alternatives : Riverpod (successor), Bloc, GetX, Redux. Provider reste le plus populaire.",
            ],
          ),
          section(
            "Installation de Provider",
            "Ajoute le package provider dans pubspec.yaml.",
            [
              "pubspec.yaml : dependencies:\\n  provider: ^6.1.0 puis flutter pub get.",
              "Import : import 'package:provider/provider.dart'; dans tes fichiers.",
            ],
          ),
          section(
            "ChangeNotifier : classe d'état observable",
            "ChangeNotifier est une classe qui notifie les widgets quand ses données changent.",
            [
              "Syntaxe : class MonStore extends ChangeNotifier { int _compteur = 0; int get compteur => _compteur; void incrementer() { _compteur++; notifyListeners(); } }",
              "extends ChangeNotifier : Hérite de ChangeNotifier pour la notification.",
              "Private + Getter : _compteur est privé, compteur est public en lecture seule.",
              "Méthodes : incrementer() modifie l'état ET appelle notifyListeners().",
              "notifyListeners() : Notifie tous les widgets qui écoutent ce store pour qu'ils se reconstruisent.",
            ],
          ),
          section(
            "ChangeNotifierProvider : fournir le store",
            "ChangeNotifierProvider crée et fournit le store à l'arbre de widgets.",
            [
              "Syntaxe : ChangeNotifierProvider(create: (context) => MonStore(), child: MyApp())",
              "Entoure MyApp : Place-le HAUT dans l'arbre (souvent dans main()) pour que tout l'app y accède.",
              "create : Fonction qui crée une INSTANCE du store. Appelée UNE FOIS.",
              "Exemple : void main() { runApp(ChangeNotifierProvider(create: (context) => CompteurStore(), child: MyApp())); }",
            ],
          ),
          section(
            "Consumer et context.watch : écouter les changements",
            "Pour LIRE et RÉAGIR aux changements du store, utilise context.watch() ou Consumer.",
            [
              "context.watch : var store = context.watch<MonStore>(); Reconstruit le widget quand notifyListeners() est appelé.",
              "Exemple : Text('Compteur: ${context.watch<MonStore>().compteur}') Se reconstruit à chaque changement.",
              "Consumer : Consumer<MonStore>(builder: (context, store, child) => Text('Compteur: ${store.compteur}')) Même résultat.",
              "child : Consumer(builder: (..., child) => Column(children: [child!, ...]), child: WidgetLourd()) Optimisation : child n'est pas reconstruit.",
            ],
          ),
          section(
            "context.read : appeler des méthodes SANS écouter",
            "Pour MODIFIER l'état SANS se reconstruire, utilise context.read().",
            [
              "context.read : context.read<MonStore>().incrementer(); Appelle la méthode SANS écouter les changements.",
              "Exemple : ElevatedButton(onPressed: () => context.read<CompteurStore>().incrementer(), child: Text('Incrémenter'))",
              "Différence : watch = lit + écoute (reconstruit). read = appelle seulement (pas de reconstruction).",
              "Règle : Utilise watch dans build() pour afficher, read dans onPressed pour modifier.",
            ],
          ),
        ],
        files: todo.files,
        task: "Crée un CompteurStore avec ChangeNotifier. Entoure MyApp avec ChangeNotifierProvider. Affiche le compteur avec context.watch(), ajoute un bouton qui appelle incrementer() avec context.read().",
        takeaway:
          "Provider partage des données globalement. ChangeNotifier + notifyListeners() pour l'état observable. context.watch() écoute, context.read() modifie sans écouter.",
        quiz: quiz(
          "Quelle méthode appelles-tu après avoir modifié l'état dans ChangeNotifier ?",
          ["setState()", "notifyListeners()", "build()"],
          1,
          "notifyListeners() informe tous les widgets qui écoutent ce ChangeNotifier qu'ils doivent se reconstruire.",
        ),
        link: docs + "data-and-backend/state-mgmt/simple",
      }),
      lesson({
        id: "provider-patterns-avances",
        title: "Provider patterns avancés : MultiProvider, Selector",
        minutes: 25,
        summary:
          "Optimise tes Provider avec MultiProvider pour plusieurs stores, et Selector pour écouter seulement une partie de l'état.",
        sections: [
          section(
            "MultiProvider : plusieurs stores",
            "Pour fournir PLUSIEURS stores, utilise MultiProvider au lieu d'imbriquer des ChangeNotifierProvider.",
            [
              "Syntaxe : MultiProvider(providers: [ChangeNotifierProvider(create: (_) => Store1()), ChangeNotifierProvider(create: (_) => Store2())], child: MyApp())",
              "Liste : providers accepte une liste de providers.",
              "Lisibilité : Plus lisible que 10 ChangeNotifierProvider imbriqués.",
              "Exemple : MultiProvider(providers: [ChangeNotifierProvider(create: (_) => AuthStore()), ChangeNotifierProvider(create: (_) => CartStore()), ChangeNotifierProvider(create: (_) => ThemeStore())], child: MyApp())",
            ],
          ),
          section(
            "Selector : optimiser les reconstructions",
            "Selector écoute SEULEMENT une partie spécifique de l'état, pas tout le store.",
            [
              "Problème : context.watch<CartStore>() reconstruit MÊME si seul le total change, pas les items.",
              "Solution : Selector<CartStore, int>(selector: (context, cart) => cart.itemCount, builder: (context, itemCount, child) => Text('$itemCount items'))",
              "selector : Extrait LA VALEUR spécifique à écouter (itemCount).",
              "builder : Reconstruit SEULEMENT si itemCount change, pas le reste du store.",
              "Performance : Réduit les reconstructions inutiles pour de gros stores.",
            ],
          ),
          section(
            "ProxyProvider : dépendances entre stores",
            "ProxyProvider crée un store qui DÉPEND d'un autre store.",
            [
              "Use case : OrderStore a besoin de AuthStore.userId pour charger les commandes.",
              "Syntaxe : ProxyProvider<AuthStore, OrderStore>(update: (context, auth, previous) => OrderStore(auth.userId))",
              "update : Fonction appelée quand AuthStore change. Crée/update OrderStore avec les nouvelles données.",
            ],
          ),
          section(
            "Un exemple à explorer",
            "Voici un exemple complet qui combine MultiProvider, Selector et les patterns avancés pour gérer plusieurs stores.",
            [
              "Exemple complet : lib/stores/multi_store.dart montre comment créer 2 stores (AuthStore et CartStore).",
              "MultiProvider : Voir lib/main.dart pour l'initialisation avec MultiProvider.",
              "Selector optimisé : lib/screens/cart_screen.dart utilise Selector pour afficher SEULEMENT le nom.",
              "À toi de jouer : Crée 2 stores : AuthStore (name, isLoggedIn) et CartStore (items, total). Utilise MultiProvider. Affiche le nom avec Selector qui écoute SEULEMENT name.",
            ],
          ),
        ],
        files: cart.files,
        task: "Explore le code de lib/stores/multi_store.dart qui montre AuthStore et CartStore. Ouvre lib/main.dart pour voir MultiProvider. Regarde lib/screens/cart_screen.dart pour le Selector optimisé qui écoute SEULEMENT le nom.",
        takeaway:
          "MultiProvider fournit plusieurs stores. Selector optimise en écoutant seulement une partie de l'état. ProxyProvider gère les dépendances entre stores.",
        quiz: quiz(
          "Quel widget utilises-tu pour écouter SEULEMENT une partie d'un store ?",
          ["Consumer", "Selector", "Provider"],
          1,
          "Selector écoute une partie spécifique de l'état et se reconstruit seulement si cette partie change.",
        ),
        link: "https://pub.dev/packages/provider",
      }),
    ],
  },
];

export const flutterLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Dart fondamentaux et premiers widgets",
    objective:
      "Maîtrise les bases de Dart (variables, conditions, boucles, fonctions, POO, structures de données) puis crée tes premiers widgets Flutter.",
    definition:
      "Flutter est un framework UI multi-plateforme de Google. Un seul code Dart pour mobile (iOS/Android), web ET desktop (Windows/macOS/Linux). Flutter dessine tous les pixels lui-même pour un rendu identique partout.",
    color: levelColors[0],
    prerequisites:
      "Aucun prérequis. Installe Flutter SDK, un éditeur (VS Code/Android Studio), un émulateur Android ou simulateur iOS.",
    outcomes: [
      "Maîtriser les fondamentaux Dart : variables, conditions, boucles, fonctions.",
      "Comprendre la POO : classes, attributs, méthodes, encapsulation.",
      "Utiliser les structures de données : List, Set, Map.",
      "Créer des widgets Flutter et comprendre PARFAITEMENT StatelessWidget vs StatefulWidget.",
      "Composer des interfaces avec Row, Column, Stack, Scaffold.",
    ],
    chapters: beginner,
    projects: flutterBeginnerProjects,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "État local, listes, navigation et formulaires",
    objective:
      "Gère l'état local avec setState, affiche des listes dynamiques, navigue entre écrans et crée des formulaires.",
    definition:
      "Le niveau intermédiaire approfondit la gestion d'état local et l'interaction utilisateur. Tu apprendras à créer des applications multi-écrans avec des listes et formulaires.",
    color: levelColors[1],
    prerequisites:
      "Connaître les bases Dart et Flutter. Comprendre StatelessWidget vs StatefulWidget.",
    outcomes: [
      "Maîtriser setState pour l'état local.",
      "Créer des listes performantes avec ListView.builder.",
      "Naviguer entre écrans avec Navigator.push/pop.",
      "Créer des formulaires avec TextField et TextEditingController.",
    ],
    chapters: intermediate,
    projects: flutterIntermediateProjects,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "HTTP, API, Provider et état global",
    objective:
      "Communique avec des API REST, parse du JSON, gère l'état global avec Provider et persiste des données localement.",
    definition:
      "Le niveau avancé te permet de créer des applications connectées qui récupèrent des données d'API, gèrent un état global partagé et fonctionnent hors ligne.",
    color: levelColors[2],
    prerequisites:
      "Maîtriser l'état local avec setState et la navigation. Connaître les bases du JSON.",
    outcomes: [
      "Récupérer et envoyer des données avec http (GET, POST, PUT, DELETE).",
      "Parser du JSON et créer des modèles de données type-safe.",
      "Gérer l'état global avec Provider et ChangeNotifier.",
      "Optimiser les performances avec Selector et MultiProvider.",
    ],
    chapters: advanced,
    projects: flutterAdvancedProjects,
  },
];
