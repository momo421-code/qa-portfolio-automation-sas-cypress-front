import {
  After,
  Given,
  Then,
  When,
} from "@badeball/cypress-cucumber-preprocessor";

import { HealthOfferType } from "../../../../shared/healthOffer/healthOfferType";
import { accountFixtureUtils } from "../../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";
import { AvailabilityEditionPage } from "../../../../page-objects/pages/availabilityEdition.page";
import {
  AdditionalDataEditionPopInComponent,
  EditionOption,
} from "../../../../page-objects/components/additionalDataFromCalendar/additionalDataEditionPopInComponent";
import { DateUtils } from "../../../../support/utils/dateUtils";
import { LoginPanel } from "../../../../page-objects/panels/login.panel";
import { ResultsPage } from "../../../../page-objects/pages/results.page";
import { CardComponent } from "../../../../page-objects/components/searchPage/card.component";
import { StructureManagerDashboardPage } from "../../../../page-objects/pages/structureManagerDashboard.page";
import { EffectorDashboardPage } from "../../../../page-objects/pages/effectorDashboard.page";

const effectorDashboardPage: EffectorDashboardPage =
  new EffectorDashboardPage();
const structureManagerDashboardPage: StructureManagerDashboardPage =
  new StructureManagerDashboardPage();

// region Availability edition
// region Teardown
After({ tags: "@teardown_ps_additional_data_removal" }, (): void => {
  cy.get("@userAlias").then((userAlias) => {
    const userAliasString = userAlias.toString();
    LoginPanel.disconnect();
    cy.logIn(userAliasString);

    cy.get("@locationId").then((locationId) => {
      // TODO: Mutualise with Cucumber method.
      effectorDashboardPage.navigateTo();
      const address: string = accountFixtureUtils.getAddressById(
        userAliasString,
        HealthOfferType.PRACTICE_LOCATION,
        parseInt(locationId.toString()),
      );
      effectorDashboardPage.accessAvailabilityEditionPage(address);

      deleteAvailabilityEditionAdditionalData();
    });
  });
});

After({ tags: "@teardown_center_additional_data_addition" }, (): void => {
  cy.get("@userAlias").then((userAlias) => {
    const userAliasString = userAlias.toString();
    LoginPanel.disconnect();
    cy.logIn(userAliasString);

    cy.get("@locationId").then((locationId) => {
      // TODO: Mutualise with Cucumber method.
      structureManagerDashboardPage.navigateTo(
        HealthOfferType.HEALTH_CENTER,
        true,
      );
      const address: string = accountFixtureUtils.getAddressById(
        userAliasString,
        HealthOfferType.HEALTH_CENTER,
        parseInt(locationId.toString()),
      );

      structureManagerDashboardPage.accessAvailabilityEditionPage(address);

      editAvailabilityEditionAdditionalData(
        "Teardown center additional data addition",
      );
    });
  });
});

After({ tags: "@teardown_sos_additional_data_addition" }, (): void => {
  cy.get("@userAlias").then((userAlias) => {
    const userAliasString = userAlias.toString();
    LoginPanel.disconnect();
    cy.logIn(userAliasString);
    structureManagerDashboardPage.navigateTo(
      HealthOfferType.SOS_GUARD_FIX_POINT,
      false,
    );

    cy.get("@pointId").then((pointId) => {
      cy.get("@associationId").then((associationId) => {
        // TODO: Mutualise with Cucumber method.
        const address = accountFixtureUtils
          .getUniqueSubLocationInfoByTypeAndIdFixGuardPoint(
            userAliasString,
            parseInt(associationId.toString()),
            parseInt(pointId.toString()),
          )
          .getAddress()
          .getFullAddress();

        effectorDashboardPage.openAdditionalDataPopIn(address);
        AdditionalDataEditionPopInComponent.clearAndUpdate(
          "Teardown SOS additional data addition",
        );
      });
    });
  });
});
// endregion

Given(
  /^l'effecteur "(.+)" sur l'édition de l'information complémentaire depuis l'agenda de son lieu d'exercice "(.+)"$/,
  function (userAlias: string, locationId: string) {
    this.userAlias = userAlias;
    this.locationId = locationId;

    cy.accessToAvailabilityEditionPage(
      HealthOfferType.PRACTICE_LOCATION,
      userAlias,
      accountFixtureUtils.getAddressById(
        userAlias,
        HealthOfferType.PRACTICE_LOCATION,
        locationId,
      ),
      true,
    );

    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.reset();
  },
);

