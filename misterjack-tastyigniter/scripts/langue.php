<?php
/*
 * Installe la traduction française et l'applique partout.
 *
 *   php scripts/langue.php            → cherche le code accepté par le marketplace
 *   php scripts/langue.php fr_FR      → installe ce code précis, puis l'applique
 *
 * « Partout » = langue par défaut de la boutique + langue de chaque compte
 * administrateur, les deux réglages étant distincts dans TastyIgniter.
 */
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$manager = resolve(\Igniter\System\Classes\LanguageManager::class);
$demande = $argv[1] ?? null;

if (!$demande) {
    echo "Recherche du code de langue accepté par le marketplace...\n\n";
    foreach (['fr', 'fr_FR', 'fr-FR', 'fr_fr', 'french', 'fr_MA'] as $code) {
        try {
            $found = $manager->findLanguage($code);
            echo $found
                ? "  {$code} : DISPONIBLE — ".($found['name'] ?? '?')."\n"
                : "  {$code} : introuvable\n";
        } catch (\Throwable $e) {
            echo "  {$code} : refusé (".$e->getMessage().")\n";
        }
    }
    echo "\nRelancer avec le code disponible, par exemple : php scripts/langue.php fr\n";
    exit(0);
}

echo "Installation du pack « {$demande} »...\n";
\Illuminate\Support\Facades\Artisan::call('igniter:language-install', ['locale' => $demande]);
echo \Illuminate\Support\Facades\Artisan::output();

$langue = \Igniter\System\Models\Language::query()
    ->where('code', $demande)
    ->orWhere('code', 'like', substr($demande, 0, 2).'%')
    ->first();

if (!$langue) {
    echo "Pack non installé : la langue n'apparaît pas en base. Rien n'a été modifié.\n";
    exit(1);
}

$langue->status = 1;
$langue->save();

\Igniter\System\Models\Settings::set(['default_language' => $langue->code]);
\Igniter\System\Models\Language::query()->where('language_id', '!=', $langue->language_id)->update(['is_default' => 0]);
\Igniter\System\Models\Language::query()->where('language_id', $langue->language_id)->update(['is_default' => 1]);

$admins = \Igniter\User\Models\User::query()->update(['language_id' => $langue->language_id]);

\Illuminate\Support\Facades\Artisan::call('optimize:clear');

echo "\nLangue « {$langue->name} » ({$langue->code}) :\n";
echo "  - langue par défaut de la boutique  : OK\n";
echo "  - comptes administrateur bascules   : {$admins}\n";
echo "  - cache vidé                        : OK\n";
