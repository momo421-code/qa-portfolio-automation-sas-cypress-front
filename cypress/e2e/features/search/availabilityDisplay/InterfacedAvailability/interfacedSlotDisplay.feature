@SAS-9112 @skip
Feature: Affichage des créneaux éditeurs en page de résultats
  En tant qu'effecteur ou gestionnaire de structure du SAS
  Je veux que l'ensemble des créneaux éditeurs soit affichés
  Afin que les régulateurs aient l'ensemble des horaires pour prendre rdv

  Scenario: Affichage de l'ensemble des créneaux éditeurs d'un PS individuel
    Given l'utilisateur "Effecteur affichage créneau éditeur" connecté
#    Then l'ensemble de ses créneaux éditeurs de son lieu d'exercice 1 sont présents sur son dashboard
#    And l'ensemble de ses créneaux éditeurs de son lieu d'exercice 1 sont présents en page de résultats via l'utilisateur "IOA"