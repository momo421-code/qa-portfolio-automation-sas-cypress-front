import { DateUtils } from "../../support/utils/dateUtils";
import { PractitionerSlotsRequests } from "../../shared/requests/practitionerSlotsRequests";
import { SolrRequests } from "../../shared/requests/solrRequests";
import {
  CustomEvent,
  ResultsPageCustomEvents,
} from "../../shared/requests/customEvents";
import { LoaderComponent } from "../components/searchPage/loader.component";
import Chainable = Cypress.Chainable;

export let currentTimeFormatted: string;

enum LrmErrorMessages {
  PRACTITIONER_EMPTY = "^Le médecin traitant n'a pas été renseigné(.*)",
  PRACTITIONER_NOT_FOUND = "^Le médecin traitant renseigné (.*) n'a pas pu être identifié$",
  SAMU_NOT_FOUND = "^Le flux entre le logiciel de régulation médicale(.*) est désactivé(.*)$",
}

/**
 * Page objects of search result page.
 * This page contains these components:
 * - Result card
 * - Loader
 * - Pagination
 * - Filters
 */
export class ResultsPage {
  static readonly searchUrlPart: string = "/sas/recherche";
  //region Selectors
  static readonly samuErrorBlocSelector: string = ".noresult-block";
  static readonly samuErrorBloc = () => cy.get(this.samuErrorBlocSelector);
  static readonly subTitle = () => cy.get(".search-header--subtitle");
  //endregion
  //region ACCESS
  /**
   * URL part to access results page.
   *
   * @param search - Search subject
   * @param location - Search location
   * @returns URL part
   */
  static pageUrl = (search: string, location: string): string =>
    `${ResultsPage.searchUrlPart}?text=${encodeURIComponent(search)}&loc=${encodeURIComponent(location)}`;

  /**
   * Navigate to search page with defined search and location.
   *
   * @param search - Search subject
   * @param location - Search location
   */
  static navigateTo(search: string, location: string): void {
    cy.navigateTo(this.pageUrl(search, location));
  }

  /**
   * Navigate to loaded search page with defined search and location.
   *
   * Define actual time when arriving at results page, to be used in another method.
   * Intercept SolR and practitioner slots requests to be used in another method.
   *
   * @param search - Search subject
   * @param location - Search location
   */
  static navigateToLoadedPage(search: string, location: string): void {
    this.navigateTo(search, location);

    currentTimeFormatted = DateUtils.getCurrentTimeFormatted();
    SolrRequests.intercept();
    PractitionerSlotsRequests.intercept();

    ResultsPage.awaitFirstPageResults();
  }

  //endregion
  /**
   * Home page redirection, no results, wrong geolocation and wrong samu name for LRM are managed.
   */
  static awaitFirstPageResults(): void {
    cy.url().then((url: string) => {
      if (url.includes("recherche")) {
        this.hasGeolocation().then((hasLocation) => {
          if (hasLocation) {
            cy.get("body").then(($body) => {
              if (!$body.find(ResultsPage.samuErrorBlocSelector).length) {
                CustomEvent.awaitRace(
                  [
                    ResultsPageCustomEvents.HAS_FIRST_ELEMENT,
                    ResultsPageCustomEvents.HAS_ALL_RESULTS,
                    ResultsPageCustomEvents.HAS_NO_RESULTS,
                  ],
                  Cypress.env("resultPageTimeout"),
                );
              }
            });
          }
        });
      }
    });
    LoaderComponent.waitForDisappearing();
  }

  static hasGeolocation(): Chainable<boolean> {
    return cy.window().then((win) => {
      return (
        win?.drupalSettings?.sas_vuejs?.parameters?.location_status ?? false
      );
    });
  }

  /**
   * Reload page and wait for result loader to disappear.
   */
  static reload(): void {
    cy.reload();
    ResultsPage.awaitFirstPageResults();
  }

  //region Error messages
  static preferredPractitionerIsUnknown(): void {
    ResultsPage.subTitle()
      .contains(new RegExp(LrmErrorMessages.PRACTITIONER_NOT_FOUND))
      .should("be.visible");
  }

  static isMainErrorPresent(): void {
    ResultsPage.samuErrorBloc().contains(
      new RegExp(LrmErrorMessages.SAMU_NOT_FOUND),
    );
  }

  //endregion

  //region LRM
  private static lrmPageUrl = (lrmArgsString: string): string => {
    return `${ResultsPage.searchUrlPart}?${lrmArgsString}`;
  };

  /**
   * Navigate to a page with the specified path, if already connected
   * @param lrmUrlPart
   */
  static lrmNavigateToLoadedPage(lrmUrlPart: string): void {
    cy.navigateTo(ResultsPage.lrmPageUrl(lrmUrlPart));
    ResultsPage.awaitFirstPageResults();
  }

  //endregion
}
