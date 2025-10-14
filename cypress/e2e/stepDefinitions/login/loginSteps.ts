import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPanel } from "../../../page-objects/panels/login.panel";
import { LoginPage } from "../../../page-objects/pages/login.page";
import { accountFixtureUtils } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";

const loginPage: LoginPage = new LoginPage();

//region LOG IN
When("il se connecte en tant que {string}", (userAlias: string): void => {
  LoginPanel.accessToLoginPage();
  loginPage.logIn(accountFixtureUtils.getUserLogin(userAlias));
});

Given(/^l'utilisateur "([^"]*)" connecté$/, function (userAlias: string): void {
  this.userAlias = userAlias;
  cy.wrap(this.userAlias).as("userAlias"); // Requirement for teardown.

  cy.logIn(userAlias);
});

//endregion

//region DISCONNECT
When("il se déconnecte", (): void => {
  LoginPanel.disconnect();
});

Then("il est déconnecté", (): void => {
  LoginPanel.userIsDisconnected();
});
//endregion
