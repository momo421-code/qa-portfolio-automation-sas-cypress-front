@SAS-7868 @recherche @indisponibilité
Feature: Présence de la structure en fonction de l'ajout d'indisponibilité programmée
  En tant que gestionnaire de structure du SAS
  Je veux programmer une indisponibilité
  Afin que mon lieu d'exercice lié ne remonte pas en page de résultats sur la durée de l'indisponibilité

  # RECHERCHE CRÉNEAUX DISPONIBLES
  @teardown_programmed_unavailability_removal
  Scenario: Absence du centre de santé à l’application d’une indisponibilité programmée sur les 3 jours
    Given l'ajout d'une indisponibilité programmée sur le centre de santé "9 Rue de la Chesnaie" de l'effecteur "Gestionnaire structure Indispo Programmée"
      | Date de début | Date de fin |
      | J             | J+3         |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le centre de santé 1 du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    Then le résultat "Centre Communal De Sante De Loudeac" à "9 Rue de la Chesnaie" est absent

  @teardown_programmed_unavailability_addition
  Scenario: Présence du centre de santé à la suppression d’une indisponibilité programmée sur les 3 jours
    Given la suppression d'indisponibilités programmées sur le centre de santé "Rue Jean Grenier" de l'effecteur "Gestionnaire structure Indispo Programmée"
    And l'utilisateur "IOA" sur la page ayant pour résultat le centre de santé 2 du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    Then le résultat "Centre De Sante Tregueux Saint-Brieuc" à "Rue Jean Grenier" est présent
    And le résultat a des disponibilités

  # RECHERCHE CRÉNEAUX EN SUS
  @teardown_programmed_unavailability_removal
  Scenario: Absence du PFG à l’application d’une indisponibilité programmée sur les 3 jours
    Given l'ajout d'une indisponibilité programmée sur le PFG "Point fixe de Brest" de l'effecteur "Gestionnaire structure Indispo Programmée"
      | Date de début | Date de fin |
      | J             | J+5         |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    When il active le filtre Créneaux en sus
    Then le résultat "Point fixe de Brest" à "" est absent

  @teardown_programmed_unavailability_addition
  Scenario: Présence du PFG à la suppression d’une indisponibilité programmée sur les 3 jours
    Given la suppression d'indisponibilités programmées sur le PFG "Point fixe de Brest" de l'effecteur "Gestionnaire structure Indispo Programmée"
    And l'utilisateur "IOA" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 2 du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    When il active le filtre Créneaux en sus
    Then le résultat "Point fixe de Brest" à "" est présent
    And le résultat a des disponibilités