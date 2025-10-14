import { CalendarNavigationComponent } from "./calendarNavigationBar.component";

export class AvailabilityOptionsComponent {
  private calendarNavigationComponent: CalendarNavigationComponent =
    new CalendarNavigationComponent();

  //region SELECTORS
  private readonly modificationButtonSelector: string =
    "[data-cy='modification-button']";
  readonly deletionButtonSelector: string = "[data-cy='deletion-button']";

  //endregion

  //region MODALS ACCESS
  /**
   * Open modification modal without overing it (force the click even if the icon is invisible).
   *
   * @param availabilitySelector
   * @param daysUntilAvailability - Relative date in 'J' or 'J+n' format or number of days until availability date.
   */
  openModificationModal(
    availabilitySelector: string,
    daysUntilAvailability: string | number,
  ): void {
    this.calendarNavigationComponent.goToNextWeekUntilDayIsFound(
      daysUntilAvailability,
    );
    cy.get(availabilitySelector)
      .find(this.modificationButtonSelector)
      .click({ force: true });
  }

  /**
   * Open deletion modal of a specific availability,
   * without overing it (force the click even if the icon is invisible).
   *
   * @param availability
   */
  openDeletionModal(availability: Cypress.Chainable): void {
    availability.find(this.deletionButtonSelector).click({ force: true });
  }

  //endregion

  // region EDITION IMPOSSIBILITY
  /**
   * Checks if the modification button does not exist for the last availability with defined data.
   *
   * @param availability - Expected availability or list of availabilities.
   */
  checkModificationImpossibility(availability: Cypress.Chainable): void {
    availability
      .eq(-1)
      .find(this.modificationButtonSelector)
      .should("not.exist");
  }

  /**
   * Checks if the deletion button does not exist for the last availability with defined data.
   *
   * @param availability - Expected availability or list of availabilities.
   */
  checkDeletionImpossibility(availability: Cypress.Chainable): void {
    availability.eq(-1).find(this.deletionButtonSelector).should("not.exist");
  }

  //endregion
}
