<?php
/*
 * Diagnostic de couverture de livraison.
 *
 *   php scripts/zone.php "Avenue Hassan II, Fes, Maroc"
 *   php scripts/zone.php 34.0372,-5.0052
 *
 * Affiche, pour chaque etablissement, la distance au client et la zone qui
 * couvre le point, ou la raison du refus.
 */
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$argument = $argv[1] ?? null;
if (!$argument) {
    echo "Usage : php scripts/zone.php \"adresse\"  |  php scripts/zone.php lat,lng\n";
    exit(1);
}

if (preg_match('/^\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/', $argument, $m)) {
    $lat = (float)$m[1];
    $lng = (float)$m[2];
    echo "Point fourni : $lat, $lng\n";
} else {
    $results = \Igniter\Flame\Geolite\Facades\Geocoder::geocode($argument);
    if (!$results || $results->isEmpty()) {
        echo "Adresse introuvable par le geocodeur.\n";
        echo 'logs : '.implode(' | ', \Igniter\Flame\Geolite\Facades\Geocoder::getLogs())."\n";
        exit(1);
    }
    $first = $results->first();
    $lat = $first->getCoordinates()->getLatitude();
    $lng = $first->getCoordinates()->getLongitude();
    echo 'Adresse trouvee : '.$first->getFormattedAddress()."\n";
    echo "Point : $lat, $lng\n";
}

$point = \Igniter\Flame\Geolite\Facades\Geolite::coordinates($lat, $lng);
echo 'Unite de distance : '.setting('distance_unit', 'km')."\n";

foreach (\Igniter\Local\Models\Location::query()->where('location_status', 1)->get() as $location) {
    echo "\n== ".$location->location_name.' ('.$location->location_lat.', '.$location->location_lng.")\n";

    $distance = new \Igniter\Flame\Geolite\Distance;
    $km = $distance->in('km')
        ->setFrom(\Igniter\Flame\Geolite\Facades\Geolite::coordinates((float)$location->location_lat, (float)$location->location_lng))
        ->setTo($point)
        ->haversine();
    printf("   distance a vol d'oiseau : %.2f km\n", $km);

    foreach ($location->delivery_areas as $area) {
        $circle = $area->circle;
        $rayon = $circle->radius ?? '?';
        $dedans = $area->checkBoundary($point) ? 'OUI' : 'non';
        echo "   zone « {$area->name} » — type {$area->type}, rayon {$rayon} — couvre le point : {$dedans}\n";
    }

    $couverte = $location->searchDeliveryArea($point);
    echo '   => '.($couverte ? 'LIVRAISON POSSIBLE via « '.$couverte->name.' »' : 'HORS ZONE pour cet etablissement')."\n";
}
