import { kotlinLaunchCommands } from "../lib/localStudio";
import type { WebFiles, WebProject } from "./webCourseTypes";

export const kotlinMain = "src/main/kotlin/Main.kt";

export function kotlinFiles(
  title: string,
  main: string,
  {
    extra,
    coroutines = false,
    notes,
  }: {
    extra?: Record<string, string>;
    coroutines?: boolean;
    notes?: string;
  } = {},
): WebFiles {
  return {
    html: "",
    css: "",
    entry: kotlinMain,
    local: {
      runtime: "kotlin",
      sources: {
        [kotlinMain]: main.trim() + "\n",
        ...extra,
        "pom.xml": `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>devafrica</groupId>
  <artifactId>atelier-kotlin</artifactId>
  <version>1.0.0</version>
  <properties>
    <kotlin.version>2.2.21</kotlin.version>
    <maven.compiler.release>17</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.jetbrains.kotlin</groupId>
      <artifactId>kotlin-stdlib</artifactId>
      <version>\${kotlin.version}</version>
    </dependency>
${
  coroutines
    ? `    <dependency>
      <groupId>org.jetbrains.kotlinx</groupId>
      <artifactId>kotlinx-coroutines-core-jvm</artifactId>
      <version>1.10.2</version>
    </dependency>
`
    : ""
}  </dependencies>
  <build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <plugins>
      <plugin>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-plugin</artifactId>
        <version>\${kotlin.version}</version>
        <executions>
          <execution><id>compile-kotlin</id><phase>compile</phase><goals><goal>compile</goal></goals></execution>
        </executions>
        <configuration><jvmTarget>17</jvmTarget></configuration>
      </plugin>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>exec-maven-plugin</artifactId>
        <version>3.5.0</version>
        <configuration><mainClass>MainKt</mainClass></configuration>
      </plugin>
    </plugins>
  </build>
</project>
`,
        ".gitignore": "/target/\n",
        "README.md": `# ${title}

Ouvre ce dossier dans VS Code. Installe un JDK Java 17 ou plus récent et Maven,
puis lance les commandes dans le dossier qui contient pom.xml.

\`\`\`powershell
${kotlinLaunchCommands}
\`\`\`

Le résultat apparaît dans le terminal. Le fichier Main.kt contient le point
d’entrée. Maven télécharge Kotlin${coroutines ? " et kotlinx.coroutines" : ""} au premier lancement.

${notes ?? ""}`,
      },
    },
  };
}

const bmi: WebProject = {
  id: "imc-kotlin",
  title: "Le calculateur d’IMC en console",
  description:
    "Lis un poids et une taille, calcule l’indice et classe la valeur avec when.",
  minutes: 40,
  requirements: [
    "Lire des mesures numériques positives et traiter une saisie invalide.",
    "Calculer poids / taille² avec une taille exprimée en mètres.",
    "Utiliser when pour afficher la catégorie d’IMC adulte de l’exercice.",
  ],
  hints: [
    "Utilise toDoubleOrNull pour éviter une exception à la lecture.",
    "Les valeurs aux seuils 18,5, 25 et 30 passent à la catégorie suivante.",
  ],
  files: kotlinFiles(
    "Calculateur d’IMC",
    `
import java.util.Locale

fun mesure(texte: String?): Double? =
    texte?.trim()?.replace(',', '.')?.toDoubleOrNull()?.takeIf { it.isFinite() && it > 0 }

fun main(args: Array<String>) {
    println("Exercice de calcul d’IMC pour adulte")
    print("Poids en kg : ")
    val poids = mesure(args.getOrNull(0) ?: readlnOrNull())
    print("Taille en mètres : ")
    val taille = mesure(args.getOrNull(1) ?: readlnOrNull())

    if (poids == null || taille == null) {
        println("Saisis deux valeurs numériques positives.")
        return
    }
    val imc = poids / (taille * taille)
    if (!imc.isFinite() || imc <= 0) {
        println("Les mesures sont hors des limites du calcul.")
        return
    }
    val categorie = when {
        imc < 18.5 -> "Insuffisance pondérale"
        imc < 25.0 -> "Corpulence normale"
        imc < 30.0 -> "Surpoids"
        else -> "Obésité"
    }
    println("IMC : %.1f · %s".format(Locale.FRANCE, imc, categorie))
}
`,
    {
      notes: `Essaie 70 kg et 1,75 m, puis une taille égale à zéro. Le classement utilise
la valeur avant arrondi. Les seuils adultes illustrent un indicateur de
dépistage. L’évaluation clinique tient compte d’autres facteurs.

Référence. https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html`,
    },
  ),
};

