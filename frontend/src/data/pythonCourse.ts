import {
  lesson,
  levelColors,
  quiz,
  section,
} from "./courseAuthoring";
import { consoleFiles } from "./desktopAuthoring";
import { pythonNotes, pythonScore, pythonVault } from "./pythonProjects";
import type { WebLevel } from "./webCourseTypes";

const docs = "https://docs.python.org/fr/3/tutorial/";

// ═══════════════════════════════════════════════════════════════════════════
// 🟢 NIVEAU DÉBUTANT - Les fondamentaux
// ═══════════════════════════════════════════════════════════════════════════

const beginner: WebLevel["chapters"] = [
  {
    id: "py-introduction",
    title: "Introduction à Python",
    description: "Découvre Python et le déroulement de la formation",
    lessons: [
      lesson({
        id: "py-intro-langage",
        title: "Qu'est-ce que Python et comment se déroulera cette formation ?",
        minutes: 15,
        summary:
          "Python est un langage polyvalent utilisé dans le web, l'IA, l'analyse de données et l'automatisation. Cette formation progressive te mènera des bases jusqu'à la création d'applications complètes.",
        sections: [
          section(
            "Pourquoi Python ?",
            "Python est l'un des langages les plus populaires grâce à sa syntaxe claire qui permet de se concentrer sur la résolution de problèmes plutôt que sur la complexité du code.",
            [
              "Gratuit, open source et utilisé par Google, Netflix, Instagram",
              "Large communauté et énorme bibliothèque de modules",
              "Parfait pour débuter et puissant pour des projets avancés",
            ],
          ),
          section(
            "Déroulement de la formation",
            "Trois niveaux progressifs avec leçons, exemples pratiques et projets. Chaque niveau se termine par un exercice récapitulatif.",
            [
              "🟢 Débutant : Variables, conditions, boucles, fonctions, modules",
              "🟡 Intermédiaire : POO, fichiers, structures de données, SQLite",
              "🔴 Avancé : Interfaces graphiques, API backend, projets complets",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# Bienvenue dans Python !\nprint("Bonjour DevAfrica !")\nprint("Je commence mon apprentissage Python.")\n\n# Python est facile à lire\nnom = "Tiana"\nprint(f"Je m\'appelle {nom} et je vais devenir développeur !")',
        ),
        task: "Modifie le code pour afficher ton propre nom et ton objectif avec Python.",
        takeaway:
          "Python est polyvalent, accessible et utilisé dans tous les domaines de la tech.",
        quiz: quiz(
          "Python peut être utilisé pour :",
          ["Uniquement le web", "Tous les domaines (web, data, IA, automatisation)", "Uniquement les jeux"],
          1,
          "Python est un langage polyvalent utilisé dans presque tous les domaines.",
        ),
        link: docs + "introduction.html",
      }),
    ],
  },
  {
    id: "py-donnees-types",
    title: "Déclaration de données et types",
    description: "Variables, types de données et opérateurs",
    lessons: [
      lesson({
        id: "py-variables",
        title: "Variables et types de données",
        minutes: 20,
        summary:
          "Une variable stocke des données. Python a plusieurs types : int (entier), float (décimal), str (texte), bool (vrai/faux). Le type est déterminé automatiquement.",
        sections: [
          section(
            "Déclarer des variables",
            "En Python, tu déclares une variable en lui assignant une valeur avec =. Python reconnaît automatiquement le type.",
            [
              "Noms : lettres, chiffres, underscore (pas de chiffre au début)",
              "Sensible à la casse : age ≠ Age",
              "Utilise des noms descriptifs : prenom plutôt que p",
            ],
          ),
          section(
            "Les 4 types de base",
            "Python reconnaît le type selon la valeur. Entiers sans virgule, décimaux avec virgule, texte entre guillemets.",
            [
              "int : entiers → 5, -10, 1000",
              "float : décimaux → 3.14, -2.5",
              "str : texte → 'Bonjour', \"Python\"",
              "bool : booléens → True, False",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# Déclaration de variables\nnom = "Soa"\nage = 20\ntaille = 1.68\nest_etudiant = True\n\nprint("Nom:", nom, "- Type:", type(nom))\nprint("Age:", age, "- Type:", type(age))\nprint("Taille:", taille, "m - Type:", type(taille))\nprint("Étudiant:", est_etudiant, "- Type:", type(est_etudiant))\n\n# Modification\nage = age + 1\nprint("\\nNouveau âge:", age)',
        ),
        task: "Crée des variables pour ton nom, âge, ville et affiche-les avec leur type.",
        takeaway:
          "Les variables stockent des données typées que Python reconnaît automatiquement.",
        quiz: quiz(
          "Quel type est 3.14 ?",
          ["int", "float", "str"],
          1,
          "Les nombres avec virgule sont de type float (flottant).",
        ),
        link: docs + "introduction.html#using-python-as-a-calculator",
      }),
      lesson({
        id: "py-operateurs",
        title: "Opérateurs arithmétiques et logiques",
        minutes: 22,
        summary:
          "Les opérateurs permettent calculs (+, -, *, /, **, //, %) et comparaisons (==, !=, <, >, <=, >=). Les opérateurs logiques combinent des conditions (and, or, not).",
        sections: [
          section(
            "Opérateurs arithmétiques",
            "Python supporte toutes les opérations mathématiques. ** pour la puissance, // pour la division entière, % pour le reste.",
            [
              "+ addition, - soustraction",
              "* multiplication, / division",
              "** puissance, // division entière, % modulo",
            ],
          ),
          section(
            "Comparaisons et logique",
            "Les comparaisons retournent True/False. Les opérateurs logiques permettent de combiner plusieurs conditions.",
            [
              "== égal, != différent, <, >, <=, >=",
              "and : ET (les deux doivent être vrais)",
              "or : OU (au moins un doit être vrai)",
              "not : NON (inverse le booléen)",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# Opérateurs arithmétiques\na, b = 10, 3\nprint("a =", a, ", b =", b)\nprint("Addition:", a + b)\nprint("Soustraction:", a - b)\nprint("Multiplication:", a * b)\nprint("Division:", a / b)\nprint("Division entière:", a // b)\nprint("Modulo (reste):", a % b)\nprint("Puissance:", a ** b)\n\n# Comparaisons\nprint("\\n=== Comparaisons ===")\nprint("a == b:", a == b)\nprint("a != b:", a != b)\nprint("a > b:", a > b)\n\n# Logique\nage = 20\na_permis = True\nprint("\\n=== Logique ===")\nprint("Peut conduire?", age >= 18 and a_permis)',
        ),
        task: "Calcule le prix TTC d'un produit : prix HT × (1 + TVA 18%).",
        takeaway:
          "Les opérateurs permettent calculs, comparaisons et logique booléenne.",
        quiz: quiz(
          "10 % 3 retourne :",
          ["3", "1", "0"],
          1,
          "Le modulo retourne le reste de la division : 10 ÷ 3 = 3 reste 1.",
        ),
        link: docs + "introduction.html#numbers",
      }),
      lesson({
        id: "py-conversions",
        title: "Conversions de types et input",
        minutes: 18,
        summary:
          "input() capture la saisie (toujours str). int(), float(), str() convertissent entre types. Toujours vérifier/convertir avant d'utiliser.",
        sections: [
          section(
            "Saisie utilisateur",
            "input() affiche un message et attend l'entrée. Le résultat est toujours une chaîne de caractères.",
            [
              "input() retourne toujours str",
              "Il faut convertir pour faire des calculs",
            ],
          ),
          section(
            "Fonctions de conversion",
            "int() convertit en entier, float() en décimal, str() en texte. La conversion peut échouer si incompatible.",
            [
              "int('10') → 10",
              "float('3.14') → 3.14",
              "str(42) → '42'",
              "int('abc') → ValueError",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# Saisie et conversion\nnom = input("Ton nom ? ")\nprint(f"Bonjour {nom} !")\n\nage_texte = input("Ton âge ? ")\nage = int(age_texte)\nprint(f"Dans 5 ans, tu auras {age + 5} ans.")\n\n# Calcul avec conversions\nprix = float(input("Prix ? "))\nquantite = int(input("Quantité ? "))\ntotal = prix * quantite\nprint(f"Total : {total} Ar")',
          { stdin: "Tiana\n20\n2500\n3\n" },
        ),
        task: "Demande deux nombres et affiche leur somme, différence et produit.",
        takeaway:
          "input() donne du texte. Convertis avec int()/float() pour calculer.",
        quiz: quiz(
          "input() retourne quel type ?",
          ["int", "float", "str"],
          2,
          "input() retourne toujours une chaîne de caractères (str).",
        ),
        link: docs + "inputoutput.html",
      }),
    ],
  },
  {
    id: "py-conditions",
    title: "Conditions",
    description: "Prendre des décisions avec if, elif, else et match/case",
    lessons: [
      lesson({
        id: "py-if-else",
        title: "if, elif et else",
        minutes: 20,
        summary:
          "if teste une condition. Si vraie, exécute le bloc indenté. elif teste une alternative, else capture tous les autres cas.",
        sections: [
          section(
            "Structure conditionnelle",
            "if évalue une expression booléenne. Si True, le code indenté s'exécute. else s'exécute si la condition est fausse.",
            [
              "Indentation (4 espaces) obligatoire",
              "Deux-points (:) obligatoire après condition",
              "elif = else if (condition alternative)",
            ],
          ),
          section(
            "Conditions multiples",
            "Enchaîne plusieurs elif. Seul le premier bloc True s'exécute, les autres sont ignorés.",
            [
              "Test dans l'ordre d'écriture",
              "Une fois un bloc exécuté, on sort de la structure",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# Condition simple\nage = 18\nif age >= 18:\n    print("Majeur")\nelse:\n    print("Mineur")\n\n# Conditions multiples\nnote = 15\nif note >= 16:\n    print("Excellent !")\nelif note >= 12:\n    print("Bien")\nelif note >= 10:\n    print("Passable")\nelse:\n    print("Insuffisant")\n\n# Logique combinée\nage = 20\na_permis = True\nif age >= 18 and a_permis:\n    print("Peut conduire")\nelse:\n    print("Ne peut pas conduire")',
        ),
        task: "Programme : température → froid (<15), agréable (15-25), chaud (>25).",
        takeaway:
          "Les conditions permettent au programme de s'adapter aux situations.",
        quiz: quiz(
          "elif signifie :",
          ["end if", "else if", "elif function"],
          1,
          "elif = else if : teste une condition alternative.",
        ),
        link: docs + "controlflow.html#if-statements",
      }),
      lesson({
        id: "py-match-case",
        title: "match/case : alternative élégante (Python 3.10+)",
        minutes: 18,
        summary:
          "match/case compare une valeur à différents motifs. Plus lisible que de nombreux elif pour une même variable. case _ capture tous les cas non traités.",
        sections: [
          section(
            "Structure match/case",
            "match prend une expression. case définit chaque motif possible. case _ est le cas par défaut (wildcard).",
            [
              "Plus lisible que plusieurs elif",
              "case _ = cas par défaut",
              "Disponible depuis Python 3.10",
            ],
          ),
          section(
            "Motifs multiples",
            "case 1 | 2 | 3 pour accepter plusieurs valeurs (OU logique). Très pratique pour les menus.",
            [
              "| sépare les alternatives",
              "Testés dans l'ordre",
              "Plus efficace que plusieurs if",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# Menu avec match/case\nchoix = 2\n\nmatch choix:\n    case 1:\n        print("Nouveau")\n    case 2:\n        print("Ouvrir")\n    case 3:\n        print("Sauvegarder")\n    case 4:\n        print("Quitter")\n    case _:\n        print("Choix invalide")\n\n# Jour de semaine\njour = "lundi"\n\nmatch jour:\n    case "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi":\n        print("Jour de travail")\n    case "samedi" | "dimanche":\n        print("Week-end !")\n    case _:\n        print("Jour inconnu")\n\n# Type de fichier\nfichier = "doc.pdf"\next = fichier.split(".")[-1]\n\nmatch ext:\n    case "pdf" | "doc" | "docx":\n        print("Document")\n    case "jpg" | "png":\n        print("Image")\n    case _:\n        print("Type inconnu")',
        ),
        task: "Calculatrice avec match/case : opération (+,-,*,/) et deux nombres.",
        takeaway:
          "match/case : code plus clair pour comparer une valeur à plusieurs motifs.",
        quiz: quiz(
          "case _ fait quoi ?",
          ["Erreur", "Cas par défaut", "Compare à underscore"],
          1,
          "case _ capture tous les cas non traités (comme else).",
        ),
        link: "https://docs.python.org/3/whatsnew/3.10.html#pep-634-structural-pattern-matching",
      }),
    ],
  },
  {
    id: "py-fonctions",
    title: "Fonctions",
    description: "Réutiliser du code avec les fonctions",
    lessons: [
      lesson({
        id: "py-def-return",
        title: "Définir et appeler des fonctions",
        minutes: 22,
        summary:
          "Une fonction est un bloc réutilisable. def définit une fonction, les paramètres sont les entrées, return renvoie le résultat.",
        sections: [
          section(
            "Créer une fonction",
            "def suivi du nom et de () définit une fonction. Le code indenté = corps de la fonction.",
            [
              "Paramètres entre parenthèses",
              "return termine et renvoie une valeur",
              "Sans return, renvoie None",
            ],
          ),
          section(
            "Appeler et réutiliser",
            "Une fois définie, appelle-la avec différentes valeurs. Évite la répétition de code.",
            [
              "Appel : nom_fonction(arguments)",
              "Code plus lisible et maintenable",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# Fonction simple\ndef saluer(nom):\n    print(f"Bonjour {nom} !")\n\nsaluer("Tiana")\nsaluer("Soa")\n\n# Fonction avec return\ndef calculer_tva(prix, taux=0.18):\n    return prix * (1 + taux)\n\nprix_ht = 1000\nprix_ttc = calculer_tva(prix_ht)\nprint(f"Prix TTC: {prix_ttc} Ar")\n\n# Plusieurs paramètres\ndef moyenne(a, b, c):\n    return (a + b + c) / 3\n\nprint(f"Moyenne: {moyenne(12, 15, 14)}/20")',
        ),
        task: "Fonction aire_cercle(rayon) qui retourne π × rayon².",
        takeaway:
          "Les fonctions réutilisent du code et organisent le programme.",
        quiz: quiz(
          "return fait quoi ?",
          ["Affiche", "Renvoie une valeur", "Supprime"],
          1,
          "return termine la fonction et renvoie une valeur.",
        ),
        link: docs + "controlflow.html#defining-functions",
      }),
    ],
  },
  {
    id: "py-boucles",
    title: "Boucles",
    description: "Répéter des actions avec for et while",
    lessons: [
      lesson({
        id: "py-for-while",
        title: "Boucles for et while",
        minutes: 22,
        summary:
          "for parcourt une séquence. range(n) génère 0 à n-1. while répète tant qu'une condition est vraie. break termine, continue passe au suivant.",
        sections: [
          section(
            "Boucle for",
            "for parcourt chaque élément. range(n) génère les nombres de 0 à n-1.",
            [
              "range(5) → 0,1,2,3,4",
              "range(1, 6) → 1,2,3,4,5",
              "range(0, 10, 2) → 0,2,4,6,8",
            ],
          ),
          section(
            "Boucle while",
            "while continue tant que sa condition est vraie. Attention aux boucles infinies !",
            [
              "La condition doit pouvoir devenir fausse",
              "Utilise un compteur ou condition de sortie",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# for avec range\nprint("Compte 1 à 5:")\nfor i in range(1, 6):\n    print(i)\n\n# for sur liste\nfruits = ["banane", "mangue", "ananas"]\nprint("\\nFruits:")\nfor fruit in fruits:\n    print("-", fruit)\n\n# while\nprint("\\nDécompte:")\ncompteur = 5\nwhile compteur > 0:\n    print(compteur)\n    compteur -= 1\nprint("Go !")\n\n# break et continue\nprint("\\nPairs jusqu\'à 10:")\nfor i in range(1, 11):\n    if i % 2 != 0:\n        continue\n    print(i)',
        ),
        task: "Boucle affichant la table de multiplication de 7 (1 à 10).",
        takeaway:
          "Les boucles répètent efficacement du code.",
        quiz: quiz(
          "range(3) génère :",
          ["1,2,3", "0,1,2", "0,1,2,3"],
          1,
          "range(3) commence à 0 et s'arrête avant 3.",
        ),
        link: docs + "controlflow.html#for-statements",
      }),
    ],
  },
  {
    id: "py-modulaire",
    title: "Programmation modulaire",
    description: "Organiser le code en modules et comprendre les imports",
    lessons: [
      lesson({
        id: "py-modules-import",
        title: "Modules et les 4 façons d'importer",
        minutes: 25,
        summary:
          "Un module = fichier Python avec fonctions/variables. Il existe 4 syntaxes d'import : import module, from module import fonction, import module as alias, from module import *. Chaque méthode a son usage.",
        sections: [
          section(
            "Les 4 façons d'importer",
            "Python offre différentes syntaxes selon tes besoins. Chaque méthode change l'utilisation du code importé.",
            [
              "✅ import math → utilise math.sqrt()",
              "✅ from math import sqrt → utilise sqrt() directement",
              "❌ from math import * → importe tout (déconseillé !)",
              "✅ import math as m → utilise m.sqrt() (alias)",
            ],
          ),
          section(
            "Quand utiliser quelle méthode ?",
            "Choisis selon ton besoin. import complet évite les conflits. from importe seulement ce qui est nécessaire. Alias raccourcit les noms longs.",
            [
              "import module : beaucoup de fonctions du module",
              "from module import func : 1-3 fonctions spécifiques",
              "from module import * : JAMAIS (pollue l'espace de noms)",
              "import module as alias : noms longs (pandas as pd)",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# ═══ Méthode 1 : import module ═══\nimport math\nprint("1. import math:")\nprint("  Racine 16:", math.sqrt(16))\nprint("  Pi:", math.pi)\n# Clair d\'où vient sqrt\n\n# ═══ Méthode 2 : from module import fonction ═══\nfrom random import randint, choice\nprint("\\n2. from random import randint, choice:")\nprint("  Nombre aléatoire:", randint(1, 100))\nfruits = ["banane", "mangue"]\nprint("  Fruit aléatoire:", choice(fruits))\n# random.shuffle() ne marche PAS\n\n# ═══ Méthode 3 : import module as alias ═══\nimport datetime as dt\nprint("\\n3. import datetime as dt:")\nprint("  Maintenant:", dt.datetime.now())\n# Raccourcit datetime en dt\n\n# ═══ Méthode 4 : from module import * ═══\n# ❌ ÉVITER : from math import *\n# sqrt(16)  # D\'où vient sqrt ? Pas clair\n# Risque de conflit de noms\n\nprint("\\n✅ Bonnes pratiques:")\nprint("  • import module : beaucoup de fonctions")\nprint("  • from module import func : 1-3 fonctions")\nprint("  • import module as alias : noms longs")\nprint("  ❌ Éviter : from module import *")',
        ),
        task: "Importe os avec alias et affiche le nom de ton système (os.name).",
        takeaway:
          "import module pour tout, from pour du spécifique, as pour alias.",
        quiz: quiz(
          "Différence entre import math et from math import sqrt ?",
          ["Aucune", "import importe tout, from importe seulement sqrt", "import est plus rapide"],
          1,
          "from importe seulement la fonction, import importe tout le module.",
        ),
        link: docs + "modules.html",
      }),
    ],
  },
  {
    id: "py-erreurs",
    title: "Gestion des erreurs",
    description: "Gérer les erreurs avec try/except",
    lessons: [
      lesson({
        id: "py-try-except",
        title: "try, except et finally",
        minutes: 22,
        summary:
          "Les erreurs (exceptions) arrêtent le programme. try/except capture les erreurs et réagit sans planter. finally exécute du code dans tous les cas.",
        sections: [
          section(
            "Capturer les erreurs",
            "try tente d'exécuter du code. except capture l'erreur et exécute du code alternatif.",
            [
              "ValueError : erreur de conversion",
              "ZeroDivisionError : division par zéro",
              "FileNotFoundError : fichier introuvable",
            ],
          ),
          section(
            "Exceptions multiples et finally",
            "Plusieurs except capturent différents types. finally s'exécute toujours.",
            [
              "finally : fermer fichiers/connexions",
              "raise : lever manuellement une exception",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# Gestion simple\ntry:\n    age = int(input("Âge ? "))\n    print(f"Tu as {age} ans")\nexcept ValueError:\n    print("❌ Entre un nombre !")\n\n# Exceptions multiples\ntry:\n    a = int(input("Premier nombre ? "))\n    b = int(input("Deuxième nombre ? "))\n    print(f"Résultat : {a / b}")\nexcept ValueError:\n    print("❌ Nombres invalides")\nexcept ZeroDivisionError:\n    print("❌ Division par zéro impossible")\nfinally:\n    print("Fin du calcul")\n\n# Lever une exception\ndef verifier_age(age):\n    if age < 0:\n        raise ValueError("Âge négatif impossible")\n    return age',
          { stdin: "vingt\n10\n0\n" },
        ),
        task: "Programme de division gérant ValueError et ZeroDivisionError.",
        takeaway:
          "try/except gère les erreurs sans planter le programme.",
        quiz: quiz(
          "except fait quoi ?",
          ["Lance erreur", "Capture erreur", "Arrête programme"],
          1,
          "except capture une erreur pour éviter le plantage.",
        ),
        link: docs + "errors.html",
      }),
    ],
  },
  {
    id: "py-exercice-final-debutant",
    title: "🎯 Exercice Final Débutant",
    description: "Projet utilisant tous les concepts du niveau",
    lessons: [
      lesson({
        id: "py-projet-debutant",
        title: "Gestionnaire de Notes",
        minutes: 45,
        summary:
          "Crée un programme complet qui gère des notes d'étudiants avec menu, fonctions, listes, conditions et gestion d'erreurs.",
        sections: [
          section(
            "Fonctionnalités requises",
            "Menu interactif avec 5 options. Utilise tous les concepts appris : variables, listes, boucles, conditions, fonctions.",
            [
              "1. Ajouter une note (validation 0-20)",
              "2. Afficher toutes les notes",
              "3. Calculer la moyenne (fonction)",
              "4. Notes au-dessus de la moyenne",
              "5. Quitter (match/case ou if/elif)",
            ],
          ),
          section(
            "Concepts à utiliser",
            "Ce projet consolide tout le niveau débutant. Chaque fonctionnalité utilise plusieurs concepts.",
            [
              "Variables et listes pour stocker les notes",
              "Boucle while pour le menu principal",
              "Conditions pour valider et filtrer",
              "Fonctions pour calculer et organiser",
              "try/except pour gérer les erreurs de saisie",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          '# 🎯 PROJET FINAL DÉBUTANT - À compléter\n\nnotes = []\n\ndef afficher_menu():\n    print("\\n=== GESTIONNAIRE DE NOTES ===")\n    print("1. Ajouter une note")\n    print("2. Afficher toutes les notes")\n    print("3. Calculer la moyenne")\n    print("4. Notes au-dessus de la moyenne")\n    print("5. Quitter")\n\ndef ajouter_note():\n    """Demande et valide une note (0-20)"""\n    # TODO: À compléter\n    pass\n\ndef calculer_moyenne(liste_notes):\n    """Retourne la moyenne ou None si liste vide"""\n    # TODO: À compléter\n    pass\n\ndef afficher_notes():\n    """Affiche toutes les notes"""\n    # TODO: À compléter\n    pass\n\ndef notes_au_dessus_moyenne():\n    """Affiche les notes > moyenne"""\n    # TODO: À compléter\n    pass\n\n# Programme principal\nwhile True:\n    afficher_menu()\n    # TODO: Implémenter le menu avec match/case ou if/elif\n    break  # Retirer ce break',
        ),
        task: "Complète toutes les fonctions pour créer un gestionnaire de notes fonctionnel.",
        takeaway:
          "Tu maîtrises maintenant les fondamentaux de Python pour créer des programmes complets !",
        quiz: quiz(
          "Quel concept n'est PAS nécessaire ?",
          ["Boucles", "Fonctions", "Classes (POO)"],
          2,
          "La POO n'est pas au niveau débutant, on utilise des fonctions.",
        ),
        link: docs,
      }),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🟡 NIVEAU INTERMÉDIAIRE - POO et Bases de données
// ═══════════════════════════════════════════════════════════════════════════

const intermediate: WebLevel["chapters"] = [
  {
    id: "py-poo-intro",
    title: "Introduction à la POO",
    description: "Classes, objets, attributs et méthodes",
    lessons: [
      lesson({
        id: "py-classes-objets",
        title: "Classes et objets : créer des modèles",
        minutes: 25,
        summary:
          "Une classe est un modèle (blueprint). Un objet est une instance de classe. Les attributs stockent les données, les méthodes définissent les comportements.",
        sections: [
          section(
            "Qu'est-ce qu'une classe ?",
            "Une classe définit la structure et le comportement d'objets. Comme un plan de maison avant construction.",
            [
              "class Nom: définit une classe",
              "__init__ = constructeur (initialise l'objet)",
              "self = référence à l'instance actuelle",
            ],
          ),
          section(
            "Attributs et méthodes",
            "Les attributs sont les variables de l'objet. Les méthodes sont ses fonctions. self est toujours le premier paramètre.",
            [
              "Attributs : self.nom = valeur",
              "Méthodes : def nom_methode(self):",
              "Appel : objet.methode()",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# Définir une classe
class Etudiant:
    def __init__(self, nom, age, filiere):
        self.nom = nom
        self.age = age
        self.filiere = filiere
        self.notes = []
    
    def ajouter_note(self, note):
        self.notes.append(note)
        print(f"Note {note} ajoutée pour {self.nom}")
    
    def moyenne(self):
        if len(self.notes) == 0:
            return 0
        return sum(self.notes) / len(self.notes)
    
    def afficher(self):
        print(f"\\n=== {self.nom} ===")
        print(f"Âge: {self.age} ans")
        print(f"Filière: {self.filiere}")
        print(f"Moyenne: {self.moyenne()}/20")

# Créer des objets
etudiant1 = Etudiant("Tiana", 20, "Informatique")
etudiant2 = Etudiant("Soa", 19, "Gestion")

# Utiliser les méthodes
etudiant1.ajouter_note(15)
etudiant1.ajouter_note(17)
etudiant1.afficher()

etudiant2.ajouter_note(14)
etudiant2.afficher()`,
        ),
        task: "Crée une classe Voiture avec marque, modèle, année et méthode demarrer().",
        takeaway:
          "Les classes modélisent des objets du monde réel avec données et comportements.",
        quiz: quiz(
          "__init__ sert à :",
          ["Supprimer objet", "Initialiser objet", "Copier objet"],
          1,
          "__init__ est le constructeur qui initialise les attributs.",
        ),
        link: docs + "classes.html",
      }),
    ],
  },
  {
    id: "py-poo-avancee",
    title: "POO avancée",
    description: "Héritage, polymorphisme et encapsulation",
    lessons: [
      lesson({
        id: "py-heritage",
        title: "Héritage : réutiliser et étendre",
        minutes: 28,
        summary:
          "L'héritage permet à une classe (enfant) d'hériter des attributs/méthodes d'une autre (parent). super() appelle le constructeur parent. Évite la duplication de code.",
        sections: [
          section(
            "Créer une hiérarchie",
            "class Enfant(Parent): crée une sous-classe. L'enfant hérite de tout et peut ajouter/modifier.",
            [
              "Classe parent = classe de base",
              "Classe enfant = classe dérivée",
              "super().__init__() appelle le constructeur parent",
            ],
          ),
          section(
            "Polymorphisme",
            "Une méthode peut avoir différentes implémentations selon la classe. L'enfant peut redéfinir (override) les méthodes du parent.",
            [
              "Même nom de méthode, comportement différent",
              "Appelle automatiquement la version correcte",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# Classe parent
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    def presenter(self):
        print(f"Je suis {self.nom}, {self.age} ans")

# Classes enfants
class Etudiant(Personne):
    def __init__(self, nom, age, filiere):
        super().__init__(nom, age)
        self.filiere = filiere
    
    def presenter(self):
        super().presenter()
        print(f"Filière: {self.filiere}")

class Professeur(Personne):
    def __init__(self, nom, age, matiere):
        super().__init__(nom, age)
        self.matiere = matiere
    
    def presenter(self):
        super().presenter()
        print(f"J'enseigne: {self.matiere}")

# Polymorphisme en action
personnes = [
    Etudiant("Tiana", 20, "Info"),
    Professeur("M. Rakoto", 45, "Mathématiques"),
    Etudiant("Soa", 19, "Gestion")
]

for p in personnes:
    p.presenter()
    print()`,
        ),
        task: "Crée Animal (parent) et Chat, Chien (enfants) avec méthode crier().",
        takeaway:
          "L'héritage réutilise le code, le polymorphisme adapte le comportement.",
        quiz: quiz(
          "super() fait quoi ?",
          ["Supprime parent", "Appelle méthode parent", "Crée parent"],
          1,
          "super() accède aux méthodes de la classe parent.",
        ),
        link: docs + "classes.html#inheritance",
      }),
      lesson({
        id: "py-encapsulation",
        title: "Encapsulation : protéger les données",
        minutes: 22,
        summary:
          "L'encapsulation protège les données. _ préfixe = privé (convention). __ préfixe = très privé (name mangling). Propriétés @property contrôlent l'accès.",
        sections: [
          section(
            "Attributs privés",
            "_ devant le nom = privé par convention (mais accessible). __ = vraiment privé (Python modifie le nom).",
            [
              "Public : nom",
              "Privé : _nom (convention)",
              "Très privé : __nom (mangling)",
            ],
          ),
          section(
            "Propriétés",
            "@property transforme une méthode en attribut. @nom.setter définit comment modifier. Contrôle et valide les valeurs.",
            [
              "Getter : @property",
              "Setter : @nom.setter",
              "Validation centralisée",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `class CompteBancaire:
    def __init__(self, proprietaire, solde_initial=0):
        self.proprietaire = proprietaire
        self.__solde = solde_initial  # Privé
    
    @property
    def solde(self):
        """Getter : lire le solde"""
        return self.__solde
    
    def deposer(self, montant):
        if montant > 0:
            self.__solde += montant
            print(f"Dépôt: {montant} Ar")
        else:
            print("Montant invalide")
    
    def retirer(self, montant):
        if 0 < montant <= self.__solde:
            self.__solde -= montant
            print(f"Retrait: {montant} Ar")
        else:
            print("Solde insuffisant ou montant invalide")
    
    def afficher(self):
        print(f"Compte de {self.proprietaire}")
        print(f"Solde: {self.solde} Ar")

# Utilisation
compte = CompteBancaire("Tiana", 10000)
compte.afficher()

compte.deposer(5000)
compte.retirer(3000)
compte.afficher()

# Impossible de modifier directement
# compte.__solde = 999999  # ❌ Ne fonctionne pas`,
        ),
        task: "Crée Produit avec __prix privé et @property pour getter/setter avec validation.",
        takeaway:
          "L'encapsulation protège les données et contrôle leur modification.",
        quiz: quiz(
          "@property sert à :",
          ["Créer attribut", "Transformer méthode en attribut accessible", "Supprimer attribut"],
          1,
          "@property transforme une méthode en attribut avec contrôle d'accès.",
        ),
        link: docs + "classes.html#private-variables",
      }),
    ],
  },
  {
    id: "py-fichiers",
    title: "Manipulation de fichiers",
    description: "Lire et écrire dans des fichiers",
    lessons: [
      lesson({
        id: "py-fichiers-texte",
        title: "Lire et écrire des fichiers texte",
        minutes: 25,
        summary:
          "open() ouvre un fichier. Modes : 'r' (lecture), 'w' (écriture écrase), 'a' (ajout). with ferme automatiquement. read(), readline(), readlines() pour lire.",
        sections: [
          section(
            "Modes d'ouverture",
            "open(fichier, mode) ouvre un fichier. Le mode définit l'opération possible.",
            [
              "'r' : lecture (défaut)",
              "'w' : écriture (écrase)",
              "'a' : ajout (fin du fichier)",
              "'r+' : lecture + écriture",
            ],
          ),
          section(
            "with : gestion automatique",
            "with garantit la fermeture du fichier même en cas d'erreur. Toujours préférer with.",
            [
              "Fermeture automatique",
              "Gestion propre des erreurs",
              "Meilleure pratique Python",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# Écriture
with open("notes.txt", "w", encoding="utf-8") as fichier:
    fichier.write("Liste des notes\\n")
    fichier.write("================\\n")
    notes = [15, 17, 12, 18, 14]
    for note in notes:
        fichier.write(f"Note: {note}/20\\n")

print("Fichier créé !")

# Lecture complète
print("\\n=== Lecture complète ===")
with open("notes.txt", "r", encoding="utf-8") as fichier:
    contenu = fichier.read()
    print(contenu)

# Lecture ligne par ligne
print("\\n=== Ligne par ligne ===")
with open("notes.txt", "r", encoding="utf-8") as fichier:
    for ligne in fichier:
        print(ligne.strip())

# Ajout
with open("notes.txt", "a", encoding="utf-8") as fichier:
    fichier.write("Nouvelle note: 16/20\\n")

print("\\nNote ajoutée !")`,
        ),
        task: "Programme qui crée journal.txt et ajoute des entrées avec date.",
        takeaway:
          "with open() gère proprement l'ouverture et fermeture des fichiers.",
        quiz: quiz(
          "Mode 'w' fait quoi ?",
          ["Lit", "Écrit en écrasant", "Ajoute"],
          1,
          "Mode 'w' écrit en écrasant le contenu existant.",
        ),
        link: docs + "inputoutput.html#reading-and-writing-files",
      }),
    ],
  },
  {
    id: "py-structures",
    title: "Structures de données",
    description: "Listes, tuples, dictionnaires et sets",
    lessons: [
      lesson({
        id: "py-listes-tuples",
        title: "Listes et tuples",
        minutes: 22,
        summary:
          "Listes : [] modifiables, ordonnées. Méthodes : append(), remove(), sort(). Tuples : () immuables, plus rapides. Utilisés pour données fixes.",
        sections: [
          section(
            "Listes",
            "Séquence modifiable. Supporte ajout, suppression, tri. Indices commencent à 0.",
            [
              "append() : ajouter",
              "remove() : supprimer par valeur",
              "pop() : retirer par index",
              "sort() : trier",
            ],
          ),
          section(
            "Tuples",
            "Comme liste mais immuable (non modifiable). Plus rapides, utilisés pour données constantes.",
            [
              "Création : (1, 2, 3)",
              "Immuables : pas de modification",
              "Unpacking : a, b = (1, 2)",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# Listes
fruits = ["banane", "mangue", "ananas"]
print("Fruits:", fruits)

fruits.append("papaye")
fruits.remove("banane")
print("Après modif:", fruits)

# Méthodes utiles
nombres = [3, 1, 4, 1, 5, 9, 2]
print("\\nNombres:", nombres)
print("Longueur:", len(nombres))
print("Max:", max(nombres))
print("Somme:", sum(nombres))

nombres.sort()
print("Triés:", nombres)

# Tuples
coordonnees = (10.5, -3.2)
x, y = coordonnees  # Unpacking
print(f"\\nCoordonnées: x={x}, y={y}")

# Tuple comme clé de dictionnaire
positions = {
    (0, 0): "Origine",
    (1, 0): "Droite",
    (0, 1): "Haut"
}
print("Positions:", positions[(0, 0)])`,
        ),
        task: "Programme gérant une liste de tâches (ajout, suppression, affichage).",
        takeaway:
          "Listes = modifiables, tuples = immuables et plus rapides.",
        quiz: quiz(
          "Différence liste/tuple ?",
          ["Aucune", "Liste modifiable, tuple non", "Tuple plus lent"],
          1,
          "Les listes sont modifiables, les tuples sont immuables.",
        ),
        link: docs + "datastructures.html",
      }),
      lesson({
        id: "py-dictionnaires-sets",
        title: "Dictionnaires et sets",
        minutes: 25,
        summary:
          "Dictionnaires : {clé: valeur} pour associations. Accès rapide par clé. Sets : {val1, val2} sans doublons, opérations mathématiques (union, intersection).",
        sections: [
          section(
            "Dictionnaires",
            "Stocke des paires clé-valeur. Accès très rapide. Clés uniques.",
            [
              "Accès : dict[clé]",
              "Ajout : dict[nouvelle_clé] = valeur",
              "Parcours : items(), keys(), values()",
            ],
          ),
          section(
            "Sets",
            "Collection sans doublons. Opérations mathématiques d'ensembles.",
            [
              "Pas de doublons automatiquement",
              "union() : éléments des deux",
              "intersection() : éléments communs",
              "difference() : dans A mais pas B",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# Dictionnaires
etudiant = {
    "nom": "Tiana",
    "age": 20,
    "filiere": "Informatique",
    "notes": [15, 17, 14]
}

print("Nom:", etudiant["nom"])
print("Moyenne:", sum(etudiant["notes"]) / len(etudiant["notes"]))

# Ajout et modification
etudiant["email"] = "tiana@dev.mg"
etudiant["age"] = 21

# Parcours
print("\\nToutes les infos:")
for cle, valeur in etudiant.items():
    print(f"  {cle}: {valeur}")

# Sets
groupe1 = {"Tiana", "Soa", "Kanto"}
groupe2 = {"Soa", "Miora", "Faly"}

print("\\n=== Sets ===")
print("Groupe 1:", groupe1)
print("Groupe 2:", groupe2)
print("Tous (union):", groupe1.union(groupe2))
print("Communs (intersection):", groupe1.intersection(groupe2))
print("Seulement G1:", groupe1.difference(groupe2))

# Éliminer doublons
nombres = [1, 2, 2, 3, 4, 4, 4, 5]
uniques = list(set(nombres))
print("\\nUniques:", uniques)`,
        ),
        task: "Crée un dictionnaire annuaire téléphonique avec ajout, recherche, suppression.",
        takeaway:
          "Dictionnaires = clé-valeur, sets = collections uniques avec opérations mathématiques.",
        quiz: quiz(
          "Les clés de dictionnaire doivent être :",
          ["Modifiables", "Immuables", "Des nombres"],
          1,
          "Les clés doivent être immuables (str, int, tuple).",
        ),
        link: docs + "datastructures.html#dictionaries",
      }),
    ],
  },
  {
    id: "py-sqlite-intro",
    title: "Introduction à SQLite",
    description: "Bases de données avec SQLite",
    lessons: [
      lesson({
        id: "py-sqlite-bases",
        title: "SQLite : base de données embarquée",
        minutes: 20,
        summary:
          "SQLite = moteur de BD léger, sans serveur, fichier unique. Module sqlite3 intégré à Python. Connexion → curseur → exécution SQL → commit → fermeture.",
        sections: [
          section(
            "Pourquoi SQLite ?",
            "SQLite stocke des données structurées dans un fichier. Idéal pour apprendre et petits projets.",
            [
              "Aucune installation nécessaire",
              "Fichier unique portable",
              "SQL standard",
              "Parfait pour prototyper",
            ],
          ),
          section(
            "Workflow de base",
            "Toujours le même processus : connexion, curseur, exécution, commit (pour modifications), fermeture.",
            [
              "1. connect() : ouvre/crée BD",
              "2. cursor() : prépare exécution",
              "3. execute() : lance SQL",
              "4. commit() : valide changements",
              "5. close() : ferme connexion",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `import sqlite3

# Connexion (crée le fichier si inexistant)
connexion = sqlite3.connect("ma_base.db")
print("✅ Connexion établie")

# Curseur pour exécuter SQL
curseur = connexion.cursor()

# Créer une table
curseur.execute("""
    CREATE TABLE IF NOT EXISTS etudiants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        age INTEGER,
        filiere TEXT
    )
""")

print("✅ Table 'etudiants' créée")

# Valider et fermer
connexion.commit()
connexion.close()
print("✅ Connexion fermée")

# Vérifier que le fichier existe
import os
if os.path.exists("ma_base.db"):
    print(f"📁 Fichier BD créé : {os.path.getsize('ma_base.db')} octets")`,
        ),
        task: "Crée une BD produits.db avec table produits (id, nom, prix, stock).",
        takeaway:
          "SQLite = BD simple dans un fichier. Workflow : connect → cursor → execute → commit → close.",
        quiz: quiz(
          "commit() sert à :",
          ["Ouvrir BD", "Valider changements", "Fermer BD"],
          1,
          "commit() valide les modifications dans la base.",
        ),
        link: "https://docs.python.org/3/library/sqlite3.html",
      }),
    ],
  },
  {
    id: "py-sqlite-create-read",
    title: "SQLite : CREATE et READ",
    description: "Insérer et lire des données",
    lessons: [
      lesson({
        id: "py-sqlite-insert-select",
        title: "INSERT et SELECT : écrire et lire",
        minutes: 28,
        summary:
          "INSERT ajoute des lignes. ? pour paramètres sécurisés (évite injection SQL). SELECT lit les données. fetchone() = 1 ligne, fetchall() = toutes, fetchmany(n) = n lignes.",
        sections: [
          section(
            "INSERT : ajouter des données",
            "INSERT INTO table VALUES insère une ligne. Utilise toujours ? pour les paramètres (sécurité).",
            [
              "execute() : une ligne",
              "executemany() : plusieurs lignes",
              "❌ Jamais de f-string avec SQL (injection !)",
              "✅ Toujours ? avec tuple de valeurs",
            ],
          ),
          section(
            "SELECT : lire des données",
            "SELECT récupère les données. fetchone/all/many récupèrent les résultats du curseur.",
            [
              "fetchone() : première ligne (ou None)",
              "fetchall() : toutes les lignes (liste)",
              "fetchmany(n) : n premières lignes",
              "WHERE filtre les résultats",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `import sqlite3

connexion = sqlite3.connect("etudiants.db")
curseur = connexion.cursor()

# Créer table
curseur.execute("""
    CREATE TABLE IF NOT EXISTS etudiants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        age INTEGER,
        filiere TEXT
    )
""")

# INSERT une ligne
curseur.execute("""
    INSERT INTO etudiants (nom, age, filiere)
    VALUES (?, ?, ?)
""", ("Tiana", 20, "Informatique"))

# INSERT plusieurs lignes
etudiants = [
    ("Soa", 19, "Gestion"),
    ("Kanto", 21, "Informatique"),
    ("Miora", 20, "Mathématiques")
]
curseur.executemany("""
    INSERT INTO etudiants (nom, age, filiere)
    VALUES (?, ?, ?)
""", etudiants)

connexion.commit()
print("✅ Données insérées\\n")

# SELECT tous
print("=== Tous les étudiants ===")
curseur.execute("SELECT * FROM etudiants")
tous = curseur.fetchall()
for etudiant in tous:
    print(etudiant)

# SELECT avec WHERE
print("\\n=== Étudiants en Info ===")
curseur.execute("""
    SELECT nom, age FROM etudiants
    WHERE filiere = ?
""", ("Informatique",))
info = curseur.fetchall()
for nom, age in info:
    print(f"{nom}, {age} ans")

connexion.close()`,
        ),
        task: "Crée table produits, insère 5 produits, affiche ceux dont prix > 1000.",
        takeaway:
          "INSERT ajoute, SELECT lit. Toujours utiliser ? pour les paramètres.",
        quiz: quiz(
          "Pourquoi utiliser ? plutôt que f-string ?",
          ["Plus rapide", "Sécurité (évite injection SQL)", "Obligatoire"],
          1,
          "? évite l'injection SQL en séparant code et données.",
        ),
        link: "https://docs.python.org/3/library/sqlite3.html#sqlite3-tutorial",
      }),
    ],
  },
  {
    id: "py-sqlite-update-delete",
    title: "SQLite : UPDATE et DELETE",
    description: "Modifier et supprimer des données",
    lessons: [
      lesson({
        id: "py-sqlite-update-delete",
        title: "UPDATE et DELETE : modifier et supprimer",
        minutes: 25,
        summary:
          "UPDATE modifie des lignes existantes. DELETE supprime des lignes. WHERE indispensable sinon toutes les lignes sont affectées ! rowcount indique le nombre de lignes modifiées.",
        sections: [
          section(
            "UPDATE : modifier",
            "UPDATE table SET colonne = valeur WHERE condition. WHERE crucial pour ne modifier que certaines lignes.",
            [
              "SET définit les nouvelles valeurs",
              "WHERE filtre les lignes à modifier",
              "❌ Sans WHERE = toutes les lignes modifiées !",
              "rowcount = nombre de lignes modifiées",
            ],
          ),
          section(
            "DELETE : supprimer",
            "DELETE FROM table WHERE condition. Encore plus dangereux sans WHERE !",
            [
              "WHERE sélectionne les lignes à supprimer",
              "❌ Sans WHERE = table vidée !",
              "Toujours vérifier avec SELECT avant DELETE",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `import sqlite3

connexion = sqlite3.connect("etudiants.db")
curseur = connexion.cursor()

# Données initiales
curseur.execute("""
    CREATE TABLE IF NOT EXISTS etudiants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT, age INTEGER, filiere TEXT
    )
""")
curseur.executemany("INSERT INTO etudiants VALUES (NULL, ?, ?, ?)", [
    ("Tiana", 20, "Info"),
    ("Soa", 19, "Gestion"),
    ("Kanto", 21, "Info")
])
connexion.commit()

print("=== Avant modifications ===")
curseur.execute("SELECT * FROM etudiants")
for row in curseur.fetchall():
    print(row)

# UPDATE
print("\\n📝 UPDATE : Tiana a 21 ans")
curseur.execute("""
    UPDATE etudiants
    SET age = ?
    WHERE nom = ?
""", (21, "Tiana"))
print(f"✅ {curseur.rowcount} ligne(s) modifiée(s)")

# UPDATE multiple
print("\\n📝 UPDATE : +1 an pour étudiants Info")
curseur.execute("""
    UPDATE etudiants
    SET age = age + 1
    WHERE filiere = ?
""", ("Info",))
print(f"✅ {curseur.rowcount} ligne(s) modifiée(s)")

connexion.commit()

# DELETE
print("\\n🗑️  DELETE : supprimer Soa")
curseur.execute("DELETE FROM etudiants WHERE nom = ?", ("Soa",))
print(f"✅ {curseur.rowcount} ligne(s) supprimée(s)")

connexion.commit()

print("\\n=== Après modifications ===")
curseur.execute("SELECT * FROM etudiants")
for row in curseur.fetchall():
    print(row)

connexion.close()`,
        ),
        task: "Table produits : augmente prix de 10% pour catégorie 'électronique', supprime stock=0.",
        takeaway:
          "UPDATE modifie, DELETE supprime. WHERE obligatoire pour cibler !",
        quiz: quiz(
          "Que fait DELETE FROM produits sans WHERE ?",
          ["Rien", "Supprime table", "Vide toute la table"],
          2,
          "Sans WHERE, DELETE supprime TOUTES les lignes !",
        ),
        link: "https://docs.python.org/3/library/sqlite3.html",
      }),
    ],
  },
  {
    id: "py-sqlite-pratique",
    title: "SQLite pratique",
    description: "Classe complète avec CRUD",
    lessons: [
      lesson({
        id: "py-sqlite-classe-crud",
        title: "Classe GestionEtudiants : CRUD complet",
        minutes: 35,
        summary:
          "Intégration POO + SQLite. Une classe encapsule toutes les opérations BD. Context manager (with) ferme automatiquement. Méthodes CRUD : create, read, update, delete.",
        sections: [
          section(
            "Architecture",
            "La classe gère connexion et opérations. __init__ initialise la BD, __enter__/__exit__ permettent with.",
            [
              "__init__ : créer BD et table",
              "__enter__ : ouvrir connexion (with)",
              "__exit__ : fermer connexion automatiquement",
              "Méthodes CRUD séparées et claires",
            ],
          ),
          section(
            "Bonnes pratiques",
            "Context manager garantit la fermeture. Méthodes documentées. Gestion d'erreurs avec try/except.",
            [
              "with assure la fermeture",
              "Docstrings pour chaque méthode",
              "Validation des données",
              "Messages d'erreur clairs",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `import sqlite3

class GestionEtudiants:
    def __init__(self, nom_bd="etudiants.db"):
        """Initialise la connexion et crée la table"""
        self.nom_bd = nom_bd
        self.connexion = None
        self.curseur = None
        self._creer_table()
    
    def _creer_table(self):
        """Crée la table si elle n'existe pas"""
        with sqlite3.connect(self.nom_bd) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS etudiants (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nom TEXT NOT NULL,
                    age INTEGER,
                    filiere TEXT
                )
            """)
    
    def __enter__(self):
        """Ouvre la connexion pour with"""
        self.connexion = sqlite3.connect(self.nom_bd)
        self.curseur = self.connexion.cursor()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Ferme la connexion automatiquement"""
        if self.connexion:
            self.connexion.commit()
            self.connexion.close()
    
    def ajouter(self, nom, age, filiere):
        """CREATE : ajoute un étudiant"""
        with self as db:
            db.curseur.execute("""
                INSERT INTO etudiants (nom, age, filiere)
                VALUES (?, ?, ?)
            """, (nom, age, filiere))
            print(f"✅ {nom} ajouté(e)")
    
    def lister(self, filiere=None):
        """READ : liste tous ou filtre par filière"""
        with self as db:
            if filiere:
                db.curseur.execute(
                    "SELECT * FROM etudiants WHERE filiere = ?",
                    (filiere,)
                )
            else:
                db.curseur.execute("SELECT * FROM etudiants")
            return db.curseur.fetchall()
    
    def modifier(self, id_etudiant, **kwargs):
        """UPDATE : modifie un étudiant"""
        with self as db:
            for cle, valeur in kwargs.items():
                db.curseur.execute(f"""
                    UPDATE etudiants
                    SET {cle} = ?
                    WHERE id = ?
                """, (valeur, id_etudiant))
            print(f"✅ Étudiant {id_etudiant} modifié")
    
    def supprimer(self, id_etudiant):
        """DELETE : supprime un étudiant"""
        with self as db:
            db.curseur.execute(
                "DELETE FROM etudiants WHERE id = ?",
                (id_etudiant,)
            )
            print(f"✅ Étudiant {id_etudiant} supprimé")

# Utilisation
print("=== CRUD avec classe ===\\n")

gestion = GestionEtudiants()

# CREATE
gestion.ajouter("Tiana", 20, "Informatique")
gestion.ajouter("Soa", 19, "Gestion")
gestion.ajouter("Kanto", 21, "Informatique")

# READ
print("\\nTous les étudiants:")
for etudiant in gestion.lister():
    print(f"  {etudiant}")

print("\\nÉtudiants en Info:")
for etudiant in gestion.lister("Informatique"):
    print(f"  {etudiant}")

# UPDATE
gestion.modifier(1, age=21, filiere="Data Science")

# DELETE
gestion.supprimer(2)

print("\\nAprès modifications:")
for etudiant in gestion.lister():
    print(f"  {etudiant}")`,
        ),
        task: "Crée classe GestionProduits avec CRUD complet (nom, prix, stock, categorie).",
        takeaway:
          "POO + SQLite = code organisé, réutilisable et maintenable.",
        quiz: quiz(
          "__enter__ et __exit__ permettent :",
          ["Héritage", "Utilisation avec with", "Polymorphisme"],
          1,
          "__enter__/__exit__ rendent la classe utilisable avec with.",
        ),
        link: "https://docs.python.org/3/library/sqlite3.html",
      }),
    ],
  },
  {
    id: "py-exercice-final-intermediaire",
    title: "🎯 Exercice Final Intermédiaire",
    description: "Projet POO + SQLite complet",
    lessons: [
      lesson({
        id: "py-projet-intermediaire",
        title: "Système de gestion de bibliothèque",
        minutes: 60,
        summary:
          "Crée un système complet avec 2 classes (Livre, Bibliotheque), SQLite CRUD, menu interactif, gestion d'erreurs, fichiers d'export.",
        sections: [
          section(
            "Architecture requise",
            "2 classes avec héritage ou composition. BD SQLite avec 1-2 tables. Menu avec toutes les opérations CRUD.",
            [
              "Classe Livre : attributs (titre, auteur, annee, disponible)",
              "Classe Bibliotheque : gère BD + opérations CRUD",
              "BD SQLite : table livres",
              "Menu : ajout, liste, recherche, emprunter, retourner, supprimer",
            ],
          ),
          section(
            "Fonctionnalités avancées",
            "Recherche multi-critères. Export fichier texte. Statistiques. Validation des données.",
            [
              "Recherche : par titre, auteur ou année",
              "Export : liste complète dans fichier texte",
              "Stats : nombre total, disponibles, empruntés",
              "Validation : pas de doublon, données valides",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# 🎯 PROJET FINAL INTERMÉDIAIRE - À compléter
import sqlite3

class Livre:
    """Représente un livre"""
    def __init__(self, id_livre, titre, auteur, annee, disponible=True):
        # TODO: Initialiser attributs
        pass
    
    def __str__(self):
        """Affichage formaté"""
        # TODO: Retourner string formatée
        pass

class Bibliotheque:
    """Gère la collection de livres avec SQLite"""
    
    def __init__(self, nom_bd="bibliotheque.db"):
        """Crée BD et table"""
        # TODO: Connexion et création table
        pass
    
    def ajouter_livre(self, titre, auteur, annee):
        """CREATE : ajoute un livre"""
        # TODO: INSERT avec validation (pas de doublon)
        pass
    
    def lister_livres(self, disponible_seulement=False):
        """READ : liste tous les livres"""
        # TODO: SELECT avec filtre optionnel
        pass
    
    def rechercher(self, critere, valeur):
        """READ : recherche par titre/auteur/année"""
        # TODO: SELECT avec WHERE dynamique
        pass
    
    def emprunter(self, id_livre):
        """UPDATE : marque livre comme emprunté"""
        # TODO: UPDATE disponible = False
        pass
    
    def retourner(self, id_livre):
        """UPDATE : marque livre comme disponible"""
        # TODO: UPDATE disponible = True
        pass
    
    def supprimer_livre(self, id_livre):
        """DELETE : supprime un livre"""
        # TODO: DELETE avec confirmation
        pass
    
    def statistiques(self):
        """Affiche stats de la bibliothèque"""
        # TODO: COUNT pour total, disponibles, empruntés
        pass
    
    def exporter_texte(self, fichier="bibliotheque.txt"):
        """Exporte la liste dans un fichier"""
        # TODO: Écrire tous les livres dans fichier texte
        pass

def menu():
    """Menu interactif"""
    biblio = Bibliotheque()
    
    while True:
        print("\\n=== BIBLIOTHÈQUE ===")
        print("1. Ajouter livre")
        print("2. Lister tous")
        print("3. Livres disponibles")
        print("4. Rechercher")
        print("5. Emprunter")
        print("6. Retourner")
        print("7. Supprimer")
        print("8. Statistiques")
        print("9. Exporter")
        print("0. Quitter")
        
        # TODO: Implémenter menu avec match/case ou if/elif
        break  # Retirer ce break

if __name__ == "__main__":
    menu()`,
        ),
        task: "Complète toutes les méthodes pour créer un système de bibliothèque fonctionnel.",
        takeaway:
          "Tu maîtrises POO + SQLite + fichiers pour créer des applications complètes !",
        quiz: quiz(
          "Quels concepts sont utilisés ?",
          ["Seulement POO", "POO + SQLite + Fichiers + Gestion erreurs", "Seulement SQLite"],
          1,
          "Ce projet combine tous les concepts du niveau intermédiaire.",
        ),
        link: docs,
      }),
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🔴 NIVEAU AVANCÉ - Interfaces graphiques et API backend
// ═══════════════════════════════════════════════════════════════════════════

const advanced: WebLevel["chapters"] = [
  {
    id: "py-gui-intro",
    title: "Interfaces graphiques avec Tkinter",
    description: "Créer des fenêtres et widgets",
    lessons: [
      lesson({
        id: "py-tkinter-bases",
        title: "Tkinter : première fenêtre et widgets",
        minutes: 30,
        summary:
          "Tkinter est inclus avec Python. Tk() crée la fenêtre principale. mainloop() lance l'interface. Widgets: Label (texte), Button (bouton), Entry (saisie).",
        sections: [
          section(
            "Structure de base",
            "Toute application Tkinter suit ce schéma : import, fenêtre, widgets, mainloop.",
            [
              "tk.Tk() : fenêtre principale",
              "title() : titre de fenêtre",
              "geometry() : taille (largeurxhauteur)",
              "mainloop() : boucle d'événements (obligatoire)",
            ],
          ),
          section(
            "Widgets essentiels",
            "Les widgets sont les éléments d'interface. pack() ou grid() les positionne.",
            [
              "Label : afficher texte/image",
              "Button : bouton cliquable (command=fonction)",
              "Entry : champ de saisie",
              "pack() : positionnement automatique",
              "grid() : positionnement en grille",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `import tkinter as tk
from tkinter import messagebox

# Fenêtre principale
fenetre = tk.Tk()
fenetre.title("Ma première application")
fenetre.geometry("400x300")

# Label
label_titre = tk.Label(
    fenetre,
    text="Bienvenue dans DevAfrica !",
    font=("Arial", 16, "bold"),
    fg="blue"
)
label_titre.pack(pady=20)

# Entry
label_nom = tk.Label(fenetre, text="Ton nom :")
label_nom.pack()

entry_nom = tk.Entry(fenetre, width=30)
entry_nom.pack(pady=10)

# Fonction callback
def saluer():
    nom = entry_nom.get()
    if nom:
        messagebox.showinfo("Salutation", f"Bonjour {nom} !")
    else:
        messagebox.showwarning("Attention", "Entre ton nom !")

# Button
bouton = tk.Button(
    fenetre,
    text="Saluer",
    command=saluer,
    bg="green",
    fg="white",
    font=("Arial", 12)
)
bouton.pack(pady=10)

# Lancement
fenetre.mainloop()`,
        ),
        task: "Crée une fenêtre avec Entry pour âge et Button qui affiche si majeur/mineur.",
        takeaway:
          "Tkinter : Tk() + widgets + mainloop(). command= lie bouton à fonction.",
        quiz: quiz(
          "mainloop() fait quoi ?",
          ["Crée fenêtre", "Lance boucle d'événements", "Ferme fenêtre"],
          1,
          "mainloop() lance la boucle qui gère les événements utilisateur.",
        ),
        link: "https://docs.python.org/3/library/tkinter.html",
      }),
      lesson({
        id: "py-tkinter-layout",
        title: "Layout : grid() pour organiser",
        minutes: 28,
        summary:
          "grid() positionne les widgets en grille (lignes/colonnes). row= ligne, column= colonne, sticky= alignement, padx/pady= espacement.",
        sections: [
          section(
            "Système de grille",
            "grid() divise la fenêtre en grille. Chaque widget occupe une case (ou plusieurs).",
            [
              "row= : numéro de ligne (0, 1, 2...)",
              "column= : numéro de colonne (0, 1, 2...)",
              "columnspan= : occuper plusieurs colonnes",
              "sticky= : alignement (N, S, E, W, ou combiné)",
            ],
          ),
          section(
            "Espacement et alignement",
            "padx/pady ajoutent des marges. sticky colle le widget aux bords de sa case.",
            [
              "padx/pady : marges externes",
              "ipadx/ipady : marges internes",
              "sticky='ew' : étirer horizontalement",
              "sticky='nsew' : remplir toute la case",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `import tkinter as tk
from tkinter import messagebox

fenetre = tk.Tk()
fenetre.title("Calculatrice simple")
fenetre.geometry("300x200")

# Titre sur toute la largeur
tk.Label(
    fenetre,
    text="Calculatrice",
    font=("Arial", 14, "bold")
).grid(row=0, column=0, columnspan=3, pady=10)

# Première ligne : Nombre 1
tk.Label(fenetre, text="Nombre 1 :").grid(row=1, column=0, sticky="e", padx=5)
entry1 = tk.Entry(fenetre, width=15)
entry1.grid(row=1, column=1, columnspan=2, padx=5, pady=5)

# Deuxième ligne : Nombre 2
tk.Label(fenetre, text="Nombre 2 :").grid(row=2, column=0, sticky="e", padx=5)
entry2 = tk.Entry(fenetre, width=15)
entry2.grid(row=2, column=1, columnspan=2, padx=5, pady=5)

# Troisième ligne : Résultat
tk.Label(fenetre, text="Résultat :").grid(row=3, column=0, sticky="e", padx=5)
label_resultat = tk.Label(fenetre, text="0", font=("Arial", 12, "bold"))
label_resultat.grid(row=3, column=1, columnspan=2, pady=5)

# Fonctions calcul
def calculer(operation):
    try:
        a = float(entry1.get())
        b = float(entry2.get())
        
        if operation == "+":
            resultat = a + b
        elif operation == "-":
            resultat = a - b
        elif operation == "*":
            resultat = a * b
        elif operation == "/":
            resultat = a / b if b != 0 else "Erreur"
        
        label_resultat.config(text=str(resultat))
    except ValueError:
        messagebox.showerror("Erreur", "Nombres invalides !")

# Boutons opérations (ligne 4)
tk.Button(fenetre, text="+", command=lambda: calculer("+"), width=5).grid(row=4, column=0, padx=2, pady=10)
tk.Button(fenetre, text="-", command=lambda: calculer("-"), width=5).grid(row=4, column=1, padx=2, pady=10)
tk.Button(fenetre, text="*", command=lambda: calculer("*"), width=5).grid(row=4, column=2, padx=2, pady=10)

# Bouton division (ligne 5)
tk.Button(fenetre, text="/", command=lambda: calculer("/"), width=5).grid(row=5, column=0, columnspan=3, pady=5)

fenetre.mainloop()`,
        ),
        task: "Crée formulaire d'inscription (nom, email, âge) avec grid() et bouton validation.",
        takeaway:
          "grid() organise en grille. row/column positionnent, sticky aligne.",
        quiz: quiz(
          "sticky='ew' fait quoi ?",
          ["Colle en haut", "Étire horizontalement", "Centre le widget"],
          1,
          "sticky='ew' (East-West) étire le widget horizontalement.",
        ),
        link: "https://docs.python.org/3/library/tkinter.html#the-grid-geometry-manager",
      }),
    ],
  },
  {
    id: "py-gui-avancee",
    title: "GUI avancée",
    description: "Widgets complexes et intégration BD",
    lessons: [
      lesson({
        id: "py-tkinter-widgets",
        title: "Listbox, Text et Combobox",
        minutes: 30,
        summary:
          "Listbox affiche une liste sélectionnable. Text pour texte multiligne. Combobox (ttk) pour liste déroulante. get(), insert(), delete() manipulent le contenu.",
        sections: [
          section(
            "Listbox",
            "Affiche et permet sélection dans une liste. curselection() retourne l'index sélectionné.",
            [
              "insert(index, texte) : ajouter élément",
              "delete(index) : supprimer",
              "get(index) : lire élément",
              "curselection() : index sélectionné",
            ],
          ),
          section(
            "Text et Combobox",
            "Text pour paragraphes. Combobox (ttk) pour menus déroulants avec valeurs prédéfinies.",
            [
              "Text : insert('end', texte), get('1.0', 'end')",
              "Combobox : values=[...], current(index)",
              "Scrollbar pour listes/textes longs",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `import tkinter as tk
from tkinter import ttk, messagebox

fenetre = tk.Tk()
fenetre.title("Gestionnaire de tâches")
fenetre.geometry("500x400")

# Frame principale
frame_ajout = tk.Frame(fenetre)
frame_ajout.pack(pady=10, fill="x", padx=10)

# Saisie tâche
tk.Label(frame_ajout, text="Tâche :").pack(side="left", padx=5)
entry_tache = tk.Entry(frame_ajout, width=30)
entry_tache.pack(side="left", padx=5)

# Priorité (Combobox)
tk.Label(frame_ajout, text="Priorité :").pack(side="left", padx=5)
combo_priorite = ttk.Combobox(
    frame_ajout,
    values=["Basse", "Moyenne", "Haute"],
    state="readonly",
    width=10
)
combo_priorite.current(1)  # Moyenne par défaut
combo_priorite.pack(side="left", padx=5)

# Listbox avec Scrollbar
frame_liste = tk.Frame(fenetre)
frame_liste.pack(pady=10, fill="both", expand=True, padx=10)

scrollbar = tk.Scrollbar(frame_liste)
scrollbar.pack(side="right", fill="y")

listbox_taches = tk.Listbox(frame_liste, yscrollcommand=scrollbar.set, font=("Arial", 10))
listbox_taches.pack(side="left", fill="both", expand=True)
scrollbar.config(command=listbox_taches.yview)

# Fonctions
def ajouter_tache():
    tache = entry_tache.get().strip()
    if tache:
        priorite = combo_priorite.get()
        listbox_taches.insert("end", f"[{priorite}] {tache}")
        entry_tache.delete(0, "end")
    else:
        messagebox.showwarning("Attention", "Entre une tâche !")

def supprimer_tache():
    selection = listbox_taches.curselection()
    if selection:
        listbox_taches.delete(selection[0])
    else:
        messagebox.showinfo("Info", "Sélectionne une tâche !")

def afficher_details():
    selection = listbox_taches.curselection()
    if selection:
        tache = listbox_taches.get(selection[0])
        messagebox.showinfo("Détails", tache)

# Boutons
frame_boutons = tk.Frame(fenetre)
frame_boutons.pack(pady=10)

tk.Button(frame_boutons, text="Ajouter", command=ajouter_tache, bg="green", fg="white").pack(side="left", padx=5)
tk.Button(frame_boutons, text="Supprimer", command=supprimer_tache, bg="red", fg="white").pack(side="left", padx=5)
tk.Button(frame_boutons, text="Détails", command=afficher_details, bg="blue", fg="white").pack(side="left", padx=5)

fenetre.mainloop()`,
        ),
        task: "Ajoute un widget Text pour notes et bouton 'Sauvegarder notes' (fichier texte).",
        takeaway:
          "Listbox = liste, Text = multiligne, Combobox = menu déroulant.",
        quiz: quiz(
          "curselection() retourne :",
          ["Le texte sélectionné", "L'index de la sélection", "Rien"],
          1,
          "curselection() retourne le tuple des indices sélectionnés.",
        ),
        link: "https://docs.python.org/3/library/tkinter.html",
      }),
      lesson({
        id: "py-gui-sqlite",
        title: "Intégration Tkinter + SQLite",
        minutes: 35,
        summary:
          "Combiner GUI et BD pour applications complètes. Les callbacks de boutons appellent des méthodes CRUD. Rafraîchir l'interface après modifications BD.",
        sections: [
          section(
            "Architecture",
            "Classe BD séparée pour logique. GUI appelle les méthodes BD dans callbacks. Fonction refresh() recharge l'affichage.",
            [
              "Séparer logique BD et interface",
              "Callbacks → méthodes CRUD",
              "refresh() après chaque modification",
              "Gestion erreurs avec messagebox",
            ],
          ),
          section(
            "Pattern MVC simplifié",
            "Model (BD), View (Tkinter), Controller (callbacks). Chaque couche a sa responsabilité.",
            [
              "Model : GestionBD (CRUD)",
              "View : Widgets Tkinter",
              "Controller : Fonctions callbacks",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `import tkinter as tk
from tkinter import ttk, messagebox
import sqlite3

# MODEL
class GestionContacts:
    def __init__(self):
        self.conn = sqlite3.connect("contacts.db")
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                telephone TEXT,
                email TEXT
            )
        """)
    
    def ajouter(self, nom, tel, email):
        self.conn.execute(
            "INSERT INTO contacts (nom, telephone, email) VALUES (?, ?, ?)",
            (nom, tel, email)
        )
        self.conn.commit()
    
    def lister(self):
        return self.conn.execute("SELECT * FROM contacts ORDER BY nom").fetchall()
    
    def supprimer(self, id_contact):
        self.conn.execute("DELETE FROM contacts WHERE id = ?", (id_contact,))
        self.conn.commit()

# VIEW + CONTROLLER
class AppContacts:
    def __init__(self):
        self.bd = GestionContacts()
        self.fenetre = tk.Tk()
        self.fenetre.title("Gestionnaire de contacts")
        self.fenetre.geometry("600x400")
        
        self.creer_interface()
        self.rafraichir_liste()
    
    def creer_interface(self):
        # Frame formulaire
        frame_form = tk.Frame(self.fenetre)
        frame_form.pack(pady=10, fill="x", padx=10)
        
        tk.Label(frame_form, text="Nom :").grid(row=0, column=0, sticky="e", padx=5)
        self.entry_nom = tk.Entry(frame_form, width=20)
        self.entry_nom.grid(row=0, column=1, padx=5, pady=5)
        
        tk.Label(frame_form, text="Tél :").grid(row=0, column=2, sticky="e", padx=5)
        self.entry_tel = tk.Entry(frame_form, width=15)
        self.entry_tel.grid(row=0, column=3, padx=5, pady=5)
        
        tk.Label(frame_form, text="Email :").grid(row=1, column=0, sticky="e", padx=5)
        self.entry_email = tk.Entry(frame_form, width=37)
        self.entry_email.grid(row=1, column=1, columnspan=3, padx=5, pady=5, sticky="ew")
        
        tk.Button(
            frame_form,
            text="Ajouter Contact",
            command=self.ajouter_contact,
            bg="green",
            fg="white"
        ).grid(row=2, column=0, columnspan=4, pady=10)
        
        # Treeview (tableau)
        frame_tree = tk.Frame(self.fenetre)
        frame_tree.pack(pady=10, fill="both", expand=True, padx=10)
        
        scrollbar = tk.Scrollbar(frame_tree)
        scrollbar.pack(side="right", fill="y")
        
        self.tree = ttk.Treeview(
            frame_tree,
            columns=("ID", "Nom", "Téléphone", "Email"),
            show="headings",
            yscrollcommand=scrollbar.set
        )
        scrollbar.config(command=self.tree.yview)
        
        self.tree.heading("ID", text="ID")
        self.tree.heading("Nom", text="Nom")
        self.tree.heading("Téléphone", text="Téléphone")
        self.tree.heading("Email", text="Email")
        
        self.tree.column("ID", width=50)
        self.tree.column("Nom", width=150)
        self.tree.column("Téléphone", width=120)
        self.tree.column("Email", width=200)
        
        self.tree.pack(fill="both", expand=True)
        
        # Bouton suppression
        tk.Button(
            self.fenetre,
            text="Supprimer sélection",
            command=self.supprimer_contact,
            bg="red",
            fg="white"
        ).pack(pady=10)
    
    def rafraichir_liste(self):
        # Vider le tableau
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        # Recharger depuis BD
        for contact in self.bd.lister():
            self.tree.insert("", "end", values=contact)
    
    def ajouter_contact(self):
        nom = self.entry_nom.get().strip()
        tel = self.entry_tel.get().strip()
        email = self.entry_email.get().strip()
        
        if nom:
            self.bd.ajouter(nom, tel, email)
            self.entry_nom.delete(0, "end")
            self.entry_tel.delete(0, "end")
            self.entry_email.delete(0, "end")
            self.rafraichir_liste()
            messagebox.showinfo("Succès", f"Contact {nom} ajouté !")
        else:
            messagebox.showwarning("Attention", "Le nom est obligatoire !")
    
    def supprimer_contact(self):
        selection = self.tree.selection()
        if selection:
            item = self.tree.item(selection[0])
            id_contact = item["values"][0]
            nom = item["values"][1]
            
            if messagebox.askyesno("Confirmation", f"Supprimer {nom} ?"):
                self.bd.supprimer(id_contact)
                self.rafraichir_liste()
                messagebox.showinfo("Succès", "Contact supprimé !")
        else:
            messagebox.showinfo("Info", "Sélectionne un contact !")
    
    def lancer(self):
        self.fenetre.mainloop()

# Lancement
if __name__ == "__main__":
    app = AppContacts()
    app.lancer()`,
        ),
        task: "Ajoute fonction 'Modifier' : sélection remplit formulaire, modification en BD.",
        takeaway:
          "GUI + SQLite = applications complètes. Séparer logique BD et interface.",
        quiz: quiz(
          "Pourquoi rafraîchir après ajout ?",
          ["Obligatoire", "Pour afficher les nouvelles données", "Pour fermer BD"],
          1,
          "refresh() recharge l'interface avec les dernières données BD.",
        ),
        link: "https://docs.python.org/3/library/tkinter.ttk.html#treeview",
      }),
    ],
  },
  {
    id: "py-api-backend",
    title: "API Backend",
    description: "Créer des API REST avec Flask",
    lessons: [
      lesson({
        id: "py-flask-intro",
        title: "Flask : créer une API REST",
        minutes: 30,
        summary:
          "Flask est un micro-framework web. @app.route() définit les endpoints. request.json récupère les données. jsonify() renvoie du JSON. SQLite persiste les données.",
        sections: [
          section(
            "Installation et structure",
            "Flask crée des serveurs web en quelques lignes. pip install flask pour installer.",
            [
              "app = Flask(__name__) : initialise",
              "@app.route('/chemin', methods=['GET', 'POST']) : endpoint",
              "app.run(debug=True) : lance serveur",
              "Port 5000 par défaut",
            ],
          ),
          section(
            "Méthodes HTTP",
            "GET = lire, POST = créer, PUT = modifier, DELETE = supprimer. request.json contient les données POST/PUT.",
            [
              "GET : récupérer données",
              "POST : créer ressource",
              "PUT : modifier ressource",
              "DELETE : supprimer ressource",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# Installation : pip install flask
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DB = "taches.db"

# Initialiser BD
def init_db():
    conn = sqlite3.connect(DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS taches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            complete INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

init_db()

# GET : Liste toutes les tâches
@app.route('/taches', methods=['GET'])
def get_taches():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    taches = conn.execute("SELECT * FROM taches").fetchall()
    conn.close()
    
    return jsonify([dict(t) for t in taches])

# GET : Une tâche par ID
@app.route('/taches/<int:id>', methods=['GET'])
def get_tache(id):
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    tache = conn.execute("SELECT * FROM taches WHERE id = ?", (id,)).fetchone()
    conn.close()
    
    if tache:
        return jsonify(dict(tache))
    return jsonify({"erreur": "Tâche introuvable"}), 404

# POST : Créer une tâche
@app.route('/taches', methods=['POST'])
def create_tache():
    data = request.json
    titre = data.get('titre')
    
    if not titre:
        return jsonify({"erreur": "Titre obligatoire"}), 400
    
    conn = sqlite3.connect(DB)
    cursor = conn.execute(
        "INSERT INTO taches (titre) VALUES (?)",
        (titre,)
    )
    conn.commit()
    id_nouvelle = cursor.lastrowid
    conn.close()
    
    return jsonify({"id": id_nouvelle, "titre": titre, "complete": 0}), 201

# PUT : Modifier une tâche
@app.route('/taches/<int:id>', methods=['PUT'])
def update_tache(id):
    data = request.json
    complete = data.get('complete', 0)
    
    conn = sqlite3.connect(DB)
    conn.execute(
        "UPDATE taches SET complete = ? WHERE id = ?",
        (complete, id)
    )
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Tâche mise à jour"})

# DELETE : Supprimer une tâche
@app.route('/taches/<int:id>', methods=['DELETE'])
def delete_tache(id):
    conn = sqlite3.connect(DB)
    conn.execute("DELETE FROM taches WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Tâche supprimée"})

if __name__ == '__main__':
    print("🚀 API lancée sur http://localhost:5000")
    print("📖 Endpoints :")
    print("  GET    /taches       - Liste")
    print("  GET    /taches/<id>  - Détails")
    print("  POST   /taches       - Créer")
    print("  PUT    /taches/<id>  - Modifier")
    print("  DELETE /taches/<id>  - Supprimer")
    app.run(debug=True)`,
        ),
        task: "Teste l'API avec un client HTTP (Postman, curl, ou navigateur pour GET).",
        takeaway:
          "Flask + SQLite = API REST complète en quelques lignes.",
        quiz: quiz(
          "POST /taches fait quoi ?",
          ["Lit tâches", "Crée nouvelle tâche", "Supprime tâche"],
          1,
          "POST crée une nouvelle ressource.",
        ),
        link: "https://flask.palletsprojects.com/",
      }),
      lesson({
        id: "py-flask-auth",
        title: "Authentification et sécurité",
        minutes: 28,
        summary:
          "Validation des données avec try/except. Headers HTTP pour tokens. Hachage de mots de passe avec hashlib. CORS pour autoriser clients web.",
        sections: [
          section(
            "Validation et erreurs",
            "Toujours valider les données entrantes. Retourner codes HTTP appropriés.",
            [
              "400 Bad Request : données invalides",
              "404 Not Found : ressource introuvable",
              "201 Created : création réussie",
              "Valider tous les champs requis",
            ],
          ),
          section(
            "Sécurité de base",
            "Ne jamais stocker mots de passe en clair. Utiliser hashlib.sha256 ou mieux, bcrypt.",
            [
              "Hacher les mots de passe",
              "Utiliser tokens pour authentification",
              "CORS pour autoriser domaines",
              "HTTPS en production",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `from flask import Flask, request, jsonify
import sqlite3
import hashlib
import secrets

app = Flask(__name__)
DB = "users.db"

# Initialiser BD
def init_db():
    conn = sqlite3.connect(DB)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            token TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

def hash_password(password):
    """Hache le mot de passe"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token():
    """Génère un token aléatoire"""
    return secrets.token_hex(32)

# Inscription
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Validation
    if not username or not password:
        return jsonify({"erreur": "Username et password requis"}), 400
    
    if len(password) < 6:
        return jsonify({"erreur": "Password trop court (min 6)"}), 400
    
    # Hacher et sauvegarder
    try:
        conn = sqlite3.connect(DB)
        password_hash = hash_password(password)
        conn.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, password_hash)
        )
        conn.commit()
        conn.close()
        
        return jsonify({"message": f"Utilisateur {username} créé"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"erreur": "Username déjà pris"}), 400

# Connexion
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"erreur": "Identifiants requis"}), 400
    
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    user = conn.execute(
        "SELECT * FROM users WHERE username = ?",
        (username,)
    ).fetchone()
    
    if user and user['password_hash'] == hash_password(password):
        # Générer token
        token = generate_token()
        conn.execute(
            "UPDATE users SET token = ? WHERE id = ?",
            (token, user['id'])
        )
        conn.commit()
        conn.close()
        
        return jsonify({
            "message": "Connexion réussie",
            "token": token,
            "username": username
        })
    
    conn.close()
    return jsonify({"erreur": "Identifiants incorrects"}), 401

# Route protégée
@app.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({"erreur": "Token manquant"}), 401
    
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    user = conn.execute(
        "SELECT username FROM users WHERE token = ?",
        (token,)
    ).fetchone()
    conn.close()
    
    if user:
        return jsonify({"username": user['username']})
    
    return jsonify({"erreur": "Token invalide"}), 401

if __name__ == '__main__':
    print("🔐 API avec authentification")
    print("  POST /register - Inscription")
    print("  POST /login    - Connexion")
    print("  GET  /profile  - Profil (token requis)")
    app.run(debug=True)`,
        ),
        task: "Ajoute route /logout qui supprime le token de l'utilisateur.",
        takeaway:
          "Valider données, hacher passwords, utiliser tokens pour auth.",
        quiz: quiz(
          "Pourquoi hacher les passwords ?",
          ["Obligatoire", "Sécurité : illisibles si BD compromise", "Plus rapide"],
          1,
          "Le hachage rend les passwords illisibles même si la BD est volée.",
        ),
        link: "https://flask.palletsprojects.com/patterns/security/",
      }),
    ],
  },
  {
    id: "py-projet-final-avance-1",
    title: "🎯 Projet Avancé 1 : Application CRUD GUI",
    description: "Application graphique complète avec BD",
    lessons: [
      lesson({
        id: "py-projet-gestionnaire-produits",
        title: "Gestionnaire de Produits (GUI + SQLite)",
        minutes: 90,
        summary:
          "Application Tkinter complète : gestion de produits avec CRUD, recherche, filtres, statistiques, export CSV. Architecture MVC, validation données, gestion erreurs.",
        sections: [
          section(
            "Fonctionnalités requises",
            "Application professionnelle avec toutes les opérations CRUD et fonctionnalités avancées.",
            [
              "CRUD complet : Ajouter, Lister, Modifier, Supprimer",
              "Recherche multi-critères (nom, catégorie, prix)",
              "Filtres : par catégorie, stock faible, prix",
              "Statistiques : total produits, valeur stock, par catégorie",
              "Export CSV de l'inventaire complet",
            ],
          ),
          section(
            "Architecture et techniques",
            "Code organisé avec séparation des responsabilités. Interface professionnelle.",
            [
              "Classe BD séparée (Model)",
              "Classe GUI (View + Controller)",
              "Treeview pour tableau de données",
              "Validation complète des inputs",
              "Messagebox pour feedback utilisateur",
              "Export avec module csv",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# 🎯 PROJET AVANCÉ 1 - Structure de base fournie

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import sqlite3
import csv

# ═══════════════════ MODEL ═══════════════════
class GestionProduits:
    """Gère la base de données des produits"""
    
    def __init__(self, db="produits.db"):
        self.db = db
        self._creer_table()
    
    def _creer_table(self):
        """Crée la table produits si inexistante"""
        # TODO: Créer table avec colonnes:
        #   id, nom, categorie, prix, stock, description
        pass
    
    def ajouter(self, nom, categorie, prix, stock, description=""):
        """CREATE : Ajoute un produit"""
        # TODO: INSERT avec validation
        pass
    
    def lister(self, filtre=None):
        """READ : Liste tous les produits ou avec filtre"""
        # TODO: SELECT avec WHERE optionnel
        pass
    
    def rechercher(self, terme):
        """Recherche dans nom et catégorie"""
        # TODO: SELECT avec LIKE
        pass
    
    def modifier(self, id_produit, **kwargs):
        """UPDATE : Modifie un produit"""
        # TODO: UPDATE dynamique
        pass
    
    def supprimer(self, id_produit):
        """DELETE : Supprime un produit"""
        # TODO: DELETE avec confirmation
        pass
    
    def statistiques(self):
        """Retourne stats : total, valeur stock, par catégorie"""
        # TODO: SELECT avec COUNT, SUM, GROUP BY
        pass

# ═══════════════ VIEW + CONTROLLER ═══════════════
class AppGestionProduits:
    """Interface graphique de l'application"""
    
    def __init__(self):
        self.bd = GestionProduits()
        self.fenetre = tk.Tk()
        self.fenetre.title("📦 Gestionnaire de Produits")
        self.fenetre.geometry("900x600")
        
        self.creer_interface()
        self.rafraichir_tableau()
    
    def creer_interface(self):
        """Crée tous les widgets"""
        # TODO: 
        # 1. Frame formulaire (nom, catégorie, prix, stock, description)
        # 2. Boutons CRUD (Ajouter, Modifier, Supprimer)
        # 3. Frame recherche/filtres
        # 4. Treeview avec colonnes (ID, Nom, Catégorie, Prix, Stock)
        # 5. Frame statistiques en bas
        # 6. Menu : Fichier > Exporter CSV, Quitter
        pass
    
    def rafraichir_tableau(self, produits=None):
        """Recharge le Treeview avec les produits"""
        # TODO: Vider tree, recharger depuis BD ou liste fournie
        pass
    
    def ajouter_produit(self):
        """Callback : Ajouter un produit"""
        # TODO: Récupérer valeurs, valider, appeler BD, refresh
        pass
    
    def modifier_produit(self):
        """Callback : Modifier le produit sélectionné"""
        # TODO: Récupérer sélection, remplir formulaire, modifier BD
        pass
    
    def supprimer_produit(self):
        """Callback : Supprimer le produit sélectionné"""
        # TODO: Confirmation, supprimer BD, refresh
        pass
    
    def rechercher(self):
        """Callback : Rechercher produits"""
        # TODO: Appeler BD.rechercher(), afficher résultats
        pass
    
    def filtrer(self, filtre):
        """Applique un filtre (catégorie, stock faible)"""
        # TODO: Appeler BD.lister(filtre), afficher
        pass
    
    def afficher_stats(self):
        """Affiche statistiques dans un popup"""
        # TODO: Récupérer stats BD, messagebox ou Toplevel
        pass
    
    def exporter_csv(self):
        """Exporte l'inventaire en CSV"""
        # TODO: filedialog.asksaveasfilename(), csv.writer
        pass
    
    def lancer(self):
        """Lance l'application"""
        self.fenetre.mainloop()

# ═══════════════════ MAIN ═══════════════════
if __name__ == "__main__":
    app = AppGestionProduits()
    app.lancer()`,
        ),
        task: "Complète toutes les méthodes pour créer une application de gestion complète.",
        takeaway:
          "GUI + SQLite + CSV = application desktop professionnelle complète !",
        quiz: quiz(
          "Pourquoi séparer GestionProduits et AppGestionProduits ?",
          ["Obligatoire", "Séparer logique métier et interface (MVC)", "Plus rapide"],
          1,
          "La séparation Model-View-Controller facilite maintenance et tests.",
        ),
        link: docs,
      }),
    ],
  },
  {
    id: "py-projet-final-avance-2",
    title: "🎯 Projet Avancé 2 : API Backend Complète",
    description: "API REST avec authentification et relations",
    lessons: [
      lesson({
        id: "py-projet-api-blog",
        title: "API Blog (Flask + SQLite + Auth)",
        minutes: 90,
        summary:
          "API REST complète : utilisateurs, articles, commentaires. Authentification par token. Relations entre tables. CRUD complet. Tests avec Postman/curl.",
        sections: [
          section(
            "Architecture de l'API",
            "3 tables relationnelles. Authentification token. Endpoints RESTful pour chaque ressource.",
            [
              "Tables : users, articles, commentaires",
              "Relations : article→user (auteur), commentaire→article+user",
              "Auth : register, login, logout (token)",
              "CRUD : articles (protégé), commentaires (protégé)",
            ],
          ),
          section(
            "Endpoints à implémenter",
            "API complète avec authentification et gestion des relations.",
            [
              "POST /register, /login : authentification",
              "GET/POST /articles : lister, créer (token requis)",
              "GET/PUT/DELETE /articles/<id> : détails, modifier, supprimer",
              "GET/POST /articles/<id>/commentaires : lire, créer",
              "DELETE /commentaires/<id> : supprimer (auteur uniquement)",
            ],
          ),
        ],
        files: consoleFiles(
          "python",
          `# 🎯 PROJET AVANCÉ 2 - Structure de base

from flask import Flask, request, jsonify
import sqlite3
import hashlib
import secrets
from datetime import datetime

app = Flask(__name__)
DB = "blog.db"

# ═══════════════ INITIALISATION BD ═══════════════
def init_db():
    """Crée les 3 tables avec relations"""
    conn = sqlite3.connect(DB)
    
    # Table users
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            token TEXT,
            created_at TEXT
        )
    """)
    
    # TODO: Table articles
    # Colonnes : id, title, content, user_id (FK), created_at
    
    # TODO: Table commentaires  
    # Colonnes : id, content, article_id (FK), user_id (FK), created_at
    
    conn.commit()
    conn.close()

init_db()

# ═══════════════ HELPERS ═══════════════
def hash_password(password):
    # TODO: Hacher avec sha256
    pass

def generate_token():
    # TODO: Générer token aléatoire
    pass

def get_user_from_token(token):
    """Retourne l'utilisateur du token ou None"""
    # TODO: SELECT user WHERE token = ?
    pass

def require_auth(func):
    """Décorateur pour routes protégées"""
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"erreur": "Token manquant"}), 401
        
        user = get_user_from_token(token)
        if not user:
            return jsonify({"erreur": "Token invalide"}), 401
        
        return func(user, *args, **kwargs)
    
    wrapper.__name__ = func.__name__
    return wrapper

# ═══════════════ AUTH ENDPOINTS ═══════════════
@app.route('/register', methods=['POST'])
def register():
    """Inscription utilisateur"""
    # TODO: Valider, hacher password, INSERT
    pass

@app.route('/login', methods=['POST'])
def login():
    """Connexion : retourne token"""
    # TODO: Vérifier credentials, générer token, UPDATE
    pass

@app.route('/logout', methods=['POST'])
@require_auth
def logout(user):
    """Déconnexion : supprime token"""
    # TODO: UPDATE token = NULL
    pass

# ═══════════════ ARTICLES ENDPOINTS ═══════════════
@app.route('/articles', methods=['GET'])
def get_articles():
    """Liste tous les articles avec infos auteur"""
    # TODO: SELECT avec JOIN sur users
    pass

@app.route('/articles', methods=['POST'])
@require_auth
def create_article(user):
    """Créer un article (authentifié)"""
    # TODO: Récupérer title/content, INSERT avec user_id
    pass

@app.route('/articles/<int:id>', methods=['GET'])
def get_article(id):
    """Détails d'un article avec commentaires"""
    # TODO: SELECT article + JOIN commentaires
    pass

@app.route('/articles/<int:id>', methods=['PUT'])
@require_auth
def update_article(user, id):
    """Modifier article (auteur uniquement)"""
    # TODO: Vérifier user_id == auteur, UPDATE
    pass

@app.route('/articles/<int:id>', methods=['DELETE'])
@require_auth
def delete_article(user, id):
    """Supprimer article (auteur uniquement)"""
    # TODO: Vérifier auteur, DELETE article + commentaires
    pass

# ═══════════════ COMMENTAIRES ENDPOINTS ═══════════════
@app.route('/articles/<int:article_id>/commentaires', methods=['GET'])
def get_commentaires(article_id):
    """Liste commentaires d'un article"""
    # TODO: SELECT avec JOIN users
    pass

@app.route('/articles/<int:article_id>/commentaires', methods=['POST'])
@require_auth
def create_commentaire(user, article_id):
    """Ajouter commentaire (authentifié)"""
    # TODO: INSERT avec article_id et user_id
    pass

@app.route('/commentaires/<int:id>', methods=['DELETE'])
@require_auth
def delete_commentaire(user, id):
    """Supprimer commentaire (auteur uniquement)"""
    # TODO: Vérifier auteur, DELETE
    pass

# ═══════════════ MAIN ═══════════════
if __name__ == '__main__':
    print("🚀 API Blog lancée sur http://localhost:5000")
    print("\\n📖 Documentation :")
    print("  POST   /register")
    print("  POST   /login")
    print("  POST   /logout                     [AUTH]")
    print("  GET    /articles")
    print("  POST   /articles                   [AUTH]")
    print("  GET    /articles/<id>")
    print("  PUT    /articles/<id>              [AUTH, auteur]")
    print("  DELETE /articles/<id>              [AUTH, auteur]")
    print("  GET    /articles/<id>/commentaires")
    print("  POST   /articles/<id>/commentaires [AUTH]")
    print("  DELETE /commentaires/<id>          [AUTH, auteur]")
    app.run(debug=True)`,
        ),
        task: "Complète l'API et teste tous les endpoints avec Postman ou curl.",
        takeaway:
          "API REST complète avec auth, relations, validation = backend professionnel !",
        quiz: quiz(
          "Pourquoi @require_auth ?",
          ["Obligatoire", "Protège routes : vérifie token avant exécution", "Plus rapide"],
          1,
          "Le décorateur vérifie l'authentification avant d'exécuter la route.",
        ),
        link: "https://flask.palletsprojects.com/",
      }),
    ],
  },
];

export const pythonLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Les fondamentaux de Python",
    color: levelColors[0],
    objective:
      "Maîtriser les bases : variables, conditions, boucles, fonctions, modules. Comprendre la programmation structurée.",
    prerequisites:
      "Aucun. Ce niveau est fait pour les débutants complets.",
    outcomes: [
      "Écrire et exécuter des scripts Python",
      "Manipuler variables, types et opérateurs",
      "Utiliser conditions, boucles et fonctions",
      "Organiser le code avec modules et gérer les erreurs",
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
      "Maîtriser la POO (classes, héritage, encapsulation), manipuler fichiers et structures de données, créer des applications avec SQLite.",
    prerequisites:
      "Niveau débutant complété. Maîtrise des bases Python.",
    outcomes: [
      "Créer des classes et utiliser l'héritage",
      "Manipuler fichiers texte et structures de données",
      "Gérer des bases de données SQLite (CRUD complet)",
      "Développer des applications structurées avec POO + BD",
    ],
    projects: [],
    chapters: intermediate,
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "GUI et API backend",
    color: levelColors[2],
    objective:
      "Créer des interfaces graphiques professionnelles avec Tkinter + SQLite. Développer des API REST avec Flask pour applications web.",
    prerequisites:
      "Niveaux débutant et intermédiaire complétés. Maîtrise POO et SQLite.",
    outcomes: [
      "Créer des applications graphiques complètes avec Tkinter",
      "Intégrer GUI avec bases de données SQLite",
      "Développer des API REST avec Flask",
      "Implémenter authentification et sécurité",
      "Déployer des applications full-stack",
    ],
    projects: [pythonVault, pythonScore, pythonNotes],
    chapters: advanced,
  },
];
