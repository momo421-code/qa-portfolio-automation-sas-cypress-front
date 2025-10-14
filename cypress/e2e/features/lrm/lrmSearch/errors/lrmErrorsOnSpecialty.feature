@SAS-8625 @recherche @lrm @prod
Feature: Erreurs LRM Spécialité
  En tant que régulateur SAS en lien avec le SAMU,
  Je veux qu'aucun résultat de recherche ne soit présent lorsque la spécialité n'est pas reconnue

  Scenario Outline: Lorsque la spécialité n'est pas reconnue ni remplacée par Consultation de médecine générale,
  les résultats MT sont affichés, mais aucun résultat de recherche n'est présent
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
    Then au moins une card de médecin traitant est présente dans la liste des résultats
    Then aucun résultat de recherche hors LRM n'est présent
    Examples:
      | practitioner                             | practitionerType | specialty                  | specialtyType | streetnum | streetname       | city           | inseeCode |
      | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | Spécialité Inconnue        | name          |           |                  |                | 75101     |
      | Elina Mary                               | name             | urn:oid:1.2.250.1.213.2.28 | any           | 61        | Avenue de l’Urss | 31400 Toulouse |           |
