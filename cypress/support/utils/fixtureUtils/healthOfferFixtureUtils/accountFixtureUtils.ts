//region fixtureUtils
import { HealthOfferType } from "../../../../shared/healthOffer/healthOfferType";
import {
  LocationClass,
  LocationInfoClass,
  LocationListClass,
  PractitionerClass,
  RegulatorClass,
  SasParticipationClass,
  StructureManagerClass,
  UserClass,
  UserJsonFieldNames,
} from "./accountFixtureData";
import { UserRoleNames } from "../../../../shared/user/userRoles";

/**
 *  WARNING : The JSON file content must be an array of elements
 *  fixtureData - raw format of JSON data,
 *  data - structured format of JSON data
 */
export class AccountsFixtureUtils {
  // Name of variable in ENV file to get the fixture path
  private static readonly fixtureFilePathVarNameDefault: string = "fixtureFile";

  private fixtureData: Array<JSON>;
  private data: Array<
    RegulatorClass | PractitionerClass | StructureManagerClass
  >;

  /**
   * Loads data from fixture file into a JSON object
   * the force option resets the associated parsed data (this.data)
   *
   * @param force - to force the load of data
   */
  public loadData(force: boolean = false): void {
    if (this.fixtureData && !force) {
      cy.log("Fixture data already loaded. Nothing to do.");
    } else {
      const FIXTURE_DATA_ALIAS_NAME: string = "fixtureDataAlias";

      cy.fixture(
        `${Cypress.env(AccountsFixtureUtils.fixtureFilePathVarNameDefault)}.json`,
      ).then((data) => {
        cy.wrap(data as JSON).as(FIXTURE_DATA_ALIAS_NAME);
        this.fixtureData = data;

        this.data = new Array<
          RegulatorClass | PractitionerClass | StructureManagerClass
        >();
      });
    }
  }

  /**
   * getUserAccount - takes into account Regulator, Practitioner, StructureManager
   * WARNING : get the first one of the list with the given userAlias
   */
  private getUserAccountFromJson(
    userAlias: string,
  ): RegulatorClass | PractitionerClass | StructureManagerClass {
    const jsonDataList: Array<JSON> = this.fixtureData.filter(
      (user) => user[UserJsonFieldNames.USER_ALIAS] === userAlias,
    );
    let jsonData: JSON;
    const expectedRolesListMessage: string = `Expected : \t- ${Object.values(UserRoleNames).join(", \t- ")} ;`;

    if (!jsonDataList || jsonDataList.length === 0)
      throw new Error(`Cannot find userAlias in fixture file : "${userAlias}"`);

    if (jsonDataList.length > 1) {
      throw new Error(
        `Several entries found for userAlias ${userAlias}. Must be unique in JSON file`,
      );
    } else {
      jsonData = jsonDataList[0];
      const rolesList: Array<UserRoleNames> | UserRoleNames =
        jsonData[UserJsonFieldNames.ROLES];
      // Taking first role.
      const role: UserRoleNames = UserClass.getRolesFromJson(jsonData)[0];

      if (!rolesList)
        throw new Error(
          `Cannot work with user ${userAlias} because his roles are missing. ${expectedRolesListMessage}`,
        );

      switch (role) {
        case UserRoleNames.REGULATOR:
        case UserRoleNames.IOA:
          return new RegulatorClass(jsonData);
        case UserRoleNames.PRACTITIONER:
          return new PractitionerClass(jsonData);
        case UserRoleNames.STRUCTURE_MANAGER:
          return new StructureManagerClass(jsonData);
        default:
          throw new Error(
            `Non managed case for UserRoleValues ${role}. Expected roles : ${expectedRolesListMessage}`,
          );
      }
    }
  }

  /**
   * just returns the UserAccount data from the data object if already present,
   * otherwise, parses the JSONData to get this userAccount as an object and stores it in this.data
   * @param userAlias
   */
  getUserAccount(
    userAlias: string,
  ): PractitionerClass | RegulatorClass | StructureManagerClass {
    let userData: PractitionerClass | RegulatorClass | StructureManagerClass;
    userData = this.data?.find((elem) => elem.getUserAlias() === userAlias);

    if (this.data && userData) {
      return userData;
    } else {
      userData = this.getUserAccountFromJson(userAlias); // data parsing
      this.data.push(userData);
      return userData;
    }
  }

  /**
   * Get user login from parsed data using the userAlias
   * @param userAlias
   */
  getUserLogin(userAlias: string) {
    if (this.getUserAccount(userAlias))
      return this.getUserAccount(userAlias).login;
    else throw new Error(`Unknown user account userAlias : ${userAlias}`);
  }

  /**
   * get lastName + firstName
   * @param userAlias
   */
  getFullUserName(userAlias: string): string {
    const userAccount:
      | RegulatorClass
      | PractitionerClass
      | StructureManagerClass = this.getUserAccount(userAlias);

    return userAccount.lastName + " " + userAccount.firstName;
  }

