@SAS-8634 @recherche @prod @smoke_test
Feature: Redirection de la recherche
  En tant que régulateur du SAS
  Je veux accéder aux résultats de recherche
  Afin de pouvoir visionner les disponibilités de l'offre de soin

  Scenario: Accès à la page de résultats à partir de la recherche en page d'accueil
    Given l'utilisateur "Régulateur OSNP" connecté
    When il lance une recherche "Médecin" à "Paris" à partir de la page d'accueil
    Then il est redirigé vers la page de résultats correspondante

  Scenario: Accès à la page de résultats à partir de la recherche en page de résultats
    Given l'utilisateur "Régulateur OSNP" connecté
    And l'utilisateur ayant fait une recherche "Médecin" à "Paris"
    When il lance une recherche "Centre de santé" à "188 Avenue des Frères Lumière, 69008 Lyon" à partir de la page de résultats
    Then il est redirigé vers la page de résultats correspondante