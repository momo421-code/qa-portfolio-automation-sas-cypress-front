@SAS-9015 @paramètresSas @cds
Feature: Sauvegarde des paramètres SAS gestionnaire de structure CDS après édition
  En tant que gestionnaire de structure CDS du SAS
  Je veux que la modification de mes paramètres liés au SAS soient pris en compte
  Afin que les informations de mes lieux d'exercices soient correctes

  Background:
    Given l'utilisateur "Gestionnaire de structure CDS" connecté
    And le gestionnaire de structure CDS est sur son dashboard

  Scenario: Impossible de participer au SAS avec un CDS sans avoir déclaré sur l'honneur la mise à disposition de disponibilités
    When il met à jour les paramètres SAS gestionnaire de structure
      | Nombre de PS participant             | 1   |
      | Acceptation orientation surnuméraire | Oui |
      | Déclaration sur l'honneur            | Non |
    Then il ne peut pas sauvegarder les paramètres SAS gestionnaire de structure

  @teardown_set_sas_parameters_back
  Scenario: Le nombre de PS participant au SAS d'un CDS est enregistré à 0 lorsque non spécifié
    When il met à jour les paramètres SAS gestionnaire de structure
      | Nombre de PS participant |  |
    And il enregistre les paramètres SAS gestionnaire de structure
    Then le nombre de professionnels de santé enregistré est à 0

  Scenario: Impossibilité de participer au SAS avec un CDS sans avoir spécifié le nombre de PS
    When il met à jour les paramètres SAS gestionnaire de structure
      | Nombre de PS participant | 0 |
    Then il ne peut pas participer au SAS

  Scenario: La configuration CNAM est sauvegardée après déclaration de la participation au SAS pour un CDS
    When il met à jour les paramètres SAS gestionnaire de structure
      | Nombre de PS participant | 0 |
    And il enregistre les paramètres SAS gestionnaire de structure
    And il met à jour les paramètres SAS gestionnaire de structure
      | Nombre de PS participant             | 1   |
      | Acceptation orientation surnuméraire | Oui |
      | Déclaration sur l'honneur            | Oui |
    And il enregistre les paramètres SAS gestionnaire de structure
    Then le nombre de professionnels de santé enregistré est à 1