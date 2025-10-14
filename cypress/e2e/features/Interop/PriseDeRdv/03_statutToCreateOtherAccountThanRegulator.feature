@SAS-9708 @Back-Office_aggrégateur @Back-Office_Drupal
Feature: Compte autre que régulateur

  En tant que administrateur du SAS
  Je veux que la création d’un compte autre que régulateur n’envoie aucune demande de création à l’éditeur  
  Afin que l’éditeur ne recoit aucune notifification qu’un nouveau compte autre que régulateur soit en attente de traitement

  Scenario: Non envoi de demande de création de compte chez l'éditeur à la création d'un compte autre que régulateur

    Given l'utilisateur "Régulateur Test auto" connecté
    When il accède au BO pour créer un compte
    And un compte utilisateur venant d'être créé
      | Courriel | adminnational@test.com           |
      | Rôle     | SAS - Administrateur national    |
      | Nom      | TNR                              |
      | Prénom   | Administrateur national RDV      |
    Then un message de confirmation de création est affiché
    
    Given l'aggrégateur connecté
    When il accède à la liste des comptes régulateurs
    Then le compte avec l'email "adminnational@test.com" n'est pas présent dans la liste des régulateurs 
