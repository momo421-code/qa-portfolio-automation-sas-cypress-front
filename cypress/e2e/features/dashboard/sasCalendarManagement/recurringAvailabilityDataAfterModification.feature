@SAS-8575 @editionDispo
Feature: Informations des disponibilités récurrentes en page d'édition après modification
  En tant qu'effecteur ou gestionnaire de structure ou délégataire
  Je veux que les récurrences de mes disponibilités soient affichées sur plusieurs semaines en page d'édition après modification
  Afin d'avoir mes disponibilités à jour

  @ps @plage
  Scenario:Les récurrences de plage horaire sont affichées sur les semaines suivantes en page d'édition après sa modification avec les informations saisies
    Given l'utilisateur "Effecteur Dispo SAS" connecté
    And l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice 1
    When il modifie de façon récurrente une disponibilité nouvellement créée sans doublon
      | Donnée                    | Valeur           |
      | Date                      | J+3              |
      | Dates modifiées           | J+3              |
      | Heure de début            | 10h00            |
      | Heure de début modifiée   | 10h45            |
      | Heure de fin              | 12h00            |
      | Heure de fin modifiée     | 12h45            |
      | Type de disponibilité     | Plage            |
      | Nombre de patients        | 8                |
      | Modalités de consultation | Téléconsultation |
      | Récurrences               | J+3              |
    Then les récurrences modifiées de la disponibilité sont visibles avec les informations attendues sur au moins 4 semaines

  @structure @créneau
  Scenario: Les récurrences de plage horaire sont affichées sur les semaines suivantes en page d'édition après sa modification avec les informations saisies
    Given l'utilisateur "Gestionnaire de structure Dispo SAS" connecté
    And le gestionnaire de structure sur la page d'édition des disponibilités de son centre de santé 1
    When il modifie de façon récurrente une disponibilité nouvellement créée sans doublon
      | Donnée                    | Valeur           |
      | Date                      | J+1              |
      | Dates modifiées           | J+1 ; J+2        |
      | Heure de début            | 17h15            |
      | Heure de début modifiée   | 17h30            |
      | Heure de fin              | 17h45            |
      | Type de disponibilité     | Créneau          |
      | Modalités de consultation | Téléconsultation |
      | Récurrences               | J+1 ; J+2        |
    Then les récurrences modifiées de la disponibilité sont visibles avec les informations attendues sur au moins 4 semaines