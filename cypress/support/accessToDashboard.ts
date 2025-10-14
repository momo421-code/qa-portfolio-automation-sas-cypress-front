import { EffectorDashboardPage } from "../page-objects/pages/effectorDashboard.page";
import { StructureManagerDashboardPage } from "../page-objects/pages/structureManagerDashboard.page";
import { HealthOfferType } from "../shared/healthOffer/healthOfferType";

const effectorDashboardPage: EffectorDashboardPage =
  new EffectorDashboardPage();
const structureManagerDashboardPage: StructureManagerDashboardPage =
  new StructureManagerDashboardPage();

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Access to specific edit availability page of an effector workplace or a structure manager's structure.
       *
       * @param healthOfferType
       * @param userAlias - Effector or structure manager's account name
       * @param address - Effector's workplace or structure manager's structure address
       * @param withSession - option to create a cypress session
       */
      accessToAvailabilityEditionPage(
        healthOfferType: HealthOfferType,
        userAlias: string,
        address: string,
        withSession?: boolean,
      ): Chainable<JQuery>;
    }
  }
}

Cypress.Commands.add(
  "accessToAvailabilityEditionPage",
  (
    healthOfferType: HealthOfferType,
    userAlias: string,
    address: string,
    withSession: boolean = false,
  ): void => {
    if (withSession) {
      cy.logInWithSession(userAlias);
    } else cy.logIn(userAlias);

    if (healthOfferType == HealthOfferType.PRACTICE_LOCATION) {
      effectorDashboardPage.navigateTo();
      effectorDashboardPage.accessAvailabilityEditionPage(address);
      EffectorDashboardPage.awaitDashboardLoad();
    } else {
      structureManagerDashboardPage.navigateTo(healthOfferType, true);
      structureManagerDashboardPage.accessAvailabilityEditionPage(address);
      StructureManagerDashboardPage.awaitDashboardLoad();
    }

    // TODO: Replace with a synchronisation for waiting to JS to finish / scroll to availability.
    // TODO : attendre que le bas de page <footer> soit visible ?
    cy.wait(2000);
  },
);