const temperatures: WebProject = {
  id: "temperatures-kotlin",
  title: "Le convertisseur de températures sécurisé",
  description:
    "Convertis des Celsius en Fahrenheit et applique une valeur par défaut quand l’entrée est absente.",
  minutes: 40,
  requirements: [
    "Traiter une entrée vide avec l’opérateur Elvis.",
    "Refuser un texte qui ne représente pas une valeur finie.",
    "Afficher le résultat de la formule Celsius × 9 / 5 + 32.",
  ],
  hints: [
    "Teste Entrée seule, 0, 100 et une saisie comme abc.",
    "Le type Double? représente une valeur numérique facultative.",
  ],
  files: kotlinFiles(
    "Convertisseur Celsius",
    `
import java.util.Locale

fun main(args: Array<String>) {
    print("Température en Celsius (Entrée pour 20 °C) : ")
    val texte = (args.firstOrNull() ?: readlnOrNull())?.trim()?.takeIf { it.isNotEmpty() }
    val saisie: Double? = texte?.replace(',', '.')?.toDoubleOrNull()
    if (texte != null && (saisie == null || !saisie.isFinite())) {
        println("Saisis un nombre décimal valide.")
        return
    }
    val celsius = saisie ?: 20.0
    val fahrenheit = celsius * 9.0 / 5.0 + 32.0
    if (fahrenheit.isFinite()) {
        println("%.1f °C = %.1f °F".format(Locale.FRANCE, celsius, fahrenheit))
    } else {
        println("Cette valeur est hors des limites du calcul.")
    }
}
`,
  ),
};

const library: WebProject = {
  id: "bibliotheque-kotlin",
  title: "La bibliothèque de livres",
  description:
    "Crée des modèles de livres et une classe qui filtre son catalogue et met à jour sa disponibilité.",
  minutes: 55,
  requirements: [
    "Créer une data class Livre avec titre, auteur et disponibilité.",
    "Rechercher un titre sans distinction de casse.",
    "Emprunter un livre et retrouver les livres encore disponibles.",
  ],
  hints: [
    "La classe garde sa liste modifiable à l’intérieur.",
    "Utilise copy pour remplacer l’état d’un livre.",
  ],
  files: kotlinFiles(
    "Bibliothèque Kotlin",
    `
fun main(args: Array<String>) {
    val bibliotheque = Bibliotheque(listOf(
        Livre(1, "Apprendre Kotlin", "Amina"),
        Livre(2, "Histoires du web", "Tiana"),
        Livre(3, "Kotlin et les données", "Sam"),
    ))
    print("Mot à rechercher (Entrée pour Kotlin) : ")
    val recherche = (args.firstOrNull() ?: readlnOrNull())?.trim()?.takeIf { it.isNotEmpty() } ?: "Kotlin"
    val resultats = bibliotheque.chercher(recherche)
    if (resultats.isEmpty()) println("Aucun livre trouvé.")
    resultats.forEach { println("${"$"}{it.titre} · ${"$"}{it.auteur}") }
    resultats.firstOrNull()?.let {
        if (bibliotheque.emprunter(it.id)) println("Emprunt : ${"$"}{it.titre}")
    }
    println("Livres disponibles : " + bibliotheque.disponibles().joinToString { it.titre })
}
`,
    {
      extra: {
        "src/main/kotlin/Bibliotheque.kt": `
data class Livre(val id: Int, val titre: String, val auteur: String, val disponible: Boolean = true)

class Bibliotheque(livres: List<Livre>) {
    private val catalogue = livres.toMutableList()

    fun chercher(texte: String): List<Livre> =
        catalogue.filter { it.titre.contains(texte, ignoreCase = true) }

    fun disponibles(): List<Livre> = catalogue.filter { it.disponible }

    fun emprunter(id: Int): Boolean {
        val position = catalogue.indexOfFirst { it.id == id && it.disponible }
        if (position < 0) return false
        catalogue[position] = catalogue[position].copy(disponible = false)
        return true
    }
}
`,
      },
    },
  ),
};

