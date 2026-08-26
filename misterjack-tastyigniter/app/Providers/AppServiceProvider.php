<?php

declare(strict_types=1);

namespace App\Providers;

use App\Support\SafeImageUploadValidator;
use Igniter\Flame\Support\Facades\Igniter;
use Igniter\Flame\Support\MediaUploadValidator;
use Igniter\System\Libraries\Assets;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Feuille de style de marque, relative au dossier public/.
     */
    private const string BRAND_STYLESHEET = 'brand/misterjack.css';

    /**
     * Police des titres de misterjack.ma. Le thème ne charge qu'Inter.
     */
    private const string BRAND_FONTS = 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&display=swap';

    public function register(): void {}

    public function boot(): void
    {
        $this->useServerSideGoogleKey();
        $this->addBrandAssets();
        $this->unblockSafePhotoUploads();
    }

    /**
     * Débloque les photos refusées à tort par le contrôle « contenu non sûr ».
     *
     * Voir SafeImageUploadValidator : le contrôle d'origine reste en place,
     * on lui redonne simplement l'image ré-encodée quand il bute sur une
     * suite d'octets tombée au hasard dans une photo saine.
     */
    private function unblockSafePhotoUploads(): void
    {
        $this->app->singleton(
            MediaUploadValidator::class,
            fn(): MediaUploadValidator => new SafeImageUploadValidator,
        );
    }

    /**
     * Ajoute l'habillage Mister Jack aux pages de la boutique.
     *
     * Les couleurs viennent des variables du thème (voir la commande
     * `misterjack:brand`) ; il ne reste ici que la police des titres et les
     * quelques finitions que ces variables ne couvrent pas.
     *
     * L'ordre compte : le cœur assemble les feuilles de style dans l'ordre où
     * elles sont déclarées, et la nôtre doit passer après app.css. On s'inscrit
     * donc sur la résolution du gestionnaire d'assets, qui a lieu après celle
     * du thème — ou on l'ajoute tout de suite s'il est déjà résolu.
     */
    private function addBrandAssets(): void
    {
        if ($this->app->runningInConsole() || Igniter::runningInAdmin()) {
            return;
        }

        if ($this->app->resolved('assets')) {
            $this->putBrandAssets($this->app->make('assets'));

            return;
        }

        $this->app->resolving('assets', function(Assets $manager): void {
            $this->putBrandAssets($manager);
        });
    }

    private function putBrandAssets(Assets $manager): void
    {
        $manager->addCss(self::BRAND_FONTS, ['data-navigate-track' => 'true']);

        // Absente tant que le kit n'a pas été copié : on ne casse rien.
        if (is_file(public_path(self::BRAND_STYLESHEET))) {
            $manager->addCss(self::BRAND_STYLESHEET, ['data-navigate-track' => 'true']);
        }
    }

    /**
     * Sépare la clé Google du géocodage de celle de la carte affichée au client.
     *
     * TastyIgniter n'a qu'un seul champ « clé Google Maps », utilisé à la fois
     * par le géocodeur (appel depuis le serveur) et par la carte du thème
     * (appel depuis le navigateur du client). Or une clé Google se restreint
     * soit par adresse IP, soit par site référent, jamais les deux : une clé
     * unique laisse donc forcément une des deux moitiés cassée, ou oblige à
     * publier une clé sans restriction dans le HTML.
     *
     * On met donc la clé de géocodage dans le .env, jamais dans les réglages :
     * elle reste côté serveur, restreinte à l'IP de l'hébergement, et le champ
     * des réglages reste vide — le thème retombe alors sur OpenStreetMap pour
     * l'affichage de la carte, qui ne demande aucune clé.
     */
    private function useServerSideGoogleKey(): void
    {
        $key = env('GOOGLE_GEOCODER_KEY');
        if (blank($key)) {
            return;
        }

        // Le cœur pose sa propre valeur sur `resolving`; en s'inscrivant après
        // lui, c'est la nôtre qui s'applique.
        $this->app->resolving('geocoder', function($geocoder, $app) use ($key): void {
            $app['config']->set('igniter-geocoder.providers.google.apiKey', $key);

            if (setting('default_geocoder', 'nominatim') === 'nominatim') {
                $app['config']->set('igniter-geocoder.default', 'chain');
            }
        });
    }
}
