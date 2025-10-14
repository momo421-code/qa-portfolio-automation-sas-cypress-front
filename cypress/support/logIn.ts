import { HomePage } from "../page-objects/pages/home.page";
import { LoginPage } from "../page-objects/pages/login.page";
import { LoginPanel } from "../page-objects/panels/login.panel";
import { accountFixtureUtils } from "./utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";

const homePage: HomePage = new HomePage();
const loginPage: LoginPage = new LoginPage();

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Access to login page by HMI and log in.
       *
       * @param userAlias - user login to connect
       */
      logIn(userAlias: string): Chainable<JQuery>;

      /**
       * Navigate to home page then log in by HMI.
       * Keep session cookies from log in between tests.
       *
       * @param username - Name given to the user account
       * @param username - user login to connect
       */
      logInWithSession(username: string): Chainable<JQuery>;
    }
  }
}

Cypress.Commands.add("logIn", (userAlias: string): void => {
  homePage.navigateTo();
  LoginPanel.accessToLoginPage();

  loginPage.logIn(accountFixtureUtils.getUserLogin(userAlias));
});

Cypress.Commands.add("logInWithSession", (userAlias: string): void => {
  cy.session(
    [userAlias],
    (): void => {
      homePage.navigateTo();
      cy.logIn(userAlias);
    },
    {
      cacheAcrossSpecs: true,
    },
  );
});
