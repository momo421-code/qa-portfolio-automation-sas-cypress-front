@SAS-9709 @Back-Office_aggrégateur @Back-Office_Drupal
Feature: Passe à modifier après suppression du role régulateur

  En tant qu’administrateur du SAS  
  Je veux qu’un compte utilisateur ayant reçu le rôle de régulateur soit marqué comme "Desactivé chez l’éditeur"  
  Afin que l’éditeur prenne en compte la suppression du role régulateur

  Scenario: Le statut du compte régulateur passe à "Desactivé chez l’éditeur" après suppression du role régulateur

Given l'utilisateur "Régulateur Test auto" connecté
When il accède au BO pour modifier un compte
And un compte utilisateur venant d'être modifié
      | Courriel   | qa.service.sa@gmail.com                                    |
      | Rôle       | SAS - Administrateur national , !Régulateur-OSNP           |
      | Nom        | TNR suppression role régulateur                            | 
      
      | Prénom     | Administrateur national                                    |
Then un message de confirmation de modification est affiché

Given l'aggrégateur connecté
When il accède à la liste des comptes régulateurs
Then le compte avec l'email "<email>" est visible avec le statut "Désactivé chez l'éditeur"

  Examples:
    | email                       | 
    | qa.service.sa@gmail.com     | 