@SAS-8347 @prod @recherche @tri
Feature: Tri des résultats d'une recherche par zone
  En tant qu'administrateur du SAS
  Je veux que les résultats d'une recherche par zone soient triés de façon aléatoire
  Afin qu'aucun résultat ne soit favorisé

  Scenario: Les résultats d'une recherche par adresse par créneaux disponibles sont triés de façon aléatoire
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "Médecin" à "Aix-en-Provence"
    Then tous les résultats sont triés de façon aléatoire

  Scenario: Les résultats d'une recherche par adresse par créneaux en sus sont triés de façon aléatoire
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "Centre" à "Lyon"
    When il active le filtre Créneaux en sus
    Then tous les résultats sont triés de façon aléatoire