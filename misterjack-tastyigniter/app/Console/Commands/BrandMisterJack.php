<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Igniter\Main\Classes\ThemeManager;
use Igniter\Main\Models\Theme;
use Igniter\System\Facades\Assets;
use Illuminate\Console\Command;

/**
 * Applique la charte Mister Jack au thème de la boutique.
 *
 * TastyIgniter expose déjà les couleurs et les polices du thème sous forme de
 * variables SCSS (Design > Thèmes > Personnaliser dans l'admin). On écrit donc
 * les valeurs de la charte dans le thème, puis on relance la compilation :
 * app.css est régénéré aux couleurs de misterjack.ma sans qu'une seule ligne
 * de vendor/ ne soit touchée, et `composer update` continue de passer.
 */
class BrandMisterJack extends Command
{
    protected $signature = 'misterjack:brand
        {--theme= : Code du thème à habiller (par défaut le thème actif)}
        {--file= : Fichier JSON de la charte (par défaut data/theme-misterjack.json)}
        {--no-compile : Écrire la charte sans recompiler app.css}';

    protected $description = 'Applique la charte graphique Mister Jack au thème de la boutique.';

    public function handle(): int
    {
        $path = $this->option('file') ?: base_path('data/theme-misterjack.json');
        if (!is_file($path)) {
            $this->error(sprintf('Charte introuvable : %s', $path));

            return self::FAILURE;
        }

        $brand = json_decode((string) file_get_contents($path), true);
        if (!is_array($brand)) {
            $this->error(sprintf('Charte illisible (JSON invalide) : %s', $path));

            return self::FAILURE;
        }

        // Les clés commençant par « _ » ne sont que des commentaires.
        $brand = array_filter(
            $brand,
            fn($key): bool => !str_starts_with((string) $key, '_'),
            ARRAY_FILTER_USE_KEY,
        );

        $themeManager = resolve(ThemeManager::class);
        $code = $this->option('theme') ?: $themeManager->getActiveTheme()?->getName();
        if (blank($code)) {
            $this->error('Aucun thème actif : impossible de savoir quoi habiller.');

            return self::FAILURE;
        }

        /** @var Theme|null $model */
        $model = Theme::where('code', $code)->first();
        if (!$model) {
            $this->error(sprintf('Thème « %s » introuvable en base.', $code));

            return self::FAILURE;
        }

        // On fusionne : le logo, le favicon et tout ce que le client a réglé
        // depuis l'admin et qui n'est pas dans la charte reste en place.
        $before = $model->getThemeData() ?: [];
        $model->data = array_merge($before, $brand);
        $model->save();

        $this->info(sprintf('Charte appliquée au thème « %s ».', $code));
        foreach ($brand as $key => $value) {
            $this->line(sprintf(
                '  %-20s %s',
                $key,
                is_bool($value) ? ($value ? 'oui' : 'non') : (string) $value,
            ));
        }

        if ($this->option('no-compile')) {
            $this->warn('Recompilation ignorée (--no-compile) : lancez `php artisan igniter:util compile scss`.');

            return self::SUCCESS;
        }

        return $this->compile($themeManager, $code);
    }

    /**
     * Régénère app.css à partir des variables qu'on vient d'écrire.
     */
    private function compile(ThemeManager $themeManager, string $code): int
    {
        // Le thème garde ses réglages en mémoire une fois lus ; on les vide
        // pour que la compilation reparte de ce qui vient d'être enregistré.
        Theme::clearThemeInstances();

        $theme = $themeManager->findTheme($code);
        if (!$theme) {
            $this->error(sprintf('Thème « %s » introuvable sur le disque.', $code));

            return self::FAILURE;
        }

        (function(): void {
            $this->customData = null;
        })->call($theme);

        $this->info('Recompilation de la feuille de style...');
        foreach (Assets::buildBundles($theme) as $note) {
            $this->line('  '.$note);
        }

        return self::SUCCESS;
    }
}
