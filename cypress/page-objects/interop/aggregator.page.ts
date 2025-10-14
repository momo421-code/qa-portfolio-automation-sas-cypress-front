// cypress/page-objects/interop/aggregator.page.ts

export class AggregatorPage {
  visit() {
    const env = Cypress.env("environment"); // "int", "preprod", "rui1"
    const url = Cypress.env(env).aggregAdminUrl;
    cy.visit(url);
  }

  fillEmail(email: string) {
    cy.get("#inputEmail").clear();
    cy.get("#inputEmail").type(email);
  }

  fillPassword(password: string) {
    cy.get("#inputPassword").clear();
    cy.get("#inputPassword").type(password, { log: false });
  }

  submitLogin() {
    cy.contains("button", "Sign in").should("be.visible").click();
  }

  loginAs(userKey: string = "aggregatorAdmin") {
    const env = Cypress.env("environment");
    const user = Cypress.env(env).users[userKey];
    if (!user) throw new Error(`User ${userKey} not found in env ${env}`);

    this.visit();
    this.fillEmail(user.email);
    this.fillPassword(user.password);
    this.submitLogin();
  }

  goToRegulatorList() {
    cy.get("a.menu-item-contents").contains("Gestion des régulateurs").click();
  }

  verifyStatusInFiche(expectedStatus: string) {
    cy.get('[data-test="status-compte"]')
      .should("exist")
      .and("contain.text", expectedStatus);
  }

  verifyAccountStatus(email: string, statut: string) {
    cy.get("table")
      .contains("td", email)
      .parents("tr")
      .within(() => {
        cy.get("span.badge").each(($badge) => {
          cy.wrap($badge).should("have.text", statut);
        });
      });
  }

  verifyAccountModified(
    email: string,
    expectedLastName?: string,
    expectedFirstName?: string,
  ) {
    // 1. Clique sur le lien de l'email dans la liste des régulateurs
    cy.contains("a", email).click();

    // 2. Vérifie que la page de détail affiche "Date de dernière modification"
    cy.get(".field-group.field-datetime .field-label div").should(
      "contain.text",
      "Date de dernière modification",
    );

    // 3. Vérifie que la date de modification existe et est visible
    cy.get(".field-group.field-datetime .field-value time")
      .should("exist")
      .and("be.visible")
      .invoke("attr", "datetime")
      .then((datetimeAttr) => {
        cy.log("Dernière modification : " + datetimeAttr);
        // Vérifie juste le format ISO
        expect(datetimeAttr).to.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });

    // 4. Vérifie que le Nom modifié contient la valeur attendue

    // Nom (premier span[title] de field-value)
    // Nom (deuxième span[title])
    cy.get("div.field-value span[title]")
      .eq(1) // index 1 = deuxième élément
      .invoke("attr", "title")
      .should("contain", expectedLastName);

    // Prénom (troisième span[title])
    cy.get("div.field-value span[title]")
      .eq(2) // index 2 = troisième élément
      .invoke("attr", "title")
      .should("contain", expectedFirstName);
  }
  verifyAccountNotPresent(email: string) {
    cy.get("table").contains("td", email).should("not.exist"); // Vérifie que le td avec l'email n'existe pas
  }
}
