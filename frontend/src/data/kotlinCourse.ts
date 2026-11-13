import {
  lesson,
  levelColors,
  projectExample,
  quiz,
  section,
} from "./courseAuthoring";
import { kotlinFiles, kotlinProjects } from "./kotlinProjects";
import type { WebLevel } from "./webCourseTypes";

const [[bmi, temperature], [library, cart], [downloads, timer]] =
  kotlinProjects;
const docs = "https://kotlinlang.org/docs/";

const beginner: WebLevel["chapters"] = [
  {
    id: "installation-kotlin",
    title: "Installation et configuration Kotlin",
    description:
      "Installe les outils, comprends ce que Kotlin apporte par rapport à Java et lance ton premier programme.",
    lessons: [
      lesson({
        id: "introduction-kotlin",
        title: "Qu'est-ce que Kotlin et pourquoi l'apprendre ?",
        minutes: 25,
        summary:
          "Kotlin est un langage de programmation moderne à typage statique, développé par JetBrains. Il est officiellement recommandé par Google pour le développement Android et remplace progressivement Java dans ce domaine.",
        sections: [
          section(
            "Kotlin : langage officiel Android",
            "Depuis 2017, Google recommande Kotlin comme premier langage pour Android. Kotlin est concis, expressif et interopérable avec Java.",
            [
              "Concisité : Kotlin élimine une grande partie du code répétitif Java. Une data class d'une ligne remplace 50 lignes Java.",
              "Null safety : Le compilateur distingue les types nullables (String?) des types garantis non-null (String). Les NullPointerException sont quasi éliminées.",
              "Coroutines : La gestion de l'asynchronisme est intégrée au langage, sans librairie externe complexe.",
              "Interopérabilité Java : Un projet peut mélanger du code Kotlin et Java. Toutes les librairies Java sont utilisables depuis Kotlin.",
              "Multiplateforme : Kotlin/JVM pour Android et backend, Kotlin/JS pour le web, Kotlin/Native pour iOS et systèmes embarqués.",
              "JetBrains et Google : Kotlin bénéficie du support actif de son créateur et du premier utilisateur mobile mondial.",
            ],
          ),
          section(
            "Kotlin vs Java : les différences clés",
            "Kotlin et Java compilent tous les deux vers du bytecode JVM, mais Kotlin est beaucoup plus expressif.",
            [
              "Variables : val et var remplacent le verbose Java. val nom = 'Alice' au lieu de String nom = 'Alice';",
              "Null safety : En Java, toute variable peut être null. En Kotlin, String ne peut jamais être null sauf si déclaré String?.",
              "Data classes : data class Produit(val nom: String, val prix: Double) remplace une classe Java avec getters, setters, equals, hashCode et toString.",
              "Lambdas : Kotlin a un support natif et élégant des lambdas. list.filter { it.prix > 10 } au lieu de code Java verbeux.",
              "Extensions : Kotlin permet d'ajouter des méthodes à des classes existantes sans les modifier ni les hériter.",
              "Coroutines : suspend fun et launch remplacent les threads et callbacks Java pour le code asynchrone.",
            ],
          ),
          section(
            "Prérequis système",
            "Kotlin fonctionne partout où Java est présent. Les outils principaux sont le JDK et un IDE comme IntelliJ IDEA.",
            [
              "JDK : Installe le JDK 17 ou supérieur (LTS recommandé). Télécharge depuis adoptium.net ou oracle.com/java.",
              "Windows : Exécute l'installeur MSI. Vérifie l'installation avec java -version dans le terminal.",
              "macOS : Utilise Homebrew : brew install openjdk@17. Ou télécharge le pkg depuis adoptium.net.",
              "Linux : sudo apt install openjdk-17-jdk (Debian/Ubuntu) ou sudo dnf install java-17-openjdk (Fedora).",
              "RAM : 4 GB minimum pour l'IDE et le compilateur. 8 GB recommandés.",
            ],
          ),
          section(
            "Installation de l'IDE : IntelliJ IDEA ou Android Studio",
            "IntelliJ IDEA est l'IDE Kotlin par excellence pour le code Kotlin/JVM. Android Studio (basé sur IntelliJ) est l'IDE Android.",
            [
              "IntelliJ IDEA Community : Gratuit, idéal pour apprendre Kotlin et écrire du code JVM. Télécharge depuis jetbrains.com/idea.",
              "Android Studio : Gratuit, basé sur IntelliJ, optimisé pour Android. Inclut l'émulateur et le SDK Android.",
              "VS Code : L'extension Kotlin existe mais le support est moins complet qu'IntelliJ.",
              "Playground en ligne : play.kotlinlang.org permet d'essayer Kotlin sans rien installer.",
              "Première ouverture IntelliJ : Crée un nouveau projet Kotlin JVM et sélectionne le JDK installé.",
            ],
          ),
          section(
            "Premier programme Kotlin",
            "Le point d'entrée d'un programme Kotlin est la fonction main(). Elle peut être dans n'importe quel fichier .kt.",
            [
              "Créer un fichier : main.kt avec fun main() { println('Bonjour Kotlin !') }.",
              "Compiler en ligne de commande : kotlinc main.kt -include-runtime -d main.jar puis java -jar main.jar.",
              "Depuis IntelliJ : Clique sur le triangle vert à côté de fun main() pour lancer directement.",
              "println() : Affiche une ligne dans la console. print() affiche sans retour à la ligne.",
              "Pas de classe nécessaire : Contrairement à Java, les fonctions Kotlin peuvent exister en dehors d'une classe.",
              "fun main(args: Array<String>) : La version avec arguments accepte des paramètres en ligne de commande.",
            ],
          ),
          section(
            "Structure d'un projet Kotlin avec Maven",
            "Les ateliers de ce cours utilisent Maven pour gérer les dépendances et compiler le projet.",
            [
              "pom.xml : Fichier de configuration Maven qui déclare le langage (Kotlin), la version du compilateur et les dépendances.",
              "src/main/kotlin : Dossier contenant le code source Kotlin principal.",
              "src/test/kotlin : Dossier pour les tests unitaires.",
              "mvn compile : Compile le projet. mvn exec:java lance le programme.",
              "Le README de chaque atelier donne la commande exacte pour lancer le projet.",
              "IDE : Ouvre le dossier du projet dans IntelliJ. Il détecte automatiquement le pom.xml et configure tout.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Premier programme Kotlin",
          `
fun main() {
    println("Bonjour Kotlin !")
    val nom = "Amina"
    val annee = 2025
    println("$nom programme depuis $annee.")
}`,
        ),
        task: "Installe le JDK 17 et IntelliJ IDEA Community. Crée un nouveau projet Kotlin, écris fun main() { println('Bonjour Kotlin !') } et lance-le. Modifie le message et observe l'affichage.",
        takeaway:
          "Kotlin est le langage officiel Android. Il est concis, null-safe et interopérable avec Java. fun main() est le point d'entrée. println() affiche dans la console.",
        quiz: quiz(
          "Depuis quelle année Google recommande-t-il Kotlin comme premier langage Android ?",
          ["2014", "2017", "2020"],
          1,
          "Google a annoncé Kotlin comme langage officiel Android à Google I/O 2017.",
        ),
        link: docs + "getting-started.html",
      }),
    ],
  },
  {
    id: "kotlin-variables",
    title: "Variables et types de données",
    description: "Déclare des valeurs et utilise les types du langage.",
    lessons: [
      lesson({
        id: "val-var",
        title: "Déclarer une variable avec val ou var",
        minutes: 15,
        summary:
          "val fixe la référence après son initialisation. var permet de réattribuer une valeur du même type.",
        sections: [
          section(
            "Observer ce qui peut changer",
            "Dans le programme, nom garde la même valeur. Le nombre de points augmente après chaque action.",
            [
              "Préfère val quand la référence ne change pas.",
              "Un val peut désigner un objet dont le contenu change, comme une liste mutable.",
              "fun main() est le point d’entrée du programme.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Variables Kotlin",
          `
fun main() {
    val nom = "Amina"
    var points = 0
    points += 2
    println("$nom a $points points.")
}`,
        ),
        task: "Ajoute trois points et exécute le fichier. Essaie de réassigner nom et lis le message du compilateur.",
        takeaway:
          "Choisis val pour une référence fixe et var pour une référence réassignable.",
        quiz: quiz(
          "Quel mot-clé permet points += 2 ?",
          ["val", "var", "fun"],
          1,
          "var autorise une nouvelle affectation.",
        ),
        link: docs + "basic-syntax.html#variables",
      }),
      lesson({
        id: "types-fonctions",
        title: "Manipuler Int, Double, String et Boolean",
        minutes: 18,
        summary:
          "Un type décrit les opérations permises. Kotlin peut déduire le type d’une variable ou le lire après son nom.",
        sections: [
          section(
            "Écrire une fonction typée",
            "total reçoit un prix Double et une quantité Int. Elle retourne un Double. Le texte affiche la valeur par interpolation.",
            [
              "Int représente des entiers. Double représente des nombres à virgule flottante.",
              "String contient du texte. Boolean représente true ou false.",
              "Convertis explicitement une valeur lorsque le contexte attend un autre type.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Types de base",
          `
fun total(prix: Double, quantite: Int): Double = prix * quantite

fun main() {
    val quantite: Int = 3
    val prix: Double = 2.5
    val produit: String = "Carnet"
    val disponible: Boolean = true
    val resultat = total(prix, quantite)
    println("$produit · disponible=$disponible · total=$resultat")
}`,
        ),
        task: "Modifie le prix et la quantité. Ajoute un paramètre de réduction à la fonction.",
        takeaway:
          "Les types rendent les données et les contrats des fonctions explicites.",
        quiz: quiz(
          "Quel type convient à true ?",
          ["String", "Int", "Boolean"],
          2,
          "Boolean représente un choix vrai ou faux.",
        ),
        link: docs + "basic-types.html",
      }),
    ],
  },
  {
    id: "kotlin-controle",
    title: "Conditions et contrôle de flux",
    description: "Choisis une branche et répète une opération.",
    lessons: [
      lesson({
        id: "conditions-when",
        title: "Décider avec if et when",
        minutes: 18,
        summary:
          "if teste une condition. when permet d’enchaîner plusieurs cas et peut produire une valeur.",
        sections: [
          section(
            "Lire un classement",
            "Le calculateur choisit la première branche vraie. Il vérifie les seuils dans l’ordre avant d’utiliser else.",
            [
              "Une expression if peut retourner une valeur.",
              "when peut comparer une valeur ou tester plusieurs conditions.",
              "Teste les limites pour vérifier quelle branche les prend.",
            ],
          ),
        ],
        files: bmi.files,
        task: "Change les mesures puis repère la branche choisie par when. Vérifie le cas taille zéro.",
        takeaway:
          "L’ordre des conditions compte lorsque plusieurs tests pourraient correspondre.",
        quiz: quiz(
          "Quelle branche est choisie si les premières conditions échouent ?",
          ["else", "var", "for"],
          0,
          "else fournit le cas de repli.",
        ),
        link: docs + "control-flow.html#when-expressions-and-statements",
      }),
      lesson({
        id: "boucles-plages",
        title: "Parcourir une plage avec for et while",
        minutes: 17,
        summary:
          "for parcourt une plage ou une collection. while répète une action tant que sa condition reste vraie.",
        sections: [
          section(
            "Comprendre les bornes",
            "1..5 inclut 5. Une boucle while doit faire évoluer la variable de contrôle pour pouvoir se terminer.",
            [
              "Utilise for quand tu connais les valeurs à parcourir.",
              "Utilise while quand la durée dépend d’une condition.",
              "break permet de sortir d’une boucle avant la fin.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Boucles Kotlin",
          `
fun main() {
    var somme = 0
    for (i in 1..5) somme += i
    println("Somme : $somme")
    var reste = 3
    while (reste > 0) {
        println("Reste : $reste")
        reste--
    }
}`,
        ),
        task: "Modifie la borne du for. Ajoute une condition pour arrêter le while lorsqu’il reste 1.",
        takeaway:
          "La plage donne les valeurs de for. La condition pilote while.",
        quiz: quiz(
          "Combien de valeurs contient 1..5 ?",
          ["4", "5", "6"],
          1,
          "La plage inclut les deux bornes.",
        ),
        link: docs + "control-flow.html#for-loops",
      }),
    ],
  },
  {
    id: "kotlin-null-safety",
    title: "Null safety",
    description: "Décris les valeurs facultatives et traite leur absence.",
    lessons: [
      lesson({
        id: "types-nullables",
        title: "Distinguer String et String?",
        minutes: 17,
        summary:
          "String demande une valeur de texte. String? admet aussi null. Le compilateur demande un traitement explicite avant d’accéder aux propriétés d’une valeur nullable.",
        sections: [
          section(
            "Séparer absence et chaîne vide",
            "null signifie qu’aucune valeur n’est présente. Une chaîne vide est une valeur String qui contient zéro caractère.",
            [
              "Un test if (nom != null) permet souvent au compilateur de déduire que nom est non nul dans cette branche.",
              "readlnOrNull renvoie null quand le flux d’entrée est terminé.",
              "Un type nullable permet de modéliser l’absence au lieu de l’ignorer.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Types nullables",
          `
fun main() {
    print("Prénom (Entrée pour continuer) : ")
    val nom: String? = readlnOrNull()?.trim()?.takeIf { it.isNotEmpty() }
    if (nom != null) {
        println("Bonjour $nom. Longueur : " + nom.length)
    } else {
        println("Bonjour !")
    }
}`,
        ),
        task: "Exécute le programme avec un prénom puis avec une saisie vide.",
        takeaway:
          "Le point d’interrogation rend l’absence visible dans le type.",
        quiz: quiz(
          "Quel type autorise null ?",
          ["String", "String?", "Int"],
          1,
          "Le suffixe ? permet d’affecter null.",
        ),
        link: docs + "null-safety.html",
      }),
      lesson({
        id: "safe-call-elvis",
        title: "Utiliser l’appel sécurisé et Elvis",
        minutes: 19,
        summary:
          "?. lit une propriété ou appelle une méthode lorsque la valeur existe. ?: choisit une valeur de repli lorsque la partie gauche vaut null.",
        sections: [
          section(
            "Appliquer une température de repli",
            "Le convertisseur nettoie le texte et tente de lire un Double. Il traite la saisie invalide avant d’appliquer 20 °C si l’entrée est absente.",
            [
              "toDoubleOrNull évite une exception de conversion.",
              "Une valeur absente et une valeur incorrecte peuvent demander des réponses différentes.",
              "L’opérateur !! peut provoquer une exception si la valeur est nulle. Choisis un traitement explicite.",
            ],
          ),
        ],
        files: temperature.files,
        task: "Compare une entrée vide, 0 et un texte invalide. Change ensuite la température de repli.",
        takeaway:
          "?. propage l’absence. ?: fournit une valeur si elle reste absente.",
        quiz: quiz(
          "Quelle expression choisit 20 si saisie vaut null ?",
          ["saisie ?: 20", "saisie!!", "saisie + 20"],
          0,
          "Elvis retourne la partie droite quand la partie gauche est nulle.",
        ),
        link: docs + "null-safety.html#elvis-operator",
      }),
    ],
  },
];

const intermediate: WebLevel["chapters"] = [
  {
    id: "kotlin-poo",
    title: "Programmation orientée objet",
    description: "Modélise les données et leurs opérations avec des classes.",
    lessons: [
      lesson({
        id: "classes-kotlin",
        title: "Créer une classe et son constructeur",
        minutes: 18,
        summary:
          "Une classe regroupe des données et des opérations. Le constructeur primaire peut déclarer des propriétés directement avec val ou var.",
        sections: [
          section(
            "Protéger le catalogue",
            "Bibliotheque reçoit des livres et crée sa liste modifiable privée. Ses méthodes exposent des opérations comme chercher ou emprunter.",
            [
              "Une propriété private reste interne à la classe.",
              "Un appel au constructeur crée un objet.",
              "Une fonction membre peut utiliser les propriétés de cet objet.",
            ],
          ),
        ],
        files: projectExample(library, "src/main/kotlin/Bibliotheque.kt"),
        task: "Ajoute une méthode qui retourne le nombre de livres. Appelle-la depuis main.",
        takeaway:
          "Le constructeur prépare l’objet. Les méthodes définissent comment l’utiliser.",
        quiz: quiz(
          "Pourquoi catalogue est-il privé ?",
          [
            "Pour protéger l’état interne",
            "Pour compiler sans Kotlin",
            "Pour bloquer tout appel à Bibliotheque",
          ],
          0,
          "Les autres classes passent par les méthodes prévues.",
        ),
        link: docs + "classes.html",
      }),
      lesson({
        id: "heritage-kotlin",
        title: "Étendre une classe avec open et override",
        minutes: 20,
        summary:
          "Une classe Kotlin est finale par défaut. open autorise l’héritage. Une sous-classe redéfinit une méthode ouverte avec override.",
        sections: [
          section(
            "Partager une règle d’affichage",
            "Publication définit une étiquette. LivreIllustré adapte cette étiquette avec son auteur.",
            [
              "La sous-classe appelle le constructeur du parent.",
              "override explicite la redéfinition d’un membre.",
              "Une interface peut définir un contrat commun lorsque plusieurs types partagent un comportement.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Héritage Kotlin",
          `
open class Publication(val titre: String) {
    open fun etiquette(): String = titre
}

class LivreIllustre(titre: String, private val auteur: String) : Publication(titre) {
    override fun etiquette(): String = "$titre · $auteur"
}

fun main() {
    val publication: Publication = LivreIllustre("Carnet Android", "Tiana")
    println(publication.etiquette())
}`,
        ),
        task: "Crée une seconde sous-classe Publication et redéfinis son étiquette.",
        takeaway:
          "La sous-classe peut personnaliser le comportement déclaré par le parent.",
        quiz: quiz(
          "Quel mot-clé permet de redéfinir etiquette ?",
          ["override", "suspend", "val"],
          0,
          "override marque l’implémentation fournie par la sous-classe.",
        ),
        link: docs + "inheritance.html",
      }),
      lesson({
        id: "data-classes-kotlin",
        title: "Utiliser une data class et copy",
        minutes: 18,
        summary:
          "Une data class Kotlin génère notamment l’égalité, une description et une copie à partir des propriétés du constructeur primaire.",
        sections: [
          section(
            "Représenter un livre disponible",
            "Livre contient les données du catalogue. copy(disponible = false) crée un nouveau livre de même identité avec un état différent.",
            [
              "La comparaison par == utilise l’égalité générée.",
              "copy change les propriétés indiquées et conserve les autres.",
              "Une copie de data class partage les références de ses propriétés imbriquées.",
            ],
          ),
        ],
        files: projectExample(library, "src/main/kotlin/Bibliotheque.kt"),
        task: "Affiche un livre avant et après son emprunt. Vérifie que le titre reste identique.",
        takeaway:
          "copy permet de produire une nouvelle valeur à partir d’une data class.",
        quiz: quiz(
          "Quel appel change seulement disponible dans une copie ?",
          [
            "livre.copy(disponible = false)",
            "livre.filter(false)",
            "livre.open()",
          ],
          0,
          "copy remplit les autres propriétés avec celles de l’original.",
        ),
        link: docs + "data-classes.html",
      }),
    ],
  },
  {
    id: "kotlin-collections",
    title: "Collections et fonctions d’ordre supérieur",
    description:
      "Choisis une collection et combine filtres et transformations.",
    lessons: [
      lesson({
        id: "listes-maps",
        title: "Choisir une liste, une liste mutable ou une map",
        minutes: 19,
        summary:
          "Une liste garde un ordre. listOf fournit une interface en lecture seule. mutableListOf expose des opérations de modification. Une map associe une clé à une valeur.",
        sections: [
          section(
            "Lire et modifier le contenu",
            "Le programme copie ses noms dans une liste modifiable puis associe un nombre de points à chaque membre.",
            [
              "La lecture seule décrit les opérations disponibles via la référence.",
              "Une map lit la valeur par sa clé et peut renvoyer null si la clé manque.",
              "val peut désigner une liste mutable sans permettre de réassigner la référence.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Listes et maps",
          `
fun main() {
    val noms = listOf("Amina", "Tiana")
    val membres = noms.toMutableList()
    membres.add("Sam")
    val points = mutableMapOf("Amina" to 3, "Tiana" to 5)
    points["Sam"] = 2
    membres.forEach { nom -> println("$nom : " + (points[nom] ?: 0)) }
}`,
        ),
        task: "Ajoute un membre sans point et observe l’effet de la valeur de repli.",
        takeaway:
          "Une map donne un accès par clé. Une liste conserve l’ordre des éléments.",
        quiz: quiz(
          "Quelle collection permet membres.add(...) ?",
          ["MutableList", "List en lecture seule", "Int"],
          0,
          "MutableList expose les opérations d’ajout et de retrait.",
        ),
        link: docs + "collections-overview.html",
      }),
      lesson({
        id: "filter-map-foreach",
        title: "Filtrer, transformer et parcourir",
        minutes: 21,
        summary:
          "filter garde les éléments qui passent un test. map transforme les éléments. forEach exécute une action pour chacun.",
        sections: [
          section(
            "Suivre une chaîne de collections",
            "Le catalogue filtre les livres disponibles, puis une transformation peut extraire leurs titres. Une dernière étape les affiche.",
            [
              "Une lambda est une fonction écrite entre accolades.",
              "it représente le paramètre unique si tu n’as pas donné de nom.",
              "Les fonctions d’ordre supérieur reçoivent des fonctions en argument.",
            ],
          ),
        ],
        files: library.files,
        task: "Ajoute une chaîne qui filtre les livres disponibles, transforme leurs titres en majuscules et les affiche.",
        takeaway:
          "Lis chaque étape de la chaîne comme une action sur la collection.",
        quiz: quiz(
          "Quel appel produit un titre à partir de chaque livre ?",
          [
            "map { it.titre }",
            "filter { it.disponible }",
            "forEach { println(it) }",
          ],
          0,
          "map transforme chaque élément en une nouvelle valeur.",
        ),
        link: docs + "collection-transformations.html",
      }),
      lesson({
        id: "agregation-panier",
        title: "Calculer un total avec sumOf",
        minutes: 20,
        summary:
          "sumOf calcule une somme à partir d’une valeur extraite de chaque élément. Le panier additionne les totaux des lignes.",
        sections: [
          section(
            "Séparer calcul et présentation",
            "Le prix en centimes est un entier. Le format en euros est calculé pour l’affichage après la somme et la remise.",
            [
              "Le total d’une ligne dépend de son prix unitaire et de sa quantité.",
              "Le calcul de remise utilise une branche if.",
              "Essaie des paniers en dessous du seuil et au seuil.",
            ],
          ),
        ],
        files: cart.files,
        task: "Change les quantités pour comparer un panier de moins de 100 € et un panier qui déclenche la remise.",
        takeaway:
          "Calcule sur les données numériques avant de produire le texte.",
        quiz: quiz(
          "Quel appel additionne les totaux de ligne ?",
          ["sumOf { it.totalCentimes }", "map { it.produit }", "listOf()"],
          0,
          "sumOf additionne le résultat de la fonction appliquée à chaque ligne.",
        ),
        link: docs + "collection-aggregate.html",
      }),
    ],
  },
];

const advanced: WebLevel["chapters"] = [
  {
    id: "kotlin-coroutines",
    title: "Coroutines, suspension et contextes",
    description:
      "Lance des tâches dans une portée et choisis le contexte adapté.",
    lessons: [
      lesson({
        id: "portee-coroutine",
        title: "Lancer une coroutine dans une portée",
        minutes: 21,
        summary:
          "Une coroutine représente un travail qui peut être suspendu et repris. Plusieurs coroutines peuvent partager des threads et sont organisées par une portée.",
        sections: [
          section(
            "Observer deux travaux qui avancent",
            "launch démarre la coroutine de suivi. runBlocking relie le point d’entrée console aux appels suspendus et attend la fin de ses enfants.",
            [
              "delay suspend la coroutine pendant l’attente.",
              "Une portée parente attend ses enfants et peut les annuler.",
              "L’atelier utilise runBlocking dans main. Une application graphique dispose de portées liées à son cycle de vie.",
            ],
          ),
        ],
        files: downloads.files,
        task: "Observe les lignes de suivi entre les débuts et fins de téléchargement. Modifie la durée d’un fichier.",
        takeaway:
          "La portée donne une durée de vie aux coroutines qui exécutent le travail.",
        quiz: quiz(
          "Que fait delay pendant l’attente ?",
          [
            "Il suspend la coroutine",
            "Il supprime le thread",
            "Il termine toutes les coroutines",
          ],
          0,
          "La coroutine reprend ensuite et laisse le contexte exécuter d’autres travaux.",
        ),
        link: docs + "coroutines-basics.html",
      }),
      lesson({
        id: "suspend-async",
        title: "Déclarer suspend et attendre plusieurs résultats",
        minutes: 21,
        summary:
          "Une fonction suspend peut appeler d’autres fonctions suspendues. async démarre un travail dont le résultat sera récupéré par await.",
        sections: [
          section(
            "Télécharger un lot de fichiers",
            "La portée du lot lance un async par fichier puis awaitAll rassemble leurs résultats.",
            [
              "Le mot-clé suspend autorise la suspension. Le contexte détermine où s’exécute le code.",
              "coroutineScope conserve la relation entre la tâche parente et ses enfants.",
              "Le résultat d’awaitAll suit l’ordre des éléments demandés, même si les fichiers se terminent à des moments différents.",
            ],
          ),
        ],
        files: downloads.files,
        task: "Ajoute un quatrième fichier et compare l’ordre des fins à l’ordre de la liste de résultats.",
        takeaway:
          "async produit un résultat différé. await et awaitAll permettent de le récupérer.",
        quiz: quiz(
          "Quelle opération attend la liste des résultats ?",
          ["awaitAll()", "println()", "mutableListOf()"],
          0,
          "awaitAll attend tous les résultats différés.",
        ),
        link: docs + "composing-suspending-functions.html",
      }),
      lesson({
        id: "dispatchers-kotlin",
        title: "Choisir Dispatchers.IO, Default et Main",
        minutes: 22,
        summary:
          "Le dispatcher aide à déterminer où une coroutine travaille. IO convient aux appels d’entrée-sortie bloquants et Default au travail de calcul.",
        sections: [
          section(
            "Déplacer une lecture bloquante",
            "withContext(Dispatchers.IO) exécute la lecture du README dans le contexte IO et ramène son résultat à l’appelant.",
            [
              "Dispatchers.Main sert au thread d’interface quand la plateforme le fournit.",
              "Cet atelier console utilise IO pour le fichier et affiche le résultat depuis main.",
              "Un appel suspend peut rester bloquant si son implémentation effectue une opération bloquante sans contexte adapté.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Contextes Kotlin",
          `
import java.nio.file.Files
import java.nio.file.Path
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext

suspend fun lireGuide(): String = withContext(Dispatchers.IO) {
    Files.readString(Path.of("README.md"))
}

fun main() = runBlocking {
    val guide = lireGuide()
    println(guide.lineSequence().first())
}`,
          { coroutines: true },
        ),
        task: "Lance le projet depuis le dossier extrait. Change le fichier à lire et observe le résultat.",
        takeaway:
          "Choisis le contexte selon le travail exécuté et la plateforme.",
        quiz: quiz(
          "Quel dispatcher convient ici à la lecture de fichier bloquante ?",
          ["Dispatchers.IO", "Dispatchers.Main", "Un type String?"],
          0,
          "IO est prévu pour les opérations d’entrée-sortie bloquantes.",
        ),
        link: docs + "coroutine-context-and-dispatchers.html",
      }),
    ],
  },
  {
    id: "kotlin-flow",
    title: "Flux de données asynchrones",
    description:
      "Émets, transforme et collecte des valeurs qui arrivent dans le temps.",
    lessons: [
      lesson({
        id: "flow-emit-collect",
        title: "Construire un Flow et lire ses valeurs",
        minutes: 21,
        summary:
          "Un Flow décrit une suite de valeurs asynchrones. Le bloc flow démarre à la collecte. emit envoie une valeur et collect la reçoit.",
        sections: [
          section(
            "Faire avancer un compteur",
            "Chaque tour attend un délai, incrémente le compteur et émet sa valeur. Le collecteur affiche le message correspondant.",
            [
              "Le flux de cet exemple est froid. Chaque collecte relance sa production.",
              "Un Flow peut produire plusieurs valeurs. Une fonction suspend classique renvoie un résultat.",
              "La collecte se fait dans une coroutine.",
            ],
          ),
        ],
        files: timer.files,
        task: "Observe l’intervalle entre les lignes. Change le délai utilisé par compteur.",
        takeaway:
          "emit produit une valeur et collect la traite quand elle arrive.",
        quiz: quiz(
          "Quel appel lance la collecte du flux ?",
          ["collect", "var", "copy"],
          0,
          "collect déclenche la production du flux froid et reçoit ses valeurs.",
        ),
        link: docs + "flow.html",
      }),
      lesson({
        id: "flow-map-take",
        title: "Transformer et limiter un flux",
        minutes: 20,
        summary:
          "Les opérateurs de flux forment une chaîne. map transforme chaque valeur. take limite la quantité reçue.",
        sections: [
          section(
            "Arrêter un compteur potentiellement infini",
            "Le compteur pourrait continuer à émettre. take(total) arrête le flux après le nombre demandé.",
            [
              "map reçoit la valeur et produit une autre représentation.",
              "filter peut choisir les valeurs à transmettre.",
              "Place les opérateurs dans l’ordre voulu. Le nombre reçu change selon la position de take.",
            ],
          ),
        ],
        files: timer.files,
        task: "Filtre les valeurs paires avant take. Compare le résultat à un filtre placé après take.",
        takeaway:
          "L’ordre des opérateurs détermine les valeurs qui arrivent au collecteur.",
        quiz: quiz(
          "Quel opérateur limite le nombre de valeurs ?",
          ["take", "map", "async"],
          0,
          "take termine la collecte après la quantité demandée.",
        ),
        link: docs + "flow.html#size-limiting-operators",
      }),
      lesson({
        id: "annulation-kotlin",
        title: "Annuler une attente dans une portée",
        minutes: 22,
        summary:
          "Une portée peut arrêter un travail quand son résultat arrive trop tard. withTimeoutOrNull renvoie null à l’expiration de son délai.",
        sections: [
          section(
            "Choisir un traitement de repli",
            "L’exemple essaie une opération qui dure 450 ms, avec un délai maximal de 250 ms. delay réagit à l’annulation.",
            [
              "Les coroutines coopèrent à l’annulation aux points de suspension.",
              "Un long calcul peut vérifier sa propre annulation dans sa boucle.",
              "Le code appelant peut afficher un résultat de repli en cas de délai dépassé.",
            ],
          ),
        ],
        files: kotlinFiles(
          "Annulation de coroutine",
          `
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeoutOrNull

fun main() = runBlocking {
    val resultat = withTimeoutOrNull(250) {
        delay(450)
        "Réponse reçue"
    }
    println(resultat ?: "Délai dépassé")
}`,
          { coroutines: true },
        ),
        task: "Réduis la durée de l’opération sous le délai. Compare les deux messages.",
        takeaway:
          "L’annulation borne la durée du travail et permet au parent de poursuivre.",
        quiz: quiz(
          "Quel résultat withTimeoutOrNull donne-t-il après expiration ?",
          ["null", "true", "Le texte du fichier"],
          0,
          "L’expiration annule le bloc et renvoie null.",
        ),
        link: docs + "cancellation-and-timeouts.html",
      }),
    ],
  },
];

export const kotlinLevels: WebLevel[] = [
  {
    id: "debutant",
    title: "Débutant",
    subtitle: "Syntaxe et logique de base",
    definition:
      "Kotlin est un langage de programmation à typage statique. Il sert à écrire les règles, les calculs et les traitements de données d’un programme. Dans ce cours, tu compiles et exécutes du Kotlin/JVM dans un terminal.",
    objective:
      "Écris tes premiers programmes Kotlin avec des types, des conditions et des entrées facultatives.",
    color: levelColors[0],
    prerequisites:
      "Pour démarrer, installe un JDK et Maven. Le guide donne les commandes à exécuter.",
    outcomes: [
      "Comprendre les avantages de Kotlin par rapport à Java et configurer l'environnement.",
      "Choisir entre val et var.",
      "Manipuler les types de base.",
      "Écrire des conditions et des boucles.",
      "Traiter les valeurs nullables avec ?. et ?:",
    ],
    chapters: beginner,
    projects: kotlinProjects[0],
  },
  {
    id: "intermediaire",
    title: "Intermédiaire",
    subtitle: "Classes, objets et collections",
    objective:
      "Organise des données en objets puis filtre, transforme et additionne des collections.",
    color: levelColors[1],
    prerequisites:
      "Pour démarrer, maîtrise les fonctions, les conditions et les types nullables.",
    outcomes: [
      "Créer des classes et des sous-classes.",
      "Utiliser une data class et copy.",
      "Choisir des collections adaptées.",
      "Combiner filter, map, forEach et sumOf.",
    ],
    chapters: intermediate,
    projects: kotlinProjects[1],
  },
  {
    id: "avance",
    title: "Avancé",
    subtitle: "Coroutines et Flow",
    objective:
      "Coordonne des tâches suspendues et observe des valeurs produites au fil du temps.",
    color: levelColors[2],
    prerequisites:
      "Pour démarrer, connais les fonctions, les collections et les lambdas Kotlin.",
    outcomes: [
      "Créer des fonctions suspend et des coroutines structurées.",
      "Choisir un dispatcher.",
      "Émettre et collecter un Flow.",
      "Limiter ou annuler une opération.",
    ],
    chapters: advanced,
    projects: kotlinProjects[2],
  },
];
