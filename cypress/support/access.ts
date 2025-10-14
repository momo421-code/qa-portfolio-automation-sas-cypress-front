declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Navigate to a page with basic auth login and password,
       * and muting Tarte au citron panel.
       *
       * @param url - Url or url part to access
       */
      navigateTo(url: string): Chainable<JQuery>;
    }
  }
}

Cypress.Commands.add("navigateTo", (url: string): void => {
  cy.muteTarteAuCitron();
  cy.visit(url, { auth: Cypress.env("basic_auth"), failOnStatusCode: false });
});
