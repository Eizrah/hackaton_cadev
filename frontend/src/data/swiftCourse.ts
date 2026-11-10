import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { swiftApp, swiftPath } from "./swiftAuthoring";
import { swiftAdvancedProjects } from "./swiftAdvancedProjects";
import {
  swiftBasics,
  swiftBeginnerProjects,
  swiftIntermediateProjects,
} from "./swiftProjects";
import type { WebLevel } from "./webCourseTypes";

const [profile, points] = swiftBeginnerProjects;
const [todo, expenses] = swiftIntermediateProjects;
const [crypto, journal] = swiftAdvancedProjects;
const appleDocs = "https://developer.apple.com/documentation/";
const swiftBook =
  "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/";

const beginner: WebLevel["chapters"] = [
  {
    id: "swift-xcode-et-syntaxe",
    title: "Xcode et premières lignes en Swift",
    description:
      "Lance un projet iOS et essaie séparément les bases du langage.",
    lessons: [
      lesson({
        id: "ouvrir-xcode-ios",
        title: "Ouvrir un projet et choisir un simulateur",
        minutes: 18,
        summary:
          "Xcode réunit le compilateur Swift, les outils Apple et le simulateur iOS. Le point d’entrée DevAfricaApp ouvre la vue principale.",
        sections: [
          section(
            "Distinguer un projet iOS et un essai Swift",
            "Sur Mac, ouvre DevAfrica.xcodeproj avec Xcode 16 ou plus récent. Choisis le schéma DevAfrica et un simulateur sous iOS 17 ou plus récent, puis clique sur Run.",
            [
              "Dans DevAfricaApp.swift, @main désigne le point d’entrée. WindowGroup contient ContentView.",
              "Un Playground permet d’expérimenter avec quelques lignes Swift et d’observer les résultats.",
              "Avec Swift installé, tu peux lancer swift Exemples/Bases.swift dans le dossier extrait sur Windows, Mac ou Linux. Les vues SwiftUI se lancent avec Xcode sur Mac.",
            ],
          ),
        ],
        files: projectExample(profile, swiftApp),
        task: "Repère la vue appelée par WindowGroup. Sur Mac, lance la carte sur un simulateur. Pour pratiquer la syntaxe en console, ouvre Exemples/Bases.swift.",
        takeaway:
          "Le projet Xcode organise la compilation de l’application. Le script Bases.swift permet de pratiquer le langage seul.",
        quiz: quiz(
          "Quel fichier appelle la vue principale au lancement de ce projet ?",
          ["README.md", "DevAfricaApp.swift", "Bases.swift"],
          1,
          "Le type annoté @main installe ContentView dans WindowGroup.",
        ),
        link: appleDocs + "xcode/running-your-app-in-simulator-or-on-a-device",
      }),
      lesson({
        id: "variables-et-optionnels-swift",
        title: "Variables, structures et valeurs optionnelles",
        minutes: 22,
        summary:
          "let crée une valeur non réassignable et var permet de la modifier. Un type suivi de ? représente une valeur qui peut être présente ou absente.",
        sections: [
          section(
            "Lire le profil dans Bases.swift",
            "La structure Profil regroupe un nom, un domaine et une adresse de portfolio optionnelle. Le programme utilise switch pour adapter son message au niveau.",
            [
              "String décrit du texte et Int un entier. Swift peut souvent déduire le type à partir de la valeur initiale.",
              "if let extrait la valeur présente et permet un else pour le cas nil.",
              "guard let traite l’absence au début d’une fonction. Le bloc else doit quitter la portée, par exemple avec return.",
            ],
          ),
        ],
        files: projectExample(profile, swiftBasics),
        task: "Remplace nil par l’adresse d’un portfolio de démonstration. Exécute le script pour vérifier le message affiché.",
        takeaway:
          "Les optionnels obligent à envisager le cas où une donnée manque.",
        quiz: quiz(
          "Quel type indique que l’adresse de portfolio peut être absente ?",
          ["String", "Int", "String?"],
          2,
          "Le point d’interrogation indique un Optional qui peut valoir nil.",
        ),
        link: swiftBook + "thebasics/",
      }),
    ],
  },
  {
    id: "vues-swiftui-et-stacks",
    title: "Vues déclaratives et disposition",
    description:
      "Assemble des composants et compose une carte à plusieurs couches.",
    lessons: [
      lesson({
        id: "protocole-view-swiftui",
        title: "Décrire un écran avec le protocole View",
        minutes: 20,
        summary:
          "Une vue SwiftUI décrit le contenu à afficher. Une struct conforme à View fournit la propriété body qui assemble d’autres vues.",
        sections: [
          section(
            "Des éléments simples aux cartes",
            "Text présente un texte. Image(systemName:) charge une icône SF Symbols. Label associe une icône et du texte.",
            [
              "Button associe une action à un appui. TextField peut se lier à un texte modifiable.",
              "Les modificateurs font évoluer une vue. Dans la carte, font change le rôle typographique et foregroundStyle choisit la couleur.",
              "Garde un intitulé visible pour l’action. Un portrait décoratif peut être masqué pour VoiceOver quand le nom est déjà annoncé.",
            ],
          ),
        ],
        files: profile.files,
        task: "Change le nom et le métier de la carte. Ajoute un Label avec une icône qui représente ton domaine.",
        takeaway:
          "Le corps d’une vue décrit son contenu à partir des données disponibles.",
        quiz: quiz(
          "Quelle propriété décrit ce qu’affiche une View ?",
          ["body", "id", "scenePhase"],
          0,
          "SwiftUI lit body pour construire l’arbre des vues.",
        ),
        link: appleDocs + "swiftui/view",
      }),
      lesson({
        id: "stacks-et-modificateurs-swiftui",
        title: "Aligner et superposer avec VStack, HStack et ZStack",
        minutes: 20,
        summary:
          "Les piles décrivent comment les vues se positionnent. La carte place son fond derrière une pile verticale centrée.",
        sections: [
          section(
            "Choisir le bon axe",
            "VStack empile les vues verticalement. HStack les aligne sur une ligne. ZStack superpose les éléments, en commençant par l’arrière-plan.",
            [
              "padding ajoute de l’espace autour d’une vue. frame peut limiter la largeur de la carte ou faire occuper l’espace disponible.",
              "L’ordre des modificateurs compte. Applique padding avant background pour que le fond englobe la marge.",
              "Le ScrollView laisse le texte s’étendre quand la taille d’affichage augmente.",
            ],
          ),
        ],
        files: profile.files,
        task: "Change le dégradé puis ajoute une HStack de deux libellés. Teste la carte avec une grande taille de texte.",
        takeaway:
          "La pile définit la position et les modificateurs précisent le rendu.",
        quiz: quiz(
          "Quelle pile place un dégradé derrière un bloc de contenu ?",
          ["HStack", "ZStack", "VStack"],
          1,
          "Les enfants d’une ZStack occupent des couches superposées.",
        ),
        link: appleDocs + "swiftui/building-layouts-with-stack-views",
      }),
    ],
  },
  {
    id: "reagir-avec-state",
    title: "État local et interactions",
    description:
      "Connecte des actions à un état et anime la mise à jour de l’écran.",
    lessons: [
      lesson({
        id: "state-score-swiftui",
        title: "Faire réagir une vue avec @State",
        minutes: 19,
        summary:
          "Le score appartient à la vue du compteur. @State permet à SwiftUI de conserver cette valeur et de réévaluer l’affichage lorsqu’elle change.",
        sections: [
          section(
            "Un état et plusieurs lectures",
            "score commence à 0. Le texte lit cette valeur et les deux boutons appellent change(by:) avec un entier.",
            [
              "Utilise @State private pour un petit état que la vue possède, comme un score ou une saisie.",
              "Le symbole $ produit une liaison. Dans un TextField, text: $title relie la saisie à la variable title.",
              "Calcule l’affichage à partir de l’état. Évite une deuxième variable qui recopie le score sous forme de texte.",
            ],
          ),
        ],
        files: points.files,
        task: "Ajoute un bouton Remettre à zéro et vérifie que le texte central réagit.",
        takeaway:
          "Une modification de @State suffit pour actualiser les éléments qui lisent cette valeur.",
        quiz: quiz(
          "À quel endroit placer un score local que la vue doit observer ?",
          [
            "Dans un commentaire",
            "Dans le nom du simulateur",
            "Dans une propriété @State",
          ],
          2,
          "SwiftUI observe la valeur d’état et réévalue les vues qui en dépendent.",
        ),
        link: appleDocs + "swiftui/state",
      }),
      lesson({
        id: "actions-et-transition-compteur",
        title: "Organiser les boutons et animer le score",
        minutes: 20,
        summary:
          "Les boutons du compteur partagent une méthode. La transition numérique rend le changement de valeur plus facile à suivre.",
        sections: [
          section(
            "Relier une action au rendu",
            "La HStack regroupe Ajouter et Soustraire. withAnimation encadre le changement du score, puis contentTransition(.numericText()) définit l’effet du texte.",
            [
              "Le paramètre by décrit le signe de la modification. Une seule fonction applique la règle.",
              "L’environnement accessibilityReduceMotion indique quand limiter les mouvements.",
              "Les libellés d’accessibilité expliquent le sens des boutons +1 et −1.",
            ],
          ),
        ],
        files: points.files,
        task: "Ajoute deux points puis retire-en un. Active Réduire les animations et répète les mêmes actions.",
        takeaway:
          "Une transition anime le changement d’une valeur. Le score reste la source de l’affichage.",
        quiz: quiz(
          "Que fait withAnimation autour de score += amount ?",
          [
            "Il anime la mise à jour visuelle liée au score",
            "Il remet le score à zéro",
            "Il enregistre le score sur disque",
          ],
          0,
          "Le bloc transmet une animation au changement d’état et aux vues qui le représentent.",
        ),
        link: appleDocs + "swiftui/withanimation(_:_:)",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "listes-et-identifiants-ios",
    title: "List, modèles et identifiants",
    description:
      "Présente des données dynamiques et retrouve le bon élément après un changement.",
    lessons: [
      lesson({
        id: "modeles-identifiables-swift",
        title: "Identifier les éléments d’une List",
        minutes: 20,
        summary:
          "Une List affiche les lignes d’une collection. Identifiable fournit un id stable à chaque élément, même quand son libellé ressemble à celui d’un autre.",
        sections: [
          section(
            "Modéliser une tâche",
            "TodoTask contient un UUID, un titre et un état de progression. La vue s’appuie sur ForEach pour créer une ligne par tâche.",
            [
              "Crée l’UUID une seule fois à la création du modèle. L’identifiant sert à suivre cet objet à travers les mises à jour.",
              "Deux tâches peuvent avoir le même titre. Leurs UUID les distinguent.",
              "La suppression reçoit des index de la collection affichée. Parcours-les à l’envers pour garder les index valides.",
            ],
          ),
        ],
        files: projectExample(todo, `${swiftPath}/TodoTask.swift`),
        task: "Ajoute deux tâches de même titre, puis termine l’une d’elles. Vérifie qu’une seule ligne change.",
        takeaway:
          "Un identifiant stable permet de relier un changement à la bonne ligne.",
        quiz: quiz(
          "Pourquoi choisir un UUID par tâche ?",
          [
            "Pour trier toujours par titre",
            "Pour définir la couleur de la ligne",
            "Pour identifier la même tâche après une mise à jour",
          ],
          2,
          "SwiftUI et le ViewModel peuvent suivre cet élément grâce à son identifiant.",
        ),
        link: appleDocs + "swift/identifiable",
      }),
      lesson({
        id: "construire-list-swiftui",
        title: "Construire et modifier une liste SwiftUI",
        minutes: 21,
        summary:
          "List réunit des sections, des champs et des lignes répétées. L’ajout et la suppression modifient le tableau qui alimente la vue.",
        sections: [
          section(
            "Assembler le formulaire et les lignes",
            "La première section du gestionnaire contient un champ de titre. La deuxième crée ses lignes à partir de model.tasks.",
            [
              "ForEach instancie chaque ligne selon le modèle. Section donne du contexte au formulaire et à la liste.",
              "onDelete reçoit les positions supprimées. EditButton active le mode d’édition de la liste.",
              "Affiche un message lorsque la collection est vide. Teste les saisies composées seulement d’espaces.",
            ],
          ),
        ],
        files: todo.files,
        task: "Crée une tâche, active le mode d’édition et supprime-la. Vérifie qu’une autre tâche reste visible.",
        takeaway:
          "L’interface suit le tableau observé et lui transmet les actions utilisateur.",
        quiz: quiz(
          "Quel modificateur relie un geste de suppression à une action ?",
          ["onDelete", "padding", "navigationTitle"],
          0,
          "onDelete transmet les index des lignes sélectionnées.",
        ),
        link: appleDocs + "swiftui/list",
      }),
    ],
  },
  {
    id: "etat-et-mvvm-swiftui",
    title: "MVVM et données observables",
    description:
      "Garde la logique dans un ViewModel et l’affichage dans la vue.",
    lessons: [
      lesson({
        id: "stateobject-published-swiftui",
        title: "Créer et observer un ViewModel",
        minutes: 22,
        summary:
          "Le ViewModel expose les données que la vue affiche et les méthodes qu’elle appelle. @Published rend les modifications observables.",
        sections: [
          section(
            "Répartir les responsabilités",
            "TodoViewModel adopte ObservableObject. La liste crée son instance avec @StateObject. Le détail reçoit cette même instance avec @ObservedObject.",
            [
              "Le modèle TodoTask décrit la donnée. Le ViewModel gère les opérations d’ajout et de modification.",
              "private(set) permet de lire tasks depuis l’interface. Les changements passent par les méthodes du ViewModel.",
              "@MainActor place les modifications qui pilotent l’interface sur l’acteur principal.",
            ],
          ),
        ],
        files: projectExample(todo, `${swiftPath}/TodoViewModel.swift`),
        task: "Repère qui crée le ViewModel et qui le reçoit. Ajoute une méthode qui remet une tâche à faire.",
        takeaway:
          "La vue propriétaire crée le ViewModel. Les autres vues observent l’instance transmise.",
        quiz: quiz(
          "Quel attribut utilise la vue qui crée son ViewModel ?",
          ["@Query", "@StateObject", "@Model"],
          1,
          "@StateObject conserve l’instance observable pendant la vie de la vue propriétaire.",
        ),
        link: appleDocs + "swiftui/stateobject",
      }),
      lesson({
        id: "total-calcule-swift",
        title: "Calculer un total à partir de la liste",
        minutes: 20,
        summary:
          "Une propriété calculée peut dériver un résultat des données existantes. Le total des dépenses s’obtient en additionnant les montants de la collection.",
        sections: [
          section(
            "Valider, ajouter et recalculer",
            "ExpenseBook refuse un libellé vide et un montant hors de la plage de l’atelier. expenses est la liste publiée et total la calcule avec reduce.",
            [
              "Le formulaire conserve le texte saisi avec @State et convertit le montant en Int.",
              "Ici, les montants sont des entiers en ariary. Une valeur valide est ajoutée au tableau avec son libellé.",
              "Après une suppression, total repart du tableau mis à jour et affiche directement le nouveau résultat.",
            ],
          ),
        ],
        files: projectExample(expenses, `${swiftPath}/ExpenseBook.swift`),
        task: "Ajoute 1 200 Ar et 800 Ar. Retire la première ligne puis vérifie que le total vaut 800 Ar.",
        takeaway:
          "Une valeur dérivée de la liste reste cohérente avec son contenu.",
        quiz: quiz(
          "D’où provient le total affiché ?",
          [
            "D’une constante",
            "Du texte du dernier champ",
            "De la somme des montants du tableau",
          ],
          2,
          "La propriété calculée additionne les éléments présents dans expenses.",
        ),
        link: swiftBook + "properties/",
      }),
    ],
  },
  {
    id: "navigation-et-details-ios",
    title: "Navigation iOS et détails partagés",
    description:
      "Passe d’une liste à son détail et préserve la cohérence entre les écrans.",
    lessons: [
      lesson({
        id: "navigationstack-et-liens-ios",
        title: "Ouvrir un détail avec NavigationStack",
        minutes: 22,
        summary:
          "NavigationStack gère la pile d’écrans. Un NavigationLink peut transmettre une valeur, puis une destination choisit la vue qui correspond à son type.",
        sections: [
          section(
            "Transmettre l’identifiant de la tâche",
            "NavigationLink(value: task.id) ajoute l’identifiant au parcours. navigationDestination(for: UUID.self) construit TaskDetail avec cet identifiant.",
            [
              "navigationTitle définit le titre de la barre de navigation.",
              "Le système fournit l’action Retour lorsque le détail est ouvert dans la pile.",
              "Utilise le type de valeur attendu par navigationDestination et garde la destination en dehors du contenu recyclé de List.",
            ],
          ),
        ],
        files: todo.files,
        task: "Ouvre successivement deux tâches. Vérifie que chaque titre correspond à la ligne d’origine puis reviens à la liste.",
        takeaway:
          "Le lien transmet une valeur. La destination décide comment l’afficher.",
        quiz: quiz(
          "Quelle valeur la liste envoie-t-elle à la destination ?",
          [
            "L’UUID de la tâche",
            "Le contenu du fichier Swift entier",
            "Le nombre de sections",
          ],
          0,
          "L’identifiant permet au détail de retrouver la tâche courante.",
        ),
        link: appleDocs + "swiftui/navigationstack",
      }),
      lesson({
        id: "detail-observe-meme-etat",
        title: "Modifier une tâche depuis son détail",
        minutes: 21,
        summary:
          "Le détail lit l’état actuel de la tâche dans le ViewModel partagé. Un appui change la donnée, puis les deux écrans observent la nouvelle valeur.",
        sections: [
          section(
            "Partager une source de vérité",
            "TaskDetail conserve l’UUID et observe le ViewModel reçu. Il appelle toggle(id) après une action.",
            [
              "Cherche la tâche par id plutôt que de garder la position de sa ligne.",
              "Prévois une vue de repli si la tâche n’est plus disponible.",
              "Après Retour, la liste utilise la même instance. Elle affiche donc l’état modifié dans le détail.",
            ],
          ),
        ],
        files: todo.files,
        task: "Termine une tâche depuis son détail, reviens à la liste et ouvre-la une nouvelle fois.",
        takeaway:
          "Les vues partagent un objet observable et transmettent leurs actions à ses méthodes.",
        quiz: quiz(
          "Pourquoi le détail reçoit-il le même ViewModel que la liste ?",
          [
            "Pour modifier la couleur d’arrière-plan",
            "Pour lire et modifier les mêmes tâches",
            "Pour relancer le simulateur",
          ],
          1,
          "Une instance commune permet de partager les changements entre les écrans.",
        ),
        link: appleDocs + "swiftui/observedobject",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "async-json-swift",
    title: "Appels asynchrones et décodage JSON",
    description:
      "Charge des données à distance et traite les différents résultats de la requête.",
    lessons: [
      lesson({
        id: "urlsession-async-await",
        title: "Télécharger des données avec URLSession",
        minutes: 23,
        summary:
          "URLSession récupère des données avec une fonction async. await suspend la tâche pendant l’attente, ce qui laisse le système exécuter d’autres tâches.",
        sections: [
          section(
            "Charger les trois cours spot",
            "QuoteClient.fetch prépare une URL HTTPS et attend data(from:). QuoteViewModel lance les requêtes BTC, ETH et SOL en parallèle avec async let.",
            [
              "Une fonction throws peut signaler un échec. do et catch permettent de décider de la réaction de l’interface.",
              "Vérifie le code de statut HTTP avant de décoder le résultat.",
              "Affiche une progression pendant le chargement. Une annulation liée à l’écran ne doit pas déclencher un message d’erreur inutile.",
            ],
          ),
        ],
        files: projectExample(crypto, `${swiftPath}/QuoteClient.swift`),
        task: "Ouvre l’écran avec une connexion active, puis coupe-la et tire la liste pour actualiser.",
        takeaway:
          "Une requête asynchrone sépare attente, réponse HTTP et mise à jour de l’écran.",
        quiz: quiz(
          "Quand appelle-t-on JSONDecoder ?",
          [
            "Avant de créer l’URL",
            "Après avoir reçu une réponse HTTP réussie",
            "Uniquement quand la connexion est coupée",
          ],
          1,
          "Le code HTTP doit indiquer un succès avant d’interpréter le corps comme des données.",
        ),
        link: appleDocs + "foundation/urlsession/data(from:delegate:)",
      }),
      lesson({
        id: "decoder-json-swift",
        title: "Transformer le JSON en données typées",
        minutes: 22,
        summary:
          "Decodable décrit la structure attendue du JSON. QuoteClient vérifie ensuite la devise et l’actif, puis convertit le montant textuel en Decimal.",
        sections: [
          section(
            "Lire la réponse de l’API",
            "Le modèle Envelope contient data. Value récupère amount, base et currency. Le modèle Quote représente le résultat affiché.",
            [
              "Si une clé attendue manque ou si son type est incorrect, JSONDecoder signale une erreur.",
              "Utilise la locale POSIX pour lire le montant renvoyé avec un point décimal. Formate ensuite la valeur pour l’affichage.",
              "L’écran indique l’heure du dernier relevé et garde ces valeurs visibles si la prochaine actualisation échoue.",
            ],
          ),
        ],
        files: projectExample(crypto, `${swiftPath}/QuoteClient.swift`),
        task: "Observe les champs data.amount et data.currency dans la réponse d’un actif. Vérifie le symbole de la devise affichée.",
        takeaway:
          "Le décodage reconstruit les données. Une validation métier vérifie qu’elles sont utilisables.",
        quiz: quiz(
          "Pourquoi vérifier data.currency ?",
          [
            "Pour savoir si le prix reçu correspond à l’USD affiché",
            "Pour choisir un mode de navigation",
            "Pour effacer le cache de Xcode",
          ],
          0,
          "La devise reçue doit être celle annoncée dans l’interface.",
        ),
        link: appleDocs + "foundation/jsondecoder",
      }),
    ],
  },
  {
    id: "persister-avec-swiftdata",
    title: "Stockage local avec SwiftData",
    description:
      "Enregistre des entrées de journal et relis-les après une relance.",
    lessons: [
      lesson({
        id: "model-et-container-swiftdata",
        title: "Définir un modèle SwiftData et son conteneur",
        minutes: 24,
        summary:
          "@Model déclare une classe que SwiftData peut gérer. Le journal définit un titre, un texte et une date de création.",
        sections: [
          section(
            "Relier le modèle à l’application",
            "Le point d’entrée appelle modelContainer(for: JournalEntry.self). Le conteneur fournit le stockage et met un contexte à disposition des vues.",
            [
              "L’initialiseur donne des valeurs à chaque nouvelle entrée. createdAt reçoit la date de création.",
              "Le conteneur utilisé ici enregistre sur l’appareil. Relance sur le même simulateur pour retrouver les données.",
              "Une modification de la structure d’un modèle déjà déployé peut nécessiter une migration.",
            ],
          ),
        ],
        files: projectExample(journal, `${swiftPath}/JournalEntry.swift`),
        task: "Repère les trois propriétés enregistrées et ouvre DevAfricaApp.swift pour trouver le conteneur.",
        takeaway:
          "Le modèle décrit les données. Le conteneur gère leur stockage.",
        quiz: quiz(
          "Quel attribut rend JournalEntry utilisable par SwiftData ?",
          ["@State", "@ObservedObject", "@Model"],
          2,
          "La macro @Model adapte la classe au stockage SwiftData.",
        ),
        link:
          appleDocs +
          "swiftdata/preserving-your-apps-model-data-across-launches",
      }),
      lesson({
        id: "query-et-contexte-swiftdata",
        title: "Lire, enregistrer et retirer des entrées",
        minutes: 24,
        summary:
          "@Query alimente la liste avec les entrées du stockage. Le contexte prend en charge l’insertion et la suppression.",
        sections: [
          section(
            "Suivre la modification jusqu’au disque",
            "La requête trie sur createdAt avec order: .reverse. L’ajout appelle context.insert puis save. Le retrait appelle context.delete puis save.",
            [
              "Valide le titre et le texte avant insertion. Le formulaire est réinitialisé après une sauvegarde réussie.",
              "En cas d’erreur, rollback remet le contexte dans l’état enregistré et l’interface affiche une alerte.",
              "Teste la persistance en arrêtant puis relançant sur le même simulateur.",
            ],
          ),
        ],
        files: journal.files,
        task: "Crée deux entrées, ferme puis rouvre l’app. Supprime la plus ancienne et vérifie le résultat après une nouvelle relance.",
        takeaway:
          "La requête lit les données. Le contexte enregistre les opérations de modification.",
        quiz: quiz(
          "Qu’est-ce qui ordonne les entrées par date ?",
          [
            "Le titre de la barre de navigation",
            "Le tri de @Query",
            "La taille du TextEditor",
          ],
          1,
          "La requête utilise createdAt comme clé de tri.",
        ),
        link: appleDocs + "swiftdata/query",
      }),
    ],
  },
  {
    id: "animations-et-recherche-ios",
    title: "Tri, recherche et animations",
    description:
      "Fais évoluer une liste de résultats tout en gardant son état lisible.",
    lessons: [
      lesson({
        id: "filtrer-et-trier-swiftui",
        title: "Dériver une liste filtrée sans perdre les données",
        minutes: 22,
        summary:
          "Le texte de recherche et l’ordre du tri sont des états d’interface. La collection filtrée est calculée à partir des cours chargés.",
        sections: [
          section(
            "Lier l’entrée à la vue",
            "searchable fournit le champ de recherche. shownQuotes compare la saisie au nom ou au symbole, puis applique le tri choisi.",
            [
              "Pour retrouver toutes les valeurs, efface le champ de recherche.",
              "Un prix est un Decimal. Les égalités sont départagées par symbole pour obtenir un ordre stable.",
              "Affiche un message si le filtre ne trouve rien. Le modèle garde la liste complète pour la prochaine recherche.",
            ],
          ),
        ],
        files: crypto.files,
        task: "Recherche « ETH », efface la recherche puis active le tri par prix. Observe l’ordre des lignes.",
        takeaway:
          "La recherche et le tri dérivent l’affichage à partir d’une collection intacte.",
        quiz: quiz(
          "Que modifie le filtre quand on saisit ETH ?",
          [
            "La liste affichée par la vue",
            "Les cotations sur le serveur",
            "Le schéma Xcode",
          ],
          0,
          "Le filtre choisit les valeurs visibles à partir des cotations déjà chargées.",
        ),
        link: appleDocs + "swiftui/search",
      }),
      lesson({
        id: "withanimation-et-liste-ios",
        title: "Animer un changement d’état",
        minutes: 22,
        summary:
          "Une animation rend l’insertion, le déplacement ou le retrait d’une ligne plus facile à suivre. SwiftUI repère les lignes par leur identifiant.",
        sections: [
          section(
            "Déclencher une transition lisible",
            "withAnimation entoure le changement d’ordre. animation(_:value:) observe les identifiants visibles pour accompagner la mise à jour du filtre.",
            [
              "Garde un identifiant stable par actif pour que SwiftUI suive sa ligne après le tri.",
              "Observe une valeur précise. Cela limite les animations aux changements voulus.",
              "Quand Réduire les animations est activé, passe nil comme animation pour respecter la préférence.",
            ],
          ),
        ],
        files: crypto.files,
        task: "Teste le tri et la recherche, puis compare le mouvement avec Réduire les animations activé.",
        takeaway:
          "L’animation accompagne l’état et les identifiants conservent le lien avec les lignes.",
        quiz: quiz(
          "Quelle valeur observe animation(_:value:) dans cet atelier ?",
          [
            "Le numéro de version du simulateur",
            "La couleur du bouton",
            "Les identifiants des lignes visibles",
          ],
          2,
          "Le modificateur anime la transition lorsque l’ordre ou le contenu visible change.",
        ),
        link: appleDocs + "swiftui/animations",
      }),
    ],
  },
];

export const swiftLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Swift et écrans déclaratifs",
    objective:
      "Utilise les types et les optionnels de Swift, puis construis tes premiers écrans avec des piles et un état local.",
    definition:
      "Swift est le langage utilisé ici pour décrire les données et la logique. SwiftUI est la boîte à outils qui décrit l’interface avec des vues Swift. Xcode compile et lance les projets iOS sur Mac.",
    color: levelColors[0],
    prerequisites:
      "Prépare Xcode sur un Mac pour lancer les projets iOS. Le script Swift de syntaxe peut aussi être exécuté sur Windows ou Linux.",
    outcomes: [
      "Déclarer des valeurs avec let et var, et manipuler des structures et des optionnels.",
      "Ouvrir un projet dans Xcode et choisir un simulateur.",
      "Assembler Text, Image et Button avec des piles et des modificateurs.",
      "Mettre une vue à jour grâce à @State.",
    ],
    chapters: beginner,
    projects: swiftBeginnerProjects,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Listes, MVVM et navigation",
    objective:
      "Affiche des collections, sépare les règles de la vue et relie une liste à ses écrans de détail.",
    color: levelColors[1],
    prerequisites:
      "Savoir écrire une vue SwiftUI et modifier une valeur d’état depuis un bouton.",
    outcomes: [
      "Associer un identifiant stable aux lignes d’une List.",
      "Utiliser un ViewModel observable avec @Published, @StateObject et @ObservedObject.",
      "Calculer un total à partir des données et organiser la navigation avec NavigationStack.",
    ],
    chapters: intermediate,
    projects: swiftIntermediateProjects,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Réseau, SwiftData et animations",
    objective:
      "Connecte une app à une API, enregistre des données sur l’appareil et anime des changements d’état.",
    color: levelColors[2],
    prerequisites:
      "Savoir afficher une liste et partager un ViewModel entre plusieurs vues.",
    outcomes: [
      "Récupérer une réponse HTTP avec async/await et la décoder.",
      "Gérer le chargement, l’échec et les dernières valeurs reçues.",
      "Créer une persistance SwiftData avec @Model, @Query et ModelContext.",
      "Animer un filtre, un tri et une transition en respectant la préférence de mouvement.",
    ],
    chapters: advanced,
    projects: swiftAdvancedProjects,
  },
];
