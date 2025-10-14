@SAS-8636 @connexion @prod @smoke_test
Feature: Connexion utilisateur Keycloak
  En tant qu'utilisateur du SAS
  Je veux pouvoir me connecter
  Afin de pouvoir accéder aux fonctionnalités liées à mon rôle

  Scenario: Déconnexion Keycloak de l'utilisateur
    Given un utilisateur sur la page d'accueil
    When il se connecte en tant que "Régulateur OSNP"
    And il se déconnecte
    Then il est déconnecté