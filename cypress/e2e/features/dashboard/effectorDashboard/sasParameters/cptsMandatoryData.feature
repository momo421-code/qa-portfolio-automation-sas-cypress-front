@SAS-8746 @paramètresSas
Feature: Enregistrement impossible pour la participation SAS via une CPTS
  En tant qu'administrateur du SAS
  Je veux que l'édition des paramètres SAS soit impossible s'il manque les données obligatoires liées à la CPTS
  Afin que ses informations importantes soient renseignées

  Background: Accès au dashboard et mise à défaut des paramètres SAS
    Given l'utilisateur "Effecteur Paramètres SAS" connecté
    And l'effecteur est sur son dashboard
    And les paramètres SAS effecteur par défaut

  Scenario: Enregistrement impossible sans sélection d'une CPTS
    When il met à jour les paramètres SAS effecteur sans sauvegarder
      | Participation au SAS      | via ma CPTS               |
      | Lieux rattachés à la CPTS | 96 Avenue Jean Paul Marat |
      | Solution éditeur          | Non                       |
    Then il ne peut pas sauvegarder les paramètres SAS effecteur

  Scenario: Enregistrement impossible sans sélection d'au moins un lieu d'exercice lié
    When il met à jour les paramètres SAS effecteur sans sauvegarder
      | Participation au SAS | via ma CPTS   |
      | CPTS                 | Cpts paris 14 |
      | Solution éditeur     | Non           |
    Then il ne peut pas sauvegarder les paramètres SAS effecteur