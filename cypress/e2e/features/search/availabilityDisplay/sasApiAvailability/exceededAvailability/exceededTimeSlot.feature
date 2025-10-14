@SAS-8151 @prod @recherche @disponibilité @créneau
Feature: Heure de début des créneaux dépassée
  En tant qu'administrateur du SAS
  Je veux que les créneaux dont l'heure de début est dépassée n'apparaissent plus en page de résultat
  Afin que les régulateurs ne voient pas de créneaux non pertinents

  Scenario Outline: Les créneaux dont l'heure de début est dépassée n'apparaissent plus
    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "<recherche>" à "<localisation>"
    Then les créneaux horaires du jour actuel n'ont pas leur heure de début dépassée
    Examples:
      | recherche                         | localisation                                   |
      | Consultation de médecine générale | 5 b Quai de la République, 94410 Saint-Maurice |
      | Centre                            | Paris                                          |
