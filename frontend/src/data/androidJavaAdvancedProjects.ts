import {
  androidRes,
  javaAndroidFiles,
  javaAndroidPath,
  recyclerView,
  retrofit,
  scrollLayout,
} from "./androidJavaAuthoring";
import type { WebProject } from "./webCourseTypes";

const weatherApi = `package devafrica.atelier;

import com.google.gson.annotations.SerializedName;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

interface WeatherApi {
    @GET("v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=GMT")
    Call<Forecast> current(@Query("latitude") double latitude,
                           @Query("longitude") double longitude);

    final class Forecast {
        Current current;
    }

    final class Current {
        String time;
        @SerializedName("temperature_2m") Double temperature;
        @SerializedName("relative_humidity_2m") Integer humidity;
        @SerializedName("wind_speed_10m") Double wind;

        boolean complete() {
            return time != null && temperature != null && humidity != null && wind != null;
        }
    }
}
`;

const weatherCache = `package devafrica.atelier;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

final class WeatherCache extends SQLiteOpenHelper {
    static final class Snapshot {
        final String place;
        final String time;
        final double temperature;
        final int humidity;
        final double wind;

        Snapshot(String place, String time, double temperature, int humidity, double wind) {
            this.place = place;
            this.time = time;
            this.temperature = temperature;
            this.humidity = humidity;
            this.wind = wind;
        }
    }

    WeatherCache(Context context) {
        super(context, "weather.db", null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE weather (id INTEGER PRIMARY KEY, place TEXT NOT NULL, "
                + "time TEXT NOT NULL, temperature REAL NOT NULL, humidity INTEGER NOT NULL, wind REAL NOT NULL)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // Ajoute une migration ici si la structure change dans une prochaine version.
    }

    void save(Snapshot snapshot) {
        ContentValues values = new ContentValues();
        values.put("id", 1);
        values.put("place", snapshot.place);
        values.put("time", snapshot.time);
        values.put("temperature", snapshot.temperature);
        values.put("humidity", snapshot.humidity);
        values.put("wind", snapshot.wind);
        getWritableDatabase().replaceOrThrow("weather", null, values);
    }

    Snapshot read() {
        String[] columns = {"place", "time", "temperature", "humidity", "wind"};
        try (Cursor cursor = getReadableDatabase().query(
                "weather", columns, "id = ?", new String[]{"1"}, null, null, null)) {
            if (!cursor.moveToFirst()) return null;
            return new Snapshot(cursor.getString(0), cursor.getString(1),
                    cursor.getDouble(2), cursor.getInt(3), cursor.getDouble(4));
        }
    }
}
`;

