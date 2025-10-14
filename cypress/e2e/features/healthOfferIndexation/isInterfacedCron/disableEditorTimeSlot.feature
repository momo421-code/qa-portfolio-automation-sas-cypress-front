@SAS-8763 @disponibilité @créneauEditeur
Feature: Activation des créneaux éditeurs
  En tant que régulateur du SAS
  Je veux pouvoir désactiver l'affichage de mes créneaux éditeurs
  Afin d'afficher mes disponibilités SAS

  Background:
    Given l'utilisateur "Effecteur créneau éditeur" connecté
    And les paramètres SAS effecteur par défaut

  Scenario: Les créneaux SAS d'un professionnel de santé ne s'affichent pas si acceptation d'affichage des créneaux éditeurs
    Then les créneaux éditeurs ne sont pas visibles sur son lieu d'exercice 1 en page de résultats via le régulateur "Régulateur OSNP"

  Scenario: Les disponibilités d'un professionnel de santé s'affichent si refus d'affichage des créneaux éditeurs
    When l'effecteur met à jour ses paramètres SAS
      | Participation au SAS | à titre individuel |
      | Solution éditeur     | Non                |
    Then les disponibilités SAS sont visibles sur son lieu d'exercice 1 en page de résultats via le régulateur "IOA"