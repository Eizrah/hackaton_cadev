import { bladePage, laravelFiles, laravelMigration } from "./laravelAuthoring";
import { sessionFiles, sessionRoutes } from "./laravelSession";
import type { WebProject } from "./webCourseTypes";

const directory: WebProject = {
  id: "annuaire-liens",
  title: "L’annuaire de liens utiles",
  description:
    "Fais découvrir des ressources par catégorie, de la documentation aux outils.",
  minutes: 45,
  requirements: [
    "Afficher des catégories définies dans un tableau PHP.",
    "Ouvrir une catégorie par son identifiant et renvoyer 404 pour un identifiant inconnu.",
    "Réutiliser une mise en page Blade sur l’accueil et les fiches.",
  ],
  hints: [
    "Les routes portent un nom pour générer les liens avec route().",
    "Ajoute ta propre catégorie dans DirectoryController.",
  ],
  files: laravelFiles("Annuaire de liens", {
    sources: {
      "routes/web.php": String.raw`<?php

use App\Http\Controllers\DirectoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DirectoryController::class, 'index'])->name('home');
Route::get('/categories/{slug}', [DirectoryController::class, 'show'])->name('categories.show');
Route::get('/api/categories', [DirectoryController::class, 'data']);
`,
      "app/Http/Controllers/DirectoryController.php": String.raw`<?php

namespace App\Http\Controllers;

class DirectoryController
{
    private const GROUPS = [
        'documentation' => [
            'title' => 'Documentation',
            'links' => ['PHP' => 'https://www.php.net/manual/fr/', 'Laravel' => 'https://laravel.com/docs/12.x'],
        ],
        'outils' => [
            'title' => 'Outils',
            'links' => ['Composer' => 'https://getcomposer.org/', 'Git' => 'https://git-scm.com/'],
        ],
    ];

    public function index()
    {
        return view('directory', ['groups' => self::GROUPS]);
    }

    public function show(string $slug)
    {
        abort_unless(isset(self::GROUPS[$slug]), 404);
        return view('category', ['group' => self::GROUPS[$slug]]);
    }

    public function data()
    {
        return response()->json(self::GROUPS);
    }
}
`,
      "resources/views/directory.blade.php": bladePage(
        "Annuaire",
        `<h1>Annuaire de liens utiles</h1>
<p>Choisis une catégorie pour explorer ses ressources.</p>
@foreach ($groups as $slug => $group)
  <article class="card">
    <h2><a href="{{ route('categories.show', $slug) }}">{{ $group['title'] }}</a></h2>
    <p>{{ count($group['links']) }} ressources</p>
  </article>
@endforeach
<a href="/api/categories">Voir les données JSON</a>`,
      ),
      "resources/views/category.blade.php": bladePage(
        "Une catégorie",
        `<a href="{{ route('home') }}">← Toutes les catégories</a>
<h1>{{ $group['title'] }}</h1>
<ul class="card">
@forelse ($group['links'] as $label => $url)
  <li><a href="{{ $url }}">{{ $label }}</a></li>
@empty
  <li>Cette catégorie sera complétée bientôt.</li>
@endforelse
</ul>`,
      ),
    },
  }),
};

const blog: WebProject = {
  id: "blog-textes",
  title: "Le blog de nouvelles à partir de fichiers",
  description:
    "Relie chaque URL à un article texte et affiche son contenu dans un template commun.",
  minutes: 45,
  requirements: [
    "Présenter la liste des articles et une URL par article.",
    "Lire uniquement un fichier répertorié par le contrôleur.",
    "Afficher le contenu échappé dans Blade et gérer un article absent.",
  ],
  hints: [
    "Le catalogue fait le lien entre un slug et un fichier connu.",
    "Le style white-space: pre-line conserve les sauts de ligne.",
  ],
  files: laravelFiles("Nouvelles DevAfrica", {
    entry: "app/Http/Controllers/NewsController.php",
    sources: {
      "routes/web.php": String.raw`<?php

use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::get('/', [NewsController::class, 'index'])->name('home');
Route::get('/nouvelles/{slug}', [NewsController::class, 'show'])->name('news.show');
`,
      "app/Http/Controllers/NewsController.php": String.raw`<?php

namespace App\Http\Controllers;

class NewsController
{
    private const ARTICLES = [
        'premiere-rencontre' => ['title' => 'Notre première rencontre', 'file' => 'rencontre.txt'],
        'partager-son-code' => ['title' => 'Partager son code', 'file' => 'partage.txt'],
    ];

    public function index()
    {
        return view('news', ['articles' => self::ARTICLES]);
    }

    public function show(string $slug)
    {
        $article = self::ARTICLES[$slug] ?? null;
        abort_if($article === null, 404);
        $path = resource_path('articles/'.$article['file']);
        abort_unless(is_file($path) && is_readable($path), 404);
        $content = file_get_contents($path);
        abort_if($content === false, 404);
        return view('article', ['article' => $article, 'content' => $content]);
    }
}
`,
      "resources/articles/rencontre.txt":
        "Aujourd’hui, notre groupe a relié sa première route à une vue Blade.\n\nChacun a proposé un titre et un court article à partager.",
      "resources/articles/partage.txt":
        "Donne un nom clair à ton projet.\n\nIndique les commandes nécessaires pour qu’un autre apprenant puisse le lancer.",
      "resources/views/news.blade.php": bladePage(
        "Nouvelles",
        `<h1>Nouvelles DevAfrica</h1>
@foreach ($articles as $slug => $article)
  <article class="card"><h2><a href="{{ route('news.show', $slug) }}">{{ $article['title'] }}</a></h2></article>
@endforeach`,
      ),
      "resources/views/article.blade.php": bladePage(
        "Nouvelle",
        `<a href="{{ route('home') }}">← Toutes les nouvelles</a>
<article class="card">
  <h1>{{ $article['title'] }}</h1>
  <p class="prose">{{ $content }}</p>
</article>`,
      ),
    },
  }),
};

