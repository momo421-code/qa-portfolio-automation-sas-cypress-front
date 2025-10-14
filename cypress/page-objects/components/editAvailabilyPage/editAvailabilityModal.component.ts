import { Availability } from "../../../shared/availability/Availability";
import { ConsultationModality } from "../../../shared/availability/consultationModality";
import { AvailabilityType } from "../../../shared/availability/availabilityType";
import { DayOfWeek } from "../../../shared/date/dayOfWeek";
import { AvailabilityComponent } from "./availability.component";
import {
  availabilityKeys,
  availabilityModificationKeys,
} from "../../../shared/availability/availabilityDataConfig";
import { EditionModalComponent } from "./editionModal.component";
import { DateUtils } from "../../../support/utils/dateUtils";
import { StringUtils } from "../../../support/utils/stringUtils";
import { CalendarNavigationComponent } from "./calendarNavigationBar.component";
import { AvailabilityOptionsComponent } from "./availabilityOptions.component";

const availabilityComponent: AvailabilityComponent =
  new AvailabilityComponent();
const calendarNavigationComponent: CalendarNavigationComponent =
  new CalendarNavigationComponent();
const availabilityOptionsComponent: AvailabilityOptionsComponent =
  new AvailabilityOptionsComponent();

/**
 * Page objects of edit availability modals in availability edition page.
 */
export class EditAvailabilityModalComponent extends EditionModalComponent {
  //region SELECTORS
  //region Calendar
  private calendar = () => cy.get("[data-cy='calendar']");
  //endregion
  //region Date and times
  private availabilityDatePicker = () =>
    cy.get("[data-cy='availability-date-picker']");
  private availabilityStartTimeSelector = () =>
    cy.get("[data-cy='start-time-dropdown-list']");
  private availabilityEndTimeSelector = () =>
    cy.get("[data-cy='end-time-dropdown-list']");
  //endregion
  //region Availability types
  private timeSlotRadioButton = () =>
    cy.get("[data-cy='time-slot-radio-button']");
  private timeSlotFrame = () => cy.get("[data-cy='time-slot-frame']");
  private timeWindowsRadioButton = () =>
    cy.get("[data-cy='time-window-radio-button']");
  private timeWindowFrame = () => cy.get("[data-cy='time-window-frame']");
  private patientAmountTextField = () =>
    cy.get("[data-cy='patient-amount-field']");
  //endregion
  //region Consultation types
  //TODO: verify if no impact
  private readonly modalityCheckboxes = () =>
    cy.get(
      "[data-cy='office-visit-checkbox'], [data-cy='teleconsultation-checkbox'], [data-cy='home-visit-checkbox']",
    );
  private officeVisitLabel = () => cy.get("[data-cy='office-visit-label']");
  private teleconsultationLabel = () =>
    cy.get("[data-cy='teleconsultation-label']");
  private homeVisitLabel = () => cy.get("[data-cy='home-visit-label']");
  //endregion
  //region Modification
  private modifyRecurrencesLabel = () =>
    cy.get("[data-cy='recurrence-modification-label']");
  //endregion
  //region Deletion
  private deleteRecurrenceLabel = () =>
    cy.get("[data-cy='recurrence-deletion-label']");
  //endregion
  //endregion

  //region EDITION
  //region Date
  /**
   * Define availability's date in the date picker.
   *
   * @param day - 'J' or 'J+n' format
   * @private
   */
  private defineAvailabilityDate(day: string): void {
    this.availabilityDatePicker().type(
      DateUtils.getRelativeDateForDatePicker(day),
    );
  }

  //endregion
  //region Hours
  /**
   * Define availability's start time from select element.
   * The time must be in the format HHhMM, where MM is on the quarter-hour.
   *
   * @param startTime - 'xxhxx' format
   * @private
   */
  private defineStartTime(startTime: string): void {
    if (startTime.match("^(\\d{2})h(\\d{2})$")) {
      this.availabilityStartTimeSelector().select(startTime);
    } else {
      throw new Error(`Availability's start time '${startTime}' is not recognized, 
            please use this format : 'xxhxx'.`);
    }
  }

  /**
   * Define availability's end time from select element.
   * The time must be in the format HHhMM, where MM is on the quarter-hour.
   *
   * @param endTime - 'HHhMM' format
   * @private
   */
  private defineEndTime(endTime: string): void {
    if (endTime.match("^(\\d{2})h(\\d{2})$")) {
      this.availabilityEndTimeSelector().select(endTime);
    } else {
      throw new Error(`Availability's end time '${endTime}' is not recognized, 
            please use this format : 'xxhxx'.`);
    }
  }

