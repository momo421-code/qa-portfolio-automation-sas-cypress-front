/**
 * Page objects of home page.
 */
export class HomePage {
  // TODO: Mutualiser avec searchpage
  private subjectTextField = () => cy.get("[data-cy='search-text-field']");
  private locationTextField = () => cy.get("[data-cy='location-text-field']");
  // If connected to home page, the main part is present
  static readonly sasHomeSelector: string = ".sas-home-wrapper-connected";
  static readonly checkLoggedInParam: string = "check_logged_in";

  /**
   * Navigate to home page.
   */
  navigateTo(): void {
    cy.navigateTo("/");
  }

  /**
   * Perform a search with subject and location with 'Enter' key.
   *
   * @param search - Search subject
   * @param location - Search location
   */
  search(search: string, location: string): void {
    this.subjectTextField().type(search);
    this.locationTextField().type(location + "{enter}");
  }

  /**
   * Is OK if the current page is the homePage = baseUrl + /
   * or is baseUrl + ?check_logged_in=1
   * Expected values :
   *  https://sas.sante.fr/
   *  https://sas.sante.fr/?check_logged_in=1
   **/
  static isCurrentPage(): void {
    cy.get(this.sasHomeSelector).should("exist");

    const pathToMatch = new RegExp(
      "\\/(\\?" + this.checkLoggedInParam + "\\=1)*$",
    );
    cy.url().should("contain", Cypress.config("baseUrl"));
    cy.url().should("match", pathToMatch);
  }
}
