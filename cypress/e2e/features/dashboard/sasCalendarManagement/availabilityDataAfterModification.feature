@SAS-8572 @editionDispo
Feature: Informations des disponibilités en page d'édition après modification
  En tant qu'effecteur ou gestionnaire de structure ou délégataire
  Je veux que mes disponibilités avec les soient affichées en page d'édition après modification
  Afin d'avoir mes disponibilités à jour

    @ps @plage
    Scenario: Une plage horaire est affichée en page d'édition après sa modification avec les informations saisies
      Given l'utilisateur "Effecteur Dispo SAS" connecté
      And l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice 2
      When il modifie une disponibilité nouvellement créée sans doublon
        | Donnée                              | Valeur                                     |
        | Date                                | J+7                                        |
        | Heure de début                      | 10h00                                      |
        | Heure de début modifiée             | 10h30                                      |
        | Heure de fin                        | 12h00                                      |
        | Type de disponibilité               | Plage                                      |
        | Nombre de patients                  | 4                                          |
        | Nombre de patients modifié          | 3                                          |
        | Modalités de consultation           | Consultation en cabinet                    |
        | Modalités de consultation modifiées | Consultation en cabinet ; Téléconsultation |
      Then la disponibilité est modifiée avec les informations attendues

    @structure @créneau
    Scenario: Un créneau horaire est affiché en page d'édition après sa modification avec les informations saisies
      Given l'utilisateur "Gestionnaire de structure Dispo SAS" connecté
      And le gestionnaire de structure sur la page d'édition des disponibilités du PFG 1 de son association SOS Médecins 1
      When il modifie une disponibilité nouvellement créée sans doublon
        | Donnée                        | Valeur                  |
        | Date                          | J+1                     |
        | Heure de début                | 17h00                   |
        | Heure de fin                  | 18h00                   |
        | Heure de fin modifiée         | 20h00                   |
        | Type de disponibilité         | Créneau                 |
        | Type de disponibilité modifié | Plage                   |
        | Nombre de patients modifié    | 6                       |
        | Modalités de consultation     | Consultation en cabinet |
      Then la disponibilité est modifiée avec les informations attendues