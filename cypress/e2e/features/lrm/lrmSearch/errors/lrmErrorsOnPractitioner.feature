@SAS-8623 @recherche @lrm @prod
Feature: Erreurs LRM Praticien
  En tant que régulateur SAS en lien avec le SAMU,
  Je veux qu'aucun résultat médecin traitant ne soit affiché lorsque le practitioner LRM est incorrect

  Background:
    Given l'utilisateur "Régulateur OSNP" connecté


  Scenario Outline: Lorsque le practitioner n'est pas reconnu, aucun résultat MT n'est retourné et un message d'erreur s'affiche
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
    Then uniquement des résultats de recherche hors LRM sont présents
    Then le message de médecin traitant non trouvé est présent
    Examples:
      | practitioner                                | practitionerType | specialty                         | specialtyType | streetnum | streetname       | city           | inseeCode |
      | Unknown Preferred Doctor                    | name             | Consultation de médecine générale | name          |           |                  | Paris          |           |
      | urn:oid:1.2.250.1.71.4.2.9999\|810001233500 | any              | urn:oid:1.2.250.1.213.2.28\|SM54  | urn           |           |                  |                | 69383     |
      | Pierre                                      | name             |                                   |               | 61        | Avenue de l’Urss | 31400 Toulouse |           |
      | 012345689                                   | urn              | Consultation de médecine générale | name          |           |                  | Paris          |           |

  Scenario Outline: Lorsque le practitioner n'est pas renseigné, aucun résultat MT n'est retourné et un message d'erreur s'affiche
    When l'utilisateur accède à la recherche LRM avec les paramètres
      | name                  | value              |
      | origin                |                    |
      | practitioner          |                    |
      | practitionerParamType | <practitionerType> |
      | specialty             | <specialty>        |
      | specialtyParamType    | <specialtyType>    |
      | streetnumber          | <streetnum>        |
      | streetname            | <streetname>       |
      | city                  | <city>             |
      | inseecode             | <inseeCode>        |
    Then uniquement des résultats de recherche hors LRM sont présents
    Examples:
      | practitionerType | specialty                         | specialtyType | streetnum | streetname       | city           | inseeCode |
      | name             | Consultation de médecine générale | name          |           |                  | Paris          |           |
      | rpps             |                                   |               |           |                  | Lyon           |           |
      | any              | urn:oid:1.2.250.1.213.2.28\|SM54  | urn           |           |                  |                | 69383     |
      | name             |                                   |               | 61        | Avenue de l’Urss | 31400 Toulouse |           |