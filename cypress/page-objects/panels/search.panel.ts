/**
 * Page objects of search panel.
 */
export class SearchPanel {
  private subjectTextField = () => cy.get("[data-cy='search-text-field']");
  private locationTextField = () => cy.get("[data-cy='location-text-field']");
  private searchButton = () => cy.get("[data-cy='search-button']");

  /**
   * Run a search with a subject and a location.
   *
   * @param search - Search subject
   * @param location - Search location
   */
  search(search: string, location: string): void {
    this.subjectTextField().clearAndType(search);
    this.locationTextField().clearAndType(location);
    this.searchButton().click();
  }
}
