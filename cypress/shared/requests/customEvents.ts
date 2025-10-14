/**
 * Some JS events have parameters :
 * hasFirstElement - currentSearch: { string } lvl1 | lvl2,
 * hasMoreResults - currentSearch: { string } lvl1 | lvl2,
 * hasNoResults - cause: geolocation | no-healthcare,
 * onPageChange - currentPage: { integer }, pagesCount: { integer }
 */
export enum ResultsPageCustomEvents {
  HAS_FIRST_ELEMENT = "hasFirstElement",
  HAS_ALL_RESULTS = "hasAllResults",
  HAS_MORE_RESULTS = "hasMoreResults",
  HAS_NO_RESULTS = "hasNoResult",
  PAGE_NUMBER_INFO = "onPageChange",
}

export class CustomEvent {
  static await(eventType: string, timeout: number): void {
    cy.document().then(($document: Document): void => {
      const eventPromise: Promise<Event> = new Promise((resolve) => {
        $document.addEventListener(eventType, (event: Event) => resolve(event));
      });
      cy.wrap(eventPromise, { timeout: timeout });
    });
  }

  /**
   * Waits for the first occurrence of any specified events within a given timeout period.
   *
   * @param eventTypes - An array of event types to listen for.
   * @param timeout - The maximum time to wait for any of the events, in milliseconds.
   */
  static awaitRace(eventTypes: string[], timeout: number): void {
    cy.document().then(($document: Document): void => {
      const eventPromises: Promise<Event>[] = eventTypes.map((eventType) => {
        return new Promise((resolve) => {
          $document.addEventListener(eventType, (event: Event) =>
            resolve(event),
          );
        });
      });

      const racePromise = Promise.race(eventPromises);
      cy.wrap(racePromise, { timeout: timeout });
    });
  }
}
