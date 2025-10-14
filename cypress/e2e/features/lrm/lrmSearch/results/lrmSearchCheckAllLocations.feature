@SAS-8626 @recherche @lrm
  # Requires fixture usage as helper for search and expected results
Feature: Recherche LRM - Voir tous les lieux d'exercice
  En tant que régulateur SAS en lien avec le SAMU
  Je souhaite voir tous les lieux d'exercice du médecin traitant indiqué
  afin de vérifier que les résultats affichés soient conformes

  Scenario Outline: Toutes les CARDs de Médecin Traitant sont présentes dans la recherche LRM
    Given l'utilisateur "Régulateur OSNP" connecté
    When l'utilisateur accède à la recherche LRM du médecin traitant ayant pour alias <alias>
      | name               | value           |
      | specialty          | <specialty>     |
      | specialtyParamType | <specialtyType> |
      | streetnumber       | <streetnum>     |
      | streetname         | <streetname>    |
      | city               | <city>          |
      | inseecode          | <inseeCode>     |
    Then tous les lieux d'exercice du médecin traitant sont présents dans la liste de résultats
    Examples:
      | alias                            | specialty                         | specialtyType | streetnum | streetname              | city       | inseeCode |
      | Effecteur SOS Médecins           | urn:oid:1.2.250.1.213.2.28\|SM54  | urn           |           |                         | Paris      |           |
      | Effecteur LRM 5 lieux            | Consultation de médecine générale | name          |           | avenue de la République | Lyon       |           |
      | Effecteur Dispo SAS              | XXXXXXXX                          | name          |           |                         | Paris      |           |
      | Effecteur Indisponibilité        |                                   |               |           |                         |            | 69388     |
      | Effecteur conventionné Secteur 2 |                                   |               | 21        | avenue Georges Pompidou | 69003 Lyon |           |
      | Effecteur MSP                    | cardiologue                       | name          |           |                         | Marseille  |           |
      | Effecteur CPTS                   |                                   | any           |           |                         | 69003 Lyon |           |