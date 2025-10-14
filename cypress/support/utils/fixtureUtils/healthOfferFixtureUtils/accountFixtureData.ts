import { ConsultationModality } from "../../../../shared/availability/consultationModality";
import { AvailabilityType } from "../../../../shared/availability/availabilityType";
import { HealthOfferType } from "../../../../shared/healthOffer/healthOfferType";
import {
  LoginTypeNames,
  UserRoleNames,
} from "../../../../shared/user/userRoles";
import { SasParticipationNames } from "../../../../shared/user/participationVia";
import { DayOfWeek } from "../../../../shared/date/dayOfWeek";
import { StringUtils } from "../../stringUtils";

//region User

export enum UserJsonFieldNames {
  USER_ALIAS = "userAlias",
  LOGIN = "login",
  LOGIN_TYPE = "loginType",
  FIRSTNAME = "firstName",
  LASTNAME = "lastName",
  ROLES = "roles",
}

export class UserClass {
  userAlias: string;
  login: string;
  loginType: LoginTypeNames;
  firstName: string;
  lastName: string;
  roles: Array<UserRoleNames> = [];
  locations: LocationListClass = new LocationListClass(); //TODO: ce champ n'est pas obligatoire pour les Régulateurs
  //TODO: voir comment faire pour le mettre seulement si nécessaire

  constructor(jsonData?: JSON) {
    if (jsonData) this.init(jsonData);
  }

  /**
   * Helper function to get an Array of roles from either a JSON string either a JSON list of roles,
   * This function id used to fill the roles values or just to parse and know the list of values
   *
   * @param jsonData - JSON text with roles value
   */
  public static getRolesFromJson(jsonData: JSON): Array<UserRoleNames> {
    const jsonRoles: UserRoleNames | Array<UserRoleNames> =
      jsonData[UserJsonFieldNames.ROLES];
    let roles: Array<UserRoleNames>;

    if (!jsonRoles || jsonRoles.length === 0)
      throw new Error(
        "Invalid role for user in data. Got : " +
          jsonRoles +
          ". Allowed values " +
          Object.values(UserRoleNames).join(", "),
      );

    switch (typeof jsonRoles) {
      case "string":
        roles = jsonRoles.split(/\s*;\s*/) as Array<UserRoleNames>;
        break;
      case "object":
        roles = jsonRoles as Array<UserRoleNames>;
        break;
      default:
        throw new Error(
          "Non recognized data type for field " +
            UserJsonFieldNames.ROLES +
            " with data " +
            jsonData[UserJsonFieldNames.ROLES],
        );
    }
    return roles;
  }

  init(jsonData: JSON): void {
    this.userAlias = jsonData[UserJsonFieldNames.USER_ALIAS];
    this.login = jsonData[UserJsonFieldNames.LOGIN];
    this.loginType = jsonData[UserJsonFieldNames.LOGIN_TYPE]; // Can check the value
    this.firstName = jsonData[UserJsonFieldNames.FIRSTNAME];
    this.lastName = jsonData[UserJsonFieldNames.LASTNAME];

    this.roles = UserClass.getRolesFromJson(jsonData);
  }

  //TODO: propose another method the return all the roles when we want
  // to manage several roles for one user

  getFirstRole(): UserRoleNames {
    if (!this.roles || this.roles?.length == 0)
      throw new Error(
        "ERROR : at least one role expected for " + this.userAlias,
      );

    return this.roles[0];
  }

  getUserAlias(): string {
    return this.userAlias;
  }

  getLocations(): LocationListClass {
    return this.locations;
  }

  /**
   * Warning : for the moment, it does not search for sublocations
   * @param types
   */
  getLocationsFullAddressByType(types: Array<HealthOfferType>): Array<string> {
    return this.getLocations()
      .getByTypes(types)
      .map((elem) => elem.getAddress().getFullAddress());
  }

  getUserFullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }
}

//region Regulator
enum RegulatorJsonFieldNames {
  TERRITORIES = "territories",
}

export class RegulatorClass extends UserClass {
  territories: Array<string> = new Array<string>();

  constructor(jsonData?: JSON) {
    super();
    this.locations = new LocationListClass(); // Always empty
    if (jsonData) this.init(jsonData);
  }

  init(jsonData?: JSON): RegulatorClass {
    if (jsonData) {
      super.init(jsonData);

      const territories: Array<string> | string =
        jsonData[RegulatorJsonFieldNames.TERRITORIES];

      if (territories)
        switch (typeof territories) {
          case "string":
            this.territories = territories.split(/\s*;\s*/) as Array<string>;
            break;
          case "object":
            this.territories = territories;
            break;
          default:
            throw new Error(
              "Non recognized data type for field " +
                RegulatorJsonFieldNames.TERRITORIES +
                " with data " +
                territories,
            );
        }
    }
    return this;
  }
}

//endregion

//region Practitioner

