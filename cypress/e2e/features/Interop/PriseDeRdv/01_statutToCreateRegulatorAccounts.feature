@SAS-9704 @Back-Office_aggrégateur @Back-Office_Drupal
Feature: Statut A créer des comptes régulateurs

  En tant qu'administrateur du SAS  
  Je veux que le statut du compte régulateur passe à "Créer chez l'éditeur" après la création d’un compte régulateur  
  Afin que l’éditeur soit notifié qu’un nouveau compte régulateur est en attente de traitement

  Scenario Outline: Création et vérification d'un compte régulateur avec différents rôles et territoires
    Given l'utilisateur "Régulateur Test auto" connecté
    When il accède au BO pour créer un compte
    And un compte utilisateur venant d'être créé
      | Courriel   | <email>      |
      | Rôle       | <rôle>       |
      | Nom        | <nom>        |
      | Prénom     | <prénom>     |
      | Territoire | <territoire> |
    Then un message de confirmation de création est affiché
   
    Given l'aggrégateur connecté
    When il accède à la liste des comptes régulateurs
    Then le compte avec l'email "<email>" est visible avec le statut "Créer chez l'éditeur"

  Examples:
    | email                       | rôle                  | nom | prénom             | territoire             |
    | tnr.regul1@test.com         | SAS - Régulateur-OSNP | TNR | Régulateur OSNP RDV | SAS-75 Paris           |
    | tnr.ioa1@test.com           | SU - IOA              | TNR | IOA RDV             | SAS-06 Alpes-Maritimes |





