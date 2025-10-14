import { StringUtils } from "../../support/utils/stringUtils";
import { apiPaths } from "./apiPaths";
import { PractitionerSlotEntry } from "./types";

let resultEntries: PractitionerSlotEntry[] = [];

/**
 * Requests from aggregator that return the time slots of editor's practitioners.
 */
export class PractitionerSlotsRequests {
  /**
   * Intercepts practitioner slots requests, extracts and stores their entries with their firstname, lastname and address.
   * The entries are stored in a private static array `resultEntries`.
   */
  static intercept(): void {
    resultEntries = [];
    cy.intercept("POST", apiPaths.practitionerSlots.url, (req): void => {
      req.continue((res): void => {
        const data = res.body;
        const newEntries: PractitionerSlotEntry[] =
          this.extractPractitionerEntries(data);
        resultEntries = [...resultEntries, ...newEntries];
      });
    }).as(apiPaths.practitionerSlots.alias);
  }

  static getResultEntries(): PractitionerSlotEntry[] {
    return resultEntries;
  }

  private static extractPractitionerEntries(data): PractitionerSlotEntry[] {
    const createEntries = Object.keys(data)
      .filter((key: string): boolean => data[key].action === "create")
      .map((key: string) => data[key]);

    return createEntries.map((entry) => {
      const firstname: string =
        StringUtils.removeFrenchCharacters(entry.practitioner?.firstname) || "";
      const lastname: string =
        StringUtils.removeFrenchCharacters(entry.practitioner?.lastname) || "";
      const address: string = entry.address?.line || "";
      return { firstname, lastname, address };
    });
  }
}
