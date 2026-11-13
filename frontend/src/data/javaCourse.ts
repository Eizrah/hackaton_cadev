import {
  lesson,
  levelColors,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { fxContacts, fxConverter, javaTasks } from "./javaProjects";
import type { WebLevel } from "./webCourseTypes";

const docs = "https://docs.oracle.com/en/java/javase/21/docs/api/";
const tutorial = "https://dev.java/learn/";

// ═══════════════════════════════════════════════════════════════════════════
// 🟢 NIVEAU DÉBUTANT - Les fondamentaux de Java
// ═══════════════════════════════════════════════════════════════════════════

const beginner: WebLevel["chapters"] = [
  {
    id: "java-introduction",
    title: "Introduction à Java",
    description: "Découvre Java et le déroulement de la formation",
    lessons: [
      lesson({
        id: "java-intro-langage",
        title: "Qu'est-ce que Java et comment se déroulera cette formation ?",
        minutes: 15,
        summary:
          "Java est un langage orienté objet utilisé dans les applications d'entreprise, Android, le web backend et les systèmes distribués. Cette formation progressive te mènera des bases jusqu'à la création d'applications complètes.",
        sections: [
          section(
            "Pourquoi Java ?",
            "Java est l'un des langages les plus utilisés en entreprise grâce à sa robustesse, sa portabilité (Write Once, Run Anywhere) et son écosystème mature.",
            [
              "Utilisé par les grandes entreprises (Google, Amazon, Netflix)",
              "JVM permet d'exécuter sur Windows, Linux, Mac sans recompiler",
              "Fortement typé : détecte les erreurs à la compilation",
              "Garbage collector automatique : gestion mémoire simplifiée",
            ],
          ),
          section(
            "Déroulement de la formation",
            "Trois niveaux progressifs avec leçons, exemples pratiques et projets. Chaque niveau se termine par un exercice récapitulatif.",
            [
              "🟢 Débutant : Variables, conditions, boucles, méthodes, tableaux",
              "🟡 Intermédiaire : POO, interfaces, collections, fichiers, JDBC",
              "🔴 Avancé : JavaFX (GUI) + SQLite, projets desktop complets",
            ],
          ),
          section(
            "Java vs C++",
            "Java simplifie certains aspects de C++ pour plus de sécurité et portabilité.",
            [
              "❌ Pas de pointeurs ni gestion manuelle de la mémoire",
              "❌ Pas d'héritage multiple (remplacé par les interfaces)",
              "✅ Garbage collector automatique",
              "✅ Bytecode portable (JVM) vs code natif",
              "✅ Bibliothèque standard plus riche et uniforme",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `// Bienvenue dans Java !
public class Main {
    public static void main(String[] args) {
        System.out.println("Bonjour DevAfrica !");
        System.out.println("Je commence mon apprentissage Java.");
        
        // Java est fortement typé
        String nom = "Tiana";
        System.out.println("Je m'appelle " + nom + " et je vais devenir développeur !");
    }
}`,
        ),
        task: "Modifie le code pour afficher ton propre nom et ton objectif avec Java.",
        takeaway:
          "Java est robuste, portable et utilisé massivement en entreprise.",
        quiz: quiz(
          "Quelle est la principale différence entre Java et C++ ?",
          ["Java est plus rapide", "Java utilise une JVM et n'a pas d'héritage multiple", "Java est plus ancien"],
          1,
          "Java compile vers du bytecode exécuté par la JVM et remplace l'héritage multiple par les interfaces.",
        ),
        link: tutorial,
      }),
    ],
  },
  {
    id: "java-donnees-types",
    title: "Variables et types de données",
    description: "Types primitifs, String et opérateurs",
    lessons: [
      lesson({
        id: "java-variables-types",
        title: "Variables et types primitifs",
        minutes: 20,
        summary:
          "Java est fortement typé : chaque variable a un type déclaré. Les types primitifs sont int, double, boolean, char, etc. String est une classe pour le texte. final rend une variable constante.",
        sections: [
          section(
            "Types primitifs",
            "Java a 8 types primitifs : 4 pour les entiers, 2 pour les flottants, 1 booléen, 1 caractère.",
            [
              "int : entiers (-2 milliards à +2 milliards)",
              "long : grands entiers (suffixe L)",
              "double : flottants double précision",
              "float : flottants simple précision (suffixe f)",
              "boolean : true ou false",
              "char : un caractère entre apostrophes 'A'",
            ],
          ),
          section(
            "String et final",
            "String est une classe pour manipuler du texte. final empêche la réaffectation d'une variable (comme const en C++).",
            [
              "String texte = \"Bonjour\" (guillemets doubles)",
              "final double PI = 3.14159 (constante)",
              "Convention : MAJUSCULES pour les constantes",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        // Types primitifs
        int age = 20;
        double taille = 1.75;
        boolean etudiant = true;
        char initiale = 'T';
        
        // String (classe)
        String nom = "Tiana";
        
        // Constante
        final double TVA = 0.18;
        
        System.out.println("Nom: " + nom + " (initiale: " + initiale + ")");
        System.out.println("Age: " + age + " ans");
        System.out.println("Taille: " + taille + " m");
        System.out.println("Étudiant: " + etudiant);
        System.out.println("TVA: " + (TVA * 100) + "%");
        
        // Calcul
        double prixHT = 1000;
        double prixTTC = prixHT * (1 + TVA);
        System.out.println("Prix TTC: " + prixTTC + " Ar");
    }
}`,
        ),
        task: "Crée des variables pour ton nom, âge, ville et affiche-les.",
        takeaway:
          "Java est fortement typé avec 8 types primitifs et String pour le texte.",
        quiz: quiz(
          "Quel mot-clé rend une variable constante ?",
          ["const", "final", "static"],
          1,
          "final empêche la réaffectation d'une variable.",
        ),
        link: tutorial + "language-basics/variables.html",
      }),
      lesson({
        id: "java-operateurs",
        title: "Opérateurs arithmétiques et logiques",
        minutes: 22,
        summary:
          "Les opérateurs permettent calculs (+, -, *, /, %) et comparaisons (==, !=, <, >, <=, >=). Les opérateurs logiques combinent conditions (&&, ||, !). Attention : division entière entre int.",
        sections: [
          section(
            "Opérateurs arithmétiques",
            "Java supporte toutes les opérations mathématiques. Attention : division entre int donne un int.",
            [
              "+ addition, - soustraction",
              "* multiplication, / division",
              "% modulo (reste de la division)",
              "5 / 2 = 2 (entier), 5.0 / 2 = 2.5 (flottant)",
            ],
          ),
          section(
            "Comparaisons et logique",
            "Les comparaisons retournent boolean. && (ET), || (OU), ! (NON) combinent les conditions.",
            [
              "== égal, != différent, <, >, <=, >=",
              "&& : ET (les deux doivent être vrais)",
              "|| : OU (au moins un doit être vrai)",
              "! : NON (inverse le booléen)",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        // Arithmétiques
        int a = 10, b = 3;
        System.out.println("a = " + a + ", b = " + b);
        System.out.println("Addition: " + (a + b));
        System.out.println("Soustraction: " + (a - b));
        System.out.println("Multiplication: " + (a * b));
        System.out.println("Division: " + (a / b));  // 3 (entier)
        System.out.println("Division flottante: " + (a / (double)b));  // 3.333...
        System.out.println("Modulo: " + (a % b));    // 1
        
        // Comparaisons
        System.out.println("\\n=== Comparaisons ===");
        System.out.println("a == b: " + (a == b));
        System.out.println("a != b: " + (a != b));
        System.out.println("a > b: " + (a > b));
        
        // Logique
        int age = 20;
        boolean aPermis = true;
        System.out.println("\\n=== Logique ===");
        System.out.println("Peut conduire? " + (age >= 18 && aPermis));
        System.out.println("Mineur ou sans permis? " + (age < 18 || !aPermis));
    }
}`,
        ),
        task: "Calcule le prix TTC d'un produit avec TVA 18% et affiche chaque étape.",
        takeaway:
          "Les opérateurs permettent calculs, comparaisons et logique booléenne.",
        quiz: quiz(
          "10 % 3 retourne :",
          ["3", "1", "0"],
          1,
          "Le modulo retourne le reste : 10 ÷ 3 = 3 reste 1.",
        ),
        link: tutorial + "language-basics/operators.html",
      }),
      lesson({
        id: "java-scanner",
        title: "Saisie utilisateur avec Scanner",
        minutes: 18,
        summary:
          "Scanner lit l'entrée utilisateur depuis System.in. nextLine() lit une ligne, nextInt() lit un entier, nextDouble() lit un flottant. Toujours fermer le Scanner avec close().",
        sections: [
          section(
            "Créer un Scanner",
            "Scanner est dans java.util. Il faut l'importer et le créer avec new Scanner(System.in).",
            [
              "import java.util.Scanner; en haut du fichier",
              "Scanner scanner = new Scanner(System.in);",
              "scanner.close(); à la fin (libère les ressources)",
            ],
          ),
          section(
            "Méthodes de lecture",
            "nextLine() lit jusqu'au retour à la ligne. nextInt(), nextDouble() lisent et convertissent automatiquement.",
            [
              "nextLine() : String",
              "nextInt() : int",
              "nextDouble() : double",
              "next() : String (jusqu'à l'espace)",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Lire String
        System.out.print("Ton nom ? ");
        String nom = scanner.nextLine();
        System.out.println("Bonjour " + nom + " !");
        
        // Lire int
        System.out.print("Ton âge ? ");
        int age = scanner.nextInt();
        System.out.println("Dans 5 ans, tu auras " + (age + 5) + " ans.");
        
        // Lire double
        System.out.print("Prix ? ");
        double prix = scanner.nextDouble();
        System.out.print("Quantité ? ");
        int quantite = scanner.nextInt();
        System.out.println("Total : " + (prix * quantite) + " Ar");
        
        scanner.close();
    }
}`,
          { stdin: "Tiana\n20\n2500\n3\n" },
        ),
        task: "Demande deux nombres et affiche leur somme, différence et produit.",
        takeaway:
          "Scanner lit l'entrée utilisateur avec nextLine(), nextInt(), nextDouble().",
        quiz: quiz(
          "Quelle méthode lit une ligne complète ?",
          ["next()", "nextLine()", "readLine()"],
          1,
          "nextLine() lit toute la ligne jusqu'au retour.",
        ),
        link: docs + "java.base/java/util/Scanner.html",
      }),
    ],
  },
  {
    id: "java-conditions",
    title: "Structures conditionnelles",
    description: "Prendre des décisions avec if, else et switch",
    lessons: [
      lesson({
        id: "java-if-else",
        title: "if, else if et else",
        minutes: 20,
        summary:
          "if teste une condition. Si vraie, exécute le bloc entre accolades. else if teste une alternative, else capture tous les autres cas.",
        sections: [
          section(
            "Structure conditionnelle",
            "if évalue une expression booléenne. Si true, le code entre accolades s'exécute.",
            [
              "Accolades {} obligatoires (bonne pratique)",
              "else if pour conditions alternatives",
              "else pour tous les autres cas",
            ],
          ),
          section(
            "Conditions multiples",
            "Enchaîne plusieurs else if. Seul le premier bloc true s'exécute.",
            [
              "Test dans l'ordre d'écriture",
              "Une fois un bloc exécuté, on sort de la structure",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        // Condition simple
        int age = 18;
        if (age >= 18) {
            System.out.println("Majeur");
        } else {
            System.out.println("Mineur");
        }
        
        // Conditions multiples
        int note = 15;
        if (note >= 16) {
            System.out.println("Excellent !");
        } else if (note >= 12) {
            System.out.println("Bien");
        } else if (note >= 10) {
            System.out.println("Passable");
        } else {
            System.out.println("Insuffisant");
        }
        
        // Logique combinée
        age = 20;
        boolean aPermis = true;
        if (age >= 18 && aPermis) {
            System.out.println("Peut conduire");
        } else {
            System.out.println("Ne peut pas conduire");
        }
    }
}`,
        ),
        task: "Programme : température → froid (<15), agréable (15-25), chaud (>25).",
        takeaway:
          "Les conditions permettent au programme de s'adapter aux situations.",
        quiz: quiz(
          "else if sert à :",
          ["Terminer if", "Tester une condition alternative", "Répéter"],
          1,
          "else if teste une condition alternative si la première est fausse.",
        ),
        link: tutorial + "language-basics/control-flow.html",
      }),
      lesson({
        id: "java-switch",
        title: "switch : alternative élégante",
        minutes: 18,
        summary:
          "switch compare une valeur à différents cas (case). Plus lisible que de nombreux else if pour une même variable. default capture tous les cas non traités. break termine chaque cas.",
        sections: [
          section(
            "Structure switch",
            "switch prend une expression. case définit chaque valeur possible. default est le cas par défaut.",
            [
              "Plus lisible que plusieurs else if",
              "break obligatoire (sinon continue au cas suivant)",
              "default = cas par défaut",
            ],
          ),
          section(
            "Switch amélioré (Java 14+)",
            "Java 14+ permet switch avec -> (pas besoin de break) et yield pour retourner une valeur.",
            [
              "case 1 -> action; (pas de break nécessaire)",
              "Peut retourner une valeur",
              "Plus moderne et sûr",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        // Switch classique
        int choix = 2;
        switch (choix) {
            case 1:
                System.out.println("Nouveau");
                break;
            case 2:
                System.out.println("Ouvrir");
                break;
            case 3:
                System.out.println("Sauvegarder");
                break;
            case 4:
                System.out.println("Quitter");
                break;
            default:
                System.out.println("Choix invalide");
                break;
        }
        
        // Switch moderne (Java 14+)
        String jour = "lundi";
        String typeJour = switch (jour) {
            case "lundi", "mardi", "mercredi", "jeudi", "vendredi" -> "Jour de travail";
            case "samedi", "dimanche" -> "Week-end";
            default -> "Jour inconnu";
        };
        System.out.println(jour + ": " + typeJour);
        
        // Calculatrice
        char operation = '+';
        int a = 10, b = 3;
        double resultat = switch (operation) {
            case '+' -> a + b;
            case '-' -> a - b;
            case '*' -> a * b;
            case '/' -> a / (double)b;
            default -> 0;
        };
        System.out.println(a + " " + operation + " " + b + " = " + resultat);
    }
}`,
        ),
        task: "Calculatrice avec switch : opération (+,-,*,/) et deux nombres.",
        takeaway:
          "switch : code plus clair pour comparer une valeur à plusieurs cas.",
        quiz: quiz(
          "Que fait default dans switch ?",
          ["Erreur", "Cas par défaut", "Compare à 'default'"],
          1,
          "default capture tous les cas non traités (comme else).",
        ),
        link: tutorial + "language-basics/control-flow.html",
      }),
    ],
  },
  {
    id: "java-methodes",
    title: "Méthodes",
    description: "Réutiliser du code avec les méthodes",
    lessons: [
      lesson({
        id: "java-def-methodes",
        title: "Définir et appeler des méthodes",
        minutes: 22,
        summary:
          "Une méthode est un bloc réutilisable. La signature définit le type de retour, le nom et les paramètres. return renvoie une valeur. static permet d'appeler sans créer d'objet.",
        sections: [
          section(
            "Créer une méthode",
            "Signature : type_retour nomMethode(paramètres). void = pas de retour. static = méthode de classe.",
            [
              "public static void afficher() {} // Pas de retour",
              "public static int calculer(int x) { return x * 2; }",
              "Appel : nomMethode(arguments);",
            ],
          ),
          section(
            "Paramètres et return",
            "Les paramètres sont les entrées. return termine la méthode et renvoie une valeur.",
            [
              "Paramètres = variables locales à la méthode",
              "return obligatoire si type non-void",
              "Une méthode peut avoir plusieurs return (dans if/else)",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    // Méthode sans retour
    public static void saluer(String nom) {
        System.out.println("Bonjour " + nom + " !");
    }
    
    // Méthode avec retour
    public static double calculerTVA(double prix, double taux) {
        return prix * (1 + taux);
    }
    
    // Méthode avec plusieurs paramètres
    public static double moyenne(double a, double b, double c) {
        return (a + b + c) / 3;
    }
    
    // Méthode avec condition
    public static String mention(double note) {
        if (note >= 16) {
            return "Excellent";
        } else if (note >= 12) {
            return "Bien";
        } else if (note >= 10) {
            return "Passable";
        } else {
            return "Insuffisant";
        }
    }
    
    public static void main(String[] args) {
        saluer("Tiana");
        saluer("Soa");
        
        double prixHT = 1000;
        double prixTTC = calculerTVA(prixHT, 0.18);
        System.out.println("Prix TTC: " + prixTTC + " Ar");
        
        double moy = moyenne(12, 15, 14);
        System.out.println("Moyenne: " + moy + "/20");
        System.out.println("Mention: " + mention(moy));
    }
}`,
        ),
        task: "Crée une méthode aireCercle(double rayon) qui retourne Math.PI * rayon * rayon.",
        takeaway:
          "Les méthodes réutilisent du code et organisent le programme.",
        quiz: quiz(
          "Que signifie void ?",
          ["Méthode privée", "Pas de valeur de retour", "Méthode statique"],
          1,
          "void indique qu'une méthode ne retourne aucune valeur.",
        ),
        link: tutorial + "classes-objects/methods.html",
      }),
    ],
  },
  {
    id: "java-boucles",
    title: "Boucles",
    description: "Répéter des actions avec for et while",
    lessons: [
      lesson({
        id: "java-for-while",
        title: "Boucles for et while",
        minutes: 22,
        summary:
          "for répète un nombre connu de fois. while répète tant qu'une condition est vraie. break termine la boucle, continue passe à l'itération suivante.",
        sections: [
          section(
            "Boucle for",
            "for(initialisation; condition; incrémentation) répète le bloc. Classique pour parcourir des plages de nombres.",
            [
              "for(int i = 0; i < 5; i++) → 0,1,2,3,4",
              "for(int i = 1; i <= 5; i++) → 1,2,3,4,5",
              "i++ équivaut à i = i + 1",
            ],
          ),
          section(
            "Boucle while",
            "while(condition) continue tant que la condition est vraie. Attention aux boucles infinies !",
            [
              "La condition doit pouvoir devenir fausse",
              "Utilise un compteur ou condition de sortie",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        // for classique
        System.out.println("Compte 1 à 5:");
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
        
        // while
        System.out.println("\\nDécompte:");
        int compteur = 5;
        while (compteur > 0) {
            System.out.println(compteur);
            compteur--;
        }
        System.out.println("Go !");
        
        // break et continue
        System.out.println("\\nPairs jusqu'à 10:");
        for (int i = 1; i <= 10; i++) {
            if (i % 2 != 0) {
                continue;  // Passe au suivant
            }
            System.out.println(i);
        }
        
        // Table de multiplication
        System.out.println("\\nTable de 7:");
        for (int i = 1; i <= 10; i++) {
            System.out.println("7 x " + i + " = " + (7 * i));
        }
    }
}`,
        ),
        task: "Boucle affichant la table de multiplication de 9 (1 à 10).",
        takeaway:
          "Les boucles répètent efficacement du code.",
        quiz: quiz(
          "Que fait i++ dans une boucle for ?",
          ["Initialise i", "Incrémente i de 1", "Compare i"],
          1,
          "i++ incrémente i de 1 à chaque itération.",
        ),
        link: tutorial + "language-basics/control-flow.html",
      }),
    ],
  },
  {
    id: "java-tableaux",
    title: "Tableaux (Arrays)",
    description: "Stocker plusieurs valeurs du même type",
    lessons: [
      lesson({
        id: "java-arrays",
        title: "Créer et parcourir des tableaux",
        minutes: 20,
        summary:
          "Un tableau stocke plusieurs valeurs du même type avec une taille fixe. Déclaration : type[] nom = new type[taille]. Accès par index (commence à 0). length donne la taille.",
        sections: [
          section(
            "Créer un tableau",
            "Deux syntaxes : initialisation directe ou avec new. La taille est fixe après création.",
            [
              "int[] nombres = {1, 2, 3}; // Initialisation directe",
              "String[] noms = new String[5]; // Taille 5, valeurs null",
              "Accès : nombres[0], nombres[1]...",
              "Taille : nombres.length",
            ],
          ),
          section(
            "Parcourir un tableau",
            "for classique avec index ou for-each pour lire seulement.",
            [
              "for(int i = 0; i < tab.length; i++) // Avec index",
              "for(type element : tab) // For-each (lecture seule)",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `public class Main {
    public static void main(String[] args) {
        // Déclaration et initialisation
        String[] fruits = {"banane", "mangue", "ananas"};
        System.out.println("Fruits:");
        for (String fruit : fruits) {
            System.out.println("- " + fruit);
        }
        
        // Création avec new
        int[] notes = new int[5];
        notes[0] = 15;
        notes[1] = 17;
        notes[2] = 12;
        notes[3] = 18;
        notes[4] = 14;
        
        // Parcours avec index
        System.out.println("\\nNotes:");
        for (int i = 0; i < notes.length; i++) {
            System.out.println("Note " + (i+1) + ": " + notes[i] + "/20");
        }
        
        // Calcul de moyenne
        int somme = 0;
        for (int note : notes) {
            somme += note;
        }
        double moyenne = somme / (double)notes.length;
        System.out.println("\\nMoyenne: " + moyenne + "/20");
        
        // Trouver le maximum
        int max = notes[0];
        for (int note : notes) {
            if (note > max) {
                max = note;
            }
        }
        System.out.println("Meilleure note: " + max + "/20");
    }
}`,
        ),
        task: "Crée un tableau de 5 prix et calcule le prix total et moyen.",
        takeaway:
          "Les tableaux stockent plusieurs valeurs du même type avec taille fixe.",
        quiz: quiz(
          "Quel est l'index du premier élément ?",
          ["1", "0", "length-1"],
          1,
          "Les tableaux commencent à l'index 0.",
        ),
        link: tutorial + "language-basics/arrays.html",
      }),
    ],
  },
  {
    id: "java-exceptions",
    title: "Gestion des exceptions",
    description: "Gérer les erreurs avec try/catch",
    lessons: [
      lesson({
        id: "java-try-catch",
        title: "try, catch et finally",
        minutes: 22,
        summary:
          "Les exceptions arrêtent le programme. try/catch capture les exceptions et réagit sans planter. finally exécute du code dans tous les cas. throw lance manuellement une exception.",
        sections: [
          section(
            "Capturer les exceptions",
            "try tente d'exécuter du code. catch capture l'exception et exécute du code alternatif.",
            [
              "NumberFormatException : erreur de conversion",
              "ArithmeticException : division par zéro",
              "ArrayIndexOutOfBoundsException : index hors limites",
            ],
          ),
          section(
            "Exceptions multiples et finally",
            "Plusieurs catch capturent différents types. finally s'exécute toujours.",
            [
              "finally : fermer ressources (fichiers, Scanner)",
              "throw new Exception(\"message\") : lever une exception",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Gestion simple
        try {
            System.out.print("Âge ? ");
            int age = scanner.nextInt();
            System.out.println("Tu as " + age + " ans");
        } catch (Exception e) {
            System.out.println("❌ Entre un nombre !");
        }
        
        // Exceptions multiples
        try {
            System.out.print("Premier nombre ? ");
            int a = scanner.nextInt();
            System.out.print("Deuxième nombre ? ");
            int b = scanner.nextInt();
            System.out.println("Résultat : " + (a / b));
        } catch (ArithmeticException e) {
            System.out.println("❌ Division par zéro impossible");
        } catch (Exception e) {
            System.out.println("❌ Nombres invalides");
        } finally {
            System.out.println("Fin du calcul");
        }
        
        scanner.close();
    }
    
    // Méthode qui lance une exception
    public static void verifierAge(int age) throws Exception {
        if (age < 0) {
            throw new Exception("Âge négatif impossible");
        }
        System.out.println("Âge valide: " + age);
    }
}`,
          { stdin: "vingt\n10\n0\n" },
        ),
        task: "Programme de division gérant ArithmeticException et Exception.",
        takeaway:
          "try/catch gère les erreurs sans planter le programme.",
        quiz: quiz(
          "Que fait catch ?",
          ["Lance exception", "Capture exception", "Arrête programme"],
          1,
          "catch capture une exception pour éviter le plantage.",
        ),
        link: tutorial + "essential-java-classes/exceptions.html",
      }),
    ],
  },
  {
    id: "java-exercice-final-debutant",
    title: "🎯 Exercice Final Débutant",
    description: "Projet utilisant tous les concepts du niveau",
    lessons: [
      lesson({
        id: "java-projet-debutant",
        title: "Gestionnaire de Notes",
        minutes: 45,
        summary:
          "Crée un programme complet qui gère des notes d'étudiants avec menu, méthodes, tableaux, conditions et gestion d'erreurs.",
        sections: [
          section(
            "Fonctionnalités requises",
            "Menu interactif avec 5 options. Utilise tous les concepts appris.",
            [
              "1. Ajouter une note (validation 0-20)",
              "2. Afficher toutes les notes",
              "3. Calculer la moyenne (méthode)",
              "4. Notes au-dessus de la moyenne",
              "5. Quitter (switch ou if/else)",
            ],
          ),
          section(
            "Concepts à utiliser",
            "Ce projet consolide tout le niveau débutant.",
            [
              "Tableaux pour stocker les notes",
              "Boucle while pour le menu",
              "Switch ou if/else pour les choix",
              "Méthodes pour organiser",
              "try/catch pour gérer les erreurs",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.util.Scanner;

public class Main {
    static double[] notes = new double[100];
    static int nbNotes = 0;
    
    public static void afficherMenu() {
        System.out.println("\\n=== GESTIONNAIRE DE NOTES ===");
        System.out.println("1. Ajouter une note");
        System.out.println("2. Afficher toutes les notes");
        System.out.println("3. Calculer la moyenne");
        System.out.println("4. Notes au-dessus de la moyenne");
        System.out.println("5. Quitter");
    }
    
    public static void ajouterNote(Scanner scanner) {
        // TODO: À compléter
        // Demander une note (0-20)
        // Valider avec try/catch
        // Ajouter au tableau notes[]
    }
    
    public static double calculerMoyenne() {
        // TODO: À compléter
        // Retourner la moyenne ou 0 si vide
        return 0;
    }
    
    public static void afficherNotes() {
        // TODO: À compléter
        // Afficher toutes les notes
    }
    
    public static void notesAuDessusMoyenne() {
        // TODO: À compléter
        // Afficher les notes > moyenne
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean continuer = true;
        
        while (continuer) {
            afficherMenu();
            System.out.print("Choix ? ");
            
            try {
                int choix = scanner.nextInt();
                
                switch (choix) {
                    case 1:
                        ajouterNote(scanner);
                        break;
                    case 2:
                        afficherNotes();
                        break;
                    case 3:
                        double moy = calculerMoyenne();
                        System.out.println("Moyenne: " + moy + "/20");
                        break;
                    case 4:
                        notesAuDessusMoyenne();
                        break;
                    case 5:
                        continuer = false;
                        System.out.println("Au revoir !");
                        break;
                    default:
                        System.out.println("Choix invalide");
                }
            } catch (Exception e) {
                System.out.println("❌ Entre un nombre valide");
                scanner.nextLine(); // Vider le buffer
            }
        }
        
        scanner.close();
    }
}`,
        ),
        task: "Complète toutes les méthodes pour créer un gestionnaire de notes fonctionnel.",
        takeaway:
          "Tu maîtrises maintenant les fondamentaux de Java pour créer des programmes complets !",
        quiz: quiz(
          "Quel concept n'est PAS au niveau débutant ?",
          ["Boucles", "Méthodes", "Classes et objets (POO)"],
          2,
          "La POO sera vue au niveau intermédiaire.",
        ),
        link: tutorial,
      }),
    ],
  },
];


// ═══════════════════════════════════════════════════════════════════════════
// 🟡 NIVEAU INTERMÉDIAIRE - POO, Interfaces et JDBC
// ═══════════════════════════════════════════════════════════════════════════

const intermediate: WebLevel["chapters"] = [
  {
    id: "java-poo-intro",
    title: "Introduction à la POO",
    description: "Classes, objets, attributs et méthodes",
    lessons: [
      lesson({
        id: "java-classes-objets",
        title: "Classes et objets : créer des modèles",
        minutes: 25,
        summary:
          "Une classe est un modèle (blueprint). Un objet est une instance de classe. Les attributs stockent les données, les méthodes définissent les comportements. Le constructeur initialise l'objet.",
        sections: [
          section(
            "Qu'est-ce qu'une classe ?",
            "Une classe définit la structure et le comportement d'objets. Comme un plan de maison avant construction.",
            [
              "class NomClasse {} définit une classe",
              "Constructeur : même nom que la classe",
              "this = référence à l'instance actuelle",
              "new NomClasse() crée une instance",
            ],
          ),
          section(
            "Attributs et méthodes",
            "Les attributs sont les variables de l'objet. Les méthodes (non-static) sont ses fonctions.",
            [
              "Attributs : private pour l'encapsulation",
              "Méthodes : public pour l'accès",
              "Getters/Setters : accéder aux attributs privés",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `class Etudiant {
    // Attributs (données)
    private String nom;
    private int age;
    private String filiere;
    private double[] notes;
    private int nbNotes;
    
    // Constructeur
    public Etudiant(String nom, int age, String filiere) {
        this.nom = nom;
        this.age = age;
        this.filiere = filiere;
        this.notes = new double[10];
        this.nbNotes = 0;
    }
    
    // Méthodes (comportements)
    public void ajouterNote(double note) {
        if (nbNotes < notes.length) {
            notes[nbNotes] = note;
            nbNotes++;
            System.out.println("Note " + note + " ajoutée pour " + nom);
        }
    }
    
    public double moyenne() {
        if (nbNotes == 0) return 0;
        double somme = 0;
        for (int i = 0; i < nbNotes; i++) {
            somme += notes[i];
        }
        return somme / nbNotes;
    }
    
    public void afficher() {
        System.out.println("\\n=== " + nom + " ===");
        System.out.println("Âge: " + age + " ans");
        System.out.println("Filière: " + filiere);
        System.out.println("Moyenne: " + moyenne() + "/20");
    }
}

public class Main {
    public static void main(String[] args) {
        // Créer des objets
        Etudiant etudiant1 = new Etudiant("Tiana", 20, "Informatique");
        Etudiant etudiant2 = new Etudiant("Soa", 19, "Gestion");
        
        // Utiliser les méthodes
        etudiant1.ajouterNote(15);
        etudiant1.ajouterNote(17);
        etudiant1.afficher();
        
        etudiant2.ajouterNote(14);
        etudiant2.afficher();
    }
}`,
        ),
        task: "Crée une classe Voiture avec marque, modèle, année et méthode demarrer().",
        takeaway:
          "Les classes modélisent des objets du monde réel avec données et comportements.",
        quiz: quiz(
          "Quel mot-clé crée une instance ?",
          ["class", "new", "this"],
          1,
          "new crée une nouvelle instance de classe.",
        ),
        link: tutorial + "classes-objects/",
      }),
    ],
  },
  {
    id: "java-heritage",
    title: "Héritage : UN SEUL parent (vs C++)",
    description: "Héritage simple en Java",
    lessons: [
      lesson({
        id: "java-heritage-simple",
        title: "Héritage simple : Java vs C++",
        minutes: 28,
        summary:
          "Java permet l'héritage simple uniquement : une classe ne peut hériter que d'UNE SEULE classe parent (contrairement à C++ qui permet l'héritage multiple). extends définit le parent. super() appelle le constructeur parent.",
        sections: [
          section(
            "Java vs C++ : Héritage",
            "Java simplifie et sécurise l'héritage en n'autorisant qu'un seul parent direct.",
            [
              "❌ C++ : class Enfant : public Parent1, public Parent2 {} ✅ autorisé",
              "❌ Java : class Enfant extends Parent1, Parent2 {} ❌ INTERDIT",
              "✅ Java : class Enfant extends Parent {} ✅ UN SEUL parent",
              "🔑 Alternative Java : INTERFACES (multiple autorisé)",
            ],
          ),
          section(
            "Créer une hiérarchie",
            "extends crée une sous-classe. L'enfant hérite de tout et peut ajouter/modifier.",
            [
              "Classe parent = classe de base",
              "Classe enfant = classe dérivée",
              "super() appelle le constructeur parent",
              "@Override redéfinit une méthode parent",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `// Classe parent
class Personne {
    protected String nom;  // protected = accessible aux enfants
    protected int age;
    
    public Personne(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }
    
    public void presenter() {
        System.out.println("Je suis " + nom + ", " + age + " ans");
    }
}

// Classe enfant 1
class Etudiant extends Personne {
    private String filiere;
    
    public Etudiant(String nom, int age, String filiere) {
        super(nom, age);  // Appelle constructeur parent
        this.filiere = filiere;
    }
    
    @Override  // Redéfinit la méthode parent
    public void presenter() {
        super.presenter();  // Appelle version parent
        System.out.println("Filière: " + filiere);
    }
}

// Classe enfant 2
class Professeur extends Personne {
    private String matiere;
    
    public Professeur(String nom, int age, String matiere) {
        super(nom, age);
        this.matiere = matiere;
    }
    
    @Override
    public void presenter() {
        super.presenter();
        System.out.println("J'enseigne: " + matiere);
    }
}

public class Main {
    public static void main(String[] args) {
        // Polymorphisme : type parent, instances enfants
        Personne[] personnes = {
            new Etudiant("Tiana", 20, "Info"),
            new Professeur("M. Rakoto", 45, "Mathématiques"),
            new Etudiant("Soa", 19, "Gestion")
        };
        
        for (Personne p : personnes) {
            p.presenter();
            System.out.println();
        }
    }
}`,
        ),
        task: "Crée Animal (parent) et Chat, Chien (enfants) avec méthode crier().",
        takeaway:
          "Java autorise UN SEUL héritage de classe (vs C++ multiple). Alternative : interfaces.",
        quiz: quiz(
          "Combien de classes parent en Java ?",
          ["Illimité comme C++", "Une seule (héritage simple)", "Aucune"],
          1,
          "Java autorise l'héritage d'UNE SEULE classe (vs C++ qui autorise multiple).",
        ),
        link: tutorial + "classes-objects/inheritance.html",
      }),
    ],
  },
  {
    id: "java-interfaces",
    title: "Interfaces : L'alternative à l'héritage multiple",
    description: "Comprendre et utiliser les interfaces",
    lessons: [
      lesson({
        id: "java-interfaces-intro",
        title: "Interfaces : Le contrat de comportement",
        minutes: 30,
        summary:
          "Une interface définit un contrat : des méthodes que les classes DOIVENT implémenter. Contrairement à l'héritage, une classe peut implémenter PLUSIEURS interfaces. C'est l'alternative Java à l'héritage multiple de C++.",
        sections: [
          section(
            "Qu'est-ce qu'une interface ?",
            "Une interface est un contrat : elle déclare des méthodes sans les implémenter. Les classes qui l'implémentent DOIVENT définir ces méthodes.",
            [
              "interface NomInterface {} déclare une interface",
              "Méthodes sans corps (abstract implicite)",
              "implements pour implémenter une interface",
              "Une classe peut implémenter PLUSIEURS interfaces",
            ],
          ),
          section(
            "Interfaces vs Héritage multiple (C++)",
            "Java remplace l'héritage multiple de C++ par les interfaces pour éviter le problème du diamant.",
            [
              "❌ C++ : class A : public B, public C {} (héritage multiple)",
              "✅ Java : class A implements B, C {} (interfaces multiples)",
              "Avantage : Pas de conflit de méthodes héritées",
              "Une classe = 1 parent + N interfaces",
            ],
          ),
          section(
            "Interface vs Classe abstraite",
            "Interface = contrat pur. Classe abstraite = parent avec code partagé.",
            [
              "Interface : AUCUNE implémentation (Java < 8)",
              "Classe abstraite : peut avoir du code",
              "Interface : implements multiple autorisé",
              "Classe abstraite : extends un seul parent",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `// Interface 1 : Affichable
interface Affichable {
    void afficher();  // Méthode abstraite (pas de corps)
}

// Interface 2 : Sauvegardable
interface Sauvegardable {
    void sauvegarder();
    void charger();
}

// Classe implémentant PLUSIEURS interfaces
class Document implements Affichable, Sauvegardable {
    private String titre;
    private String contenu;
    
    public Document(String titre, String contenu) {
        this.titre = titre;
        this.contenu = contenu;
    }
    
    // Implémentation obligatoire de Affichable
    @Override
    public void afficher() {
        System.out.println("=== " + titre + " ===");
        System.out.println(contenu);
    }
    
    // Implémentation obligatoire de Sauvegardable
    @Override
    public void sauvegarder() {
        System.out.println("Sauvegarde de " + titre + "...");
    }
    
    @Override
    public void charger() {
        System.out.println("Chargement de " + titre + "...");
    }
}

// Autre classe avec les mêmes interfaces
class Image implements Affichable, Sauvegardable {
    private String nom;
    private int largeur, hauteur;
    
    public Image(String nom, int largeur, int hauteur) {
        this.nom = nom;
        this.largeur = largeur;
        this.hauteur = hauteur;
    }
    
    @Override
    public void afficher() {
        System.out.println("Image " + nom + " (" + largeur + "x" + hauteur + ")");
    }
    
    @Override
    public void sauvegarder() {
        System.out.println("Sauvegarde image " + nom);
    }
    
    @Override
    public void charger() {
        System.out.println("Chargement image " + nom);
    }
}

public class Main {
    public static void main(String[] args) {
        // Polymorphisme avec interfaces
        Affichable[] elements = {
            new Document("Rapport", "Contenu du rapport..."),
            new Image("photo.jpg", 1920, 1080)
        };
        
        System.out.println("=== Affichage ===");
        for (Affichable element : elements) {
            element.afficher();
            System.out.println();
        }
        
        // Sauvegarde
        System.out.println("=== Sauvegarde ===");
        Sauvegardable doc = new Document("Notes", "Mes notes...");
        doc.sauvegarder();
    }
}`,
        ),
        task: "Crée interfaces Volant et Nageur. Classe Canard implements les deux.",
        takeaway:
          "Les interfaces sont le contrat Java pour remplacer l'héritage multiple de C++.",
        quiz: quiz(
          "Combien d'interfaces une classe peut implémenter ?",
          ["Une seule", "Autant qu'on veut", "Deux maximum"],
          1,
          "Une classe peut implémenter plusieurs interfaces (contrairement à extends).",
        ),
        link: tutorial + "classes-objects/interfaces.html",
      }),
    ],
  },
  {
    id: "java-encapsulation",
    title: "Encapsulation et modificateurs",
    description: "Protéger les données avec private, protected, public",
    lessons: [
      lesson({
        id: "java-encapsulation",
        title: "Encapsulation : private, protected, public",
        minutes: 22,
        summary:
          "L'encapsulation protège les données. private = accessible dans la classe uniquement. protected = classe + sous-classes. public = partout. Getters/setters contrôlent l'accès.",
        sections: [
          section(
            "Modificateurs d'accès",
            "Java a 4 niveaux de visibilité (vs C++ : 3 niveaux).",
            [
              "private : classe uniquement",
              "default (rien) : package uniquement",
              "protected : package + sous-classes",
              "public : partout",
            ],
          ),
          section(
            "Getters et Setters",
            "Convention JavaBean : getters/setters pour accéder aux attributs privés.",
            [
              "getNom() : retourne l'attribut",
              "setNom(String nom) : modifie l'attribut",
              "Validation dans les setters",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `class CompteBancaire {
    private String proprietaire;
    private double solde;  // Privé : pas d'accès direct
    
    public CompteBancaire(String proprietaire, double soldeInitial) {
        this.proprietaire = proprietaire;
        this.solde = soldeInitial;
    }
    
    // Getter : lire le solde
    public double getSolde() {
        return solde;
    }
    
    // Pas de setter pour solde (modification contrôlée)
    public void deposer(double montant) {
        if (montant > 0) {
            solde += montant;
            System.out.println("Dépôt: " + montant + " Ar");
        } else {
            System.out.println("Montant invalide");
        }
    }
    
    public void retirer(double montant) {
        if (montant > 0 && montant <= solde) {
            solde -= montant;
            System.out.println("Retrait: " + montant + " Ar");
        } else {
            System.out.println("Solde insuffisant ou montant invalide");
        }
    }
    
    public void afficher() {
        System.out.println("Compte de " + proprietaire);
        System.out.println("Solde: " + solde + " Ar");
    }
}

public class Main {
    public static void main(String[] args) {
        CompteBancaire compte = new CompteBancaire("Tiana", 10000);
        compte.afficher();
        
        compte.deposer(5000);
        compte.retirer(3000);
        compte.afficher();
        
        // Impossible d'accéder directement
        // compte.solde = 999999;  // ❌ Erreur de compilation
        
        // Lecture OK via getter
        System.out.println("Solde actuel: " + compte.getSolde() + " Ar");
    }
}`,
        ),
        task: "Crée Produit avec prix privé et getters/setters avec validation (prix > 0).",
        takeaway:
          "L'encapsulation protège les données avec private et contrôle l'accès avec getters/setters.",
        quiz: quiz(
          "Quel modificateur pour attribut accessible uniquement dans la classe ?",
          ["public", "private", "protected"],
          1,
          "private limite l'accès à la classe uniquement.",
        ),
        link: tutorial + "classes-objects/accesscontrol.html",
      }),
    ],
  },
  {
    id: "java-collections",
    title: "Collections : ArrayList, HashMap",
    description: "Structures de données dynamiques",
    lessons: [
      lesson({
        id: "java-arraylist",
        title: "ArrayList : Tableaux dynamiques",
        minutes: 25,
        summary:
          "ArrayList est un tableau redimensionnable automatiquement. Fait partie de java.util. add() ajoute, get(index) lit, remove() supprime. size() donne la taille.",
        sections: [
          section(
            "Créer un ArrayList",
            "ArrayList<Type> nom = new ArrayList<>(); Type = classe (pas primitif : Integer, Double, Boolean).",
            [
              "ArrayList<String> noms = new ArrayList<>();",
              "ArrayList<Integer> nombres = new ArrayList<>();",
              "Génériques <Type> garantissent le type",
            ],
          ),
          section(
            "Méthodes principales",
            "add, get, set, remove, size, clear, contains.",
            [
              "add(element) : ajouter",
              "get(index) : lire",
              "set(index, element) : modifier",
              "remove(index) ou remove(object) : supprimer",
              "size() : nombre d'éléments",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        // Créer ArrayList
        ArrayList<String> fruits = new ArrayList<>();
        
        // Ajouter
        fruits.add("banane");
        fruits.add("mangue");
        fruits.add("ananas");
        System.out.println("Fruits: " + fruits);
        
        // Lire
        System.out.println("Premier fruit: " + fruits.get(0));
        
        // Modifier
        fruits.set(1, "papaye");
        System.out.println("Après modif: " + fruits);
        
        // Supprimer
        fruits.remove("banane");
        System.out.println("Après suppression: " + fruits);
        
        // Parcourir
        System.out.println("\\nTous les fruits:");
        for (String fruit : fruits) {
            System.out.println("- " + fruit);
        }
        
        // Taille
        System.out.println("\\nNombre de fruits: " + fruits.size());
        
        // ArrayList d'entiers
        ArrayList<Integer> notes = new ArrayList<>();
        notes.add(15);
        notes.add(17);
        notes.add(12);
        
        int somme = 0;
        for (int note : notes) {
            somme += note;
        }
        double moyenne = somme / (double)notes.size();
        System.out.println("\\nNotes: " + notes);
        System.out.println("Moyenne: " + moyenne);
    }
}`,
        ),
        task: "Crée ArrayList de tâches avec ajout, affichage, suppression.",
        takeaway:
          "ArrayList = tableau dynamique avec méthodes pratiques.",
        quiz: quiz(
          "Quelle méthode ajoute un élément ?",
          ["put()", "add()", "insert()"],
          1,
          "add() ajoute un élément à l'ArrayList.",
        ),
        link: docs + "java.base/java/util/ArrayList.html",
      }),
      lesson({
        id: "java-hashmap",
        title: "HashMap : Associations clé-valeur",
        minutes: 25,
        summary:
          "HashMap stocke des paires clé-valeur. put(clé, valeur) ajoute, get(clé) lit. Accès rapide par clé. Clés uniques.",
        sections: [
          section(
            "Créer un HashMap",
            "HashMap<TypeClé, TypeValeur> nom = new HashMap<>();",
            [
              "HashMap<String, Integer> ages = new HashMap<>();",
              "HashMap<String, String> emails = new HashMap<>();",
              "Clés et valeurs peuvent être de types différents",
            ],
          ),
          section(
            "Méthodes principales",
            "put, get, remove, containsKey, keySet, values, entrySet.",
            [
              "put(clé, valeur) : ajouter/modifier",
              "get(clé) : lire (null si absent)",
              "remove(clé) : supprimer",
              "containsKey(clé) : vérifier existence",
              "keySet() : ensemble des clés",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        // Créer HashMap
        HashMap<String, String> contacts = new HashMap<>();
        
        // Ajouter
        contacts.put("Tiana", "032 12 345 67");
        contacts.put("Soa", "033 98 765 43");
        contacts.put("Kanto", "034 11 222 33");
        
        // Lire
        System.out.println("Téléphone de Tiana: " + contacts.get("Tiana"));
        
        // Modifier (put avec clé existante)
        contacts.put("Soa", "033 99 999 99");
        
        // Vérifier existence
        if (contacts.containsKey("Tiana")) {
            System.out.println("Tiana est dans les contacts");
        }
        
        // Parcourir les clés
        System.out.println("\\n=== Tous les contacts ===");
        for (String nom : contacts.keySet()) {
            String tel = contacts.get(nom);
            System.out.println(nom + ": " + tel);
        }
        
        // Parcourir avec entrySet (plus efficace)
        System.out.println("\\n=== Avec entrySet ===");
        for (Map.Entry<String, String> entry : contacts.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
        
        // HashMap pour compter
        String texte = "banane mangue banane ananas banane";
        String[] mots = texte.split(" ");
        HashMap<String, Integer> compteur = new HashMap<>();
        
        for (String mot : mots) {
            compteur.put(mot, compteur.getOrDefault(mot, 0) + 1);
        }
        
        System.out.println("\\n=== Compteur ===");
        System.out.println(compteur);
    }
}`,
        ),
        task: "Crée HashMap annuaire avec ajout, recherche, suppression de contacts.",
        takeaway:
          "HashMap = associations clé-valeur avec accès rapide.",
        quiz: quiz(
          "Quelle méthode ajoute une paire clé-valeur ?",
          ["add()", "put()", "set()"],
          1,
          "put(clé, valeur) ajoute ou modifie une paire.",
        ),
        link: docs + "java.base/java/util/HashMap.html",
      }),
    ],
  },
  {
    id: "java-fichiers",
    title: "Manipulation de fichiers",
    description: "Lire et écrire dans des fichiers",
    lessons: [
      lesson({
        id: "java-fichiers-texte",
        title: "Fichiers texte avec Scanner et PrintWriter",
        minutes: 28,
        summary:
          "Scanner(new File(\"fichier.txt\")) lit un fichier. PrintWriter écrit. try-with-resources ferme automatiquement les ressources. Gestion d'exceptions obligatoire.",
        sections: [
          section(
            "Lire un fichier",
            "Scanner peut lire un fichier ligne par ligne. Gestion d'exception FileNotFoundException obligatoire.",
            [
              "Scanner scanner = new Scanner(new File(\"fichier.txt\"));",
              "scanner.hasNextLine() : vérifie s'il reste des lignes",
              "scanner.nextLine() : lit une ligne",
              "scanner.close() : fermer (obligatoire)",
            ],
          ),
          section(
            "Écrire un fichier",
            "PrintWriter écrit dans un fichier. try-with-resources garantit la fermeture.",
            [
              "PrintWriter writer = new PrintWriter(\"fichier.txt\");",
              "writer.println(texte) : écrire une ligne",
              "try-with-resources : fermeture automatique",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.io.File;
import java.io.PrintWriter;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String fichier = "notes.txt";
        
        // Écrire (try-with-resources)
        try (PrintWriter writer = new PrintWriter(fichier)) {
            writer.println("Liste des notes");
            writer.println("===============");
            int[] notes = {15, 17, 12, 18, 14};
            for (int note : notes) {
                writer.println("Note: " + note + "/20");
            }
            System.out.println("Fichier créé !");
        } catch (Exception e) {
            System.out.println("Erreur écriture: " + e.getMessage());
        }
        
        // Lire
        try (Scanner scanner = new Scanner(new File(fichier))) {
            System.out.println("\\n=== Contenu du fichier ===");
            while (scanner.hasNextLine()) {
                String ligne = scanner.nextLine();
                System.out.println(ligne);
            }
        } catch (Exception e) {
            System.out.println("Erreur lecture: " + e.getMessage());
        }
        
        // Ajouter (append)
        try (PrintWriter writer = new PrintWriter(new java.io.FileWriter(fichier, true))) {
            writer.println("Nouvelle note: 16/20");
            System.out.println("\\nNote ajoutée !");
        } catch (Exception e) {
            System.out.println("Erreur: " + e.getMessage());
        }
    }
}`,
        ),
        task: "Crée un programme qui écrit un journal avec dates et le relit.",
        takeaway:
          "Scanner lit, PrintWriter écrit. try-with-resources ferme automatiquement.",
        quiz: quiz(
          "Que fait try-with-resources ?",
          ["Gère les exceptions", "Ferme automatiquement les ressources", "Lit les fichiers"],
          1,
          "try-with-resources ferme automatiquement les ressources (Scanner, Writer, etc.).",
        ),
        link: tutorial + "essential-java-classes/files.html",
      }),
    ],
  },
  {
    id: "java-jdbc-intro",
    title: "JDBC : Bases de données avec SQLite",
    description: "Connecter Java à une base de données",
    lessons: [
      lesson({
        id: "java-jdbc-bases",
        title: "JDBC et SQLite : Connexion et requêtes",
        minutes: 35,
        summary:
          "JDBC (Java Database Connectivity) permet de connecter Java à des bases de données. SQLite est une BD légère, sans serveur. Connection, Statement, ResultSet sont les classes principales.",
        sections: [
          section(
            "JDBC : Les étapes",
            "1. Charger le driver, 2. Créer connexion, 3. Créer statement, 4. Exécuter requête, 5. Traiter résultat, 6. Fermer.",
            [
              "Connection conn = DriverManager.getConnection(url);",
              "Statement stmt = conn.createStatement();",
              "ResultSet rs = stmt.executeQuery(sql);",
              "Toujours fermer dans finally ou try-with-resources",
            ],
          ),
          section(
            "SQLite avec JDBC",
            "SQLite stocke dans un fichier .db. Pas de serveur nécessaire. Parfait pour apprendre et petites applis.",
            [
              "URL : jdbc:sqlite:nom_base.db",
              "Driver : org.sqlite.JDBC (ajouter dépendance)",
              "Même API JDBC que MySQL, PostgreSQL, etc.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.sql.*;

public class Main {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:etudiants.db";
        
        // Connexion et création table
        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {
            
            // Créer table
            String sqlCreate = "CREATE TABLE IF NOT EXISTS etudiants (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "nom TEXT NOT NULL, " +
                "age INTEGER, " +
                "filiere TEXT)";
            stmt.execute(sqlCreate);
            System.out.println("✅ Table créée");
            
            // INSERT
            String sqlInsert = "INSERT INTO etudiants (nom, age, filiere) VALUES " +
                "('Tiana', 20, 'Informatique'), " +
                "('Soa', 19, 'Gestion'), " +
                "('Kanto', 21, 'Informatique')";
            int nbLignes = stmt.executeUpdate(sqlInsert);
            System.out.println("✅ " + nbLignes + " lignes insérées");
            
            // SELECT
            String sqlSelect = "SELECT * FROM etudiants";
            ResultSet rs = stmt.executeQuery(sqlSelect);
            
            System.out.println("\\n=== Tous les étudiants ===");
            while (rs.next()) {
                int id = rs.getInt("id");
                String nom = rs.getString("nom");
                int age = rs.getInt("age");
                String filiere = rs.getString("filiere");
                System.out.println(id + ". " + nom + " (" + age + " ans) - " + filiere);
            }
            rs.close();
            
            // SELECT avec WHERE
            String sqlWhere = "SELECT nom, age FROM etudiants WHERE filiere = 'Informatique'";
            rs = stmt.executeQuery(sqlWhere);
            
            System.out.println("\\n=== Étudiants en Info ===");
            while (rs.next()) {
                System.out.println("- " + rs.getString("nom") + " (" + rs.getInt("age") + " ans)");
            }
            rs.close();
            
            // UPDATE
            String sqlUpdate = "UPDATE etudiants SET age = 21 WHERE nom = 'Tiana'";
            nbLignes = stmt.executeUpdate(sqlUpdate);
            System.out.println("\\n✅ " + nbLignes + " ligne(s) mise(s) à jour");
            
            // DELETE
            String sqlDelete = "DELETE FROM etudiants WHERE nom = 'Soa'";
            nbLignes = stmt.executeUpdate(sqlDelete);
            System.out.println("✅ " + nbLignes + " ligne(s) supprimée(s)");
            
        } catch (SQLException e) {
            System.out.println("❌ Erreur SQL: " + e.getMessage());
        }
    }
}

// Note : Ajouter dépendance SQLite JDBC dans votre projet
// Maven : <dependency>
//   <groupId>org.xerial</groupId>
//   <artifactId>sqlite-jdbc</artifactId>
//   <version>3.45.0.0</version>
// </dependency>`,
        ),
        task: "Crée une table produits avec CRUD complet (CREATE, READ, UPDATE, DELETE).",
        takeaway:
          "JDBC connecte Java aux BD. SQLite = BD légère dans un fichier.",
        quiz: quiz(
          "Quelle classe représente la connexion à la BD ?",
          ["Statement", "Connection", "ResultSet"],
          1,
          "Connection représente la connexion à la base de données.",
        ),
        link: docs + "java.sql/java/sql/package-summary.html",
      }),
      lesson({
        id: "java-jdbc-preparedstatement",
        title: "PreparedStatement : Sécurité et performance",
        minutes: 30,
        summary:
          "PreparedStatement évite les injections SQL et améliore les performances. Utilise ? comme paramètres. setString(), setInt() assignent les valeurs. Toujours préférer à Statement.",
        sections: [
          section(
            "Pourquoi PreparedStatement ?",
            "Statement avec concaténation = danger d'injection SQL. PreparedStatement sépare SQL et données.",
            [
              "❌ Statement : \"SELECT * FROM users WHERE name='\" + input + \"'\"",
              "✅ PreparedStatement : \"SELECT * FROM users WHERE name=?\"",
              "Protection automatique contre injection SQL",
              "Performances meilleures (requête pré-compilée)",
            ],
          ),
          section(
            "Utilisation",
            "? remplace les valeurs. setXxx(index, valeur) assigne. Index commence à 1.",
            [
              "setString(1, \"valeur\") : paramètre 1",
              "setInt(2, 123) : paramètre 2",
              "executeQuery() : SELECT",
              "executeUpdate() : INSERT, UPDATE, DELETE",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.sql.*;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:etudiants.db";
        Scanner scanner = new Scanner(System.in);
        
        try (Connection conn = DriverManager.getConnection(url)) {
            
            // CREATE
            System.out.println("=== AJOUTER UN ÉTUDIANT ===");
            System.out.print("Nom ? ");
            String nom = scanner.nextLine();
            System.out.print("Âge ? ");
            int age = scanner.nextInt();
            scanner.nextLine();
            System.out.print("Filière ? ");
            String filiere = scanner.nextLine();
            
            String sqlInsert = "INSERT INTO etudiants (nom, age, filiere) VALUES (?, ?, ?)";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlInsert)) {
                pstmt.setString(1, nom);
                pstmt.setInt(2, age);
                pstmt.setString(3, filiere);
                int nb = pstmt.executeUpdate();
                System.out.println("✅ " + nb + " étudiant ajouté");
            }
            
            // READ avec paramètre
            System.out.println("\\n=== RECHERCHER PAR FILIÈRE ===");
            System.out.print("Filière ? ");
            String rechercheFiliere = scanner.nextLine();
            
            String sqlSelect = "SELECT * FROM etudiants WHERE filiere = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlSelect)) {
                pstmt.setString(1, rechercheFiliere);
                ResultSet rs = pstmt.executeQuery();
                
                while (rs.next()) {
                    System.out.println("- " + rs.getString("nom") + 
                        " (" + rs.getInt("age") + " ans)");
                }
                rs.close();
            }
            
            // UPDATE
            System.out.println("\\n=== MODIFIER ÂGE ===");
            System.out.print("Nom de l'étudiant ? ");
            String nomModif = scanner.nextLine();
            System.out.print("Nouvel âge ? ");
            int nouvelAge = scanner.nextInt();
            
            String sqlUpdate = "UPDATE etudiants SET age = ? WHERE nom = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlUpdate)) {
                pstmt.setInt(1, nouvelAge);
                pstmt.setString(2, nomModif);
                int nb = pstmt.executeUpdate();
                System.out.println("✅ " + nb + " ligne(s) mise(s) à jour");
            }
            
            // DELETE
            System.out.println("\\n=== SUPPRIMER ===");
            System.out.print("Nom de l'étudiant à supprimer ? ");
            scanner.nextLine();
            String nomSuppr = scanner.nextLine();
            
            String sqlDelete = "DELETE FROM etudiants WHERE nom = ?";
            try (PreparedStatement pstmt = conn.prepareStatement(sqlDelete)) {
                pstmt.setString(1, nomSuppr);
                int nb = pstmt.executeUpdate();
                System.out.println("✅ " + nb + " ligne(s) supprimée(s)");
            }
            
        } catch (SQLException e) {
            System.out.println("❌ Erreur: " + e.getMessage());
        }
        
        scanner.close();
    }
}`,
          { stdin: "Miora\n20\nMathématiques\nInformatique\nTiana\n21\nSoa\n" },
        ),
        task: "Crée une classe GestionProduits avec CRUD complet utilisant PreparedStatement.",
        takeaway:
          "PreparedStatement = sécurité (anti-injection) + performance.",
        quiz: quiz(
          "Pourquoi utiliser PreparedStatement plutôt que Statement ?",
          ["Plus rapide seulement", "Sécurité + performance", "Obligatoire"],
          1,
          "PreparedStatement évite les injections SQL et améliore les performances.",
        ),
        link: docs + "java.sql/java/sql/PreparedStatement.html",
      }),
    ],
  },
  {
    id: "java-exercice-final-intermediaire",
    title: "🎯 Exercice Final Intermédiaire",
    description: "Projet POO + JDBC complet",
    lessons: [
      lesson({
        id: "java-projet-intermediaire",
        title: "Système de gestion de bibliothèque",
        minutes: 60,
        summary:
          "Crée un système complet avec classes (Livre, Bibliotheque), interfaces, JDBC avec SQLite, menu interactif, gestion d'erreurs.",
        sections: [
          section(
            "Architecture requise",
            "Classes avec POO, interfaces, base de données SQLite avec CRUD complet.",
            [
              "Interface Affichable",
              "Classe Livre implements Affichable",
              "Classe Bibliotheque : gestion JDBC",
              "Base SQLite : table livres",
              "Menu : ajout, liste, recherche, emprunter, retourner, supprimer",
            ],
          ),
          section(
            "Fonctionnalités avancées",
            "Recherche multi-critères. Statistiques. Validation avec PreparedStatement.",
            [
              "Recherche : par titre, auteur ou année",
              "Stats : nombre total, disponibles, empruntés",
              "PreparedStatement pour toutes les requêtes",
              "Validation : pas de doublon, données valides",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import java.sql.*;
import java.util.Scanner;

// Interface
interface Affichable {
    void afficher();
}

// Classe Livre
class Livre implements Affichable {
    private int id;
    private String titre;
    private String auteur;
    private int annee;
    private boolean disponible;
    
    // TODO: Constructeur
    
    // TODO: Getters/Setters
    
    @Override
    public void afficher() {
        // TODO: Affichage formaté
    }
}

// Classe Bibliotheque
class Bibliotheque {
    private String url = "jdbc:sqlite:bibliotheque.db";
    
    public Bibliotheque() {
        creerTable();
    }
    
    private void creerTable() {
        // TODO: CREATE TABLE livres
        // (id, titre, auteur, annee, disponible)
    }
    
    public void ajouterLivre(String titre, String auteur, int annee) {
        // TODO: INSERT avec PreparedStatement
        // Vérifier doublon
    }
    
    public void listerLivres(boolean disponibleSeulement) {
        // TODO: SELECT avec WHERE optionnel
    }
    
    public void rechercher(String critere, String valeur) {
        // TODO: SELECT avec WHERE dynamique
        // critere = "titre", "auteur" ou "annee"
    }
    
    public void emprunter(int idLivre) {
        // TODO: UPDATE disponible = false
    }
    
    public void retourner(int idLivre) {
        // TODO: UPDATE disponible = true
    }
    
    public void supprimer(int idLivre) {
        // TODO: DELETE avec confirmation
    }
    
    public void statistiques() {
        // TODO: SELECT COUNT pour total, disponibles, empruntés
    }
}

public class Main {
    public static void main(String[] args) {
        Bibliotheque biblio = new Bibliotheque();
        Scanner scanner = new Scanner(System.in);
        boolean continuer = true;
        
        while (continuer) {
            System.out.println("\\n=== BIBLIOTHÈQUE ===");
            System.out.println("1. Ajouter livre");
            System.out.println("2. Lister tous");
            System.out.println("3. Livres disponibles");
            System.out.println("4. Rechercher");
            System.out.println("5. Emprunter");
            System.out.println("6. Retourner");
            System.out.println("7. Supprimer");
            System.out.println("8. Statistiques");
            System.out.println("0. Quitter");
            System.out.print("Choix ? ");
            
            try {
                int choix = scanner.nextInt();
                scanner.nextLine();
                
                switch (choix) {
                    case 1:
                        // TODO: Ajouter livre
                        break;
                    case 2:
                        biblio.listerLivres(false);
                        break;
                    case 3:
                        biblio.listerLivres(true);
                        break;
                    case 4:
                        // TODO: Rechercher
                        break;
                    case 5:
                        // TODO: Emprunter
                        break;
                    case 6:
                        // TODO: Retourner
                        break;
                    case 7:
                        // TODO: Supprimer
                        break;
                    case 8:
                        biblio.statistiques();
                        break;
                    case 0:
                        continuer = false;
                        break;
                    default:
                        System.out.println("Choix invalide");
                }
            } catch (Exception e) {
                System.out.println("❌ Erreur: " + e.getMessage());
                scanner.nextLine();
            }
        }
        
        scanner.close();
    }
}`,
        ),
        task: "Complète toutes les méthodes pour créer un système de bibliothèque fonctionnel.",
        takeaway:
          "Tu maîtrises POO + Interfaces + JDBC pour créer des applications complètes !",
        quiz: quiz(
          "Quels concepts Java remplacent l'héritage multiple de C++ ?",
          ["Classes abstraites", "Interfaces multiples", "Génériques"],
          1,
          "Java utilise les interfaces pour remplacer l'héritage multiple de C++.",
        ),
        link: tutorial,
      }),
    ],
  },
];


// ═══════════════════════════════════════════════════════════════════════════
// 🔴 NIVEAU AVANCÉ - JavaFX (GUI) + SQLite (Base de données)
// ═══════════════════════════════════════════════════════════════════════════

const advanced: WebLevel["chapters"] = [
  {
    id: "java-javafx-intro",
    title: "JavaFX : Introduction",
    description: "Créer des interfaces graphiques modernes",
    lessons: [
      lesson({
        id: "java-javafx-bases",
        title: "JavaFX : Première fenêtre et structure",
        minutes: 30,
        summary:
          "JavaFX est le framework moderne pour créer des interfaces graphiques en Java. Application étend la classe Application. start() initialise l'interface. Stage = fenêtre, Scene = contenu, Layout = organisation.",
        sections: [
          section(
            "Structure JavaFX",
            "Architecture complète d'une application JavaFX.",
            [
              "Application : classe principale (extends Application)",
              "Stage : la fenêtre principale",
              "Scene : le contenu affiché dans la fenêtre",
              "Root : conteneur principal (VBox, HBox, BorderPane)",
              "Controls : composants (Button, Label, TextField, etc.)",
              "launch(args) : démarre l'application",
            ],
          ),
          section(
            "Événements de base",
            "Gérer les interactions utilisateur.",
            [
              "setOnAction() : réagir au clic sur un bouton",
              "Lambda expression : (e -> code)",
              "EventHandler : gestion avancée d'événements",
              "Platform.runLater() : modifier GUI depuis un thread",
            ],
          ),
          section(
            "Différence avec Swing",
            "JavaFX vs l'ancien framework Swing.",
            [
              "JavaFX : moderne, GPU-accéléré, CSS styling",
              "Swing : ancien, mais encore utilisé en legacy",
              "JavaFX : meilleure séparation UI/logique",
              "FXML : équivalent du XML pour l'interface",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class Main extends Application {
    @Override
    public void start(Stage primaryStage) {
        // Composants
        Label titre = new Label("Bienvenue dans JavaFX !");
        titre.setStyle("-fx-font-size: 20px; -fx-font-weight: bold;");
        
        TextField champNom = new TextField();
        champNom.setPromptText("Entrez votre nom");
        
        Button bouton = new Button("Saluer");
        Label resultat = new Label("");
        
        // Événement clic
        bouton.setOnAction(e -> {
            String nom = champNom.getText();
            if (!nom.isEmpty()) {
                resultat.setText("Bonjour " + nom + " ! 👋");
                resultat.setStyle("-fx-text-fill: green;");
            } else {
                resultat.setText("❌ Veuillez entrer votre nom");
                resultat.setStyle("-fx-text-fill: red;");
            }
        });
        
        // Layout vertical avec espacement
        VBox root = new VBox(15);
        root.getChildren().addAll(titre, champNom, bouton, resultat);
        root.setStyle("-fx-padding: 30px; -fx-alignment: center;");
        
        // Scene et Stage
        Scene scene = new Scene(root, 400, 300);
        primaryStage.setTitle("Ma première app JavaFX");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}`,
        ),
        task: "Ajoute un champ pour l'âge et affiche si la personne est majeure ou mineure (>= 18 ans).",
        takeaway:
          "JavaFX : Application → Stage → Scene → Layout → Controls. setOnAction() pour les événements.",
        quiz: quiz(
          "Quelle classe représente la fenêtre principale ?",
          ["Scene", "Stage", "VBox"],
          1,
          "Stage représente la fenêtre principale dans JavaFX.",
        ),
        link: "https://openjfx.io/",
      }),
    ],
  },
  {
    id: "java-javafx-layouts",
    title: "JavaFX : Layouts et composants",
    description: "Organiser et styliser l'interface",
    lessons: [
      lesson({
        id: "java-javafx-layouts-bases",
        title: "Layouts : VBox, HBox, BorderPane et GridPane",
        minutes: 35,
        summary:
          "Les layouts organisent les composants. VBox = vertical, HBox = horizontal, BorderPane = zones (top, bottom, left, right, center), GridPane = grille avec lignes/colonnes.",
        sections: [
          section(
            "Layouts principaux",
            "Choisir le bon layout selon le besoin.",
            [
              "VBox : empile verticalement (formulaires)",
              "HBox : empile horizontalement (barres d'outils)",
              "BorderPane : 5 zones (top, bottom, left, right, center)",
              "GridPane : grille avec lignes et colonnes",
              "StackPane : superpose les éléments",
              "FlowPane : arrange automatiquement",
            ],
          ),
          section(
            "Espacements et marges",
            "Contrôler les espacements entre composants.",
            [
              "VBox(10) : espacement 10px entre enfants",
              "setPadding() : marge intérieure",
              "setMargin() : marge autour d'un enfant",
              "setSpacing() : modifier espacement",
              "setAlignment() : aligner le contenu",
            ],
          ),
          section(
            "CSS Styling",
            "Styliser avec CSS inline ou fichiers externes.",
            [
              "setStyle(\"-fx-*\") : CSS inline",
              "scene.getStylesheets().add() : fichier CSS",
              "-fx-background-color, -fx-text-fill, -fx-font-size",
              "Classes CSS avec getStyleClass().add()",
              "Pseudo-classes : :hover, :pressed, etc.",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class Main extends Application {
    @Override
    public void start(Stage primaryStage) {
        // === BorderPane : 5 zones ===
        BorderPane root = new BorderPane();
        
        // Top : Titre
        Label titre = new Label("Calculatrice Simple");
        titre.setStyle("-fx-font-size: 24px; -fx-font-weight: bold;");
        HBox top = new HBox(titre);
        top.setAlignment(Pos.CENTER);
        top.setPadding(new Insets(20));
        top.setStyle("-fx-background-color: #3498db; -fx-text-fill: white;");
        root.setTop(top);
        
        // Center : GridPane pour le formulaire
        GridPane center = new GridPane();
        center.setHgap(10);
        center.setVgap(10);
        center.setPadding(new Insets(20));
        center.setAlignment(Pos.CENTER);
        
        Label lblNombre1 = new Label("Nombre 1 :");
        TextField txtNombre1 = new TextField();
        
        Label lblNombre2 = new Label("Nombre 2 :");
        TextField txtNombre2 = new TextField();
        
        Label lblResultat = new Label("Résultat :");
        TextField txtResultat = new TextField();
        txtResultat.setEditable(false);
        txtResultat.setStyle("-fx-background-color: #ecf0f1;");
        
        center.add(lblNombre1, 0, 0);
        center.add(txtNombre1, 1, 0);
        center.add(lblNombre2, 0, 1);
        center.add(txtNombre2, 1, 1);
        center.add(lblResultat, 0, 2);
        center.add(txtResultat, 1, 2);
        
        root.setCenter(center);
        
        // Bottom : HBox pour les boutons
        Button btnAddition = new Button("Addition (+)");
        Button btnSoustraction = new Button("Soustraction (-)");
        Button btnMultiplication = new Button("Multiplication (×)");
        Button btnDivision = new Button("Division (÷)");
        Button btnEffacer = new Button("Effacer");
        
        // Style des boutons
        String styleBtn = "-fx-min-width: 100px; -fx-padding: 10px;";
        btnAddition.setStyle(styleBtn + "-fx-background-color: #27ae60; -fx-text-fill: white;");
        btnSoustraction.setStyle(styleBtn + "-fx-background-color: #e74c3c; -fx-text-fill: white;");
        btnMultiplication.setStyle(styleBtn + "-fx-background-color: #9b59b6; -fx-text-fill: white;");
        btnDivision.setStyle(styleBtn + "-fx-background-color: #f39c12; -fx-text-fill: white;");
        btnEffacer.setStyle(styleBtn + "-fx-background-color: #95a5a6; -fx-text-fill: white;");
        
        HBox boutons = new HBox(10);
        boutons.getChildren().addAll(btnAddition, btnSoustraction, btnMultiplication, btnDivision, btnEffacer);
        boutons.setAlignment(Pos.CENTER);
        boutons.setPadding(new Insets(20));
        root.setBottom(boutons);
        
        // Événements
        btnAddition.setOnAction(e -> calculer(txtNombre1, txtNombre2, txtResultat, "+"));
        btnSoustraction.setOnAction(e -> calculer(txtNombre1, txtNombre2, txtResultat, "-"));
        btnMultiplication.setOnAction(e -> calculer(txtNombre1, txtNombre2, txtResultat, "*"));
        btnDivision.setOnAction(e -> calculer(txtNombre1, txtNombre2, txtResultat, "/"));
        btnEffacer.setOnAction(e -> {
            txtNombre1.clear();
            txtNombre2.clear();
            txtResultat.clear();
        });
        
        Scene scene = new Scene(root, 600, 400);
        primaryStage.setTitle("Calculatrice JavaFX");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    
    private void calculer(TextField txt1, TextField txt2, TextField txtRes, String op) {
        try {
            double n1 = Double.parseDouble(txt1.getText());
            double n2 = Double.parseDouble(txt2.getText());
            double resultat = 0;
            
            switch (op) {
                case "+": resultat = n1 + n2; break;
                case "-": resultat = n1 - n2; break;
                case "*": resultat = n1 * n2; break;
                case "/":
                    if (n2 == 0) {
                        txtRes.setText("Erreur : division par 0");
                        return;
                    }
                    resultat = n1 / n2;
                    break;
            }
            
            txtRes.setText(String.format("%.2f", resultat));
        } catch (NumberFormatException ex) {
            txtRes.setText("Erreur : nombres invalides");
        }
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}`,
        ),
        task: "Ajoute des boutons pour puissance (^) et racine carrée (√). Style-les avec des couleurs différentes.",
        takeaway:
          "VBox = vertical, HBox = horizontal, BorderPane = 5 zones, GridPane = grille. CSS inline avec setStyle().",
        quiz: quiz(
          "Quel layout pour un formulaire avec labels et champs alignés ?",
          ["VBox", "HBox", "GridPane"],
          2,
          "GridPane permet d'organiser en lignes et colonnes comme un formulaire.",
        ),
        link: "https://openjfx.io/javadoc/17/javafx.graphics/javafx/scene/layout/package-summary.html",
      }),
      lesson({
        id: "java-javafx-composants",
        title: "Composants avancés : TableView, ListView, ComboBox",
        minutes: 40,
        summary:
          "TableView affiche des données tabulaires. ListView affiche une liste. ComboBox = menu déroulant. ObservableList permet la synchronisation automatique des données avec l'UI.",
        sections: [
          section(
            "TableView",
            "Afficher des données en tableau avec colonnes.",
            [
              "TableView<Type> : tableau générique",
              "TableColumn<Type, Prop> : colonne",
              "setCellValueFactory() : lier colonne à propriété",
              "ObservableList : liste qui notifie les changements",
              "setItems() : définir les données",
              "getSelectionModel() : gérer la sélection",
            ],
          ),
          section(
            "ListView et ComboBox",
            "Listes simples et menus déroulants.",
            [
              "ListView<Type> : liste verticale d'éléments",
              "ComboBox<Type> : menu déroulant",
              "getSelectionModel().getSelectedItem() : élément sélectionné",
              "setOnAction() : réagir à la sélection",
              "setCellFactory() : personnaliser l'affichage",
            ],
          ),
          section(
            "ObservableList",
            "Liste observable qui synchronise l'UI automatiquement.",
            [
              "FXCollections.observableArrayList() : créer une liste",
              "Ajout/suppression : UI mise à jour automatiquement",
              "Utilisée avec TableView, ListView, ComboBox",
              "Listeners pour réagir aux changements",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class Main extends Application {
    private TableView<Etudiant> tableView;
    private ObservableList<Etudiant> etudiants;
    
    @Override
    public void start(Stage primaryStage) {
        // Données
        etudiants = FXCollections.observableArrayList(
            new Etudiant("Alice", 20, "Informatique"),
            new Etudiant("Bob", 22, "Mathématiques"),
            new Etudiant("Charlie", 21, "Physique")
        );
        
        // TableView
        tableView = new TableView<>();
        tableView.setItems(etudiants);
        
        // Colonnes
        TableColumn<Etudiant, String> colNom = new TableColumn<>("Nom");
        colNom.setCellValueFactory(new PropertyValueFactory<>("nom"));
        colNom.setPrefWidth(150);
        
        TableColumn<Etudiant, Integer> colAge = new TableColumn<>("Âge");
        colAge.setCellValueFactory(new PropertyValueFactory<>("age"));
        colAge.setPrefWidth(80);
        
        TableColumn<Etudiant, String> colFiliere = new TableColumn<>("Filière");
        colFiliere.setCellValueFactory(new PropertyValueFactory<>("filiere"));
        colFiliere.setPrefWidth(150);
        
        tableView.getColumns().addAll(colNom, colAge, colFiliere);
        
        // Formulaire d'ajout
        GridPane form = new GridPane();
        form.setHgap(10);
        form.setVgap(10);
        form.setPadding(new Insets(15));
        
        TextField txtNom = new TextField();
        txtNom.setPromptText("Nom");
        TextField txtAge = new TextField();
        txtAge.setPromptText("Âge");
        ComboBox<String> cmbFiliere = new ComboBox<>();
        cmbFiliere.setItems(FXCollections.observableArrayList(
            "Informatique", "Mathématiques", "Physique", "Chimie", "Biologie"
        ));
        cmbFiliere.setPromptText("Choisir une filière");
        
        Button btnAjouter = new Button("Ajouter");
        Button btnSupprimer = new Button("Supprimer sélectionné");
        
        form.add(new Label("Nom:"), 0, 0);
        form.add(txtNom, 1, 0);
        form.add(new Label("Âge:"), 0, 1);
        form.add(txtAge, 1, 1);
        form.add(new Label("Filière:"), 0, 2);
        form.add(cmbFiliere, 1, 2);
        
        HBox boutons = new HBox(10, btnAjouter, btnSupprimer);
        boutons.setPadding(new Insets(10, 0, 0, 0));
        
        // Événements
        btnAjouter.setOnAction(e -> {
            try {
                String nom = txtNom.getText();
                int age = Integer.parseInt(txtAge.getText());
                String filiere = cmbFiliere.getValue();
                
                if (nom.isEmpty() || filiere == null) {
                    afficherAlerte("Erreur", "Tous les champs sont obligatoires !");
                    return;
                }
                
                etudiants.add(new Etudiant(nom, age, filiere));
                txtNom.clear();
                txtAge.clear();
                cmbFiliere.setValue(null);
                
            } catch (NumberFormatException ex) {
                afficherAlerte("Erreur", "L'âge doit être un nombre !");
            }
        });
        
        btnSupprimer.setOnAction(e -> {
            Etudiant selected = tableView.getSelectionModel().getSelectedItem();
            if (selected != null) {
                etudiants.remove(selected);
            } else {
                afficherAlerte("Info", "Sélectionnez un étudiant à supprimer");
            }
        });
        
        // Layout principal
        VBox root = new VBox(15);
        root.setPadding(new Insets(15));
        root.getChildren().addAll(
            new Label("Gestion des étudiants"),
            tableView,
            form,
            boutons
        );
        
        Scene scene = new Scene(root, 600, 500);
        primaryStage.setTitle("TableView JavaFX");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    
    private void afficherAlerte(String titre, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(titre);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}

// Classe Etudiant avec propriétés JavaFX
class Etudiant {
    private String nom;
    private int age;
    private String filiere;
    
    public Etudiant(String nom, int age, String filiere) {
        this.nom = nom;
        this.age = age;
        this.filiere = filiere;
    }
    
    // Getters nécessaires pour PropertyValueFactory
    public String getNom() { return nom; }
    public int getAge() { return age; }
    public String getFiliere() { return filiere; }
    
    public void setNom(String nom) { this.nom = nom; }
    public void setAge(int age) { this.age = age; }
    public void setFiliere(String filiere) { this.filiere = filiere; }
}`,
        ),
        task: "Ajoute une colonne 'Moyenne' et un bouton 'Modifier' qui permet de modifier l'étudiant sélectionné.",
        takeaway:
          "TableView + ObservableList = affichage automatique des données. PropertyValueFactory lie colonnes et propriétés.",
        quiz: quiz(
          "À quoi sert ObservableList ?",
          ["Optimiser les performances", "Synchroniser automatiquement données et UI", "Trier les données"],
          1,
          "ObservableList notifie l'UI des changements, synchronisant automatiquement les données affichées.",
        ),
        link: "https://openjfx.io/javadoc/17/javafx.controls/javafx/scene/control/TableView.html",
      }),
    ],
  },
  {
    id: "java-javafx-sqlite",
    title: "JavaFX + SQLite",
    description: "Intégrer une base de données",
    lessons: [
      lesson({
        id: "java-javafx-sqlite-integration",
        title: "Intégrer SQLite avec JavaFX",
        minutes: 45,
        summary:
          "Combiner JavaFX (interface) avec JDBC SQLite (données). Architecture MVC : Model (classes métier), View (FXML/JavaFX), Controller (logique). DAO pour la persistance.",
        sections: [
          section(
            "Architecture MVC avec JavaFX",
            "Séparer interface, logique et données.",
            [
              "Model : classes métier (Etudiant, Produit, etc.)",
              "View : interface JavaFX (FXML ou code Java)",
              "Controller : gère interactions et appelle DAO",
              "DAO (Data Access Object) : requêtes SQL",
              "Séparation claire des responsabilités",
            ],
          ),
          section(
            "Pattern DAO",
            "Encapsuler l'accès aux données.",
            [
              "Interface DAO : contrat (ajouter, modifier, supprimer, lister)",
              "Implémentation concrète avec JDBC",
              "PreparedStatement pour sécurité",
              "Gestion des exceptions",
              "Fermeture des ressources (try-with-resources)",
            ],
          ),
          section(
            "Synchronisation UI ↔ BD",
            "Maintenir cohérence entre affichage et base.",
            [
              "ObservableList contient les données affichées",
              "Après INSERT : ajouter à la liste ET à la BD",
              "Après UPDATE : modifier dans la liste ET dans la BD",
              "Après DELETE : retirer de la liste ET de la BD",
              "Rafraîchir depuis la BD au démarrage",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.*;
import javafx.stage.Stage;

import java.sql.*;

public class Main extends Application {
    private TableView<Produit> tableView;
    private ObservableList<Produit> produits;
    private ProduitDAO produitDAO;
    
    @Override
    public void start(Stage primaryStage) {
        // Initialiser DAO et charger données
        produitDAO = new ProduitDAO();
        produits = FXCollections.observableArrayList(produitDAO.getAll());
        
        // TableView
        tableView = new TableView<>();
        tableView.setItems(produits);
        
        TableColumn<Produit, Integer> colId = new TableColumn<>("ID");
        colId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colId.setPrefWidth(50);
        
        TableColumn<Produit, String> colNom = new TableColumn<>("Nom");
        colNom.setCellValueFactory(new PropertyValueFactory<>("nom"));
        colNom.setPrefWidth(200);
        
        TableColumn<Produit, Double> colPrix = new TableColumn<>("Prix");
        colPrix.setCellValueFactory(new PropertyValueFactory<>("prix"));
        colPrix.setPrefWidth(100);
        
        TableColumn<Produit, Integer> colStock = new TableColumn<>("Stock");
        colStock.setCellValueFactory(new PropertyValueFactory<>("stock"));
        colStock.setPrefWidth(100);
        
        tableView.getColumns().addAll(colId, colNom, colPrix, colStock);
        
        // Formulaire
        GridPane form = new GridPane();
        form.setHgap(10);
        form.setVgap(10);
        form.setPadding(new Insets(15));
        
        TextField txtNom = new TextField();
        txtNom.setPromptText("Nom du produit");
        TextField txtPrix = new TextField();
        txtPrix.setPromptText("Prix");
        TextField txtStock = new TextField();
        txtStock.setPromptText("Stock");
        
        form.add(new Label("Nom:"), 0, 0);
        form.add(txtNom, 1, 0);
        form.add(new Label("Prix:"), 0, 1);
        form.add(txtPrix, 1, 1);
        form.add(new Label("Stock:"), 0, 2);
        form.add(txtStock, 1, 2);
        
        // Boutons
        Button btnAjouter = new Button("Ajouter");
        Button btnModifier = new Button("Modifier");
        Button btnSupprimer = new Button("Supprimer");
        Button btnRafraichir = new Button("Rafraîchir");
        
        HBox boutons = new HBox(10, btnAjouter, btnModifier, btnSupprimer, btnRafraichir);
        boutons.setPadding(new Insets(10, 0, 0, 0));
        
        // Événements
        btnAjouter.setOnAction(e -> {
            try {
                String nom = txtNom.getText();
                double prix = Double.parseDouble(txtPrix.getText());
                int stock = Integer.parseInt(txtStock.getText());
                
                Produit p = new Produit(0, nom, prix, stock);
                int id = produitDAO.ajouter(p);
                p.setId(id);
                produits.add(p);
                
                txtNom.clear();
                txtPrix.clear();
                txtStock.clear();
                
            } catch (Exception ex) {
                afficherAlerte("Erreur", "Données invalides : " + ex.getMessage());
            }
        });
        
        btnModifier.setOnAction(e -> {
            Produit selected = tableView.getSelectionModel().getSelectedItem();
            if (selected == null) {
                afficherAlerte("Info", "Sélectionnez un produit à modifier");
                return;
            }
            
            try {
                selected.setNom(txtNom.getText());
                selected.setPrix(Double.parseDouble(txtPrix.getText()));
                selected.setStock(Integer.parseInt(txtStock.getText()));
                
                produitDAO.modifier(selected);
                tableView.refresh();  // Rafraîchir l'affichage
                
            } catch (Exception ex) {
                afficherAlerte("Erreur", "Modification échouée : " + ex.getMessage());
            }
        });
        
        btnSupprimer.setOnAction(e -> {
            Produit selected = tableView.getSelectionModel().getSelectedItem();
            if (selected != null) {
                produitDAO.supprimer(selected.getId());
                produits.remove(selected);
            } else {
                afficherAlerte("Info", "Sélectionnez un produit à supprimer");
            }
        });
        
        btnRafraichir.setOnAction(e -> {
            produits.clear();
            produits.addAll(produitDAO.getAll());
        });
        
        // Remplir formulaire lors de la sélection
        tableView.getSelectionModel().selectedItemProperty().addListener((obs, oldSel, newSel) -> {
            if (newSel != null) {
                txtNom.setText(newSel.getNom());
                txtPrix.setText(String.valueOf(newSel.getPrix()));
                txtStock.setText(String.valueOf(newSel.getStock()));
            }
        });
        
        // Layout principal
        VBox root = new VBox(15);
        root.setPadding(new Insets(15));
        Label titre = new Label("Gestion des Produits - JavaFX + SQLite");
        titre.setStyle("-fx-font-size: 18px; -fx-font-weight: bold;");
        root.getChildren().addAll(titre, tableView, form, boutons);
        
        Scene scene = new Scene(root, 700, 600);
        primaryStage.setTitle("Stock Manager");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    
    private void afficherAlerte(String titre, String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setTitle(titre);
        alert.setContentText(message);
        alert.showAndWait();
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}

// ===== Classe Produit (Model) =====
class Produit {
    private int id;
    private String nom;
    private double prix;
    private int stock;
    
    public Produit(int id, String nom, double prix, int stock) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
        this.stock = stock;
    }
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}

// ===== DAO (Data Access Object) =====
class ProduitDAO {
    private static final String DB_URL = "jdbc:sqlite:produits.db";
    
    public ProduitDAO() {
        creerTable();
    }
    
    private void creerTable() {
        String sql = "CREATE TABLE IF NOT EXISTS produits (" +
                     "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                     "nom TEXT NOT NULL," +
                     "prix REAL NOT NULL," +
                     "stock INTEGER NOT NULL)";
        
        try (Connection conn = DriverManager.getConnection(DB_URL);
             Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public java.util.List<Produit> getAll() {
        java.util.List<Produit> liste = new java.util.ArrayList<>();
        String sql = "SELECT * FROM produits";
        
        try (Connection conn = DriverManager.getConnection(DB_URL);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                liste.add(new Produit(
                    rs.getInt("id"),
                    rs.getString("nom"),
                    rs.getDouble("prix"),
                    rs.getInt("stock")
                ));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return liste;
    }
    
    public int ajouter(Produit p) {
        String sql = "INSERT INTO produits(nom, prix, stock) VALUES(?, ?, ?)";
        
        try (Connection conn = DriverManager.getConnection(DB_URL);
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, p.getNom());
            pstmt.setDouble(2, p.getPrix());
            pstmt.setInt(3, p.getStock());
            pstmt.executeUpdate();
            
            ResultSet rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return -1;
    }
    
    public void modifier(Produit p) {
        String sql = "UPDATE produits SET nom = ?, prix = ?, stock = ? WHERE id = ?";
        
        try (Connection conn = DriverManager.getConnection(DB_URL);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, p.getNom());
            pstmt.setDouble(2, p.getPrix());
            pstmt.setInt(3, p.getStock());
            pstmt.setInt(4, p.getId());
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public void supprimer(int id) {
        String sql = "DELETE FROM produits WHERE id = ?";
        
        try (Connection conn = DriverManager.getConnection(DB_URL);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}`,
        ),
        task: "Ajoute une fonction de recherche par nom et un filtre par stock (< 10 = alerte stock faible).",
        takeaway:
          "JavaFX + SQLite = apps desktop complètes. MVC + DAO pour architecture propre. ObservableList synchronise UI et BD.",
        quiz: quiz(
          "Quel design pattern encapsule l'accès aux données ?",
          ["MVC", "DAO", "Singleton"],
          1,
          "DAO (Data Access Object) encapsule les requêtes SQL et la logique d'accès aux données.",
        ),
        link: docs + "java.sql/java/sql/package-summary.html",
      }),
    ],
  },
  {
    id: "java-projet-final",
    title: "🎯 Projet Final : Application complète",
    description: "Gestionnaire de bibliothèque avec JavaFX + SQLite",
    lessons: [
      lesson({
        id: "java-projet-bibliotheque",
        title: "Projet Final : Gestionnaire de Bibliothèque",
        minutes: 120,
        summary:
          "Application complète de gestion de bibliothèque : livres, membres, emprunts. JavaFX pour l'interface, SQLite pour les données. CRUD complet, recherche, statistiques, gestion des retards.",
        sections: [
          section(
            "Fonctionnalités à implémenter",
            "Application professionnelle complète.",
            [
              "✅ Gestion des livres (CRUD, recherche, disponibilité)",
              "✅ Gestion des membres (réguliers et premium)",
              "✅ Emprunts et retours avec dates",
              "✅ Calcul automatique des frais de retard",
              "✅ Statistiques (top livres, membres actifs)",
              "✅ Recherche multi-critères",
              "✅ Export des données (CSV)",
              "✅ Interface intuitive avec TableView",
            ],
          ),
          section(
            "Architecture recommandée",
            "Organisation du code en packages.",
            [
              "📦 model : Livre, Membre, Emprunt",
              "📦 dao : LivreDAO, MembreDAO, EmpruntDAO",
              "📦 view : Classes JavaFX, FXML",
              "📦 controller : Logique métier",
              "📦 util : Helpers, formatage dates",
              "Base de données : 3 tables (livres, membres, emprunts)",
            ],
          ),
          section(
            "Technologies utilisées",
            "Stack complète Java desktop.",
            [
              "JavaFX : Interface graphique",
              "JDBC : Connexion base de données",
              "SQLite : Base de données embarquée",
              "ObservableList : Synchronisation données/UI",
              "PreparedStatement : Sécurité SQL",
              "LocalDate : Gestion des dates",
            ],
          ),
        ],
        files: consoleFiles(
          "java",
          `// ═══════════════════════════════════════════════════════════════
// PROJET FINAL : GESTIONNAIRE DE BIBLIOTHÈQUE
// ═══════════════════════════════════════════════════════════════
//
// 📚 FONCTIONNALITÉS
// ─────────────────────────────────────────────────────────────
// 1. Gestion des Livres
//    - Ajouter/Modifier/Supprimer livres
//    - Rechercher par titre, auteur, ISBN
//    - Voir disponibilité (disponible/emprunté)
//    - Catégories (Roman, Science, Histoire, etc.)
//
// 2. Gestion des Membres
//    - Membre Régulier : frais retard 1€/jour
//    - Membre Premium : frais retard 0.50€/jour
//    - Historique des emprunts par membre
//    - Statistiques par membre
//
// 3. Gestion des Emprunts
//    - Emprunter un livre (date emprunt auto)
//    - Retourner un livre (calculer retard si > 14 jours)
//    - Prolonger emprunt (max 1 fois)
//    - Liste des emprunts en cours
//    - Alertes pour retards
//
// 4. Statistiques et Rapports
//    - Top 10 livres les plus empruntés
//    - Membres les plus actifs
//    - Revenus des frais de retard
//    - Export CSV
//
// 🏗️ STRUCTURE DES TABLES
// ─────────────────────────────────────────────────────────────
// TABLE livres:
//   - id (INTEGER PRIMARY KEY)
//   - isbn (TEXT UNIQUE)
//   - titre (TEXT)
//   - auteur (TEXT)
//   - categorie (TEXT)
//   - disponible (BOOLEAN)
//
// TABLE membres:
//   - id (INTEGER PRIMARY KEY)
//   - nom (TEXT)
//   - email (TEXT UNIQUE)
//   - telephone (TEXT)
//   - type (TEXT) -- "REGULIER" ou "PREMIUM"
//   - date_inscription (TEXT)
//
// TABLE emprunts:
//   - id (INTEGER PRIMARY KEY)
//   - livre_id (INTEGER FOREIGN KEY)
//   - membre_id (INTEGER FOREIGN KEY)
//   - date_emprunt (TEXT)
//   - date_retour_prevue (TEXT)
//   - date_retour_effectif (TEXT NULL)
//   - frais_retard (REAL)
//   - prolonge (BOOLEAN)
//
// 📦 PACKAGES À CRÉER
// ─────────────────────────────────────────────────────────────
// com.bibliotheque.model
//   ├─ Livre.java
//   ├─ Membre.java (abstract)
//   ├─ MembreRegulier.java (extends Membre)
//   ├─ MembrePremium.java (extends Membre)
//   └─ Emprunt.java
//
// com.bibliotheque.dao
//   ├─ DatabaseManager.java (connexion, tables)
//   ├─ LivreDAO.java
//   ├─ MembreDAO.java
//   └─ EmpruntDAO.java
//
// com.bibliotheque.view
//   ├─ MainWindow.java (fenêtre principale)
//   ├─ LivreView.java (gestion livres)
//   ├─ MembreView.java (gestion membres)
//   ├─ EmpruntView.java (emprunts/retours)
//   └─ StatistiquesView.java (rapports)
//
// com.bibliotheque.controller
//   ├─ LivreController.java
//   ├─ MembreController.java
//   └─ EmpruntController.java
//
// com.bibliotheque.util
//   ├─ DateUtil.java (formatage, calculs)
//   └─ ExportUtil.java (export CSV)
//
// 🎨 INTERFACE UTILISATEUR
// ─────────────────────────────────────────────────────────────
// Fenêtre principale avec TabPane :
//   Tab 1: Livres (TableView + formulaire CRUD)
//   Tab 2: Membres (TableView + formulaire CRUD)
//   Tab 3: Emprunts (Emprunter/Retourner)
//   Tab 4: Statistiques (Graphiques et rapports)
//
// Chaque tab contient :
//   - Barre de recherche
//   - TableView avec données
//   - Boutons d'action (Ajouter, Modifier, Supprimer, etc.)
//   - Formulaire pour saisie/modification
//
// 💡 CONSEILS D'IMPLÉMENTATION
// ─────────────────────────────────────────────────────────────
// 1. Commencer par les models (classes métier)
// 2. Créer les DAO (accès données)
// 3. Tester les DAO avec des données de test
// 4. Créer l'interface JavaFX progressive (un tab à la fois)
// 5. Implémenter les controllers
// 6. Ajouter recherche et statistiques
// 7. Polir l'interface (CSS, icônes)
//
// 🚀 FONCTIONNALITÉS BONUS (Optionnelles)
// ─────────────────────────────────────────────────────────────
// - Photos de couverture pour les livres
// - Système de réservation
// - Notifications par email (simulation)
// - Graphiques avec JavaFX Chart
// - Import/Export Excel
// - Authentification multi-utilisateurs
// - Historique des modifications (audit log)
// - Suggestions de livres similaires
//
// ═══════════════════════════════════════════════════════════════

// EXEMPLE DE CODE DE DÉMARRAGE :

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

public class BibliothequeApp extends Application {
    @Override
    public void start(Stage primaryStage) {
        // TabPane principal
        TabPane tabPane = new TabPane();
        
        // Tabs
        Tab tabLivres = new Tab("Livres");
        tabLivres.setClosable(false);
        // TODO: Créer LivreView
        
        Tab tabMembres = new Tab("Membres");
        tabMembres.setClosable(false);
        // TODO: Créer MembreView
        
        Tab tabEmprunts = new Tab("Emprunts");
        tabEmprunts.setClosable(false);
        // TODO: Créer EmpruntView
        
        Tab tabStats = new Tab("Statistiques");
        tabStats.setClosable(false);
        // TODO: Créer StatistiquesView
        
        tabPane.getTabs().addAll(tabLivres, tabMembres, tabEmprunts, tabStats);
        
        Scene scene = new Scene(tabPane, 1000, 700);
        primaryStage.setTitle("Gestionnaire de Bibliothèque");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    
    public static void main(String[] args) {
        launch(args);
    }
}`,
        ),
        task: "Implémente l'application complète de bibliothèque en suivant l'architecture proposée. Teste toutes les fonctionnalités.",
        takeaway:
          "Projet complet JavaFX + SQLite : architecture MVC, CRUD, recherche, stats. Valide le niveau avancé !",
        quiz: quiz(
          "Pourquoi séparer en packages (model, dao, view, controller) ?",
          ["Pour faire joli", "Séparation des responsabilités et maintenabilité", "Obligation Java"],
          1,
          "Architecture en couches : chaque package a une responsabilité claire. Facilite maintenance et évolution.",
        ),
        link: "https://openjfx.io/",
      }),
    ],
  },
];

export const javaLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Les fondamentaux de Java",
    color: levelColors[0],
    objective:
      "Maîtriser les bases : variables, conditions, boucles, méthodes, tableaux. Comprendre la programmation structurée en Java.",
    prerequisites:
      "Aucun. Ce niveau est fait pour les débutants complets.",
    outcomes: [
      "Écrire et compiler des programmes Java",
      "Manipuler variables, types primitifs et String",
      "Utiliser conditions, boucles et méthodes",
      "Travailler avec tableaux et gérer les exceptions",
    ],
    projects: [],
    chapters: beginner,
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "POO, Interfaces et JDBC",
    color: levelColors[1],
    objective:
      "Maîtriser la POO (classes, héritage simple), les interfaces (alternative à l'héritage multiple de C++), les collections et JDBC pour les bases de données.",
    prerequisites:
      "Niveau débutant complété. Maîtrise des bases Java.",
    outcomes: [
      "Créer des classes et utiliser l'héritage simple (vs C++ multiple)",
      "Implémenter plusieurs interfaces (alternative Java à l'héritage multiple)",
      "Utiliser ArrayList et HashMap",
      "Manipuler fichiers et bases de données avec JDBC/SQLite",
    ],
    projects: [],
    chapters: intermediate,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "JavaFX (GUI) + SQLite",
    color: levelColors[2],
    objective:
      "Créer des interfaces graphiques complètes avec JavaFX. Intégrer avec SQLite pour applications desktop professionnelles. Maîtriser layouts, composants avancés et architecture MVC + DAO.",
    prerequisites:
      "Niveaux débutant et intermédiaire complétés. Maîtrise POO et JDBC.",
    outcomes: [
      "Créer des interfaces graphiques modernes avec JavaFX",
      "Utiliser layouts (VBox, HBox, BorderPane, GridPane)",
      "Maîtriser TableView, ListView, ComboBox et événements",
      "Intégrer JavaFX avec SQLite (architecture MVC + DAO)",
      "Développer une application desktop complète (bibliothèque)",
      "Appliquer bonnes pratiques d'architecture logicielle",
    ],
    projects: [fxContacts, fxConverter, javaTasks],
    chapters: advanced,
  },
];
