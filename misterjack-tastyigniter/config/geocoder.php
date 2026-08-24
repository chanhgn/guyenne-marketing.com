<?php

declare(strict_types=1);

/*
 * Surcharge du géocodeur TastyIgniter pour Mister Jack.
 *
 * Par défaut le cœur utilise le fournisseur « chain » : Google d'abord, puis
 * Nominatim. Sans clé Google, chaque adresse tente donc un appel voué à
 * échouer avant de retomber sur OpenStreetMap. On règle Nominatim en direct,
 * localisé sur le Maroc.
 *
 * Le jour où une clé Google Maps est ajoutée : renseigner GEOCODER_DRIVER=chain
 * dans le .env et la clé dans l'admin (Système > Réglages > Carte).
 *
 * On repart du fichier du paquet pour ne pas figer le reste de sa
 * configuration (endpoints, cache) à la version du jour.
 */

$config = require base_path('vendor/tastyigniter/core/config/geocoder.php');

$config['default'] = env('GEOCODER_DRIVER', 'nominatim');

$config['providers']['nominatim']['locale'] = 'fr-FR';
$config['providers']['nominatim']['region'] = 'MA';

return $config;
