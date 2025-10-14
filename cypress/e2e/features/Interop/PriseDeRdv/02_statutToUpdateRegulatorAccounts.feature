@SAS-9705 @Back-Office_aggrégateur @Back-Office_Drupal
Feature: Statut à mettre à jour des comptes régulateurs

  En tant qu’administrateur du SAS  
  Je veux que le statut du compte régulateur passe à "Envoyé chez l’éditeur" après modification  
  Afin que l’éditeur soit notifié de la mise à jour du compte

  Scenario Outline: Modification et vérification du statut du compte régulateur
    Given l'utilisateur "Régulateur Test auto" connecté
    When il accède au BO pour modifier un compte
    And un compte utilisateur venant d'être modifié
      | Courriel   | <email> |
      | Nom        | <nom>   |
      | Prénom     | <prénom>|
    Then un message de confirmation de modification est affiché
    Given l'aggrégateur connecté
    When il accède à la liste des comptes régulateurs
    Then le compte avec l'email "<email>" a bien été modifié coté aggrégateur

  Examples:
    | email                  | nom | prénom        |
    | tnr.regul1@test.com    | TNR | IOA  [heure]  |
    | tnr.ioa1@test.com      | TNR | Régul [heure] |
