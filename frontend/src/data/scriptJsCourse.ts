import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { jsInvoice, jsMonitor, jsWindow } from "./scriptJsProjects";
import type { WebLevel } from "./webCourseTypes";
const docs = "https://developer.mozilla.org/fr/docs/Web/JavaScript/";
const electron = "https://www.electronjs.org/docs/latest/";
const beginner: WebLevel["chapters"] = [
  {
    id: "js-script-demarrage",
    title: "Exécuter JavaScript avec Node.js",
    description: "Découvre le moteur de scripts et les variables modernes.",
    lessons: [
      lesson({
        id: "js-node-runtime",
        title: "Node.js, V8 et le fichier de script",
        minutes: 19,
        summary:
          "JavaScript décrit la logique du programme. Node.js est un environnement qui l’exécute sur ton ordinateur avec le moteur V8. console.log affiche une valeur dans la sortie standard.",
        sections: [
          section(
            "Lire le script",
            "Le fichier main.mjs utilise les modules JavaScript. Le service vérifie sa syntaxe puis demande à Node de l’exécuter.",
            [
              "Un moteur lit les instructions du langage.",
              "Un environnement ajoute les possibilités d’entrée, de sortie et d’accès au système.",
            ],
          ),
          section(
            "Lancer un premier essai",
            "Modifie la phrase puis utilise Exécuter le script. Sur ton ordinateur, node main.mjs lance ce même fichier depuis le terminal.",
            [
              "Les diagnostics indiquent le fichier et la ligne concernés.",
              "La convention .mjs précise que le fichier est un module ES.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'console.log("Bonjour DevAfrica !");\nconsole.log("Ce script s’exécute avec Node.js.");',
        ),
        task: "Ajoute une ligne avec ton prénom et ton objectif de la semaine.",
        takeaway:
          "Node.js apporte un environnement d’exécution à ton code JavaScript.",
        quiz: quiz(
          "Quelle commande lance le script exporté ?",
          ["node main.mjs", "tsc Main.java", "php main.cpp"],
          0,
          "Node exécute le fichier JavaScript fourni.",
        ),
        link: "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
      }),
      lesson({
        id: "js-let-const-portee",
        title: "let, const et la portée d’un bloc",
        minutes: 22,
        summary:
          "let déclare une variable réaffectable. const conserve la même liaison après l’initialisation. Les deux suivent la portée du bloc où elles sont déclarées.",
        sections: [
          section(
            "Choisir une intention",
            "Le prix reste fixe et la quantité évolue. Un objet référencé par const peut conserver la même identité tout en voyant ses propriétés modifiées.",
            [
              "Une déclaration de bloc est accessible dans ce bloc et ses sous-blocs.",
              "Les chaînes, nombres et booléens représentent des valeurs de base.",
            ],
          ),
          section(
            "Observer la réaffectation",
            "Le programme augmente la quantité puis modifie le nom du produit. Les deux changements concernent des données différentes.",
            [
              "Utilise let lorsque la variable doit recevoir une nouvelle valeur.",
              "Utilise const pour exprimer une liaison conservée.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'const prix = 2500;\nlet quantite = 2;\nquantite += 1;\nconst produit = { nom: "Clavier" };\nproduit.nom = "Clavier compact";\nconsole.log(produit.nom, prix * quantite, "Ar");',
        ),
        task: "Prédis le total puis modifie la quantité. Essaie une réaffectation de prix et lis l’erreur.",
        takeaway:
          "const fixe la liaison et la mutabilité du contenu dépend de la valeur référencée.",
        quiz: quiz(
          "Que permet const produit = {nom: 'A'} ?",
          [
            "Réaffecter produit à un autre objet",
            "Modifier produit.nom",
            "Déclarer une valeur sans initialisation",
          ],
          1,
          "La propriété peut évoluer tant que l’objet reste modifiable.",
        ),
        link: docs + "Guide/Grammar_and_types",
      }),
    ],
  },
  {
    id: "js-script-donnees",
    title: "Objets et tableaux",
    description: "Structure une donnée puis une collection.",
    lessons: [
      lesson({
        id: "js-objets-litteraux",
        title: "Décrire une donnée avec des propriétés",
        minutes: 20,
        summary:
          "Un objet littéral rassemble des propriétés nommées. Une propriété associe une clé à une valeur. Le point ou les crochets permettent de lire la propriété souhaitée.",
        sections: [
          section(
            "Identifier les champs",
            "Le produit conserve son nom, son prix en centimes et sa quantité. Ces valeurs peuvent être utilisées ensemble pour calculer une ligne de facture.",
            [
              "produit.nom lit la clé nom.",
              "Les crochets permettent d’utiliser une clé calculée dans une variable.",
            ],
          ),
          section(
            "Comprendre la référence",
            "Une affectation d’objet copie une référence. Deux variables peuvent donc accéder au même objet.",
            [
              "Un nouvel objet littéral crée une nouvelle identité.",
              "Choisis des champs qui expriment clairement l’unité des nombres.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'const produit = { nom: "Clavier", prixCentimes: 2500, quantite: 2 };\nconst cle = "nom";\nconsole.log(produit[cle]);\nconsole.log("Ligne en centimes", produit.prixCentimes * produit.quantite);\nconst alias = produit;\nalias.quantite = 3;\nconsole.log("Quantité courante", produit.quantite);',
        ),
        task: "Ajoute une propriété categorie puis crée un second produit avec ses propres valeurs.",
        takeaway:
          "Un objet donne une structure nommée aux données et peut être partagé par référence.",
        quiz: quiz(
          "Comment lire la propriété correspondant à une variable cle ?",
          ["produit.cle dans tous les cas", "produit(cle)", "produit[cle]"],
          2,
          "Les crochets évaluent la variable utilisée comme clé.",
        ),
        link: docs + "Guide/Working_with_objects",
      }),
      lesson({
        id: "js-array-push-pop",
        title: "Ajouter et retirer dans un tableau",
        minutes: 21,
        summary:
          "Un Array conserve une suite ordonnée d’éléments. push ajoute à la fin et pop retire puis renvoie le dernier élément. length donne la taille courante.",
        sections: [
          section(
            "Suivre la collection",
            "Le tableau commence avec deux articles. push ajoute une troisième valeur et pop retire celle qui vient d’être ajoutée.",
            [
              "Le premier indice est zéro.",
              "Une lecture hors des éléments présents produit généralement undefined.",
            ],
          ),
          section(
            "Préparer les traitements",
            "La facture représente chaque article par un objet dans un tableau. Le parcours associe alors la liste et les champs métier.",
            [
              "Vérifie la présence d’un élément avant d’utiliser ses propriétés.",
              "Une collection vide doit aussi avoir un comportement défini.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'const articles = ["Clavier", "Souris"];\narticles.push("Écran");\nconsole.log(articles, articles.length);\nconst dernier = articles.pop();\nconsole.log("Retiré", dernier);\nconsole.log("Restants", articles);',
        ),
        task: "Ajoute deux articles puis retire-en un et prédis la taille finale.",
        takeaway:
          "Les opérations de tableau modifient la collection selon un ordre précis.",
        quiz: quiz(
          "Que renvoie pop ?",
          [
            "L’élément retiré en fin de tableau",
            "La nouvelle longueur dans tous les cas",
            "Le premier élément uniquement",
          ],
          0,
          "pop retire et renvoie le dernier élément, ou undefined si le tableau est vide.",
        ),
        link: docs + "Reference/Global_Objects/Array",
      }),
    ],
  },
  {
    id: "js-script-logique",
    title: "Algorithmes et fonctions",
    description: "Parcours des articles et sépare les calculs.",
    lessons: [
      lesson({
        id: "js-controle-strict",
        title: "Comparaisons strictes et for…of",
        minutes: 22,
        summary:
          "=== compare des valeurs en tenant compte de leur type. for…of parcourt les valeurs d’une collection. Une condition peut sélectionner les éléments à prendre en compte.",
        sections: [
          section(
            "Suivre l’algorithme",
            "Le total part de zéro. Chaque quantité strictement positive est ajoutée au cumul. Les valeurs nulles sont ignorées par la condition.",
            [
              "!== exprime la différence stricte.",
              "while convient à une répétition pilotée par une condition qui évolue.",
            ],
          ),
          section(
            "Vérifier les types",
            "Le nombre 3 et la chaîne '3' sont des valeurs de types différents. Une conversion explicite peut être réalisée après validation de la saisie.",
            [
              "Number.isFinite vérifie un nombre fini.",
              "Une conversion numérique doit être suivie des vérifications métier nécessaires.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'const quantites = [2, 0, 3];\nlet total = 0;\nfor (const quantite of quantites) {\n    if (quantite > 0) total += quantite;\n}\nconsole.log("Total", total);\nconsole.log("Égalité stricte", 3 === Number("3"));\nlet restant = 2;\nwhile (restant > 0) { console.log("Encore", restant); restant--; }',
        ),
        task: "Ajoute une quantité de quatre puis vérifie le nouveau total.",
        takeaway:
          "La condition exprime le choix et le parcours applique le traitement à chaque élément.",
        quiz: quiz(
          "Que parcourt for…of sur un tableau ?",
          [
            "Les noms des variables",
            "Les valeurs de ses éléments",
            "Les fichiers du dossier",
          ],
          1,
          "for…of fournit les valeurs successives de la collection.",
        ),
        link: docs + "Guide/Loops_and_iteration",
      }),
      lesson({
        id: "js-fleche-retour",
        title: "Fonctions fléchées et résultat d’un calcul",
        minutes: 23,
        summary:
          "Une fonction fléchée rassemble un traitement sous un nom. Ses paramètres reçoivent les arguments. Une expression après la flèche peut être renvoyée directement.",
        sections: [
          section(
            "Décomposer une facture",
            "totalLigne calcule le montant d’un article. Le cumul et la taxe deviennent ensuite des étapes lisibles.",
            [
              "Une fonction à bloc utilise return pour transmettre son résultat.",
              "Un calcul peut être testé avec de petites valeurs connues.",
            ],
          ),
          section(
            "Gérer les unités",
            "Le projet conserve les montants en centimes et arrondit la taxe d’exercice avant l’affichage en euros.",
            [
              "Le taux utilisé est une donnée fictive pour l’exercice.",
              "Un prix et une quantité doivent être vérifiés avant le calcul.",
            ],
          ),
        ],
        files: jsInvoice.files,
        task: "Extrais le calcul prixCentimes × quantite dans une fonction totalLigne puis vérifie la facture.",
        takeaway:
          "Une fonction exprime un calcul réutilisable avec des paramètres et un résultat.",
        quiz: quiz(
          "Que renvoie (a, b) => a + b ?",
          [
            "Une chaîne systématiquement",
            "Le premier argument uniquement",
            "Le résultat de l’expression a + b",
          ],
          2,
          "La forme à expression renvoie directement son résultat.",
        ),
        link: docs + "Reference/Functions/Arrow_functions",
      }),
    ],
  },
];
const intermediate: WebLevel["chapters"] = [
  {
    id: "js-transformations",
    title: "Transformer et filtrer",
    description: "Manipule les collections avec des fonctions de rappel.",
    lessons: [
      lesson({
        id: "js-map",
        title: "Créer une nouvelle liste avec map",
        minutes: 22,
        summary:
          "map appelle une fonction pour chaque élément et rassemble les résultats dans un nouveau tableau. L’élément d’origine reste disponible pour les autres traitements.",
        sections: [
          section(
            "Décrire la transformation",
            "La fonction de rappel reçoit un produit et renvoie son nom. Le tableau noms contient les résultats dans le même ordre.",
            [
              "map exprime une transformation par élément.",
              "Un objet renvoyé peut partager des références si tu réutilises ses propriétés objets.",
            ],
          ),
          section(
            "Rendre l’effet visible",
            "Le code utilise une seconde transformation pour calculer des prix. Compare les tableaux de départ et de sortie.",
            [
              "Retourne explicitement une valeur dans une fonction à bloc.",
              "Une fonction de rappel courte peut rester très lisible sur plusieurs lignes.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'const produits = [{ nom: "Clavier", prix: 25 }, { nom: "Souris", prix: 12 }];\nconst noms = produits.map(produit => produit.nom);\nconst prix = produits.map(produit => produit.prix * 2);\nconsole.log(noms);\nconsole.log(prix);\nconsole.log(produits);',
        ),
        task: "Transforme chaque produit en un objet contenant son nom et un prix majoré de dix pour cent.",
        takeaway:
          "map rassemble les résultats d’une transformation dans un nouveau tableau.",
        quiz: quiz(
          "Combien de résultats map produit-il ici pour deux produits ?",
          ["Deux", "Un seul", "Zéro"],
          0,
          "map produit un résultat par élément présent parcouru dans cet exemple.",
        ),
        link: docs + "Reference/Global_Objects/Array/map",
      }),
      lesson({
        id: "js-filter-reduce",
        title: "Sélectionner avec filter et cumuler avec reduce",
        minutes: 23,
        summary:
          "filter conserve les éléments pour lesquels le rappel est vrai. reduce rassemble les éléments dans un accumulateur. Une valeur initiale explicite rend le cas vide prévisible.",
        sections: [
          section(
            "Séparer les étapes",
            "Le filtre conserve les prix abordables. Le cumul additionne ensuite les valeurs retenues.",
            [
              "Le tableau initial reste disponible.",
              "Un accumulateur numérique peut commencer à zéro.",
            ],
          ),
          section(
            "Choisir un traitement lisible",
            "Une succession de transformations claires peut être répartie sur plusieurs variables. Le nom de chaque étape décrit le résultat intermédiaire.",
            [
              "Une boucle reste adaptée quand elle exprime mieux le traitement.",
              "Teste une sélection vide pour vérifier le total initial.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'const prix = [12, 25, 80];\nconst abordables = prix.filter(valeur => valeur <= 30);\nconst total = abordables.reduce((somme, valeur) => somme + valeur, 0);\nconsole.log("Retenus", abordables);\nconsole.log("Total", total);',
        ),
        task: "Passe la limite à dix puis vérifie que le total de la sélection vide vaut zéro.",
        takeaway:
          "filter sélectionne et reduce combine avec un accumulateur initial.",
        quiz: quiz(
          "Que renvoie le rappel de filter ?",
          [
            "Le chemin du fichier",
            "Une valeur évaluée comme vraie ou fausse",
            "Toujours un tableau",
          ],
          1,
          "Le résultat du rappel décide si l’élément est conservé.",
        ),
        link: docs + "Reference/Global_Objects/Array/filter",
      }),
    ],
  },
  {
    id: "js-electron-architecture",
    title: "Premiers pas dans Electron",
    description: "Distingue le lancement du logiciel et son écran.",
    lessons: [
      lesson({
        id: "js-electron-main",
        title: "Processus principal et BrowserWindow",
        minutes: 26,
        summary:
          "Electron assemble un environnement de bureau avec Node.js et Chromium. Le processus principal gère le cycle du logiciel et crée une BrowserWindow qui accueille un processus de rendu.",
        sections: [
          section(
            "Configurer le projet",
            "package.json désigne main.cjs comme point d’entrée. npm start lance Electron après l’installation de ses dépendances.",
            [
              "Le guide du projet exporté indique les commandes.",
              "app.whenReady attend l’initialisation avant la création de fenêtre.",
            ],
          ),
          section(
            "Construire la fenêtre",
            "Les dimensions initiales sont données à BrowserWindow puis center la place au centre de l’écran.",
            [
              "minWidth et minHeight limitent la réduction de la fenêtre.",
              "loadFile demande le chargement d’une page du projet.",
            ],
          ),
        ],
        files: jsWindow.files,
        task: "Exporte le projet et change le titre ainsi que les dimensions initiales.",
        takeaway:
          "Le processus principal prépare l’application et crée ses fenêtres.",
        quiz: quiz(
          "Quel objet crée la fenêtre Electron ?",
          ["Array", "console", "BrowserWindow"],
          2,
          "BrowserWindow représente la fenêtre gérée par le processus principal.",
        ),
        link: "https://www.electronjs.org/fr/docs/latest/tutorial/tutorial-first-app",
      }),
      lesson({
        id: "js-electron-renderer",
        title: "Comprendre le processus de rendu",
        minutes: 23,
        summary:
          "Le processus de rendu présente la page locale et ses styles. Le projet de lancement affiche une carte d’accueil dans sa propre fenêtre logicielle.",
        sections: [
          section(
            "Lire les fichiers",
            "index.html décrit le contenu et style.css organise sa présentation. Le processus principal choisit quel fichier local charger.",
            [
              "La page et le processus principal ont des responsabilités distinctes.",
              "Le rendu utilise les composants standards de sa page.",
            ],
          ),
          section(
            "Connaître les possibilités de la vue",
            "Le projet conserve contextIsolation et le sandbox de rendu. Les actions système seront ajoutées au niveau avancé par une API de preload limitée.",
            [
              "nodeIntegration est désactivé dans cette vue.",
              "Une politique CSP précise les sources autorisées pour les ressources.",
            ],
          ),
        ],
        files: projectExample(jsWindow, "index.html"),
        task: "Personnalise la carte d’accueil et son fichier CSS puis relance la fenêtre.",
        takeaway:
          "Le rendu présente l’écran que le processus principal a chargé.",
        quiz: quiz(
          "Quel fichier présente le contenu de cette fenêtre ?",
          ["index.html", "package-lock.json", "main.cjs uniquement"],
          0,
          "loadFile charge index.html dans le processus de rendu.",
        ),
        link: electron + "tutorial/process-model",
      }),
    ],
  },
  {
    id: "js-electron-cycle",
    title: "Cycle de vie des fenêtres",
    description: "Gère l’ouverture, la réactivation et la fermeture.",
    lessons: [
      lesson({
        id: "js-electron-fermeture",
        title: "whenReady et window-all-closed",
        minutes: 24,
        summary:
          "Une application de bureau possède un cycle de vie. whenReady marque l’initialisation terminée et window-all-closed annonce la fermeture de toutes les fenêtres.",
        sections: [
          section(
            "Prévoir la fin",
            "Le projet quitte lorsque toutes les fenêtres sont fermées sur les plateformes où ce comportement est attendu. macOS peut conserver l’application active après la fermeture de sa fenêtre.",
            [
              "process.platform permet de distinguer la convention macOS.",
              "app.quit demande la fermeture du logiciel.",
            ],
          ),
          section(
            "Réactiver le logiciel",
            "Sur activate, le programme vérifie si une fenêtre existe et en crée une si nécessaire.",
            [
              "Une fonction creerFenetre centralise le même démarrage.",
              "Un lancement puis une fermeture vérifient le parcours minimal.",
            ],
          ),
        ],
        files: jsWindow.files,
        task: "Retrouve les trois événements de cycle de vie et explique leur rôle dans le projet.",
        takeaway:
          "Les événements d’application organisent la création et la fin des fenêtres.",
        quiz: quiz(
          "Quel événement annonce la fermeture de toutes les fenêtres ?",
          ["clicked", "window-all-closed", "input"],
          1,
          "Electron émet window-all-closed quand la dernière fenêtre a fermé.",
        ),
        link: electron + "api/app",
      }),
      lesson({
        id: "js-electron-fichiers",
        title: "Chemins locaux et options de fenêtre",
        minutes: 23,
        summary:
          "Un logiciel doit retrouver ses ressources depuis son propre dossier. path.join associe les segments du chemin et __dirname donne le dossier du module CommonJS.",
        sections: [
          section(
            "Rendre le chemin explicite",
            "loadFile reçoit le chemin construit depuis __dirname. Le lancement reste ainsi indépendant du dossier de départ du terminal.",
            [
              "Le fichier CSS est référencé relativement à la page.",
              "Un projet exporté garde tous les fichiers nécessaires dans son dossier.",
            ],
          ),
          section(
            "Tester le comportement",
            "Le projet bloque les ouvertures de fenêtres supplémentaires et les navigations de la vue pour conserver son écran local.",
            [
              "Vérifie les dimensions minimales et le redimensionnement.",
              "Les options webPreferences définissent l’environnement du rendu.",
            ],
          ),
        ],
        files: jsWindow.files,
        task: "Déplace le dossier extrait puis lance le logiciel depuis ce nouveau dossier et vérifie ses ressources.",
        takeaway:
          "Les chemins du projet doivent être construits à partir de son emplacement connu.",
        quiz: quiz(
          "Que donne __dirname dans ce module ?",
          [
            "Le dossier du fichier courant",
            "Le nom du système",
            "Le nombre de fenêtres",
          ],
          0,
          "__dirname donne le répertoire du module CommonJS.",
        ),
        link: "https://nodejs.org/api/path.html",
      }),
    ],
  },
];
const advanced: WebLevel["chapters"] = [
  {
    id: "js-script-async",
    title: "Promesses et asynchronisme",
    description: "Organise une attente et ses erreurs.",
    lessons: [
      lesson({
        id: "js-promesses",
        title: "Une valeur disponible plus tard",
        minutes: 25,
        summary:
          "Une Promise représente l’issue future d’une opération. async fait renvoyer une promesse à une fonction et await suspend son déroulement jusqu’à cette issue.",
        sections: [
          section(
            "Observer l’ordre",
            "Le minuteur demande une attente. Le message de départ arrive avant le résultat et la suite de la fonction reprend lorsque l’attente est terminée.",
            [
              "Une attente permet au moteur de traiter d’autres événements.",
              "Un calcul synchrone coûteux occupe encore le thread qui l’exécute.",
            ],
          ),
          section(
            "Relier au moniteur",
            "Le rendu demande une mesure système puis attend la réponse. Le prochain rafraîchissement est planifié après cette réponse.",
            [
              "Une fonction asynchrone peut renvoyer une valeur simple qui devient le résultat de sa promesse.",
              "Le déroulement séquentiel après await reste facile à suivre.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'import { setTimeout as attendre } from "node:timers/promises";\n\nasync function mesurer() {\n    await attendre(100);\n    return { disponible: true };\n}\nconsole.log("Départ");\nconst mesure = await mesurer();\nconsole.log("Résultat", mesure);',
        ),
        task: "Ajoute un message avant puis après await et décris l’ordre observé.",
        takeaway:
          "await reprend la fonction lorsque la promesse attendue est résolue ou rejetée.",
        quiz: quiz(
          "Que renvoie une fonction async ?",
          ["Toujours une chaîne", "Toujours undefined", "Une promesse"],
          2,
          "Le résultat d’une fonction async est représenté par une Promise.",
        ),
        link: docs + "Reference/Statements/async_function",
      }),
      lesson({
        id: "js-erreurs-async",
        title: "try, catch et finally avec await",
        minutes: 24,
        summary:
          "Une promesse rejetée provoque une erreur au point de son await. try et catch organisent son traitement. finally termine l’action commune après réussite ou échec.",
        sections: [
          section(
            "Suivre les deux chemins",
            "charger accepte ou refuse selon son paramètre. Le même appelant affiche un résultat ou un message d’erreur puis termine son essai.",
            [
              "Le catch reçoit l’erreur du rejet attendu.",
              "L’erreur peut être expliquée avant une nouvelle tentative.",
            ],
          ),
          section(
            "Préserver le rafraîchissement",
            "Le moniteur utilise finally pour prévoir une prochaine mesure tant que sa fenêtre est active.",
            [
              "Un setTimeout après la réponse évite l’empilement des demandes.",
              "La fermeture doit empêcher la programmation du prochain essai.",
            ],
          ),
        ],
        files: consoleFiles(
          "nodejs",
          'async function charger(disponible) {\n    if (!disponible) throw new Error("Mesure indisponible");\n    return 42;\n}\nfor (const disponible of [true, false]) {\n    try { console.log("Valeur", await charger(disponible)); }\n    catch (erreur) { console.log("À réessayer", erreur.message); }\n    finally { console.log("Essai terminé"); }\n}',
        ),
        task: "Ajoute un troisième essai qui réussit après l’échec.",
        takeaway:
          "Le traitement d’erreur rend le résultat de l’attente explicite pour l’appelant.",
        quiz: quiz(
          "Quel bloc est exécuté après réussite ou échec ?",
          ["catch uniquement", "finally", "import"],
          1,
          "finally organise la fin commune de l’opération.",
        ),
        link: docs + "Guide/Using_promises",
      }),
    ],
  },
  {
    id: "js-ipc",
    title: "Pont entre rendu et système",
    description: "Expose une action précise et récupère sa réponse.",
    lessons: [
      lesson({
        id: "js-preload",
        title: "contextBridge et le preload",
        minutes: 27,
        summary:
          "Le preload prépare un pont entre les contextes de la fenêtre. contextBridge expose ici une unique méthode lireSysteme que la page peut appeler.",
        sections: [
          section(
            "Définir une API limitée",
            "La page appelle window.atelier.lireSysteme. Le preload effectue une demande sur le canal systeme:mesure et renvoie sa promesse.",
            [
              "Le nom du canal décrit l’opération autorisée.",
              "La vue reçoit les données nécessaires à son affichage.",
            ],
          ),
          section(
            "Relier les fichiers",
            "BrowserWindow reçoit le chemin de preload.cjs dans ses options. contextIsolation garde les contextes séparés.",
            [
              "Le processus principal possède l’accès à os.",
              "La page consomme l’API du pont pour obtenir sa mesure.",
            ],
          ),
        ],
        files: projectExample(jsMonitor, "preload.cjs"),
        task: "Suis le nom systeme:mesure du preload jusqu’au gestionnaire principal.",
        takeaway:
          "Le preload expose les opérations dont la vue a besoin par un contrat précis.",
        quiz: quiz(
          "Quel appel expose l’API à la page ?",
          ["contextBridge.exposeInMainWorld", "os.totalmem", "console.log"],
          0,
          "contextBridge publie ici l’objet atelier dans le monde de la page.",
        ),
        link: electron + "tutorial/context-isolation",
      }),
      lesson({
        id: "js-ipc-demande",
        title: "ipcMain.handle et ipcRenderer.invoke",
        minutes: 28,
        summary:
          "invoke envoie une demande avec réponse et handle enregistre le traitement côté principal. La promesse représente le résultat reçu par le rendu.",
        sections: [
          section(
            "Contrôler l’appel",
            "Le gestionnaire vérifie que la demande vient de la fenêtre et de sa page locale attendues avant de fournir la mesure.",
            [
              "L’expéditeur et le canal identifient le contexte de la demande.",
              "Les mesures sont renvoyées sous forme d’objet sérialisable.",
            ],
          ),
          section(
            "Comparer les échanges",
            "send et on servent aux messages sans réponse directe. invoke et handle organisent ici une demande que la vue peut attendre avec await.",
            [
              "Le projet utilise le mécanisme avec réponse pour ses mesures.",
              "Une erreur du gestionnaire devient un rejet traité dans le rendu.",
            ],
          ),
        ],
        files: jsMonitor.files,
        task: "Repère les vérifications de l’expéditeur puis le retour de lireSysteme.",
        takeaway:
          "Le canal IPC relie une demande du rendu au traitement autorisé du processus principal.",
        quiz: quiz(
          "Quelle paire convient à une demande avec réponse ?",
          ["push et pop", "invoke et handle", "grid et pack"],
          1,
          "invoke renvoie la réponse du gestionnaire handle sous forme de promesse.",
        ),
        link: electron + "tutorial/ipc",
      }),
    ],
  },
  {
    id: "js-monitoring",
    title: "Mesures et cycle de rafraîchissement",
    description: "Présente des données système et termine les minuteurs.",
    lessons: [
      lesson({
        id: "js-mesures-os",
        title: "Lire les données de mémoire vive",
        minutes: 25,
        summary:
          "Le module os fournit des informations du système où le processus principal s’exécute. totalmem et freemem renvoient des quantités en octets.",
        sections: [
          section(
            "Définir les unités",
            "La mémoire utilisée est calculée par différence entre le total et la mémoire disponible. La conversion en Gio divise par 1024 puissance trois.",
            [
              "Le pourcentage utilise mémoire utilisée divisée par mémoire totale.",
              "La mesure reçoit une date pour situer son affichage.",
            ],
          ),
          section(
            "Présenter les résultats",
            "Le rendu met à jour le texte et la barre de progression. Il garde un message compréhensible lorsque la demande échoue.",
            [
              "Le nombre de cœurs disponibles est une autre donnée du module os.",
              "Les valeurs dépendent de l’ordinateur qui lance le projet.",
            ],
          ),
        ],
        files: jsMonitor.files,
        task: "Repère les unités dans le principal puis leur conversion dans renderer.js.",
        takeaway:
          "Les unités et la date de mesure donnent un sens aux valeurs affichées.",
        quiz: quiz(
          "Dans quelle unité os.totalmem fournit-il sa valeur ?",
          ["En octets", "En pourcentage", "En secondes"],
          0,
          "totalmem renvoie le nombre d’octets de mémoire du système.",
        ),
        link: "https://nodejs.org/api/os.html",
      }),
      lesson({
        id: "js-minuteurs",
        title: "Rafraîchir sans superposer les demandes",
        minutes: 27,
        summary:
          "Le moniteur attend la réponse courante puis prévoit la suivante une seconde plus tard. Un indicateur de fermeture et clearTimeout terminent ce cycle lorsque la vue est quittée.",
        sections: [
          section(
            "Gérer l’attente en cours",
            "arrete est vérifié après await. Une réponse tardive peut alors terminer son traitement sans modifier la vue en fermeture.",
            [
              "Le timer est programmé dans finally tant que la session reste ouverte.",
              "Une seule mesure est active dans ce cycle.",
            ],
          ),
          section(
            "Tester le parcours",
            "Observe plusieurs mesures puis ferme la fenêtre. Relance pour vérifier que le cycle commence de nouveau dans la nouvelle session.",
            [
              "beforeunload termine le minuteur restant.",
              "Le principal retire sa référence quand la fenêtre est fermée.",
            ],
          ),
        ],
        files: projectExample(jsMonitor, "renderer.js"),
        task: "Passe la période à deux secondes et vérifie les dates affichées puis la fermeture.",
        takeaway:
          "Une tâche périodique doit organiser sa prochaine attente et sa fin de vie.",
        quiz: quiz(
          "Quand planifier ici la mesure suivante ?",
          [
            "Avant chaque frappe",
            "Au début de la compilation",
            "Après la fin de la demande courante",
          ],
          2,
          "Ce séquencement évite de superposer les mesures.",
        ),
        link: docs + "Reference/Global_Objects/Promise/finally",
      }),
    ],
  },
];
export const scriptJsLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Node.js, données et algorithmes",
    definition:
      "JavaScript est un langage exécuté ici par Node.js. Les scripts manipulent des valeurs, des objets et des collections depuis la console.",
    objective:
      "Écris des traitements de données et un récapitulatif de facture.",
    color: levelColors[0],
    prerequisites: "Savoir créer un fichier et lire la console.",
    outcomes: [
      "Choisir let ou const et comprendre la portée.",
      "Structurer des objets et des tableaux.",
      "Utiliser des fonctions fléchées et un parcours de données.",
    ],
    chapters: beginner,
    projects: [jsInvoice],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Transformations et Electron",
    definition:
      "Electron associe un processus principal à des processus de rendu pour construire une application de bureau avec JavaScript.",
    objective:
      "Transforme des collections puis ouvre ta première fenêtre autonome.",
    color: levelColors[1],
    prerequisites:
      "Comprendre tableaux et fonctions. Installer Node.js 24 pour Electron.",
    outcomes: [
      "Transformer avec map et sélectionner avec filter.",
      "Configurer BrowserWindow et une page locale.",
      "Gérer l’initialisation et la fermeture de l’application.",
    ],
    chapters: intermediate,
    projects: [jsWindow],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Asynchronisme et communication IPC",
    definition:
      "Une opération asynchrone représente son résultat par une promesse. Le pont IPC permet au rendu de demander des actions précises au processus principal.",
    objective:
      "Construis un moniteur système avec des mesures actualisées et un cycle de vie explicite.",
    color: levelColors[2],
    prerequisites:
      "Connaître le processus principal, le rendu et les callbacks.",
    outcomes: [
      "Utiliser async, await et la gestion des erreurs.",
      "Exposer une API de preload avec contextBridge.",
      "Lire une mesure et arrêter le rafraîchissement à la fermeture.",
    ],
    chapters: advanced,
    projects: [jsMonitor],
  },
];
