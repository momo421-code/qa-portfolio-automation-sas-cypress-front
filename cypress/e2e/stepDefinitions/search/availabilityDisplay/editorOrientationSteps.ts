import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { ResultsPage } from "../../../../page-objects/pages/results.page";
import { CardComponent } from "../../../../page-objects/components/searchPage/card.component";
import {
  IndividualHealthProFixtureUtils,
  SosDoctorsFixtureUtils,
} from "../../../../support/utils/fixtureUtils/editorData/individualHealthProFixtureUtils";

before(() => {
  IndividualHealthProFixtureUtils.loadData();
  SosDoctorsFixtureUtils.loadData();
});

Given(
  /^l'utilisateur sur la page de résultats remontant le lieu d'exercice (\d+) du PS individuel interfacé "([^"]*)"$/,
  function (locationId: number, healthProAlias: string) {
    this.psIndivData =
      IndividualHealthProFixtureUtils.getHealthProData(healthProAlias);
    this.psIndivHealthLocation =
      IndividualHealthProFixtureUtils.getHealthProLocationData(
        this.psIndivData,
        locationId,
      );

    this.search = `${this.psIndivData.practitioner.lastname} ${this.psIndivData.practitioner.firstnames.join(" ")}`;
    this.address = `${this.psIndivHealthLocation.line}, ${this.psIndivHealthLocation.postal_code} ${this.psIndivHealthLocation.city}`;

    ResultsPage.navigateToLoadedPage(this.search, this.address);
  },
);

Given(
  /^l'utilisateur sur la page de résultats remontant le point fixe "([^"]*)" de l'association SOS Médecins interfacée "([^"]*)"$/,
  function (sosDoctorFixPointName: string, sosDoctorAssociationName: string) {
    this.sosDoctorAssociationData =
      SosDoctorsFixtureUtils.getSosDoctorsAssociationData(
        sosDoctorAssociationName,
      );
    this.sosDoctorFixPointData =
      SosDoctorsFixtureUtils.getSosDoctorFixPointData(
        this.sosDoctorAssociationData,
        sosDoctorFixPointName,
      );

    this.search = this.sosDoctorAssociationData.organization.name;
    this.address = this.sosDoctorFixPointData.city;

    ResultsPage.navigateToLoadedPage(this.search, this.address);
  },
);

Then(
  /^le premier créneau éditeur de ce résultat a un lien vers l'éditeur et l'origine attendus$/,
  function () {
    const link =
      this.psIndivHealthLocation?.slot_configuration.comment ||
      this.sosDoctorFixPointData.slot_configuration.comment;
    CardComponent.getFirstAvailabilityLink(this.search, this.address).should(
      "eq",
      `${link}?origin=sas-${Cypress.env("environmentName")}`,
      "First editor slot link has to equal link from editor plus expected origin.",
    );
  },
);
