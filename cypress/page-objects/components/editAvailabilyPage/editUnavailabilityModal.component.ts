import { EditionModalComponent } from "./editionModal.component";
import { DateUtils } from "../../../support/utils/dateUtils";

/**
 * Page objects of unavailability edition modal present in availability edition page and effector dashboard.
 */
export class EditUnavailabilityModalComponent extends EditionModalComponent {
  //region SELECTORS
  //region Indefinite period unavailability
  private indefinitePeriodUnavailabilityLabel = () =>
    cy.get("[for='checkbox-unavailable-now']");
  private indefinitePeriodUnavailabilityCheckbox = () =>
    cy.get("#checkbox-unavailable-now");
  //endregion
  //Programmed unavailability
  private addProgrammedUnavailabilityButton = () =>
    cy.get("[data-cy='add-programmed-unavailability-button']");
  private programmedUnavailabilityLineSelector: string =
    "[data-cy='programmed-unavailability-line']";
  private startDatePickerSelector: string =
    "[data-cy='start-time-date-picker']";
  private endDatePickerSelector: string = "[data-cy='end-time-date-picker']";
  private deleteButtonSelector: string =
    "[data-cy='delete-programmed-unavailability-button']";
  //endregion
  //region Datatable keys
  private startDateKey: string = "Date de début";
  private endDateKey: string = "Date de fin";
  //endregion
  //endregion

  //region INDEFINITE UNAVAILABILITY
  /**
   * Apply indefinite period unavailability if it is not define,
   * and if it is chosen to remove unavailability, remove it if it defined.
   *
   * @param unavailabilityRemoval - True if deleting unavailability
   */
  editIndefinitePeriodUnavailability(
    unavailabilityRemoval: boolean = false,
  ): void {
    this.openUnavailabilityModal();

    this.indefinitePeriodUnavailabilityCheckbox().then(
      ($checkbox: JQuery): void => {
        const isChecked: boolean = $checkbox.is(":checked");

        // If this is an unavailability removal and checkbox is checked,
        // or if this is unavailability application and checkbox is unchecked, then we click the checkbox.
        if (unavailabilityRemoval === isChecked) {
          this.indefinitePeriodUnavailabilityLabel().click();
        }
      },
    );
    this.saveSettings();
  }

  //endregion

  //region PROGRAMMED UNAVAILABILITY
  //region Creation
  /**
   * Define one or multiple programmed unavailability with start and end date.
   *
   * @param unavailabilityData - Start and end time for each unavailability
   * @param unavailabilityRemoval - If you want to delete all previous programmed unavailability
   */
  editProgrammedUnavailability(
    unavailabilityData: Map<string, string>[],
    unavailabilityRemoval: boolean = true,
  ): void {
    this.openUnavailabilityModal();

    if (unavailabilityRemoval) {
      this.deleteAllProgrammedUnavailability();
    }

    unavailabilityData.forEach(
      (unavailabilityDates: Map<string, string>, index: number): void => {
        const startDate: string = DateUtils.getRelativeDateForDatePicker(
          unavailabilityDates.get(this.startDateKey),
        );
        const endDate: string = DateUtils.getRelativeDateForDatePicker(
          unavailabilityDates.get(this.endDateKey),
        );

        this.addProgrammedUnavailabilityButton().click();
        cy.get(this.programmedUnavailabilityLineSelector)
          .eq(index)
          .then(($line: JQuery): void => {
            cy.wrap($line.find(this.startDatePickerSelector)).type(startDate);
            cy.wrap($line.find(this.endDatePickerSelector)).type(endDate);
          });
      },
    );

    this.saveSettings();
  }

  //endregion

  //region Deletion
  /**
   * Delete all programmed unavailability present in the modale.
   */
  private deleteAllProgrammedUnavailability(): void {
    cy.get("body").then(($page: JQuery): void => {
      const buttonLength: number = $page.find(this.deleteButtonSelector).length;
      if (buttonLength) {
        for (let i = 0; i < buttonLength; i++) {
          cy.get(this.deleteButtonSelector).eq(0).click();
        }
      }
    });
  }

  /**
   * Open unavailability modal, delete all programmed unavailability pre-added and save deletion.
   */
  deleteProgrammedUnavailability(): void {
    this.openUnavailabilityModal();
    this.deleteAllProgrammedUnavailability();
    this.saveSettings();
  }

  //endregion
  //endregion
}
