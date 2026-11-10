import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { expoFinanceProject } from "./expoFinanceProject";
import { expoBeginnerProjects, expoIntermediateProjects } from "./expoProjects";
import { expoShopProject } from "./expoShopProject";
import type { WebLevel } from "./webCourseTypes";

const [profile, vote] = expoBeginnerProjects;
const [wishlist, news] = expoIntermediateProjects;
const shop = expoShopProject;
const finance = expoFinanceProject;
const reactNative = "https://reactnative.dev/docs/";
const expoDocs = "https://docs.expo.dev/";

const beginner: WebLevel["chapters"] = [
  {
    id: "demarrage-expo",
    title: "Expo et premier lancement",
    description:
      "Ouvre un atelier React Native sur un téléphone ou un émulateur.",
    lessons: [
      lesson({
        id: "demarrer-expo-go",
        title: "Installer les outils et ouvrir Expo Go",
        minutes: 20,
        summary:
          "Expo lance le serveur de développement qui prépare les fichiers de l’application. Expo Go charge l’atelier sur le téléphone en scannant le QR code.",
        sections: [
          section(
            "Lancer depuis le dossier du ZIP",
            "Installe les paquets avec npm install puis lance npm start. Le projet est configuré pour le SDK Expo 54.",
            [
              "Vérifie que la version d’Expo Go correspond au SDK de l’atelier.",
              "Sur un téléphone, utilise le même réseau que ton ordinateur. Pour Android, tu peux aussi lancer un émulateur puis appuyer sur a dans le terminal Expo.",
              "Dans package.json, scripts.start définit la commande. App.tsx contient l’écran que tu peux modifier.",
            ],
          ),
        ],
        files: projectExample(profile, "package.json"),
        task: "Démarre la carte et vérifie son ouverture. Change le nom dans App.tsx et observe l’actualisation.",
        takeaway:
          "Le terminal prépare le projet. Expo Go affiche son bundle mobile.",
        quiz: quiz(
          "Quelles versions doivent être compatibles ?",
          [
            "La version de Windows et le nom de l’écran",
            "Le SDK Expo du projet et Expo Go",
            "Les tailles de tous les écrans",
          ],
          1,
          "Expo Go charge les applications qui ciblent son SDK.",
        ),
        link: expoDocs + "troubleshooting/expo-go-version-mismatch/",
      }),
      lesson({
        id: "structure-projet-react-native",
        title: "Repérer le point d’entrée et la vue",
        minutes: 18,
        summary:
          "index.js enregistre App comme composant racine. App.tsx décrit les éléments à afficher et le fichier ui.ts regroupe les styles partagés.",
        sections: [
          section(
            "Du composant à l’écran",
            "Une fonction renvoie du JSX composé de View, Text et d’autres composants React Native.",
            [
              "SafeAreaView tient compte des espaces réservés aux barres du système.",
              "npm run typecheck vérifie les types du projet. Un changement de texte dans App.tsx permet de vérifier que tu modifies le bon fichier.",
            ],
          ),
        ],
        files: projectExample(profile, "index.js"),
        task: "Retrouve l’import d’App dans index.js puis ouvre App.tsx et repère le composant racine.",
        takeaway:
          "Le point d’entrée enregistre le composant qui décrit l’interface.",
        quiz: quiz(
          "Quel fichier décrit la carte affichée ?",
          ["App.tsx", "package-lock.json", "app.json"],
          0,
          "App.tsx contient le composant de l’écran.",
        ),
        link: reactNative + "intro-react-native-components",
      }),
    ],
  },
  {
    id: "composants-et-flexbox-rn",
    title: "Composants natifs et Flexbox",
    description:
      "Place une image, du texte et des actions dans une disposition flexible.",
    lessons: [
      lesson({
        id: "view-text-image-pressable",
        title: "Composer une vue avec View, Text, Image et Pressable",
        minutes: 19,
        summary:
          "View regroupe des éléments. Text affiche du texte. Image charge le portrait local et Pressable réagit à l’appui.",
        sections: [
          section(
            "Construire une carte native",
            "Les composants mobiles décrivent leur apparence et leur interaction. Le portrait s’obtient avec require et une taille définie dans StyleSheet.",
            [
              "Place les chaînes visibles dans Text et donne un rôle de bouton aux actions.",
              "Pressable reçoit l’état pressed. TouchableOpacity fournit un retour d’opacité dans le projet de vote.",
              "Une description d’accessibilité explique le contenu utile d’une image.",
            ],
          ),
        ],
        files: profile.files,
        task: "Change le texte du métier, puis ouvre et referme le contact à l’aide du bouton.",
        takeaway:
          "Les composants de base React Native sont conçus pour les vues mobiles.",
        quiz: quiz(
          "Quel composant affiche le portrait dans la carte ?",
          ["StyleSheet", "FlatList", "Image"],
          2,
          "Image reçoit la source du portrait et son style.",
        ),
        link: reactNative + "components-and-apis",
      }),
      lesson({
        id: "styles-flexbox-react-native",
        title: "Centrer une carte avec StyleSheet et Flexbox",
        minutes: 20,
        summary:
          "StyleSheet.create regroupe les règles de style. flexDirection vaut column par défaut sur React Native.",
        sections: [
          section(
            "Placer le contenu sur deux axes",
            "Dans une colonne, justifyContent gère l’axe vertical et alignItems l’axe horizontal. Avec row, les axes s’inversent.",
            [
              "Le conteneur de la carte utilise flexGrow pour prendre la hauteur disponible dans ScrollView.",
              "Le vote combine flexDirection: row et flexWrap pour permettre aux options de passer à la ligne.",
            ],
          ),
        ],
        files: profile.files,
        task: "Essaie un alignement au début de la carte puis rétablis le centrage. Observe en portrait et en paysage.",
        takeaway:
          "justifyContent agit sur l’axe principal. alignItems agit sur l’axe transversal.",
        quiz: quiz(
          "Quel axe contrôle justifyContent avec flexDirection: column ?",
          ["L’axe vertical", "L’axe horizontal", "L’axe de profondeur"],
          0,
          "La colonne définit l’axe principal vertical.",
        ),
        link: reactNative + "flexbox",
      }),
    ],
  },
  {
    id: "saisie-et-etat-react-native",
    title: "Saisie et état local",
    description: "Utilise la question et les votes comme données de l’écran.",
    lessons: [
      lesson({
        id: "textinput-onchangetext",
        title: "Relier TextInput à une question modifiable",
        minutes: 19,
        summary:
          "TextInput reçoit value depuis l’état. onChangeText transmet le texte nouvellement saisi au composant.",
        sections: [
          section(
            "Créer un champ contrôlé",
            "Le vote stocke la question dans useState. Le champ et le titre lisent la même valeur.",
            [
              "Limite la longueur pour garder la question lisible.",
              "Quand le texte est vide après trim, affiche un libellé de repli.",
            ],
          ),
        ],
        files: vote.files,
        task: "Modifie la question puis efface-la. Vérifie le message affiché dans les deux cas.",
        takeaway:
          "Un champ contrôlé lit son état et le modifie à chaque saisie.",
        quiz: quiz(
          "Que reçoit onChangeText ?",
          ["L’écran entier", "La nouvelle chaîne saisie", "Le nombre de clics"],
          1,
          "La fonction reçoit directement la valeur textuelle.",
        ),
        link: reactNative + "textinput",
      }),
      lesson({
        id: "usestate-et-votes",
        title: "Mettre à jour deux compteurs avec useState",
        minutes: 20,
        summary:
          "Chaque option possède son compteur. Appuyer sur Voter met à jour la valeur associée à cette option.",
        sections: [
          section(
            "Incrémenter à partir de la valeur actuelle",
            "Le setter reçoit une fonction qui calcule le prochain nombre depuis le précédent.",
            [
              "Utilise un état distinct par option dans cet exercice. Le composant Vote reçoit le nombre et son action en props.",
              "Un libellé d’accessibilité indique le choix correspondant à chaque bouton.",
            ],
          ),
        ],
        files: vote.files,
        task: "Vote deux fois pour Design et une fois pour Code. Ajoute ensuite une commande de remise à zéro.",
        takeaway:
          "La mise à jour fonctionnelle utilise le dernier état disponible.",
        quiz: quiz(
          "Quel appel ajoute un vote depuis le dernier état ?",
          ["setVotes(0)", "votes + 1", "setVotes(previous => previous + 1)"],
          2,
          "Le setter reçoit un calcul qui s’applique à la valeur précédente.",
        ),
        link: "https://react.dev/reference/react/useState",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "flatlist-react-native",
    title: "Listes natives avec FlatList",
    description:
      "Affiche des collections et donne à chaque ligne une identité stable.",
    lessons: [
      lesson({
        id: "rendu-flatlist-catalogue",
        title: "Construire une FlatList",
        minutes: 20,
        summary:
          "FlatList virtualise les lignes pour limiter le travail de rendu. data fournit la collection et renderItem construit une ligne.",
        sections: [
          section(
            "Du cadeau à la carte",
            "GiftList reçoit une liste d’objets. renderItem transmet un seul cadeau au composant GiftRow.",
            [
              "FlatList convient aux listes longues. Une petite collection peut être affichée avec map, comme les quelques paragraphes de l’atelier Actualités.",
              "Ajoute ListEmptyComponent pour expliquer le premier lancement de la liste d’envies.",
            ],
          ),
        ],
        files: wishlist.files,
        task: "Ajoute un cadeau dans src/gifts.ts. Vérifie son affichage et le message de l’onglet vide.",
        takeaway:
          "FlatList rend les lignes nécessaires à partir d’une collection.",
        quiz: quiz(
          "Quelle propriété définit la vue d’une ligne ?",
          ["renderItem", "initialRouteName", "onChangeText"],
          0,
          "renderItem transforme l’élément de données en ligne visible.",
        ),
        link: reactNative + "flatlist",
      }),
      lesson({
        id: "cles-stables-flatlist",
        title: "Identifier les éléments d’une liste",
        minutes: 19,
        summary:
          "keyExtractor retourne la clé stable du modèle. Elle aide React à relier une mise à jour à la bonne ligne.",
        sections: [
          section(
            "Conserver le même identifiant",
            "Le catalogue associe un identifiant à chaque cadeau et la liste d’envies conserve ces identifiants.",
            [
              "Deux cadeaux peuvent avoir un nom similaire. Les identifiants restent uniques.",
              "Le même identifiant peut servir à afficher l’état enregistré et à retirer le cadeau.",
            ],
          ),
        ],
        files: projectExample(wishlist, "src/gifts.ts"),
        task: "Ajoute deux cadeaux au nom proche. Mets-en un seul dans les envies et vérifie lequel est affiché.",
        takeaway:
          "Une clé stable représente le modèle, indépendamment de sa position.",
        quiz: quiz(
          "Quel champ sert de clé stable ?",
          [
            "La position dans la liste",
            "Le libellé du bouton",
            "L’identifiant du cadeau",
          ],
          2,
          "L’identifiant continue à désigner le même objet lorsque la liste change.",
        ),
        link: reactNative + "flatlist#keyextractor",
      }),
    ],
  },
  {
    id: "navigation-native-react",
    title: "Navigation par pile et par onglets",
    description: "Crée deux façons de se déplacer entre les écrans.",
    lessons: [
      lesson({
        id: "stack-article-react-native",
        title: "Ouvrir un détail depuis une pile de navigation",
        minutes: 22,
        summary:
          "NativeStack ouvre un écran au-dessus du fil. L’action navigate transmet articleId pour choisir le texte à lire.",
        sections: [
          section(
            "Déclarer les routes et leurs paramètres",
            "Routes indique que l’accueil ne reçoit aucun paramètre et que Article attend un identifiant.",
            [
              "navigation.navigate ouvre le détail avec le paramètre. route.params le fournit à l’écran de lecture.",
              "Le navigateur natif fournit la barre de titre et l’action Retour.",
            ],
          ),
        ],
        files: news.files,
        task: "Ouvre un article, reviens au fil puis ouvre une autre ligne. Vérifie le titre à chaque étape.",
        takeaway:
          "La pile gère l’ordre des écrans. Le paramètre désigne la donnée à afficher.",
        quiz: quiz(
          "Quelle valeur le fil transmet-il à Article ?",
          ["Tout le tableau d’articles", "articleId", "Une couleur de barre"],
          1,
          "L’identifiant suffit pour retrouver l’article.",
        ),
        link: "https://reactnavigation.org/docs/params/",
      }),
      lesson({
        id: "onglets-react-native",
        title: "Organiser des écrans avec les onglets",
        minutes: 20,
        summary:
          "Bottom Tabs donne deux destinations au catalogue. Les utilisateurs passent du catalogue à leurs envies avec la barre du bas.",
        sections: [
          section(
            "Définir les destinations",
            "NavigationContainer héberge Tabs.Navigator. Chaque Tabs.Screen reçoit un nom et son composant.",
            [
              "Le catalogue et les envies répondent à deux actions fréquentes. Chaque destination a un libellé visible.",
              "Place le provider commun au-dessus du navigateur pour rendre l’état accessible aux deux écrans.",
            ],
          ),
        ],
        files: wishlist.files,
        task: "Renomme l’onglet Catalogue dans le navigateur et observe où s’affiche le nouveau nom.",
        takeaway:
          "Les onglets organisent les destinations principales d’un même espace.",
        quiz: quiz(
          "Quel écran affiche les cadeaux sauvegardés ?",
          ["Mes envies", "Lire un article", "Le vote de l’atelier"],
          0,
          "L’onglet Mes envies lit la sélection du contexte.",
        ),
        link: "https://reactnavigation.org/docs/bottom-tab-navigator/",
      }),
    ],
  },
  {
    id: "context-api-react-native",
    title: "Contexte et état partagé",
    description:
      "Fais lire et modifier une sélection commune depuis deux écrans.",
    lessons: [
      lesson({
        id: "creer-context-react-native",
        title: "Fournir des données avec Context API",
        minutes: 20,
        summary:
          "WishlistProvider possède les identifiants sélectionnés. Le contexte transmet la valeur et l’action toggle aux composants qui les demandent.",
        sections: [
          section(
            "Choisir la portée du provider",
            "createContext définit le canal. Provider donne la valeur à ses descendants et useWishlist la lit.",
            [
              "Le provider doit englober tous les écrans qui utilisent la sélection.",
              "Un hook dédié donne une erreur explicite si un écran a été placé hors du provider.",
            ],
          ),
        ],
        files: projectExample(wishlist, "src/wishlist.tsx"),
        task: "Repère le provider dans App.tsx et identifie deux composants qui lisent son état.",
        takeaway:
          "Le contexte donne accès à une même valeur aux écrans qui en ont besoin.",
        quiz: quiz(
          "Où placer WishlistProvider ?",
          [
            "Dans chaque ligne avec une liste indépendante",
            "Au-dessus du navigateur des deux onglets",
            "Dans le fichier app.json",
          ],
          1,
          "Les deux écrans doivent lire le même provider.",
        ),
        link: "https://react.dev/reference/react/useContext",
      }),
      lesson({
        id: "synchroniser-envies-react-native",
        title: "Ajouter et retirer un cadeau partagé",
        minutes: 20,
        summary:
          "toggle ajoute l’identifiant s’il est absent ou le retire s’il est présent. Les deux onglets se mettent à jour à partir de la même sélection.",
        sections: [
          section(
            "Dériver l’écran depuis les données",
            "La liste d’envies filtre le catalogue avec savedIds. La ligne choisit le libellé Ajouter ou Retirer selon cet état.",
            [
              "Crée un nouveau tableau à chaque modification afin que la mise à jour soit observable.",
              "Vérifie qu’ajouter puis retirer un cadeau n’altère aucun autre élément.",
            ],
          ),
        ],
        files: projectExample(wishlist, "src/wishlist.tsx"),
        task: "Ajoute deux cadeaux dans Catalogue, retire-en un dans Mes envies puis vérifie les deux boutons.",
        takeaway:
          "Une source commune garde les actions cohérentes entre les onglets.",
        quiz: quiz(
          "Que conserve le contexte ?",
          [
            "Une capture de chaque écran",
            "Une copie entière des cadeaux",
            "Les identifiants sélectionnés",
          ],
          2,
          "Les identifiants permettent de dériver la liste depuis le catalogue.",
        ),
        link: "https://react.dev/learn/passing-data-deeply-with-context",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "axios-et-persistance-mobile",
    title: "Réseau et stockage local",
    description:
      "Charge des données, restaure une préférence et protège une session.",
    lessons: [
      lesson({
        id: "axios-chargement-annulation",
        title: "Charger une série avec Axios et useEffect",
        minutes: 23,
        summary:
          "L’effet du tableau de taux lance une requête lorsqu’une période change. ActivityIndicator montre l’attente et Réessayer relance le chargement.",
        sections: [
          section(
            "Associer une requête au choix courant",
            "loadRates envoie la devise et les dates à l’API. Le changement de période annule la requête précédente avec AbortController.",
            [
              "Affiche séparément le chargement, les données et l’erreur.",
              "Le serveur peut répondre après un changement de période. Ne mets à jour l’écran que pour une requête encore active.",
            ],
          ),
        ],
        files: projectExample(finance, "src/rates.ts"),
        task: "Passe de 7 à 30 jours pendant le chargement. Coupe ensuite Internet et essaie la reprise.",
        takeaway:
          "Une requête doit rester liée à la période et au composant qui l’affichent.",
        quiz: quiz(
          "Quel composant indique l’attente réseau ?",
          ["TextInput", "ActivityIndicator", "Tab.Navigator"],
          1,
          "ActivityIndicator affiche la progression indéterminée pendant la requête.",
        ),
        link: "https://axios-http.com/docs/cancellation",
      }),
      lesson({
        id: "asyncstorage-et-securestore",
        title: "Persister une préférence et protéger le jeton",
        minutes: 23,
        summary:
          "AsyncStorage conserve une petite préférence sous forme de chaîne. SecureStore conserve le JWT de la boutique dans le stockage sécurisé du téléphone.",
        sections: [
          section(
            "Adapter le stockage à la donnée",
            "Le tableau enregistre 7 ou 30 avec setItem puis restaure le choix avec getItem. L’atelier boutique vérifie la session auprès de l’API après relecture.",
            [
              "Les préférences d’affichage peuvent être enregistrées dans AsyncStorage.",
              "Le jeton donne accès au compte. L’atelier le stocke dans SecureStore et le supprime lors de la déconnexion.",
              "Le serveur vérifie signature, expiration et révocation avant de donner accès aux commandes.",
            ],
          ),
        ],
        files: projectExample(finance, "src/preferences.ts"),
        task: "Enregistre 30 jours, relance le tableau puis ouvre src/session.ts dans l’atelier Boutique pour retrouver les trois opérations SecureStore.",
        takeaway:
          "Une préférence et un identifiant de session demandent des protections différentes.",
        quiz: quiz(
          "Où l’atelier conserve-t-il le JWT ?",
          ["Dans l’URL du projet", "Dans AsyncStorage", "Dans SecureStore"],
          2,
          "SecureStore est prévu pour les petites valeurs sensibles comme un jeton.",
        ),
        link: expoDocs + "develop/user-interface/store-data/",
      }),
    ],
  },
  {
    id: "zustand-et-typescript",
    title: "Zustand, commandes et TypeScript",
    description:
      "Orchestre une boutique et vérifie la forme des données externes.",
    lessons: [
      lesson({
        id: "store-zustand-boutique",
        title: "Partager un panier et des commandes avec Zustand",
        minutes: 24,
        summary:
          "Le store expose les produits, les quantités et l’historique. Ses actions chargent la boutique et envoient le panier.",
        sections: [
          section(
            "Garder les règles dans le store",
            "change calcule la nouvelle quantité. place transmet les identifiants et les quantités puis reçoit la commande enregistrée.",
            [
              "La clé de requête reste identique quand le même panier est renvoyé. Le serveur réutilise la commande pour éviter un doublon.",
              "L’API calcule le montant et vérifie le compte. L’écran lit la réponse pour mettre à jour l’historique.",
            ],
          ),
        ],
        files: projectExample(shop, "src/shop.ts"),
        task: "Démarre l’API locale, ajoute deux produits et vérifie leur commande depuis l’onglet Commandes.",
        takeaway:
          "Le store coordonne l’interface. Le serveur valide et conserve les commandes.",
        quiz: quiz(
          "Qui calcule le montant enregistré de la commande ?",
          ["Le serveur", "Le texte du bouton", "Le fichier Expo Go"],
          0,
          "L’API utilise son catalogue et les quantités validées.",
        ),
        link: "https://zustand.docs.pmnd.rs/getting-started/introduction",
      }),
      lesson({
        id: "types-et-validation-react-native",
        title: "Typer l’interface et vérifier les données reçues",
        minutes: 22,
        summary:
          "TypeScript décrit les objets utilisés dans le code. Une réponse réseau peut contenir une valeur inattendue et doit être vérifiée au moment de sa lecture.",
        sections: [
          section(
            "Passer de unknown à RatePoint",
            "parseRates vérifie la structure, la paire EUR/USD, la date et le taux numérique. Le tableau reçoit ensuite des points triés.",
            [
              "Un type Axios documente la réponse attendue. La vérification des champs protège aussi à l’exécution.",
              "Les types Product, Order et Session décrivent le contrat de la boutique.",
            ],
          ),
        ],
        files: projectExample(finance, "src/rates.ts"),
        task: "Repère les champs de RatePoint. Simule une valeur de taux textuelle et observe son rejet.",
        takeaway:
          "Le type aide à écrire le code. La validation vérifie les données réellement reçues.",
        quiz: quiz(
          "Que doit faire parseRates si rate vaut une chaîne ?",
          [
            "Convertir toute chaîne en prix",
            "Ignorer le point invalide",
            "Changer la devise",
          ],
          1,
          "Le tableau utilise uniquement des taux numériques valides.",
        ),
        link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      }),
    ],
  },
  {
    id: "reanimated-react-native",
    title: "Graphique et animations avec Reanimated",
    description:
      "Transforme des points datés en graphique et anime leur apparition.",
    lessons: [
      lesson({
        id: "serie-et-graphique-mobile",
        title: "Construire des barres à partir d’une série datée",
        minutes: 22,
        summary:
          "Le tableau construit ses barres à partir de taux vérifiés. Chaque hauteur représente l’écart relatif au minimum de la période.",
        sections: [
          section(
            "Échantillonner sans perdre les bornes",
            "Le graphique choisit des points répartis sur la série et conserve le dernier. Les dates aux extrémités donnent le contexte.",
            [
              "Les valeurs de référence peuvent manquer certains jours. Le dernier taux affiche toujours sa date.",
              "Un libellé accessible associe la date et la valeur de chaque barre.",
            ],
          ),
        ],
        files: finance.files,
        task: "Compare les dates et les barres des périodes 7 et 30 jours. Repère la dernière valeur disponible.",
        takeaway:
          "Les hauteurs du graphique et les libellés décrivent deux aspects de la même série.",
        quiz: quiz(
          "Pourquoi afficher la date du dernier taux ?",
          [
            "Pour changer le type du graphique",
            "Pour démarrer la requête",
            "Pour connaître la date de la valeur visible",
          ],
          2,
          "La dernière valeur publiée peut précéder la date d’ouverture.",
        ),
        link: "https://frankfurter.dev/javascript/",
      }),
      lesson({
        id: "sharedvalue-withtiming-reanimated",
        title: "Animer la transition avec useSharedValue et withTiming",
        minutes: 24,
        summary:
          "Reanimated fait évoluer une valeur partagée entre 0 et 1. Le style animé transforme cette valeur en opacité et en échelle verticale.",
        sections: [
          section(
            "Déclencher au changement de données",
            "Le graphique réinitialise la progression lorsque les points changent. withTiming l’anime vers 1 sur une courte durée.",
            [
              "useAnimatedStyle relie la progression au composant Animated.View.",
              "ReduceMotion.System suit le réglage d’accessibilité du téléphone. Les données restent lisibles avec ou sans animation.",
            ],
          ),
        ],
        files: finance.files,
        task: "Change de période puis active la réduction des mouvements dans les réglages du téléphone. Refais la transition.",
        takeaway:
          "La valeur animée décrit le mouvement sans modifier les taux de la série.",
        quiz: quiz(
          "Quel paramètre prend en compte la préférence de mouvement ?",
          ["ReduceMotion.System", "keyExtractor", "timeout"],
          0,
          "Le réglage système peut raccourcir ou supprimer la transition.",
        ),
        link: "https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming/",
      }),
    ],
  },
];

export const expoLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Composants, Flexbox et état local",
    objective:
      "Lance un projet Expo et rends ses composants natifs interactifs.",
    definition:
      "React Native utilise React et JavaScript ou TypeScript pour décrire des écrans iOS et Android avec des composants mobiles. Expo prépare les outils pour lancer le projet et l’essayer.",
    color: levelColors[0],
    prerequisites:
      "Installe Node.js et prépare Expo Go compatible SDK 54 sur un téléphone ou un émulateur.",
    outcomes: [
      "Créer une interface avec View, Text, Image et un bouton.",
      "Aligner les éléments grâce à Flexbox.",
      "Relier un champ et des compteurs à useState.",
    ],
    chapters: beginner,
    projects: expoBeginnerProjects,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "FlatList, navigation et Context API",
    objective:
      "Affiche des collections et partage des données entre les écrans natifs.",
    color: levelColors[1],
    prerequisites: "Savoir utiliser un composant, ses props et son état.",
    outcomes: [
      "Afficher des listes avec des identifiants stables.",
      "Naviguer entre des onglets et des écrans de détail.",
      "Partager une sélection au moyen du contexte.",
    ],
    chapters: intermediate,
    projects: expoIntermediateProjects,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Axios, stockage, Zustand et Reanimated",
    objective:
      "Connecte une application à un serveur, persiste une préférence et anime des données.",
    color: levelColors[2],
    prerequisites:
      "Savoir créer une liste et partager un état entre plusieurs écrans.",
    outcomes: [
      "Gérer une requête Axios et valider ses données.",
      "Séparer les préférences et les jetons de connexion.",
      "Centraliser panier et commandes avec Zustand.",
      "Créer une animation Reanimated compatible avec la réduction des mouvements.",
    ],
    chapters: advanced,
    projects: [shop, finance],
  },
];
