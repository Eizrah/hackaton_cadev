import { flutterFiles } from "./flutterAuthoring";
import type { WebProject } from "./webCourseTypes";

const movieRepository = `import 'dart:convert';
import 'package:http/http.dart' as http;

class Movie {
  const Movie(this.id, this.title, this.description, this.poster);

  final String id;
  final String title;
  final String description;
  final Uri? poster;

  factory Movie.fromJson(Map<String, dynamic> json) {
    final id = json['id'];
    final title = json['title'];
    final description = json['description'];
    if (id is! String || title is! String || description is! String) {
      throw const FormatException('Film incomplet.');
    }
    final image = json['image'];
    final uri = image is String ? Uri.tryParse(image) : null;
    return Movie(id, title, description, uri?.scheme == 'https' ? uri : null);
  }
}

class MovieRepository {
  MovieRepository(this.client);

  final http.Client client;

  Future<List<Movie>> load() async {
    final response = await client.get(Uri.https('ghibliapi.vercel.app', '/films'))
        .timeout(const Duration(seconds: 12));
    if (response.statusCode != 200) {
      throw const FormatException('Le catalogue est indisponible.');
    }

    final decoded = jsonDecode(utf8.decode(response.bodyBytes));
    if (decoded is! List) throw const FormatException('Liste de films attendue.');
    return [
      for (final item in decoded)
        if (item is Map<String, dynamic>) Movie.fromJson(item),
    ];
  }
}
`;

const movieBloc = `import 'package:flutter_bloc/flutter_bloc.dart';
import 'movie_repository.dart';

sealed class MovieEvent {}
class MoviesRequested extends MovieEvent {}

sealed class MovieState {}
class MovieInitial extends MovieState {}
class MovieLoading extends MovieState {}
class MovieError extends MovieState {}
class MovieLoaded extends MovieState {
  MovieLoaded(List<Movie> movies) : movies = List.unmodifiable(movies);
  final List<Movie> movies;
}

class MovieBloc extends Bloc<MovieEvent, MovieState> {
  MovieBloc(this.repository) : super(MovieInitial()) {
    on<MoviesRequested>((event, emit) async {
      if (state is MovieLoading) return;
      emit(MovieLoading());
      try {
        emit(MovieLoaded(await repository.load()));
      } catch (_) {
        emit(MovieError());
      }
    });
  }

  final MovieRepository repository;
}
`;

const movieApp = `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;
import 'atelier_app.dart';
import 'movie_bloc.dart';
import 'movie_repository.dart';

void main() => runApp(
  RepositoryProvider<http.Client>(
    create: (_) => http.Client(),
    dispose: (client) => client.close(),
    child: BlocProvider(
      create: (context) =>
          MovieBloc(MovieRepository(context.read<http.Client>()))..add(MoviesRequested()),
      child: const AtelierApp(title: 'Films Ghibli', home: MovieListPage()),
    ),
  ),
);

class MovieListPage extends StatelessWidget {
  const MovieListPage({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Films Ghibli')),
    body: SafeArea(
      child: BlocBuilder<MovieBloc, MovieState>(
        builder: (context, state) {
          if (state is MovieLoaded) {
            if (state.movies.isEmpty) return const Center(child: Text('Aucun film trouvé.'));
            return ListView.builder(
              itemCount: state.movies.length,
              padding: const EdgeInsets.all(12),
              itemBuilder: (_, index) {
                final movie = state.movies[index];
                return Card(
                  child: ListTile(
                    leading: SizedBox(width: 40, height: 52, child: Poster(movie)),
                    title: Text(movie.title),
                    subtitle: const Text('Voir la fiche'),
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => MovieDetailPage(movie)),
                    ),
                  ),
                );
              },
            );
          }
          if (state is MovieError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('Le catalogue est indisponible. Vérifie ta connexion.'),
                    const SizedBox(height: 12),
                    FilledButton(
                      onPressed: () => context.read<MovieBloc>().add(MoviesRequested()),
                      child: const Text('Réessayer'),
                    ),
                  ],
                ),
              ),
            );
          }
          return const Center(child: CircularProgressIndicator(semanticsLabel: 'Chargement des films'));
        },
      ),
    ),
  );
}

class Poster extends StatelessWidget {
  const Poster(this.movie, {super.key});

  final Movie movie;

  @override
  Widget build(BuildContext context) {
    const fallback = ColoredBox(
      color: Color(0xFFDCEEFF),
      child: Center(child: Icon(Icons.movie_outlined)),
    );
    final uri = movie.poster;
    return Hero(
      tag: movie.id,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10),
        child: uri == null
            ? fallback
            : Image.network(uri.toString(), fit: BoxFit.cover, errorBuilder: (_, _, _) => fallback),
      ),
    );
  }
}

class MovieDetailPage extends StatelessWidget {
  const MovieDetailPage(this.movie, {super.key});

  final Movie movie;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text(movie.title)),
    body: SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Center(child: SizedBox(width: 180, height: 250, child: Poster(movie))),
          const SizedBox(height: 20),
          Text(movie.title, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 10),
          Text(movie.description),
          const SizedBox(height: 18),
          const Text('Catalogue et résumés fournis par Studio Ghibli API.'),
        ],
      ),
    ),
  );
}
`;

