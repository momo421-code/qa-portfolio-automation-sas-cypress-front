import { UserDashboardPage } from "./userDashboard.page";
import { HealthOfferType } from "../../shared/healthOffer/healthOfferType";
import { LoginPanel } from "../panels/login.panel";
import { HomePage } from "./home.page";
import { EffectorDashboardPage } from "./effectorDashboard.page";

export class StructureManagerDashboardPage extends UserDashboardPage {
  private readonly homePage: HomePage = new HomePage();

  workplaceSectionSelector: string[] = [
    ".card-address",
    "[data-cy='address-bloc']",
  ];
  protected editAvailabilityButtonSelector: string =
    ".btn-edit-dispo, [data-cy='acccess-availability-edition-button']";
  protected static cptsSection = (cptsName: string) =>
    cy.get(`.cpts-group:has(.title-section-cpts:contains(${cptsName}))`);
  protected static healthProLine = (cptsName: string, healthProName: string) =>
    this.cptsSection(cptsName).find(` .ps-item:contains(${healthProName})`);
  protected static healthProDashboardButton = (
    cptsName: string,
    healthProName: string,
  ) => this.healthProLine(cptsName, healthProName).find(".ps-profile");

  /**
   * For structure manager, access to SOS Médecins associations dashboard if there is this type of structure linked to the account,
   * otherwise access to structure dashboard.
   */
  navigateTo(
    healthOfferType: HealthOfferType,
    accessToLinkedStructuresDashboard: boolean,
  ): void {
    if (healthOfferType === HealthOfferType.SOS_GUARD_FIX_POINT) {
      cy.navigateTo("/sas/dashboard");
    } else {
      this.homePage.navigateTo();
      if (accessToLinkedStructuresDashboard) {
        LoginPanel.accessToLinkedStructuresDashboard();
      }
    }
  }

  static accessToEffectorCptsDashboard(
    cptsName: string,
    healthProName: string,
  ) {
    this.healthProDashboardButton(cptsName, healthProName).click();
    EffectorDashboardPage.awaitDashboardLoad();
  }
}
