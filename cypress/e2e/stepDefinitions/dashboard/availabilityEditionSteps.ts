import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { DataTable } from "@cucumber/cucumber";
import { LoginPanel } from "../../../page-objects/panels/login.panel";
import { HealthOfferType } from "../../../shared/healthOffer/healthOfferType";
import { DataTableUtils } from "../../../support/utils/dataTableUtils";
import { accountFixtureUtils } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";
import { Availability } from "../../../shared/availability/Availability";
import { AvailabilityType } from "../../../shared/availability/availabilityType";
import { ResultsPage } from "../../../page-objects/pages/results.page";
import { CardComponent } from "../../../page-objects/components/searchPage/card.component";
import { LocationInfoClass } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureData";
import { getExpectedResultHealthOfferAddress } from "../search/resultsSteps";
import { EffectorDashboardPage } from "../../../page-objects/pages/effectorDashboard.page";
import { EditAvailabilityModalComponent } from "../../../page-objects/components/editAvailabilyPage/editAvailabilityModal.component";
import { AvailabilityComponent } from "../../../page-objects/components/editAvailabilyPage/availability.component";
import { DateUtils } from "../../../support/utils/dateUtils";
import { StructureManagerDashboardPage } from "../../../page-objects/pages/structureManagerDashboard.page";
import { AvailabilityOptionsComponent } from "../../../page-objects/components/editAvailabilyPage/availabilityOptions.component";
import { availabilityKeys } from "../../../shared/availability/availabilityDataConfig";
import { StringUtils } from "../../../support/utils/stringUtils";
import { CalendarNavigationComponent } from "../../../page-objects/components/editAvailabilyPage/calendarNavigationBar.component";

//region PageObjects
const editAvailabilityComponent: EditAvailabilityModalComponent =
  new EditAvailabilityModalComponent();
const availabilityComponent: AvailabilityComponent =
  new AvailabilityComponent();
const availabilityOptionsComponent: AvailabilityOptionsComponent =
  new AvailabilityOptionsComponent();
const calendarNavigationComponent: CalendarNavigationComponent =
  new CalendarNavigationComponent();
const effectorDashboardPage: EffectorDashboardPage =
  new EffectorDashboardPage();
const structureManagerDashboardPage: StructureManagerDashboardPage =
  new StructureManagerDashboardPage();
//endregion

//region Availability data
export let availabilityData: Map<string, string>;

/**
 * Defines availability data to be used in another steps,
 * converted from a datatable to a Map, excluding the first row.
 *
 * @param data - Availability data.
 */
function getAvailabilityDataMap(data: DataTable): void {
  availabilityData = DataTableUtils.convertDataTableToMap(data, true);
}

//endregion

//region EDITION PAGE ACCESS
//region EFFECTOR
/**
 * Access to specific effector's availability edition page by its number.
 *
 * @param effectorAlias - Name of the effector's account.
 * @param locationNumber - ID of the location.
 */
function accessToEffectorAvailabilityEditionPage(
  effectorAlias: string,
  locationNumber: number,
): void {
  cy.accessToAvailabilityEditionPage(
    HealthOfferType.PRACTICE_LOCATION,
    effectorAlias,
    accountFixtureUtils.getAddressById(
      effectorAlias,
      HealthOfferType.PRACTICE_LOCATION,
      locationNumber,
    ),
  );
}

//endregion

//region STRUCTURE MANAGER
//region Health center
/**
 * Access to specific health center's availability edition page of structure manager by its number.
 *
 * @param userAlias - Name of the structure manager's account.
 * @param locationId - ID of the center.
 */
function accessToCenterAvailabilityEditionPage(
  userAlias: string,
  locationId: number,
): void {
  cy.accessToAvailabilityEditionPage(
    HealthOfferType.HEALTH_CENTER,
    userAlias,
    accountFixtureUtils.getAddressById(
      userAlias,
      HealthOfferType.HEALTH_CENTER,
      locationId,
    ),
  );
}