const weatherModel = `import 'package:isar_community/isar.dart';

part 'weather_reading.g.dart';

@collection
class WeatherReading {
  Id id = 1;
  late DateTime measuredAt;
  late double temperature;
  late int humidity;
  late double wind;
}
`;

const weatherRepository = `import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:isar_community/isar.dart';
import 'weather_reading.dart';

class WeatherRepository {
  WeatherRepository(this.db, this.client);

  final Isar db;
  final http.Client client;

  Future<WeatherReading?> cached() => db.weatherReadings.get(1);

  Future<WeatherReading> refresh() async {
    final url = Uri.https('api.open-meteo.com', '/v1/forecast', {
      'latitude': '-18.15',
      'longitude': '49.40',
      'current': 'temperature_2m,relative_humidity_2m,wind_speed_10m',
      'timezone': 'GMT',
    });
    final response = await client.get(url).timeout(const Duration(seconds: 12));
    if (response.statusCode != 200) throw const FormatException('API météo indisponible.');

    final decoded = jsonDecode(response.body);
    final current = decoded is Map<String, dynamic> ? decoded['current'] : null;
    if (current is! Map<String, dynamic>) throw const FormatException('Mesure absente.');
    final time = current['time'];
    final date = time is String ? DateTime.tryParse(time + 'Z') : null;
    final temperature = current['temperature_2m'];
    final humidity = current['relative_humidity_2m'];
    final wind = current['wind_speed_10m'];
    if (date == null || temperature is! num || humidity is! num || wind is! num) {
      throw const FormatException('Mesure incomplète.');
    }

    final reading = WeatherReading()
      ..measuredAt = date
      ..temperature = temperature.toDouble()
      ..humidity = humidity.toInt()
      ..wind = wind.toDouble();
    await db.writeTxn(() => db.weatherReadings.put(reading));
    return reading;
  }
}
`;

const weatherApp = `import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:isar_community/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'atelier_app.dart';
import 'weather_reading.dart';
import 'weather_repository.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AtelierApp(title: 'Météo', home: WeatherBootPage()));
}

class WeatherBootPage extends StatefulWidget {
  const WeatherBootPage({super.key});

  @override
  State<WeatherBootPage> createState() => _WeatherBootPageState();
}

class _WeatherBootPageState extends State<WeatherBootPage> {
  late Future<WeatherRepository> opening = openRepository();

  Future<WeatherRepository> openRepository() async {
    final folder = await getApplicationSupportDirectory();
    final db = await Isar.open([WeatherReadingSchema], directory: folder.path);
    return WeatherRepository(db, http.Client());
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<WeatherRepository>(
    future: opening,
    builder: (context, snapshot) {
      final repository = snapshot.data;
      if (repository != null) return WeatherPage(repository);
      return Scaffold(
        appBar: AppBar(title: const Text('Météo de Toamasina')),
        body: Center(
          child: snapshot.hasError
              ? FilledButton(
                  onPressed: () => setState(() => opening = openRepository()),
                  child: const Text('Rouvrir le stockage'),
                )
              : const CircularProgressIndicator(semanticsLabel: 'Ouverture du stockage'),
        ),
      );
    },
  );
}

class WeatherPage extends StatefulWidget {
  const WeatherPage(this.repository, {super.key});

  final WeatherRepository repository;

  @override
  State<WeatherPage> createState() => _WeatherPageState();
}

class _WeatherPageState extends State<WeatherPage> {
  WeatherReading? reading;
  String message = 'Lecture des données locales…';
  bool loading = true;

  @override
  void initState() {
    super.initState();
    start();
  }

  Future<void> start() async {
    try {
      final saved = await widget.repository.cached();
      if (!mounted) return;
      setState(() {
        reading = saved;
        message = saved == null ? 'Première actualisation…' : 'Dernière mesure enregistrée';
        loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        message = 'Lecture locale indisponible.';
        loading = false;
      });
    }
    await refresh();
  }

  Future<void> refresh() async {
    if (loading) return;
    setState(() => loading = true);
    try {
      final next = await widget.repository.refresh();
      if (!mounted) return;
      setState(() {
        reading = next;
        message = 'Mesure actualisée et enregistrée';
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        message = reading == null
            ? 'Mesure indisponible. Vérifie la connexion et réessaie.'
            : 'Actualisation indisponible. Dernière mesure conservée.';
      });
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final data = reading;
    final colors = Theme.of(context).colorScheme;
    final reduceMotion = MediaQuery.disableAnimationsOf(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Météo de Toamasina')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            AnimatedContainer(
              duration: reduceMotion ? Duration.zero : const Duration(milliseconds: 240),
              decoration: BoxDecoration(
                color: loading ? colors.surfaceContainerHighest : colors.primaryContainer,
                borderRadius: BorderRadius.circular(18),
              ),
              padding: const EdgeInsets.all(16),
              child: Text(message),
            ),
            if (loading) const LinearProgressIndicator(semanticsLabel: 'Actualisation en cours'),
            if (data != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(data.temperature.toStringAsFixed(1) + ' °C',
                        style: Theme.of(context).textTheme.displaySmall),
                      Text('Humidité : ' + data.humidity.toString() + ' %'),
                      Text('Vent : ' + data.wind.toStringAsFixed(1) + ' km/h'),
                      const SizedBox(height: 10),
                      Text('Mesure UTC · ' + data.measuredAt.toUtc().toIso8601String().substring(0, 16).replaceFirst('T', ' ')),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 12),
            FilledButton(onPressed: loading ? null : refresh, child: const Text('Actualiser')),
            const Text('Données Open-Meteo'),
          ],
        ),
      ),
    );
  }
}
`;

