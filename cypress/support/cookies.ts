declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mute tarteaucitron panel by adding tarteaucitron cookie with value of all refused cookies.
       */
      muteTarteAuCitron(): Chainable<JQuery>;
    }
  }
}

Cypress.Commands.add("muteTarteAuCitron", (): void => {
  const cookieName: string = "tarteaucitron";
  cy.clearCookie(cookieName);
  cy.setCookie(cookieName, Cypress.env("cookies"));
});
