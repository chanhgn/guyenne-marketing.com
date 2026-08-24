<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Igniter\Cart\Models\Category;
use Igniter\Cart\Models\Menu;
use Igniter\Local\Models\Location;
use Igniter\Local\Models\LocationArea;
use Igniter\Local\Models\WorkingHour;
use Igniter\PayRegister\Models\Payment;
use Igniter\System\Models\Country;
use Igniter\System\Models\Currency;
use Igniter\System\Models\Settings;
use Illuminate\Console\Command;

/**
 * Configure une installation TastyIgniter neuve avec les données Mister Jack :
 * réglages boutique, dirham marocain, établissements, horaires, zones de
 * livraison, catégories, carte et paiement à la livraison.
 *
 * La commande est idempotente : on peut la relancer après avoir complété
 * data/misterjack.json (prix, adresse Casablanca) sans dupliquer les données.
 *
 * Usage : php artisan misterjack:seed --file=data/misterjack.json
 */
class SeedMisterJack extends Command
{
    protected $signature = 'misterjack:seed
        {--file=data/misterjack.json : Chemin du fichier JSON de configuration}
        {--keep-demo : Ne pas désactiver les données de démonstration TastyIgniter}';

    protected $description = 'Configure TastyIgniter avec les données Mister Jack (Fès + Casablanca)';

    /** Carbon::startOfWeek() = lundi, donc weekday 0 = lundi … 6 = dimanche. */
    private const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

    private const HOUR_TYPES = ['opening', 'delivery', 'collection'];

    /** Nombre d'articles Mister Jack laissés hors ligne faute de prix. */
    private int $missingPrices = 0;

    public function handle(): int
    {
        $path = $this->option('file');
        if (!str_starts_with((string) $path, '/')) {
            $path = base_path((string) $path);
        }

        if (!is_file($path)) {
            $this->error("Fichier introuvable : {$path}");

            return self::FAILURE;
        }

        $data = json_decode((string) file_get_contents($path), true);
        if (!is_array($data)) {
            $this->error("JSON invalide : {$path}");

            return self::FAILURE;
        }

        $this->seedSettings($data['settings'] ?? []);
        $this->seedCurrency($data['currency'] ?? []);
        $this->seedLocations($data['locations'] ?? []);
        $categories = $this->seedCategories($data['categories'] ?? []);
        $this->seedMenuItems($data['menu_items'] ?? [], $categories);
        $this->seedPayments($data['payments'] ?? []);

        if (!$this->option('keep-demo')) {
            $this->disableDemoData();
        }

        $this->newLine();
        $this->info('Configuration Mister Jack appliquée.');
        $this->reportPending();

        return self::SUCCESS;
    }

    private function seedSettings(array $settings): void
    {
        if ($settings === []) {
            return;
        }

        Settings::set($settings);

        $this->line('Réglages boutique : '.count($settings).' clés écrites.');
    }

    private function seedCurrency(array $currency): void
    {
        if ($currency === []) {
            return;
        }

        $countryId = $this->countryId($currency['country_iso2'] ?? 'MA');

        $model = Currency::firstOrNew(['currency_code' => $currency['code']]);
        $model->currency_name = $currency['name'];
        $model->currency_symbol = $currency['symbol'];
        $model->symbol_position = (int) ($currency['symbol_position'] ?? 1);
        $model->thousand_sign = $currency['thousand_sign'] ?? ' ';
        $model->decimal_sign = $currency['decimal_sign'] ?? ',';
        $model->decimal_position = (int) ($currency['decimal_position'] ?? 2);
        $model->currency_rate = 1;
        $model->currency_status = 1;
        $model->country_id = $countryId;
        $model->iso_alpha2 = $currency['country_iso2'] ?? 'MA';
        $model->save();

        // Un seul is_default possible : on bascule le drapeau à la main.
        Currency::query()->where('currency_id', '!=', $model->currency_id)->update(['is_default' => 0]);
        Currency::query()->where('currency_id', $model->currency_id)->update(['is_default' => 1]);

        $this->line("Devise par défaut : {$currency['code']} ({$currency['symbol']}).");
    }

