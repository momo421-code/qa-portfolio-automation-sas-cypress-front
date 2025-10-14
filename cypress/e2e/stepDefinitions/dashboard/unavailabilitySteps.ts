import { EditUnavailabilityModalComponent } from "../../../page-objects/components/editAvailabilyPage/editUnavailabilityModal.component";
import { LoginPanel } from "../../../page-objects/panels/login.panel";
import { After, Given } from "@badeball/cypress-cucumber-preprocessor";
import { HealthOfferType } from "../../../shared/healthOffer/healthOfferType";
import { DataTable } from "@cucumber/cucumber";
import { DataTableUtils } from "../../../support/utils/dataTableUtils";

const editUnavailabilityModal: EditUnavailabilityModalComponent =
  new EditUnavailabilityModalComponent();

let sharedUserName: string;
let sharedAddress: string;
let sharedHealthOfferType: HealthOfferType;

//region INDEFINITE PERIOD UNAVAILABILITY
//region General
/**
 * Access to a specific availability edition page of an effector or a structure manager.
 *
 * @param healthOfferType
 * @param userName - Effector or structure manager account name
 * @param address - Address of workplace or structure
 * @param unavailabilityRemoval - True if deleting unavailability
 */
function accessAndEditIndefinitePeriodUnavailability(
  healthOfferType: HealthOfferType,
  userName: string,
  address: string,
  unavailabilityRemoval: boolean = false,
): void {
  cy.accessToAvailabilityEditionPage(healthOfferType, userName, address);
  editUnavailabilityModal.editIndefinitePeriodUnavailability(
    unavailabilityRemoval,
  );
}

/**
 * Access to a specific availability edition page, edit unavailability and disconnect.
 * Define shared data (user's name, health offer's address and type).
 *
 * @param healthOfferType
 * @param userName - Effector or structure manager account name
 * @param address - Address of workplace or structure
 * @param unavailabilityRemoval - True if deleting unavailability
 */
function editIndefinitePeriodUnavailability(
  healthOfferType: HealthOfferType,
  userName: string,
  address: string,
  unavailabilityRemoval: boolean = false,
): void {
  sharedUserName = userName;
  sharedAddress = address;
  sharedHealthOfferType = healthOfferType;

  accessAndEditIndefinitePeriodUnavailability(
    healthOfferType,
    userName,
    address,
    unavailabilityRemoval,
  );

  LoginPanel.disconnect();
}

//endregion

//region Teardown
After({ tags: "@teardown_unavailability_removal" }, (): void => {
  LoginPanel.disconnect();
  accessAndEditIndefinitePeriodUnavailability(
    sharedHealthOfferType,
    sharedUserName,
    sharedAddress,
    true,
  );
});

After({ tags: "@teardown_unavailability_application" }, (): void => {
  LoginPanel.disconnect();
  accessAndEditIndefinitePeriodUnavailability(
    sharedHealthOfferType,
    sharedUserName,
    sharedAddress,
  );
});
//endregion

//region Effector
Given(
  /^l'application d'une indisponibilité à durée indéterminée sur le lieu d'exercice "([^"]*)" de l'effecteur "([^"]*)"$/,
  function (address: string, userName: string): void {
    editIndefinitePeriodUnavailability(
      HealthOfferType.PRACTICE_LOCATION,
      userName,
      address,
    );
  },
);

