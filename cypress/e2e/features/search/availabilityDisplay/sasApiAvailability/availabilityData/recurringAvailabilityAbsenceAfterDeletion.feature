@SAS-7744 @recherche @disponibilité
Feature: Absence des disponibilités récurrentes SAS d'un PS en page de résultats après suppression
  En tant qu'effecteur ou gestionnaire de structure du SAS
  Je veux que la disponibilité et ses récurrences supprimées soient absentes en page de résultats
  Afin que les régulateurs ne voient pas des disponibilités obsolètes

  @structure @plage
  Scenario: Absence d'une plage et des ses récurrences SAS en page de résultats après suppression
    Given la suppression d'une disponibilité et de ses récurrences nouvellement créées et sans doublon sur le centre de santé 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
      | Donnée                    | Valeur           |
      | Date                      | J                |
      | Heure de début            | 21h30            |
      | Heure de fin              | 23h30            |
      | Type de disponibilité     | Plage            |
      | Nombre de patients        | 4                |
      | Modalités de consultation | Téléconsultation |
      | Récurrences               | J+1 ; J+2        |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le centre de santé 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
    Then la disponibilité et ses récurrences sont absentes du résultat

  @ps @créneau
  Scenario: Absence d'un créneau récurrent SAS en page de résultats après suppression
    Given la suppression des récurrences de la disponibilité nouvellement créée sans doublon sur le lieu d'exercice 3 de l'effecteur "Effecteur Dispo SAS"
      | Donnée                    | Valeur                  |
      | Date                      | J+1                     |
      | Heure de début            | 00h30                   |
      | Heure de fin              | 01h00                   |
      | Type de disponibilité     | Créneau                 |
      | Modalités de consultation | Consultation en cabinet |
      | Récurrences               | J+2                     |
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 3 de l'effecteur "Effecteur Dispo SAS"
    Then les récurrences de la disponibilité sont absentes sur le résultat

   @PFG @créneau 
   Scenario: Absence d'un créneau récurrent SAS en page de résultats après suppression sur un PFG d'une association SOS Médecins
    Given la suppression des récurrences de la disponibilité nouvellement créée sans doublon sur le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
      | Donnée                    | Valeur                  |
      | Date                      | J+1                     |
      | Heure de début            | 00h30                   |
      | Heure de fin              | 01h00                   |
      | Type de disponibilité     | Créneau                 |
      | Modalités de consultation | Consultation en cabinet |
      | Récurrences               | J+2                     |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
    Then les récurrences de la disponibilité sont absentes sur le résultat 