import { composeFiles, composePath } from "./composeAuthoring";
import type { WebProject } from "./webCourseTypes";

const shop: WebProject = {
  id: "boutique-compose-mvvm",
  title: "La boutique multi-écrans",
  description:
    "Navigue du catalogue vers les détails et le panier. Un ViewModel gère le panier partagé.",
  minutes: 95,
  requirements: [
    "Afficher les produits dans une grille adaptative.",
    "Passer l’identifiant du produit à l’écran de détails.",
    "Ajouter et retirer des articles, puis retrouver le panier après navigation.",
  ],
  hints: [
    "Le NavHost contient les routes catalogue, produit/{id} et panier.",
    "Le ViewModel est obtenu au-dessus du NavHost pour partager son état.",
  ],
  files: composeFiles("Boutique DevAfrica", {
    appId: "boutique",
    advanced: true,
    navigation: true,
    extra: {
      [`${composePath}/StoreViewModel.kt`]: `package devafrica.atelier

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class Produit(val id: Int, val titre: String, val description: String, val prixCentimes: Int)

class StoreViewModel : ViewModel() {
    val produits = listOf(
        Produit(1, "Carnet", "Un carnet pour noter les idées de ton prochain projet.", 1200),
        Produit(2, "Sac DevAfrica", "Un sac de démonstration pour ton ordinateur et tes accessoires.", 2900),
        Produit(3, "Clavier", "Un clavier compact pour aménager ton bureau.", 4500),
        Produit(4, "Support", "Un support réglable pour lire le code plus confortablement.", 1800),
    )
    private val _panier = MutableStateFlow<Map<Int, Int>>(emptyMap())
    val panier = _panier.asStateFlow()

    fun ajouter(id: Int) {
        if (produits.none { it.id == id }) return
        _panier.update { panier ->
            val quantite = ((panier[id] ?: 0) + 1).coerceAtMost(99)
            panier + (id to quantite)
        }
    }

    fun retirer(id: Int) {
        _panier.update { panier ->
            val quantite = panier[id] ?: return@update panier
            if (quantite == 1) panier - id else panier + (id to (quantite - 1))
        }
    }
}
`,
    },
    screen: `package devafrica.atelier

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import java.util.Locale

private fun prix(centimes: Int) = "%.2f €".format(Locale.FRANCE, centimes / 100.0)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AtelierScreen(store: StoreViewModel = viewModel()) {
    val nav = rememberNavController()
    val panier by store.panier.collectAsStateWithLifecycle()
    Scaffold(topBar = {
        TopAppBar(
            title = { Text("Boutique DevAfrica") },
            actions = {
                TextButton(onClick = { nav.navigate("panier") { launchSingleTop = true } }) {
                    Text("Panier (${"$"}{panier.values.sum()})")
                }
            },
        )
    }) { padding ->
        NavHost(nav, startDestination = "catalogue", modifier = Modifier.padding(padding).consumeWindowInsets(padding)) {
            composable("catalogue") {
                Catalogue(store.produits) { id -> nav.navigate("produit/$id") }
            }
            composable("produit/{id}", arguments = listOf(navArgument("id") { type = NavType.IntType })) { entry ->
                val produit = store.produits.find { it.id == entry.arguments?.getInt("id") }
                if (produit != null) {
                    Details(produit, panier[produit.id] ?: 0, { store.ajouter(produit.id) }) { nav.popBackStack() }
                } else {
                    TextButton(onClick = { nav.popBackStack() }) { Text("Produit introuvable · Retour") }
                }
            }
            composable("panier") {
                Panier(store.produits, panier, store::retirer) { nav.popBackStack() }
            }
        }
    }
}

@Composable
private fun Catalogue(produits: List<Produit>, ouvrir: (Int) -> Unit) {
    LazyVerticalGrid(
        columns = GridCells.Adaptive(142.dp), contentPadding = PaddingValues(16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp), verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        items(produits, key = { it.id }) { produit ->
            ElevatedCard(onClick = { ouvrir(produit.id) }) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(produit.titre, style = MaterialTheme.typography.titleMedium)
                    Text(prix(produit.prixCentimes), color = MaterialTheme.colorScheme.primary)
                    Text("Voir le produit")
                }
            }
        }
    }
}

@Composable
private fun Details(produit: Produit, quantite: Int, ajouter: () -> Unit, retour: () -> Unit) {
    Column(Modifier.fillMaxWidth().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        TextButton(onClick = retour) { Text("Retour au catalogue") }
        Text(produit.titre, style = MaterialTheme.typography.headlineMedium)
        Text(produit.description)
        Text(prix(produit.prixCentimes), color = MaterialTheme.colorScheme.primary)
        Button(onClick = ajouter, enabled = quantite < 99) { Text("Ajouter au panier") }
        Text("Quantité dans le panier : $quantite")
    }
}

@Composable
private fun Panier(produits: List<Produit>, panier: Map<Int, Int>, retirer: (Int) -> Unit, retour: () -> Unit) {
    val lignes = produits.filter { it.id in panier }
    val total = lignes.sumOf { it.prixCentimes * panier.getValue(it.id) }
    LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item {
            TextButton(onClick = retour) { Text("Retour") }
            Text("Mon panier", style = MaterialTheme.typography.headlineMedium)
            if (lignes.isEmpty()) Text("Ton panier est vide.")
        }
        items(lignes, key = { it.id }) { produit ->
            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("${"$"}{produit.titre} × ${"$"}{panier.getValue(produit.id)}")
                    TextButton(onClick = { retirer(produit.id) }) { Text("Retirer une unité") }
                }
            }
        }
        item { Text("Total : ${"$"}{prix(total)}", style = MaterialTheme.typography.titleLarge) }
    }
}
`,
    notes:
      "Ouvre un produit, ajoute-le, passe au panier et reviens au catalogue. Le panier de démonstration vit dans le ViewModel pendant la session de l’application.",
  }),
};

