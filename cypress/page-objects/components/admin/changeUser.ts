// changeUser.ts (POM)
export const changeUser = {
  fillEmail(email: string) {
    cy.get('input[data-drupal-selector="edit-mail"]', { timeout: 10000 });
    cy.get('input[data-drupal-selector="edit-mail"]').should("be.visible");
    cy.get('input[data-drupal-selector="edit-mail"]').clear();
    cy.get('input[data-drupal-selector="edit-mail"]').type(email);
  },

  clickFilterButton() {
    cy.get('input[data-drupal-selector="edit-submit-sas-userlist"]', {
      timeout: 10000,
    })
      .should("be.visible")
      .click();
  },

  clickEditLink(email: string) {
    const encodedEmail = encodeURIComponent(encodeURIComponent(email));
    cy.get("li.sas-edit.dropbutton__item.dropbutton-action a", {
      timeout: 15000,
    })
      .should("exist")
      .filter(`[href*="mail%3D${encodedEmail}"]`)
      .first()
      .click();
  },

  fillRole(role?: string) {
    if (!role) return;

    const roles = role.split(",").map((r) => r.trim());
    roles.forEach((r) => {
      let action = "check"; // par défaut on coche
      let roleName = r;

      // Si le rôle commence par "!", on le décoche
      if (r.startsWith("!")) {
        action = "uncheck";
        roleName = r.substring(1).trim();
      }

      switch (roleName) {
        case "Administrateur national":
          cy.get(
            '[id="edit-role-change-sas-admin-nat"], [name="role_change[sas_admin_nat]"]',
            { timeout: 10000 },
          )[action]({ force: true });
          break;

        case "Régulateur-OSNP":
          cy.get(
            '[data-drupal-selector="edit-role-change-sas-regulateur-osnp"]',
            { timeout: 10000 },
          )[action]({ force: true });
          break;

        default:
          cy.log(`Rôle non géré : ${roleName}`);
      }
    });
  },

  fillLastName(nom?: string) {
    if (!nom) return;

    const selector = 'input[data-drupal-selector^="edit-field-sas-nom"]';

    cy.get(selector, { timeout: 10000 });
    cy.get(selector).should("be.visible");
    cy.get(selector).clear();
    cy.get(selector).type(nom);
  },

  fillFirstName(prenom?: string) {
    if (!prenom) return;
    cy.get('input[data-drupal-selector^="edit-field-sas-prenom"]', {
      timeout: 10000,
    });
    cy.get('input[data-drupal-selector^="edit-field-sas-prenom"]').clear();
    cy.get('input[data-drupal-selector^="edit-field-sas-prenom"]').type(prenom);
  },

  selectTerritory(territoire?: string) {
    if (!territoire) return;
    cy.get('select[data-drupal-selector^="edit-field-sas-territoire"]', {
      timeout: 5000,
    }).then(($el) => {
      if ($el.length) cy.wrap($el).select(territoire, { force: true });
      else cy.log("Champ Territoire absent pour ce compte");
    });
  },

  submitForm() {
    cy.get('input[data-drupal-selector="edit-submit"]', { timeout: 10000 })
      .should("be.visible")
      .click();
  },

  verifySuccessMessage(
    expectedMessage = "Les changements ont été enregistrés.",
  ) {
    cy.get(".messages__content")
      .should("exist")
      .should("be.visible")
      .and("contain.text", expectedMessage);
  },

  verifySuccessDeletion() {
    cy.get(".messages__content")
      .should("exist")
      .should("be.visible")
      .invoke("text")
      .then((txt) => {
        expect(txt.trim()).to.match(/Le compte .* a été supprimé\./);
      });
  },
};
