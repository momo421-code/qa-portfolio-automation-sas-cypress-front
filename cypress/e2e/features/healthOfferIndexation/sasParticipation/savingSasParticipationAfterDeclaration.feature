Feature: Sauvegarde et affichage des paramètres SAS effecteur

  Scenario: Sauvegarde des paramètres SAS effecteur via association SOS Médecins
    Given l'utilisateur "Effecteur SOS Médecins" connecté
    And les paramètres SAS effecteur par défaut
    And l'effecteur est sur son dashboard
    When il met à jour les paramètres SAS effecteur
      | Participation au SAS     | via mon association SOS Médecins ou mon association de visites à domicile |
      | Association SOS Médecins | SOS Médecins Pau                                                          |
    Then les paramètres SAS effecteur ont les informations attendues

  Scenario: Vérification de la présence du PS participant au SAS sur le dashboard du gestionnaire de structure
    Given l'utilisateur "Gestionnaire de structure SOS" connecté
    Then le PS participant au SAS est présent sur la liste du dashboard de son gestionnaire de structure
      | Nom              |
      | Dr Mounier Lisa  |
