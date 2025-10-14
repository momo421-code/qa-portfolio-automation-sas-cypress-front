@SAS-8637 @recherche @disponibilité
Feature: Affichage des disponibilités SAS en page de résultats après création
  En tant qu'effecteur ou gestionnaire de structure du SAS
  Je veux que les disponibilités crées soient visibles en page de résultats
  Afin que les régulateurs puissent voir les disponibilités

  @structure @plage @cpts
  Scenario: Affichage d'une plage SAS en page de résultats après création
    Given l'utilisateur "Gestionnaire de structure CPTS" connecté
    And le gestionnaire de structure sur la page d'édition des disponibilités du lieu d'exercice 1 du PS "Effecteur cluster CPTS" via sa CPTS "Cpts nord 74"
    When il créé une disponibilité sans doublon
      | Donnée                    | Valeur                  |
      | Date                      | J+1                     |
      | Heure de début            | 18h30                   |
      | Heure de fin              | 20h30                   |
      | Type de disponibilité     | Plage                   |
      | Nombre de patients        | 4                       |
      | Modalités de consultation | Consultation en cabinet |
    Then la disponibilité est visible sur le résultat dans le cluster CPTS avec les informations attendues via le régulateur "Régulateur OSNP"

  @ps @créneau
  Scenario: Affichage d'un créneau SAS en page de résultats après création
    Given la création d'une disponibilité sans doublon sur le lieu d'exercice 1 de l'effecteur "Effecteur Dispo SAS"
      | Donnée                    | Valeur                               |
      | Date                      | J                                    |
      | Heure de début            | 23h15                                |
      | Heure de fin              | 23h59                                |
      | Type de disponibilité     | Créneau                              |
      | Modalités de consultation | Téléconsultation ; Visite à domicile |
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Dispo SAS"
    Then la disponibilité est visible sur le résultat avec les informations attendues