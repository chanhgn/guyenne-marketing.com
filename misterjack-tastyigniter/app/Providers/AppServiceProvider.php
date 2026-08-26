<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->useServerSideGoogleKey();
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
