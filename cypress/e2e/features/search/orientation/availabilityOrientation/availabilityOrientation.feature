@SAS-9388 @recherche @orientation
Feature: Orientation de disponibilités
  En tant qu'administrateur du SAS
  Je veux que les régulateurs puissent orienter un patient via une disponibilité
  Afin que l'orientation soit tracée sur le SAS

  @ps
  Scenario Outline: Orienter un patient via une plage horaire SAS #<effecteur>
    Given la création d'une disponibilité sur le lieu d'exercice 1 de l'effecteur "<effecteur>"
      | Donnée                    | Valeur                  |
      | Date                      | <date>                  |
      | Heure de début            | <heure de début>        |
      | Heure de fin              | <heure de fin>          |
      | Type de disponibilité     | Plage                   |
      | Nombre de patients        | 1                       |
      | Modalités de consultation | Consultation en cabinet |
    Given l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "<effecteur>"
    When il oriente un patient sur la plage horaire "<heure de début> - <heure de fin>" à "<date>" sur le résultat avec le créneau "<heure du rdv>"
    Then l'orientation SAS a été enregistrée
    @individuel @testDeSurface
    Examples:
      | effecteur            | date | heure de début | heure de fin | heure du rdv |
      | Effecteur Individuel | J    | 22h00          | 23h00        | 22h30        |
    @msp
    Examples:
      | effecteur     | date | heure de début | heure de fin | heure du rdv |
      | Effecteur MSP | J+1  | 00h00          | 00h45        | 00h30        |
    @cpts
    Examples:
      | effecteur      | date | heure de début | heure de fin | heure du rdv |
      | Effecteur CPTS | J+1  | 08h00          | 09h30        | 08h30        |

  @structure
  Scenario Outline: Orienter un patient via un créneau horaire SAS #<structure>
    Given la création d'une disponibilité sur le <structure> <alias structure> du gestionnaire de structure "<gestionnaire>"
      | Donnée                    | Valeur           |
      | Date                      | <date>           |
      | Heure de début            | <heure de début> |
      | Heure de fin              | <heure de fin>   |
      | Type de disponibilité     | Créneau          |
      | Modalités de consultation | Téléconsultation |
    Given l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le <structure> <alias structure> du gestionnaire de structure "<gestionnaire>"
    When il oriente un patient sur le créneau horaire "<heure de début> - <heure de fin>" à "<date>" sur le résultat
    Then l'orientation SAS a été enregistrée
    @cds
    Examples:
      | structure       | alias structure | gestionnaire                  | date | heure de début | heure de fin |
      | centre de santé | 1               | Gestionnaire de structure CDS | J+1  | 09h00          | 12h15        |
    @sos
    Examples:
      | structure | alias structure                   | gestionnaire                  | date | heure de début | heure de fin |
      | PFG       | 1 de l'association SOS Médecins 1 | Gestionnaire de structure SOS | J+2  | 08h00          | 09h00        |