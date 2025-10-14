import { AvailabilityEditionPage } from "../../pages/availabilityEdition.page";

/**
 * Page objects of modals present in availability edition page.
 * There is multiple types of modal :
 * - Edition availability (creation, modification and deletion)
 * - Edition unavailability
 * - Additional details
 */
export abstract class EditionModalComponent extends AvailabilityEditionPage {
  //region SELECTORS
  private editAvailabilityModale = (
    timeout: number = Cypress.env("availabilityEditionPopInTimeout"),
  ) => cy.get(".ui-dialog-content", { timeout: timeout });
  private saveButton = () => cy.get("[data-cy='save-button']");
  private cancelButton = () => cy.get(".js-btn-cancel");

  //endregion

  //region SAVING
  /**
   * Save edition and wait for modale to disappear.
   */
  protected saveSettings(): void {
    this.saveButton().click();
    this.waitForModaleToDisappear();
  }

  cancel(): void {
    this.cancelButton().click();
    this.waitForModaleToDisappear();
  }

  //endregion

  //region SYNCHRONISATION
  /**
   * Wait for any of edition modale (availability, unavailability, additional details) to not exist.
   */
  protected waitForModaleToDisappear(): void {
    this.editAvailabilityModale().should("not.exist");
  }

  //endregion
}
