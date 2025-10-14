import { CalendarComponent } from "./calendar.component";
import { DateUtils } from "../../../support/utils/dateUtils";

export class CalendarNavigationComponent {
  private calendarComponent: CalendarComponent = new CalendarComponent();

  private nextWeekButton = () => cy.get(".btn-pager:has(i.icon-right)");
  private readonly prevWeekButtonSelector: string =
    ".btn-pager:has(i.icon-left)";

  /**
   * @param daysUntilDate - Relative date in 'J' or 'J+n' format or number of days until date.
   * @param shouldWait - If it should wait for availabilities to appear.
   * @param index
   */
  goToNextWeekUntilDayIsFound(
    daysUntilDate: string | number,
    shouldWait: boolean = false,
    index: number = 0,
  ): void {
    if (typeof daysUntilDate === "string") {
      daysUntilDate = DateUtils.getNumberOfDaysUntilToday(daysUntilDate);
    }

    const maxWeeksUntilAvailability: number = Math.ceil(daysUntilDate / 7);
    const availabilityDateDayAndNumber: string =
      DateUtils.getDayAndNumberForCalendar(daysUntilDate);

    this.calendarComponent
      .isDayPresent(daysUntilDate)
      .then((dateFound: boolean): void => {
        if (!dateFound) {
          if (index > maxWeeksUntilAvailability) {
            throw new Error(
              `Day '${availabilityDateDayAndNumber}' is not found in calendar after checking ${maxWeeksUntilAvailability} week(s)`,
            );
          }
          this.nextWeekButton().click();
          this.goToNextWeekUntilDayIsFound(
            daysUntilDate,
            shouldWait,
            index + 1,
          );
        } else if (index > 0 && shouldWait) {
          cy.wait(1250);
        }
      });
  }

  goToFirstWeek(shouldWait: boolean = false, index: number = 0): void {
    cy.elementExists(this.prevWeekButtonSelector).then(
      (elementExists: boolean): void => {
        if (elementExists) {
          cy.get(this.prevWeekButtonSelector).click();
          this.goToFirstWeek(shouldWait, index + 1);
        } else if (index > 0 && shouldWait) {
          cy.wait(1250);
        }
      },
    );
  }
}
