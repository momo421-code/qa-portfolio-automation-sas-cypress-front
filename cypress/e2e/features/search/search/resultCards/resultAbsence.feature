@SAS-8633 @prod @recherche
Feature: Absence de résultats

  Scenario Outline: Absence de résultats lors d'une recherche invalide
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<search>" à "<location>"
    Then aucun résultat n'est présent sur la page de recherche
    Examples:
      | search  | location |
      | xxxxx   | Paris    |
      | Chaffal | xxxxx    |

  Scenario: Absence de résultats lorsqu'aucune offre de soin n'est disponible
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "Boutonne Dominique" à "Paris"
    Then aucun résultat n'est présent sur la page de recherche