/**
 * Page objects of availability edition page.
 * This page contains these components:
 * - Availability edition modals
 * - Unavailability edition modal
 * - Availabilities
 */
export class AvailabilityEditionPage {
  //region SELECTORS
  private static calendarHeader = () => cy.get(".calendar-header");
  private static createAvailabilityButton = () =>
    cy.get("[data-cy='create-availability-button']");
  private static editUnavailabilityButton = () =>
    cy.get("[data-cy='edit-unavailability-button']");
  private static additionalDataButton = () =>
    this.calendarHeader().contains("Informations complémentaires");
  //endregion

  //region AVAILABILITY CREATION
  /**
   * Open availability creation modal.
   */
  openAvailabilityCreationModal(): void {
    AvailabilityEditionPage.createAvailabilityButton().click();
  }

  //endregion

  //region UNAVAILABILITY EDITION
  /**
   * Open unavailability edition modal.
   */
  protected openUnavailabilityModal(): void {
    AvailabilityEditionPage.editUnavailabilityButton().click();
  }

  //endregion

  //region ADDITIONAL DATA
  static openAdditionalDataPopIn(): void {
    AvailabilityEditionPage.additionalDataButton().click();
  }
  //endregion
}
