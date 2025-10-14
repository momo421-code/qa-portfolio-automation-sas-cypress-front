@SAS-8624 @recherche @lrm @prod
Feature: Erreurs LRM SAMU
  En tant que régulateur SAS en lien avec le SAMU,
  Je veux avoir un message d'erreur SAMU, lorsque que le paramètre SAMU est incorrect

  Scenario Outline: Lorsque le nom du SAMU est vide, l'utilisateur est redirigé sur la page de recherche avec un message d'erreur
    # NB. si le paramètre origin est manquant, alors on se trouve dans une recherche classique
    Given l'utilisateur "Régulateur OSNP" connecté
    When l'utilisateur accède à la recherche LRM avec les paramètres et le paramètre origine erroné ou vide
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
    Then la page de résultats s'affiche avec un message d'erreur SAMU
    Examples:
      | practitioner                             | practitionerType | specialty                         | specialtyType | streetnum | streetname       | city           | inseeCode |
      | Cécile Ung                               | name             | Cécile Ung                        |               |           |                  | Paris          |           |
      | 810102635587                             | rpps             |                                   |               |           |                  | Lyon           |           |
      | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | urn:oid:1.2.250.1.213.2.28\|SM54  | urn           |           |                  |                | 69383     |
      | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | Consultation de médecine générale |               |           |                  |                | 75101     |
      | Elina Mary                               | name             |                                   |               | 61        | Avenue de l’Urss | 31400 Toulouse |           |

  Scenario Outline: Lorsque le nom du SAMU est incorrect, l'utilisateur est redirigé sur la page de recherche avec un message d'erreur
    # NB. si le paramètre origin est manquant, alors on se trouve dans une recherche classique
    Given l'utilisateur "Régulateur OSNP" connecté
    When l'utilisateur accède à la recherche LRM avec les paramètres et le paramètre origine erroné ou vide
      | name                  | value              |
      | origin                | <origin>           |
      | practitioner          | <practitioner>     |
      | practitionerParamType | <practitionerType> |
      | specialty             | <specialty>        |
      | specialtyParamType    | <specialtyType>    |
      | streetnumber          | <streetnum>        |
      | streetname            | <streetname>       |
      | city                  | <city>             |
      | inseecode             | <inseeCode>        |
    Then la page de résultats s'affiche avec un message d'erreur SAMU
    Examples:
      | origin       | practitioner                             | practitionerType | specialty                         | specialtyType | streetnum | streetname | city  | inseeCode |
      | SAMU_INCONNU | Cécile Ung                               | name             | Cécile Ung                        |               |           |            | Paris |           |
      | SAMU_INCONNU | 810102635587                             | rpps             |                                   |               |           |            | Lyon  |           |
      | &&&&&&       | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | urn:oid:1.2.250.1.213.2.28\|SM54  | urn           |           |            |       | 69383     |
      | --------     | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | Consultation de médecine générale |               |           |            |       | 75101     |