@SAS-8687 @recherche @orientation
Feature: Enregistrer une orientation surnuméraire avec des paramètres horaires incorrects
  En tant que régulateur du SAS
  Je souhaite ne pas pouvoir orienter un patient avec des paramètres horaires incorrects
  Afin d'éviter une incohérence lors de l'orientation surnuméraire

  Background:
    Given l'utilisateur "Régulateur OSNP" sur la page ayant pour résultat le lieu d'exercice 1 de l'effecteur "Effecteur Individuel"
    When il active le filtre Créneaux en sus

  Scenario: Impossibilité d'orienter un patient de façon surnuméraire si la date n'est pas renseignée
    When il oriente un patient de façon surnuméraire sans renseigner de date
    Then l'orientation ne peut pas être enregistrée sans date

  Scenario: Impossibilité d'orienter un patient de façon surnuméraire sur un horaire passé de la date du jour
    And il oriente un patient de façon surnuméraire à la date du jour sans renseigner d'horaire
    Then l'orientation ne peut pas être enregistrée
    And il ne peut pas renseigner un horaire passé