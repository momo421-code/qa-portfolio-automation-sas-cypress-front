#@prod @recherche @pagination
#Feature: Présence de résultats aux pages suivantes après rechargement des résultats suivants
#
#  Scenario: Présence de résultats à la page suivante après rechargement des résultats suivants
#    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "Médecin généraliste" à "37 Rue Charcot, 75013 Paris"
#    When il navigue dans les résultats jusqu'à la dernière page
#    And il navigue dans les résultats à la page suivante
#    Then au moins un résultat est présent
#
#  Scenario: Présence de résultats à la dernière page après rechargement des résultats suivants
#    Given l'utilisateur "Régulateur OSNP" sur la page de résultats "Consultation de médecine générale" à "Lyon"
#    When il navigue dans les résultats jusqu'à la dernière page
#    And il navigue dans les résultats jusqu'à la dernière page
#    Then au moins un résultat est présent