import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { DataTable } from "@cucumber/cucumber";
import { FiltersComponent } from "../../../page-objects/components/searchPage/filters.component";
import { CardComponent } from "../../../page-objects/components/searchPage/card.component";
import {
  FilteringCriteriaName,
  getFilteringCriteriaNameSelectorPrefix,
} from "../../../shared/filters/filterCriteria";
import { DataTableUtils } from "../../../support/utils/dataTableUtils";
import { StringUtils } from "../../../support/utils/stringUtils";
import moment from "moment";

const filtersComponent: FiltersComponent = new FiltersComponent();

const UNDEFINED_CONVENTION: string = "(vide)";

/**
 * Data need for result indexation (if it is needed to apply this type of search).
 */
export let overbookingSearch: boolean = false;

//region SEARCH TYPES
When("il active le filtre Créneaux en sus", (): void => {
  overbookingSearch = true;
  filtersComponent.applyOverbookingFilter();
});
//endregion
//region FILTER BANNER
When(
  /^il applique les valeurs "([^"]*)" du filtre "([^"]*)"$/,
  function (values: string, criteria: string): void {
    this.filterValues = StringUtils.getElemAsArray(values);
    this.currentTime = moment();

    filtersComponent.applyCriteriaValues(
      getFilteringCriteriaNameSelectorPrefix(criteria),
      this.filterValues,
    );
  },
);
//endregion
//region ALL FILTERS
Then(/^aucun filtre n'est présent$/, function (): void {
  filtersComponent.filtersButtonsAreAbsent();
});

/**
 * WARNING : we do not check in which section the criteria name is located
 *           it is selected anyway
 */
When(
  /^il applique les filtres via tous les filtres$/,
  function (data: DataTable): void {
    const valuesMap: Map<string, string> = DataTableUtils.convertDataTableToMap(
      data,
      true,
    );
    const mapWithListValues: Map<
      FilteringCriteriaName,
      Array<string>
    > = new Map();
    const allowedFilterNames: Array<FilteringCriteriaName> = Array.from(
      Object.values(FilteringCriteriaName),
    );
    this.filterValues = [];

    // {"Type", "Centre de santé ; Médecine Générale"} transformed into {"Type", ["Centre de santé", "Médecine générale"]}.
    Array.from(valuesMap.keys()).forEach((key: string): void => {
      const filterValue: { filter: FilteringCriteriaName; values: string[] } = {
        filter: key as FilteringCriteriaName,
        values: StringUtils.getElemAsArray(valuesMap.get(key)),
      };
      if (allowedFilterNames.indexOf(filterValue.filter) < 0)
        throw new Error(`"Unexpected field name in steps. Got ${key} 
            but one of ${allowedFilterNames} was expected."`);
      mapWithListValues.set(filterValue.filter, filterValue.values);

      this.filterValues.push(filterValue);
    });

    this.currentTime = moment();
    filtersComponent.applySeveralCriteriaValues(mapWithListValues);
  },
);
//endregion
//region FILTERED RESULTS
Then(
  /^tous les résultats ont un type appartenant à "([^"]*)"$/,
  function (values: string): void {
    const list: string[] = StringUtils.getElemAsArray(values);

    CardComponent.checkTypePresentOnAllResults(list);
  },
);

Then(
  /^tous les résultats ont un conventionnement appartenant à "([^"]*)"$/,
  function (values: string): void {
    const list: Array<string> = StringUtils.getElemAsArray(values);
    const indexOfUndefined: number = list.findIndex(
      (elem) => elem === UNDEFINED_CONVENTION,
    );

    if (indexOfUndefined >= 0) {
      // Remove the fake value UNDEFINED_CONVENTION (vide) before to check the results
      list.splice(indexOfUndefined, 1);
      CardComponent.checkConventionPresentOnAllResults(list, true);
    } else CardComponent.checkConventionPresentOnAllResults(list, false);
  },
);

Then(
  /^tous les résultats ont au moins une disponibilité correspondante aux tranches horaires sélectionnées$/,
  function (): void {
    // Get values of filter from other steps; could be a string[] or { filter: FilteringCriteriaName; values: string[] }.
    this.filterValues =
      typeof this.filterValues[0] === "string"
        ? this.filterValues
        : this.filterValues
            .filter(
              (fv: {
                filter: FilteringCriteriaName;
                values: string[];
              }): boolean => fv.filter === FilteringCriteriaName.AVAILABLE_IN,
            )
            .flatMap(
              (fv: { filter: FilteringCriteriaName; values: string[] }) =>
                fv.values,
            );

    CardComponent.checkAvailableInFilterApplication(
      this.filterValues,
      this.currentTime,
    );
  },
);
//endregion
