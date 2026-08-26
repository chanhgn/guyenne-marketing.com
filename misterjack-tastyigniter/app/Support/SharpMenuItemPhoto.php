<?php

declare(strict_types=1);

namespace App\Support;

use Livewire\ComponentHook;

/**
 * Rend nette la photo de la fiche article.
 *
 * Le thème demande la photo dans une boîte de 720x300 « contain » : l'image
 * est réduite pour tenir dedans sans être rognée, donc c'est la hauteur qui
 * commande. Une photo carrée de 1024x1024 ressort en 300x300, puis la fiche
 * l'étire sur toute sa largeur — 500 px, soit 1000 points sur un écran
 * Retina. Agrandie trois fois, elle bave.
 *
 * On redemande la même photo dans une boîte de 1000x1000. L'affichage ne
 * bouge pas — la fiche l'étire toujours sur sa largeur — mais le fichier
 * fourni est enfin assez grand pour être net.
 *
 * Pourquoi un crochet Livewire et pas les réglages de page : la fiche
 * s'ouvre dans une requête Livewire, où le cycle de page n'a pas lieu ; les
 * propriétés déclarées sur la page n'y arrivent jamais. Le crochet, lui, est
 * appelé au montage du composant, dans toutes les requêtes. Et comme il est
 * enregistré après celui du cœur, c'est notre taille qui reste.
 */
class SharpMenuItemPhoto extends ComponentHook
{
    private const string COMPONENT = 'igniter-orange::cart-item-modal';

    private const int SIZE = 1000;

    public function mount($params, $key): void
    {
        if ($this->component->getName() !== self::COMPONENT) {
            return;
        }

        $this->component->fill([
            'thumbWidth' => self::SIZE,
            'thumbHeight' => self::SIZE,
        ]);
    }
}
