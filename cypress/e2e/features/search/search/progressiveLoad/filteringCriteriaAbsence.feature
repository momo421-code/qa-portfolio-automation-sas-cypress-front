@SAS-8621 @prod @recherche @filtres
Feature: Absence de filtres lors de l'absence de résultats
  En tant qu'administrateur du SAS
  Je veux que les filtres ne correspondant à aucun résultat soient absents
  Afin que les régulateurs n'aient pas de page de résultats vide après avoir filtré

  # TODO: Faire pour la barre de filtre en plus de tous les résultats.
  Scenario Outline: Absence de filtre lors d'une recherche invalide de créneaux disponibles
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<search>" à "<location>"
    Then aucun filtre n'est présent
    Examples:
      | search  | location |
      | xxxxx   | Paris    |
      | Chaffal | xxxxx    |

  Scenario: Absence de filtre lorsqu'aucune offre de soin n'est disponible de créneaux disponibles
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "Boutonne Dominique" à "Paris"
    Then aucun filtre n'est présent

  Scenario Outline: Absence de filtre lors d'une recherche invalide de créneaux en sus
    # NB. pas de recherche Créneaux en sus lorsque le lieu de la recherche n'est pas connu.
    Given l'utilisateur "Régulateur OSNP" connecté
    Given l'utilisateur sur la page de résultats "<search>" à "<location>"
    When il active le filtre Créneaux en sus
    Then aucun filtre n'est présent
    Examples:
      | search  | location |
      | xxxxx   | Paris    |

  Scenario: Absence de filtre lorsqu'aucune offre de soin n'est disponible de créneaux en sus
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "Boutonne Dominique" à "Paris"
    When il active le filtre Créneaux en sus
    Then aucun filtre n'est présent