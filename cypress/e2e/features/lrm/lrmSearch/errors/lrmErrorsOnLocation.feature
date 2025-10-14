@SAS-8622 @recherche @lrm @prod
Feature: Erreurs LRM Localisation
  En tant qu'administrateur du SAS
  Je veux le régulateur SAS en lien avec le SAMU soit redirigé vers la page d'accueil lorsque que la localisation est incorrecte
  Afin qu'il ne voit pas de résultats erronés

  Scenario Outline: L'utilisateur est redirigé sur la page d'accueil lorsque la localisation est incorrecte dans l'URL LRM
    Given l'utilisateur "Régulateur OSNP" connecté
    When l'utilisateur accède à la recherche LRM avec les paramètres
      | name                  | value              |
      | origin                |                    |
      | practitioner          | <practitioner>     |
      | practitionerParamType | <practitionerType> |
      | specialty             | <specialty>        |
      | specialtyParamType    | <specialtyType>    |
      | streetnumber          | <streetnum>        |
      | streetname            | <streetname>       |
      | city                  | <city>             |
      | inseecode             | <inseeCode>        |
    When l'utilisateur retourne à l'accueil  
    Then l'utilisateur est redirigé vers la page d'accueil
    Examples:
      | practitioner                             | practitionerType | specialty                        | specialtyType | streetnum | streetname       | city           | inseeCode |
      # Code INSEE incorrect.
      | Elina Mary                               | name             |                                  |               | 61        | Avenue de l’Urss | 31400 Toulouse | 75001     |
      | 810102635587                             | rpps             |                                  |               |           |                  | Lyon           | 99999999  |
      # Absence d'adresse.
      | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | urn:oid:1.2.250.1.213.2.28\|SM54 | urn           |           |                  |                |           |