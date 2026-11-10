import { consoleFiles } from "./desktopAuthoring";
import { scriptGuiFiles } from "./scriptAuthoring";
import type { WebProject } from "./webCourseTypes";

const analyser = `<?php
declare(strict_types=1);

$phrase = readline("Écris une phrase : ");
if ($phrase === false || trim($phrase) === '') {
    fwrite(STDERR, "Saisis une phrase.\\n");
    exit(1);
}
$phrase = trim($phrase);
$filtre = preg_replace('/secret/iu', '******', $phrase);
echo "Longueur UTF-8 : " . mb_strlen($phrase, 'UTF-8') . " caractères\\n";
echo "Texte filtré : " . $filtre . "\\n";
`;
const css = `* { box-sizing: border-box; } body { margin: 0; padding: 30px; background: #edf5fd; color: #193d5e; font: 16px/1.6 system-ui; } main { max-width: 650px; margin: auto; } form, .card { padding: 24px; background: white; border-radius: 18px; margin: 20px 0; border: 1px solid #cbdfef; } label, input { display: block; width: 100%; } input { padding: 10px; margin: 8px 0 18px; border: 1px solid #98b7d2; border-radius: 8px; font: inherit; } button { padding: 12px 20px; background: #166cab; color: white; border: 0; border-radius: 9px; font: inherit; cursor: pointer; } :focus-visible { outline: 3px solid #70b4ec; outline-offset: 3px; } .score { font-size: 64px; margin: 12px 0; } .error { color: #a02e42; } li { padding: 6px 0; }`;
const counterModel = `<?php
declare(strict_types=1);

final class Compteur {
    public function __construct(private int $valeur = 0) {}
    public function incrementer(): void { $this->valeur++; }
    public function valeur(): int { return $this->valeur; }
}
`;
const counterView = `<?php
declare(strict_types=1);
require __DIR__ . '/Compteur.php';
session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict']);
session_start();
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
$compteur = new Compteur((int) ($_SESSION['score'] ?? 0));
$erreur = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!is_string($_POST['csrf'] ?? null) || !hash_equals($_SESSION['csrf'], $_POST['csrf'])) {
        $erreur = 'Recharge le formulaire pour réessayer.';
    } else {
        $compteur->incrementer();
        $_SESSION['score'] = $compteur->valeur();
        header('Location: ./', true, 303);
        exit;
    }
}
?><!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Compteur PHP</title><link rel="stylesheet" href="style.css"></head><body><main><p>DEVAfrica · PHP DESKTOP</p><h1>Mon compteur de clics</h1><section class="card"><p class="score"><?= $compteur->valeur() ?></p><p>L’état est conservé dans cette session.</p></section><form method="post"><input type="hidden" name="csrf" value="<?= htmlspecialchars($_SESSION['csrf'], ENT_QUOTES, 'UTF-8') ?>"><button type="submit">Ajouter un clic</button></form><p class="error" role="status"><?= htmlspecialchars($erreur, ENT_QUOTES, 'UTF-8') ?></p></main></body></html>
`;
const cashModel = `<?php
declare(strict_types=1);

function prixCentimes(string $saisie): int {
    $texte = trim(str_replace(',', '.', $saisie));
    if (!preg_match('/^[0-9]{1,9}(?:\\.[0-9]{1,2})?$/D', $texte)) {
        throw new InvalidArgumentException('Entre un prix positif avec au maximum deux décimales.');
    }
    $parties = explode('.', $texte);
    $centimes = (int) $parties[0] * 100 + (int) str_pad($parties[1] ?? '', 2, '0');
    if ($centimes <= 0) throw new InvalidArgumentException('Le prix doit être supérieur à zéro.');
    return $centimes;
}
function monnaie(int $centimes): string {
    return number_format(intdiv($centimes, 100), 0, ',', ' ') . ',' . str_pad((string) ($centimes % 100), 2, '0', STR_PAD_LEFT) . ' EUR';
}
final class Caisse {
    private array $prix;
    public function __construct(array $prix = []) { $this->prix = $prix; }
    public function ajouter(int $centimes): void {
        if ($centimes <= 0 || $this->totalHT() + $centimes > 100000000000 || count($this->prix) >= 100) {
            throw new InvalidArgumentException('Vérifie le montant et les limites de la caisse.');
        }
        $this->prix[] = $centimes;
    }
    public function lignes(): array { return $this->prix; }
    public function totalHT(): int { return array_sum($this->prix); }
    public function taxe(): int { return intdiv($this->totalHT() * 20 + 50, 100); }
    public function totalTTC(): int { return $this->totalHT() + $this->taxe(); }
}
`;
const cashView = `<?php
declare(strict_types=1);
require __DIR__ . '/Caisse.php';
session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict']);
session_start();
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
$caisse = new Caisse($_SESSION['prix'] ?? []);
$erreur = '';
$saisie = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!is_string($_POST['csrf'] ?? null) || !hash_equals($_SESSION['csrf'], $_POST['csrf'])) throw new InvalidArgumentException('Recharge le formulaire.');
        if (!is_string($_POST['prix'] ?? null)) throw new InvalidArgumentException('Saisis un prix.');
        $saisie = $_POST['prix'];
        $caisse->ajouter(prixCentimes($saisie));
        $_SESSION['prix'] = $caisse->lignes();
        header('Location: ./', true, 303);
        exit;
    } catch (InvalidArgumentException $exception) { $erreur = $exception->getMessage(); }
}
function echapper(string $texte): string { return htmlspecialchars($texte, ENT_QUOTES, 'UTF-8'); }
?><!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Caisse PHP</title><link rel="stylesheet" href="style.css"></head><body><main><p>DEVAfrica · CAISSE D’EXERCICE</p><h1>Mes achats, mon total.</h1><form method="post"><input type="hidden" name="csrf" value="<?= echapper($_SESSION['csrf']) ?>"><label for="prix">Prix hors taxe en euros</label><input id="prix" name="prix" inputmode="decimal" maxlength="12" value="<?= echapper($saisie) ?>" placeholder="Ex. 12,50" required><button type="submit">Ajouter le prix</button><p class="error" role="status"><?= echapper($erreur) ?></p></form><section class="card"><h2>Ticket de caisse</h2><ul><?php foreach ($caisse->lignes() as $ligne): ?><li><?= monnaie($ligne) ?></li><?php endforeach; ?></ul><p>HT <strong><?= monnaie($caisse->totalHT()) ?></strong></p><p>Taxe d’exercice fixe de 20 % <strong><?= monnaie($caisse->taxe()) ?></strong></p><h2>Total TTC <?= monnaie($caisse->totalTTC()) ?></h2></section></main></body></html>
`;
export const phpAnalyser: WebProject = {
  id: "analyseur-php",
  title: "L’analyseur de texte en console",
  description: "Lis une phrase UTF-8, mesure sa longueur et filtre un mot.",
  minutes: 60,
  requirements: [
    "Lire la phrase en CLI.",
    "Compter ses caractères avec mb_strlen.",
    "Remplacer le mot secret puis afficher la phrase filtrée.",
  ],
  hints: [
    "readline peut renvoyer false à la fin du flux.",
    "Les octets d’un texte et ses caractères UTF-8 se comptent avec des fonctions différentes.",
  ],
  files: consoleFiles("php", analyser, {
    stdin: "Voici un secret à découvrir.\n",
  }),
};
export const phpClicks: WebProject = {
  id: "compteur-php-desktop",
  title: "Le compteur de clics PHP Desktop",
  description:
    "Conserve un compteur dans une classe PHP et affiche son état dans la fenêtre.",
  minutes: 100,
  requirements: [
    "Créer une classe avec un compteur privé.",
    "Traiter le clic du formulaire en POST.",
    "Conserver le score entre les actions dans la session.",
    "Ouvrir l’interface dans PHP Desktop.",
  ],
  hints: [
    "PHP Desktop embarque le moteur PHP et une vue HTML.",
    "Une redirection après le POST évite de rejouer l’action au rafraîchissement.",
  ],
  files: scriptGuiFiles(
    "php-desktop",
    "Compteur PHP Desktop",
    "www/index.php",
    {
      "www/index.php": counterView,
      "www/Compteur.php": counterModel,
      "www/style.css": css,
    },
  ),
};
export const phpCash: WebProject = {
  id: "caisse-php-desktop",
  title: "La caisse enregistreuse PHP Desktop",
  description:
    "Valide les prix avec un modèle typé et actualise un ticket de caisse.",
  minutes: 135,
  requirements: [
    "Activer strict_types dans les fichiers PHP.",
    "Convertir un prix en centimes et rejeter une saisie invalide.",
    "Calculer le total HT, une taxe d’exercice et le TTC.",
    "Afficher les messages d’exception dans la vue.",
    "Garder le total courant après une saisie refusée.",
  ],
  hints: [
    "Valide avant de modifier la collection.",
    "Les centimes entiers permettent de maîtriser les arrondis.",
    "Le taux de 20 % est une donnée fictive de cet exercice.",
  ],
  files: scriptGuiFiles("php-desktop", "Caisse PHP Desktop", "www/index.php", {
    "www/index.php": cashView,
    "www/Caisse.php": cashModel,
    "www/style.css": css,
  }),
};
