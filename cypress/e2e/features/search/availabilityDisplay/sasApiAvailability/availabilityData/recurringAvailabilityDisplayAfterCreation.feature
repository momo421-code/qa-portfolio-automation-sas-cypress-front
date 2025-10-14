@SAS-8073 @recherche @disponibilité
Feature: Affichage des disponibilités récurrentes SAS d'un PS en page de résultats après création
  En tant qu'effecteur ou gestionnaire de structure du SAS
  Je veux que la disponibilité et ses récurrences créées soient visibles en page de résultats
  Afin que les régulateurs puissent voir les disponibilités

  @ps @plage
  Scenario: Affichage d'une plage SAS récurrente en page de résultats après création
    Given la création d'une disponibilité sans doublon sur le lieu d'exercice 1 de l'effecteur "Effecteur Dispo SAS"
      | Donnée                    | Valeur                  |
      | Date                      | J+1                     |
      | Heure de début            | 08h30                   |
      | Heure de fin              | 12h30                   |
      | Type de disponibilité     | Plage                   |
      | Nombre de patients        | 4                       |
      | Modalités de consultation | Consultation en cabinet |
      | Récurrences               | J+1 ; J+2               |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Dispo SAS"
    Then la disponibilité est visible sur le résultat avec les informations attendues
    And les récurrences de la disponibilité sont visibles sur le résultat avec les informations attendues

  @structure @créneau
  Scenario: Affichage d'un créneau SAS récurrent en page de résultats après création
    Given la création d'une disponibilité sans doublon sur le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
      | Donnée                    | Valeur                                      |
      | Date                      | J                                           |
      | Heure de début            | 21h30                                       |
      | Heure de fin              | 21h45                                       |
      | Type de disponibilité     | Créneau                                     |
      | Modalités de consultation | Visite à domicile ; Consultation en cabinet |
      | Récurrences               | J ; J+2                                     |
    And l'utilisateur "IOA" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
    When il active le filtre Créneaux en sus
    Then la disponibilité est visible sur le résultat avec les informations attendues
    And les récurrences de la disponibilité sont visibles sur le résultat avec les informations attendues