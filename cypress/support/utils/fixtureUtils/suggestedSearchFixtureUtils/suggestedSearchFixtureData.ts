import { StringUtils } from "../../stringUtils";

export enum SuggestedFiltersJsonFieldNames {
  NAME = "name",
  TYPES = "types",
  SPECIALTIES = "specialties",
}

/**
 * Contains data of suggested search filters
 */
export class SuggestedFiltersData {
  name: string;
  types: Array<string>;
  specialties: Array<string>;

  constructor(jsonData?: JSON) {
    if (jsonData) this.init(jsonData);
  }

  public init(jsonData: JSON): SuggestedFiltersData {
    this.name = jsonData[SuggestedFiltersJsonFieldNames.NAME];
    this.types = StringUtils.getElemAsArray(
      jsonData[SuggestedFiltersJsonFieldNames.TYPES],
    );
    this.specialties = StringUtils.getElemAsArray(
      jsonData[SuggestedFiltersJsonFieldNames.SPECIALTIES],
    );

    cy.log("FILTRE TROUVE : ");
    console.log(this.types);

    return this;
  }
}
