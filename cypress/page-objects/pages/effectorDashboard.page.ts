import { UserDashboardPage } from "./userDashboard.page";

export class EffectorDashboardPage extends UserDashboardPage {
  workplaceSectionSelector: string = "[data-cy='address-bloc']";
  protected editAvailabilityButtonSelector: string =
    "[data-cy='acccess-availability-edition-button']";

  navigateTo(): void {
    cy.navigateTo("/sas/dashboard");
  }
}