const weatherActivity = String.raw`package devafrica.atelier;

import android.Manifest;
import android.content.pm.PackageManager;
import android.database.sqlite.SQLiteException;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.widget.Button;
import android.widget.TextView;
import androidx.core.content.ContextCompat;
import androidx.core.location.LocationManagerCompat;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AtelierActivity {
    private static final String COARSE = Manifest.permission.ACCESS_COARSE_LOCATION;
    private static final String FINE = Manifest.permission.ACCESS_FINE_LOCATION;
    private static final int LOCATION_REQUEST = 31;

    private final ExecutorService storage = Executors.newSingleThreadExecutor();
    private WeatherApi api;
    private WeatherCache cache;
    private Call<WeatherApi.Forecast> request;
    private CancellationSignal locationCancellation;
    private TextView status;
    private TextView readings;
    private Button city;
    private Button locate;
    private WeatherCache.Snapshot displayed;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showLayout(R.layout.activity_main);
        status = findViewById(R.id.weather_status);
        readings = findViewById(R.id.readings);
        city = findViewById(R.id.refresh_city);
        locate = findViewById(R.id.locate);
        cache = new WeatherCache(getApplicationContext());
        api = new Retrofit.Builder().baseUrl("https://api.open-meteo.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build().create(WeatherApi.class);

        city.setOnClickListener(view -> refresh("Toamasina", -18.15, 49.40));
        locate.setOnClickListener(view -> requestLocation());
        loading("Lecture de la météo enregistrée…");
        storage.execute(() -> {
            try {
                WeatherCache.Snapshot saved = cache.read();
                runOnUiThread(() -> {
                    if (isDestroyed()) return;
                    if (saved == null) {
                        ready("Choisis une ville ou utilise ta position.");
                    } else {
                        showSnapshot(saved, "Dernière météo enregistrée · disponible hors ligne");
                    }
                });
            } catch (SQLiteException error) {
                runOnUiThread(() -> ready("Lecture du cache indisponible."));
            }
        });
    }

    private void requestLocation() {
        if (checkSelfPermission(COARSE) != PackageManager.PERMISSION_GRANTED
                && checkSelfPermission(FINE) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{COARSE, FINE}, LOCATION_REQUEST);
            return;
        }
        locateOnce();
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(code, permissions, results);
        if (code != LOCATION_REQUEST) return;
        if (checkSelfPermission(COARSE) == PackageManager.PERMISSION_GRANTED
                || checkSelfPermission(FINE) == PackageManager.PERMISSION_GRANTED) {
            locateOnce();
        } else {
            ready("Position refusée. La météo de Toamasina reste disponible.");
        }
    }

    private void locateOnce() {
        LocationManager manager = getSystemService(LocationManager.class);
        boolean precise = checkSelfPermission(FINE) == PackageManager.PERMISSION_GRANTED;
        String provider = precise && manager.isProviderEnabled(LocationManager.GPS_PROVIDER)
                ? LocationManager.GPS_PROVIDER : LocationManager.NETWORK_PROVIDER;
        if (!manager.isProviderEnabled(provider)) {
            ready("Active la localisation ou choisis Toamasina.");
            return;
        }

        loading("Recherche de ta position…");
        locationCancellation = new CancellationSignal();
        try {
            LocationManagerCompat.getCurrentLocation(manager, provider, locationCancellation,
                    ContextCompat.getMainExecutor(this), this::onLocation);
        } catch (SecurityException | IllegalArgumentException error) {
            ready("Position indisponible. Choisis Toamasina.");
        }
    }

    private void onLocation(Location location) {
        if (isDestroyed()) return;
        locationCancellation = null;
        if (location == null) {
            ready("Position introuvable. Réessaie ou choisis Toamasina.");
            return;
        }
        // La météo utilise une position arrondie, de précision kilométrique.
        double latitude = Math.round(location.getLatitude() * 100) / 100.0;
        double longitude = Math.round(location.getLongitude() * 100) / 100.0;
        refresh("Près de toi", latitude, longitude);
    }

    private void refresh(String place, double latitude, double longitude) {
        loading("Mise à jour de la météo…");
        request = api.current(latitude, longitude);
        request.timeout().timeout(15, TimeUnit.SECONDS);
        request.enqueue(new Callback<WeatherApi.Forecast>() {
            @Override
            public void onResponse(Call<WeatherApi.Forecast> call, Response<WeatherApi.Forecast> response) {
                if (isDestroyed() || call.isCanceled()) return;
                WeatherApi.Forecast body = response.body();
                if (!response.isSuccessful() || body == null || body.current == null || !body.current.complete()) {
                    updateFailed();
                    return;
                }
                WeatherApi.Current current = body.current;
                WeatherCache.Snapshot snapshot = new WeatherCache.Snapshot(place, current.time,
                        current.temperature, current.humidity, current.wind);
                storage.execute(() -> {
                    String label;
                    try {
                        cache.save(snapshot);
                        label = "Météo actualisée · source Open-Meteo";
                    } catch (SQLiteException error) {
                        label = "Météo actualisée · stockage local indisponible";
                    }
                    String message = label;
                    runOnUiThread(() -> showSnapshot(snapshot, message));
                });
            }

            @Override
            public void onFailure(Call<WeatherApi.Forecast> call, Throwable error) {
                if (!call.isCanceled()) updateFailed();
            }
        });
    }

    private void updateFailed() {
        ready(displayed == null ? "Mise à jour indisponible. Connecte-toi puis réessaie."
                : "Mise à jour indisponible. La dernière mesure reste affichée.");
    }

    private void showSnapshot(WeatherCache.Snapshot snapshot, String message) {
        if (isDestroyed()) return;
        displayed = snapshot;
        readings.setText(String.format(Locale.getDefault(), "%s\n%.1f °C · humidité %d %%\nVent %.1f km/h\nMesure du %s UTC",
                snapshot.place, snapshot.temperature, snapshot.humidity, snapshot.wind,
                snapshot.time.replace('T', ' ')));
        ready(message);
    }

    private void loading(String message) {
        status.setText(message);
        city.setEnabled(false);
        locate.setEnabled(false);
    }

    private void ready(String message) {
        if (isDestroyed()) return;
        status.setText(message);
        city.setEnabled(true);
        locate.setEnabled(true);
    }

    @Override
    protected void onDestroy() {
        if (request != null) request.cancel();
        if (locationCancellation != null) locationCancellation.cancel();
        storage.execute(cache::close);
        storage.shutdown();
        super.onDestroy();
    }
}
`;

