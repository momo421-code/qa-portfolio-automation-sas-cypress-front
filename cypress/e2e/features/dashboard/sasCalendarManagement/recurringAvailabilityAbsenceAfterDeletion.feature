@SAS-8576 @editionDispo
Feature: Absence des disponibilités récurrentes en page d'édition après suppression
  En tant qu'effecteur ou gestionnaire de structure ou délégataire
  Je veux que les récurrences de mes disponibilités soient absentes en page d'édition après suppression
  Afin d'avoir mes disponibilités à jour

  @ps @plage
  Scenario: Les récurrences de plage horaire sont absentes sur les semaines suivantes en page d'édition après sa suppression
    Given l'utilisateur "Effecteur Dispo SAS" connecté
    And l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice 3
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur                  |
      | Date                      | J+5                     |
      | Heure de début            | 15h00                   |
      | Heure de fin              | 16h30                   |
      | Type de disponibilité     | Plage                   |
      | Nombre de patients        | 3                       |
      | Modalités de consultation | Consultation en cabinet |
      | Récurrences               | J+5 ; J+7               |
    And il supprime les récurrences de la disponibilité
    Then les récurrences de la disponibilité sont absentes sur au moins 4 semaines

  @structure @créneau
  Scenario: Les récurrences de créneau horaire sont absentes sur les semaines suivantes en page d'édition après sa suppression
    Given l'utilisateur "Gestionnaire de structure Dispo SAS" connecté
    And le gestionnaire de structure sur la page d'édition des disponibilités du PFG 1 de son association SOS Médecins 1
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur           |
      | Date                      | J                |
      | Heure de début            | 23h15            |
      | Heure de fin              | 23h30            |
      | Type de disponibilité     | Créneau          |
      | Modalités de consultation | Téléconsultation |
      | Récurrences               | J                |
    And il supprime les récurrences de la disponibilité
    Then les récurrences de la disponibilité sont absentes sur au moins 4 semaines