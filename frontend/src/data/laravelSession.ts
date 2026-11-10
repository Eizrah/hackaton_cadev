import { bladePage, laravelUserModel, laravelUsers } from "./laravelAuthoring";

export const sessionRoutes = `
Route::get('/connexion', [SessionController::class, 'form'])->name('login');
Route::post('/connexion', [SessionController::class, 'login'])->middleware('throttle:8,1');
Route::get('/inscription', [SessionController::class, 'registerForm'])->name('register');
Route::post('/inscription', [SessionController::class, 'register'])->middleware('throttle:8,1');
Route::post('/deconnexion', [SessionController::class, 'logout'])->middleware('auth')->name('logout');
`;

export const sessionFiles = {
  "database/migrations/2026_01_01_000000_create_users.php": laravelUsers,
  "app/Models/User.php": laravelUserModel(false),
  "app/Http/Controllers/SessionController.php": String.raw`<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SessionController
{
    public function form()
    {
        return view('session', ['registration' => false]);
    }

    public function registerForm()
    {
        return view('session', ['registration' => true]);
    }

    public function login(Request $request)
    {
        $this->normalizeEmail($request);
        $credentials = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|max:72',
        ]);
        if (!Auth::attempt($credentials)) {
            return back()->withErrors(['email' => 'Identifiants incorrects.'])->onlyInput('email');
        }
        $request->session()->regenerate();
        return redirect()->intended('/');
    }

    public function register(Request $request)
    {
        $this->normalizeEmail($request);
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:12|max:72|confirmed',
        ]);
        $data['password'] = Hash::make($data['password']);
        Auth::login(User::create($data));
        $request->session()->regenerate();
        return redirect()->intended('/');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
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
  "resources/views/session.blade.php": bladePage(
    "Compte atelier",
    `<h1>{{ $registration ? 'Créer un compte local' : 'Se connecter' }}</h1>
<form class="card" method="post" action="{{ route($registration ? 'register' : 'login') }}">
  @csrf
  @if ($registration) <label>Nom <input name="name" value="{{ old('name') }}" required maxlength="100"></label> @endif
  <label>E-mail <input name="email" type="email" value="{{ old('email') }}" required maxlength="255"></label>
  <label>Mot de passe <input name="password" type="password" required maxlength="72"></label>
  @if ($registration) <label>Confirmation <input name="password_confirmation" type="password" required maxlength="72"></label> @endif
  <button>{{ $registration ? 'Créer mon compte' : 'Se connecter' }}</button>
</form>
<a href="{{ route($registration ? 'login' : 'register') }}">{{ $registration ? 'Déjà inscrit ?' : 'Créer un compte' }}</a>`,
  ),
};