    private function seedLocations(array $locations): void
    {
        foreach ($locations as $data) {
            $location = Location::firstOrNew(['permalink_slug' => $data['slug']]);
            $location->location_name = $data['name'];
            $location->location_email = $data['email'] ?? null;
            $location->description = $data['description'] ?? null;
            $location->location_address_1 = $data['address_1'] ?? '';
            $location->location_address_2 = $data['address_2'] ?? '';
            $location->location_city = $data['city'] ?? '';
            $location->location_state = $data['state'] ?? '';
            $location->location_postcode = $data['postcode'] ?? '';
            $location->location_country_id = $this->countryId($data['country_iso2'] ?? 'MA');
            $location->location_telephone = $data['telephone'] ?? '';
            $location->location_lat = $data['lat'] ?? null;
            $location->location_lng = $data['lng'] ?? null;
            $location->is_auto_lat_lng = ($data['lat'] ?? null) === null ? 1 : 0;
            $location->permalink_slug = $data['slug'];

            // Sécurité : un établissement sans adresse ni téléphone ne doit pas
            // encaisser de commandes, on le laisse hors ligne.
            $complete = !empty($data['address_1']) && !empty($data['telephone']);
            $location->location_status = ($data['status'] ?? false) && $complete ? 1 : 0;
            $location->is_default = ($data['is_default'] ?? false) ? 1 : 0;
            $location->save();

            $this->seedWorkingHours($location, $data['hours'] ?? []);
            $this->seedDeliveryAreas($location, $data['delivery_areas'] ?? []);

            $state = $location->location_status ? 'en ligne' : 'hors ligne (données manquantes)';
            $this->line("Établissement « {$location->location_name} » : {$state}.");
        }
    }

    private function seedWorkingHours(Location $location, array $hours): void
    {
        if ($hours === []) {
            return;
        }

        $regular = $hours['regular'] ?? ['open' => '11:30', 'close' => '00:00'];
        $late = $hours['late_nights'] ?? null;
        $lateDays = $late['weekdays'] ?? [];

        foreach (self::HOUR_TYPES as $type) {
            foreach (self::WEEKDAYS as $weekday) {
                $isLate = in_array($weekday, $lateDays, true);
                $open = $isLate ? $late['open'] : $regular['open'];
                $close = $isLate ? $late['close'] : $regular['close'];

                $hour = WorkingHour::firstOrNew([
                    'location_id' => $location->getKey(),
                    'type' => $type,
                    'weekday' => $weekday,
                ]);
                $hour->opening_time = $open;
                $hour->closing_time = $close;
                $hour->status = 1;
                $hour->save();
            }
        }
    }

    private function seedDeliveryAreas(Location $location, array $areas): void
    {
        foreach ($areas as $index => $area) {
            $model = LocationArea::firstOrNew([
                'location_id' => $location->getKey(),
                'name' => $area['name'],
            ]);
            $model->location_id = $location->getKey();
            $model->type = $area['type'] ?? 'circle';
            $model->boundaries = [
                'circle' => json_encode([
                    'lat' => $location->location_lat,
                    'lng' => $location->location_lng,
                    'radius' => $area['radius_km'],
                ]),
                'vertices' => json_encode([]),
                'components' => [],
            ];
            $model->conditions = [[
                'type' => 'above',
                'amount' => $area['delivery_fee'],
                'total' => $area['min_order'],
                'priority' => $area['priority'] ?? ($index + 1),
            ]];
            $model->priority = $area['priority'] ?? ($index + 1);
            $model->is_default = $index === 0 ? 1 : 0;
            $model->save();
        }
    }