const articleApi = `package devafrica.atelier;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;

interface ArticleApi {
    @GET("api/articles?tag=android&per_page=20")
    Call<List<Article>> recent();
}
`;

const articleModel = `package devafrica.atelier;

import android.net.Uri;

final class Article {
    final int id;
    final String title;
    final String description;
    final String url;

    Article(int id, String title, String description, String url) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.url = url;
    }

    boolean displayable() {
        return id > 0 && title != null && !title.trim().isEmpty() && uri() != null;
    }

    Uri uri() {
        if (url == null) return null;
        Uri parsed = Uri.parse(url);
        return "https".equals(parsed.getScheme()) && "dev.to".equalsIgnoreCase(parsed.getHost())
                ? parsed : null;
    }
}
`;

const favoritesStore = `package devafrica.atelier;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import java.util.ArrayList;
import java.util.List;

final class FavoritesStore extends SQLiteOpenHelper {
    FavoritesStore(Context context) {
        super(context, "favorites.db", null, 1);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE favorites (id INTEGER PRIMARY KEY, title TEXT NOT NULL, "
                + "description TEXT NOT NULL, url TEXT NOT NULL, saved_at INTEGER NOT NULL)");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // Les versions futures ajoutent leurs migrations ici.
    }

    void add(Article article) {
        ContentValues values = new ContentValues();
        values.put("id", article.id);
        values.put("title", article.title);
        values.put("description", article.description == null ? "" : article.description);
        values.put("url", article.url);
        values.put("saved_at", System.currentTimeMillis());
        getWritableDatabase().replaceOrThrow("favorites", null, values);
    }

    void remove(int id) {
        getWritableDatabase().delete("favorites", "id = ?", new String[]{String.valueOf(id)});
    }

    List<Article> all() {
        List<Article> result = new ArrayList<>();
        String[] columns = {"id", "title", "description", "url"};
        try (Cursor cursor = getReadableDatabase().query(
                "favorites", columns, null, null, null, null, "saved_at DESC, id DESC")) {
            while (cursor.moveToNext()) {
                result.add(new Article(cursor.getInt(0), cursor.getString(1),
                        cursor.getString(2), cursor.getString(3)));
            }
        }
        return result;
    }
}
`;

