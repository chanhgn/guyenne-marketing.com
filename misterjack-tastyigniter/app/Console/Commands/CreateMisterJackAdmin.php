<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Igniter\User\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

/**
 * Crée (ou remet à jour) le compte administrateur.
 *
 * TastyIgniter installé en mode non interactif ne crée aucun administrateur, et
 * tant qu'il n'y en a pas la boutique entière redirige vers /admin. Cette
 * commande évite d'avoir à passer par l'assistant web.
 *
 * Usage : php artisan misterjack:admin --email=… --name=…
 */
class CreateMisterJackAdmin extends Command
{
    protected $signature = 'misterjack:admin
        {--email= : Adresse e-mail du compte}
        {--name= : Nom affiché}
        {--username= : Identifiant de connexion}
        {--password= : Mot de passe (demandé si absent, jamais affiché)}';

    protected $description = 'Crée ou met à jour le compte administrateur Mister Jack';

    public function handle(): int
    {
        $email = $this->option('email') ?: $this->ask('Adresse e-mail');
        $name = $this->option('name') ?: $this->ask('Nom affiché', 'Mister Jack');
        $username = $this->option('username') ?: $this->ask('Identifiant', 'admin');
        $password = $this->option('password') ?: $this->secret('Mot de passe (12 caractères minimum)');

        $validator = Validator::make(
            compact('email', 'name', 'username', 'password'),
            [
                'email' => ['required', 'email'],
                'name' => ['required', 'string', 'max:128'],
                'username' => ['required', 'string', 'max:128'],
                'password' => ['required', 'string', 'min:12'],
            ],
            [
                'password.min' => 'Le mot de passe doit faire au moins 12 caractères : ce compte donne accès aux commandes et aux clients.',
            ],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::firstOrNew(['email' => $email]);
        $existed = $user->exists;

        $user->name = $name;
        $user->username = $username;
        $user->password = $password;
        $user->super_user = 1;
        $user->status = 1;
        $user->save();

        $this->info($existed
            ? "Mot de passe de {$email} mis à jour."
            : "Administrateur {$email} créé.");

        return self::SUCCESS;
    }
}
