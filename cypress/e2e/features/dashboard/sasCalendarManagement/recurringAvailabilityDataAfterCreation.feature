@SAS-8574 @editionDispo
Feature: Informations des disponibilités récurrentes en page d'édition après création
  En tant qu'effecteur ou gestionnaire de structure ou délégataire
  Je veux que les récurrences de mes disponibilités soient affichées sur plusieurs semaines en page d'édition après création
  Afin d'avoir mes disponibilités à jour

  @ps @plage
  Scenario: Les récurrences de plage horaire sont affichées sur les semaines suivantes en page d'édition après sa création avec les informations saisies
    Given l'utilisateur "Effecteur Dispo SAS" connecté
    And l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice 1
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur           |
      | Date                      | J+1              |
      | Heure de début            | 09h00            |
      | Heure de fin              | 12h00            |
      | Type de disponibilité     | Plage            |
      | Nombre de patients        | 6                |
      | Modalités de consultation | Téléconsultation |
      | Récurrences               | J+1 ; J+5        |
    Then les récurrences de la disponibilité sont créées avec les informations attendues sur au moins 4 semaines

  @structure @créneau
  Scenario: Les récurrences de plage horaire sont affichées sur les semaines suivantes en page d'édition après sa création avec les informations saisies
    Given l'utilisateur "Gestionnaire de structure Dispo SAS" connecté
    And le gestionnaire de structure sur la page d'édition des disponibilités de son centre de santé 1
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur                  |
      | Date                      | J                       |
      | Heure de début            | 23h45                   |
      | Heure de fin              | 23h59                   |
      | Type de disponibilité     | Créneau                 |
      | Modalités de consultation | Consultation en cabinet |
      | Récurrences               | J                       |
    Then les récurrences de la disponibilité sont créées avec les informations attendues sur au moins 4 semaines