const cart: WebProject = {
  id: "panier-kotlin",
  title: "Le simulateur de panier",
  description:
    "Transforme une liste de produits en lignes de commande et applique une remise selon le total.",
  minutes: 55,
  requirements: [
    "Garder le prix en centimes dans chaque produit.",
    "Calculer le total des lignes avec sumOf.",
    "Appliquer 10 % de remise à partir de 100 € et afficher le détail.",
  ],
  hints: [
    "La quantité multiplie le prix d’une unité.",
    "Change une quantité pour tester les deux branches de la remise.",
  ],
  files: kotlinFiles(
    "Panier Kotlin",
    `
import java.util.Locale

data class Produit(val nom: String, val prixCentimes: Long)
data class Ligne(val produit: Produit, val quantite: Int) {
    val totalCentimes: Long get() = produit.prixCentimes * quantite
}

fun prix(centimes: Long): String = "%.2f €".format(Locale.FRANCE, centimes / 100.0)

fun main() {
    val panier = listOf(
        Ligne(Produit("Clavier", 4500), 2),
        Ligne(Produit("Carnet", 800), 2),
    )
    panier.map { "${"$"}{it.produit.nom} × ${"$"}{it.quantite} · ${"$"}{prix(it.totalCentimes)}" }
        .forEach { println(it) }
    val total = panier.sumOf { it.totalCentimes }
    val remise = if (total >= 10_000) total / 10 else 0
    println("Sous-total : ${"$"}{prix(total)}")
    println("Remise : ${"$"}{prix(remise)}")
    println("Total : ${"$"}{prix(total - remise)}")
}
`,
  ),
};

const downloads: WebProject = {
  id: "telechargements-coroutines",
  title: "Le simulateur de téléchargements",
  description:
    "Lance plusieurs téléchargements simulés dans une portée commune et affiche les étapes pendant qu’ils avancent.",
  minutes: 65,
  requirements: [
    "Écrire une fonction suspend qui simule une attente avec delay.",
    "Démarrer plusieurs coroutines et les attendre dans la portée parente.",
    "Observer des messages entrelacés dans la console.",
  ],
  hints: [
    "async renvoie un Deferred et awaitAll récupère les résultats.",
    "Delay suspend la coroutine et laisse les autres coroutines continuer.",
  ],
  files: kotlinFiles(
    "Téléchargements Kotlin",
    `
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

data class Fichier(val nom: String, val dureeMs: Long)

suspend fun telecharger(fichier: Fichier): String {
    println("Début : ${"$"}{fichier.nom}")
    delay(fichier.dureeMs)
    println("Fin : ${"$"}{fichier.nom}")
    return fichier.nom
}

suspend fun lot(fichiers: List<Fichier>): List<String> = coroutineScope {
    fichiers.map { fichier -> async { telecharger(fichier) } }.awaitAll()
}

fun main() = runBlocking {
    val fichiers = listOf(Fichier("cours.pdf", 450), Fichier("exemple.zip", 750), Fichier("notes.txt", 300))
    launch {
        repeat(3) {
            delay(180)
            println("La coroutine de suivi continue.")
        }
    }
    println("Résultats : " + lot(fichiers).joinToString())
}
`,
    { coroutines: true },
  ),
};

const flowCounter: WebProject = {
  id: "compteur-flow",
  title: "Le compteur de flux",
  description:
    "Émets une valeur toutes les secondes et observe les valeurs dans une collection bornée.",
  minutes: 65,
  requirements: [
    "Construire un Flow avec flow et emit.",
    "Collecter les valeurs avec collect.",
    "Arrêter la collecte au nombre demandé avec take.",
  ],
  hints: [
    "Le débit est simulé par delay.",
    "Relance avec un nombre différent pour vérifier la limite.",
  ],
  files: kotlinFiles(
    "Compteur Flow",
    `
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.take
import kotlinx.coroutines.runBlocking

fun compteur(intervalleMs: Long): Flow<Int> = flow {
    var seconde = 0
    while (true) {
        delay(intervalleMs)
        emit(++seconde)
    }
}

fun main(args: Array<String>) = runBlocking {
    val total = args.getOrNull(0)?.toIntOrNull()?.coerceIn(1, 30) ?: 5
    val intervalle = args.getOrNull(1)?.toLongOrNull()?.coerceIn(10, 1000) ?: 1000
    compteur(intervalle)
        .take(total)
        .map { "Valeur reçue : $it" }
        .collect { println(it) }
    println("Collecte terminée.")
}
`,
    {
      coroutines: true,
      notes:
        "Par défaut, le flux émet cinq valeurs à une seconde d’intervalle. Pour un essai rapide dans PowerShell, lance mvn -q compile exec:java '-Dexec.args=3 100'.",
    },
  ),
};

export const kotlinProjects = [
  [bmi, temperatures],
  [library, cart],
  [downloads, flowCounter],
];
