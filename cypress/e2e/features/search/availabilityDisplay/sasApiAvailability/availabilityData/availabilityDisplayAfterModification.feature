@SAS-7745 @recherche @disponibilité
Feature: Affichage des disponibilités SAS d'un PS en page de résultats après modification
  En tant qu'effecteur ou gestionnaire de structure du SAS
  Je veux que les modifications de mes disponibilités soient visibles en page de résultats
  Afin que les régulateurs puissent voir les disponibilités à jour

  @ps @plage
  Scenario: Affichage d'une plage SAS en page de résultats après modification
    Given la modification d'une disponibilité nouvellement créée sans doublon sur le lieu d'exercice 2 de l'effecteur "Effecteur Dispo SAS"
      | Donnée                        | Valeur           |
      | Date                          | J+2              |
      | Heure de début                | 00h00            |
      | Heure de fin                  | 13h00            |
      | Type de disponibilité         | Plage            |
      | Nombre de patients            | 1                |
      | Modalités de consultation     | Téléconsultation |
      # Données modifiées
      | Heure de début modifiée       | 12h00            |
      | Type de disponibilité modifié | Créneau          |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 2 de l'effecteur "Effecteur Dispo SAS"
    Then la disponibilité modifiée est visible sur le résultat avec les informations attendues

  @structure @créneau
  Scenario: Affichage d'un créneau SAS en page de résultats après modification
    Given la modification d'une disponibilité nouvellement créée sans doublon sur le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
      | Donnée                              | Valeur                                     |
      | Date                                | J+1                                        |
      | Heure de début                      | 17h30                                      |
      | Heure de fin                        | 18h30                                      |
      | Type de disponibilité               | Créneau                                    |
      | Modalités de consultation           | Visite à domicile                          |
      # Données modifiées
      | Heure de début modifiée             | 19h30                                      |
      | Heure de fin modifiée               | 20h30                                      |
      | Type de disponibilité modifié       | Plage                                      |
      | Nombre de patients modifié          | 2                                          |
      | Modalités de consultation modifiées | Consultation en cabinet ; Téléconsultation |
    And l'utilisateur "IOA" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 1 du gestionnaire de structure "Gestionnaire de structure Dispo SAS"
    When il active le filtre Créneaux en sus
    Then la disponibilité modifiée est visible sur le résultat avec les informations attendues