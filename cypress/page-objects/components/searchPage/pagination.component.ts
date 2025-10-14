import { LoaderComponent } from "./loader.component";

/**
 * Page objects of pagination bar in result page.
 */
export class PaginationComponent {
  //region SELECTOR
  private static firstPageButton = () =>
    cy.get("[data-cy='first-page-button']");
  private static lastPageButton = () => cy.get("[data-cy='last-page-button']");
  private static nextPageButtonSelector: string =
    "[data-cy='next-page-button'] button";
  private static nextPageButton = () => cy.get(this.nextPageButtonSelector);
  private static pageNumButton = (pageNum: number) =>
    cy
      .get("[data-cy='page-number-button']")
      .contains(RegExp("\\s" + pageNum + "$"));

  //endregion

  //region ARROWS
  static goToFirstPage(): void {
    this.firstPageButton().click();
  }

  static goToLastPage(): void {
    this.lastPageButton().click();
  }

  /**
   * Access to next page by clicking the corresponding button,
   * if it exists and if it is not disabled.
   *
   * Returns if it exits and not disabled or else.
   */
  static goToNextPage(): Cypress.Chainable<boolean> {
    return cy
      .elementExists(this.nextPageButtonSelector)
      .then((elementExists: boolean): Cypress.Chainable<boolean> => {
        if (elementExists) {
          return this.nextPageButton().then(
            ($nextPageButton: JQuery): Cypress.Chainable<boolean> => {
              if ($nextPageButton.is(":disabled")) {
                return cy.wrap(false);
              } else {
                cy.wrap($nextPageButton).click();
                LoaderComponent.waitForDisappearing();
                return cy.wrap(true);
              }
            },
          );
        } else {
          return cy.wrap(false);
        }
      });
  }

  //endregion

  //region NUMBERS
  /**
   * Click on a specific page number.
   *
   * @param pageNumber - This page number should be visible.
   */
  static gotoPageNumber(pageNumber: number): void {
    this.pageNumButton(pageNumber).click();
  }

  //endregion
}
