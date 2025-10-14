@SAS-9707 @Back-Office_aggrégateur @Back-Office_Drupal
Feature: Ajout du rôle régulateur

  En tant qu’administrateur du SAS  
  Je veux qu’un compte utilisateur ayant reçu le rôle de régulateur soit marqué comme "envoyé chez l’éditeur"  
  Afin que l’éditeur prenne en compte la création du régulateur

  Scenario: Le statut du compte régulateur passe à "envoyé chez l’éditeur" après ajout du rôle régulateur
    Given l'utilisateur "Régulateur Test auto" connecté
    When il accède au BO pour créer un compte
    And un compte utilisateur venant d'être créé
      | Courriel | qa.service.sa@gmail.com                |
      | Rôle     | SAS - Administrateur national          |
      | Nom      | TNR                                    |
      | Prénom   | Administrateur national                |
    Then un message de confirmation de création est affiché

    When il accède au BO pour modifier un compte
    And un compte utilisateur venant d'être modifié
      | Courriel   | qa.service.sa@gmail.com                  |
      | Rôle       | Régulateur-OSNP                          |
      | Nom        | TNR ajout role régulateur                | 
      | Territoire | SAS-75 Paris                             |
      | Prénom     | Administrateur national-Régulateur RDV   |
    Given l'aggrégateur connecté
    When il accède à la liste des comptes régulateurs
    Then le compte avec l'email "<email>" est visible avec le statut "Créer chez l'éditeur"

  Examples:
    | email                       | rôle                  | nom                       | prénom                                  | territoire             |
    | qa.service.sa@gmail.com     | SAS - Régulateur-OSNP | TNR ajout role régulateur | Administrateur national-Régulateur RDV | SAS-75 Paris            |
      
