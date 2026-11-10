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
const [movies, weather] = flutterAdvancedProjects;
const docs = "https://docs.flutter.dev/";

const beginner: WebLevel["chapters"] = [
  {
    id: "flutter-et-dart",
    title: "Installation et premiers types Dart",
    description: "Prépare un appareil et écris un petit programme Dart.",
    lessons: [
      lesson({
        id: "sdk-flutter-et-appareil",
        title: "Installer Flutter et choisir une cible",
        minutes: 20,
        summary:
          "Le SDK Flutter fournit la commande flutter et le compilateur Dart. Configure un émulateur Android ou un téléphone puis vérifie la connexion.",
        sections: [
          section(
            "Passer du ZIP au premier écran",
            "Extrais l’atelier et ouvre le dossier qui contient pubspec.yaml. Suis le guide pour créer les dossiers Android et iOS puis lancer la carte.",
            [
              "flutter doctor aide à repérer un outil manquant. flutter devices liste les appareils disponibles.",
              "Le SDK Android est utile pour l’émulateur. Pour démarrer un simulateur iOS, utilise Xcode sur Mac.",
              "main est le point de départ. runApp installe le widget racine.",
            ],
          ),
        ],
        files: projectExample(profile, "pubspec.yaml"),
        task: "Ouvre le projet dans ton éditeur et repère la déclaration de l’avatar. Démarre la carte sur l’appareil choisi.",
        takeaway:
          "pubspec.yaml décrit le projet, ses dépendances et ses fichiers d’interface.",
        quiz: quiz(
          "Quelle commande liste les appareils détectés ?",
          ["flutter devices", "dart format", "flutter pub get"],
          0,
          "flutter devices indique les cibles utilisables par flutter run.",
        ),
        link: docs + "install",
      }),
      lesson({
        id: "dart-types-et-constructeurs",
        title: "Types, null safety et constructeurs nommés",
        minutes: 22,
        summary:
          "Dart distingue les types qui peuvent contenir null. Le script Profil utilise un nom requis et une adresse facultative.",
        sections: [
          section(
            "Créer un profil et lire son contact",
            "var déduit un type et permet la réaffectation. final fige la référence après initialisation. const sert à une valeur constante déterminée à la compilation.",
            [
              "Le constructeur Profil prend des paramètres nommés. Profil.invite est un deuxième constructeur avec un nom explicite.",
              "String? autorise null. L’appel ?.trim() s’applique seulement quand l’adresse existe.",
              "La fonction contact renvoie une chaîne non nulle grâce au texte de repli.",
            ],
          ),
        ],
        files: projectExample(profile, dartBasics),
        task: "Lance dart run bin/bases.dart, puis ajoute une adresse à un nouveau profil et affiche-la.",
        takeaway:
          "Un type suivi de ? invite à traiter le cas d’une valeur absente.",
        quiz: quiz(
          "Quel type convient à un courriel facultatif ?",
          ["bool", "String", "String?"],
          2,
          "String? représente une chaîne qui peut aussi être null.",
        ),
        link: "https://dart.dev/language/constructors",
      }),
    ],
  },
  {
    id: "widgets-et-disposition-flutter",
    title: "Widgets et disposition",
    description:
      "Assemble les composants d’une carte et adapte leur emplacement.",
    lessons: [
      lesson({
        id: "statelesswidget-carte",
        title: "Décrire un écran avec StatelessWidget",
        minutes: 20,
        summary:
          "La carte décrit son rendu dans build. Un StatelessWidget peut recevoir des paramètres et être reconstruit quand ses entrées changent.",
        sections: [
          section(
            "Assembler des widgets simples",
            "La carte contient Text, Icon et CircleAvatar. AssetImage charge le portrait déclaré dans pubspec.yaml.",
            [
              "Scaffold fournit une structure Material. Card groupe les coordonnées.",
              "Un widget Stateless peut réagir à un appui. Ici le bouton copie une adresse fixe et affiche un retour sans changer un état propre à la carte.",
              "Après une opération asynchrone, vérifie que context est toujours monté avant d’afficher le message.",
            ],
          ),
        ],
        files: profile.files,
        task: "Change le nom, le courriel et l’icône. Appuie sur Copier le courriel et vérifie le message.",
        takeaway:
          "Un widget peut décrire une vue interactive sans conserver de donnée mutable.",
        quiz: quiz(
          "Quel widget utilise la carte pour afficher son portrait ?",
          ["TextField", "CircleAvatar", "Navigator"],
          1,
          "CircleAvatar présente l’image dans une forme circulaire.",
        ),
        link: docs + "ui/widgets-intro",
      }),
      lesson({
        id: "row-column-stack-flutter",
        title: "Aligner et superposer les widgets",
        minutes: 20,
        summary:
          "Column empile les widgets, Row les aligne horizontalement et Stack permet de superposer une icône sur une image.",
        sections: [
          section(
            "Garder une carte lisible",
            "Padding crée une marge intérieure. SizedBox réserve un espace et Spacer répartit l’espace restant dans un Row ou Column de taille bornée.",
            [
              "La carte utilise ConstrainedBox pour limiter sa largeur sur un grand écran.",
              "ScrollView donne un accès au contenu quand la hauteur disponible diminue.",
              "Wrap permet aux boutons de changer de ligne quand leur largeur totale dépasse l’espace.",
            ],
          ),
        ],
        files: profile.files,
        task: "Place deux petites icônes dans un Row et vérifie le résultat sur un écran étroit.",
        takeaway:
          "Choisis le conteneur selon l’axe et les contraintes de place.",
        quiz: quiz(
          "Quel widget superpose l’icône et l’avatar ?",
          ["Stack", "Column", "Padding"],
          0,
          "Stack place ses enfants dans plusieurs couches.",
        ),
        link: docs + "ui/layout",
      }),
    ],
  },
  {
    id: "etat-local-flutter",
    title: "État local et interactions",
    description: "Affiche une valeur qui suit chaque clic.",
    lessons: [
      lesson({
        id: "statefulwidget-compteur",
        title: "Séparer un StatefulWidget et son State",
        minutes: 19,
        summary:
          "CounterPage représente la configuration de l’écran. L’objet State conserve count pendant que Flutter reconstruit ses widgets.",
        sections: [
          section(
            "Repérer la valeur qui change",
            "createState crée la partie mutable. build lit la valeur actuelle du compteur pour afficher son texte.",
            [
              "Le compteur commence à zéro et les boutons lui passent une variation.",
              "Garde l’état dans le widget qui en est propriétaire. La valeur doit servir directement à l’affichage.",
              "Quand tu quittes définitivement cet écran, son State peut être détruit.",
            ],
          ),
        ],
        files: counter.files,
        task: "Trouve le champ count, sa valeur initiale et les deux appels qui le modifient.",
        takeaway: "L’objet State porte les données locales qui évoluent.",
        quiz: quiz(
          "Où le compteur conserve-t-il count ?",
          [
            "Dans pubspec.yaml",
            "Dans ThemeData",
            "Dans l’objet State de l’écran",
          ],
          2,
          "L’objet State vit pendant que l’écran est présent.",
        ),
        link: "https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html",
      }),
      lesson({
        id: "setstate-flutter",
        title: "Actualiser l’écran avec setState",
        minutes: 19,
        summary:
          "setState applique la modification puis demande à Flutter de recalculer le rendu de cet état.",
        sections: [
          section(
            "Relier l’appui au nombre affiché",
            "changeBy reçoit +1 ou −1. Le bloc setState contient la mise à jour de count. Son callback reste synchrone.",
            [
              "La vue lit count dans build. Évite de maintenir une autre variable avec une copie de son texte.",
              "Pour une requête, attends d’abord la réponse puis vérifie mounted avant setState.",
              "Teste plusieurs appuis de suite et vérifie l’ordre des changements.",
            ],
          ),
        ],
        files: counter.files,
        task: "Ajoute un bouton Remettre à zéro et confirme que l’écran revient à 0 après quelques clics.",
        takeaway:
          "setState informe Flutter du changement d’état dont dépend l’interface.",
        quiz: quiz(
          "Que doit contenir le callback de setState ?",
          [
            "Une longue requête HTTP avec await",
            "La modification synchrone de l’état",
            "Le lancement de l’émulateur",
          ],
          1,
          "Le changement est synchrone. Les opérations asynchrones se terminent avant l’appel.",
        ),
        link: "https://api.flutter.dev/flutter/widgets/State/setState.html",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "listes-material-flutter",
    title: "Listes et structure Material",
    description: "Affiche les lignes à la demande et place les actions utiles.",
    lessons: [
      lesson({
        id: "listview-builder-taches",
        title: "Construire des lignes avec ListView.builder",
        minutes: 21,
        summary:
          "ListView.builder crée les éléments à mesure qu’ils sont nécessaires. itemCount fixe la taille et itemBuilder décrit une ligne à partir de son index.",
        sections: [
          section(
            "Associer une ligne à une tâche",
            "La liste obtient ses données de TasksStore. Chaque case reçoit l’identifiant de la tâche et son état done.",
            [
              "Utilise ValueKey(task.id) pour garder une identité stable lorsque la liste évolue.",
              "L’index désigne la position courante. L’identifiant distingue deux tâches même si elles ont le même titre.",
            ],
          ),
        ],
        files: todo.files,
        task: "Ajoute plusieurs tâches, fais défiler la liste et coche la bonne ligne.",
        takeaway:
          "La construction paresseuse évite de créer toutes les lignes dès l’ouverture.",
        quiz: quiz(
          "Quel argument construit une ligne à partir d’un index ?",
          ["itemBuilder", "onPressed", "appBar"],
          0,
          "Flutter appelle itemBuilder quand une ligne doit être créée.",
        ),
        link: docs + "cookbook/lists/long-lists",
      }),
      lesson({
        id: "scaffold-et-actions-flutter",
        title: "Composer l’écran avec Scaffold",
        minutes: 19,
        summary:
          "Scaffold organise l’AppBar, le corps et le bouton flottant. L’action principale du carnet ouvre le formulaire.",
        sections: [
          section(
            "Placer les commandes autour du contenu",
            "L’AppBar nomme l’écran et le FloatingActionButton donne accès à Nouvelle tâche.",
            [
              "SafeArea protège la liste des zones du système.",
              "Le corps de la liste garde une marge basse pour que le bouton flottant ne masque pas la dernière ligne.",
            ],
          ),
        ],
        files: todo.files,
        task: "Remplace le libellé du bouton et vérifie sa lisibilité en petite largeur.",
        takeaway:
          "Scaffold donne une place cohérente à chaque élément de la page.",
        quiz: quiz(
          "Quelle propriété reçoit le bouton flottant ?",
          ["itemCount", "title", "floatingActionButton"],
          2,
          "Scaffold dispose l’action flottante selon la structure Material.",
        ),
        link: "https://api.flutter.dev/flutter/material/Scaffold-class.html",
      }),
    ],
  },
  {
    id: "routes-flutter",
    title: "Navigation et résultat de formulaire",
    description: "Ouvre un écran et récupère le résultat de son action.",
    lessons: [
      lesson({
        id: "navigator-push-flutter",
        title: "Ouvrir une page avec Navigator.push",
        minutes: 20,
        summary:
          "Navigator gère une pile de routes. push affiche une nouvelle page et retourne un Future qui se termine lorsque la page est fermée.",
        sections: [
          section(
            "Naviguer depuis une action",
            "MaterialPageRoute construit le formulaire. La page des tâches attend une chaîne ou un retour sans résultat.",
            [
              "Avec push<String>, le type documente le résultat attendu.",
              "Le projet de panier utilise aussi push pour ouvrir CartPage en conservant le même provider au-dessus du navigateur.",
            ],
          ),
        ],
        files: todo.files,
        task: "Ouvre Nouvelle tâche, puis reviens avec Retour sans rien enregistrer.",
        takeaway:
          "Le type de la route aide à interpréter les données renvoyées.",
        quiz: quiz(
          "Que reçoit l’écran d’origine après push<String> ?",
          [
            "Un identifiant d’émulateur",
            "Un Future qui peut donner un titre",
            "Une liste de toutes les routes",
          ],
          1,
          "Le résultat est fourni lorsque la route est retirée.",
        ),
        link: docs + "cookbook/navigation/navigation-basics",
      }),
      lesson({
        id: "pop-et-formulaire-flutter",
        title: "Valider une saisie puis renvoyer un résultat",
        minutes: 20,
        summary:
          "Le formulaire nettoie le texte et refuse un titre vide. Navigator.pop transmet le titre validé à la page précédente.",
        sections: [
          section(
            "Traiter validation et annulation",
            "Form vérifie ses champs. Le TextEditingController est libéré dans dispose quand l’écran se ferme.",
            [
              "Une saisie composée d’espaces est vide après trim.",
              "L’écran précédent vérifie le résultat et context.mounted avant d’ajouter la tâche.",
            ],
          ),
        ],
        files: projectExample(todo, "lib/task_form_page.dart"),
        task: "Essaie un titre vide, saisis une tâche puis observe son apparition dans la liste.",
        takeaway:
          "Valide à l’endroit de la saisie et retourne seulement les données nécessaires.",
        quiz: quiz(
          "Quel appel transmet le titre à la page précédente ?",
          [
            "Navigator.pop(context, titre)",
            "setState(titre)",
            "flutter pub get",
          ],
          0,
          "pop ferme la route et termine le Future de push avec le résultat.",
        ),
        link: docs + "cookbook/navigation/returning-data",
      }),
    ],
  },
  {
    id: "provider-flutter",
    title: "État partagé avec Provider",
    description: "Fais observer le même store à plusieurs écrans.",
    lessons: [
      lesson({
        id: "changenotifier-taches-flutter",
        title: "Déplacer l’état vers un ChangeNotifier",
        minutes: 21,
        summary:
          "TasksStore conserve les tâches et applique les règles de mise à jour. notifyListeners signale un changement aux widgets qui observent le store.",
        sections: [
          section(
            "Choisir comment utiliser le store",
            "ChangeNotifierProvider crée et fournit le store. context.watch observe ses modifications. context.read permet à un bouton d’appeler une méthode.",
            [
              "Les méthodes add et toggle protègent la liste des modifications directes.",
              "Expose une liste non modifiable et laisse les mutations passer par les méthodes du store.",
            ],
          ),
        ],
        files: projectExample(todo, "lib/tasks_store.dart"),
        task: "Ajoute une tâche depuis le formulaire et repère l’appel à notifyListeners qui actualise la liste.",
        takeaway:
          "Le store porte les règles et les vues observent ses changements.",
        quiz: quiz(
          "Quel appel avertit les widgets abonnés ?",
          ["MaterialPageRoute", "notifyListeners", "runApp"],
          1,
          "ChangeNotifier déclenche la notification grâce à notifyListeners.",
        ),
        link: docs + "data-and-backend/state-mgmt/simple",
      }),
      lesson({
        id: "panier-partage-flutter",
        title: "Partager les quantités et dériver un total",
        minutes: 21,
        summary:
          "CartStore relie chaque identifiant à une quantité. Les écrans calculent le nombre et le montant à partir de ces données.",
        sections: [
          section(
            "Garder un seul panier",
            "Le même provider entoure le catalogue et le panier. Le badge observe le compteur avec context.select.",
            [
              "Le total additionne le prix multiplié par la quantité de chaque produit.",
              "Une quantité qui atteint zéro est retirée du store. Le badge et le total se mettent à jour ensemble.",
            ],
          ),
        ],
        files: projectExample(cart, "lib/cart_store.dart"),
        task: "Ajoute un article, ouvre le panier, retire-le et vérifie le badge en revenant.",
        takeaway:
          "Une valeur calculée reste cohérente avec les quantités réellement enregistrées.",
        quiz: quiz(
          "Que doit observer CartBadge ?",
          [
            "Toute la navigation",
            "Seulement le nombre d’articles",
            "Le fichier README",
          ],
          1,
          "context.select cible la valeur affichée par le badge.",
        ),
        link: "https://pub.dev/packages/provider",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "reseau-et-json-flutter",
    title: "HTTP asynchrone et JSON",
    description:
      "Récupère des données et transforme la réponse en modèles Dart.",
    lessons: [
      lesson({
        id: "http-get-flutter",
        title: "Télécharger des données avec http",
        minutes: 24,
        summary:
          "MovieRepository utilise un client HTTP et await pour recevoir le catalogue sans bloquer le rendu.",
        sections: [
          section(
            "Séparer transport et interface",
            "Le dépôt construit l’URL et vérifie le statut HTTP. Le BLoC décide ensuite quoi afficher.",
            [
              "Le délai maximal évite d’attendre indéfiniment une réponse.",
              "Déclare la permission Internet pour Android dans le manifeste des projets réseau. Les endpoints de l’atelier utilisent HTTPS.",
            ],
          ),
        ],
        files: projectExample(movies, "lib/movie_repository.dart"),
        task: "Lance le catalogue et observe la différence entre le chargement et l’état après une coupure réseau.",
        takeaway: "Vérifie la réponse HTTP avant de lire son contenu.",
        quiz: quiz(
          "Quel élément doit être contrôlé avant jsonDecode ?",
          ["Le nombre de widgets", "Le nom de l’émulateur", "Le code HTTP"],
          2,
          "Un statut réussi indique que le serveur a traité la demande.",
        ),
        link: docs + "cookbook/networking/fetch-data",
      }),
      lesson({
        id: "decoder-films-flutter",
        title: "Passer du JSON à un objet Movie",
        minutes: 22,
        summary:
          "jsonDecode transforme le texte en données Dart. Movie.fromJson valide les champs utilisés par l’écran.",
        sections: [
          section(
            "Vérifier la structure reçue",
            "Le dépôt attend une liste. Chaque film doit contenir un identifiant, un titre et un résumé.",
            [
              "La fabrique retourne une URI HTTPS facultative pour l’affiche.",
              "L’interface dispose d’un pictogramme si le chargement de l’affiche échoue.",
            ],
          ),
        ],
        files: projectExample(movies, "lib/movie_repository.dart"),
        task: "Repère un champ obligatoire et le champ facultatif. Essaie une URL d’affiche invalide pour vérifier le repli.",
        takeaway:
          "Le modèle filtre les données brutes et protège la vue des valeurs inattendues.",
        quiz: quiz(
          "À quoi sert le constructeur factory fromJson ?",
          [
            "À créer un modèle à partir de données décodées",
            "À animer une affiche",
            "À vider le stockage local",
          ],
          0,
          "Il définit la conversion entre la réponse reçue et l’objet Dart.",
        ),
        link: docs + "data-and-backend/serialization/json",
      }),
    ],
  },
  {
    id: "isar-et-hors-ligne",
    title: "Isar et lecture hors ligne",
    description:
      "Lis une mesure locale et remplace-la seulement après une réponse valide.",
    lessons: [
      lesson({
        id: "collection-isar-flutter",
        title: "Décrire une collection Isar",
        minutes: 23,
        summary:
          "La classe WeatherReading décrit les champs persistants. L’annotation collection permet de générer son schéma Isar.",
        sections: [
          section(
            "Ouvrir la base au démarrage",
            "Isar Community utilise le dossier de support de l’application. La météo garde une seule entrée, identifiée par 1.",
            [
              "La directive part relie le modèle au fichier weather_reading.g.dart fourni dans l’archive.",
              "Après une modification du modèle, relance dart run build_runner build pour régénérer le schéma.",
            ],
          ),
        ],
        files: projectExample(weather, "lib/weather_reading.dart"),
        task: "Repère l’identifiant et les valeurs mesurées. Trouve le dossier de stockage choisi dans main.dart.",
        takeaway: "Le schéma indique à Isar comment lire et écrire les objets.",
        quiz: quiz(
          "Quel fichier contient le modèle que tu modifies ?",
          ["weather_reading.dart", "weather_reading.g.dart", "pubspec.lock"],
          0,
          "Le générateur produit le fichier .g.dart à partir du modèle écrit à la main.",
        ),
        link: "https://pub.dev/packages/isar_community",
      }),
      lesson({
        id: "cache-meteo-flutter",
        title: "Rafraîchir un cache offline-first",
        minutes: 24,
        summary:
          "L’écran affiche la dernière météo sauvegardée avant de contacter Open-Meteo. Une réponse valide remplace la mesure en une transaction.",
        sections: [
          section(
            "Conserver les données déjà disponibles",
            "cached lit l’entrée 1. refresh vérifie la température, l’humidité, le vent et l’heure avant writeTxn.",
            [
              "Une coupure réseau conserve la mesure visible et affiche un message d’échec.",
              "L’heure UTC aide à comprendre quand la mesure a été relevée. Sans première mesure, l’écran propose de réessayer.",
            ],
          ),
        ],
        files: projectExample(weather, "lib/weather_repository.dart"),
        task: "Enregistre une mesure, passe en mode avion et relance. Compare le message et l’heure affichée.",
        takeaway:
          "La base locale est lue en premier. Une réponse valide vient mettre à jour le cache.",
        quiz: quiz(
          "Quand écrire une nouvelle mesure ?",
          [
            "À chaque appui même si la réponse échoue",
            "Après validation de la réponse",
            "Dès la compilation de l’application",
          ],
          1,
          "La transaction remplace uniquement une mesure lorsque les données sont valides.",
        ),
        link: "https://open-meteo.com/en/docs",
      }),
    ],
  },
  {
    id: "bloc-et-animations-flutter",
    title: "BLoC, transitions et animations",
    description:
      "Modélise les états de l’écran puis relie visuellement deux routes.",
    lessons: [
      lesson({
        id: "evenements-et-etats-bloc",
        title: "Transformer un événement en états BLoC",
        minutes: 24,
        summary:
          "MoviesRequested indique l’intention de charger. Le BLoC émet un état de chargement, puis de succès ou d’erreur.",
        sections: [
          section(
            "Garder la logique hors des widgets",
            "MovieBloc appelle le dépôt. BlocBuilder adapte la vue à chaque état sans réaliser lui-même de requête.",
            [
              "Le chargement en cours empêche un double appel. Réessayer déclenche un nouvel événement après l’échec.",
              "Un état chargé garde une copie non modifiable de la collection.",
            ],
          ),
        ],
        files: projectExample(movies, "lib/movie_bloc.dart"),
        task: "Suis MoviesRequested jusqu’à MovieLoaded puis déclenche un échec de connexion et réessaie.",
        takeaway:
          "L’événement décrit ce qui arrive. L’état décrit ce que la vue peut afficher.",
        quiz: quiz(
          "Que doit émettre BLoC pendant l’attente de l’API ?",
          ["Un thème Material", "Un événement de navigation", "MovieLoading"],
          2,
          "L’état MovieLoading permet à BlocBuilder d’afficher l’indicateur.",
        ),
        link: "https://bloclibrary.dev/flutter-bloc-concepts/",
      }),
      lesson({
        id: "hero-et-animation-flutter",
        title: "Animer une affiche entre deux écrans",
        minutes: 23,
        summary:
          "Hero relie deux widgets de routes différentes en utilisant le même tag. L’affiche du catalogue se transforme en grande affiche sur sa fiche.",
        sections: [
          section(
            "Choisir une animation adaptée",
            "Le tag du Hero reprend l’identifiant du film. L’atelier météo utilise AnimatedContainer pour animer la couleur du bandeau.",
            [
              "Un tag doit distinguer chaque affiche dans la route. La fiche réutilise exactement le même identifiant.",
              "Une animation implicite reçoit une durée et une nouvelle valeur. Un AnimationController sert quand tu as besoin de piloter le temps de l’animation et se libère dans dispose.",
            ],
          ),
        ],
        files: movies.files,
        task: "Ouvre deux films différents et observe leur transition. Compare avec le bandeau de la météo.",
        takeaway:
          "Hero relie un même élément entre deux routes. AnimatedContainer interpole une propriété.",
        quiz: quiz(
          "Qu’est-ce qui relie les deux affiches Hero ?",
          [
            "Le même tag de film",
            "La même largeur en pixels",
            "Le même bouton Retour",
          ],
          0,
          "Flutter apparie les Hero des deux routes par leur tag.",
        ),
        link: docs + "ui/animations/hero-animations",
      }),
    ],
  },
];

export const flutterLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Dart, widgets et état local",
    objective:
      "Écris tes premiers objets Dart et construis un écran Flutter qui réagit à l’utilisateur.",
    definition:
      "Flutter est un kit d’interface multiplateforme. Dart exprime la logique et les données. Les widgets décrivent ce que Flutter doit afficher.",
    color: levelColors[0],
    prerequisites:
      "Prépare un éditeur, le SDK Flutter stable et un appareil Android ou un simulateur iOS.",
    outcomes: [
      "Utiliser les types, les fonctions et les constructeurs de Dart.",
      "Assembler les widgets et choisir leur disposition.",
      "Gérer un état local avec StatefulWidget et setState.",
    ],
    chapters: beginner,
    projects: flutterBeginnerProjects,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Listes, navigation et Provider",
    objective:
      "Affiche une collection, passe entre plusieurs écrans et partage des données.",
    color: levelColors[1],
    prerequisites:
      "Savoir construire une vue Flutter et gérer une interaction locale.",
    outcomes: [
      "Créer une liste à la demande et organiser ses actions.",
      "Transmettre un résultat entre deux routes.",
      "Partager un store ChangeNotifier avec Provider.",
    ],
    chapters: intermediate,
    projects: flutterIntermediateProjects,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "HTTP, Isar, BLoC et animations",
    objective:
      "Relie des écrans à une API, conserve une mesure hors ligne et anime la navigation.",
    color: levelColors[2],
    prerequisites: "Savoir naviguer et mettre à jour un état partagé.",
    outcomes: [
      "Récupérer et vérifier une réponse JSON.",
      "Persister une mesure dans Isar et la lire hors ligne.",
      "Distinguer événements et états BLoC.",
      "Animer une propriété ou une transition Hero.",
    ],
    chapters: advanced,
    projects: flutterAdvancedProjects,
  },
];
