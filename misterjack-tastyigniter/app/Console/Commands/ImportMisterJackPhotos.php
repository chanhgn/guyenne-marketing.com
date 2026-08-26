<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Igniter\Cart\Models\Menu;
use Igniter\Flame\Database\Attach\MediaAdder;
use Igniter\Main\Classes\MediaItem;
use Igniter\Main\Classes\MediaLibrary;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\File\File as SymfonyFile;
use Throwable;

/**
 * Rattache les photos de la médiathèque aux articles de la carte.
 *
 * Le client dépose ses photos en bloc dans la médiathèque de l'admin, puis
 * doit ouvrir chaque article un par un pour y accrocher la bonne. Sur vingt
 * articles c'est long et on se trompe. Cette commande fait le rapprochement
 * sur le nom du fichier : « smash-uno-classic.jpg » retrouve « Smash UNO —
 * Classic », accents, tirets et majuscules mis de côté.
 *
 * Par défaut elle ne fait que montrer ce qu'elle ferait. Rien n'est écrit
 * sans --appliquer : on regarde d'abord la liste, on renomme les fichiers
 * restés sans article, puis on relance.
 */
class ImportMisterJackPhotos extends Command
{
    protected $signature = 'misterjack:photos
        {--appliquer : Rattacher pour de bon (sans cette option, simple aperçu)}
        {--dossier=/ : Sous-dossier de la médiathèque à parcourir}
        {--remplacer : Remplacer aussi les photos des articles qui en ont déjà une}
        {--correspondances= : Fichier JSON « nom-de-fichier » => « nom d article »}';

    protected $description = 'Rattache les photos de la médiathèque aux articles de la carte.';

    /**
     * En dessous, deux noms se ressemblent trop peu pour qu'on décide seul.
     */
    private const float MIN_SCORE = 0.6;

    public function handle(): int
    {
        $apply = (bool) $this->option('appliquer');

        $photos = $this->listPhotos((string) $this->option('dossier'));
        if ($photos === []) {
            $this->error('Aucune photo trouvée dans la médiathèque.');

            return self::FAILURE;
        }

        $items = Menu::query()->get(['menu_id', 'menu_name']);
        if ($items->isEmpty()) {
            $this->error('Aucun article dans la carte.');

            return self::FAILURE;
        }

        $overrides = $this->loadOverrides();
        $taken = [];
        $attached = 0;
        $unmatched = [];

        $this->line(sprintf('%d photos, %d articles.', count($photos), $items->count()));
        $this->newLine();

        foreach ($photos as $photo) {
            $item = $this->matchItem($photo, $items, $overrides);

            if (!$item) {
                $unmatched[] = $photo->name;
                $this->line(sprintf('  <fg=yellow>%-42s aucun article ne correspond</>', $photo->name));

                continue;
            }

            if (isset($taken[$item->menu_id])) {
                $unmatched[] = $photo->name;
                $this->line(sprintf(
                    '  <fg=yellow>%-42s « %s » a déjà reçu %s</>',
                    $photo->name, $item->menu_name, $taken[$item->menu_id],
                ));

                continue;
            }

            if (!$this->option('remplacer') && $item->hasMedia('thumb')) {
                $this->line(sprintf('  <fg=gray>%-42s « %s » a déjà une photo</>', $photo->name, $item->menu_name));

                continue;
            }

            $taken[$item->menu_id] = $photo->name;
            $this->line(sprintf('  %-42s → %s', $photo->name, $item->menu_name));

            if ($apply && $this->attach($item, $photo)) {
                $attached++;
            }
        }

        $this->report($items, $taken, $unmatched, $apply, $attached);

        return self::SUCCESS;
    }

    /**
     * @return list<MediaItem>
     */
    private function listPhotos(string $folder): array
    {
        $files = resolve(MediaLibrary::class)->listFolderContents($folder, 'files', true) ?? [];

        return array_values(array_filter(
            $files,
            fn(MediaItem $file): bool => $file->fileType === MediaItem::FILE_TYPE_IMAGE,
        ));
    }

    /**
     * @return array<string, string>
     */
    private function loadOverrides(): array
    {
        $path = (string) $this->option('correspondances');
        if ($path === '') {
            return [];
        }

        if (!is_file($path)) {
            $this->warn(sprintf('Fichier de correspondances introuvable : %s', $path));

            return [];
        }

        $map = json_decode((string) file_get_contents($path), true);

        return is_array($map) ? array_change_key_case($map) : [];
    }

