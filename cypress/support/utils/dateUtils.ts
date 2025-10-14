import moment from "moment";
import "moment/locale/fr";
import { JDayPattern } from "../../shared/availability/availabilityDataConfig";

/**
 * Methods for getting dates & times with the framework MomentJS.
 */
export class DateUtils {
  // region RELATIVE DAY
  /**
   * @param relativeDay - 'J' or 'J+n' format.
   */
  static getNumberOfDaysUntilToday(relativeDay: string): number {
    const match: RegExpMatchArray = relativeDay.match(JDayPattern);

    if (match) {
      return match[2] ? parseInt(match[2].replace("+", "")) : 0;
    }
    throw new Error(
      `Relative day '${relativeDay}' is not recognized, please use these formats: 'J' or 'J+n'`,
    );
  }

  /**
   * @param daysUntilDate - Relative date in 'J' or 'J+n' format or number of days until date.
   * @param format
   * @param locale
   */
  static getDateFromToday(
    daysUntilDate: string | number,
    format: string = "DD/MM/YYYY",
    locale: string = "en",
  ): string {
    if (typeof daysUntilDate === "string") {
      daysUntilDate = this.getNumberOfDaysUntilToday(daysUntilDate);
    }

    return moment().locale(locale).add(daysUntilDate, "day").format(format);
  }

  /**
   * Get date relative to today in YYYY-MM-DD format.
   *
   * @param daysUntilDate - Relative date in 'J' or 'J+n' format or number of days until availability date.
   */
  static getRelativeDateForDatePicker(daysUntilDate: string | number): string {
    return DateUtils.getDateFromToday(daysUntilDate, "YYYY-MM-DD");
  }

  /**
   * Get day of the week, with first letter in uppercase.
   *
   * @param daysUntilDate - Relative date in 'J' or 'J+n' format or number of days until availability date.
   */
  static getDayOfWeek(daysUntilDate: string | number): string {
    return DateUtils.getDateFromToday(daysUntilDate, "dddd");
  }

  /**
   * Get the first three letters of the day of the week follow by the day number.
   *
   * @param daysUntilDate - Relative Date in 'J' or 'J+n' format or number of days until availability date.
   */
  static getDayAndNumberForCalendar(daysUntilDate: string | number): string {
    return DateUtils.getDateFromToday(daysUntilDate, "ddd D", "fr")
      .replace(".", "")
      .replace(/^./, (firstLetter) => firstLetter.toUpperCase());
  }

  // endregion

  // region TIME
  /**
   * Gets the current time and formats it as "HHhmm".
   */
  static getCurrentTimeFormatted(): string {
    return moment().format("HH[h]mm");
  }

  /**
   * Converts a time string in "HHhmm" format to minutes since midnight.
   *
   * @param timeString - The time string in "HHhmm" format.
   */
  static convertTimeStringToMoment(timeString: string): moment.Moment {
    return moment(timeString, "HH[h]mm");
  }

  // endregion

  /**
   * Round up a time string in 'HHhmm" format to the next time slot (one slot per 15 minutes)
   * Ex : 12h08 -> 12h15
   * 16h48 -> 17h00
   * 23h52 -> 00h00
   *
   * @param timeString - The time string in "HHhmm" format.
   */
  static roundUpToNextSlot(timeString: string): string {
    let hours: number = parseInt(timeString.split("h")[0]);
    let minutes: number = parseInt(timeString.split("h")[1]);
    if (minutes >= 0 && minutes <= 14) {
      minutes = 15;
    } else if (minutes >= 15 && minutes <= 29) {
      minutes = 30;
    } else if (minutes >= 30 && minutes <= 44) {
      minutes = 45;
    } else if (minutes >= 45) {
      if (hours === 24) {
        hours = 0;
      } else {
        if (hours === 23) {
          hours = 0;
        } else {
          hours++;
        }
      }
      minutes = 0;
    }
    // add a necessary "0" if parsed dates length is 1 (ex: 2h47 becomes 02h47)
    let stringHours: string = String(hours);
    let stringMinutes: string = String(minutes);
    if (stringHours.length === 1) {
      stringHours = "0" + stringHours;
    }
    if (stringMinutes.length === 1) {
      stringMinutes = "0" + stringMinutes;
    }
    return stringHours + "h" + stringMinutes;
  }

  /**
   * Round up a time string in 'HHhmm" format to the previous time slot (one slot per 15 minutes)
   * Ex : 12h08 -> 12h00
   * 16h48 -> 16h45
   * 00h00 -> 00h00
   *
   * @param timeString - The time string in "HHhmm" format.
   */
  static roundUpToPreviousSlot(timeString: string): string {
    let minutes: number = parseInt(timeString.split("h")[1]);
    if (minutes >= 0 && minutes <= 14) {
      minutes = 0;
    } else if (minutes >= 15 && minutes <= 29) {
      minutes = 15;
    } else if (minutes >= 30 && minutes <= 44) {
      minutes = 30;
    } else if (minutes >= 45) {
      minutes = 45;
    }
    // add a necessary "0" if parsed minutes length is 1 (ex: 02h0 becomes 02h00)
    let stringMinutes: string = String(minutes);
    if (stringMinutes.length === 1) {
      stringMinutes = "0" + stringMinutes;
    }
    return timeString.split("h")[0] + "h" + stringMinutes;
  }
}
