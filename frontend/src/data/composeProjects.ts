import {
  avatarDrawable,
  composeFiles,
  coverDrawable,
  iconDrawable,
} from "./composeAuthoring";
import type { WebProject } from "./webCourseTypes";

const profile: WebProject = {
  id: "profil-compose",
  title: "L’écran de profil",
  description:
    "Compose une carte de profil avec un portrait arrondi, du texte et une rangée d’icônes.",
  minutes: 50,
  requirements: [
    "Centrer le portrait, le nom et le métier dans une Column.",
    "Découper l’image en cercle et lui ajouter une bordure.",
    "Aligner des icônes décrites dans une Row.",
  ],
  hints: [
    "Le portrait est un drawable vectoriel fourni.",
    "Teste l’ordre de size, clip et border dans la chaîne Modifier.",
  ],
  files: composeFiles("Profil DevAfrica", {
    appId: "profil",
    extra: {
      "app/src/main/res/drawable/avatar.xml": avatarDrawable,
      "app/src/main/res/drawable/ic_people.xml": iconDrawable(
        "M7,10a3,3 0,1 0,0 -6a3,3 0,0 0,0 6M17,10a3,3 0,1 0,0 -6a3,3 0,0 0,0 6M1,20v-3a6,6 0,0 1,12 0v3zM14,20v-3a7,7 0,0 0,-1 -4a6,6 0,0 1,10 4v3z",
      ),
      "app/src/main/res/drawable/ic_portfolio.xml": iconDrawable(
        "M8,5V3h8v2h5v15H3V5zM10,5h4V4h-4zM5,8v3h14V8z",
      ),
      "app/src/main/res/drawable/ic_mail.xml": iconDrawable(
        "M2,4h20v16H2zM4,7l8,6l8,-6V6l-8,5L4,6z",
      ),
    },
    screen: `package devafrica.atelier

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

@Composable
fun AtelierScreen() {
    var selected by remember { mutableStateOf("") }
    Box(Modifier.fillMaxSize().safeDrawingPadding().padding(22.dp), contentAlignment = Alignment.Center) {
        ElevatedCard(Modifier.widthIn(max = 420.dp).fillMaxWidth()) {
            Column(
                Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                Text("MEMBRE DEVAFRICA", style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary)
                Image(
                    painter = painterResource(R.drawable.avatar),
                    contentDescription = "Portrait illustré d’Amina",
                    modifier = Modifier.size(112.dp).clip(CircleShape)
                        .border(3.dp, MaterialTheme.colorScheme.primary, CircleShape),
                    contentScale = ContentScale.Crop,
                )
                Text("Amina Dia", style = MaterialTheme.typography.headlineMedium)
                Text("Développeuse Android", style = MaterialTheme.typography.bodyLarge, textAlign = TextAlign.Center)
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    ProfileLink(R.drawable.ic_people, "Communauté") { selected = "Communauté DevAfrica" }
                    ProfileLink(R.drawable.ic_portfolio, "Portfolio") { selected = "Portfolio d’Amina" }
                    ProfileLink(R.drawable.ic_mail, "Contact") { selected = "Contact d’Amina" }
                }
                if (selected.isNotEmpty()) Text(selected, textAlign = TextAlign.Center)
            }
        }
    }
}

@Composable
private fun ProfileLink(icon: Int, label: String, onClick: () -> Unit) {
    FilledTonalIconButton(onClick = onClick) {
        Icon(painterResource(icon), contentDescription = label, modifier = Modifier.size(21.dp))
    }
}
`,
    notes:
      "Appuie sur les icônes pour afficher le nom du lien de démonstration. Essaie une autre taille de portrait et observe le rendu.",
  }),
};