//endregion

//region SOS Médecins association
/**
 * Access to specific fix guard point's availability edition page of structure manager by its number.
 *
 * @param structureManagerAlias - Name of the structure manager's account.
 * @param associationNumber - ID of the SOS Médecins association.
 * @param pointNumber - ID of the guard fix point.
 */
function accessToFixGuardPointAvailabilityEditionPage(
  structureManagerAlias: string,
  associationNumber: number,
  pointNumber: number,
): void {
  cy.accessToAvailabilityEditionPage(
    HealthOfferType.SOS_GUARD_FIX_POINT,
    structureManagerAlias,
    accountFixtureUtils
      .getUniqueSubLocationInfoByTypeAndIdFixGuardPoint(
        structureManagerAlias,
        associationNumber,
        pointNumber,
      )
      .getAddress()
      .getFullAddress(),
  );
}

//endregion
//endregion
//endregion

//region CREATION
/**
 * Create availability after deleting all similar ones and disconnect.
 *
 * @param availabilityDeletion - Delete all similar availabilities before creating.
 */
export function createAvailability(
  availabilityDeletion: boolean = false,
): void {
  if (availabilityDeletion) {
    editAvailabilityComponent.deleteAllExistingDataset(availabilityData);
  }
  editAvailabilityComponent.createAvailability(availabilityData);

  LoginPanel.disconnect();
}

//region Effector
/**
 * Access to specific effector's availability edition page,
 * create availability after deleting all similar ones and disconnect.
 *
 * @param data - Availability data
 * @param effectorAlias
 * @param locationNumber - ID of a health professional's location.
 * @param availabilityDeletion  - Delete all similar availabilities before creating.
 */
function createAvailabilityForHealthLocation(
  data: DataTable,
  effectorAlias: string,
  locationNumber: number,
  availabilityDeletion: boolean = false,
): void {
  getAvailabilityDataMap(data);

  accessToEffectorAvailabilityEditionPage(effectorAlias, locationNumber);
  createAvailability(availabilityDeletion);
}

Given(
  /^l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice (\d+)$/,
  function (locationId: number): void {
    this.locationId = locationId;
    cy.wrap(this.locationId).as("locationId");
    this.search = accountFixtureUtils.getFullUserName(this.userAlias);
    this.address = accountFixtureUtils.getAddressById(
      this.userAlias,
      HealthOfferType.PRACTICE_LOCATION,
      locationId,
    );

    effectorDashboardPage.navigateTo();
    effectorDashboardPage.accessAvailabilityEditionPage(this.address);
  },
);

When(
  /^il créé une disponibilité sans doublon$/,
  function (availabilityDataTable: DataTable): void {
    getAvailabilityDataMap(availabilityDataTable);
    this.availabilityData = availabilityData;

    editAvailabilityComponent.deleteAllExistingDataset(availabilityData);
    editAvailabilityComponent.createAvailability(availabilityData);
  },
);

Given(
  /^la création d'une disponibilité sur le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    locationNumber: number,
    effectorAlias: string,
    data: DataTable,
  ): void {
    createAvailabilityForHealthLocation(data, effectorAlias, locationNumber);
  },
);

Given(
  /^la création d'une disponibilité sans doublon sur le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    locationNumber: number,
    effectorAlias: string,
    data: DataTable,
  ): void {
    createAvailabilityForHealthLocation(
      data,
      effectorAlias,
      locationNumber,
      true,
    );
  },
);
//endregion

//region Health center
/**
 * Access to specific effector's availability edition page,
 * create availability after deleting all similar ones and disconnect.
 *
 * @param data - Availability data
 * @param structureManagerAlias
 * @param centerNumber - ID of a health professional's location.
 * @param availabilityDeletion  - Delete all similar availabilities before creating.
 */
