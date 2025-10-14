@SAS-8152 @recherche @disponibilité @plage
Feature: Heures de plages horaires dépassées
  En tant qu'administrateur du SAS
  Je veux que les plages horaires dont l'heure de fin est dépassée n'apparaissent plus en page de résultat
  Afin que les régulateurs ne voient pas de plages horaires non pertinentes

  @prod
  Scenario Outline: Les plages horaires dont l'heure de fin est dépassée n'apparaissent plus
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    Then les plages horaires du jour actuel n'ont pas leur heure de fin dépassée
    Examples:
      | recherche | localisation                    |
      | Médecin   | 7 Rue Jacques Monod, 69007 Lyon |
      | Centre    | Marseille                       |

  Scenario: Les plages horaires dont l'heure de début est dépassée mais non pas leur heure de fin sont visibles
    Given l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Individuel"
    Then la plage horaire "00h00 - 23h59" du jour actuel est visible sur le résultat