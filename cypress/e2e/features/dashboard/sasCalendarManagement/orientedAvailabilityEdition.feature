@SAS-8635 @editionDispo @orientation
Feature: Edition de disponibilités orientées
  En tant qu'effecteur ou gestionnaire de structure du SAS
  Je veux que les disponibilités orientées ne soient plus éditables
  Afin d'éviter de modifier les données de rendez-vous déjà pris

  @ps
  Scenario: Une plage orientée n'est plus éditable
    Given l'orientation complète d'une disponibilité nouvellement créée sur le lieu d'exercice 1 de l'effecteur "Effecteur Individuel"
      | Donnée                    | Valeur           |
      | Date                      | J                |
      | Heure de début            | 22h00            |
      | Heure de fin              | 23h59            |
      | Type de disponibilité     | Plage            |
      | Nombre de patients        | 2                |
      | Modalités de consultation | Téléconsultation |
    And l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice
    Then la disponibilité précédemment orientée n'est plus modifiable
    And la disponibilité précédemment orientée n'est plus supprimable

  @structure
  Scenario: Un créneau orienté n'est plus éditable
    Given l'orientation complète d'une disponibilité nouvellement créée sur le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure SOS"
      | Donnée                    | Valeur           |
      | Date                      | J                |
      | Heure de début            | 23h15            |
      | Heure de fin              | 23h30            |
      | Type de disponibilité     | Créneau          |
      | Modalités de consultation | Téléconsultation |
    And le gestionnaire de structure sur la page d'édition des disponibilités de son PFG
    Then la disponibilité précédemment orientée n'est plus modifiable
    And la disponibilité précédemment orientée n'est plus supprimable