Given(
  /^la suppression d'une indisponibilité à durée indéterminée sur le lieu d'exercice "([^"]*)" de l'effecteur "([^"]*)"$/,
  function (address: string, userName: string): void {
    editIndefinitePeriodUnavailability(
      HealthOfferType.PRACTICE_LOCATION,
      userName,
      address,
      true,
    );
  },
);
//endregion

//region Health center
Given(
  /^l'application d'une indisponibilité à durée indéterminée sur le centre de santé "([^"]*)" du gestionnaire de structure "([^"]*)"$/,
  function (address: string, userName: string): void {
    editIndefinitePeriodUnavailability(
      HealthOfferType.HEALTH_CENTER,
      userName,
      address,
    );
  },
);

Given(
  /^la suppression d'une indisponibilité à durée indéterminée sur le centre de santé "([^"]*)" du gestionnaire de structure "([^"]*)"$/,
  function (address: string, userName: string): void {
    editIndefinitePeriodUnavailability(
      HealthOfferType.HEALTH_CENTER,
      userName,
      address,
      true,
    );
  },
);
//endregion

//region SOS Médecins association
Given(
  /^l'application d'une indisponibilité à durée indéterminée sur le PFG "([^"]*)" du gestionnaire de structure "([^"]*)"$/,
  function (address: string, userName: string): void {
    editIndefinitePeriodUnavailability(
      HealthOfferType.SOS_GUARD_FIX_POINT,
      userName,
      address,
    );
  },
);

Given(
  /^la suppression d'une indisponibilité à durée indéterminée sur le PFG "([^"]*)" du gestionnaire de structure "([^"]*)"$/,
  function (address: string, userName: string): void {
    editIndefinitePeriodUnavailability(
      HealthOfferType.SOS_GUARD_FIX_POINT,
      userName,
      address,
      true,
    );
  },
);
//endregion
//endregion

//region PROGRAMMED UNAVAILABILITY
//region General
/**
 * Access to a specific availability edition page of an effector or a structure manager.
 *
 * @param healthOfferType
 * @param userName - Effector or structure manager account name
 * @param address - Address of workplace or structure
 * @param unavailabilityData - Start date and end date
 */
function accessAndEditProgrammedUnavailability(
  healthOfferType: HealthOfferType,
  userName: string,
  address: string,
  unavailabilityData: Map<string, string>[],
): void {
  sharedUserName = userName;
  sharedAddress = address;
  sharedHealthOfferType = healthOfferType;

  cy.accessToAvailabilityEditionPage(healthOfferType, userName, address);
  editUnavailabilityModal.editProgrammedUnavailability(unavailabilityData);

  LoginPanel.disconnect();
}

function accessAndDeleteProgrammedUnavailability(
  healthOfferType: HealthOfferType,
  userName: string,
  address: string,
): void {
  sharedUserName = userName;
  sharedAddress = address;
  sharedHealthOfferType = healthOfferType;

  cy.accessToAvailabilityEditionPage(healthOfferType, userName, address);
  editUnavailabilityModal.deleteProgrammedUnavailability();

  LoginPanel.disconnect();
}

//endregion

//region Teardown
After({ tags: "@teardown_programmed_unavailability_removal" }, (): void => {
  LoginPanel.disconnect();
  accessAndDeleteProgrammedUnavailability(
    sharedHealthOfferType,
    sharedUserName,
    sharedAddress,
  );
});

After({ tags: "@teardown_programmed_unavailability_addition" }, (): void => {
  const unavailabilityData: Map<string, string>[] = [];
  // TODO: Créer des constantes pour termes date de début et date de fin.
  unavailabilityData.push(
    new Map<string, string>([
      ["Date de début", "J"],
      ["Date de fin", "J+2"],
    ]),
  );

  LoginPanel.disconnect();
  accessAndEditProgrammedUnavailability(
    sharedHealthOfferType,
    sharedUserName,
    sharedAddress,
    unavailabilityData,
  );
});
//endregion

//region Effector
Given(
  /^l'ajout d'une indisponibilité programmée sur le lieu d'exercice "([^"]*)" de l'effecteur "([^"]*)"$/,
  function (
    address: string,
    userName: string,
    unavailabilityData: DataTable,
  ): void {
    accessAndEditProgrammedUnavailability(
      HealthOfferType.PRACTICE_LOCATION,
      userName,
      address,
      DataTableUtils.convertDataTableToMapList(unavailabilityData),
    );
  },
);

Given(
  /^la suppression d'indisponibilités programmées sur le lieu d'exercice "([^"]*)" de l'effecteur "([^"]*)"$/,
  function (address: string, userName: string): void {
    accessAndDeleteProgrammedUnavailability(
      HealthOfferType.PRACTICE_LOCATION,
      userName,
      address,
    );
  },
);
//endregion

//region Health center
Given(
  /^l'ajout d'une indisponibilité programmée sur le centre de santé "([^"]*)" de l'effecteur "([^"]*)"$/,
  function (
    address: string,
    userName: string,
    unavailabilityData: DataTable,
  ): void {
    accessAndEditProgrammedUnavailability(
      HealthOfferType.HEALTH_CENTER,
      userName,
      address,
      DataTableUtils.convertDataTableToMapList(unavailabilityData),
    );
  },
);
Given(
  /^la suppression d'indisponibilités programmées sur le centre de santé "([^"]*)" de l'effecteur "([^"]*)"$/,
  function (address: string, userName: string): void {
    accessAndDeleteProgrammedUnavailability(
      HealthOfferType.HEALTH_CENTER,
      userName,
      address,
    );
  },
);
//endregion

//region SOS Médecins association
Given(
  /^l'ajout d'une indisponibilité programmée sur le PFG "([^"]*)" de l'effecteur "([^"]*)"$/,
  function (
    address: string,
    userName: string,
    unavailabilityData: DataTable,
  ): void {
    accessAndEditProgrammedUnavailability(
      HealthOfferType.SOS_GUARD_FIX_POINT,
      userName,
      address,
      DataTableUtils.convertDataTableToMapList(unavailabilityData),
    );
  },
);

Given(
  /^la suppression d'indisponibilités programmées sur le PFG "([^"]*)" de l'effecteur "([^"]*)"$/,
  function (address: string, userName: string): void {
    accessAndDeleteProgrammedUnavailability(
      HealthOfferType.SOS_GUARD_FIX_POINT,
      userName,
      address,
    );
  },
);
//endregion
//endregion
