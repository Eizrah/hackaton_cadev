import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { tsProfiles, tsSupport, tsVotes } from "./typescriptProjects";
import type { WebLevel } from "./webCourseTypes";
const docs = "https://www.typescriptlang.org/docs/handbook/";
const gui = "https://docs.nodegui.org/docs/";
const beginner: WebLevel["chapters"] = [
  {
    id: "ts-bases",
    title: "Compilation et types",
    description:
      "Comprends la vérification statique avant d’exécuter le JavaScript.",
    lessons: [
      lesson({
        id: "ts-compilation",
        title: "TypeScript, tsc et JavaScript produit",
        minutes: 20,
        summary:
          "TypeScript ajoute des informations de type à JavaScript. tsc vérifie leur cohérence et produit du JavaScript. Le runtime exécute ensuite ce JavaScript.",
        sections: [
          section(
            "Suivre les deux étapes",
            "main.ts contient une annotation string. Après compilation, le JavaScript conserve les instructions utiles à l’exécution.",
            [
              "La console de cet atelier lance une vérification stricte avec tsc.",
              "Une erreur de type empêche ici le lancement grâce à noEmitOnError.",
            ],
          ),
          section(
            "Comprendre ce qui est vérifié",
            "Les types détectent des incompatibilités avant l’exécution. Les résultats mathématiques et les données externes demandent encore des règles et des essais.",
            [
              "Le compilateur explique la propriété ou le paramètre incompatible.",
              "Le projet exporté fournit package.json et tsconfig.json.",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          'const message: string = "Bonjour DevAfrica";\nconsole.log(message);',
        ),
        task: "Change le texte puis remplace volontairement sa valeur par un nombre et lis le diagnostic tsc.",
        takeaway:
          "TypeScript vérifie les types puis produit le code JavaScript exécuté.",
        quiz: quiz(
          "Quel outil vérifie ce fichier TypeScript ?",
          ["php", "tsc", "GtkApplication"],
          1,
          "tsc est le compilateur TypeScript utilisé pour cet atelier.",
        ),
        link: docs + "typescript-in-5-minutes.html",
      }),
      lesson({
        id: "ts-types-explicites",
        title: "string, number, boolean et inférence",
        minutes: 22,
        summary:
          "Une annotation de type décrit les valeurs autorisées. string représente un texte, number les nombres JavaScript et boolean une valeur logique. TypeScript peut aussi inférer un type depuis l’initialisation.",
        sections: [
          section(
            "Lire les déclarations",
            "Le pseudo reçoit un texte et le compteur un nombre. Les annotations des exemples rendent le contrat visible à l’apprenant.",
            [
              "let permet une réaffectation compatible avec le type.",
              "const garde la même liaison après son initialisation.",
            ],
          ),
          section(
            "Choisir les vérifications utiles",
            "number inclut les valeurs flottantes et les valeurs particulières comme NaN. Une règle métier peut exiger un entier positif avec Number.isInteger.",
            [
              "Le type statique et la contrainte métier ont des rôles complémentaires.",
              "Le message du compilateur aide à retrouver l’affectation incompatible.",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          'let pseudo: string = "Tiana";\nlet points: number = 3;\nconst actif: boolean = true;\npoints += 2;\npseudo = pseudo.toUpperCase();\nconsole.log(pseudo, points, actif);',
        ),
        task: "Ajoute une variable pays puis une fonction qui affiche les données du profil.",
        takeaway:
          "Un type décrit les valeurs attendues et l’inférence peut le déterminer depuis le code.",
        quiz: quiz(
          "Quel type convient à true ?",
          ["boolean", "string", "number[]"],
          0,
          "boolean représente true et false.",
        ),
        link: docs + "2/everyday-types.html",
      }),
    ],
  },
  {
    id: "ts-structures",
    title: "Interfaces et formes de données",
    description: "Exprime les propriétés attendues d’un objet.",
    lessons: [
      lesson({
        id: "ts-interfaces",
        title: "Définir le contrat d’un profil",
        minutes: 23,
        summary:
          "Une interface décrit la forme attendue d’un objet. Ses propriétés obligatoires doivent être présentes et leurs valeurs doivent correspondre aux types déclarés.",
        sections: [
          section(
            "Décrire un compte",
            "CompteUtilisateur annonce id, pseudo et email. L’objet tiana est vérifié au moment de son affectation à ce type.",
            [
              "Le compilateur indique un champ obligatoire manquant.",
              "L’interface sert à la vérification du code et est effacée dans la sortie JavaScript.",
            ],
          ),
          section(
            "Réutiliser le contrat",
            "Une fonction peut recevoir le même type pour présenter un compte. Le contrat est partagé entre la création et le traitement.",
            [
              "Plusieurs objets peuvent respecter la même interface.",
              "Une interface décrit une forme, un constructeur crée une instance.",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          'interface CompteUtilisateur {\n    id: number;\n    pseudo: string;\n    email: string;\n}\nconst tiana: CompteUtilisateur = { id: 1, pseudo: "Tiana", email: "tiana@example.com" };\nconsole.log(tiana.pseudo, tiana.email);',
        ),
        task: "Retire temporairement email pour lire le diagnostic puis restaure un objet valide.",
        takeaway:
          "Une interface partage un contrat de propriétés entre les parties du programme.",
        quiz: quiz(
          "Quand une interface vérifie-t-elle les propriétés ?",
          [
            "Après chaque clic automatiquement",
            "Dans le moteur SQL",
            "Pendant la vérification TypeScript",
          ],
          2,
          "Le compilateur vérifie les usages de l’interface dans le code.",
        ),
        link: docs + "2/objects.html",
      }),
      lesson({
        id: "ts-optionnels-unions",
        title: "Propriétés facultatives et unions",
        minutes: 23,
        summary:
          "Le symbole ? marque une propriété facultative. Une union exprime plusieurs possibilités. La lecture d’une valeur facultative doit tenir compte de son éventuelle absence.",
        sections: [
          section(
            "Décrire un portfolio facultatif",
            "portfolio peut contenir une chaîne ou être absent. L’opérateur ?? fournit un texte de remplacement lorsque la valeur est null ou undefined.",
            [
              "Une union comme 'junior' | 'senior' décrit des choix textuels précis.",
              "Le contrôle de flux réduit les possibilités à l’intérieur d’une branche.",
            ],
          ),
          section(
            "Préserver un usage clair",
            "Un champ facultatif doit être présenté selon son état réel. Le contrat décrit les cas que le code doit prendre en charge.",
            [
              "Les littéraux évitent les variations de libellé non prévues.",
              "L’option strict active des vérifications sur les valeurs absentes.",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          'interface Profil {\n    nom: string;\n    niveau: "junior" | "senior";\n    portfolio?: string;\n}\nconst profil: Profil = { nom: "Soa", niveau: "junior" };\nconsole.log(profil.nom, profil.portfolio ?? "Portfolio à ajouter");',
        ),
        task: "Ajoute un portfolio puis essaie un niveau hors des deux choix autorisés.",
        takeaway:
          "Les unions et les propriétés facultatives rendent les possibilités explicites.",
        quiz: quiz(
          "Que signifie portfolio?: string ?",
          [
            "La propriété peut être absente",
            "La propriété est toujours un nombre",
            "La propriété contient toujours une liste",
          ],
          0,
          "Le point d’interrogation marque une propriété facultative.",
        ),
        link: docs + "2/everyday-types.html",
      }),
    ],
  },
  {
    id: "ts-fonctions",
    title: "Fonctions et données inconnues",
    description: "Type les calculs et valide une entrée externe.",
    lessons: [
      lesson({
        id: "ts-fonctions-typees",
        title: "Paramètres et type de retour",
        minutes: 23,
        summary:
          "Une fonction typée annonce les données qu’elle reçoit et le résultat qu’elle renvoie. Le compilateur vérifie les arguments fournis lors de ses appels.",
        sections: [
          section(
            "Lire la signature",
            "calculerTaxe reçoit un prix numérique et renvoie un nombre. Une chaîne doit être convertie et validée avant son utilisation comme prix.",
            [
              "Le type de retour suit la liste des paramètres.",
              "void décrit une fonction qui effectue une action sans valeur de résultat utilisable.",
            ],
          ),
          section(
            "Conserver le sens du calcul",
            "Le taux de cet exercice est une constante fictive. Les prix utilisent des centimes entiers pour rendre l’arrondi visible.",
            [
              "Number.isInteger vérifie la contrainte sur les centimes.",
              "Une erreur de règle métier peut être levée à l’exécution.",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          'function calculerTaxe(prixCentimes: number): number {\n    if (!Number.isInteger(prixCentimes) || prixCentimes < 0) throw new Error("Prix en centimes attendu.");\n    return Math.round(prixCentimes * 0.20);\n}\nconsole.log("Taxe d’exercice", calculerTaxe(1250), "centimes");',
        ),
        task: "Ajoute une fonction totalTTC puis vérifie le résultat avec un prix de 1 250 centimes.",
        takeaway:
          "Le type de fonction exprime son contrat et les règles métier valident les valeurs.",
        quiz: quiz(
          "Que décrit : number après les paramètres ?",
          [
            "Le nom du fichier",
            "Le type de retour",
            "Le nombre d’appels autorisés",
          ],
          1,
          "Cette annotation annonce un résultat numérique.",
        ),
        link: docs + "2/functions.html",
      }),
      lesson({
        id: "ts-unknown-validation",
        title: "Valider unknown avant de lire les champs",
        minutes: 27,
        summary:
          "Une donnée reçue de JSON ou d’un autre système peut avoir une forme inconnue. unknown demande de vérifier cette forme avant d’utiliser ses propriétés.",
        sections: [
          section(
            "Vérifier à l’exécution",
            "estCompte examine l’objet et les types des champs. La fonction vérifie aussi des règles comme l’identifiant entier positif et la présence du pseudo.",
            [
              "Le prédicat valeur is CompteUtilisateur relie la validation au contrôle de flux TypeScript.",
              "Une assertion seule transmet une hypothèse au compilateur.",
            ],
          ),
          section(
            "Comparer les responsabilités",
            "L’interface guide le développement. La fonction de validation traite les valeurs réellement reçues pendant l’exécution.",
            [
              "Teste une propriété absente puis un type erroné.",
              "Après un résultat vrai, le code utilise les champs validés.",
            ],
          ),
        ],
        files: tsProfiles.files,
        task: "Ajoute un essai avec un email mal formé puis observe le rejet à l’exécution.",
        takeaway:
          "Les données externes doivent être vérifiées avant d’être utilisées comme un type attendu.",
        quiz: quiz(
          "Que fait un prédicat valeur is CompteUtilisateur ?",
          [
            "Il chiffre le compte",
            "Il installe NodeGui",
            "Il relie le test à la réduction du type dans la branche vraie",
          ],
          2,
          "Le prédicat permet au compilateur de reconnaître le type après une validation vraie.",
        ),
        link: docs + "2/narrowing.html",
      }),
    ],
  },
];
const intermediate: WebLevel["chapters"] = [
  {
    id: "ts-objets",
    title: "Classes typées et visibilité",
    description: "Protège les opérations de ton modèle dans le code.",
    lessons: [
      lesson({
        id: "ts-classe-privee",
        title: "Attribut privé et méthode publique",
        minutes: 24,
        summary:
          "Une classe rassemble un état et des méthodes. private limite l’accès direct à un attribut pendant la vérification TypeScript. Les méthodes publiques présentent les opérations prévues.",
        sections: [
          section(
            "Décrire le modèle",
            "Urne conserve nombreVotes et propose voter ainsi que total. La vue demande un vote par la méthode prévue.",
            [
              "private de TypeScript est un contrôle de type.",
              "Les champs JavaScript #prives proposent aussi une confidentialité imposée à l’exécution.",
            ],
          ),
          section(
            "Observer l’état",
            "Deux Urne possèdent leurs propres totaux. Une action sur l’une utilise la même logique tout en conservant l’état de l’autre.",
            [
              "Le constructeur prépare les données nécessaires à l’instance.",
              "Une méthode peut renvoyer le nouveau résultat à afficher.",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          "class Urne {\n    private nombreVotes: number = 0;\n    voter(): number { return ++this.nombreVotes; }\n    total(): number { return this.nombreVotes; }\n}\nconst premiere = new Urne();\nconst seconde = new Urne();\npremiere.voter();\nconsole.log(premiere.total(), seconde.total());",
        ),
        task: "Ajoute une méthode reinitialiser puis teste les deux urnes.",
        takeaway:
          "Les méthodes donnent accès aux opérations autorisées du modèle typé.",
        quiz: quiz(
          "Que vérifie private dans cet exemple TypeScript ?",
          [
            "Les droits du système d’exploitation",
            "Les accès directs à l’attribut dans le code vérifié",
            "La présence du réseau",
          ],
          1,
          "Le compilateur contrôle l’accès à cet attribut privé.",
        ),
        link: docs + "2/classes.html",
      }),
      lesson({
        id: "ts-constructeur",
        title: "Initialiser une instance et utiliser protected",
        minutes: 25,
        summary:
          "Le constructeur prépare une nouvelle instance. protected rend un membre accessible à la classe et à ses classes dérivées pendant la vérification TypeScript.",
        sections: [
          section(
            "Initialiser les données communes",
            "Profil reçoit un nom que Developpeur réutilise dans sa méthode de présentation. Le constructeur dérivé transmet les données à super.",
            [
              "public ouvre l’accès depuis les appelants.",
              "protected permet l’accès depuis le code des sous-classes.",
            ],
          ),
          section(
            "Choisir une relation claire",
            "L’héritage exprime ici une spécialisation du profil. Un objet peut aussi contenir un autre objet lorsque cette relation convient au modèle.",
            [
              "La construction de la base précède l’utilisation de this dans le constructeur dérivé.",
              "Les annotations précisent les types de chaque donnée transmise.",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          'class Profil {\n    constructor(protected nom: string) {}\n}\nclass Developpeur extends Profil {\n    constructor(nom: string, private outil: string) { super(nom); }\n    presenter(): string { return this.nom + " utilise " + this.outil; }\n}\nconsole.log(new Developpeur("Tiana", "NodeGui").presenter());',
        ),
        task: "Crée une seconde instance puis ajoute une méthode qui présente son nom.",
        takeaway:
          "Le constructeur initialise l’objet et la visibilité décrit les accès prévus dans le code.",
        quiz: quiz(
          "Quel appel initialise la partie de base ?",
          ["super(nom)", "console.log(nom)", "private(nom)"],
          0,
          "super appelle le constructeur de la classe de base.",
        ),
        link: docs + "2/classes.html",
      }),
    ],
  },
  {
    id: "ts-nodegui",
    title: "Fenêtre native NodeGui",
    description: "Découvre les widgets Qt pilotés par TypeScript.",
    lessons: [
      lesson({
        id: "ts-qode",
        title: "NodeGui, Qt et le moteur Qode",
        minutes: 27,
        summary:
          "NodeGui relie JavaScript et TypeScript aux widgets Qt. Qode fournit le runtime qui fait fonctionner ensemble la boucle Node et la boucle d’événements Qt.",
        sections: [
          section(
            "Préparer le lancement",
            "Le ZIP déclare NodeGui et TypeScript dans package.json. Le guide décrit les outils natifs requis par la plateforme. npm start compile puis lance Qode.",
            [
              "La compilation vérifie le code TypeScript.",
              "Le module natif et son runtime doivent être compatibles.",
            ],
          ),
          section(
            "Construire la fenêtre",
            "QMainWindow reçoit un widget central. show demande son affichage. Une référence conservée maintient la fenêtre pendant la session.",
            [
              "Le titre et la taille initiale sont définis avant l’affichage.",
              "Les composants sont de vrais widgets Qt.",
            ],
          ),
        ],
        files: tsVotes.files,
        task: "Exporte le projet et suis son README puis modifie le titre de la fenêtre.",
        takeaway:
          "NodeGui utilise des widgets Qt et Qode permet leur cycle d’événements.",
        quiz: quiz(
          "Quel runtime lance la fenêtre de cet atelier ?",
          ["JVM", "PHP", "Qode"],
          2,
          "Qode est le runtime utilisé par les scripts de lancement NodeGui.",
        ),
        link: gui + "guides/getting-started/",
      }),
      lesson({
        id: "ts-widgets",
        title: "QLabel, QPushButton et widget central",
        minutes: 24,
        summary:
          "QLabel affiche le total et QPushButton propose l’action de vote. Le conteneur central reçoit un layout qui distribue ces composants.",
        sections: [
          section(
            "Lire l’arbre des widgets",
            "La fenêtre possède son conteneur central. Le layout de ce conteneur organise le titre, le total puis le bouton.",
            [
              "setText définit le texte d’un label ou d’un bouton.",
              "setInlineStyle ajoute les propriétés de présentation prises en charge par NodeGui.",
            ],
          ),
          section(
            "Organiser l’espace",
            "La direction column place les éléments l’un sous l’autre. Les marges et le padding créent une hiérarchie lisible.",
            [
              "Le parent et le layout organisent les widgets.",
              "Teste le redimensionnement et des textes plus longs.",
            ],
          ),
        ],
        files: tsVotes.files,
        task: "Ajoute un second label expliquant le thème du vote.",
        takeaway:
          "Le widget central rassemble le contenu de la fenêtre et son layout organise les enfants.",
        quiz: quiz(
          "Quel composant affiche le total ?",
          ["QLabel", "QLineEdit", "QComboBox"],
          0,
          "Le QLabel présente la valeur textuelle du total.",
        ),
        link: gui + "api/generated/classes/qlabel/",
      }),
    ],
  },
  {
    id: "ts-actions",
    title: "Événements typés et affichage",
    description: "Relie la vue aux méthodes du modèle.",
    lessons: [
      lesson({
        id: "ts-clicked",
        title: "Écouter clicked avec addEventListener",
        minutes: 25,
        summary:
          "Le bouton émet clicked lors de son activation. addEventListener enregistre la fonction qui demande un vote au modèle puis présente le total obtenu.",
        sections: [
          section(
            "Suivre l’événement",
            "Le rappel appelle urne.voter et transmet le résultat au label. L’instance urne existe pendant toute la session de cette fenêtre.",
            [
              "Le nom du signal est défini par le widget Qt.",
              "Le modèle porte les données et la vue présente le résultat.",
            ],
          ),
          section(
            "Vérifier l’effet",
            "Trois clics doivent afficher trois votes. Un second lancement construit une nouvelle urne initialisée à zéro.",
            [
              "Une fonction fléchée conserve les références utilisées par le rappel.",
              "La fonction est enregistrée avant les interactions de l’utilisateur.",
            ],
          ),
        ],
        files: tsVotes.files,
        task: "Clique trois fois puis fais ajouter deux votes à chaque action pour observer le changement.",
        takeaway:
          "Un écouteur relie un événement de widget à une méthode typée du modèle.",
        quiz: quiz(
          "Quand le rappel est-il appelé ?",
          [
            "À chaque compilation",
            "Lors de l’émission de clicked",
            "À chaque import du fichier CSS",
          ],
          1,
          "Le widget appelle le rappel enregistré lorsque son signal clicked est émis.",
        ),
        link: gui + "api/generated/classes/qpushbutton/",
      }),
      lesson({
        id: "ts-contrat-vue",
        title: "Séparer le modèle et la présentation",
        minutes: 23,
        summary:
          "urne.ts contient la logique de vote. main.ts construit les widgets et appelle cette logique. Les deux fichiers partagent les signatures contrôlées par TypeScript.",
        sections: [
          section(
            "Lire les imports",
            "export rend Urne disponible au module de la vue. import la récupère depuis le fichier voisin.",
            [
              "Le modèle peut être testé en console.",
              "Les composants graphiques restent dans le module d’interface.",
            ],
          ),
          section(
            "Faire évoluer un contrat",
            "Si voter change son type de résultat, les usages peuvent être vérifiés par le compilateur. L’interface doit ensuite présenter la valeur attendue.",
            [
              "Un nombre devient une chaîne pour le label.",
              "Une opération de validation doit rester proche des données qu’elle protège.",
            ],
          ),
        ],
        files: projectExample(tsVotes, "src/urne.ts"),
        task: "Ajoute un constructeur recevant le nombre initial de votes puis adapte main.ts.",
        takeaway:
          "Les modules séparent les responsabilités et les types relient leurs contrats.",
        quiz: quiz(
          "Quel fichier porte la logique de vote ?",
          ["src/urne.ts", "tsconfig.json", "README.md"],
          0,
          "Urne est définie dans src/urne.ts puis importée par la vue.",
        ),
        link: docs + "2/modules.html",
      }),
    ],
  },
];
const advanced: WebLevel["chapters"] = [
  {
    id: "ts-generiques",
    title: "Collections génériques",
    description: "Réutilise un traitement en conservant les types.",
    lessons: [
      lesson({
        id: "ts-generique",
        title: "Définir un paramètre de type T",
        minutes: 26,
        summary:
          "Un générique représente une relation entre les types d’entrée et de sortie. T est choisi selon l’usage et permet de conserver l’information pendant le traitement.",
        sections: [
          section(
            "Conserver le type du résultat",
            "premier<T> reçoit une collection de T et renvoie un T ou undefined si la liste est vide. Le même code fonctionne avec des textes ou des nombres.",
            [
              "Le paramètre de type peut être inféré depuis l’argument.",
              "Le retour exprime aussi le cas où la liste est vide.",
            ],
          ),
          section(
            "Éviter une perte d’information",
            "Le résultat texte peut être utilisé comme une chaîne après vérification de sa présence. Le résultat numérique conserve ses opérations de nombre.",
            [
              "Le générique décrit une relation de types.",
              "La logique de la fonction doit rester valide pour toutes les possibilités acceptées.",
            ],
          ),
        ],
        files: consoleFiles(
          "typescript",
          'function premier<T>(valeurs: readonly T[]): T | undefined {\n    return valeurs[0];\n}\nconst nom = premier(["Tiana", "Soa"]);\nconst note = premier([12, 16]);\nconsole.log(nom?.toUpperCase());\nconsole.log(note);',
        ),
        task: "Appelle la fonction avec une liste vide puis ajoute une version dernier.",
        takeaway:
          "Le générique conserve l’information de type à travers une fonction réutilisable.",
        quiz: quiz(
          "Que décrit T ?",
          [
            "Une variable globale de texte",
            "Un paramètre de type",
            "Le nom du compilateur",
          ],
          1,
          "T représente le type choisi pour cet usage de la fonction.",
        ),
        link: docs + "2/generics.html",
      }),
      lesson({
        id: "ts-contraintes",
        title: "Contraindre un dépôt avec extends",
        minutes: 27,
        summary:
          "Une contrainte générique demande que les valeurs possèdent une forme minimale. Depot<T extends {id: number}> peut ainsi comparer les identifiants de tous ses éléments.",
        sections: [
          section(
            "Exprimer le besoin minimal",
            "Le dépôt conserve les objets de type T et refuse les identifiants déjà présents. Les autres propriétés dépendent du modèle fourni.",
            [
              "La contrainte rend id accessible dans le code générique.",
              "Le type complet de l’élément est conservé lors de la lecture.",
            ],
          ),
          section(
            "Relier au support",
            "Support construit un Ticket puis le fournit au dépôt. La classe métier valide le titre et choisit le prochain identifiant.",
            [
              "Le dépôt porte la collection.",
              "Le modèle métier porte les règles des tickets.",
            ],
          ),
        ],
        files: projectExample(tsSupport, "src/modeles.ts"),
        task: "Repère la contrainte sur T et explique pourquoi le dépôt peut lire item.id.",
        takeaway:
          "La contrainte décrit les propriétés dont le traitement générique a besoin.",
        quiz: quiz(
          "Que garantit T extends {id: number} ?",
          [
            "Chaque élément possède un id numérique",
            "Chaque élément est un nombre seul",
            "Chaque tableau reste vide",
          ],
          0,
          "La contrainte exige une propriété id de type number.",
        ),
        link: docs + "2/generics.html#generic-constraints",
      }),
    ],
  },
  {
    id: "ts-choix-modeles",
    title: "Enums et règles du support",
    description: "Modélise les choix fixes et valide les données.",
    lessons: [
      lesson({
        id: "ts-enums",
        title: "Priorités et statuts nommés",
        minutes: 24,
        summary:
          "Un enum donne des noms aux choix d’un ensemble. Le projet distingue la priorité Basse, Moyenne ou Haute du statut Ouvert, En cours ou Fermé.",
        sections: [
          section(
            "Nommer les valeurs",
            "Les enums textuels rendent les libellés lisibles dans le modèle et dans la vue. Un nouveau ticket commence avec StatutTicket.Ouvert.",
            [
              "Le menu présente les choix de Priorite.",
              "Une union de littéraux constitue aussi une option de modélisation de choix fixes.",
            ],
          ),
          section(
            "Associer le choix à l’objet",
            "Le formulaire lit l’index courant puis récupère la priorité correspondante dans sa liste de choix.",
            [
              "Une valeur de repli couvre un index absent.",
              "Les données provenant de l’extérieur doivent être validées avant leur utilisation.",
            ],
          ),
        ],
        files: projectExample(tsSupport, "src/modeles.ts"),
        task: "Ajoute une priorité Urgente puis adapte la liste des choix du formulaire.",
        takeaway:
          "Les valeurs nommées réduisent les variations accidentelles de choix et de libellés.",
        quiz: quiz(
          "Quel état reçoit un nouveau ticket ?",
          [
            "Fermé automatiquement",
            "Un nombre aléatoire",
            "StatutTicket.Ouvert",
          ],
          2,
          "Support initialise chaque nouveau ticket avec le statut Ouvert.",
        ),
        link: docs + "enums.html",
      }),
      lesson({
        id: "ts-validation-ticket",
        title: "Valider avant d’insérer",
        minutes: 25,
        summary:
          "Support.creer nettoie les espaces du titre puis vérifie sa longueur. Il construit et enregistre le ticket uniquement après cette validation.",
        sections: [
          section(
            "Préserver la collection",
            "Un titre invalide provoque une erreur avant l’insertion. La collection conserve les tickets acceptés auparavant.",
            [
              "Le compteur d’identifiants avance après un ajout réussi.",
              "La limite de cent tickets borne ce projet de session.",
            ],
          ),
          section(
            "Présenter l’erreur",
            "La vue intercepte l’erreur et la présente dans le label de statut. L’apprenant peut corriger sa saisie et réessayer.",
            [
              "Une erreur doit laisser un état compréhensible.",
              "Une signature typée est complétée par les règles de valeur.",
            ],
          ),
        ],
        files: projectExample(tsSupport, "src/modeles.ts"),
        task: "Teste un titre vide puis un titre valide et observe la taille de la collection.",
        takeaway:
          "La validation précède l’insertion pour garder le modèle dans un état conforme.",
        quiz: quiz(
          "Quand incrémenter le prochain identifiant ?",
          [
            "Au lancement de tsc",
            "Après une insertion acceptée",
            "À chaque frappe dans le champ",
          ],
          1,
          "L’identifiant avance après la création réussie du ticket.",
        ),
        link: docs + "2/narrowing.html",
      }),
    ],
  },
  {
    id: "ts-interface-support",
    title: "Formulaire et tableau Qt",
    description: "Organise les saisies et présente chaque ticket.",
    lessons: [
      lesson({
        id: "ts-flexlayout",
        title: "Construire une page avec FlexLayout",
        minutes: 25,
        summary:
          "FlexLayout organise les widgets selon une direction et des règles de flexibilité. Le support place le titre, le champ, la priorité, le bouton puis le tableau dans une colonne.",
        sections: [
          section(
            "Distribuer les composants",
            "addWidget ajoute chaque élément au layout. Le tableau reçoit flex: 1 pour occuper l’espace disponible après les composants de formulaire.",
            [
              "QLineEdit reçoit une ligne de texte.",
              "QComboBox présente une sélection parmi les priorités.",
            ],
          ),
          section(
            "Tester les dimensions",
            "Redimensionne la fenêtre et observe le tableau. Le padding préserve l’espace autour de la page.",
            [
              "Le titre doit rester lisible.",
              "Le tableau doit disposer d’une place suffisante pour afficher les tickets.",
            ],
          ),
        ],
        files: tsSupport.files,
        task: "Modifie la marge du tableau puis teste une fenêtre plus grande et plus petite.",
        takeaway:
          "Le layout exprime les relations de disposition et répartit l’espace disponible.",
        quiz: quiz(
          "Quel composant organise ici les widgets ?",
          ["FlexLayout", "Depot", "tsc"],
          0,
          "FlexLayout dispose les widgets de la page.",
        ),
        link: gui + "api/generated/classes/flexlayout/",
      }),
      lesson({
        id: "ts-tableau-tickets",
        title: "Ajouter une ligne par ticket accepté",
        minutes: 28,
        summary:
          "Le rappel du bouton lit les champs, demande un Ticket au modèle puis insère une ligne dans QTableWidget. Les cellules présentent le titre, la priorité et le statut.",
        sections: [
          section(
            "Relier le modèle à la vue",
            "Le ticket renvoyé fournit les valeurs affichées. Chaque nouvelle ligne possède ses propres QTableWidgetItem.",
            [
              "insertRow ajoute la ligne avant le placement des cellules.",
              "Le champ est vidé après une action acceptée.",
            ],
          ),
          section(
            "Vérifier plusieurs objets",
            "Crée deux tickets avec des priorités différentes puis tente un titre trop court. Le tableau doit contenir exactement les deux tickets valides.",
            [
              "Le statut indique la taille de la collection.",
              "Les données sont conservées pendant cette session de fenêtre.",
            ],
          ),
        ],
        files: tsSupport.files,
        task: "Ajoute trois tickets de priorités différentes puis vérifie les valeurs du tableau.",
        takeaway:
          "Une action valide construit un objet puis actualise sa représentation dans le tableau.",
        quiz: quiz(
          "Quel objet représente une cellule de ce tableau ?",
          ["QMainWindow", "QLineEdit", "QTableWidgetItem"],
          2,
          "QTableWidgetItem porte la donnée affichée dans une cellule.",
        ),
        link: gui + "api/generated/classes/qtablewidget/",
      }),
    ],
  },
];
export const typescriptLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Types, interfaces et fonctions",
    definition:
      "TypeScript enrichit JavaScript avec une vérification statique des types et produit du JavaScript exécutable.",
    objective:
      "Décris les données, type les fonctions et valide les valeurs externes.",
    color: levelColors[0],
    prerequisites: "Comprendre les variables et fonctions JavaScript.",
    outcomes: [
      "Utiliser tsc et lire ses diagnostics.",
      "Décrire une interface et des champs facultatifs.",
      "Valider unknown puis utiliser un prédicat de type.",
    ],
    chapters: beginner,
    projects: [tsProfiles],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Classes et NodeGui",
    definition:
      "NodeGui permet de piloter des widgets Qt avec JavaScript ou TypeScript et utilise Qode pour sa boucle d’événements.",
    objective: "Construis un modèle typé puis une fenêtre de vote native.",
    color: levelColors[1],
    prerequisites:
      "Connaître les interfaces et les fonctions. Préparer la chaîne native NodeGui décrite dans le README.",
    outcomes: [
      "Utiliser constructeur, visibilité et instances.",
      "Assembler une fenêtre Qt et ses widgets.",
      "Relier clicked à une méthode du modèle.",
    ],
    chapters: intermediate,
    projects: [tsVotes],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Génériques, enums et support",
    definition:
      "Les génériques conservent les relations de types dans un traitement réutilisable et les enums donnent des noms aux choix du modèle.",
    objective:
      "Construis un dépôt générique et une interface de gestion de tickets.",
    color: levelColors[2],
    prerequisites: "Comprendre classes, callbacks et widgets NodeGui.",
    outcomes: [
      "Créer un dépôt générique avec contrainte.",
      "Modéliser priorité et statut.",
      "Valider un formulaire et alimenter un tableau avec FlexLayout.",
    ],
    chapters: advanced,
    projects: [tsSupport],
  },
];
