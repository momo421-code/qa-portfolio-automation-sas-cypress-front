import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { HomePage } from "../../../page-objects/pages/home.page";
import { ResultsPage } from "../../../page-objects/pages/results.page";
import { SearchPanel } from "../../../page-objects/panels/search.panel";
import { LocationInfoClass } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureData";
import { HealthOfferType } from "../../../shared/healthOffer/healthOfferType";
import { accountFixtureUtils } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";
import { CardComponent } from "../../../page-objects/components/searchPage/card.component";

//region Page objects
const homePage: HomePage = new HomePage();
const searchPanel: SearchPanel = new SearchPanel();
//endregion
//region ACCESS
//region General
Given(
  "l'utilisateur ayant fait une recherche {string} à {string}",
  function (search: string, location: string): void {
    ResultsPage.navigateTo(search, location);
  },
);

Given(
  "l'utilisateur sur la page de résultats {string} à {string}",
  function (search: string, location: string): void {
    ResultsPage.navigateToLoadedPage(search, location);
  },
);

Given(
  "l'utilisateur {string} sur la page de résultats {string} à {string}",
  function (userAlias: string, search: string, location: string): void {
    cy.logInWithSession(userAlias);
    ResultsPage.navigateToLoadedPage(search, location);
  },
);
//endregion

//region Health professional location
Given(
  /^l'utilisateur "([^"]*)" sur la page ayant pour résultat le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    userAlias: string,
    locationNumber: number,
    effectorAlias: string,
  ): void {
    cy.logIn(userAlias);

    this.search = accountFixtureUtils.getFullUserName(effectorAlias);
    this.address = accountFixtureUtils.getAddressById(
      effectorAlias,
      HealthOfferType.PRACTICE_LOCATION,
      locationNumber,
    );

    ResultsPage.navigateToLoadedPage(this.search, this.address);
  },
);
//endregion

//region Structure
Given(
  /^l'utilisateur "([^"]*)" sur la page ayant pour résultat le centre de santé (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    userAlias: string,
    centerNumber: number,
    structureManagerAlias: string,
  ): void {
    cy.logIn(userAlias);

    const locationInfo: LocationInfoClass =
      accountFixtureUtils.getLocationInfoById(
        structureManagerAlias,
        HealthOfferType.HEALTH_CENTER,
        centerNumber.toString(),
      );
    this.search = locationInfo.getName();
    this.address = locationInfo.getAddress().getFullAddress();

    ResultsPage.navigateToLoadedPage(this.search, this.address);
  },
);

Given(
  /^l'utilisateur "([^"]*)" sur la page ayant pour résultat le PFG (\d+) de l'association SOS Médecins (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    userAlias: string,
    pointNumber: number,
    associationNumber: number,
    structureManagerAlias: string,
  ): void {
    cy.logIn(userAlias);

    const location: LocationInfoClass =
      accountFixtureUtils.getUniqueSubLocationInfoByTypeAndIdFixGuardPoint(
        structureManagerAlias,
        associationNumber,
        pointNumber,
      );
    this.search = location.getName();
    this.address = location.getAddress().getFullAddress();
    this.healthOfferType = HealthOfferType.SOS_GUARD_FIX_POINT;
    ResultsPage.navigateToLoadedPage(this.search, this.address);
  },
);
//endregion

//region MSP
Given(
  /^l'utilisateur "([^"]*)" sur la page ayant pour résultat la MSP de l'effecteur "([^"]*)"$/,
  function (userAlias: string, effectorAlias: string): void {
    cy.logIn(userAlias);

    const location: LocationInfoClass =
      accountFixtureUtils.getUniqueLocationByTypeAndById(
        effectorAlias,
        HealthOfferType.MSP,
      );
    this.search = location.getName();
    this.address = location.getAddress().getFullAddress();

    ResultsPage.navigateToLoadedPage(this.search, this.address);
  },
);
//endregion
//region CPTS
Given(
  /^l'utilisateur "([^"]*)" sur la page ayant pour résultat le CPTS de l'effecteur "([^"]*)" dans le cluster associé$/,
  function (userAlias: string, effectorAlias: string): void {
    cy.logIn(userAlias);

    this.search = accountFixtureUtils.getFullUserName(effectorAlias);
    this.address = accountFixtureUtils.getAddressById(
      effectorAlias,
      HealthOfferType.PRACTICE_LOCATION,
      1,
    );

    ResultsPage.navigateToLoadedPage(this.search, this.address);
    CardComponent.enterInFirstCPTSClusterCard();
  },
);
//endregion
//endregion

//region SEARCH
When(
  /^il lance une recherche "([^"]*)" à "([^"]*)" à partir de la page d'accueil$/,
  function (search: string, location: string): void {
    this.search = search;
    this.address = location;

    homePage.navigateTo();
    homePage.search(search, location);
  },
);

When(
  /^il lance une recherche "([^"]*)" à "([^"]*)" à partir de la page de résultats$/,
  function (search: string, location: string): void {
    this.search = search;
    this.address = location;

    searchPanel.search(search, location);
  },
);

Then(
  /^il est redirigé vers la page de résultats correspondante$/,
  function (): void {
    const resultsPageUrl: string =
      Cypress.config("baseUrl") +
      ResultsPage.pageUrl(this.search, this.address);

    cy.url().should("eq", resultsPageUrl);
  },
);
//endregion