function createAvailabilityForHealthCenter(
  structureManagerAlias: string,
  centerNumber: number,
  data: DataTable,
  availabilityDeletion: boolean = false,
): void {
  getAvailabilityDataMap(data);

  accessToCenterAvailabilityEditionPage(structureManagerAlias, centerNumber);
  createAvailability(availabilityDeletion);
}

Given(
  /^le gestionnaire de structure sur la page d'édition des disponibilités de son centre de santé (\d+)$/,
  navigateToCenterAvailabilityEdition,
);

export function navigateToCenterAvailabilityEdition(locationId: number): void {
  this.locationId = locationId;
  cy.wrap(this.locationId).as("locationId"); // Requirement for teardown.

  this.search = accountFixtureUtils
    .getLocationInfoById(
      this.userAlias,
      HealthOfferType.HEALTH_CENTER,
      this.locationId.toString(),
    )
    .getName();
  this.address = accountFixtureUtils.getAddressById(
    this.userAlias,
    HealthOfferType.HEALTH_CENTER,
    locationId,
  );

  structureManagerDashboardPage.navigateTo(HealthOfferType.HEALTH_CENTER, true);

  structureManagerDashboardPage.accessAvailabilityEditionPage(this.address);
}

Given(
  /^la création d'une disponibilité sur le centre de santé (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (centerNumber: number, userAlias: string, data: DataTable): void {
    createAvailabilityForHealthCenter(userAlias, centerNumber, data);
  },
);

Given(
  /^la création d'une disponibilité sans doublon sur le centre de santé (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (centerNumber: number, userAlias: string, data: DataTable): void {
    createAvailabilityForHealthCenter(userAlias, centerNumber, data, true);
  },
);
//endregion

//region SOS Médecins association
/**
 * Access to specific effector's availability edition page,
 * create availability after deleting all similar ones and disconnect.
 *
 * @param data - Availability data
 * @param structureManagerAlias
 * @param associationNumber - ID of a structure manager's SOS Médecins association.
 * @param pointNumber - ID of a structure manager's fix guard point.
 * @param availabilityDeletion  - Delete all similar availabilities before creating.
 */
function createAvailabilityForFixGuardPoint(
  structureManagerAlias: string,
  associationNumber: number,
  pointNumber: number,
  data: DataTable,
  availabilityDeletion: boolean = false,
): void {
  getAvailabilityDataMap(data);

  accessToFixGuardPointAvailabilityEditionPage(
    structureManagerAlias,
    associationNumber,
    pointNumber,
  );
  createAvailability(availabilityDeletion);
}

Given(
  /^le gestionnaire de structure sur la page d'édition des disponibilités du PFG (\d+) de son association SOS Médecins (\d+)$/,
  function (pointId: number, associationId: number): void {
    this.healthOfferType = HealthOfferType.SOS_GUARD_FIX_POINT;
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

    structureManagerDashboardPage.navigateTo(this.healthOfferType, true);

    structureManagerDashboardPage.accessAvailabilityEditionPage(this.address);
  },
);

Given(
  /^la création d'une disponibilité sur le PFG (\d+) de l'association SOS Médecins (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    pointNumber: number,
    associationNumber: number,
    userAlias: string,
    data: DataTable,
  ): void {
    createAvailabilityForFixGuardPoint(
      userAlias,
      associationNumber,
      pointNumber,
      data,
    );
  },
);

Given(
  /^la création d'une disponibilité sans doublon sur le PFG (\d+) de l'association SOS Médecins (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    pointNumber: number,
    associationNumber: number,
    userAlias: string,
    data: DataTable,
  ): void {
    createAvailabilityForFixGuardPoint(
      userAlias,
      associationNumber,
      pointNumber,
      data,
      true,
    );
  },
);
//endregion
Then(
  /^la disponibilité est créée avec les informations attendues$/,
  function (): void {
    const availability: Availability = Availability.create(
      this.availabilityData,
    );
    const availabilitySelector: string = availabilityComponent.getSelector(
      availability.type,
      Availability.getTimeRange(availability),
      availability.date,
    );

    availabilityOptionsComponent.openModificationModal(
      availabilitySelector,
      availability.date,
    );

    editAvailabilityComponent.checkAvailabilityValues(
      DateUtils.getRelativeDateForDatePicker(availability.date),
      availability.startTime,
      availability.endTime,
      availability.type,
      availability.patientAmount,
      availability.consultationModalities,
    );
  },
);