When(
  /^il modifie ses informations complémentaires en page d'édition des disponibilités$/,
  editAvailabilityEditionAdditionalData,
);

function editAvailabilityEditionAdditionalData(additionalData: string) {
  this.additionalData = additionalData.replace(
    "[date]",
    DateUtils.getDateFromToday("J", "DD/MM/YYYY HH:mm:ss.SSS"),
  );

  AvailabilityEditionPage.openAdditionalDataPopIn();
  AdditionalDataEditionPopInComponent.clearAndUpdate(this.additionalData);
}

When(
  /^il supprime ses informations complémentaires en page d'édition des disponibilités$/,
  deleteAvailabilityEditionAdditionalData,
);

function deleteAvailabilityEditionAdditionalData() {
  AvailabilityEditionPage.openAdditionalDataPopIn();
  AdditionalDataEditionPopInComponent.emptyAndSave();
}
// endregion

// region Dashboard
When(
  /^il modifie ses informations complémentaires de son lieu d'exercice (\d+) à partir du dashboard$/,
  function (locationId: number, additionalData: string) {
    this.locationId = locationId;
    cy.wrap(this.locationId).as("locationId");
    this.search = accountFixtureUtils.getFullUserName(this.userAlias);
    this.address = accountFixtureUtils.getAddressById(
      this.userAlias,
      HealthOfferType.PRACTICE_LOCATION,
      locationId,
    );
    this.additionalData = additionalData.replace(
      "[date]",
      DateUtils.getDateFromToday("J", "DD/MM/YYYY HH:mm:ss.SSS"),
    );

    effectorDashboardPage.openAdditionalDataPopIn(this.address);
    AdditionalDataEditionPopInComponent.clearAndUpdate(this.additionalData);
  },
);

When(
  /^il supprime ses informations complémentaires du PFG (\d+) de son association SOS Médecins (\d+) à partir du dashboard$/,
  function (pointId: string, associationId: string) {
    this.healthOfferType = HealthOfferType.SOS_GUARD_FIX_POINT;
    cy.wrap(pointId).as("pointId");
    cy.wrap(associationId).as("associationId");
    this.search = accountFixtureUtils
      .getUniqueSubLocationInfoByTypeAndIdFixGuardPoint(
        this.userAlias,
        associationId,
        pointId,
      )
      .getName();
    this.address = accountFixtureUtils
      .getUniqueSubLocationInfoByTypeAndIdFixGuardPoint(
        this.userAlias,
        associationId,
        pointId,
      )
      .getAddress()
      .getFullAddress();

    effectorDashboardPage.openAdditionalDataPopIn(this.address);
    AdditionalDataEditionPopInComponent.emptyAndSave();
  },
);

Then(
  /^les informations complémentaires sont absentes du dashboard$/,
  function () {
    effectorDashboardPage.openAdditionalDataPopIn(this.address);
    AdditionalDataEditionPopInComponent.getText().should("be.empty");
    AdditionalDataEditionPopInComponent.close();
  },
);
// endregion

Then(
  /^les informations complémentaires sont mises à jour en page d'édition des disponibilités$/,
  function () {
    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.getText().should(
      "eq",
      this.additionalData,
    );
    AdditionalDataEditionPopInComponent.close();
  },
);

Then(
  /^les informations complémentaires sont mises à jour dans le dashboard$/,
  function () {
    effectorDashboardPage.openAdditionalDataPopIn(this.address);
    AdditionalDataEditionPopInComponent.getText().should(
      "eq",
      this.additionalData,
    );
    AdditionalDataEditionPopInComponent.close();
  },
);

Then(
  /^les informations complémentaires sont absentes en page d'édition des disponibilités$/,
  function () {
    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.getText().should("be.empty");
    AdditionalDataEditionPopInComponent.close();
  },
);

Then(
  /^les informations complémentaires sont mises à jour en page de résultats visibles par le régulateur "([^"]*)"$/,
  function (regulatorAlias: string) {
    const location: string =
      this.healthOfferType === HealthOfferType.SOS_GUARD_FIX_POINT
        ? ""
        : this.address;

    LoginPanel.disconnect();
    cy.logIn(regulatorAlias);

    ResultsPage.navigateToLoadedPage(this.search, this.address);
    CardComponent.checkAdditionalDataIndexedCorrectly(
      CardComponent.getHealthOfferCardSelector(this.search, location),
      this.additionalData,
      true,
    ).should(
      "eq",
      true,
      `The additional data should be the one expected : ${this.additionalData}`,
    );
  },
);

