@SAS-9389 @recherche @orientation @ps @testDeSurface
Feature: Orientation surnuméraire
  En tant que régulateur du SAS
  Je veux orienter un patient en dehors des disponibilités proposées
  Afin de trouver un créneau possible pour le patient

  @ps
  Scenario Outline: Orienter un patient de façon surnuméraire #<effecteur>
    Given l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "<effecteur>"
    And il oriente un patient de façon surnuméraire à "<heure de début>" le "<date>" sur le résultat
    Then l'orientation SAS a été enregistrée
    @individuel @testDeSurface
    Examples:
      | effecteur            | date | heure de début |
      | Effecteur Individuel | J    | 22h00          |
    @cpts
    Examples:
      | effecteur      | date | heure de début |
      | Effecteur CPTS | J+1  | 08h00          |

  @structure
  Scenario Outline: Orienter un patient de façon surnuméraire #<structure>
    Given l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le <structure> <alias structure> du gestionnaire de structure "<gestionnaire>"
    When il active le filtre Créneaux en sus
    And il oriente un patient de façon surnuméraire à "<heure de début>" le "<date>" sur le résultat
    Then l'orientation SAS a été enregistrée
    @cds
    Examples:
      | structure       | alias structure | gestionnaire                  | date | heure de début |
      | centre de santé | 1               | Gestionnaire de structure CDS | J+1  | 09h00          |
    @sos
    Examples:
      | structure | alias structure                   | gestionnaire                  | date | heure de début |
      | PFG       | 1 de l'association SOS Médecins 1 | Gestionnaire de structure SOS | J+2  | 08h00          |

  @structure @cpts
  Scenario: Orienter un patient de façon surnuméraire #Cluster CPTS
    Given l'utilisateur "IOA" sur la page ayant pour résultat le CPTS de l'effecteur "Effecteur cluster CPTS" dans le cluster associé
    When il active le filtre Créneaux en sus
    And il oriente un patient de façon surnuméraire à "18h30" le "J" sur le résultat
    Then l'orientation SAS a été enregistrée

  @msp
  Scenario: Orienter un patient de façon surnuméraire #MSP
    Given l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat la MSP de l'effecteur "Effecteur MSP"
    When il active le filtre Créneaux en sus
    And il oriente un patient de façon surnuméraire à "15h15" le "J+2" sur le résultat
    Then l'orientation SAS a été enregistrée