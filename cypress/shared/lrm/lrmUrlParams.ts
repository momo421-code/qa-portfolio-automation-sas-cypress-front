/**
 * Manages names of LRM requests params to be passed in the URL
 */
export enum UrlParamNames {
  ORIGIN = "origin",
  PRACTITIONER = "practitioner",
  SPECIALTY = "specialty",
  STREET_NUMBER = "streetnumber",
  STREET_NAME = "streetname",
  CITY = "city",
  INSEE_CODE = "inseecode",
}
const PRACTITIONER_URN: string = "urn:oid:1.2.250.1.71.4.2.1|";

/**
 * URN Values to be used for specialty
 * The list can be increased if needed
 */
export enum UrnValues {
  ORL_URN = "urn:oid:1.2.250.1.213.2.28|SM39",
  MEDECINE_GENERALE_URN = "urn:oid:1.2.250.1.213.2.28|SM54",
  CHIRURGIEN_DENTISTE_URN = "urn:oid:1.2.250.1.71.1.2.7|40",
}

export class LrmUrlParams {
  // Value from ENV
  private static readonly envOriginParamName: string = "lrmOrigin";
  static readonly defaultOriginValue: string = Cypress.env(
    LrmUrlParams.envOriginParamName,
  );

  static readonly urnPrefix: string = "urn:oid"; // For specialty and practitioner
  public static readonly specialtyUrns: Array<string> = Array.from(
    Object.values(UrnValues),
  );

  /**
   * get the default origin value
   */
  public static getDefaultOrigin(): string {
    return this.defaultOriginValue;
  }

  /**
   * Check if the specialty URN is one of supported
   * @param value
   * @param emptyAllowed
   */
  public static isSpecialtyValid(
    value: string,
    emptyAllowed: boolean = true,
  ): boolean {
    if (value)
      if (value.startsWith(this.urnPrefix))
        return (
          LrmUrlParams.specialtyUrns.findIndex((elem) => elem === value) >= 0
        );
      else return true;
    else return emptyAllowed;
  }
  /**
   * check if practitionerId starts with Urn Id and check if it is correct
   * By default, empty value is considered as valid (the LRM returns results even if no practitioner)
   * @param value
   * @param emptyAllowed
   */
  public static isPractitionerValid(
    value: string,
    emptyAllowed: boolean = true,
  ): boolean {
    if (value)
      if (value.startsWith(this.urnPrefix))
        return value.startsWith(PRACTITIONER_URN);
      else return true;
    // no URN prefix, we assume , the value is the practitioner name
    else return emptyAllowed;
  }

  /**
   * Add the practitioner URN prefix to the passed value
   * @param value
   */
  public static getPractitionerWithRpps(value: string) {
    return `${PRACTITIONER_URN}${value}`;
  }

  /**
   * build the URL from the elements contained in the map
   * @param urlParamsMap   - parameters names and values to be passed
   * @param ignoreNulls - if a param has a name but no value
   */
  public static buildUrl(
    urlParamsMap: Map<UrlParamNames, string>,
    ignoreNulls: boolean = true,
  ): string {
    // if we don't want nulls to be passed, the keys leading to null values are ignored
    const paramsToBeUsed: Array<UrlParamNames> = Array.from(
      urlParamsMap.keys(),
    ).filter((key) => !ignoreNulls || urlParamsMap.get(key));

    return paramsToBeUsed
      .map((key) => `${key}=${encodeURI(urlParamsMap.get(key))}`)
      .join("&");
  }
}
