import { laravelLaunchCommands } from "../lib/localStudio";
import type { WebFiles } from "./webCourseTypes";

const layout = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>@yield('title', 'Atelier Laravel')</title>
  <link rel="stylesheet" href="/atelier.css">
</head>
<body>
  <header><nav aria-label="Navigation principale">
    <a href="/">DevAfrica · Atelier Laravel</a>
    @auth
      <span>{{ auth()->user()->name }}</span>
      <form method="post" action="{{ route('logout') }}">
        @csrf
        <button>Se déconnecter</button>
      </form>
    @endauth
  </nav></header>
  <main>
    @if (session('status')) <p class="card" role="status">{{ session('status') }}</p> @endif
    @if ($errors->any())
      <div class="card error" role="alert"><ul>
        @foreach ($errors->all() as $error) <li>{{ $error }}</li> @endforeach
      </ul></div>
    @endif
    @yield('content')
  </main>
</body>
</html>
`;

const styles = `* { box-sizing: border-box; }
body { margin: 0; background: #edf5fc; color: #193953; font: 1rem/1.55 system-ui, sans-serif; }
header { background: #144a77; color: white; }
nav, main { max-width: 52rem; margin: auto; padding: 1rem; }
nav { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; }
nav a { color: white; }
main { padding-block: clamp(1rem, 5vw, 3rem); }
h1, h2 { line-height: 1.2; }
a { color: #12548d; }
button, input, textarea, select { font: inherit; }
button { background: #195e9a; color: white; border: 0; border-radius: .55rem; padding: .5rem .8rem; cursor: pointer; }
input, textarea, select { max-width: 100%; padding: .5rem; border: 1px solid #95aec7; border-radius: .45rem; }
label { display: block; margin-block: .65rem; }
label > :is(input, textarea, select) { display: block; }
.card { background: white; border: 1px solid #c7daec; border-radius: .8rem; padding: 1rem; margin: .8rem 0; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: .7rem; }
.prose { white-space: pre-line; }
.error { color: #a2273c; }
code { overflow-wrap: anywhere; }
:focus-visible { outline: 3px solid #52a1e9; outline-offset: 3px; }
`;

export function bladePage(title: string, content: string) {
  return `@extends('layout')
@section('title', '${title}')
@section('content')
${content.trim()}
@endsection
`;
}

export function laravelMigration(tables: [string, string][]) {
  const create = tables
    .map(
      ([name, body]) =>
        `        Schema::create('${name}', function (Blueprint $table) {\n${body
          .trim()
          .split("\n")
          .map((line) => "            " + line)
          .join("\n")}\n        });`,
    )
    .join("\n");
  const drop = [...tables]
    .reverse()
    .map(([name]) => `        Schema::dropIfExists('${name}');`)
    .join("\n");
  return String.raw`<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
${create}
    }

    public function down(): void
    {
${drop}
    }
};
`;
}

export const laravelUsers = laravelMigration([
  [
    "users",
    `
$table->id();
$table->string('name');
$table->string('email')->unique();
$table->string('password');
$table->rememberToken();
$table->timestamps();
`,
  ],
]);

export function laravelUserModel(sanctum: boolean) {
  return String.raw`<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
${sanctum ? String.raw`use Laravel\Sanctum\HasApiTokens;` : ""}

class User extends Authenticatable
{
${sanctum ? "    use HasApiTokens;\n" : ""}    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];
}
`;
}

type LaravelOptions = {
  entry?: string;
  sources: Record<string, string>;
  api?: boolean;
  tests?: boolean;
  notes?: string;
};

export function laravelFiles(
  title: string,
  { entry = "routes/web.php", sources, api, tests, notes }: LaravelOptions,
): WebFiles {
  return {
    html: "",
    css: "",
    entry,
    local: {
      runtime: "laravel",
      sources: {
        ...sources,
        "resources/views/layout.blade.php": layout,
        "public/atelier.css": styles,
        "composer.json": JSON.stringify(
          {
            name: "devafrica/atelier-laravel",
            type: "project",
            require: {
              php: "^8.2",
              "ext-pdo_sqlite": "*",
              "laravel/framework": "^12.0",
              ...(api ? { "laravel/sanctum": "^4.0" } : {}),
            },
            ...(tests
              ? {
                  "require-dev": {
                    "mockery/mockery": "^1.6",
                    "phpunit/phpunit": "^11.5",
                  },
                }
              : {}),
            autoload: { "psr-4": { "App\\": "app/" } },
            ...(tests
              ? { "autoload-dev": { "psr-4": { "Tests\\": "tests/" } } }
              : {}),
            scripts: {
              "post-autoload-dump": ["@php artisan package:discover --ansi"],
              ...(tests ? { test: ["@php vendor/bin/phpunit"] } : {}),
            },
            config: { "sort-packages": true },
          },
          null,
          2,
        ),
        artisan: String.raw`<?php

use Symfony\Component\Console\Input\ArgvInput;

define('LARAVEL_START', microtime(true));
require __DIR__.'/vendor/autoload.php';

exit((require __DIR__.'/bootstrap/app.php')->handleCommand(new ArgvInput));
`,
        "bootstrap/app.php": String.raw`<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
${api ? "        api: __DIR__.'/../routes/api.php',\n" : ""}        health: '/up',
    )
    ->withMiddleware()
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request, Throwable $error) => $request->is('api/*') || $request->expectsJson()
        );
    })
    ->create();
