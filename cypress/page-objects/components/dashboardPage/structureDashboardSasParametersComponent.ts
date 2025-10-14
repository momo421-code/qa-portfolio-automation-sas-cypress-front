export class StructureDashboardSasParametersComponent {
  // region Selectors
  private readonly editButton = () => cy.get(".js-btn-open-modal-sas");
  private readonly practitionerCountInput = () =>
    cy.get('input[name="practitioner_count"]');
  private readonly acceptSasParticipationCheckboxDiv = () =>
    cy.get(".js-form-item-sas-participation");
  private readonly honorDeclarationCheckboxDiv = () =>
    cy.get(".js-form-item-hours-available");
  private readonly acceptSasParticipationCheckbox = () =>
    cy.get('input[name="sas_participation"]');
  readonly submitButton = () => cy.get(".button.js-form-submit.form-submit");
  private readonly closeParametersPopInButton = () =>
    cy.get(".ui-dialog-titlebar-close");

  // endregion

  modify(sasParameters: Map<string, string>): void {
    const {
      participatingPractitionerNumber,
      acceptsSupernumeraryOrientation,
      honorDeclaration,
    } = this.initializeSasParametersValues(sasParameters);

    this.openParametersPopIn();

    this.defineSasParticipation(
      participatingPractitionerNumber,
      acceptsSupernumeraryOrientation,
      honorDeclaration,
    );
  }

  initializeSasParametersValues(sasParameters: Map<string, string>) {
    return {
      participatingPractitionerNumber: sasParameters.get(
        "Nombre de PS participant",
      ),
      acceptsSupernumeraryOrientation: sasParameters.get(
        "Acceptation orientation surnuméraire",
      ),
      honorDeclaration: sasParameters.get("Déclaration sur l'honneur"),
    };
  }

  openParametersPopIn(): void {
    this.editButton().click();
  }

  private defineSasParticipation(
    participatingPractitionerNumber: string,
    acceptsSupernumeraryOrientation: string,
    honorDeclaration: string,
  ): void {
    // TODO: tarteAuCitron type error; delete these lines when CDS dashboard evolves.
    Cypress.on("uncaught:exception", () => {
      return false;
    });

    this.practitionerCountInput().clear();
    if (participatingPractitionerNumber) {
      this.practitionerCountInput().type(participatingPractitionerNumber);
    }
    if (parseInt(participatingPractitionerNumber) > 0) {
      this.acceptSasParticipationCheckbox()
        .invoke("attr", "checked")
        .then(($attr) => {
          const isChecked: boolean = $attr === "checked";
          if (acceptsSupernumeraryOrientation === "Non" && isChecked) {
            this.acceptSasParticipationCheckboxDiv().click();
          } else if (acceptsSupernumeraryOrientation === "Oui" && !isChecked) {
            this.acceptSasParticipationCheckboxDiv().click();
            if (honorDeclaration === "Oui") {
              this.honorDeclarationCheckboxDiv().click();
            }
          } else if (
            acceptsSupernumeraryOrientation === "Oui" &&
            isChecked &&
            honorDeclaration === "Non"
          ) {
            this.honorDeclarationCheckboxDiv().click();
          }
        });
    }
  }

  /**
   * On dashboard, open the sas parameters pop-in then check its SAS participating practitioner number
   */
  checkThatSasParticipatingPractitionerNumberIs(
    practitionerNumber: number,
  ): void {
    this.openParametersPopIn();
    this.practitionerCountInput().should("have.value", practitionerNumber);
  }

  sasParticipationCheckboxIsNotVisible(): void {
    this.acceptSasParticipationCheckbox().should("not.be.visible");
  }

  saveParameters(): void {
    this.submitButton().click();
  }

  closeParametersPopIn(): void {
    this.closeParametersPopInButton().click();
  }
}
