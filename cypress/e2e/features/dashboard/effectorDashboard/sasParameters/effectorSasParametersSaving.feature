@SAS-8747 @paramètresSas
Feature: Sauvegarde des paramètres SAS effecteur après édition
  En tant qu'effecteur du SAS
  Je veux que la modification de mes paramètres liés au SAS soient pris en compte
  Afin que les informations de mes lieux d'exercices soient correctes

  Background: Accès au dashboard et mise à défaut des paramètres SAS
    Given l'utilisateur "Effecteur Paramètres SAS" connecté
    And l'effecteur est sur son dashboard
    And les paramètres SAS effecteur par défaut

  Scenario: Sauvegarde des paramètres SAS effecteur à titre individuel
    When il met à jour les paramètres SAS effecteur
      | Participation au SAS        | à titre individuel |
      | Solution éditeur            | Oui                |
      | Editeurs                    | Doctolib ; Maiia   |
      | Affichage créneaux éditeurs | Acceptation        |
    Then les paramètres SAS effecteur ont les informations attendues

  Scenario: Sauvegarde des paramètres SAS effecteur via CPTS
    When il met à jour les paramètres SAS effecteur
      | Participation au SAS        | via ma CPTS               |
      | CPTS                        | Cpts paris 14             |
      | Solution éditeur            | Non                       |
      | Lieux rattachés à la CPTS   | 96 Avenue Jean Paul Marat |
      | Affichage créneaux éditeurs | Refus                     |
    Then les paramètres SAS effecteur ont les informations attendues

  Scenario: Sauvegarde des paramètres SAS effecteur via MSP
    When il met à jour les paramètres SAS effecteur
      | Participation au SAS        | via ma MSP      |
      | MSP                         | Msp Paris Lilas |
      | Solution éditeur            | Oui             |
      | Affichage créneaux éditeurs | Refus           |
    Then les paramètres SAS effecteur ont les informations attendues

  Scenario: Sauvegarde des paramètres SAS effecteur via association SOS Médecins
    When il met à jour les paramètres SAS effecteur
      | Participation au SAS     | via mon association SOS Médecins ou mon association de visites à domicile |
      | Association SOS Médecins | SOS Médecins Grand Paris                                                  |
    Then les paramètres SAS effecteur ont les informations attendues