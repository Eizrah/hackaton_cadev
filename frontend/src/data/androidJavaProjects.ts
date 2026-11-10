import {
  androidRes,
  javaAndroidFiles,
  javaAndroidPath,
  recyclerView,
  scrollLayout,
} from "./androidJavaAuthoring";
import type { WebProject } from "./webCourseTypes";

function scoreCard(team: string, title: string) {
  return `        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
            android:layout_marginTop="16dp" android:orientation="vertical"
            android:background="@drawable/card" android:padding="16dp">
            <TextView android:layout_width="match_parent" android:layout_height="wrap_content"
                android:text="${title}" android:textSize="18sp" />
            <TextView android:id="@+id/score_${team}" android:layout_width="match_parent"
                android:layout_height="wrap_content" android:text="0" android:textSize="38sp" />
            <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
                android:orientation="horizontal">
                <Button android:id="@+id/${team}_plus_one" android:layout_width="0dp"
                    android:layout_weight="1" android:layout_height="wrap_content"
                    android:contentDescription="${title}, ajouter 1 point" android:text="+1" />
                <Button android:id="@+id/${team}_plus_three" android:layout_width="0dp"
                    android:layout_weight="1" android:layout_height="wrap_content"
                    android:contentDescription="${title}, ajouter 3 points" android:text="+3" />
            </LinearLayout>
        </LinearLayout>`;
}

