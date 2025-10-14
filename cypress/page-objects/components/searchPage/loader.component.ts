/**
 * Page objects of loader on the result page.
 */
export class LoaderComponent {
  private static loader = (
    timeout: number = Cypress.env("resultPageTimeout"),
  ) => cy.get("[data-cy='search-loader']", { timeout: timeout });

  /**
   * Wait for results loader to not exist to begin tests on results.
   */
  static waitForDisappearing(): void {
    this.loader().should("not.exist");
  }
}
