@SAS-7900 @recherche @indisponibilité
Feature: Présence des disponibilités d'une structure en fonction de l'ajout d'indisponibilité programmée
  En tant que gestionnaire de structure du SAS
  Je veux programmer plusieurs indisponibilités
  Afin que les disponibilités de la structure lié ne remonte pas en page de résultats sur la durée des indisponibilités

  # RECHERCHE CRÉNEAUX DISPONIBLES
  Scenario: Absence des disponibilités du centre de santé à l’ajout d'indisponibilités programmées sur moins de 3 jours du calendrier lors d'une recherche Créneaux dispo
    Given l'ajout d'une indisponibilité programmée sur le centre de santé "9 Rue de la Chesnaie" de l'effecteur "Gestionnaire structure Indispo Programmée"
      | Date de début | Date de fin |
      | J+1           | J+4         |
    And l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le centre de santé 1 du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    Then les disponibilités de certains jours du calendrier du résultat "Centre Communal De Sante De Loudeac" à "9 Rue de la Chesnaie" sont absentes
      | J+1 |
      | J+2 |
    And les disponibilités de certains jours du calendrier du résultat "Centre Communal De Sante De Loudeac" à "9 Rue de la Chesnaie" sont présentes
      | J |

  # RECHERCHE CRÉNEAUX EN SUS
  Scenario: Absence des disponibilités d'un PFG à l’ajout d'indisponibilités programmées sur moins de 3 jours du calendrier lors d'une recherche Créneaux dispo
    Given l'ajout d'une indisponibilité programmée sur le PFG "Point fixe de Brest" de l'effecteur "Gestionnaire structure Indispo Programmée"
      | Date de début | Date de fin |
      | J             | J           |
    And l'utilisateur "IOA" sur la page ayant pour résultat le PFG 1 de l'association SOS Médecins 2 du gestionnaire de structure "Gestionnaire structure Indispo Programmée"
    When il active le filtre Créneaux en sus
    Then les disponibilités de certains jours du calendrier du résultat "Point fixe de Brest" à "" sont absentes
      | J |
    And les disponibilités de certains jours du calendrier du résultat "Point fixe de Brest" à "" sont présentes
      | J+1 |
      | J+2 |