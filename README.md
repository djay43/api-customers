# CRM - Gestion de clients en React et Symfony

Projet de gestion de clients/factures. Gestion via l'api-platform et interface indépendante en React.

## Installation

Composer et npm sont requis pour l'installation de ce projet.

```bash
composer install
npm install
npm run build
php bin/console server:run
```

L'url en local doit être au format **http://localhost:8000**, vous pouvez cependant la modifier dans le fichier .env à la racine du site

## Usage

Pour une génération de données aléatoires lancez les fixtures:

```bash
php bin/console doctrine:fixtures:load --no-interaction
```

Rendez-vous sur votre base de données pour récupérer l'email d'un utilisateur aléatoire généré.

Le mot de passe sera : **test**

Sinon vous pouvez vous inscrire via le formulaire d'inscription.

## Contributions

Les Pull Requests sont les bienvenues. Pour des requêtes importantes, merci d'ouvrir une issue afin que l'on puisse discuter des possibilités d'évolutions.
