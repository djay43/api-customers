# CMR - Gestion de clients en React et Symfony

Projet de gestion de clients/factures. Gestion via l'api-platform et interface indépendante en React.

## Installation

```bash
composer install
npm install
npm run build
```

## Usage

Pour un utilisateur test lancez les fixtures:

```bash
php bin/console doctrine:fixtures:load --no-interaction
```

Rendez-vous sur votre base de données pour récupérer l'email d'un utilisateur aléatoire générée.
Le mot de passe sera : test

Sinon vous pouvez vous inscrire via le formulaire d'inscription.

## Contributions

Les Pull Requests sont les bienvenues. Pour des requêtes importantes, merci d'ouvrir une issue afin que l'on puisse discuter des possibilités d'évolutions.
