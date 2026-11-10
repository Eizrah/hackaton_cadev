import {
  bladePage,
  laravelFiles,
  laravelMigration,
  laravelUserModel,
  laravelUsers,
} from "./laravelAuthoring";
import { sessionFiles, sessionRoutes } from "./laravelSession";
import type { WebProject } from "./webCourseTypes";

const forum: WebProject = {
  id: "forum-sanctum",
  title: "L’API de forum avec Sanctum",
  description:
    "Inscris des membres, émets un jeton et expose des sujets et commentaires en JSON.",
  minutes: 95,
  requirements: [
    "S’inscrire et obtenir un jeton à durée limitée.",
    "Vérifier qu’une requête anonyme ne peut pas publier.",
    "Créer un sujet et un commentaire. Lire les réponses via des ressources qui omettent les données privées.",
  ],
  hints: [
    "Le README contient des exemples PowerShell.",
    "Ajoute Authorization: Bearer suivi du jeton aux requêtes d’écriture.",
    "Lance composer test pour vérifier les réponses de l’API.",
  ],
  files: laravelFiles("Forum DevAfrica", {
    api: true,
    tests: true,
    entry: "routes/api.php",
    sources: {
      "routes/web.php": String.raw`<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'forum');
`,
      "resources/views/forum.blade.php": bladePage(
        "Forum",
        `<h1>API du forum DevAfrica</h1>
<p>Les sujets sont publics. Pour publier, crée un compte et envoie un jeton Sanctum.</p>
<ul class="card">
  <li><a href="/api/topics">GET /api/topics</a> · Lire les sujets</li>
  <li><code>POST /api/register</code> · Créer un compte de test</li>
  <li><code>POST /api/login</code> · Obtenir un jeton</li>
  <li><code>POST /api/topics</code> · Publier un sujet</li>
  <li><code>POST /api/topics/{id}/comments</code> · Commenter</li>
  <li><code>DELETE /api/token</code> · Révoquer le jeton courant</li>
</ul>
<p>Utilise les exemples PowerShell du README.md pour essayer les routes d’écriture.</p>`,
      ),
      "routes/api.php": String.raw`<?php

use App\Http\Controllers\ForumController;
use App\Http\Controllers\TokenController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:8,1')->group(function () {
    Route::post('/register', [TokenController::class, 'register']);
    Route::post('/login', [TokenController::class, 'login']);
});
Route::get('/topics', [ForumController::class, 'index']);
Route::get('/topics/{topic}', [ForumController::class, 'show']);
Route::get('/topics/{topic}/comments', [ForumController::class, 'comments']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/topics', [ForumController::class, 'store']);
    Route::post('/topics/{topic}/comments', [ForumController::class, 'comment']);
    Route::delete('/token', [TokenController::class, 'revoke']);
});
`,
      "database/migrations/2026_01_01_000000_create_users.php": laravelUsers,
      "database/migrations/2026_01_01_000100_create_forum.php":
        laravelMigration([
          [
            "personal_access_tokens",
            `$table->id();
$table->morphs('tokenable');
$table->string('name');
$table->string('token', 64)->unique();
$table->text('abilities')->nullable();
$table->timestamp('last_used_at')->nullable();
$table->timestamp('expires_at')->nullable()->index();
$table->timestamps();`,
          ],
          [
            "topics",
            `$table->id();
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->string('title', 120);
$table->text('body');
$table->timestamps();`,
          ],
          [
            "comments",
            `$table->id();
$table->foreignId('topic_id')->constrained()->cascadeOnDelete();
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->text('body');
$table->timestamps();`,
          ],
        ]),
      "app/Models/User.php": laravelUserModel(true),
      "app/Models/Topic.php": String.raw`<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    protected $fillable = ['user_id', 'title', 'body'];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
`,
      "app/Models/Comment.php": String.raw`<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['user_id', 'body'];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
`,
      "app/Http/Controllers/TokenController.php": String.raw`<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TokenController
{
    public function register(Request $request)
    {
        $this->normalizeEmail($request);
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:12|max:72',
        ]);
        $data['password'] = Hash::make($data['password']);
        return response()->json($this->issue(User::create($data)), 201);
    }

    public function login(Request $request)
    {
        $this->normalizeEmail($request);
        $data = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|max:72',
        ]);
        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'Identifiants incorrects.']);
        }
        return response()->json($this->issue($user));
    }

    public function revoke(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }

    private function issue(User $user): array
    {
        $expiry = now()->addHours(12);
        return [
            'token' => $user->createToken('atelier', ['*'], $expiry)->plainTextToken,
            'expires_at' => $expiry->toISOString(),
        ];
    }

    private function normalizeEmail(Request $request): void
    {
        $email = $request->input('email');
        if (is_string($email)) {
            $request->merge(['email' => Str::lower(trim($email))]);
        }
    }
}
`,
      "app/Http/Controllers/ForumController.php": String.raw`<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Http\Resources\TopicResource;
use App\Models\Topic;
use Illuminate\Http\Request;

class ForumController
{
    public function index()
    {
        return TopicResource::collection(Topic::with('author')->latest('id')->paginate(15));
    }

    public function show(Topic $topic)
    {
        return new TopicResource($topic->load('author'));
    }

    public function comments(Topic $topic)
    {
        return CommentResource::collection($topic->comments()->with('author')->oldest('id')->paginate(20));
    }

    public function store(Request $request)
    {
        $data = $request->validate(['title' => 'required|string|max:120', 'body' => 'required|string|max:4000']);
        $topic = Topic::create([...$data, 'user_id' => $request->user()->id]);
        return (new TopicResource($topic->load('author')))->response()->setStatusCode(201);
    }

    public function comment(Request $request, Topic $topic)
    {
        $data = $request->validate(['body' => 'required|string|max:2000']);
        $comment = $topic->comments()->create([...$data, 'user_id' => $request->user()->id]);
        return (new CommentResource($comment->load('author')))->response()->setStatusCode(201);
    }
}
`,
      "app/Http/Resources/TopicResource.php": String.raw`<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TopicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'author' => $this->author->name,
            'published_at' => $this->created_at->toISOString(),
            'comments_url' => url('/api/topics/'.$this->id.'/comments'),
        ];
    }
}
`,
      "app/Http/Resources/CommentResource.php": String.raw`<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'topic_id' => $this->topic_id,
            'body' => $this->body,
            'author' => $this->author->name,
        ];
    }
}
`,
      "tests/ForumTest.php": String.raw`<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;

class ForumTest extends TestCase
{
    use RefreshDatabase;

    public function test_anon_cannot_publish_and_token_can_be_revoked(): void
    {
        $this->postJson('/api/topics', ['title' => 'Premier sujet', 'body' => 'Bonjour'])->assertUnauthorized();
        $token = $this->postJson('/api/register', [
            'name' => 'Amina', 'email' => 'amina@example.test', 'password' => 'Exercice-local-2026!',
        ])->assertCreated()->json('token');
        $headers = ['Authorization' => 'Bearer '.$token];
        $topic = $this->postJson('/api/topics', ['title' => 'Premier sujet', 'body' => 'Bonjour'], $headers)
            ->assertCreated()->assertJsonPath('data.author', 'Amina')->json('data.id');
        $this->postJson("/api/topics/$topic/comments", ['body' => 'Salut !'], $headers)
            ->assertCreated()->assertJsonPath('data.author', 'Amina');
        $this->getJson("/api/topics/$topic/comments")->assertOk()->assertJsonPath('data.0.body', 'Salut !');
        $this->getJson('/api/topics')->assertOk()->assertJsonMissingPath('data.0.email');
        $this->deleteJson('/api/token', [], $headers)->assertNoContent();
        $this->app['auth']->forgetGuards();
        $this->postJson('/api/topics', ['title' => 'Refus', 'body' => 'Test'], $headers)->assertUnauthorized();
    }
}
`,
    },
    notes: `## Essayer l’API dans PowerShell

Ouvre un deuxième terminal après le démarrage du serveur.

\`\`\`powershell
$base = 'http://127.0.0.1:8001/api'
$compte = Invoke-RestMethod -Uri "$base/register" -Method Post -ContentType 'application/json' -Body '{"name":"Amina","email":"amina@example.test","password":"Exercice-local-2026!"}'
$headers = @{Authorization = "Bearer $($compte.token)"; Accept = 'application/json'}
$sujet = Invoke-RestMethod -Uri "$base/topics" -Method Post -Headers $headers -ContentType 'application/json' -Body '{"title":"Mon premier sujet","body":"Bonjour DevAfrica"}'
Invoke-RestMethod -Uri "$base/topics/$($sujet.data.id)/comments" -Method Post -Headers $headers -ContentType 'application/json' -Body '{"body":"Bienvenue !"}'
Invoke-RestMethod -Uri "$base/topics/$($sujet.data.id)/comments"
\`\`\`

Pour un compte existant, envoie email et password à POST /api/login. DELETE /api/token révoque le jeton fourni.
`,
  }),
};

