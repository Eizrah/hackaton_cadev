import {
  lesson,
  levelColors,
  quiz,
  section,
} from "./courseAuthoring";
import {
  swiftAdvancedProjects,
  swiftBeginnerProjects,
  swiftIntermediateProjects,
} from "./swiftProjects";
import type { WebLevel } from "./webCourseTypes";

const [profile, counter] = swiftBeginnerProjects;
const [todo, cart] = swiftIntermediateProjects;
const [weather] = swiftAdvancedProjects;
const docs = "https://developer.apple.com/documentation/swiftui/";
const swiftDocs = "https://docs.swift.org/swift-book/";

const beginner: WebLevel["chapters"] = [
  {
    id: "installation-swift",
    title: "Installation et configuration Swift/SwiftUI",
    description:
      "Installe Xcode, configure ton environnement et comprends ce qui rend SwiftUI unique pour le développement iOS/macOS.",
    lessons: [
      lesson({
        id: "introduction-swift",
        title: "Qu'est-ce que Swift et SwiftUI ?",
        minutes: 30,
        summary:
          "Swift est le langage de programmation d'Apple pour iOS, macOS, watchOS et tvOS. SwiftUI est le framework déclaratif moderne pour créer des interfaces utilisateur.",
        sections: [
          section(
            "Swift : Le langage d'Apple",
            "Swift est un langage moderne, rapide et sûr développé par Apple en 2014 pour remplacer Objective-C.",
            [
              "Swift est open-source : disponible sur GitHub, communauté active, utilisable hors de l'écosystème Apple.",
              "Performance native : Swift compile en code machine avec LLVM, aussi rapide que C++.",
              "Sécurité : Swift élimine les classes d'erreurs courantes (null pointers, buffer overflows) via son système de types strict.",
              "Modernité : Inférence de type, closures, génériques, pattern matching, programmation fonctionnelle.",
              "Plateformes : iOS (iPhone/iPad), macOS (Mac), watchOS (Apple Watch), tvOS (Apple TV), et même serveur (Vapor).",
            ],
          ),
          section(
            "SwiftUI : Framework UI déclaratif",
            "SwiftUI révolutionne le développement UI Apple avec une approche déclarative inspirée de React.",
            [
              "Déclaratif : Tu décris CE QUE tu veux afficher, pas COMMENT le construire. SwiftUI gère les mises à jour.",
              "Multiplateforme : UN code SwiftUI pour iOS, macOS, watchOS et tvOS avec adaptations automatiques.",
              "Preview en temps réel : Xcode affiche tes changements instantanément sans recompiler l'app.",
              "Intégration totale : SwiftUI s'intègre parfaitement avec UIKit (ancien framework) et les APIs Apple.",
              "Binding bidirectionnel : Les données et l'UI sont automatiquement synchronisées avec @State et @Binding.",
              "Composable : Crée des vues réutilisables qui se combinent comme des LEGO.",
            ],
          ),
          section(
            "Prérequis système pour développer en Swift",
            "Le développement iOS/macOS nécessite un Mac avec Xcode. Pas d'alternative officielle sur Windows/Linux.",
            [
              "Mac obligatoire : Xcode ne fonctionne QUE sur macOS. Tu dois avoir un Mac (MacBook, iMac, Mac mini).",
              "macOS : Version 13 Ventura ou supérieure recommandée pour Xcode 15+.",
              "Espace disque : Minimum 30 GB libres (Xcode + simulateurs iOS prennent beaucoup de place).",
              "RAM : 8 GB minimum, 16 GB fortement recommandés pour les simulateurs.",
              "Processeur : Apple Silicon (M1/M2/M3) ou Intel, Apple Silicon beaucoup plus rapide.",
            ],
          ),
          section(
            "Installation de Xcode",
            "Xcode est l'IDE officiel d'Apple, gratuit et obligatoire pour développer en Swift.",
            [
              "App Store : Cherche 'Xcode' dans l'App Store et clique sur 'Obtenir' (téléchargement lourd : 10-15 GB).",
              "Première ouverture : Xcode installe automatiquement les outils de ligne de commande (Command Line Tools).",
              "Simulateurs : Xcode inclut des simulateurs pour iPhone, iPad, Apple Watch et Apple TV.",
              "Xcode Server (optionnel) : Intégration continue pour builds automatisés.",
              "Vérification : Ouvre Terminal et tape swift --version pour vérifier l'installation.",
            ],
          ),
          section(
            "Premier projet SwiftUI",
            "Crée ton premier projet SwiftUI et explore la structure standard d'une application iOS.",
            [
              "Créer un projet : Ouvre Xcode > File > New > Project > iOS > App. Choisis 'SwiftUI' comme interface.",
              "Nom et identifiant : Donne un nom (MonApp) et un Bundle Identifier unique (com.tonnom.MonApp).",
              "Structure générée : ContentView.swift (vue principale), MonAppApp.swift (point d'entrée), Assets (images/couleurs).",
              "Preview : Le canvas à droite montre un aperçu interactif de ton UI. Clique sur 'Resume' si pas visible.",
              "Simulateur : Clique sur Play (⌘R) pour lancer l'app dans le simulateur iPhone.",
              "Devices : Change le simulateur avec le menu déroulant en haut (iPhone 15, iPad, etc.).",
            ],
          ),
          section(
            "Structure d'un projet SwiftUI",
            "Comprends l'organisation des fichiers d'un projet SwiftUI typique.",
            [
              "MonAppApp.swift : Point d'entrée avec @main. Contient la structure App et la scène principale.",
              "ContentView.swift : Vue racine de l'application. C'est ici que tu construis ton UI.",
              "Assets.xcassets : Catalogue d'assets (images, couleurs, icônes d'app).",
              "Preview Content : Données de preview uniquement utilisées dans Xcode, pas incluses dans l'app finale.",
              "Info.plist : Configuration de l'app (permissions, orientations supportées). Souvent édité via Target Settings maintenant.",
            ],
          ),
        ],
        files: profile.files,
        task: "Installe Xcode depuis l'App Store. Crée un nouveau projet iOS App avec SwiftUI. Lance-le dans le simulateur iPhone 15. Modifie le texte dans ContentView et observe le preview se mettre à jour.",
        takeaway:
          "Swift est le langage moderne d'Apple. SwiftUI est le framework déclaratif pour créer des UI sur iOS, macOS, watchOS et tvOS. Xcode est obligatoire et inclut simulateurs et preview en temps réel.",
        quiz: quiz(
          "Sur combien de plateformes Apple SwiftUI peut-il compiler ?",
          ["1 (iOS seulement)", "2 (iOS et macOS)", "4 (iOS, macOS, watchOS, tvOS)"],
          2,
          "SwiftUI compile sur 4 plateformes Apple : iOS, macOS, watchOS et tvOS avec le même code.",
        ),
        link: docs,
      }),
    ],
  },
  {
    id: "swift-variables-types",
    title: "Variables, types et optionals en Swift",
    description:
      "Maîtrise les fondamentaux de Swift : variables, types, optionals et nil safety.",
    lessons: [
      lesson({
        id: "swift-let-var",
        title: "Variables avec var et constantes avec let",
        minutes: 25,
        summary:
          "Swift distingue clairement les variables mutables (var) et constantes immuables (let). Préfère let par défaut pour la sécurité.",
        sections: [
          section(
            "Déclaration avec let et var",
            "Swift force à choisir entre mutabilité (var) et immuabilité (let) pour éviter les bugs.",
            [
              "let : Constante, valeur assignée UNE FOIS et ne change JAMAIS. Exemple : let nom = 'Alice'. Swift génère une erreur si tu essaies de modifier.",
              "var : Variable, peut être réassignée. Exemple : var age = 25; age = 26; (OK)",
              "Préfère let : Apple recommande let par défaut. Utilise var SEULEMENT si la valeur DOIT changer.",
              "Erreur de compilation : let score = 100; score = 200; → ERREUR. Swift t'empêche de modifier une constante.",
              "Performance : let permet au compilateur d'optimiser (valeur figée = optimisations possibles).",
            ],
          ),
          section(
            "Inférence de type automatique",
            "Swift déduit automatiquement le type d'une variable depuis sa valeur initiale.",
            [
              "Inférence : let nom = 'Alice' crée un String automatiquement. Pas besoin de spécifier le type.",
              "Exemples : let age = 25 (Int), let taille = 1.75 (Double), let estActif = true (Bool).",
              "Annotation de type explicite : let prenom: String = 'Bob'. Utile pour forcer un type spécifique.",
              "Double par défaut : let nombre = 3.14 crée un Double (pas Float). Pour Float : let nombre: Float = 3.14.",
            ],
          ),
          section(
            "Types de base en Swift",
            "Swift fournit des types fondamentaux pour les données courantes.",
            [
              "String : Chaînes de caractères. Exemple : let message = 'Bonjour'.",
              "Int : Nombres entiers (42, -10, 0). Swift choisit Int64 sur plateformes 64-bit.",
              "Double : Nombres décimaux haute précision (3.14159). Type par défaut pour les décimaux.",
              "Float : Nombres décimaux précision simple (moins précis que Double). Rarement utilisé.",
              "Bool : Booléens true ou false. Exemple : let estConnecte = true.",
              "Type safety : Swift refuse de mélanger les types. let resultat = 5 + '10' → ERREUR de compilation.",
            ],
          ),
        ],
        files: profile.files,
        task: "Crée un fichier Swift, déclare des constantes avec let (nom, dateNaissance) et une variable avec var (score). Essaie de modifier une constante pour voir l'erreur de compilation.",
        takeaway:
          "Swift distingue let (immuable) et var (mutable). Préfère let par défaut. L'inférence de type déduit automatiquement le type. Swift est type-safe : pas de mélange de types.",
        quiz: quiz(
          "Quel mot-clé utilises-tu pour une valeur qui ne doit JAMAIS changer ?",
          ["var", "let", "const"],
          1,
          "let crée une constante immuable. var permet de réassigner la valeur.",
        ),
        link: swiftDocs + "LanguageGuide/TheBasics.html",
      }),
      lesson({
        id: "swift-optionals",
        title: "Optionals : gérer l'absence de valeur en sécurité",
        minutes: 28,
        summary:
          "Les optionals sont LA fonctionnalité signature de Swift pour gérer nil en toute sécurité et éliminer les crashs NullPointerException.",
        sections: [
          section(
            "Pourquoi les optionals ?",
            "En Swift, une variable normale ne peut JAMAIS être nil. Pour représenter l'absence de valeur, utilise un optional.",
            [
              "Type non-optional : let nom: String = 'Alice'. nom ne peut JAMAIS être nil.",
              "Type optional : let email: String? = nil. Le ? indique que email peut contenir une String OU nil.",
              "Sécurité : Swift force à gérer explicitement les nil, éliminant les crashs à l'exécution.",
              "Syntaxe : Type? signifie 'optional de Type'. String? = optional String, Int? = optional Int.",
            ],
          ),
          section(
            "Unwrapping sécurisé avec if let",
            "Pour utiliser la valeur d'un optional, tu dois d'abord vérifier qu'il n'est pas nil avec if let.",
            [
              "Syntaxe : if let valeur = optional { /* utilise valeur */ } else { /* optional était nil */ }",
              "Exemple : if let emailValide = email { print(emailValide) } else { print('Pas d\\'email') }",
              "Unwrapping réussit : Si l'optional contient une valeur, elle est extraite et utilisable dans le bloc if.",
              "Unwrapping échoue : Si l'optional est nil, le bloc else s'exécute.",
              "Plusieurs unwraps : if let nom = nom, let age = age { /* les deux sont non-nil */ }",
            ],
          ),
          section(
            "Guard let : sortir tôt si nil",
            "guard let est l'inverse de if let : il continue SEULEMENT si la valeur n'est pas nil, sinon il sort de la fonction.",
            [
              "Syntaxe : guard let valeur = optional else { return }. Sort de la fonction si nil.",
              "Exemple : func afficher(email: String?) { guard let emailValide = email else { return }; print(emailValide) }",
              "Valeur disponible après : Après guard let, la valeur unwrappée est disponible dans TOUT le reste de la fonction.",
              "Lisibilité : guard réduit l'imbrication. Le 'chemin heureux' reste à gauche, les erreurs sortent tôt.",
            ],
          ),
          section(
            "Nil coalescing : valeur par défaut",
            "L'opérateur ?? fournit une valeur par défaut si l'optional est nil.",
            [
              "Syntaxe : let resultat = optional ?? valeurParDefaut",
              "Exemple : let affichage = email ?? 'Non renseigné'. Si email est nil, utilise 'Non renseigné'.",
              "Retourne non-optional : Le résultat n'est PLUS un optional (type garanti non-nil).",
              "Chaînage : let nom = prenom ?? surnom ?? 'Anonyme' (essaie prenom, puis surnom, puis défaut).",
            ],
          ),
          section(
            "Optional chaining et force unwrapping",
            "Accède aux propriétés d'un optional en toute sécurité avec ? ou de force avec ! (dangereux).",
            [
              "Optional chaining (?) : user?.nom retourne nil si user est nil, sinon retourne nom. Safe.",
              "Force unwrapping (!) : email! extrait la valeur SANS vérifier. Si nil → CRASH. DANGEREUX, évite-le.",
              "Exemple safe : let longueur = email?.count (longueur est Int? : nil si email est nil).",
              "Exemple dangereux : let longueur = email!.count Si email est nil, l'app CRASH.",
              "Règle d'or : N'utilise JAMAIS ! sauf si tu es à 100% sûr que la valeur n'est pas nil.",
            ],
          ),
        ],
        files: profile.files,
        task: "Déclare un String? avec une valeur, puis un avec nil. Utilise if let pour unwrap le premier, ?? pour fournir un défaut au second. Affiche les résultats.",
        takeaway:
          "Les optionals représentent l'absence de valeur. Type? peut être une valeur OU nil. if let unwrap en sécurité, guard let sort tôt si nil, ?? fournit un défaut. Évite force unwrapping (!) !",
        quiz: quiz(
          "Quel opérateur fournit une valeur par défaut si l'optional est nil ?",
          ["!", "??", "?."],
          1,
          "L'opérateur ?? (nil coalescing) retourne la valeur de gauche si non-nil, sinon la valeur de droite.",
        ),
        link: swiftDocs + "LanguageGuide/TheBasics.html#ID330",
      }),
    ],
  },
  {
    id: "swift-conditions-boucles",
    title: "Conditions et boucles en Swift",
    description:
      "Contrôle le flux d'exécution avec if/else, switch et les boucles for/while.",
    lessons: [
      lesson({
        id: "swift-if-else",
        title: "Conditions if, else, et opérateurs",
        minutes: 22,
        summary:
          "Exécute du code conditionnellement avec if/else et les opérateurs de comparaison et logiques.",
        sections: [
          section(
            "Structure if/else",
            "Swift utilise if/else comme la plupart des langages, mais les parenthèses autour de la condition sont optionnelles.",
            [
              "Syntaxe : if condition { /* code */ } else { /* code */ }. Pas besoin de parenthèses autour de condition.",
              "Exemple : if age >= 18 { print('Majeur') } else { print('Mineur') }",
              "Accolades obligatoires : Les { } sont TOUJOURS obligatoires en Swift, même pour une ligne.",
              "else if : if score >= 90 { 'A' } else if score >= 80 { 'B' } else { 'C' }",
            ],
          ),
          section(
            "Opérateurs de comparaison et logiques",
            "Swift fournit les opérateurs standards pour comparer et combiner des conditions.",
            [
              "Comparaison : == (égal), != (différent), > (supérieur), < (inférieur), >= (sup ou égal), <= (inf ou égal).",
              "Logique : && (ET), || (OU), ! (NON). Exemple : if age >= 18 && estInscrit { 'Accès autorisé' }",
              "Ternaire : condition ? valeurSiVrai : valeurSiFaux. Exemple : let statut = age >= 18 ? 'Majeur' : 'Mineur'",
            ],
          ),
        ],
        files: profile.files,
        task: "Crée une fonction categoriserAge(_ age: Int) -> String qui retourne 'Enfant', 'Ado', 'Adulte' ou 'Senior' avec if/else.",
        takeaway:
          "if/else contrôle le flux. Les opérateurs de comparaison (==, >, <) et logiques (&&, ||, !) créent des conditions. Le ternaire (? :) est concis.",
        quiz: quiz(
          "Les parenthèses autour de la condition dans if sont-elles obligatoires en Swift ?",
          ["Oui, toujours", "Non, optionnelles", "Seulement pour les expressions complexes"],
          1,
          "En Swift, les parenthèses autour de la condition sont optionnelles. if age >= 18 { } est valide.",
        ),
        link: swiftDocs + "LanguageGuide/ControlFlow.html",
      }),
      lesson({
        id: "swift-switch",
        title: "Switch exhaustif et pattern matching",
        minutes: 25,
        summary:
          "Swift a le switch le plus puissant de tous les langages avec pattern matching, ranges et exhaustivité obligatoire.",
        sections: [
          section(
            "Switch exhaustif",
            "En Swift, switch DOIT couvrir TOUS les cas possibles. Le compilateur vérifie l'exhaustivité.",
            [
              "Syntaxe : switch valeur { case pattern1: /* code */ case pattern2: /* code */ default: /* cas par défaut */ }",
              "Pas de break : Swift NE TRAVERSE PAS les cases suivants automatiquement. Pas besoin de break.",
              "Exhaustivité : Swift force à gérer TOUS les cas ou ajouter default.",
              "Exemple : switch jour { case 1: 'Lundi' case 2: 'Mardi' default: 'Autre' }",
            ],
          ),
          section(
            "Patterns avancés : ranges, tuples, where",
            "Swift permet des patterns très expressifs dans switch.",
            [
              "Ranges : case 0..<18: 'Mineur' case 18...64: 'Adulte' case 65...: 'Senior'",
              "Plusieurs valeurs : case 1, 2, 3: 'Trimestre 1' case 4, 5, 6: 'Trimestre 2'",
              "Tuples : switch (x, y) { case (0, 0): 'Origine' case (_, 0): 'Sur axe X' case (0, _): 'Sur axe Y' default: 'Ailleurs' }",
              "where clause : case let x where x % 2 == 0: 'Pair' case let x where x % 2 != 0: 'Impair'",
            ],
          ),
        ],
        files: profile.files,
        task: "Crée une fonction evaluerNote(_ note: Int) -> String avec switch qui retourne 'A' (90+), 'B' (80-89), 'C' (70-79), 'D' (60-69), 'F' (<60). Utilise des ranges.",
        takeaway:
          "Swift switch est exhaustif (tous les cas couverts), pas de fallthrough automatique. Les patterns avancés (ranges, tuples, where) le rendent très puissant.",
        quiz: quiz(
          "En Swift, que se passe-t-il si ton switch ne couvre pas tous les cas ?",
          ["Erreur de compilation", "Warning seulement", "Comportement par défaut"],
          0,
          "Swift génère une erreur de compilation si le switch n'est pas exhaustif. Tu dois couvrir tous les cas ou ajouter default.",
        ),
        link: swiftDocs + "LanguageGuide/ControlFlow.html#ID127",
      }),
      lesson({
        id: "swift-boucles",
        title: "Boucles for-in, while et repeat-while",
        minutes: 20,
        summary:
          "Répète des opérations avec for-in (collections/ranges), while (condition préalable) et repeat-while (condition finale).",
        sections: [
          section(
            "Boucle for-in",
            "for-in parcourt des collections (Array, Dictionary, Set) ou des ranges de nombres.",
            [
              "Syntaxe : for element in collection { /* code */ }",
              "Range : for i in 0..<5 { print(i) } affiche 0, 1, 2, 3, 4 (..< exclut la borne supérieure).",
              "Range inclusif : for i in 0...5 { print(i) } affiche 0, 1, 2, 3, 4, 5 (... inclut la borne).",
              "Array : for fruit in fruits { print(fruit) } parcourt tous les éléments.",
              "Ignorer la valeur : for _ in 1...3 { print('Go!') } si tu n'utilises pas la variable.",
            ],
          ),
          section(
            "Boucles while et repeat-while",
            "while vérifie la condition AVANT chaque itération. repeat-while vérifie APRÈS (équivalent do-while).",
            [
              "while : while condition { /* code */ }. S'exécute TANT QUE condition est vraie. Peut ne jamais s'exécuter.",
              "repeat-while : repeat { /* code */ } while condition. S'exécute AU MOINS UNE FOIS, puis vérifie condition.",
              "Exemple while : var i = 0; while i < 5 { print(i); i += 1 }",
              "Exemple repeat : var i = 0; repeat { print(i); i += 1 } while i < 5",
            ],
          ),
        ],
        files: profile.files,
        task: "Crée un tableau de nombres [1, 2, 3, 4, 5], utilise for-in pour afficher les carrés, puis for-in avec un range pour afficher les nombres de 10 à 1 en ordre décroissant.",
        takeaway:
          "for-in parcourt collections et ranges. while vérifie la condition avant, repeat-while après. Les ranges ..< et ... contrôlent l'inclusion.",
        quiz: quiz(
          "Quelle boucle s'exécute AU MOINS UNE FOIS avant de vérifier la condition ?",
          ["for-in", "while", "repeat-while"],
          2,
          "repeat-while exécute le bloc une fois, PUIS vérifie la condition. while vérifie avant chaque itération.",
        ),
        link: swiftDocs + "LanguageGuide/ControlFlow.html#ID121",
      }),
    ],
  },
  {
    id: "swiftui-vues-base",
    title: "Premières vues SwiftUI : Text, Image, Button",
    description:
      "Crée tes premières interfaces avec les composants de base de SwiftUI.",
    lessons: [
      lesson({
        id: "swiftui-text-styling",
        title: "Text et styling : fonts, colors, modifiers",
        minutes: 25,
        summary:
          "Text affiche du texte stylisé. Les modifiers (.font, .foregroundColor, .bold) permettent une personnalisation complète.",
        sections: [
          section(
            "Text : afficher du texte",
            "Text est le composant de base pour afficher du texte dans SwiftUI.",
            [
              "Syntaxe : Text('Bonjour SwiftUI') affiche le texte brut.",
              "Interpolation : Text('Mon nom est \\(nom)') insère des variables.",
              "Multi-ligne : Text supporte automatiquement le multi-ligne si le texte est long.",
            ],
          ),
          section(
            "Modifiers de font et style",
            "Les modifiers ajoutent du style à Text : fonts, poids, couleurs.",
            [
              ".font() : .font(.title), .font(.headline), .font(.caption) pour les tailles prédéfinies.",
              ".font(.system(size: 24)) : Taille personnalisée.",
              ".fontWeight() : .fontWeight(.bold), .fontWeight(.light), .fontWeight(.semibold).",
              ".bold() : Raccourci pour .fontWeight(.bold).",
              ".italic() : Texte en italique.",
              ".foregroundColor() : .foregroundColor(.blue), .foregroundColor(.red) pour la couleur.",
            ],
          ),
          section(
            "Modifiers de layout",
            "Contrôle l'alignement, le padding et les limites de lignes.",
            [
              ".multilineTextAlignment() : .multilineTextAlignment(.center), .leading, .trailing pour l'alignement.",
              ".lineLimit() : .lineLimit(2) limite à 2 lignes, ajoute '...' si dépassement.",
              ".padding() : Ajoute de l'espace autour. .padding(20) pour valeur personnalisée.",
            ],
          ),
        ],
        files: profile.files,
        task: "Crée une vue avec 3 Text : un titre avec .font(.largeTitle).bold(), un sous-titre avec .font(.headline).foregroundColor(.gray), et un corps avec .font(.body).lineLimit(3).",
        takeaway:
          "Text affiche du texte. Les modifiers (.font, .foregroundColor, .bold, .padding) stylisent les composants. Les modifiers se chaînent : Text('Hello').font(.title).bold().foregroundColor(.blue).",
        quiz: quiz(
          "Comment appliques-tu plusieurs modifiers à un composant SwiftUI ?",
          ["En les séparant par des virgules", "En les chaînant avec des points", "En les imbriquant"],
          1,
          "Les modifiers se chaînent avec des points : Text('Hello').font(.title).bold().foregroundColor(.blue)",
        ),
        link: docs + "text",
      }),
      lesson({
        id: "swiftui-image-button",
        title: "Image et Button : afficher des images et réagir aux clics",
        minutes: 28,
        summary:
          "Image affiche des images système (SF Symbols) ou custom. Button déclenche des actions au clic.",
        sections: [
          section(
            "Image : afficher des images",
            "Image affiche des images depuis les assets, SF Symbols (icônes système Apple) ou le web.",
            [
              "SF Symbols : Image(systemName: 'star.fill') affiche une icône système. Gratuit, 5000+ icônes.",
              "Assets : Image('monImage') charge depuis Assets.xcassets.",
              "Modifiers : .resizable() pour redimensionner, .frame(width: 100, height: 100) pour taille fixe.",
              ".aspectRatio(contentMode: .fit) : Garde les proportions. .fill remplit l'espace.",
              ".foregroundColor() : Change la couleur des SF Symbols.",
            ],
          ),
          section(
            "Button : déclencher des actions",
            "Button déclenche une action quand l'utilisateur clique/tape dessus.",
            [
              "Syntaxe : Button(action: { /* action */ }) { /* contenu */ }",
              "Exemple simple : Button(action: { print('Cliqué!') }) { Text('Cliquez-moi') }",
              "Avec icône : Button(action: { /* action */ }) { Label('Valider', systemImage: 'checkmark') }",
              "Styling : Button applique automatiquement un style bleu. Personnalise avec .buttonStyle().",
              ".disabled() : Button(action: {}).disabled(isButtonDisabled) désactive le bouton conditionnellement.",
            ],
          ),
          section(
            "Combiner Image et Button",
            "Crée des boutons avec des icônes pour des interfaces modernes.",
            [
              "Exemple : Button(action: { likes += 1 }) { Image(systemName: 'heart.fill').foregroundColor(.red).font(.title) }",
              "Label : Label('Sauvegarder', systemImage: 'square.and.arrow.down') combine texte + icône automatiquement.",
            ],
          ),
        ],
        files: counter.files,
        task: "Crée une vue avec une Image SF Symbol (star.fill) de 80pt en jaune, et un Button qui change la couleur de l'étoile entre jaune et gris à chaque clic (utilise @State).",
        takeaway:
          "Image affiche des SF Symbols (systemName) ou assets. Button déclenche des actions. Label combine texte + icône. Les modifiers (.resizable, .frame, .foregroundColor) personnalisent.",
        quiz: quiz(
          "Comment affiches-tu une icône système Apple (SF Symbol) ?",
          ["Image('star')", "Image(systemName: 'star')", "Icon('star')"],
          1,
          "Image(systemName: 'nomDeLIcone') affiche un SF Symbol. Image('nom') charge depuis les assets.",
        ),
        link: docs + "image",
      }),
    ],
  },
  {
    id: "swiftui-layout",
    title: "Layout : VStack, HStack, ZStack",
    description:
      "Organise tes vues avec les stacks pour créer des interfaces complexes.",
    lessons: [
      lesson({
        id: "swiftui-stacks",
        title: "VStack, HStack et ZStack : organiser les vues",
        minutes: 30,
        summary:
          "Les stacks sont les conteneurs de base pour organiser les vues en colonnes (VStack), lignes (HStack) ou couches (ZStack).",
        sections: [
          section(
            "VStack : disposition verticale",
            "VStack empile les vues VERTICALEMENT (de haut en bas).",
            [
              "Syntaxe : VStack { Text('Un'); Text('Deux'); Text('Trois') } empile 3 textes verticalement.",
              "spacing : VStack(spacing: 20) ajoute 20pt d'espace entre chaque vue.",
              "alignment : VStack(alignment: .leading) aligne à gauche. .center (défaut), .trailing (droite).",
            ],
          ),
          section(
            "HStack : disposition horizontale",
            "HStack empile les vues HORIZONTALEMENT (de gauche à droite).",
            [
              "Syntaxe : HStack { Text('Un'); Text('Deux'); Text('Trois') } empile horizontalement.",
              "spacing et alignment : Mêmes paramètres que VStack. alignment : .top, .center, .bottom.",
            ],
          ),
          section(
            "ZStack : superposition de vues",
            "ZStack empile les vues en PROFONDEUR (l'une sur l'autre).",
            [
              "Syntaxe : ZStack { Rectangle().fill(Color.blue); Text('Au-dessus') } superpose texte sur rectangle.",
              "alignment : ZStack(alignment: .topLeading) positionne les vues. .center (défaut), .bottomTrailing, etc.",
              "Use cases : Badges sur icônes, overlays, backgrounds.",
            ],
          ),
          section(
            "Spacer et Divider",
            "Spacer crée un espace flexible, Divider trace une ligne séparatrice.",
            [
              "Spacer() : Pousse les vues aux extrémités. HStack { Text('Gauche'); Spacer(); Text('Droite') } sépare au max.",
              "Divider() : Ligne de séparation. VStack { Text('Un'); Divider(); Text('Deux') } trace une ligne horizontale.",
            ],
          ),
        ],
        files: profile.files,
        task: "Crée une carte de visite avec un VStack principal contenant : un HStack avec une Image et un VStack (nom + titre), un Divider, puis un VStack d'infos de contact.",
        takeaway:
          "VStack empile verticalement, HStack horizontalement, ZStack en profondeur. spacing, alignment et Spacer contrôlent la disposition. Divider trace des séparations.",
        quiz: quiz(
          "Quel stack utilises-tu pour superposer des vues l'une sur l'autre ?",
          ["VStack", "HStack", "ZStack"],
          2,
          "ZStack empile les vues en profondeur, l'une sur l'autre. VStack empile verticalement, HStack horizontalement.",
        ),
        link: docs + "vstack",
      }),
    ],
  },
  {
    id: "swiftui-state",
    title: "Gestion d'état avec @State",
    description:
      "Gère l'état local de tes vues avec @State et rends-les interactives.",
    lessons: [
      lesson({
        id: "swiftui-state-binding",
        title: "@State : état local et réactivité",
        minutes: 32,
        summary:
          "@State crée une variable d'état locale à la vue. Quand elle change, SwiftUI reconstruit automatiquement la vue.",
        sections: [
          section(
            "Pourquoi @State ?",
            "Les vues SwiftUI sont des structs immuables. @State permet de modifier des valeurs et de déclencher un re-render.",
            [
              "Struct immuable : struct ContentView: View { var count = 0 } Tu ne peux PAS modifier count dans body.",
              "@State rend mutable : @State private var count = 0 permet de modifier count.",
              "Réactivité : Quand count change, SwiftUI reconstruit AUTOMATIQUEMENT la vue avec la nouvelle valeur.",
              "Local : @State est PRIVÉ à la vue. Utilise @Binding ou @StateObject pour partager.",
            ],
          ),
          section(
            "Déclarer et utiliser @State",
            "Déclare @State en tant que propriété de la struct, toujours private.",
            [
              "Syntaxe : @State private var count = 0 déclare un entier d'état.",
              "Lecture : Text('\\(count)') affiche la valeur actuelle.",
              "Modification : Button('Incrémenter') { count += 1 } modifie l'état.",
              "Re-render automatique : Quand count change, Text se met à jour automatiquement.",
            ],
          ),
          section(
            "@State avec Bool, String, Array",
            "@State fonctionne avec tous les types : Bool, String, Array, struct custom, etc.",
            [
              "Bool : @State private var isOn = false. Parfait pour toggle : isOn.toggle().",
              "String : @State private var texte = ''. Lié à TextField avec $texte.",
              "Array : @State private var items: [String] = []. Modifie avec .append(), .remove(), etc.",
            ],
          ),
          section(
            "Le $ : Binding bidirectionnel",
            "$ crée un Binding : synchronisation bidirectionnelle entre @State et un composant.",
            [
              "Syntaxe : TextField('Nom', text: $nom) lie le champ à la variable nom.",
              "Lecture ET écriture : Le TextField LIT nom pour afficher, ÉCRIT dans nom quand l'utilisateur tape.",
              "Automatique : SwiftUI synchronise les deux directions sans code supplémentaire.",
              "Autres usages : Toggle('Actif', isOn: $isActive), Slider(value: $volume, in: 0...100).",
            ],
          ),
        ],
        files: counter.files,
        task: "Crée un compteur avec @State private var count = 0. Affiche-le avec Text, ajoute deux boutons pour incrémenter et décrémenter. Change la couleur du texte en fonction du signe (vert si positif, rouge si négatif).",
        takeaway:
          "@State crée un état local mutable. Quand il change, SwiftUI reconstruit la vue automatiquement. $ crée un Binding bidirectionnel pour TextField, Toggle, etc.",
        quiz: quiz(
          "Que fait le préfixe $ devant une variable @State ?",
          ["La rend constante", "Crée un Binding bidirectionnel", "La rend globale"],
          1,
          "$ crée un Binding qui lie une variable @State à un composant avec synchronisation bidirectionnelle.",
        ),
        link: docs + "state",
      }),
    ],
  },
  {
    id: "swift-fonctions-closures",
    title: "Fonctions et closures",
    description:
      "Crée des fonctions réutilisables et maîtrise les closures, le cœur du style Swift.",
    lessons: [
      lesson({
        id: "swift-fonctions",
        title: "Fonctions : paramètres, labels et retour",
        minutes: 28,
        summary:
          "Les fonctions en Swift utilisent des labels explicites pour les paramètres, rendant les appels très lisibles. Les valeurs par défaut et les paramètres variadiques offrent une grande flexibilité.",
        sections: [
          section(
            "Déclarer une fonction",
            "func nomFonction(label param: Type) -> TypeRetour définit une fonction. Le label est utilisé à l'appel, le param dans le corps.",
            [
              "func saluer(nom: String) -> String { return 'Bonjour \\(nom)' }",
              "Appel : saluer(nom: 'Alice') – le label rend l'appel lisible.",
              "_ pour supprimer le label : func add(_ a: Int, _ b: Int) -> Int",
              "Appel sans label : add(3, 5)",
              "Valeur par défaut : func saluer(nom: String = 'monde')",
              "@discardableResult pour ignorer la valeur de retour sans warning.",
            ]
          ),
          section(
            "Retours multiples avec tuples",
            "Swift permet de retourner plusieurs valeurs en une seule fonction grâce aux tuples.",
            [
              "func minMax(_ arr: [Int]) -> (min: Int, max: Int)",
              "Accès : let r = minMax([3,1,4]); r.min, r.max",
              "Optionnel : -> (min: Int, max: Int)? si le tableau peut être vide.",
            ]
          ),
          section(
            "Paramètres variadiques et inout",
            "Une fonction peut accepter un nombre variable d'arguments ou modifier ses paramètres.",
            [
              "Variadique : func somme(_ nums: Int...) -> Int",
              "nums est un [Int] à l'intérieur de la fonction.",
              "inout : func doubler(_ x: inout Int) modifie la variable originale.",
              "Appel inout : doubler(&monInt) – & indique la modification.",
            ]
          ),
        ],
        files: {
          html: "",
          css: "",
          entry: `// Fonctions Swift

// Fonction simple avec label
func saluer(nom: String) -> String {
    return "Bonjour \\(nom) !"
}
print(saluer(nom: "Alice"))

// Plusieurs paramètres, label externe différent du param interne
func calculerAire(largeur l: Double, hauteur h: Double) -> Double {
    return l * h
}
let aire = calculerAire(largeur: 10, hauteur: 5)
print("Aire : \\(aire)")

// _ pour supprimer le label
func additionner(_ a: Int, _ b: Int) -> Int {
    return a + b
}
print(additionner(3, 7))

// Retour multiple avec tuple
func minMax(_ tableau: [Int]) -> (min: Int, max: Int)? {
    guard !tableau.isEmpty else { return nil }
    return (tableau.min()!, tableau.max()!)
}

if let resultat = minMax([4, 2, 8, 1, 9]) {
    print("Min: \\(resultat.min), Max: \\(resultat.max)")
}

// Valeur par défaut
func connexion(hote: String, port: Int = 8080) {
    print("Connexion à \\(hote):\\(port)")
}
connexion(hote: "localhost")
connexion(hote: "api.dev", port: 3000)

// Variadique
func somme(_ nombres: Int...) -> Int {
    return nombres.reduce(0, +)
}
print("Somme : \\(somme(1, 2, 3, 4, 5))")`,
        },
        task: "Crée une fonction calculerIMC(poids: Double, taille: Double) -> (imc: Double, categorie: String) qui retourne l'IMC et sa catégorie (maigre/normal/surpoids). Teste avec plusieurs valeurs.",
        takeaway:
          "Les labels de paramètres Swift rendent les appels lisibles. Les tuples permettent des retours multiples. inout modifie les variables originales.",
        quiz: quiz(
          "Comment supprimer le label d'un paramètre à l'appel ?",
          ["En utilisant var", "En préfixant avec _", "En ajoutant @noLabel"],
          1,
          "func add(_ a: Int, _ b: Int) supprime les labels. L'appel devient add(3, 5) au lieu de add(a: 3, b: 5)."
        ),
        link: swiftDocs + "documentation/the-swift-programming-language/functions",
      }),
      lesson({
        id: "swift-closures",
        title: "Closures : fonctions anonymes et trailing syntax",
        minutes: 30,
        summary:
          "Les closures sont des blocs de code anonymes utilisés partout en Swift : map, filter, sort, les callbacks SwiftUI. La trailing closure syntax rend le code très fluide.",
        sections: [
          section(
            "Qu'est-ce qu'une closure ?",
            "Une closure est une fonction sans nom qu'on peut stocker dans une variable ou passer en paramètre.",
            [
              "Syntaxe : { (params) -> ReturnType in instructions }",
              "Court : { param in instruction } – inférence de type.",
              "Ultra-court : { $0 + $1 } – paramètres numérotés $0, $1...",
              "Capturing : une closure 'capture' les variables de son contexte.",
            ]
          ),
          section(
            "Trailing closure syntax",
            "Quand le dernier paramètre est une closure, on peut la placer APRÈS les parenthèses.",
            [
              "Normal : nombres.sorted(by: { $0 < $1 })",
              "Trailing : nombres.sorted { $0 < $1 }",
              "Multiple trailing (Swift 5.3+) : URLSession.shared.dataTask(with: url) { data, response, error in ... }",
            ]
          ),
          section(
            "map, filter, reduce",
            "Les opérations fonctionnelles sur les collections utilisent des closures.",
            [
              "map : transforme chaque élément. [1,2,3].map { $0 * 2 } → [2,4,6]",
              "filter : garde les éléments qui passent le test. [1,2,3,4].filter { $0 % 2 == 0 } → [2,4]",
              "reduce : combine tous les éléments. [1,2,3,4].reduce(0, +) → 10",
              "compactMap : map + filtre les nil. Utile avec les optionals.",
            ]
          ),
        ],
        files: {
          html: "",
          css: "",
          entry: `// Closures Swift

// Closure stockée dans une variable
let multiplier = { (a: Int, b: Int) -> Int in
    return a * b
}
print(multiplier(4, 5))  // 20

// Inférence de type (plus court)
let doubler: (Int) -> Int = { $0 * 2 }
print(doubler(7))  // 14

// Trailing closure avec sort
let noms = ["Charlie", "Alice", "Bob", "Diana"]
let nomsTries = noms.sorted { $0 < $1 }
print(nomsTries)  // ["Alice", "Bob", "Charlie", "Diana"]

// map : transformer
let nombres = [1, 2, 3, 4, 5]
let carres = nombres.map { $0 * $0 }
print("Carrés : \\(carres)")

// filter : filtrer
let pairs = nombres.filter { $0 % 2 == 0 }
print("Pairs : \\(pairs)")

// reduce : combiner
let somme = nombres.reduce(0) { $0 + $1 }
print("Somme : \\(somme)")

// Chaîner les opérations
let resultat = (1...10)
    .filter { $0 % 2 != 0 }  // Impairs
    .map { $0 * $0 }          // Carré
    .reduce(0, +)             // Somme
print("Somme des carrés impairs : \\(resultat)")

// @escaping : closure qui outlive la fonction
func chargerDonnees(completion: @escaping (String) -> Void) {
    DispatchQueue.global().async {
        let data = "Données chargées"
        DispatchQueue.main.async { completion(data) }
    }
}`,
        },
        task: "À partir d'un tableau de températures en Celsius [0, 10, 20, 30, 40], utilise map pour convertir en Fahrenheit (F = C * 9/5 + 32), filter pour garder celles > 70°F, puis reduce pour calculer la moyenne.",
        takeaway:
          "Les closures sont omniprésentes en Swift. La trailing syntax et $0/$1 rendent le code compact. map/filter/reduce transforment les collections de façon fonctionnelle.",
        quiz: quiz(
          "Que fait [1,2,3,4].filter { $0 % 2 == 0 } ?",
          ["Retourne [2, 4]", "Retourne [1, 3]", "Retourne [1, 2, 3, 4]"],
          0,
          "filter garde les éléments pour lesquels la closure retourne true. Ici, les nombres pairs (divisibles par 2)."
        ),
        link: swiftDocs + "documentation/the-swift-programming-language/closures",
      }),
    ],
  },
  {
    id: "swift-structs-classes",
    title: "Structs, classes et protocoles",
    description:
      "Modélise tes données avec des structs (valeur) et tes services avec des classes (référence). Utilise les protocoles comme contrats.",
    lessons: [
      lesson({
        id: "swift-struct-class",
        title: "Struct vs Class : valeur vs référence",
        minutes: 32,
        summary:
          "En Swift, les structs sont copiées (valeur) et les classes sont partagées (référence). SwiftUI préfère les structs pour les vues et les données. Les classes pour les services partagés.",
        sections: [
          section(
            "Struct : type valeur",
            "Quand tu assignes ou passes une struct, Swift en crée une COPIE. Chaque variable a sa propre copie indépendante.",
            [
              "struct Point { var x: Double; var y: Double }",
              "let p1 = Point(x: 1, y: 2); var p2 = p1 → p2 est une copie indépendante.",
              "Modifier p2 ne change PAS p1.",
              "Initialiseur memberwise automatique : Point(x: 1, y: 2) sans rien écrire.",
              "mutating func : nécessaire pour modifier un attribut depuis une méthode.",
              "Préférer struct par défaut en Swift !",
            ]
          ),
          section(
            "Class : type référence",
            "Quand tu assignes ou passes une classe, Swift partage la MÊME instance. Toutes les références voient les changements.",
            [
              "class Compteur { var valeur = 0 }",
              "let c1 = Compteur(); let c2 = c1 → c1 et c2 pointent sur le MÊME objet.",
              "Modifier c2.valeur change aussi c1.valeur !",
              "Héritage : class Enfant: Parent { }",
              "deinit : destructeur appelé quand l'instance est libérée.",
              "Utiliser class pour services partagés, ObservableObject, singletons.",
            ]
          ),
          section(
            "Protocoles : contrats Swift",
            "Un protocole définit des méthodes et propriétés qu'un type doit implémenter. Comme une interface Java.",
            [
              "protocol Descriptible { var description: String { get } }",
              "struct Livre: Descriptible { var description: String { ... } }",
              "Un type peut adopter plusieurs protocoles.",
              "Protocoles standards importants : Identifiable, Hashable, Codable, Comparable.",
              "protocol + extension = fonctionnalité par défaut.",
            ]
          ),
        ],
        files: {
          html: "",
          css: "",
          entry: `// Struct vs Class en Swift

// === STRUCT (type valeur) ===
struct Point {
    var x: Double
    var y: Double
    
    // mutating car modifie self
    mutating func deplacer(dx: Double, dy: Double) {
        x += dx
        y += dy
    }
    
    var description: String {
        "Point(\\(x), \\(y))"
    }
}

var p1 = Point(x: 0, y: 0)
var p2 = p1          // Copie !
p2.x = 10
print(p1.description)  // Point(0.0, 0.0) – non modifié
print(p2.description)  // Point(10.0, 0.0)

// === CLASS (type référence) ===
class Compteur {
    var valeur = 0
    
    func incrementer() { valeur += 1 }
    
    deinit { print("Compteur libéré") }
}

let c1 = Compteur()
let c2 = c1          // Référence partagée !
c2.incrementer()
c2.incrementer()
print(c1.valeur)     // 2 – c1 et c2 partagent le même objet

// === PROTOCOLE ===
protocol Animal {
    var nom: String { get }
    func parler() -> String
}

struct Chien: Animal {
    var nom: String
    func parler() -> String { "\\(nom) dit : Woof!" }
}

struct Chat: Animal {
    var nom: String
    func parler() -> String { "\\(nom) dit : Miaou!" }
}

let animaux: [any Animal] = [Chien(nom: "Rex"), Chat(nom: "Whiskers")]
for animal in animaux {
    print(animal.parler())
}`,
        },
        task: "Crée une struct Produit (nom, prix, quantite) avec un protocole Affichable qui impose var resume: String. Crée un tableau de 3 produits et affiche un résumé de chacun.",
        takeaway:
          "Struct = copie (valeur), class = partage (référence). SwiftUI préfère les structs. Les protocoles définissent des contrats. Préfère struct par défaut sauf besoin de partage.",
        quiz: quiz(
          "Que se passe-t-il quand on assigne une struct à une nouvelle variable ?",
          ["Les deux variables partagent la même instance", "Une copie indépendante est créée", "Une erreur de compilation"],
          1,
          "Les structs sont des types valeur. L'assignation crée une copie. Modifier l'une ne change pas l'autre."
        ),
        link: swiftDocs + "documentation/the-swift-programming-language/structures-and-classes",
      }),
    ],
  },
  {
    id: "swift-collections",
    title: "Collections : Array, Dictionary, Set",
    description:
      "Stocke et manipule des groupes de données avec les trois collections fondamentales de Swift.",
    lessons: [
      lesson({
        id: "swift-array-dict-set",
        title: "Array, Dictionary et Set",
        minutes: 30,
        summary:
          "Swift propose trois collections principales : Array (tableaux ordonnés), Dictionary (paires clé-valeur), Set (éléments uniques non ordonnés). Toutes sont génériques et type-safe.",
        sections: [
          section(
            "Array : collection ordonnée",
            "Un Array est une liste ordonnée d'éléments du même type. Le type le plus utilisé en Swift.",
            [
              "Déclaration : var fruits = [\"pomme\", \"banane\", \"cerise\"]",
              "Type explicite : var notes: [Int] = []",
              "Accès : fruits[0] → 'pomme'. fruits.first, fruits.last.",
              "Modification : fruits.append('kiwi'), fruits.insert('mangue', at: 1)",
              "Suppression : fruits.remove(at: 0), fruits.removeAll()",
              "Itération : for fruit in fruits { print(fruit) }",
              "Vérification : fruits.contains('pomme'), fruits.count, fruits.isEmpty",
            ]
          ),
          section(
            "Dictionary : paires clé-valeur",
            "Un Dictionary associe des clés uniques à des valeurs. L'accès retourne un Optional.",
            [
              "Déclaration : var ages = [\"Alice\": 25, \"Bob\": 30]",
              "Accès : ages[\"Alice\"] → Optional(25). Toujours Optional !",
              "Avec défaut : ages[\"Alice\", default: 0]",
              "Ajout/modification : ages[\"Charlie\"] = 22",
              "Suppression : ages[\"Bob\"] = nil",
              "Itération : for (nom, age) in ages { }",
            ]
          ),
          section(
            "Set : éléments uniques",
            "Un Set stocke des éléments uniques sans ordre garanti. Très rapide pour vérifier la présence.",
            [
              "Déclaration : var langages: Set = [\"Swift\", \"Python\", \"Kotlin\"]",
              "Ajout : langages.insert(\"Rust\")",
              "Vérification : langages.contains(\"Swift\") → true",
              "Pas de doublons : insert d'un doublon ignoré.",
              "Opérations ensemblistes : union, intersection, subtracting.",
              "Utiliser Set pour une recherche O(1) et garantir l'unicité.",
            ]
          ),
        ],
        files: {
          html: "",
          css: "",
          entry: `// Collections Swift

// === ARRAY ===
var scores = [85, 92, 78, 96, 88]
print("Scores : \\(scores)")
print("Moyenne : \\(Double(scores.reduce(0, +)) / Double(scores.count))")

scores.append(100)
scores.sort()
print("Triés : \\(scores)")

// Filtrage et transformation
let excellents = scores.filter { $0 >= 90 }
let bonus = scores.map { $0 + 5 }
print("Excellents : \\(excellents)")

// === DICTIONARY ===
var contacts: [String: String] = [
    "Alice": "+33612345678",
    "Bob": "+33698765432"
]

contacts["Charlie"] = "+33611223344"

if let tel = contacts["Alice"] {
    print("Alice : \\(tel)")
}

// Itération
for (nom, numero) in contacts.sorted(by: { $0.key < $1.key }) {
    print("\\(nom) → \\(numero)")
}

// Comptage de fréquences avec Dictionary
let texte = "swift swift kotlin java swift kotlin"
let mots = texte.split(separator: " ")
var frequences: [String: Int] = [:]
for mot in mots {
    frequences[String(mot), default: 0] += 1
}
print("Fréquences : \\(frequences)")

// === SET ===
var langagesMaitrise: Set = ["Swift", "Python", "Swift"]  // Swift en double
print("Langages (uniques) : \\(langagesMaitrise.count)")  // 2

let objectif: Set = ["Swift", "Kotlin", "Rust"]
let aApprendre = objectif.subtracting(langagesMaitrise)
print("À apprendre : \\(aApprendre)")`,
        },
        task: "Crée un programme qui lit une liste de mots et affiche : le nombre de mots uniques (Set), la fréquence de chaque mot (Dictionary), et les 3 mots les plus fréquents (Array trié).",
        takeaway:
          "Array pour l'ordre, Dictionary pour clé-valeur, Set pour l'unicité et la rapidité. L'accès à un Dictionary retourne toujours un Optional !",
        quiz: quiz(
          "Quel est le type retourné par ages[\"Alice\"] sur un Dictionary [String: Int] ?",
          ["Int", "Int?", "String"],
          1,
          "L'accès à un Dictionary retourne toujours un Optional car la clé pourrait ne pas exister."
        ),
        link: swiftDocs + "documentation/the-swift-programming-language/collection-types",
      }),
    ],
  },
  {
    id: "swift-exercice-debutant",
    title: "Exercice final débutant",
    description:
      "Construis une app de profil interactif qui combine tous les fondamentaux Swift et SwiftUI appris.",
    lessons: [
      lesson({
        id: "swift-projet-profil",
        title: "Projet : App de profil personnel interactif",
        minutes: 90,
        summary:
          "Crée une application SwiftUI complète avec un profil utilisateur modifiable, un compteur de skills, et un mini quiz. Combine Swift (structs, closures, collections) et SwiftUI (@State, stacks, List).",
        sections: [
          section(
            "Objectif du projet",
            "Une app avec 3 vues : profil, skills et quiz. Toutes les données sont en mémoire avec @State.",
            [
              "Vue Profil : nom, bio, avatar avec emoji picker, bouton Modifier.",
              "Vue Skills : liste de compétences avec niveau (1-5 étoiles), ajout/suppression.",
              "Vue Quiz : 5 questions sur Swift, score affiché à la fin.",
              "Navigation : TabView avec 3 onglets.",
            ]
          ),
          section(
            "Concepts utilisés",
            "Ce projet combine tous les fondamentaux du niveau débutant.",
            [
              "✅ Variables/constantes (let/var, optionals)",
              "✅ Conditions et switch",
              "✅ Boucles et ForEach",
              "✅ Fonctions avec paramètres",
              "✅ Struct pour les modèles (Skill, Question)",
              "✅ Array et Dictionary",
              "✅ Closures (map, filter)",
              "✅ @State et Binding",
              "✅ VStack, HStack, List, TabView",
            ]
          ),
          section(
            "Structure suggérée",
            "Organise ton code en modèles, vues et logique séparés.",
            [
              "struct Skill: Identifiable { id, nom, niveau: Int }",
              "struct Question: Identifiable { id, texte, options: [String], reponseCorrecte: Int }",
              "ProfilView : @State var profil = Profil()",
              "SkillsView : @State var skills = [Skill]() avec ajout/suppression",
              "QuizView : @State var questionIndex = 0, @State var score = 0",
            ]
          ),
        ],
        files: profile.files,
        task: "Implémente les 3 vues complètes de l'application. Assure-toi que l'ajout/suppression de skills fonctionne, que le quiz calcule bien le score, et que la navigation par onglets est fluide.",
        takeaway:
          "Bravo ! Tu maîtrises maintenant les fondamentaux Swift et SwiftUI : types, optionals, collections, closures, @State et les composants de base. Le niveau intermédiaire t'attend !",
        quiz: quiz(
          "Quel composant SwiftUI utilise-t-on pour une navigation par onglets ?",
          ["NavigationView", "TabView", "GroupBox"],
          1,
          "TabView crée une barre d'onglets en bas avec .tabItem { Label(...) } pour chaque vue."
        ),
        link: docs + "tabview",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "swiftui-listes",
    title: "Listes dynamiques avec List et ForEach",
    description:
      "Affiche des collections de données avec List, le composant le plus utilisé de SwiftUI.",
    lessons: [
      lesson({
        id: "swiftui-list-foreach",
        title: "List et ForEach : afficher des tableaux",
        minutes: 28,
        summary:
          "List affiche des collections scrollables. ForEach génère des vues depuis un tableau, performant et idiomatique en SwiftUI.",
        sections: [
          section(
            "List : listes scrollables",
            "List est le composant SwiftUI pour afficher des listes scrollables avec style natif iOS.",
            [
              "Syntaxe statique : List { Text('Item 1'); Text('Item 2'); Text('Item 3') } crée une liste de 3 items.",
              "Syntaxe dynamique : List(items) { item in Text(item.nom) } génère une ligne par élément du tableau.",
              "Style natif : List adopte automatiquement le style iOS (séparateurs, swipe actions, etc.).",
              "Identifiable : Le type de données DOIT être Identifiable ou utiliser id: \\.self pour les types simples.",
            ],
          ),
          section(
            "ForEach : génération dynamique",
            "ForEach génère des vues depuis un tableau, utilisable dans List, VStack, HStack, etc.",
            [
              "Dans List : List { ForEach(items) { item in Text(item.nom) } } génère des lignes.",
              "Hors List : VStack { ForEach(0..<5) { i in Text('Ligne \\(i)') } } dans n'importe quel conteneur.",
              "Identifiable requis : ForEach(items) nécessite Identifiable. Ou ForEach(items, id: \\.self) pour types simples.",
              "Performance : ForEach ne recrée QUE les vues modifiées (diffing intelligent).",
            ],
          ),
          section(
            "Protocole Identifiable",
            "Identifiable fournit un id unique pour chaque élément, nécessaire pour ForEach et List.",
            [
              "struct TodoItem: Identifiable { let id = UUID(); var title: String }",
              "id : UUID : Génère un identifiant unique automatiquement.",
              "Alternative : ForEach(items, id: \\.self) pour types simples comme String, Int (moins performant).",
            ],
          ),
          section(
            "Swipe actions et suppression",
            "List supporte nativement les actions de swipe et la suppression.",
            [
              ".onDelete : List { ForEach(items) { ... }.onDelete(perform: deleteItem) } active swipe-to-delete.",
              "func deleteItem(at offsets: IndexSet) { items.remove(atOffsets: offsets) } gère la suppression.",
              ".swipeActions : Ajoute des boutons personnalisés au swipe.",
            ],
          ),
        ],
        files: todo.files,
        task: "Crée une liste de tâches avec struct TodoItem: Identifiable { let id = UUID(); var title: String }. Affiche-les avec List et ForEach. Ajoute .onDelete pour supprimer au swipe.",
        takeaway:
          "List affiche des listes scrollables natives. ForEach génère dynamiquement des vues depuis un tableau. Le type doit être Identifiable. .onDelete active swipe-to-delete.",
        quiz: quiz(
          "Quel protocole ton type de données doit implémenter pour ForEach ?",
          ["Codable", "Identifiable", "Equatable"],
          1,
          "ForEach nécessite que le type soit Identifiable pour identifier chaque élément de manière unique.",
        ),
        link: docs + "list",
      }),
    ],
  },
  {
    id: "swiftui-navigation",
    title: "Navigation entre écrans",
    description:
      "Navigue entre plusieurs écrans avec NavigationView et NavigationLink.",
    lessons: [
      lesson({
        id: "swiftui-navigationview",
        title: "NavigationView et NavigationLink",
        minutes: 30,
        summary:
          "NavigationView crée une pile de navigation. NavigationLink pousse un nouvel écran sur la pile avec transition automatique.",
        sections: [
          section(
            "NavigationView : conteneur de navigation",
            "NavigationView est le conteneur racine qui gère la pile de navigation et la barre de titre.",
            [
              "Entoure ta vue : NavigationView { ContentView() } active la navigation.",
              ".navigationTitle : .navigationTitle('Mon App') définit le titre dans la barre de navigation.",
              ".navigationBarTitleDisplayMode : .large (gros titre) ou .inline (petit titre centré).",
              "Barre de navigation : NavigationView ajoute automatiquement le bouton retour sur les écrans enfants.",
            ],
          ),
          section(
            "NavigationLink : pousser un écran",
            "NavigationLink pousse un nouvel écran sur la pile avec animation automatique.",
            [
              "Syntaxe : NavigationLink(destination: DetailView()) { Text('Voir détails') } navigue au clic.",
              "destination : La vue à afficher quand on clique.",
              "label : Le contenu cliquable (texte, image, vue custom).",
              "Retour automatique : Le bouton '< Retour' est ajouté automatiquement en haut à gauche.",
            ],
          ),
          section(
            "Passer des données entre écrans",
            "Passe des données à la vue destination via son constructeur.",
            [
              "Exemple : NavigationLink(destination: DetailView(item: selectedItem)) { Text('Voir \\(selectedItem.nom)') }",
              "DetailView : struct DetailView: View { let item: Item; var body: some View { Text(item.nom) } }",
            ],
          ),
        ],
        files: todo.files,
        task: "Crée une liste d'items dans NavigationView. Chaque item a un NavigationLink vers un DetailView qui affiche le titre et la description. Ajoute .navigationTitle sur les deux écrans.",
        takeaway:
          "NavigationView active la navigation. NavigationLink pousse un nouvel écran. .navigationTitle définit le titre. Passe des données via le constructeur de la vue destination.",
        quiz: quiz(
          "Quel composant entoure ta vue racine pour activer la navigation ?",
          ["NavigationLink", "NavigationView", "NavigationStack"],
          1,
          "NavigationView entoure la vue racine et gère la pile de navigation. NavigationLink pousse des écrans enfants.",
        ),
        link: docs + "navigationview",
      }),
    ],
  },
  {
    id: "swiftui-formulaires",
    title: "Formulaires et saisie utilisateur",
    description:
      "Collecte des données utilisateur avec TextField, Toggle, Picker et Form.",
    lessons: [
      lesson({
        id: "swiftui-textfield-form",
        title: "TextField, Toggle, Picker et Form",
        minutes: 32,
        summary:
          "TextField pour saisir du texte, Toggle pour on/off, Picker pour sélection, Form pour grouper des champs avec style natif.",
        sections: [
          section(
            "TextField : saisie de texte",
            "TextField permet à l'utilisateur de saisir du texte, lié à une variable @State avec Binding.",
            [
              "Syntaxe : TextField('Placeholder', text: $nom) lie le champ à nom.",
              "$nom : Binding bidirectionnel. Le TextField LIT et ÉCRIT dans nom.",
              "Placeholder : Le texte affiché quand le champ est vide.",
              ".textFieldStyle : .textFieldStyle(.roundedBorder) pour un style avec bordure.",
              ".keyboardType : .keyboardType(.emailAddress), .numberPad pour clavier spécialisé.",
            ],
          ),
          section(
            "Toggle : interrupteur on/off",
            "Toggle affiche un interrupteur pour activer/désactiver une option, lié à un Bool.",
            [
              "Syntaxe : Toggle('Notifications', isOn: $isEnabled) lie à isEnabled.",
              "$isEnabled : Bool @State. true = activé, false = désactivé.",
              "Interactif : L'utilisateur tape pour basculer, la variable change automatiquement.",
            ],
          ),
          section(
            "Picker : sélection parmi des options",
            "Picker permet de choisir une valeur parmi plusieurs options.",
            [
              "Syntaxe : Picker('Catégorie', selection: $selectedCategory) { Text('Tech').tag('tech'); Text('Sport').tag('sport') }",
              "$selectedCategory : Variable @State qui stocke la valeur sélectionnée.",
              ".tag() : Associe une valeur à chaque option.",
              "Style : .pickerStyle(.segmented) pour segmented control, .menu pour menu déroulant.",
            ],
          ),
          section(
            "Form : grouper des champs",
            "Form groupe des champs avec le style natif iOS (sections, séparateurs, labels).",
            [
              "Syntaxe : Form { Section('Infos') { TextField('Nom', text: $nom); TextField('Email', text: $email) } }",
              "Section : Group des champs avec titre optionnel.",
              "Style natif : Form adopte automatiquement le style iOS Settings.",
              "Scrollable : Form scroll automatiquement si contenu trop grand.",
            ],
          ),
        ],
        files: todo.files,
        task: "Crée un formulaire d'inscription avec Form : TextField pour nom et email, Toggle pour 'Recevoir la newsletter', Picker pour choisir un pays. Affiche les valeurs sélectionnées sous le formulaire.",
        takeaway:
          "TextField saisit du texte, Toggle active/désactive, Picker sélectionne parmi des options. Form groupe les champs avec style natif. $ crée le Binding bidirectionnel.",
        quiz: quiz(
          "Quel composant utilises-tu pour grouper des champs avec style natif iOS ?",
          ["VStack", "Form", "List"],
          1,
          "Form groupe des champs de formulaire avec le style natif iOS (séparateurs, labels, sections).",
        ),
        link: docs + "form",
      }),
    ],
  },
  {
    id: "swiftui-animations",
    title: "Animations et transitions",
    description:
      "Donne vie à tes interfaces avec des animations fluides, des transitions entre vues et des effets visuels.",
    lessons: [
      lesson({
        id: "swiftui-animation",
        title: "Animations implicites et explicites",
        minutes: 30,
        summary:
          "SwiftUI propose des animations implicites (withAnimation) et explicites (.animation()). Les animations sont déclaratives : tu décris le début et la fin, SwiftUI gère l'interpolation.",
        sections: [
          section(
            "withAnimation : animer un changement d'état",
            "Entoure le changement d'état avec withAnimation pour l'animer automatiquement.",
            [
              "withAnimation { isExpanded.toggle() } – anime tous les changements liés à isExpanded.",
              "Courbes : .linear, .easeIn, .easeOut, .easeInOut, .spring()",
              "Durée : withAnimation(.easeInOut(duration: 0.5))",
              "Spring : withAnimation(.spring(response: 0.4, dampingFraction: 0.6))",
            ]
          ),
          section(
            ".animation() : modifier d'animation",
            "Applique une animation à une vue spécifique via le modifier .animation().",
            [
              ".animation(.easeInOut, value: isVisible) – anime quand isVisible change.",
              "Le paramètre value est requis depuis iOS 15 pour éviter les animations involontaires.",
              ".scaleEffect(isPressed ? 1.1 : 1.0).animation(.spring(), value: isPressed)",
            ]
          ),
          section(
            "Transitions entre vues",
            "Les transitions animent l'apparition et la disparition des vues dans la hiérarchie.",
            [
              ".transition(.slide) – glisse de/vers le bord.",
              ".transition(.scale) – grossit/rétrécit.",
              ".transition(.opacity) – fondu.",
              ".transition(.asymmetric(insertion: .slide, removal: .opacity)) – différent en entrée/sortie.",
              "if isVisible { MaVue().transition(.scale) } dans withAnimation.",
            ]
          ),
        ],
        files: todo.files,
        task: "Ajoute à une liste d'items : une animation spring quand on coche un item (scale + opacity), une transition .slide pour l'ajout, et une transition .opacity pour la suppression.",
        takeaway:
          "withAnimation anime les changements d'état. .transition() anime l'apparition/disparition. .spring() donne des animations naturelles. SwiftUI gère toute l'interpolation.",
        quiz: quiz(
          "Comment animer un changement de @State en SwiftUI ?",
          ["state.animate()", "withAnimation { state = nouvelleValeur }", "@AnimatedState"],
          1,
          "withAnimation { } entoure le changement d'état pour l'animer. SwiftUI détecte les changements et anime les vues affectées."
        ),
        link: docs + "animation(_:value:)",
      }),
    ],
  },
  {
    id: "swiftui-persistance",
    title: "Persistance des données",
    description:
      "Sauvegarde les données entre les sessions avec @AppStorage, UserDefaults et la gestion de fichiers.",
    lessons: [
      lesson({
        id: "swiftui-appstorage",
        title: "@AppStorage et UserDefaults",
        minutes: 28,
        summary:
          "@AppStorage lie une vue directement à UserDefaults. Les données persistent entre les lancements de l'app. Idéal pour les préférences, réglages et petites données.",
        sections: [
          section(
            "@AppStorage : persistance simple",
            "@AppStorage est un wrapper qui synchronise automatiquement une valeur avec UserDefaults.",
            [
              "@AppStorage(\"nomUtilisateur\") var nom = \"\" – valeur par défaut si rien en mémoire.",
              "Types supportés : Bool, Int, Double, String, URL, Data.",
              "La vue se reconstruit quand la valeur change, comme @State.",
              "Accès depuis n'importe quelle vue avec la même clé.",
              "UserDefaults.standard.set(valeur, forKey: \"cle\") en code non-SwiftUI.",
            ]
          ),
          section(
            "Cas d'usage de @AppStorage",
            "Utilise @AppStorage pour les préférences utilisateur et les réglages simples.",
            [
              "Thème sombre/clair : @AppStorage(\"darkMode\") var darkMode = false",
              "Première ouverture : @AppStorage(\"hasSeenOnboarding\") var hasSeenOnboarding = false",
              "Préférences : langue, notifications, unités.",
              "⚠️ Pas pour les données complexes (liste de modèles). Utiliser SwiftData pour ça.",
            ]
          ),
          section(
            "Encoder/décoder avec JSON",
            "Pour persister des tableaux et objets complexes dans UserDefaults.",
            [
              "Encoder : JSONEncoder().encode(tableau) → Data",
              "Sauvegarder : UserDefaults.standard.set(data, forKey: \"cle\")",
              "Décoder : JSONDecoder().decode([MonType].self, from: data)",
              "Struct doit être Codable.",
            ]
          ),
        ],
        files: cart.files,
        task: "Modifie une app de liste de tâches pour que les tâches persistent après fermeture. Utilise @AppStorage avec un tableau encodé en JSON (Codable). Teste en fermant et rouvrant l'app.",
        takeaway:
          "@AppStorage synchronise une valeur avec UserDefaults automatiquement. Simple et déclaratif pour les préférences. Pour des modèles complexes, utilise SwiftData.",
        quiz: quiz(
          "Quel est l'avantage de @AppStorage vs @State ?",
          ["@AppStorage est plus rapide", "@AppStorage persiste entre les sessions", "@AppStorage est thread-safe"],
          1,
          "@AppStorage lie la vue à UserDefaults. La valeur est sauvegardée sur le disque et persiste entre les lancements de l'app."
        ),
        link: docs + "appstorage",
      }),
    ],
  },
  {
    id: "swiftui-exercice-intermediaire",
    title: "Exercice final intermédiaire",
    description:
      "Construis une app de gestion de tâches complète avec liste, navigation, formulaire, animations et persistance.",
    lessons: [
      lesson({
        id: "swift-projet-todo",
        title: "Projet : App Todo complète avec persistance",
        minutes: 120,
        summary:
          "Crée une app Todo multi-vues avec liste animée, formulaire d'ajout, vue détail, filtrage et persistance UserDefaults. Combine tout ce que tu as appris au niveau intermédiaire.",
        sections: [
          section(
            "Fonctionnalités",
            "Une app Todo complète qui ressemble à une vraie application iOS.",
            [
              "Liste principale : toutes les tâches avec statut, priorité et date.",
              "Swipe actions : swipe left pour supprimer, swipe right pour compléter.",
              "Formulaire d'ajout : TextField pour le titre, Picker pour la priorité, DatePicker.",
              "Vue détail : tous les détails d'une tâche, modification en place.",
              "Filtres : toutes/actives/complétées avec Picker segmenté.",
              "Animations : spring pour l'ajout, opacity pour la suppression.",
              "Persistance : @AppStorage + JSON pour sauvegarder entre sessions.",
            ]
          ),
          section(
            "Modèle de données",
            "Une struct Tache bien conçue au cœur de l'application.",
            [
              "struct Tache: Identifiable, Codable { id, titre, detail, priorite, dateEcheance, estComplete }",
              "enum Priorite: String, Codable, CaseIterable { case faible, normale, haute }",
              "class TacheStore: ObservableObject { @Published var taches = [Tache]() }",
              "Le store gère la persistance avec @AppStorage.",
            ]
          ),
          section(
            "Concepts validés",
            "Ce projet couvre tous les concepts du niveau intermédiaire.",
            [
              "✅ List avec ForEach et swipeActions",
              "✅ NavigationStack avec NavigationLink",
              "✅ TextField, Picker, DatePicker, Toggle dans Form",
              "✅ withAnimation et .transition()",
              "✅ @AppStorage pour la persistance",
              "✅ ObservableObject pour l'état partagé",
            ]
          ),
        ],
        files: todo.files,
        task: "Implémente l'app Todo complète. Chaque fonctionnalité doit fonctionner : ajout avec formulaire, suppression avec swipe, filtrage par statut, et persistance entre sessions.",
        takeaway:
          "Tu sais maintenant créer de vraies applications iOS : listes dynamiques, navigation multi-écrans, saisie utilisateur et persistance. Place au niveau avancé !",
        quiz: quiz(
          "Comment implémenter le swipe-to-delete sur une List en SwiftUI ?",
          [".onDelete(perform: supprimer)", ".swipeActions { Button('Supprimer') }", "Les deux fonctionnent"],
          2,
          ".onDelete est l'API historique simple. .swipeActions (iOS 15+) offre plus de contrôle (couleur, icône, multiple actions)."
        ),
        link: docs + "list",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "swift-async-await",
    title: "Appels réseau avec async/await",
    description:
      "Récupère des données depuis des API avec URLSession, async/await et gère les erreurs.",
    lessons: [
      lesson({
        id: "swift-urlsession-async",
        title: "URLSession, async/await et décodage JSON",
        minutes: 35,
        summary:
          "URLSession envoie des requêtes HTTP. async/await simplifie le code asynchrone. Codable décode automatiquement le JSON en structs Swift.",
        sections: [
          section(
            "URLSession : requêtes HTTP",
            "URLSession est l'API native Apple pour les requêtes réseau (GET, POST, etc.).",
            [
              "Syntaxe moderne : let (data, response) = try await URLSession.shared.data(from: url)",
              "data : Les données brutes reçues (JSON, image, etc.).",
              "response : HTTPURLResponse avec status code, headers.",
              "Erreur automatique : Si le réseau échoue, Swift throw une erreur.",
            ],
          ),
          section(
            "async/await : asynchrone simplifié",
            "async/await remplace les closures imbriquées par un code linéaire lisible.",
            [
              "func fetchData() async throws : Déclare une fonction asynchrone qui peut throw des erreurs.",
              "await : Attend la fin de l'opération asynchrone. let data = try await URLSession.shared.data(from: url)",
              "Task : Task { await fetchData() } lance une tâche asynchrone depuis du code synchrone.",
              "@MainActor : Force l'exécution sur le thread principal (nécessaire pour l'UI). @MainActor func updateUI() { ... }",
            ],
          ),
          section(
            "Codable : décoder le JSON automatiquement",
            "Codable encode/décode automatiquement les structs Swift depuis/vers JSON.",
            [
              "struct User: Codable { let id: Int; let name: String; let email: String }",
              "Décodage : let user = try JSONDecoder().decode(User.self, from: data)",
              "Encodage : let data = try JSONEncoder().encode(user)",
              "CodingKeys : Pour mapper des noms JSON différents. enum CodingKeys: String, CodingKey { case id, name = 'full_name' }",
            ],
          ),
          section(
            "Gestion d'erreurs avec do-catch",
            "Gère les erreurs réseau avec do-catch, équivalent try-catch dans d'autres langages.",
            [
              "Syntaxe : do { let data = try await fetchData() } catch { print('Erreur: \\(error)') }",
              "Spécifique : catch URLError.notConnectedToInternet { 'Pas de connexion' } catch DecodingError { 'JSON invalide' }",
            ],
          ),
        ],
        files: weather.files,
        task: "Crée un struct Post: Codable { let id: Int; let title: String }. Récupère https://jsonplaceholder.typicode.com/posts/1 avec URLSession, décode avec JSONDecoder, affiche le titre. Gère les erreurs avec do-catch.",
        takeaway:
          "URLSession.shared.data(from:) envoie des requêtes HTTP. async/await simplifie l'asynchrone. Codable décode automatiquement le JSON. do-catch gère les erreurs.",
        quiz: quiz(
          "Quel protocole permet de décoder automatiquement du JSON en struct Swift ?",
          ["Decodable", "Codable", "JSONSerializable"],
          1,
          "Codable (combinaison de Encodable + Decodable) permet d'encoder et décoder automatiquement JSON <> Swift struct.",
        ),
        link: "https://developer.apple.com/documentation/foundation/urlsession",
      }),
    ],
  },
  {
    id: "swiftui-observableobject",
    title: "Gestion d'état global avec ObservableObject",
    description:
      "Partage des données entre plusieurs vues avec ObservableObject et @Published.",
    lessons: [
      lesson({
        id: "swiftui-observableobject-published",
        title: "ObservableObject, @Published et @StateObject",
        minutes: 32,
        summary:
          "ObservableObject crée des stores observables. @Published notifie les changements. @StateObject et @ObservedObject lient les vues au store.",
        sections: [
          section(
            "ObservableObject : classe observable",
            "ObservableObject est un protocole pour créer des classes qui notifient les vues de leurs changements.",
            [
              "class UserStore: ObservableObject : Crée un store observable.",
              "@Published var nom = '' : Propriété qui notifie automatiquement les changements.",
              "objectWillChange : ObservableObject envoie automatiquement objectWillChange.send() quand une propriété @Published change.",
            ],
          ),
          section(
            "@Published : propriété réactive",
            "@Published sur une propriété déclenche une notification automatique à chaque modification.",
            [
              "@Published var count = 0 : Quand count change, tous les listeners sont notifiés.",
              "Automatique : Pas besoin d'appeler manuellement une fonction de notification.",
              "Types supportés : Tous les types (Int, String, Array, custom struct, etc.).",
            ],
          ),
          section(
            "@StateObject : créer et posséder un store",
            "@StateObject crée une instance du store et maintient sa durée de vie.",
            [
              "@StateObject private var store = UserStore() : Crée le store une fois, le garde en vie.",
              "Ownership : La vue POSSÈDE le store. Quand la vue disparaît, le store est détruit.",
              "Règle : Utilise @StateObject pour CRÉER un store dans une vue.",
            ],
          ),
          section(
            "@ObservedObject : observer un store existant",
            "@ObservedObject observe un store passé depuis une autre vue (ne le possède pas).",
            [
              "@ObservedObject var store: UserStore : Observe un store existant.",
              "Pas d'ownership : La vue observe mais ne possède pas. Si la vue est recréée, le store persiste ailleurs.",
              "Règle : Utilise @ObservedObject pour RECEVOIR un store créé ailleurs.",
            ],
          ),
          section(
            "@EnvironmentObject : injecter globalement",
            "@EnvironmentObject injecte un store dans TOUTES les vues enfants sans passer par constructeurs.",
            [
              ".environmentObject(store) : Injecte le store dans la hiérarchie depuis la vue parente.",
              "@EnvironmentObject var store: UserStore : Récupère le store injecté dans n'importe quelle vue enfant.",
              "Use case : Données globales accessibles partout (auth, theme, settings).",
            ],
          ),
          section(
            "Un exemple à explorer",
            "Voici un exemple complet qui montre comment utiliser ObservableObject avec plusieurs vues.",
            [
              "Exemple complet : WeatherView.swift et WeatherService.swift montrent un ViewModel avec @Published.",
              "Pattern MVVM : ViewModel (ObservableObject) sépare la logique métier de la vue.",
              "À toi de jouer : Explore WeatherView.swift pour voir @StateObject et WeatherViewModel.",
              "Async/await : Le ViewModel utilise async/await pour les appels réseau.",
            ],
          ),
        ],
        files: weather.files,
        task: "Explore le code de WeatherView.swift et WeatherViewModel. Observe comment @StateObject crée le ViewModel, @Published notifie les changements d'état (isLoading, weather, errorMessage), et @MainActor garantit les mises à jour UI sur le thread principal.",
        takeaway:
          "ObservableObject crée des stores observables. @Published notifie automatiquement les changements. @StateObject crée et possède, @ObservedObject observe sans posséder, @EnvironmentObject injecte globalement.",
        quiz: quiz(
          "Quel property wrapper utilises-tu pour CRÉER et POSSÉDER un store dans une vue ?",
          ["@ObservedObject", "@StateObject", "@EnvironmentObject"],
          1,
          "@StateObject crée une instance du store et maintient sa durée de vie. @ObservedObject observe un store existant sans le posséder.",
        ),
        link: docs + "stateobject",
      }),
    ],
  },
  {
    id: "swiftdata",
    title: "Persistance locale avec SwiftData",
    description:
      "Stocke des données persistantes avec SwiftData, le framework moderne d'Apple introduit en iOS 17.",
    lessons: [
      lesson({
        id: "swiftdata-intro",
        title: "SwiftData : @Model, @Query et ModelContainer",
        minutes: 35,
        summary:
          "SwiftData remplace Core Data avec une API SwiftUI native. @Model marque une classe comme persistante. @Query récupère les données automatiquement. ModelContainer configure la base.",
        sections: [
          section(
            "@Model : déclarer un modèle persistant",
            "@Model transforme une classe Swift ordinaire en modèle persistant géré par SwiftData.",
            [
              "import SwiftData",
              "@Model class Tache { var titre: String; var estComplete: Bool }",
              "SwiftData génère automatiquement le schéma et la migration.",
              "Initialiseur standard requis : init(titre: String) { self.titre = titre; self.estComplete = false }",
              "@Attribute(.unique) pour les propriétés uniques.",
              "@Relationship pour les relations entre modèles.",
            ]
          ),
          section(
            "ModelContainer et ModelContext",
            "ModelContainer configure la base de données. ModelContext permet les opérations CRUD.",
            [
              "Dans App : .modelContainer(for: Tache.self) sur WindowGroup.",
              "@Environment(\\.modelContext) var context : Accès au contexte dans les vues.",
              "Insérer : context.insert(nouvelleTache)",
              "Supprimer : context.delete(tache)",
              "Pas de save manuel : SwiftData sauvegarde automatiquement.",
            ]
          ),
          section(
            "@Query : récupérer les données",
            "@Query est un property wrapper qui récupère et observe automatiquement les données.",
            [
              "@Query var taches: [Tache] : Récupère toutes les tâches.",
              "@Query(sort: \\.titre) var taches: [Tache] : Triées par titre.",
              "@Query(filter: #Predicate { $0.estComplete == false }) : Filtrées.",
              "La vue se reconstruit automatiquement quand les données changent.",
              "Équivalent de @FetchRequest de Core Data mais plus simple.",
            ]
          ),
        ],
        files: weather.files,
        task: "Crée une app Notes avec SwiftData : @Model class Note { titre, contenu, dateCreation }. CRUD complet : liste des notes avec @Query, formulaire d'ajout, swipe pour supprimer, tap pour éditer.",
        takeaway:
          "SwiftData simplifie la persistance : @Model marque le modèle, @Query récupère les données, ModelContext fait le CRUD. Plus simple que Core Data mais iOS 17+ requis.",
        quiz: quiz(
          "Quel property wrapper récupère automatiquement les données SwiftData dans une vue ?",
          ["@FetchRequest", "@Query", "@Persistent"],
          1,
          "@Query récupère et observe les données SwiftData. La vue se reconstruit automatiquement quand les données changent."
        ),
        link: "https://developer.apple.com/documentation/swiftdata",
      }),
    ],
  },
  {
    id: "swift-exercice-avance",
    title: "Projet final : App météo complète",
    description:
      "Construis une app météo professionnelle qui combine API réseau, gestion d'état globale, SwiftData et une UI soignée.",
    lessons: [
      lesson({
        id: "swift-projet-final",
        title: "Projet final : App météo avec MVVM, API et persistance",
        minutes: 180,
        summary:
          "Crée une application météo complète niveau production : API OpenWeatherMap, MVVM avec ObservableObject, SwiftData pour l'historique, animations et gestion d'erreurs complète.",
        sections: [
          section(
            "Fonctionnalités",
            "Une app météo qui utilise tous les concepts avancés appris.",
            [
              "Recherche de ville avec autocomplétion.",
              "Météo actuelle : température, humidité, vent, description.",
              "Prévisions 5 jours avec List et icônes animées.",
              "Villes favorites : SwiftData pour persistance.",
              "Historique des recherches : SwiftData.",
              "Mode sombre/clair avec @AppStorage.",
              "Animations : transitions, loading spinner, effets de parallaxe.",
            ]
          ),
          section(
            "Architecture MVVM",
            "Organisation professionnelle du code en Model, View, ViewModel.",
            [
              "Model : struct WeatherResponse: Codable { } (décode le JSON de l'API)",
              "ViewModel : class WeatherViewModel: ObservableObject { @Published var weather, isLoading, error }",
              "View : ContentView observe WeatherViewModel via @StateObject",
              "Service : class WeatherService { func fetchWeather(city: String) async throws -> Weather }",
            ]
          ),
          section(
            "Concepts validés",
            "Ce projet final couvre tous les concepts du niveau avancé et de la formation.",
            [
              "✅ async/await et URLSession",
              "✅ Codable pour décoder le JSON",
              "✅ ObservableObject, @Published, @StateObject",
              "✅ @EnvironmentObject pour l'état global (thème)",
              "✅ SwiftData pour favorites et historique",
              "✅ @AppStorage pour les préférences",
              "✅ Animations et transitions fluides",
              "✅ Architecture MVVM professionnelle",
              "✅ Gestion d'erreurs complète",
            ]
          ),
        ],
        files: weather.files,
        task: "Implémente l'app météo complète. Elle doit se connecter à une vraie API, sauvegarder les favoris avec SwiftData, et offrir une expérience utilisateur soignée avec animations.",
        takeaway:
          "Félicitations ! Tu maîtrises maintenant le développement iOS avec Swift et SwiftUI : langage, UI déclarative, navigation, état, API réseau, persistance et architecture MVVM. Tu es prêt pour le marché !",
        quiz: quiz(
          "Qu'est-ce que le pattern MVVM ?",
          [
            "Un framework de navigation",
            "Une séparation en Model (données), View (UI) et ViewModel (logique)",
            "Un type de base de données"
          ],
          1,
          "MVVM sépare : Model (structures de données), View (SwiftUI), ViewModel (ObservableObject avec la logique). Facilite les tests et la maintenance."
        ),
        link: docs,
      }),
    ],
  },
];

export const swiftLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Swift fondamentaux et premières vues SwiftUI",
    objective:
      "Maîtrise les bases de Swift (variables, optionals, conditions, boucles, fonctions, structs, collections) puis crée tes premières vues SwiftUI avec Text, Image, Button et les stacks.",
    definition:
      "Swift est le langage moderne d'Apple pour iOS, macOS, watchOS et tvOS. SwiftUI est le framework déclaratif pour créer des interfaces utilisateur natives sur toutes les plateformes Apple.",
    color: levelColors[0],
    prerequisites:
      "Mac obligatoire avec macOS 13+ et Xcode installé. Aucune expérience de programmation requise.",
    outcomes: [
      "Comprendre let vs var, l'inférence de type et la type safety de Swift.",
      "Maîtriser les optionals (?), if let, guard let et nil coalescing.",
      "Utiliser if/else, switch exhaustif avec pattern matching et boucles for-in/while.",
      "Créer des fonctions avec labels, valeurs par défaut et closures.",
      "Modéliser les données avec struct, class et protocoles.",
      "Manipuler Array, Dictionary et Set pour gérer les collections.",
      "Créer des vues SwiftUI avec Text, Image, Button et modifiers.",
      "Organiser des interfaces avec VStack, HStack, ZStack et Spacer.",
      "Gérer l'état local avec @State et le binding bidirectionnel avec $.",
    ],
    chapters: beginner,
    projects: swiftBeginnerProjects,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Listes, navigation, animations et persistance",
    objective:
      "Affiche des listes dynamiques, navigue entre écrans, collecte des données utilisateur, anime tes interfaces et persiste les données avec @AppStorage.",
    definition:
      "Le niveau intermédiaire te permet de créer des applications multi-écrans avec listes scrollables, navigation, saisie utilisateur, animations fluides et persistance locale.",
    color: levelColors[1],
    prerequisites:
      "Connaître les bases Swift et SwiftUI. Maîtriser @State, les stacks, structs et closures.",
    outcomes: [
      "Afficher des collections avec List et ForEach.",
      "Implémenter Identifiable et gérer swipe-to-delete.",
      "Naviguer entre écrans avec NavigationView et NavigationLink.",
      "Créer des formulaires avec TextField, Toggle, Picker et Form.",
      "Animer les changements d'état avec withAnimation et les transitions.",
      "Persister les données entre sessions avec @AppStorage.",
    ],
    chapters: intermediate,
    projects: swiftIntermediateProjects,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "API réseau, état global, SwiftData et MVVM",
    objective:
      "Récupère des données d'API avec URLSession et async/await, gère l'état global avec ObservableObject, persiste avec SwiftData et maîtrise l'architecture MVVM.",
    definition:
      "Le niveau avancé te permet de créer des applications connectées et persistantes : API REST, JSON, état partagé, SwiftData et architecture professionnelle MVVM.",
    color: levelColors[2],
    prerequisites:
      "Maîtriser @State, les listes, la navigation, les animations et @AppStorage. Comprendre les structs, classes et closures Swift.",
    outcomes: [
      "Récupérer des données avec URLSession et async/await.",
      "Décoder du JSON automatiquement avec Codable.",
      "Gérer les erreurs réseau avec do-catch.",
      "Créer des stores observables avec ObservableObject et @Published.",
      "Utiliser @StateObject, @ObservedObject et @EnvironmentObject.",
      "Persister des modèles localement avec SwiftData (@Model, @Query).",
      "Implémenter l'architecture MVVM professionnelle.",
    ],
    chapters: advanced,
    projects: swiftAdvancedProjects,
  },
];