  /** Get the full address of a location having a given type and a given id
   * @param userAlias
   * @param type
   * @param id
   */
  getAddressById(
    userAlias: string,
    type: HealthOfferType = HealthOfferType.PRACTICE_LOCATION,
    id: string | number,
  ): string {
    return this.getLocationInfoById(userAlias, type, id)
      .getAddress()
      .getFullAddress();
  }

  /**
   *   Returns a LocationInfo object, which does not contain Availabilities nor sub Locations
   * @param userAlias
   * @param type
   * @param id
   */
  getLocationInfoById(
    userAlias: string,
    type: HealthOfferType,
    id: string | number,
  ): LocationInfoClass {
    return this.getUniqueLocationByTypeAndById(
      userAlias,
      type,
      id,
    ) as LocationInfoClass;
  }

  /**
   * Get the entry of a location for the user userAlias, and the location id
   * @param userAlias
   * @param id
   * @param type : to return only health_center or lieu d'exercice or msp or ...
   */
  getUniqueLocationByTypeAndById(
    userAlias: string,
    type: HealthOfferType,
    id: string | number = undefined,
  ): LocationClass {
    const user: RegulatorClass | PractitionerClass | StructureManagerClass =
      this.getUserAccount(userAlias);
    const role: UserRoleNames = user.getFirstRole();
    let allLocations: LocationListClass = new LocationListClass();

    switch (role) {
      case UserRoleNames.PRACTITIONER: {
        const practitioner: PractitionerClass = user as PractitionerClass;
        allLocations = practitioner.locations;
        break;
      }
      case UserRoleNames.REGULATOR: {
        break;
      }
      case UserRoleNames.STRUCTURE_MANAGER: {
        const structureManager: StructureManagerClass =
          user as StructureManagerClass;
        allLocations = structureManager.locations;
        break;
      }
      default:
        throw new Error(`Non managed case for UserRoles : ${role}`);
    }
    const locationsById: Array<LocationClass> = allLocations.getByTypeAndId(
      type,
      id,
    );
    if (locationsById?.length > 1)
      throw new Error(
        "JSON data error : several locations with same id for " + userAlias,
      );

    return locationsById[0];
  }

  getCptsLinkedLocationsAlias(userAlias: string): number[] {
    const user: RegulatorClass | PractitionerClass | StructureManagerClass =
      this.getUserAccount(userAlias);
    const practitioner: PractitionerClass = user as PractitionerClass;
    const sasParticipation: SasParticipationClass =
      practitioner.sasParticipation;

    return sasParticipation.linkedLocations;
  }

  /**
   * Get the sub-locations of a given location for a given user
   * @param userAlias
   * @param mainId - main location ID
   * @param mainType - main location type (example Association SOS Médecins
   * @param subId - sub-location ID
   * @param subType - sub-location type (example Point fixe de garde)
   */
  getSubLocationsByTypeAndId(
    userAlias: string,
    mainId: string | number,
    mainType: HealthOfferType,
    subId: string | number,
    subType: HealthOfferType,
  ): Array<LocationClass> {
    const mainLocation: LocationClass = this.getUniqueLocationByTypeAndById(
      userAlias,
      mainType,
      mainId,
    );
    return mainLocation?.getLocationsByTypeAndId(subType, subId);
  }

  getUniqueSubLocationInfoByTypeAndId(
    userAlias: string,
    mainType: HealthOfferType,
    mainId: string | number,
    subType: HealthOfferType,
    subId: string | number,
  ): LocationInfoClass {
    const MSG: string = `sub-location has been found for ${userAlias} for mainLocation ${mainType} with id ${mainId} :
        sub location type: ${subType} with id ${subId}`;

    const subLocations: Array<LocationClass> = this.getSubLocationsByTypeAndId(
      userAlias,
      mainId,
      mainType,
      subId,
      subType,
    );
    if (subLocations && subLocations.length > 1)
      throw new Error(`Invalid locations : more than one ${MSG}`);

    if (!subLocations || subLocations.length === 0)
      throw new Error(`No ${MSG}`);

    return subLocations[0] as LocationInfoClass;
  }

  getUniqueSubLocationInfoByTypeAndIdFixGuardPoint(
    userAlias: string,
    mainId: string | number,
    subId: string | number,
  ): LocationInfoClass {
    return this.getUniqueSubLocationInfoByTypeAndId(
      userAlias,
      HealthOfferType.SOS_ASSOCIATION,
      mainId,
      HealthOfferType.SOS_GUARD_FIX_POINT,
      subId,
    );
  }
}

//endregion

//region export

export const accountFixtureUtils: AccountsFixtureUtils =
  new AccountsFixtureUtils();

//endregion
