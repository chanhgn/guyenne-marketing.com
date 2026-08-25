<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Igniter\Cart\Models\Category;
use Igniter\Cart\Models\Menu;
use Igniter\Cart\Models\MenuItemOption;
use Igniter\Cart\Models\MenuItemOptionValue;
use Igniter\Cart\Models\MenuOption;
use Igniter\Cart\Models\MenuOptionValue;
use Igniter\Local\Models\Location;
use Igniter\Local\Models\LocationArea;
use Igniter\Local\Models\WorkingHour;
use Igniter\PayRegister\Models\Payment;
use Igniter\System\Models\Country;
use Igniter\System\Models\Currency;
use Igniter\System\Models\Language;
use Igniter\System\Models\Settings;
use Illuminate\Console\Command;

/**
 * Configure une installation TastyIgniter neuve avec les données Mister Jack :
 * réglages boutique, dirham marocain, établissements de Fès et Casablanca,
 * horaires, zones de livraison, carte complète avec formules et paiement à la
 * livraison.
 *
 * La commande est idempotente : on peut la relancer après avoir corrigé
 * data/misterjack.json sans dupliquer les données.
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

    /** Nom de l'option qui porte le supplément « en menu ». */
    private const FORMULA_OPTION = 'Formule';

    /** Nombre d'articles laissés hors ligne faute de prix. */
    private int $missingPrices = 0;

    /** Langue demandée mais pas encore installée depuis le marketplace. */
    private ?string $missingLanguage = null;

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
        $this->seedCountry($data['currency']['country_iso2'] ?? 'MA');
        $this->seedCurrency($data['currency'] ?? []);
        $this->seedLocations($data['locations'] ?? []);
        $categories = $this->seedCategories($data['categories'] ?? []);
        $options = $this->seedOptions($data['options'] ?? []);
        $this->seedMenuItems($data['menu_items'] ?? [], $categories, $options);
        $this->seedPayments($data['payments'] ?? []);

        if (!$this->option('keep-demo')) {
            $this->disableDemoData($data);
        }

        $this->newLine();
        $this->info('Configuration Mister Jack appliquée.');
        $this->reportPending($data);

        return self::SUCCESS;
    }

    private function seedSettings(array $settings): void
    {
        if ($settings === []) {
            return;
        }

        // Le pack de langue s'installe depuis le marketplace, séparément : tant
        // qu'il n'est pas là, forcer « fr » afficherait une interface anglaise
        // sous une étiquette française. On ne bascule que si la langue existe.
        $wanted = $settings['default_language'] ?? null;
        unset($settings['default_language']);

        if ($wanted !== null) {
            $language = Language::query()
                ->where('code', $wanted)
                ->orWhere('code', 'like', $wanted.'\_%')
                ->first();

            if ($language) {
                $settings['default_language'] = $language->code;
            } else {
                $this->missingLanguage = $wanted;
            }
        }

        Settings::set($this->normaliseStatusSettings($settings));

        $this->line('Réglages boutique : '.count($settings).' clés écrites.');
    }

    /**
     * Les statuts de commande n'ont pas tous le même type côté TastyIgniter :
     * « en cours » et « terminée » sont des listes (le cœur fait un array_merge
     * dessus), « par défaut » et « annulée » sont des identifiants simples.
     * Un scalaire là où une liste est attendue casse tout le rendu de la
     * boutique, sans rien écrire dans les logs : on normalise ici plutôt que de
     * compter sur la rigueur du fichier JSON.
     */
    private function normaliseStatusSettings(array $settings): array
    {
        foreach (['processing_order_status', 'completed_order_status'] as $key) {
            if (array_key_exists($key, $settings)) {
                $settings[$key] = array_values(array_map('intval', (array) $settings[$key]));
            }
        }

        foreach (['default_order_status', 'canceled_order_status'] as $key) {
            if (array_key_exists($key, $settings)) {
                $value = $settings[$key];
                $settings[$key] = (int) (is_array($value) ? reset($value) : $value);
            }
        }

        return $settings;
    }

    /**
     * Le pays par défaut de la boutique ne sert pas qu'à l'affichage : le cœur
     * en tire la région envoyée au géocodeur (`igniter-geocoder.providers.*.region`).
     * Laissé sur la valeur d'usine, il fait chercher les adresses marocaines
     * dans un autre pays et le géocodage ne renvoie jamais rien.
     */
    private function seedCountry(string $iso2): void
    {
        $country = Country::query()->where('iso_code_2', $iso2)->first();
        if (!$country) {
            $this->warn("Pays {$iso2} introuvable : géocodage laissé sur la région par défaut.");

            return;
        }

        Country::query()->where('is_default', 1)->update(['is_default' => 0]);
        Country::query()->where('country_id', $country->country_id)->update([
            'is_default' => 1,
            'status' => 1,
        ]);

        $this->line("Pays par défaut : {$country->country_name} ({$iso2}) — région du géocodeur.");
    }

    private function seedCurrency(array $currency): void
    {
        if ($currency === []) {
            return;
        }

        $model = Currency::firstOrNew(['currency_code' => $currency['code']]);
        $model->currency_name = $currency['name'];
        $model->currency_symbol = $currency['symbol'];
        $model->symbol_position = (int) ($currency['symbol_position'] ?? 1);
        $model->thousand_sign = $currency['thousand_sign'] ?? ' ';
        $model->decimal_sign = $currency['decimal_sign'] ?? ',';
        $model->decimal_position = (int) ($currency['decimal_position'] ?? 2);
        $model->currency_rate = 1;
        $model->currency_status = 1;
        $model->country_id = $this->countryId($currency['country_iso2'] ?? 'MA');
        $model->iso_alpha2 = $currency['country_iso2'] ?? 'MA';
        $model->save();

        // Un seul is_default possible : on bascule le drapeau à la main.
        Currency::query()->where('currency_id', '!=', $model->currency_id)->update(['is_default' => 0]);
        Currency::query()->where('currency_id', $model->currency_id)->update(['is_default' => 1]);
        Settings::set(['default_currency_code' => $currency['code']]);

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
            // Coordonnées fournies : on coupe le géocodage automatique, qui
            // échouerait en CLI (Nominatim exige un User-Agent de requête).
            $location->is_auto_lat_lng = ($data['lat'] ?? null) === null ? 1 : 0;
            $location->permalink_slug = $data['slug'];

            // Un établissement sans adresse ni téléphone ne doit pas encaisser
            // de commandes : on le laisse hors ligne.
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

        $regular = $hours['regular'] ?? ['open' => '12:00', 'close' => '02:00'];
        $late = $hours['late_nights'] ?? null;
        $lateDays = $late['weekdays'] ?? [];

        foreach (self::HOUR_TYPES as $type) {
            foreach (self::WEEKDAYS as $weekday) {
                $isLate = in_array($weekday, $lateDays, true);

                $hour = WorkingHour::firstOrNew([
                    'location_id' => $location->getKey(),
                    'type' => $type,
                    'weekday' => $weekday,
                ]);
                $hour->opening_time = $isLate ? $late['open'] : $regular['open'];
                $hour->closing_time = $isLate ? $late['close'] : $regular['close'];
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

    /**
     * Crée les options partagées (« Formule : seul / en menu »). Le prix porté
     * ici n'est qu'une valeur par défaut : chaque article surcharge le
     * supplément avec son écart réel, relevé sur la carte.
     *
     * @return array<string, MenuOption>
     */
    private function seedOptions(array $options): array
    {
        $created = [];

        foreach ($options as $data) {
            $option = MenuOption::firstOrNew(['option_name' => $data['name']]);
            $option->display_type = $data['display_type'] ?? 'radio';
            $option->save();

            foreach ($data['values'] ?? [] as $index => $value) {
                $model = MenuOptionValue::firstOrNew([
                    'option_id' => $option->getKey(),
                    'name' => $value['name'],
                ]);
                $model->price = $value['price'] ?? 0;
                $model->priority = $value['priority'] ?? ($index + 1);
                $model->save();
            }

            $created[$data['name']] = $option->refresh();
        }

        if ($created !== []) {
            $this->line('Options : '.implode(', ', array_keys($created)).'.');
        }

        return $created;
    }

    /**
     * @param array<string, Category> $categories
     * @param array<string, MenuOption> $options
     */
    private function seedMenuItems(array $items, array $categories, array $options): void
    {
        $this->missingPrices = 0;
        $withFormula = 0;

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

            if ($this->attachFormula($menu, $data, $options)) {
                $withFormula++;
            }
        }

        $this->line('Articles : '.count($items)." (dont {$withFormula} avec formule, {$this->missingPrices} sans prix laissés hors ligne).");
    }

    /**
     * Attache l'option « Formule » à un article et fixe le supplément menu au
     * prix exact de la carte (menu_price - price), qui varie d'un burger à
     * l'autre : +15 DH sur le Classic, +10 DH sur les Smash Double.
     *
     * @param array<string, MenuOption> $options
     */
    private function attachFormula(Menu $menu, array $data, array $options): bool
    {
        $option = $options[self::FORMULA_OPTION] ?? null;
        $menuPrice = $data['menu_price'] ?? null;

        if (!$option instanceof MenuOption || $menuPrice === null) {
            return false;
        }

        $supplement = round((float) $menuPrice - (float) ($data['price'] ?? 0), 2);
        if ($supplement <= 0) {
            return false;
        }

        $itemOption = MenuItemOption::firstOrNew([
            'menu_id' => $menu->getKey(),
            'option_id' => $option->getKey(),
        ]);
        $itemOption->is_required = 1;
        $itemOption->min_selected = 1;
        $itemOption->max_selected = 1;
        $itemOption->priority = 1;
        $itemOption->save();

        foreach ($option->option_values as $value) {
            $isFormula = (float) $value->price > 0;

            $itemValue = MenuItemOptionValue::firstOrNew([
                'menu_option_id' => $itemOption->getKey(),
                'option_value_id' => $value->getKey(),
            ]);
            $itemValue->override_price = $isFormula ? $supplement : 0;
            $itemValue->priority = $value->priority;
            $itemValue->is_default = $isFormula ? 0 : 1;
            $itemValue->save();
        }

        return true;
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
    private function disableDemoData(array $data): void
    {
        $ourSlugs = array_column($data['locations'] ?? [], 'slug');
        $ourNames = array_column($data['menu_items'] ?? [], 'name');

        $demoLocations = Location::query()
            ->whereNotIn('permalink_slug', $ourSlugs)
            ->update(['location_status' => 0, 'is_default' => 0]);

        $demoMenus = Menu::query()
            ->whereNotIn('menu_name', $ourNames)
            ->update(['menu_status' => 0]);

        $this->line("Démo TastyIgniter désactivée : {$demoLocations} établissement(s), {$demoMenus} article(s).");
    }

    private function reportPending(array $data): void
    {
        $pending = [];

        if ($this->missingPrices > 0) {
            $pending[] = $this->missingPrices.' article(s) sans prix, laissés hors ligne : compléter data/misterjack.json puis relancer.';
        }

        foreach ($data['locations'] ?? [] as $location) {
            if (($location['coords_verified'] ?? true) === false) {
                $pending[] = "Coordonnées GPS de « {$location['name']} » approximatives : les ajuster sur la carte de l'admin, elles définissent le centre des zones de livraison.";
            }
        }

        $offline = Location::query()->where('location_status', 0)->pluck('location_name')->all();
        if ($offline !== []) {
            $pending[] = 'Établissement(s) hors ligne : '.implode(', ', $offline).'.';
        }

        if ($this->missingLanguage !== null) {
            $pending[] = "Langue « {$this->missingLanguage} » absente : l'interface reste en anglais. Installer le pack (php artisan igniter:language-install fr_FR) puis relancer cette commande.";
        }

        if (!setting('maps_api_key')) {
            $pending[] = 'Pas de clé Google Maps : le géocodage passe par Nominatim (OpenStreetMap), gratuit mais moins précis sur les adresses marocaines. Le retrait sur place ne dépend pas du géocodage.';
        }

        if ($pending === []) {
            return;
        }

        $this->newLine();
        $this->warn('À surveiller avant mise en production :');
        foreach ($pending as $item) {
            $this->warn(' - '.$item);
        }
    }

    private function countryId(string $iso2): ?int
    {
        return Country::query()->where('iso_code_2', $iso2)->value('country_id');
    }
}
