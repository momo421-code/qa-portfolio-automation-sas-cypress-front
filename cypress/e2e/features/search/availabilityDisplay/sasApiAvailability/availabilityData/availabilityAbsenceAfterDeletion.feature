@SAS-7746 @recherche @disponibilité
Feature: Absence des disponibilités SAS en page de résultats après suppression
  En tant qu'effecteur ou gestionnaire de structure du SAS
  Je veux que les disponibilités supprimées soient absentes en page de résultats
  Afin que les régulateurs ne voient pas des disponibilités obsolètes

  @ps @plage
  Scenario: Absence d'une plage SAS en page de résultats après suppression
    Given la suppression d'une disponibilité nouvellement créée sans doublon sur le lieu d'exercice 3 de l'effecteur "Effecteur Dispo SAS"
      | Donnée                    | Valeur           |
      | Date                      | J                |
      | Heure de début            | 22h00            |
      | Heure de fin              | 23h59            |
      | Type de disponibilité     | Plage            |
      | Nombre de patients        | 4                |
      | Modalités de consultation | Téléconsultation |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 3 de l'effecteur "Effecteur Dispo SAS"
    Then la disponibilité est absente sur le résultat

  @structure @créneau
  Scenario: Absence d'un créneau SAS en page de résultats après suppression
    Given la suppression d'une disponibilité nouvellement créée sans doublon sur le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
      | Donnée                    | Valeur                                      |
      | Date                      | J+1                                         |
      | Heure de début            | 16h30                                       |
      | Heure de fin              | 18h30                                       |
      | Type de disponibilité     | Créneau                                     |
      | Modalités de consultation | Visite à domicile ; Consultation en cabinet |
    And l'utilisateur "IOA" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
    When il active le filtre Créneaux en sus
    Then la disponibilité est absente sur le résultat