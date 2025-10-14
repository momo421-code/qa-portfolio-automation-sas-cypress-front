import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { After } from "@badeball/cypress-cucumber-preprocessor";
import { DashboardSasParametersComponent } from "../../../page-objects/components/dashboardPage/dashboardSasParametersComponent";
import { StructureDashboardSasParametersComponent } from "../../../page-objects/components/dashboardPage/structureDashboardSasParametersComponent";
import { StructureManagerDashboardPage } from "../../../page-objects/pages/structureManagerDashboard.page";
import { DataTable } from "@cucumber/cucumber";
import { DataTableUtils } from "../../../support/utils/dataTableUtils";
import { CardComponent } from "../../../page-objects/components/searchPage/card.component";
import { EffectorDashboardPage } from "../../../page-objects/pages/effectorDashboard.page";
import { HealthOfferType } from "../../../shared/healthOffer/healthOfferType";
import { LoginPanel } from "../../../page-objects/panels/login.panel";
import { accountFixtureUtils } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";
import { ResultsPage } from "../../../page-objects/pages/results.page";

const dashboardParametersComponent: DashboardSasParametersComponent =
  new DashboardSasParametersComponent();
const structureDashboardParametersComponent: StructureDashboardSasParametersComponent =
  new StructureDashboardSasParametersComponent();
const effectorDashboardPage: EffectorDashboardPage =
  new EffectorDashboardPage();
const structureManagerDashboardPage: StructureManagerDashboardPage =
  new StructureManagerDashboardPage();

Given(/^l'effecteur est sur son dashboard$/, function () {
  effectorDashboardPage.navigateTo();
  EffectorDashboardPage.awaitDashboardLoad();
});

Given(/^le gestionnaire de structure CDS est sur son dashboard$/, function () {
  structureManagerDashboardPage.navigateTo(
    HealthOfferType.HEALTH_CENTER,
    false,
  );
});

Given(/^le gestionnaire de structure SOS est sur son dashboard$/, function () {
  structureManagerDashboardPage.navigateTo(
    HealthOfferType.SOS_GUARD_FIX_POINT,
    false,
  );
});

When(/^il désactive l'affichage des créneaux éditeurs$/, function () {
  dashboardParametersComponent.openParametersPopIn();
  dashboardParametersComponent.selectIndividualSasParticipationWithoutSoftware();
});

Then(
  /^les créneaux éditeurs ne sont pas visibles sur son lieu d'exercice (\d+) en page de résultats via le régulateur "([^"]*)"$/,
  function (locationId: number, regulatorAlias: string) {
    LoginPanel.disconnect();
    cy.logIn(regulatorAlias);

    this.search = accountFixtureUtils.getFullUserName(this.userAlias);
    this.address = accountFixtureUtils.getAddressById(
      this.userAlias,
      HealthOfferType.PRACTICE_LOCATION,
      locationId,
    );

    ResultsPage.navigateToLoadedPage(this.search, this.address);
    CardComponent.displayedAvailabilitiesAreExpectedTypeAfterIndexation(
      this.search,
      this.address,
      [CardComponent.editorTimeSlotSelector],
    ).should("be.false", "Not displayed availabilities");
  },
);

Then(
  /^les disponibilités SAS sont visibles sur son lieu d'exercice (\d+) en page de résultats via le régulateur "([^"]*)"$/,
  function (locationId: number, regulatorAlias: string) {
    LoginPanel.disconnect();
    cy.logIn(regulatorAlias);

    this.search = accountFixtureUtils.getFullUserName(this.userAlias);
    this.address = accountFixtureUtils.getAddressById(
      this.userAlias,
      HealthOfferType.PRACTICE_LOCATION,
      locationId,
    );

    ResultsPage.navigateToLoadedPage(this.search, this.address);
    CardComponent.displayedAvailabilitiesAreExpectedTypeAfterIndexation(
      this.search,
      this.address,
      [CardComponent.timeSlotSelector, CardComponent.timeWindowSelector],
    ).should("be.true", "Displayed availabilities should be editor type");
  },
);

Then(
  "les paramètres d'affichage des créneaux éditeurs sont enregistrés sur sa page profonde",
  (): void => {
    dashboardParametersComponent.checkThatEditorTimeSlotAreNotActivated();
    dashboardParametersComponent.checkThatSasParticipationIsActivated();
  },
);

Given(/^les paramètres SAS effecteur par défaut$/, function (): void {
  dashboardParametersComponent.openAndRestoreDefaultParameters();
});

When(
  /^il met à jour les paramètres SAS effecteur( sans sauvegarder)?$/,
  function (noSaveOption: string, sasParameters: DataTable): void {
    const sasParametersMap: Map<string, string> =
      DataTableUtils.convertDataTableToMap(sasParameters);
    this.sasParameters = sasParametersMap;

    if (noSaveOption) {
      dashboardParametersComponent.modify(sasParametersMap);
    } else {
      dashboardParametersComponent.modifyAndUpdate(sasParametersMap);
    }
  },
);

