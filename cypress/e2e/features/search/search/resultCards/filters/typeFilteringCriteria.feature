@SAS-7467 @prod @recherche @filtres
Feature: Filtrer par type
  En tant que régulateur du SAS
  Je veux filtrer par type les résultats de recherche
  Afin de trouver des résultats correspondant aux attentes du patient

   Scenario Outline: Application du filtre Type via le bandeau de filtres
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    When il applique les valeurs "<types>" du filtre "Type"
    Then tous les résultats ont un type appartenant à "<types>"
    Examples:
      | recherche                         | localisation                  | types               |
      | Consultation de médecine générale | Paris                         | Médecin généraliste |
      | Consultation de médecine générale | 96 Rue Nationale, 59800 Lille | Centre de santé     |
      | Santé                             | Lyon                          | Maison de santé     |
    # TODO: Mettre à jour les JDD quand les CPTS et MSP seront disponibles en niveau 1.
#      | Consultation de médecine générale | Lyon 8                                   | CPTS            |
#      | Santé                             | Paris                                    | Maison de santé |



 # TODO: Créer un pas de test pour accéder à la dernière page possible quand l'event front sera créé.
  Scenario Outline: Application du filtre Type via Tous les filtres
    Given l'utilisateur "IOA" sur la page de résultats "<recherche>" à "<localisation>"
    When il applique les filtres via tous les filtres
      | Filtre | Valeur  |
      | Type   | <types> |
    Then tous les résultats ont un type appartenant à "<types>"
    Examples:
      | recherche | localisation | types        |
      | SOS       | Lyon        | SOS Médecins  |

  Scenario Outline: Application du filtre Type via Tous les filtres après rechargement des résultats
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    When il navigue dans les résultats jusqu'à la dernière page
    When il navigue dans les résultats jusqu'à la première page
    When il applique les filtres via tous les filtres
      | Filtre | Valeur  |
      | Type   | <types> |
    Then tous les résultats ont un type appartenant à "<types>"
    Examples:
      | recherche                         | localisation                     | types                                 |
      | Consultation de médecine générale | 34 Rue Doudeauville, 75018 Paris | Médecin généraliste ;  Communauté Professionnelle Territoriale de Santé (CPTS)|

  Scenario Outline: Application du filtre Type via Tous les filtres en recherche Créneaux en sus
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    When il active le filtre Créneaux en sus
    When il applique les filtres via tous les filtres
      | Filtre | Valeur  |
      | Type   | <types> |
    Then tous les résultats ont un type appartenant à "<types>"
      | Filtre | Valeur    |
      | Type   | <valeurs> |
    Examples:
      | recherche                         | localisation                  | types                          | valeurs                        |
      | Consultation de médecine générale | 96 Rue Nationale, 59800 Lille | Centre de santé                | Centre de santé                |
      | ORL                               | Paris                         | Oto-Rhino-Laryngologue (O.R.L) | Oto-rhino-laryngologie (O.R.L) |



