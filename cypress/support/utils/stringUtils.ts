/**
 * Tools for interacting with string.
 */
export class StringUtils {
  //region ENUM
  /**
   * Remove French characters and replace special ones with '_' character and put text into uppercase.
   *
   * @param text - Character string to format.
   */
  static formatTextToEnumCase(text: string): string {
    return this.replaceSpecialCharactersWith(text, "_").toUpperCase();
  }

  /**
   * Replace special characters with specific character.
   *
   * @param text - Character string to format.
   * @param by - Substitute character.
   */
  static replaceSpecialCharactersWith(text: string, by: string): string {
    return this.removeFrenchCharacters(text.replaceAll(/[ .',:;?&-]/g, by));
  }

  /**
   * Replace French characters to their equivalent without accent or diacritic.
   *
   * @param text - Character string to format.
   */
  static removeFrenchCharacters(text: string): string {
    return text.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  //endregion
  //region SPLIT

  /**
   * Convert a string with elements separated by semicolon into an Array of strings.
   * Useless white spaces around the semicolon and trailing and leading white spaces are removed.
   * Example : INPUT : "  médecine générale  ;  orthodontiste ;angiologie"
   *           OUTPUT : [ "médecine générale" ; "orthodontiste" ; "angiologie"]
   *
   * In case of JSON input elements, we can have string or Array<string>
   *     but it depends only on the content of the JSON file, we cannot know in advance
   *  The goal of this method is simplify the JSON analysis : the JSON parsing can call this method in all cases,
   *  without putting a condition
   *
   * @param values
   */
  static getElemAsArray(values: string | Array<string>): Array<string> {
    if (!values) return [];

    switch (typeof values) {
      case "string":
        return values.trim().split(/\s*;\s*/);
      case "object":
        if (
          Array.isArray(values) &&
          values.every((elem) => typeof elem === "string")
        )
          return values;

        throw new Error("Array of strings is expected for " + values);
      default:
        throw new Error(
          "Non managed data type for " + values + " : " + typeof values,
        );
    }
  }
}
//endregion
