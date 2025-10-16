# 🧪 SAS Tests Auto – Automatisation Cypress / TypeScript / Cucumber

Tests fonctionnels automatisés de l’application web **SAS (Service d’Accès aux Soins)**.  
Ce projet a pour objectif d’assurer la **non-régression**, la **qualité fonctionnelle** et la **traçabilité** des tests à travers **Cypress**, **Cucumber**, et l’intégration **Xray / Jira**.

---

## 🚀 Objectifs du projet

- Automatiser les **tests fonctionnels end-to-end (E2E)** de l’application SAS.
- Centraliser la gestion des **scénarios Gherkin** (BDD) et leur exécution via Cypress.
- Intégrer les campagnes de tests dans **GitLab CI/CD** et **Xray**.
- Garantir la **qualité du code** via ESLint + Prettier.
- Séparer les **données sensibles** et les **configurations d’environnement**.

---

## 🧱 Stack technique

| Domaine | Technologie |
|----------|-------------|
| Framework de test | [Cypress](https://www.cypress.io/) |
| Langage | TypeScript |
| BDD / Gherkin | [Cucumber](https://cucumber.io/) |
| Préprocesseurs | @badeball/cypress-cucumber-preprocessor, @bahmutov/cypress-esbuild-preprocessor |
| Linter / Formateur | ESLint + Prettier |
| CI/CD | GitLab Pipelines |
| Gestion des tests | Jira / Xray |
| Pattern | Page Object Model (POM) |
| Données | Fixtures JSON par environnement |

---

## 📂 Structure du projet

sas_tests_auto/
├─ cypress/
│ ├─ configs/ # Configurations par environnement (int, preprod, prod...)
│ ├─ e2e/
│ │ ├─ features/ # Scénarios Gherkin (.feature)
│ │ ├─ stepDefinitions/ # Implémentation des steps (Cucumber)
│ │ ├─ pages/ # Page Object Model (POM)
│ │ └─ hooks.ts # Hooks globaux pour Cypress (before/after)
│ ├─ fixtures/ # Jeux de données (par environnement)
│ ├─ support/ # Commandes et utilitaires Cypress
│ └─ reports/ # Rapports HTML (Cucumber report)
├─ cypress.config.ts # Configuration principale Cypress
├─ package.json # Scripts & dépendances
├─ eslint.config.mjs # Linter configuration
└─ tsconfig.json # Typage TypeScript

yaml
Copier le code

---

## ⚙️ Installation

### 1️⃣ Installation des dépendances

```bash
npm install
2️⃣ Variables sensibles
Les mots de passe et identifiants ne sont jamais stockés en dur.
Ils sont gérés dans les environnements Cypress.

Exemple cypress.config.ts
ts
Copier le code
export default defineConfig({
  e2e: {
    env: {
      basic_auth: { username: '', password: '' },
      password: ''
    }
  }
})
Exemple cypress.env.json (local)
json
Copier le code
{
  "basic_auth": {
    "username": "secret",
    "password": "secret"
  },
  "password": "secret"
}
🌍 Exécution des tests
🔓 Ouvrir Cypress (mode interface)
bash
Copier le code
npm run open:int
npm run open:preprod
npm run open:prod
⚡ Exécuter les tests en mode headless
bash
Copier le code
npm run test:int
npm run test:preprod
npm run test:prod
🧩 Gestion des environnements
Chaque environnement dispose de sa propre configuration :
cypress/configs/cypress.[env].config.ts

Exemple :

ts
Copier le code
export default defineConfig({
  env: {
    name: 'preprod',
    baseUrl: 'https://sas-preprod.sante.fr',
    fixtureFile: 'accounts-preprod.json'
  }
})
🧠 Jeux de données (Fixtures)
Les jeux de données sont contextualisés par environnement.
Exemples :

pgsql
Copier le code
cypress/fixtures/accounts/accounts.json        → Intégration
cypress/fixtures/accounts/accounts-preprod.json → Préproduction
cypress/fixtures/accounts/accounts-prod.json    → Production
Les données sont chargées automatiquement via un hook global :

ts
Copier le code
// hooks.ts
before(() => {
  accountFixtureUtils.loadData();
});
💬 Cucumber (BDD)
📄 Organisation
Les features (.feature) décrivent les comportements utilisateur.

Les stepsDefinitions implémentent les étapes techniques.

Les pages contiennent les actions utilisateur (POM).

⚙️ Configuration Cucumber
Ajoutée dans setupNodeEvents() du cypress.config.ts, avec support esbuild et TypeScript.

Exemple :
ts
Copier le code
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@bahmutov/cypress-esbuild-preprocessor'

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on('file:preprocessor', createEsbuildPlugin(config))
      return config
    }
  }
})
🏷️ Tags Cucumber
Les scénarios peuvent être filtrés via des tags :

Tag	Description
@prod	Scénario valable en production
@int	Scénario valable en intégration
@preprod	Scénario valable en préproduction
@only	Exécute uniquement les scénarios tagués
@skip	Ignore les scénarios tagués
@smoke_test	Campagne de tests rapides
@connexion	Tests liés à l’authentification

Exemple :
gherkin
Copier le code
@smoke_test @connexion
Feature: Connexion utilisateur

  Scenario: Déconnexion de l’utilisateur
    Given un utilisateur sur la page d’accueil
    When il se connecte en tant que "Régulateur OSNP"
    And il se déconnecte
    Then il est déconnecté
🧹 Linter et formatage du code
Le projet utilise ESLint (TypeScript) + Prettier pour assurer la qualité du code.

▶️ Exécuter le linter
bash
Copier le code
npm run lint
📁 Configuration
Fichier : eslint.config.mjs

Plugins utilisés :

typescript-eslint

eslint-plugin-cypress

eslint-plugin-prettier

📊 CI/CD – Intégration continue GitLab
Pipeline typique :

yaml
Copier le code
stages:
  - install
  - lint
  - test
  - report

install:
  stage: install
  script:
    - npm ci

lint:
  stage: lint
  script:
    - npm run lint

e2e_tests:
  stage: test
  script:
    - npm run test:preprod
  artifacts:
    paths:
      - cypress/reports/
Les rapports HTML sont générés en fin de pipeline :
📁 cypress/reports/cucumber-report.html

📈 Intégration Xray / Jira
Chaque feature Cucumber est synchronisée avec un Test Case Xray dans Jira,
permettant le suivi des exécutions, anomalies et TNR.

💬 Auteur
👤 Mohamed Touaoua
QA Automatisation – Cypress / TypeScript / Cucumber
Klee Group – Projet Santé France (SAS)
📅 Création : Février 2024

🏷️ Tags
Cypress · TypeScript · Cucumber · BDD · Xray · Jira · ESLint · Prettier · CI/CD · TNR · PageObjectModel

Ce projet illustre mes compétences en automatisation QA avec Cypress, la mise en place d’une architecture POM + Cucumber, et l’intégration dans un écosystème CI/CD complet.