Then(
  /^les informations complémentaires sont absentes en page de résultats visibles par le régulateur "([^"]*)"$/,
  function (regulatorAlias: string) {
    const location: string =
      this.healthOfferType === HealthOfferType.SOS_GUARD_FIX_POINT
        ? ""
        : this.address;

    LoginPanel.disconnect();
    cy.logIn(regulatorAlias);

    ResultsPage.navigateToLoadedPage(this.search, this.address);
    CardComponent.checkAdditionalDataIndexedCorrectly(
      CardComponent.getHealthOfferCardSelector(this.search, location),
      this.additionalData,
      false,
    ).should(
      "eq",
      true,
      `The additional data should be absent : ${this.additionalData}`,
    );
  },
);

When(
  /^il supprime le contenu de l'information complémentaire et (.+)$/,
  function (actionName: string) {
    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.readContent().then((text0) => {
      AdditionalDataEditionPopInComponent.clear(
        getEditionOptionFromStepName(actionName),
      );
      this.text1 = text0;
      this.text2 = "";
    });
  },
);

When(
  /^il ajoute "(.*)" au texte d'origine et (.+)$/,
  function (text: string, actionName: string) {
    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.readContent().then((text0) => {
      AdditionalDataEditionPopInComponent.append(
        text,
        getEditionOptionFromStepName(actionName),
      );
      this.text1 = text0;
      this.text2 = text;
    });
  },
);

Then(/^l'information complémentaire est vide$/, function () {
  AvailabilityEditionPage.openAdditionalDataPopIn();
  AdditionalDataEditionPopInComponent.checkContent("");
});

Then(
  /^l'information complémentaire contient "(.*)"$/,
  function (expectedText: string) {
    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.checkContent(expectedText);
  },
);

Given(
  /^le gestionnaire de structure "(.+)" sur l'édition de l'information complémentaire réinitialisée depuis l'agenda du Centre de Santé "(.+)"$/,
  function (userAlias: string, locationId: string) {
    cy.accessToAvailabilityEditionPage(
      HealthOfferType.HEALTH_CENTER,
      userAlias,
      accountFixtureUtils.getAddressById(
        userAlias,
        HealthOfferType.HEALTH_CENTER,
        locationId,
      ),
      true,
    );
    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.reset();
  },
);

Given(
  /^le gestionnaire de structure "(.+)" sur l'édition de l'information complémentaire réinitialisée depuis l'agenda du PFG "(.+)" de l'association SOS Médecins "(.+)"$/,
  function (userAlias: string, locationId: string, pfgId: string) {
    cy.accessToAvailabilityEditionPage(
      HealthOfferType.SOS_GUARD_FIX_POINT,
      userAlias,
      accountFixtureUtils
        .getUniqueSubLocationInfoByTypeAndIdFixGuardPoint(
          userAlias,
          locationId,
          pfgId,
        )
        .getAddress()
        .getFullAddress(),
      true,
    );

    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.reset();
  },
);

When(
  /^il remplace le texte d'origine par "(.*)" et (.+)$/,
  function (text: string, actionName: string) {
    AvailabilityEditionPage.openAdditionalDataPopIn();

    AdditionalDataEditionPopInComponent.readContent().then((text0) => {
      AdditionalDataEditionPopInComponent.replace(
        text,
        getEditionOptionFromStepName(actionName),
      );
      this.text1 = text0;
      this.text2 = text;
    });
  },
);

Then(
  /^l'information complémentaire est modifiée avec le contenu$/,
  function () {
    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.checkContent(this.text2);
  },
);

Then(
  /^l'information complémentaire est complétée avec le texte ajouté$/,
  function () {
    AvailabilityEditionPage.openAdditionalDataPopIn();
    AdditionalDataEditionPopInComponent.checkContent(this.text1 + this.text2);
  },
);

Then(/^l'information complémentaire est inchangée$/, function () {
  AvailabilityEditionPage.openAdditionalDataPopIn();
  AdditionalDataEditionPopInComponent.checkContent(this.text1);
});

function getEditionOptionFromStepName(actionName: string): EditionOption {
  switch (actionName) {
    case "enregistre":
      return EditionOption.SAVE;
    case "annule":
      return EditionOption.CANCEL;
    case "ne fait rien":
      return EditionOption.NONE;
    case "ferme":
      return EditionOption.CLOSE;
    default:
      return EditionOption.NONE;
  }
}
