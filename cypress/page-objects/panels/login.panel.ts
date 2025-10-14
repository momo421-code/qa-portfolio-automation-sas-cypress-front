/**
 * Page objects of login panel.
 */
export class LoginPanel {
  //region SELECTORS
  //region Login
  private static loginButton = () => cy.get("[data-cy='login-button']");
  /**
   * Logout button for Drupal and PSC login.
   */
  private static logoutButton = () =>
    cy.get("[data-cy='disconnect-button'], a.btn-logout");
  //endregion
  //region Account menu
  private static accountButtonSelector: string = "[data-cy='account-button']";
  private static linkedStructuresLink = () => cy.get(".structures");
  //endregion
  //endregion

  //region LOGIN
  static accessToLoginPage(): void {
    this.loginButton().click();
  }

  /**
   * Disconnect from account panel or from logout button if user used a PSC login.
   */
  static disconnect(): void {
    cy.clickIfExist(this.accountButtonSelector);
    this.logoutButton().click();
  }

  /**
   * Verify if bouton login is present.
   */
  static userIsDisconnected(): void {
    this.loginButton().should("be.visible");
  }

  //endregion

  //region DASHBOARD ACCESS
  static openAccountMenu(): void {
    cy.get(this.accountButtonSelector).click();
  }

  static accessToLinkedStructuresDashboard(): void {
    this.openAccountMenu();
    this.linkedStructuresLink().click();
  }

  //endregion
}