const articleAdapter = `package devafrica.atelier;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;
import java.util.Collections;
import java.util.List;
import java.util.Set;

final class ArticleAdapter extends RecyclerView.Adapter<ArticleAdapter.Holder> {
    interface Actions {
        void open(Article article);
        void toggle(Article article);
    }

    private final Actions actions;
    private List<Article> articles = Collections.emptyList();
    private Set<Integer> favoriteIds = Collections.emptySet();

    ArticleAdapter(Actions actions) {
        this.actions = actions;
    }

    void show(List<Article> items, Set<Integer> ids) {
        articles = items;
        favoriteIds = ids;
        notifyDataSetChanged();
    }

    @Override
    public Holder onCreateViewHolder(ViewGroup parent, int viewType) {
        return new Holder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.row_article, parent, false));
    }

    @Override
    public void onBindViewHolder(Holder holder, int position) {
        Article article = articles.get(position);
        boolean saved = favoriteIds.contains(article.id);
        holder.title.setText(article.title);
        holder.description.setText(article.description);
        holder.favorite.setText(saved ? "★ Retirer" : "☆ Favori");
        holder.favorite.setContentDescription((saved ? "Retirer des favoris : " : "Mettre en favori : ") + article.title);
        holder.favorite.setOnClickListener(view -> actions.toggle(article));
        holder.read.setContentDescription("Lire : " + article.title);
        holder.read.setOnClickListener(view -> actions.open(article));
    }

    @Override
    public int getItemCount() {
        return articles.size();
    }

    static final class Holder extends RecyclerView.ViewHolder {
        final TextView title;
        final TextView description;
        final Button favorite;
        final Button read;

        Holder(View row) {
            super(row);
            title = row.findViewById(R.id.article_title);
            description = row.findViewById(R.id.article_summary);
            favorite = row.findViewById(R.id.article_favorite);
            read = row.findViewById(R.id.article_read);
        }
    }
}
`;

const articlesActivity = `package devafrica.atelier;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.database.sqlite.SQLiteException;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AtelierActivity implements ArticleAdapter.Actions {
    private final ExecutorService storage = Executors.newSingleThreadExecutor();
    private FavoritesStore favoritesStore;
    private ArticleApi api;
    private ArticleAdapter adapter;
    private Button refresh;
    private Button tab;
    private TextView status;
    private Call<List<Article>> request;
    private List<Article> feed = Collections.emptyList();
    private List<Article> favorites = Collections.emptyList();
    private Set<Integer> favoriteIds = Collections.emptySet();
    private boolean viewingFavorites;
    private boolean updatingFavorites = true;
    private String feedMessage = "Chargement des articles…";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showLayout(R.layout.activity_main);
        status = findViewById(R.id.feed_status);
        refresh = findViewById(R.id.refresh_feed);
        tab = findViewById(R.id.favorites_tab);
        favoritesStore = new FavoritesStore(getApplicationContext());
        api = new Retrofit.Builder().baseUrl("https://dev.to/")
                .addConverterFactory(GsonConverterFactory.create())
                .build().create(ArticleApi.class);
        RecyclerView list = findViewById(R.id.articles);
        list.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ArticleAdapter(this);
        list.setAdapter(adapter);
        refresh.setOnClickListener(view -> loadFeed());
        tab.setOnClickListener(view -> {
            viewingFavorites = !viewingFavorites;
            render();
        });
        storage.execute(this::readFavorites);
        loadFeed();
    }

    private void loadFeed() {
        refresh.setEnabled(false);
        feedMessage = "Chargement des articles…";
        render();
        request = api.recent();
        request.timeout().timeout(15, TimeUnit.SECONDS);
        request.enqueue(new Callback<List<Article>>() {
            @Override
            public void onResponse(Call<List<Article>> call, Response<List<Article>> response) {
                if (isDestroyed() || call.isCanceled()) return;
                if (!response.isSuccessful() || response.body() == null) {
                    finishFeed("Actualisation indisponible. Tu peux consulter tes favoris.");
                    return;
                }
                List<Article> next = new ArrayList<>();
                for (Article article : response.body()) {
                    if (article != null && article.displayable()) next.add(article);
                }
                feed = next;
                finishFeed(next.isEmpty() ? "Aucun article trouvé." : "Articles Android de DEV Community");
            }

            @Override
            public void onFailure(Call<List<Article>> call, Throwable error) {
                if (!call.isCanceled()) finishFeed("Actualisation indisponible. Tu peux consulter tes favoris.");
            }
        });
    }

    private void finishFeed(String message) {
        if (isDestroyed()) return;
        refresh.setEnabled(true);
        feedMessage = message;
        render();
    }

    private void readFavorites() {
        try {
            List<Article> saved = favoritesStore.all();
            runOnUiThread(() -> {
                if (isDestroyed()) return;
                favorites = saved;
                favoriteIds = new HashSet<>();
                for (Article article : saved) favoriteIds.add(article.id);
                updatingFavorites = false;
                render();
            });
        } catch (SQLiteException error) {
            storageError();
        }
    }

    private void storageError() {
        runOnUiThread(() -> {
            if (isDestroyed()) return;
            updatingFavorites = false;
            Toast.makeText(this, "Stockage local indisponible.", Toast.LENGTH_SHORT).show();
        });
    }

    private void render() {
        tab.setText(viewingFavorites ? "Voir le fil" : "Voir les favoris");
        String localStatus = favorites.isEmpty() ? "Aucun favori enregistré." : "Favoris disponibles hors ligne";
        status.setText(viewingFavorites ? localStatus : feedMessage);
        adapter.show(viewingFavorites ? favorites : feed, favoriteIds);
    }

    @Override
    public void toggle(Article article) {
        if (updatingFavorites) return;
        updatingFavorites = true;
        boolean remove = favoriteIds.contains(article.id);
        storage.execute(() -> {
            try {
                if (remove) favoritesStore.remove(article.id);
                else favoritesStore.add(article);
                readFavorites();
            } catch (SQLiteException error) {
                storageError();
            }
        });
    }

    @Override
    public void open(Article article) {
        Uri uri = article.uri();
        if (uri == null) return;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException error) {
            Toast.makeText(this, "Navigateur indisponible.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onDestroy() {
        if (request != null) request.cancel();
        storage.execute(favoritesStore::close);
        storage.shutdown();
        super.onDestroy();
    }
}
`;

