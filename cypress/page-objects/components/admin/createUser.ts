export class CreateUser {
  fillEmail(email: string) {
    cy.get('input[data-drupal-selector="edit-mail"]').should("exist");
    cy.get('input[data-drupal-selector="edit-mail"]').should("be.visible");
    cy.get('input[data-drupal-selector="edit-mail"]').clear();
    cy.get('input[data-drupal-selector="edit-mail"]').type(email);
  }

  selectRole(role: string) {
    const roleIdMap = {
      "SAS - Régulateur-OSNP": "edit-role-change-sas-regulateur-osnp",
      "SU - IOA": "edit-role-change-sas-ioa",
      "SAS - Administrateur national":
        "edit-role-change-sas-administrateur-national",
      // ajoute d’autres rôles ici…
    };

    const checkboxId = roleIdMap[role];
    if (checkboxId) {
      cy.get(`#${checkboxId}`)
        .should("exist")
        .should("be.visible")
        .check({ force: true });
    } else {
      throw new Error(`Rôle inconnu: ${role}`);
    }
  }

  fillLastName(lastName: string) {
    cy.get('input[data-drupal-selector="edit-field-sas-nom-0-value"]').should(
      "exist",
    );
    cy.get('input[data-drupal-selector="edit-field-sas-nom-0-value"]').should(
      "be.visible",
    );
    cy.get('input[data-drupal-selector="edit-field-sas-nom-0-value"]').clear();
    cy.get('input[data-drupal-selector="edit-field-sas-nom-0-value"]').type(
      lastName,
    );
  }

  fillFirstName(firstName: string) {
    cy.get(
      'input[data-drupal-selector="edit-field-sas-prenom-0-value"]',
    ).should("exist");
    cy.get(
      'input[data-drupal-selector="edit-field-sas-prenom-0-value"]',
    ).should("be.visible");
    cy.get(
      'input[data-drupal-selector="edit-field-sas-prenom-0-value"]',
    ).clear();
    cy.get('input[data-drupal-selector="edit-field-sas-prenom-0-value"]').type(
      firstName,
    );
  }

  selectTerritory(territory: string, role: string) {
    const rolesWithTerritory = ["SAS - Régulateur-OSNP", "SU - IOA"];

    if (!rolesWithTerritory.includes(role)) {
      cy.log(`Le champ territoire n'est pas activé pour le rôle: ${role}`);
      return; // on sort de la fonction
    }

    cy.get("input.chosen-search-input").should("exist");
    cy.get("input.chosen-search-input").should("be.visible");
    cy.get("input.chosen-search-input").clear();
    cy.get("input.chosen-search-input").type(territory);

    cy.get("#edit-field-sas-territoire-chosen-search-results")
      .contains("li", territory)
      .click();
  }

  submit() {
    cy.get("#edit-submit").should("exist").should("be.visible").click();
  }

  verifySuccessMessage(
    expectedMessage = "Nouveau compte utilisateur. Un courriel d'activation de compte a été envoyé.",
  ) {
    cy.get(".messages__content")
      .should("exist")
      .should("be.visible")
      .and("contain.text", expectedMessage);
  }
}

export class ChangeUser {
  fillEmail(email: string) {
    cy.get('input[data-drupal-selector="edit-mail"]').should("exist");
    cy.get('input[data-drupal-selector="edit-mail"]').should("be.visible");
    cy.get('input[data-drupal-selector="edit-mail"]').clear();
    cy.get('input[data-drupal-selector="edit-mail"]').type(email);
  }
}