const login: WebProject = {
  id: "connexion-compose",
  title: "L’interface de connexion",
  description:
    "Crée un formulaire mobile avec deux champs, un bouton principal et un retour visible après validation.",
  minutes: 50,
  requirements: [
    "Afficher les champs e-mail et mot de passe avec des libellés.",
    "Masquer le texte du mot de passe.",
    "Vérifier la saisie et afficher un message dans l’écran.",
  ],
  hints: [
    "OutlinedTextField reçoit value et onValueChange.",
    "Garde la saisie du mot de passe dans l’état de composition.",
  ],
  files: composeFiles("Connexion DevAfrica", {
    appId: "connexion",
    screen: `package devafrica.atelier

import android.util.Patterns
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp

@Composable
fun AtelierScreen() {
    var email by rememberSaveable { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var feedback by rememberSaveable { mutableStateOf("") }

    Box(Modifier.fillMaxSize().safeDrawingPadding().imePadding().padding(22.dp), contentAlignment = Alignment.Center) {
        ElevatedCard(Modifier.widthIn(max = 440.dp).fillMaxWidth()) {
            Column(
                Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(15.dp),
            ) {
                Text("DEVAFRICA", color = MaterialTheme.colorScheme.primary, style = MaterialTheme.typography.labelLarge)
                Text("Bon retour !", style = MaterialTheme.typography.headlineMedium)
                Text("Essaie le formulaire avec des données fictives.")
                OutlinedTextField(
                    value = email, onValueChange = { email = it; feedback = "" },
                    label = { Text("Adresse e-mail") }, modifier = Modifier.fillMaxWidth(),
                    singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
                )
                OutlinedTextField(
                    value = password, onValueChange = { password = it; feedback = "" },
                    label = { Text("Mot de passe") }, modifier = Modifier.fillMaxWidth(),
                    singleLine = true, visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                )
                Button(modifier = Modifier.fillMaxWidth(), onClick = {
                    feedback = when {
                        !Patterns.EMAIL_ADDRESS.matcher(email.trim()).matches() -> "Vérifie l’adresse e-mail."
                        password.length < 8 -> "Saisis au moins 8 caractères."
                        else -> { password = ""; "Saisie validée pour la démonstration." }
                    }
                }) { Text("Se connecter") }
                if (feedback.isNotEmpty()) Text(feedback)
            }
        }
    }
}
`,
    notes:
      "L’écran illustre la saisie et sa validation locale. Utilise un e-mail de test et un mot de passe fictif.",
  }),
};

export const composeBeginnerProjects = [profile, login];

const score: WebProject = {
  id: "score-compose",
  title: "Le compteur de score interactif",
  description:
    "Deux équipes, deux scores et des composants qui réagissent à chaque action.",
  minutes: 60,
  requirements: [
    "Incrémenter le score de la bonne équipe à chaque clic.",
    "Remettre les deux scores à zéro.",
    "Conserver les scores pendant un changement d’orientation.",
  ],
  hints: [
    "AtelierScreen possède les scores. ScoreCard reçoit le nombre et le callback.",
    "rememberSaveable peut restaurer un entier après recréation de l’activité.",
  ],
  files: composeFiles("Tableau des scores", {
    appId: "score",
    screen: `package devafrica.atelier

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

@Composable
fun AtelierScreen() {
    var blue by rememberSaveable { mutableIntStateOf(0) }
    var green by rememberSaveable { mutableIntStateOf(0) }

    Column(
        Modifier.fillMaxSize().safeDrawingPadding().verticalScroll(rememberScrollState()).padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(18.dp),
    ) {
        Text("Tableau des scores", style = MaterialTheme.typography.headlineMedium, textAlign = TextAlign.Center)
        Text("Attribue un point à chaque action.")
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            ScoreCard("Équipe bleue", blue, { if (blue < 999) blue++ }, Modifier.weight(1f))
            ScoreCard("Équipe verte", green, { if (green < 999) green++ }, Modifier.weight(1f))
        }
        OutlinedButton(onClick = { blue = 0; green = 0 }) { Text("Réinitialiser") }
    }
}

@Composable
private fun ScoreCard(team: String, score: Int, onScore: () -> Unit, modifier: Modifier = Modifier) {
    Card(modifier) {
        Column(
            Modifier.fillMaxWidth().padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text(team, style = MaterialTheme.typography.titleSmall, textAlign = TextAlign.Center)
            Text(score.toString(), style = MaterialTheme.typography.displayMedium, color = MaterialTheme.colorScheme.primary)
            Button(onClick = onScore, enabled = score < 999) { Text("+1") }
        }
    }
}
`,
    notes:
      "Attribue un point, tourne l’appareil, puis vérifie les scores. Réinitialise-les depuis l’écran.",
  }),
};

