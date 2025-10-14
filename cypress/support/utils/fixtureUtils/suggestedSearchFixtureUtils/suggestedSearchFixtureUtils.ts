import {
  SuggestedFiltersData,
  SuggestedFiltersJsonFieldNames,
} from "./suggestedSearchFixtureData";

class SuggestedSearchFixtureUtils {
  private static readonly fileVarName = "suggestedSearchFiltersFile";

  data: Array<SuggestedFiltersData> = new Array<SuggestedFiltersData>();

  private fixtureData: Array<JSON>;

  public loadDataFromEnv(pathVarName: string, force: boolean = false) {
    const fixtureAlias: string = `${pathVarName}Alias`;

    if (!this.fixtureData || force) {
      cy.fixture(`${Cypress.env(pathVarName)}.json`).then((data) => {
        cy.wrap(data as JSON).as(fixtureAlias);
        this.fixtureData = data;
      });
    }
  }

  public loadData(force: boolean = false) {
    this.loadDataFromEnv(SuggestedSearchFixtureUtils.fileVarName, force);
    this.data = new Array<SuggestedFiltersData>();
  }

  public getDataFromJson(name: string): SuggestedFiltersData {
    const jsonDataList: Array<JSON> = this.fixtureData.filter(
      (filter) => filter[SuggestedFiltersJsonFieldNames.NAME] === name,
    );

    if (!jsonDataList || jsonDataList.length === 0)
      throw new Error(
        `Cannot find suggested filter name ${name} in fixture file ${SuggestedSearchFixtureUtils.fileVarName} `,
      );

    if (jsonDataList.length > 1) {
      throw new Error(
        `Several entries found for suggested filter name ${name}. Must be unique in JSON file`,
      );
    } else {
      return new SuggestedFiltersData().init(jsonDataList[0]);
    }
  }

  public getFilter(name: string): SuggestedFiltersData {
    let filter = this.data.find((elem) => {
      elem.name == name;
    });
    if (filter) return filter;
    else {
      filter = this.getDataFromJson(name);
      this.data.push(filter);
      return filter;
    }
  }
} // end of class

let alreadyLooaded: boolean = false;
export let suggestedSearchFixture: SuggestedSearchFixtureUtils;
if (!alreadyLooaded) {
  suggestedSearchFixture = new SuggestedSearchFixtureUtils();
  alreadyLooaded = true;
}
