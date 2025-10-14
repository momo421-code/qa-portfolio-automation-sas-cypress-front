@SAS-8745 @recherche @paramètresSas @ps @testDeSurface
Feature: Remontée de la participation SAS des lieux d'exercice
  En tant que régulateur du SAS
  Je veux que la participation au SAS soit visible sur les résultats correspondants
  Afin que je discerner facilement les résultats m'intéressant

  Scenario: Présence de la participation au SAS à titre individuel sur le lieu d'exercice
    Given l'utilisateur "Effecteur Paramètres SAS" met à jour ses paramètres SAS effecteur
      | Participation au SAS | à titre individuel |
      | Solution éditeur     | Non                |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Paramètres SAS"
    Then le résultat après indexation a la mention de la participation au SAS

  Scenario: Présence de la participation au SAS via CPTS sur le lieu d'exercice
    Given l'utilisateur "Effecteur Paramètres SAS" met à jour ses paramètres SAS effecteur
      | Participation au SAS      | via ma CPTS               |
      | CPTS                      | Cpts paris 14             |
      | Solution éditeur          | Non                       |
      | Lieux rattachés à la CPTS | 96 Avenue Jean Paul Marat |
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Paramètres SAS"
    Then le résultat après indexation a la mention de la participation au SAS via CPTS

  Scenario: Présence de la participation au SAS via MSP sur le lieu d'exercice
    Given l'utilisateur "Effecteur Paramètres SAS" met à jour ses paramètres SAS effecteur
      | Participation au SAS | via ma MSP      |
      | MSP                  | Msp Paris Lilas |
      | Solution éditeur     | Non             |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Paramètres SAS"
    Then le résultat après indexation a la mention de la participation au SAS via MSP

  Scenario: Absence du lieu d'exercice du PS participant au SAS via association SOS Médecins
    Given l'utilisateur "Effecteur Paramètres SAS" met à jour ses paramètres SAS effecteur
      | Participation au SAS     | via mon association SOS Médecins ou mon association de visites à domicile |
      | Association SOS Médecins | SOS Médecins Grand Paris                                                  |
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Paramètres SAS"
    #TODO : ajouter la recherche de niveau 1 ou ne vérifier que la première ?
    When il active le filtre Créneaux en sus
    Then le résultat "Chevalier Jean" à "96 Avenue Jean Paul Marat" est absent