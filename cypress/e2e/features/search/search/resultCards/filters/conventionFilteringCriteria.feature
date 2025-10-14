@SAS-7742 @prod @recherche @filtres
Feature: Filtrer par conventionnement
  En tant que régulateur du SAS
  Je veux filtrer par conventionnement les résultats de recherche
  Afin de trouver des résultats correspondant aux attentes du patient

  Scenario Outline: Application du filtre Conventionnement via Tous les filtres
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    When il applique les filtres via tous les filtres
      | Filtre           | Valeur              |
      | Conventionnement | <conventionnements> |
    Then tous les résultats ont un conventionnement appartenant à "<valeurs attendues>"
    Examples:
      | recherche                         | localisation | conventionnements | valeurs attendues      |
      | Consultation de médecine générale | Paris        | Secteur 1         | Conventionné secteur 1 |

  Scenario Outline: Application du filtre Conventionnement via Tous les filtres en recherche Créneaux en sus,
  après rechargement des résultats
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    When il active le filtre Créneaux en sus
    When il navigue dans les résultats jusqu'à la dernière page
    When il applique les filtres via tous les filtres
      | Filtre           | Valeur              |
      | Conventionnement | <conventionnements> |
    Then tous les résultats ont un conventionnement appartenant à "<valeurs attendues>"
    Examples:
      | recherche                         | localisation                                | conventionnements      | valeurs attendues                               |
      | Consultation de médecine générale | 56 Avenue Guy Môquet, 94400 Vitry-sur-Seine | Secteur 2              | Conventionné secteur 2                          |
      | Consultation de médecine générale | 56 Avenue Guy Môquet, 94400 Vitry-sur-Seine | Secteur 2 ; Secteur 1  | Conventionné secteur 1 ; Conventionné secteur 2 |
      | Consultation de médecine générale | Rue Claude Decaen, 75012 Paris              | Secteur 2              | Conventionné secteur 2                          |
      | Consultation de médecine générale | Paris                                       | Secteur 1 ; Non défini | Conventionné secteur 1 ; (vide)                 |