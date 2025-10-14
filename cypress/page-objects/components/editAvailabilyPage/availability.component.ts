import { AvailabilityType } from "../../../shared/availability/availabilityType";
import { DateUtils } from "../../../support/utils/dateUtils";
import { sasAvailabilityTimeRangeFormat } from "../../../shared/availability/availabilityDataConfig";

/**
 * Page objects of agenda's availabilities.
 * Which is a component of edit availability page.
 */
export class AvailabilityComponent {
  //region SELECTORS
  private readonly timeSlotSelector: string = "[data-cy='time-slot']";
  private readonly timeWindowSelector: string = "[data-cy='time-window']";
  //endregion

  //region ELEMENT
  /**
   * @param type - 'Plage' or 'Créneau'.
   * @param timeRange - 'xxhxx - xxhxx' format.
   * @param date - 'J' or 'J+n' format.
   */
  getElement(
    type: AvailabilityType,
    timeRange: string,
    date: string,
  ): Cypress.Chainable {
    return cy.get(this.getSelector(type, timeRange, date));
  }

  /**
   * @param type - 'Plage' or 'Créneau'.
   * @param timeRange - 'xxhxx - xxhxx' format.
   * @param daysUntilAvailability - Relative date in 'J' or 'J+n' format or number of days until availability date.
   */
  getSelector(
    type: AvailabilityType,
    timeRange: string,
    daysUntilAvailability: string | number,
  ): string {
    const dayNumber: string = this.getDayNumberForSelector(
      daysUntilAvailability,
    );
    const startHour: string = this.getStartHourOnlyForSelector(timeRange);
    const availabilitySelector: string =
      this.getSelectorForAvailabilityType(type);

    return (
      `td[data-date=${dayNumber}][data-hour=${startHour}] ` +
      `${availabilitySelector}:has(span:contains(${timeRange}))`
    );
  }

  /**
   * @param timeRange - 'xxhxx - xxhxx' format.
   */
  private getStartHourOnlyForSelector(timeRange: string): string {
    if (timeRange.match(sasAvailabilityTimeRangeFormat)) {
      return timeRange.slice(0, 2).replace(/^0(\d)$/, "$1");
    } else {
      throw new Error(`Time range '${timeRange}' is not recognized, 
            please use this format : 'xxhxx - xxhxx'.`);
    }
  }

  /**
   * @param date - 'J' or 'J+n' format
   */
  private getDayNumberForSelector(date: string | number): string {
    return DateUtils.getDateFromToday(date, "DD").replace(/^0(\d)$/, "$1");
  }

  private getSelectorForAvailabilityType(type: AvailabilityType): string {
    // TODO: Change value of availabilitySelector when data-cy attribute will be add for time slot and window slot.
    switch (type) {
      case AvailabilityType.CRENEAU:
        return this.timeSlotSelector;
      case AvailabilityType.PLAGE:
        return this.timeWindowSelector;
      default:
        throw new Error(`Availability type ${type} is not recognized,
                please use '${AvailabilityType.CRENEAU}' or '${AvailabilityType.PLAGE}'`);
    }
  }

  //endregion
  //region ABSENCE
  checkAbsence(availabilitySelector: string): void {
    cy.get(availabilitySelector).should("not.exist");
  }
  //endregion
}
