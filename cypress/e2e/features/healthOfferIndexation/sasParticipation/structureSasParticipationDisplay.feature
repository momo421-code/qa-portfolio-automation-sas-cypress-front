@SAS-8382 @recherche @paramètresSas @structure @testDeSurface
Feature: Remontée de la participation SAS des structures
  En tant que régulateur du SAS
  Je veux que la participation au SAS soit visible sur les résultats correspondants
  Afin que je discerner facilement les résultats m'intéressant

  @cds
  Scenario: Présence de la participation au SAS sur le centre de santé
    Given l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le centre de santé 1 du gestionnaire de structure "Gestionnaire de structure CDS"
    Then la participation au SAS est visible sur le résultat
    And le résultat a la mention de la participation au SAS

  @msp
  Scenario: Présence de la participation au SAS sur la MSP
    Given l'utilisateur "IOA" sur la page ayant pour résultat la MSP de l'effecteur "Effecteur MSP"
    When il active le filtre Créneaux en sus
    Then la participation au SAS est visible sur le résultat
    And le résultat a la mention de la participation au SAS

  @sos
  Scenario: Présence de la participation au SAS sur le point fixe de garde
    Given l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure SOS"
    Then la participation au SAS est visible sur le résultat
    And le résultat a la mention de la participation au SAS