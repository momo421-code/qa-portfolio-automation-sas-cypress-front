@SAS-8546 @recherche @filtre
Feature: Filtre Disponible sous
  En tant que régulateur du SAS
  Je veux filtrer les résultats de recherche par tranche horaire de disponibilité
  Afin de trouver un résultat qui correspond au mieux au besoin du patient

  Scenario Outline: Filtrer par disponibilité via le filtre Disponibilité sous
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    When il applique les valeurs "<valeurs>" du filtre "Disponible sous"
    Then tous les résultats ont au moins une disponibilité correspondante aux tranches horaires sélectionnées
    Examples:
      | recherche | localisation                   | valeurs       |
      | Centre    | Rue Berty Albrecht, 69008 Lyon | Sous 0h et 4h |
    @prod
    Examples:
      | recherche | localisation | valeurs                           |
      | Médecin   | Quimper      | Sous 12h et 24h ; Sous 24h et 48h |

  Scenario: Filtrer par disponibilité via Tous les filtres
    Given l'utilisateur "IOA" sur la page de résultats "Consultation de médecine générale" à "Rue Berty Albrecht, 69008 Lyon"
    When il applique les filtres via tous les filtres
      | Filtre          | Valeur              |
      | Type            | Médecin généraliste |
      | Disponible sous | Sous 4h et 8h       |
    Then tous les résultats ont au moins une disponibilité correspondante aux tranches horaires sélectionnées