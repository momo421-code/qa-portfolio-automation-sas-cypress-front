let individualHealthProsData;
let sosDoctorsAssociationsData;

export class IndividualHealthProFixtureUtils {
  static loadData() {
    cy.fixture("editorDataset/individualHealthPro.json").then((data) => {
      individualHealthProsData = data;
      console.log("TEST", individualHealthProsData);
    });
  }

  static getHealthProData(healthProAlias: string) {
    return individualHealthProsData.find(
      (healthProData) => healthProData.data_alias === healthProAlias,
    );
  }

  static getHealthProLocationData(healthProData, locationId: number) {
    return healthProData.locations.find(
      (healthProLocationData) => healthProLocationData.id === locationId,
    );
  }

  // TODO: SAS-9112
  // static getLocationSlotsDuration(healthProLocation): number {
  //   return healthProLocation.slot_configuration.duration;
  // }
  //
  // static getLocationSlotsStartingTime(healthProLocation): string {
  //   return healthProLocation.slot_configuration.start;
  // }
  //
  // static getLocationSlotsEndingTime(healthProLocation): string {
  //   return healthProLocation.slot_configuration.end;
  // }
}

export class SosDoctorsFixtureUtils {
  static loadData() {
    cy.fixture("editorDataset/sosDoctors.json").then((data) => {
      sosDoctorsAssociationsData = data;
      console.log("TEST", sosDoctorsAssociationsData);
    });
  }

  static getSosDoctorsAssociationData(sosDoctorsAssociationName: string) {
    return sosDoctorsAssociationsData.find(
      (sosDoctorsAssociationData) =>
        sosDoctorsAssociationData.organization.name ===
        sosDoctorsAssociationName,
    );
  }

  static getSosDoctorFixPointData(
    sosDoctorsAssociationData,
    sosDoctorsFixPointName,
  ) {
    return sosDoctorsAssociationData.locations.find(
      (sosDoctorsFixPointData) =>
        sosDoctorsFixPointData.name === sosDoctorsFixPointName,
    );
  }
}
