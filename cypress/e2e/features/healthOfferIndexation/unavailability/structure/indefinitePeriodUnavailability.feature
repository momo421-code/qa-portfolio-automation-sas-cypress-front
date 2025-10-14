@SAS-7855 @recherche @indisponibilité
Feature: Indisponibilité à durée indéterminée pour une structure
  En tant que gestionnaire de structure du SAS
  Je veux déclarer une indisponibilité à durée indéterminée
  Afin que ma structure ne remonte pas en page de résultats

  # RECHERCHE CRÉNEAUX DISPONIBLES
  @teardown_unavailability_removal
  Scenario: Absence du centre de santé à l’application d’une indisponibilité à durée indéterminée en recherche Créneaux disponibles
    Given l'application d'une indisponibilité à durée indéterminée sur le centre de santé "Avenue Arthur Huc" du gestionnaire de structure "Gestionnaire structure Indispo"
    And l'utilisateur "IOA" sur la page ayant pour résultat le centre de santé 1 du gestionnaire de structure "Gestionnaire structure Indispo"
    Then le résultat "Centre De Santé Polyvalent Des Pradettes" à "Avenue Arthur Huc" est absent

  @teardown_unavailability_application
  Scenario: Présence du centre de santé à la suppression d’une indisponibilité à durée indéterminée en recherche Créneaux disponibles
    Given la suppression d'une indisponibilité à durée indéterminée sur le centre de santé "41 Chemin de la Terrasse" du gestionnaire de structure "Gestionnaire structure Indispo"
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le centre de santé 2 du gestionnaire de structure "Gestionnaire structure Indispo"
    Then le résultat "Centre De Sante Medical Et Dentaire Toulouse La Terrasse" à "41 Chemin de la Terrasse" est présent

  # RECHERCHE CRÉNEAUX EN SUS
  @teardown_unavailability_removal
  Scenario: Absence du PFG à l’application d’une indisponibilité à durée indéterminée en recherche Créneaux en sus
    Given l'application d'une indisponibilité à durée indéterminée sur le PFG "Point fixe de Quimper" du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    And l'utilisateur "IOA" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    When il active le filtre Créneaux en sus
    Then le résultat "Point fixe de Quimper" à "" est absent

  @teardown_unavailability_application
  Scenario: Présence du PFG à la suppression d’une indisponibilité à durée indéterminée en recherche Créneaux en sus
    Given la suppression d'une indisponibilité à durée indéterminée sur le PFG "Point fixe de Quimper" du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    When il active le filtre Créneaux en sus
    Then le résultat "Point fixe de Quimper" à "" est présent