Then(
  /^les récurrences de la disponibilité sont créées avec les informations attendues sur au moins (\d+) semaines$/,
  function (weekAmount: number): void {
    const availability: Availability = Availability.create(
      this.availabilityData,
    );
    for (let i = 0; i < weekAmount; i++) {
      StringUtils.getElemAsArray(
        availabilityData.get(availabilityKeys.RECURRENCE_DAYS),
      ).forEach((recurrence: string): void => {
        const daysUntilAvailability: number =
          DateUtils.getNumberOfDaysUntilToday(recurrence) + i * 7;
        const availabilitySelector: string = availabilityComponent.getSelector(
          availability.type,
          Availability.getTimeRange(availability),
          daysUntilAvailability,
        );

        availabilityOptionsComponent.openModificationModal(
          availabilitySelector,
          daysUntilAvailability,
        );

        editAvailabilityComponent.checkAvailabilityValues(
          DateUtils.getRelativeDateForDatePicker(daysUntilAvailability),
          availability.startTime,
          availability.endTime,
          availability.type,
          availability.patientAmount,
          availability.consultationModalities,
        );
        editAvailabilityComponent.cancel();
      });
    }
  },
);
//endregion

//region MODIFICATION
/**
 * Create availability and modify it after deleting all similar to created and modified ones and disconnect.
 *
 * @param modifyRecurrences - True if modify next recurrences.
 */
function modifyAvailabilityWithoutDuplicate(
  modifyRecurrences: boolean = false,
): void {
  editAvailabilityComponent.deleteAllExistingDataset(availabilityData);
  editAvailabilityComponent.createAvailability(availabilityData);
  editAvailabilityComponent.modifyAvailability(
    availabilityData,
    modifyRecurrences,
  );

  LoginPanel.disconnect();
}

Then(
  /^les récurrences modifiées de la disponibilité sont visibles avec les informations attendues sur au moins (\d+) semaines$/,
  function (numberOfWeeks: number): void {
    const availability: Availability = Availability.create(
      this.availabilityData,
      true,
    );
    for (let i = 0; i < numberOfWeeks; i++) {
      StringUtils.getElemAsArray(
        availabilityData.get(availabilityKeys.RECURRENCE_DAYS),
      ).forEach((recurrence: string): void => {
        const daysUntilAvailability: number =
          DateUtils.getNumberOfDaysUntilToday(recurrence) + i * 7;
        const availabilitySelector: string = availabilityComponent.getSelector(
          availability.type,
          Availability.getTimeRange(availability),
          daysUntilAvailability,
        );

        availabilityOptionsComponent.openModificationModal(
          availabilitySelector,
          daysUntilAvailability,
        );

        editAvailabilityComponent.checkAvailabilityValues(
          DateUtils.getRelativeDateForDatePicker(daysUntilAvailability),
          availability.startTime,
          availability.endTime,
          availability.type,
          availability.patientAmount,
          availability.consultationModalities,
        );
        editAvailabilityComponent.cancel();
      });
    }
  },
);

When(
  /^il modifie une disponibilité nouvellement créée sans doublon$/,
  function (availabilityDataTable: DataTable): void {
    getAvailabilityDataMap(availabilityDataTable);
    this.availabilityData = availabilityData;

    editAvailabilityComponent.deleteAllExistingDataset(this.availabilityData);
    editAvailabilityComponent.createAvailability(this.availabilityData);
    editAvailabilityComponent.modifyAvailability(this.availabilityData);
  },
);

