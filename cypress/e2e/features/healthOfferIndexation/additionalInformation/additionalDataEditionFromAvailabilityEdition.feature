@SAS-8578 @infosComplémentaires
Feature: Edition des informations complémentaires depuis l'édition des disponibilités
  En tant qu'effecteur ou gestionnaire de structure,
  Je veux éditer les informations complémentaires depuis l'édition des disponibilités de mon lieu lié
  Afin que cela apparaisse en page de résultats

  @ps @teardown_ps_additional_data_removal
  Scenario: Affichage en page de résultats des informations complémentaires après création via l'édition des disponibilités
    Given l'utilisateur "Effecteur Individuel" connecté
    And l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice 1
    When il modifie ses informations complémentaires en page d'édition des disponibilités
      """
      Test informations complémentaires d'un effecteur à [date]
      """
    Then les informations complémentaires sont mises à jour en page d'édition des disponibilités
    And les informations complémentaires sont mises à jour en page de résultats visibles par le régulateur "Régulateur OSNP"

  #TODO: Put after or change data set.
  @structure @sos
  Scenario: Affichage en page de résultats des informations complémentaires après modification via l'édition des disponibilités
    Given l'utilisateur "Gestionnaire de structure SOS" connecté
    And le gestionnaire de structure sur la page d'édition des disponibilités du PFG 1 de son association SOS Médecins 1
    When il modifie ses informations complémentaires en page d'édition des disponibilités
      """
      Test informations complémentaires d'un gestionnaire de structure SOS à [date]
      """
    Then les informations complémentaires sont mises à jour en page d'édition des disponibilités
    And les informations complémentaires sont mises à jour en page de résultats visibles par le régulateur "Régulateur OSNP"

  @structure @cds @teardown_center_additional_data_addition
  Scenario: Absence en page de résultats des informations complémentaires après suppression via l'édition des disponibilités
    Given l'utilisateur "Gestionnaire de structure CDS" connecté
    And le gestionnaire de structure sur la page d'édition des disponibilités de son centre de santé 1
    When il supprime ses informations complémentaires en page d'édition des disponibilités
    Then les informations complémentaires sont absentes en page d'édition des disponibilités
    And les informations complémentaires sont absentes en page de résultats visibles par le régulateur "IOA"