const support: WebProject = {
  id: "support-tickets",
  title: "La plateforme de tickets de support",
  description:
    "Crée un ticket depuis un compte connecté et confirme son ouverture dans un worker Laravel.",
  minutes: 100,
  requirements: [
    "Créer un ticket validé et le rattacher au compte connecté.",
    "Afficher seulement les tickets du compte courant.",
    "Lancer un worker pour traiter le job et retrouver le message de confirmation dans les journaux locaux.",
  ],
  hints: [
    "Inscris-toi depuis l’accueil de l’atelier.",
    "Dans un second terminal, lance php artisan queue:work --stop-when-empty après avoir créé un ticket.",
    "Le mail de démonstration est écrit dans storage/logs/laravel.log.",
  ],
  files: laravelFiles("Tickets de support", {
    tests: true,
    entry: "app/Jobs/SendTicketConfirmation.php",
    sources: {
      ...sessionFiles,
      "routes/web.php": String.raw`<?php

use App\Http\Controllers\SessionController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

Route::get('/', [TicketController::class, 'index'])->name('home');
Route::post('/tickets', [TicketController::class, 'store'])->middleware('auth')->name('tickets.store');
${sessionRoutes}`,
      "database/migrations/2026_01_01_000100_create_tickets_and_queue.php":
        laravelMigration([
          [
            "tickets",
            `$table->id();
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->string('subject', 120);
$table->text('description');
$table->timestamps();`,
          ],
          [
            "jobs",
            `$table->id();
$table->string('queue')->index();
$table->longText('payload');
$table->unsignedTinyInteger('attempts');
$table->unsignedInteger('reserved_at')->nullable();
$table->unsignedInteger('available_at');
$table->unsignedInteger('created_at');`,
          ],
          [
            "failed_jobs",
            `$table->id();
$table->string('uuid')->unique();
$table->text('connection');
$table->text('queue');
$table->longText('payload');
$table->longText('exception');
$table->timestamp('failed_at')->useCurrent();`,
          ],
        ]),
      "app/Models/Ticket.php": String.raw`<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['user_id', 'subject', 'description'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
`,
      "app/Http/Controllers/TicketController.php": String.raw`<?php

namespace App\Http\Controllers;

use App\Jobs\SendTicketConfirmation;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController
{
    public function index(Request $request)
    {
        $tickets = $request->user()
            ? Ticket::where('user_id', $request->user()->id)->latest('id')->paginate(15)
            : null;
        return view('tickets', compact('tickets'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'subject' => 'required|string|max:120',
            'description' => 'required|string|max:2500',
        ]);
        DB::transaction(function () use ($request, $data): void {
            $ticket = Ticket::create([...$data, 'user_id' => $request->user()->id]);
            // Avec la file database du projet, le ticket et le job utilisent la même base.
            SendTicketConfirmation::dispatch($ticket->id)->onConnection('database');
        });
        return redirect()->route('home')->with('status', 'Ticket créé. La confirmation est en file d’attente.');
    }
}
`,
      "app/Jobs/SendTicketConfirmation.php": String.raw`<?php

namespace App\Jobs;

use App\Models\Ticket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;

class SendTicketConfirmation implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public int $ticketId)
    {
    }

    public function handle(): void
    {
        $ticket = Ticket::with('owner')->find($this->ticketId);
        if (!$ticket || !$ticket->owner) {
            return;
        }
        Mail::send('emails.ticket', ['ticket' => $ticket], function (Message $message) use ($ticket) {
            $message->to($ticket->owner->email)->subject('Confirmation du ticket #'.$ticket->id);
        });
    }
}
`,
      "resources/views/emails/ticket.blade.php": `<!doctype html>
<html lang="fr"><body style="font: 16px sans-serif; color: #173b5c">
  <h1 style="color: #195e9a">Ticket #{{ $ticket->id }} reçu</h1>
  <p>Bonjour {{ $ticket->owner->name }},</p>
  <p>Nous avons reçu ta demande <strong>{{ $ticket->subject }}</strong>.</p>
  <p>L’équipe de support DevAfrica</p>
</body></html>`,
      "resources/views/tickets.blade.php": bladePage(
        "Support",
        `<h1>Support DevAfrica</h1>
@auth
  <form class="card" method="post" action="{{ route('tickets.store') }}">
    @csrf
    <label>Sujet <input name="subject" value="{{ old('subject') }}" required maxlength="120"></label>
    <label>Description <textarea name="description" required maxlength="2500">{{ old('description') }}</textarea></label>
    <button>Ouvrir le ticket</button>
  </form>
  @forelse ($tickets as $ticket)
    <article class="card"><h2>#{{ $ticket->id }} · {{ $ticket->subject }}</h2><p>{{ $ticket->description }}</p></article>
  @empty
    <p>Tu n’as encore aucun ticket.</p>
  @endforelse
  @if ($tickets->hasPages())
    <nav class="actions" aria-label="Pages de tickets">
      @if ($tickets->previousPageUrl()) <a href="{{ $tickets->previousPageUrl() }}">Page précédente</a> @endif
      @if ($tickets->nextPageUrl()) <a href="{{ $tickets->nextPageUrl() }}">Page suivante</a> @endif
    </nav>
  @endif
@else
  <p><a href="{{ route('register') }}">Créer un compte de test</a> ou <a href="{{ route('login') }}">se connecter</a> pour ouvrir un ticket.</p>
@endauth`,
      ),
      "tests/SupportTest.php": String.raw`<?php

namespace Tests;

use App\Jobs\SendTicketConfirmation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Queue;

class SupportTest extends TestCase
{
    use RefreshDatabase;

    public function test_ticket_is_queued_and_visible_only_to_its_owner(): void
    {
        Queue::fake();
        $alice = User::create(['name' => 'Alice', 'email' => 'alice@example.test', 'password' => Hash::make('Local-test-098!')]);
        $bob = User::create(['name' => 'Bob', 'email' => 'bob@example.test', 'password' => Hash::make('Local-test-098!')]);
        $this->post('/tickets', [])->assertRedirect('/connexion');
        $this->actingAs($alice)->post('/tickets', ['subject' => 'Besoin d’aide', 'description' => 'Le clavier ne répond pas.'])->assertRedirect('/');
        $this->assertDatabaseHas('tickets', ['user_id' => $alice->id, 'subject' => 'Besoin d’aide']);
        Queue::assertPushed(SendTicketConfirmation::class);
        $this->get('/')->assertOk()->assertSee('Besoin d’aide');
        $this->actingAs($bob)->get('/')->assertOk()->assertDontSee('Besoin d’aide');
    }
}
`,
    },
    notes: `## Traiter une confirmation

Crée un compte de test et ouvre un ticket. Laisse le serveur démarré.
Dans un autre terminal, lance php artisan queue:work --stop-when-empty.
Vérifie ensuite storage/logs/laravel.log. Le transport mail de l’atelier écrit la
confirmation dans ce journal.

Avant un déploiement, configure le transport mail, un worker supervisé et la gestion des jobs échoués. Le cours explique la configuration de production.
`,
  }),
};

export const laravelAdvancedProjects: WebProject[] = [forum, support];
