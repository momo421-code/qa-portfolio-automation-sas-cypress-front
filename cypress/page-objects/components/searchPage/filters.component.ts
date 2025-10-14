import {
  FilteringCriteriaName,
  filteringCriteriaNameToEnum,
  FilteringCriteriaTypeSelectorPrefix,
} from "../../../shared/filters/filterCriteria";
import { LoaderComponent } from "./loader.component";

/**
 * Page objects of filters bar and pop-in in results page.
 */
export class FiltersComponent {
  //region SELECTORS
  //region Search types
  private overbookingFilterButton = () =>
    cy.get("[data-cy='overbooking-filter-button']");
  //endregion
  //region Filters banner
  private bannerFilterButtons = () =>
    cy.get(".search-retail__selection button");
  private filteringCriteriaButton = (
    criteriaName: FilteringCriteriaTypeSelectorPrefix,
  ) => cy.get("#" + criteriaName);
  private filteringCriteriaValueLabel = (
    criteriaName: FilteringCriteriaTypeSelectorPrefix,
    value: string,
  ) =>
    cy
      .get("." + criteriaName + "-container")
      .find("label")
      .contains(value);
  private allFiltersFilteringCriteriaLabel = (
    criteriaName: FilteringCriteriaTypeSelectorPrefix,
    value: string,
  ) =>
    cy
      .get("#" + criteriaName + "-list")
      .find("label")
      .contains(value);
  private visibleFilteringCriteriaApplyButton = () =>
    cy.get(".search-retail__choice__option-submit").filter(":visible");
  //endregion
  //region All filters
  private allFiltersButton = () => cy.get("[id=all_filters_btn]");

  private allFiltersApplyButton = () =>
    cy.get(".modal-all-filters").find(".submit-btn");
  //endregion
  //endregion

  //region SEARCH TYPES
  /**
   * Click on overbooking filter and wait for results to appear.
   */
  applyOverbookingFilter(): void {
    this.overbookingFilterButton().click();
    LoaderComponent.waitForDisappearing();
  }

  //endregion
  //region FILTERING CRITERIA
  /**
   * Apply values of one filtering criteria.
   *
   * @param criteria - Filtering criteria name
   * @param values - Value(s) of filtering criteria
   */
  applyCriteriaValues(
    criteria: FilteringCriteriaTypeSelectorPrefix,
    values: Array<string>,
  ): void {
    this.filteringCriteriaButton(criteria).click();

    values.forEach((elem: string) =>
      this.filteringCriteriaValueLabel(criteria, elem).click(),
    );
    this.visibleFilteringCriteriaApplyButton().click();
  }

  //endregion
  //region ALL FILTERS
  /**
   * Apply different values of one filtering criteria in the all filters modale.
   *
   * @param data - Key : filtering criteria | Value : array of criteria values
   */
  applySeveralCriteriaValues(
    data: Map<FilteringCriteriaName, Array<string>>,
  ): void {
    this.allFiltersButton().click();

    Array.from(data.keys()).forEach((key) =>
      Array.from(data.get(key)).forEach((critValue) =>
        this.allFiltersFilteringCriteriaLabel(
          filteringCriteriaNameToEnum.get(key),
          critValue,
        ).click(),
      ),
    );
    this.allFiltersApplyButton().click();
  }

  //endregion
  //region FILTERING BANNER
  /**
   * Verify if all filters button from filter banner do not exist.
   */
  filtersButtonsAreAbsent(): void {
    this.bannerFilterButtons().should("not.exist");
  }

  //endregion
  //region AVAILABLE IN
  static getHoursFromAvailableInFilter(filter: string): {
    start: number;
    end: number;
  } {
    const regex: RegExp = /Sous (\d+)h et (\d+)h/;
    const match: RegExpMatchArray = filter.match(regex);

    if (match) {
      const startHour: number = parseInt(match[1], 10);
      const endHour: number = parseInt(match[2], 10);
      return { start: startHour, end: endHour };
    } else {
      throw new Error("Invalid format for Available In filter");
    }
  }
  //endregion
}