Then(
  /^la disponibilité est modifiée avec les informations attendues$/,
  function () {
    const availability: Availability = Availability.create(
      this.availabilityData,
      true,
    );

    const availabilitySelector: string = availabilityComponent.getSelector(
      availability.type,
      Availability.getTimeRange(availability),
      availability.date,
    );

    availabilityOptionsComponent.openModificationModal(
      availabilitySelector,
      availability.date,
    );

    editAvailabilityComponent.checkAvailabilityValues(
      DateUtils.getRelativeDateForDatePicker(availability.date),
      availability.startTime,
      availability.endTime,
      availability.type,
      availability.patientAmount,
      availability.consultationModalities,
    );
  },
);

When(
  /^il modifie de façon récurrente une disponibilité nouvellement créée sans doublon$/,
  function (availabilityDataTable: DataTable): void {
    getAvailabilityDataMap(availabilityDataTable);
    this.availabilityData = availabilityData;

    editAvailabilityComponent.deleteAllExistingDataset(this.availabilityData);
    editAvailabilityComponent.createAvailability(this.availabilityData);
    editAvailabilityComponent.modifyAvailability(this.availabilityData, true);
  },
);

//region Effector
Given(
  /^la modification d'une disponibilité nouvellement créée sans doublon sur le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    locationNumber: number,
    effectorAlias: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);
    accessToEffectorAvailabilityEditionPage(effectorAlias, locationNumber);
    modifyAvailabilityWithoutDuplicate();
  },
);

Given(
  /^la modification récurrente d'une disponibilité nouvellement créée sans doublon sur le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    locationNumber: number,
    effectorAlias: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);

    accessToEffectorAvailabilityEditionPage(effectorAlias, locationNumber);
    modifyAvailabilityWithoutDuplicate(true);
  },
);
//endregion

//region Health center
Given(
  /^la modification d'une disponibilité nouvellement créée sans doublon sur le centre de santé (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (centerNumber: number, userName: string, data: DataTable): void {
    getAvailabilityDataMap(data);

    accessToCenterAvailabilityEditionPage(userName, centerNumber);
    modifyAvailabilityWithoutDuplicate();
  },
);
//endregion

//region SOS Médecins association
Given(
  /^la modification d'une disponibilité nouvellement créée sans doublon sur le PFG (\d+) de l'association SOS Médecins (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    pointNumber: number,
    associationNumber: number,
    userName: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);

    accessToFixGuardPointAvailabilityEditionPage(
      userName,
      associationNumber,
      pointNumber,
    );
    modifyAvailabilityWithoutDuplicate();
  },
);

Given(
  /^la modification récurrente d'une disponibilité nouvellement créée sans doublon sur le PFG (\d+) de l'association SOS Médecins (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    pointNumber: number,
    associationNumber: number,
    userName: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);

    accessToFixGuardPointAvailabilityEditionPage(
      userName,
      associationNumber,
      pointNumber,
    );
    modifyAvailabilityWithoutDuplicate(true);
  },
);
//endregion
//endregion

//region DELETION
When(/^il supprime la disponibilité$/, function (): void {
  this.availability = Availability.create(this.availabilityData);
  editAvailabilityComponent.searchAndDeleteAvailability(
    this.availabilityData,
    this.availability.date,
  );
});

Then(/^la disponibilité est absente en page d'édition$/, function (): void {
  const availabilitySelector: string = availabilityComponent.getSelector(
    this.availability.type,
    Availability.getTimeRange(this.availability),
    this.availability.date,
  );
  availabilityComponent.checkAbsence(availabilitySelector);
});

When(/^il supprime les récurrences de la disponibilité$/, function (): void {
  StringUtils.getElemAsArray(
    this.availabilityData.get(availabilityKeys.RECURRENCE_DAYS),
  ).forEach((recurrenceDay: string): void => {
    editAvailabilityComponent.searchAndDeleteAvailability(
      this.availabilityData,
      recurrenceDay,
      false,
      true,
    );
  });
});

