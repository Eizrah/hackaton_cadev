import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { cppBank, qtEmployees, qtProgressProject } from "./cppProjects";
import type { WebLevel } from "./webCourseTypes";

const docs = "https://en.cppreference.com/w/cpp/";
const qt = "https://doc.qt.io/qt-6/";

const beginner: WebLevel["chapters"] = [
  {
    id: "cpp-console",
    title: "Fondations du C++",
    description: "Compile, manipule les types puis dirige ton programme.",
    lessons: [
      lesson({
        id: "cpp-demarrer",
        title: "Source, compilation et flux de sortie",
        minutes: 17,
        summary:
          "C++ est un langage compilé qui permet plusieurs styles de programmation, dont la programmation orientée objet. Le compilateur traduit le fichier main.cpp en exécutable. std::cout est le flux standard utilisé pour écrire dans la console.",
        sections: [
          section(
            "Comprendre l’organisation",
            "#include <iostream> rend disponibles les déclarations des flux. main est le point d’entrée. std:: désigne le namespace de la bibliothèque standard.",
            [
              "L’opérateur << insère une valeur dans le flux de sortie.",
              "Le caractère '\\n' termine une ligne.",
            ],
          ),
          section(
            "Observer les types",
            "int exprime ici une quantité entière et double un prix à virgule. Le flux sait afficher ces types. const indique qu’une valeur doit rester fixe pendant sa durée de vie.",
            [
              "Les accolades délimitent les blocs.",
              "Choisis des noms qui expriment le rôle des données.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>

int main() {
    const double prix = 2500.0;
    int quantite = 3;
    std::cout << "Bonjour DevAfrica !\n";
    std::cout << "Total : " << prix * quantite << " Ar\n";
    return 0;
}`,
        ),
        task: "Change la quantité, prédis le total puis compile. Ajoute une ligne présentant ton objectif d’apprentissage.",
        takeaway:
          "Un fichier C++ est compilé avant son exécution. Les flux affichent les valeurs du programme.",
        quiz: quiz(
          "Que désigne std::cout ?",
          [
            "Le flux standard de sortie",
            "Une classe de fenêtre",
            "Le compilateur",
          ],
          0,
          "std::cout écrit sur la sortie standard, visible dans la console de l’atelier.",
        ),
        link: docs + "io/cout.html",
      }),
      lesson({
        id: "cpp-entrees",
        title: "Lire les nombres et le texte",
        minutes: 20,
        summary:
          "std::cin lit l’entrée standard. L’opérateur >> extrait une valeur selon son type et indique si la lecture a réussi. std::getline lit une ligne entière dans une std::string, y compris les espaces.",
        sections: [
          section(
            "Saisir dans l’atelier",
            "Prépare le nom sur une ligne puis la quantité sur la suivante dans Entrée standard. Le programme reçoit ces caractères au lancement et consomme les données dans l’ordre des lectures.",
            [
              "std::string possède son texte et en gère la mémoire.",
              "Teste le résultat de la lecture avant d’utiliser sa variable.",
            ],
          ),
          section(
            "Respecter les séparateurs",
            "Une extraction numérique laisse généralement le retour à la ligne dans le flux. Lire le nom en premier simplifie cet exemple. Après une lecture numérique, std::getline(std::cin >> std::ws, nom) convient à un nom dont on souhaite ignorer les espaces initiaux.",
            [
              "Une lecture invalide place le flux en état d’échec.",
              "Une règle métier doit ensuite contrôler la valeur convertie.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>
#include <string>

int main() {
    std::string nom;
    int quantite;
    if (!std::getline(std::cin, nom) || nom.empty()) {
        std::cerr << "Saisis un nom.\n";
        return 1;
    }
    if (!(std::cin >> quantite) || quantite < 0) {
        std::cerr << "Saisis une quantité entière positive ou nulle.\n";
        return 1;
    }
    std::cout << nom << " commande " << quantite << " articles.\n";
}`,
          { stdin: "Tiana Rakoto\n3\n" },
        ),
        task: "Entre un prénom composé et une quantité. Essaie ensuite un mot à la place du nombre.",
        takeaway:
          "Une extraction vérifiée transforme le texte d’entrée en donnée utilisable.",
        quiz: quiz(
          "Quelle fonction lit une ligne complète ?",
          ["std::cout", "std::getline", "sizeof"],
          1,
          "std::getline conserve les espaces à l’intérieur de la ligne lue.",
        ),
        link: docs + "string/basic_string/getline.html",
      }),
      lesson({
        id: "cpp-conditions-boucles",
        title: "Conditions et boucles",
        minutes: 22,
        summary:
          "if sélectionne un traitement selon une condition. for exprime une répétition avec un compteur. Une condition se lit comme une proposition sur les valeurs courantes du programme.",
        sections: [
          section(
            "Suivre chaque tour",
            "La boucle parcourt les entiers de 1 à 5. Le reste de la division par deux, calculé avec %, permet de distinguer les valeurs paires et impaires.",
            [
              "== compare deux valeurs et = affecte une valeur.",
              "i++ augmente le compteur de un après le bloc.",
            ],
          ),
          section(
            "Relier l’algorithme à un menu",
            "Le compte bancaire utilise while pour lire plusieurs commandes. Chaque commande appelle l’opération correspondante et un choix dédié termine la session.",
            [
              "Prévois une condition d’arrêt accessible.",
              "Teste une valeur limite puis une valeur juste de l’autre côté de la limite.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>

int main() {
    for (int i = 1; i <= 5; i++) {
        if (i % 2 == 0) {
            std::cout << i << " est pair\n";
        } else {
            std::cout << i << " est impair\n";
        }
    }
}`,
        ),
        task: "Étends la boucle jusqu’à 10 puis affiche un message distinct pour les multiples de trois.",
        takeaway:
          "Le compteur décrit l’avancement et la condition choisit le traitement de chaque étape.",
        quiz: quiz(
          "Que calcule i % 2 ?",
          [
            "Le carré de i",
            "La moitié exacte de i",
            "Le reste de la division entière par 2",
          ],
          2,
          "Un reste nul indique que l’entier est pair.",
        ),
        link: docs + "language/for.html",
      }),
    ],
  },
  {
    id: "cpp-fonctions",
    title: "Fonctions, références et collections",
    description: "Rends tes traitements réutilisables avant les classes.",
    lessons: [
      lesson({
        id: "cpp-fonctions",
        title: "Définir, appeler et renvoyer une valeur",
        minutes: 22,
        summary:
          "Une fonction rassemble un traitement sous un nom. Son type de retour annonce le résultat. Les paramètres constituent ses données d’entrée et chaque appel fournit les arguments correspondants.",
        sections: [
          section(
            "Comprendre la copie",
            "Dans aire, largeur et hauteur sont des paramètres reçus par valeur. Chaque appel calcule son propre résultat. main peut le stocker puis l’afficher.",
            [
              "double annonce un résultat à virgule.",
              "return transmet une valeur à l’appelant.",
            ],
          ),
          section(
            "Rendre le calcul observable",
            "Essaie plusieurs rectangles dont tu peux vérifier la surface à la main. Un calcul court est plus simple à vérifier lorsqu’il est séparé de la lecture et de l’affichage.",
            [
              "Le nom d’une fonction exprime sa responsabilité.",
              "Les arguments sont associés aux paramètres dans l’ordre de la signature.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>

double aire(double largeur, double hauteur) {
    return largeur * hauteur;
}

int main() {
    const double surface = aire(4.0, 3.0);
    std::cout << "Surface : " << surface << " m²\n";
    std::cout << "Autre surface : " << aire(2.5, 2.0) << " m²\n";
}`,
        ),
        task: "Écris une fonction perimetre avec deux paramètres double et affiche son résultat pour les mêmes dimensions.",
        takeaway:
          "La signature présente les entrées et le résultat de la fonction.",
        quiz: quiz(
          "Dans aire(4.0, 3.0), que sont 4.0 et 3.0 ?",
          [
            "Les arguments de l’appel",
            "Les noms des paramètres",
            "Des références de fenêtre",
          ],
          0,
          "L’appel fournit les valeurs reçues par largeur et hauteur.",
        ),
        link: docs + "language/functions.html",
      }),
      lesson({
        id: "cpp-references",
        title: "Copie, référence et const",
        minutes: 24,
        summary:
          "Une référence est un autre nom pour un objet existant. Un paramètre int& autorise une fonction à modifier l’entier de l’appelant. Une référence const permet de lire un objet en conservant son contenu.",
        sections: [
          section(
            "Comparer les effets",
            "incrementer modifie l’entier original. saluer reçoit une référence constante sur une chaîne pour la lire. La durée de vie de l’objet doit couvrir l’utilisation de sa référence.",
            [
              "Une référence doit être initialisée lors de sa création.",
              "Les pointeurs conviennent aussi aux objets optionnels et peuvent représenter une adresse absente.",
            ],
          ),
          section(
            "Choisir une intention claire",
            "Pour de petits nombres, un passage par valeur reste simple. Une référence modifiable doit être réservée aux fonctions qui annoncent une modification de l’objet fourni.",
            [
              "Repère & dans la signature et observe l’effet après l’appel.",
              "const std::string& est utilisé dans les accesseurs du compte bancaire.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>
#include <string>

void incrementer(int& valeur) {
    valeur++;
}

void saluer(const std::string& nom) {
    std::cout << "Bonjour " << nom << '\n';
}

int main() {
    int score = 2;
    incrementer(score);
    saluer("Amina");
    std::cout << "Score : " << score << '\n';
}`,
        ),
        task: "Ajoute une version incrementerCopie(int valeur) et compare les effets des deux fonctions sur score.",
        takeaway:
          "La référence donne accès à l’objet original. const précise un accès en lecture.",
        quiz: quiz(
          "Quel paramètre autorise la modification de l’entier reçu ?",
          ["int valeur", "int& valeur", "const int& valeur"],
          1,
          "int& est une référence modifiable sur l’entier de l’appelant.",
        ),
        link: docs + "language/reference.html",
      }),
    ],
  },
  {
    id: "cpp-objets",
    title: "Classes et instances",
    description:
      "Construis plusieurs objets avec un état propre et des opérations publiques.",
    lessons: [
      lesson({
        id: "cpp-classe",
        title: "Décrire une classe et protéger ses attributs",
        minutes: 25,
        summary:
          "Une classe définit les données et les opérations d’un type. Ses attributs privés gardent l’état. Ses méthodes publiques présentent les actions autorisées et peuvent vérifier les valeurs avant de modifier l’objet.",
        sections: [
          section(
            "Lire le contrat",
            "Compteur propose ajouter et valeur. L’attribut valeur_ est privé. L’utilisateur de la classe appelle une méthode pour demander une modification.",
            [
              "public ouvre l’accès depuis l’appelant.",
              "private réserve l’accès aux membres de la classe et à ses amis déclarés.",
            ],
          ),
          section(
            "Observer une instance",
            "La déclaration Compteur score crée un objet concret. Le point permet d’appeler une méthode sur cette instance. valeur() const annonce une lecture de l’état.",
            [
              "Le champ valeur_ est initialisé à zéro.",
              "La méthode ajouter applique une règle sur le nombre de points reçu.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>

class Compteur {
public:
    void ajouter(int points) {
        if (points > 0) valeur_ += points;
    }
    int valeur() const { return valeur_; }
private:
    int valeur_ = 0;
};

int main() {
    Compteur score;
    score.ajouter(3);
    std::cout << "Score : " << score.valeur() << '\n';
}`,
        ),
        task: "Ajoute une méthode reinitialiser qui remet valeur_ à zéro, puis vérifie son effet dans la console.",
        takeaway:
          "La classe décrit le type. L’instance possède les valeurs sur lesquelles les méthodes travaillent.",
        quiz: quiz(
          "Qui peut accéder directement à valeur_ dans cet exemple ?",
          [
            "Toutes les fonctions",
            "Le compilateur uniquement",
            "Les membres de Compteur",
          ],
          2,
          "private contrôle l’accès direct à cet attribut.",
        ),
        link: docs + "language/classes.html",
      }),
      lesson({
        id: "cpp-constructeur-instances",
        title: "Initialiser deux instances avec un constructeur",
        minutes: 26,
        summary:
          "Un constructeur initialise un nouvel objet. Il porte le nom de la classe. Deux constructions produisent deux états distincts, même si les objets utilisent les mêmes méthodes.",
        sections: [
          section(
            "Lire la liste d’initialisation",
            "Profil reçoit un nom et le transmet à nom_. Les deux instances tiana et amina possèdent chacune un nom et un score. Un point ajouté à tiana concerne cet objet précis.",
            [
              "std::move permet ici de transférer le contenu du paramètre string vers le champ.",
              "Une méthode const peut lire le nom et le score.",
            ],
          ),
          section(
            "Faire la différence avec une fonction",
            "Le constructeur prépare un objet lors de sa création. ajouterPoint est une méthode appelée plus tard sur une instance existante.",
            [
              "Le constructeur est appelé pendant la construction de chaque instance.",
              "Les champs sont initialisés dans leur ordre de déclaration dans la classe.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>
#include <string>
#include <utility>

class Profil {
public:
    explicit Profil(std::string nom) : nom_(std::move(nom)) {}
    void ajouterPoint() { score_++; }
    void afficher() const { std::cout << nom_ << " : " << score_ << '\n'; }
private:
    std::string nom_;
    int score_ = 0;
};

int main() {
    Profil tiana("Tiana");
    Profil amina("Amina");
    tiana.ajouterPoint();
    tiana.afficher();
    amina.afficher();
}`,
        ),
        task: "Crée une troisième instance et ajoute deux points à Amina. Prédis les trois scores puis compile.",
        takeaway:
          "Un constructeur initialise chaque objet. Les instances conservent leurs propres attributs.",
        quiz: quiz(
          "Combien d’états score_ sont créés pour deux instances ?",
          ["Deux", "Un partagé automatiquement", "Zéro"],
          0,
          "Chaque instance possède son propre attribut score_.",
        ),
        link: docs + "language/constructor.html",
      }),
      lesson({
        id: "cpp-string-vector",
        title: "Conserver des objets dans un vector",
        minutes: 23,
        summary:
          "std::vector est une collection redimensionnable qui gère ses éléments et leur mémoire. Une boucle de parcours permet de lire les valeurs sans calculer les indices à la main.",
        sections: [
          section(
            "Ajouter et parcourir",
            "push_back ajoute une chaîne à la collection. La boucle const auto& parcourt chaque chaîne en lecture par référence. size indique combien d’éléments sont présents.",
            [
              "Le vector peut aussi contenir des instances d’une classe.",
              "Un ajout peut déplacer les éléments. Les références conservées doivent respecter cette invalidation possible.",
            ],
          ),
          section(
            "Relier au projet bancaire",
            "Le compte rassemble un nom et un solde. Une collection de comptes permettrait d’étendre le projet. Commence par vérifier le comportement de chaque compte séparément.",
            [
              "std::string gère les caractères de chaque nom.",
              "Choisis un accès avec vérification comme at lorsque l’indice provient d’une saisie.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> noms = {"Tiana", "Amina"};
    noms.push_back("Soa");
    for (const auto& nom : noms) {
        std::cout << nom << '\n';
    }
    std::cout << noms.size() << " profils\n";
}`,
        ),
        task: "Ajoute un quatrième nom et affiche le premier avec noms.at(0).",
        takeaway:
          "Le vector conserve les éléments et adapte sa capacité pendant son utilisation.",
        quiz: quiz(
          "Quelle opération ajoute un élément à la fin ?",
          ["size", "push_back", "at"],
          1,
          "push_back ajoute un nouvel élément à la fin du vector.",
        ),
        link: docs + "container/vector.html",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "cpp-heritage",
    title: "Relations entre classes",
    description:
      "Modélise un type spécialisé et observe les appels de méthodes.",
    lessons: [
      lesson({
        id: "cpp-heritage",
        title: "Héritage public et spécialisation",
        minutes: 25,
        summary:
          "L’héritage permet de définir un type à partir d’un autre. Dans cet exemple, Developpeur est un Profil possédant une compétence supplémentaire. Le constructeur de la classe dérivée prépare aussi sa partie de base.",
        sections: [
          section(
            "Construire la partie commune",
            "Developpeur appelle explicitement le constructeur de Profil dans sa liste d’initialisation. La méthode nom est héritée et le champ compétence appartient au type spécialisé.",
            [
              "public exprime une relation de sous-type accessible à l’appelant.",
              "Une composition convient lorsqu’un objet possède un autre objet plutôt que d’en être une spécialisation.",
            ],
          ),
          section(
            "Respecter les frontières",
            "Le nom reste privé dans Profil et se lit par un accesseur. La classe dérivée utilise l’interface de sa base.",
            [
              "Un constructeur hérité et un champ privé ont des rôles distincts.",
              "Trace l’ordre des initialisations avec des affichages temporaires.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>
#include <string>
#include <utility>

class Profil {
public:
    explicit Profil(std::string nom) : nom_(std::move(nom)) {}
    const std::string& nom() const { return nom_; }
private:
    std::string nom_;
};

class Developpeur : public Profil {
public:
    Developpeur(std::string nom, std::string outil)
        : Profil(std::move(nom)), outil_(std::move(outil)) {}
    void presenter() const { std::cout << nom() << " utilise " << outil_ << '\n'; }
private:
    std::string outil_;
};

int main() {
    Developpeur tiana("Tiana", "Qt");
    tiana.presenter();
}`,
        ),
        task: "Crée une seconde instance avec une autre compétence puis compare les présentations.",
        takeaway:
          "La construction d’un objet dérivé initialise sa base puis ses propres membres.",
        quiz: quiz(
          "Quel constructeur prépare le nom commun ?",
          ["Profil", "std::cout", "presenter"],
          0,
          "Le constructeur Profil initialise la partie de base de Developpeur.",
        ),
        link: docs + "language/derived_class.html",
      }),
      lesson({
        id: "cpp-methodes-const",
        title: "Séparer l’état et les règles du compte",
        minutes: 24,
        summary:
          "Le compte bancaire encapsule le solde. deposer et retirer appliquent leurs validations puis renvoient un booléen. main interprète ce résultat pour informer l’utilisateur.",
        sections: [
          section(
            "Lire les invariants",
            "Un montant valide est strictement positif et un retrait respecte le solde disponible. Le dépôt vérifie également la limite du type long long avant l’addition.",
            [
              "Le montant est exprimé en ariary entiers dans cette simulation.",
              "La méthode solde() const permet d’observer l’état.",
            ],
          ),
          section(
            "Tester des instances indépendantes",
            "Construis deux comptes avec des titulaires différents. Chaque opération doit affecter l’objet visé. La même classe expose les mêmes règles pour tous les comptes.",
            [
              "Teste un dépôt de zéro puis un retrait supérieur au solde.",
              "Une opération refusée conserve l’état courant du compte.",
            ],
          ),
        ],
        files: projectExample(cppBank, "compte.hpp"),
        task: "Ajoute un second CompteBancaire dans main et vérifie que ses opérations produisent un solde indépendant.",
        takeaway:
          "La classe centralise ses règles. L’interface peut ensuite réutiliser les mêmes opérations.",
        quiz: quiz(
          "Quelle méthode réalise un retrait contrôlé ?",
          ["titulaire", "retirer", "std::getline"],
          1,
          "retirer vérifie le montant et le solde avant de modifier l’objet.",
        ),
        link: docs + "language/access.html",
      }),
    ],
  },
  {
    id: "cpp-qt",
    title: "Première fenêtre Qt 6",
    description: "Installe un kit puis assemble l’interface.",
    lessons: [
      lesson({
        id: "cpp-qt-application",
        title: "QApplication et QMainWindow",
        minutes: 25,
        summary:
          "Qt est un framework multiplateforme qui fournit des composants d’interface et des services applicatifs. QApplication initialise une application Widgets. QMainWindow offre une fenêtre principale organisée autour d’un widget central.",
        sections: [
          section(
            "Préparer le projet",
            "Le ZIP fournit CMakeLists.txt et main.cpp. Ouvre le fichier CMake dans Qt Creator puis sélectionne un kit Desktop Qt 6 comprenant un compilateur compatible.",
            [
              "CMake cherche les composants Qt6 Widgets.",
              "La version de Qt du kit détermine les bibliothèques utilisées.",
            ],
          ),
          section(
            "Lancer les événements",
            "window.show rend la fenêtre visible. app.exec lance la boucle d’événements. Les widgets réagissent ensuite aux actions de l’utilisateur.",
            [
              "L’objet app vit pendant toute la session graphique.",
              "La fermeture de la dernière fenêtre permet normalement de terminer la boucle.",
            ],
          ),
        ],
        files: projectExample(qtProgressProject),
        task: "Exporte le projet, ouvre CMakeLists.txt dans Qt Creator puis change le titre de la fenêtre.",
        takeaway:
          "QApplication gère la session et QMainWindow organise la fenêtre principale.",
        quiz: quiz(
          "Quel appel démarre la boucle d’événements ?",
          ["resize", "setWindowTitle", "app.exec()"],
          2,
          "exec attend et distribue les événements de l’application.",
        ),
        link: qt + "widgets-getting-started.html",
      }),
      lesson({
        id: "cpp-qt-widgets",
        title: "Widgets, layouts et parents",
        minutes: 23,
        summary:
          "QLabel présente du texte, QPushButton reçoit un clic et QProgressBar montre une valeur dans un intervalle. QVBoxLayout dispose ces widgets verticalement et ajuste leurs tailles.",
        sections: [
          section(
            "Lire l’arbre d’objets",
            "Le widget central reçoit un layout. Les widgets ajoutés au layout sont rattachés à son parent. Qt organise la destruction de cet arbre lorsque le parent est détruit.",
            [
              "La fenêtre reçoit son widget central par setCentralWidget.",
              "Les marges du layout ajoutent de l’espace autour du contenu.",
            ],
          ),
          section(
            "Vérifier le redimensionnement",
            "Le layout répartit l’espace en tenant compte des tailles proposées par les widgets. Change la largeur de la fenêtre et observe le comportement de la barre.",
            [
              "Un layout garde une relation entre les widgets quand la fenêtre change de taille.",
              "Les libellés doivent rester lisibles au clavier comme à la souris.",
            ],
          ),
        ],
        files: projectExample(qtProgressProject),
        task: "Ajoute un QLabel au-dessus de la barre puis modifie les marges du layout.",
        takeaway:
          "Les layouts organisent la disposition et les parents organisent la durée de vie des widgets.",
        quiz: quiz(
          "Quel objet répartit les widgets verticalement ?",
          ["QVBoxLayout", "QApplication", "std::vector"],
          0,
          "QVBoxLayout place ses éléments sur un axe vertical.",
        ),
        link: qt + "layout.html",
      }),
    ],
  },
  {
    id: "cpp-qt-actions",
    title: "Signaux, slots et état visible",
    description: "Relie un clic à une mise à jour cohérente de la fenêtre.",
    lessons: [
      lesson({
        id: "cpp-signaux-slots",
        title: "Relier clicked à une lambda",
        minutes: 26,
        summary:
          "Un signal annonce qu’un événement s’est produit. Une connexion associe ce signal à une fonction, une lambda ou un slot. La syntaxe typée de QObject::connect permet au compilateur de vérifier les signatures.",
        sections: [
          section(
            "Lire la connexion",
            "button est l’émetteur et &QPushButton::clicked désigne le signal. &window fournit le contexte de durée de vie. La lambda capture les pointeurs dont elle a besoin.",
            [
              "La connexion est automatiquement rompue à la destruction de son contexte.",
              "Les widgets capturés vivent ici dans l’arbre de la fenêtre.",
            ],
          ),
          section(
            "Actualiser plusieurs widgets",
            "Le rappel lit la valeur courante de la barre, calcule la suivante puis ajuste le label. À 100, il désactive le bouton pour exprimer l’état terminé.",
            [
              "Une capture décrit les données disponibles dans la lambda.",
              "std::min borne le nouveau pourcentage au maximum.",
            ],
          ),
        ],
        files: projectExample(qtProgressProject),
        task: "Repère les trois pointeurs capturés puis remplace l’incrément de 10 par 20.",
        takeaway:
          "Une connexion relie un événement à un traitement en précisant sa signature et son contexte.",
        quiz: quiz(
          "Que représente clicked ?",
          ["Une variable globale", "Un signal du bouton", "Un compilateur"],
          1,
          "clicked est émis lorsque le bouton est activé.",
        ),
        link: qt + "signalsandslots.html",
      }),
      lesson({
        id: "cpp-progression",
        title: "Borner une valeur et montrer la fin",
        minutes: 24,
        summary:
          "L’état de progression suit une règle simple, rester entre zéro et cent. La barre, le label et le bouton doivent exprimer ensemble cet état à chaque clic.",
        sections: [
          section(
            "Vérifier les frontières",
            "Le programme utilise la valeur maximale de la barre comme limite. Le dernier clic atteint cette limite puis affiche Terminé et désactive l’action.",
            [
              "Teste des incréments qui divisent cent puis un incrément de trente.",
              "Le dernier incrément est borné même lorsqu’il dépasse la limite.",
            ],
          ),
          section(
            "Ajouter une remise à zéro",
            "Un bouton Recommencer peut rétablir simultanément la valeur, le texte et l’activation du bouton. L’ensemble de ces modifications forme la transition vers l’état initial.",
            [
              "Un état visible cohérent facilite la compréhension de l’utilisateur.",
              "Vérifie le clavier, le redimensionnement et la fermeture de la fenêtre.",
            ],
          ),
        ],
        files: projectExample(qtProgressProject),
        task: "Ajoute un bouton Recommencer et connecte-le à une lambda qui réinitialise la barre et le bouton d’avancement.",
        takeaway:
          "Chaque transition met à jour les données et tous les widgets qui en dépendent.",
        quiz: quiz(
          "Pourquoi utiliser std::min pour le calcul ?",
          [
            "Pour supprimer la barre",
            "Pour changer de compilateur",
            "Pour borner la valeur au maximum",
          ],
          2,
          "La valeur reste valide même si le prochain pas dépasse la limite.",
        ),
        link: qt + "qprogressbar.html",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "cpp-polymorphisme",
    title: "Polymorphisme et durée de vie",
    description: "Définis un contrat commun puis gère la propriété des objets.",
    lessons: [
      lesson({
        id: "cpp-virtual",
        title: "Méthodes virtuelles et override",
        minutes: 28,
        summary:
          "Le polymorphisme permet d’appeler une opération à travers une référence de base tout en exécutant la version du type concret. virtual établit le mécanisme et override vérifie que la méthode dérivée redéfinit bien une méthode virtuelle.",
        sections: [
          section(
            "Suivre l’appel réel",
            "Forme définit le contrat aire. Rectangle conserve ses dimensions et fournit sa formule. La référence Forme& désigne l’objet Rectangle existant.",
            [
              "= 0 déclare ici une méthode virtuelle pure et rend Forme abstraite.",
              "Le destructeur virtuel prépare une destruction correcte par un pointeur de base.",
            ],
          ),
          section(
            "Préparer les spécialisations Qt",
            "Les fenêtres Qt héritent de classes de widgets. Certaines opérations se redéfinissent avec override, par exemple un gestionnaire d’événement. Il faut respecter la signature de la base.",
            [
              "La référence conserve l’identité de l’objet concret.",
              "Passer un objet dérivé par valeur vers une base peut tronquer sa partie dérivée.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>

class Forme {
public:
    virtual ~Forme() = default;
    virtual double aire() const = 0;
};

class Rectangle final : public Forme {
public:
    Rectangle(double largeur, double hauteur) : largeur_(largeur), hauteur_(hauteur) {}
    double aire() const override { return largeur_ * hauteur_; }
private:
    double largeur_;
    double hauteur_;
};

int main() {
    Rectangle rectangle(4, 3);
    const Forme& forme = rectangle;
    std::cout << "Aire : " << forme.aire() << '\n';
}`,
        ),
        task: "Ajoute une classe Carre dérivée de Forme et appelle son aire via une référence de base.",
        takeaway:
          "Une référence de base peut appeler l’implémentation virtuelle du type concret.",
        quiz: quiz(
          "Quel mot-clé vérifie une redéfinition virtuelle ?",
          ["override", "private", "include"],
          0,
          "override demande au compilateur de vérifier que la signature redéfinit une méthode virtuelle.",
        ),
        link: docs + "language/virtual.html",
      }),
      lesson({
        id: "cpp-raii",
        title: "Propriété avec RAII et unique_ptr",
        minutes: 27,
        summary:
          "RAII associe une ressource à la durée de vie d’un objet propriétaire. std::unique_ptr représente une propriété exclusive et détruit l’objet possédé lorsque sa propre durée de vie se termine.",
        sections: [
          section(
            "Observer la portée",
            "make_unique construit un objet possédé. Le bloc intérieur délimite la durée de vie du propriétaire et le destructeur affiche le moment de libération.",
            [
              "Une unique_ptr peut transférer sa propriété par déplacement.",
              "Les objets locaux et les conteneurs standard couvrent déjà de nombreux besoins de mémoire.",
            ],
          ),
          section(
            "Choisir un propriétaire",
            "Les widgets Qt rattachés à un parent suivent l’arbre de propriété Qt. Un objet métier autonome peut utiliser une valeur ou une unique_ptr selon son besoin.",
            [
              "Identifie un responsable de destruction pour chaque objet.",
              "La fermeture d’une fenêtre doit terminer les accès aux widgets qu’elle possédait.",
            ],
          ),
        ],
        files: consoleFiles(
          "cpp",
          String.raw`#include <iostream>
#include <memory>

class Document {
public:
    Document() { std::cout << "Document créé\n"; }
    ~Document() { std::cout << "Document libéré\n"; }
    void lire() const { std::cout << "Lecture\n"; }
};

int main() {
    {
        auto document = std::make_unique<Document>();
        document->lire();
    }
    std::cout << "Fin du bloc propriétaire\n";
}`,
        ),
        task: "Crée un second document dans une portée imbriquée et observe l’ordre des destructions.",
        takeaway:
          "Le propriétaire rend visible le moment où une ressource est libérée.",
        quiz: quiz(
          "Quand unique_ptr détruit-il son objet courant ?",
          [
            "Au premier affichage",
            "À sa destruction ou au remplacement de sa propriété",
            "À chaque appel de méthode",
          ],
          1,
          "Le propriétaire exclusif libère l’objet qu’il détient lorsqu’il termine sa propriété.",
        ),
        link: docs + "memory/unique_ptr.html",
      }),
    ],
  },
  {
    id: "cpp-designer",
    title: "Qt Designer et génération d’interface",
    description: "Sépare la disposition du code métier.",
    lessons: [
      lesson({
        id: "cpp-ui",
        title: "Ouvrir et comprendre le fichier .ui",
        minutes: 25,
        summary:
          "Qt Designer enregistre la disposition dans un fichier XML .ui. Le projet fournit fenetre.ui avec les champs, les boutons et le tableau. Le générateur uic transforme cette description en code C++ pendant le build.",
        sections: [
          section(
            "Lire les noms d’objets",
            "nameEdit, roleBox et tableEmployees sont les identifiants qui relient le formulaire au code. Modifier un objectName impose d’ajuster les accès C++ correspondants.",
            [
              "Le texte visible peut changer en conservant le même identifiant technique.",
              "Les labels utilisent un buddy pour faciliter le parcours clavier.",
            ],
          ),
          section(
            "Organiser le chargement",
            "Ui::Fenetre est l’objet généré. setupUi(this) construit les widgets et leur layout dans la fenêtre existante.",
            [
              "Ouvre fenetre.ui dans Qt Creator pour utiliser Designer.",
              "CMake active AUTOUIC et régénère l’en-tête au build.",
            ],
          ),
        ],
        files: projectExample(qtEmployees, "fenetre.ui"),
        task: "Ouvre le formulaire dans Designer puis change le texte d’introduction. Recompile via Qt Creator.",
        takeaway:
          "Le fichier .ui décrit la vue et uic produit les accès C++ correspondants.",
        quiz: quiz(
          "Quel outil génère le code à partir du .ui ?",
          ["javac", "scanf", "uic"],
          2,
          "Le User Interface Compiler de Qt transforme le fichier .ui en code C++.",
        ),
        link: qt + "designer-using-a-ui-file.html",
      }),
      lesson({
        id: "cpp-cmake-layout",
        title: "Layouts et compilation CMake",
        minutes: 25,
        summary:
          "CMake décrit les sources et les bibliothèques du programme. Le layout vertical de la page contient un formulaire horizontal et un tableau qui peut s’étendre lorsque la fenêtre grandit.",
        sections: [
          section(
            "Suivre le build",
            "CMake trouve Qt6 Widgets, prépare le fichier généré pour le formulaire puis compile main.cpp. target_link_libraries relie l’exécutable au composant Qt6::Widgets.",
            [
              "Les fichiers source et le .ui sont listés dans la cible atelier.",
              "Le kit Qt Creator fournit la chaîne de compilation utilisée.",
            ],
          ),
          section(
            "Tester les tailles",
            "Les layouts négocient la place. QHeaderView::Stretch répartit la largeur des colonnes. Vérifie aussi une largeur étroite et les libellés plus longs.",
            [
              "Les marges définissent l’espace autour de la page.",
              "Le formulaire conserve des relations de disposition pendant le redimensionnement.",
            ],
          ),
        ],
        files: projectExample(qtEmployees, "CMakeLists.txt"),
        task: "Repère AUTOUIC et Qt6::Widgets puis redimensionne la fenêtre du projet compilé.",
        takeaway:
          "La cible CMake rassemble les sources, le formulaire généré et les dépendances de l’exécutable.",
        quiz: quiz(
          "Quelle option CMake active le traitement automatique des .ui ?",
          ["CMAKE_AUTOUIC", "CMAKE_AUTORUN", "JAVA_HOME"],
          0,
          "CMAKE_AUTOUIC active la génération des fichiers d’interface nécessaires.",
        ),
        link: qt + "cmake-get-started.html",
      }),
    ],
  },
  {
    id: "cpp-profils",
    title: "Modèle métier et tableau interactif",
    description: "Valide un profil puis affiche son instance dans la vue.",
    lessons: [
      lesson({
        id: "cpp-modele-employe",
        title: "Isoler la classe Employe",
        minutes: 24,
        summary:
          "Employe représente les données métier d’un profil. La classe conserve un nom et un rôle. La fenêtre s’occupe de lire les champs, construire cette instance et présenter ses valeurs.",
        sections: [
          section(
            "Séparer les responsabilités",
            "employe.hpp contient la classe et ses accesseurs. Cette classe peut être utilisée dans un programme de console ou dans une fenêtre. La vue effectue les conversions entre QString et std::string.",
            [
              "Le constructeur initialise le nom et le rôle.",
              "Les getters const exposent un accès en lecture.",
            ],
          ),
          section(
            "Conserver les profils",
            "La fenêtre possède un std::vector<Employe>. emplace_back construit un employé dans la collection. La référence obtenue avec back sert immédiatement à remplir la nouvelle ligne du tableau.",
            [
              "L’ajout d’autres éléments peut invalider les anciennes références du vector.",
              "Le projet conserve les données pendant la session de la fenêtre.",
            ],
          ),
        ],
        files: projectExample(qtEmployees, "employe.hpp"),
        task: "Ajoute un champ compétence à Employe puis prévois comment le transmettre depuis la vue.",
        takeaway:
          "L’objet métier décrit les données et la fenêtre organise leur saisie et leur affichage.",
        quiz: quiz(
          "Que construit emplace_back ici ?",
          [
            "Une nouvelle fenêtre",
            "Une instance Employe dans le vector",
            "Une bibliothèque Qt",
          ],
          1,
          "La collection construit l’employé à partir du nom et du rôle reçus.",
        ),
        link: docs + "container/vector/emplace_back.html",
      }),
      lesson({
        id: "cpp-tableau",
        title: "Valider puis remplir QTableWidget",
        minutes: 27,
        summary:
          "Le bouton Ajouter appelle ajouterEmploye. La méthode nettoie les espaces du nom, vérifie sa présence, crée le modèle puis insère une ligne avec deux cellules.",
        sections: [
          section(
            "Garder un ordre cohérent",
            "La validation précède l’ajout au vector. Après construction de l’employé, la vue insère la ligne et affiche son nom et son rôle. Le champ est ensuite vidé pour faciliter la prochaine saisie.",
            [
              "Le tableau utilise des cellules en lecture seule.",
              "La touche Entrée du champ déclenche la même méthode que le bouton.",
            ],
          ),
          section(
            "Vérifier le parcours",
            "Essaie un nom vide, un nom avec des espaces initiaux puis plusieurs profils. Vérifie le nombre de lignes et les valeurs de chaque cellule.",
            [
              "Le message de statut indique le nombre de profils ajoutés.",
              "Le focus revient au champ de nom après un ajout valide.",
            ],
          ),
        ],
        files: projectExample(qtEmployees),
        task: "Ajoute trois profils, teste un nom vide puis confirme que le tableau conserve exactement trois lignes valides.",
        takeaway:
          "Une action valide les données puis met à jour le modèle et sa représentation dans le tableau.",
        quiz: quiz(
          "Quand construire l’employé ?",
          [
            "Avant de lire les champs",
            "À chaque redimensionnement",
            "Après la validation du nom",
          ],
          2,
          "La validation établit les conditions nécessaires à la création du profil.",
        ),
        link: qt + "qtablewidget.html",
      }),
    ],
  },
];

export const cppLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Console, fonctions et objets",
    objective:
      "Compile des programmes C++ puis construis des instances avec des règles explicites.",
    definition:
      "C++ est un langage compilé qui combine fonctions, types et programmation orientée objet. Une classe décrit un type et ses instances possèdent leur propre état.",
    color: levelColors[0],
    prerequisites:
      "Savoir créer un fichier. Les premiers exemples expliquent la compilation et la saisie.",
    outcomes: [
      "Utiliser les flux, les conditions et les fonctions.",
      "Comprendre références, classes, attributs et constructeurs.",
      "Créer plusieurs instances puis manipuler une collection.",
    ],
    chapters: beginner,
    projects: [cppBank],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Héritage et interfaces Qt 6",
    objective:
      "Applique les relations entre classes et construis une fenêtre Qt réactive.",
    definition:
      "Qt fournit des widgets et une boucle d’événements. Les signaux annoncent les actions et les connexions déclenchent les traitements associés.",
    color: levelColors[1],
    prerequisites:
      "Comprendre les constructeurs, les méthodes et les références. Prépare un kit Desktop Qt 6 pour les fenêtres.",
    outcomes: [
      "Construire un type spécialisé par héritage.",
      "Assembler QApplication, fenêtre, widgets et layouts.",
      "Relier les signaux à des lambdas et garder un état cohérent.",
    ],
    chapters: intermediate,
    projects: [qtProgressProject],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Polymorphisme, Designer et modèles",
    objective:
      "Structure les objets et sépare une interface Designer de son modèle métier.",
    definition:
      "Le polymorphisme fait varier l’implémentation derrière un contrat commun. Une architecture de vue sépare disposition, données et traitements pour faciliter les changements.",
    color: levelColors[2],
    prerequisites:
      "Savoir utiliser l’héritage, les layouts Qt et les connexions d’événements.",
    outcomes: [
      "Utiliser virtual, override et une propriété explicite des objets.",
      "Compiler un fichier .ui avec CMake AUTOUIC.",
      "Valider un formulaire et présenter des instances dans un tableau.",
    ],
    chapters: advanced,
    projects: [qtEmployees],
  },
];
