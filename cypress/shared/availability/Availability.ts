import { AvailabilityType } from "./availabilityType";
import { ConsultationModality } from "./consultationModality";
import { DayOfWeek } from "../date/dayOfWeek";
import {
  availabilityKeys,
  availabilityModificationKeys,
  ensureValidAvailabilityKeys,
} from "./availabilityDataConfig";
import { DateUtils } from "../../support/utils/dateUtils";
import { StringUtils } from "../../support/utils/stringUtils";

/**
 * Availability with mandatory and optional parameters needed to create it.
 */
export class Availability {
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly type: AvailabilityType;
  readonly consultationModalities: ConsultationModality[];
  readonly patientAmount: string;
  readonly recurrenceDays: DayOfWeek[];
  readonly timeSlot?: string;

  constructor(
    date: string,
    startTime: string,
    endTime: string,
    availabilityType: AvailabilityType,
    consultationModalities: ConsultationModality[],
    patientAmount?: string,
    recurrenceDays?: DayOfWeek[],
    timeSlot?: string,
  ) {
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.type = availabilityType;
    this.consultationModalities = consultationModalities;
    this.patientAmount = patientAmount;
    this.recurrenceDays = recurrenceDays;
    this.timeSlot = timeSlot;
  }

  /**
   * Create availability from its data.
   * If it is a modified availability, define availability with source and modified data.
   *
   * @param data - Data to modify availability.
   * @param isModified - Indicates if the availability has been modified.
   */
  static create(
    data: Map<string, string>,
    isModified: boolean = false,
  ): Availability {
    ensureValidAvailabilityKeys(data);

    const getKeyValue = (key: string) =>
      data.get(
        isModified && data.get(availabilityModificationKeys[key])
          ? availabilityModificationKeys[key]
          : availabilityKeys[key],
      );

    return new Availability(
      data.get(availabilityKeys.DATE),
      getKeyValue("START_TIME"),
      getKeyValue("END_TIME"),
      AvailabilityType[StringUtils.formatTextToEnumCase(getKeyValue("TYPE"))],
      Availability.getConsultationModalitiesAsEnum(getKeyValue("MODALITIES")),
      getKeyValue("PATIENT_AMOUNT"),
      Availability.getRecurrenceDaysAsEnum(
        data.get(availabilityKeys.RECURRENCE_DAYS),
      ),
      getKeyValue("TIME_SLOT") || data.get("Heure du rdv"),
    );
  }

  /**
   * Get list of recurrence day enum from a string to split.
   * Recurrence days data could be null.
   *
   * @param recurrenceDaysData - String should be split by " ; " characters.
   */
  static getRecurrenceDaysAsEnum(recurrenceDaysData: string): DayOfWeek[] {
    if (recurrenceDaysData == null) {
      return null;
    } else {
      const dataList: string[] = StringUtils.getElemAsArray(recurrenceDaysData);

      return dataList.map((data: string) => {
        const dayOfWeekString: string = StringUtils.formatTextToEnumCase(
          DateUtils.getDayOfWeek(data),
        );
        return DayOfWeek[dayOfWeekString];
      });
    }
  }

  /**
   * Get availability's consultation modalities enum from a string to split.
   *
   * @param consultationModalityData - String should be split by " ; " characters.
   */
  static getConsultationModalitiesAsEnum(
    consultationModalityData: string,
  ): ConsultationModality[] {
    const dataList: string[] = StringUtils.getElemAsArray(
      consultationModalityData,
    );

    return dataList.map((data: string) => {
      const consultationModalityString: string =
        StringUtils.formatTextToEnumCase(data);
      return ConsultationModality[consultationModalityString];
    });
  }

  /**
   * Get availability hours in this format 'xxhxx - xxhxx'.
   */
  static getTimeRange(availability: Availability): string {
    return `${availability.startTime} - ${availability.endTime}`;
  }
}
