import {
  lesson,
  levelColors,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import type { WebLevel } from "./webCourseTypes";

const docs = "https://en.cppreference.com/w/cpp/";
const fltk = "https://www.fltk.org/documentation.php";

// Cours C++ restructuré avec 3 niveaux progressifs
// Niveau débutant : Fondamentaux C++ (9 chapitres)
// Niveau intermédiaire : POO avancée, structures, pointeurs (7 chapitres)
// Niveau avancé : FLTK GUI + SQLite (4 chapitres)

export const cppLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Fondamentaux du C++",
    color: levelColors[0],
    objective:
      "Maîtriser les bases du C++ : syntaxe, compilation, types de données, structures de contrôle, fonctions, modularité, gestion d'erreurs et énumérations.",
    prerequisites:
      "Aucun prérequis. Connaissance d'un autre langage de programmation est un plus.",
    outcomes: [
      "Comprendre la compilation et l'exécution d'un programme C++",
      "Utiliser les types de données, variables et opérateurs",
      "Maîtriser les structures de contrôle (if, switch, boucles)",
      "Créer et utiliser des fonctions",
      "Organiser le code en modules",
      "Gérer les erreurs avec try/catch",
      "Utiliser les énumérations"
    ],
    projects: [],
    chapters: [
      {
        id: "introduction",
        title: "Introduction au C++",
        description: "Découvrir C++, son utilisation et ses avantages",
        lessons: [
          lesson({
            id: "cpp-intro",
            title: "C++ : langage compilé et polyvalent",
            minutes: 25,
            summary:
              "C++ est un langage compilé créé en 1985, extension du C avec la POO. Très utilisé pour les systèmes, jeux, applications haute performance. Offre performance et contrôle direct de la mémoire.",
            sections: [
              section(
                "Qu'est-ce que le C++ ?",
                "C++ est un langage de programmation compilé, multi-paradigme créé par Bjarne Stroustrup. Il combine la performance du C avec la puissance de la programmation orientée objet.",
                [
                  "Créé en 1985 par Bjarne Stroustrup (Bell Labs)",
                  "Extension du langage C avec POO et autres fonctionnalités",
                  "Compilé : traduit en code machine natif (très rapide)",
                  "Multi-paradigme : procédural, orienté objet, générique",
                  "Standards : C++98, C++11, C++14, C++17, C++20, C++23",
                  "Portable : fonctionne sur Windows, Linux, macOS"
                ]
              ),
              section(
                "Utilisations et avantages",
                "C++ est utilisé là où la performance est critique. Son contrôle bas niveau et sa rapidité le rendent idéal pour de nombreux domaines.",
                [
                  "✅ Systèmes d'exploitation (Windows, Linux)",
                  "✅ Jeux vidéo (moteurs Unreal, Unity natif)",
                  "✅ Navigateurs web (Chrome, Firefox)",
                  "✅ Bases de données (MySQL, PostgreSQL)",
                  "✅ Applications embarquées et IoT",
                  "✅ Intelligence artificielle (TensorFlow backend)",
                  "✅ Avantage : Vitesse d'exécution maximale",
                  "✅ Avantage : Contrôle total de la mémoire",
                  "⚠️ Inconvénient : Plus complexe que Python/Java"
                ]
              ),
              section(
                "Comment C++ fonctionne",
                "Un programme C++ passe par plusieurs étapes avant d'être exécuté.",
                [
                  "1. Écriture du code source (.cpp)",
                  "2. Préprocesseur : traite les #include, #define",
                  "3. Compilation : traduit en code machine (.o ou .obj)",
                  "4. Édition de liens : relie les bibliothèques",
                  "5. Exécution : programme natif très rapide",
                  "Différence avec Java : Java compile en bytecode (JVM)",
                  "Différence avec Python : Python interprété (plus lent)"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>

int main() {
    std::cout << "Bienvenue dans le monde du C++ !" << std::endl;
    std::cout << "C++ : Performance et Contrôle" << std::endl;
    return 0;
}

// Compilation : g++ main.cpp -o programme
// Exécution : ./programme (Linux/Mac) ou programme.exe (Windows)`
            ),
            task: "Modifiez le programme pour afficher votre nom, votre objectif d'apprentissage et pourquoi C++ vous intéresse.",
            takeaway:
              "C++ est un langage compilé puissant utilisé partout où la performance est cruciale. Il offre un contrôle total mais demande plus de rigueur que Python ou Java.",
            quiz: quiz(
              "Pourquoi C++ est-il plus rapide que Python ?",
              ["Il a une meilleure syntaxe", "Il est compilé en code machine natif", "Il est plus récent"],
              1,
              "C++ est compilé directement en code machine, alors que Python est interprété ligne par ligne."
            ),
            link: docs + "language"
          })
        ]
      },
      {
        id: "variables-operateurs",
        title: "Variables et opérateurs",
        description: "Types de données, déclaration et opérations",
        lessons: [
          lesson({
            id: "types-variables",
            title: "Types de données et déclaration de variables",
            minutes: 30,
            summary:
              "C++ est typé statiquement. Principaux types : int (entiers), double (décimaux), bool (vrai/faux), char (caractère), string (texte). Déclaration : type nom = valeur;",
            sections: [
              section(
                "Types primitifs",
                "C++ offre plusieurs types pour représenter différentes sortes de données numériques et textuelles.",
                [
                  "int : nombres entiers (-2147483648 à 2147483647)",
                  "short : entier court (-32768 à 32767)",
                  "long : entier long (au moins 32 bits)",
                  "float : nombre à virgule (précision simple)",
                  "double : nombre à virgule (précision double)",
                  "char : un caractère ('A', '5', '$')",
                  "bool : booléen (true ou false)",
                  "unsigned : modificateur pour nombres positifs uniquement"
                ]
              ),
              section(
                "Déclaration et initialisation",
                "Déclarez une variable en spécifiant son type, son nom et optionnellement sa valeur initiale.",
                [
                  "Syntaxe : type nom = valeur;",
                  "Exemples : int age = 25;",
                  "double prix = 19.99;",
                  "bool actif = true;",
                  "char lettre = 'A';",
                  "Toujours initialiser vos variables !",
                  "C++11 : int x{10}; (initialisation uniforme)"
                ]
              ),
              section(
                "std::string pour le texte",
                "Pour les chaînes de caractères, utilisez std::string de la bibliothèque standard.",
                [
                  "#include <string> nécessaire",
                  "std::string nom = \"Alice\";",
                  "Concaténation avec +",
                  ".length() : longueur du texte",
                  ".substr(pos, len) : sous-chaîne",
                  "Plus facile que les char[] du C"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <string>

int main() {
    // Types numériques
    int age = 25;
    double taille = 1.75;
    float prix = 19.99f;
    
    // Booléen
    bool estEtudiant = true;
    
    // Caractère
    char grade = 'A';
    
    // Chaîne de caractères
    std::string nom = "Alice";
    std::string ville = "Dakar";
    
    // Affichage
    std::cout << "Nom: " << nom << std::endl;
    std::cout << "Age: " << age << " ans" << std::endl;
    std::cout << "Taille: " << taille << " m" << std::endl;
    std::cout << "Prix: " << prix << " €" << std::endl;
    std::cout << "Étudiant: " << (estEtudiant ? "Oui" : "Non") << std::endl;
    std::cout << "Grade: " << grade << std::endl;
    std::cout << "Ville: " << ville << std::endl;
    
    // Tailles des types
    std::cout << "\\nTaille d'un int: " << sizeof(int) << " octets" << std::endl;
    std::cout << "Taille d'un double: " << sizeof(double) << " octets" << std::endl;
    
    return 0;
}`
            ),
            task: "Créez des variables pour votre profil : nom, âge, email, estProgrammeur, langage favori. Affichez-les.",
            takeaway:
              "C++ est typé statiquement. int pour entiers, double pour décimaux, bool pour vrai/faux, string pour texte. Toujours initialiser !",
            quiz: quiz(
              "Quel type utiliser pour stocker 3.14159 ?",
              ["int", "char", "double"],
              2,
              "double est adapté pour les nombres à virgule flottante avec bonne précision."
            ),
            link: docs + "language/types"
          }),
          lesson({
            id: "operateurs",
            title: "Opérateurs arithmétiques, comparaison et logiques",
            minutes: 25,
            summary:
              "Opérateurs arithmétiques (+, -, *, /, %), comparaison (==, !=, <, >, <=, >=), logiques (&&, ||, !). Attention à la division entière !",
            sections: [
              section(
                "Opérateurs arithmétiques",
                "Les opérateurs de base pour effectuer des calculs mathématiques.",
                [
                  "+ : Addition (5 + 3 = 8)",
                  "- : Soustraction (10 - 4 = 6)",
                  "* : Multiplication (7 * 6 = 42)",
                  "/ : Division (10 / 3 = 3 si entiers, 3.333... si double)",
                  "% : Modulo, reste de division (10 % 3 = 1)",
                  "++ : Incrément (x++ équivaut à x = x + 1)",
                  "-- : Décrément (x-- équivaut à x = x - 1)",
                  "⚠️ 10 / 3 avec int = 3, pas 3.333 !"
                ]
              ),
              section(
                "Opérateurs de comparaison",
                "Comparer des valeurs. Le résultat est un bool (true ou false).",
                [
                  "== : Égal (5 == 5 retourne true)",
                  "!= : Différent (5 != 3 retourne true)",
                  "< : Inférieur (3 < 5 retourne true)",
                  "> : Supérieur (10 > 5 retourne true)",
                  "<= : Inférieur ou égal",
                  ">= : Supérieur ou égal",
                  "⚠️ = est affectation, == est comparaison !"
                ]
              ),
              section(
                "Opérateurs logiques",
                "Combiner plusieurs conditions booléennes.",
                [
                  "&& : ET logique (true && true = true)",
                  "|| : OU logique (true || false = true)",
                  "! : NON logique (!true = false)",
                  "Utilisation : if (age >= 18 && permis)",
                  "Court-circuit : && s'arrête si premier false",
                  "Court-circuit : || s'arrête si premier true"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>

int main() {
    int a = 10, b = 3;
    
    // Arithmétiques
    std::cout << "=== Opérateurs arithmétiques ===" << std::endl;
    std::cout << a << " + " << b << " = " << (a + b) << std::endl;
    std::cout << a << " - " << b << " = " << (a - b) << std::endl;
    std::cout << a << " * " << b << " = " << (a * b) << std::endl;
    std::cout << a << " / " << b << " = " << (a / b) << " (division entière)" << std::endl;
    std::cout << a << " % " << b << " = " << (a % b) << " (reste)" << std::endl;
    
    double x = 10.0, y = 3.0;
    std::cout << x << " / " << y << " = " << (x / y) << " (division réelle)" << std::endl;
    
    // Comparaisons
    std::cout << "\\n=== Opérateurs de comparaison ===" << std::endl;
    std::cout << a << " == " << b << " : " << (a == b) << std::endl;
    std::cout << a << " != " << b << " : " << (a != b) << std::endl;
    std::cout << a << " > " << b << " : " << (a > b) << std::endl;
    std::cout << a << " < " << b << " : " << (a < b) << std::endl;
    
    // Logiques
    std::cout << "\\n=== Opérateurs logiques ===" << std::endl;
    bool majeur = true, permis = false;
    std::cout << "majeur && permis : " << (majeur && permis) << std::endl;
    std::cout << "majeur || permis : " << (majeur || permis) << std::endl;
    std::cout << "!permis : " << !permis << std::endl;
    
    // Incrément/Décrément
    int compteur = 5;
    std::cout << "\\n=== Incrément/Décrément ===" << std::endl;
    std::cout << "compteur = " << compteur << std::endl;
    compteur++;
    std::cout << "Après compteur++ : " << compteur << std::endl;
    compteur--;
    std::cout << "Après compteur-- : " << compteur << std::endl;
    
    return 0;
}`
            ),
            task: "Créez un programme qui calcule l'aire et le périmètre d'un rectangle (largeur = 10, hauteur = 5). Vérifiez si l'aire est supérieure à 40.",
            takeaway:
              "Opérateurs : +, -, *, /, % pour calculs. ==, !=, <, > pour comparer. &&, ||, ! pour logique. Attention : 10 / 3 = 3 avec int !",
            quiz: quiz(
              "Que vaut 10 / 3 en C++ avec des int ?",
              ["3.33", "3", "4"],
              1,
              "La division entière tronque le résultat. 10 / 3 = 3, pas 3.33."
            ),
            link: docs + "language/operator_arithmetic"
          })
        ]
      },
      {
        id: "conditions",
        title: "Structures conditionnelles",
        description: "Contrôler le flux avec if, else et switch",
        lessons: [
          lesson({
            id: "if-else",
            title: "Conditions if, else if, else",
            minutes: 25,
            summary:
              "if permet d'exécuter du code selon une condition. else if teste une autre condition, else est le cas par défaut. Les accolades {} délimitent les blocs.",
            sections: [
              section(
                "Structure if/else",
                "Exécuter du code conditionnellement selon qu'une expression est vraie ou fausse.",
                [
                  "if (condition) { instructions }",
                  "else if (autre_condition) { instructions }",
                  "else { instructions }",
                  "Condition doit être de type bool",
                  "Accolades {} recommandées même pour une ligne",
                  "Opérateur ternaire : condition ? vrai : faux"
                ]
              ),
              section(
                "Conditions composées",
                "Combiner plusieurs conditions avec && (ET) et || (OU).",
                [
                  "&& : Les deux conditions doivent être vraies",
                  "|| : Au moins une condition doit être vraie",
                  "Parenthèses pour la clarté",
                  "Exemple : if (age >= 18 && permis) { }"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <string>

int main() {
    int note = 15;
    
    // if/else if/else
    std::cout << "Note: " << note << " -> ";
    if (note >= 16) {
        std::cout << "Très bien" << std::endl;
    } else if (note >= 14) {
        std::cout << "Bien" << std::endl;
    } else if (note >= 12) {
        std::cout << "Assez bien" << std::endl;
    } else if (note >= 10) {
        std::cout << "Passable" << std::endl;
    } else {
        std::cout << "Insuffisant" << std::endl;
    }
    
    // Conditions composées
    int age = 20;
    bool permis = true;
    
    std::cout << "\\nVérification conduite:" << std::endl;
    if (age >= 18 && permis) {
        std::cout << "✓ Peut conduire" << std::endl;
    } else if (age >= 18 && !permis) {
        std::cout << "✗ Majeur mais pas de permis" << std::endl;
    } else {
        std::cout << "✗ Trop jeune" << std::endl;
    }
    
    // Opérateur ternaire
    int nombre = 7;
    std::string parite = (nombre % 2 == 0) ? "pair" : "impair";
    std::cout << "\\n" << nombre << " est " << parite << std::endl;
    
    // Conditions multiples
    int prix = 150;
    bool reduction = true;
    
    if (prix > 100 && reduction) {
        std::cout << "\\nPrix final: " << (prix * 0.9) << " € (10% de réduction)" << std::endl;
    } else {
        std::cout << "\\nPrix final: " << prix << " €" << std::endl;
    }
    
    return 0;
}`
            ),
            task: "Écrivez un programme qui détermine si une année est bissextile (divisible par 4 mais pas par 100, sauf si divisible par 400).",
            takeaway:
              "if/else pour brancher l'exécution. && pour ET, || pour OU. Opérateur ternaire : condition ? vrai : faux.",
            quiz: quiz(
              "Que fait l'opérateur && ?",
              ["OU logique", "ET logique", "NON logique"],
              1,
              "&& retourne true seulement si les deux conditions sont vraies."
            ),
            link: docs + "language/if"
          }),
          lesson({
            id: "switch-case",
            title: "Switch : sélection multiple",
            minutes: 20,
            summary:
              "switch teste une variable contre plusieurs valeurs constantes. Plus lisible que des if/else multiples. N'oubliez pas break après chaque case !",
            sections: [
              section(
                "Structure du switch",
                "switch évalue une expression et saute au case correspondant.",
                [
                  "switch (variable) { case valeur: code; break; }",
                  "break obligatoire pour sortir",
                  "Sans break : continue dans les case suivants (fall-through)",
                  "default : cas par défaut si aucun case",
                  "Fonctionne avec int, char, enum",
                  "Ne fonctionne PAS avec string (en C++ standard)"
                ]
              ),
              section(
                "Quand utiliser switch",
                "switch est idéal pour tester une variable contre plusieurs valeurs exactes.",
                [
                  "Bon pour : menus, codes, énumérations",
                  "Pas bon pour : intervalles, conditions complexes",
                  "Plusieurs case peuvent partager le même code",
                  "Alternative : if/else pour conditions riches"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>

int main() {
    int jour = 3;
    
    std::cout << "Jour " << jour << " : ";
    switch (jour) {
        case 1:
            std::cout << "Lundi" << std::endl;
            break;
        case 2:
            std::cout << "Mardi" << std::endl;
            break;
        case 3:
            std::cout << "Mercredi" << std::endl;
            break;
        case 4:
            std::cout << "Jeudi" << std::endl;
            break;
        case 5:
            std::cout << "Vendredi" << std::endl;
            break;
        case 6:
        case 7: // Plusieurs case pour le même code
            std::cout << "Week-end !" << std::endl;
            break;
        default:
            std::cout << "Jour invalide" << std::endl;
    }
    
    // Switch avec char
    char note = 'B';
    
    std::cout << "\\nNote " << note << " : ";
    switch (note) {
        case 'A':
            std::cout << "Excellent (16-20)" << std::endl;
            break;
        case 'B':
            std::cout << "Bien (14-15)" << std::endl;
            break;
        case 'C':
            std::cout << "Assez bien (12-13)" << std::endl;
            break;
        case 'D':
            std::cout << "Passable (10-11)" << std::endl;
            break;
        case 'F':
            std::cout << "Insuffisant (0-9)" << std::endl;
            break;
        default:
            std::cout << "Note invalide" << std::endl;
    }
    
    // Menu simple
    int choix = 2;
    
    std::cout << "\\n=== Menu ===" << std::endl;
    std::cout << "Choix: " << choix << " -> ";
    switch (choix) {
        case 1:
            std::cout << "Option 1 sélectionnée" << std::endl;
            break;
        case 2:
            std::cout << "Option 2 sélectionnée" << std::endl;
            break;
        case 3:
            std::cout << "Option 3 sélectionnée" << std::endl;
            break;
        default:
            std::cout << "Choix invalide" << std::endl;
    }
    
    return 0;
}`
            ),
            task: "Créez un switch pour un calculateur simple : selon l'opération (+, -, *, /), effectuez le calcul sur deux nombres.",
            takeaway:
              "switch pour tester une variable contre plusieurs valeurs. N'oubliez jamais break ! default pour le cas par défaut.",
            quiz: quiz(
              "Que se passe-t-il si on oublie break dans un case ?",
              ["Erreur compilation", "Exécution continue dans les case suivants", "Rien"],
              1,
              "Sans break, l'exécution 'tombe' dans le case suivant (fall-through)."
            ),
            link: docs + "language/switch"
          })
        ]
      },
      {
        id: "boucles",
        title: "Boucles et répétitions",
        description: "for, while et do-while pour répéter du code",
        lessons: [
          lesson({
            id: "boucles-for-while",
            title: "Boucles for, while et do-while",
            minutes: 30,
            summary:
              "for pour nombre connu d'itérations, while pour condition, do-while pour exécuter au moins une fois. break sort de la boucle, continue passe à l'itération suivante.",
            sections: [
              section(
                "La boucle for",
                "for est la boucle la plus courante quand on connaît le nombre d'itérations.",
                [
                  "Syntaxe : for (init; condition; incrémentation) { }",
                  "Exemple : for (int i = 0; i < 10; i++) { }",
                  "i++ équivaut à i = i + 1",
                  "i-- équivaut à i = i - 1",
                  "Portée de i : limitée à la boucle",
                  "for-each (C++11) : for (auto elem : conteneur) { }"
                ]
              ),
              section(
                "Les boucles while et do-while",
                "while teste la condition avant, do-while après (garantit au moins une exécution).",
                [
                  "while (condition) { code }",
                  "do { code } while (condition);",
                  "break : Sort immédiatement de la boucle",
                  "continue : Passe à l'itération suivante",
                  "⚠️ Attention aux boucles infinies !",
                  "do-while : exécute au moins une fois"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>

int main() {
    // Boucle for classique
    std::cout << "=== Boucle for (0 à 9) ===" << std::endl;
    for (int i = 0; i < 10; i++) {
        std::cout << i << " ";
    }
    std::cout << std::endl;
    
    // Table de multiplication
    int n = 7;
    std::cout << "\\n=== Table de " << n << " ===" << std::endl;
    for (int i = 1; i <= 10; i++) {
        std::cout << n << " x " << i << " = " << (n * i) << std::endl;
    }
    
    // Boucle while
    std::cout << "\\n=== Boucle while ===" << std::endl;
    int compteur = 0;
    while (compteur < 5) {
        std::cout << "Compteur: " << compteur << std::endl;
        compteur++;
    }
    
    // Boucle do-while (exécute au moins une fois)
    std::cout << "\\n=== Boucle do-while ===" << std::endl;
    int x = 10;
    do {
        std::cout << "x = " << x << " (exécuté au moins une fois)" << std::endl;
        x++;
    } while (x < 10); // Condition fausse dès le début, mais s'exécute quand même
    
    // break et continue
    std::cout << "\\n=== break et continue ===" << std::endl;
    for (int i = 0; i < 10; i++) {
        if (i == 3) {
            std::cout << "(3 sauté avec continue) ";
            continue; // Saute le reste et passe à i=4
        }
        if (i == 7) {
            std::cout << "\\n(arrêt à 7 avec break)";
            break; // Sort de la boucle
        }
        std::cout << i << " ";
    }
    std::cout << std::endl;
    
    // Somme de 1 à 100
    int somme = 0;
    for (int i = 1; i <= 100; i++) {
        somme += i; // Équivaut à somme = somme + i
    }
    std::cout << "\\nSomme de 1 à 100: " << somme << std::endl;
    
    return 0;
}`
            ),
            task: "Créez un programme qui affiche tous les nombres pairs de 0 à 20, puis calcule leur somme.",
            takeaway:
              "for pour nombre d'itérations connu, while pour condition, do-while pour au moins une exécution. break sort, continue passe à la suivante.",
            quiz: quiz(
              "Quelle boucle garantit au moins une exécution ?",
              ["for", "while", "do-while"],
              2,
              "do-while exécute le code une fois avant de tester la condition."
            ),
            link: docs + "language/for"
          })
        ]
      },
      {
        id: "fonctions",
        title: "Fonctions et modularité",
        description: "Organiser le code en fonctions réutilisables",
        lessons: [
          lesson({
            id: "fonctions-base",
            title: "Déclaration et appel de fonctions",
            minutes: 25,
            summary:
              "Les fonctions permettent de réutiliser du code. Elles ont un type de retour, un nom, des paramètres et un corps. return renvoie une valeur. void pour fonctions sans retour.",
            sections: [
              section(
                "Syntaxe des fonctions",
                "Une fonction a un type de retour, un nom, des paramètres entre parenthèses et un corps entre accolades.",
                [
                  "type_retour nom(type param1, type param2) { corps }",
                  "return termine la fonction et renvoie une valeur",
                  "void : fonction qui ne retourne rien",
                  "Prototype (déclaration) avant main()",
                  "Définition (implémentation) peut être après",
                  "Appel : nom(arguments);"
                ]
              ),
              section(
                "Passage de paramètres",
                "Par défaut, C++ passe les paramètres par valeur (copie). Pour modifier l'original, utilisez les références (&).",
                [
                  "Par valeur : la fonction reçoit une copie",
                  "Par référence : & après le type (int& x)",
                  "const& : référence en lecture seule (efficace)",
                  "Valeur par défaut : int fonction(int x = 10)"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <string>

// Prototypes (déclarations)
int addition(int a, int b);
double moyenne(double a, double b);
void afficherMessage(std::string msg);
int carre(int n);

int main() {
    // Appels de fonctions
    int somme = addition(10, 5);
    std::cout << "10 + 5 = " << somme << std::endl;
    
    double moy = moyenne(15.5, 18.3);
    std::cout << "Moyenne: " << moy << std::endl;
    
    afficherMessage("Bonjour du C++ !");
    
    std::cout << "Carré de 7: " << carre(7) << std::endl;
    
    return 0;
}

// Définitions des fonctions
int addition(int a, int b) {
    return a + b;
}

double moyenne(double a, double b) {
    return (a + b) / 2.0;
}

void afficherMessage(std::string msg) {
    std::cout << "Message: " << msg << std::endl;
    // Pas de return car void
}

int carre(int n) {
    return n * n;
}`
            ),
            task: "Créez une fonction estPremier(int n) qui retourne true si n est premier, false sinon. Testez avec plusieurs nombres.",
            takeaway:
              "Fonctions = réutilisabilité du code. Type de retour, nom, paramètres, corps. void si pas de retour. Prototype avant main().",
            quiz: quiz(
              "Que signifie void comme type de retour ?",
              ["Erreur", "La fonction ne retourne rien", "Retourne 0"],
              1,
              "void indique qu'une fonction ne retourne aucune valeur."
            ),
            link: docs + "language/functions"
          })
        ]
      },
      {
        id: "modulaire",
        title: "Programmation modulaire",
        description: "Organiser le code en fichiers séparés (.h et .cpp)",
        lessons: [
          lesson({
            id: "headers-includes",
            title: "Headers (.h) et fichiers source (.cpp)",
            minutes: 25,
            summary:
              "La programmation modulaire divise le code en fichiers .h (déclarations) et .cpp (implémentations). #include inclut le contenu d'un fichier. Guards (#ifndef) évitent les inclusions multiples.",
            sections: [
              section(
                "Organisation modulaire",
                "Séparez les déclarations (headers .h) des implémentations (sources .cpp) pour une meilleure organisation.",
                [
                  "Fichier .h : prototypes, déclarations de classes",
                  "Fichier .cpp : implémentations, définitions",
                  "#include \"monfichier.h\" : inclure un header local",
                  "#include <iostream> : inclure une bibliothèque système",
                  "Compilation séparée puis linking"
                ]
              ),
              section(
                "Include guards",
                "Les guards évitent qu'un fichier soit inclus plusieurs fois.",
                [
                  "#ifndef NOM_H : si pas déjà défini",
                  "#define NOM_H : le définir",
                  "#endif : fin du guard",
                  "Alternative moderne : #pragma once",
                  "Évite les erreurs de définition multiple"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `// ===== Fichier: math_utils.h =====
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

// Déclarations (prototypes)
int addition(int a, int b);
int multiplication(int a, int b);
double puissance(double base, int exposant);

#endif

// ===== Fichier: math_utils.cpp =====
#include "math_utils.h"

// Implémentations
int addition(int a, int b) {
    return a + b;
}

int multiplication(int a, int b) {
    return a * b;
}

double puissance(double base, int exposant) {
    double resultat = 1.0;
    for (int i = 0; i < exposant; i++) {
        resultat *= base;
    }
    return resultat;
}

// ===== Fichier: main.cpp =====
#include <iostream>
#include "math_utils.h"

int main() {
    std::cout << "5 + 3 = " << addition(5, 3) << std::endl;
    std::cout << "4 * 7 = " << multiplication(4, 7) << std::endl;
    std::cout << "2^8 = " << puissance(2, 8) << std::endl;
    
    return 0;
}

// Compilation:
// g++ -c math_utils.cpp -o math_utils.o
// g++ -c main.cpp -o main.o
// g++ math_utils.o main.o -o programme`
            ),
            task: "Créez un module geometrie.h/.cpp avec des fonctions pour calculer aire/périmètre de cercle et rectangle. Utilisez-le dans main.cpp.",
            takeaway:
              "Programmation modulaire : séparez déclarations (.h) et implémentations (.cpp). Include guards évitent inclusions multiples.",
            quiz: quiz(
              "À quoi servent les include guards ?",
              ["Accélérer la compilation", "Éviter inclusions multiples", "Protéger le code"],
              1,
              "Les guards (#ifndef/#define/#endif) évitent qu'un fichier soit inclus plusieurs fois."
            ),
            link: docs + "preprocessor/include"
          })
        ]
      },
      {
        id: "erreurs",
        title: "Gestion des erreurs",
        description: "try, catch, throw pour gérer les exceptions",
        lessons: [
          lesson({
            id: "try-catch",
            title: "Exceptions : try, catch et throw",
            minutes: 25,
            summary:
              "Les exceptions permettent de gérer les erreurs sans interrompre brutalement le programme. try entoure le code à risque, throw lance une exception, catch la capture.",
            sections: [
              section(
                "Syntaxe try/catch",
                "Entourer le code susceptible de provoquer une erreur avec try. Capturer l'erreur avec catch.",
                [
                  "try { code à risque }",
                  "catch (type_exception e) { gestion }",
                  "throw : lancer une exception",
                  "Plusieurs catch possibles pour différents types",
                  "catch(...) : capture toutes les exceptions"
                ]
              ),
              section(
                "Types d'exceptions",
                "C++ offre des exceptions standard et permet de créer les siennes.",
                [
                  "std::exception : classe de base",
                  "std::runtime_error : erreur d'exécution",
                  "std::logic_error : erreur de logique",
                  "std::invalid_argument : argument invalide",
                  "std::out_of_range : hors limites",
                  "Créer ses propres exceptions avec classes"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <stdexcept>

// Fonction qui peut lancer une exception
double diviser(double a, double b) {
    if (b == 0) {
        throw std::runtime_error("Division par zéro impossible !");
    }
    return a / b;
}

int main() {
    // Exemple 1 : Division sécurisée
    std::cout << "=== Division sécurisée ===" << std::endl;
    try {
        double resultat = diviser(10, 2);
        std::cout << "10 / 2 = " << resultat << std::endl;
        
        resultat = diviser(10, 0); // Va lancer une exception
        std::cout << "Cette ligne ne s'exécutera pas" << std::endl;
        
    } catch (std::runtime_error& e) {
        std::cerr << "Erreur capturée: " << e.what() << std::endl;
    }
    
    std::cout << "\\nLe programme continue..." << std::endl;
    
    // Exemple 2 : Plusieurs types d'exceptions
    try {
        int age;
        std::cout << "\\nEntrez votre âge: ";
        std::cin >> age;
        
        if (age < 0) {
            throw std::invalid_argument("L'âge ne peut pas être négatif");
        }
        if (age > 150) {
            throw std::out_of_range("L'âge est irréaliste");
        }
        
        std::cout << "Âge valide: " << age << " ans" << std::endl;
        
    } catch (std::invalid_argument& e) {
        std::cerr << "Argument invalide: " << e.what() << std::endl;
    } catch (std::out_of_range& e) {
        std::cerr << "Hors limites: " << e.what() << std::endl;
    } catch (...) {
        std::cerr << "Erreur inconnue" << std::endl;
    }
    
    return 0;
}`
            ),
            task: "Créez une fonction calculerRacine(double n) qui lance une exception si n < 0. Testez avec try/catch.",
            takeaway:
              "Exceptions pour gérer les erreurs proprement. try entoure le code à risque, throw lance l'exception, catch la capture.",
            quiz: quiz(
              "Que fait throw ?",
              ["Capture une erreur", "Lance une exception", "Arrête le programme"],
              1,
              "throw lance (déclenche) une exception qui sera capturée par catch."
            ),
            link: docs + "language/exceptions"
          })
        ]
      },
      {
        id: "enumerations",
        title: "Énumérations",
        description: "enum et enum class pour définir des constantes nommées",
        lessons: [
          lesson({
            id: "enum",
            title: "Énumérations : enum et enum class",
            minutes: 20,
            summary:
              "Les énumérations définissent un ensemble de constantes nommées. enum classique ou enum class (C++11, plus sûr). Améliore la lisibilité du code.",
            sections: [
              section(
                "enum classique",
                "enum définit un type avec des valeurs nommées. Par défaut, commence à 0.",
                [
                  "enum Nom { VAL1, VAL2, VAL3 };",
                  "Valeurs par défaut : 0, 1, 2...",
                  "Valeurs personnalisées possibles",
                  "Convertible en int automatiquement",
                  "Problème : pollution du namespace"
                ]
              ),
              section(
                "enum class (C++11)",
                "enum class est plus sûr : pas de conversion implicite en int, pas de pollution du namespace.",
                [
                  "enum class Nom { VAL1, VAL2, VAL3 };",
                  "Utilisation : Nom::VAL1",
                  "Pas de conversion automatique en int",
                  "Plus sûr et recommandé",
                  "Type sous-jacent spécifiable : enum class Nom : char"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>

// enum classique
enum Jour {
    LUNDI,       // 0
    MARDI,       // 1
    MERCREDI,    // 2
    JEUDI,       // 3
    VENDREDI,    // 4
    SAMEDI,      // 5
    DIMANCHE     // 6
};

// enum avec valeurs personnalisées
enum Mois {
    JANVIER = 1,
    FEVRIER = 2,
    MARS = 3,
    // ... etc
    DECEMBRE = 12
};

// enum class (C++11, recommandé)
enum class Couleur {
    ROUGE,
    VERT,
    BLEU,
    JAUNE
};

enum class Statut {
    ACTIF,
    INACTIF,
    EN_ATTENTE
};

int main() {
    // Utilisation enum classique
    Jour aujourd_hui = MERCREDI;
    
    std::cout << "=== Enum classique ===" << std::endl;
    std::cout << "Aujourd'hui (valeur numérique): " << aujourd_hui << std::endl;
    
    if (aujourd_hui == MERCREDI) {
        std::cout << "C'est mercredi !" << std::endl;
    }
    
    // Utilisation enum class
    Couleur maCouleur = Couleur::ROUGE;
    Statut monStatut = Statut::ACTIF;
    
    std::cout << "\\n=== Enum class ===" << std::endl;
    
    if (maCouleur == Couleur::ROUGE) {
        std::cout << "La couleur est rouge" << std::endl;
    }
    
    // Conversion explicite nécessaire pour afficher la valeur
    std::cout << "Couleur (valeur): " << static_cast<int>(maCouleur) << std::endl;
    
    // Switch avec enum
    switch (monStatut) {
        case Statut::ACTIF:
            std::cout << "Statut: Actif" << std::endl;
            break;
        case Statut::INACTIF:
            std::cout << "Statut: Inactif" << std::endl;
            break;
        case Statut::EN_ATTENTE:
            std::cout << "Statut: En attente" << std::endl;
            break;
    }
    
    return 0;
}`
            ),
            task: "Créez enum class NiveauDifficulte { FACILE, MOYEN, DIFFICILE, EXPERT }. Écrivez une fonction qui affiche un message selon le niveau.",
            takeaway:
              "Énumérations pour constantes nommées. enum classique ou enum class (recommandé, plus sûr). Améliore la lisibilité.",
            quiz: quiz(
              "Quelle est la différence entre enum et enum class ?",
              ["Aucune", "enum class est plus sûr (pas de conversion implicite)", "enum class est plus rapide"],
              1,
              "enum class évite la pollution du namespace et les conversions implicites dangereuses."
            ),
            link: docs + "language/enum"
          })
        ]
      },
      {
        id: "exercice-debutant",
        title: "Exercice final niveau débutant",
        description: "Projet complet utilisant tous les concepts",
        lessons: [
          lesson({
            id: "projet-calculatrice",
            title: "Mini-projet : Calculatrice interactive en console",
            minutes: 90,
            summary:
              "Créez une calculatrice complète en console avec menu, gestion d'erreurs, historique des opérations. Utilise tous les concepts : variables, conditions, boucles, fonctions, enum, try/catch.",
            sections: [
              section(
                "Objectifs du projet",
                "Application console interactive qui utilise tous les concepts du niveau débutant.",
                [
                  "Menu interactif avec switch",
                  "Opérations : +, -, *, /, puissance, racine",
                  "Gestion des erreurs (division par 0, racine négative)",
                  "Historique des 10 dernières opérations",
                  "enum pour les types d'opérations",
                  "Fonctions modulaires pour chaque opération",
                  "Boucle principale jusqu'à quitter"
                ]
              ),
              section(
                "Structure recommandée",
                "Organisez le code avec des fonctions et énumérations claires.",
                [
                  "enum class Operation { ADD, SUB, MUL, DIV, POW, SQRT, QUIT }",
                  "Fonction afficherMenu()",
                  "Fonction pour chaque opération",
                  "Fonction ajouterHistorique()",
                  "Fonction afficherHistorique()",
                  "Boucle principale avec switch",
                  "Gestion d'erreurs avec try/catch"
                ]
              ),
              section(
                "Concepts utilisés",
                "Ce projet combine tous les éléments du niveau débutant.",
                [
                  "✓ Variables et types (int, double, string)",
                  "✓ Opérateurs arithmétiques",
                  "✓ Conditions (if/else, switch)",
                  "✓ Boucles (while pour menu principal)",
                  "✓ Fonctions (modulaires et réutilisables)",
                  "✓ Enum class pour les opérations",
                  "✓ Try/catch pour gestion d'erreurs",
                  "✓ Affichage formaté avec cout"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <cmath>
#include <vector>
#include <string>
#include <stdexcept>

// TODO: Créez votre calculatrice complète
// Squelette fourni ci-dessous

enum class Operation {
    ADDITION = 1,
    SOUSTRACTION,
    MULTIPLICATION,
    DIVISION,
    PUISSANCE,
    RACINE,
    HISTORIQUE,
    QUITTER
};

std::vector<std::string> historique;

void afficherMenu() {
    std::cout << "\\n=== Calculatrice DevAfrica ===" << std::endl;
    std::cout << "1. Addition" << std::endl;
    std::cout << "2. Soustraction" << std::endl;
    std::cout << "3. Multiplication" << std::endl;
    std::cout << "4. Division" << std::endl;
    std::cout << "5. Puissance" << std::endl;
    std::cout << "6. Racine carrée" << std::endl;
    std::cout << "7. Afficher historique" << std::endl;
    std::cout << "8. Quitter" << std::endl;
    std::cout << "Choix: ";
}

// TODO: Implémentez les fonctions d'opération
double addition(double a, double b) {
    return a + b;
}

// TODO: Autres opérations...

void ajouterHistorique(const std::string& operation) {
    if (historique.size() >= 10) {
        historique.erase(historique.begin());
    }
    historique.push_back(operation);
}

void afficherHistorique() {
    std::cout << "\\n=== Historique ===" << std::endl;
    if (historique.empty()) {
        std::cout << "Aucune opération" << std::endl;
    } else {
        for (size_t i = 0; i < historique.size(); i++) {
            std::cout << (i+1) << ". " << historique[i] << std::endl;
        }
    }
}

int main() {
    int choix;
    bool continuer = true;
    
    std::cout << "Bienvenue dans la Calculatrice C++ !" << std::endl;
    
    while (continuer) {
        afficherMenu();
        std::cin >> choix;
        
        // TODO: Implémentez le switch avec toutes les opérations
        // TODO: Utilisez try/catch pour gérer les erreurs
        // TODO: Ajoutez chaque opération à l'historique
        
        switch (static_cast<Operation>(choix)) {
            case Operation::ADDITION:
                // TODO
                break;
            // TODO: Autres cas...
            case Operation::QUITTER:
                continuer = false;
                std::cout << "Au revoir !" << std::endl;
                break;
            default:
                std::cout << "Choix invalide !" << std::endl;
        }
    }
    
    return 0;
}`
            ),
            task: "Implémentez la calculatrice complète avec toutes les opérations, gestion d'erreurs, historique. Testez toutes les fonctionnalités.",
            takeaway:
              "Ce projet valide votre niveau débutant en combinant variables, conditions, boucles, fonctions, enum, gestion d'erreurs. Bravo !",
            quiz: quiz(
              "Pourquoi utiliser enum class pour les opérations ?",
              ["Plus rapide", "Meilleure lisibilité et sécurité du code", "Obligatoire"],
              1,
              "enum class rend le code plus lisible et évite les erreurs de conversion."
            ),
            link: docs
          })
        ]
      }
    ]
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "POO avancée, structures de données et pointeurs",
    color: levelColors[1],
    objective:
      "Maîtriser la POO en C++, comprendre l'héritage multiple, manipuler les structures de données STL, utiliser les templates, gérer dates/heures et maîtriser les pointeurs avec surcharge d'opérateurs.",
    prerequisites:
      "Avoir terminé le niveau débutant. Maîtriser les fonctions, conditions, boucles et énumérations.",
    outcomes: [
      "Créer des classes avec attributs et méthodes (différences avec Java)",
      "Utiliser l'héritage simple et multiple, polymorphisme, encapsulation",
      "Manipuler les conteneurs STL (vector, list, set, map)",
      "Créer des templates génériques",
      "Gérer dates et heures avec chrono",
      "Maîtriser les pointeurs et la surcharge d'opérateurs"
    ],
    projects: [],
    chapters: [
      {
        id: "poo",
        title: "Programmation Orientée Objet",
        description: "Classes, attributs, méthodes et différences avec Java",
        lessons: [
          lesson({
            id: "classes-cpp",
            title: "Classes et objets en C++",
            minutes: 35,
            summary:
              "Une classe définit un type avec des données (attributs) et des comportements (méthodes). Les objets sont des instances. En C++, contrairement à Java, on peut créer des objets sur la pile ou le tas.",
            sections: [
              section(
                "Définir une classe",
                "class définit un nouveau type. public rend les membres accessibles, private les cache.",
                [
                  "class NomClasse { public: membres; private: membres; };",
                  "Attributs : variables membres",
                  "Méthodes : fonctions membres",
                  "public : accessible de partout",
                  "private : accessible seulement dans la classe",
                  "protected : accessible dans classe et dérivées",
                  "; obligatoire après la classe !",
                  "⚠️ Java : tout dans des fichiers .java, C++ : .h et .cpp"
                ]
              ),
              section(
                "Constructeurs et destructeurs",
                "Le constructeur initialise, le destructeur nettoie. C++ a des destructeurs explicites, pas Java !",
                [
                  "Constructeur : même nom que la classe",
                  "Pas de type de retour pour constructeur",
                  "Destructeur : ~NomClasse()",
                  "Liste d'initialisation : Constructeur() : attr(val) {}",
                  "Java : finalizer (déprécié), C++ : destructeur fiable",
                  "C++ : gestion manuelle mémoire, Java : Garbage Collector"
                ]
              ),
              section(
                "Objets sur pile vs tas",
                "C++ permet objets sur pile (auto) ou tas (new). Java : toujours sur tas.",
                [
                  "Pile : Personne p(\"Alice\", 25); // Automatique",
                  "Tas : Personne* p = new Personne(\"Bob\", 30);",
                  "Pile : destruction automatique en fin de scope",
                  "Tas : delete p; obligatoire !",
                  "Java : toujours new, GC s'occupe de tout",
                  "C++ : plus de contrôle, plus de responsabilité"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <string>

class Personne {
private:
    std::string nom;
    int age;
    
public:
    // Constructeur avec liste d'initialisation
    Personne(std::string n, int a) : nom(n), age(a) {
        std::cout << "Personne créée: " << nom << std::endl;
    }
    
    // Destructeur (appelé automatiquement)
    ~Personne() {
        std::cout << "Personne détruite: " << nom << std::endl;
    }
    
    // Getters
    std::string getNom() const {
        return nom;
    }
    
    int getAge() const {
        return age;
    }
    
    // Setters
    void setAge(int a) {
        if (a >= 0 && a <= 150) {
            age = a;
        }
    }
    
    // Méthode
    void sePresenter() const {
        std::cout << "Je suis " << nom << ", j'ai " << age << " ans." << std::endl;
    }
};

int main() {
    std::cout << "=== Objets sur la pile ===" << std::endl;
    Personne alice("Alice", 25);  // Sur la pile (automatique)
    alice.sePresenter();
    
    Personne bob("Bob", 30);
    bob.sePresenter();
    // Destructeurs appelés automatiquement en fin de scope
    
    std::cout << "\\n=== Objets sur le tas ===" << std::endl;
    Personne* charlie = new Personne("Charlie", 22);  // Sur le tas
    charlie->sePresenter();  // -> pour pointeurs
    
    delete charlie;  // delete obligatoire !
    
    std::cout << "\\nFin du programme" << std::endl;
    return 0;
    // alice et bob détruits ici automatiquement
}

// DIFFÉRENCES CLÉS AVEC JAVA:
// - C++ : objets sur pile OU tas, Java : toujours tas
// - C++ : destructeur explicite, Java : finalizer (déprécié)
// - C++ : delete manuel, Java : Garbage Collector
// - C++ : . pour pile, -> pour tas, Java : toujours .`
            ),
            task: "Créez une classe Voiture avec marque, modèle, année. Créez 2 voitures sur la pile et 1 sur le tas. Affichez leurs infos.",
            takeaway:
              "Classes en C++ : attributs privés, méthodes publiques. Objets sur pile (auto) ou tas (new/delete). Java : toujours tas + GC.",
            quiz: quiz(
              "Quelle est la différence majeure entre C++ et Java pour les objets ?",
              ["Syntaxe différente", "C++ : pile OU tas, Java : toujours tas", "C++ plus lent"],
              1,
              "C++ permet objets sur pile (destruction auto) ou tas (new/delete). Java : toujours tas avec GC."
            ),
            link: docs + "language/classes"
          }),
          lesson({
            id: "heritage-cpp",
            title: "Héritage en C++ (simple et multiple)",
            minutes: 40,
            summary:
              "L'héritage permet à une classe de hériter d'une autre. C++ supporte l'héritage multiple (plusieurs classes parentes), contrairement à Java qui n'accepte qu'un seul parent.",
            sections: [
              section(
                "Héritage simple",
                "class Derivee : public Base {} hérite de Base. public, protected ou private contrôlent la visibilité.",
                [
                  "class Enfant : public Parent { };",
                  "Enfant hérite attributs et méthodes de Parent",
                  "public : le plus courant (is-a relationship)",
                  "protected : membres protégés restent protégés",
                  "private : tous membres deviennent privés",
                  "Constructeur parent appelé avant enfant",
                  "Destructeur enfant appelé avant parent"
                ]
              ),
              section(
                "Héritage multiple",
                "C++ autorise plusieurs classes parentes. Java ne le permet pas (interfaces à la place).",
                [
                  "class Enfant : public Parent1, public Parent2 { };",
                  "Hérite de plusieurs classes simultanément",
                  "⚠️ Diamant problem : résolu avec virtual",
                  "Java : une seule classe parent, interfaces multiples",
                  "C++ : plus flexible mais plus complexe",
                  "Utiliser avec précaution"
                ]
              ),
              section(
                "Différences avec Java",
                "Java et C++ gèrent l'héritage différemment.",
                [
                  "Java : extends pour classe, implements pour interface",
                  "C++ : : public pour tout",
                  "Java : pas d'héritage multiple de classes",
                  "C++ : héritage multiple possible",
                  "Java : super() pour appeler parent",
                  "C++ : Parent() dans liste initialisation",
                  "C++ : virtual pour polymorphisme dynamique"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <string>

// Classe de base
class Animal {
protected:
    std::string nom;
    int age;
    
public:
    Animal(std::string n, int a) : nom(n), age(a) {
        std::cout << "Animal créé: " << nom << std::endl;
    }
    
    virtual ~Animal() {
        std::cout << "Animal détruit: " << nom << std::endl;
    }
    
    void manger() {
        std::cout << nom << " mange." << std::endl;
    }
    
    virtual void faireDuBruit() {
        std::cout << nom << " fait un bruit." << std::endl;
    }
};

// Héritage simple
class Chien : public Animal {
private:
    std::string race;
    
public:
    Chien(std::string n, int a, std::string r) 
        : Animal(n, a), race(r) {
        std::cout << "Chien créé: " << nom << " (" << race << ")" << std::endl;
    }
    
    ~Chien() {
        std::cout << "Chien détruit: " << nom << std::endl;
    }
    
    void faireDuBruit() override {
        std::cout << nom << " aboie: Woof woof!" << std::endl;
    }
    
    void jouer() {
        std::cout << nom << " joue avec une balle." << std::endl;
    }
};

class Chat : public Animal {
public:
    Chat(std::string n, int a) : Animal(n, a) {}
    
    void faireDuBruit() override {
        std::cout << nom << " miaule: Miaou!" << std::endl;
    }
};

// Classes pour héritage multiple
class Volant {
public:
    virtual void voler() {
        std::cout << "Je vole dans le ciel." << std::endl;
    }
};

class Nageur {
public:
    virtual void nager() {
        std::cout << "Je nage dans l'eau." << std::endl;
    }
};

// Héritage multiple : hérite de Animal ET Volant
class Oiseau : public Animal, public Volant {
public:
    Oiseau(std::string n, int a) : Animal(n, a) {}
    
    void faireDuBruit() override {
        std::cout << nom << " chante: Cui cui!" << std::endl;
    }
};

// Héritage multiple : hérite de Animal, Volant ET Nageur
class Canard : public Animal, public Volant, public Nageur {
public:
    Canard(std::string n, int a) : Animal(n, a) {}
    
    void faireDuBruit() override {
        std::cout << nom << " fait: Coin coin!" << std::endl;
    }
};

int main() {
    std::cout << "=== Héritage simple ===" << std::endl;
    Chien rex("Rex", 5, "Berger Allemand");
    rex.manger();         // Hérité de Animal
    rex.faireDuBruit();   // Redéfini dans Chien
    rex.jouer();          // Propre à Chien
    
    std::cout << "\\n=== Polymorphisme ===" << std::endl;
    Chat felix("Felix", 3);
    felix.manger();
    felix.faireDuBruit();
    
    std::cout << "\\n=== Héritage multiple ===" << std::endl;
    Oiseau piou("Piou", 1);
    piou.manger();        // De Animal
    piou.faireDuBruit();  // Redéfini
    piou.voler();         // De Volant
    
    std::cout << "\\n=== Héritage multiple avancé ===" << std::endl;
    Canard donald("Donald", 2);
    donald.manger();      // De Animal
    donald.faireDuBruit();// Redéfini
    donald.voler();       // De Volant
    donald.nager();       // De Nageur
    
    std::cout << "\\nFin du programme" << std::endl;
    return 0;
}

// JAVA vs C++:
// Java: class Chien extends Animal implements Interface1, Interface2
// C++:  class Chien : public Animal, public Class1, public Class2
// Java: pas d'héritage multiple de classes
// C++:  héritage multiple possible (diamant problem à gérer)`
            ),
            task: "Créez une hiérarchie : Vehicule (parent), puis Voiture et Moto qui héritent. Ajoutez une classe Amphibie qui hérite de Vehicule et d'une classe Flottant.",
            takeaway:
              "C++ : héritage simple et multiple. Java : seulement simple (interfaces pour multiple). override pour redéfinir. virtual essentiel pour polymorphisme.",
            quiz: quiz(
              "Quelle différence entre Java et C++ pour l'héritage ?",
              ["Aucune", "C++ permet héritage multiple, pas Java", "Java plus rapide"],
              1,
              "C++ permet d'hériter de plusieurs classes parentes. Java : une seule classe parent (interfaces pour compenser)."
            ),
            link: docs + "language/derived_class"
          }),
          lesson({
            id: "polymorphisme-encapsulation",
            title: "Polymorphisme et encapsulation",
            minutes: 30,
            summary:
              "Polymorphisme : traiter objets dérivés comme parent. virtual permet liaison dynamique. Encapsulation : cacher détails via private/protected, exposer via public.",
            sections: [
              section(
                "Polymorphisme en C++",
                "virtual permet au bon méthode d'être appelée selon le type réel de l'objet.",
                [
                  "virtual dans la classe parent",
                  "override dans la classe enfant",
                  "Pointeur/référence parent vers objet enfant",
                  "Liaison dynamique au runtime",
                  "Destructeur virtuel obligatoire !",
                  "Java : polymorphisme par défaut, C++ : explicite",
                  "pure virtual : virtual void f() = 0; (classe abstraite)"
                ]
              ),
              section(
                "Encapsulation",
                "Cacher les détails d'implémentation, exposer seulement l'interface.",
                [
                  "private : caché à l'extérieur",
                  "protected : accessible aux enfants",
                  "public : accessible partout",
                  "Getters/setters pour contrôle d'accès",
                  "Principe : cacher le 'comment', montrer le 'quoi'",
                  "Java et C++ : même concept, syntaxe similaire"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <string>
#include <vector>

// Classe abstraite (pure virtual)
class Forme {
protected:
    std::string couleur;
    
public:
    Forme(std::string c) : couleur(c) {}
    
    // Destructeur virtuel OBLIGATOIRE
    virtual ~Forme() {
        std::cout << "Forme détruite" << std::endl;
    }
    
    // Méthode pure virtual = classe abstraite
    virtual double aire() const = 0;
    virtual double perimetre() const = 0;
    
    // Méthode virtuelle normale
    virtual void afficher() const {
        std::cout << "Forme de couleur: " << couleur << std::endl;
    }
    
    // Getter
    std::string getCouleur() const {
        return couleur;
    }
};

class Rectangle : public Forme {
private:
    double largeur;
    double hauteur;
    
public:
    Rectangle(std::string c, double l, double h) 
        : Forme(c), largeur(l), hauteur(h) {}
    
    ~Rectangle() {
        std::cout << "Rectangle détruit" << std::endl;
    }
    
    double aire() const override {
        return largeur * hauteur;
    }
    
    double perimetre() const override {
        return 2 * (largeur + hauteur);
    }
    
    void afficher() const override {
        std::cout << "Rectangle " << couleur 
                  << " (" << largeur << "x" << hauteur << ")" << std::endl;
    }
};

class Cercle : public Forme {
private:
    double rayon;
    
public:
    Cercle(std::string c, double r) 
        : Forme(c), rayon(r) {}
    
    ~Cercle() {
        std::cout << "Cercle détruit" << std::endl;
    }
    
    double aire() const override {
        return 3.14159 * rayon * rayon;
    }
    
    double perimetre() const override {
        return 2 * 3.14159 * rayon;
    }
    
    void afficher() const override {
        std::cout << "Cercle " << couleur 
                  << " (rayon: " << rayon << ")" << std::endl;
    }
};

// Fonction polymorphique
void afficherInfos(const Forme& forme) {
    forme.afficher();
    std::cout << "  Aire: " << forme.aire() << std::endl;
    std::cout << "  Périmètre: " << forme.perimetre() << std::endl;
}

int main() {
    std::cout << "=== Polymorphisme ===" << std::endl;
    
    Rectangle rect("rouge", 10, 5);
    Cercle circ("bleu", 7);
    
    std::cout << "\\nDirect:" << std::endl;
    afficherInfos(rect);
    std::cout << std::endl;
    afficherInfos(circ);
    
    // Collection polymorphique
    std::cout << "\\n=== Collection polymorphique ===" << std::endl;
    std::vector<Forme*> formes;
    formes.push_back(new Rectangle("vert", 8, 4));
    formes.push_back(new Cercle("jaune", 5));
    formes.push_back(new Rectangle("violet", 6, 6));
    
    double aireTotal = 0;
    for (const auto& forme : formes) {
        forme->afficher();
        aireTotal += forme->aire();
    }
    
    std::cout << "\\nAire totale: " << aireTotal << std::endl;
    
    // Nettoyage (destructeurs virtuels importants!)
    for (auto& forme : formes) {
        delete forme;
    }
    
    return 0;
}`
            ),
            task: "Créez classe abstraite Employe avec virtual salaire(). Créez CDI (salaire fixe) et Freelance (taux horaire * heures). Affichez salaires via polymorphisme.",
            takeaway:
              "virtual + override = polymorphisme. Pure virtual (= 0) = classe abstraite. Destructeur virtual obligatoire. Encapsulation = private + getters/setters.",
            quiz: quiz(
              "Pourquoi le destructeur doit-il être virtual ?",
              ["Performance", "Pour appeler le bon destructeur via pointeur parent", "Obligation C++"],
              1,
              "Sans virtual, seul le destructeur parent serait appelé, causant fuites mémoire."
            ),
            link: docs + "language/virtual"
          })
        ]
      },
      {
        id: "stl-containers",
        title: "Conteneurs STL",
        description: "vector, list, set, map : structures de données",
        lessons: [
          lesson({
            id: "vector-list",
            title: "vector et list : tableaux et listes",
            minutes: 35,
            summary:
              "vector = tableau dynamique (accès rapide par index). list = liste doublement chaînée (insertion/suppression rapides). #include <vector> et <list>.",
            sections: [
              section(
                "std::vector",
                "Tableau dynamique qui s'agrandit automatiquement. Équivalent de ArrayList en Java.",
                [
                  "#include <vector>",
                  "std::vector<Type> nom;",
                  ".push_back(elem) : ajouter à la fin",
                  ".pop_back() : retirer le dernier",
                  "[index] ou .at(index) : accès par index",
                  ".size() : nombre d'éléments",
                  ".empty() : vide ou non",
                  ".clear() : vider",
                  "Accès O(1), insertion fin O(1) amorti"
                ]
              ),
              section(
                "std::list",
                "Liste doublement chaînée. Insertion/suppression rapides partout.",
                [
                  "#include <list>",
                  "std::list<Type> nom;",
                  ".push_back(elem), .push_front(elem)",
                  ".pop_back(), .pop_front()",
                  "Pas d'accès par index []",
                  "Itérateurs pour parcourir",
                  "Insertion/suppression O(1) n'importe où",
                  "Pas de LinkedList en C++ std, list est doublement chaînée"
                ]
              ),
              section(
                "Parcours avec itérateurs",
                "Les itérateurs sont des pointeurs généralisés pour parcourir les conteneurs.",
                [
                  "for (auto it = v.begin(); it != v.end(); ++it)",
                  "C++11 : for (auto& elem : v) {}",
                  ".begin() : début",
                  ".end() : après la fin",
                  "*it : déréférencer l'itérateur",
                  "auto : type déduit automatiquement"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <vector>
#include <list>
#include <string>

int main() {
    std::cout << "=== std::vector ===" << std::endl;
    std::vector<int> nombres;
    
    // Ajout d'éléments
    nombres.push_back(10);
    nombres.push_back(20);
    nombres.push_back(30);
    nombres.push_back(40);
    
    std::cout << "Taille: " << nombres.size() << std::endl;
    
    // Accès par index
    std::cout << "Premier élément: " << nombres[0] << std::endl;
    std::cout << "Dernier élément: " << nombres[nombres.size()-1] << std::endl;
    
    // Parcours classique
    std::cout << "Tous les éléments: ";
    for (size_t i = 0; i < nombres.size(); i++) {
        std::cout << nombres[i] << " ";
    }
    std::cout << std::endl;
    
    // Parcours avec range-based for (C++11)
    std::cout << "Avec range-for: ";
    for (auto nombre : nombres) {
        std::cout << nombre << " ";
    }
    std::cout << std::endl;
    
    // vector de strings
    std::vector<std::string> villes = {"Dakar", "Abidjan", "Lagos", "Nairobi"};
    std::cout << "\\nVilles:" << std::endl;
    for (const auto& ville : villes) {
        std::cout << "  - " << ville << std::endl;
    }
    
    std::cout << "\\n=== std::list ===" << std::endl;
    std::list<int> liste;
    
    // Ajout début et fin
    liste.push_back(100);
    liste.push_back(200);
    liste.push_front(50);
    liste.push_front(25);
    
    std::cout << "Liste: ";
    for (auto elem : liste) {
        std::cout << elem << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`
            ),
            task: "Créez un vector de vos 5 films préférés. Affichez-les, ajoutez-en 2, retirez le dernier. Créez une list de nombres impairs de 1 à 19.",
            takeaway:
              "vector = tableau dynamique (accès [index] rapide). list = liste chaînée (insertion partout rapide). for (auto& elem : conteneur) pour parcourir.",
            quiz: quiz(
              "Quelle différence entre vector et list ?",
              ["Aucune", "vector : accès index rapide, list : insertion rapide", "list plus rapide"],
              1,
              "vector optimisé pour accès par index. list optimisée pour insertion/suppression."
            ),
            link: docs + "container/vector"
          }),
          lesson({
            id: "set-map",
            title: "set et map : ensembles et dictionnaires",
            minutes: 35,
            summary:
              "set = ensemble unique trié. map = dictionnaire clé->valeur. Basés sur arbres équilibrés. Équivalents : TreeSet/TreeMap (Java), dict (Python).",
            sections: [
              section(
                "std::set",
                "Ensemble d'éléments uniques, automatiquement triés.",
                [
                  "#include <set>",
                  "std::set<Type> nom;",
                  ".insert(elem) : ajouter",
                  ".erase(elem) : retirer",
                  ".find(elem) : chercher (retourne itérateur)",
                  ".count(elem) : 0 ou 1 (présence)",
                  "Éléments triés automatiquement",
                  "Doublons ignorés",
                  "Opérations O(log n)"
                ]
              ),
              section(
                "std::map",
                "Dictionnaire clé->valeur. Clés uniques et triées.",
                [
                  "#include <map>",
                  "std::map<TypeClé, TypeValeur> nom;",
                  "map[clé] = valeur : insérer/modifier",
                  ".find(clé) : chercher",
                  ".erase(clé) : retirer",
                  ".count(clé) : présence (0 ou 1)",
                  "Itération : for (auto& [clé, valeur] : map)",
                  "Clés triées automatiquement"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <set>
#include <map>
#include <string>

int main() {
    std::cout << "=== std::set ===" << std::endl;
    std::set<int> nombres;
    
    nombres.insert(30);
    nombres.insert(10);
    nombres.insert(20);
    nombres.insert(10);  // Doublon ignoré
    
    std::cout << "Set (trié): ";
    for (auto n : nombres) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    
    std::cout << "\\n=== std::map ===" << std::endl;
    std::map<std::string, int> ages;
    
    ages["Alice"] = 25;
    ages["Bob"] = 30;
    ages["Charlie"] = 22;
    
    std::cout << "Âges:" << std::endl;
    for (const auto& [nom, age] : ages) {
        std::cout << "  " << nom << ": " << age << " ans" << std::endl;
    }
    
    return 0;
}`
            ),
            task: "Créez un map<string, double> pour stocker des produits et leurs prix. Créez set de vos hobbies.",
            takeaway:
              "set = ensemble unique trié. map = dictionnaire clé->valeur trié. Java TreeSet/TreeMap équivalents.",
            quiz: quiz(
              "Que se passe-t-il si on insert un doublon dans set ?",
              ["Erreur", "Doublon ignoré", "Doublon ajouté"],
              1,
              "set ignore automatiquement les doublons, garde éléments uniques."
            ),
            link: docs + "container/map"
          })
        ]
      },
      {
        id: "templates",
        title: "Templates (généricité)",
        description: "Fonctions et classes génériques",
        lessons: [
          lesson({
            id: "templates-cpp",
            title: "Templates : fonctions et classes génériques",
            minutes: 35,
            summary:
              "Templates permettent code générique fonctionnant avec plusieurs types. template<typename T> pour fonctions et classes. Équivalent des génériques Java (<T>).",
            sections: [
              section(
                "Templates de fonctions",
                "Créer une fonction qui fonctionne avec n'importe quel type.",
                [
                  "template<typename T>",
                  "T : paramètre de type",
                  "Compilation : code généré pour chaque type utilisé",
                  "Plus puissant que génériques Java"
                ]
              ),
              section(
                "Templates de classes",
                "Créer une classe générique.",
                [
                  "template<typename T> class MaClasse { };",
                  "Utilisée comme : MaClasse<int> obj;",
                  "std::vector, std::map sont des templates"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <string>

template<typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

template<typename T, typename U>
class Paire {
private:
    T premier;
    U second;
    
public:
    Paire(T p, U s) : premier(p), second(s) {}
    
    void afficher() const {
        std::cout << "(" << premier << ", " << second << ")" << std::endl;
    }
};

int main() {
    std::cout << "Max(10, 20) = " << maximum(10, 20) << std::endl;
    std::cout << "Max(5.5, 2.3) = " << maximum(5.5, 2.3) << std::endl;
    
    Paire<int, int> coords(10, 20);
    Paire<std::string, int> personne("Alice", 25);
    
    coords.afficher();
    personne.afficher();
    
    return 0;
}`
            ),
            task: "Créez template fonction min(). Créez template classe Trio<T, U, V> avec trois valeurs.",
            takeaway:
              "Templates = généricité en C++. template<typename T>. Équivalent Java : <T>. C++ plus puissant.",
            quiz: quiz(
              "À quoi sert template<typename T> ?",
              ["Décoration", "Créer fonctions/classes génériques", "Optimisation"],
              1,
              "template<typename T> permet code générique fonctionnant avec plusieurs types."
            ),
            link: docs + "language/templates"
          })
        ]
      },
      {
        id: "dates-heures",
        title: "Gestion dates et heures",
        description: "Bibliothèque chrono",
        lessons: [
          lesson({
            id: "chrono-cpp",
            title: "chrono : dates, heures et durées",
            minutes: 30,
            summary:
              "std::chrono (C++11) gère temps. system_clock pour horloge, steady_clock pour mesures, duration pour durées.",
            sections: [
              section(
                "Types chrono",
                "chrono fournit horloges et durées.",
                [
                  "#include <chrono>",
                  "system_clock : horloge système",
                  "steady_clock : mesures (ne recule jamais)",
                  "duration : durée",
                  "duration_cast pour convertir"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <chrono>
#include <thread>

using namespace std::chrono;

void travail() {
    long long somme = 0;
    for (long long i = 0; i < 100000000; i++) {
        somme += i;
    }
}

int main() {
    auto debut = steady_clock::now();
    
    travail();
    
    auto fin = steady_clock::now();
    auto duree = fin - debut;
    
    auto ms = duration_cast<milliseconds>(duree);
    std::cout << "Temps: " << ms.count() << " ms" << std::endl;
    
    std::cout << "Attente 2 sec..." << std::endl;
    std::this_thread::sleep_for(seconds(2));
    std::cout << "Terminé!" << std::endl;
    
    return 0;
}`
            ),
            task: "Créez un chronomètre mesurant le calcul de somme 1 à 1 milliard. Affichez en secondes et millisecondes.",
            takeaway:
              "chrono pour temps. steady_clock pour mesures, duration pour durées. duration_cast pour convertir.",
            quiz: quiz(
              "Quelle horloge pour mesurer performances ?",
              ["system_clock", "steady_clock", "time_clock"],
              1,
              "steady_clock est monotone (ne recule jamais), idéal pour mesures."
            ),
            link: docs + "chrono"
          })
        ]
      },
      {
        id: "pointeurs-operateurs",
        title: "Pointeurs et surcharge d'opérateurs",
        description: "Maîtriser pointeurs et personnaliser opérateurs",
        lessons: [
          lesson({
            id: "pointeurs-references",
            title: "Pointeurs et références",
            minutes: 40,
            summary:
              "Pointeur = adresse mémoire. * pour déréférencer, & pour adresse. Référence = alias. Java n'a pas de vrais pointeurs.",
            sections: [
              section(
                "Pointeurs",
                "Un pointeur stocke l'adresse mémoire d'une variable.",
                [
                  "Type* nom : déclarer pointeur",
                  "&variable : obtenir l'adresse",
                  "*pointeur : déréférencer",
                  "nullptr : pointeur nul (C++11)",
                  "new/delete : allocation dynamique",
                  "-> : accéder membre via pointeur"
                ]
              ),
              section(
                "Références",
                "Une référence est un alias.",
                [
                  "Type& nom = variable;",
                  "Doit être initialisée",
                  "Ne peut pas être réassignée",
                  "Pas de référence nulle",
                  "const& pour lecture seule"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>

void incrementerReference(int& x) {
    x++;
}

void incrementerPointeur(int* x) {
    if (x != nullptr) {
        (*x)++;
    }
}

int main() {
    int nombre = 42;
    int* ptr = &nombre;
    
    std::cout << "nombre = " << nombre << std::endl;
    std::cout << "Adresse = " << &nombre << std::endl;
    std::cout << "*ptr = " << *ptr << std::endl;
    
    *ptr = 100;
    std::cout << "Après *ptr = 100, nombre = " << nombre << std::endl;
    
    int valeur = 5;
    incrementerReference(valeur);
    std::cout << "Après référence: " << valeur << std::endl;
    
    incrementerPointeur(&valeur);
    std::cout << "Après pointeur: " << valeur << std::endl;
    
    return 0;
}`
            ),
            task: "Créez fonction echangerPointeur(int* a, int* b) qui échange valeurs. Testez.",
            takeaway:
              "Pointeur = adresse (* déréférence, & adresse). Référence = alias. new/delete pour allocation dynamique.",
            quiz: quiz(
              "Différence pointeur vs référence ?",
              ["Aucune", "Pointeur peut être null, référence non", "Référence plus rapide"],
              1,
              "Pointeur peut être null et réassigné. Référence est alias permanent."
            ),
            link: docs + "language/pointer"
          }),
          lesson({
            id: "surcharge-operateurs",
            title: "Surcharge d'opérateurs",
            minutes: 35,
            summary:
              "Surcharge = redéfinir opérateurs (+, -, ==, <<) pour classes. Rend code naturel. Java ne permet pas.",
            sections: [
              section(
                "Surcharger opérateurs",
                "Définir comment +, -, == fonctionnent avec vos classes.",
                [
                  "operator+ : addition",
                  "operator== : égalité",
                  "operator<< : affichage cout",
                  "return Type& pour chaînage",
                  "Java : pas de surcharge (sauf + String)"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>

class Vecteur2D {
private:
    double x, y;
    
public:
    Vecteur2D(double x = 0, double y = 0) : x(x), y(y) {}
    
    Vecteur2D operator+(const Vecteur2D& autre) const {
        return Vecteur2D(x + autre.x, y + autre.y);
    }
    
    bool operator==(const Vecteur2D& autre) const {
        return (x == autre.x) && (y == autre.y);
    }
    
    friend std::ostream& operator<<(std::ostream& os, const Vecteur2D& v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }
};

int main() {
    Vecteur2D v1(3, 4);
    Vecteur2D v2(1, 2);
    
    std::cout << "v1 = " << v1 << std::endl;
    std::cout << "v2 = " << v2 << std::endl;
    
    Vecteur2D v3 = v1 + v2;
    std::cout << "v1 + v2 = " << v3 << std::endl;
    
    if (v1 == v2) {
        std::cout << "Égaux" << std::endl;
    } else {
        std::cout << "Différents" << std::endl;
    }
    
    return 0;
}`
            ),
            task: "Créez classe Complexe (a + bi) avec surcharge +, -, *, == et <<. Testez.",
            takeaway:
              "Surcharge rend code naturel. operator+, operator==, operator<<. Java ne permet pas (sauf + String).",
            quiz: quiz(
              "Pourquoi surcharger operator<< ?",
              ["Performance", "Pour afficher avec cout", "Obligatoire"],
              1,
              "operator<< permet d'utiliser cout << monObjet de façon naturelle."
            ),
            link: docs + "language/operators"
          })
        ]
      },
      {
        id: "exercice-intermediaire",
        title: "Exercice final niveau intermédiaire",
        description: "Projet complet POO avec STL",
        lessons: [
          lesson({
            id: "projet-bibliotheque",
            title: "Mini-projet : Système de gestion de bibliothèque",
            minutes: 120,
            summary:
              "Système complet : classes Livre, Auteur, Membre avec héritage. POO, STL (vector, map), templates, chrono pour dates.",
            sections: [
              section(
                "Objectifs",
                "Application POO complète.",
                [
                  "Classes : Livre, Auteur, Membre, Emprunt",
                  "Héritage : Membre -> MembreRegulier, MembrePremium",
                  "Polymorphisme : frais de retard",
                  "STL : vector<Livre>, map<id, Membre>",
                  "Templates : recherche générique",
                  "Chrono : dates emprunt/retour"
                ]
              ),
              section(
                "Fonctionnalités",
                "Opérations à implémenter.",
                [
                  "✓ Ajouter/supprimer livres",
                  "✓ Enregistrer membres",
                  "✓ Emprunter/retourner livres",
                  "✓ Rechercher titre/auteur",
                  "✓ Lister disponibles/empruntés",
                  "✓ Calculer frais retard",
                  "✓ Statistiques"
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <memory>

class Auteur {
private:
    std::string nom;
    std::string pays;
    
public:
    Auteur(std::string n, std::string p) : nom(n), pays(p) {}
    std::string getNom() const { return nom; }
};

class Livre {
private:
    std::string isbn;
    std::string titre;
    Auteur auteur;
    bool disponible;
    
public:
    Livre(std::string i, std::string t, Auteur a)
        : isbn(i), titre(t), auteur(a), disponible(true) {}
    
    bool estDisponible() const { return disponible; }
    void setDisponible(bool d) { disponible = d; }
    std::string getTitre() const { return titre; }
};

class Membre {
protected:
    std::string id;
    std::string nom;
    
public:
    Membre(std::string i, std::string n) : id(i), nom(n) {}
    virtual ~Membre() {}
    virtual double calculerFraisRetard(int jours) const = 0;
};

class MembreRegulier : public Membre {
public:
    MembreRegulier(std::string i, std::string n) : Membre(i, n) {}
    double calculerFraisRetard(int jours) const override {
        return jours * 1.0;  // 1€/jour
    }
};

class MembrePremium : public Membre {
public:
    MembrePremium(std::string i, std::string n) : Membre(i, n) {}
    double calculerFraisRetard(int jours) const override {
        return jours * 0.5;  // 0.50€/jour
    }
};

class Bibliotheque {
private:
    std::vector<Livre> livres;
    std::map<std::string, std::unique_ptr<Membre>> membres;
    
public:
    void ajouterLivre(const Livre& livre) {
        livres.push_back(livre);
    }
    
    void ajouterMembre(std::unique_ptr<Membre> membre) {
        std::string id = membre->getId();
        membres[id] = std::move(membre);
    }
    
    // TODO: Implémenter toutes les fonctionnalités
};

int main() {
    Bibliotheque biblio;
    
    Auteur chinua("Chinua Achebe", "Nigeria");
    biblio.ajouterLivre(Livre("001", "Things Fall Apart", chinua));
    
    biblio.ajouterMembre(std::make_unique<MembreRegulier>("M001", "Alice"));
    biblio.ajouterMembre(std::make_unique<MembrePremium>("M002", "Bob"));
    
    // TODO: Menu interactif complet
    
    return 0;
}`
            ),
            task: "Implémentez le système complet : emprunts avec dates, recherche, frais retard, statistiques. Testez tous scénarios.",
            takeaway:
              "Projet valide niveau intermédiaire : POO, STL, templates, chrono. Félicitations !",
            quiz: quiz(
              "Pourquoi unique_ptr pour membres ?",
              ["Plus rapide", "Gestion auto mémoire, évite fuites", "Obligatoire"],
              1,
              "unique_ptr gère automatiquement delete, évite fuites. Moderne et sûr."
            ),
            link: docs
          })
        ]
      }
    ]
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "FLTK (GUI) + SQLite",
    color: levelColors[2],
    objective:
      "Créer des interfaces graphiques avec FLTK. Intégrer avec SQLite pour applications desktop professionnelles. Maîtriser widgets, événements et architecture propre.",
    prerequisites:
      "Avoir terminé les niveaux débutant et intermédiaire. Maîtriser POO, STL et pointeurs.",
    outcomes: [
      "Créer des fenêtres et interfaces avec FLTK",
      "Utiliser widgets FLTK (boutons, champs, tables)",
      "Gérer événements et callbacks",
      "Intégrer FLTK avec SQLite",
      "Développer une application desktop complète",
      "Appliquer architecture MVC en C++",
    ],
    projects: [],
    chapters: [
      {
        id: "fltk-intro",
        title: "FLTK : Introduction",
        description: "Créer des interfaces graphiques avec FLTK",
        lessons: [
          lesson({
            id: "fltk-bases",
            title: "FLTK : Première fenêtre et structure",
            minutes: 30,
            summary:
              "FLTK (Fast Light Toolkit) est une bibliothèque C++ légère pour créer des interfaces graphiques. Fl_Window = fenêtre, Fl_Widget = composant. show() affiche la fenêtre, Fl::run() lance la boucle d'événements.",
            sections: [
              section(
                "Structure FLTK",
                "Architecture d'une application FLTK.",
                [
                  "#include <FL/Fl.H> : bibliothèque principale",
                  "#include <FL/Fl_Window.H> : fenêtre",
                  "Fl_Window* window : créer fenêtre",
                  "Fl_Widget* : composants (boutons, labels, etc.)",
                  "window->show() : afficher la fenêtre",
                  "Fl::run() : lancer boucle d'événements",
                  "Callbacks : fonctions appelées sur événements",
                ]
              ),
              section(
                "Compilation FLTK",
                "Compiler avec les bibliothèques FLTK.",
                [
                  "Linux : g++ main.cpp -lfltk -o app",
                  "Windows : ajouter -mwindows",
                  "Mac : fltk-config --cxxflags --ldflags",
                  "CMake : find_package(FLTK REQUIRED)",
                  "Installation : apt install libfltk1.3-dev (Ubuntu)",
                ]
              ),
              section(
                "FLTK vs JavaFX/PyQt",
                "Comparaison avec autres frameworks GUI.",
                [
                  "FLTK : léger, rapide, C++ natif",
                  "JavaFX : moderne, mais nécessite JVM",
                  "PyQt : puissant, mais Python (plus lent)",
                  "FLTK : excellent pour apps légères et rapides",
                  "Code C++ pur, pas de dépendances lourdes",
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <FL/Fl.H>
#include <FL/Fl_Window.H>
#include <FL/Fl_Button.H>
#include <FL/Fl_Input.H>
#include <FL/Fl_Box.H>

// Callback pour le bouton
void bouton_callback(Fl_Widget* widget, void* data) {
    Fl_Input* input = (Fl_Input*)data;
    Fl_Box* resultat = (Fl_Box*)widget->user_data();
    
    std::string nom = input->value();
    
    if (!nom.empty()) {
        std::string message = "Bonjour " + nom + " ! 👋";
        resultat->copy_label(message.c_str());
        resultat->labelcolor(FL_GREEN);
    } else {
        resultat->copy_label("❌ Veuillez entrer votre nom");
        resultat->labelcolor(FL_RED);
    }
    
    resultat->redraw();
}

int main() {
    // Créer la fenêtre
    Fl_Window* window = new Fl_Window(400, 300, "Ma première app FLTK");
    
    // Titre
    Fl_Box* titre = new Fl_Box(50, 20, 300, 30, "Bienvenue dans FLTK !");
    titre->labelsize(18);
    titre->labelfont(FL_BOLD);
    
    // Champ de saisie
    Fl_Input* champNom = new Fl_Input(50, 70, 300, 30, "Nom:");
    champNom->align(FL_ALIGN_TOP_LEFT);
    
    // Label résultat
    Fl_Box* resultat = new Fl_Box(50, 150, 300, 30, "");
    resultat->box(FL_FLAT_BOX);
    
    // Bouton
    Fl_Button* bouton = new Fl_Button(150, 110, 100, 30, "Saluer");
    bouton->callback(bouton_callback, champNom);
    bouton->user_data(resultat);
    
    window->end();
    window->show();
    
    return Fl::run();
}

// Compilation :
// g++ main.cpp -lfltk -o app
// ./app`
            ),
            task: "Ajoute un champ pour l'âge et affiche si la personne est majeure (>= 18 ans). Style les labels avec couleurs.",
            takeaway:
              "FLTK : Fl_Window + Fl_Widget + callbacks + Fl::run(). Léger et rapide pour GUI C++.",
            quiz: quiz(
              "Quelle fonction lance la boucle d'événements FLTK ?",
              ["window->show()", "Fl::run()", "main()"],
              1,
              "Fl::run() lance la boucle d'événements qui attend et traite les interactions utilisateur."
            ),
            link: fltk
          })
        ]
      },
      {
        id: "fltk-widgets",
        title: "FLTK : Widgets et layouts",
        description: "Composants et organisation de l'interface",
        lessons: [
          lesson({
            id: "fltk-widgets-bases",
            title: "Widgets FLTK : Buttons, Inputs, Groups",
            minutes: 35,
            summary:
              "FLTK offre de nombreux widgets. Fl_Button = bouton, Fl_Input = champ texte, Fl_Box = label, Fl_Group organise les widgets. Position absolue (x, y, w, h) ou groupes.",
            sections: [
              section(
                "Widgets principaux",
                "Les composants de base FLTK.",
                [
                  "Fl_Button : bouton cliquable",
                  "Fl_Input : champ de saisie texte",
                  "Fl_Box : label statique",
                  "Fl_Output : texte en lecture seule",
                  "Fl_Check_Button : case à cocher",
                  "Fl_Radio_Button : bouton radio",
                  "Fl_Choice : menu déroulant",
                  "Fl_Slider : curseur de valeur",
                ]
              ),
              section(
                "Groupes et layouts",
                "Organiser les widgets avec Fl_Group.",
                [
                  "Fl_Group : conteneur de widgets",
                  "Fl_Pack : empile verticalement ou horizontalement",
                  "Fl_Scroll : zone scrollable",
                  "Fl_Tabs : onglets",
                  "Position absolue : (x, y, width, height)",
                  "resizable() : redimensionnement automatique",
                ]
              ),
              section(
                "Style et couleurs",
                "Personnaliser l'apparence.",
                [
                  "labelsize() : taille du texte",
                  "labelfont() : police (FL_BOLD, FL_ITALIC)",
                  "labelcolor() : couleur du label",
                  "color() : couleur de fond",
                  "selection_color() : couleur sélection",
                  "Couleurs : FL_RED, FL_GREEN, FL_BLUE, etc.",
                  "fl_rgb_color(r, g, b) : RGB custom",
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <FL/Fl.H>
#include <FL/Fl_Window.H>
#include <FL/Fl_Button.H>
#include <FL/Fl_Input.H>
#include <FL/Fl_Output.H>
#include <FL/Fl_Group.H>
#include <FL/fl_draw.H>
#include <cstdlib>
#include <string>
#include <sstream>

// Structure pour passer plusieurs widgets au callback
struct CalculData {
    Fl_Input* input1;
    Fl_Input* input2;
    Fl_Output* output;
};

// Callbacks pour les opérations
void calculer(Fl_Widget* w, void* data, char op) {
    CalculData* cd = (CalculData*)data;
    
    try {
        double n1 = std::stod(cd->input1->value());
        double n2 = std::stod(cd->input2->value());
        double resultat = 0;
        
        switch (op) {
            case '+': resultat = n1 + n2; break;
            case '-': resultat = n1 - n2; break;
            case '*': resultat = n1 * n2; break;
            case '/':
                if (n2 == 0) {
                    cd->output->value("Erreur : division par 0");
                    return;
                }
                resultat = n1 / n2;
                break;
        }
        
        std::ostringstream oss;
        oss << resultat;
        cd->output->value(oss.str().c_str());
        
    } catch (...) {
        cd->output->value("Erreur : nombres invalides");
    }
}

void addition_cb(Fl_Widget* w, void* d) { calculer(w, d, '+'); }
void soustraction_cb(Fl_Widget* w, void* d) { calculer(w, d, '-'); }
void multiplication_cb(Fl_Widget* w, void* d) { calculer(w, d, '*'); }
void division_cb(Fl_Widget* w, void* d) { calculer(w, d, '/'); }

void effacer_cb(Fl_Widget* w, void* data) {
    CalculData* cd = (CalculData*)data;
    cd->input1->value("");
    cd->input2->value("");
    cd->output->value("");
}

int main() {
    Fl_Window* window = new Fl_Window(500, 350, "Calculatrice FLTK");
    window->color(fl_rgb_color(240, 240, 240));
    
    // Titre
    Fl_Box* titre = new Fl_Box(50, 20, 400, 40, "Calculatrice Simple");
    titre->labelsize(24);
    titre->labelfont(FL_BOLD);
    titre->labelcolor(fl_rgb_color(52, 152, 219));
    
    // Groupe pour les champs
    Fl_Group* groupe_inputs = new Fl_Group(50, 80, 400, 100);
    
    Fl_Input* input1 = new Fl_Input(150, 80, 200, 30, "Nombre 1:");
    input1->align(FL_ALIGN_LEFT);
    
    Fl_Input* input2 = new Fl_Input(150, 120, 200, 30, "Nombre 2:");
    input2->align(FL_ALIGN_LEFT);
    
    Fl_Output* output = new Fl_Output(150, 160, 200, 30, "Résultat:");
    output->align(FL_ALIGN_LEFT);
    output->color(fl_rgb_color(236, 240, 241));
    
    groupe_inputs->end();
    
    // Structure pour les callbacks
    CalculData* calcData = new CalculData{input1, input2, output};
    
    // Boutons d'opérations
    Fl_Button* btnAdd = new Fl_Button(50, 220, 80, 40, "+");
    btnAdd->color(fl_rgb_color(46, 204, 113));
    btnAdd->labelsize(20);
    btnAdd->callback(addition_cb, calcData);
    
    Fl_Button* btnSub = new Fl_Button(140, 220, 80, 40, "-");
    btnSub->color(fl_rgb_color(231, 76, 60));
    btnSub->labelsize(20);
    btnSub->callback(soustraction_cb, calcData);
    
    Fl_Button* btnMul = new Fl_Button(230, 220, 80, 40, "×");
    btnMul->color(fl_rgb_color(155, 89, 182));
    btnMul->labelsize(20);
    btnMul->callback(multiplication_cb, calcData);
    
    Fl_Button* btnDiv = new Fl_Button(320, 220, 80, 40, "÷");
    btnDiv->color(fl_rgb_color(243, 156, 18));
    btnDiv->labelsize(20);
    btnDiv->callback(division_cb, calcData);
    
    Fl_Button* btnClear = new Fl_Button(190, 280, 120, 40, "Effacer");
    btnClear->color(fl_rgb_color(149, 165, 166));
    btnClear->callback(effacer_cb, calcData);
    
    window->end();
    window->show();
    
    int ret = Fl::run();
    delete calcData;
    return ret;
}`
            ),
            task: "Ajoute des boutons pour puissance (^) et racine carrée (√). Utilise des couleurs personnalisées.",
            takeaway:
              "FLTK : nombreux widgets (Button, Input, Output, Box). Fl_Group pour organiser. Callbacks pour événements. Style avec couleurs.",
            quiz: quiz(
              "Comment organiser des widgets dans FLTK ?",
              ["Automatiquement", "Position absolue (x,y,w,h) ou Fl_Group", "Grille obligatoire"],
              1,
              "FLTK utilise position absolue ou Fl_Group/Fl_Pack pour organiser les widgets."
            ),
            link: fltk + "group.html"
          }),
          lesson({
            id: "fltk-table",
            title: "Fl_Table : Afficher des données tabulaires",
            minutes: 40,
            summary:
              "Fl_Table permet d'afficher des données en tableau. draw_cell() dessine chaque cellule. rows()/cols() définit dimensions. Callbacks pour sélection. Équivalent de TableView en JavaFX.",
            sections: [
              section(
                "Fl_Table_Row",
                "Tableau avec sélection de lignes.",
                [
                  "Fl_Table_Row : tableau avec lignes sélectionnables",
                  "draw_cell() : dessine chaque cellule",
                  "rows() / cols() : définir dimensions",
                  "row_height() / col_width() : tailles",
                  "callback() : réagir à la sélection",
                  "Fl_Table vs std::vector : données séparées",
                ]
              ),
              section(
                "Dessiner les cellules",
                "Personnaliser l'affichage de chaque cellule.",
                [
                  "draw_cell(context, row, col, x, y, w, h)",
                  "CONTEXT_STARTPAGE, CONTEXT_ENDPAGE",
                  "CONTEXT_ROW_HEADER, CONTEXT_COL_HEADER",
                  "CONTEXT_CELL : données",
                  "fl_draw() : dessiner texte",
                  "fl_rect() : dessiner rectangle",
                ]
              ),
              section(
                "Synchroniser avec std::vector",
                "Maintenir cohérence données ↔ affichage.",
                [
                  "std::vector<Etudiant> données;",
                  "Ajouter : push_back() puis rows()+1",
                  "Supprimer : erase() puis rows()-1",
                  "Modifier : changer dans vector puis redraw()",
                  "redraw() : rafraîchir l'affichage",
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <FL/Fl.H>
#include <FL/Fl_Window.H>
#include <FL/Fl_Table_Row.H>
#include <FL/Fl_Button.H>
#include <FL/Fl_Input.H>
#include <FL/fl_draw.H>
#include <vector>
#include <string>

struct Etudiant {
    std::string nom;
    int age;
    std::string filiere;
};

class TableEtudiants : public Fl_Table_Row {
    std::vector<Etudiant>* donnees;
    
protected:
    void draw_cell(TableContext context, int row, int col, 
                   int x, int y, int w, int h) override {
        
        switch (context) {
            case CONTEXT_COL_HEADER: {
                fl_push_clip(x, y, w, h);
                fl_draw_box(FL_THIN_UP_BOX, x, y, w, h, FL_BACKGROUND_COLOR);
                fl_color(FL_BLACK);
                
                const char* headers[] = {"Nom", "Âge", "Filière"};
                fl_draw(headers[col], x, y, w, h, FL_ALIGN_CENTER);
                
                fl_pop_clip();
                break;
            }
            
            case CONTEXT_CELL: {
                fl_push_clip(x, y, w, h);
                
                // Fond alternant
                fl_color(row_selected(row) ? FL_YELLOW : 
                        (row % 2 ? FL_WHITE : fl_rgb_color(245, 245, 245)));
                fl_rectf(x, y, w, h);
                
                // Texte
                fl_color(FL_BLACK);
                
                if (row < (int)donnees->size()) {
                    std::string texte;
                    switch (col) {
                        case 0: texte = (*donnees)[row].nom; break;
                        case 1: texte = std::to_string((*donnees)[row].age); break;
                        case 2: texte = (*donnees)[row].filiere; break;
                    }
                    fl_draw(texte.c_str(), x, y, w, h, FL_ALIGN_CENTER);
                }
                
                // Bordure
                fl_color(FL_GRAY);
                fl_rect(x, y, w, h);
                
                fl_pop_clip();
                break;
            }
            
            default:
                break;
        }
    }
    
public:
    TableEtudiants(int x, int y, int w, int h, std::vector<Etudiant>* data) 
        : Fl_Table_Row(x, y, w, h), donnees(data) {
        
        rows(donnees->size());
        cols(3);
        col_header(1);
        col_width_all(150);
        row_height_all(30);
        end();
    }
    
    void rafraichir() {
        rows(donnees->size());
        redraw();
    }
};

// Données globales
std::vector<Etudiant> etudiants = {
    {"Alice", 20, "Informatique"},
    {"Bob", 22, "Mathématiques"},
    {"Charlie", 21, "Physique"}
};

TableEtudiants* table = nullptr;
Fl_Input* inputNom = nullptr;
Fl_Input* inputAge = nullptr;
Fl_Input* inputFiliere = nullptr;

void ajouter_cb(Fl_Widget*, void*) {
    std::string nom = inputNom->value();
    int age = std::atoi(inputAge->value());
    std::string filiere = inputFiliere->value();
    
    if (!nom.empty() && age > 0 && !filiere.empty()) {
        etudiants.push_back({nom, age, filiere});
        table->rafraichir();
        
        inputNom->value("");
        inputAge->value("");
        inputFiliere->value("");
    }
}

void supprimer_cb(Fl_Widget*, void*) {
    int row = table->callback_row();
    if (row >= 0 && row < (int)etudiants.size()) {
        etudiants.erase(etudiants.begin() + row);
        table->rafraichir();
    }
}

int main() {
    Fl_Window* window = new Fl_Window(600, 500, "Gestion Étudiants - FLTK");
    
    // Titre
    Fl_Box* titre = new Fl_Box(50, 10, 500, 30, "Gestion des Étudiants");
    titre->labelsize(18);
    titre->labelfont(FL_BOLD);
    
    // Table
    table = new TableEtudiants(50, 50, 500, 250, &etudiants);
    
    // Formulaire
    inputNom = new Fl_Input(150, 320, 200, 30, "Nom:");
    inputNom->align(FL_ALIGN_LEFT);
    
    inputAge = new Fl_Input(150, 360, 200, 30, "Âge:");
    inputAge->align(FL_ALIGN_LEFT);
    
    inputFiliere = new Fl_Input(150, 400, 200, 30, "Filière:");
    inputFiliere->align(FL_ALIGN_LEFT);
    
    // Boutons
    Fl_Button* btnAjouter = new Fl_Button(400, 320, 100, 40, "Ajouter");
    btnAjouter->color(FL_GREEN);
    btnAjouter->callback(ajouter_cb);
    
    Fl_Button* btnSupprimer = new Fl_Button(400, 370, 100, 40, "Supprimer");
    btnSupprimer->color(FL_RED);
    btnSupprimer->callback(supprimer_cb);
    
    window->end();
    window->show();
    
    return Fl::run();
}`
            ),
            task: "Ajoute une colonne 'Moyenne' et un bouton 'Modifier' qui permet de modifier l'étudiant sélectionné.",
            takeaway:
              "Fl_Table_Row pour tableaux. draw_cell() pour personnaliser. Synchroniser avec std::vector. redraw() pour rafraîchir.",
            quiz: quiz(
              "Que fait redraw() sur Fl_Table ?",
              ["Efface les données", "Rafraîchit l'affichage", "Trie les données"],
              1,
              "redraw() force le redessin du tableau, affichant les données actuelles."
            ),
            link: fltk + "Fl_Table.html"
          })
        ]
      },
      {
        id: "fltk-sqlite",
        title: "FLTK + SQLite",
        description: "Intégrer base de données avec interface graphique",
        lessons: [
          lesson({
            id: "fltk-sqlite-integration",
            title: "Intégrer SQLite avec FLTK",
            minutes: 45,
            summary:
              "Combiner FLTK (interface) avec SQLite (données). Architecture MVC : Model (classes), View (FLTK), Controller (logique). DAO pour persistance. Synchroniser Fl_Table avec la base.",
            sections: [
              section(
                "Architecture MVC en C++",
                "Séparer interface, logique et données.",
                [
                  "Model : classes métier (Produit, Client, etc.)",
                  "View : interface FLTK (fenêtres, widgets)",
                  "Controller : logique métier, appelle DAO",
                  "DAO : encapsule requêtes SQL (SQLite)",
                  "Séparation claire des responsabilités",
                ]
              ),
              section(
                "Pattern DAO en C++",
                "Encapsuler l'accès aux données.",
                [
                  "Classe DAO : méthodes CRUD",
                  "getAll(), getById(), ajouter(), modifier(), supprimer()",
                  "sqlite3* : handle de connexion",
                  "sqlite3_prepare_v2() : PreparedStatement",
                  "sqlite3_bind_*() : paramètres sécurisés",
                  "sqlite3_step() : exécuter requête",
                  "sqlite3_finalize() : libérer ressources",
                ]
              ),
              section(
                "Synchronisation FLTK ↔ SQLite",
                "Maintenir cohérence affichage et base.",
                [
                  "std::vector contient données chargées",
                  "Charger au démarrage depuis BD",
                  "INSERT : ajouter à vector ET BD",
                  "UPDATE : modifier dans vector ET BD",
                  "DELETE : retirer de vector ET BD",
                  "table->rafraichir() après chaque opération",
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `#include <FL/Fl.H>
#include <FL/Fl_Window.H>
#include <FL/Fl_Table_Row.H>
#include <FL/Fl_Button.H>
#include <FL/Fl_Input.H>
#include <FL/fl_draw.H>
#include <sqlite3.h>
#include <vector>
#include <string>
#include <sstream>

// ===== Model =====
struct Produit {
    int id;
    std::string nom;
    double prix;
    int stock;
};

// ===== DAO =====
class ProduitDAO {
private:
    sqlite3* db;
    
public:
    ProduitDAO() {
        if (sqlite3_open("produits.db", &db) != SQLITE_OK) {
            std::cerr << "Erreur ouverture BD" << std::endl;
        }
        creerTable();
    }
    
    ~ProduitDAO() {
        sqlite3_close(db);
    }
    
    void creerTable() {
        const char* sql = 
            "CREATE TABLE IF NOT EXISTS produits ("
            "id INTEGER PRIMARY KEY AUTOINCREMENT,"
            "nom TEXT NOT NULL,"
            "prix REAL NOT NULL,"
            "stock INTEGER NOT NULL)";
        
        char* errMsg;
        sqlite3_exec(db, sql, nullptr, nullptr, &errMsg);
    }
    
    std::vector<Produit> getAll() {
        std::vector<Produit> liste;
        const char* sql = "SELECT * FROM produits";
        
        sqlite3_stmt* stmt;
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            while (sqlite3_step(stmt) == SQLITE_ROW) {
                Produit p;
                p.id = sqlite3_column_int(stmt, 0);
                p.nom = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
                p.prix = sqlite3_column_double(stmt, 2);
                p.stock = sqlite3_column_int(stmt, 3);
                liste.push_back(p);
            }
            sqlite3_finalize(stmt);
        }
        
        return liste;
    }
    
    int ajouter(const Produit& p) {
        const char* sql = "INSERT INTO produits(nom, prix, stock) VALUES(?, ?, ?)";
        
        sqlite3_stmt* stmt;
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, p.nom.c_str(), -1, SQLITE_TRANSIENT);
            sqlite3_bind_double(stmt, 2, p.prix);
            sqlite3_bind_int(stmt, 3, p.stock);
            sqlite3_step(stmt);
            sqlite3_finalize(stmt);
            
            return sqlite3_last_insert_rowid(db);
        }
        
        return -1;
    }
    
    void modifier(const Produit& p) {
        const char* sql = "UPDATE produits SET nom=?, prix=?, stock=? WHERE id=?";
        
        sqlite3_stmt* stmt;
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, p.nom.c_str(), -1, SQLITE_TRANSIENT);
            sqlite3_bind_double(stmt, 2, p.prix);
            sqlite3_bind_int(stmt, 3, p.stock);
            sqlite3_bind_int(stmt, 4, p.id);
            sqlite3_step(stmt);
            sqlite3_finalize(stmt);
        }
    }
    
    void supprimer(int id) {
        const char* sql = "DELETE FROM produits WHERE id=?";
        
        sqlite3_stmt* stmt;
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_int(stmt, 1, id);
            sqlite3_step(stmt);
            sqlite3_finalize(stmt);
        }
    }
};

// ===== View (Table) =====
class TableProduits : public Fl_Table_Row {
    std::vector<Produit>* produits;
    
protected:
    void draw_cell(TableContext context, int row, int col,
                   int x, int y, int w, int h) override {
        
        switch (context) {
            case CONTEXT_COL_HEADER: {
                fl_push_clip(x, y, w, h);
                fl_draw_box(FL_THIN_UP_BOX, x, y, w, h, FL_BACKGROUND_COLOR);
                fl_color(FL_BLACK);
                
                const char* headers[] = {"ID", "Nom", "Prix", "Stock"};
                fl_draw(headers[col], x, y, w, h, FL_ALIGN_CENTER);
                
                fl_pop_clip();
                break;
            }
            
            case CONTEXT_CELL: {
                fl_push_clip(x, y, w, h);
                
                fl_color(row_selected(row) ? FL_YELLOW : FL_WHITE);
                fl_rectf(x, y, w, h);
                
                fl_color(FL_BLACK);
                
                if (row < (int)produits->size()) {
                    std::string texte;
                    switch (col) {
                        case 0: texte = std::to_string((*produits)[row].id); break;
                        case 1: texte = (*produits)[row].nom; break;
                        case 2: {
                            std::ostringstream oss;
                            oss << (*produits)[row].prix << " €";
                            texte = oss.str();
                            break;
                        }
                        case 3: texte = std::to_string((*produits)[row].stock); break;
                    }
                    fl_draw(texte.c_str(), x, y, w, h, FL_ALIGN_CENTER);
                }
                
                fl_color(FL_GRAY);
                fl_rect(x, y, w, h);
                
                fl_pop_clip();
                break;
            }
            
            default:
                break;
        }
    }
    
public:
    TableProduits(int x, int y, int w, int h, std::vector<Produit>* p)
        : Fl_Table_Row(x, y, w, h), produits(p) {
        
        rows(produits->size());
        cols(4);
        col_header(1);
        col_width(0, 60);
        col_width(1, 200);
        col_width(2, 100);
        col_width(3, 100);
        row_height_all(30);
        end();
    }
    
    void rafraichir() {
        rows(produits->size());
        redraw();
    }
};

// ===== Données et widgets globaux =====
std::vector<Produit> produits;
ProduitDAO* dao;
TableProduits* table;
Fl_Input *inputNom, *inputPrix, *inputStock;
int selectedId = -1;

void chargerProduits() {
    produits = dao->getAll();
    table->rafraichir();
}

void ajouter_cb(Fl_Widget*, void*) {
    Produit p;
    p.nom = inputNom->value();
    p.prix = std::stod(inputPrix->value());
    p.stock = std::stoi(inputStock->value());
    
    int id = dao->ajouter(p);
    p.id = id;
    produits.push_back(p);
    table->rafraichir();
    
    inputNom->value("");
    inputPrix->value("");
    inputStock->value("");
}

void modifier_cb(Fl_Widget*, void*) {
    int row = table->callback_row();
    if (row >= 0 && row < (int)produits.size()) {
        produits[row].nom = inputNom->value();
        produits[row].prix = std::stod(inputPrix->value());
        produits[row].stock = std::stoi(inputStock->value());
        
        dao->modifier(produits[row]);
        table->rafraichir();
    }
}

void supprimer_cb(Fl_Widget*, void*) {
    int row = table->callback_row();
    if (row >= 0 && row < (int)produits.size()) {
        dao->supprimer(produits[row].id);
        produits.erase(produits.begin() + row);
        table->rafraichir();
    }
}

void selection_cb(Fl_Widget*, void*) {
    int row = table->callback_row();
    if (row >= 0 && row < (int)produits.size()) {
        inputNom->value(produits[row].nom.c_str());
        inputPrix->value(std::to_string(produits[row].prix).c_str());
        inputStock->value(std::to_string(produits[row].stock).c_str());
    }
}

int main() {
    dao = new ProduitDAO();
    chargerProduits();
    
    Fl_Window* window = new Fl_Window(700, 600, "Stock Manager - FLTK + SQLite");
    
    Fl_Box* titre = new Fl_Box(50, 10, 600, 30, "Gestion des Produits");
    titre->labelsize(18);
    titre->labelfont(FL_BOLD);
    
    table = new TableProduits(50, 50, 600, 300, &produits);
    table->callback(selection_cb);
    
    inputNom = new Fl_Input(150, 380, 200, 30, "Nom:");
    inputNom->align(FL_ALIGN_LEFT);
    
    inputPrix = new Fl_Input(150, 420, 200, 30, "Prix:");
    inputPrix->align(FL_ALIGN_LEFT);
    
    inputStock = new Fl_Input(150, 460, 200, 30, "Stock:");
    inputStock->align(FL_ALIGN_LEFT);
    
    Fl_Button* btnAjouter = new Fl_Button(400, 380, 100, 40, "Ajouter");
    btnAjouter->color(FL_GREEN);
    btnAjouter->callback(ajouter_cb);
    
    Fl_Button* btnModifier = new Fl_Button(400, 430, 100, 40, "Modifier");
    btnModifier->color(FL_BLUE);
    btnModifier->callback(modifier_cb);
    
    Fl_Button* btnSupprimer = new Fl_Button(520, 380, 100, 40, "Supprimer");
    btnSupprimer->color(FL_RED);
    btnSupprimer->callback(supprimer_cb);
    
    Fl_Button* btnRafraichir = new Fl_Button(520, 430, 100, 40, "Rafraîchir");
    btnRafraichir->callback([](Fl_Widget*, void*) { chargerProduits(); });
    
    window->end();
    window->show();
    
    int ret = Fl::run();
    delete dao;
    return ret;
}

// Compilation:
// g++ main.cpp -lfltk -lsqlite3 -o app`
            ),
            task: "Ajoute recherche par nom et alerte quand stock < 10. Ajoute export CSV.",
            takeaway:
              "FLTK + SQLite = apps desktop C++. Architecture MVC + DAO. sqlite3_prepare pour sécurité. Synchroniser table et BD.",
            quiz: quiz(
              "Pourquoi utiliser sqlite3_bind au lieu de concaténer SQL ?",
              ["Plus rapide", "Sécurité (évite injection SQL)", "Obligatoire"],
              1,
              "sqlite3_bind sécurise contre injection SQL en séparant requête et paramètres."
            ),
            link: "https://www.sqlite.org/capi3ref.html"
          })
        ]
      },
      {
        id: "projet-final-cpp",
        title: "🎯 Projet Final : Application complète",
        description: "Gestionnaire de bibliothèque avec FLTK + SQLite",
        lessons: [
          lesson({
            id: "projet-bibliotheque-cpp",
            title: "Projet Final : Gestionnaire de Bibliothèque",
            minutes: 120,
            summary:
              "Application complète de gestion de bibliothèque en C++ : livres, membres, emprunts. FLTK pour l'interface, SQLite pour les données. CRUD complet, recherche, statistiques, polymorphisme.",
            sections: [
              section(
                "Fonctionnalités à implémenter",
                "Application professionnelle complète en C++.",
                [
                  "✅ Gestion des livres (CRUD, recherche, disponibilité)",
                  "✅ Gestion des membres (réguliers et premium avec polymorphisme)",
                  "✅ Emprunts et retours avec dates (chrono)",
                  "✅ Calcul automatique frais de retard (virtual)",
                  "✅ Statistiques (top livres, membres actifs)",
                  "✅ Recherche multi-critères (STL algorithms)",
                  "✅ Export CSV",
                  "✅ Interface FLTK avec Fl_Table",
                ]
              ),
              section(
                "Architecture recommandée",
                "Organisation C++ en headers et sources.",
                [
                  "📂 model/ : Livre.h/cpp, Membre.h/cpp, Emprunt.h/cpp",
                  "📂 dao/ : LivreDAO, MembreDAO, EmpruntDAO",
                  "📂 view/ : Fenêtres FLTK, tables personnalisées",
                  "📂 controller/ : Logique métier",
                  "📂 util/ : Helpers, formatage dates",
                  "Base : 3 tables (livres, membres, emprunts)",
                  "POO : héritage, polymorphisme, templates",
                ]
              ),
              section(
                "Technologies C++ utilisées",
                "Stack complète desktop C++.",
                [
                  "FLTK : Interface graphique légère",
                  "SQLite3 : Base de données embarquée",
                  "STL : vector, map, algorithms",
                  "chrono : Gestion des dates",
                  "Smart pointers : unique_ptr, shared_ptr",
                  "Templates : fonctions génériques",
                  "Polymorphisme : calcul frais virtual",
                ]
              )
            ],
            files: consoleFiles(
              "cpp",
              `// ═══════════════════════════════════════════════════════════════
// PROJET FINAL C++ : GESTIONNAIRE DE BIBLIOTHÈQUE
// ═══════════════════════════════════════════════════════════════
//
// 📚 FONCTIONNALITÉS (identiques au projet Java)
// ─────────────────────────────────────────────────────────────
// 1. Gestion des Livres
//    - CRUD complet avec Fl_Table
//    - Recherche par titre, auteur, ISBN
//    - Disponibilité (disponible/emprunté)
//
// 2. Gestion des Membres (Polymorphisme C++)
//    - Classe abstraite Membre
//    - MembreRegulier : frais 1.0€/jour
//    - MembrePremium : frais 0.5€/jour
//    - virtual double calculerFraisRetard(int jours)
//
// 3. Gestion des Emprunts
//    - std::chrono pour dates
//    - Emprunter/Retourner avec calcul retard
//    - Prolonger emprunt (max 1 fois)
//
// 4. Statistiques
//    - Top 10 livres (std::sort + lambda)
//    - Membres actifs
//    - Export CSV (ofstream)
//
// 🗄️ STRUCTURE BASE DE DONNÉES (SQLite)
// ─────────────────────────────────────────────────────────────
// TABLE livres:
//   - id INTEGER PRIMARY KEY
//   - isbn TEXT UNIQUE
//   - titre TEXT
//   - auteur TEXT
//   - categorie TEXT
//   - disponible INTEGER (0/1)
//
// TABLE membres:
//   - id INTEGER PRIMARY KEY
//   - nom TEXT
//   - email TEXT UNIQUE
//   - telephone TEXT
//   - type TEXT ('REGULIER' ou 'PREMIUM')
//   - date_inscription TEXT
//
// TABLE emprunts:
//   - id INTEGER PRIMARY KEY
//   - livre_id INTEGER FOREIGN KEY
//   - membre_id INTEGER FOREIGN KEY
//   - date_emprunt TEXT
//   - date_retour_prevue TEXT
//   - date_retour_effectif TEXT NULL
//   - frais_retard REAL
//   - prolonge INTEGER (0/1)
//
// 📁 STRUCTURE FICHIERS C++
// ─────────────────────────────────────────────────────────────
// src/
//   model/
//     Livre.h, Livre.cpp
//     Membre.h, Membre.cpp (abstract class)
//     MembreRegulier.h, MembreRegulier.cpp
//     MembrePremium.h, MembrePremium.cpp
//     Emprunt.h, Emprunt.cpp
//   
//   dao/
//     DatabaseManager.h, DatabaseManager.cpp
//     LivreDAO.h, LivreDAO.cpp
//     MembreDAO.h, MembreDAO.cpp
//     EmpruntDAO.h, EmpruntDAO.cpp
//   
//   view/
//     MainWindow.h, MainWindow.cpp
//     TableLivres.h, TableLivres.cpp (extends Fl_Table_Row)
//     TableMembres.h, TableMembres.cpp
//     TableEmprunts.h, TableEmprunts.cpp
//   
//   controller/
//     LivreController.h, LivreController.cpp
//     MembreController.h, MembreController.cpp
//     EmpruntController.h, EmpruntController.cpp
//   
//   util/
//     DateUtil.h, DateUtil.cpp
//     ExportUtil.h, ExportUtil.cpp
//
// 🎨 INTERFACE UTILISATEUR FLTK
// ─────────────────────────────────────────────────────────────
// Fenêtre principale avec Fl_Tabs :
//   Tab 1: Livres (Fl_Table + formulaire CRUD)
//   Tab 2: Membres (Fl_Table + formulaire CRUD)
//   Tab 3: Emprunts (Emprunter/Retourner)
//   Tab 4: Statistiques (affichage texte + export)
//
// 💡 CONCEPTS C++ AVANCÉS UTILISÉS
// ─────────────────────────────────────────────────────────────
// - POO : classes, héritage, polymorphisme
// - Classes abstraites : virtual pure
// - Smart pointers : unique_ptr<Membre>
// - STL : vector, map, algorithms
// - Templates : fonctions génériques recherche
// - chrono : calcul dates et durées
// - Lambda functions : callbacks FLTK
// - Surcharge d'opérateurs : comparaison
// - try/catch : gestion erreurs SQLite
// - RAII : gestion automatique ressources
//
// 🚀 EXEMPLE DE CODE DE DÉMARRAGE
// ─────────────────────────────────────────────────────────────

#include <FL/Fl.H>
#include <FL/Fl_Window.H>
#include <FL/Fl_Tabs.H>
#include <FL/Fl_Group.H>
#include <FL/Fl_Box.H>

// Classe abstraite Membre (polymorphisme)
class Membre {
protected:
    int id;
    std::string nom;
    std::string email;
    
public:
    Membre(int i, std::string n, std::string e) 
        : id(i), nom(n), email(e) {}
    
    virtual ~Membre() {}
    
    // Méthode virtuelle pure (classe abstraite)
    virtual double calculerFraisRetard(int joursRetard) const = 0;
    virtual std::string getType() const = 0;
    
    int getId() const { return id; }
    std::string getNom() const { return nom; }
};

// Membre régulier (héritage)
class MembreRegulier : public Membre {
public:
    MembreRegulier(int i, std::string n, std::string e)
        : Membre(i, n, e) {}
    
    double calculerFraisRetard(int jours) const override {
        return jours * 1.0;  // 1€ par jour
    }
    
    std::string getType() const override {
        return "REGULIER";
    }
};

// Membre premium (héritage)
class MembrePremium : public Membre {
public:
    MembrePremium(int i, std::string n, std::string e)
        : Membre(i, n, e) {}
    
    double calculerFraisRetard(int jours) const override {
        return jours * 0.5;  // 0.50€ par jour
    }
    
    std::string getType() const override {
        return "PREMIUM";
    }
};

class MainWindow : public Fl_Window {
public:
    MainWindow() : Fl_Window(1000, 700, "Gestionnaire de Bibliothèque C++") {
        
        Fl_Tabs* tabs = new Fl_Tabs(10, 10, 980, 680);
        
        // Tab Livres
        Fl_Group* tabLivres = new Fl_Group(10, 35, 980, 655, "Livres");
        // TODO: Ajouter Fl_Table et formulaire CRUD
        tabLivres->end();
        
        // Tab Membres
        Fl_Group* tabMembres = new Fl_Group(10, 35, 980, 655, "Membres");
        // TODO: Ajouter Fl_Table et formulaire CRUD
        tabMembres->end();
        
        // Tab Emprunts
        Fl_Group* tabEmprunts = new Fl_Group(10, 35, 980, 655, "Emprunts");
        // TODO: Interface emprunter/retourner
        tabEmprunts->end();
        
        // Tab Statistiques
        Fl_Group* tabStats = new Fl_Group(10, 35, 980, 655, "Statistiques");
        // TODO: Affichage stats + export
        tabStats->end();
        
        tabs->end();
        end();
    }
};

int main() {
    MainWindow* window = new MainWindow();
    window->show();
    return Fl::run();
}

// ═══════════════════════════════════════════════════════════════
// COMPILATION
// ═══════════════════════════════════════════════════════════════
// g++ -std=c++17 main.cpp -lfltk -lsqlite3 -o bibliotheque
// ./bibliotheque
//
// Ou avec CMake :
// cmake_minimum_required(VERSION 3.10)
// project(Bibliotheque)
// set(CMAKE_CXX_STANDARD 17)
// find_package(FLTK REQUIRED)
// find_package(SQLite3 REQUIRED)
// add_executable(bibliotheque main.cpp ...)
// target_link_libraries(bibliotheque FLTK::FLTK SQLite::SQLite3)
// ═══════════════════════════════════════════════════════════════`,
            ),
            task: "Implémente l'application complète de bibliothèque en C++ en suivant l'architecture proposée. Utilise POO, STL, chrono, FLTK et SQLite. Teste toutes fonctionnalités.",
            takeaway:
              "Projet complet C++ : FLTK + SQLite + POO avancée. Architecture MVC, polymorphisme, STL, chrono. Valide niveau avancé !",
            quiz: quiz(
              "Pourquoi une classe Membre abstraite avec virtual ?",
              ["Performance", "Polymorphisme : calcul frais différent selon type", "Obligation C++"],
              1,
              "virtual permet polymorphisme : chaque type de membre calcule ses frais différemment."
            ),
            link: docs
          })
        ]
      }
    ]
  }
];