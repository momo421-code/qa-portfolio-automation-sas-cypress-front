@SAS-8346 @prod @recherche @tri
Feature: Tri des résultats d'une recherche par adresse
  En tant qu'administrateur du SAS
  Je veux que les résultats d'une recherche par adresse soient triés par distance
  Afin que les résultats les plus proches de l'adresse de recherche sortent en premier

  Scenario Outline: Les résultats d'une recherche par adresse par créneaux disponibles sont triés par distance
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    Then tous les résultats sont triés par distance

    Examples:
      | recherche                         | localisation                        |
      # Résultat créé par l'agrégateur
      | Consultation de médecine générale | Rue de Fontarabie, 75020 Paris      |
      # Distance égale à 0
      | centre                            | 117 Rue Pierre Corneille 69003 Lyon |