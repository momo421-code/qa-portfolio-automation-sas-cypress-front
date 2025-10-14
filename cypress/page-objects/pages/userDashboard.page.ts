/**
 * Page objects of user dashboard.
 * There is dashboards for three types of roles : effector, structure manager and delegate.
 */
export abstract class UserDashboardPage {
  workplaceSectionSelector: string | string[];
  protected editAvailabilityButtonSelector: string;
  protected editAdditionalDataButtonSelector: string =
    ".db-informations button";
  protected static loader = () => cy.get(".loader-wrapper", { timeout: 16000 });

  /**
   * @param address - Could be part of the workplace's address.
   */
  getWorkplaceSection(address: string): Cypress.Chainable {
    // Due to SOS Médecins evolution, for a structure manager, there is two dashboards with different selectors.
    const selectors: string = Array.isArray(this.workplaceSectionSelector)
      ? this.workplaceSectionSelector
          .map((selector) => `${selector}:has(*:contains(${address}))`)
          .join(", ")
      : `${this.workplaceSectionSelector}:has(*:contains(${address}))`;

    return cy.get(selectors);
  }

  /**
   * Get specific edit availability button.
   *
   * @param address - Could be part of the workplace's address
   */
  protected getEditAvailabilityButton(address: string): Cypress.Chainable {
    return this.getWorkplaceSection(address).find(
      this.editAvailabilityButtonSelector,
    );
  }

  /**
   * Access to specific availability edition page in the same tab.
   *
   * @param address - Could be part of the workplace's address
   */
  accessAvailabilityEditionPage(address: string): void {
    this.getEditAvailabilityButton(address).openLinkInCurrentWindow();
    // TODO: Replace with a synchronisation for waiting to JS to finish / scroll to availability.
    cy.wait(2000);
  }

  openAdditionalDataPopIn(address: string) {
    this.getWorkplaceSection(address)
      .find(this.editAdditionalDataButtonSelector)
      .click();
  }

  static awaitDashboardLoad() {
    this.loader().should("not.exist");
  }
}
