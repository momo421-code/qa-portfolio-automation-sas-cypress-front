@SAS-9111 @recherche @affichageDispo @créneauEditeur
Feature: Orientation éditeur
  En tant que régulateur du SAS
  Je veux être redirigé vers le site de l'éditeur de l'offre de soin à partir de ses créneaux
  Afin d'orienter un patient

  Scenario: Le créneau interfacé a un lien vers l'éditeur d'un PS individuel
    Given l'utilisateur "Régulateur OSNP" connecté
    And l'utilisateur sur la page de résultats remontant le lieu d'exercice 1 du PS individuel interfacé "PS 3 Lieux Consultation"
    Then le premier créneau éditeur de ce résultat a un lien vers l'éditeur et l'origine attendus

  Scenario: Le créneau interfacé a un lien vers l'éditeur d'un point fixe d'une association SOS Médecins
    Given l'utilisateur "IOA" connecté
    And l'utilisateur sur la page de résultats remontant le point fixe "Cabinet médical SOS Médecins" de l'association SOS Médecins interfacée "SOS Médecins Montpellier"
    Then le premier créneau éditeur de ce résultat a un lien vers l'éditeur et l'origine attendus