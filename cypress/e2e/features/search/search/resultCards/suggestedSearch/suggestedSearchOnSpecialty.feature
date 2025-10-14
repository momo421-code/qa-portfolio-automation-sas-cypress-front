@SAS-8569 @rechercheSuggérée
Feature: Filtrage par spécialité de la recherche suggérée
  En tant que régulateur SAS
  Je souhaite accéder à un filtre de recherche suggérées sur la spécialité
  Afin de ne pas voir les PS ne participant pas au SAS n'ayant pas les spécialités attendues

  Scenario Outline: pour les PS ne participant pas au SAS, le filtre avec plusieurs spécialités, ne renvoie que les PS ayant exactement cette spécialité
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<nom filtre>" à "Paris"
    Then le lieu d'exercice "<locId>" de l'effecteur "<effecteurAlias>" est présent dans l'ensemble des résultats
    Examples:
      | nom filtre                      | effecteurAlias                    | locId |
      | Test_FRS_PEDIATRIE_Pediatrie    | Effecteur Dispos NonSAS pediatre1 | 1     |
      | Test_FRS_PEDIATRIE_Allergologie | Effecteur Dispos NonSAS pediatre2 | 1     |

  Scenario Outline: pour les PS ne participant pas au SAS, le filtre avec plusieurs spécialités ne renvoie pas les PS n'ayant pas exactement ces spécialités
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<nom filtre>" à "Paris"
    Then le lieu d'exercice <locId> de l'effecteur <effecteurAlias> est absent de l'ensemble des résultats
    Examples:
      | nom filtre                      | effecteurAlias                    | locId |
      | Test_FRS_PEDIATRIE_Pediatrie    | Effecteur Dispos NonSAS pediatre2 | 1     |
      | Test_FRS_PEDIATRIE_Allergologie | Effecteur Dispos NonSAS pediatre1 | 1     |

  Scenario Outline: la spécialité du filtre n'a aucun impact sur la recherche de structure, créneaux en sus
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<nom filtre>" à "<localisation cherchée>"
    When il active le filtre Créneaux en sus
    Then le résultat "<nom>" à "<localisation trouvée>" est présent dans l'ensemble des résultats
    Examples:
      | nom filtre          | localisation cherchée | nom                                                | localisation trouvée |
      | Test_FRS_STRUCTURES | Côtes d Armor         | SOS Médecins Pays de Vannes - Point fixe de Vannes | Vannes               |
      | Test_FRS_STRUCTURES | Côtes d Armor         | Maison De Sante Pluriprofessionnelle De Reguiny    | Réguiny              |