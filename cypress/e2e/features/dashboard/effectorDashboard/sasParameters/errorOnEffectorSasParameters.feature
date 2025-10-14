@SAS-9027 @paramètresSas
Feature: Sauvegarde des paramètres SAS effecteur après édition
  En tant qu'effecteur du SAS
  Je ne veux pas que la modification de mes paramètres liés au SAS soient pris en compte lorsqu'un élément renseigné est incorrect
  Afin que les informations de mes lieux d'exercices soient correctes

  Background: Accès au dashboard et mise à défaut des paramètres SAS
    Given l'utilisateur "Effecteur Paramètres SAS" connecté
    And l'effecteur est sur son dashboard

  Scenario: Enregistrement impossible des paramètres SAS en déclarant être interfacé sans spécifier d'éditeur
    When il renseigne sa participation au SAS avec solution éditeur sans préciser sa provenance
    Then il ne peut pas sauvegarder les paramètres SAS effecteur

  Scenario: Absence du choix d'éditeurs en déclarant être interfacé mais avec le refus des créneaux éditeurs
    When il renseigne sa participation au SAS avec solution éditeur et en refusant d'afficher les créneaux éditeurs
    Then il n'est pas possible de définir des solutions éditeur