@SAS-8570 @rechercheSuggérée
Feature: Filtrage par type de la recherche suggérée

  Scenario: les structures ont un type correspondant au filtre de recherche suggérée
    Given le filtre de recherche suggérée "Test_FRS_STRUCTURES"
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "Test_FRS_STRUCTURES" à "Rhône"
    When il active le filtre Créneaux en sus
    Then tous les résultats ont un type correspondant au filtre de recherche suggérée

  Scenario Outline: pour les PS ne participant pas au SAS, le filtre sans spécialité, renvoie les PS dont le type correspond, quelle que soit leur spécialité
    When l'utilisateur "Régulateur OSNP" sur la page de résultats "<nom filtre>" à "Paris"
    Then le lieu d'exercice "1" de l'effecteur "<effecteurAlias>" est présent dans l'ensemble des résultats
    Examples:
      | nom filtre                | effecteurAlias                    |
      | Consultation de pédiatrie | Effecteur Dispos NonSAS pediatre1 |
      | Consultation de pédiatrie | Effecteur Dispos NonSAS pediatre2 |