  //endregion
  //region Type
  /**
   * Define type of availability: time slot or time window with patients.
   *
   * @param availabilityType - 'Créneau' or 'Plage'
   * @param patientAmount - If availability is a time window
   * @private
   */
  private defineAvailabilityType(
    availabilityType: AvailabilityType,
    patientAmount?: string,
  ): void {
    switch (availabilityType) {
      case AvailabilityType.CRENEAU:
        this.timeSlotFrame().click();
        break;
      case AvailabilityType.PLAGE:
        // TODO: Change to not force : true.
        this.timeWindowFrame().click({ force: true });
        this.patientAmountTextField().clearAndType(patientAmount);
        break;
      default:
        throw new Error(`Availability type ${availabilityType} is not recognized,
                please use '${AvailabilityType.CRENEAU}' or '${AvailabilityType.PLAGE}'`);
    }
  }

  //endregion
  //region Consultation modality
  /**
   * Define availability's consultation modality: 'Consultation en cabinet', 'Téléconsultation' or 'Visite à domicile',
   * there could be multiple consultation modalities.
   *
   * @param consultationModalities - List of consultation modalities.
   * @param isAvailabilityModified - Indicates if availability has been modified.
   * @private
   */
  private defineConsultationTypes(
    consultationModalities: ConsultationModality[],
    isAvailabilityModified: boolean = false,
  ): void {
    // Click each checked consultation modalities.
    if (isAvailabilityModified) {
      // TODO: Change selector when data-cy will be defined.
      cy.get("input[type='checkbox']:checked").each(
        ($checkedInput: JQuery): void => {
          cy.wrap($checkedInput).find("+ label").click();
        },
      );
    }

    consultationModalities.forEach(
      (consultationModality: ConsultationModality): void => {
        switch (consultationModality) {
          case ConsultationModality.CONSULTATION_EN_CABINET:
            this.officeVisitLabel().click();
            break;
          case ConsultationModality.TELECONSULTATION:
            this.teleconsultationLabel().click();
            break;
          case ConsultationModality.VISITE_A_DOMICILE:
            this.homeVisitLabel().click();
            break;
          default:
            throw new Error(`Modality ${consultationModality} is not recognized,
                    please use '${ConsultationModality.CONSULTATION_EN_CABINET}', '${ConsultationModality.TELECONSULTATION}'
                    or '${ConsultationModality.VISITE_A_DOMICILE}'.`);
        }
      },
    );
  }

  //endregion
  //region Recurrence days
  /**
   * Define availability's recurrence days;
   * there could be multiple days.
   * Recurrence days data could be null.
   */
  private defineRecurrenceDays(dayOfWeeks: DayOfWeek[]): void {
    if (dayOfWeeks) {
      dayOfWeeks.forEach((day: DayOfWeek): void => {
        this.getRecurrenceDay(day).click();
      });
    }
  }

  /**
   * Get recurrence day element from a day of week.
   */
  private getRecurrenceDay(dayOfWeek: DayOfWeek): Cypress.Chainable {
    if (Object.values(DayOfWeek).includes(dayOfWeek)) {
      return cy.get(`[data-cy='${dayOfWeek}-label']`);
    } else {
      throw new Error(`Day '${dayOfWeek}' is not a valid day of week.`);
    }
  }

  //endregion

  //endregion

  //region CREATION
  /**
   * Create availability from data.
   * Optional parameters are patient amount and recurrence days.
   *
   * @param availabilityData - Map from an availability datatable.
   */
  createAvailability(availabilityData: Map<string, string>): void {
    const availability: Availability = Availability.create(availabilityData);

    this.openAvailabilityCreationModal();
    this.defineAvailabilityDate(availability.date);
    this.defineStartTime(availability.startTime);
    this.defineEndTime(availability.endTime);
    this.defineAvailabilityType(availability.type, availability.patientAmount);
    this.defineConsultationTypes(availability.consultationModalities);
    this.defineRecurrenceDays(availability.recurrenceDays);
    this.saveSettings();
  }

  //endregion