const articlesLayout = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/screen" android:layout_width="match_parent" android:layout_height="match_parent"
    android:orientation="vertical">
    <Toolbar android:layout_width="match_parent" android:layout_height="wrap_content"
        android:minHeight="56dp" android:title="Le fil Android" />
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
        android:orientation="horizontal" android:paddingStart="12dp" android:paddingEnd="12dp">
        <Button android:id="@+id/refresh_feed" android:layout_width="0dp" android:layout_weight="1"
            android:layout_height="wrap_content" android:text="Actualiser" />
        <Button android:id="@+id/favorites_tab" android:layout_width="0dp" android:layout_weight="1"
            android:layout_height="wrap_content" android:text="Voir les favoris" />
    </LinearLayout>
    <TextView android:id="@+id/feed_status" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:padding="12dp" android:accessibilityLiveRegion="polite" />
    <androidx.recyclerview.widget.RecyclerView android:id="@+id/articles" android:layout_width="match_parent"
        android:layout_height="0dp" android:layout_weight="1" android:padding="12dp" android:clipToPadding="false" />
</LinearLayout>
`;

const articleRow = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="wrap_content"
    android:layout_marginBottom="10dp" android:orientation="vertical"
    android:background="@drawable/card" android:padding="14dp">
    <TextView android:id="@+id/article_title" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:textStyle="bold" android:textSize="18sp" />
    <TextView android:id="@+id/article_summary" android:layout_width="match_parent"
        android:layout_height="wrap_content" android:layout_marginTop="6dp" />
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"
        android:orientation="horizontal">
        <Button android:id="@+id/article_favorite" android:layout_width="0dp" android:layout_weight="1"
            android:layout_height="wrap_content" android:text="☆ Favori" />
        <Button android:id="@+id/article_read" android:layout_width="0dp" android:layout_weight="1"
            android:layout_height="wrap_content" android:text="Lire" />
    </LinearLayout>
</LinearLayout>
`;