const projects: WebProject = {
  id: "gestion-projets",
  title: "Le gestionnaire de projets et de tâches",
  description:
    "Crée des projets en base, regroupe leurs tâches et organise les projets par étiquette.",
  minutes: 65,
  requirements: [
    "Créer des projets persistants via un formulaire validé.",
    "Ajouter chaque tâche au bon projet.",
    "Associer une étiquette à plusieurs projets et vérifier les relations après rechargement.",
  ],
  hints: [
    "Utilise $project->tasks()->create() pour rattacher la tâche.",
    "La table label_project relie les étiquettes aux projets. Ajoute un exemple dans le formulaire.",
  ],
  files: laravelFiles("Gestion de projets", {
    entry: "app/Http/Controllers/ProjectController.php",
    sources: {
      "routes/web.php": String.raw`<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ProjectController::class, 'index'])->name('home');
Route::post('/projets', [ProjectController::class, 'store'])->name('projects.store');
Route::post('/projets/{project}/taches', [ProjectController::class, 'addTask'])->name('tasks.store');
`,
      "database/migrations/2026_01_01_000100_create_projects.php":
        laravelMigration([
          [
            "projects",
            "$table->id();\n$table->string('title', 120);\n$table->timestamps();",
          ],
          [
            "tasks",
            "$table->id();\n$table->foreignId('project_id')->constrained()->cascadeOnDelete();\n$table->string('title', 120);\n$table->timestamps();",
          ],
          [
            "labels",
            "$table->id();\n$table->string('name', 60)->unique();\n$table->timestamps();",
          ],
          [
            "label_project",
            "$table->foreignId('label_id')->constrained()->cascadeOnDelete();\n$table->foreignId('project_id')->constrained()->cascadeOnDelete();\n$table->primary(['label_id', 'project_id']);",
          ],
        ]),
      "app/Models/Project.php": String.raw`<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = ['title'];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function labels(): BelongsToMany
    {
        return $this->belongsToMany(Label::class);
    }
}
`,
      "app/Models/Task.php": String.raw`<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = ['title'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
`,
      "app/Models/Label.php": String.raw`<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Label extends Model
{
    protected $fillable = ['name'];

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }
}
`,
      "app/Http/Controllers/ProjectController.php": String.raw`<?php

namespace App\Http\Controllers;

use App\Models\Label;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController
{
    public function index()
    {
        $projects = Project::with(['tasks', 'labels'])->latest('id')->get();
        return view('projects', compact('projects'));
    }

    public function store(Request $request)
    {
        $data = $request->validate(['title' => 'required|string|max:120', 'label' => 'nullable|string|max:60']);
        DB::transaction(function () use ($data) {
            $project = Project::create(['title' => $data['title']]);
            if (!empty($data['label'])) {
                $label = Label::firstOrCreate(['name' => $data['label']]);
                $project->labels()->attach($label->id);
            }
        });
        return redirect()->route('home')->with('status', 'Projet ajouté.');
    }

    public function addTask(Request $request, Project $project)
    {
        $data = $request->validate(['title' => 'required|string|max:120']);
        $project->tasks()->create($data);
        return redirect()->route('home')->with('status', 'Tâche ajoutée.');
    }
}
`,
      "resources/views/projects.blade.php": bladePage(
        "Projets",
        `<h1>Mes projets</h1>
<form class="card" method="post" action="{{ route('projects.store') }}">
  @csrf
  <label>Nom du projet <input name="title" required maxlength="120"></label>
  <label>Étiquette facultative <input name="label" maxlength="60" placeholder="Ex. Web"></label>
  <button>Créer le projet</button>
</form>
@forelse ($projects as $project)
  <article class="card">
    <h2>{{ $project->title }}</h2>
    <p>{{ $project->labels->pluck('name')->join(', ') }}</p>
    <ul>
      @forelse ($project->tasks as $task)
        <li>{{ $task->title }}</li>
      @empty
        <li>Aucune tâche.</li>
      @endforelse
    </ul>
    <form method="post" action="{{ route('tasks.store', $project) }}">
      @csrf
      <label>Tâche pour {{ $project->title }} <input name="title" required maxlength="120"></label>
      <button>Ajouter la tâche</button>
    </form>
  </article>
@empty
  <p>Crée ton premier projet.</p>
@endforelse`,
      ),
    },
  }),
};

