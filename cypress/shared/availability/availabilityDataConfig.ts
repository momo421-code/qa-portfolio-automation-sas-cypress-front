/**
 * List of accepted keys in an availability datatable.
 */
export enum availabilityKeys {
  DATE = "Date",
  START_TIME = "Heure de début",
  END_TIME = "Heure de fin",
  TYPE = "Type de disponibilité",
  MODALITIES = "Modalités de consultation",
  PATIENT_AMOUNT = "Nombre de patients",
  RECURRENCE_DAYS = "Récurrences",
}

/**
 * List of accepted keys in a modified availability datatable.
 * 'Dates modifiées' is used when availability has recurrences.
 */
export enum availabilityModificationKeys {
  DATE = "Dates modifiées",
  START_TIME = "Heure de début modifiée",
  END_TIME = "Heure de fin modifiée",
  TYPE = "Type de disponibilité modifié",
  MODALITIES = "Modalités de consultation modifiées",
  PATIENT_AMOUNT = "Nombre de patients modifié",
}

/**
 * Throw error if a key in map does not corresponding to nether the list of availability keys,
 * nor the list of availability modification keys.
 *
 * @param data - Availability data.
 */
export function ensureValidAvailabilityKeys(data: Map<string, string>): void {
  const validKeys: string[] = [
    ...Object.values(availabilityKeys),
    ...Object.values(availabilityModificationKeys),
  ];
  for (const key of data.keys()) {
    if (!validKeys.includes(key)) {
      throw new Error(`Key '${key}' is not an expected key for an availability,
                please use: '${validKeys.join("', '")}'.`);
    }
  }
}

export const JDayPattern: RegExp = /([Jj])(\+\d+)?/;

export const editorSlotTimeFormat: RegExp = /^\d{2}h\d{2}$/;
export const sasAvailabilityTimeRangeFormat: RegExp =
  /(\d{2}h\d{2}) - (\d{2}h\d{2})/;