Then(
  /^les récurrences de la disponibilité sont absentes sur au moins (\d+) semaines$/,
  function (numberOfWeeks: number): void {
    const availability: Availability = Availability.create(
      this.availabilityData,
    );
    calendarNavigationComponent.goToFirstWeek(true);

    for (let i = 0; i < numberOfWeeks; i++) {
      StringUtils.getElemAsArray(
        availabilityData.get(availabilityKeys.RECURRENCE_DAYS),
      ).forEach((recurrenceDay: string): void => {
        const daysUntilAvailability: number =
          DateUtils.getNumberOfDaysUntilToday(recurrenceDay) + i * 7;
        const availabilitySelector: string = availabilityComponent.getSelector(
          availability.type,
          Availability.getTimeRange(availability),
          daysUntilAvailability,
        );

        calendarNavigationComponent.goToNextWeekUntilDayIsFound(
          daysUntilAvailability,
          true,
        );
        availabilityComponent.checkAbsence(availabilitySelector);
      });
    }
  },
);

/**
 * Create availability and delete it after deleting all similar to created ones and disconnect.
 */
function deleteAvailabilityWithoutDuplicateEntry(): void {
  const availability: Availability = Availability.create(availabilityData);

  editAvailabilityComponent.deleteAllExistingDataset(availabilityData);
  editAvailabilityComponent.createAvailability(availabilityData);
  editAvailabilityComponent.searchAndDeleteAvailability(
    availabilityData,
    availability.date,
  );

  LoginPanel.disconnect();
}

function deleteAvailabilityAndRecurrencesWithoutDuplicateEntry(): void {
  const availability: Availability = Availability.create(availabilityData);

  editAvailabilityComponent.deleteAllExistingDataset(availabilityData);
  editAvailabilityComponent.createAvailability(availabilityData);
  editAvailabilityComponent.searchAndDeleteAvailability(
    availabilityData,
    availability.date,
  );
  editAvailabilityComponent.searchAndDeleteRecurringAvailabilities(
    availabilityData,
  );

  LoginPanel.disconnect();
}

function deleteRecurrencesWithoutDuplicateEntry(): void {
  editAvailabilityComponent.deleteAllExistingDataset(availabilityData);
  editAvailabilityComponent.createAvailability(availabilityData);
  editAvailabilityComponent.searchAndDeleteRecurringAvailabilities(
    availabilityData,
  );

  LoginPanel.disconnect();
}

//region Effector
Given(
  /^l'effecteur sur la page d'édition des disponibilités de son lieu d'exercice$/,
  function () {
    accessToEffectorAvailabilityEditionPage(this.userAlias, this.locationId);
  },
);

Given(
  /^le gestionnaire de structure sur la page d'édition des disponibilités de son PFG$/,
  function () {
    accessToFixGuardPointAvailabilityEditionPage(
      this.userAlias,
      this.associationId,
      this.pointId,
    );
  },
);

Given(
  /^la suppression d'une disponibilité nouvellement créée sans doublon sur le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    locationNumber: number,
    effectorAlias: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);

    accessToEffectorAvailabilityEditionPage(effectorAlias, locationNumber);
    deleteAvailabilityWithoutDuplicateEntry();
  },
);

Given(
  /^la suppression d'une disponibilité et de ses récurrences nouvellement créées et sans doublon sur le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    locationNumber: number,
    effectorAlias: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);

    accessToEffectorAvailabilityEditionPage(effectorAlias, locationNumber);
    deleteAvailabilityAndRecurrencesWithoutDuplicateEntry();
  },
);

Given(
  /^la suppression des récurrences de la disponibilité nouvellement créée sans doublon sur le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    locationNumber: number,
    effectorAlias: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);

    accessToEffectorAvailabilityEditionPage(effectorAlias, locationNumber);
    deleteRecurrencesWithoutDuplicateEntry();
  },
);
//endregion