    /**
     * @param \Illuminate\Support\Collection<int, Menu> $items
     * @param array<string, string> $overrides
     */
    private function matchItem(MediaItem $photo, $items, array $overrides): ?Menu
    {
        if ($forced = $overrides[strtolower($photo->name)] ?? null) {
            return $items->first(fn(Menu $item): bool => $this->normalise($item->menu_name) === $this->normalise($forced));
        }

        $name = $this->normalise(pathinfo($photo->name, PATHINFO_FILENAME));

        $best = null;
        $bestScore = 0.0;
        foreach ($items as $item) {
            $score = $this->score($name, $this->normalise($item->menu_name));
            if ($score > $bestScore) {
                $bestScore = $score;
                $best = $item;
            }
        }

        return $bestScore >= self::MIN_SCORE ? $best : null;
    }

    /**
     * Ramène « Smash UNO — Classic » et « smash_uno-classic » à la même chaîne.
     */
    private function normalise(string $value): string
    {
        $value = Str::ascii($value);

        // L'apostrophe se perd au passage en nom de fichier : « Jack's Burger »
        // devient « jacks-burger ». On la retire des deux côtés plutôt que d'en
        // faire une coupure de mot, sinon les deux ne se ressemblent plus.
        $value = str_replace(["'", '’', '`'], '', $value);
        $value = strtolower(preg_replace('/[^a-zA-Z0-9]+/', ' ', $value) ?? '');

        return trim(preg_replace('/\s+/', ' ', $value) ?? '');
    }

    /**
     * Proportion de mots communs, avec bonus si l'un contient l'autre.
     */
    private function score(string $left, string $right): float
    {
        if ($left === '' || $right === '') {
            return 0.0;
        }

        if ($left === $right) {
            return 1.0;
        }

        if (str_contains($left, $right) || str_contains($right, $left)) {
            return 0.95;
        }

        $leftWords = array_unique(explode(' ', $left));
        $rightWords = array_unique(explode(' ', $right));
        $common = array_intersect($leftWords, $rightWords);

        return count($common) / max(count($leftWords), count($rightWords));
    }

    private function attach(Menu $item, MediaItem $photo): bool
    {
        $tempPath = storage_path('app/misterjack-photos');
        @mkdir($tempPath, 0755, true);
        $tempFile = $tempPath.'/'.$photo->name;

        try {
            file_put_contents($tempFile, resolve(MediaLibrary::class)->get($photo->path));

            $item->clearMediaTag('thumb');
            resolve(MediaAdder::class)
                ->on($item->newMediaInstance())
                ->performedOn($item)
                ->useMediaTag('thumb')
                ->fromFile(new SymfonyFile($tempFile));

            return true;
        } catch (Throwable $exception) {
            $this->error(sprintf('    %s : %s', $photo->name, $exception->getMessage()));

            return false;
        } finally {
            @unlink($tempFile);
        }
    }

    /**
     * @param \Illuminate\Support\Collection<int, Menu> $items
     * @param array<int, string> $taken
     * @param list<string> $unmatched
     */
    private function report($items, array $taken, array $unmatched, bool $apply, int $attached): void
    {
        $this->newLine();

        if ($unmatched !== []) {
            $this->warn(sprintf('%d photo(s) sans article :', count($unmatched)));
            foreach ($unmatched as $name) {
                $this->line('  '.$name);
            }
            $this->line('Renommez-les comme l\'article, ou passez --correspondances=fichier.json.');
            $this->newLine();
        }

        $orphans = $items
            ->reject(fn(Menu $item): bool => isset($taken[$item->menu_id]) || $item->hasMedia('thumb'))
            ->pluck('menu_name');

        if ($orphans->isNotEmpty()) {
            $this->warn(sprintf('%d article(s) toujours sans photo :', $orphans->count()));
            foreach ($orphans as $name) {
                $this->line('  '.$name);
            }
            $this->newLine();
        }

        if ($apply) {
            $this->info(sprintf('%d photo(s) rattachée(s).', $attached));

            return;
        }

        $this->info(sprintf(
            'Aperçu seulement : %d rattachement(s) prévu(s). Relancez avec --appliquer pour les écrire.',
            count($taken),
        ));
    }
}
