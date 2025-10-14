 @sas-9706 @Back-Office_aggrégateur @Back-Office_Drupal
Feature: Statut désactivé des comptes régulateurs


  En tant qu’administrateur du SAS  
  Je veux que le statut du compte régulateur passe à "Desactivé chez l’éditeur" suppression 
  Afin que l’éditeur soit notifié de la mise à jour du compte

  Scenario Outline: Suppression et vérification du statut du compte régulateur
  Given l'utilisateur "Régulateur Test auto" connecté
  When il accède au BO pour modifier un compte
  And un compte utilisateur "<email>" venant d'être supprimé
  
  Then un message de confirmation de suppression est affiché
  Given l'aggrégateur connecté
  When il accède à la liste des comptes régulateurs
  Then le compte avec l'email "<email>" est visible avec le statut "Désactivé chez l'éditeur"

Examples:
  | email                        |
  | tnr.regul1@test.com          |
  | tnr.ioa1@test.com            |
  | qa.service.sa@gmail.com      |
  