//region Health center
Given(
  /^la suppression d'une disponibilité nouvellement créée sans doublon sur le centre de santé (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (centerNumber: number, userAlias: string, data: DataTable): void {
    getAvailabilityDataMap(data);

    accessToCenterAvailabilityEditionPage(userAlias, centerNumber);
    deleteAvailabilityWithoutDuplicateEntry();
  },
);

Given(
  /^la suppression d'une disponibilité et de ses récurrences nouvellement créées et sans doublon sur le centre de santé (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (centerNumber: number, userAlias: string, data: DataTable): void {
    getAvailabilityDataMap(data);

    accessToCenterAvailabilityEditionPage(userAlias, centerNumber);
    deleteAvailabilityAndRecurrencesWithoutDuplicateEntry();
  },
);
//endregion

//region SOS Médecins association
Given(
  /^la suppression d'une disponibilité nouvellement créée sans doublon sur le PFG (\d+) de l'association SOS Médecins (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    pointNumber: number,
    associationNumber: number,
    userAlias: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);

    accessToFixGuardPointAvailabilityEditionPage(
      userAlias,
      associationNumber,
      pointNumber,
    );
    deleteAvailabilityWithoutDuplicateEntry();
  },
);

Given(
  /^la suppression des récurrences de la disponibilité nouvellement créée sans doublon sur le PFG (\d+) de l'association SOS Médecins (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    pointNumber: number,
    associationNumber: number,
    userAlias: string,
    data: DataTable,
  ): void {
    getAvailabilityDataMap(data);

    accessToFixGuardPointAvailabilityEditionPage(
      userAlias,
      associationNumber,
      pointNumber,
    );
    deleteRecurrencesWithoutDuplicateEntry();
  },
);
//endregion
//endregion
//region ORIENTED AVAILABILITY
Given(
  /^l'orientation complète d'une disponibilité nouvellement créée sur le lieu d'exercice (\d+) de l'effecteur "([^"]*)"$/,
  function (
    locationId: number,
    userAlias: string,
    timeWindowsData: DataTable,
  ): void {
    //region User data
    this.userAlias = userAlias;
    this.locationId = locationId;
    this.search = accountFixtureUtils.getFullUserName(userAlias);
    this.address = accountFixtureUtils.getAddressById(
      userAlias,
      HealthOfferType.PRACTICE_LOCATION,
      locationId,
    );
    //endregion
    //region Availability data
    getAvailabilityDataMap(timeWindowsData);
    const availability: Availability = Availability.create(availabilityData);
    this.availabilityType = availability.type;
    this.availabilityTimes = Availability.getTimeRange(availability);
    this.availabilityDay = availability.date;
    const patientAmount: number =
      this.availabilityType == AvailabilityType.PLAGE
        ? parseInt(availability.patientAmount)
        : undefined;
    this.timeSlot = "22h30";
    //endregion

    accessToEffectorAvailabilityEditionPage(userAlias, locationId);
    createAvailability(false);

    cy.logIn("Régulateur OSNP");
    ResultsPage.navigateToLoadedPage(this.search, this.address);
    CardComponent.directAPatient(
      this.availabilityType,
      this.availabilityTimes,
      this.availabilityDay,
      this.search,
      this.address,
      patientAmount,
      this.timeSlot,
    );
    LoginPanel.disconnect();
  },
);

