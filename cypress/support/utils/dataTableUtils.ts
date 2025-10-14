import { DataTable } from "@cucumber/cucumber";

export class DataTableUtils {
  /**
   * Assuming the first column contains the keys and the second column contains the values.
   *
   * @param dataTable
   * @param ignoreFirstRow - If the first row is a header
   */
  static convertDataTableToMap(
    dataTable: DataTable,
    ignoreFirstRow: boolean = false,
  ): Map<string, string> {
    let i: number = 0;
    const mapData: string[][] = dataTable.raw();
    const dataMap: Map<string, string> = new Map<string, string>();

    // Skip the first row as it contains the headers.
    if (ignoreFirstRow) {
      i = 1;
    }
    for (i; i < mapData.length; i++) {
      dataMap.set(mapData[i][0], mapData[i][1]);
    }
    return dataMap;
  }

  /**
   * Assuming the first row contains the keys,
   * and each subsequent row contains the corresponding values for each iteration.
   *
   * @param dataTable
   */
  static convertDataTableToMapList(
    dataTable: DataTable,
  ): Map<string, string>[] {
    const dataList: Map<string, string>[] = [];

    dataTable.hashes().forEach((row: Record<string, string>): void => {
      const map: Map<string, string> = new Map<string, string>();

      Object.entries(row).forEach(([key, value]): void => {
        map.set(key, value);
      });

      dataList.push(map);
    });
    return dataList;
  }

  /**
   * Each string in the list corresponds to the first column value of each row in the DataTable.
   *
   * @param dataTable
   */
  static convertDataTableIntoStringList(dataTable: DataTable): string[] {
    const stringArray: string[] = [];
    dataTable.raw().forEach((row: string[]): void => {
      stringArray.push(row[0]);
    });
    return stringArray;
  }

  /**
   * Check that the parameters names passed in the step (as Map) are allowed
   * and throws an error if some params are not expected
   * @param valuesMap
   * @param allowedFieldNames
   */
  static checkAllowedParameters(
    valuesMap: Map<string, string>,
    allowedFieldNames: Array<string>,
  ) {
    const notAllowedFieldNames: Array<string> = Array.from(
      valuesMap.keys(),
    ).filter((keyName) => allowedFieldNames.indexOf(keyName) < 0);

    if (notAllowedFieldNames.length > 0)
      throw new Error(`"Steps field names error.\n - Not expected : ${notAllowedFieldNames.join(", ")}. 
                         - Allowed names : ${allowedFieldNames.join(", ")}"`);
  }
}
