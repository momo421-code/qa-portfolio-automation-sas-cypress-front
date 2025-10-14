@SAS-9105 @paramètresSas
Feature: Enregistrement impossible pour la participation SAS via une MSP
  En tant qu'administrateur du SAS
  Je veux que l'édition des paramètres SAS soit impossible s'il manque les données obligatoires liées à la MSP
  Afin que ses informations importantes soient renseignées

  Background: Accès au dashboard et mise à défaut des paramètres SAS
    Given l'utilisateur "Effecteur Paramètres SAS" connecté
    And l'effecteur est sur son dashboard
    And les paramètres SAS effecteur par défaut

  Scenario: Enregistrement impossible sans sélection d'une MSP
    When il met à jour les paramètres SAS effecteur sans sauvegarder
      | Participation au SAS | via ma MSP |
      | MSP                  |            |
      | Solution éditeur     | Non        |
    Then le message d'erreur de non sélection d'une MSP est présent
    And il ne peut pas sauvegarder les paramètres SAS effecteur
