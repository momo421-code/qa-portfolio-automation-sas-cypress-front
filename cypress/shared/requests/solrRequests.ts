import { apiPaths } from "./apiPaths";
import { SolrEntry } from "./types";

let resultEntries: SolrEntry[] = [];

/**
 * Requests from SolR that return health offer corresponding to search.
 */
export class SolrRequests {
  /**
   * Intercepts SolR requests, extracts and stores SolR entries with their title, address, and distance.
   * The entries are stored in a private static array `resultEntries`.
   */
  static intercept(): void {
    resultEntries = [];
    cy.intercept("GET", apiPaths.solR.url, (req): void => {
      req.continue((res): void => {
        const data = res.body.data.grouped.ss_field_custom_group.groups;
        const newEntries: SolrEntry[] = this.extractSolrEntries(data);
        resultEntries = [...resultEntries, ...newEntries];
      });
    }).as(apiPaths.solR.alias);
  }

  static getResultEntries(): SolrEntry[] {
    return resultEntries;
  }

  private static extractSolrEntries(data): SolrEntry[] {
    const createEntries = Object.keys(data).map((key: string) => data[key]);

    return createEntries.map((entry) => {
      const access = entry.doclist.docs[0];
      const title: string = access.tm_X3b_und_title || "";
      const address: string = access.ss_field_address || "";
      const distance: number = access.dist;
      return { title, address, distance };
    });
  }
}