  //region MODIFICATION
  /**
   * Modify existing availability with new data.
   *
   * @param availabilityData - Creation and modification data.
   * @param modifyRecurrences - True if modify availability's next recurrences.
   */
  modifyAvailability(
    availabilityData: Map<string, string>,
    modifyRecurrences: boolean = false,
  ): void {
    const createdAvailability: Availability = Availability.create(
      availabilityData,
      false,
    );
    const modifiedAvailability: Availability = Availability.create(
      availabilityData,
      true,
    );
    const availabilityModificationDate: string = availabilityData.get(
      availabilityModificationKeys.DATE,
    );
    const modifiedDates: string[] = availabilityModificationDate
      ? StringUtils.getElemAsArray(availabilityModificationDate)
      : [availabilityData.get(availabilityKeys.DATE)];

    modifiedDates.forEach((modifiedDate: string): void => {
      availabilityOptionsComponent.openModificationModal(
        availabilityComponent.getSelector(
          createdAvailability.type,
          Availability.getTimeRange(createdAvailability),
          modifiedDate,
        ),
        createdAvailability.date,
      );
      this.defineStartTime(modifiedAvailability.startTime);
      this.defineEndTime(modifiedAvailability.endTime);
      this.defineAvailabilityType(
        modifiedAvailability.type,
        modifiedAvailability.patientAmount,
      );
      this.defineConsultationTypes(
        modifiedAvailability.consultationModalities,
        true,
      );
      if (modifyRecurrences) {
        this.modifyRecurrencesLabel().click();
      }
      this.saveSettings();
    });
  }

  //endregion

  //region DELETION
  /**
   * Delete availability and chose which type of deletion - delete this occurrence
   * or delete all recurrences from this date.
   *
   * @param availability
   * @param removeRecurrences - Deletion of availability recurrences from this date.
   */
  private openAndDeleteAvailability(
    availability: Cypress.Chainable,
    removeRecurrences: boolean,
  ): void {
    availabilityOptionsComponent.openDeletionModal(availability);
    if (removeRecurrences) {
      this.deleteRecurrenceLabel().click();
    }
    this.saveSettings();
  }

  //region Delete specific availabilities
  searchAndDeleteAvailability(
    availabilityData: Map<string, string>,
    availabilityRelativeDay: string,
    isModifiedAvailability: boolean = false,
    removeRecurrences: boolean = false,
  ): void {
    const availability: Availability = Availability.create(
      availabilityData,
      isModifiedAvailability,
    );
    const availabilitySelector: string = availabilityComponent.getSelector(
      availability.type,
      Availability.getTimeRange(availability),
      availabilityRelativeDay,
    );

    calendarNavigationComponent.goToNextWeekUntilDayIsFound(
      availabilityRelativeDay,
    );
    this.openAndDeleteAvailability(
      cy.get(availabilitySelector),
      removeRecurrences,
    );
  }

  searchAndDeleteRecurringAvailabilities(
    availabilityData: Map<string, string>,
    isModifiedAvailability: boolean = false,
  ): void {
    StringUtils.getElemAsArray(
      availabilityData.get(availabilityKeys.RECURRENCE_DAYS),
    ).forEach((recurrenceDay: string): void => {
      this.searchAndDeleteAvailability(
        availabilityData,
        recurrenceDay,
        isModifiedAvailability,
        true,
      );
    });
  }
  //endregion

  //region Delete availability dataset
  deleteAllExistingDataset(availabilityData: Map<string, string>): void {
    const availability: Availability = Availability.create(availabilityData);
    const recurrenceDays: string[] = StringUtils.getElemAsArray(
      availabilityData.get(availabilityKeys.RECURRENCE_DAYS),
    );

    if (recurrenceDays.length !== 0) {
      this.searchAndDeleteSameRecurringAvailabilities(
        availabilityData,
        recurrenceDays,
      );
    }
    this.searchAndDeleteSameAvailabilities(
      availabilityData,
      availability.date,
      false,
    );
  }

  searchAndDeleteSameRecurringAvailabilities(
    availabilityData: Map<string, string>,
    recurrenceRelativeDays: string[],
  ): void {
    recurrenceRelativeDays.forEach((recurrenceRelativeDay: string): void => {
      this.searchAndDeleteSameAvailabilities(
        availabilityData,
        recurrenceRelativeDay,
        true,
      );
    });
  }

  searchAndDeleteSameAvailabilities(
    availabilityData: Map<string, string>,
    availabilityRelativeDay: string,
    removeRecurrences: boolean,
  ): void {
    const createdAvailability: Availability = Availability.create(
      availabilityData,
      false,
    );
    const modifiedAvailability: Availability = Availability.create(
      availabilityData,
      true,
    );

    const createdAvailabilitySelector: string =
      availabilityComponent.getSelector(
        createdAvailability.type,
        Availability.getTimeRange(createdAvailability),
        availabilityRelativeDay,
      );
    const modifiedAvailabilitySelector: string =
      availabilityComponent.getSelector(
        modifiedAvailability.type,
        Availability.getTimeRange(modifiedAvailability),
        availabilityRelativeDay,
      );

    calendarNavigationComponent.goToNextWeekUntilDayIsFound(
      availabilityRelativeDay,
      true,
    );

    this.deleteSameAvailabilities(
      createdAvailabilitySelector,
      removeRecurrences,
    );
    if (modifiedAvailabilitySelector !== createdAvailabilitySelector) {
      this.deleteSameAvailabilities(
        modifiedAvailabilitySelector,
        removeRecurrences,
      );
    }

    calendarNavigationComponent.goToFirstWeek();
  }

