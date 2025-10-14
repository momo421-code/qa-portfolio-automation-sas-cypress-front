@SAS-7854 @recherche @indisponibilité
Feature: Indisponibilité à durée indéterminée pour un lieu d'exercice
  En tant qu'effecteur du SAS
  Je veux déclarer une indisponibilité à durée indéterminée
  Afin que mon lieu d'exercice lié ne remonte pas en page de résultats

  # RECHERCHE CRÉNEAUX DISPONIBLES
  @teardown_unavailability_removal
  Scenario: Absence du lieu d’exercice à l’application d’une indisponibilité à durée indéterminée en recherche Créneaux disponibles
    Given l'application d'une indisponibilité à durée indéterminée sur le lieu d'exercice "17 Avenue Henri Varagnat" de l'effecteur "Effecteur Indisponibilité"
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Indisponibilité"
    Then le résultat "Menegoz Pierre-Yves" à "17 Avenue Henri Varagnat" est absent

  @teardown_unavailability_application
  Scenario: Présence du lieu d’exercice à la suppression d’une indisponibilité à durée indéterminée en recherche Créneaux disponibles
    Given la suppression d'une indisponibilité à durée indéterminée sur le lieu d'exercice "17 Avenue Henri Barbusse" de l'effecteur "Effecteur Indisponibilité"
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 2 de l'effecteur "Effecteur Indisponibilité"
    Then le résultat "Menegoz Pierre-Yves" à "17 Avenue Henri Barbusse" est présent

  # RECHERCHE CRÉNEAUX EN SUS
  @teardown_unavailability_removal
  Scenario: Absence du lieu d’exercice à l’application d’une indisponibilité à durée indéterminée en recherche Créneaux en sus
    Given l'application d'une indisponibilité à durée indéterminée sur le lieu d'exercice "17 Avenue Henri Varagnat" de l'effecteur "Effecteur Indisponibilité"
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Indisponibilité"
    When il active le filtre Créneaux en sus
    Then le résultat "Menegoz Pierre-Yves" à "17 Avenue Henri Varagnat" est absent

  @teardown_unavailability_application
  Scenario: Présence du lieu d’exercice à la suppression d’une indisponibilité à durée indéterminée en recherche Créneaux en sus
    Given la suppression d'une indisponibilité à durée indéterminée sur le lieu d'exercice "17 Avenue Henri Barbusse" de l'effecteur "Effecteur Indisponibilité"
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 2 de l'effecteur "Effecteur Indisponibilité"
    When il active le filtre Créneaux en sus
    Then le résultat "Menegoz Pierre-Yves" à "17 Avenue Henri Barbusse" est présent