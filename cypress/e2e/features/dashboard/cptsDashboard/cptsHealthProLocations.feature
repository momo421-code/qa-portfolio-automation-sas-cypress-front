@SAS-9234 @dashboard @cpts
Feature: Affichage des lieux d'exercice d'un effecteur lié à une CPTS
  En tant que gestionnaire de structure du SAS d'une CPTS
  Je veux que les lieux d'exercice d'un effecteur lié soient visibles sur son dashboard
  Afin de pouvoir les éditer

  Scenario: Remontée des lieux d'exercices d'un PS CPTS non interfacé
    Given l'utilisateur "Gestionnaire de structure CPTS" connecté
    And le gestionnaire de structure sur le dashboard du PS "Effecteur cluster CPTS" via sa CPTS "Cpts nord 74"
    Then l'ensemble des lieux d'exercice de l'effecteur liés à la CPTS sont présents

  Scenario: Remontée des lieux d'exercices d'un PS CPTS interfacé
    Given l'utilisateur "Gestionnaire de structure CPTS" connecté
    And le gestionnaire de structure sur le dashboard du PS "Effecteur cluster CPTS interfacé" via sa CPTS "Cpts nord 74"
    Then l'ensemble des lieux d'exercice de l'effecteur liés à la CPTS sont présents