When(
  /^il met à jour les paramètres SAS gestionnaire de structure?$/,
  function (sasParameters: DataTable): void {
    const sasParametersMap: Map<string, string> =
      DataTableUtils.convertDataTableToMap(sasParameters);
    this.sasParameters = sasParametersMap;
    structureDashboardParametersComponent.modify(sasParametersMap);
  },
);

When(
  /^il enregistre les paramètres SAS gestionnaire de structure?$/,
  function (): void {
    structureDashboardParametersComponent.saveParameters();
  },
);

When(
  /^il renseigne sa participation au SAS avec solution éditeur sans préciser sa provenance$/,
  function (): void {
    dashboardParametersComponent.openParametersPopIn();
    dashboardParametersComponent.uncheckAllParametersWithoutSaving();
    dashboardParametersComponent.acceptSasParticipationWithoutDefiningType();
  },
);

When(
  /^il renseigne sa participation au SAS avec solution éditeur et en refusant d'afficher les créneaux éditeurs$/,
  function (): void {
    dashboardParametersComponent.openParametersPopIn();
    dashboardParametersComponent.uncheckAllParametersWithoutSaving();
    dashboardParametersComponent.acceptSasParticipationWithoutEditorTimeSlots();
  },
);

Then(
  /^les paramètres SAS effecteur ont les informations attendues$/,
  function (): void {
    dashboardParametersComponent.isConfigSaved(this.sasParameters);
  },
);

Then(
  "le PS participant au SAS est présent sur la liste du dashboard de son gestionnaire de structure",
  function (dataTable: DataTable) {
    const rows = dataTable.hashes(); // [{ Nom: "Dr Mounier Lisa" }, ...]
    if (rows.length === 0 || !rows[0].Nom) {
      throw new Error(
        "Le champ 'Nom' est requis pour vérifier la présence du praticien dans le dashboard.",
      );
    }
    const nomPraticien = rows[0].Nom;

    const dashboardComponent = new DashboardSasParametersComponent();
    dashboardComponent.verifyParticipantInDashboardList(nomPraticien);
  },
);

Given(
  /^l'utilisateur "([^"]*)" met à jour ses paramètres SAS effecteur$/,
  function (userAlias: string, sasParameters: DataTable) {
    const sasParametersMap: Map<string, string> =
      DataTableUtils.convertDataTableToMap(sasParameters);

    cy.logIn(userAlias);
    effectorDashboardPage.navigateTo();
    dashboardParametersComponent.openAndRestoreDefaultParameters();
    dashboardParametersComponent.modifyAndUpdate(sasParametersMap);
    LoginPanel.disconnect();
  },
);

When(
  /^l'effecteur met à jour ses paramètres SAS$/,
  function (sasParameters: DataTable) {
    const sasParametersMap: Map<string, string> =
      DataTableUtils.convertDataTableToMap(sasParameters);

    dashboardParametersComponent.modifyAndUpdate(sasParametersMap);
  },
);

Then(
  /^le message d'erreur de non sélection d'une MSP est présent$/,
  function (): void {
    const expectedMsg: string =
      "Veuillez sélectionner une MSP dans les suggestions qui vous sont proposées.";
    dashboardParametersComponent.verifyErrorMessage(expectedMsg);
  },
);

Then(/^il ne peut pas sauvegarder les paramètres SAS effecteur$/, function () {
  dashboardParametersComponent.submitButton().should("have.attr", "disabled");
});

Then(/^il n'est pas possible de définir des solutions éditeur$/, function () {
  dashboardParametersComponent.editorsDropdownButton().should("not.exist");
});

Then(
  /^il ne peut pas sauvegarder les paramètres SAS gestionnaire de structure$/,
  function (): void {
    structureDashboardParametersComponent
      .submitButton()
      .should("have.attr", "disabled");
  },
);

Then(
  /^le nombre de professionnels de santé enregistré est à (\d+)$/,
  function (practitionerNumber: number): void {
    structureDashboardParametersComponent.checkThatSasParticipatingPractitionerNumberIs(
      practitionerNumber,
    );
  },
);

Then(/^il ne peut pas participer au SAS$/, function (): void {
  structureDashboardParametersComponent.sasParticipationCheckboxIsNotVisible();
});

After({ tags: "@teardown_set_sas_parameters_back" }, (): void => {
  structureDashboardParametersComponent.closeParametersPopIn();
  const sasParametersMap: Map<string, string> = new Map<string, string>([
    ["Nombre de PS participant", "1"],
    ["Acceptation orientation surnuméraire", "Oui"],
    ["Déclaration sur l'honneur", "Oui"],
  ]);
  structureDashboardParametersComponent.modify(sasParametersMap);
  structureDashboardParametersComponent.saveParameters();
});
