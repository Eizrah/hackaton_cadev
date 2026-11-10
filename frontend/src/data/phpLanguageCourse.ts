import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { phpAnalyser, phpCash, phpClicks } from "./phpLanguageProjects";
import type { WebLevel } from "./webCourseTypes";
const docs = "https://www.php.net/manual/fr/";
const beginner: WebLevel["chapters"] = [
  {
    id: "php-cli",
    title: "Exécuter PHP en console",
    description: "Découvre le moteur et les valeurs d’un script.",
    lessons: [
      lesson({
        id: "php-script-cli",
        title: "PHP, le mode CLI et echo",
        minutes: 19,
        summary:
          "PHP peut exécuter un fichier directement depuis le terminal. Le mode CLI lance le script avec la commande php main.php. La balise <?php commence le code et echo affiche une valeur.",
        sections: [
          section(
            "Lire les instructions",
            "Le nom d’une variable commence par $. L’opérateur point concatène les morceaux de texte. Les instructions sont terminées par un point-virgule.",
            [
              "Un fichier de logique PHP peut rester ouvert sans balise de fermeture.",
              "Le caractère de nouvelle ligne s’écrit \\n dans une chaîne à guillemets doubles.",
            ],
          ),
          section(
            "Observer la console",
            "Exécuter le script vérifie la syntaxe avec PHP puis lance main.php. Les diagnostics précisent les lignes à corriger.",
            [
              "PHP est le moteur qui exécute les instructions du fichier.",
              "Le guide d’export indique les outils à installer sur ton ordinateur.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\n$nom = "Tiana";\necho "Bonjour " . $nom . " !\\n";\necho "Mon premier script PHP en console.\\n";',
        ),
        task: "Personnalise le prénom puis affiche ton pays sur une seconde ligne.",
        takeaway:
          "PHP CLI exécute un script et echo écrit dans sa sortie standard.",
        quiz: quiz(
          "Quel caractère commence le nom d’une variable PHP ?",
          ["#", "$", "@"],
          1,
          "Les variables PHP commencent par le caractère $.",
        ),
        link: docs + "features.commandline.php",
      }),
      lesson({
        id: "php-types-readline",
        title: "Types, readline et conversion",
        minutes: 23,
        summary:
          "PHP manipule notamment string, int, float et bool. readline lit une ligne textuelle. Une donnée reçue doit être vérifiée avant sa conversion et son utilisation.",
        sections: [
          section(
            "Lire une saisie",
            "Le programme demande une quantité puis utilise FILTER_VALIDATE_INT pour reconnaître un entier. Une fin du flux renvoie false.",
            [
              "Les valeurs numériques écrites dans le code ont leur type de nombre.",
              "Une chaîne saisie conserve son type textuel avant conversion.",
            ],
          ),
          section(
            "Vérifier la règle métier",
            "La quantité doit être positive ou nulle. Le script affiche le total après cette vérification.",
            [
              "=== compare la valeur et le type.",
              "Une entrée invalide peut être expliquée avec fwrite sur STDERR.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\n$saisie = readline("Quantité ? ");\n$quantite = $saisie === false ? false : filter_var($saisie, FILTER_VALIDATE_INT);\nif ($quantite === false || $quantite < 0) {\n    fwrite(STDERR, "Entre un entier positif ou nul.\\n");\n    exit(1);\n}\necho "Total " . ($quantite * 2500) . " Ar\\n";',
          { stdin: "3\n" },
        ),
        task: "Essaie 3, trois puis -1 et compare les résultats.",
        takeaway:
          "La lecture fournit du texte et la validation établit la valeur utilisable.",
        quiz: quiz(
          "Pourquoi tester $quantite === false ?",
          [
            "Pour reconnaître la valeur d’échec de validation",
            "Pour comparer deux fenêtres",
            "Pour créer une variable",
          ],
          0,
          "Le test strict distingue false d’une quantité valide égale à zéro.",
        ),
        link: docs + "function.readline.php",
      }),
    ],
  },
  {
    id: "php-controle",
    title: "Conditions et boucles",
    description: "Dirige le programme et répète un calcul.",
    lessons: [
      lesson({
        id: "php-conditions",
        title: "if, elseif, else et comparaison stricte",
        minutes: 21,
        summary:
          "if choisit un chemin selon une expression booléenne. elseif ajoute une condition et else traite le cas restant. === exige une égalité de type et de valeur.",
        sections: [
          section(
            "Décrire les branches",
            "Le programme classe une note en vérifiant d’abord ses bornes puis le seuil de validation.",
            [
              "&& combine deux conditions nécessaires.",
              "|| exprime qu’au moins une condition doit être vraie.",
            ],
          ),
          section(
            "Vérifier les valeurs limites",
            "Les notes zéro, dix et vingt permettent de vérifier les frontières choisies. Une valeur hors limites doit suivre son propre chemin.",
            [
              "Les accolades regroupent les instructions d’une branche.",
              "Une saisie textuelle doit être validée avant ce classement numérique.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\n$note = 10;\nif ($note < 0 || $note > 20) {\n    echo "Note hors limites\\n";\n} elseif ($note >= 10) {\n    echo "Objectif atteint\\n";\n} else {\n    echo "Une révision sera utile\\n";\n}\nvar_export(3 === "3");\necho "\\n";',
        ),
        task: "Change la note pour parcourir chaque branche et explique le résultat de la comparaison stricte.",
        takeaway:
          "Les conditions expriment les règles et la comparaison stricte tient compte du type.",
        quiz: quiz(
          "Que donne 3 === '3' ?",
          ["true", "3", "false"],
          2,
          "Les deux valeurs ont des types différents.",
        ),
        link: docs + "language.operators.comparison.php",
      }),
      lesson({
        id: "php-boucles",
        title: "for et while",
        minutes: 21,
        summary:
          "for regroupe l’initialisation, la condition et l’évolution du compteur. while répète son bloc tant que la condition est vraie.",
        sections: [
          section(
            "Suivre la somme",
            "Le compteur va de un à cinq et chaque valeur est ajoutée au total. L’opérateur += remplace le total par le résultat de l’addition.",
            [
              "La condition est vérifiée avant chaque tour.",
              "L’incrément fait avancer le compteur vers sa fin.",
            ],
          ),
          section(
            "Prévoir la sortie",
            "Le compte à rebours diminue une variable jusqu’à zéro. La condition devient alors fausse et le programme poursuit son exécution.",
            [
              "break termine la boucle courante.",
              "Une boucle dépendant d’une saisie doit aussi gérer la fin du flux.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\n$total = 0;\nfor ($i = 1; $i <= 5; $i++) {\n    $total += $i;\n    echo "Étape $i, total $total\\n";\n}\n$restant = 3;\nwhile ($restant > 0) {\n    echo "Encore $restant\\n";\n    $restant--;\n}',
        ),
        task: "Étends la somme jusqu’à dix puis vérifie le résultat attendu.",
        takeaway:
          "Le compteur et la condition décrivent l’avancement et la fin de la boucle.",
        quiz: quiz(
          "Quel élément fait avancer i dans ce for ?",
          ["$i++", "echo", "$total = 0"],
          0,
          "$i++ ajoute un au compteur après chaque tour.",
        ),
        link: docs + "control-structures.for.php",
      }),
    ],
  },
  {
    id: "php-fonctions-tableaux",
    title: "Fonctions, tableaux et texte",
    description:
      "Rends un traitement réutilisable et observe les chaînes UTF-8.",
    lessons: [
      lesson({
        id: "php-fonctions",
        title: "function, paramètres et return",
        minutes: 23,
        summary:
          "Une fonction définit une tâche avec des paramètres. Ses appels fournissent les arguments et return transmet le résultat. Les variables ordinaires de la fonction appartiennent à son appel.",
        sections: [
          section(
            "Lire le contrat",
            "totalLigne reçoit une quantité et un prix. Les annotations int expriment ici des montants entiers.",
            [
              "Le type après les paramètres annonce la valeur retournée.",
              "Un appel peut stocker le résultat ou l’afficher directement.",
            ],
          ),
          section(
            "Vérifier plusieurs appels",
            "Les données changent entre les appels et la recette de calcul reste la même. Une quantité nulle permet de tester une limite simple.",
            [
              "Les exemples utilisent des centimes pour garder les unités explicites.",
              "Le niveau avancé introduira la directive strict_types.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\nfunction totalLigne(int $quantite, int $prixCentimes): int {\n    return $quantite * $prixCentimes;\n}\necho totalLigne(3, 1200) . " centimes\\n";\necho totalLigne(0, 1200) . " centimes\\n";',
        ),
        task: "Ajoute une fonction remise qui calcule une réduction d’exercice de dix pour cent.",
        takeaway:
          "La signature annonce les paramètres et le résultat d’un traitement réutilisable.",
        quiz: quiz(
          "Quel mot-clé renvoie le résultat ?",
          ["echo", "return", "foreach"],
          1,
          "return termine l’appel et transmet la valeur à l’appelant.",
        ),
        link: docs + "functions.user-defined.php",
      }),
      lesson({
        id: "php-texte-tableaux",
        title: "Tableaux indexés et longueur d’un texte",
        minutes: 24,
        summary:
          "Un tableau PHP peut conserver plusieurs valeurs. Dans une liste simple, les indices commencent généralement à zéro. Pour un texte UTF-8, mb_strlen mesure les caractères selon l’encodage indiqué.",
        sections: [
          section(
            "Distinguer les mesures",
            "strlen mesure les octets de la chaîne et mb_strlen interprète l’encodage. Une lettre accentuée peut utiliser plusieurs octets.",
            [
              "Le moteur PHP de l’atelier fournit l’extension mbstring.",
              "La notion de caractère peut encore différer d’un symbole visuel composé.",
            ],
          ),
          section(
            "Construire l’analyseur",
            "Le projet lit une phrase, mesure sa longueur puis remplace le mot secret avec une expression régulière Unicode.",
            [
              "trim retire les espaces aux extrémités.",
              "Une liste de mots à traiter peut être représentée par un tableau [].",
            ],
          ),
        ],
        files: phpAnalyser.files,
        task: "Essaie une phrase accentuée puis compare mb_strlen et strlen dans le script.",
        takeaway:
          "Le texte encodé possède une longueur en octets et une longueur interprétée selon son encodage.",
        quiz: quiz(
          "Quelle fonction du projet compte les caractères UTF-8 ?",
          ["count", "strlen uniquement", "mb_strlen"],
          2,
          "mb_strlen utilise l’encodage UTF-8 explicitement fourni.",
        ),
        link: docs + "function.mb-strlen.php",
      }),
    ],
  },
];
const intermediate: WebLevel["chapters"] = [
  {
    id: "php-associatifs",
    title: "Clés, valeurs et parcours",
    description: "Décris des profils et parcours leurs propriétés.",
    lessons: [
      lesson({
        id: "php-tableau-associatif",
        title: "Nommer les clés d’un tableau",
        minutes: 22,
        summary:
          "Un tableau associatif relie des clés à des valeurs. $profil['nom'] lit la valeur associée à nom. Une clé facilite la description de plusieurs propriétés d’une même donnée.",
        sections: [
          section(
            "Structurer le profil",
            "Le profil conserve un nom et un pays. Une nouvelle clé competence peut être ajoutée avant la présentation.",
            [
              "Les clés de cet exemple sont des chaînes.",
              "?? propose une valeur de remplacement pour une clé absente ou null.",
            ],
          ),
          section(
            "Différencier les structures",
            "Une liste représente une suite d’éléments. Un tableau à clés nommées représente ici les propriétés d’un profil.",
            [
              "Un tableau peut aussi contenir d’autres tableaux.",
              "Le choix des clés doit rester cohérent entre création et lecture.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\n$profil = ["nom" => "Tiana", "pays" => "Madagascar"];\n$profil["competence"] = "PHP";\necho $profil["nom"] . " utilise " . $profil["competence"] . "\\n";\necho ($profil["portfolio"] ?? "Portfolio à ajouter") . "\\n";',
        ),
        task: "Ajoute un portfolio et observe la valeur présentée.",
        takeaway:
          "Les clés nommées rendent les propriétés d’une donnée accessibles par leur rôle.",
        quiz: quiz(
          "Quelle écriture lit le pays ?",
          ["$profil->pays dans ce tableau", "$profil['pays']", "$profil(pays)"],
          1,
          "Les crochets accèdent ici à la clé du tableau associatif.",
        ),
        link: docs + "language.types.array.php",
      }),
      lesson({
        id: "php-foreach",
        title: "Parcourir les clés et les valeurs",
        minutes: 22,
        summary:
          "foreach parcourt les éléments d’un tableau. La forme as $cle => $valeur rend disponibles la clé et la valeur de chaque élément.",
        sections: [
          section(
            "Lire le parcours",
            "Chaque propriété du profil devient une ligne d’affichage. Un tableau de profils permet un parcours supplémentaire sur les personnes.",
            [
              "Les noms des variables de parcours expriment leur rôle.",
              "Le contenu du tableau reste disponible après le parcours.",
            ],
          ),
          section(
            "Choisir les champs affichés",
            "Dans une interface, les champs autorisés sont présentés avec un ordre défini. Le parcours reste utile pour une liste de lignes de caisse.",
            [
              "Le titre d’un champ peut différer de sa clé technique.",
              "Une valeur présentée dans du HTML doit être échappée selon son contexte.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\n$profil = ["nom" => "Amina", "pays" => "Sénégal", "competence" => "PHP"];\nforeach ($profil as $cle => $valeur) {\n    echo $cle . " = " . $valeur . "\\n";\n}',
        ),
        task: "Ajoute une propriété niveau et vérifie sa présence dans le parcours.",
        takeaway:
          "foreach donne accès aux éléments du tableau et peut aussi exposer leurs clés.",
        quiz: quiz(
          "Que fournit la forme $cle => $valeur ?",
          [
            "La clé et la valeur de l’élément courant",
            "Deux fichiers",
            "Deux fenêtres",
          ],
          0,
          "Chaque tour fournit la paire clé-valeur correspondante.",
        ),
        link: docs + "control-structures.foreach.php",
      }),
    ],
  },
  {
    id: "php-objets",
    title: "Classes et instances",
    description: "Conserve un état et expose des opérations.",
    lessons: [
      lesson({
        id: "php-constructeur",
        title: "__construct et $this",
        minutes: 25,
        summary:
          "Une classe décrit un type d’objet. new crée une instance et appelle __construct. $this désigne l’instance courante depuis ses méthodes.",
        sections: [
          section(
            "Initialiser les données",
            "Compteur reçoit une valeur initiale et la conserve dans son attribut. Chaque instance possède son propre état.",
            [
              "L’opérateur -> accède aux membres d’un objet.",
              "Une méthode peut renvoyer le résultat à présenter.",
            ],
          ),
          section(
            "Observer les instances",
            "Les deux compteurs commencent à des valeurs différentes. Une action sur le premier laisse le second à sa valeur actuelle.",
            [
              "Une construction crée un objet concret.",
              "Le modèle sera ensuite relié au formulaire de la fenêtre.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\nfinal class Compteur {\n    public function __construct(private int $valeur = 0) {}\n    public function ajouter(): void { $this->valeur++; }\n    public function lire(): int { return $this->valeur; }\n}\n$tiana = new Compteur();\n$amina = new Compteur(3);\n$tiana->ajouter();\necho $tiana->lire() . " / " . $amina->lire() . "\\n";',
        ),
        task: "Crée un troisième compteur puis appelle ajouter deux fois sur Amina.",
        takeaway:
          "Le constructeur initialise chaque instance et $this donne accès à son état.",
        quiz: quiz(
          "Que désigne $this ?",
          ["Le nom du dossier", "Le navigateur", "L’instance courante"],
          2,
          "Une méthode utilise $this pour accéder à l’objet qui reçoit l’appel.",
        ),
        link: docs + "language.oop5.decon.php",
      }),
      lesson({
        id: "php-encapsulation",
        title: "private, public et opérations du modèle",
        minutes: 23,
        summary:
          "Un attribut privé limite son accès direct à la classe. Les méthodes publiques proposent les opérations prévues. Cette organisation centralise les modifications de l’état.",
        sections: [
          section(
            "Lire l’interface du compteur",
            "incrementer modifie la valeur et valeur la présente. Le formulaire utilise ces méthodes sur une instance Compteur.",
            [
              "Le modèle décrit une règle indépendante de son affichage.",
              "Le typage de retour précise ce que reçoit la vue.",
            ],
          ),
          section(
            "Préparer les validations",
            "Une classe comme Caisse pourra vérifier le montant avant de le conserver. Le programme garde alors les mêmes règles pour tous ses appelants.",
            [
              "Valide une donnée avant de modifier les champs.",
              "Les opérations refusées conservent le dernier état accepté.",
            ],
          ),
        ],
        files: projectExample(phpClicks, "www/Compteur.php"),
        task: "Ajoute une méthode reinitialiser au modèle et vérifie son effet dans un petit script console.",
        takeaway:
          "Les méthodes publiques centralisent les opérations réalisées sur les attributs privés.",
        quiz: quiz(
          "Quelle méthode du projet renvoie le total courant ?",
          ["valeur", "session_start", "header"],
          0,
          "valeur fournit le nombre conservé par le compteur.",
        ),
        link: docs + "language.oop5.visibility.php",
      }),
    ],
  },
  {
    id: "php-interface",
    title: "Fenêtre PHP Desktop et état",
    description: "Relie la classe à une vue locale et à ses actions.",
    lessons: [
      lesson({
        id: "php-desktop",
        title: "Comprendre PHP Desktop",
        minutes: 26,
        summary:
          "PHP Desktop embarque un moteur PHP et une vue Chromium pour ouvrir une application de bureau. Dans cette approche, HTML décrit les composants visibles et les classes PHP traitent leurs actions.",
        sections: [
          section(
            "Organiser le dossier",
            "Le ZIP fournit www avec index.php, la classe et les styles. Le guide explique comment copier ces fichiers dans la distribution PHP Desktop Windows.",
            [
              "Le moteur de bureau et ses réglages sont fournis par la distribution officielle.",
              "Le moteur PHP choisi doit être compatible avec la version requise par le code.",
            ],
          ),
          section(
            "Essayer pendant le développement",
            "Le même dossier peut être servi localement avec php -S 127.0.0.1:8027 -t www pour vérifier le formulaire dans ton navigateur.",
            [
              "La commande sert au développement local.",
              "Le lancement de l’exécutable PHP Desktop ouvre la fenêtre autonome.",
            ],
          ),
        ],
        files: phpClicks.files,
        task: "Exporte le projet puis suis le README pour ouvrir la vue et observer le compteur.",
        takeaway:
          "PHP Desktop héberge la vue locale et le moteur PHP qui traite la logique.",
        quiz: quiz(
          "Quel dossier de cet export contient la vue à copier ?",
          ["node_modules", "www", "out"],
          1,
          "www contient les fichiers destinés au moteur PHP Desktop.",
        ),
        link: "https://github.com/cztomczak/phpdesktop",
      }),
      lesson({
        id: "php-session-post",
        title: "Action POST, session et redirection",
        minutes: 27,
        summary:
          "Le bouton soumet un formulaire POST. Le script recrée le compteur depuis sa valeur de session, applique l’action puis conserve le nouvel état avant une redirection.",
        sections: [
          section(
            "Suivre le clic",
            "La session garde la valeur entre deux requêtes. Le jeton du formulaire est comparé au jeton conservé avant d’appliquer l’action.",
            [
              "Une requête PHP traite une étape de l’interaction.",
              "Le champ caché transmet le jeton du formulaire.",
            ],
          ),
          section(
            "Terminer l’action",
            "La réponse 303 renvoie la fenêtre à une lecture de la page. Un rafraîchissement répète alors cette lecture.",
            [
              "L’en-tête de redirection est envoyé avant le document HTML.",
              "La classe porte la logique et la session conserve ici l’état de la session.",
            ],
          ),
        ],
        files: phpClicks.files,
        task: "Clique trois fois puis rafraîchis la vue et vérifie que le total reste trois.",
        takeaway:
          "La session conserve l’état et la redirection termine le traitement du formulaire.",
        quiz: quiz(
          "Où le projet conserve-t-il le nombre entre deux requêtes ?",
          ["Dans un commentaire", "Dans le fichier CSS", "Dans $_SESSION"],
          2,
          "La session fournit la valeur utilisée pour reconstruire le compteur.",
        ),
        link: docs + "book.session.php",
      }),
    ],
  },
];
const advanced: WebLevel["chapters"] = [
  {
    id: "php-rigueur",
    title: "Typage strict et erreurs de contrat",
    description: "Vérifie les types des appels et traite les erreurs.",
    lessons: [
      lesson({
        id: "php-strict-types",
        title: "Activer declare(strict_types=1)",
        minutes: 25,
        summary:
          "La directive strict_types active la vérification stricte des types scalaires pour les appels effectués depuis le fichier. Elle doit figurer au début du fichier PHP.",
        sections: [
          section(
            "Suivre l’appel",
            "La fonction attend un int. Le premier appel fournit un entier. Le second fournit une chaîne et déclenche ici TypeError.",
            [
              "Le mode strict dépend du fichier qui réalise l’appel.",
              "Une donnée issue d’un formulaire reste textuelle et doit être validée puis convertie.",
            ],
          ),
          section(
            "Conserver une explication claire",
            "Le catch traite l’erreur de type dans cet exemple d’observation. Une application doit transmettre les bons types après ses étapes de validation.",
            [
              "Les annotations décrivent les types de paramètres et de retour.",
              "La validation des bornes est une règle supplémentaire.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\ndeclare(strict_types=1);\nfunction doubler(int $valeur): int { return $valeur * 2; }\necho doubler(4) . "\\n";\ntry {\n    echo doubler("4");\n} catch (TypeError $erreur) {\n    echo "L’appel attend un entier.\\n";\n}',
        ),
        task: "Compare les deux appels et explique pourquoi seule la valeur entière respecte ce contrat.",
        takeaway:
          "Le mode strict vérifie les types des appels du fichier et complète la validation des valeurs.",
        quiz: quiz(
          "Quelle erreur est attendue pour cette chaîne passée à int ?",
          ["TypeError", "GtkError", "SQLException"],
          0,
          "Le mode strict refuse ici le type incompatible avec le paramètre int.",
        ),
        link:
          docs +
          "language.types.declarations.php#language.types.declarations.strict",
      }),
      lesson({
        id: "php-retours-types",
        title: "Types de retour et séparation des unités",
        minutes: 24,
        summary:
          "Le type de retour annonce la forme du résultat. Un modèle financier d’exercice peut utiliser des centimes int pour garder ses calculs et ses arrondis explicites.",
        sections: [
          section(
            "Nommer les unités",
            "La variable montantCentimes exprime son unité dans son nom. La fonction totalTTC renvoie un entier selon un taux d’exercice fixe.",
            [
              "La présentation en euros intervient après le calcul.",
              "Un nombre à virgule reçu d’un formulaire est analysé depuis son texte.",
            ],
          ),
          section(
            "Lire une transformation",
            "Le projet de caisse parse les deux parties décimales puis produit un nombre de centimes. Cette fonction est séparée de la vue.",
            [
              "La signature de la méthode précise le type attendu.",
              "Le test d’une valeur connue vérifie aussi le calcul métier.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\ndeclare(strict_types=1);\nfunction totalTTC(int $montantCentimes): int {\n    if ($montantCentimes < 0) throw new InvalidArgumentException("Montant positif attendu.");\n    $taxe = intdiv($montantCentimes * 20 + 50, 100);\n    return $montantCentimes + $taxe;\n}\necho totalTTC(1250) . " centimes\\n";',
        ),
        task: "Vérifie le résultat pour 1 250 centimes puis pour un montant nul.",
        takeaway:
          "Les unités nommées et les types de retour rendent les transformations vérifiables.",
        quiz: quiz(
          "Que renvoie cette fonction totalTTC ?",
          ["Un champ HTML", "Un entier en centimes", "Un fichier"],
          1,
          "Le type int et les noms indiquent un résultat exprimé en centimes.",
        ),
        link: docs + "language.types.declarations.php",
      }),
    ],
  },
  {
    id: "php-exceptions",
    title: "Exceptions et validation",
    description: "Explique les refus avant de modifier la caisse.",
    lessons: [
      lesson({
        id: "php-throw-catch",
        title: "Lever puis intercepter une exception",
        minutes: 25,
        summary:
          "throw émet une exception lorsque la règle du modèle est violée. try contient l’opération et catch reçoit l’exception que l’appelant sait expliquer.",
        sections: [
          section(
            "Définir le contrat",
            "accepterPrix exige une valeur strictement positive. Une valeur invalide quitte le chemin courant et rejoint le gestionnaire.",
            [
              "La fonction exprime une règle de valeur.",
              "L’appelant choisit la manière de présenter l’échec.",
            ],
          ),
          section(
            "Permettre une correction",
            "Le programme essaie plusieurs prix et peut poursuivre après un rejet traité. Dans la fenêtre, l’apprenant peut corriger son champ.",
            [
              "Une exception doit préserver le dernier état valide.",
              "Un message concret indique la correction attendue.",
            ],
          ),
        ],
        files: consoleFiles(
          "php",
          '<?php\ndeclare(strict_types=1);\nfunction accepterPrix(int $centimes): int {\n    if ($centimes <= 0) throw new InvalidArgumentException("Prix supérieur à zéro attendu.");\n    return $centimes;\n}\nforeach ([1250, -100, 500] as $prix) {\n    try { echo accepterPrix($prix) . " accepté\\n"; }\n    catch (InvalidArgumentException $erreur) { echo $erreur->getMessage() . "\\n"; }\n}',
        ),
        task: "Ajoute une limite maximale et un essai qui la dépasse.",
        takeaway:
          "Le modèle refuse une valeur et l’appelant traite ce refus avec une consigne adaptée.",
        quiz: quiz(
          "Quel mot-clé déclenche une exception ?",
          ["foreach", "return", "throw"],
          2,
          "throw émet l’exception transmise au gestionnaire adapté.",
        ),
        link: docs + "class.exception.php",
      }),
      lesson({
        id: "php-prix-decimal",
        title: "Analyser un prix depuis sa chaîne",
        minutes: 27,
        summary:
          "Le champ de prix fournit une chaîne. prixCentimes vérifie son format, normalise la virgule puis assemble les parties entière et décimale en centimes.",
        sections: [
          section(
            "Valider le format",
            "La règle accepte un prix positif avec au maximum deux décimales. Les lettres et les signes non prévus sont rejetés avant le calcul.",
            [
              "Le nombre de chiffres est borné dans cet exercice.",
              "Une virgule et un point sont acceptés comme séparateur.",
            ],
          ),
          section(
            "Modifier après validation",
            "La classe Caisse vérifie ensuite le montant et la limite de session avant l’ajout à sa liste.",
            [
              "Le total précédent reste disponible après un rejet.",
              "La fonction de présentation transforme ensuite les centimes en texte monétaire.",
            ],
          ),
        ],
        files: projectExample(phpCash, "www/Caisse.php"),
        task: "Essaie 12,50, 0 puis bonjour et compare les effets sur le total.",
        takeaway:
          "Le texte est validé puis converti avant d’entrer dans le modèle numérique.",
        quiz: quiz(
          "Quel résultat représente 12,50 dans le modèle ?",
          ["1250 centimes", "12 chaînes", "Un nombre de lignes"],
          0,
          "Les deux décimales deviennent cinquante centimes, pour un total de 1 250.",
        ),
        link: docs + "function.preg-match.php",
      }),
    ],
  },
  {
    id: "php-caisse-vue",
    title: "Formulaire complet et ticket",
    description: "Présente les données acceptées et les erreurs de saisie.",
    lessons: [
      lesson({
        id: "php-caisse-formulaire",
        title: "Champs, état et message de statut",
        minutes: 26,
        summary:
          "Le formulaire lit le prix avec un champ nommé. Le script traite l’action, utilise le modèle typé puis présente les lignes et le total de la caisse.",
        sections: [
          section(
            "Lire l’entrée du formulaire",
            "Le code vérifie que le champ transmis est une chaîne puis appelle prixCentimes et ajouter. Le jeton est vérifié avant ces opérations.",
            [
              "L’échec conserve le texte saisi pour permettre sa correction.",
              "Le message est échappé avant insertion dans le document.",
            ],
          ),
          section(
            "Donner un résultat lisible",
            "La vue distingue les prix, le total HT, la taxe fictive de l’exercice et le TTC.",
            [
              "Les champs ont des labels associés.",
              "La mise en page utilise une largeur fluide pour garder le formulaire lisible.",
            ],
          ),
        ],
        files: phpCash.files,
        task: "Ajoute deux prix puis une saisie refusée et vérifie le contenu du ticket.",
        takeaway:
          "La vue relie l’action aux règles du modèle puis présente un résultat cohérent.",
        quiz: quiz(
          "Quand ajouter le prix à la liste ?",
          [
            "Avant le contrôle du formulaire",
            "Après validation du format et des règles",
            "À chaque frappe",
          ],
          1,
          "L’insertion suit les validations du formulaire et du modèle.",
        ),
        link: docs + "tutorial.forms.php",
      }),
      lesson({
        id: "php-caisse-reprise",
        title: "Échappement et reprise après action",
        minutes: 26,
        summary:
          "Une donnée affichée dans du HTML doit être échappée pour son contexte. La redirection après un POST réussi organise la reprise de la vue avec l’état conservé en session.",
        sections: [
          section(
            "Présenter du texte",
            "htmlspecialchars transforme les caractères interprétables dans ce contexte HTML. La saisie refusée peut ainsi être réaffichée dans le champ.",
            [
              "Le calcul métier utilise la valeur analysée.",
              "La présentation applique l’échappement au moment de construire la vue.",
            ],
          ),
          section(
            "Vérifier le parcours complet",
            "Ajoute un prix, rafraîchis, soumets un prix invalide puis corrige-le. Le nombre de lignes doit correspondre aux actions acceptées.",
            [
              "Un POST réussi termine par une réponse 303.",
              "Un rejet présente le message sans ajouter de ligne.",
            ],
          ),
        ],
        files: phpCash.files,
        task: "Teste le rafraîchissement après un ajout et vérifie que le ticket conserve le bon nombre de lignes.",
        takeaway:
          "Le traitement, la conservation d’état et la présentation ont chacun une étape explicite.",
        quiz: quiz(
          "Quel appel prépare une donnée texte pour ce contexte HTML ?",
          ["array_sum", "intdiv", "htmlspecialchars"],
          2,
          "htmlspecialchars est utilisé ici avant l’insertion dans le HTML.",
        ),
        link: docs + "function.htmlspecialchars.php",
      }),
    ],
  },
];
export const phpLanguageLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "PHP CLI, logique et texte",
    definition:
      "PHP est un langage de scripts qui peut s’exécuter directement en ligne de commande pour lire, traiter et afficher des données.",
    objective:
      "Écris des scripts avec des saisies validées, des boucles et des fonctions.",
    color: levelColors[0],
    prerequisites: "Savoir créer un fichier et lire un terminal.",
    outcomes: [
      "Utiliser les variables $, echo et readline.",
      "Écrire conditions, boucles et fonctions.",
      "Manipuler un tableau et un texte UTF-8.",
    ],
    chapters: beginner,
    projects: [phpAnalyser],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Tableaux, objets et PHP Desktop",
    definition:
      "PHP Desktop embarque un moteur PHP et une vue de bureau. Les classes organisent la logique et la session conserve l’état entre les actions.",
    objective:
      "Construis un compteur avec une classe PHP et une interface locale.",
    color: levelColors[1],
    prerequisites:
      "Comprendre les fonctions et les tableaux. Préparer PHP 8.2 et PHP Desktop pour la fenêtre autonome.",
    outcomes: [
      "Parcourir un tableau associatif avec foreach.",
      "Construire des instances avec __construct et $this.",
      "Relier un formulaire à un état de session.",
    ],
    chapters: intermediate,
    projects: [phpClicks],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Typage, exceptions et caisse",
    definition:
      "Le typage strict contrôle les contrats scalaires des appels et les exceptions expriment les échecs de validation ou de traitement.",
    objective:
      "Valide des prix et construis une caisse avec un modèle typé et une présentation claire.",
    color: levelColors[2],
    prerequisites:
      "Savoir construire une classe et traiter une action de formulaire.",
    outcomes: [
      "Utiliser strict_types et traiter une exception.",
      "Transformer un prix texte en centimes entiers.",
      "Présenter un ticket cohérent après réussite ou refus.",
    ],
    chapters: advanced,
    projects: [phpCash],
  },
];