enum PractitionerFieldNames {
  RPPS = "rpps",
  JOB = "job",
  SPECIALTIES = "specialties",
  SAS_PARTICIPATION = "sasParticipation",
  LOCATIONS = "locations",
}

export class PractitionerClass extends UserClass {
  rpps: string;
  job?: string;
  specialties?: Array<string>;
  sasParticipation?: SasParticipationClass = new SasParticipationClass();

  constructor(jsonData?: JSON) {
    super();
    if (jsonData) this.init(jsonData);
  }

  init(jsonData?: JSON): PractitionerClass {
    if (jsonData) {
      super.init(jsonData);
      this.rpps = jsonData[PractitionerFieldNames.RPPS];
      this.job = jsonData[PractitionerFieldNames.JOB];
      this.specialties = StringUtils.getElemAsArray(
        jsonData[PractitionerFieldNames.SPECIALTIES],
      );
      this.sasParticipation.init(
        jsonData[PractitionerFieldNames.SAS_PARTICIPATION],
      );

      if (jsonData[PractitionerFieldNames.LOCATIONS]) {
        const jsonLocations: Array<JSON> =
          jsonData[PractitionerFieldNames.LOCATIONS];
        jsonLocations.forEach((elem) => {
          this.locations.add(new LocationClass(elem));
        });
      }
    }
    return this;
  }
}

//endregion
//region StructureManager

enum StructureManagerJsonFieldNames {
  LOCATIONS = "locations",
}

export class StructureManagerClass extends UserClass {
  // locations: LocationListClass;

  constructor(jsonData?: JSON) {
    super();
    if (jsonData) this.init(jsonData);
  }

  init(jsonData?: JSON): StructureManagerClass {
    super.init(jsonData);
    if (jsonData) {
      if (jsonData[StructureManagerJsonFieldNames.LOCATIONS]) {
        jsonData[StructureManagerJsonFieldNames.LOCATIONS].forEach((elem) => {
          this.locations.add(new LocationClass(elem));
        });
      }
    }
    return this;
  }
}

//endregion
//endregion
//region SasParticipation

enum SasParticipationJsonFieldNames {
  TYPE = "type",
  NAME = "name",
  HAS_EDITOR = "hasEditor",
  INTERFACED_SLOTs_DISPLAY = "interfacedSlotDisplay",
  LINKED_LOCATIONS = "linkedLocations",
}

export class SasParticipationClass {
  type: SasParticipationNames;
  name: string;
  hasEditor: boolean;
  interfaceSlotsDisplay: boolean;
  linkedLocations: Array<number>;

  constructor(jsonData?: JSON) {
    if (jsonData) this.init(jsonData);
  }

  init(jsonData?: JSON): SasParticipationClass {
    if (jsonData) {
      this.type = jsonData[SasParticipationJsonFieldNames.TYPE];
      this.name = jsonData[SasParticipationJsonFieldNames.NAME];
      this.hasEditor = jsonData[SasParticipationJsonFieldNames.HAS_EDITOR];
      this.interfaceSlotsDisplay =
        jsonData[SasParticipationJsonFieldNames.INTERFACED_SLOTs_DISPLAY];
      this.linkedLocations =
        jsonData[SasParticipationJsonFieldNames.LINKED_LOCATIONS];
    }
    return this;
  }
}

//endregion

//region Locations and Address

enum AddressJsonFieldNames {
  STREET = "street",
  POSTAL_CODE = "postalCode",
  CITY = "city",
}

/**
 * format of postalCode can be a string or a number
 */
export class AddressClass {
  street: string;
  postalCode: number;
  city: string;

  constructor(jsonData?: JSON) {
    this.init(jsonData);
  }

  init(jsonData?: JSON): void {
    if (jsonData) {
      this.street = jsonData[AddressJsonFieldNames.STREET];
      this.postalCode = jsonData[AddressJsonFieldNames.POSTAL_CODE];
      this.city = jsonData[AddressJsonFieldNames.CITY];
    }
  }

  getStreet(): string {
    return this.street;
  }

  getPostalCode(): number {
    return this.postalCode;
  }

  getCity(): string {
    return this.city;
  }

  getFullAddress(): string {
    return `${this.getStreet()}, ${this.getPostalCode()} ${this.getCity()}`;
  }
}

enum LocationInfoJsonFieldNames {
  ID = "id",
  ADDRESS = "address",
  TYPE = "type",
  PHONES = "phones",
  NAME = "name",
}

export class LocationInfoClass {
  id: string | number;
  address: AddressClass;
  phones?: Array<string> = new Array<string>();
  type: HealthOfferType;
  name: string;

  constructor(jsonData?: JSON) {
    if (jsonData) this.init(jsonData);
  }

  init(jsonData: JSON): LocationInfoClass {
    if (jsonData) {
      this.type = jsonData[LocationInfoJsonFieldNames.TYPE];
      this.id = jsonData[LocationInfoJsonFieldNames.ID];
      this.address = new AddressClass(
        jsonData[LocationInfoJsonFieldNames.ADDRESS],
      );
      this.phones = jsonData[LocationInfoJsonFieldNames.PHONES];
      this.name = jsonData[LocationInfoJsonFieldNames.NAME];
    }
    return this;
  }

