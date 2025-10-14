@SAS-7899 @recherche @indisponibilité
Feature: Présence des disponibilités d'un lieu d'exercice en fonction de l'ajout d'indisponibilité programmée
  En tant qu'effecteur du SAS
  Je veux programmer plusieurs indisponibilités
  Afin que les disponibilités du lieu d'exercice lié ne remonte pas en page de résultats sur la durée des indisponibilités

  # RECHERCHE CRÉNEAUX DISPONIBLES
  # TODO: Ajouter une vérification pour l'indisponibilité à durée indéterminée
  Scenario: Absence des disponibilités du lieu d’exercice à l’ajout d'indisponibilités programmées sur moins de 3 jours du calendrier lors d'une recherche Créneaux dispo
    Given l'ajout d'une indisponibilité programmée sur le lieu d'exercice "Rue du Rhone" de l'effecteur "Effecteur Indisponibilité Programmée"
      | Date de début | Date de fin |
      | J             | J           |
      | J+2           | J+4         |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 3 de l'effecteur "Effecteur Indisponibilité Programmée"
    Then les disponibilités de certains jours du calendrier du résultat "Hage Hassan" à "Rue du Rhone" sont absentes
      | J   |
      | J+2 |
    And les disponibilités de certains jours du calendrier du résultat "Hage Hassan" à "Rue du Rhone" sont présentes
      | J+1 |

  # RECHERCHE CRÉNEAUX EN SUS
  Scenario: Absence des disponibilités du lieu d’exercice à l’ajout d'indisponibilités programmées sur moins de 3 jours du calendrier lors d'une recherche Créneaux dispo
    Given l'ajout d'une indisponibilité programmée sur le lieu d'exercice "Rue du Rhone" de l'effecteur "Effecteur Indisponibilité Programmée"
      | Date de début | Date de fin |
      | J+2           | J+2         |
    And l'utilisateur "IOA" sur la page ayant pour résultat le lieu d'exercice 3 de l'effecteur "Effecteur Indisponibilité Programmée"
    When il active le filtre Créneaux en sus
    Then les disponibilités de certains jours du calendrier du résultat "Hage Hassan" à "Rue du Rhone" sont absentes
      | J+2 |
    And les disponibilités de certains jours du calendrier du résultat "Hage Hassan" à "Rue du Rhone" sont présentes
      | J   |
      | J+1 |