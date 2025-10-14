/**
 * Allowed param names in steps AND on html page, on criteria part
 */
export enum FilteringCriteriaName {
  TYPE = "Type",
  CONVENTION = "Conventionnement",
  AVAILABLE_IN = "Disponible sous",
}

/**
 * Different types of filtering criteria in results page.
 */
export enum FilteringCriteriaTypeSelectorPrefix {
  TYPE = "itm_establishment_types",
  CONVENTION = "itm_convention_type_number",
  AVAILABLE_IN = "available_hours",
  // TODO: Use these when data-cy will be on all filters modal.
  // TYPE = "type-filter-button",
  // CONVENTION = "itm_convention_type_number",
  // AVAILABLE_IN = "available-hours-filter-button",
}

/**
 * Return a type of filtering criteria.
 *
 * @param commonName
 */
export function getFilteringCriteriaNameSelectorPrefix(
  commonName: string,
): FilteringCriteriaTypeSelectorPrefix {
  return filteringCriteriaNameToEnum.get(commonName);
}

/**
 * Matching between enum and name used in the steps.
 * The values are used to build selector names
 */
export const filteringCriteriaNameToEnum: Map<
  string,
  FilteringCriteriaTypeSelectorPrefix
> = new Map([
  [FilteringCriteriaName.TYPE, FilteringCriteriaTypeSelectorPrefix.TYPE],
  [
    FilteringCriteriaName.CONVENTION,
    FilteringCriteriaTypeSelectorPrefix.CONVENTION,
  ],
  [
    FilteringCriteriaName.AVAILABLE_IN,
    FilteringCriteriaTypeSelectorPrefix.AVAILABLE_IN,
  ],
]);