    /** @return array<string, Category> */
    private function seedCategories(array $categories): array
    {
        $created = [];

        foreach ($categories as $data) {
            $category = Category::firstOrNew(['name' => $data['name']]);
            $category->description = $data['description'] ?? null;
            $category->priority = $data['priority'] ?? 1;
            $category->status = 1;
            $category->save();

            $created[$data['name']] = $category;
        }

        $this->line('Catégories : '.count($created).'.');

        return $created;
    }

    /** @param array<string, Category> $categories */
    private function seedMenuItems(array $items, array $categories): void
    {
        $this->missingPrices = 0;

        foreach ($items as $data) {
            $menu = Menu::firstOrNew(['menu_name' => $data['name']]);
            $menu->menu_description = $data['description'] ?? null;
            $menu->menu_price = $data['price'] ?? 0;
            $menu->minimum_qty = 1;
            $menu->menu_priority = $data['priority'] ?? 1;

            // Un article sans prix reste masqué : jamais de burger vendu 0 DH.
            $hasPrice = ($data['price'] ?? null) !== null && (float) $data['price'] > 0;
            $menu->menu_status = $hasPrice ? 1 : 0;
            $menu->save();

            if (!$hasPrice) {
                $this->missingPrices++;
            }

            $category = $categories[$data['category']] ?? null;
            if ($category instanceof Category) {
                $menu->categories()->sync([$category->getKey()]);
            }
        }

        $this->line('Articles : '.count($items)." (dont {$this->missingPrices} sans prix, laissés hors ligne).");
    }

    private function seedPayments(array $payments): void
    {
        $enabled = $payments['enabled'] ?? ['cod'];
        $default = $payments['default'] ?? 'cod';

        Payment::query()->update(['status' => 0, 'is_default' => 0]);
        Payment::query()->whereIn('code', $enabled)->update(['status' => 1]);
        Payment::query()->where('code', $default)->update(['is_default' => 1]);

        $this->line('Paiement : '.implode(', ', $enabled)." (défaut : {$default}).");
    }

    /**
     * TastyIgniter installe un jeu de démonstration (établissement « Default »,
     * carte anglaise). On le désactive au lieu de le supprimer pour garder les
     * contraintes de clés étrangères intactes.
     */
    private function disableDemoData(): void
    {
        $keptSlugs = Location::query()->whereIn('permalink_slug', ['fes', 'casablanca'])->pluck('location_id');

        $demoLocations = Location::query()
            ->whereNotIn('location_id', $keptSlugs)
            ->update(['location_status' => 0, 'is_default' => 0]);

        $ourCategories = Category::query()
            ->whereIn('name', ['Burgers signature', 'Hot-dogs', 'Sides', 'Boissons & milkshakes'])
            ->pluck('category_id');

        $demoMenus = Menu::query()
            ->whereDoesntHave('categories', fn($query) => $query->whereIn('categories.category_id', $ourCategories))
            ->update(['menu_status' => 0]);

        $this->line("Démo TastyIgniter désactivée : {$demoLocations} établissement(s), {$demoMenus} article(s).");
    }

    private function reportPending(): void
    {
        $pending = [];

        if ($this->missingPrices > 0) {
            $pending[] = $this->missingPrices.' article(s) sans prix : compléter data/misterjack.json depuis l\'export GloriaFood, puis relancer la commande.';
        }

        if (Location::query()->where('location_status', 0)->where('permalink_slug', 'casablanca')->exists()) {
            $pending[] = 'Établissement Casablanca : adresse, téléphone et GPS manquants.';
        }

        if (!setting('maps_api_key')) {
            $pending[] = 'Clé Google Maps absente : le contrôle des zones de livraison par adresse ne fonctionnera pas.';
        }

        if ($pending === []) {
            return;
        }

        $this->newLine();
        $this->warn('À compléter avant mise en production :');
        foreach ($pending as $item) {
            $this->warn(' - '.$item);
        }
    }

    private function countryId(string $iso2): ?int
    {
        return Country::query()->where('iso_code_2', $iso2)->value('country_id');
    }
}