const meetups: WebProject = {
  id: "gestion-meetups",
  title: "Le calendrier de meetups",
  description:
    "Publie une rencontre avec un compte organisateur de test et affiche les événements à venir.",
  minutes: 70,
  requirements: [
    "Afficher les rencontres futures, triées par date.",
    "Demander une session avant de publier.",
    "Vérifier titre, description, lieu et date future côté serveur.",
  ],
  hints: [
    "Crée un compte local depuis l’accueil.",
    "Teste une date passée puis une date future. Le formulaire affiche le fuseau de l’application.",
  ],
  files: laravelFiles("Calendrier des meetups", {
    sources: {
      ...sessionFiles,
      "routes/web.php": String.raw`<?php

use App\Http\Controllers\MeetupController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MeetupController::class, 'index'])->name('home');
Route::post('/evenements', [MeetupController::class, 'store'])->middleware('auth')->name('meetups.store');
${sessionRoutes}`,
      "database/migrations/2026_01_01_000100_create_meetups.php":
        laravelMigration([
          [
            "meetups",
            `$table->id();
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->string('title', 120);
$table->text('description');
$table->string('location', 150);
$table->dateTime('starts_at')->index();
$table->timestamps();`,
          ],
        ]),
      "app/Models/Meetup.php": String.raw`<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meetup extends Model
{
    protected $fillable = ['title', 'description', 'location', 'starts_at', 'user_id'];
    protected $casts = ['starts_at' => 'datetime'];
}
`,
      "app/Http/Controllers/MeetupController.php": String.raw`<?php

namespace App\Http\Controllers;

use App\Models\Meetup;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class MeetupController
{
    public function index()
    {
        $meetups = Meetup::where('starts_at', '>', now())->orderBy('starts_at')->get();
        return view('meetups', compact('meetups'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:120',
            'description' => 'required|string|max:2000',
            'location' => 'required|string|max:150',
            'starts_at' => ['required', 'date_format:Y-m-d\TH:i', 'after:now'],
        ], ['starts_at.after' => 'Choisis une date et une heure dans le futur.']);
        $data['starts_at'] = Carbon::createFromFormat('Y-m-d\TH:i', $data['starts_at'], config('app.timezone'));
        Meetup::create([...$data, 'user_id' => $request->user()->id]);
        return redirect()->route('home')->with('status', 'Rencontre publiée.');
    }
}
`,
      "resources/views/meetups.blade.php": bladePage(
        "Meetups",
        `<h1>Rencontres à venir</h1>
@auth
  <form class="card" method="post" action="{{ route('meetups.store') }}">
    @csrf
    <label>Titre <input name="title" required value="{{ old('title') }}" maxlength="120"></label>
    <label>Description <textarea name="description" required maxlength="2000">{{ old('description') }}</textarea></label>
    <label>Lieu <input name="location" required value="{{ old('location') }}" maxlength="150"></label>
    <label>Date et heure ({{ config('app.timezone') }}) <input name="starts_at" type="datetime-local" required value="{{ old('starts_at') }}"></label>
    <button>Publier la rencontre</button>
  </form>
@else
  <p><a href="{{ route('register') }}">Créer un compte de test</a> ou <a href="{{ route('login') }}">se connecter</a> pour publier.</p>
@endauth
@forelse ($meetups as $meetup)
  <article class="card">
    <h2>{{ $meetup->title }}</h2>
    <p>{{ $meetup->starts_at->format('d/m/Y H:i') }} ({{ config('app.timezone') }}) · {{ $meetup->location }}</p>
    <p>{{ $meetup->description }}</p>
  </article>
@empty
  <p>Aucune rencontre à venir.</p>
@endforelse`,
      ),
    },
  }),
};

export const laravelFoundationProjects: [WebProject[], WebProject[]] = [
  [directory, blog],
  [projects, meetups],
];
