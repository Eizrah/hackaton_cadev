import {
  lesson,
  levelColors,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import type { WebLevel } from "./webCourseTypes";

const docs = "https://www.php.net/manual/fr/";

// ═══════════════════════════════════════════════════════════════════════════
// 🟢 NIVEAU DÉBUTANT - Les fondamentaux de PHP
// ═══════════════════════════════════════════════════════════════════════════

const beginner: WebLevel["chapters"] = [
  {
    id: "php-introduction",
    title: "Introduction à PHP",
    description: "Découvre PHP et son utilisation",
    lessons: [
      lesson({
        id: "php-intro-langage",
        title: "Qu'est-ce que PHP et comment se déroulera cette formation ?",
        minutes: 15,
        summary:
          "PHP (PHP: Hypertext Preprocessor) est un langage de scripting côté serveur utilisé pour créer des sites web dynamiques et des API. Cette formation progressive te mènera des bases jusqu'à la création d'applications backend complètes.",
        sections: [
          section(
            "Pourquoi PHP ?",
            "PHP est l'un des langages backend les plus utilisés au monde, alimentant 77% des sites web incluant WordPress, Facebook et Wikipedia.",
            [
              "Facile à apprendre : syntaxe proche de C/Java",
              "Backend web : génère HTML dynamiquement",
              "Gratuit et open source",
              "Énorme communauté et documentation",
              "Parfait pour API REST et sites dynamiques",
              "Pas besoin de compiler : interprété directement",
            ]
          ),
          section(
            "Déroulement de la formation",
            "Trois niveaux progressifs sans framework. Chaque niveau se termine par un exercice récapitulatif.",
            [
              "🟢 Débutant : Variables, conditions, boucles, fonctions, tableaux",
              "🟡 Intermédiaire : POO, interfaces, traits, JSON, bases de données",
              "🔴 Avancé : POO vs PDO (clarification), CRUD SQLite, API REST pure PHP",
            ]
          ),
          section(
            "PHP vs JavaScript",
            "PHP et JavaScript sont complémentaires : PHP côté serveur, JS côté client.",
            [
              "PHP : Backend (serveur), génère HTML/JSON",
              "JavaScript : Frontend (navigateur), interactions utilisateur",
              "PHP : Exécuté sur le serveur (invisible pour l'utilisateur)",
              "JavaScript : Exécuté dans le navigateur (visible)",
              "PHP : Accès bases de données, fichiers serveur, sessions",
              "JavaScript : Manipulation DOM, animations, appels API",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Bienvenue dans PHP !
echo "Bonjour DevAfrica !" . PHP_EOL;
echo "Je commence mon apprentissage PHP." . PHP_EOL;

// PHP est un langage de scripting
$nom = "Tiana";
echo "Je m'appelle $nom et je vais devenir développeur backend !" . PHP_EOL;

// Exécution : php main.php
?>`,
        ),
        task: "Modifie le code pour afficher ton propre nom et ton objectif avec PHP.",
        takeaway:
          "PHP est le langage backend n°1 pour créer sites web dynamiques et API. Facile à apprendre, gratuit et très demandé.",
        quiz: quiz(
          "Quelle est la principale différence entre PHP et JavaScript ?",
          ["PHP est plus rapide", "PHP s'exécute côté serveur, JS côté client", "PHP est plus récent"],
          1,
          "PHP s'exécute sur le serveur (backend) et génère du HTML/JSON. JavaScript s'exécute dans le navigateur (frontend)."
        ),
        link: docs + "intro-whatis.php",
      }),
    ],
  },
  {
    id: "php-variables-types",
    title: "Variables et types de données",
    description: "Types primitifs, variables et opérateurs",
    lessons: [
      lesson({
        id: "php-variables-types-base",
        title: "Variables et types primitifs",
        minutes: 20,
        summary:
          "En PHP, les variables commencent par $. PHP est faiblement typé : le type est déterminé automatiquement. Types principaux : string, int, float, bool, array, null.",
        sections: [
          section(
            "Déclarer des variables",
            "Variables PHP commencent toujours par $ suivi du nom.",
            [
              "$nom = valeur; pour déclarer",
              "Noms sensibles à la casse ($age ≠ $Age)",
              "Commencer par lettre ou underscore",
              "Pas de déclaration de type obligatoire",
              "Type déterminé automatiquement",
              "Typage dynamique (peut changer de type)",
            ]
          ),
          section(
            "Types primitifs",
            "PHP supporte plusieurs types de données primitifs.",
            [
              "string : chaîne de caractères (\"texte\" ou 'texte')",
              "int : nombre entier (42, -10, 0)",
              "float : nombre décimal (3.14, -2.5)",
              "bool : booléen (true ou false)",
              "null : absence de valeur",
              "array : tableau (indexé ou associatif)",
              "gettype($var) : obtenir le type d'une variable",
            ]
          ),
          section(
            "Affichage et concaténation",
            "Afficher des variables avec echo ou print.",
            [
              "echo : affiche une ou plusieurs chaînes",
              "print : affiche une chaîne (retourne 1)",
              ". : opérateur de concaténation",
              "\"double quotes\" : interprète les variables",
              "'simple quotes' : texte littéral",
              "PHP_EOL : saut de ligne multi-plateforme",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Types primitifs
$nom = "Alice";              // string
$age = 25;                   // int
$taille = 1.75;             // float
$estEtudiant = true;        // bool
$adresse = null;            // null

// Affichage avec echo
echo "=== Informations ===" . PHP_EOL;
echo "Nom: " . $nom . PHP_EOL;
echo "Age: " . $age . " ans" . PHP_EOL;
echo "Taille: " . $taille . " m" . PHP_EOL;
echo "Étudiant: " . ($estEtudiant ? "Oui" : "Non") . PHP_EOL;

// Double quotes : interprète les variables
echo "\\nJe m'appelle $nom et j'ai $age ans." . PHP_EOL;

// Vérifier le type
echo "\\nTypes:" . PHP_EOL;
echo "Type de \\$nom: " . gettype($nom) . PHP_EOL;
echo "Type de \\$age: " . gettype($age) . PHP_EOL;
echo "Type de \\$taille: " . gettype($taille) . PHP_EOL;

// Conversion de type (cast)
$nombre = "42";
echo "\\n\\$nombre est " . gettype($nombre) . PHP_EOL;
$nombre = (int)$nombre;
echo "Après cast: " . gettype($nombre) . PHP_EOL;
?>`,
        ),
        task: "Créez des variables pour votre profil : nom, âge, ville, estProgrammeur, langage préféré. Affichez-les avec echo.",
        takeaway:
          "Variables PHP commencent par $. Types : string, int, float, bool, null. Echo pour afficher. . pour concaténer.",
        quiz: quiz(
          "Comment déclarer une variable en PHP ?",
          ["var nom = 'test'", "$nom = 'test'", "let $nom = 'test'"],
          1,
          "Les variables PHP commencent toujours par $ : $nom = 'valeur';"
        ),
        link: docs + "language.types.php",
      }),
      lesson({
        id: "php-operateurs",
        title: "Opérateurs arithmétiques et de comparaison",
        minutes: 20,
        summary:
          "Opérateurs arithmétiques (+, -, *, /, %), comparaison (==, !=, ===, !==, <, >, <=, >=), logiques (&&, ||, !). Attention : == compare valeurs, === compare valeurs ET types.",
        sections: [
          section(
            "Opérateurs arithmétiques",
            "Les opérations mathématiques de base.",
            [
              "+ : Addition",
              "- : Soustraction",
              "* : Multiplication",
              "/ : Division",
              "% : Modulo (reste de division)",
              "** : Puissance (PHP 5.6+)",
              "++$i : Pré-incrémentation, $i++ : Post-incrémentation",
            ]
          ),
          section(
            "Opérateurs de comparaison",
            "Comparer des valeurs. Attention à == vs ===",
            [
              "== : Égalité de valeur (5 == \"5\" est true)",
              "!= : Différence de valeur",
              "=== : Égalité stricte (valeur ET type)",
              "!== : Différence stricte",
              "< : Inférieur",
              "> : Supérieur",
              "<= : Inférieur ou égal",
              ">= : Supérieur ou égal",
            ]
          ),
          section(
            "Opérateurs logiques",
            "Combiner des conditions booléennes.",
            [
              "&& : ET logique (and)",
              "|| : OU logique (or)",
              "! : NON logique (not)",
              "and, or, xor : versions avec priorité différente",
              "Opérateur ternaire : condition ? vrai : faux",
              "Opérateur null coalescing : $a ?? $b (PHP 7+)",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Opérateurs arithmétiques
$a = 10;
$b = 3;

echo "=== Opérateurs arithmétiques ===" . PHP_EOL;
echo "$a + $b = " . ($a + $b) . PHP_EOL;
echo "$a - $b = " . ($a - $b) . PHP_EOL;
echo "$a * $b = " . ($a * $b) . PHP_EOL;
echo "$a / $b = " . ($a / $b) . PHP_EOL;
echo "$a % $b = " . ($a % $b) . " (reste)" . PHP_EOL;
echo "$a ** $b = " . ($a ** $b) . " (puissance)" . PHP_EOL;

// Opérateurs de comparaison
echo "\\n=== Comparaison : == vs === ===" . PHP_EOL;
$x = 5;
$y = "5";

echo "$x == $y : " . ($x == $y ? "true" : "false") . PHP_EOL;    // true
echo "$x === $y : " . ($x === $y ? "true" : "false") . PHP_EOL;  // false

// Opérateurs logiques
echo "\\n=== Opérateurs logiques ===" . PHP_EOL;
$majeur = true;
$permis = false;

echo "majeur && permis : " . ($majeur && $permis ? "true" : "false") . PHP_EOL;
echo "majeur || permis : " . ($majeur || $permis ? "true" : "false") . PHP_EOL;
echo "!permis : " . (!$permis ? "true" : "false") . PHP_EOL;

// Opérateur ternaire
$age = 20;
$statut = ($age >= 18) ? "majeur" : "mineur";
echo "\\nÂge $age : $statut" . PHP_EOL;

// Null coalescing (PHP 7+)
$nom = null;
$nomAffiche = $nom ?? "Anonyme";
echo "Nom: $nomAffiche" . PHP_EOL;

// Incrément
$compteur = 5;
echo "\\n=== Incrément ===" . PHP_EOL;
echo "Compteur: $compteur" . PHP_EOL;
$compteur++;
echo "Après compteur++: $compteur" . PHP_EOL;
++$compteur;
echo "Après ++compteur: $compteur" . PHP_EOL;
?>`,
        ),
        task: "Créez un programme qui calcule l'aire (l * h) et le périmètre (2 * (l + h)) d'un rectangle. Vérifiez si l'aire > 50 avec ===.",
        takeaway:
          "Opérateurs : +, -, *, /, % pour calculs. == compare valeurs, === compare valeurs ET types. &&, ||, ! pour logique.",
        quiz: quiz(
          "Quelle différence entre == et === ?",
          ["Aucune", "=== compare valeur ET type, == seulement valeur", "== est plus rapide"],
          1,
          "=== est stricte : 5 === \"5\" est false. == est souple : 5 == \"5\" est true (conversion automatique)."
        ),
        link: docs + "language.operators.php",
      }),
    ],
  },
  {
    id: "php-conditions",
    title: "Structures conditionnelles",
    description: "Contrôler le flux avec if, else et switch",
    lessons: [
      lesson({
        id: "php-if-else",
        title: "Conditions if, elseif, else",
        minutes: 20,
        summary:
          "if permet d'exécuter du code selon une condition. elseif teste une autre condition, else est le cas par défaut. Accolades {} délimitent les blocs.",
        sections: [
          section(
            "Structure if/else",
            "Exécuter du code conditionnellement.",
            [
              "if (condition) { code }",
              "elseif (autre_condition) { code }",
              "else { code }",
              "Accolades recommandées même pour une ligne",
              "Conditions entre parenthèses",
              "Opérateur ternaire : condition ? vrai : faux",
            ]
          ),
          section(
            "Conditions composées",
            "Combiner plusieurs conditions avec && et ||.",
            [
              "&& : Les deux conditions doivent être vraies",
              "|| : Au moins une condition doit être vraie",
              "Parenthèses pour la clarté",
              "Court-circuit : && s'arrête au premier false",
              "Court-circuit : || s'arrête au premier true",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// if/elseif/else
$note = 15;

echo "Note: $note -> ";
if ($note >= 16) {
    echo "Très bien";
} elseif ($note >= 14) {
    echo "Bien";
} elseif ($note >= 12) {
    echo "Assez bien";
} elseif ($note >= 10) {
    echo "Passable";
} else {
    echo "Insuffisant";
}
echo PHP_EOL;

// Conditions composées
$age = 20;
$permis = true;

echo "\\nVérification conduite:" . PHP_EOL;
if ($age >= 18 && $permis) {
    echo "✓ Peut conduire" . PHP_EOL;
} elseif ($age >= 18 && !$permis) {
    echo "✗ Majeur mais pas de permis" . PHP_EOL;
} else {
    echo "✗ Trop jeune" . PHP_EOL;
}

// Opérateur ternaire
$nombre = 7;
$parite = ($nombre % 2 == 0) ? "pair" : "impair";
echo "\\n$nombre est $parite" . PHP_EOL;

// Conditions multiples
$prix = 150;
$reduction = true;

if ($prix > 100 && $reduction) {
    $prixFinal = $prix * 0.9;
    echo "\\nPrix final: $prixFinal € (10% de réduction)" . PHP_EOL;
} else {
    echo "\\nPrix final: $prix €" . PHP_EOL;
}

// Valeurs truthy et falsy
echo "\\n=== Truthy et Falsy ===" . PHP_EOL;
$valeurs = [0, "", null, false, "0", [], true];
foreach ($valeurs as $val) {
    $type = gettype($val);
    $etat = $val ? "truthy" : "falsy";
    echo "$type : $etat" . PHP_EOL;
}
?>`,
        ),
        task: "Écrivez un programme qui détermine si une année est bissextile (divisible par 4 mais pas par 100, sauf si divisible par 400).",
        takeaway:
          "if/elseif/else pour brancher l'exécution. && pour ET, || pour OU. Ternaire : condition ? vrai : faux.",
        quiz: quiz(
          "Que fait l'opérateur && ?",
          ["OU logique", "ET logique", "NON logique"],
          1,
          "&& retourne true seulement si les deux conditions sont vraies."
        ),
        link: docs + "control-structures.if.php",
      }),
      lesson({
        id: "php-switch",
        title: "Switch : sélection multiple",
        minutes: 20,
        summary:
          "switch teste une variable contre plusieurs valeurs. Plus lisible que des if/else multiples. break obligatoire après chaque case pour éviter le fall-through.",
        sections: [
          section(
            "Structure du switch",
            "switch évalue une expression et saute au case correspondant.",
            [
              "switch (variable) { case valeur: code; break; }",
              "break obligatoire pour sortir",
              "Sans break : continue dans les case suivants",
              "default : cas par défaut",
              "Fonctionne avec int, string, etc.",
              "Plusieurs case peuvent partager le même code",
            ]
          ),
          section(
            "Quand utiliser switch",
            "switch est idéal pour tester une variable contre plusieurs valeurs exactes.",
            [
              "Bon pour : menus, codes, états",
              "Pas bon pour : intervalles, conditions complexes",
              "Alternative : if/elseif pour conditions riches",
              "PHP 8+ : match expression (plus moderne)",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Switch classique
$jour = 3;

echo "Jour $jour : ";
switch ($jour) {
    case 1:
        echo "Lundi";
        break;
    case 2:
        echo "Mardi";
        break;
    case 3:
        echo "Mercredi";
        break;
    case 4:
        echo "Jeudi";
        break;
    case 5:
        echo "Vendredi";
        break;
    case 6:
    case 7:  // Plusieurs case pour le même code
        echo "Week-end !";
        break;
    default:
        echo "Jour invalide";
}
echo PHP_EOL;

// Switch avec string
$note = "B";

echo "\\nNote $note : ";
switch ($note) {
    case "A":
        echo "Excellent (16-20)";
        break;
    case "B":
        echo "Bien (14-15)";
        break;
    case "C":
        echo "Assez bien (12-13)";
        break;
    case "D":
        echo "Passable (10-11)";
        break;
    case "F":
        echo "Insuffisant (0-9)";
        break;
    default:
        echo "Note invalide";
}
echo PHP_EOL;

// Menu simple
$choix = 2;

echo "\\n=== Menu ===" . PHP_EOL;
echo "Choix: $choix -> ";
switch ($choix) {
    case 1:
        echo "Option 1 sélectionnée";
        break;
    case 2:
        echo "Option 2 sélectionnée";
        break;
    case 3:
        echo "Option 3 sélectionnée";
        break;
    default:
        echo "Choix invalide";
}
echo PHP_EOL;

// PHP 8+ : match expression (alternative moderne)
// $resultat = match($jour) {
//     1 => "Lundi",
//     2 => "Mardi",
//     3 => "Mercredi",
//     default => "Autre jour"
// };
?>`,
        ),
        task: "Créez un switch pour une calculatrice : selon l'opération (+, -, *, /), effectuez le calcul sur deux nombres.",
        takeaway:
          "switch pour tester une variable contre plusieurs valeurs. break obligatoire ! default pour cas par défaut.",
        quiz: quiz(
          "Que se passe-t-il si on oublie break ?",
          ["Erreur", "Exécution continue dans les case suivants (fall-through)", "Rien"],
          1,
          "Sans break, PHP continue d'exécuter les case suivants (fall-through), ce qui est rarement voulu."
        ),
        link: docs + "control-structures.switch.php",
      }),
    ],
  },
  {
    id: "php-boucles",
    title: "Boucles et répétitions",
    description: "for, while, do-while et foreach",
    lessons: [
      lesson({
        id: "php-boucles-base",
        title: "Boucles for, while, do-while et foreach",
        minutes: 25,
        summary:
          "for pour nombre connu d'itérations, while pour condition, do-while pour au moins une exécution, foreach pour parcourir tableaux. break sort, continue passe à l'itération suivante.",
        sections: [
          section(
            "La boucle for",
            "for est la plus courante quand on connaît le nombre d'itérations.",
            [
              "for (init; condition; incrémentation) { code }",
              "Exemple : for ($i = 0; $i < 10; $i++) { }",
              "$i++ équivaut à $i = $i + 1",
              "Portée de $i : disponible après la boucle en PHP",
            ]
          ),
          section(
            "while et do-while",
            "while teste avant, do-while après (au moins une exécution).",
            [
              "while (condition) { code }",
              "do { code } while (condition);",
              "break : Sort de la boucle",
              "continue : Passe à l'itération suivante",
              "Attention aux boucles infinies !",
            ]
          ),
          section(
            "foreach pour tableaux",
            "foreach parcourt les tableaux facilement.",
            [
              "foreach ($tableau as $valeur) { }",
              "foreach ($tableau as $cle => $valeur) { }",
              "Idéal pour tableaux associatifs",
              "Pas besoin de gérer l'index manuellement",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Boucle for
echo "=== Boucle for (0 à 9) ===" . PHP_EOL;
for ($i = 0; $i < 10; $i++) {
    echo "$i ";
}
echo PHP_EOL;

// Table de multiplication
$n = 7;
echo "\\n=== Table de $n ===" . PHP_EOL;
for ($i = 1; $i <= 10; $i++) {
    $resultat = $n * $i;
    echo "$n x $i = $resultat" . PHP_EOL;
}

// Boucle while
echo "\\n=== Boucle while ===" . PHP_EOL;
$compteur = 0;
while ($compteur < 5) {
    echo "Compteur: $compteur" . PHP_EOL;
    $compteur++;
}

// Boucle do-while (exécute au moins une fois)
echo "\\n=== Boucle do-while ===" . PHP_EOL;
$x = 10;
do {
    echo "x = $x (exécuté au moins une fois)" . PHP_EOL;
    $x++;
} while ($x < 10);  // Condition fausse dès le début, mais s'exécute quand même

// break et continue
echo "\\n=== break et continue ===" . PHP_EOL;
for ($i = 0; $i < 10; $i++) {
    if ($i == 3) {
        echo "(3 sauté avec continue) ";
        continue;  // Passe à $i=4
    }
    if ($i == 7) {
        echo PHP_EOL . "(arrêt à 7 avec break)";
        break;  // Sort de la boucle
    }
    echo "$i ";
}
echo PHP_EOL;

// foreach avec tableau
echo "\\n=== foreach avec tableau ===" . PHP_EOL;
$villes = ["Dakar", "Abidjan", "Lagos", "Nairobi"];

foreach ($villes as $ville) {
    echo "  - $ville" . PHP_EOL;
}

// foreach avec tableau associatif
echo "\\n=== foreach avec clés ===" . PHP_EOL;
$ages = [
    "Alice" => 25,
    "Bob" => 30,
    "Charlie" => 22
];

foreach ($ages as $nom => $age) {
    echo "$nom a $age ans" . PHP_EOL;
}

// Somme de 1 à 100
$somme = 0;
for ($i = 1; $i <= 100; $i++) {
    $somme += $i;
}
echo "\\nSomme de 1 à 100: $somme" . PHP_EOL;
?>`,
        ),
        task: "Créez un programme qui affiche tous les nombres pairs de 0 à 20, puis calcule leur somme avec foreach.",
        takeaway:
          "for pour itérations connues, while pour condition, do-while pour au moins une fois, foreach pour tableaux. break sort, continue passe à la suivante.",
        quiz: quiz(
          "Quelle boucle garantit au moins une exécution ?",
          ["for", "while", "do-while"],
          2,
          "do-while exécute le code une fois avant de tester la condition."
        ),
        link: docs + "control-structures.for.php",
      }),
    ],
  },
  {
    id: "php-fonctions",
    title: "Fonctions",
    description: "Créer et réutiliser du code avec les fonctions",
    lessons: [
      lesson({
        id: "php-fonctions-base",
        title: "Définir et appeler des fonctions",
        minutes: 20,
        summary:
          "Les fonctions encapsulent du code réutilisable. function nomFonction() { } pour définir, nomFonction() pour appeler. return renvoie une valeur.",
        sections: [
          section(
            "Déclarer une fonction",
            "Une fonction regroupe du code réutilisable.",
            [
              "function nomFonction() { code }",
              "Appel : nomFonction();",
              "return valeur; pour renvoyer un résultat",
              "void si pas de return",
              "Noms de fonction insensibles à la casse (mais convention camelCase)",
              "Portée : variables locales vs globales",
            ]
          ),
          section(
            "Paramètres et arguments",
            "Passer des données à une fonction.",
            [
              "function addition($a, $b) { return $a + $b; }",
              "Valeurs par défaut : function saluer($nom = 'visiteur') { }",
              "Type hints (PHP 7+) : function ajouter(int $a, int $b): int { }",
              "Arguments nommés (PHP 8+) : fonction(nom: 'Alice')",
              "... pour nombre variable d'arguments",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Fonction simple
function direBonjour() {
    echo "Bonjour DevAfrica !" . PHP_EOL;
}

direBonjour();

// Fonction avec paramètres
function saluer($nom) {
    echo "Bonjour $nom !" . PHP_EOL;
}

saluer("Alice");
saluer("Bob");

// Fonction avec return
function addition($a, $b) {
    return $a + $b;
}

$resultat = addition(5, 3);
echo "\\n5 + 3 = $resultat" . PHP_EOL;

// Valeur par défaut
function creerUtilisateur($nom, $role = "utilisateur") {
    return "Création de $nom avec rôle: $role";
}

echo creerUtilisateur("Alice") . PHP_EOL;
echo creerUtilisateur("Bob", "admin") . PHP_EOL;

// Type hints (PHP 7+)
function multiplier(int $a, int $b): int {
    return $a * $b;
}

echo "\\n4 * 7 = " . multiplier(4, 7) . PHP_EOL;

// Fonction avec plusieurs returns
function obtenirMention($note) {
    if ($note >= 16) return "Très bien";
    if ($note >= 14) return "Bien";
    if ($note >= 12) return "Assez bien";
    if ($note >= 10) return "Passable";
    return "Insuffisant";
}

$note = 15;
echo "\\nNote $note : " . obtenirMention($note) . PHP_EOL;

// Portée des variables
$compteur = 10;  // Variable globale

function incrementer() {
    global $compteur;  // Accès à la variable globale
    $compteur++;
}

echo "\\nAvant: $compteur" . PHP_EOL;
incrementer();
echo "Après: $compteur" . PHP_EOL;

// Nombre variable d'arguments
function somme(...$nombres) {
    $total = 0;
    foreach ($nombres as $n) {
        $total += $n;
    }
    return $total;
}

echo "\\nSomme(1,2,3,4,5) = " . somme(1, 2, 3, 4, 5) . PHP_EOL;
?>`,
        ),
        task: "Créez une fonction calculerMoyenne($notes) qui accepte un tableau de notes et retourne leur moyenne.",
        takeaway:
          "Fonctions : function nom($params) { return valeur; }. Réutilisabilité. Type hints pour sécurité. Valeurs par défaut.",
        quiz: quiz(
          "À quoi sert return dans une fonction ?",
          ["Afficher une valeur", "Renvoyer une valeur au code appelant", "Terminer le script"],
          1,
          "return renvoie une valeur au code qui a appelé la fonction. Sans return, la fonction renvoie null."
        ),
        link: docs + "functions.user-defined.php",
      }),
      lesson({
        id: "php-fonctions-avancees",
        title: "Fonctions anonymes et callbacks",
        minutes: 20,
        summary:
          "PHP supporte les fonctions anonymes (closures) et les callbacks. Utiles pour array_map, array_filter, usort. use() pour capturer variables externes.",
        sections: [
          section(
            "Fonctions anonymes",
            "Fonctions sans nom assignées à une variable.",
            [
              "$var = function() { code };",
              "Appelées comme $var();",
              "use ($var) pour capturer contexte externe",
              "Closures : capturent environnement",
              "Utiles pour callbacks",
            ]
          ),
          section(
            "Callbacks avec array_map, array_filter",
            "Fonctions qui prennent d'autres fonctions en paramètre.",
            [
              "array_map($fonction, $tableau) : applique fonction à chaque élément",
              "array_filter($tableau, $fonction) : filtre éléments",
              "usort($tableau, $fonction) : tri personnalisé",
              "Arrow functions (PHP 7.4+) : fn($x) => $x * 2",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Fonction anonyme
$saluer = function($nom) {
    return "Bonjour $nom !";
};

echo $saluer("Alice") . PHP_EOL;

// Closure avec use
$multiplicateur = 5;
$multiplier = function($n) use ($multiplicateur) {
    return $n * $multiplicateur;
};

echo "\\n3 * $multiplicateur = " . $multiplier(3) . PHP_EOL;

// array_map
$nombres = [1, 2, 3, 4, 5];
$carres = array_map(function($n) {
    return $n * $n;
}, $nombres);

echo "\\nCarrés: " . implode(", ", $carres) . PHP_EOL;

// array_filter
$nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
$pairs = array_filter($nombres, function($n) {
    return $n % 2 == 0;
});

echo "Nombres pairs: " . implode(", ", $pairs) . PHP_EOL;

// Arrow function (PHP 7.4+)
// $doubler = fn($x) => $x * 2;
// $doubles = array_map($doubler, $nombres);

// Callback pour tri personnalisé
$personnes = [
    ["nom" => "Alice", "age" => 25],
    ["nom" => "Bob", "age" => 20],
    ["nom" => "Charlie", "age" => 30]
];

usort($personnes, function($a, $b) {
    return $a["age"] - $b["age"];
});

echo "\\nTri par âge:" . PHP_EOL;
foreach ($personnes as $p) {
    echo "  {$p['nom']}: {$p['age']} ans" . PHP_EOL;
}

// Fonction qui retourne une fonction
function creerMultiplicateur($facteur) {
    return function($n) use ($facteur) {
        return $n * $facteur;
    };
}

$double = creerMultiplicateur(2);
$triple = creerMultiplicateur(3);

echo "\\nDouble de 5: " . $double(5) . PHP_EOL;
echo "Triple de 5: " . $triple(5) . PHP_EOL;
?>`,
        ),
        task: "Utilisez array_filter pour extraire tous les nombres > 50 d'un tableau, puis array_map pour les doubler.",
        takeaway:
          "Fonctions anonymes : $f = function() { }. Callbacks pour array_map/filter. use() pour capturer contexte. Arrow functions PHP 7.4+.",
        quiz: quiz(
          "À quoi sert array_map ?",
          ["Filtrer un tableau", "Appliquer une fonction à chaque élément", "Trier un tableau"],
          1,
          "array_map applique une fonction à chaque élément d'un tableau et retourne le tableau transformé."
        ),
        link: docs + "functions.anonymous.php",
      }),
    ],
  },
  {
    id: "php-tableaux",
    title: "Tableaux (Arrays)",
    description: "Tableaux indexés et associatifs",
    lessons: [
      lesson({
        id: "php-tableaux-base",
        title: "Tableaux indexés et associatifs",
        minutes: 25,
        summary:
          "PHP a deux types de tableaux : indexés (clés numériques) et associatifs (clés string). [] ou array() pour créer. Accès par clé. foreach pour parcourir.",
        sections: [
          section(
            "Tableaux indexés",
            "Tableaux avec indices numériques automatiques (0, 1, 2...).",
            [
              "$tab = [valeur1, valeur2]; ou array()",
              "Accès : $tab[0], $tab[1]...",
              "count($tab) : nombre d'éléments",
              "$tab[] = valeur; : ajouter à la fin",
              "array_push($tab, valeur) : ajouter",
              "array_pop($tab) : retirer le dernier",
            ]
          ),
          section(
            "Tableaux associatifs",
            "Tableaux avec clés personnalisées (string).",
            [
              "$tab = ['cle' => 'valeur'];",
              "Accès : $tab['cle']",
              "Utile pour structures type dictionnaire",
              "foreach ($tab as $cle => $valeur) { }",
              "array_keys($tab) : obtenir les clés",
              "array_values($tab) : obtenir les valeurs",
            ]
          ),
          section(
            "Fonctions utiles",
            "PHP offre de nombreuses fonctions pour manipuler les tableaux.",
            [
              "count() : nombre d'éléments",
              "in_array($valeur, $tab) : chercher valeur",
              "array_search($valeur, $tab) : trouver clé",
              "sort($tab) : trier (modifie tableau)",
              "implode(', ', $tab) : joindre en string",
              "explode(',', $string) : séparer string en tableau",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Tableau indexé
$villes = ["Dakar", "Abidjan", "Lagos"];

echo "=== Tableau indexé ===" . PHP_EOL;
echo "Première ville: " . $villes[0] . PHP_EOL;
echo "Nombre de villes: " . count($villes) . PHP_EOL;

// Ajouter un élément
$villes[] = "Nairobi";
echo "Après ajout: " . implode(", ", $villes) . PHP_EOL;

// Parcourir avec foreach
echo "\\nListe des villes:" . PHP_EOL;
foreach ($villes as $index => $ville) {
    echo "  $index: $ville" . PHP_EOL;
}

// Tableau associatif
$personne = [
    "nom" => "Alice",
    "age" => 25,
    "ville" => "Dakar",
    "profession" => "Développeuse"
];

echo "\\n=== Tableau associatif ===" . PHP_EOL;
echo "Nom: {$personne['nom']}" . PHP_EOL;
echo "Âge: {$personne['age']} ans" . PHP_EOL;

// Parcourir tableau associatif
echo "\\nInformations:" . PHP_EOL;
foreach ($personne as $cle => $valeur) {
    echo "  $cle: $valeur" . PHP_EOL;
}

// Tableau multidimensionnel
$employes = [
    ["nom" => "Alice", "salaire" => 50000],
    ["nom" => "Bob", "salaire" => 60000],
    ["nom" => "Charlie", "salaire" => 55000]
];

echo "\\n=== Employés ===" . PHP_EOL;
foreach ($employes as $employe) {
    echo "{$employe['nom']}: {$employe['salaire']} €" . PHP_EOL;
}

// Fonctions utiles
$nombres = [5, 2, 8, 1, 9, 3];

echo "\\n=== Fonctions tableau ===" . PHP_EOL;
echo "Original: " . implode(", ", $nombres) . PHP_EOL;

sort($nombres);
echo "Trié: " . implode(", ", $nombres) . PHP_EOL;

$max = max($nombres);
$min = min($nombres);
echo "Min: $min, Max: $max" . PHP_EOL;

// in_array et array_search
$cherche = 8;
if (in_array($cherche, $nombres)) {
    $position = array_search($cherche, $nombres);
    echo "\\n$cherche trouvé à la position $position" . PHP_EOL;
}

// array_slice
$extrait = array_slice($nombres, 0, 3);
echo "\\nPremiers 3: " . implode(", ", $extrait) . PHP_EOL;

// array_merge
$tab1 = [1, 2, 3];
$tab2 = [4, 5, 6];
$fusion = array_merge($tab1, $tab2);
echo "Fusion: " . implode(", ", $fusion) . PHP_EOL;
?>`,
        ),
        task: "Créez un tableau associatif représentant 5 produits avec nom et prix. Calculez le prix total avec foreach.",
        takeaway:
          "Tableaux indexés [val] et associatifs ['cle'=>val]. foreach pour parcourir. count(), sort(), in_array() utiles.",
        quiz: quiz(
          "Quelle différence entre tableau indexé et associatif ?",
          ["Aucune", "Indexé = clés numériques, associatif = clés personnalisées", "Associatif est plus rapide"],
          1,
          "Indexé utilise 0,1,2... comme clés. Associatif utilise des clés string personnalisées : ['nom'=>'Alice']."
        ),
        link: docs + "language.types.array.php",
      }),
      lesson({
        id: "php-tableaux-fonctions",
        title: "Fonctions avancées sur les tableaux",
        minutes: 20,
        summary:
          "Fonctions puissantes : array_map (transformer), array_filter (filtrer), array_reduce (réduire), array_unique, array_reverse, etc.",
        sections: [
          section(
            "Transformation et filtrage",
            "Manipuler tableaux avec fonctions de haut niveau.",
            [
              "array_map($fonction, $tab) : transformer chaque élément",
              "array_filter($tab, $fonction) : garder éléments selon condition",
              "array_reduce($tab, $fonction, $initial) : réduire à une valeur",
              "array_unique($tab) : supprimer doublons",
              "array_reverse($tab) : inverser l'ordre",
            ]
          ),
          section(
            "Extraction et combinaison",
            "Extraire portions, combiner tableaux.",
            [
              "array_slice($tab, $debut, $longueur) : extraire portion",
              "array_splice($tab, $debut, $longueur, $remplacement) : modifier",
              "array_merge($tab1, $tab2) : fusionner",
              "array_combine($cles, $valeurs) : créer associatif",
              "array_chunk($tab, $taille) : découper en morceaux",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// array_map : transformer
$nombres = [1, 2, 3, 4, 5];
$carres = array_map(function($n) {
    return $n * $n;
}, $nombres);

echo "=== array_map (carrés) ===" . PHP_EOL;
echo "Original: " . implode(", ", $nombres) . PHP_EOL;
echo "Carrés: " . implode(", ", $carres) . PHP_EOL;

// array_filter : filtrer
$nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
$pairs = array_filter($nombres, function($n) {
    return $n % 2 == 0;
});

echo "\\n=== array_filter (pairs) ===" . PHP_EOL;
echo "Pairs: " . implode(", ", $pairs) . PHP_EOL;

// array_reduce : réduire
$somme = array_reduce($nombres, function($acc, $n) {
    return $acc + $n;
}, 0);

echo "\\n=== array_reduce (somme) ===" . PHP_EOL;
echo "Somme 1-10: $somme" . PHP_EOL;

// array_unique : supprimer doublons
$avec_doublons = [1, 2, 2, 3, 3, 3, 4, 5, 5];
$uniques = array_unique($avec_doublons);

echo "\\n=== array_unique ===" . PHP_EOL;
echo "Avec doublons: " . implode(", ", $avec_doublons) . PHP_EOL;
echo "Uniques: " . implode(", ", $uniques) . PHP_EOL;

// array_slice : extraire portion
$villes = ["Dakar", "Abidjan", "Lagos", "Nairobi", "Accra"];
$extrait = array_slice($villes, 1, 3);

echo "\\n=== array_slice ===" . PHP_EOL;
echo "Original: " . implode(", ", $villes) . PHP_EOL;
echo "Extrait (index 1, 3 éléments): " . implode(", ", $extrait) . PHP_EOL;

// array_combine : créer associatif
$noms = ["Alice", "Bob", "Charlie"];
$ages = [25, 30, 22];
$personnes = array_combine($noms, $ages);

echo "\\n=== array_combine ===" . PHP_EOL;
foreach ($personnes as $nom => $age) {
    echo "$nom: $age ans" . PHP_EOL;
}

// array_chunk : découper
$nombres = range(1, 10);
$groupes = array_chunk($nombres, 3);

echo "\\n=== array_chunk (groupes de 3) ===" . PHP_EOL;
foreach ($groupes as $index => $groupe) {
    echo "Groupe $index: " . implode(", ", $groupe) . PHP_EOL;
}

// Exemple pratique : calculer moyenne
$notes = [15, 12, 18, 14, 16];
$somme = array_reduce($notes, fn($acc, $n) => $acc + $n, 0);
$moyenne = $somme / count($notes);

echo "\\n=== Calcul moyenne ===" . PHP_EOL;
echo "Notes: " . implode(", ", $notes) . PHP_EOL;
echo "Moyenne: $moyenne" . PHP_EOL;
?>`,
        ),
        task: "Créez un tableau de températures. Filtrez celles > 25°C, puis calculez leur moyenne avec array_reduce.",
        takeaway:
          "array_map transforme, array_filter filtre, array_reduce agrège. array_slice extrait, array_unique déduplique.",
        quiz: quiz(
          "Que fait array_reduce ?",
          ["Filtre un tableau", "Réduit un tableau à une seule valeur", "Supprime doublons"],
          1,
          "array_reduce applique une fonction accumulateur pour réduire le tableau à une seule valeur (somme, produit, etc.)."
        ),
        link: docs + "ref.array.php",
      }),
    ],
  },
  {
    id: "php-erreurs",
    title: "Gestion des erreurs",
    description: "try/catch, exceptions et error_log",
    lessons: [
      lesson({
        id: "php-exceptions",
        title: "Exceptions et try/catch",
        minutes: 20,
        summary:
          "Les exceptions gèrent les erreurs avec try/catch. throw lance une exception, catch l'attrape. finally s'exécute toujours. Classes d'exceptions : Exception, InvalidArgumentException, etc.",
        sections: [
          section(
            "Structure try/catch",
            "Gérer les erreurs avec exceptions.",
            [
              "try { code_risque } catch (Exception $e) { gestion }",
              "throw new Exception('message') : lancer exception",
              "finally { } : toujours exécuté",
              "$e->getMessage() : message d'erreur",
              "$e->getCode() : code d'erreur",
              "$e->getTrace() : pile d'appels",
            ]
          ),
          section(
            "Types d'exceptions",
            "PHP offre plusieurs classes d'exceptions.",
            [
              "Exception : classe de base",
              "InvalidArgumentException : argument invalide",
              "RuntimeException : erreur d'exécution",
              "LogicException : erreur logique",
              "DivisionByZeroError : division par zéro",
              "Créer classes personnalisées : extends Exception",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Exemple simple try/catch
function diviser($a, $b) {
    if ($b == 0) {
        throw new Exception("Division par zéro impossible !");
    }
    return $a / $b;
}

echo "=== try/catch simple ===" . PHP_EOL;
try {
    $resultat = diviser(10, 2);
    echo "10 / 2 = $resultat" . PHP_EOL;
    
    $resultat = diviser(10, 0);  // Lance exception
    echo "Cette ligne ne s'exécute jamais" . PHP_EOL;
    
} catch (Exception $e) {
    echo "Erreur attrapée: " . $e->getMessage() . PHP_EOL;
}

// finally : toujours exécuté
echo "\\n=== try/catch/finally ===" . PHP_EOL;
try {
    echo "Tentative d'opération..." . PHP_EOL;
    throw new Exception("Erreur simulée");
} catch (Exception $e) {
    echo "Erreur: {$e->getMessage()}" . PHP_EOL;
} finally {
    echo "Nettoyage (finally toujours exécuté)" . PHP_EOL;
}

// Exception spécifique
function validerAge($age) {
    if (!is_int($age)) {
        throw new InvalidArgumentException("L'âge doit être un entier");
    }
    if ($age < 0 || $age > 150) {
        throw new OutOfRangeException("L'âge doit être entre 0 et 150");
    }
    return true;
}

echo "\\n=== Exceptions spécifiques ===" . PHP_EOL;
try {
    validerAge(25);
    echo "Âge valide" . PHP_EOL;
    
    validerAge("abc");  // InvalidArgumentException
    
} catch (InvalidArgumentException $e) {
    echo "Argument invalide: {$e->getMessage()}" . PHP_EOL;
} catch (OutOfRangeException $e) {
    echo "Hors limites: {$e->getMessage()}" . PHP_EOL;
} catch (Exception $e) {
    echo "Autre erreur: {$e->getMessage()}" . PHP_EOL;
}

// Exception personnalisée
class AgeInvalideException extends Exception {
    public function messagePersonnalise() {
        return "⚠️ Erreur âge: {$this->getMessage()}";
    }
}

function verifierAge($age) {
    if ($age < 18) {
        throw new AgeInvalideException("Vous devez avoir 18 ans minimum");
    }
}

echo "\\n=== Exception personnalisée ===" . PHP_EOL;
try {
    verifierAge(15);
} catch (AgeInvalideException $e) {
    echo $e->messagePersonnalise() . PHP_EOL;
}

// Plusieurs catch
function traiterDonnees($valeur) {
    if ($valeur === null) {
        throw new InvalidArgumentException("Valeur null non acceptée");
    }
    if (!is_numeric($valeur)) {
        throw new RuntimeException("Valeur doit être numérique");
    }
    return $valeur * 2;
}

echo "\\n=== Plusieurs catch ===" . PHP_EOL;
$valeurs = [10, null, "abc"];

foreach ($valeurs as $val) {
    try {
        $resultat = traiterDonnees($val);
        echo "Résultat: $resultat" . PHP_EOL;
    } catch (InvalidArgumentException $e) {
        echo "❌ Argument: {$e->getMessage()}" . PHP_EOL;
    } catch (RuntimeException $e) {
        echo "❌ Runtime: {$e->getMessage()}" . PHP_EOL;
    }
}
?>`,
        ),
        task: "Créez une fonction qui calcule la racine carrée. Lancez exception si nombre négatif. Testez avec try/catch.",
        takeaway:
          "try/catch gère erreurs. throw lance exception. catch attrape. finally toujours exécuté. Exceptions typées pour clarté.",
        quiz: quiz(
          "Quand s'exécute le bloc finally ?",
          ["Seulement si erreur", "Toujours, erreur ou pas", "Jamais"],
          1,
          "finally s'exécute TOUJOURS, qu'il y ait exception ou non. Idéal pour nettoyage (fermer fichiers, connexions)."
        ),
        link: docs + "language.exceptions.php",
      }),
    ],
  },
  {
    id: "php-fichiers",
    title: "Manipulation de fichiers",
    description: "Lire et écrire des fichiers",
    lessons: [
      lesson({
        id: "php-fichiers-base",
        title: "Lire et écrire dans des fichiers",
        minutes: 25,
        summary:
          "PHP manipule fichiers avec fopen, fread, fwrite, fclose. file_get_contents/file_put_contents plus simples. Modes : 'r' lecture, 'w' écriture, 'a' ajout.",
        sections: [
          section(
            "Lire des fichiers",
            "Plusieurs méthodes pour lire.",
            [
              "file_get_contents($fichier) : lire tout en string",
              "file($fichier) : lire en tableau de lignes",
              "fopen($fichier, 'r') + fread() + fclose() : manuel",
              "file_exists($fichier) : vérifier existence",
              "is_readable($fichier) : vérifier droits lecture",
            ]
          ),
          section(
            "Écrire dans des fichiers",
            "Créer et modifier fichiers.",
            [
              "file_put_contents($fichier, $contenu) : écrire (écrase)",
              "file_put_contents($fichier, $contenu, FILE_APPEND) : ajouter",
              "fopen($fichier, 'w') + fwrite() + fclose() : manuel",
              "Modes : 'r' lecture, 'w' écriture, 'a' ajout, 'r+' lecture/écriture",
              "is_writable($fichier) : vérifier droits écriture",
            ]
          ),
          section(
            "Gestion des erreurs",
            "Toujours vérifier et gérer les erreurs.",
            [
              "Vérifier file_exists() avant lecture",
              "try/catch pour exceptions",
              "fclose() toujours fermer fichier ouvert",
              "Permissions : 0644 pour fichiers, 0755 pour dossiers",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Écrire dans un fichier (simple)
$contenu = "Bonjour DevAfrica !\\nCeci est un test de fichier.\\n";
$fichier = "test.txt";

file_put_contents($fichier, $contenu);
echo "=== Fichier créé ===" . PHP_EOL;
echo "Fichier '$fichier' créé avec succès." . PHP_EOL;

// Lire tout le contenu
if (file_exists($fichier)) {
    $lu = file_get_contents($fichier);
    echo "\\n=== Contenu du fichier ===" . PHP_EOL;
    echo $lu;
}

// Ajouter du contenu
file_put_contents($fichier, "Ligne ajoutée !\\n", FILE_APPEND);
echo "\\n=== Après ajout ===" . PHP_EOL;
echo file_get_contents($fichier);

// Lire ligne par ligne
$lignes = file($fichier, FILE_IGNORE_NEW_LINES);
echo "\\n=== Lecture ligne par ligne ===" . PHP_EOL;
foreach ($lignes as $numero => $ligne) {
    echo "Ligne " . ($numero + 1) . ": $ligne" . PHP_EOL;
}

// Méthode manuelle avec fopen
$fichier2 = "manuel.txt";
$handle = fopen($fichier2, "w");

if ($handle) {
    fwrite($handle, "Première ligne\\n");
    fwrite($handle, "Deuxième ligne\\n");
    fwrite($handle, "Troisième ligne\\n");
    fclose($handle);
    echo "\\n'$fichier2' créé manuellement." . PHP_EOL;
}

// Lire avec fopen
$handle = fopen($fichier2, "r");
if ($handle) {
    echo "\\n=== Contenu de '$fichier2' ===" . PHP_EOL;
    while (($ligne = fgets($handle)) !== false) {
        echo $ligne;
    }
    fclose($handle);
}

// Vérifications
echo "\\n=== Vérifications ===" . PHP_EOL;
echo "$fichier existe: " . (file_exists($fichier) ? "oui" : "non") . PHP_EOL;
echo "Lisible: " . (is_readable($fichier) ? "oui" : "non") . PHP_EOL;
echo "Modifiable: " . (is_writable($fichier) ? "oui" : "non") . PHP_EOL;
echo "Taille: " . filesize($fichier) . " octets" . PHP_EOL;

// Gestion d'erreur
echo "\\n=== Gestion erreur ===" . PHP_EOL;
try {
    if (!file_exists("inexistant.txt")) {
        throw new Exception("Fichier inexistant.txt n'existe pas");
    }
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . PHP_EOL;
}

// Sauvegarder des données structurées
$utilisateurs = [
    ["nom" => "Alice", "email" => "alice@test.com"],
    ["nom" => "Bob", "email" => "bob@test.com"]
];

$json = json_encode($utilisateurs, JSON_PRETTY_PRINT);
file_put_contents("utilisateurs.json", $json);
echo "\\nFichier JSON sauvegardé." . PHP_EOL;

// Charger JSON
$charge = file_get_contents("utilisateurs.json");
$utilisateursCharges = json_decode($charge, true);

echo "\\n=== Utilisateurs chargés ===" . PHP_EOL;
foreach ($utilisateursCharges as $u) {
    echo "  - {$u['nom']}: {$u['email']}" . PHP_EOL;
}

// Nettoyage
unlink($fichier);
unlink($fichier2);
unlink("utilisateurs.json");
echo "\\nFichiers de test supprimés." . PHP_EOL;
?>`,
        ),
        task: "Créez un fichier 'notes.txt', écrivez-y 5 notes, lisez-les et calculez la moyenne. Gérez les erreurs avec try/catch.",
        takeaway:
          "file_get_contents() lit, file_put_contents() écrit. file() lit en lignes. Vérifier file_exists(). Modes r/w/a.",
        quiz: quiz(
          "Quelle différence entre 'w' et 'a' en mode fopen ?",
          ["Aucune", "'w' écrase le fichier, 'a' ajoute à la fin", "'a' est plus rapide"],
          1,
          "'w' (write) écrase le contenu existant. 'a' (append) ajoute à la fin sans écraser."
        ),
        link: docs + "ref.filesystem.php",
      }),
    ],
  },
  {
    id: "php-exercice-final-debutant",
    title: "Exercice final récapitulatif",
    description: "Projet complet utilisant tout le niveau débutant",
    lessons: [
      lesson({
        id: "php-projet-carnet",
        title: "Projet : Carnet de contacts",
        minutes: 45,
        summary:
          "Créez un carnet de contacts en ligne de commande. Ajouter, lister, rechercher, supprimer contacts. Sauvegarde JSON. Utilise toutes les notions : variables, tableaux, fonctions, fichiers, boucles.",
        sections: [
          section(
            "Objectif du projet",
            "Application CLI complète avec persistance fichier.",
            [
              "Menu interactif : ajouter, lister, rechercher, supprimer",
              "Contacts : nom, email, téléphone",
              "Sauvegarde automatique JSON",
              "Validation données (email, téléphone)",
              "Gestion erreurs",
              "Code modulaire avec fonctions",
            ]
          ),
          section(
            "Fonctionnalités attendues",
            "Liste des features à implémenter.",
            [
              "1. Ajouter un contact (validation email)",
              "2. Lister tous les contacts",
              "3. Rechercher par nom",
              "4. Supprimer un contact",
              "5. Sauvegarder/charger JSON",
              "6. Menu en boucle jusqu'à quitter",
            ]
          ),
          section(
            "Structure suggérée",
            "Organisation du code.",
            [
              "Tableau global $contacts",
              "Fonctions : ajouterContact(), listerContacts(), etc.",
              "chargerContacts() au démarrage",
              "sauvegarderContacts() après chaque modification",
              "boucle while pour menu",
              "switch pour traiter choix",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// ============================================
// CARNET DE CONTACTS - Projet Récapitulatif
// ============================================

$FICHIER_CONTACTS = "contacts.json";
$contacts = [];

// Charger contacts depuis JSON
function chargerContacts() {
    global $FICHIER_CONTACTS, $contacts;
    
    if (file_exists($FICHIER_CONTACTS)) {
        $json = file_get_contents($FICHIER_CONTACTS);
        $contacts = json_decode($json, true) ?? [];
        echo "📂 " . count($contacts) . " contact(s) chargé(s)." . PHP_EOL;
    } else {
        echo "📂 Nouveau carnet créé." . PHP_EOL;
    }
}

// Sauvegarder contacts en JSON
function sauvegarderContacts() {
    global $FICHIER_CONTACTS, $contacts;
    
    $json = json_encode($contacts, JSON_PRETTY_PRINT);
    file_put_contents($FICHIER_CONTACTS, $json);
    echo "💾 Sauvegarde effectuée." . PHP_EOL;
}

// Valider email
function estEmailValide($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Ajouter un contact
function ajouterContact($nom, $email, $telephone) {
    global $contacts;
    
    // Validation
    if (empty($nom)) {
        echo "❌ Le nom est obligatoire." . PHP_EOL;
        return;
    }
    
    if (!estEmailValide($email)) {
        echo "❌ Email invalide." . PHP_EOL;
        return;
    }
    
    // Vérifier doublon
    foreach ($contacts as $contact) {
        if ($contact['email'] === $email) {
            echo "❌ Ce contact existe déjà." . PHP_EOL;
            return;
        }
    }
    
    $contacts[] = [
        'nom' => $nom,
        'email' => $email,
        'telephone' => $telephone,
        'date_ajout' => date('Y-m-d H:i:s')
    ];
    
    echo "✅ Contact '$nom' ajouté avec succès." . PHP_EOL;
    sauvegarderContacts();
}

// Lister tous les contacts
function listerContacts() {
    global $contacts;
    
    if (empty($contacts)) {
        echo "📭 Aucun contact dans le carnet." . PHP_EOL;
        return;
    }
    
    echo "\\n" . str_repeat("=", 60) . PHP_EOL;
    echo "📋 LISTE DES CONTACTS (" . count($contacts) . ")" . PHP_EOL;
    echo str_repeat("=", 60) . PHP_EOL;
    
    foreach ($contacts as $index => $c) {
        echo "\\n[$index] {$c['nom']}" . PHP_EOL;
        echo "    📧 {$c['email']}" . PHP_EOL;
        echo "    📞 {$c['telephone']}" . PHP_EOL;
        echo "    📅 Ajouté le: {$c['date_ajout']}" . PHP_EOL;
    }
    echo str_repeat("=", 60) . PHP_EOL;
}

// Rechercher un contact
function rechercherContact($recherche) {
    global $contacts;
    
    $trouves = array_filter($contacts, function($c) use ($recherche) {
        return stripos($c['nom'], $recherche) !== false;
    });
    
    if (empty($trouves)) {
        echo "🔍 Aucun contact trouvé pour '$recherche'." . PHP_EOL;
        return;
    }
    
    echo "\\n🔍 " . count($trouves) . " contact(s) trouvé(s):" . PHP_EOL;
    foreach ($trouves as $c) {
        echo "  - {$c['nom']} ({$c['email']})" . PHP_EOL;
    }
}

// Supprimer un contact
function supprimerContact($index) {
    global $contacts;
    
    if (!isset($contacts[$index])) {
        echo "❌ Contact inexistant." . PHP_EOL;
        return;
    }
    
    $nom = $contacts[$index]['nom'];
    array_splice($contacts, $index, 1);
    
    echo "🗑️  Contact '$nom' supprimé." . PHP_EOL;
    sauvegarderContacts();
}

// Afficher le menu
function afficherMenu() {
    echo "\\n" . str_repeat("━", 50) . PHP_EOL;
    echo "📇 CARNET DE CONTACTS" . PHP_EOL;
    echo str_repeat("━", 50) . PHP_EOL;
    echo "1. ➕ Ajouter un contact" . PHP_EOL;
    echo "2. 📋 Lister tous les contacts" . PHP_EOL;
    echo "3. 🔍 Rechercher un contact" . PHP_EOL;
    echo "4. 🗑️  Supprimer un contact" . PHP_EOL;
    echo "5. 🚪 Quitter" . PHP_EOL;
    echo str_repeat("━", 50) . PHP_EOL;
}

// Lire entrée utilisateur
function lireEntree($prompt) {
    echo $prompt;
    return trim(fgets(STDIN));
}

// ============================================
// PROGRAMME PRINCIPAL
// ============================================

echo "🚀 Démarrage du carnet de contacts..." . PHP_EOL;
chargerContacts();

$continuer = true;

while ($continuer) {
    afficherMenu();
    $choix = lireEntree("Votre choix (1-5): ");
    
    switch ($choix) {
        case "1":
            echo "\\n➕ AJOUTER UN CONTACT" . PHP_EOL;
            $nom = lireEntree("Nom: ");
            $email = lireEntree("Email: ");
            $telephone = lireEntree("Téléphone: ");
            ajouterContact($nom, $email, $telephone);
            break;
            
        case "2":
            listerContacts();
            break;
            
        case "3":
            $recherche = lireEntree("\\n🔍 Rechercher: ");
            rechercherContact($recherche);
            break;
            
        case "4":
            listerContacts();
            $index = (int)lireEntree("\\n🗑️  Numéro du contact à supprimer: ");
            supprimerContact($index);
            break;
            
        case "5":
            echo "\\n👋 Au revoir !" . PHP_EOL;
            $continuer = false;
            break;
            
        default:
            echo "❌ Choix invalide." . PHP_EOL;
    }
    
    if ($continuer) {
        lireEntree("\\nAppuyez sur Entrée pour continuer...");
    }
}

echo "\\n✅ Programme terminé." . PHP_EOL;
?>`,
        ),
        task: "Exécutez le programme, ajoutez 3 contacts, testez recherche et suppression. Vérifiez que contacts.json est créé.",
        takeaway:
          "Projet complet utilisant : variables, tableaux, fonctions, boucles, conditions, fichiers JSON, validation. Félicitations ! 🎉",
        quiz: quiz(
          "Quel concept n'est PAS utilisé dans ce projet ?",
          ["Tableaux associatifs", "POO avec classes", "Fonctions", "Fichiers JSON"],
          1,
          "Ce projet utilise programmation procédurale (fonctions). POO sera au niveau intermédiaire avec classes et objets."
        ),
        link: docs + "tutorial.php",
      }),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🟡 NIVEAU INTERMÉDIAIRE - POO et bases de données
// ═══════════════════════════════════════════════════════════════════════════

const intermediate: WebLevel["chapters"] = [
  {
    id: "php-poo",
    title: "POO en PHP",
    description: "Classes, objets, héritage et interfaces",
    lessons: [
      lesson({
        id: "php-classes-objets",
        title: "Classes et objets",
        minutes: 25,
        summary:
          "La POO organise le code en classes (plan) et objets (instances). class pour définir, new pour créer. Propriétés et méthodes. $this pour référence interne. Constructeur __construct().",
        sections: [
          section(
            "Définir une classe",
            "Une classe est un modèle pour créer des objets.",
            [
              "class NomClasse { propriétés et méthodes }",
              "Propriétés : variables dans la classe",
              "Méthodes : fonctions dans la classe",
              "$this->propriete : accès propriété",
              "__construct() : constructeur (initialisation)",
              "new NomClasse() : créer un objet",
            ]
          ),
          section(
            "Visibilité",
            "Contrôler l'accès aux propriétés et méthodes.",
            [
              "public : accessible partout",
              "private : uniquement dans la classe",
              "protected : classe + enfants (héritage)",
              "Bonne pratique : propriétés private, méthodes public",
              "Getters/setters pour accès contrôlé",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Définir une classe
class Personne {
    // Propriétés
    private $nom;
    private $age;
    
    // Constructeur
    public function __construct($nom, $age) {
        $this->nom = $nom;
        $this->age = $age;
    }
    
    // Getters
    public function getNom() {
        return $this->nom;
    }
    
    public function getAge() {
        return $this->age;
    }
    
    // Setter avec validation
    public function setAge($age) {
        if ($age > 0 && $age < 150) {
            $this->age = $age;
        }
    }
    
    // Méthode
    public function sePresenter() {
        return "Je m'appelle {$this->nom} et j'ai {$this->age} ans.";
    }
    
    // Méthode qui retourne booléen
    public function estMajeur() {
        return $this->age >= 18;
    }
}

// Créer des objets
echo "=== Création d'objets ===" . PHP_EOL;
$alice = new Personne("Alice", 25);
$bob = new Personne("Bob", 17);

echo $alice->sePresenter() . PHP_EOL;
echo $bob->sePresenter() . PHP_EOL;

// Appeler méthodes
echo "\\n=== Méthodes ===" . PHP_EOL;
echo $alice->getNom() . " est majeur: " . ($alice->estMajeur() ? "oui" : "non") . PHP_EOL;
echo $bob->getNom() . " est majeur: " . ($bob->estMajeur() ? "oui" : "non") . PHP_EOL;

// Modifier avec setter
$bob->setAge(18);
echo "\\nAprès anniversaire:" . PHP_EOL;
echo $bob->sePresenter() . PHP_EOL;

// Exemple : Compte bancaire
class CompteBancaire {
    private $numero;
    private $solde;
    private $titulaire;
    
    public function __construct($numero, $titulaire, $soldeInitial = 0) {
        $this->numero = $numero;
        $this->titulaire = $titulaire;
        $this->solde = $soldeInitial;
    }
    
    public function deposer($montant) {
        if ($montant > 0) {
            $this->solde += $montant;
            echo "✅ Dépôt de $montant € effectué." . PHP_EOL;
        }
    }
    
    public function retirer($montant) {
        if ($montant > 0 && $montant <= $this->solde) {
            $this->solde -= $montant;
            echo "✅ Retrait de $montant € effectué." . PHP_EOL;
        } else {
            echo "❌ Solde insuffisant." . PHP_EOL;
        }
    }
    
    public function afficherSolde() {
        echo "💰 Compte {$this->numero} ({$this->titulaire}): {$this->solde} €" . PHP_EOL;
    }
}

echo "\\n=== Compte bancaire ===" . PHP_EOL;
$compte = new CompteBancaire("FR001", "Alice", 1000);
$compte->afficherSolde();

$compte->deposer(500);
$compte->retirer(200);
$compte->afficherSolde();

$compte->retirer(2000);  // Échec : solde insuffisant

// Classe Produit
class Produit {
    private $nom;
    private $prix;
    private $quantite;
    
    public function __construct($nom, $prix, $quantite) {
        $this->nom = $nom;
        $this->prix = $prix;
        $this->quantite = $quantite;
    }
    
    public function getPrixTotal() {
        return $this->prix * $this->quantite;
    }
    
    public function afficher() {
        $total = $this->getPrixTotal();
        echo "{$this->nom}: {$this->prix}€ x {$this->quantite} = {$total}€" . PHP_EOL;
    }
}

echo "\\n=== Catalogue produits ===" . PHP_EOL;
$produits = [
    new Produit("Laptop", 999, 2),
    new Produit("Souris", 25, 5),
    new Produit("Clavier", 75, 3)
];

$total = 0;
foreach ($produits as $p) {
    $p->afficher();
    $total += $p->getPrixTotal();
}
echo "\\nTotal commande: {$total}€" . PHP_EOL;
?>`,
        ),
        task: "Créez une classe Livre avec titre, auteur, prix. Ajoutez méthode afficher() et calculerTVA(). Créez 3 livres et affichez-les.",
        takeaway:
          "Classes = modèles. Objets = instances. $this pour accès interne. Constructeur __construct(). Visibilité : public/private/protected.",
        quiz: quiz(
          "À quoi sert $this ?",
          ["Créer un objet", "Référencer l'objet courant dans la classe", "Appeler constructeur"],
          1,
          "$this référence l'instance courante de la classe. Permet d'accéder aux propriétés et méthodes de l'objet."
        ),
        link: docs + "language.oop5.php",
      }),
      lesson({
        id: "php-heritage",
        title: "Héritage",
        minutes: 25,
        summary:
          "L'héritage permet à une classe d'hériter propriétés et méthodes d'une autre. extends pour hériter. parent:: pour appeler parent. Surcharge avec même signature.",
        sections: [
          section(
            "Principe d'héritage",
            "Une classe enfant hérite d'une classe parent.",
            [
              "class Enfant extends Parent { }",
              "Hérite toutes propriétés/méthodes public/protected",
              "protected : accessible dans enfants",
              "parent::methode() : appeler méthode parent",
              "parent::__construct() : appeler constructeur parent",
              "PHP : héritage simple uniquement (1 parent)",
            ]
          ),
          section(
            "Surcharge (Override)",
            "Redéfinir méthode parent dans enfant.",
            [
              "Même nom et signature que parent",
              "Remplace comportement parent",
              "parent::methode() pour appeler version parent",
              "Constructeur : appeler parent::__construct() si besoin",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Classe parent
class Animal {
    protected $nom;
    protected $age;
    
    public function __construct($nom, $age) {
        $this->nom = $nom;
        $this->age = $age;
    }
    
    public function parler() {
        return "{$this->nom} fait un bruit.";
    }
    
    public function decrire() {
        return "{$this->nom} a {$this->age} ans.";
    }
}

// Classes enfants
class Chien extends Animal {
    private $race;
    
    public function __construct($nom, $age, $race) {
        parent::__construct($nom, $age);  // Appel constructeur parent
        $this->race = $race;
    }
    
    // Surcharge
    public function parler() {
        return "{$this->nom} aboie: Woof!";
    }
    
    public function getRace() {
        return $this->race;
    }
}

class Chat extends Animal {
    // Surcharge
    public function parler() {
        return "{$this->nom} miaule: Miaou!";
    }
}

class Oiseau extends Animal {
    public function parler() {
        return "{$this->nom} chante: Cui cui!";
    }
    
    public function voler() {
        return "{$this->nom} vole dans le ciel.";
    }
}

echo "=== Héritage ===" . PHP_EOL;
$rex = new Chien("Rex", 5, "Berger Allemand");
$minou = new Chat("Minou", 3);
$tweety = new Oiseau("Tweety", 1);

echo $rex->decrire() . PHP_EOL;
echo $rex->parler() . PHP_EOL;
echo "Race: " . $rex->getRace() . PHP_EOL;

echo "\\n" . $minou->decrire() . PHP_EOL;
echo $minou->parler() . PHP_EOL;

echo "\\n" . $tweety->decrire() . PHP_EOL;
echo $tweety->parler() . PHP_EOL;
echo $tweety->voler() . PHP_EOL;

// Polymorphisme : tableau d'animaux
echo "\\n=== Polymorphisme ===" . PHP_EOL;
$animaux = [$rex, $minou, $tweety];

foreach ($animaux as $animal) {
    echo $animal->parler() . PHP_EOL;
}

// Exemple : Employés
class Employe {
    protected $nom;
    protected $salaireBase;
    
    public function __construct($nom, $salaireBase) {
        $this->nom = $nom;
        $this->salaireBase = $salaireBase;
    }
    
    public function calculerSalaire() {
        return $this->salaireBase;
    }
    
    public function afficher() {
        $salaire = $this->calculerSalaire();
        return "{$this->nom}: {$salaire}€/mois";
    }
}

class Manager extends Employe {
    private $bonus;
    
    public function __construct($nom, $salaireBase, $bonus) {
        parent::__construct($nom, $salaireBase);
        $this->bonus = $bonus;
    }
    
    public function calculerSalaire() {
        return $this->salaireBase + $this->bonus;
    }
}

class Developpeur extends Employe {
    private $langage;
    
    public function __construct($nom, $salaireBase, $langage) {
        parent::__construct($nom, $salaireBase);
        $this->langage = $langage;
    }
    
    public function getLangage() {
        return $this->langage;
    }
}

echo "\\n=== Employés ===" . PHP_EOL;
$employes = [
    new Employe("Alice", 3000),
    new Manager("Bob", 4000, 1000),
    new Developpeur("Charlie", 3500, "PHP")
];

foreach ($employes as $emp) {
    echo $emp->afficher() . PHP_EOL;
}

// instanceof : vérifier type
echo "\\n=== instanceof ===" . PHP_EOL;
foreach ($employes as $emp) {
    if ($emp instanceof Manager) {
        echo "👔 Manager: {$emp->afficher()}" . PHP_EOL;
    } elseif ($emp instanceof Developpeur) {
        echo "💻 Dev {$emp->getLangage()}: {$emp->afficher()}" . PHP_EOL;
    }
}
?>`,
        ),
        task: "Créez classe Vehicule avec marque, vitesseMax. Créez Voiture et Moto qui héritent. Surchargez méthode decrire().",
        takeaway:
          "Héritage : extends. Enfant hérite parent. parent:: appelle parent. Surcharge = redéfinir méthode. instanceof vérifie type.",
        quiz: quiz(
          "Comment appeler constructeur parent ?",
          ["super()", "parent::__construct()", "this.parent()"],
          1,
          "parent::__construct() appelle le constructeur de la classe parent depuis l'enfant."
        ),
        link: docs + "language.oop5.inheritance.php",
      }),
      lesson({
        id: "php-interfaces-traits",
        title: "Interfaces et traits",
        minutes: 25,
        summary:
          "Interfaces = contrats (méthodes obligatoires). Traits = réutilisation de code (alternative héritage multiple). interface + implements. trait + use.",
        sections: [
          section(
            "Interfaces",
            "Contrat que les classes doivent respecter.",
            [
              "interface NomInterface { signatures }",
              "Uniquement signatures (pas implémentation)",
              "implements pour implémenter",
              "Classe peut implémenter plusieurs interfaces",
              "Toutes méthodes doivent être implémentées",
              "Méthodes interface sont public",
            ]
          ),
          section(
            "Traits",
            "Réutiliser code sans héritage (composition).",
            [
              "trait NomTrait { méthodes }",
              "use NomTrait; dans une classe",
              "Alternative à héritage multiple",
              "Plusieurs traits possibles : use T1, T2, T3;",
              "Résolution conflits : insteadof, as",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Interface : contrat
interface Affichable {
    public function afficher();
}

interface Serializable {
    public function toArray();
    public function toJSON();
}

// Classe implémente interfaces
class Utilisateur implements Affichable, Serializable {
    private $nom;
    private $email;
    
    public function __construct($nom, $email) {
        $this->nom = $nom;
        $this->email = $email;
    }
    
    // Implémentation obligatoire
    public function afficher() {
        echo "👤 {$this->nom} ({$this->email})" . PHP_EOL;
    }
    
    public function toArray() {
        return [
            'nom' => $this->nom,
            'email' => $this->email
        ];
    }
    
    public function toJSON() {
        return json_encode($this->toArray());
    }
}

echo "=== Interfaces ===" . PHP_EOL;
$user = new Utilisateur("Alice", "alice@test.com");
$user->afficher();
echo "JSON: " . $user->toJSON() . PHP_EOL;

// Traits : réutilisation
trait Horodatable {
    private $dateCreation;
    private $dateModification;
    
    public function setDateCreation() {
        $this->dateCreation = date('Y-m-d H:i:s');
    }
    
    public function setDateModification() {
        $this->dateModification = date('Y-m-d H:i:s');
    }
    
    public function getDateCreation() {
        return $this->dateCreation;
    }
}

trait Identifiable {
    private $id;
    
    public function setId($id) {
        $this->id = $id;
    }
    
    public function getId() {
        return $this->id;
    }
}

// Utiliser plusieurs traits
class Article {
    use Horodatable, Identifiable;
    
    private $titre;
    private $contenu;
    
    public function __construct($id, $titre, $contenu) {
        $this->setId($id);
        $this->titre = $titre;
        $this->contenu = $contenu;
        $this->setDateCreation();
    }
    
    public function afficher() {
        echo "📄 Article #{$this->getId()}: {$this->titre}" . PHP_EOL;
        echo "   Créé le: {$this->getDateCreation()}" . PHP_EOL;
    }
}

echo "\\n=== Traits ===" . PHP_EOL;
$article = new Article(1, "Introduction PHP", "Contenu...");
$article->afficher();

// Exemple complet : Système de log
trait Logger {
    public function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        echo "[$timestamp] LOG: $message" . PHP_EOL;
    }
}

class Service {
    use Logger;
    
    public function traiter($donnees) {
        $this->log("Début traitement");
        // Traitement...
        $this->log("Traitement terminé");
    }
}

echo "\\n=== Logger trait ===" . PHP_EOL;
$service = new Service();
$service->traiter("données test");

// Interface + Trait ensemble
interface Calculable {
    public function calculer();
}

trait MathUtils {
    public function somme($a, $b) {
        return $a + $b;
    }
    
    public function moyenne($nombres) {
        return array_sum($nombres) / count($nombres);
    }
}

class Statistiques implements Calculable {
    use MathUtils;
    
    private $donnees;
    
    public function __construct($donnees) {
        $this->donnees = $donnees;
    }
    
    public function calculer() {
        $moy = $this->moyenne($this->donnees);
        echo "Moyenne: $moy" . PHP_EOL;
        return $moy;
    }
}

echo "\\n=== Interface + Trait ===" . PHP_EOL;
$stats = new Statistiques([10, 15, 20, 25, 30]);
$stats->calculer();

// Résolution conflits traits
trait TraitA {
    public function direBonjour() {
        echo "Bonjour de TraitA" . PHP_EOL;
    }
}

trait TraitB {
    public function direBonjour() {
        echo "Bonjour de TraitB" . PHP_EOL;
    }
}

class MaClasse {
    use TraitA, TraitB {
        TraitB::direBonjour insteadof TraitA;  // Choisir TraitB
        TraitA::direBonjour as bonjourA;       // Alias pour TraitA
    }
}

echo "\\n=== Résolution conflits ===" . PHP_EOL;
$obj = new MaClasse();
$obj->direBonjour();   // TraitB
$obj->bonjourA();      // TraitA (alias)
?>`,
        ),
        task: "Créez interface Stockable avec save() et load(). Créez trait Validable avec validate(). Créez classe Produit utilisant les deux.",
        takeaway:
          "Interfaces = contrats (implements). Traits = réutilisation code (use). Plusieurs interfaces/traits possibles. Traits ≠ héritage.",
        quiz: quiz(
          "Quelle différence entre interface et trait ?",
          ["Aucune", "Interface = contrat, trait = code réutilisable", "Trait est plus rapide"],
          1,
          "Interface définit quelles méthodes implémenter (contrat). Trait fournit code réutilisable (implémentation)."
        ),
        link: docs + "language.oop5.interfaces.php",
      }),
      lesson({
        id: "php-visibilite",
        title: "Visibilité et encapsulation",
        minutes: 20,
        summary:
          "Encapsulation = masquer détails internes. public (partout), private (classe uniquement), protected (classe + enfants). Getters/setters pour accès contrôlé.",
        sections: [
          section(
            "Modificateurs de visibilité",
            "Contrôler qui peut accéder aux membres.",
            [
              "public : accessible de partout",
              "private : uniquement dans la classe",
              "protected : classe + classes enfants",
              "Bonne pratique : propriétés private, méthodes public",
              "Évite modification directe non contrôlée",
            ]
          ),
          section(
            "Getters et setters",
            "Méthodes pour accéder/modifier propriétés.",
            [
              "Getter : getNom() retourne valeur",
              "Setter : setNom($nom) modifie avec validation",
              "Permet validation avant modification",
              "Calculs dans getters (propriétés calculées)",
              "Encapsulation : cacher implémentation",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Encapsulation complète
class CompteBancaire {
    private $numero;
    private $solde;
    private $titulaire;
    private $historique = [];
    
    public function __construct($numero, $titulaire) {
        $this->numero = $numero;
        $this->titulaire = $titulaire;
        $this->solde = 0;
    }
    
    // Getters (lecture seule pour certains)
    public function getNumero() {
        return $this->numero;
    }
    
    public function getSolde() {
        return $this->solde;
    }
    
    public function getTitulaire() {
        return $this->titulaire;
    }
    
    // Pas de setSolde() : modification contrôlée uniquement
    
    public function deposer($montant) {
        if ($montant <= 0) {
            throw new InvalidArgumentException("Montant doit être positif");
        }
        
        $this->solde += $montant;
        $this->ajouterHistorique("Dépôt", $montant);
    }
    
    public function retirer($montant) {
        if ($montant <= 0) {
            throw new InvalidArgumentException("Montant doit être positif");
        }
        
        if ($montant > $this->solde) {
            throw new Exception("Solde insuffisant");
        }
        
        $this->solde -= $montant;
        $this->ajouterHistorique("Retrait", $montant);
    }
    
    // Méthode privée (usage interne)
    private function ajouterHistorique($type, $montant) {
        $this->historique[] = [
            'type' => $type,
            'montant' => $montant,
            'date' => date('Y-m-d H:i:s'),
            'solde' => $this->solde
        ];
    }
    
    public function afficherHistorique() {
        echo "\\n=== Historique compte {$this->numero} ===" . PHP_EOL;
        foreach ($this->historique as $op) {
            echo "[{$op['date']}] {$op['type']}: {$op['montant']}€ (solde: {$op['solde']}€)" . PHP_EOL;
        }
    }
}

echo "=== Encapsulation ===" . PHP_EOL;
$compte = new CompteBancaire("FR001", "Alice");

try {
    $compte->deposer(1000);
    $compte->retirer(300);
    $compte->deposer(500);
    $compte->retirer(200);
    
    echo "Solde final: {$compte->getSolde()}€" . PHP_EOL;
    $compte->afficherHistorique();
    
    // Impossible : $compte->solde = 9999; (private)
    // Impossible : $compte->setSolde(9999); (n'existe pas)
    
} catch (Exception $e) {
    echo "Erreur: {$e->getMessage()}" . PHP_EOL;
}

// Validation dans setters
class Utilisateur {
    private $email;
    private $age;
    
    public function setEmail($email) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Email invalide");
        }
        $this->email = $email;
    }
    
    public function getEmail() {
        return $this->email;
    }
    
    public function setAge($age) {
        if ($age < 0 || $age > 150) {
            throw new InvalidArgumentException("Âge invalide");
        }
        $this->age = $age;
    }
    
    public function getAge() {
        return $this->age;
    }
    
    // Propriété calculée (getter sans propriété)
    public function estMajeur() {
        return $this->age >= 18;
    }
}

echo "\\n=== Validation ===" . PHP_EOL;
$user = new Utilisateur();

try {
    $user->setEmail("alice@test.com");
    $user->setAge(25);
    
    echo "Email: {$user->getEmail()}" . PHP_EOL;
    echo "Âge: {$user->getAge()} ans" . PHP_EOL;
    echo "Majeur: " . ($user->estMajeur() ? "oui" : "non") . PHP_EOL;
    
    // Erreur validation
    $user->setEmail("invalide");  // Exception
    
} catch (InvalidArgumentException $e) {
    echo "Erreur validation: {$e->getMessage()}" . PHP_EOL;
}

// Protected dans héritage
class Vehicule {
    protected $marque;
    protected $vitesse = 0;
    
    public function __construct($marque) {
        $this->marque = $marque;
    }
    
    protected function accelerer($delta) {
        $this->vitesse += $delta;
    }
    
    public function getVitesse() {
        return $this->vitesse;
    }
}

class Voiture extends Vehicule {
    public function demarrer() {
        // Accès protected du parent
        $this->accelerer(50);
        echo "{$this->marque} démarre à {$this->vitesse} km/h" . PHP_EOL;
    }
    
    public function freiner() {
        $this->vitesse = 0;
        echo "{$this->marque} s'arrête" . PHP_EOL;
    }
}

echo "\\n=== Protected dans héritage ===" . PHP_EOL;
$voiture = new Voiture("Renault");
$voiture->demarrer();
// Impossible : $voiture->accelerer(10); (protected)
echo "Vitesse: {$voiture->getVitesse()} km/h" . PHP_EOL;
$voiture->freiner();
?>`,
        ),
        task: "Créez classe Rectangle avec largeur/hauteur private. Ajoutez setters avec validation (>0) et getters. Ajoutez méthode calculerAire().",
        takeaway:
          "Encapsulation masque détails. private = classe seule, protected = classe + enfants, public = partout. Getters/setters pour contrôle.",
        quiz: quiz(
          "Pourquoi utiliser private plutôt que public ?",
          ["C'est plus rapide", "Contrôler accès et valider données", "Obligatoire en PHP"],
          1,
          "private permet de contrôler l'accès et valider les données via getters/setters. Protège l'intégrité de l'objet."
        ),
        link: docs + "language.oop5.visibility.php",
      }),
    ],
  },
  {
    id: "php-poo-avancee",
    title: "POO avancée",
    description: "Classes abstraites, méthodes magiques et namespaces",
    lessons: [
      lesson({
        id: "php-classes-abstraites",
        title: "Classes et méthodes abstraites",
        minutes: 20,
        summary:
          "Classes abstraites = modèles incomplets (abstract class). Ne peuvent être instanciées. Méthodes abstraites = signatures sans implémentation. Enfants doivent implémenter.",
        sections: [
          section(
            "Classes abstraites",
            "Classes de base qui ne peuvent être instanciées.",
            [
              "abstract class NomClasse { }",
              "Impossible de faire new ClasseAbstraite()",
              "Doit être étendue par classe concrète",
              "Peut contenir méthodes concrètes ET abstraites",
              "Méthode abstraite : signature sans corps",
              "Enfant DOIT implémenter méthodes abstraites",
            ]
          ),
          section(
            "Quand utiliser",
            "Définir comportement commun avec parties à personnaliser.",
            [
              "Classe de base commune",
              "Forcer implémentation dans enfants",
              "Partager code commun (méthodes concrètes)",
              "Définir contrat (méthodes abstraites)",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Classe abstraite
abstract class Forme {
    protected $nom;
    
    public function __construct($nom) {
        $this->nom = $nom;
    }
    
    // Méthode concrète (partagée)
    public function afficherNom() {
        echo "Forme: {$this->nom}" . PHP_EOL;
    }
    
    // Méthodes abstraites (à implémenter)
    abstract public function calculerAire();
    abstract public function calculerPerimetre();
}

// Classes concrètes
class Rectangle extends Forme {
    private $largeur;
    private $hauteur;
    
    public function __construct($largeur, $hauteur) {
        parent::__construct("Rectangle");
        $this->largeur = $largeur;
        $this->hauteur = $hauteur;
    }
    
    public function calculerAire() {
        return $this->largeur * $this->hauteur;
    }
    
    public function calculerPerimetre() {
        return 2 * ($this->largeur + $this->hauteur);
    }
}

class Cercle extends Forme {
    private $rayon;
    
    public function __construct($rayon) {
        parent::__construct("Cercle");
        $this->rayon = $rayon;
    }
    
    public function calculerAire() {
        return pi() * $this->rayon ** 2;
    }
    
    public function calculerPerimetre() {
        return 2 * pi() * $this->rayon;
    }
}

echo "=== Classes abstraites ===" . PHP_EOL;
// Impossible : $forme = new Forme("Test"); (abstraite)

$rectangle = new Rectangle(10, 5);
$rectangle->afficherNom();
echo "Aire: " . $rectangle->calculerAire() . PHP_EOL;
echo "Périmètre: " . $rectangle->calculerPerimetre() . PHP_EOL;

echo "\\n";
$cercle = new Cercle(7);
$cercle->afficherNom();
echo "Aire: " . round($cercle->calculerAire(), 2) . PHP_EOL;
echo "Périmètre: " . round($cercle->calculerPerimetre(), 2) . PHP_EOL;

// Polymorphisme avec abstraites
function afficherInfos(Forme $forme) {
    $forme->afficherNom();
    echo "  Aire: " . round($forme->calculerAire(), 2) . PHP_EOL;
    echo "  Périmètre: " . round($forme->calculerPerimetre(), 2) . PHP_EOL;
}

echo "\\n=== Polymorphisme ===" . PHP_EOL;
$formes = [
    new Rectangle(5, 3),
    new Cercle(4),
    new Rectangle(8, 8)
];

foreach ($formes as $f) {
    afficherInfos($f);
    echo PHP_EOL;
}

// Exemple : Système de paiement
abstract class MethodePaiement {
    protected $montant;
    
    public function __construct($montant) {
        $this->montant = $montant;
    }
    
    // Méthode concrète
    public function afficherMontant() {
        echo "Montant: {$this->montant}€" . PHP_EOL;
    }
    
    // Abstraites : chaque méthode implémente différemment
    abstract public function traiter();
    abstract public function valider();
}

class PaiementCarte extends MethodePaiement {
    private $numeroCarte;
    
    public function __construct($montant, $numeroCarte) {
        parent::__construct($montant);
        $this->numeroCarte = $numeroCarte;
    }
    
    public function valider() {
        return strlen($this->numeroCarte) == 16;
    }
    
    public function traiter() {
        if (!$this->valider()) {
            return "❌ Carte invalide";
        }
        return "✅ Paiement carte {$this->montant}€ effectué";
    }
}

class PaiementPayPal extends MethodePaiement {
    private $email;
    
    public function __construct($montant, $email) {
        parent::__construct($montant);
        $this->email = $email;
    }
    
    public function valider() {
        return filter_var($this->email, FILTER_VALIDATE_EMAIL);
    }
    
    public function traiter() {
        if (!$this->valider()) {
            return "❌ Email PayPal invalide";
        }
        return "✅ Paiement PayPal {$this->montant}€ effectué";
    }
}

echo "=== Système de paiement ===" . PHP_EOL;
$paiements = [
    new PaiementCarte(100, "1234567890123456"),
    new PaiementPayPal(50, "user@test.com"),
    new PaiementCarte(75, "123"),  // Invalide
];

foreach ($paiements as $p) {
    echo $p->traiter() . PHP_EOL;
}
?>`,
        ),
        task: "Créez classe abstraite Document avec méthodes abstraites sauvegarder() et charger(). Créez PDF et Word qui l'étendent.",
        takeaway:
          "Classes abstraites = modèles incomplets (abstract class). Méthodes abstraites = à implémenter par enfants. Impossible d'instancier.",
        quiz: quiz(
          "Peut-on créer une instance de classe abstraite ?",
          ["Oui", "Non", "Seulement si toutes méthodes concrètes"],
          1,
          "Non, impossible de faire new ClasseAbstraite(). Elle doit être étendue par une classe concrète."
        ),
        link: docs + "language.oop5.abstract.php",
      }),
      lesson({
        id: "php-methodes-magiques",
        title: "Méthodes magiques",
        minutes: 20,
        summary:
          "Méthodes magiques commencent par __. __construct, __destruct, __toString, __get, __set, __call, __clone. Appelées automatiquement par PHP.",
        sections: [
          section(
            "Méthodes magiques courantes",
            "Méthodes spéciales appelées automatiquement.",
            [
              "__construct() : création objet",
              "__destruct() : destruction objet",
              "__toString() : conversion en string",
              "__get($prop) : accès propriété inexistante",
              "__set($prop, $val) : modification propriété inexistante",
              "__isset($prop) : isset() sur propriété",
              "__call($method, $args) : méthode inexistante",
            ]
          ),
          section(
            "Autres méthodes magiques",
            "Fonctionnalités avancées.",
            [
              "__clone() : clonage d'objet",
              "__sleep() : sérialisation",
              "__wakeup() : désérialisation",
              "__invoke() : objet appelé comme fonction",
              "__debugInfo() : var_dump personnalisé",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// __toString
class Personne {
    private $nom;
    private $age;
    
    public function __construct($nom, $age) {
        $this->nom = $nom;
        $this->age = $age;
    }
    
    public function __toString() {
        return "{$this->nom} ({$this->age} ans)";
    }
}

echo "=== __toString ===" . PHP_EOL;
$alice = new Personne("Alice", 25);
echo "Objet: " . $alice . PHP_EOL;

// __get et __set
class Conteneur {
    private $donnees = [];
    
    public function __get($nom) {
        return $this->donnees[$nom] ?? null;
    }
    
    public function __set($nom, $valeur) {
        $this->donnees[$nom] = $valeur;
    }
}

echo "\\n=== __get et __set ===" . PHP_EOL;
$conteneur = new Conteneur();
$conteneur->nom = "Alice";
echo $conteneur->nom . PHP_EOL;

// __invoke
class Multiplicateur {
    private $facteur;
    
    public function __construct($facteur) {
        $this->facteur = $facteur;
    }
    
    public function __invoke($nombre) {
        return $nombre * $this->facteur;
    }
}

echo "\\n=== __invoke ===" . PHP_EOL;
$doubler = new Multiplicateur(2);
echo "5 x 2 = " . $doubler(5) . PHP_EOL;
?>`,
        ),
        task: "Créez classe Calculatrice avec __invoke pour effectuer calculs. Ajoutez __toString pour afficher historique.",
        takeaway:
          "Méthodes magiques = comportements spéciaux. __construct/__destruct, __toString, __get/__set, __call, __invoke, __clone. Commencent par __.",
        quiz: quiz(
          "Que fait __toString ?",
          ["Détruit l'objet", "Convertit objet en string", "Clone l'objet"],
          1,
          "__toString() est appelée quand objet est converti en string (echo, concatenation). Retourne représentation textuelle."
        ),
        link: docs + "language.oop5.magic.php",
      }),
      lesson({
        id: "php-namespaces",
        title: "Namespaces et autoloading",
        minutes: 20,
        summary:
          "Namespaces organisent code et évitent conflits de noms. namespace MonApp\\Models; pour déclarer. use pour importer. spl_autoload_register() pour chargement automatique.",
        sections: [
          section(
            "Déclarer et utiliser namespaces",
            "Organiser code en espaces de noms.",
            [
              "namespace App\\Controllers; en début de fichier",
              "use App\\Models\\User; pour importer",
              "new \\Namespace\\Classe() : nom complet",
              "Hiérarchie avec \\ (backslash)",
              "Un seul namespace par fichier (bonne pratique)",
              "as pour alias : use App\\User as AppUser;",
            ]
          ),
          section(
            "Autoloading",
            "Charger classes automatiquement.",
            [
              "spl_autoload_register($fonction) : enregistrer autoloader",
              "PSR-4 : standard d'organisation",
              "Composer : gestionnaire autoloading",
              "Évite require/include multiples",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Namespace
namespace Models;

class User {
    private $nom;
    
    public function __construct($nom) {
        $this->nom = $nom;
    }
    
    public function getNom() {
        return $this->nom;
    }
}

// Utilisation
namespace;

use Models\\User;

$user = new User("Alice");
echo "User: {$user->getNom()}" . PHP_EOL;

// Autoloading
spl_autoload_register(function($classe) {
    $fichier = str_replace('\\\\', '/', $classe) . '.php';
    if (file_exists($fichier)) {
        require $fichier;
    }
});
?>`,
        ),
        task: "Créez namespace App\\Models avec classe Produit. Créez App\\Controllers\\ProduitController qui l'utilise. Testez avec use.",
        takeaway:
          "Namespaces organisent code. namespace Nom; pour déclarer. use pour importer. \\ séparateur. as pour alias. Autoloading charge classes automatiquement.",
        quiz: quiz(
          "À quoi sert 'use' ?",
          ["Créer une classe", "Importer classe d'un namespace", "Déclarer namespace"],
          1,
          "use importe une classe d'un autre namespace pour éviter d'écrire le nom complet à chaque fois."
        ),
        link: docs + "language.namespaces.php",
      }),
    ],
  },
  {
    id: "php-tableaux-avances",
    title: "Tableaux avancés",
    description: "Fonctions avancées sur les tableaux",
    lessons: [
      lesson({
        id: "php-array-fonctions",
        title: "Fonctions avancées array_map, array_filter, array_reduce",
        minutes: 25,
        summary:
          "Fonctions de haut niveau pour manipuler tableaux : array_map transforme, array_filter filtre, array_reduce agrège. Programmation fonctionnelle en PHP.",
        sections: [
          section(
            "Transformation et filtrage",
            "Manipuler tableaux avec fonctions.",
            [
              "array_map($fonction, $tab) : transformer éléments",
              "array_filter($tab, $fonction) : filtrer éléments",
              "array_reduce($tab, $fonction, $initial) : réduire",
              "array_walk($tab, $fonction) : modifier en place",
              "array_unique() : supprimer doublons",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// array_map
$nombres = [1, 2, 3, 4, 5];
$carres = array_map(fn($n) => $n * $n, $nombres);
echo "Carrés: " . implode(", ", $carres) . PHP_EOL;

// array_filter
$pairs = array_filter($nombres, fn($n) => $n % 2 == 0);
echo "Pairs: " . implode(", ", $pairs) . PHP_EOL;

// array_reduce
$somme = array_reduce($nombres, fn($acc, $n) => $acc + $n, 0);
echo "Somme: $somme" . PHP_EOL;
?>`,
        ),
        task: "Créez tableau de températures. Filtrez celles > 25°C, calculez leur moyenne avec array_reduce.",
        takeaway:
          "array_map transforme, array_filter filtre, array_reduce agrège. Programmation fonctionnelle en PHP.",
        quiz: quiz(
          "Que fait array_reduce ?",
          ["Filtre", "Réduit à une valeur", "Supprime doublons"],
          1,
          "array_reduce applique fonction accumulateur pour réduire tableau à une seule valeur."
        ),
        link: docs + "ref.array.php",
      }),
    ],
  },
  {
    id: "php-dates-json",
    title: "Dates et JSON",
    description: "DateTime et manipulation JSON",
    lessons: [
      lesson({
        id: "php-datetime",
        title: "DateTime et manipulation de dates",
        minutes: 20,
        summary:
          "DateTime pour manipuler dates en PHP. new DateTime(), format(), modify(), diff(). DateInterval pour durées.",
        sections: [
          section(
            "DateTime",
            "Manipuler dates et heures.",
            [
              "new DateTime() : date actuelle",
              "new DateTime('2024-01-15') : date spécifique",
              "format('Y-m-d H:i:s') : formater",
              "modify('+1 day') : modifier",
              "diff($autre) : différence",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
$maintenant = new DateTime();
echo "Maintenant: " . $maintenant->format('Y-m-d H:i:s') . PHP_EOL;

$noel = new DateTime('2024-12-25');
echo "Noël: " . $noel->format('d/m/Y') . PHP_EOL;

$demain = (new DateTime())->modify('+1 day');
echo "Demain: " . $demain->format('Y-m-d') . PHP_EOL;

$diff = $maintenant->diff($noel);
echo "Jours jusqu'à Noël: {$diff->days}" . PHP_EOL;
?>`,
        ),
        task: "Créez votre date de naissance avec DateTime. Calculez votre âge exact avec diff().",
        takeaway:
          "DateTime pour dates. new DateTime(), format(), modify(), diff() pour manipulations.",
        quiz: quiz(
          "Comment créer date spécifique ?",
          ["date('2024-01-01')", "new DateTime('2024-01-01')", "DateTime::create()"],
          1,
          "new DateTime('2024-01-01') crée objet DateTime avec date spécifique."
        ),
        link: docs + "class.datetime.php",
      }),
      lesson({
        id: "php-json",
        title: "JSON : encode et decode",
        minutes: 20,
        summary:
          "JSON pour échanger données. json_encode() convertit PHP en JSON, json_decode() convertit JSON en PHP. JSON_PRETTY_PRINT pour formatage.",
        sections: [
          section(
            "JSON en PHP",
            "Sérialiser et désérialiser JSON.",
            [
              "json_encode($data) : PHP -> JSON",
              "json_decode($json, true) : JSON -> array",
              "json_decode($json) : JSON -> objet",
              "JSON_PRETTY_PRINT : formater lisiblement",
              "json_last_error() : vérifier erreurs",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
$utilisateur = [
    'nom' => 'Alice',
    'age' => 25,
    'ville' => 'Dakar'
];

// PHP -> JSON
$json = json_encode($utilisateur, JSON_PRETTY_PRINT);
echo "JSON:" . PHP_EOL . $json . PHP_EOL;

// JSON -> PHP
$decode = json_decode($json, true);
echo "\\nNom: {$decode['nom']}" . PHP_EOL;

// Fichier JSON
file_put_contents('data.json', $json);
$charge = json_decode(file_get_contents('data.json'), true);
echo "Chargé: {$charge['ville']}" . PHP_EOL;
unlink('data.json');
?>`,
        ),
        task: "Créez tableau de produits, sauvegardez en JSON, rechargez et affichez.",
        takeaway:
          "json_encode() PHP->JSON, json_decode($json, true) JSON->array. JSON_PRETTY_PRINT pour format lisible.",
        quiz: quiz(
          "Que fait le paramètre true dans json_decode ?",
          ["Formater JSON", "Retourner array au lieu d'objet", "Vérifier erreurs"],
          1,
          "json_decode($json, true) retourne array associatif. Sans true, retourne objet stdClass."
        ),
        link: docs + "ref.json.php",
      }),
    ],
  },
  {
    id: "php-fichiers-avances",
    title: "Fichiers avancés",
    description: "CSV et lectures complexes",
    lessons: [
      lesson({
        id: "php-csv",
        title: "Lire et écrire CSV",
        minutes: 20,
        summary:
          "CSV (Comma-Separated Values) pour données tabulaires. fgetcsv() pour lire, fputcsv() pour écrire. str_getcsv() pour string CSV.",
        sections: [
          section(
            "CSV en PHP",
            "Manipuler fichiers CSV.",
            [
              "fgetcsv($handle) : lire ligne CSV",
              "fputcsv($handle, $array) : écrire ligne",
              "str_getcsv($string) : parser string CSV",
              "Délimiteur personnalisé possible",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Écrire CSV
$donnees = [
    ['Nom', 'Age', 'Ville'],
    ['Alice', 25, 'Dakar'],
    ['Bob', 30, 'Abidjan'],
    ['Charlie', 22, 'Lagos']
];

$handle = fopen('users.csv', 'w');
foreach ($donnees as $ligne) {
    fputcsv($handle, $ligne);
}
fclose($handle);

echo "CSV créé" . PHP_EOL;

// Lire CSV
$handle = fopen('users.csv', 'r');
while (($ligne = fgetcsv($handle)) !== false) {
    echo implode(' | ', $ligne) . PHP_EOL;
}
fclose($handle);

unlink('users.csv');
?>`,
        ),
        task: "Créez CSV avec 5 produits (nom, prix, quantité). Lisez et calculez valeur totale du stock.",
        takeaway:
          "fgetcsv() lit CSV, fputcsv() écrit. CSV = format simple pour données tabulaires.",
        quiz: quiz(
          "Format CSV signifie ?",
          ["Complex Structured Values", "Comma-Separated Values", "Code Source Variable"],
          1,
          "CSV = Comma-Separated Values. Format texte pour données tabulaires séparées par virgules."
        ),
        link: docs + "function.fgetcsv.php",
      }),
    ],
  },
  {
    id: "php-database-intro",
    title: "Introduction bases de données",
    description: "MySQL/SQLite avec mysqli",
    lessons: [
      lesson({
        id: "php-sqlite-mysqli",
        title: "Connexion SQLite avec mysqli",
        minutes: 25,
        summary:
          "SQLite = base de données fichier. mysqli_connect() pour connexion. mysqli_query() pour requêtes. mysqli_fetch_assoc() pour résultats.",
        sections: [
          section(
            "Connexion et requêtes",
            "Se connecter à SQLite et exécuter requêtes.",
            [
              "new SQLite3('database.db') : connexion",
              "exec($sql) : exécuter requête",
              "query($sql) : requête avec résultats",
              "fetchArray() : récupérer ligne",
              "close() : fermer connexion",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Connexion SQLite
$db = new SQLite3('test.db');

// Créer table
$db->exec('CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    nom TEXT,
    age INTEGER
)');

// Insérer
$db->exec("INSERT INTO users (nom, age) VALUES ('Alice', 25)");
$db->exec("INSERT INTO users (nom, age) VALUES ('Bob', 30)");

echo "Données insérées" . PHP_EOL;

// Lire
$results = $db->query('SELECT * FROM users');
while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
    echo "{$row['nom']}: {$row['age']} ans" . PHP_EOL;
}

$db->close();
unlink('test.db');
?>`,
        ),
        task: "Créez table produits (nom, prix). Insérez 3 produits, affichez-les triés par prix.",
        takeaway:
          "SQLite3 pour BD fichier. exec() exécute, query() retourne résultats, fetchArray() récupère lignes.",
        quiz: quiz(
          "Quelle différence SQLite vs MySQL ?",
          ["SQLite plus rapide", "SQLite = fichier, MySQL = serveur", "Aucune"],
          1,
          "SQLite stocke BD dans un fichier unique. MySQL nécessite serveur dédié. SQLite idéal pour petites apps."
        ),
        link: docs + "book.sqlite3.php",
      }),
    ],
  },
  {
    id: "php-projet-intermediaire",
    title: "Exercice final intermédiaire",
    description: "Projet POO avec base de données",
    lessons: [
      lesson({
        id: "php-projet-gestion",
        title: "Projet : Gestionnaire de tâches (POO + SQLite)",
        minutes: 45,
        summary:
          "Application complète CLI : gestion tâches avec POO et SQLite. Classes Tache, Database, GestionnaireTaches. CRUD complet. Architecture propre.",
        sections: [
          section(
            "Objectif du projet",
            "Application console POO avec persistance SQLite.",
            [
              "Classes : Tache, Database, GestionnaireTaches",
              "CRUD complet : créer, lister, modifier, supprimer",
              "Base SQLite pour persistance",
              "Interface CLI avec menu",
              "Validation et gestion erreurs",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// === Classe Tache ===
class Tache {
    private $id;
    private $titre;
    private $terminee;
    private $dateCreation;
    
    public function __construct($id, $titre, $terminee = false, $dateCreation = null) {
        $this->id = $id;
        $this->titre = $titre;
        $this->terminee = $terminee;
        $this->dateCreation = $dateCreation ?? date('Y-m-d H:i:s');
    }
    
    public function getId() { return $this->id; }
    public function getTitre() { return $this->titre; }
    public function estTerminee() { return $this->terminee; }
    
    public function marquerTerminee() {
        $this->terminee = true;
    }
    
    public function afficher() {
        $statut = $this->terminee ? "✅" : "⬜";
        echo "$statut [{$this->id}] {$this->titre} ({$this->dateCreation})" . PHP_EOL;
    }
}

// === Classe Database ===
class Database {
    private $db;
    
    public function __construct($fichier) {
        $this->db = new SQLite3($fichier);
        $this->creerTable();
    }
    
    private function creerTable() {
        $this->db->exec('CREATE TABLE IF NOT EXISTS taches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            terminee INTEGER DEFAULT 0,
            date_creation TEXT
        )');
    }
    
    public function ajouterTache($titre) {
        $stmt = $this->db->prepare('INSERT INTO taches (titre, date_creation) VALUES (:titre, :date)');
        $stmt->bindValue(':titre', $titre, SQLITE3_TEXT);
        $stmt->bindValue(':date', date('Y-m-d H:i:s'), SQLITE3_TEXT);
        $stmt->execute();
    }
    
    public function getTaches() {
        $results = $this->db->query('SELECT * FROM taches ORDER BY id DESC');
        $taches = [];
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            $taches[] = new Tache(
                $row['id'],
                $row['titre'],
                $row['terminee'] == 1,
                $row['date_creation']
            );
        }
        return $taches;
    }
    
    public function marquerTerminee($id) {
        $stmt = $this->db->prepare('UPDATE taches SET terminee = 1 WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
    }
    
    public function supprimerTache($id) {
        $stmt = $this->db->prepare('DELETE FROM taches WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
    }
}

// === Programme principal ===
$db = new Database('taches.db');

echo "📝 GESTIONNAIRE DE TÂCHES" . PHP_EOL;
echo "1. Ajouter tâche" . PHP_EOL;
echo "2. Lister tâches" . PHP_EOL;
echo "3. Marquer terminée" . PHP_EOL;
echo "4. Supprimer tâche" . PHP_EOL;
echo "5. Quitter" . PHP_EOL;

// Exemple d'utilisation
$db->ajouterTache("Apprendre PHP POO");
$db->ajouterTache("Créer projet");

echo "\\n=== Tâches ===" . PHP_EOL;
foreach ($db->getTaches() as $tache) {
    $tache->afficher();
}

echo "\\n✅ Projet terminé avec succès !" . PHP_EOL;
unlink('taches.db');
?>`,
        ),
        task: "Exécutez le projet, ajoutez 3 tâches, marquez-en une comme terminée, supprimez-en une. Vérifiez la persistance SQLite.",
        takeaway:
          "Projet complet POO + SQLite. Classes métier, séparation responsabilités, CRUD, persistance. Architecture propre et maintenable. Félicitations ! 🎉",
        quiz: quiz(
          "Quel avantage de séparer Database de Tache ?",
          ["Plus rapide", "Séparation des responsabilités (SRP)", "Obligatoire"],
          1,
          "Séparer classes selon responsabilités = code maintenable. Tache = modèle métier, Database = accès données."
        ),
        link: docs + "language.oop5.php",
      }),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🔴 NIVEAU AVANCÉ - POO, PDO et API REST
// ═══════════════════════════════════════════════════════════════════════════

const advanced: WebLevel["chapters"] = [
  {
    id: "php-poo-approfondi",
    title: "POO en PHP - Approfondi",
    description: "Architecture et design patterns pour bases de données",
    lessons: [
      lesson({
        id: "php-architecture-poo",
        title: "Architecture POO pour applications",
        minutes: 25,
        summary:
          "La POO est une architecture de code, pas un outil de base de données. Organisation en couches : Model (métier), DAO (accès données), Controller (logique). Séparation des responsabilités.",
        sections: [
          section(
            "Qu'est-ce que la POO ?",
            "POO = Programmation Orientée Objet. Une FAÇON d'organiser le code.",
            [
              "POO = architecture, pas une technologie",
              "Classes = modèles pour objets",
              "Encapsulation : cacher détails internes",
              "Héritage : réutiliser code parent",
              "Polymorphisme : même interface, comportements différents",
              "POO ≠ Base de données ! C'est l'ORGANISATION du code",
            ]
          ),
          section(
            "Architecture en couches",
            "Séparer responsabilités pour code maintenable.",
            [
              "Model : Classes métier (Produit, User, etc.)",
              "DAO : Data Access Object (accès BD)",
              "Controller : Logique métier",
              "View : Présentation (CLI, web, API)",
              "Chaque couche = responsabilité unique",
              "Facilite tests et maintenance",
            ]
          ),
          section(
            "Classes métier (Model)",
            "Représentent entités du domaine.",
            [
              "Propriétés private avec getters/setters",
              "Méthodes métier (calculer, valider)",
              "Pas d'accès BD dans Model !",
              "Model = données + comportement métier",
              "Exemple : Produit a prix, nom, méthode calculerTVA()",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// ============================================
// ARCHITECTURE POO - Exemple complet
// ============================================

// === COUCHE MODEL : Classes métier ===
class Produit {
    private $id;
    private $nom;
    private $prix;
    private $stock;
    
    public function __construct($id, $nom, $prix, $stock) {
        $this->id = $id;
        $this->nom = $nom;
        $this->prix = $prix;
        $this->stock = $stock;
    }
    
    // Getters
    public function getId() { return $this->id; }
    public function getNom() { return $this->nom; }
    public function getPrix() { return $this->prix; }
    public function getStock() { return $this->stock; }
    
    // Setters avec validation
    public function setPrix($prix) {
        if ($prix < 0) {
            throw new InvalidArgumentException("Prix doit être positif");
        }
        $this->prix = $prix;
    }
    
    public function setStock($stock) {
        if ($stock < 0) {
            throw new InvalidArgumentException("Stock doit être positif");
        }
        $this->stock = $stock;
    }
    
    // Logique métier (PAS d'accès BD ici !)
    public function calculerTVA($tauxTVA = 0.20) {
        return $this->prix * $tauxTVA;
    }
    
    public function getPrixTTC($tauxTVA = 0.20) {
        return $this->prix + $this->calculerTVA($tauxTVA);
    }
    
    public function estEnStock() {
        return $this->stock > 0;
    }
    
    public function diminuerStock($quantite) {
        if ($quantite > $this->stock) {
            throw new Exception("Stock insuffisant");
        }
        $this->stock -= $quantite;
    }
    
    public function afficher() {
        $statut = $this->estEnStock() ? "✅ En stock" : "❌ Rupture";
        echo "Produit #{$this->id}: {$this->nom}" . PHP_EOL;
        echo "  Prix: {$this->prix}€ (TTC: {$this->getPrixTTC()}€)" . PHP_EOL;
        echo "  Stock: {$this->stock} unités - $statut" . PHP_EOL;
    }
}

// === DÉMONSTRATION : POO sans base de données ===
echo "=== POO = ORGANISATION DU CODE ===" . PHP_EOL;
echo "(POO fonctionne SANS base de données !)" . PHP_EOL . PHP_EOL;

$produit1 = new Produit(1, "Laptop", 999, 10);
$produit2 = new Produit(2, "Souris", 25, 50);
$produit3 = new Produit(3, "Clavier", 75, 0);

$produits = [$produit1, $produit2, $produit3];

foreach ($produits as $p) {
    $p->afficher();
    echo PHP_EOL;
}

// Utiliser logique métier
echo "=== Logique métier ===" . PHP_EOL;
try {
    $produit1->diminuerStock(2);
    echo "✅ Stock réduit : {$produit1->getStock()} restants" . PHP_EOL;
    
    $produit3->diminuerStock(1);  // Erreur : stock insuffisant
} catch (Exception $e) {
    echo "❌ Erreur : {$e->getMessage()}" . PHP_EOL;
}

// === ARCHITECTURE EN COUCHES (concept) ===
echo "\\n=== Architecture recommandée ===" . PHP_EOL;
echo "📦 Model/        (Classes métier : Produit, User, Commande)" . PHP_EOL;
echo "   └─ Produit.php" . PHP_EOL;
echo "   └─ User.php" . PHP_EOL;
echo "\\n🗄️  DAO/          (Accès base de données)" . PHP_EOL;
echo "   └─ ProduitDAO.php" . PHP_EOL;
echo "   └─ Database.php" . PHP_EOL;
echo "\\n🎮 Controller/    (Logique application)" . PHP_EOL;
echo "   └─ ProduitController.php" . PHP_EOL;
echo "\\n👁️  View/         (Interface CLI/Web)" . PHP_EOL;
echo "   └─ index.php" . PHP_EOL;

echo "\\n💡 IMPORTANT:" . PHP_EOL;
echo "   POO = Comment organiser le code en classes" . PHP_EOL;
echo "   PDO = Outil PHP pour accéder aux bases de données" . PHP_EOL;
echo "   POO et PDO travaillent ENSEMBLE !" . PHP_EOL;
?>`,
        ),
        task: "Créez classe User avec nom, email, role. Ajoutez validation email et méthode estAdmin(). Pas de BD, juste la classe.",
        takeaway:
          "POO = architecture code. Model = classes métier. DAO = accès BD. Séparation responsabilités. POO ≠ PDO !",
        quiz: quiz(
          "Qu'est-ce que la POO ?",
          ["Un outil de base de données", "Une façon d'organiser le code en classes", "Un langage de programmation"],
          1,
          "POO = Programmation Orientée Objet. C'est une ARCHITECTURE pour organiser code, pas un outil BD."
        ),
        link: docs + "language.oop5.php",
      }),
      lesson({
        id: "php-design-patterns",
        title: "Design patterns : DAO et Singleton",
        minutes: 25,
        summary:
          "Design patterns = solutions éprouvées. DAO (Data Access Object) sépare logique métier et accès BD. Singleton garantit une seule instance de connexion BD.",
        sections: [
          section(
            "Pattern DAO (Data Access Object)",
            "Séparer accès données de logique métier.",
            [
              "DAO = classe dédiée accès BD",
              "Model = classe métier (sans BD)",
              "DAO manipule Model",
              "Exemple : ProduitDAO pour sauver/charger Produit",
              "Avantages : testabilité, changement BD facile",
              "DAO utilise PDO pour parler à la BD",
            ]
          ),
          section(
            "Pattern Singleton",
            "Une seule instance de connexion BD.",
            [
              "Singleton = 1 seul objet dans toute l'app",
              "Utile pour connexion BD (évite multiples connexions)",
              "Constructeur private",
              "Méthode getInstance() statique",
              "Variable statique pour stocker instance",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// ============================================
// DESIGN PATTERNS : Singleton et DAO
// ============================================

// === PATTERN SINGLETON : Connexion unique ===
class Database {
    private static $instance = null;
    private $connexion;
    
    // Constructeur private (empêche new Database())
    private function __construct() {
        $this->connexion = new SQLite3(':memory:');  // BD en mémoire pour démo
        $this->connexion->exec('
            CREATE TABLE produits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                prix REAL NOT NULL,
                stock INTEGER DEFAULT 0
            )
        ');
        echo "🔌 Connexion BD établie" . PHP_EOL;
    }
    
    // Empêcher le clonage
    private function __clone() {}
    
    // Méthode pour obtenir l'instance unique
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnexion() {
        return $this->connexion;
    }
}

// === MODEL : Classe métier ===
class Produit {
    private $id;
    private $nom;
    private $prix;
    private $stock;
    
    public function __construct($id, $nom, $prix, $stock) {
        $this->id = $id;
        $this->nom = $nom;
        $this->prix = $prix;
        $this->stock = $stock;
    }
    
    public function getId() { return $this->id; }
    public function getNom() { return $this->nom; }
    public function getPrix() { return $this->prix; }
    public function getStock() { return $this->stock; }
    
    public function setId($id) { $this->id = $id; }
    
    public function afficher() {
        echo "📦 {$this->nom} : {$this->prix}€ (stock: {$this->stock})" . PHP_EOL;
    }
}

// === PATTERN DAO : Accès base de données ===
class ProduitDAO {
    private $db;
    
    public function __construct() {
        // Utilise le Singleton
        $this->db = Database::getInstance()->getConnexion();
    }
    
    // CREATE
    public function sauvegarder(Produit $produit) {
        $stmt = $this->db->prepare('
            INSERT INTO produits (nom, prix, stock) 
            VALUES (:nom, :prix, :stock)
        ');
        $stmt->bindValue(':nom', $produit->getNom(), SQLITE3_TEXT);
        $stmt->bindValue(':prix', $produit->getPrix(), SQLITE3_FLOAT);
        $stmt->bindValue(':stock', $produit->getStock(), SQLITE3_INTEGER);
        $stmt->execute();
        
        // Récupérer l'ID généré
        $produit->setId($this->db->lastInsertRowID());
        echo "✅ Produit sauvegardé avec ID: {$produit->getId()}" . PHP_EOL;
    }
    
    // READ
    public function trouverTous() {
        $results = $this->db->query('SELECT * FROM produits');
        $produits = [];
        
        while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
            $produits[] = new Produit(
                $row['id'],
                $row['nom'],
                $row['prix'],
                $row['stock']
            );
        }
        
        return $produits;
    }
    
    public function trouverParId($id) {
        $stmt = $this->db->prepare('SELECT * FROM produits WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $result = $stmt->execute();
        
        $row = $result->fetchArray(SQLITE3_ASSOC);
        if ($row) {
            return new Produit($row['id'], $row['nom'], $row['prix'], $row['stock']);
        }
        return null;
    }
    
    // UPDATE
    public function mettreAJour(Produit $produit) {
        $stmt = $this->db->prepare('
            UPDATE produits 
            SET nom = :nom, prix = :prix, stock = :stock 
            WHERE id = :id
        ');
        $stmt->bindValue(':id', $produit->getId(), SQLITE3_INTEGER);
        $stmt->bindValue(':nom', $produit->getNom(), SQLITE3_TEXT);
        $stmt->bindValue(':prix', $produit->getPrix(), SQLITE3_FLOAT);
        $stmt->bindValue(':stock', $produit->getStock(), SQLITE3_INTEGER);
        $stmt->execute();
        
        echo "✅ Produit mis à jour" . PHP_EOL;
    }
    
    // DELETE
    public function supprimer($id) {
        $stmt = $this->db->prepare('DELETE FROM produits WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
        
        echo "🗑️  Produit supprimé" . PHP_EOL;
    }
}

// === UTILISATION ===
echo "=== DÉMONSTRATION DAO Pattern ===" . PHP_EOL . PHP_EOL;

// Le DAO gère la BD, le Model gère la logique métier
$dao = new ProduitDAO();

// CREATE
$p1 = new Produit(null, "Laptop", 999, 10);
$p2 = new Produit(null, "Souris", 25, 50);

$dao->sauvegarder($p1);
$dao->sauvegarder($p2);

// READ
echo "\\n=== Liste des produits ===" . PHP_EOL;
$produits = $dao->trouverTous();
foreach ($produits as $p) {
    $p->afficher();
}

// UPDATE
echo "\\n=== Mise à jour ===" . PHP_EOL;
$produit = $dao->trouverParId(1);
if ($produit) {
    // Modification via le Model (logique métier)
    $dao->mettreAJour($produit);
}

// Vérifier que Singleton fonctionne
echo "\\n=== Test Singleton ===" . PHP_EOL;
$db1 = Database::getInstance();
$db2 = Database::getInstance();
echo ($db1 === $db2 ? "✅ Même instance (Singleton OK)" : "❌ Instances différentes") . PHP_EOL;

echo "\\n💡 ARCHITECTURE:" . PHP_EOL;
echo "   Produit (Model) = Logique métier" . PHP_EOL;
echo "   ProduitDAO = Accès base de données" . PHP_EOL;
echo "   Database (Singleton) = Connexion unique" . PHP_EOL;
echo "   Cette séparation = code maintenable !" . PHP_EOL;
?>`,
        ),
        task: "Créez classe User et UserDAO. DAO doit avoir méthodes sauvegarder() et trouverTous(). Utilisez Singleton pour connexion.",
        takeaway:
          "DAO = sépare accès BD de logique métier. Singleton = une seule connexion BD. Model + DAO = architecture propre.",
        quiz: quiz(
          "Rôle du pattern DAO ?",
          ["Accélérer BD", "Séparer accès BD de logique métier", "Remplacer PDO"],
          1,
          "DAO (Data Access Object) sépare code BD du code métier. Facilite tests et changements de BD."
        ),
        link: docs + "language.oop5.php",
      }),
    ],
  },
  {
    id: "php-pdo-detail",
    title: "PDO - PHP Data Objects",
    description: "Maîtriser PDO pour accès sécurisé aux bases de données",
    lessons: [
      lesson({
        id: "php-pdo-intro",
        title: "Introduction à PDO",
        minutes: 25,
        summary:
          "PDO = extension PHP pour accéder aux bases de données. Remplace mysqli (ancien). Support multi-BD (SQLite, MySQL, PostgreSQL). Pas une architecture, juste un OUTIL.",
        sections: [
          section(
            "Qu'est-ce que PDO ?",
            "PDO = PHP Data Objects. OUTIL pour parler aux bases de données.",
            [
              "PDO = extension PHP (comme json, curl, etc.)",
              "Unifie accès à différentes BD (SQLite, MySQL, PostgreSQL)",
              "Remplace mysqli, pg_connect, etc.",
              "PDO ≠ POO ! PDO est un OUTIL, POO est une ARCHITECTURE",
              "PDO s'utilise DANS les classes POO",
              "Support natif prepared statements (sécurité)",
            ]
          ),
          section(
            "PDO vs mysqli",
            "Pourquoi choisir PDO plutôt que mysqli ?",
            [
              "PDO : multi-BD, mysqli : MySQL uniquement",
              "PDO : syntaxe orientée objet",
              "PDO : prepared statements natifs",
              "PDO : gestion erreurs avec exceptions",
              "PDO : standard moderne recommandé",
            ]
          ),
          section(
            "Connexion avec PDO",
            "Se connecter à SQLite avec PDO.",
            [
              "new PDO('sqlite:database.db') : connexion SQLite",
              "new PDO('mysql:host=...;dbname=...', $user, $pass) : MySQL",
              "PDO::ERRMODE_EXCEPTION : lever exceptions sur erreurs",
              "PDO::ATTR_DEFAULT_FETCH_MODE : mode récupération par défaut",
              "$pdo->exec($sql) : exécuter requête sans résultat",
              "$pdo->query($sql) : requête avec résultats",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// ============================================
// PDO - Introduction et Connexion
// ============================================

echo "=== PDO : PHP Data Objects ===" . PHP_EOL;
echo "(PDO = OUTIL pour accéder aux bases de données)" . PHP_EOL . PHP_EOL;

// === CONNEXION PDO ===
try {
    // SQLite : base de données fichier
    $pdo = new PDO('sqlite::memory:');  // BD en mémoire pour démo
    
    // Configuration PDO (IMPORTANT !)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    echo "✅ Connexion PDO établie" . PHP_EOL;
    
} catch (PDOException $e) {
    die("❌ Erreur connexion : " . $e->getMessage());
}

// === CRÉER TABLE ===
$sql = "
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER
    )
";

$pdo->exec($sql);  // exec() pour requêtes sans résultat
echo "✅ Table créée" . PHP_EOL;

// === INSÉRER DONNÉES (méthode simple, non sécurisée) ===
$pdo->exec("INSERT INTO users (nom, email, age) VALUES ('Alice', 'alice@test.com', 25)");
$pdo->exec("INSERT INTO users (nom, email, age) VALUES ('Bob', 'bob@test.com', 30)");
$pdo->exec("INSERT INTO users (nom, email, age) VALUES ('Charlie', 'charlie@test.com', 22)");

echo "✅ 3 utilisateurs insérés" . PHP_EOL;

// === LIRE DONNÉES ===
echo "\\n=== Lecture avec query() ===" . PHP_EOL;

$stmt = $pdo->query("SELECT * FROM users");
$users = $stmt->fetchAll();  // Récupère tous les résultats

foreach ($users as $user) {
    echo "👤 {$user['nom']} ({$user['email']}) - {$user['age']} ans" . PHP_EOL;
}

// === DIFFÉRENTS MODES DE FETCH ===
echo "\\n=== Modes de fetch ===" . PHP_EOL;

$stmt = $pdo->query("SELECT * FROM users LIMIT 1");

// FETCH_ASSOC : tableau associatif (recommandé)
$user = $stmt->fetch(PDO::FETCH_ASSOC);
echo "FETCH_ASSOC: ";
print_r($user);

// FETCH_OBJ : objet
$stmt = $pdo->query("SELECT * FROM users LIMIT 1");
$user = $stmt->fetch(PDO::FETCH_OBJ);
echo "\\nFETCH_OBJ: {$user->nom}, {$user->email}" . PHP_EOL;

// === COMPTER RÉSULTATS ===
echo "\\n=== Statistiques ===" . PHP_EOL;

$stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
$result = $stmt->fetch();
echo "Total utilisateurs : {$result['total']}" . PHP_EOL;

$stmt = $pdo->query("SELECT AVG(age) as moyenne FROM users");
$result = $stmt->fetch();
echo "Âge moyen : " . round($result['moyenne'], 1) . " ans" . PHP_EOL;

// === GESTION ERREURS ===
echo "\\n=== Gestion erreurs ===" . PHP_EOL;

try {
    // Requête invalide
    $pdo->exec("INSERT INTO table_inexistante VALUES (1)");
} catch (PDOException $e) {
    echo "❌ Erreur capturée : " . $e->getMessage() . PHP_EOL;
}

// === PDO vs POO ===
echo "\\n=== CLARIFICATION IMPORTANTE ===" . PHP_EOL;
echo "📌 PDO = OUTIL PHP pour bases de données" . PHP_EOL;
echo "📌 POO = ARCHITECTURE pour organiser code" . PHP_EOL;
echo "📌 On utilise PDO DANS des classes POO" . PHP_EOL;
echo "📌 PDO n'est PAS une alternative à la POO !" . PHP_EOL;

echo "\\n💡 Exemple architecture:" . PHP_EOL;
echo "   class UserDAO {" . PHP_EOL;
echo "       private \$pdo;  // PDO utilisé ICI" . PHP_EOL;
echo "       public function sauvegarder(User \$user) {" . PHP_EOL;
echo "           // Utilise \$this->pdo pour sauver" . PHP_EOL;
echo "       }" . PHP_EOL;
echo "   }" . PHP_EOL;

echo "\\n✅ PDO et POO travaillent ENSEMBLE !" . PHP_EOL;
?>`,
        ),
        task: "Créez connexion PDO SQLite. Créez table produits (nom, prix). Insérez 3 produits et affichez-les avec fetchAll().",
        takeaway:
          "PDO = outil PHP pour BD. new PDO() connexion. exec() sans résultat, query() avec résultats. ERRMODE_EXCEPTION pour erreurs. PDO ≠ POO !",
        quiz: quiz(
          "Qu'est-ce que PDO ?",
          ["Une architecture de code", "Un outil PHP pour accéder aux BD", "Un remplacement de la POO"],
          1,
          "PDO = PHP Data Objects. Extension PHP pour accéder aux bases de données de manière unifiée et sécurisée."
        ),
        link: docs + "book.pdo.php",
      }),
      lesson({
        id: "php-prepared-statements",
        title: "Prepared statements et sécurité",
        minutes: 30,
        summary:
          "Prepared statements = requêtes paramétrées sécurisées. Protection contre injection SQL. prepare() + execute(). bindValue() vs bindParam(). OBLIGATOIRE pour données utilisateur.",
        sections: [
          section(
            "Pourquoi prepared statements ?",
            "Protection essentielle contre injection SQL.",
            [
              "Injection SQL = attaque majeure",
              "Données utilisateur = DANGER",
              "Prepared statements = séparation SQL / données",
              "PDO échappe automatiquement",
              "JAMAIS concaténer données dans SQL",
              "Standard de sécurité obligatoire",
            ]
          ),
          section(
            "Syntaxe prepared statements",
            "prepare() puis execute().",
            [
              "$stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id')",
              ":nom = placeholder nommé",
              "? = placeholder positionnel",
              "$stmt->execute(['id' => 1]) : passer paramètres",
              "$stmt->bindValue(':id', 1) : lier valeur",
              "$stmt->bindParam(':id', $variable) : lier variable",
            ]
          ),
          section(
            "bindValue vs bindParam",
            "Deux façons de lier paramètres.",
            [
              "bindValue : lie la VALEUR (copie)",
              "bindParam : lie la VARIABLE (référence)",
              "bindValue : valeur au moment de bindValue()",
              "bindParam : valeur au moment d'execute()",
              "Préférer bindValue (plus simple)",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// ============================================
// PREPARED STATEMENTS - Sécurité essentielle
// ============================================

$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Créer table
$pdo->exec("
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        email TEXT,
        age INTEGER
    )
");

echo "=== INJECTION SQL : LE DANGER ===" . PHP_EOL . PHP_EOL;

// ❌ MAUVAIS : Concaténation directe (DANGER !)
$nom_dangereux = "Alice'; DROP TABLE users; --";
echo "⚠️  Tentative d'attaque: $nom_dangereux" . PHP_EOL;

// Cette ligne serait DANGEREUSE en production :
// $pdo->exec("INSERT INTO users (nom) VALUES ('$nom_dangereux')");
echo "❌ JAMAIS faire : INSERT INTO users VALUES ('\$nom')" . PHP_EOL;
echo "   → Permet injection SQL !" . PHP_EOL . PHP_EOL;

// === ✅ BON : PREPARED STATEMENTS ===
echo "=== PREPARED STATEMENTS : LA SOLUTION ===" . PHP_EOL . PHP_EOL;

// Méthode 1 : Placeholders nommés (:nom)
echo "1️⃣  Placeholders nommés (recommandé)" . PHP_EOL;
$stmt = $pdo->prepare("
    INSERT INTO users (nom, email, age) 
    VALUES (:nom, :email, :age)
");

$stmt->execute([
    ':nom' => 'Alice',
    ':email' => 'alice@test.com',
    ':age' => 25
]);
echo "✅ Alice insérée avec placeholders nommés" . PHP_EOL;

// Méthode 2 : Placeholders positionnels (?)
echo "\\n2️⃣  Placeholders positionnels" . PHP_EOL;
$stmt = $pdo->prepare("
    INSERT INTO users (nom, email, age) 
    VALUES (?, ?, ?)
");

$stmt->execute(['Bob', 'bob@test.com', 30]);
echo "✅ Bob inséré avec placeholders positionnels" . PHP_EOL;

// Méthode 3 : bindValue
echo "\\n3️⃣  bindValue (lie la valeur)" . PHP_EOL;
$stmt = $pdo->prepare("
    INSERT INTO users (nom, email, age) 
    VALUES (:nom, :email, :age)
");

$stmt->bindValue(':nom', 'Charlie', PDO::PARAM_STR);
$stmt->bindValue(':email', 'charlie@test.com', PDO::PARAM_STR);
$stmt->bindValue(':age', 22, PDO::PARAM_INT);
$stmt->execute();
echo "✅ Charlie inséré avec bindValue" . PHP_EOL;

// Méthode 4 : bindParam (lie la variable)
echo "\\n4️⃣  bindParam (lie la variable)" . PHP_EOL;
$stmt = $pdo->prepare("
    INSERT INTO users (nom, email, age) 
    VALUES (:nom, :email, :age)
");

$nom = 'David';
$email = 'david@test.com';
$age = 28;

$stmt->bindParam(':nom', $nom, PDO::PARAM_STR);
$stmt->bindParam(':email', $email, PDO::PARAM_STR);
$stmt->bindParam(':age', $age, PDO::PARAM_INT);

// On peut changer les variables avant execute()
$nom = 'David Modifié';

$stmt->execute();
echo "✅ David inséré avec bindParam (valeur au moment d'execute)" . PHP_EOL;

// === SÉLECTION SÉCURISÉE ===
echo "\\n=== SELECT avec prepared statements ===" . PHP_EOL;

$recherche = 'Alice';
$stmt = $pdo->prepare("SELECT * FROM users WHERE nom = :nom");
$stmt->execute([':nom' => $recherche]);
$user = $stmt->fetch();

if ($user) {
    echo "Trouvé : {$user['nom']} ({$user['email']})" . PHP_EOL;
}

// Recherche avec LIKE
$recherche = 'a%';  // Noms commençant par 'a'
$stmt = $pdo->prepare("SELECT * FROM users WHERE nom LIKE :recherche");
$stmt->execute([':recherche' => $recherche]);

echo "\\nRésultats LIKE '$recherche':" . PHP_EOL;
while ($user = $stmt->fetch()) {
    echo "  - {$user['nom']}" . PHP_EOL;
}

// === UPDATE ET DELETE SÉCURISÉS ===
echo "\\n=== UPDATE sécurisé ===" . PHP_EOL;

$stmt = $pdo->prepare("UPDATE users SET age = :age WHERE nom = :nom");
$stmt->execute([
    ':age' => 26,
    ':nom' => 'Alice'
]);
echo "✅ Âge d'Alice mis à jour" . PHP_EOL;

echo "\\n=== DELETE sécurisé ===" . PHP_EOL;

$stmt = $pdo->prepare("DELETE FROM users WHERE nom = :nom");
$stmt->execute([':nom' => 'Bob']);
echo "✅ Bob supprimé" . PHP_EOL;

// === RÉUTILISATION STATEMENT ===
echo "\\n=== Réutiliser prepared statement ===" . PHP_EOL;

$stmt = $pdo->prepare("SELECT * FROM users WHERE age > :age");

// Exécuter plusieurs fois avec paramètres différents
$stmt->execute([':age' => 20]);
echo "Utilisateurs > 20 ans: " . $stmt->rowCount() . PHP_EOL;

$stmt->execute([':age' => 25]);
echo "Utilisateurs > 25 ans: " . $stmt->rowCount() . PHP_EOL;

// === RÉCAPITULATIF ===
echo "\\n=== RÈGLES DE SÉCURITÉ ===" . PHP_EOL;
echo "✅ TOUJOURS utiliser prepared statements" . PHP_EOL;
echo "✅ JAMAIS concaténer données dans SQL" . PHP_EOL;
echo "✅ Préférer placeholders nommés (:nom)" . PHP_EOL;
echo "✅ bindValue pour valeurs simples" . PHP_EOL;
echo "❌ INTERDIRE: \"SELECT * FROM users WHERE id = \$id\"" . PHP_EOL;

echo "\\n💡 Même si données sont \"sûres\", TOUJOURS prepared statements" . PHP_EOL;
echo "   C'est une question de bonnes pratiques et d'habitude !" . PHP_EOL;
?>`,
        ),
        task: "Créez table articles. Ajoutez méthode ajouterArticle($titre, $contenu) avec prepared statements. Testez avec données contenant quotes.",
        takeaway:
          "Prepared statements = OBLIGATOIRES pour sécurité. prepare() + execute(). :nom placeholders nommés. bindValue() recommandé. Protège contre injection SQL.",
        quiz: quiz(
          "Pourquoi prepared statements ?",
          ["Plus rapide", "Protection injection SQL", "Syntaxe plus simple"],
          1,
          "Prepared statements séparent SQL et données, empêchant injection SQL. Sécurité essentielle pour TOUTE donnée utilisateur."
        ),
        link: docs + "pdo.prepared-statements.php",
      }),
    ],
  },
  {
    id: "php-crud-poo",
    title: "CRUD avec POO",
    description: "CRUD complet avec architecture DAO",
    lessons: [
      lesson({
        id: "php-crud-poo-complet",
        title: "CRUD SQLite avec architecture POO + DAO",
        minutes: 30,
        summary:
          "CRUD (Create, Read, Update, Delete) avec architecture POO : Model (Produit) + DAO (ProduitDAO) + PDO. Séparation responsabilités claire.",
        sections: [
          section(
            "Architecture CRUD POO",
            "Structure avec séparation des responsabilités.",
            [
              "Model : Classe métier (Produit) sans BD",
              "DAO : Accès base de données (ProduitDAO utilise PDO)",
              "CRUD : create(), findAll(), findById(), update(), delete()",
              "Prepared statements partout",
              "Gestion erreurs avec try/catch",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// Architecture POO pour CRUD
class Produit {
    private $id, $nom, $prix;
    
    public function __construct($id, $nom, $prix) {
        $this->id = $id; $this->nom = $nom; $this->prix = $prix;
    }
    
    public function getId() { return $this->id; }
    public function getNom() { return $this->nom; }
    public function getPrix() { return $this->prix; }
    public function setId($id) { $this->id = $id; }
}

class ProduitDAO {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function create(Produit $p) {
        $stmt = $this->pdo->prepare("INSERT INTO produits (nom, prix) VALUES (:nom, :prix)");
        $stmt->execute([':nom' => $p->getNom(), ':prix' => $p->getPrix()]);
        $p->setId($this->pdo->lastInsertId());
    }
    
    public function findAll() {
        $stmt = $this->pdo->query("SELECT * FROM produits");
        $produits = [];
        while ($row = $stmt->fetch()) {
            $produits[] = new Produit($row['id'], $row['nom'], $row['prix']);
        }
        return $produits;
    }
    
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM produits WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ? new Produit($row['id'], $row['nom'], $row['prix']) : null;
    }
    
    public function update(Produit $p) {
        $stmt = $this->pdo->prepare("UPDATE produits SET nom = :nom, prix = :prix WHERE id = :id");
        $stmt->execute([':id' => $p->getId(), ':nom' => $p->getNom(), ':prix' => $p->getPrix()]);
    }
    
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM produits WHERE id = :id");
        $stmt->execute([':id' => $id]);
    }
}

// Utilisation
$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec("CREATE TABLE produits (id INTEGER PRIMARY KEY, nom TEXT, prix REAL)");

$dao = new ProduitDAO($pdo);

// CREATE
$p1 = new Produit(null, "Laptop", 999);
$dao->create($p1);
echo "Créé ID: {$p1->getId()}" . PHP_EOL;

// READ
$produits = $dao->findAll();
echo "Total: " . count($produits) . PHP_EOL;

// UPDATE
$p = $dao->findById(1);
echo "Avant: {$p->getPrix()}€" . PHP_EOL;
$dao->update($p);

// DELETE
$dao->delete(1);
echo "Supprimé" . PHP_EOL;

echo "\\n✅ Architecture: Model + DAO + PDO" . PHP_EOL;
?>`,
        ),
        task: "Créez classe Article avec ArticleDAO. Implémentez CRUD complet avec prepared statements.",
        takeaway:
          "CRUD POO = Model + DAO. Model = logique métier, DAO = accès BD avec PDO. Architecture maintenable et testable.",
        quiz: quiz(
          "Où va le code SQL en POO ?",
          ["Dans le Model", "Dans le DAO", "Dans les deux"],
          1,
          "Le code SQL va dans le DAO uniquement. Le Model ne touche JAMAIS à la base de données."
        ),
        link: docs + "language.oop5.php",
      }),
    ],
  },
  {
    id: "php-crud-pdo-direct",
    title: "CRUD avec PDO direct",
    description: "CRUD sans architecture POO complexe",
    lessons: [
      lesson({
        id: "php-crud-pdo-simple",
        title: "CRUD avec PDO de manière directe",
        minutes: 20,
        summary:
          "Approche plus simple : PDO directement sans classes DAO. Moins de code, bon pour petits projets. Comprendre les différences avec architecture POO.",
        sections: [
          section(
            "PDO direct vs Architecture",
            "Quand utiliser chaque approche.",
            [
              "PDO direct : scripts simples < 200 lignes",
              "Architecture POO : applications évolutives",
              "PDO direct : rapide à écrire",
              "Architecture POO : facile à maintenir",
              "Toujours prepared statements dans les deux cas !",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// CRUD avec PDO direct (sans classes DAO)
$pdo = new PDO('sqlite::memory:');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec("CREATE TABLE produits (id INTEGER PRIMARY KEY, nom TEXT, prix REAL)");

// CREATE
$stmt = $pdo->prepare("INSERT INTO produits (nom, prix) VALUES (?, ?)");
$stmt->execute(["Laptop", 999]);
$stmt->execute(["Souris", 25]);
echo "✅ 2 produits créés" . PHP_EOL;

// READ
$stmt = $pdo->query("SELECT * FROM produits");
foreach ($stmt->fetchAll() as $p) {
    echo "#{$p['id']}: {$p['nom']} - {$p['prix']}€" . PHP_EOL;
}

// UPDATE
$stmt = $pdo->prepare("UPDATE produits SET prix = ? WHERE id = ?");
$stmt->execute([899, 1]);
echo "\\n✅ Prix mis à jour" . PHP_EOL;

// DELETE
$stmt = $pdo->prepare("DELETE FROM produits WHERE id = ?");
$stmt->execute([2]);
echo "✅ Produit supprimé" . PHP_EOL;

echo "\\n💡 PDO direct = Simple pour petits scripts" . PHP_EOL;
echo "💡 Architecture POO = Maintenable pour gros projets" . PHP_EOL;
?>`,
        ),
        task: "Créez table tasks avec PDO direct. Ajoutez 5 tâches, modifiez-en une, supprimez-en une. Sans classes.",
        takeaway:
          "PDO direct = simple et rapide pour scripts. Architecture POO = maintenable pour applications. Choisir selon taille projet.",
        quiz: quiz(
          "Quand préférer PDO direct ?",
          ["Toujours", "Petits scripts simples", "Jamais"],
          1,
          "PDO direct est OK pour petits scripts < 200 lignes. Pour applications évolutives, architecture POO recommandée."
        ),
        link: docs + "book.pdo.php",
      }),
    ],
  },
  {
    id: "php-poo-pdo-synthese",
    title: "POO vs PDO - Synthèse finale",
    description: "Clarification et recommandations",
    lessons: [
      lesson({
        id: "php-poo-pdo-difference",
        title: "POO vs PDO : La vérité",
        minutes: 20,
        summary:
          "POO et PDO ne sont PAS opposés ! POO = architecture (comment organiser code). PDO = outil (comment accéder BD). PDO s'utilise DANS l'architecture POO.",
        sections: [
          section(
            "La confusion",
            "Pourquoi compare-t-on POO et PDO ?",
            [
              "Noms similaires (POO, PDO)",
              "Tutoriels mal formulés",
              "Mais ce sont deux choses DIFFÉRENTES !",
              "POO = architecture, PDO = outil",
              "PDO utilisé DANS les classes POO",
            ]
          ),
          section(
            "POO = Architecture",
            "Comment organiser le code.",
            [
              "Classes, objets, héritage",
              "Model, DAO, Controller",
              "Fonctionne sans BD",
              "Utilise PDO comme outil",
            ]
          ),
          section(
            "PDO = Outil",
            "Extension PHP pour BD.",
            [
              "Extension PHP (comme JSON)",
              "Accès unifié aux BD",
              "Utilisé DANS les classes",
              "N'est PAS une architecture",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
echo "╔═══════════════════════════════════╗" . PHP_EOL;
echo "║   POO vs PDO : LA VÉRITÉ          ║" . PHP_EOL;
echo "╚═══════════════════════════════════╝" . PHP_EOL . PHP_EOL;

echo "📌 POO = ARCHITECTURE (organiser code)" . PHP_EOL;
echo "   • Classes et objets" . PHP_EOL;
echo "   • Model, DAO, Controller" . PHP_EOL;
echo "   • Fonctionne sans BD" . PHP_EOL . PHP_EOL;

echo "🔧 PDO = OUTIL (accéder BD)" . PHP_EOL;
echo "   • Extension PHP" . PHP_EOL;
echo "   • Connexion BD unifiée" . PHP_EOL;
echo "   • Utilisé DANS les classes" . PHP_EOL . PHP_EOL;

echo "✅ POO + PDO = ILS TRAVAILLENT ENSEMBLE !" . PHP_EOL . PHP_EOL;

// Démonstration
class UserDAO {
    private $pdo;  // ← PDO utilisé ICI
    
    public function __construct($pdo) {
        $this->pdo = $pdo;  // Architecture POO utilise outil PDO
    }
}

echo "💡 TABLEAU COMPARATIF:" . PHP_EOL;
echo "┌──────────┬──────────────┬──────────────┐" . PHP_EOL;
echo "│ Aspect   │ POO          │ PDO          │" . PHP_EOL;
echo "├──────────┼──────────────┼──────────────┤" . PHP_EOL;
echo "│ Type     │ Architecture │ Outil        │" . PHP_EOL;
echo "│ Rôle     │ Organiser    │ Accéder BD   │" . PHP_EOL;
echo "│ Relation │ Utilise PDO  │ Utilisé par  │" . PHP_EOL;
echo "│          │              │ classes POO  │" . PHP_EOL;
echo "└──────────┴──────────────┴──────────────┘" . PHP_EOL . PHP_EOL;

echo "❓ Dois-je choisir entre POO et PDO ?" . PHP_EOL;
echo "✅ NON ! PDO s'utilise DANS l'architecture POO." . PHP_EOL . PHP_EOL;

echo "❓ POO remplace-t-il PDO ?" . PHP_EOL;
echo "✅ NON ! POO est l'architecture, PDO est l'outil." . PHP_EOL . PHP_EOL;

echo "💡 RECOMMANDATIONS:" . PHP_EOL;
echo "   • Petit script → PDO direct" . PHP_EOL;
echo "   • Application → Architecture POO + PDO" . PHP_EOL;
echo "   • En entreprise → Toujours POO + PDO" . PHP_EOL;
?>`,
        ),
        task: "Aucun. Relisez cette leçon pour comprendre que POO et PDO ne sont pas opposés.",
        takeaway:
          "POO = architecture, PDO = outil. Ils travaillent ENSEMBLE. PDO utilisé dans classes POO. Ce ne sont PAS des alternatives !",
        quiz: quiz(
          "POO et PDO sont-ils opposés ?",
          ["Oui", "Non, PDO s'utilise dans POO", "Oui, il faut choisir"],
          1,
          "POO et PDO travaillent ENSEMBLE. PDO est un outil utilisé DANS les classes POO (notamment DAO)."
        ),
        link: docs + "language.oop5.php",
      }),
    ],
  },
  {
    id: "php-projet-api-rest",
    title: "Projet final : API REST",
    description: "API REST complète en PHP pur",
    lessons: [
      lesson({
        id: "php-api-rest-final",
        title: "Projet : API REST Bibliothèque (POO + PDO + JSON)",
        minutes: 45,
        summary:
          "API REST complète : architecture POO (Model + DAO), PDO pour SQLite, réponses JSON, codes HTTP corrects. PHP pur sans framework.",
        sections: [
          section(
            "Objectifs",
            "API REST production-ready.",
            [
              "GET /livres : liste",
              "GET /livres/:id : détail",
              "POST /livres : créer",
              "PUT /livres/:id : modifier",
              "DELETE /livres/:id : supprimer",
              "Réponses JSON",
              "Codes HTTP (200, 201, 404, 500)",
            ]
          ),
        ],
        files: consoleFiles(
          "php",
          `<?php
// API REST Bibliothèque - Version simplifiée
header('Content-Type: application/json');

// Fonction réponse JSON
function sendJSON($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Model
class Livre {
    public $id, $titre, $auteur, $annee;
    
    public function __construct($id, $titre, $auteur, $annee) {
        $this->id = $id;
        $this->titre = $titre;
        $this->auteur = $auteur;
        $this->annee = $annee;
    }
    
    public function toArray() {
        return ['id' => $this->id, 'titre' => $this->titre, 
                'auteur' => $this->auteur, 'annee' => $this->annee];
    }
}

// DAO
class LivreDAO {
    private $pdo;
    
    public function __construct() {
        $this->pdo = new PDO('sqlite:biblio.db');
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->exec("CREATE TABLE IF NOT EXISTS livres 
            (id INTEGER PRIMARY KEY, titre TEXT, auteur TEXT, annee INTEGER)");
    }
    
    public function findAll() {
        $stmt = $this->pdo->query("SELECT * FROM livres");
        $livres = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $livres[] = new Livre($row['id'], $row['titre'], $row['auteur'], $row['annee']);
        }
        return $livres;
    }
    
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM livres WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? new Livre($row['id'], $row['titre'], $row['auteur'], $row['annee']) : null;
    }
    
    public function create($titre, $auteur, $annee) {
        $stmt = $this->pdo->prepare("INSERT INTO livres (titre, auteur, annee) VALUES (?, ?, ?)");
        $stmt->execute([$titre, $auteur, $annee]);
        return $this->pdo->lastInsertId();
    }
    
    public function update($id, $titre, $auteur, $annee) {
        $stmt = $this->pdo->prepare("UPDATE livres SET titre = ?, auteur = ?, annee = ? WHERE id = ?");
        $stmt->execute([$titre, $auteur, $annee, $id]);
    }
    
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM livres WHERE id = ?");
        $stmt->execute([$id]);
    }
}

// Routeur API
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '/';
$dao = new LivreDAO();

try {
    // GET /livres - Liste tous
    if ($method === 'GET' && $path === '/livres') {
        $livres = $dao->findAll();
        sendJSON(array_map(fn($l) => $l->toArray(), $livres));
    }
    
    // GET /livres/:id - Détail
    elseif ($method === 'GET' && preg_match('#^/livres/(\\d+)$#', $path, $m)) {
        $livre = $dao->findById($m[1]);
        $livre ? sendJSON($livre->toArray()) : sendJSON(['error' => 'Non trouvé'], 404);
    }
    
    // POST /livres - Créer
    elseif ($method === 'POST' && $path === '/livres') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $dao->create($data['titre'], $data['auteur'], $data['annee']);
        sendJSON(['id' => $id, 'message' => 'Créé'], 201);
    }
    
    // PUT /livres/:id - Modifier
    elseif ($method === 'PUT' && preg_match('#^/livres/(\\d+)$#', $path, $m)) {
        $data = json_decode(file_get_contents('php://input'), true);
        $dao->update($m[1], $data['titre'], $data['auteur'], $data['annee']);
        sendJSON(['message' => 'Modifié']);
    }
    
    // DELETE /livres/:id - Supprimer
    elseif ($method === 'DELETE' && preg_match('#^/livres/(\\d+)$#', $path, $m)) {
        $dao->delete($m[1]);
        sendJSON(['message' => 'Supprimé']);
    }
    
    else {
        sendJSON(['error' => 'Route non trouvée'], 404);
    }
    
} catch (Exception $e) {
    sendJSON(['error' => $e->getMessage()], 500);
}

// Test avec curl:
// curl http://localhost/api.php/livres
// curl -X POST -d '{"titre":"1984","auteur":"Orwell","annee":1949}' http://localhost/api.php/livres
?>`,
        ),
        task: "Testez l'API avec curl ou Postman. Créez 3 livres, listez-les, modifiez-en un, supprimez-en un.",
        takeaway:
          "API REST = Architecture POO + PDO + JSON. Routes GET/POST/PUT/DELETE. Codes HTTP corrects. PHP pur sans framework. Félicitations ! 🎉",
        quiz: quiz(
          "Quelle méthode HTTP pour créer ?",
          ["GET", "POST", "PUT"],
          1,
          "POST crée une ressource. GET lit, PUT modifie, DELETE supprime. Standards REST."
        ),
        link: docs + "tutorial.php",
      }),
    ],
  },
];

export const phpLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Les fondamentaux de PHP",
    color: levelColors[0],
    objective:
      "Maîtriser les bases : variables, conditions, boucles, fonctions, tableaux. Comprendre la programmation PHP côté serveur.",
    prerequisites:
      "Aucun. Ce niveau est fait pour les débutants complets.",
    outcomes: [
      "Écrire et exécuter des scripts PHP",
      "Manipuler variables, types et opérateurs",
      "Utiliser conditions, boucles et fonctions",
      "Travailler avec tableaux et fichiers",
    ],
    projects: [],
    chapters: beginner,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "POO et bases de données",
    color: levelColors[1],
    objective:
      "Maîtriser la POO en PHP, les interfaces, traits, JSON et introduction aux bases de données.",
    prerequisites:
      "Niveau débutant complété. Maîtrise des bases PHP.",
    outcomes: [
      "Créer des classes et utiliser l'héritage",
      "Implémenter interfaces et traits",
      "Manipuler JSON et DateTime",
      "Comprendre les bases de données",
    ],
    projects: [],
    chapters: intermediate,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "POO, PDO et API REST",
    color: levelColors[2],
    objective:
      "Comprendre POO vs PDO (architecture vs outil), créer CRUD avec SQLite, développer API REST sans framework.",
    prerequisites:
      "Niveaux débutant et intermédiaire complétés. Maîtrise POO.",
    outcomes: [
      "Distinguer POO (organisation) et PDO (accès BD)",
      "Implémenter CRUD avec les deux approches",
      "Utiliser prepared statements (sécurité)",
      "Créer API REST JSON en PHP pur",
      "Choisir la bonne architecture selon contexte",
    ],
    projects: [],
    chapters: advanced,
  },
];