`,
        "bootstrap/providers.php": "<?php\n\nreturn [];\n",
        "bootstrap/cache/.gitignore": "*\n!.gitignore\n",
        "public/index.php": String.raw`<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));
require __DIR__.'/../vendor/autoload.php';

(require __DIR__.'/../bootstrap/app.php')->handleRequest(Request::capture());
`,
        "config/app.php": `<?php

return [
    'name' => env('APP_NAME', 'DevAfrica Atelier'),
    'locale' => 'fr',
    'fallback_locale' => 'en',
    'timezone' => env('APP_TIMEZONE', 'UTC'),
];
`,
        ".env.example": `APP_NAME="DevAfrica Atelier"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8001
APP_TIMEZONE=UTC

DB_CONNECTION=sqlite
CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=database
MAIL_MAILER=log
MAIL_FROM_ADDRESS=atelier@example.test
MAIL_FROM_NAME="DevAfrica Atelier"
`,
        "scripts/setup.php": `<?php

$root = dirname(__DIR__);
chdir($root);

foreach (['database', 'storage/logs', 'storage/framework/sessions', 'storage/framework/views', 'storage/framework/cache/data'] as $directory) {
    if (!is_dir($directory) && !mkdir($directory, 0775, true)) {
        throw new RuntimeException("Impossible de créer $directory.");
    }
}
if (!is_file('.env') && !copy('.env.example', '.env')) {
    throw new RuntimeException('Impossible de créer .env.');
}
if (!is_file('database/database.sqlite') && !touch('database/database.sqlite')) {
    throw new RuntimeException('Impossible de créer la base SQLite.');
}
$contents = file_get_contents('.env');
if ($contents === false) {
    throw new RuntimeException('Impossible de lire .env.');
}
if (preg_match('/^APP_KEY=([^\\r\\n]*)/m', $contents, $key) && trim($key[1], " \\t\\"'") !== '') {
    echo "Dossier Laravel prêt.".PHP_EOL;
    exit(0);
}
passthru(escapeshellarg(PHP_BINARY).' artisan key:generate', $status);
exit($status);
`,
        ".gitignore":
          "/vendor/\n/.env\n/database/*.sqlite*\n/storage/logs/*.log\n",
        ...(tests
          ? {
              "phpunit.xml": `<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php" colors="true">
  <testsuites><testsuite name="Atelier"><directory>tests</directory></testsuite></testsuites>
  <php>
    <env name="APP_ENV" value="testing" force="true"/>
    <env name="APP_KEY" value="base64:c2FtcGxlLWF0ZWxpZXItdGVzdC1rZXktMzItYnl0ZXM=" force="true"/>
    <env name="DB_CONNECTION" value="sqlite" force="true"/>
    <env name="DB_DATABASE" value=":memory:" force="true"/>
    <env name="CACHE_STORE" value="array" force="true"/>
    <env name="SESSION_DRIVER" value="array" force="true"/>
    <env name="MAIL_MAILER" value="array" force="true"/>
  </php>
</phpunit>
`,
              "tests/TestCase.php": String.raw`<?php

namespace Tests;

abstract class TestCase extends \Illuminate\Foundation\Testing\TestCase
{
}
`,
            }
          : {}),
        "README.md": `# ${title}

Ouvre ce dossier dans VS Code. Installe PHP 8.2 ou plus récent, Composer 2 et les extensions PHP requises par Laravel, dont PDO SQLite. Vérifie-les avec php -v, composer -V et php -m.

\`\`\`powershell
${laravelLaunchCommands}
\`\`\`

Ouvre http://127.0.0.1:8001/. Le script de préparation crée les fichiers locaux manquants. Garde la clé APP_KEY et les réglages du fichier .env sur ton ordinateur.
${tests ? "\nLance composer test depuis ce dossier pour exécuter les tests sur SQLite en mémoire.\n" : ""}
${notes ?? ""}`,
      },
    },
  };
}
