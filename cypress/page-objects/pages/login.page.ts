/**
 * Page objects of Keycloak login page.
 */
export class LoginPage {
  private loginTextField = () => cy.get("#username");
  private passwordTextField = () => cy.get("#password");
  private logInButton = () => cy.get("#kc-login");
  private continueButtonSelector: string = "[data-cy='continue-button']";

  private password: string = Cypress.env("password");

  /**
   * Log in by Keycloak and click continue button if it exists.
   * Throws an error if env variable 'password' is not defined.
   *
   * @param login
   */
  logIn(login: string): void {
    if (typeof this.password !== "string" || !this.password) {
      throw new Error(
        `Missing password value, set using '--env password=...' in cypress.env.json.`,
      );
    }
    this.loginTextField().type(login);
    this.passwordTextField().type(this.password, { log: false });
    this.logInButton().click();
    cy.clickIfExist(this.continueButtonSelector);
  }
}