export const javaAndroidAdvancedProjects: WebProject[] = [
  {
    id: "meteo-java-hors-ligne",
    title: "La météo disponible hors ligne",
    description:
      "Charge les mesures d’Open-Meteo et conserve la dernière réponse dans SQLite.",
    minutes: 145,
    requirements: [
      "Affiche une météo obtenue via l’API Open-Meteo avec le lieu et l’heure de mesure.",
      "Essaie la localisation au premier plan et vérifie le bouton de repli Toamasina en cas de refus.",
      "Coupe le réseau, relance et retrouve la dernière mesure enregistrée avec son heure.",
    ],
    hints: [
      "Dans l’émulateur, définis une position dans Extended controls → Location.",
      "Appelle Retrofit avec enqueue et réserve un exécuteur aux opérations SQLite.",
      "Demande la position au clic et arrondis les coordonnées avant d’envoyer la requête.",
    ],
    files: javaAndroidFiles("Météo DevAfrica", {
      id: "meteo",
      layout:
        scrollLayout(`        <TextView style="@style/AtelierTitle" android:text="Météo DevAfrica" />
        <TextView android:id="@+id/weather_status" android:layout_width="match_parent"
            android:layout_height="wrap_content" android:layout_marginTop="12dp"
            android:accessibilityLiveRegion="polite" />
        <TextView android:id="@+id/readings" android:layout_width="match_parent" android:layout_height="wrap_content"
            android:layout_marginTop="16dp" android:background="@drawable/card" android:padding="18dp"
            android:text="Les mesures s’afficheront ici." android:textSize="19sp" />
        <Button android:id="@+id/refresh_city" android:layout_width="match_parent"
            android:layout_height="wrap_content" android:layout_marginTop="12dp" android:text="Actualiser Toamasina" />
        <Button android:id="@+id/locate" android:layout_width="match_parent"
            android:layout_height="wrap_content" android:text="Utiliser ma position" />`),
      activity: weatherActivity,
      dependencies: retrofit,
      permissions: [
        "INTERNET",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
      ],
      notes:
        "Charge d’abord la météo de Toamasina. Pour tester la position, définis des coordonnées dans l’émulateur et clique sur Utiliser ma position. L’application transmet une position arrondie à Open-Meteo uniquement pour cette requête. Pour le test hors ligne, désactive les données et le Wi-Fi, puis relance. Seule la dernière mesure est conservée avec son lieu et son heure UTC. Source des données : https://open-meteo.com/en/docs",
      extra: {
        [`${javaAndroidPath}/WeatherApi.java`]: weatherApi,
        [`${javaAndroidPath}/WeatherCache.java`]: weatherCache,
      },
    }),
  },
  {
    id: "actus-java-favoris",
    title: "Le fil d’actualités et ses favoris",
    description:
      "Lis des articles DEV Community et retrouve les résumés de tes favoris grâce à SQLite.",
    minutes: 145,
    requirements: [
      "Affiche les articles reçus dans un RecyclerView et ouvre leurs liens HTTPS.",
      "Ajoute et retire un favori et retrouve la sélection après une relance.",
      "Coupe le réseau et consulte les titres et résumés des favoris enregistrés.",
    ],
    hints: [
      "Utilise id comme clé primaire pour identifier un article en base.",
      "Fais tourner les opérations SQLite sur un exécuteur et mets les vues à jour sur le fil principal.",
      "Stocke seulement les métadonnées utiles. Le bouton Lire ouvre l’article sur son site.",
    ],
    files: javaAndroidFiles("Le fil Android", {
      id: "actus",
      layout: articlesLayout,
      activity: articlesActivity,
      dependencies: [recyclerView, ...retrofit],
      permissions: ["INTERNET"],
      notes:
        "Le fil utilise l’API publique de DEV Community. Enregistre deux favoris, coupe le réseau, puis rouvre l’application et sélectionne Voir les favoris. Les titres et résumés restent accessibles. Pour lire la page complète, reconnecte l’appareil. Source : https://dev.to/api/articles?tag=android",
      extra: {
        [`${javaAndroidPath}/Article.java`]: articleModel,
        [`${javaAndroidPath}/ArticleApi.java`]: articleApi,
        [`${javaAndroidPath}/ArticleAdapter.java`]: articleAdapter,
        [`${javaAndroidPath}/FavoritesStore.java`]: favoritesStore,
        [`${androidRes}/layout/row_article.xml`]: articleRow,
      },
    }),
  },
];