const tasks: WebProject = {
  id: "taches-animees-compose",
  title: "Le gestionnaire de tâches animé",
  description:
    "Ajoute, termine et retire des tâches avec des transitions qui accompagnent les changements d’état.",
  minutes: 85,
  requirements: [
    "Faire apparaître une nouvelle tâche avec une transition.",
    "Animer la couleur quand une tâche passe à l’état terminé.",
    "Attendre la fin de la transition de sortie avant de retirer la ligne.",
  ],
  hints: [
    "Garde une clé stable pour chaque tâche.",
    "MutableTransitionState indique quand l’animation est inactive.",
  ],
  files: composeFiles("Tâches animées", {
    appId: "taches",
    advanced: true,
    extra: {
      [`${composePath}/TasksViewModel.kt`]: `package devafrica.atelier

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class Tache(val id: Int, val titre: String, val terminee: Boolean = false, val retiree: Boolean = false)

class TasksViewModel : ViewModel() {
    private val _taches = MutableStateFlow(listOf(Tache(1, "Essayer une animation Compose")))
    val taches = _taches.asStateFlow()
    private var prochainId = 2

    fun ajouter(titre: String) {
        val texte = titre.trim()
        if (texte.isEmpty() || texte.length > 80 || _taches.value.size >= 20) return
        val tache = Tache(prochainId++, texte)
        _taches.update { it + tache }
    }

    fun cocher(id: Int, done: Boolean) {
        _taches.update { liste -> liste.map { if (it.id == id) it.copy(terminee = done) else it } }
    }

    fun retirer(id: Int) {
        _taches.update { liste -> liste.map { if (it.id == id) it.copy(retiree = true) else it } }
    }

    fun finirRetrait(id: Int) {
        _taches.update { liste -> liste.filterNot { it.id == id && it.retiree } }
    }
}
`,
    },
    screen: `package devafrica.atelier

import androidx.compose.animation.*
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun AtelierScreen(tasks: TasksViewModel = viewModel()) {
    val taches by tasks.taches.collectAsStateWithLifecycle()
    var draft by rememberSaveable { mutableStateOf("") }

    Column(
        Modifier.fillMaxSize().safeDrawingPadding().imePadding()
            .verticalScroll(rememberScrollState()).padding(18.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Mes tâches", style = MaterialTheme.typography.headlineMedium)
        OutlinedTextField(value = draft, onValueChange = { if (it.length <= 80) draft = it },
            modifier = Modifier.fillMaxWidth(), label = { Text("Nouvelle tâche") }, singleLine = true)
        Button(enabled = draft.isNotBlank() && taches.size < 20, onClick = { tasks.ajouter(draft); draft = "" }) {
            Text("Ajouter")
        }
        if (taches.isEmpty()) Text("Aucune tâche. Ajoute la première.")
        taches.forEach { tache ->
            key(tache.id) {
                LigneAnimee(tache, { tasks.cocher(tache.id, it) }, { tasks.retirer(tache.id) },
                    { tasks.finirRetrait(tache.id) })
            }
        }
    }
}

@Composable
private fun LigneAnimee(tache: Tache, cocher: (Boolean) -> Unit, retirer: () -> Unit, fin: () -> Unit) {
    val visible = remember(tache.id) { MutableTransitionState(false).apply { targetState = !tache.retiree } }
    val onFinish by rememberUpdatedState(fin)
    LaunchedEffect(tache.retiree) { visible.targetState = !tache.retiree }
    LaunchedEffect(tache.retiree, visible.isIdle, visible.currentState) {
        if (tache.retiree && visible.isIdle && !visible.currentState) onFinish()
    }
    val color by animateColorAsState(
        targetValue = if (tache.terminee) MaterialTheme.colorScheme.tertiaryContainer else MaterialTheme.colorScheme.surfaceVariant,
        animationSpec = tween(280), label = "couleur de la tâche",
    )

    AnimatedVisibility(
        visibleState = visible,
        enter = fadeIn(tween(240)) + expandVertically(tween(240)),
        exit = fadeOut(tween(240)) + shrinkVertically(tween(240)),
    ) {
        Surface(color = color, shape = RoundedCornerShape(14.dp), modifier = Modifier.fillMaxWidth()) {
            Row(Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
                Checkbox(checked = tache.terminee, onCheckedChange = cocher, enabled = !tache.retiree)
                Text(tache.titre, modifier = Modifier.weight(1f))
                TextButton(onClick = retirer, enabled = !tache.retiree) { Text("Retirer") }
            }
        }
    }
}
`,
    notes:
      "Ajoute une tâche, coche-la puis retire-la. La suppression définitive intervient après l’animation de sortie.",
  }),
};

export const composeAdvancedProjects = [shop, tasks];
