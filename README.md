# sas_tests_auto

Tests fonctionnels de l'application web SAS, automatisés avec Cypress en Typescript.

## Installation

### Installation des dépendances

```shell
npm install
```

### Données sensibles

Les données sensibles ne sont pas informées en dur dans le projet dans un souci de sécurité :

- password : Mot de passe de l'ensemble des comptes utilisateurs TNR
- basic_auth : HTAccess des environnements hors prod

Elles sont renseignées dans le `env` du fichier `cypress.config.ts` sans valeur définie.

```typescript
export default defineConfig({
    e2e: ({
        // ...
        env: {
            basic_auth: {username: '', password: ''},
            password: ""
        }
    })
})
```

#### En local

Créer un fichier `cypress.env.json` à la racine du projet pour surcharger les variables d'environnements Cypress.
S'appuyer sur le code suivant en remplaçant les valeurs 'secret' par celles attendues.

```json
{
  "basic_auth": {
    "username": "secret",
    "password": "secret"
  },
  "password": "secret"
}
```

## Tests sur les différents environnements

Pour lancer les tests sur un nouvel environnement,
il faut dupliquer un fichier `cypress/configs/cypress.[env].config.ts`,
le renommer `cypress/configs/cypress.[new-env].config.ts` en remplaçant `[new-env]` par le nom du nouvel environnement
et de modifier les données liées à celui-ci.

### Ouverture de l'application Cypress

Pour ouvrir l'application de test Cypress avec les données d'un environnement en particulier, lancer l'une des commandes
suivantes :

- `npm run open:rui1`
- `npm run open:int`
- `npm run open:preprod`
- `npm run open:prod`

### Lancement des tests

Pour lancer les tests sur un environnement en particulier, lancer l'une des commandes
suivantes :

- `npm run test:rui1`
- `npm run test:int`
- `npm run test:preprod`
- `npm run test:prod`

## Jeux de données

Les jeux de données peuvent être définis pour fonctionner seulement sur certains environnements.

Par exemple : `cypress/fixtures/accounts/accounts-prod.json` est fait pour l'environnement de Production,
contrairement à `cypress/fixtures/accounts/accounts.json` qui est pour le reste des environnements.

La donnée d'environnement `environnement` permet de sélectionner le fichier correspondant
`cypress/configs/cypress.[env].config.ts`.
Chacun de ces fichiers contient une variable `fixtureFile` indiquant quel est le nom du fichier fixture
attaché à cet environnement.

Pour utiliser les jeux de données, il est **nécessaire** de demander le chargement des données
dans la méthode ```before()``` des fichiers steps. Un appel `before()` est mutualisé dans `stepDefinitions/hooks.ts`.
Ce module commun est chargé par `e2e.ts`.

hooks.ts :

```typescript
before(() => {
    accountFixtureUtils.loadData();
})
```

## Cucumber

Les cas de tests sont écrits en Gherkin et sont trouvables sous forme de .feature dans le
dossier `cypress/e2e/features`.

Les méthodes associées aux pas de tests via Cucumber, sont trouvables dans le dossier `cypress/e2e/stepDefinitions`.

### Mise en place de Cucumber pour Cypress

Les dépendances `@badeball/cypress-cucumber-preprocessor` & `@bahmutov/cypress-esbuild-preprocessor` ont été importées
et ajoutées dans la fonction `setupNodeEvents()` du fichier `Cypress.config.ts`, afin de faire fonctionner Cucumber avec
Cypress.

Ajout des configurations dans le fichier `tsconfig.json` :

- `module: Node16` – Permet au module `@badeball/cypress-cucumber-preprocessor/esbuild` d'être reconnu
- `esModuleInterop: true` – Permet à `cypress_esbuild_preprocessor_1.default` d'être reconnu comme une fonction

### Paramétrages de Cucumber

- Le chemin et le type des fichiers de test sont définis par le paramètre `specPattern` du fichier `Cypress.config.ts`
- Le chemin des définitions de pas de test est défini par le paramètre `cypress-cucumber-preprocessor.stepDefinitions`
  du fichier `package.json`
- Les tests sont filtrables par tags grâce au paramètre `cypress-cucumber-preprocessor.filterSpecs` du
  fichier `package.json`
- Les tests ayant été mis de côté par le filtrage sont absents du lancement grâce au
  paramètre `cypress-cucumber-preprocessor.omitFiltered` du fichier `package.json`
- Le rapport de test en HTML est défini par le paramètre `cypress-cucumber-preprocessor.html` du fichier `package.json`

## Tags

Les tests peuvent être lancés en fonction de tags Cucumber.

### Placement des tags sur un test en Gherkin

Les tags peuvent être placés au-dessus de divers éléments d'un test en Gherkin.

- `Feature`
- `Scenario`
- `Scenario Outline`
- `Examples`

Exemple :

```gherkin
@smoke_test @fast
Feature: Connexion utilisateur
  En tant qu'utilisateur du SAS
  Je veux pouvoir me connecter
  Afin de pouvoir accéder aux fonctionnalités liées à mon rôle

  @connexion
  Scenario Outline: Déconnexion de l'utilisateur
    Given un utilisateur sur la page d'accueil
    When il se connecte en tant que "<account>"
    And il se déconnecte
    Then il est déconnecté
    @prod
    Examples:
      | account         |
      | Régulateur OSNP |

    Examples:
      | account                 |
      | Administrateur national |

```

### Tags spéciaux

Il est possible de rajouter des tags intéressants pour le test en local :

- `@only` - Seuls les scénarios étiquetés avec ce tag seront pris en compte lors du lancement de la fonctionnalité
- `@skip` - Les scénarios étiquetés avec ce tag ne seront pas pris en compte lors du lancement de la fonctionnalité

## Linter

Ce projet utilise ESLint Typescript comme linter afin de maintenir la qualité et la
cohérence du code.
Prettier est également utilisé pour le formatage du code.

### Utilisation du Linter

Pour exécuter le linter, la commande suivante peut-être lancée.
Cela fera une vérification du code, fixera ce qui peut l'être et stylisera celui-ci.

`npm run lint`

### Configuration du Linter

La configuration du linter se trouve dans le fichier `eslint.config.mjs` à la racine du projet.
Il est possible d'ajouter des règles supplémentaires ou modifier celles existantes selon les besoins du projet.

### Plugins du Linter

Plusieurs plugins ESLint ont été ajoutés pour aider à appliquer les meilleures pratiques et éviter les erreurs
courantes :

- `typescript-eslint` Permet d’utiliser des règles ESLint spécifiques à TypeScript.
- `eslint-plugin-cypress` Ajoute des règles spécifiques à Cypress pour les tests end-to-end.
- `eslint-plugin-prettier` Permet d’utiliser Prettier comme une règle ESLint et de signaler les erreurs de formatage
  comme des erreurs ESLint.