  deleteSameAvailabilities(
    availabilitySelector: string,
    removeRecurrences: boolean,
  ): void {
    const specificDeletionButtonSelector: string = `${availabilitySelector} ${availabilityOptionsComponent.deletionButtonSelector}`;

    this.calendar()
      .subElementExists(specificDeletionButtonSelector)
      .then((present: boolean): void => {
        if (present) {
          cy.get(availabilitySelector).each(($availability: JQuery): void => {
            this.openAndDeleteAvailability(
              cy.wrap($availability),
              removeRecurrences,
            );
          });
        }
      });
  }
  //endregion
  //endregion

  //region DATA
  /**
   * @param date - Date picker format : YYYY-MM-DD.
   * @param startTime
   * @param endTime
   * @param availabilityType
   * @param patientAmount
   * @param consultationModalities
   */
  checkAvailabilityValues(
    date: string,
    startTime: string,
    endTime: string,
    availabilityType: AvailabilityType,
    patientAmount: string,
    consultationModalities: ConsultationModality[],
  ): void {
    this.checkDate(date);
    this.checkStartTime(startTime);
    this.checkEndTime(endTime);
    this.checkType(availabilityType);
    if (availabilityType == AvailabilityType.PLAGE) {
      this.checkPatientAmount(patientAmount);
    }
    this.checkConsultationModalities(consultationModalities);
    cy.softAssertAll();
  }

  /**
   * @param date - Date picker format : YYYY-MM-DD.
   */
  checkDate(date: string): void {
    this.availabilityDatePicker().then(($datePicker: JQuery): void => {
      cy.softAssert($datePicker.val(), date, `Date should be the expected one`);
    });
  }

  checkStartTime(startTime: string): void {
    this.availabilityStartTimeSelector().then(
      ($startTimeSelector: JQuery): void => {
        cy.softAssert(
          $startTimeSelector.val(),
          startTime,
          `Start time should be the expected one`,
        );
      },
    );
  }

  checkEndTime(endTime: string): void {
    this.availabilityEndTimeSelector().then(
      ($endTimeSelector: JQuery): void => {
        cy.softAssert(
          $endTimeSelector.val(),
          endTime,
          `End time should be the expected one`,
        );
      },
    );
  }

  checkType(availabilityType: AvailabilityType): void {
    switch (availabilityType) {
      case AvailabilityType.CRENEAU:
        this.timeSlotRadioButton().then(($timeSlotCheckbox: JQuery): void => {
          cy.softAssert(
            $timeSlotCheckbox.prop("checked"),
            true,
            `Time slot radio button should be checked`,
          );
        });
        break;
      case AvailabilityType.PLAGE:
        this.timeWindowsRadioButton().then(
          ($timeWindowsCheckbox: JQuery): void => {
            cy.softAssert(
              $timeWindowsCheckbox.prop("checked"),
              true,
              `Time windows radio button should be checked`,
            );
          },
        );
        break;
      default:
        throw new Error(`Availability type ${availabilityType} is not recognized,
                please use '${AvailabilityType.CRENEAU}' or '${AvailabilityType.PLAGE}'.`);
    }
  }

  checkPatientAmount(patientAmount: string): void {
    this.patientAmountTextField().then(($endTimeSelector: JQuery): void => {
      cy.softAssert(
        $endTimeSelector.val(),
        patientAmount,
        `Patient amount should be the expected one`,
      );
    });
  }

  checkConsultationModalities(modalities: ConsultationModality[]): void {
    const modalityNames: string[] = modalities.map((modality) =>
      modality.toString(),
    );

    this.modalityCheckboxes().each(($checkbox: JQuery): void => {
      const checkboxValue: string = $checkbox.attr("value");
      const isChecked: boolean = $checkbox.prop("checked");
      const shouldBeChecked: boolean = modalityNames.includes(checkboxValue);

      cy.softAssert(
        isChecked,
        shouldBeChecked,
        `Modality ${checkboxValue} should be ${shouldBeChecked ? "checked" : "unchecked"}`,
      );
    });
  }

  //endregion
}
