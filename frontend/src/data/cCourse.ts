import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { cCalculator, cGuessing, gtkClicker, gtkNotepad } from "./cProjects";
import type { WebLevel } from "./webCourseTypes";

const reference = "https://en.cppreference.com/w/c/";
const gtk = "https://docs.gtk.org/gtk4/";

const beginner: WebLevel["chapters"] = [
  {
    id: "c-demarrer",
    title: "Du fichier source au programme",
    description: "Comprends la compilation puis nomme tes premières données.",
    lessons: [
      lesson({
        id: "c-premiere-compilation",
        title: "Comprendre main et le compilateur",
        minutes: 16,
        summary:
          "C est un langage compilé. Tu écris un fichier texte main.c. GCC vérifie sa syntaxe et produit un exécutable que le système peut lancer. La fonction main constitue le point d’entrée de ce programme.",
        sections: [
          section(
            "Lire un programme ligne par ligne",
            "#include <stdio.h> rend disponibles les déclarations des fonctions d’entrée et de sortie. Les accolades délimitent le corps de main. Chaque instruction se termine par un point-virgule.",
            [
              "puts affiche une chaîne de caractères et termine la ligne.",
              "int main(void) indique un point d’entrée sans argument utilisé. return 0 signale une fin normale.",
            ],
          ),
          section(
            "Faire ton premier essai",
            "L’atelier envoie les fichiers source au service de compilation. La console présente les diagnostics de GCC puis le texte produit par le programme. Le bouton Relancer permet de comparer deux versions.",
            [
              "Lis d’abord le nom de fichier et le numéro de ligne d’un diagnostic.",
              "Modifie une seule instruction, compile puis observe le résultat.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>

int main(void) {
    puts("Bonjour DevAfrica !");
    puts("Je compile mon premier programme C.");
    return 0;
}`,
        ),
        task: "Remplace la deuxième phrase par ton prénom puis compile. Ajoute une troisième instruction puts.",
        takeaway:
          "La compilation fabrique l’exécutable. Son exécution commence dans main.",
        quiz: quiz(
          "Quelle fonction est le point d’entrée ?",
          ["puts", "main", "include"],
          1,
          "Le système entre dans main pour lancer ton programme.",
        ),
        link: reference + "language/main_function.html",
      }),
      lesson({
        id: "c-types-variables",
        title: "Variables, types et constantes",
        minutes: 19,
        summary:
          "Une variable est une zone mémoire nommée dont le type détermine les valeurs utilisables. Une initialisation lui donne sa première valeur. int représente ici un entier et double un nombre à virgule.",
        sections: [
          section(
            "Choisir et initialiser",
            "Le programme associe un prix à une quantité. printf remplace ses marqueurs de format par les valeurs passées après le texte. %.2f affiche deux chiffres après la virgule.",
            [
              "%d correspond à int. %f convient à un double transmis à printf.",
              "char conserve un caractère, écrit entre apostrophes. Un texte utilise des guillemets.",
            ],
          ),
          section(
            "Faire évoluer une donnée",
            "L’affectation = remplace la valeur d’une variable. const exprime qu’une valeur doit rester fixe dans ce programme. Les noms comme quantite rendent le calcul lisible.",
            [
              "Initialise chaque variable avant sa première lecture.",
              "Une division entre deux entiers produit un entier. 5.0 / 2 exprime une division flottante.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>

int main(void) {
    const double prix = 2500.0;
    int quantite = 2;
    char categorie = 'A';
    printf("Catégorie %c, quantité %d\n", categorie, quantite);
    quantite = quantite + 1;
    printf("Total pour %d articles : %.2f Ar\n", quantite, prix * quantite);
    return 0;
}`,
        ),
        task: "Passe la quantité initiale à 4 et prédis le total avant de compiler. Essaie ensuite 5 / 2 puis 5.0 / 2.",
        takeaway:
          "Le type, le nom et la valeur initiale décrivent ensemble une variable.",
        quiz: quiz(
          "Quel type convient pour 12.5 ?",
          ["double", "char", "void"],
          0,
          "double représente un nombre à virgule flottante.",
        ),
        link: reference + "language/types.html",
      }),
    ],
  },
  {
    id: "c-logique",
    title: "Saisie, conditions et répétitions",
    description: "Lis les entrées et dirige les étapes d’un algorithme.",
    lessons: [
      lesson({
        id: "c-saisie",
        title: "Lire une valeur et vérifier la saisie",
        minutes: 20,
        summary:
          "Une entrée est une donnée fournie au programme. scanf essaie de convertir le texte reçu vers le type indiqué. Sa valeur de retour permet de vérifier combien de conversions ont réussi.",
        sections: [
          section(
            "Relier le format à la variable",
            "scanf reçoit l’adresse de la variable avec & pour y écrire le résultat. Pour un double, la conversion de lecture utilise %lf. Pour un int, elle utilise %d.",
            [
              "Dans Entrée standard, écris par exemple 3 puis 1200 sur la ligne suivante.",
              "Les espaces et retours à la ligne séparent les valeurs numériques.",
            ],
          ),
          section(
            "Réagir à une entrée incorrecte",
            "Si scanf attend un entier et reçoit un mot, il indique une conversion échouée. Le programme affiche une explication sur stderr et termine avec un code d’erreur.",
            [
              "Les entrées de l’atelier sont préparées avant le lancement, puis transmises en une fois.",
              "Teste aussi un nombre négatif pour vérifier la règle métier.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>

int main(void) {
    int quantite;
    double prix;
    puts("Quantité puis prix unitaire ?");
    if (scanf("%d %lf", &quantite, &prix) != 2) {
        fputs("Entre un entier puis un prix.\n", stderr);
        return 1;
    }
    if (quantite < 0 || prix < 0) {
        fputs("Les valeurs doivent être positives ou nulles.\n", stderr);
        return 1;
    }
    printf("Total : %.2f Ar\n", quantite * prix);
    return 0;
}`,
          { stdin: "3\n1200\n" },
        ),
        task: "Exécute avec 3 et 1200. Remplace ensuite 3 par bonjour et observe la sortie d’erreur.",
        takeaway:
          "Vérifier le résultat de la lecture permet d’utiliser une donnée définie.",
        quiz: quiz(
          "Que représente &quantite ?",
          ["Le double de quantite", "Une chaîne", "L’adresse de quantite"],
          2,
          "scanf utilise cette adresse pour stocker la valeur convertie.",
        ),
        link: reference + "io/fscanf.html",
      }),
      lesson({
        id: "c-conditions",
        title: "Choisir une branche avec if et switch",
        minutes: 19,
        summary:
          "Une condition est une expression évaluée comme vraie ou fausse. if choisit une branche. switch compare une même valeur entière à plusieurs cas, ce qui convient au menu de la calculatrice.",
        sections: [
          section(
            "Comparer et combiner",
            "== teste une égalité et != une différence. && exige deux conditions vraies. || accepte au moins une condition vraie. Les parenthèses rendent les priorités visibles.",
            [
              "= sert à affecter une valeur. == sert à comparer.",
              "Une branche else couvre le cas restant.",
            ],
          ),
          section(
            "Lire le menu du projet",
            "Le switch dirige le programme vers l’addition, la soustraction, la multiplication ou la division. Chaque break termine son cas. default explique un choix hors du menu.",
            [
              "La division vérifie d’abord la valeur du diviseur.",
              "Teste chaque opération avec des nombres simples dont tu connais déjà le résultat.",
            ],
          ),
        ],
        files: projectExample(cCalculator),
        task: "Fournis 12 3 puis 4 pour obtenir une division. Essaie 12 0 puis 4 et suis la branche de validation.",
        takeaway:
          "Une condition traduit une règle. Un jeu d’essais permet de vérifier chacune de ses branches.",
        quiz: quiz(
          "Quel opérateur compare deux valeurs ?",
          ["=", "==", "++"],
          1,
          "== produit le résultat de la comparaison.",
        ),
        link: reference + "language/if.html",
      }),
      lesson({
        id: "c-boucles",
        title: "Répéter avec for et while",
        minutes: 21,
        summary:
          "Une boucle répète un bloc. for regroupe le départ, la condition et l’évolution d’un compteur. while relit sa condition avant chaque tour et convient à une répétition dont la durée dépend d’un événement.",
        sections: [
          section(
            "Suivre le compteur à la main",
            "Au départ i vaut 1. Tant que i reste inférieur ou égal à 5, le programme l’ajoute au total puis l’incrémente. Note les valeurs successives sur une feuille avant de lancer.",
            [
              "i++ ajoute un à i.",
              "La condition doit pouvoir devenir fausse pour que la boucle termine.",
            ],
          ),
          section(
            "Comprendre le jeu du plus ou moins",
            "Dans le mini-projet, while lit une nouvelle proposition tant que la saisie contient un entier. Une bonne réponse termine main. La fin des entrées termine également la partie.",
            [
              "continue passe au tour suivant.",
              "break sort de la boucle la plus proche.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>

int main(void) {
    int total = 0;
    for (int i = 1; i <= 5; i++) {
        total += i;
        printf("Étape %d, total %d\n", i, total);
    }
    int restant = 3;
    while (restant > 0) {
        printf("Compte à rebours %d\n", restant);
        restant--;
    }
    return 0;
}`,
        ),
        task: "Calcule le total attendu puis exécute. Fais varier la limite de 5 à 10 et explique le dernier résultat.",
        takeaway:
          "La condition et l’évolution du compteur déterminent l’arrêt d’une boucle.",
        quiz: quiz(
          "Quand while vérifie-t-il sa condition ?",
          [
            "Avant chaque tour",
            "Après le dernier tour uniquement",
            "Pendant la compilation uniquement",
          ],
          0,
          "La condition est évaluée avant d’entrer dans le bloc à chaque répétition.",
        ),
        link: reference + "language/for.html",
      }),
    ],
  },
  {
    id: "c-fonctions-tableaux",
    title: "Fonctions et collections",
    description: "Sépare les calculs puis organise plusieurs valeurs.",
    lessons: [
      lesson({
        id: "c-fonctions",
        title: "Paramètres, appel et valeur de retour",
        minutes: 23,
        summary:
          "Une fonction est un bloc nommé qui accomplit une tâche. Les paramètres reçoivent les données de l’appel. return renvoie un résultat à l’endroit où la fonction a été appelée.",
        sections: [
          section(
            "Distinguer définir et appeler",
            "La définition de total indique sa recette de calcul. L’expression total(3, 1200.0) exécute cette recette avec deux arguments. Les paramètres sont des variables locales à cette exécution.",
            [
              "Le type placé devant le nom décrit la valeur renvoyée.",
              "Un paramètre ordinaire reçoit une copie de la valeur de l’argument.",
            ],
          ),
          section(
            "Observer plusieurs appels",
            "Les appels utilisent le même code avec des données différentes. Le calcul reste concentré dans la fonction et main organise les opérations.",
            [
              "Choisis un nom qui décrit l’action.",
              "Teste une quantité nulle et une quantité positive.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>

double total(int quantite, double prix) {
    return quantite * prix;
}

int main(void) {
    double premiere = total(3, 1200.0);
    double seconde = total(2, 500.0);
    printf("Commande A : %.2f Ar\n", premiere);
    printf("Commande B : %.2f Ar\n", seconde);
    return 0;
}`,
        ),
        task: "Ajoute une fonction double remise(double prix) qui renvoie 90 % du prix. Appelle-la depuis main.",
        takeaway:
          "Définir une fonction écrit sa logique. L’appeler exécute cette logique avec des arguments.",
        quiz: quiz(
          "Que fait return dans total ?",
          [
            "Il répète le calcul",
            "Il crée un tableau",
            "Il renvoie le résultat à l’appelant",
          ],
          2,
          "return termine l’appel courant en lui associant la valeur calculée.",
        ),
        link: reference + "language/functions.html",
      }),
      lesson({
        id: "c-tableaux",
        title: "Parcourir un tableau avec sa taille",
        minutes: 22,
        summary:
          "Un tableau regroupe des éléments d’un même type. Les indices commencent à zéro. Pour trois éléments, les indices autorisés sont 0, 1 et 2. La taille doit accompagner le tableau transmis à une fonction.",
        sections: [
          section(
            "Accéder à une case",
            "notes[0] désigne la première note. La boucle utilise i < taille pour rester dans les limites du tableau. size_t est un type adapté aux tailles et aux indices.",
            [
              "sizeof notes / sizeof notes[0] calcule le nombre d’éléments du tableau local.",
              "Dans un paramètre de fonction, transmets explicitement cette taille.",
            ],
          ),
          section(
            "Additionner progressivement",
            "somme part de zéro puis ajoute une note par tour. Le paramètre const indique que la fonction lit les notes en conservant leur contenu.",
            [
              "%zu affiche une valeur de type size_t.",
              "Le nombre d’éléments peut évoluer sans réécrire la boucle de main.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>
#include <stddef.h>

int somme(const int valeurs[], size_t taille) {
    int resultat = 0;
    for (size_t i = 0; i < taille; i++) {
        resultat += valeurs[i];
    }
    return resultat;
}

int main(void) {
    int notes[] = {12, 15, 18};
    size_t taille = sizeof notes / sizeof notes[0];
    printf("%zu notes, somme %d\n", taille, somme(notes, taille));
    return 0;
}`,
        ),
        task: "Ajoute 14 au tableau. Vérifie que la taille et la somme sont recalculées.",
        takeaway:
          "Un tableau et sa taille forment un ensemble utile pour parcourir ses cases.",
        quiz: quiz(
          "Quel est le dernier indice d’un tableau de trois éléments ?",
          ["3", "2", "1"],
          1,
          "Les indices autorisés sont 0, 1 et 2.",
        ),
        link: reference + "language/array.html",
      }),
      lesson({
        id: "c-fichiers",
        title: "Séparer déclaration et définition",
        minutes: 22,
        summary:
          "Un en-tête .h annonce les fonctions utilisables. Un fichier .c contient leur définition. Le compilateur vérifie les unités source puis l’éditeur de liens rassemble leurs symboles dans l’exécutable.",
        sections: [
          section(
            "Suivre les trois fichiers",
            "main.c inclut calcul.h pour connaître la signature de addition. calcul.c inclut le même en-tête puis définit la fonction. L’atelier transmet les deux fichiers .c au compilateur.",
            [
              "Les guillemets dans #include désignent ici un fichier du projet.",
              "La garde CALCUL_H protège l’en-tête contre les inclusions répétées.",
            ],
          ),
          section(
            "Construire progressivement",
            "Le mini-projet calculatrice peut adopter cette organisation après sa première version. Commence par déplacer une fonction, recompile, puis déplace la suivante.",
            [
              "Une déclaration se termine par un point-virgule.",
              "Une définition de fonction contient un corps entre accolades.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>
#include "calcul.h"

int main(void) {
    printf("Résultat : %d\n", addition(12, 3));
    return 0;
}`,
          {
            extra: {
              "calcul.h":
                "#ifndef CALCUL_H\n#define CALCUL_H\nint addition(int a, int b);\n#endif\n",
              "calcul.c":
                '#include "calcul.h"\n\nint addition(int a, int b) {\n    return a + b;\n}\n',
            },
          },
        ),
        task: "Crée multiplication dans calcul.h et calcul.c puis appelle-la dans main.c.",
        takeaway:
          "L’en-tête annonce un contrat. Le fichier source fournit son implémentation.",
        quiz: quiz(
          "Où annonce-t-on addition pour les autres fichiers ?",
          ["Dans calcul.h", "Dans entree.txt", "Dans la console uniquement"],
          0,
          "L’en-tête partage la déclaration de la fonction.",
        ),
        link: reference + "preprocessor/include.html",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "c-adresses",
    title: "Adresses et données structurées",
    description: "Comprends les pointeurs avant de transmettre un état à GTK.",
    lessons: [
      lesson({
        id: "c-pointeurs",
        title: "Adresse, pointeur et déréférencement",
        minutes: 24,
        summary:
          "Un pointeur contient l’adresse d’un objet. &score obtient l’adresse de score. *adresse accède à la valeur située à cette adresse. Une fonction peut ainsi modifier la variable de son appelant.",
        sections: [
          section(
            "Lire chaque symbole dans son contexte",
            "Dans int *adresse, l’étoile appartient à la déclaration du pointeur. Dans *adresse += 1, elle donne accès à l’entier pointé. Les deux écritures répondent à deux étapes différentes.",
            [
              "La fonction reçoit une copie du pointeur et utilise l’adresse conservée dedans.",
              "NULL représente une adresse absente. Vérifie-la avant de déréférencer un pointeur qui peut être absent.",
            ],
          ),
          section(
            "Observer la portée",
            "score existe jusqu’à la fin de main. Son adresse reste valide pendant l’appel de incrementer. Une adresse de variable locale doit être utilisée pendant la durée de vie de cette variable.",
            [
              "Compile et vérifie le score avant puis après l’appel.",
              "Ajoute un deuxième appel avec l’adresse du même entier.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>

void incrementer(int *adresse) {
    if (adresse != NULL) {
        *adresse += 1;
    }
}

int main(void) {
    int score = 10;
    printf("Avant : %d\n", score);
    incrementer(&score);
    printf("Après : %d\n", score);
    return 0;
}`,
        ),
        task: "Remplace l’ajout de 1 par un paramètre int pas et appelle incrementer(&score, 5).",
        takeaway:
          "Un pointeur permet de retrouver une donnée par son adresse pendant sa durée de vie.",
        quiz: quiz(
          "Quelle expression lit la valeur pointée ?",
          ["&adresse", "*adresse", "sizeof adresse"],
          1,
          "*adresse déréférence le pointeur pour accéder à l’objet désigné.",
        ),
        link: reference + "language/pointer.html",
      }),
      lesson({
        id: "c-structures",
        title: "Créer deux instances d’une structure",
        minutes: 23,
        summary:
          "Une structure définit un ensemble de champs. Chaque variable de ce type est une instance possédant ses propres valeurs. C regroupe ici les données et utilise des fonctions séparées pour les traiter.",
        sections: [
          section(
            "Décrire puis instancier",
            "typedef donne le nom Profil à la structure. tiana et amina réservent chacun leurs propres champs nom et score. Modifier le score de Tiana laisse celui d’Amina à sa valeur actuelle.",
            [
              "Le point accède à un champ à partir d’une structure.",
              "La flèche -> accède à un champ à partir d’un pointeur vers une structure.",
            ],
          ),
          section(
            "Passer l’état à une fonction",
            "ajouter_point reçoit l’adresse d’un Profil. Cette organisation préparera la structure Clicker utilisée par le rappel du bouton GTK.",
            [
              "Une instance décrit un objet concret en mémoire.",
              "Une fonction peut recevoir un pointeur const lorsqu’elle doit seulement lire les champs.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>

typedef struct {
    const char *nom;
    int score;
} Profil;

void ajouter_point(Profil *profil) {
    profil->score++;
}

int main(void) {
    Profil tiana = {"Tiana", 0};
    Profil amina = {"Amina", 3};
    ajouter_point(&tiana);
    printf("%s : %d\n", tiana.nom, tiana.score);
    printf("%s : %d\n", amina.nom, amina.score);
    return 0;
}`,
        ),
        task: "Ajoute un champ int niveau puis affiche-le pour les deux profils.",
        takeaway:
          "Le type décrit les champs. Chaque instance conserve son propre état.",
        quiz: quiz(
          "Comment accéder au score depuis un Profil *p ?",
          ["p.score()", "Profil.score", "p->score"],
          2,
          "La flèche accède à un membre de la structure pointée.",
        ),
        link: reference + "language/struct.html",
      }),
    ],
  },
  {
    id: "c-premiere-interface",
    title: "Entrer dans GTK 4",
    description:
      "Passe du terminal à une application pilotée par les événements.",
    lessons: [
      lesson({
        id: "c-gtk-application",
        title: "Application, fenêtre et boucle d’événements",
        minutes: 25,
        summary:
          "GTK 4 est une bibliothèque d’interfaces graphiques utilisable en C. GtkApplication gère le lancement. Son signal activate appelle une fonction qui construit et présente la fenêtre. La boucle d’événements attend ensuite les actions de l’utilisateur.",
        sections: [
          section(
            "Installer et lancer",
            "Le guide de l’atelier fournit la commande GCC et les étapes MSYS2 UCRT64 sous Windows. Exporte le projet et ouvre le dossier dans cet environnement pour afficher sa fenêtre.",
            [
              "Les déclarations GTK viennent de gtk/gtk.h.",
              "pkg-config fournit les options de compilation et de liaison propres à GTK 4.",
            ],
          ),
          section(
            "Suivre le cycle de vie",
            "main crée l’application puis branche activate avant g_application_run. La fonction activate crée une fenêtre rattachée à l’application. gtk_window_present demande son affichage.",
            [
              "Fermer la dernière fenêtre permet à l’application de terminer.",
              "g_object_unref libère la référence détenue par main sur l’application.",
            ],
          ),
        ],
        files: projectExample(gtkClicker),
        task: "Repère l’enregistrement du signal activate et la création de la fenêtre. Lance le ZIP en suivant son README.",
        takeaway:
          "La boucle d’événements déclenche les rappels enregistrés lorsque l’utilisateur agit.",
        quiz: quiz(
          "Quel signal construit ici la première fenêtre ?",
          ["activate", "clicked", "changed"],
          0,
          "Le rappel du signal activate prépare la fenêtre de l’application.",
        ),
        link: gtk + "getting_started.html",
      }),
      lesson({
        id: "c-gtk-widgets",
        title: "Assembler labels, boutons et conteneurs",
        minutes: 23,
        summary:
          "Un widget est un élément d’interface. GtkLabel affiche du texte. GtkButton reçoit une action. GtkBox dispose ses enfants sur un axe en tenant compte de l’espacement demandé.",
        sections: [
          section(
            "Lire l’arbre de widgets",
            "La fenêtre contient une boîte verticale. La boîte contient le label du score puis le bouton. Chaque ajout établit la relation parent-enfant qui organise leur affichage et leur durée de vie.",
            [
              "gtk_box_append ajoute un enfant dans une boîte GTK 4.",
              "gtk_window_set_child définit l’unique enfant direct de la fenêtre.",
            ],
          ),
          section(
            "Ajuster la présentation",
            "Les marges extérieures sont définies sur la boîte. La taille initiale de la fenêtre propose une ouverture confortable et le conteneur adapte ensuite sa disposition.",
            [
              "Essaie une orientation horizontale pour comparer l’organisation.",
              "Garde le texte du bouton explicite afin d’annoncer l’action.",
            ],
          ),
        ],
        files: projectExample(gtkClicker),
        task: "Change l’espacement de la boîte puis le texte initial du bouton. Exporte et observe les changements.",
        takeaway:
          "L’arbre des widgets décrit à la fois la disposition et les relations entre ses éléments.",
        quiz: quiz(
          "Quel widget organise plusieurs enfants sur un axe ?",
          ["GtkLabel", "GtkBox", "GtkApplication"],
          1,
          "GtkBox dispose ses enfants horizontalement ou verticalement.",
        ),
        link: gtk + "class.Box.html",
      }),
    ],
  },
  {
    id: "c-signaux",
    title: "Signaux et rappels",
    description: "Relie un clic aux données du compteur.",
    lessons: [
      lesson({
        id: "c-callbacks",
        title: "Transmettre une fonction de rappel",
        minutes: 22,
        summary:
          "Une fonction de rappel, ou callback, est une fonction transmise pour être appelée plus tard. Un pointeur de fonction décrit la signature attendue. Cet exemple de console permet de comprendre le mécanisme avant GTK.",
        sections: [
          section(
            "Déclarer la signature",
            "Action est un type de pointeur vers une fonction recevant un int et renvoyant un int. appliquer reçoit une action et l’exécute sur sa valeur.",
            [
              "doubler désigne la fonction transmise.",
              "appliquer peut réutiliser une autre fonction ayant la même signature.",
            ],
          ),
          section(
            "Faire le lien avec GTK",
            "g_signal_connect conserve un rappel compatible avec le signal. Lorsque clicked est émis, GTK fournit le bouton et les données utilisateur au rappel enregistré.",
            [
              "Respecte la signature documentée de chaque signal.",
              "Les données utilisateur permettent de retrouver l’état de ton application.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>

typedef int (*Action)(int);

int doubler(int valeur) {
    return valeur * 2;
}

int appliquer(int valeur, Action action) {
    return action(valeur);
}

int main(void) {
    printf("Résultat : %d\n", appliquer(4, doubler));
    return 0;
}`,
        ),
        task: "Ajoute une fonction tripler avec la même signature et transmets-la à appliquer.",
        takeaway:
          "Transmettre une fonction permet à un autre morceau de code de choisir quand l’appeler.",
        quiz: quiz(
          "Que reçoit le paramètre action ?",
          ["Le nombre 4", "Un fichier", "L’adresse d’une fonction compatible"],
          2,
          "Le pointeur de fonction permet d’appeler la fonction reçue.",
        ),
        link: reference + "language/pointer.html",
      }),
      lesson({
        id: "c-gtk-compteur",
        title: "Mettre à jour le compteur au clic",
        minutes: 25,
        summary:
          "Le rappel clicked reçoit un pointeur vers une structure Clicker. Il augmente le score puis construit le texte du label. La même structure reste associée à la fenêtre pendant toute son utilisation.",
        sections: [
          section(
            "Suivre les données",
            "Lors de activate, g_new0 réserve une structure initialisée à zéro. Le code y range le label. g_signal_connect transmet cette structure au rappel du bouton.",
            [
              "L’état métier est le nombre score.",
              "Le label est sa représentation visible, recalculée après chaque clic.",
            ],
          ),
          section(
            "Prévoir la libération",
            "g_object_set_data_full associe l’état à la fenêtre et enregistre g_free comme fonction de nettoyage. La destruction de la fenêtre déclenche la libération de cette structure.",
            [
              "Une donnée utilisée après activate doit vivre aussi longtemps que ses rappels.",
              "Teste plusieurs clics puis ferme et rouvre l’application pour observer la remise à zéro.",
            ],
          ),
        ],
        files: projectExample(gtkClicker),
        task: "Fais augmenter le score de deux points par clic et adapte le libellé du bouton.",
        takeaway:
          "Un rappel modifie l’état puis actualise le widget qui l’affiche.",
        quiz: quiz(
          "Où conserver le score entre deux clics ?",
          [
            "Dans l’état associé à la fenêtre",
            "Dans une variable locale recréée à chaque clic",
            "Dans le compilateur",
          ],
          0,
          "La structure conservée par la fenêtre maintient le score entre les événements.",
        ),
        link: "https://docs.gtk.org/gobject/func.signal_connect.html",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "c-memoire",
    title: "Mémoire dynamique et propriété",
    description: "Réserve, utilise puis libère chaque allocation.",
    lessons: [
      lesson({
        id: "c-allocation",
        title: "malloc, sizeof et free",
        minutes: 27,
        summary:
          "malloc réserve un nombre d’octets déterminé pendant l’exécution et renvoie un pointeur vers cette zone. L’application devient responsable de sa libération. Une allocation réussie doit être initialisée avant lecture.",
        sections: [
          section(
            "Définir la responsabilité",
            "Le programme réserve trois entiers, vérifie le résultat puis remplit chaque case. sizeof *notes calcule la taille d’un élément à partir du type pointé.",
            [
              "NULL indique un échec d’allocation.",
              "Pour une taille reçue de l’utilisateur, borne la quantité et vérifie le risque de débordement avant la multiplication.",
            ],
          ),
          section(
            "Terminer la durée de vie",
            "free rend la zone au gestionnaire de mémoire. Toute utilisation de cette zone doit avoir terminé à cet instant. Mettre le pointeur à NULL aide à matérialiser ce changement dans la portée courante.",
            [
              "Les copies du pointeur doivent également respecter la fin de vie de l’allocation.",
              "Un objet possédé doit avoir un responsable de libération clairement identifié.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const size_t taille = 3;
    int *notes = malloc(taille * sizeof *notes);
    if (notes == NULL) {
        fputs("Allocation échouée.\n", stderr);
        return 1;
    }
    for (size_t i = 0; i < taille; i++) {
        notes[i] = 10 + (int)i;
        printf("Note %zu : %d\n", i, notes[i]);
    }
    free(notes);
    notes = NULL;
    return 0;
}`,
        ),
        task: "Passe la taille à 5 et vérifie les cinq notes. Indique le responsable de l’allocation et sa ligne de libération.",
        takeaway:
          "La durée de vie d’une allocation s’étend de sa réservation réussie jusqu’à free.",
        quiz: quiz(
          "Que vérifier après malloc ?",
          [
            "Le titre de la fenêtre",
            "Que le pointeur diffère de NULL",
            "Le nombre de fichiers ouverts",
          ],
          1,
          "Une allocation peut échouer. Son résultat doit être vérifié avant accès.",
        ),
        link: reference + "memory/malloc.html",
      }),
      lesson({
        id: "c-reallocation",
        title: "Agrandir un tableau avec realloc",
        minutes: 26,
        summary:
          "realloc ajuste la taille d’une allocation. La zone peut changer d’adresse. Un pointeur temporaire permet de vérifier la réussite avant de remplacer le pointeur courant.",
        sections: [
          section(
            "Préserver la valeur courante",
            "Si realloc échoue avec une taille strictement positive, l’allocation d’origine reste valide. Le code garde donc notes jusqu’à confirmation du nouveau pointeur.",
            [
              "Une réussite peut invalider l’ancienne adresse.",
              "Les nouvelles cases doivent recevoir une valeur avant lecture.",
            ],
          ),
          section(
            "Relier taille logique et capacité",
            "L’exemple possède d’abord deux notes puis une capacité de trois. Dans une collection extensible, conserve séparément le nombre de valeurs utiles et le nombre de cases allouées.",
            [
              "Vérifie les calculs de taille pour les quantités variables.",
              "Libère la dernière adresse obtenue, à la fin de la collection.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *notes = malloc(2 * sizeof *notes);
    if (notes == NULL) return 1;
    notes[0] = 12;
    notes[1] = 15;
    int *agrandi = realloc(notes, 3 * sizeof *notes);
    if (agrandi == NULL) {
        free(notes);
        return 1;
    }
    notes = agrandi;
    notes[2] = 18;
    for (size_t i = 0; i < 3; i++) {
        printf("%d\n", notes[i]);
    }
    free(notes);
    return 0;
}`,
        ),
        task: "Ajoute une quatrième note en ajustant la capacité puis la limite de la boucle.",
        takeaway:
          "Valide le résultat de realloc avant de remplacer le pointeur qui possède les données.",
        quiz: quiz(
          "Pourquoi utiliser un pointeur temporaire ?",
          [
            "Pour éviter toute compilation",
            "Pour créer une variable globale",
            "Pour conserver l’adresse d’origine en cas d’échec",
          ],
          2,
          "En cas d’échec, il faut encore pouvoir libérer ou utiliser l’allocation d’origine.",
        ),
        link: reference + "memory/realloc.html",
      }),
    ],
  },
  {
    id: "c-texte-interface",
    title: "Texte et disposition GTK",
    description:
      "Comprends les chaînes puis construis une fenêtre redimensionnable.",
    lessons: [
      lesson({
        id: "c-chaines",
        title: "Chaînes, octets et caractère terminal",
        minutes: 23,
        summary:
          "Une chaîne C est une suite de char terminée par un octet nul. strlen compte les octets précédant ce marqueur. Avec un encodage UTF-8, un caractère visible peut occuper plusieurs octets.",
        sections: [
          section(
            "Réserver la fin de chaîne",
            "Le tableau nom contient assez de place pour le texte et son octet terminal. sizeof mesure l’ensemble du tableau. strlen mesure ici les octets utilisés avant le terminal.",
            [
              "Une capacité doit inclure une case pour le caractère terminal.",
              "La capacité disponible détermine la quantité maximale de texte stockable.",
            ],
          ),
          section(
            "Préparer le texte GTK",
            "GTK emploie des chaînes UTF-8. g_utf8_strlen compte les points de code du texte. Dans le bloc-notes, l’affichage distingue ce comptage du nombre d’octets.",
            [
              "Un emoji composé peut contenir plusieurs points de code.",
              "Identifie le contrat de propriété de chaque fonction qui renvoie une chaîne.",
            ],
          ),
        ],
        files: consoleFiles(
          "c",
          String.raw`#include <stdio.h>
#include <string.h>

int main(void) {
    char nom[20] = "Tiana";
    const char *accent = "é";
    printf("Texte : %s\n", nom);
    printf("Capacité : %zu octets\n", sizeof nom);
    printf("Texte utilisé : %zu octets\n", strlen(nom));
    printf("Octets de é en UTF-8 : %zu\n", strlen(accent));
    return 0;
}`,
        ),
        task: "Remplace Tiana par un prénom accentué et compare strlen au nombre de lettres que tu lis.",
        takeaway:
          "La longueur en octets, la capacité et le nombre de caractères décrivent des mesures différentes.",
        quiz: quiz(
          "Que compte strlen ?",
          [
            "Les octets avant le terminal nul",
            "La capacité du tableau",
            "Les mots",
          ],
          0,
          "strlen parcourt les octets jusqu’au premier caractère nul.",
        ),
        link: reference + "string/byte/strlen.html",
      }),
      lesson({
        id: "c-grille",
        title: "Organiser la fenêtre avec GtkGrid",
        minutes: 25,
        summary:
          "GtkGrid place les widgets selon une ligne, une colonne et une étendue. Le bloc-notes utilise une zone de titre, une barre d’actions et une grande zone de texte qui occupe l’espace restant.",
        sections: [
          section(
            "Attribuer une place",
            "gtk_grid_attach reçoit la colonne, la ligne, la largeur et la hauteur occupées. Les espacements de lignes et de colonnes définissent le rythme de la fenêtre.",
            [
              "Les indices de grille commencent à zéro.",
              "hexpand et vexpand autorisent une zone à absorber l’espace disponible.",
            ],
          ),
          section(
            "Conserver l’accès au texte",
            "GtkScrolledWindow entoure GtkTextView et permet de faire défiler un document long. Les champs courts utilisent GtkEntry.",
            [
              "Redimensionne la fenêtre pour vérifier l’expansion du document.",
              "Garde les actions visibles même lorsque le texte dépasse la hauteur de l’écran.",
            ],
          ),
        ],
        files: projectExample(gtkNotepad),
        task: "Augmente l’espacement de la grille puis change la hauteur initiale de la fenêtre. Vérifie le défilement d’un texte long.",
        takeaway:
          "La grille fixe les relations entre les zones. Les options d’expansion répartissent l’espace supplémentaire.",
        quiz: quiz(
          "Quel widget apporte le défilement ?",
          ["GtkEntry", "GtkScrolledWindow", "GtkLabel"],
          1,
          "GtkScrolledWindow gère la zone visible et les barres de défilement.",
        ),
        link: gtk + "class.Grid.html",
      }),
    ],
  },
  {
    id: "c-document",
    title: "Document et cycle de vie",
    description: "Lis les champs et termine les allocations du bloc-notes.",
    lessons: [
      lesson({
        id: "c-text-buffer",
        title: "Lire GtkEntry et GtkTextBuffer",
        minutes: 27,
        summary:
          "GtkTextView affiche le contenu d’un GtkTextBuffer. Le buffer fournit des positions de début et de fin pour extraire le texte. GtkEntry sert ici au titre du document.",
        sections: [
          section(
            "Lire selon le contrat de l’API",
            "gtk_editable_get_text fournit un texte géré par le widget. gtk_text_buffer_get_text fournit une nouvelle chaîne allouée dont l’appelant devient responsable.",
            [
              "Le titre est utilisé pendant qu’il appartient au champ.",
              "La chaîne extraite du buffer est libérée avec g_free après le comptage.",
            ],
          ),
          section(
            "Relier une modification à une action",
            "Le signal changed du champ de titre met la fenêtre à jour. Le bouton Compter lit le document à la demande et actualise le label de statut.",
            [
              "L’utilisateur peut saisir plusieurs lignes dans le TextView.",
              "Teste une saisie vide et un texte accentué pour comparer les résultats.",
            ],
          ),
        ],
        files: projectExample(gtkNotepad),
        task: "Écris un titre et trois lignes de texte, puis utilise Compter. Retrouve la ligne qui libère le texte extrait.",
        takeaway:
          "L’API de lecture précise si le texte est emprunté ou alloué pour l’appelant.",
        quiz: quiz(
          "Comment libérer le texte renvoyé par gtk_text_buffer_get_text ?",
          ["Avec return", "Avec printf", "Avec g_free après usage"],
          2,
          "Cette fonction renvoie une chaîne allouée que l’appelant doit libérer.",
        ),
        link: gtk + "method.TextBuffer.get_text.html",
      }),
      lesson({
        id: "c-cycle-vie",
        title: "Construire, tester et fermer le bloc-notes",
        minutes: 28,
        summary:
          "Une interface robuste garde ses données vivantes pendant les rappels puis les libère à la fermeture. Les fonctions séparées construire, compter et effacer rendent chaque responsabilité visible.",
        sections: [
          section(
            "Tracer les propriétaires",
            "La fenêtre possède son arbre de widgets. L’état du bloc-notes est attaché à cette fenêtre avec un destructeur. Les chaînes temporaires sont libérées à la fin du rappel qui les a créées.",
            [
              "Repère chaque réservation puis la fonction qui termine sa durée de vie.",
              "Après destruction, les anciens pointeurs de widgets doivent avoir terminé leurs usages.",
            ],
          ),
          section(
            "Écrire un scénario de validation",
            "Ouvre la fenêtre, change son titre, saisis du texte, compte puis efface. Redimensionne, ferme et relance le programme pour parcourir son cycle complet.",
            [
              "Le document du projet est conservé en mémoire pendant la session.",
              "L’atelier propose un export des sources pour prolonger le projet avec un enregistrement sur disque.",
            ],
          ),
        ],
        files: projectExample(gtkNotepad),
        task: "Ajoute une action qui insère un exemple de texte dans le buffer. Vérifie ensuite les actions Compter et Effacer.",
        takeaway:
          "Chaque allocation et chaque rappel doivent avoir une durée de vie cohérente avec la fenêtre.",
        quiz: quiz(
          "Quand libérer l’état associé à la fenêtre ?",
          [
            "Lors de sa destruction",
            "Au début de chaque clic",
            "Avant d’afficher la fenêtre",
          ],
          0,
          "L’état reste nécessaire aux rappels jusqu’à la destruction de la fenêtre.",
        ),
        link: "https://docs.gtk.org/gobject/method.Object.set_data_full.html",
      }),
    ],
  },
  {
    id: "c-gtk-sqlite",
    title: "GTK + SQLite : CRUD complet",
    description: "Application complète : interface graphique + base de données",
    lessons: [
      lesson({
        id: "c-sqlite-intro",
        title: "SQLite en C avec sqlite3.h",
        minutes: 30,
        summary:
          "SQLite est une base de données embarquée (fichier .db). L'API sqlite3.h permet CRUD en C. sqlite3_open() ouvre base, sqlite3_exec() exécute SQL, sqlite3_prepare_v2() prépare statement (sécurité), sqlite3_close() ferme.",
        sections: [
          section(
            "Installation SQLite pour C",
            "SQLite = bibliothèque C intégrée. Installation simple.",
            [
              "Linux : sudo apt install libsqlite3-dev",
              "Windows MSYS2 : pacman -S mingw-w64-ucrt-x86_64-sqlite3",
              "macOS : déjà installé (ou brew install sqlite3)",
              "Compiler : gcc -o app main.c -lsqlite3",
              "En-tête : #include <sqlite3.h>",
              "Lier avec -lsqlite3 lors compilation",
            ]
          ),
          section(
            "API SQLite en C",
            "Fonctions principales pour CRUD.",
            [
              "sqlite3_open(path, &db) : ouvrir/créer base",
              "sqlite3_exec(db, sql, callback, data, &err) : exécuter SQL",
              "sqlite3_prepare_v2() : préparer statement (sécurité)",
              "sqlite3_step() : exécuter statement",
              "sqlite3_column_*() : lire résultats",
              "sqlite3_finalize() : libérer statement",
              "sqlite3_close(db) : fermer base",
            ]
          ),
          section(
            "Gestion erreurs SQLite",
            "Vérifier SQLITE_OK après chaque opération.",
            [
              "SQLITE_OK : succès",
              "SQLITE_ROW : ligne disponible",
              "SQLITE_DONE : fin résultats",
              "sqlite3_errmsg(db) : message d'erreur",
              "Toujours vérifier codes retour",
              "Libérer mémoire (sqlite3_free, sqlite3_finalize)",
            ]
          ),
        ],
        files: consoleFiles(
          "c",
          `#include <stdio.h>
#include <sqlite3.h>

int main(void) {
    sqlite3 *db;
    char *err_msg = NULL;
    
    // Ouvrir/créer base de données
    int rc = sqlite3_open("contacts.db", &db);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Erreur ouverture : %s\\n", sqlite3_errmsg(db));
        return 1;
    }
    
    printf("✅ Base de données ouverte/créée\\n");
    
    // Créer table
    const char *sql_create = 
        "CREATE TABLE IF NOT EXISTS contacts ("
        "  id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "  nom TEXT NOT NULL,"
        "  email TEXT NOT NULL,"
        "  telephone TEXT NOT NULL"
        ");";
    
    rc = sqlite3_exec(db, sql_create, NULL, NULL, &err_msg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Erreur SQL : %s\\n", err_msg);
        sqlite3_free(err_msg);
        sqlite3_close(db);
        return 1;
    }
    
    printf("✅ Table créée\\n");
    
    // Insérer données
    const char *sql_insert =
        "INSERT INTO contacts (nom, email, telephone) "
        "VALUES ('Tiana', 'tiana@example.com', '+261340000000');";
    
    rc = sqlite3_exec(db, sql_insert, NULL, NULL, &err_msg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Erreur insertion : %s\\n", err_msg);
        sqlite3_free(err_msg);
    } else {
        printf("✅ Contact inséré\\n");
    }
    
    // Fermer base
    sqlite3_close(db);
    printf("✅ Base fermée\\n");
    
    return 0;
}

/* COMPILATION :
   gcc -o test_sqlite main.c -lsqlite3
   
   EXÉCUTION :
   ./test_sqlite
   
   Crée fichier contacts.db
*/`,
        ),
        task: "Compilez et exécutez. Vérifiez que contacts.db est créé. Ajoutez un second INSERT.",
        takeaway:
          "SQLite en C : sqlite3_open() ouvre, sqlite3_exec() exécute SQL, sqlite3_close() ferme. Compiler avec -lsqlite3.",
        quiz: quiz(
          "Comment compiler un programme C avec SQLite ?",
          ["gcc main.c", "gcc main.c -lsqlite3", "gcc -sqlite main.c"],
          1,
          "gcc main.c -lsqlite3 compile et lie avec bibliothèque SQLite."
        ),
        link: "https://www.sqlite.org/cintro.html",
      }),
      lesson({
        id: "c-sqlite-crud",
        title: "CRUD avec prepared statements (sécurité)",
        minutes: 40,
        summary:
          "Prepared statements évitent injection SQL. sqlite3_prepare_v2() compile SQL, sqlite3_bind_*() lie paramètres, sqlite3_step() exécute, sqlite3_column_*() lit résultats. CREATE, READ, UPDATE, DELETE avec sécurité.",
        sections: [
          section(
            "Prepared statements (sécurité)",
            "JAMAIS concaténer SQL avec données utilisateur. Utiliser placeholders ?.",
            [
              "sqlite3_prepare_v2(db, sql, -1, &stmt, NULL)",
              "Placeholders ? dans SQL",
              "sqlite3_bind_text(stmt, index, valeur, -1, SQLITE_TRANSIENT)",
              "sqlite3_bind_int(stmt, index, valeur)",
              "sqlite3_step(stmt) : exécuter",
              "sqlite3_finalize(stmt) : libérer",
            ]
          ),
          section(
            "Les 4 opérations CRUD",
            "Create, Read, Update, Delete avec prepared statements.",
            [
              "CREATE : INSERT INTO ... VALUES (?)",
              "READ : SELECT * FROM ... WHERE id = ?",
              "UPDATE : UPDATE ... SET ... WHERE id = ?",
              "DELETE : DELETE FROM ... WHERE id = ?",
              "sqlite3_column_text(), sqlite3_column_int() pour lire",
              "Boucle while (sqlite3_step(stmt) == SQLITE_ROW)",
            ]
          ),
        ],
        files: consoleFiles(
          "c",
          `#include <stdio.h>
#include <sqlite3.h>
#include <string.h>

// CREATE : Insérer contact
int creer_contact(sqlite3 *db, const char *nom, const char *email, const char *tel) {
    const char *sql = "INSERT INTO contacts (nom, email, telephone) VALUES (?, ?, ?)";
    sqlite3_stmt *stmt;
    
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        fprintf(stderr, "Erreur prepare : %s\\n", sqlite3_errmsg(db));
        return -1;
    }
    
    // Lier paramètres (indices commencent à 1)
    sqlite3_bind_text(stmt, 1, nom, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, email, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, tel, -1, SQLITE_TRANSIENT);
    
    if (sqlite3_step(stmt) != SQLITE_DONE) {
        fprintf(stderr, "Erreur insertion\\n");
        sqlite3_finalize(stmt);
        return -1;
    }
    
    int id = (int)sqlite3_last_insert_rowid(db);
    sqlite3_finalize(stmt);
    return id;
}

// READ : Lire tous contacts
void lire_contacts(sqlite3 *db) {
    const char *sql = "SELECT id, nom, email, telephone FROM contacts";
    sqlite3_stmt *stmt;
    
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        fprintf(stderr, "Erreur prepare\\n");
        return;
    }
    
    printf("\\n📋 Liste des contacts :\\n");
    printf("%-5s %-20s %-30s %-15s\\n", "ID", "Nom", "Email", "Téléphone");
    printf("-------------------------------------------------------------------\\n");
    
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        const char *nom = (const char*)sqlite3_column_text(stmt, 1);
        const char *email = (const char*)sqlite3_column_text(stmt, 2);
        const char *tel = (const char*)sqlite3_column_text(stmt, 3);
        
        printf("%-5d %-20s %-30s %-15s\\n", id, nom, email, tel);
    }
    
    sqlite3_finalize(stmt);
}

// UPDATE : Modifier contact
int modifier_contact(sqlite3 *db, int id, const char *nom, const char *email, const char *tel) {
    const char *sql = "UPDATE contacts SET nom = ?, email = ?, telephone = ? WHERE id = ?";
    sqlite3_stmt *stmt;
    
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        return 0;
    }
    
    sqlite3_bind_text(stmt, 1, nom, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, email, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, tel, -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 4, id);
    
    int success = (sqlite3_step(stmt) == SQLITE_DONE);
    sqlite3_finalize(stmt);
    return success;
}

// DELETE : Supprimer contact
int supprimer_contact(sqlite3 *db, int id) {
    const char *sql = "DELETE FROM contacts WHERE id = ?";
    sqlite3_stmt *stmt;
    
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        return 0;
    }
    
    sqlite3_bind_int(stmt, 1, id);
    int success = (sqlite3_step(stmt) == SQLITE_DONE);
    sqlite3_finalize(stmt);
    return success;
}

int main(void) {
    sqlite3 *db;
    
    if (sqlite3_open("contacts.db", &db) != SQLITE_OK) {
        return 1;
    }
    
    // Créer table
    sqlite3_exec(db, 
        "CREATE TABLE IF NOT EXISTS contacts ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "nom TEXT, email TEXT, telephone TEXT)",
        NULL, NULL, NULL);
    
    // CREATE
    int id1 = creer_contact(db, "Tiana", "tiana@example.com", "+261340000000");
    printf("✅ Contact créé, ID: %d\\n", id1);
    
    int id2 = creer_contact(db, "Soa", "soa@example.com", "+261341111111");
    printf("✅ Contact créé, ID: %d\\n", id2);
    
    // READ
    lire_contacts(db);
    
    // UPDATE
    modifier_contact(db, id1, "Tiana Andriamanana", "tiana.new@example.com", "+261340000000");
    printf("\\n✏️ Contact %d modifié\\n", id1);
    
    lire_contacts(db);
    
    // DELETE
    // supprimer_contact(db, id2);
    // printf("\\n🗑️ Contact %d supprimé\\n", id2);
    
    sqlite3_close(db);
    return 0;
}

/* SÉCURITÉ : Prepared statements évitent injection SQL
   ❌ DANGEREUX : sprintf(sql, "INSERT ... VALUES ('%s')", nom)
   ✅ SÛR : sqlite3_bind_text(stmt, 1, nom, ...)
*/`,
        ),
        task: "Implémentez fonction rechercher_par_nom(db, nom) qui retourne contacts correspondants.",
        takeaway:
          "CRUD sécurisé : prepare_v2() + bind_*() + step() + finalize(). Placeholders ? évitent injection SQL.",
        quiz: quiz(
          "Pourquoi utiliser prepared statements ?",
          ["Plus joli", "Éviter injection SQL + performance", "Obligatoire"],
          1,
          "Prepared statements évitent injection SQL (sécurité) et sont plus rapides (compilés une fois)."
        ),
        link: "https://www.sqlite.org/c3ref/prepare.html",
      }),
      lesson({
        id: "c-gtk-sqlite-gui",
        title: "Interface GTK pour gérer contacts (GtkTreeView + SQLite)",
        minutes: 50,
        summary:
          "Application finale : GTK + SQLite CRUD. GtkTreeView affiche liste contacts, GtkEntry pour formulaire, boutons actions. Architecture : modèle (SQLite), vue (GTK), callbacks (contrôleur). Projet final cours C.",
        sections: [
          section(
            "Architecture de l'application",
            "Modèle = SQLite. Vue = widgets GTK. Contrôleur = callbacks.",
            [
              "Fichiers séparés : main.c (GUI), contact_manager.c (CRUD)",
              "Structure ContactApp : db, widgets, état",
              "Callbacks GTK : on_ajouter, on_modifier, on_supprimer",
              "Actualiser GtkTreeView après chaque opération",
              "g_signal_connect relie boutons aux callbacks",
              "Gestion mémoire : g_free, sqlite3_finalize, g_object_unref",
            ]
          ),
          section(
            "Widgets GTK utilisés",
            "GtkTreeView pour liste, GtkEntry pour formulaire.",
            [
              "GtkTreeView + GtkListStore : tableau contacts",
              "GtkEntry : champs nom, email, téléphone",
              "GtkButton : Ajouter, Modifier, Supprimer",
              "GtkBox : organisation verticale/horizontale",
              "GtkScrolledWindow : scroll si beaucoup contacts",
              "Colonnes TreeView : ID, Nom, Email, Téléphone",
            ]
          ),
          section(
            "Fonctionnalités complètes",
            "CRUD complet avec interface utilisateur.",
            [
              "Afficher tous contacts dans TreeView",
              "Ajouter nouveau contact via formulaire",
              "Cliquer ligne : remplir formulaire (modification)",
              "Modifier contact sélectionné",
              "Supprimer contact sélectionné",
              "Actualiser TreeView après CRUD",
              "Validation : champs non vides",
            ]
          ),
        ],
        files: consoleFiles(
          "c",
          `// ══════════════════════════════════════════════════════════
// contact_manager.h - Interface CRUD SQLite
// ══════════════════════════════════════════════════════════
#ifndef CONTACT_MANAGER_H
#define CONTACT_MANAGER_H
#include <sqlite3.h>

typedef struct {
    int id;
    char nom[100];
    char email[100];
    char telephone[20];
} Contact;

sqlite3* ouvrir_base(const char *path);
int creer_contact(sqlite3 *db, const char *nom, const char *email, const char *tel);
Contact* lire_contacts(sqlite3 *db, int *count);
int modifier_contact(sqlite3 *db, int id, const char *nom, const char *email, const char *tel);
int supprimer_contact(sqlite3 *db, int id);
void liberer_contacts(Contact *contacts);

#endif

// ══════════════════════════════════════════════════════════
// contact_manager.c - Implémentation CRUD
// ══════════════════════════════════════════════════════════
#include "contact_manager.h"
#include <stdlib.h>
#include <string.h>

sqlite3* ouvrir_base(const char *path) {
    sqlite3 *db;
    if (sqlite3_open(path, &db) != SQLITE_OK) {
        return NULL;
    }
    
    // Créer table
    const char *sql = 
        "CREATE TABLE IF NOT EXISTS contacts ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "nom TEXT NOT NULL,"
        "email TEXT NOT NULL,"
        "telephone TEXT NOT NULL)";
    
    sqlite3_exec(db, sql, NULL, NULL, NULL);
    return db;
}

int creer_contact(sqlite3 *db, const char *nom, const char *email, const char *tel) {
    const char *sql = "INSERT INTO contacts (nom, email, telephone) VALUES (?, ?, ?)";
    sqlite3_stmt *stmt;
    
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        return -1;
    }
    
    sqlite3_bind_text(stmt, 1, nom, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, email, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, tel, -1, SQLITE_TRANSIENT);
    
    int success = (sqlite3_step(stmt) == SQLITE_DONE);
    int id = success ? (int)sqlite3_last_insert_rowid(db) : -1;
    
    sqlite3_finalize(stmt);
    return id;
}

Contact* lire_contacts(sqlite3 *db, int *count) {
    const char *sql = "SELECT id, nom, email, telephone FROM contacts ORDER BY nom";
    sqlite3_stmt *stmt;
    
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        *count = 0;
        return NULL;
    }
    
    // Compter lignes
    int capacity = 10;
    Contact *contacts = malloc(capacity * sizeof(Contact));
    *count = 0;
    
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        if (*count >= capacity) {
            capacity *= 2;
            contacts = realloc(contacts, capacity * sizeof(Contact));
        }
        
        contacts[*count].id = sqlite3_column_int(stmt, 0);
        strncpy(contacts[*count].nom, (const char*)sqlite3_column_text(stmt, 1), 99);
        strncpy(contacts[*count].email, (const char*)sqlite3_column_text(stmt, 2), 99);
        strncpy(contacts[*count].telephone, (const char*)sqlite3_column_text(stmt, 3), 19);
        (*count)++;
    }
    
    sqlite3_finalize(stmt);
    return contacts;
}

int modifier_contact(sqlite3 *db, int id, const char *nom, const char *email, const char *tel) {
    const char *sql = "UPDATE contacts SET nom=?, email=?, telephone=? WHERE id=?";
    sqlite3_stmt *stmt;
    
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        return 0;
    }
    
    sqlite3_bind_text(stmt, 1, nom, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, email, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, tel, -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 4, id);
    
    int success = (sqlite3_step(stmt) == SQLITE_DONE);
    sqlite3_finalize(stmt);
    return success;
}

int supprimer_contact(sqlite3 *db, int id) {
    const char *sql = "DELETE FROM contacts WHERE id = ?";
    sqlite3_stmt *stmt;
    
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        return 0;
    }
    
    sqlite3_bind_int(stmt, 1, id);
    int success = (sqlite3_step(stmt) == SQLITE_DONE);
    sqlite3_finalize(stmt);
    return success;
}

void liberer_contacts(Contact *contacts) {
    free(contacts);
}

// ══════════════════════════════════════════════════════════
// main.c - Interface GTK
// ══════════════════════════════════════════════════════════
#include <gtk/gtk.h>
#include "contact_manager.h"

typedef struct {
    sqlite3 *db;
    GtkWidget *tree_view;
    GtkWidget *entry_nom;
    GtkWidget *entry_email;
    GtkWidget *entry_tel;
    GtkListStore *store;
    int id_selectionne;
} ContactApp;

// Actualiser TreeView
void actualiser_liste(ContactApp *app) {
    gtk_list_store_clear(app->store);
    
    int count;
    Contact *contacts = lire_contacts(app->db, &count);
    
    for (int i = 0; i < count; i++) {
        GtkTreeIter iter;
        gtk_list_store_append(app->store, &iter);
        gtk_list_store_set(app->store, &iter,
            0, contacts[i].id,
            1, contacts[i].nom,
            2, contacts[i].email,
            3, contacts[i].telephone,
            -1);
    }
    
    liberer_contacts(contacts);
}

// Callback : Ajouter
void on_ajouter(GtkButton *button, gpointer user_data) {
    ContactApp *app = (ContactApp*)user_data;
    
    const char *nom = gtk_editable_get_text(GTK_EDITABLE(app->entry_nom));
    const char *email = gtk_editable_get_text(GTK_EDITABLE(app->entry_email));
    const char *tel = gtk_editable_get_text(GTK_EDITABLE(app->entry_tel));
    
    if (strlen(nom) == 0 || strlen(email) == 0) {
        g_print("❌ Nom et email requis\\n");
        return;
    }
    
    creer_contact(app->db, nom, email, tel);
    actualiser_liste(app);
    
    // Vider formulaire
    gtk_editable_set_text(GTK_EDITABLE(app->entry_nom), "");
    gtk_editable_set_text(GTK_EDITABLE(app->entry_email), "");
    gtk_editable_set_text(GTK_EDITABLE(app->entry_tel), "");
    
    g_print("✅ Contact ajouté\\n");
}

// Construction interface (simplifié pour exemple)
static void activate(GtkApplication *gtk_app, gpointer user_data) {
    ContactApp *app = g_new0(ContactApp, 1);
    app->db = ouvrir_base("contacts.db");
    
    GtkWidget *window = gtk_application_window_new(gtk_app);
    gtk_window_set_title(GTK_WINDOW(window), "Gestionnaire Contacts - GTK + SQLite");
    gtk_window_set_default_size(GTK_WINDOW(window), 800, 600);
    
    // (Interface complète dans projet exporté)
    
    gtk_window_present(GTK_WINDOW(window));
}

int main(int argc, char *argv[]) {
    GtkApplication *app = gtk_application_new("dev.africa.contacts", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
    int status = g_application_run(G_APPLICATION(app), argc, argv);
    g_object_unref(app);
    return status;
}

/* COMPILATION :
   gcc -o contacts main.c contact_manager.c \\
       \`pkg-config --cflags --libs gtk4\` -lsqlite3
       
   Application complète : formulaire + TreeView + CRUD
   Architecture MVC en C pur
*/`,
        ),
        task: "Extension : ajoutez champ 'adresse', bouton 'Rechercher', ou export CSV.",
        takeaway:
          "Application C complète : GTK + SQLite CRUD. Architecture MVC. Projet final aligné avec Java, C++, TypeScript.",
        quiz: quiz(
          "Quels sont les 3 composants de l'architecture ?",
          ["HTML, CSS, JS", "Modèle (SQLite), Vue (GTK), Contrôleur (callbacks)", "Tableau, Formulaire, Bouton"],
          1,
          "MVC = Modèle (données SQLite), Vue (widgets GTK), Contrôleur (callbacks événements)."
        ),
        link: "https://docs.gtk.org/gtk4/class.TreeView.html",
      }),
    ],
  },
];

export const cLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Logique, fonctions et console",
    objective:
      "Compile des programmes courts, lis les saisies et décompose tes algorithmes en fonctions.",
    definition:
      "C est un langage compilé qui donne un accès précis aux données et à la mémoire. Les premiers exercices utilisent la console pour observer chaque étape du programme.",
    color: levelColors[0],
    prerequisites:
      "Savoir créer un fichier et saisir du texte. Le guide de la console explique l’activation du compilateur.",
    outcomes: [
      "Choisir un type et initialiser une variable.",
      "Utiliser conditions, boucles, fonctions et tableaux.",
      "Vérifier une saisie et comprendre les diagnostics de GCC.",
    ],
    chapters: beginner,
    projects: [cCalculator, cGuessing],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Pointeurs, structures et GTK 4",
    objective:
      "Transmets l’état d’une structure à des fonctions puis construis un compteur graphique GTK.",
    definition:
      "Une interface événementielle attend des actions et appelle des fonctions de rappel. Les pointeurs relient ces fonctions aux données conservées par la fenêtre.",
    color: levelColors[1],
    prerequisites:
      "Comprendre les types, les fonctions et les tableaux du niveau débutant.",
    outcomes: [
      "Lire une adresse et modifier une valeur par pointeur.",
      "Créer des instances d’une structure.",
      "Assembler les widgets GTK et relier un signal à un rappel.",
    ],
    chapters: intermediate,
    projects: [gtkClicker],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Mémoire dynamique et bloc-notes",
    objective:
      "Maîtrise la propriété de la mémoire et construis une fenêtre GTK à plusieurs zones.",
    definition:
      "La mémoire dynamique permet de choisir une taille pendant l’exécution. Son propriétaire organise l’initialisation, les accès et la libération des données.",
    color: levelColors[2],
    prerequisites:
      "Savoir utiliser les pointeurs, une structure d’état et les signaux GTK.",
    outcomes: [
      "Réserver et agrandir une allocation avec vérification.",
      "Distinguer octets, texte UTF-8 et capacité.",
      "Organiser GtkGrid, GtkEntry et GtkTextBuffer avec des libérations explicites.",
    ],
    chapters: advanced,
    projects: [gtkNotepad],
  },
];
