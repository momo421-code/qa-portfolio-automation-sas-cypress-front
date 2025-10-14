@SAS-8074 @recherche @disponibilité
Feature: Affichage des disponibilités récurrentes SAS d'un PS en page de résultats après modification
  En tant qu'effecteur ou gestionnaire de structure du SAS
  Je veux que les modifications de la disponibilité et ses récurrences soient visibles en page de résultats
  Afin que les régulateurs puissent voir les disponibilités à jour

  @structure @plage
  Scenario: Affichage de plages récurrentes SAS en page de résultats après modification
    Given la modification d'une disponibilité nouvellement créée sans doublon sur le centre de santé 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
      | Donnée                              | Valeur                  |
      | Date                                | J+1                     |
      | Heure de début                      | 20h30                   |
      | Heure de fin                        | 22h30                   |
      | Type de disponibilité               | Plage                   |
      | Nombre de patients                  | 4                       |
      | Modalités de consultation           | Téléconsultation        |
      | Récurrences                         | J+2                     |
      # DONNÉES MODIFIÉES
      | Dates modifiées                     | J+2                     |
      | Heure de début modifiée             | 20h00                   |
      | Type de disponibilité               | Créneau                 |
      | Modalités de consultation modifiées | Consultation en cabinet |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le centre de santé 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
    Then la disponibilité est visible sur le résultat avec les informations attendues
    And les récurrences modifiées de la disponibilité sont visibles sur le résultat avec les informations attendues

  @ps @créneau
  Scenario: Affichage de créneaux récurrents SAS en page de résultats après modification
    Given la modification récurrente d'une disponibilité nouvellement créée sans doublon sur le lieu d'exercice 2 de l'effecteur "Effecteur Dispo SAS"
      | Donnée                              | Valeur                                     |
      | Date                                | J+1                                        |
      | Heure de début                      | 07h30                                      |
      | Heure de fin                        | 08h00                                      |
      | Type de disponibilité               | Créneau                                    |
      | Modalités de consultation           | Consultation en cabinet                    |
      | Récurrences                         | J+1                                        |
      # DONNÉES MODIFIÉES
      | Heure de début modifiée             | 07h00                                      |
      | Heure de fin modifiée               | 07h30                                      |
      | Type de disponibilité modifié       | Plage                                      |
      | Nombre de patients modifié          | 2                                          |
      | Modalités de consultation modifiées | Consultation en cabinet ; Téléconsultation |
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 2 de l'effecteur "Effecteur Dispo SAS"
    When il active le filtre Créneaux en sus
    Then la disponibilité modifiée est visible sur le résultat avec les informations attendues

  Scenario: Affichage de créneaux récurrents SAS en page de résultats après modification sur un PFG d'une association SOS Médecins
    Given la modification récurrente d'une disponibilité nouvellement créée sans doublon sur le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
      | Donnée                    | Valeur                  |
      | Date                      | J                       |
      | Heure de début            | 21h00                   |
      | Heure de fin              | 22h00                   |
      | Type de disponibilité     | Créneau                 |
      | Modalités de consultation | Consultation en cabinet |
      | Récurrences               | J                       |
      # DONNÉES MODIFIÉES
      | Heure de début modifiée   | 21h30                   |
      | Heure de fin modifiée     | 22h30                   |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
    When il active le filtre Créneaux en sus
    Then la disponibilité modifiée est visible sur le résultat avec les informations attendues   