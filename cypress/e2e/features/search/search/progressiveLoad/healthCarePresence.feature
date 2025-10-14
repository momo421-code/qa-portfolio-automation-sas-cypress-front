@SAS-8632 @recherche @testDeSurface
Feature: Présence de l'offre de soin
  En tant qu'administrateur du SAS
  Je veux que l'ensemble de l'offre de soins soit visible sur les différents types de recherche
  Afin que l'information ne soit pas perdue pour les régulateurs

  Scenario Outline: Présence de l'offre de soin avec disponibilités sur la recherche par créneaux disponibles
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    Then le résultat "<nom>" à "<adresse>" est présent
    And le résultat a des disponibilités
    @ps @individuel
    Examples:
      | recherche       | localisation       | nom             | adresse                                              |
      | Coulon Nathalie | Le Kremlin-Bicêtre | Coulon Nathalie | 5 Rue du Capitaine Morinet, 94270 Le Kremlin-Bicêtre |
    @ps @cpts
    Examples:
      | recherche | localisation | nom              | adresse                           |
      | Leveque   | Montluçon    | Leveque Tiphaine | 3 Rue des Forges, 03100 Montluçon |
    @ps @msp
    Examples:
      | recherche | localisation | nom        | adresse                             |
      | Elina     | Toulouse     | Mary Elina | 61 Avenue de l’Urss, 31400 Toulouse |
    @cds
    Examples:
      | recherche       | localisation | nom                               | adresse                       |
      | Centre de santé | Lille        | Centre De Santé Dentaire De Lille | 96 Rue Nationale, 59800 Lille |
    @sos
    Examples:
      | recherche | localisation | nom                                  | adresse |
      | SOS       | Pau          | SOS Médecins Pau - Point fixe de Pau |         |

  Scenario Outline: Présence de l'offre de soin sur la recherche avec disponibilités par créneaux en sus
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    When il active le filtre Créneaux en sus
    Then le résultat "<nom>" à "<adresse>" est présent
    And le résultat a des disponibilités
    @ps @individuel
    Examples:
      | recherche       | localisation       | nom             | adresse                                              |
      | Coulon Nathalie | Le Kremlin-Bicêtre | Coulon Nathalie | 5 Rue du Capitaine Morinet, 94270 Le Kremlin-Bicêtre |
    @ps @cpts
    Examples:
      | recherche | localisation | nom              | adresse                           |
      | Leveque   | Montluçon    | Leveque Tiphaine | 3 Rue des Forges, 03100 Montluçon |
    @cds
    Examples:
      | recherche       | localisation | nom                               | adresse                       |
      | Centre de santé | Lille        | Centre De Santé Dentaire De Lille | 96 Rue Nationale, 59800 Lille |
    @sos
    Examples:
      | recherche | localisation | nom                                  | adresse |
      | SOS       | Pau          | SOS Médecins Pau - Point fixe de Pau |         |

  Scenario Outline: Présence de l'offre de soin sur la recherche sans disponibilités par créneaux en sus
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    When il active le filtre Créneaux en sus
    Then le résultat "<nom>" à "<adresse>" est présent
    @msp
    Examples:
      | recherche | localisation | nom               | adresse                                            |
      | msp       | Toulouse     | Msp De Borderouge | 53 Avenue Maurice Bourges Maunoury, 31200 Toulouse |