const feed: WebProject = {
  id: "actualites-compose",
  title: "Le flux d’actualités déroulant",
  description:
    "Assemble un Scaffold, une liste d’articles, des catégories et une vue de favoris.",
  minutes: 75,
  requirements: [
    "Afficher une barre de titre, une navigation basse et un bouton flottant.",
    "Afficher des cartes avec image, titre et description dans une LazyColumn.",
    "Filtrer les cartes et afficher les articles enregistrés.",
  ],
  hints: [
    "Applique le padding fourni par Scaffold au contenu.",
    "Les identifiants des articles servent de clés stables dans items.",
  ],
  files: composeFiles("Actualités DevAfrica", {
    appId: "actualites",
    extra: {
      "app/src/main/res/drawable/news_cover.xml": coverDrawable,
      "app/src/main/res/drawable/ic_feed.xml": iconDrawable(
        "M3,3h18v18H3zM5,5v4h14V5zM5,11v2h14v-2zM5,15v2h10v-2z",
      ),
      "app/src/main/res/drawable/ic_bookmark.xml": iconDrawable(
        "M6,2h12v20l-6,-4l-6,4z",
      ),
      "app/src/main/res/drawable/ic_up.xml": iconDrawable(
        "M12,4l7,7l-2,2l-4,-4v11h-2V9l-4,4l-2,-2z",
      ),
    },
    screen: `package devafrica.atelier

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

private data class Article(val id: Int, val title: String, val topic: String, val summary: String)
private val topics = listOf("Android", "Web", "Communauté")
private val articles = List(24) { index ->
    val topic = topics[index % topics.size]
    val title = when (topic) {
        "Android" -> "Construire un écran Compose"
        "Web" -> "Comprendre une requête HTTP"
        else -> "Présenter un mini-projet"
    }
    Article(index + 1, "$title · ${"$"}{index + 1}", topic, "Une idée et un exercice pour progresser avec DevAfrica.")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AtelierScreen() {
    var topic by rememberSaveable { mutableStateOf("Tout") }
    var savedOnly by rememberSaveable { mutableStateOf(false) }
    var saved by rememberSaveable { mutableStateOf(arrayListOf<Int>()) }
    val state = rememberLazyListState()
    val scope = rememberCoroutineScope()
    val shown = articles.filter { (topic == "Tout" || it.topic == topic) && (!savedOnly || it.id in saved) }
    LaunchedEffect(topic, savedOnly) { state.scrollToItem(0) }

    Scaffold(
        topBar = { TopAppBar(title = { Text("DevAfrica Actualités") }) },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(selected = !savedOnly, onClick = { savedOnly = false },
                    icon = { Icon(painterResource(R.drawable.ic_feed), null) }, label = { Text("Actualités") })
                NavigationBarItem(selected = savedOnly, onClick = { savedOnly = true },
                    icon = { Icon(painterResource(R.drawable.ic_bookmark), null) }, label = { Text("Favoris") })
            }
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { scope.launch { state.animateScrollToItem(0) } }) {
                Icon(painterResource(R.drawable.ic_up), "Revenir en haut")
            }
        },
    ) { padding ->
        LazyColumn(
            state = state, modifier = Modifier.fillMaxSize().padding(padding).consumeWindowInsets(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 10.dp, bottom = 92.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            item {
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(listOf("Tout") + topics) { label ->
                        FilterChip(selected = topic == label, onClick = { topic = label }, label = { Text(label) })
                    }
                }
            }
            if (shown.isEmpty()) item { Text("Aucun article dans cette sélection.") }
            items(shown, key = { it.id }) { article ->
                ArticleCard(article, article.id in saved) {
                    saved = if (article.id in saved) ArrayList(saved.filterNot { it == article.id })
                        else ArrayList(saved + article.id)
                }
            }
        }
    }
}

@Composable
private fun ArticleCard(article: Article, saved: Boolean, toggle: () -> Unit) {
    Card(Modifier.fillMaxWidth()) {
        Image(painterResource(R.drawable.news_cover), null,
            modifier = Modifier.fillMaxWidth().height(104.dp), contentScale = ContentScale.Crop)
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) {
            Text(article.topic, color = MaterialTheme.colorScheme.primary)
            Text(article.title, style = MaterialTheme.typography.titleMedium)
            Text(article.summary)
            TextButton(onClick = toggle) { Text(if (saved) "Retirer des favoris" else "Enregistrer") }
        }
    }
}
`,
    notes:
      "Enregistre un article, puis ouvre Favoris. Les articles sont des données fictives disponibles hors connexion.",
  }),
};

export const composeIntermediateProjects = [score, feed];