export const flutterAdvancedProjects: WebProject[] = [
  {
    id: "films-flutter-bloc",
    title: "Le catalogue de films animé",
    description:
      "Charge des fiches de films, modélise leur état avec BLoC et ouvre chaque affiche avec Hero.",
    minutes: 135,
    requirements: [
      "Affiche un chargement puis des films provenant de Studio Ghibli API.",
      "En cas d’échec, montre l’état d’erreur et propose Réessayer.",
      "Ouvre une fiche et vérifie la transition Hero de son affiche.",
    ],
    hints: [
      "L’interface envoie MoviesRequested. Le BLoC émet les états écoutés par BlocBuilder.",
      "Vérifie le statut HTTP avant de décoder le JSON.",
      "Donne le même tag Hero à l’affiche de liste et à son détail.",
    ],
    files: flutterFiles("Catalogue de films", {
      id: "films",
      main: movieApp,
      dependencies: { http: "1.5.0", flutter_bloc: "9.1.1" },
      internet: true,
      notes:
        "Le catalogue utilise https://ghibliapi.vercel.app/films. Ouvre un film, puis teste la reprise après une coupure de connexion. Les affiches distantes ont un pictogramme de repli.",
      extra: {
        "lib/movie_bloc.dart": movieBloc,
        "lib/movie_repository.dart": movieRepository,
      },
    }),
  },
  {
    id: "meteo-flutter-isar",
    title: "La météo hors ligne avec Isar",
    description:
      "Affiche la dernière météo de Toamasina dès l’ouverture, puis actualise le cache avec Open-Meteo.",
    minutes: 145,
    requirements: [
      "Enregistre une mesure météo valide dans Isar et affiche son heure.",
      "Ferme l’application, coupe le réseau et vérifie que la mesure reste accessible.",
      "Reconnecte l’appareil et teste l’actualisation.",
    ],
    hints: [
      "Lis Isar avant la requête HTTP. Conserve la mesure visible si la requête échoue.",
      "Écris la réponse validée dans writeTxn avec l’identifiant 1.",
      "Recrée le fichier .g.dart avec dart run build_runner build après un changement du modèle.",
    ],
    files: flutterFiles("Météo de Toamasina", {
      id: "meteo",
      main: weatherApp,
      dependencies: {
        http: "1.5.0",
        isar_community: "3.4.1",
        isar_community_flutter_libs: "3.4.1",
        path_provider: "2.1.6",
      },
      development: {
        build_runner: "2.16.2",
        isar_community_generator: "3.4.1",
      },
      assets: {
        "lib/weather_reading.g.dart": "learning/mobile/weather_reading.g.dart",
      },
      internet: true,
      notes:
        "Lance cet atelier sur Android ou iOS. Dans SDK Manager, ajoute aussi la plateforme Android SDK 35 si tu compiles sur Android. Le schéma Isar généré est fourni. Après modification de weather_reading.dart, exécute dart run build_runner build. Charge d’abord une mesure avec Internet, puis passe en mode avion et relance. Source des données : https://open-meteo.com/en/docs.",
      extra: {
        "lib/weather_reading.dart": weatherModel,
        "lib/weather_repository.dart": weatherRepository,
      },
    }),
  },
];
