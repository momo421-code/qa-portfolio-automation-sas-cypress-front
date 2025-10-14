import { DateUtils } from "../../../support/utils/dateUtils";

export class CalendarComponent {
  private calendar = () => cy.get(".wrapper-calendar");

  /**
   * @param daysUntilDate - Relative date in 'J' or 'J+n' format or number of days until availability date.
   */
  isDayPresent(daysUntilDate: string | number): Cypress.Chainable<boolean> {
    const dayAndNumber: string =
      DateUtils.getDayAndNumberForCalendar(daysUntilDate);

    return this.calendar().then(($calendar: JQuery): boolean => {
      return $calendar
        .find("th")
        .toArray()
        .some((element: HTMLElement): boolean => {
          return Cypress.$(element).text().trim() === dayAndNumber;
        });
    });
  }
}
