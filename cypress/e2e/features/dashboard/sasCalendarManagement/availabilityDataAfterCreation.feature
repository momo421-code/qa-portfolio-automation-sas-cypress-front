@SAS-8571 @editionDispo
Feature: Informations des disponibilités en page d'édition après création
  En tant qu'effecteur ou gestionnaire de structure ou délégataire
  Je veux que mes disponibilités soient affichées en page d'édition après création
  Afin d'avoir mes disponibilités à jour

  @ps @plage
  Scenario: Une plage horaire est affichée en page d'édition après sa création avec les informations saisies
    Given l'utilisateur "Effecteur Dispo SAS" connecté
    And l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice 1
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur                  |
      | Date                      | J+8                     |
      | Heure de début            | 19h30                   |
      | Heure de fin              | 23h30                   |
      | Type de disponibilité     | Plage                   |
      | Nombre de patients        | 4                       |
      | Modalités de consultation | Consultation en cabinet |
    Then la disponibilité est créée avec les informations attendues

  @structure @créneau
  Scenario: Un créneau horaire est affiché en page d'édition après sa création avec les informations saisies
    Given l'utilisateur "Gestionnaire de structure Dispo SAS" connecté
    And le gestionnaire de structure sur la page d'édition des disponibilités de son centre de santé 1
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur                  |
      | Date                      | J+8                       |
      | Heure de début            | 22h30                   |
      | Heure de fin              | 23h30                   |
      | Type de disponibilité     | Créneau                 |
      | Modalités de consultation | Consultation en cabinet |
    Then la disponibilité est créée avec les informations attendues