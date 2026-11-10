import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles, fxPath, fxResources } from "./desktopAuthoring";
import { fxContacts, fxConverter, javaTasks } from "./javaProjects";
import type { WebLevel } from "./webCourseTypes";

const docs = "https://dev.java/learn/";
const javafx = "https://openjfx.io/javadoc/21/";

const beginner: WebLevel["chapters"] = [
  {
    id: "java-fondations",
    title: "Du JDK aux premières données",
    description:
      "Compile une classe et comprends les valeurs qu’elle manipule.",
    lessons: [
      lesson({
        id: "java-demarrer",
        title: "JDK, bytecode et JVM",
        minutes: 18,
        summary:
          "Java est un langage compilé vers un format intermédiaire appelé bytecode. Le JDK fournit javac pour compiler et java pour lancer la machine virtuelle JVM. Cette dernière exécute les classes compilées.",
        sections: [
          section(
            "Lire Main.java",
            "La classe publique Main est définie dans Main.java. La méthode public static void main(String[] args) est le point d’entrée de l’exemple. System.out.println écrit une ligne dans la console.",
            [
              "public rend la classe ou la méthode accessible.",
              "static rattache la méthode à la classe et void indique un retour sans valeur.",
            ],
          ),
          section(
            "Lancer dans l’atelier",
            "Le bouton Compiler et exécuter compile les fichiers .java puis lance Main. L’atelier utilise un JDK 17 pour la console. Un export contient aussi les commandes javac et java.",
            [
              "Le nom du fichier et celui de la classe publique doivent correspondre.",
              "Le guide de l’éditeur explique l’activation du service de compilation.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        System.out.println("Bonjour DevAfrica !");
        System.out.println("Mon premier programme Java.");
    }
}`,
        ),
        task: "Remplace la deuxième phrase par ton prénom puis compile. Repère l’étape de compilation et la sortie du programme.",
        takeaway:
          "javac produit le bytecode et la JVM exécute la classe d’entrée.",
        quiz: quiz(
          "Quel outil compile le fichier Java ?",
          ["java", "javac", "FXMLLoader"],
          1,
          "javac transforme le code source en fichiers .class.",
        ),
        link: docs + "getting-started/",
      }),
      lesson({
        id: "java-variables",
        title: "Types, variables et constantes",
        minutes: 20,
        summary:
          "Une variable associe un nom à une valeur d’un type précis. int et double représentent des nombres. boolean représente vrai ou faux. String est une classe pour manipuler du texte.",
        sections: [
          section(
            "Choisir le type",
            "Le type int convient à une quantité entière et double aux mesures à virgule. Un littéral texte utilise des guillemets. Le compilateur vérifie que les opérations conviennent aux types.",
            [
              "final empêche de réaffecter une variable après son initialisation.",
              "Pour un objet, final fixe sa référence et sa mutabilité dépend de sa classe.",
            ],
          ),
          section(
            "Lire une expression",
            "L’opérateur + additionne des nombres ou concatène du texte selon les opérandes. Les parenthèses rendent explicite le calcul à réaliser avant son insertion dans le message.",
            [
              "Une division entre deux int produit un résultat entier.",
              "5.0 / 2 conserve une division flottante.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        final double prix = 2500.0;
        int quantite = 3;
        String produit = "Clavier";
        boolean disponible = true;
        System.out.println(produit + " disponible " + disponible);
        System.out.println("Total " + (prix * quantite) + " Ar");
        System.out.println("Division entière " + (5 / 2));
        System.out.println("Division décimale " + (5.0 / 2));
    }
}`,
        ),
        task: "Change le produit et la quantité puis compare les deux divisions.",
        takeaway:
          "Le type d’une variable définit les valeurs et les opérations autorisées.",
        quiz: quiz(
          "Quel type stocke true ou false ?",
          ["String", "int", "boolean"],
          2,
          "boolean exprime une valeur logique.",
        ),
        link: docs + "language-basics/primitive-types/",
      }),
      lesson({
        id: "java-scanner",
        title: "Lire une ligne avec Scanner",
        minutes: 22,
        summary:
          "Scanner lit des données depuis un flux comme System.in. Une lecture par ligne permet de conserver un nom composé. Pour les nombres, on peut convertir la ligne puis traiter une éventuelle erreur de format.",
        sections: [
          section(
            "Préparer l’entrée",
            "La zone Entrée standard fournit d’abord le nom puis l’âge sur une autre ligne. hasNextLine vérifie qu’une ligne reste disponible avant de la lire.",
            [
              "nextLine consomme une ligne complète.",
              "Integer.parseInt convertit une représentation textuelle d’entier.",
            ],
          ),
          section(
            "Gérer le résultat",
            "try organise la lecture et catch traite une conversion invalide. Le bloc try-with-resources ferme le Scanner à la fin de l’exercice.",
            [
              "La valeur convertie doit aussi respecter la règle d’âge choisie.",
              "Les entrées de l’atelier sont transmises au lancement du programme.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in, "UTF-8")) {
            if (!input.hasNextLine()) return;
            String nom = input.nextLine().strip();
            if (!input.hasNextLine()) return;
            int age = Integer.parseInt(input.nextLine().strip());
            if (age < 0 || age > 130) {
                System.err.println("Choisis un âge entre 0 et 130.");
                return;
            }
            System.out.println(nom + " a " + age + " ans.");
        } catch (NumberFormatException erreur) {
            System.err.println("L’âge doit être un entier.");
        }
    }
}`,
          { stdin: "Tiana Rakoto\n24\n" },
        ),
        task: "Entre ton nom puis un âge. Essaie ensuite vingt à la place de l’âge et observe le message.",
        takeaway:
          "Une lecture fournit du texte et une conversion vérifiée lui donne son sens numérique.",
        quiz: quiz(
          "Quelle méthode lit toute une ligne ?",
          ["nextLine", "println", "length"],
          0,
          "Scanner.nextLine renvoie le texte de la ligne courante.",
        ),
        link: "https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Scanner.html",
      }),
    ],
  },
  {
    id: "java-logique",
    title: "Texte, logique et méthodes",
    description:
      "Compare des contenus puis rends tes traitements réutilisables.",
    lessons: [
      lesson({
        id: "java-string",
        title: "Comprendre String et equals",
        minutes: 21,
        summary:
          "String représente un texte immuable. Ses méthodes produisent des résultats que tu peux stocker. equals compare le contenu de deux chaînes. L’opérateur == compare ici les références des objets.",
        sections: [
          section(
            "Transformer une valeur",
            "strip renvoie une chaîne débarrassée de ses espaces aux extrémités. La variable d’origine conserve son texte tant qu’on lui laisse sa référence actuelle.",
            [
              "length compte les unités UTF-16 de la chaîne.",
              "equalsIgnoreCase peut comparer en ignorant la casse dans des cas simples.",
            ],
          ),
          section(
            "Utiliser la comparaison",
            "Le menu des tâches compare le choix à des chaînes comme 1 ou 0. Une comparaison de contenu rend l’intention explicite.",
            [
              'Un littéral connu permet d’écrire "Java".equals(valeur) même si valeur peut être null.',
              "Un texte d’interface peut être construit avec une concaténation ou String.format.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        String saisie = "  Java  ";
        String propre = saisie.strip();
        String copie = new String("Java");
        System.out.println("Texte nettoyé " + propre);
        System.out.println("Contenus égaux " + propre.equals(copie));
        System.out.println("Longueur " + propre.length());
        System.out.println("Texte initial [" + saisie + "]");
    }
}`,
        ),
        task: "Change la saisie pour java et compare equals à equalsIgnoreCase.",
        takeaway:
          "Les transformations de String renvoient une valeur. equals compare les contenus.",
        quiz: quiz(
          "Quelle opération compare le contenu de deux String ?",
          ["== dans tous les cas", "equals", "new"],
          1,
          "equals définit la comparaison du contenu des chaînes.",
        ),
        link: docs + "numbers-strings/strings/",
      }),
      lesson({
        id: "java-conditions-boucles",
        title: "Parcourir et choisir avec if et for",
        minutes: 21,
        summary:
          "Les conditions pilotent les branches et les boucles répètent des instructions. Une expression booléenne comme note >= 10 produit la décision utilisée par if.",
        sections: [
          section(
            "Lire le parcours",
            "for initialise i, vérifie i <= 4 puis exécute le corps. Après chaque tour, i++ fait avancer le compteur. L’exemple classe des notes calculées à partir de i.",
            [
              "&& combine deux conditions nécessaires.",
              "|| accepte qu’au moins une condition soit vraie.",
            ],
          ),
          section(
            "Prévoir l’arrêt",
            "Une boucle doit atteindre son état de fin. Dans le gestionnaire de tâches, l’utilisateur peut choisir Quitter et la fin de l’entrée ferme aussi la session.",
            [
              "La condition se vérifie avant chaque tour de for ou while.",
              "Teste le seuil exact de validation et la valeur qui le précède.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 4; i++) {
            int note = i * 4;
            if (note >= 10) {
                System.out.println(note + " validé");
            } else {
                System.out.println(note + " à travailler");
            }
        }
    }
}`,
        ),
        task: "Change le calcul pour faire apparaître une note de 10 puis vérifie la branche prise.",
        takeaway:
          "Une condition exprime une règle. La boucle applique cette règle à plusieurs valeurs.",
        quiz: quiz(
          "Quand le compteur i est-il incrémenté ici ?",
          [
            "Une fois au démarrage",
            "Avant la compilation",
            "Après chaque exécution du corps",
          ],
          2,
          "La troisième partie du for est exécutée après chaque tour.",
        ),
        link: docs + "language-basics/controlling-flow/",
      }),
      lesson({
        id: "java-methodes",
        title: "Paramètres et valeur de retour d’une méthode",
        minutes: 23,
        summary:
          "Une méthode est une fonction déclarée dans une classe. Les paramètres définissent ses entrées et le type de retour précise son résultat. static permet ici de l’appeler depuis main sur la même classe.",
        sections: [
          section(
            "Distinguer déclaration et appel",
            "La méthode total décrit comment multiplier le prix par la quantité. total(3, 1200) exécute ce calcul avec les arguments fournis. Les paramètres ordinaires sont reçus par valeur.",
            [
              "int indique un résultat entier.",
              "return termine l’appel avec la valeur calculée.",
            ],
          ),
          section(
            "Tester plusieurs cas",
            "Appelle la même méthode avec une quantité nulle puis une quantité positive. Écris la valeur attendue avant de lancer la compilation.",
            [
              "Une méthode void effectue une action sans résultat renvoyé.",
              "Une méthode d’instance travaille sur un objet concret, présenté dans le prochain chapitre.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    static int total(int quantite, int prix) {
        return quantite * prix;
    }

    public static void main(String[] args) {
        int premier = total(3, 1200);
        System.out.println("Premier total " + premier);
        System.out.println("Second total " + total(2, 500));
    }
}`,
        ),
        task: "Ajoute une méthode maximum(int a, int b), appelle-la trois fois et vérifie chaque résultat.",
        takeaway:
          "La méthode regroupe une logique et son appel fournit les données à traiter.",
        quiz: quiz(
          "Que représente int devant total ?",
          [
            "Le type de la valeur retournée",
            "Le nom d’un objet",
            "Le nombre d’appels permis",
          ],
          0,
          "Le type de retour annonce la nature du résultat de la méthode.",
        ),
        link: "https://dev.java/learn/language/oop/classes-objects/calling-methods-constructors/",
      }),
    ],
  },
  {
    id: "java-objets",
    title: "Collections et instances",
    description:
      "Construis des objets encapsulés puis conserve-les dans une liste.",
    lessons: [
      lesson({
        id: "java-arraylist",
        title: "Ajouter et parcourir une ArrayList",
        minutes: 22,
        summary:
          "ArrayList est une collection de taille variable. ArrayList<String> contient des références vers des chaînes. add ajoute un élément, get lit un indice et remove retire un élément.",
        sections: [
          section(
            "Comprendre les indices",
            "Les indices commencent à zéro et s’arrêtent à size() - 1. Le programme affiche des numéros humains en ajoutant un à l’indice utilisé dans get.",
            [
              "La liste conserve l’ordre de ses éléments.",
              "Les insertions et suppressions peuvent décaler les indices suivants.",
            ],
          ),
          section(
            "Préparer les tâches",
            "La même collection peut contenir des instances Tache. Le projet distingue ainsi l’objet métier et le menu qui organise les actions.",
            [
              "Vérifie les limites avant de supprimer un indice fourni par l’utilisateur.",
              "La boucle for-each convient pour lire chaque élément d’une collection.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> taches = new ArrayList<>();
        taches.add("Lire une leçon");
        taches.add("Compiler un exercice");
        for (int i = 0; i < taches.size(); i++) {
            System.out.println((i + 1) + ". " + taches.get(i));
        }
        taches.remove(0);
        System.out.println("Il reste " + taches.size() + " tâche.");
    }
}`,
        ),
        task: "Ajoute une troisième tâche puis retire la deuxième en utilisant son indice.",
        takeaway:
          "Une ArrayList organise une suite d’éléments dont la taille peut évoluer.",
        quiz: quiz(
          "Quel indice désigne le premier élément ?",
          ["1", "0", "size()"],
          1,
          "Les collections indexées Java commencent à l’indice zéro.",
        ),
        link: "https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayList.html",
      }),
      lesson({
        id: "java-classes-instances",
        title: "Constructeur, instances, getters et setters",
        minutes: 28,
        summary:
          "Une classe définit les données et les méthodes d’un type. new construit une instance et appelle son constructeur. Deux instances possèdent des attributs d’instance indépendants.",
        sections: [
          section(
            "Encapsuler le titre",
            "Le champ titre est privé. Le constructeur utilise setTitre pour appliquer la même validation qu’une modification ultérieure. getTitre permet de lire la valeur.",
            [
              "Le fichier Tache.java contient le modèle et Main.java contient les essais.",
              "Un getter lit une propriété et un setter organise sa modification.",
            ],
          ),
          section(
            "Observer deux objets",
            "premiere et seconde référencent deux instances distinctes. Renommer premiere agit sur son objet. seconde conserve son titre.",
            [
              "Copier une référence peut faire désigner le même objet par deux variables.",
              "Un constructeur prépare un nouvel objet et une méthode agit sur un objet existant.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        Tache premiere = new Tache("Apprendre Java");
        Tache seconde = new Tache("Préparer JavaFX");
        premiere.setTitre("Comprendre les instances");
        System.out.println(premiere.getTitre());
        System.out.println(seconde.getTitre());
    }
}`,
          {
            extra: {
              "Tache.java": javaTasks.files.local!.sources["Tache.java"],
            },
          },
        ),
        task: "Crée une troisième tâche. Puis écris Tache copie = premiere et observe quel objet est modifié par copie.setTitre.",
        takeaway:
          "La variable contient une référence. L’instance contient l’état et ses méthodes contrôlent ses modifications.",
        quiz: quiz(
          'Que fait new Tache("Lire") ?',
          [
            "Il crée une liste",
            "Il appelle automatiquement main",
            "Il construit une instance et appelle son constructeur",
          ],
          2,
          "new réserve l’objet et son constructeur initialise le titre.",
        ),
        link: docs + "classes-objects/creating-objects/",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "java-erreurs",
    title: "Exceptions et validation",
    description:
      "Transforme une erreur de conversion en résultat compréhensible.",
    lessons: [
      lesson({
        id: "java-exceptions",
        title: "Comprendre try, catch et l’exception",
        minutes: 24,
        summary:
          "Une exception transporte une erreur jusqu’à un traitement adapté. try délimite le code susceptible de l’émettre. catch reçoit le type d’erreur que l’application sait expliquer.",
        sections: [
          section(
            "Suivre les chemins",
            "Integer.parseInt convertit le texte. Avec vingt, il lève NumberFormatException et l’exécution rejoint le catch. Une conversion valide continue dans le bloc try.",
            [
              "Choisis le type d’exception correspondant au cas traité.",
              "Un message utile indique ce que l’utilisateur peut corriger.",
            ],
          ),
          section(
            "Appliquer aux interfaces",
            "Un champ graphique fournit aussi une chaîne. La conversion doit être validée avant de calculer. Le convertisseur JavaFX garde l’interface ouverte pour permettre une correction.",
            [
              "Sépare erreur de format et règle sur la valeur.",
              "Les ressources ouvertes se ferment avec une durée de vie explicite ou un try-with-resources.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        String[] essais = {"24", "vingt", "-2"};
        for (String texte : essais) {
            try {
                int age = Integer.parseInt(texte);
                if (age < 0) {
                    System.out.println("Âge négatif à corriger");
                } else {
                    System.out.println("Âge accepté " + age);
                }
            } catch (NumberFormatException erreur) {
                System.out.println("Entier attendu pour [" + texte + "]");
            }
        }
    }
}`,
        ),
        task: "Ajoute une chaîne vide aux essais et vérifie que les essais suivants restent exécutés.",
        takeaway:
          "Une exception interrompt le chemin courant jusqu’au gestionnaire qui sait la traiter.",
        quiz: quiz(
          "Quelle erreur intercepte ce catch ?",
          [
            "Une référence FXML",
            "Une erreur de conversion numérique",
            "Un échec réseau uniquement",
          ],
          1,
          "NumberFormatException indique ici un texte incompatible avec un entier.",
        ),
        link: docs + "exceptions/",
      }),
      lesson({
        id: "java-validation-modele",
        title: "Centraliser une règle dans une méthode",
        minutes: 25,
        summary:
          "Une méthode de validation transforme une entrée brute en donnée utilisable. Le modèle peut rejeter une valeur incohérente avec IllegalArgumentException, puis l’appelant affiche une explication.",
        sections: [
          section(
            "Faire respecter le contrat",
            "creerTitre retire les espaces extérieurs et vérifie la présence du texte. La méthode réussit avec une valeur propre ou lève une erreur précise.",
            [
              "Une validation partagée évite des règles différentes entre console et interface.",
              "Le texte reçu peut être null lorsqu’il vient d’un appel externe.",
            ],
          ),
          section(
            "Conserver l’état valide",
            "Le setter Tache vérifie avant d’affecter titre. Si la validation échoue, l’objet conserve la dernière valeur acceptée.",
            [
              "Teste un texte valide, des espaces seuls et une valeur absente.",
              "Observe séparément les données reçues et le résultat validé.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    static String creerTitre(String texte) {
        if (texte == null || texte.isBlank()) {
            throw new IllegalArgumentException("Un titre est nécessaire.");
        }
        return texte.strip();
    }

    public static void main(String[] args) {
        String[] essais = {"  Apprendre  ", "  ", null};
        for (String essai : essais) {
            try {
                System.out.println("Titre [" + creerTitre(essai) + "]");
            } catch (IllegalArgumentException erreur) {
                System.out.println(erreur.getMessage());
            }
        }
    }
}`,
        ),
        task: "Ajoute une règle qui limite le titre à 100 caractères et prépare un essai qui la dépasse.",
        takeaway:
          "Une méthode protège le contrat des données avant de modifier l’état.",
        quiz: quiz(
          "À quel moment affecter la nouvelle valeur ?",
          [
            "Avant toute vérification",
            "À chaque exception",
            "Après la validation",
          ],
          2,
          "L’objet garde ainsi un état conforme à ses règles.",
        ),
        link: docs + "exceptions/throwing/",
      }),
    ],
  },
  {
    id: "javafx-fondations",
    title: "Première interface JavaFX",
    description: "Construis une scène et son arbre de composants.",
    lessons: [
      lesson({
        id: "javafx-stage-scene",
        title: "Application, Stage et Scene",
        minutes: 25,
        summary:
          "JavaFX est une bibliothèque d’interfaces graphiques Java. Une Application démarre dans start. Stage représente la fenêtre et Scene contient l’arbre des éléments visuels.",
        sections: [
          section(
            "Préparer l’environnement",
            "Le ZIP fournit un projet Maven qui déclare JavaFX 21. Installe un JDK 17 ou plus récent et Maven, ouvre le dossier extrait puis lance mvn javafx:run.",
            [
              "JavaFX est déclaré comme dépendance du projet.",
              "Le guide de l’atelier présente les commandes et les liens d’installation.",
            ],
          ),
          section(
            "Lire le démarrage",
            "start construit les champs puis un VBox. La Scene reçoit ce conteneur et le Stage reçoit la Scene. show affiche la fenêtre.",
            [
              "Les composants d’une scène forment un arbre.",
              "Les mises à jour de l’interface s’effectuent sur le JavaFX Application Thread.",
            ],
          ),
        ],
        files: projectExample(fxConverter, `${fxPath}/Main.java`),
        task: "Exporte le projet, lance-le avec Maven puis change le titre du Stage.",
        takeaway:
          "Stage porte la fenêtre et Scene porte son contenu graphique.",
        quiz: quiz(
          "Quel objet représente la fenêtre principale ?",
          ["Stage", "Scanner", "ArrayList"],
          0,
          "Stage est le conteneur de fenêtre de JavaFX.",
        ),
        link: "https://openjfx.io/openjfx-docs/",
      }),
      lesson({
        id: "javafx-noeuds-layout",
        title: "Labels, champs et VBox",
        minutes: 23,
        summary:
          "Les éléments de la scène sont des nœuds. Label affiche du texte, TextField reçoit une saisie et Button annonce une action. VBox dispose ses enfants verticalement avec un espacement choisi.",
        sections: [
          section(
            "Construire un formulaire lisible",
            "Le label du montant est associé au TextField avec setLabelFor. Le bouton par défaut reçoit la validation par Entrée. Un label séparé présente le résultat ou l’erreur.",
            [
              "Le texte d’aide propose un exemple de montant.",
              "Les marges du VBox créent un espace autour des champs.",
            ],
          ),
          section(
            "Laisser la disposition s’adapter",
            "Le conteneur calcule les tailles selon les composants et la fenêtre disponible. Les champs conservent leur ordre de lecture lorsque la fenêtre est redimensionnée.",
            [
              "Teste le parcours clavier depuis le champ jusqu’au bouton.",
              "Un texte de résultat long peut demander un retour à la ligne.",
            ],
          ),
        ],
        files: projectExample(fxConverter, `${fxPath}/Main.java`),
        task: "Ajoute un Label expliquant le taux d’exercice puis ajuste l’espacement du VBox.",
        takeaway:
          "Un conteneur organise les nœuds et un label associé explique la saisie attendue.",
        quiz: quiz(
          "Quel composant reçoit un texte sur une ligne ?",
          ["Scene", "TextField", "Stage"],
          1,
          "TextField est prévu pour la saisie d’une ligne de texte.",
        ),
        link: javafx + "javafx.graphics/javafx/scene/layout/VBox.html",
      }),
    ],
  },
  {
    id: "javafx-actions",
    title: "Événements et calculs",
    description: "Transforme une saisie en résultat visible.",
    lessons: [
      lesson({
        id: "javafx-lambdas",
        title: "Réagir au bouton avec une lambda",
        minutes: 25,
        summary:
          "Une lambda exprime une fonction compatible avec une interface fonctionnelle. setOnAction reçoit ici le gestionnaire appelé lorsque le bouton est activé.",
        sections: [
          section(
            "Lire le gestionnaire",
            "event -> { ... } décrit ce qui arrive à l’activation. Le rappel lit le champ, appelle la conversion puis modifie le label de résultat.",
            [
              "Le paramètre event contient l’événement reçu.",
              "Le gestionnaire est enregistré pendant la construction de la vue puis appelé lors de l’action.",
            ],
          ),
          section(
            "Traiter aussi les erreurs",
            "Le catch affiche une consigne si le texte est invalide. L’utilisateur peut corriger son champ puis activer le même bouton pour refaire un essai.",
            [
              "La touche Entrée bénéficie du même gestionnaire que le clic.",
              "Un traitement long doit préserver la disponibilité du thread graphique.",
            ],
          ),
        ],
        files: projectExample(fxConverter, `${fxPath}/Main.java`),
        task: "Essaie 12,50 puis bonjour dans la fenêtre. Personnalise le message de correction.",
        takeaway:
          "Un gestionnaire réagit à l’événement et relie la saisie à la logique de l’application.",
        quiz: quiz(
          "Quand le corps de la lambda est-il exécuté ?",
          [
            "À chaque compilation",
            "À la déclaration du champ",
            "Lorsque l’action du bouton est déclenchée",
          ],
          2,
          "setOnAction enregistre un rappel que JavaFX appelle lors de l’action.",
        ),
        link:
          javafx +
          "javafx.controls/javafx/scene/control/ButtonBase.html#setOnAction(javafx.event.EventHandler)",
      }),
      lesson({
        id: "javafx-conversion",
        title: "Séparer le calcul avec BigDecimal",
        minutes: 26,
        summary:
          "La classe Conversion transforme le texte en montant puis applique un taux pédagogique fixe. BigDecimal représente des nombres décimaux avec un contrôle explicite de l’arrondi.",
        sections: [
          section(
            "Valider et convertir",
            "La méthode accepte un montant positif ou nul avec un point ou une virgule et une précision bornée. Elle normalise la virgule puis construit le BigDecimal à partir du texte.",
            [
              "Le taux de 5 000 Ar pour un euro est une donnée fictive de cet exercice.",
              "HALF_UP définit la règle d’arrondi à l’ariary entier.",
            ],
          ),
          section(
            "Réutiliser le modèle",
            "La fenêtre fournit le texte à Conversion.enAriary et affiche son résultat. Le calcul est isolé des composants graphiques, ce qui permet de le vérifier séparément.",
            [
              "Teste 0, 1 et 12,50 pour vérifier les résultats attendus.",
              "Teste aussi une saisie alphabétique et un nombre trop long.",
            ],
          ),
        ],
        files: projectExample(fxConverter, `${fxPath}/Conversion.java`),
        task: "Change le taux fictif puis vérifie manuellement le résultat pour 2 euros et pour 12,50 euros.",
        takeaway:
          "Le modèle transforme une entrée validée en résultat et la vue présente ce résultat.",
        quiz: quiz(
          "Pourquoi construire BigDecimal à partir d’un texte ?",
          [
            "Pour représenter directement sa valeur décimale",
            "Pour créer une fenêtre",
            "Pour afficher un bouton",
          ],
          0,
          "Le constructeur texte exprime la valeur décimale saisie sans passer par un double.",
        ),
        link: "https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/math/BigDecimal.html",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "java-architecture",
    title: "Objets métier et collections",
    description:
      "Observe les données et leur identité avant de les connecter à une vue.",
    lessons: [
      lesson({
        id: "java-identite",
        title: "Référence partagée et état d’instance",
        minutes: 25,
        summary:
          "Deux variables Java peuvent référencer un même objet. Une modification réalisée par une référence devient visible par l’autre. Créer un nouvel objet produit un état d’instance distinct.",
        sections: [
          section(
            "Tracer les références",
            "originale et alias désignent la même Tache. autre désigne une seconde instance. Appeler alias.setTitre modifie donc le titre visible à travers originale.",
            [
              "Le passage d’une référence comme argument copie sa valeur de référence.",
              "Un paramètre peut modifier l’objet reçu si ses méthodes le permettent.",
            ],
          ),
          section(
            "Relier au contrôleur",
            "La ListView du carnet de contacts présente les objets de la collection observable. Sélectionner un élément fournit la référence du contact correspondant.",
            [
              "Les records du projet Contact possèdent des champs finaux.",
              "Le ramasse-miettes récupère les objets devenus inaccessibles selon son propre calendrier.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        Tache originale = new Tache("Lire Java");
        Tache alias = originale;
        Tache autre = new Tache("Lire JavaFX");
        alias.setTitre("Comprendre les références");
        System.out.println(originale.getTitre());
        System.out.println(autre.getTitre());
        System.out.println("Même objet " + (originale == alias));
    }
}`,
          {
            extra: {
              "Tache.java": javaTasks.files.local!.sources["Tache.java"],
            },
          },
        ),
        task: "Remplace l’affectation de alias par new Tache et compare les résultats.",
        takeaway:
          "La référence identifie un objet et plusieurs variables peuvent partager cet objet.",
        quiz: quiz(
          "Que fait Tache alias = originale ?",
          [
            "Il duplique automatiquement tous les champs",
            "Il copie la référence du même objet",
            "Il appelle le constructeur une seconde fois",
          ],
          1,
          "Les deux variables désignent alors la même instance.",
        ),
        link: docs + "creating-and-using-objects/",
      }),
      lesson({
        id: "java-record",
        title: "Décrire une donnée avec un record",
        minutes: 24,
        summary:
          "Un record est une forme concise de classe pour porter des données. Il fournit notamment un constructeur, des accesseurs et une égalité fondée sur ses composants. Le carnet utilise un Contact regroupant nom, téléphone et email.",
        sections: [
          section(
            "Lire les composants",
            "Le record Profil déclare nom et competence. Les accesseurs portent leurs noms, comme nom(). Le projet Contact utilise le même principe pour ses coordonnées.",
            [
              "Les champs de composant sont finaux.",
              "Pour les composants mutables, leur propre contenu reste soumis aux règles de leur type.",
            ],
          ),
          section(
            "Comparer des valeurs",
            "Deux records du même type avec les mêmes composants sont égaux selon equals. Cette sémantique de donnée convient à des contacts affichés et sélectionnés dans une liste.",
            [
              "La validation de formulaire précède la construction du Contact du projet.",
              "Le choix d’un record dépend du besoin de représenter une valeur à composants connus.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `record Profil(String nom, String competence) {}

public class Main {
    public static void main(String[] args) {
        Profil tiana = new Profil("Tiana", "JavaFX");
        Profil copie = new Profil("Tiana", "JavaFX");
        System.out.println(tiana.nom() + " utilise " + tiana.competence());
        System.out.println("Valeurs égales " + tiana.equals(copie));
        System.out.println("Même référence " + (tiana == copie));
    }
}`,
        ),
        task: "Ajoute un composant pays au record puis mets à jour les deux constructions.",
        takeaway:
          "Un record exprime une donnée par ses composants et fournit une égalité de contenu.",
        quiz: quiz(
          "Comment lire le nom d’un record Profil ?",
          ["Profil.getMain()", "new nom", "profil.nom()"],
          2,
          "Le record génère un accesseur portant le nom du composant.",
        ),
        link: docs + "records/",
      }),
    ],
  },
  {
    id: "javafx-fxml",
    title: "FXML et Scene Builder",
    description: "Décris la vue puis relie ses identifiants au contrôleur.",
    lessons: [
      lesson({
        id: "javafx-fxml",
        title: "Séparer le fichier FXML du code Java",
        minutes: 26,
        summary:
          "FXML est un format XML décrivant des objets JavaFX et leurs propriétés. FXMLLoader lit le fichier et construit l’arbre des composants. fx:controller désigne la classe chargée d’organiser ses actions.",
        sections: [
          section(
            "Lire la description",
            "Le fichier contacts.fxml contient une ListView, des champs et un bouton. fx:id associe un identifiant à un objet pour le retrouver dans le contrôleur.",
            [
              'onAction="#enregistrer" désigne une méthode du contrôleur.',
              "Les imports FXML rendent disponibles les classes utilisées dans le document.",
            ],
          ),
          section(
            "Charger les ressources",
            "Main appelle getResource sur le chemin du FXML puis utilise FXMLLoader. Maven copie les ressources du dossier src/main/resources dans la sortie du build.",
            [
              "Le CSS est stocké à côté du FXML dans le même paquet de ressources.",
              "Le nom de paquet du contrôleur doit correspondre à celui du fichier Java.",
            ],
          ),
        ],
        files: projectExample(fxContacts, `${fxResources}/contacts.fxml`),
        task: "Repère fx:controller, trois fx:id et l’action du bouton. Suis ensuite leur correspondance dans ContactsController.java.",
        takeaway:
          "FXML décrit les objets de la vue et le contrôleur porte ses traitements.",
        quiz: quiz(
          "Que désigne fx:controller ?",
          [
            "La classe de contrôleur de la vue",
            "Le compilateur C",
            "La valeur d’un champ",
          ],
          0,
          "FXMLLoader instancie cette classe pour relier la vue à ses actions.",
        ),
        link: "https://openjfx.io/javadoc/21/javafx.fxml/javafx/fxml/doc-files/introduction_to_fxml.html",
      }),
      lesson({
        id: "javafx-scene-builder",
        title: "Modifier la vue avec Scene Builder",
        minutes: 25,
        summary:
          "Scene Builder est un éditeur visuel de FXML. Tu peux y disposer les composants, définir leurs propriétés et régler les conteneurs. Le fichier enregistré reste utilisable par le même FXMLLoader.",
        sections: [
          section(
            "Ouvrir le bon fichier",
            "Exporte le projet puis ouvre contacts.fxml dans Scene Builder. Inspecte le SplitPane, la liste et le formulaire. Les champs Controller et Code donnent accès aux identifiants et aux actions.",
            [
              "Conserve les fx:id attendus par le contrôleur lors d’un changement de libellé.",
              "Les layouts répartissent l’espace lorsque la fenêtre change de taille.",
            ],
          ),
          section(
            "Valider la modification",
            "Après enregistrement, relance mvn javafx:run. Vérifie la saisie, la sélection d’un contact et le redimensionnement.",
            [
              "Un aperçu visuel vérifie la disposition.",
              "Un lancement de l’application vérifie aussi les liaisons au contrôleur.",
            ],
          ),
        ],
        files: projectExample(fxContacts, `${fxResources}/contacts.fxml`),
        task: "Change le titre de la section dans Scene Builder et ajuste l’espacement du formulaire puis relance le projet.",
        takeaway:
          "Scene Builder modifie le FXML que l’application charge lors de son lancement.",
        quiz: quiz(
          "Quel fichier ouvre-t-on dans Scene Builder ?",
          ["pom.xml", "contacts.fxml", "Main.class"],
          1,
          "Scene Builder édite la description FXML de l’interface.",
        ),
        link: "https://gluonhq.com/products/scene-builder/",
      }),
    ],
  },
  {
    id: "javafx-controleur",
    title: "Contrôleur, validation et liste observable",
    description: "Relie la saisie à des contacts sélectionnables.",
    lessons: [
      lesson({
        id: "javafx-injection",
        title: "Comprendre @FXML et initialize",
        minutes: 27,
        summary:
          "L’annotation @FXML autorise le chargeur à accéder aux champs et méthodes prévus pour la vue. Après leur injection, initialize configure les liaisons qui utilisent ces composants.",
        sections: [
          section(
            "Suivre l’injection",
            "Le champ @FXML TextField nom correspond au fx:id nom. FXMLLoader crée les composants puis affecte leurs références au contrôleur avant initialize.",
            [
              "Un accès au champ dans le constructeur arrive avant cette injection.",
              "Les identifiants et les types des champs doivent correspondre au FXML.",
            ],
          ),
          section(
            "Valider l’action",
            "enregistrer lit les trois champs et vérifie leur format. Une entrée acceptée construit un Contact. La méthode ajoute ensuite l’instance à la collection et remet les champs à zéro.",
            [
              "Les consignes de validation indiquent le champ à corriger.",
              "Le focus est rendu à ce champ pour faciliter la saisie.",
            ],
          ),
        ],
        files: projectExample(fxContacts, `${fxPath}/ContactsController.java`),
        task: "Teste successivement un nom vide, un téléphone incomplet et un email valide. Observe le champ qui reçoit le focus.",
        takeaway:
          "Les composants injectés deviennent disponibles pour les liaisons dans initialize.",
        quiz: quiz(
          "Quand configurer une liaison utilisant les champs injectés ?",
          [
            "Avant FXMLLoader.load",
            "Dans le constructeur avant l’injection",
            "Dans initialize après l’injection",
          ],
          2,
          "initialize reçoit une vue dont les champs @FXML ont été affectés.",
        ),
        link: javafx + "javafx.fxml/javafx/fxml/FXML.html",
      }),
      lesson({
        id: "javafx-observable-list",
        title: "ObservableList et sélection des contacts",
        minutes: 28,
        summary:
          "Une ObservableList annonce ses changements aux composants qui l’observent. La ListView affiche cette collection. Un écouteur de sélection présente les coordonnées de l’instance choisie.",
        sections: [
          section(
            "Partager la collection",
            "initialize transmet contacts à contactsView.setItems. Ajouter un Contact dans cette collection entraîne l’affichage de sa ligne. Le toString du record fournit le nom visible.",
            [
              "Le modèle de sélection expose le contact courant.",
              "La zone de détails lit les accesseurs nom(), telephone() et email().",
            ],
          ),
          section(
            "Vérifier le cycle complet",
            "Ajoute deux contacts, sélectionne chaque ligne puis redimensionne la fenêtre. Le projet conserve les contacts en mémoire durant sa session et propose les sources pour poursuivre vers une persistance.",
            [
              "La validation précède toute insertion dans la collection.",
              "La vue sélectionne et fait défiler vers le nouveau contact après l’ajout.",
            ],
          ),
        ],
        files: projectExample(fxContacts, `${fxPath}/ContactsController.java`),
        task: "Ajoute deux personnes puis vérifie que chaque sélection présente ses propres coordonnées. Personnalise le texte affiché lorsque la sélection est vide.",
        takeaway:
          "La collection observable annonce les changements et la sélection donne accès à l’instance affichée.",
        quiz: quiz(
          "Quel objet porte le contact choisi ?",
          [
            "La propriété selectedItem du modèle de sélection",
            "Le compilateur javac",
            "Le taux de conversion",
          ],
          0,
          "Le modèle de sélection expose l’élément actuellement choisi dans la ListView.",
        ),
        link: javafx + "javafx.controls/javafx/scene/control/ListView.html",
      }),
    ],
  },
];

export const javaLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "JVM, méthodes et instances",
    objective:
      "Compile une classe Java, organise tes données et crée des objets encapsulés.",
    definition:
      "Java est un langage orienté objet dont le code est compilé en bytecode exécuté par une JVM. Le JDK apporte les outils nécessaires pour compiler et lancer les programmes.",
    color: levelColors[0],
    prerequisites:
      "Savoir créer un fichier et saisir du texte. Les premières leçons expliquent le JDK et les commandes.",
    outcomes: [
      "Utiliser variables, String, Scanner et contrôle de flux.",
      "Définir une méthode avec paramètres et retour.",
      "Créer plusieurs instances avec un constructeur, des getters et des setters.",
    ],
    chapters: beginner,
    projects: [javaTasks],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Exceptions et interfaces JavaFX",
    objective:
      "Valide des données puis relie un formulaire JavaFX à un calcul séparé.",
    definition:
      "JavaFX fournit une fenêtre Stage et une Scene contenant des nœuds graphiques. Les gestionnaires d’événements réagissent aux actions et actualisent l’interface.",
    color: levelColors[1],
    prerequisites:
      "Comprendre les classes, les instances et les méthodes. Prépare un JDK 17 et Maven pour les fenêtres.",
    outcomes: [
      "Traiter une exception et centraliser une validation.",
      "Construire Stage, Scene, champs et conteneurs.",
      "Réagir avec une lambda puis afficher un résultat décimal.",
    ],
    chapters: intermediate,
    projects: [fxConverter],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "FXML, Scene Builder et contrôleurs",
    objective:
      "Sépare les données, la vue FXML et les actions dans un carnet de contacts.",
    definition:
      "FXML décrit une scène sous forme XML. Scene Builder permet de l’éditer visuellement et le contrôleur relie ses composants aux actions Java.",
    color: levelColors[2],
    prerequisites:
      "Savoir construire une scène JavaFX et valider les actions d’un formulaire.",
    outcomes: [
      "Distinguer référence partagée et instance indépendante.",
      "Charger du FXML et utiliser @FXML avec initialize.",
      "Valider un Contact et mettre à jour une ListView avec ObservableList.",
    ],
    chapters: advanced,
    projects: [fxContacts],
  },
];