Given(
  /^l'orientation complète d'une disponibilité nouvellement créée sur le PFG (\d+) de l'association SOS Médecins (\d+) du gestionnaire de structure "([^"]*)"$/,
  function (
    pointId: number,
    associationId: number,
    userAlias: string,
    timeWindowsData: DataTable,
  ): void {
    //region User data
    this.userAlias = userAlias;
    this.associationId = associationId;
    this.pointId = pointId;
    this.healthOfferType = HealthOfferType.SOS_GUARD_FIX_POINT;
    const location: LocationInfoClass =
      accountFixtureUtils.getUniqueSubLocationInfoByTypeAndIdFixGuardPoint(
        userAlias,
        associationId,
        pointId,
      );
    this.search = location.getName();
    this.address = location.getAddress().getFullAddress();
    //endregion
    //region Availability data
    availabilityData = DataTableUtils.convertDataTableToMap(
      timeWindowsData,
      true,
    );
    const availability: Availability = Availability.create(availabilityData);
    this.availabilityType = availability.type;
    this.availabilityTimes = Availability.getTimeRange(availability);
    this.availabilityDay = availability.date;
    const patientAmount: number =
      this.availabilityType == AvailabilityType.PLAGE
        ? parseInt(availability.patientAmount)
        : undefined;
    //endregion

    accessToFixGuardPointAvailabilityEditionPage(
      userAlias,
      associationId,
      pointId,
    );
    createAvailability(true);

    cy.logIn("Régulateur OSNP");
    ResultsPage.navigateToLoadedPage(this.search, this.address);
    CardComponent.directAPatient(
      this.availabilityType,
      this.availabilityTimes,
      this.availabilityDay,
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
      patientAmount,
    );
    LoginPanel.disconnect();
  },
);

Then(
  /^la disponibilité précédemment orientée n'est plus modifiable$/,
  function (): void {
    availabilityOptionsComponent.checkModificationImpossibility(
      availabilityComponent.getElement(
        this.availabilityType,
        this.availabilityTimes,
        this.availabilityDay,
      ),
    );
  },
);

Then(
  /^la disponibilité précédemment orientée n'est plus supprimable$/,
  function (): void {
    availabilityOptionsComponent.checkDeletionImpossibility(
      availabilityComponent.getElement(
        this.availabilityType,
        this.availabilityTimes,
        this.availabilityDay,
      ),
    );
  },
);
//endregion
Given(
  /^le gestionnaire de structure sur la page d'édition des disponibilités du lieu d'exercice (\d+) du PS "([^"]*)" via sa CPTS "([^"]*)"$/,
  function (locationId: number, effectorAlias: string, cptsName: string) {
    this.cpts = cptsName;
    this.search = accountFixtureUtils.getFullUserName(effectorAlias);
    this.address = accountFixtureUtils.getAddressById(
      effectorAlias,
      HealthOfferType.PRACTICE_LOCATION,
      locationId,
    );

    structureManagerDashboardPage.navigateTo(HealthOfferType.CPTS, true);
    StructureManagerDashboardPage.accessToEffectorCptsDashboard(
      cptsName,
      this.search,
    );
    effectorDashboardPage.accessAvailabilityEditionPage(this.address);
  },
);

Given(
  /^le gestionnaire de structure sur le dashboard du PS "([^"]*)" via sa CPTS "([^"]*)"$/,
  function (effectorAlias: string, cptsName: string) {
    this.cpts = cptsName;
    this.search = accountFixtureUtils.getFullUserName(effectorAlias);
    this.userAlias = effectorAlias;

    structureManagerDashboardPage.navigateTo(HealthOfferType.CPTS, true);
    StructureManagerDashboardPage.accessToEffectorCptsDashboard(
      cptsName,
      this.search,
    );
  },
);

Then(
  /^l'ensemble des lieux d'exercice de l'effecteur liés à la CPTS sont présents$/,
  function () {
    const linkedLocationIds = accountFixtureUtils.getCptsLinkedLocationsAlias(
      this.userAlias,
    );

    linkedLocationIds.forEach((cptsLinkedLocationAlias: number) => {
      const address: string = accountFixtureUtils.getAddressById(
        this.userAlias,
        HealthOfferType.PRACTICE_LOCATION,
        cptsLinkedLocationAlias,
      );
      effectorDashboardPage.getWorkplaceSection(address).should("exist");
    });

    cy.get(effectorDashboardPage.workplaceSectionSelector).should(
      "have.length",
      linkedLocationIds.length,
    );
  },
);
