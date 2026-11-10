import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { composePath } from "./composeAuthoring";
import {
  composeBeginnerProjects,
  composeIntermediateProjects,
} from "./composeProjects";
import { composeAdvancedProjects } from "./composeAdvancedProjects";
import type { WebLevel } from "./webCourseTypes";

const [profile, login] = composeBeginnerProjects;
const [score, feed] = composeIntermediateProjects;
const [shop, tasks] = composeAdvancedProjects;
const docs = "https://developer.android.com/develop/ui/compose/";

const beginner: WebLevel["chapters"] = [
  {
    id: "compose-environnement",
    title: "Environnement et premiers composants",
    description: "Ouvre un projet Android et affiche tes premiers éléments.",
    lessons: [
      lesson({
        id: "android-studio-activite",
        title: "Ouvrir un projet Compose dans Android Studio",
        minutes: 20,
        summary:
          "Android Studio prépare et lance les applications Android. Dans ce projet, MainActivity hérite de ComponentActivity et appelle setContent pour afficher l’écran Compose.",
        sections: [
          section(
            "Synchroniser puis lancer",
            "Exporte le ZIP et ouvre le dossier qui contient settings.gradle.kts. Dans SDK Manager, installe le SDK 35 et les outils indiqués dans le README.",
            [
              "Pour commencer un nouveau projet dans Android Studio, le modèle Empty Activity peut configurer Compose.",
              "Attends la synchronisation Gradle puis choisis un émulateur ou un appareil Android.",
              "MainActivity installe le thème avant d’appeler AtelierScreen.",
            ],
          ),
        ],
        files: projectExample(profile, `${composePath}/MainActivity.kt`),
        task: "Ouvre le projet de profil et lance-le. Dans MainActivity, repère l’appel à setContent.",
        takeaway:
          "L’activité est le point de départ Android. setContent installe le contenu Compose.",
        quiz: quiz(
          "Quel appel installe l’interface Compose de l’activité ?",
          ["setContent", "TextField", "emit"],
          0,
          "setContent reçoit le contenu composable à afficher.",
        ),
        link: docs + "setup-compose-dependencies-and-compiler",
      }),
      lesson({
        id: "composable-text-image-icon",
        title: "Décrire une interface avec @Composable",
        minutes: 18,
        summary:
          "Une fonction annotée @Composable décrit une partie de l’écran. Compose assemble ces fonctions pour afficher le résultat.",
        sections: [
          section(
            "Lire une carte de profil",
            "Text affiche le nom. Image affiche le portrait. Icon représente une action avec un pictogramme.",
            [
              "painterResource charge un drawable fourni avec le projet.",
              "Décris une image informative avec contentDescription. Pour une illustration purement décorative, null est possible.",
              "Une fonction composable peut appeler d’autres fonctions composables.",
            ],
          ),
        ],
        files: profile.files,
        task: "Change le nom et le métier dans AtelierScreen, puis relance l’application.",
        takeaway:
          "Le composable décrit ce qui doit apparaître pour les données reçues.",
        quiz: quiz(
          "Quelle annotation marque une fonction qui décrit l’interface ?",
          ["@Composable", "@Entity", "@Transactional"],
          0,
          "@Composable indique à Compose que la fonction participe à l’interface.",
        ),
        link: docs + "mental-model",
      }),
    ],
  },
  {
    id: "compose-layouts",
    title: "Structure, alignement et modificateurs",
    description: "Place les composants et règle l’espace de chaque écran.",
    lessons: [
      lesson({
        id: "column-row-box",
        title: "Aligner avec Column, Row et Box",
        minutes: 18,
        summary:
          "Column empile les enfants verticalement. Row les aligne horizontalement. Box peut superposer ses enfants et les aligner dans un espace.",
        sections: [
          section(
            "Assembler la carte",
            "Le profil centre une carte dans une Box. Une Column empile le portrait et les textes. Une Row place les icônes côte à côte.",
            [
              "Arrangement.spacedBy ajoute un espace régulier entre les enfants.",
              "Alignment.CenterHorizontally centre les enfants dans une Column.",
              "Compose combine des conteneurs pour construire une structure plus riche.",
            ],
          ),
        ],
        files: profile.files,
        task: "Remplace temporairement la Row des icônes par une Column et observe le changement.",
        takeaway:
          "Choisis un conteneur selon l’axe ou la superposition souhaitée.",
        quiz: quiz(
          "Quel conteneur aligne plusieurs icônes horizontalement ?",
          ["Row", "Column", "Text"],
          0,
          "Row place les enfants côte à côte.",
        ),
        link: docs + "layout/basics",
      }),
      lesson({
        id: "modifiers-compose",
        title: "Chaîner les Modifier",
        minutes: 19,
        summary:
          "Un Modifier change la mesure, l’apparence ou l’interaction d’un composant. L’ordre des appels modifie le résultat.",
        sections: [
          section(
            "Taille, marges et portrait arrondi",
            "fillMaxSize occupe l’espace disponible. padding réserve un espace. Le portrait utilise size, clip et border avec CircleShape.",
            [
              "Les dimensions dp s’adaptent à la densité de l’écran.",
              "background et border permettent de distinguer des surfaces.",
              "safeDrawingPadding laisse de la place aux barres et découpes système.",
            ],
          ),
        ],
        files: profile.files,
        task: "Change le padding de la carte et la taille de la bordure. Compare en portrait et en paysage.",
        takeaway: "Les modificateurs s’appliquent dans l’ordre écrit.",
        quiz: quiz(
          "Quel modificateur découpe l’image à la forme fournie ?",
          ["clip", "padding", "fillMaxSize"],
          0,
          "clip limite le rendu à la forme choisie.",
        ),
        link: docs + "modifiers",
      }),
    ],
  },
  {
    id: "compose-interactions",
    title: "Boutons et champs de saisie",
    description: "Réagis à une action et affiche un retour dans l’écran.",
    lessons: [
      lesson({
        id: "boutons-compose",
        title: "Relier un bouton à une action",
        minutes: 16,
        summary:
          "Button reçoit une fonction onClick. Quand une personne appuie, Compose appelle cette fonction.",
        sections: [
          section(
            "Donner un retour après l’action",
            "Dans le formulaire, le bouton vérifie la saisie puis change feedback. L’écran affiche ce message si sa valeur existe.",
            [
              "Le contenu du bouton donne son libellé.",
              "enabled peut empêcher une action dans un état précis.",
              "Pour une icône seule, fournis une description de l’action.",
            ],
          ),
        ],
        files: login.files,
        task: "Appuie sur Se connecter avec les champs vides, puis avec un e-mail et un mot de passe fictifs.",
        takeaway: "L’action change l’état et l’interface affiche le résultat.",
        quiz: quiz(
          "Quel paramètre reçoit l’action du bouton ?",
          ["onClick", "value", "title"],
          0,
          "onClick est la fonction invoquée au clic.",
        ),
        link: docs + "components/button",
      }),
      lesson({
        id: "champs-compose",
        title: "Lire un e-mail et masquer un mot de passe",
        minutes: 20,
        summary:
          "OutlinedTextField affiche value et appelle onValueChange lors d’une saisie. Tu peux adapter le clavier et masquer visuellement un champ de mot de passe.",
        sections: [
          section(
            "Organiser le formulaire de démonstration",
            "email et password sont deux valeurs suivies séparément. PasswordVisualTransformation masque la saisie.",
            [
              "KeyboardType.Email demande un clavier adapté à une adresse.",
              "Le composable du projet valide localement le format et la longueur.",
              "Le champ mot de passe utilise remember et est vidé après validation.",
            ],
          ),
        ],
        files: login.files,
        task: "Ajoute un champ de confirmation dans une copie du projet et affiche un message si les deux valeurs diffèrent.",
        takeaway:
          "Chaque champ combine une valeur affichée et une action qui la met à jour.",
        quiz: quiz(
          "Quel paramètre transmet une nouvelle saisie ?",
          ["onValueChange", "contentDescription", "fontSize"],
          0,
          "onValueChange reçoit le texte modifié.",
        ),
        link: docs + "text/user-input",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "compose-etat",
    title: "État, recomposition et élévation",
    description: "Fais évoluer une interface à partir de données observables.",
    lessons: [
      lesson({
        id: "remember-recomposition",
        title: "Conserver un état et observer la recomposition",
        minutes: 19,
        summary:
          "Lorsqu’un état lu par un composable change, Compose peut recalculer les parties qui en dépendent. remember conserve une valeur pendant la présence du composable dans la composition.",
        sections: [
          section(
            "Relier un score à son affichage",
            "mutableIntStateOf crée un état observable pour un entier. Le bouton augmente le score et le texte est actualisé.",
            [
              "mutableStateOf convient à d’autres valeurs, comme un texte.",
              "Une variable Kotlin ordinaire ne déclenche pas la recomposition à elle seule.",
              "rememberSaveable permet de restaurer des valeurs compatibles après recréation de l’activité.",
            ],
          ),
        ],
        files: score.files,
        task: "Clique deux fois sur une équipe, puis tourne l’appareil. Observe le score après rotation.",
        takeaway: "L’état observable relie les événements et l’affichage.",
        quiz: quiz(
          "Quel type d’état l’écran de score utilise-t-il pour les entiers ?",
          ["mutableIntStateOf", "Une constante val seule", "Un fichier XML"],
          0,
          "mutableIntStateOf expose un entier observable par Compose.",
        ),
        link: docs + "state",
      }),
      lesson({
        id: "state-hoisting-compose",
        title: "Faire remonter l’état vers le parent",
        minutes: 22,
        summary:
          "Le state hoisting place une valeur dans le parent commun. Les enfants reçoivent les données nécessaires et signalent les actions à effectuer.",
        sections: [
          section(
            "Garder un composant réutilisable",
            "AtelierScreen possède les scores. ScoreCard reçoit score et onScore. La même carte sert pour les deux équipes.",
            [
              "La donnée descend du parent vers la carte.",
              "Le callback remonte l’action de la carte vers le parent.",
              "Un bouton du parent peut remettre tous les scores à zéro.",
            ],
          ),
        ],
        files: score.files,
        task: "Ajoute une troisième équipe en réutilisant ScoreCard. Choisis un conteneur qui laisse assez de place.",
        takeaway:
          "Le parent garde l’état partagé et les enfants expriment des événements.",
        quiz: quiz(
          "Qui possède les scores dans cet exemple ?",
          ["AtelierScreen", "Chaque bouton séparément", "Le thème Material"],
          0,
          "AtelierScreen contrôle les données transmises aux cartes.",
        ),
        link: docs + "state-hoisting",
      }),
    ],
  },
  {
    id: "compose-listes",
    title: "Listes paresseuses et cartes",
    description:
      "Affiche les articles visibles et propose des filtres horizontaux.",
    lessons: [
      lesson({
        id: "lazy-column-compose",
        title: "Afficher une liste avec LazyColumn",
        minutes: 20,
        summary:
          "LazyColumn compose les éléments nécessaires autour de la zone visible. Elle convient à une liste plus longue qu’un écran.",
        sections: [
          section(
            "Créer les cartes de l’actualité",
            "items parcourt les articles. Chaque identifiant stable aide Compose à retrouver le même article lorsque les données changent.",
            [
              "contentPadding règle l’espace autour du contenu de la liste.",
              "Card regroupe une image, un titre et une description.",
              "Une liste filtrée peut afficher un état vide.",
            ],
          ),
        ],
        files: feed.files,
        task: "Augmente le nombre d’articles fictifs puis vérifie leur défilement et le filtre.",
        takeaway:
          "Les listes paresseuses organisent la composition autour de la zone visible.",
        quiz: quiz(
          "Quel conteneur convient à une liste verticale d’articles ?",
          ["LazyColumn", "LazyRow", "Text"],
          0,
          "LazyColumn fait défiler les éléments dans l’axe vertical.",
        ),
        link: docs + "lists",
      }),
      lesson({
        id: "lazy-row-filtres",
        title: "Filtrer la liste avec LazyRow",
        minutes: 18,
        summary:
          "LazyRow fait défiler des éléments horizontalement. Dans le flux, chaque FilterChip change la catégorie et recalcule les articles affichés.",
        sections: [
          section(
            "Relier le filtre et la liste",
            "L’écran construit shown à partir du thème et de la vue Favoris. La clé de chaque carte reste l’identifiant de l’article.",
            [
              "FilterChip indique si une option est sélectionnée.",
              "Changer le filtre conserve l’identité des articles qui restent visibles.",
              "La liste revient en haut quand la sélection change.",
            ],
          ),
        ],
        files: feed.files,
        task: "Ajoute un thème aux catégories de test. Passe par plusieurs filtres et vérifie l’état vide.",
        takeaway: "Le filtre est un état. Le contenu visible en découle.",
        quiz: quiz(
          "Quelle structure défile à l’horizontale ?",
          ["LazyRow", "LazyColumn", "Scaffold"],
          0,
          "LazyRow compose une rangée déroulante.",
        ),
        link: docs + "lists#lazy",
      }),
    ],
  },
  {
    id: "compose-material3",
    title: "Structure d’écran Material 3",
    description: "Organise la barre de titre, le contenu et les actions.",
    lessons: [
      lesson({
        id: "scaffold-compose",
        title: "Placer la page dans un Scaffold",
        minutes: 20,
        summary:
          "Scaffold fournit des emplacements pour la barre du haut, la navigation basse, le bouton flottant et le contenu principal.",
        sections: [
          section(
            "Appliquer le padding reçu",
            "La lambda de contenu reçoit un padding calculé. La liste applique cette valeur pour rester lisible entre les barres.",
            [
              "topBar accueille une TopAppBar avec le titre.",
              "bottomBar accueille une NavigationBar.",
              "Le contenu utilise Modifier.padding(padding) et peut consommer ces insets pour éviter de les appliquer deux fois.",
            ],
          ),
        ],
        files: feed.files,
        task: "Repère padding dans la lambda de Scaffold. Modifie le titre de la TopAppBar.",
        takeaway:
          "Le Scaffold donne une structure et transmet les espaces à respecter au contenu.",
        quiz: quiz(
          "Que doit appliquer la liste pour laisser la place aux barres ?",
          [
            "Le padding fourni par Scaffold",
            "Un nouvel identifiant de route",
            "Un mot de passe",
          ],
          0,
          "Le padding de contenu tient compte des zones réservées.",
        ),
        link: docs + "components/scaffold",
      }),
      lesson({
        id: "navigation-et-fab",
        title: "Relier navigation basse et action flottante",
        minutes: 20,
        summary:
          "La NavigationBar choisit entre Actualités et Favoris. Le FloatingActionButton ramène la liste en haut en utilisant son état de défilement.",
        sections: [
          section(
            "Associer les actions aux états",
            "Chaque NavigationBarItem reçoit selected et onClick. Le bouton flottant lance animateScrollToItem dans une coroutine liée à la composition.",
            [
              "Une action flottante doit rester facile à identifier.",
              "Les deux vues partagent l’état des articles enregistrés.",
              "Le projet ajoute du padding en bas de la liste pour que la dernière carte reste accessible.",
            ],
          ),
        ],
        files: feed.files,
        task: "Enregistre un article, ouvre Favoris puis utilise le bouton pour revenir en haut.",
        takeaway:
          "Les actions modifient une sélection ou pilotent l’état de défilement.",
        quiz: quiz(
          "Quel composant du Scaffold héberge l’action de retour en haut ?",
          ["FloatingActionButton", "TextField", "Row"],
          0,
          "Le bouton flottant appelle l’animation de défilement.",
        ),
        link: docs + "components/fab",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "compose-navigation",
    title: "Navigation entre écrans",
    description: "Déclare des destinations et transmets un identifiant.",
    lessons: [
      lesson({
        id: "navhost-compose",
        title: "Relier le catalogue, le détail et le panier",
        minutes: 23,
        summary:
          "NavHost affiche la destination active. NavController gère la navigation et sa pile. Le catalogue est la destination de départ de la boutique.",
        sections: [
          section(
            "Définir un petit graphe",
            "rememberNavController crée le contrôleur utilisé par le NavHost. Chaque composable du graphe associe une route à un écran.",
            [
              "navigate ajoute une destination. popBackStack revient à la précédente quand elle existe.",
              "launchSingleTop évite de doubler une destination déjà au sommet.",
              "Le catalogue affiche les produits avec LazyVerticalGrid et GridCells.Adaptive.",
            ],
          ),
        ],
        files: shop.files,
        task: "Ouvre un produit, accède au panier et reviens en arrière. Repère les trois routes.",
        takeaway:
          "Le graphe décrit les destinations. Le contrôleur choisit laquelle afficher.",
        quiz: quiz(
          "Quel composant affiche la destination active ?",
          ["NavHost", "TextField", "MaterialTheme"],
          0,
          "NavHost utilise le contrôleur pour afficher la destination du graphe.",
        ),
        link: "https://developer.android.com/guide/navigation",
      }),
      lesson({
        id: "arguments-compose",
        title: "Passer un identifiant à une route",
        minutes: 22,
        summary:
          "La route produit/{id} attend un entier. L’écran lit cet identifiant puis charge le produit correspondant depuis le modèle.",
        sections: [
          section(
            "Passer la donnée minimale",
            "navigate('produit/2') ouvre le détail du produit 2. NavType.IntType décrit le type de l’argument.",
            [
              "Un identifiant permet de retrouver les données dans leur source.",
              "Prévois un état de repli si le produit n’existe plus.",
              "Passe un callback de navigation au composant de catalogue pour qu’il reste réutilisable.",
            ],
          ),
        ],
        files: shop.files,
        task: "Ouvre deux produits différents. Ajoute un produit au modèle et vérifie que le détail utilise son nouvel identifiant.",
        takeaway:
          "La route transporte un identifiant. Le modèle porte les détails.",
        quiz: quiz(
          "Que transmet le catalogue dans la route de détail ?",
          [
            "L’identifiant du produit",
            "Une copie du panier",
            "Une image entière",
          ],
          0,
          "L’écran utilise l’identifiant pour retrouver le produit.",
        ),
        link: "https://developer.android.com/guide/navigation/use-graph/pass-data",
      }),
    ],
  },
  {
    id: "compose-mvvm",
    title: "ViewModel et StateFlow",
    description: "Sépare la logique du panier de la représentation à l’écran.",
    lessons: [
      lesson({
        id: "viewmodel-compose",
        title: "Confier le panier à un ViewModel",
        minutes: 24,
        summary:
          "Le ViewModel expose les données et les actions de l’écran. Il conserve l’état de la boutique pendant les changements d’écran et la recréation liée à l’orientation.",
        sections: [
          section(
            "Séparer état interne et lecture",
            "StoreViewModel garde _panier mutable. Il publie un StateFlow en lecture seule et propose ajouter et retirer.",
            [
              "update produit une nouvelle map à partir de l’ancienne.",
              "Le composant de détail envoie l’action au ViewModel.",
              "L’atelier instancie le ViewModel au-dessus du NavHost pour partager le panier entre les destinations.",
            ],
          ),
        ],
        files: projectExample(shop, `${composePath}/StoreViewModel.kt`),
        task: "Ajoute deux unités d’un produit puis retire-en une dans le panier. Repère les deux méthodes appelées.",
        takeaway:
          "Le ViewModel porte la logique et expose l’état que l’interface observe.",
        quiz: quiz(
          "Quelle classe porte les opérations sur le panier ?",
          ["StoreViewModel", "MainActivity", "NavHost"],
          0,
          "Le ViewModel fournit ajouter et retirer.",
        ),
        link: "https://developer.android.com/topic/libraries/architecture/viewmodel",
      }),
      lesson({
        id: "collect-etat-compose",
        title: "Observer un StateFlow selon le cycle de vie",
        minutes: 23,
        summary:
          "collectAsStateWithLifecycle adapte le StateFlow à l’état Compose et suit le cycle de vie. Les composables lisent sa valeur pour actualiser l’affichage.",
        sections: [
          section(
            "Suivre la donnée et les actions",
            "Le ViewModel émet le panier. AtelierScreen le collecte. Le nombre d’articles et les détails sont recalculés à partir de cette valeur.",
            [
              "L’état descend vers les écrans. Les actions remontent au ViewModel.",
              "Un StateFlow possède une valeur courante.",
              "Pour conserver des données après la fermeture complète de l’application, un projet peut ajouter une persistance.",
            ],
          ),
        ],
        files: shop.files,
        task: "Passe de Détails à Panier puis reviens. Vérifie le compteur dans la barre de titre.",
        takeaway: "L’écran observe une source d’état et déduit son affichage.",
        quiz: quiz(
          "Quel appel collecte le panier dans le composable ?",
          ["collectAsStateWithLifecycle()", "navigate()", "padding()"],
          0,
          "Il fournit un état Compose à partir du StateFlow.",
        ),
        link: docs + "state#other-supported-types-of-state",
      }),
    ],
  },
  {
    id: "compose-animations",
    title: "Transitions et micro-interactions",
    description: "Anime l’ajout, la couleur et le retrait d’une tâche.",
    lessons: [
      lesson({
        id: "animated-visibility-compose",
        title: "Animer une apparition et un retrait",
        minutes: 24,
        summary:
          "AnimatedVisibility joue une transition d’entrée ou de sortie selon la visibilité. Le projet conserve la tâche le temps de terminer sa sortie.",
        sections: [
          section(
            "Observer la fin d’une transition",
            "MutableTransitionState suit la valeur actuelle et la cible. Quand la sortie est terminée, le ViewModel retire l’élément de la collection.",
            [
              "fadeIn et fadeOut changent l’opacité.",
              "expandVertically et shrinkVertically animent l’espace occupé.",
              "key(tache.id) garde l’identité de l’animation quand la liste change.",
            ],
          ),
        ],
        files: tasks.files,
        task: "Ajoute puis retire une tâche. Allonge la durée de sortie pour observer quand la ligne disparaît.",
        takeaway: "Un élément reste composé pendant sa transition de sortie.",
        quiz: quiz(
          "Quand le projet retire-t-il définitivement une tâche de la liste ?",
          [
            "À la fin de la transition de sortie",
            "Au démarrage de l’activité",
            "Au premier clic sur la case",
          ],
          0,
          "La ligne reste disponible pour terminer son animation.",
        ),
        link: docs + "animation/composables-modifiers#animatedvisibility",
      }),
      lesson({
        id: "animate-couleur-compose",
        title: "Faire évoluer une couleur avec animateColorAsState",
        minutes: 21,
        summary:
          "animateColorAsState expose une couleur qui évolue vers sa cible. Dans le projet, la cible dépend du statut terminé de la tâche.",
        sections: [
          section(
            "Relier l’animation au changement d’état",
            "La case modifie terminee. Le fond change progressivement vers une couleur du thème.",
            [
              "tween fixe une durée d’interpolation.",
              "Une micro-interaction peut rendre une mise à jour plus perceptible.",
              "La case reste l’indicateur principal du statut et accompagne la couleur.",
            ],
          ),
        ],
        files: tasks.files,
        task: "Coche et décoche la tâche. Ajuste la durée et compare le résultat.",
        takeaway:
          "La couleur cible vient de l’état. Compose calcule les valeurs intermédiaires.",
        quiz: quiz(
          "Quelle valeur change la cible de la couleur ?",
          ["terminee", "Le nom de l’activité", "L’URI d’une base"],
          0,
          "Le fond dépend du statut de la tâche.",
        ),
        link: docs + "animation/value-based#animateasstate",
      }),
    ],
  },
];

export const composeLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Interface déclarative et positionnement",
    definition:
      "Jetpack Compose est une boîte à outils Android pour construire l’interface. Tu écris des fonctions Kotlin qui décrivent ce que l’écran affiche pour les données et l’état du moment. Compose actualise les parties qui en dépendent lorsque cet état change.",
    objective:
      "Lance un projet Android et compose un écran de profil et un formulaire.",
    color: levelColors[0],
    prerequisites:
      "Suis d’abord le niveau débutant du cours Kotlin. Installe Android Studio et prépare un appareil ou un émulateur.",
    outcomes: [
      "Ouvrir un projet Compose et reconnaître ComponentActivity.",
      "Écrire des fonctions @Composable avec Text, Image et Icon.",
      "Organiser Row, Column et Box avec Modifier.",
      "Relier des boutons et des champs à des actions.",
    ],
    chapters: beginner,
    projects: composeBeginnerProjects,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "État, recomposition et listes",
    objective:
      "Fais réagir les écrans et présente une collection d’articles dans un Scaffold.",
    color: levelColors[1],
    prerequisites:
      "Pour démarrer, sache assembler des composants et utiliser leurs modificateurs.",
    outcomes: [
      "Utiliser remember et des états observables.",
      "Faire remonter un état partagé.",
      "Utiliser LazyColumn et LazyRow avec des clés stables.",
      "Assembler une page Material 3 avec Scaffold.",
    ],
    chapters: intermediate,
    projects: composeIntermediateProjects,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Navigation, MVVM et animations",
    objective:
      "Relie plusieurs écrans, observe un ViewModel et anime les changements visibles.",
    color: levelColors[2],
    prerequisites:
      "Pour démarrer, pratique l’état Compose et les bases de Flow en Kotlin.",
    outcomes: [
      "Définir un graphe de navigation et passer un argument.",
      "Observer un StateFlow depuis Compose.",
      "Séparer actions, état et affichage.",
      "Animer la visibilité et la couleur.",
    ],
    chapters: advanced,
    projects: composeAdvancedProjects,
  },
];
