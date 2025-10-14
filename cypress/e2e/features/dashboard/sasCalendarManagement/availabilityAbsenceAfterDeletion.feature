@SAS-8573 @editionDispo
Feature: Absence des disponibilités en page d'édition après suppression
  En tant qu'effecteur ou gestionnaire de structure ou délégataire
  Je veux que mes disponibilités soient absentes en page d'édition après suppression
  Afin d'avoir mes disponibilités à jour

  @ps @plage
  Scenario: Une plage horaire est absente en page d'édition après sa suppression
    Given l'utilisateur "Effecteur Dispo SAS" connecté
    And l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice 2
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur                                     |
      | Date                      | J+9                                        |
      | Heure de début            | 12h00                                      |
      | Heure de fin              | 14h00                                      |
      | Type de disponibilité     | Plage                                      |
      | Nombre de patients        | 4                                          |
      | Modalités de consultation | Téléconsultation ; Consultation en cabinet |
    And il supprime la disponibilité
    Then la disponibilité est absente en page d'édition

  @structure @créneau
  Scenario: Un créneau horaire est absent en page d'édition après sa suppression
    Given l'utilisateur "Gestionnaire de structure Dispo SAS" connecté
    And le gestionnaire de structure sur la page d'édition des disponibilités de son centre de santé 1
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur                  |
      | Date                      | J+2                     |
      | Heure de début            | 16h00                   |
      | Heure de fin              | 16h30                   |
      | Type de disponibilité     | Créneau                 |
      | Modalités de consultation | Consultation en cabinet |
    And il supprime la disponibilité
    Then la disponibilité est absente en page d'édition