  getAddress(): AddressClass {
    return this.address;
  }

  getName(): string {
    return this.name;
  }
}

export enum LocationJsonFieldNames {
  AVAILABILITIES = "availabilities",
  LOCATIONS = "locations",
}

/**
 * LocationClass can be used for any location, including "fix guard point"
 * Fix guard points are seen as sub-locations of an SOS Médecins Association
 */
export class LocationClass extends LocationInfoClass {
  locations: Array<LocationClass> = new Array<LocationClass>();
  availabilities?: Array<AvailabilityInfosClass> =
    new Array<AvailabilityInfosClass>();

  constructor(jsonData?: JSON) {
    super();
    if (jsonData) this.init(jsonData);
  }

  init(jsonData?: JSON): LocationClass {
    super.init(jsonData);
    if (jsonData)
      if (jsonData[LocationJsonFieldNames.AVAILABILITIES])
        jsonData[LocationJsonFieldNames.AVAILABILITIES].forEach((elem) =>
          this.availabilities.push(new AvailabilityInfosClass(elem)),
        );

    if (jsonData[LocationJsonFieldNames.LOCATIONS])
      jsonData[LocationJsonFieldNames.LOCATIONS].forEach((elem) =>
        this.locations.push(new LocationClass(elem)),
      );
    return this;
  }

  /**
   * Returns all sub locations
   */
  getLocations(): Array<LocationClass> {
    return this.locations;
  }

  /**
   * Filters the locations having specified id and type
   * If id is not specified or no type is given, no check is done on this data
   * @param id
   * @param type
   */
  getLocationsByTypeAndId(
    type: HealthOfferType,
    id?: string | number,
  ): Array<LocationClass> {
    return this.getLocations().filter(
      (elem) => (!type || elem.type === type) && (!id || elem.id == id),
    );
  }
}

export class LocationListClass {
  public locations: Array<LocationClass> = new Array<LocationClass>();

  /**
   * Filters the list of elements by id and type
   * Returns a list
   * If only one element would be expected, the error has to be raised by the caller
   * In the case the param type is absent, all types are returned, with matching id
   * In the case the id value is absent, all IDs are returned, with matching type
   * TODO: warning : it does not return sublocations, see when it will required
   * @param type
   * @param id
   */
  public getByTypeAndId(
    type?: HealthOfferType,
    id?: string | number,
  ): Array<LocationClass> {
    if (this.locations && this.locations.length > 0) {
      return this.locations.filter(
        (elem) =>
          (type ? elem.type === type : true) && (id ? elem.id == id : true),
      );
    }
    return [] as Array<LocationClass>;
  }

  /**
   * TODO: voir comment gérer la récupération des sub-locations
   * TODO : LocationInfoClass ?
   * @param types
   */
  public getByTypes(types: Array<HealthOfferType>): Array<LocationClass> {
    let results: Array<LocationClass> = new Array<LocationClass>();
    types.forEach(
      (type_) => (results = results.concat(this.getByTypeAndId(type_))),
    );
    return results;
  }

  public get(): Array<LocationClass> {
    return this.locations;
  }

  public add(elem: NonNullable<LocationClass>): void {
    if (!this.locations) this.locations = new Array<LocationClass>();

    this.locations.push(elem);
  }
}

//endregion

//region Availability
enum AvailabilityInfoJsonFieldNames {
  DAY = "day",
  START = "startTime",
  END = "endTime",
  TYPE = "type",
  MODALITIES = "consultationModalities",
  RECURRENCE = "recurrence",
}

class AvailabilityInfosClass {
  day: DayOfWeek;
  start: string;
  end: string;
  type: AvailabilityType;
  modalities: Array<ConsultationModality>;
  recurrence?: Array<DayOfWeek>;

  constructor(jsonData?: JSON) {
    if (jsonData) this.init(jsonData);
  }

  init(jsonData?: JSON): AvailabilityInfosClass {
    if (jsonData) {
      this.day = jsonData[AvailabilityInfoJsonFieldNames.DAY];
      this.start = jsonData[AvailabilityInfoJsonFieldNames.START];
      this.end = jsonData[AvailabilityInfoJsonFieldNames.END];
      this.type = jsonData[AvailabilityInfoJsonFieldNames.TYPE];

      this.modalities = StringUtils.getElemAsArray(
        jsonData[AvailabilityInfoJsonFieldNames.MODALITIES],
      ) as Array<ConsultationModality>;
      this.recurrence = StringUtils.getElemAsArray(
        jsonData[AvailabilityInfoJsonFieldNames.RECURRENCE],
      ) as Array<DayOfWeek>;
    }
    return this;
  }
}

//endregion

//endregion
