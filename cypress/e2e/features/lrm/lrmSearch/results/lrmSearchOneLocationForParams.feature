@SAS-8627 @recherche @lrm @prod
  # Does not require fixture file usage
Feature: Recherche LRM - Localisation
  En tant que régulateur SAS en lien avec le SAMU
  je souhaite voir les lieux d'exercice du médecin traitant indiqué
  afin de vérifier que les résultats affichés soient conformes

  Scenario Outline: Au moins une CARD de Médecin Traitant est présente dans la recherche LRM suivant les combinaisons de paramètres
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
    Examples:
      | practitioner                             | practitionerType | specialty                         | specialtyType | streetnum | streetname       | city           | inseeCode |
      | Cécile Ung                               | name             | Cécile Ung                        |               |           |                  | Paris          |           |
      # Pascale Lugrezi qa.servicesas+effecteur-cpts@gmail.com
      | 810102635587                             | rpps             |                                   |               |           |                  | Lyon           |           |
      # Nathalie Coulon qa.servicesas+effecteur-individuel@gmail.com
      | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | urn:oid:1.2.250.1.213.2.28\|SM54  | urn           |           |                  |                | 69383     |
      | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | Consultation de médecine générale |               |           |                  |                | 75101     |
      | Elina Mary                               | name             |                                   |               | 61        | Avenue de l’Urss | 31400 Toulouse |           |
      | Elina Mary                               | name             | XXXXXXXX                          | name          | 21        | Avenue Georges Pompidou | 69003 Lyon | 69100  |
      | urn:oid:1.2.250.1.71.4.2.1\|810001233500 | urn              | urn:oid:1.2.250.1.213.2.28\|XXXX  | any           |           |                  |                | 69383     |

# Si specialty URN commence par urn:oid:1.2.250.1.213.2.28|SM mais que le code n'est pas reconnu, alors c'est CMG qui est proposé
  # Si specialty URN commence par urn:oid:1.2.250.1.213.2.28|XXXXX, alors aucune specialité n'est proposée
  # Si specialty URN = XXXX, alors c'est valeur est cherchée

