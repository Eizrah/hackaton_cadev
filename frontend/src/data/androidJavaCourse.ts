import {
  androidMainLayout,
  androidRes,
  javaAndroidPath,
} from "./androidJavaAuthoring";
import { javaAndroidAdvancedProjects } from "./androidJavaAdvancedProjects";
import {
  javaAndroidBeginnerProjects,
  javaAndroidIntermediateProjects,
} from "./androidJavaProjects";
import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import type { WebLevel } from "./webCourseTypes";

const [score, login] = javaAndroidBeginnerProjects;
const [notes, films] = javaAndroidIntermediateProjects;
const [weather, articles] = javaAndroidAdvancedProjects;
const androidDocs = "https://developer.android.com/";

const beginner: WebLevel["chapters"] = [
  {
    id: "projet-vues-xml",
    title: "Premiers pas dans Android Studio et XML",
    description:
      "Repère les fichiers, puis construis un écran en assemblant des vues.",
    lessons: [
      lesson({
        id: "ouvrir-projet-java",
        title: "Ouvrir et lancer un projet Java",
        minutes: 18,
        summary:
          "Un projet Android réunit du code Java, des ressources et un manifeste. Android Studio s’appuie sur Gradle pour fabriquer l’APK que tu peux installer sur un appareil.",
        sections: [
          section(
            "Suivre le chemin de l’application",
            "Ouvre le ZIP dans Android Studio. L’atelier utilise le SDK 35 et Gradle avec Java 17.",
            [
              "AndroidManifest.xml déclare MainActivity comme point d’entrée. Les autres écrans y sont déclarés aussi.",
              "Les fichiers .java contiennent la logique. Le dossier res regroupe les écrans XML, les couleurs, les textes et les illustrations.",
              "Dans Device Manager, crée un appareil virtuel. Sélectionne-le puis clique sur Run pour installer l’APK.",
            ],
          ),
        ],
        files: projectExample(score, "app/src/main/AndroidManifest.xml"),
        task: "Lance le tableau de scores, puis retrouve la balise activity qui déclare MainActivity dans le manifeste.",
        takeaway:
          "Le manifeste annonce les composants. Gradle assemble le code et les ressources.",
        quiz: quiz(
          "Quel fichier déclare les activités de l’application ?",
          ["MainActivity.java", "AndroidManifest.xml", "gradle.properties"],
          1,
          "Android lit le manifeste pour connaître les composants et leurs points d’entrée.",
        ),
        link: androidDocs + "studio/run/emulator",
      }),
      lesson({
        id: "composer-xml",
        title: "Disposer les vues avec XML",
        minutes: 20,
        summary:
          "Chaque balise XML correspond à une vue ou à un conteneur. Compose le tableau de scores avec des colonnes, des lignes et des boutons.",
        sections: [
          section(
            "Assembler une interface",
            "LinearLayout aligne ses enfants dans l’ordre du fichier. Une orientation verticale empile les cartes, tandis qu’une orientation horizontale aligne les boutons.",
            [
              "TextView affiche du texte, ImageView une image, Button une action et EditText une saisie.",
              "match_parent utilise l’espace du parent. wrap_content dimensionne la vue selon son contenu. Utilise dp pour les tailles et sp pour le texte.",
              "ConstraintLayout ancre les vues aux bords ou entre elles. Consulte activity_welcome.xml dans le projet de connexion pour comparer les positions.",
            ],
          ),
        ],
        files: projectExample(score, androidMainLayout),
        task: "Remplace Équipe A par une équipe de ton choix et relance l’aperçu dans Android Studio.",
        takeaway:
          "Le XML définit la hiérarchie et la disposition. Le Java contrôle les interactions.",
        quiz: quiz(
          "Quel attribut aligne les enfants d’un LinearLayout côte à côte ?",
          [
            'android:layout_width="match_parent"',
            'android:layout_height="wrap_content"',
            'android:orientation="horizontal"',
          ],
          2,
          "Une orientation horizontale place les vues sur la même ligne.",
        ),
        link: androidDocs + "develop/ui/views/layout/linear",
      }),
    ],
  },
  {
    id: "java-vues-et-actions",
    title: "Logique Java et événements",
    description:
      "Donne des responsabilités aux objets et relie les clics à des méthodes.",
    lessons: [
      lesson({
        id: "classe-score-java",
        title: "Créer une classe et ses objets",
        minutes: 19,
        summary:
          "La classe Score décrit une façon de compter les points. MainActivity crée deux objets Score, chacun avec sa propre valeur.",
        sections: [
          section(
            "Isoler la règle de calcul",
            "Un champ private conserve la valeur dans l’objet. Une méthode add reçoit les points et une méthode points renvoie le résultat.",
            [
              "Déclare un type pour chaque champ et chaque paramètre. int représente un entier.",
              "new Score() construit une instance. Équipe A et équipe B peuvent utiliser la même classe sans partager leurs points.",
              "Garde le calcul dans Score et la mise à jour des TextView dans l’activité.",
            ],
          ),
        ],
        files: projectExample(score, `${javaAndroidPath}/Score.java`),
        task: "Ajoute une méthode reset dans Score, puis appelle-la depuis un nouveau bouton.",
        takeaway:
          "Une classe définit les données et actions d’un objet. Chaque instance a son propre état.",
        quiz: quiz(
          "Après equipeA.add(3), que devient le score de equipeB ?",
          [
            "Il ne change pas",
            "Il prend la même valeur",
            "Il est remis à zéro",
          ],
          0,
          "Les deux équipes ont été construites avec deux instances indépendantes.",
        ),
        link: "https://dev.java/learn/classes-objects/",
      }),
      lesson({
        id: "vues-et-clics-java",
        title: "Relier les vues et écouter les clics",
        minutes: 19,
        summary:
          "findViewById retrouve une vue du fichier XML chargé. setOnClickListener décide de la réaction à un appui.",
        sections: [
          section(
            "Suivre le trajet d’un clic",
            "L’activité installe d’abord le layout, puis récupère score_a et score_b. Une expression lambda envoie le nombre de points au bon objet.",
            [
              "Dans XML, @+id/score_a crée l’identifiant. En Java, R.id.score_a désigne la ressource générée.",
              "La lambda view -> add(equipeA, 1) a le même rôle qu’une classe anonyme View.OnClickListener avec une méthode onClick.",
              "Convertis l’entier avec String.valueOf avant setText. La surcharge setText(int) chercherait une ressource de texte.",
            ],
          ),
        ],
        files: score.files,
        task: "Ajoute un bouton +2 pour une équipe. Vérifie que l’autre score reste identique.",
        takeaway:
          "Charge le layout, trouve ses vues puis configure les écouteurs.",
        quiz: quiz(
          "Quand appeler findViewById pour récupérer un élément de ton écran ?",
          [
            "Avant la création de l’activité",
            "Après avoir installé le layout",
            "Uniquement dans onDestroy",
          ],
          1,
          "L’élément appartient à l’arbre de vues installé par setContentView.",
        ),
        link: androidDocs + "develop/ui/views/touch-and-input/input-events",
      }),
    ],
  },
  {
    id: "ecrans-et-cycle-java",
    title: "Cycle de vie et passage entre écrans",
    description:
      "Conserve un petit état et transmets un nom à la prochaine activité.",
    lessons: [
      lesson({
        id: "cycle-activite-java",
        title: "Préparer et restaurer une activité",
        minutes: 20,
        summary:
          "Android appelle différentes méthodes selon la visibilité de l’activité. Une rotation peut recréer l’écran et ses objets Java.",
        sections: [
          section(
            "Comprendre onCreate, onStart et onResume",
            "onCreate prépare les vues. onStart correspond au moment où l’écran devient visible. onResume marque le retour à un état interactif.",
            [
              "Sauvegarde les scores dans onSaveInstanceState avec des clés stables, puis lis le Bundle reçu dans onCreate.",
              "Garde les petits états d’interface dans le Bundle. Choisis un stockage durable pour des données à retrouver après une fermeture.",
              "Teste la rotation après avoir cliqué sur plusieurs boutons pour vérifier la restauration.",
            ],
          ),
        ],
        files: score.files,
        task: "Ajoute trois points, fais pivoter l’émulateur et observe les méthodes de cycle de vie avec Logcat.",
        takeaway: "Le Bundle restaure un état d’écran après une recréation.",
        quiz: quiz(
          "Où lire le score sauvegardé lors de la recréation de l’activité ?",
          [
            "Dans onCreate avec le Bundle reçu",
            "Dans le fichier XML",
            "Dans le nom de l’APK",
          ],
          0,
          "Le Bundle est transmis à la nouvelle instance de l’activité.",
        ),
        link: androidDocs + "guide/components/activities/activity-lifecycle",
      }),
      lesson({
        id: "ouvrir-activite-intent",
        title: "Ouvrir un deuxième écran avec un Intent",
        minutes: 21,
        summary:
          "Un Intent explicite indique quelle activité ouvrir. putExtra transmet une petite donnée que l’écran suivant peut lire.",
        sections: [
          section(
            "De la connexion à l’accueil",
            "La connexion d’exercice vérifie un identifiant public. Après validation, MainActivity construit un Intent ciblant WelcomeActivity et transmet seulement le nom.",
            [
              "Le champ textPassword masque la saisie. Saisis demo et DevAfrica17 pour tester.",
              "getStringExtra lit le nom à partir de la même clé. Prévois un texte de repli quand la valeur est absente.",
              "Déclare WelcomeActivity dans le manifeste avec exported=false. finish() termine cet écran et revient à l’activité précédente.",
            ],
          ),
        ],
        files: login.files,
        task: "Essaie d’abord un mauvais mot de passe, puis le compte de démonstration. Change le texte de bienvenue.",
        takeaway:
          "La classe cible choisit l’activité. Les extras transportent les petites valeurs nécessaires.",
        quiz: quiz(
          "Quelle valeur transmet-on à l’écran de bienvenue ?",
          [
            "Le mot de passe",
            "Le fichier XML entier",
            "Le nom du compte de démonstration",
          ],
          2,
          "L’écran suivant utilise seulement le nom pour personnaliser son message.",
        ),
        link: androidDocs + "guide/components/intents-filters",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "listes-java-recyclerview",
    title: "Listes et cartes avec RecyclerView",
    description:
      "Réutilise les vues et affiche des données dans une liste ou une grille.",
    lessons: [
      lesson({
        id: "comprendre-recyclerview-java",
        title: "Donner une disposition à une liste",
        minutes: 20,
        summary:
          "RecyclerView peut réutiliser une ligne sortie de l’écran pour afficher un nouvel élément. Son LayoutManager décide où disposer les lignes.",
        sections: [
          section(
            "Relier trois éléments",
            "Le carnet associe RecyclerView à LinearLayoutManager et à NoteAdapter pour obtenir une liste verticale.",
            [
              "RecyclerView représente la zone défilante. Donne-lui la place restante de l’écran avec layout_weight.",
              "row_note.xml contient l’apparence d’une ligne. Le modèle du carnet est une liste de titres.",
              "Le LayoutManager décide de la position. L’Adapter fournit les éléments à afficher.",
            ],
          ),
        ],
        files: projectExample(notes, androidMainLayout),
        task: "Ajoute plusieurs notes, puis fais défiler la liste et repère l’espace réservé à la dernière note.",
        takeaway:
          "Le conteneur, la disposition et la liaison des données ont des rôles séparés.",
        quiz: quiz(
          "Qui choisit une liste verticale ou une grille ?",
          ["AlertDialog", "LayoutManager", "SharedPreferences"],
          1,
          "Le LayoutManager place les éléments dans le RecyclerView.",
        ),
        link: androidDocs + "develop/ui/views/layout/recyclerview",
      }),
      lesson({
        id: "adapter-viewholder-java",
        title: "Écrire un Adapter et un ViewHolder",
        minutes: 21,
        summary:
          "Un Adapter construit des lignes à la demande, puis les remplit. Le ViewHolder conserve les références aux vues de la ligne.",
        sections: [
          section(
            "Les trois méthodes à connaître",
            "onCreateViewHolder gonfle row_note.xml. onBindViewHolder donne à la ligne le titre de l’élément courant. getItemCount renvoie la taille de la liste.",
            [
              "Appelle inflate avec le parent et attachToRoot=false pour que RecyclerView ajoute la vue.",
              "Quand un holder est réutilisé, réassigne ses textes et ses actions à partir de l’élément courant.",
              "Après insertion en tête du carnet, notifyItemInserted(0) signale l’emplacement de la nouvelle ligne.",
            ],
          ),
        ],
        files: projectExample(notes, `${javaAndroidPath}/NoteAdapter.java`),
        task: "Ajoute une nouvelle note et explique quelles méthodes produisent et remplissent sa ligne.",
        takeaway:
          "Le ViewHolder connaît les vues de la ligne et l’Adapter choisit ses données.",
        quiz: quiz(
          "Quelle méthode remplit une ligne avec le titre à la position donnée ?",
          ["onBindViewHolder", "getItemCount", "onCreate de MainActivity"],
          0,
          "La liaison se fait lors de onBindViewHolder, y compris après recyclage.",
        ),
        link:
          androidDocs +
          "reference/androidx/recyclerview/widget/RecyclerView.Adapter",
      }),
    ],
  },
  {
    id: "stockage-preferences-java",
    title: "Préférences persistantes",
    description:
      "Sauvegarde une petite liste et retrouve son premier élément au lancement.",
    lessons: [
      lesson({
        id: "ecrire-sharedpreferences-java",
        title: "Écrire de petites données dans SharedPreferences",
        minutes: 19,
        summary:
          "SharedPreferences conserve des paires clé-valeur propres à l’application. Le carnet encode son petit tableau de titres dans une chaîne JSON.",
        sections: [
          section(
            "Enregistrer la modification",
            "MODE_PRIVATE ouvre le fichier de préférences de l’application. edit prépare une modification et apply l’applique en mémoire avant son écriture asynchrone.",
            [
              "Garde une clé constante, ici titles. La même clé servira à relire les notes.",
              "Valide et limite la saisie avant de l’enregistrer. La note la plus récente est ajoutée à l’index 0.",
              "Pour un réglage booléen comme un thème sombre, putBoolean suffit. Garde SQLite pour les données structurées plus importantes.",
            ],
          ),
        ],
        files: notes.files,
        task: "Ajoute deux titres et retrouve la ligne qui convertit la liste en JSONArray.",
        takeaway:
          "Les préférences sont adaptées aux réglages et à de petites quantités de données.",
        quiz: quiz(
          "Que fait apply après un putString ?",
          [
            "Il applique la modification aux préférences",
            "Il efface le fichier",
            "Il recharge le manifeste",
          ],
          0,
          "apply actualise la valeur en mémoire et planifie son écriture sur disque.",
        ),
        link: androidDocs + "training/data-storage/shared-preferences",
      }),
      lesson({
        id: "restaurer-preferences-java",
        title: "Restaurer les notes et gérer un premier lancement",
        minutes: 20,
        summary:
          "La lecture a lieu avant la création de l’Adapter. Une valeur par défaut permet d’afficher le carnet vide au premier démarrage.",
        sections: [
          section(
            "Reconstruire l’état",
            "restoreNotes lit la chaîne associée à titles. Elle transforme chaque valeur du tableau JSON en élément de la liste.",
            [
              "Utilise [] comme valeur de repli pour représenter un tableau vide.",
              "Si un ancien fichier ne se lit plus comme JSON, le carnet affiche une liste vide et permet de reprendre.",
              "Le texte Dernière note s’appuie sur le premier titre restauré. Une source unique garde l’écran cohérent.",
            ],
          ),
        ],
        files: notes.files,
        task: "Ferme complètement l’application, rouvre-la et vérifie l’ordre des deux notes et le libellé Dernière note.",
        takeaway: "Lis la valeur persistante avant d’afficher l’état initial.",
        quiz: quiz(
          "Que représente la chaîne [] au premier lancement ?",
          ["Une note sans titre", "Un identifiant de menu", "Une liste vide"],
          2,
          "Le tableau JSON vide permet de construire l’état initial sans erreur.",
        ),
        link: androidDocs + "reference/android/content/SharedPreferences",
      }),
    ],
  },
  {
    id: "grille-toolbar-dialogue",
    title: "Grille de films, menus et dialogues",
    description:
      "Crée un catalogue visuel et associe une action à chaque carte.",
    lessons: [
      lesson({
        id: "grille-catalogue-java",
        title: "Afficher des cartes dans une grille",
        minutes: 21,
        summary:
          "GridLayoutManager distribue les cartes en colonnes. L’atelier augmente le nombre de colonnes lorsque l’écran offre plus d’espace.",
        sections: [
          section(
            "Concevoir une carte réutilisable",
            "Un Movie regroupe titre, résumé et ressource d’affiche. Le XML de la ligne place ImageView, TextView et Button dans une colonne.",
            [
              "Une affiche purement décorative peut être ignorée par le lecteur d’écran si son titre est déjà présenté.",
              "Dans MovieAdapter, lie l’image et le texte à chaque appel de onBindViewHolder.",
              "Teste plusieurs largeurs pour vérifier que les boutons et les titres restent lisibles.",
            ],
          ),
        ],
        files: projectExample(films, `${androidRes}/layout/row_movie.xml`),
        task: "Ajoute un film fictif et donne-lui une affiche déjà présente dans le dossier drawable.",
        takeaway:
          "La grille place les cartes. Le modèle choisit les valeurs affichées dans chaque carte.",
        quiz: quiz(
          "Où définir l’apparence d’une carte de film ?",
          [
            "Dans le manifeste",
            "Dans row_movie.xml",
            "Dans les préférences de l’appareil",
          ],
          1,
          "Le fichier de layout réutilisable sert à créer chaque carte.",
        ),
        link:
          androidDocs +
          "reference/androidx/recyclerview/widget/GridLayoutManager",
      }),
      lesson({
        id: "toolbar-alertdialog-java",
        title: "Ouvrir un menu et un AlertDialog",
        minutes: 19,
        summary:
          "La Toolbar regroupe les actions d’écran. Un AlertDialog permet de présenter une information ou une saisie courte.",
        sections: [
          section(
            "Réagir au bon élément",
            "Le menu À propos ouvre une explication du catalogue. Le bouton Voir est associé au film de la carte et ouvre son synopsis.",
            [
              "setOnMenuItemClickListener reçoit l’élément de menu sélectionné. Retourne true après avoir géré son action.",
              "setTitle et setMessage donnent le contexte de la boîte de dialogue. Le bouton Fermer rend la main à la liste.",
              "Le carnet utilise aussi un AlertDialog avec EditText. Il vérifie la saisie avant de fermer la fenêtre.",
            ],
          ),
        ],
        files: films.files,
        task: "Ouvre les dialogues de deux films différents et vérifie que chaque résumé correspond au bon titre.",
        takeaway:
          "Une action de carte reçoit le film concerné. Le menu reste dédié aux actions de l’écran.",
        quiz: quiz(
          "Que faut-il passer à l’action Voir pour choisir le synopsis ?",
          [
            "Le film associé à la ligne",
            "L’ensemble de l’activité",
            "Le nombre de colonnes",
          ],
          0,
          "Le film porte le titre et le résumé affichés par le dialogue.",
        ),
        link: androidDocs + "develop/ui/views/components/dialogs",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "api-et-fils-java",
    title: "Réseau et fils d’exécution",
    description:
      "Télécharge du JSON avec Retrofit et laisse l’interface réagir pendant le chargement.",
    lessons: [
      lesson({
        id: "retrofit-json-java",
        title: "Décrire une requête Retrofit et lire le JSON",
        minutes: 24,
        summary:
          "Retrofit relie une méthode Java à une route HTTP. Gson convertit la réponse JSON en objets utilisables par le code.",
        sections: [
          section(
            "Suivre une mesure de météo",
            "L’interface WeatherApi associe une requête GET à la route d’Open-Meteo. Les annotations Query ajoutent latitude et longitude.",
            [
              "Déclare INTERNET dans le manifeste pour accéder au réseau. L’adresse de base Retrofit se termine par /.",
              "SerializedName relie temperature_2m au champ Java temperature. Valide la présence des valeurs avant de les afficher.",
              "Avec Volley, les requêtes sont ajoutées à une file. L’atelier utilise une interface Retrofit pour expliciter la forme de l’API.",
            ],
          ),
        ],
        files: projectExample(weather, `${javaAndroidPath}/WeatherApi.java`),
        task: "Ouvre la météo de Toamasina et retrouve le champ JSON associé à la vitesse du vent.",
        takeaway:
          "L’interface d’API décrit la requête. Le modèle traduit les données reçues.",
        quiz: quiz(
          'À quoi sert @Query("latitude") ?',
          [
            "À dessiner le texte de la latitude",
            "À demander une permission Android",
            "À placer la latitude dans les paramètres de la requête",
          ],
          2,
          "Retrofit ajoute ce paramètre à l’URL de la requête.",
        ),
        link: "https://square.github.io/retrofit/",
      }),
      lesson({
        id: "ui-thread-enqueue-java",
        title: "Garder l’écran réactif pendant une requête",
        minutes: 24,
        summary:
          "Le fil principal traite les appuis et dessine l’interface. Une longue opération bloquante peut entraîner une erreur ANR.",
        sections: [
          section(
            "Partager le travail",
            "Retrofit enqueue lance une requête asynchrone. Un ExecutorService exécute les lectures et écritures de la base. runOnUiThread actualise les TextView.",
            [
              "Affiche un état de chargement et traite séparément réponse HTTP valide et échec.",
              "Fixe une durée limite aux requêtes et annule celles qui ne concernent plus une activité détruite.",
              "Réserve WorkManager aux travaux durables à planifier. Pour la météo déclenchée depuis l’écran, une requête liée à son cycle de vie suffit.",
            ],
          ),
        ],
        files: weather.files,
        task: "Ralentis le réseau de l’émulateur ou coupe-le. Vérifie que l’interface reste réactive et affiche un message.",
        takeaway:
          "Le réseau et SQLite travaillent hors du fil principal. Les vues s’actualisent sur ce fil.",
        quiz: quiz(
          "Où lancer une lecture SQLite potentiellement longue ?",
          [
            "Dans un ExecutorService",
            "Directement dans un écouteur de clic sur le fil principal",
            "Dans un fichier XML",
          ],
          0,
          "La lecture en arrière-plan laisse Android traiter l’interface.",
        ),
        link: androidDocs + "guide/components/processes-and-threads",
      }),
    ],
  },
  {
    id: "persistance-sqlite-java",
    title: "SQLite et fonctionnement hors ligne",
    description:
      "Conserve une mesure météo et enregistre les articles favoris.",
    lessons: [
      lesson({
        id: "schema-cache-meteo-java",
        title: "Créer et interroger un cache SQLite",
        minutes: 24,
        summary:
          "SQLiteOpenHelper crée la base locale et en gère la version. L’atelier conserve un relevé météo par remplacement de la ligne principale.",
        sections: [
          section(
            "Une table pour la dernière mesure",
            "La table weather conserve le lieu, l’heure et les valeurs. La clé 1 identifie l’unique ligne que l’on remplace après chaque requête réussie.",
            [
              "Utilise ContentValues pour fournir les valeurs et un Cursor pour parcourir le résultat.",
              "Ferme le Cursor automatiquement avec try-with-resources. Utilise un paramètre ? pour la sélection.",
              "Lis le cache au démarrage. Les mesures restent datées pour que l’utilisateur sache quand elles ont été relevées.",
            ],
          ),
        ],
        files: projectExample(weather, `${javaAndroidPath}/WeatherCache.java`),
        task: "Enregistre une mesure, active le mode avion, ferme et rouvre l’application. Retrouve le lieu et l’heure.",
        takeaway:
          "SQLite permet de relire une réponse valide lorsque le réseau est indisponible.",
        quiz: quiz(
          "À quoi sert l’heure stockée avec la mesure ?",
          [
            "À connaître la date de la mesure affichée",
            "À choisir le numéro de port",
            "À demander une nouvelle permission",
          ],
          0,
          "Une mesure sauvegardée peut dater d’un autre moment que l’ouverture de l’application.",
        ),
        link: androidDocs + "training/data-storage/sqlite",
      }),
      lesson({
        id: "sqlite-favoris-java",
        title: "Enregistrer les articles favoris par identifiant",
        minutes: 24,
        summary:
          "La base des favoris conserve les titres, résumés et liens. L’identifiant de l’article sert de clé primaire pour éviter les doublons.",
        sections: [
          section(
            "Ajouter et retirer un favori",
            "Enregistre les métadonnées de l’article dans FavoritesStore. Relis les favoris après chaque modification pour actualiser le RecyclerView.",
            [
              "La commande delete filtre sur id avec un paramètre. Deux articles ayant le même titre peuvent rester distincts.",
              "L’interface affiche l’état du favori pour chaque ligne recyclée. Une liste enregistrée reste lisible hors ligne.",
              "Le lien HTTPS ouvre le site d’origine. L’atelier conserve uniquement le titre et le résumé pour la lecture hors ligne.",
            ],
          ),
        ],
        files: projectExample(
          articles,
          `${javaAndroidPath}/FavoritesStore.java`,
        ),
        task: "Ajoute deux favoris, redémarre puis retire le premier. Vérifie que le deuxième est toujours présent.",
        takeaway:
          "L’identifiant stable relie l’article distant à sa ligne locale.",
        quiz: quiz(
          "Quel champ garantit qu’un article n’est enregistré qu’une fois ?",
          ["Son résumé", "Son id", "La couleur de son bouton"],
          1,
          "La clé primaire id identifie chaque article de manière unique.",
        ),
        link:
          androidDocs + "reference/android/database/sqlite/SQLiteOpenHelper",
      }),
    ],
  },
  {
    id: "permissions-et-fallback-java",
    title: "Localisation et erreurs récupérables",
    description:
      "Respecte le choix de localisation et propose une réponse lisible en cas d’échec.",
    lessons: [
      lesson({
        id: "permissions-localisation-java",
        title: "Demander la position au moment voulu",
        minutes: 22,
        summary:
          "L’utilisateur choisit quand partager sa position. Sur les versions récentes d’Android, il peut accorder une position approximative même si l’application demande aussi la précision.",
        sections: [
          section(
            "Déclencher la demande au clic",
            "Déclare ACCESS_COARSE_LOCATION et ACCESS_FINE_LOCATION dans le manifeste. Demande-les ensemble et vérifie les droits effectivement accordés.",
            [
              "Utilise un relevé ponctuel au premier plan. Avec une permission approximative, essaie le fournisseur réseau.",
              "Arrondis les coordonnées avant la requête météo. Prévois une ville de repli pour un refus ou une position introuvable.",
              "Tu peux définir une position de test dans les commandes étendues de l’émulateur. Annule la recherche quand l’activité est détruite.",
            ],
          ),
        ],
        files: weather.files,
        task: "Refuse la position, charge Toamasina, puis réessaie avec une position de test autorisée.",
        takeaway:
          "Demande le droit lors de l’action et fais fonctionner le reste de l’écran avec les droits disponibles.",
        quiz: quiz(
          "Quand l’atelier demande-t-il la position ?",
          [
            "À chaque lancement",
            "Lors d’une lecture SQLite",
            "Au clic sur Utiliser ma position",
          ],
          2,
          "Le clic explique le besoin de localisation avant l’invite du système.",
        ),
        link:
          androidDocs +
          "develop/sensors-and-location/location/permissions/runtime",
      }),
      lesson({
        id: "gerer-reseau-coupure-java",
        title: "Tester un échec réseau et la relance",
        minutes: 22,
        summary:
          "Une requête peut échouer après un délai, une coupure ou une réponse HTTP invalide. Un écran utile garde l’utilisateur informé et laisse accéder à ses données locales.",
        sections: [
          section(
            "Comparer les états de l’écran",
            "Le fil distingue chargement, liste vide, erreur et succès. La section Favoris reste disponible pendant les erreurs du réseau.",
            [
              "Teste avec réseau, sans réseau et au retour de la connexion. Utilise Actualiser pour demander un nouvel essai.",
              "Préserve les favoris lorsque la requête de liste échoue. Présente un message qui indique les actions encore possibles.",
              "Annule les appels en cours lors de la destruction de l’activité et ferme SQLite après les tâches en attente.",
            ],
          ),
        ],
        files: articles.files,
        task: "Enregistre un favori, passe en mode avion et relance. Vérifie le message d’échec et ouvre l’onglet Favoris.",
        takeaway:
          "Une erreur de téléchargement et le stockage local sont deux états distincts.",
        quiz: quiz(
          "Que faire quand le fil distant échoue ?",
          [
            "Effacer les favoris",
            "Garder les favoris et proposer une nouvelle actualisation",
            "Bloquer tout l’écran",
          ],
          1,
          "Le stockage local donne accès aux éléments déjà enregistrés.",
        ),
        link: "https://developers.forem.com/api/v1",
      }),
    ],
  },
];

export const javaAndroidLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Syntaxe Java, XML et activités",
    objective:
      "Construis tes premiers écrans Android, réagis à des clics et transmets un nom entre deux activités.",
    definition:
      "Java est le langage qui décrit les données et la logique de l’application. Sur Android, une activité installe les vues d’un écran. Un fichier XML décrit leur disposition, puis le Java met à jour leur contenu.",
    color: levelColors[0],
    prerequisites:
      "Une première expérience des variables suffit pour commencer. Installe Android Studio et prépare un émulateur ou un appareil Android.",
    outcomes: [
      "Créer une classe et utiliser plusieurs objets indépendants.",
      "Repérer les fichiers Java, XML et le manifeste dans Android Studio.",
      "Relier une vue à son identifiant, écouter les clics et comprendre le cycle de vie.",
      "Ouvrir un autre écran avec un Intent explicite.",
    ],
    chapters: beginner,
    projects: javaAndroidBeginnerProjects,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Listes, adaptateurs et préférences",
    objective:
      "Affiche des listes et des grilles réutilisables, ouvre des dialogues et conserve de petites données.",
    color: levelColors[1],
    prerequisites:
      "Savoir relier un layout à une activité et réagir à un bouton.",
    outcomes: [
      "Comprendre RecyclerView, LayoutManager, Adapter et ViewHolder.",
      "Sauvegarder et relire des valeurs avec SharedPreferences.",
      "Construire une grille et utiliser Toolbar et AlertDialog.",
    ],
    chapters: intermediate,
    projects: javaAndroidIntermediateProjects,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Réseau, asynchronisme et SQLite",
    objective:
      "Charge du JSON à distance, rends tes écrans disponibles hors ligne et gère la localisation au premier plan.",
    color: levelColors[2],
    prerequisites:
      "Savoir afficher une collection dans RecyclerView et restaurer un état simple.",
    outcomes: [
      "Utiliser Retrofit et Gson pour recevoir une réponse JSON.",
      "Séparer le travail réseau, le stockage et la mise à jour de l’interface.",
      "Garder des données avec SQLite et les retrouver après une relance.",
      "Demander la localisation à la demande et gérer les refus.",
    ],
    chapters: advanced,
    projects: javaAndroidAdvancedProjects,
  },
];
