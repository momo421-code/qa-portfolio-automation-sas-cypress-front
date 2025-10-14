@SAS-7867 @recherche @indisponibilité
Feature: Présence du lieu d'exercice en fonction de l'ajout d'indisponibilité programmée
  En tant qu'effecteur du SAS
  Je veux programmer une indisponibilité
  Afin que mon lieu d'exercice lié ne remonte pas en page de résultats sur la durée de l'indisponibilité

  # RECHERCHE CRÉNEAUX DISPONIBLES
  @teardown_programmed_unavailability_removal
  Scenario: Absence du lieu d’exercice à l’application d’une indisponibilité programmée sur les 3 jours lors d'une recherche Créneaux dispo
    Given l'ajout d'une indisponibilité programmée sur le lieu d'exercice "Avenue des Caillols" de l'effecteur "Effecteur Indisponibilité Programmée"
      | Date de début | Date de fin |
      | J             | J+3         |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Indisponibilité Programmée"
    Then le résultat "Hage Hassan" à "Avenue des Caillols" est absent

  @teardown_programmed_unavailability_addition
  Scenario: Présence du lieu d’exercice à la suppression d’une indisponibilité programmée sur les 3 jours lors d'une recherche Créneaux dispo
    Given la suppression d'indisponibilités programmées sur le lieu d'exercice "Impasse du Lido" de l'effecteur "Effecteur Indisponibilité Programmée"
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 2 de l'effecteur "Effecteur Indisponibilité Programmée"
    Then le résultat "Hage Hassan" à "Impasse du Lido" est présent
    And le résultat a des disponibilités

  # RECHERCHE CRÉNEAUX EN SUS
  @teardown_programmed_unavailability_removal
  Scenario: Absence du lieu d’exercice à l’application d’une indisponibilité programmée sur les 3 jours lors d'une recherche Créneaux en sus
    Given l'ajout d'une indisponibilité programmée sur le lieu d'exercice "Avenue des Caillols" de l'effecteur "Effecteur Indisponibilité Programmée"
      | Date de début | Date de fin |
      | J             | J+3         |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Indisponibilité Programmée"
    When il active le filtre Créneaux en sus
    Then le résultat "Hage Hassan" à "Avenue des Caillols" est absent

  @teardown_programmed_unavailability_addition
  Scenario: Présence du lieu d’exercice à la suppression d’une indisponibilité programmée sur les 3 jours lors d'une recherche Créneaux en sus
    Given la suppression d'indisponibilités programmées sur le lieu d'exercice "Impasse du Lido" de l'effecteur "Effecteur Indisponibilité Programmée"
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 2 de l'effecteur "Effecteur Indisponibilité Programmée"
    When il active le filtre Créneaux en sus
    Then le résultat "Hage Hassan" à "Impasse du Lido" est présent
    And le résultat a des disponibilités