export const javaAndroidBeginnerProjects: WebProject[] = [
  {
    id: "score-match-java",
    title: "Le tableau de scores",
    description:
      "Utilise Java et des vues XML pour compter les points d’un match entre deux équipes.",
    minutes: 70,
    requirements: [
      "Affiche les deux équipes et leur score sur le même écran.",
      "Ajoute 1 ou 3 points à l’équipe correspondante sans modifier l’autre score.",
      "Fais pivoter l’émulateur et retrouve le score en cours.",
    ],
    hints: [
      "Relie un TextView XML à une variable Java via son identifiant R.id.",
      "Un objet Score garde les points de chaque équipe. Une méthode actualise les deux textes.",
      "Écris les deux nombres dans le Bundle avant la recréation de l’activité.",
    ],
    files: javaAndroidFiles("Tableau de scores", {
      id: "score",
      notes:
        "Teste +1 puis +3 pour la première équipe et +3 pour la seconde. Tu dois voir 4 et 3. Fais pivoter l’appareil et vérifie que les deux nombres restent affichés.",
      layout:
        scrollLayout(`        <TextView style="@style/AtelierTitle" android:text="Tableau de scores" />
${scoreCard("a", "Équipe A")}
${scoreCard("b", "Équipe B")}`),
      activity: `package devafrica.atelier;

import android.os.Bundle;
import android.widget.TextView;

public class MainActivity extends AtelierActivity {
    private final Score equipeA = new Score();
    private final Score equipeB = new Score();
    private TextView scoreA;
    private TextView scoreB;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showLayout(R.layout.activity_main);
        scoreA = findViewById(R.id.score_a);
        scoreB = findViewById(R.id.score_b);
        if (savedInstanceState != null) {
            equipeA.add(savedInstanceState.getInt("scoreA"));
            equipeB.add(savedInstanceState.getInt("scoreB"));
        }
        findViewById(R.id.a_plus_one).setOnClickListener(view -> add(equipeA, 1));
        findViewById(R.id.a_plus_three).setOnClickListener(view -> add(equipeA, 3));
        findViewById(R.id.b_plus_one).setOnClickListener(view -> add(equipeB, 1));
        findViewById(R.id.b_plus_three).setOnClickListener(view -> add(equipeB, 3));
        renderScores();
    }

    private void add(Score score, int points) {
        score.add(points);
        renderScores();
    }

    private void renderScores() {
        scoreA.setText(String.valueOf(equipeA.points()));
        scoreB.setText(String.valueOf(equipeB.points()));
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putInt("scoreA", equipeA.points());
        outState.putInt("scoreB", equipeB.points());
        super.onSaveInstanceState(outState);
    }
}
`,
      extra: {
        [`${javaAndroidPath}/Score.java`]: `package devafrica.atelier;

final class Score {
    private int points;

    void add(int value) {
        points += value;
    }

    int points() {
        return points;
    }
}
`,
      },
    }),
  },
  {
    id: "connexion-java-intent",
    title: "La connexion en deux écrans",
    description:
      "Valide des identifiants de démonstration, puis transmets le nom au deuxième écran avec un Intent explicite.",
    minutes: 80,
    requirements: [
      "Crée deux champs, dont un champ de mot de passe masqué.",
      "Affiche une erreur pour un identifiant incorrect et teste le compte de démonstration.",
      "Ouvre l’accueil et personnalise son texte avec le nom transmis par l’Intent.",
    ],
    hints: [
      "Déclare les deux activités dans le manifeste. Seule MainActivity est un point d’entrée public.",
      "Les identifiants publics pour cet exercice sont demo et DevAfrica17.",
      "Envoie le nom avec putExtra. Le mot de passe reste dans le formulaire local.",
    ],
    files: javaAndroidFiles("Connexion DevAfrica", {
      id: "connexion",
      activities: ["WelcomeActivity"],
      dependencies: ["androidx.constraintlayout:constraintlayout:2.2.1"],
      notes:
        "Identifiants publics de démonstration : demo / DevAfrica17. Le formulaire s’exécute entièrement sur l’appareil. Pour une application réelle, la vérification de l’identité se fait via le service d’authentification.",
      layout:
        scrollLayout(`        <TextView style="@style/AtelierTitle" android:text="Accès à ton espace" />
        <TextView android:layout_width="match_parent" android:layout_height="wrap_content"
            android:layout_marginTop="10dp" android:text="Compte de démonstration • demo / DevAfrica17" />
        <EditText android:id="@+id/username" android:layout_width="match_parent"
            android:layout_height="wrap_content" android:layout_marginTop="16dp"
            android:inputType="textNoSuggestions" android:singleLine="true" android:hint="Identifiant" />
        <EditText android:id="@+id/password" android:layout_width="match_parent"
            android:layout_height="wrap_content" android:inputType="textPassword"
            android:singleLine="true" android:hint="Mot de passe" android:saveEnabled="false" />
        <Button android:id="@+id/sign_in" android:layout_width="match_parent"
            android:layout_height="wrap_content" android:text="Se connecter" />
        <TextView android:id="@+id/login_error" android:layout_width="match_parent"
            android:layout_height="wrap_content" android:accessibilityLiveRegion="polite"
            android:textColor="#982C35" />`),
      activity: `package devafrica.atelier;

import android.content.Intent;
import android.os.Bundle;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends AtelierActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showLayout(R.layout.activity_main);

        EditText username = findViewById(R.id.username);
        EditText password = findViewById(R.id.password);
        TextView error = findViewById(R.id.login_error);
        findViewById(R.id.sign_in).setOnClickListener(view -> {
            String name = username.getText().toString().trim();
            if (!name.equals("demo") || !password.getText().toString().equals("DevAfrica17")) {
                error.setText("Identifiant ou mot de passe incorrect.");
                return;
            }
            error.setText("");
            password.setText("");
            Intent welcome = new Intent(this, WelcomeActivity.class);
            welcome.putExtra(WelcomeActivity.EXTRA_NAME, name);
            startActivity(welcome);
        });
    }
}
`,
      extra: {
        [`${javaAndroidPath}/WelcomeActivity.java`]: `package devafrica.atelier;

import android.os.Bundle;
import android.widget.TextView;

public class WelcomeActivity extends AtelierActivity {
    static final String EXTRA_NAME = "devafrica.atelier.NAME";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showLayout(R.layout.activity_welcome);
        String name = getIntent().getStringExtra(EXTRA_NAME);
        TextView message = findViewById(R.id.welcome);
        message.setText("Bienvenue, " + (name == null ? "développeur" : name) + " !");
        findViewById(R.id.back).setOnClickListener(view -> finish());
    }
}
`,
        [`${androidRes}/layout/activity_welcome.xml`]: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto" android:id="@+id/screen"
    android:layout_width="match_parent" android:layout_height="match_parent">
    <TextView android:id="@+id/welcome" android:layout_width="0dp" android:layout_height="wrap_content"
        android:layout_margin="24dp" android:gravity="center" android:textSize="28sp"
        android:textStyle="bold" app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@id/back" app:layout_constraintVertical_chainStyle="packed"
        app:layout_constraintStart_toStartOf="parent" app:layout_constraintEnd_toEndOf="parent" />
    <Button android:id="@+id/back" android:layout_width="wrap_content" android:layout_height="wrap_content"
        android:text="Retour à la connexion" app:layout_constraintTop_toBottomOf="@id/welcome"
        app:layout_constraintBottom_toBottomOf="parent" app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
`,
      },
    }),
  },
];

const notesLayout = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/screen" android:layout_width="match_parent" android:layout_height="match_parent"
    android:orientation="vertical">
    <Toolbar android:id="@+id/toolbar" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:minHeight="56dp" android:title="Carnet de notes" />
    <TextView android:id="@+id/latest" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:padding="16dp"
        android:accessibilityLiveRegion="polite" />
    <Button android:id="@+id/add_note" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:layout_margin="12dp" android:text="Ajouter une note" />
    <androidx.recyclerview.widget.RecyclerView android:id="@+id/notes" android:layout_width="match_parent"
        android:layout_height="0dp" android:layout_weight="1" android:padding="12dp"
        android:clipToPadding="false" />
</LinearLayout>
`;

const noteRow = `<?xml version="1.0" encoding="utf-8"?>
<TextView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/note_title" android:layout_width="match_parent"
    android:layout_height="wrap_content" android:layout_marginBottom="8dp"
    android:padding="16dp" android:background="@drawable/card" android:textSize="17sp" />
`;

const notesAdapter = `package devafrica.atelier;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

final class NoteAdapter extends RecyclerView.Adapter<NoteAdapter.NoteHolder> {
    private final List<String> notes;

    NoteAdapter(List<String> notes) {
        this.notes = notes;
    }

    @Override
    public NoteHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        TextView title = (TextView) LayoutInflater.from(parent.getContext())
                .inflate(R.layout.row_note, parent, false);
        return new NoteHolder(title);
    }

    @Override
    public void onBindViewHolder(NoteHolder holder, int position) {
        holder.title.setText(notes.get(position));
    }

    @Override
    public int getItemCount() {
        return notes.size();
    }

    static final class NoteHolder extends RecyclerView.ViewHolder {
        final TextView title;

        NoteHolder(TextView title) {
            super(title);
            this.title = title;
        }
    }
}
`;

const notesActivity = `package devafrica.atelier;

import android.app.AlertDialog;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.InputFilter;
import android.widget.EditText;
import android.widget.TextView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONException;

public class MainActivity extends AtelierActivity {
    private static final String KEY_TITLES = "titles";
    private static final int LIMIT = 100;

    private final ArrayList<String> titles = new ArrayList<>();
    private SharedPreferences preferences;
    private NoteAdapter adapter;
    private TextView latest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showLayout(R.layout.activity_main);
        preferences = getSharedPreferences("carnet", MODE_PRIVATE);
        restoreNotes();
        latest = findViewById(R.id.latest);
        RecyclerView list = findViewById(R.id.notes);
        list.setLayoutManager(new LinearLayoutManager(this));
        adapter = new NoteAdapter(titles);
        list.setAdapter(adapter);
        updateLatest();
        findViewById(R.id.add_note).setOnClickListener(view -> showNoteForm());
    }

    private void restoreNotes() {
        try {
            JSONArray stored = new JSONArray(preferences.getString(KEY_TITLES, "[]"));
            for (int i = 0; i < stored.length(); i++) titles.add(stored.getString(i));
        } catch (JSONException error) {
            titles.clear();
        }
    }

    private void updateLatest() {
        latest.setText(titles.isEmpty() ? "Ajoute ta première note."
                : "Dernière note : " + titles.get(0));
    }

    private void showNoteForm() {
        if (titles.size() >= LIMIT) {
            new AlertDialog.Builder(this).setMessage("Limite de 100 notes atteinte.")
                    .setPositiveButton("Fermer", null).show();
            return;
        }
        EditText input = new EditText(this);
        input.setHint("Titre de la note");
        input.setSingleLine(true);
        input.setFilters(new InputFilter[]{new InputFilter.LengthFilter(120)});
        AlertDialog dialog = new AlertDialog.Builder(this).setTitle("Nouvelle note")
                .setView(input).setNegativeButton("Annuler", null)
                .setPositiveButton("Enregistrer", null).create();
        dialog.show();
        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(view -> {
            String title = input.getText().toString().trim();
            if (title.isEmpty()) {
                input.setError("Saisis un titre.");
                return;
            }
            titles.add(0, title);
            preferences.edit().putString(KEY_TITLES, new JSONArray(titles).toString()).apply();
            adapter.notifyItemInserted(0);
            ((RecyclerView) findViewById(R.id.notes)).scrollToPosition(0);
            updateLatest();
            dialog.dismiss();
        });
    }
}
`;

const moviesLayout = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/screen" android:layout_width="match_parent" android:layout_height="match_parent"
    android:orientation="vertical">
    <Toolbar android:id="@+id/toolbar" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:minHeight="56dp" android:title="Carnet cinéma" />
    <androidx.recyclerview.widget.RecyclerView android:id="@+id/movies" android:layout_width="match_parent"
        android:layout_height="0dp" android:layout_weight="1" android:padding="8dp"
        android:clipToPadding="false" />
</LinearLayout>
`;

const movieRow = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_margin="6dp"
    android:orientation="vertical" android:padding="8dp" android:background="@drawable/card">
    <ImageView android:id="@+id/poster" android:layout_width="match_parent" android:layout_height="96dp"
        android:scaleType="centerCrop" android:importantForAccessibility="no" />
    <TextView android:id="@+id/movie_title" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:layout_marginTop="8dp" android:textStyle="bold"
        android:textSize="17sp" />
    <Button android:id="@+id/view_movie" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:text="Voir" />
</LinearLayout>
`;

const moviesActivity = `package devafrica.atelier;

import android.app.AlertDialog;
import android.os.Bundle;
import android.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends AtelierActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showLayout(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.toolbar);
        toolbar.getMenu().add("À propos");
        toolbar.setOnMenuItemClickListener(item -> {
            new AlertDialog.Builder(this).setTitle("Le catalogue")
                    .setMessage("Quatre films fictifs illustrent la grille de l’atelier.")
                    .setPositiveButton("Fermer", null).show();
            return true;
        });

        RecyclerView list = findViewById(R.id.movies);
        int width = getResources().getConfiguration().screenWidthDp;
        list.setLayoutManager(new GridLayoutManager(this, width >= 600 ? 3 : width >= 330 ? 2 : 1));
        List<Movie> movies = Arrays.asList(
                new Movie("Les vents de l’Est", "Deux amis restaurent un ancien voilier.",
                        R.drawable.poster_ocean),
                new Movie("Midi à Tana", "Une étudiante mène une enquête dans la ville.",
                        R.drawable.poster_city),
                new Movie("La montagne bleue", "Une équipe cartographie une vallée isolée.",
                        R.drawable.poster_ocean),
                new Movie("Atelier nocturne", "Un collectif imagine son premier jeu vidéo.",
                        R.drawable.poster_city));
        list.setAdapter(new MovieAdapter(movies, movie -> new AlertDialog.Builder(this)
                .setTitle(movie.title).setMessage(movie.summary).setPositiveButton("Fermer", null).show()));
    }
}
`;

const movieModel = `package devafrica.atelier;

final class Movie {
    final String title;
    final String summary;
    final int poster;

    Movie(String title, String summary, int poster) {
        this.title = title;
        this.summary = summary;
        this.poster = poster;
    }
}
`;

const movieAdapter = `package devafrica.atelier;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

final class MovieAdapter extends RecyclerView.Adapter<MovieAdapter.MovieHolder> {
    interface OnMovieClick {
        void open(Movie movie);
    }

    private final List<Movie> movies;
    private final OnMovieClick onMovieClick;

    MovieAdapter(List<Movie> movies, OnMovieClick onMovieClick) {
        this.movies = movies;
        this.onMovieClick = onMovieClick;
    }

    @Override
    public MovieHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        return new MovieHolder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.row_movie, parent, false));
    }

    @Override
    public void onBindViewHolder(MovieHolder holder, int position) {
        Movie movie = movies.get(position);
        holder.title.setText(movie.title);
        holder.poster.setImageResource(movie.poster);
        holder.open.setContentDescription("Voir " + movie.title);
        holder.open.setOnClickListener(view -> onMovieClick.open(movie));
    }

    @Override
    public int getItemCount() {
        return movies.size();
    }

    static final class MovieHolder extends RecyclerView.ViewHolder {
        final TextView title;
        final ImageView poster;
        final Button open;

        MovieHolder(View view) {
            super(view);
            title = view.findViewById(R.id.movie_title);
            poster = view.findViewById(R.id.poster);
            open = view.findViewById(R.id.view_movie);
        }
    }
}
`;

function poster(sky: string, foreground: string, path: string) {
  return `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="120dp" android:height="96dp" android:viewportWidth="120" android:viewportHeight="96">
    <path android:fillColor="${sky}" android:pathData="M0,0H120V96H0Z" />
    <path android:fillColor="${foreground}" android:pathData="${path}" />
    <path android:fillColor="#FFDB7B" android:pathData="M96,23a8,8 0,1 1,-16 0a8,8 0,1 1,16 0" />
</vector>
`;
}

export const javaAndroidIntermediateProjects: WebProject[] = [
  {
    id: "notes-java-recycler",
    title: "Le carnet de notes",
    description:
      "Affiche les titres dans un RecyclerView, puis retrouve la dernière note lors de la réouverture.",
    minutes: 90,
    requirements: [
      "Affiche une liste RecyclerView avec le titre de chaque note.",
      "Ajoute une note à partir d’un formulaire et bloque les titres vides.",
      "Relance l’application et vérifie que les notes et le dernier titre sont restaurés.",
    ],
    hints: [
      "Le XML row_note dessine une ligne. Le ViewHolder conserve une référence à son TextView.",
      "Le bouton positif d’un AlertDialog peut rester ouvert si le titre est invalide.",
      "Pour ce petit carnet, conserve le tableau de titres dans SharedPreferences sous forme de JSON.",
    ],
    files: javaAndroidFiles("Carnet de notes", {
      id: "notes",
      layout: notesLayout,
      activity: notesActivity,
      dependencies: [recyclerView],
      notes:
        "Ajoute deux notes, ferme complètement l’application et rouvre-la. L’atelier conserve jusqu’à 100 titres dans les préférences de l’application. Pour des notes volumineuses, utilise la base SQLite étudiée au niveau suivant.",
      extra: {
        [`${javaAndroidPath}/NoteAdapter.java`]: notesAdapter,
        [`${androidRes}/layout/row_note.xml`]: noteRow,
      },
    }),
  },
  {
    id: "films-java-grille",
    title: "Le catalogue de films",
    description:
      "Construis une grille avec des affiches locales et ouvre le synopsis de chaque film dans une boîte de dialogue.",
    minutes: 90,
    requirements: [
      "Affiche des cartes de film avec une illustration, un titre et le bouton Voir.",
      "Ouvre le résumé du film choisi dans un AlertDialog.",
      "Ajoute un menu À propos dans la Toolbar et teste une largeur de tablette.",
    ],
    hints: [
      "GridLayoutManager fixe le nombre de colonnes à partir de la largeur disponible.",
      "onBindViewHolder remplit tous les champs d’une carte quand elle est recyclée.",
      "Relie chaque clic au Movie courant pour afficher son résumé.",
    ],
    files: javaAndroidFiles("Catalogue de films", {
      id: "films",
      layout: moviesLayout,
      activity: moviesActivity,
      dependencies: [recyclerView],
      notes:
        "Les films et affiches de cet atelier sont fictifs. Ajoute un cinquième Movie dans MainActivity.java puis vérifie son titre et son résumé.",
      extra: {
        [`${javaAndroidPath}/Movie.java`]: movieModel,
        [`${javaAndroidPath}/MovieAdapter.java`]: movieAdapter,
        [`${androidRes}/layout/row_movie.xml`]: movieRow,
        [`${androidRes}/drawable/poster_ocean.xml`]: poster(
          "#9BD8F1",
          "#246599",
          "M0,72Q25,50 60,70T120,62V96H0Z",
        ),
        [`${androidRes}/drawable/poster_city.xml`]: poster(
          "#CAB9F4",
          "#434D8D",
          "M0,96V55H22V66H40V39H68V75H90V50H120V96Z",
        ),
      },
    }),
  },
];
