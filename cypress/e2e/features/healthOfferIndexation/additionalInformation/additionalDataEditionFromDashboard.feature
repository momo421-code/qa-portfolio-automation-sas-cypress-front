@SAS-9229 @infosComplémentaires
Feature: Edition des informations complémentaires depuis le dashboard
  En tant qu'effecteur ou gestionnaire de structure,
  Je veux éditer les informations complémentaires depuis mon dashboard
  Afin que cela apparaisse en page de résultats

  @ps @teardown_ps_additional_data_removal
  Scenario: Affichage en page de résultats des informations complémentaires après création via le dashboard
    Given l'utilisateur "Effecteur Individuel" connecté
    And l'effecteur est sur son dashboard
    When il modifie ses informations complémentaires de son lieu d'exercice 1 à partir du dashboard
      """
      Test informations complémentaires d'un effecteur à [date]
      """
    Then les informations complémentaires sont mises à jour dans le dashboard
    And les informations complémentaires sont mises à jour en page de résultats visibles par le régulateur "Régulateur OSNP"

  @ps @agrégateur
  Scenario: Affichage en page de résultats des informations complémentaires après modification via le dashboard
    Given l'utilisateur "Effecteur créneau éditeur" connecté
    And l'effecteur est sur son dashboard
    When il modifie ses informations complémentaires de son lieu d'exercice 1 à partir du dashboard
      """
      Test informations complémentaires d'un effecteur éditeur à [date]
      """
    Then les informations complémentaires sont mises à jour dans le dashboard
    And les informations complémentaires sont mises à jour en page de résultats visibles par le régulateur "IOA"

  @structure @sos @teardown_sos_additional_data_addition
  Scenario: Absence en page de résultats des informations complémentaires après suppression via le dashboard
    Given l'utilisateur "Gestionnaire de structure SOS" connecté
    And le gestionnaire de structure SOS est sur son dashboard
    When il supprime ses informations complémentaires du PFG 1 de son association SOS Médecins 1 à partir du dashboard
    Then les informations complémentaires sont absentes du dashboard
    And les informations complémentaires sont absentes en page de résultats visibles par le régulateur "Régulateur OSNP"