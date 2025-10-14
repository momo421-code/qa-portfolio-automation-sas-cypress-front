import { StringUtils } from "../../../support/utils/stringUtils";
import { SasParticipationNames } from "../../../shared/user/participationVia";

export class DashboardSasParametersComponent {
  // region Selectors
  // region SAS parameters banner
  private readonly editButton = () =>
    cy.get(".db-parameters-list .btn-highlight");
  private readonly sasParticipationParameterLabel = () =>
    cy.get(".resetul.list-service-data li").eq(0);
  private readonly editorTimeSlotParameterLabel = () =>
    cy.get(".resetul.list-service-data li").eq(1);
  // endregion
  // region SAS parameters pop-in
  private readonly sasParametersPopIn = () =>
    cy.get(".vuemodal-sas", {
      timeout: Cypress.env("sasParametersPopInTimeout"),
    });
  readonly submitButton = () => cy.get("[data-cy='save-button']");
  // region SAS participation
  private readonly editSasParticipationCheckbox = () =>
    cy.get("#edit_sas_participation");
  private readonly editSasParticipationLabel = () =>
    cy.get("label[for='edit_sas_participation']");
  private readonly editSasParticipationViaSelect = () =>
    cy.get("#edit_sas_participation_via");
  private readonly cptsInput = () => cy.get("[name='cpts']");
  private readonly cptsLinkedLocationsCheckbox = (location: string) =>
    cy.get(
      `fieldset div:has([for*='edit-cpts-locations']:contains('${location}')) input`,
    );
  private readonly cptsLinkedLocationsCheckboxes = () =>
    cy.get("[id*='edit-cpts-locations']");
  private readonly cptsLinkedLocationsLabels = (location?: string) =>
    cy.get(`[for*='edit-cpts-locations']:contains('${location}')`);
  private readonly mspInput = () => cy.get("[name='msp']");
  private readonly sosDoctorAssociationInput = () => cy.get("[name='sos']");
  private readonly healthOfferAutocompleteValue = (healthOfferName: string) =>
    cy.get(`.dropdown button:contains('${healthOfferName}')`, {
      timeout: 6000,
    });
  private readonly errorMessage = () => cy.get(".error-msg");
  // endregion
  // region Editor solution
  private readonly hasNotEditorRadio = () => cy.get("#has_not_software");
  private readonly hasNotEditorRadioLabel = () =>
    cy.get("[for='has_not_software']");
  private readonly hasEditorRadio = () => cy.get("#has_software");
  private readonly hasEditorRadioButtonLabel = () =>
    cy.get("[for='has_software']");
  private readonly sasParticipationSolemnDeclarationCheckbox = () =>
    cy.get("#edit-editor-disabled-hours-available");
  private readonly sasParticipationSolemnDeclarationLabel = () =>
    cy.get("[for='edit-editor-disabled-hours-available']");
  readonly editorsDropdownButton = () => cy.get("#select-editors-list");
  private readonly editorsAutocompleteField = () =>
    cy.get(".editor-select .editor-autocomplete input");
  private readonly editorAutocompleteValueLabel = (editor: string) =>
    cy.get(`[for*='editor-label']:contains(${editor})`);
  private readonly editorTags = () => cy.get(".tag-list button");
  // endregion
  // region Editor time slot display
  private readonly editorTimeSlotDisplayCheckboxSelector: string =
    "#edit_editor_disable";
  private readonly editorTimeSlotDisplayCheckbox = () =>
    cy.get(this.editorTimeSlotDisplayCheckboxSelector);
  private readonly editorTimeSlotDisplayLabel = () =>
    cy.get("label[for='edit_editor_disable']");
  private readonly editorTimeSlotDisplaySolemnDeclarationLabel = () =>
    cy.get("[for='edit-editor-disabled-hours-available']");
  // endregion
  // endregion
  // endregion

  // region SAS parameters banner
  checkThatEditorTimeSlotAreActivated(): void {
    this.editorTimeSlotParameterLabel().should("have.class", "on");
  }

  checkThatEditorTimeSlotAreNotActivated(): void {
    this.editorTimeSlotParameterLabel().should("have.class", "off");
  }

  checkThatSasParticipationIsActivated(): void {
    this.sasParticipationParameterLabel().should("have.class", "on");
  }

  checkThatSasParticipationIsNotActivated(): void {
    this.sasParticipationParameterLabel().should("have.class", "off");
  }
  // endregion

  // region SAS parameters pop-in

  uncheckAllParametersWithoutSaving(): void {
    this.editSasParticipationCheckbox()
      .invoke("attr", "value")
      .then(($value) => {
        const isChecked: boolean = $value === "true";
        if (!isChecked) {
          this.editSasParticipationLabel().click();
        }
        this.editSasParticipationLabel().click();
        this.editorTimeSlotDisplayLabel().click();
      });
  }

  acceptSasParticipationWithoutDefiningType(): void {
    this.editSasParticipationLabel().click();
  }

  acceptSasParticipationWithoutEditorTimeSlots(): void {
    this.editSasParticipationLabel().click();
    this.editSasParticipationViaSelect().select(
      SasParticipationNames.INDIVIDUAL,
    );
    this.hasEditorRadioButtonLabel().click();
    this.editorTimeSlotDisplayLabel().click();
  }

  selectIndividualSasParticipationWithoutSoftware(): void {
    this.editSasParticipationCheckbox()
      .click({ force: true })
      .should("have.value", "true");
    this.editSasParticipationViaSelect()
      .select(SasParticipationNames.INDIVIDUAL)
      .should("have.value", "1");
    this.hasNotEditorRadio().click({ force: true });
    this.sasParticipationSolemnDeclarationCheckbox().click({ force: true });
    this.submitButton().click();
  }

  initializeSasParametersValues(sasParameters: Map<string, string>) {
    return {
      sasParticipation: sasParameters.get("Participation au SAS"),
      hasEditorSolution: sasParameters.get("Solution éditeur") == "Oui",
      editors: StringUtils.getElemAsArray(sasParameters.get("Editeurs")),
      cpts: sasParameters.get("CPTS"),
      cptsLinkedLocations: StringUtils.getElemAsArray(
        sasParameters.get("Lieux rattachés à la CPTS"),
      ),
      msp: sasParameters.get("MSP"),
      sosDoctorAssociation: sasParameters.get("Association SOS Médecins"),
      isEditorTimeSlotDisplayed:
        sasParameters.get("Affichage créneaux éditeurs") === "Acceptation",
    };
  }

  openParametersPopIn(): void {
    this.editButton().click();
  }

  /**
   * Wait for the settings request to complete to avoid opening the SAS parameters modal, after editing parameters,
   * with the settings not saved.
   */
  saveSettings(): void {
    cy.intercept("GET", "settings").as("saveSettings");

    this.submitButton().click();
    this.sasParametersPopIn().should("not.exist");

    cy.wait("@saveSettings");
  }

  modifyAndUpdate(sasParameters: Map<string, string>): void {
    this.modify(sasParameters);
    this.saveSettings();
  }

  /**
   * Will modify SAS parameters without checking if they are set by default.
   */
  modify(sasParameters: Map<string, string>): void {
    const {
      sasParticipation,
      hasEditorSolution,
      editors,
      cpts,
      cptsLinkedLocations,
      msp,
      sosDoctorAssociation,
      isEditorTimeSlotDisplayed,
    } = this.initializeSasParametersValues(sasParameters);
    cy.wait(1500);
    this.openParametersPopIn();
    this.defineSasParticipation(
      sasParticipation,
      hasEditorSolution,
      editors,
      cpts,
      cptsLinkedLocations,
      msp,
      sosDoctorAssociation,
    );
    this.defineEditorTimeSlotDisplay(isEditorTimeSlotDisplayed);
  }

  isConfigSaved(sasParameters: Map<string, string>): void {
    const {
      sasParticipation,
      editors,
      cpts,
      cptsLinkedLocations,
      msp,
      sosDoctorAssociation,
      isEditorTimeSlotDisplayed,
    } = this.initializeSasParametersValues(sasParameters);

    this.openParametersPopIn();
    sasParameters.forEach((value: string, key: string): void => {
      switch (key) {
        case "Participation au SAS":
          if (!sasParticipation) {
            this.editSasParticipationCheckbox().then(
              ($editSasParticipationButton: JQuery): void => {
                cy.softAssert(
                  $editSasParticipationButton.is(":checked"),
                  false,
                  "SAS participation checkbox should not be checked",
                );
              },
            );
          } else {
            // region Select option values
            let selectOptionValue: number;
            switch (sasParticipation) {
              case SasParticipationNames.INDIVIDUAL:
                selectOptionValue = 1;
                break;
              case SasParticipationNames.CPTS:
                selectOptionValue = 2;
                break;
              case SasParticipationNames.MSP:
                selectOptionValue = 3;
                break;
              case SasParticipationNames.SOS:
                selectOptionValue = 4;
                break;
              default:
                throw new Error(
                  `This SAS participation type is unrecognized : "${sasParticipation}"`,
                );
            }
            // endregion

            this.editSasParticipationViaSelect()
              .invoke("val")
              .then((valueAttribute: string): void => {
                cy.softAssert(
                  parseInt(valueAttribute),
                  selectOptionValue,
                  `SAS participation should be '${value}'`,
                );
              });
          }
          break;
        case "Solution éditeur":
          if (value === "Oui") {
            this.hasEditorRadio().then(($hasEditorRadio: JQuery): void => {
              cy.softAssert(
                $hasEditorRadio.is(":checked"),
                true,
                "The 'Has Editor Solution' radio button should be selected",
              );
            });
          } else {
            this.hasNotEditorRadio().then(
              ($hasNotEditorRadio: JQuery): void => {
                cy.softAssert(
                  $hasNotEditorRadio.is(":checked"),
                  true,
                  "The 'Has Not Editor Solution' radio button should be selected",
                );
              },
            );
          }
          break;
        case "Editeurs":
          if (editors && editors.length !== 0) {
            this.editorTags().each(($editorTag: JQuery): void => {
              const tagText: string = $editorTag.text();
              const shouldBePresent: boolean = editors.includes(tagText);

              cy.softAssert(
                shouldBePresent,
                true,
                `Editor "${tagText}" should be ${shouldBePresent ? "present" : "absent"}`,
              );
            });
          }
          break;
        case "CPTS":
          if (cpts) {
            // Awaiting input to show CPTS name.
            this.cptsInput().invoke("val").should("not.be.empty");

            this.cptsInput().then(($cptsInput: JQuery): void => {
              const cptsInputValue: string = $cptsInput.val() as string;
              cy.softAssert(
                cptsInputValue.includes(cpts),
                true,
                `CPTS should be "${cpts}"`,
              );
            });
          }
          break;
        case "Lieux rattachés à la CPTS":
          if (cptsLinkedLocations && cptsLinkedLocations.length > 0) {
            cptsLinkedLocations.forEach((cptsLinkedLocation: string): void => {
              this.cptsLinkedLocationsCheckbox(cptsLinkedLocation).then(
                ($cptsLinkedLocationsCheckbox: JQuery): void => {
                  const isChecked: boolean =
                    $cptsLinkedLocationsCheckbox.is(":checked");
                  cy.softAssert(
                    isChecked,
                    true,
                    `CPTS linked location ${cptsLinkedLocation} should be checked`,
                  );
                },
              );
            });
            this.cptsLinkedLocationsCheckboxes().then(
              ($cptsLinkedLocationsCheckboxes: JQuery): void => {
                cy.softAssert(
                  $cptsLinkedLocationsCheckboxes.length,
                  cptsLinkedLocations.length,
                  `Checked checkboxes should be the same amount as CPTS linked locations`,
                );
              },
            );
          }
          break;
        case "MSP":
          if (msp) {
            // Awaiting input to show MSP name.
            this.mspInput().invoke("val").should("not.be.empty");

            this.mspInput().then(($mspInput: JQuery): void => {
              const mspInputValue: string = $mspInput.val() as string;
              cy.softAssert(
                mspInputValue.includes(msp),
                true,
                `MSP should be "${msp}"`,
              );
            });
          }
          break;
        case "Association SOS Médecins":
          if (sosDoctorAssociation) {
            // Awaiting input to show SOS doctor association name.
            this.sosDoctorAssociationInput()
              .invoke("val")
              .should("not.be.empty");

            this.sosDoctorAssociationInput().then(
              ($sosDoctorAssociationInput: JQuery): void => {
                const sosDoctorAssociationInputValue: string =
                  $sosDoctorAssociationInput.val() as string;
                cy.softAssert(
                  sosDoctorAssociationInputValue.includes(sosDoctorAssociation),
                  true,
                  `SOS doctor association should be "${sosDoctorAssociation}"`,
                );
              },
            );
          }
          break;
        case "Affichage créneaux éditeurs":
          this.editorTimeSlotDisplayCheckbox().then(
            ($editorTimeSlotDisplayCheckbox: JQuery): void => {
              cy.softAssert(
                $editorTimeSlotDisplayCheckbox.is(":checked"),
                !isEditorTimeSlotDisplayed,
                `SAS participation button should be  ${isEditorTimeSlotDisplayed ? "unchecked" : "checked"}`,
              );
            },
          );
          break;
        default:
          throw new Error(`This SAS parameter is unrecognized : "${key}"`);
      }
    });
    cy.softAssertAll();
  }

  // region Default parameters
  openAndRestoreDefaultParameters(): void {
    this.areSasParametersDefault().then(
      (areSasParametersDefault: boolean): void => {
        if (!areSasParametersDefault) {
          this.openParametersPopIn();
          this.restoreDefault();
          this.saveSettings();
        }
      },
    );
  }

  /**
   * Check if SAS participation is disabled and editor time slot display is activated on the SAS parameters banner.
   */
  private areSasParametersDefault(): Cypress.Chainable<boolean> {
    this.sasParticipationParameterLabel()
      .invoke("attr", "class")
      .as("sasParticipationValue");
    this.editorTimeSlotParameterLabel()
      .invoke("attr", "class")
      .as("editorTimeSlotValue");

    return cy.wrap(null).then(function () {
      const isSasParticipationOff = this.sasParticipationValue.includes("off");
      const isEditorTimeSlotOn = this.editorTimeSlotValue.includes("on");
      return isSasParticipationOff && isEditorTimeSlotOn;
    });
  }

  private restoreDefault(): void {
    this.editSasParticipationCheckbox().then(($checkbox: JQuery) => {
      if ($checkbox.is(":checked")) {
        this.editSasParticipationLabel().click();
      }
    });
    this.editorTimeSlotDisplayCheckbox().then(($checkbox: JQuery) => {
      if ($checkbox.is(":checked")) {
        this.editorTimeSlotDisplayLabel().click();
      }
    });
  }
  // endregion

  // region SAS participation
  private defineSasParticipation(
    sasParticipation: string,
    hasEditorSolution: boolean,
    editors?: string[],
    cptsName?: string,
    cptsLinkedLocations?: string[],
    mspName?: string,
    sosDoctorAssociationName?: string,
  ): void {
    if (!sasParticipation) {
      return;
    }

    switch (sasParticipation) {
      case SasParticipationNames.INDIVIDUAL:
        this.defineIndividualSasParticipation(hasEditorSolution, editors);
        break;
      case SasParticipationNames.CPTS:
        this.defineCptsSasParticipation(
          cptsName,
          cptsLinkedLocations,
          hasEditorSolution,
          editors,
        );
        break;
      case SasParticipationNames.MSP:
        this.defineMspSasParticipation(mspName, hasEditorSolution, editors);
        break;
      case SasParticipationNames.SOS:
        this.defineSosHealthProAssociationParticipation(
          sosDoctorAssociationName,
        );
        break;
      default:
        throw new Error(
          `This SAS participation type is unrecognized : "${sasParticipation}"`,
        );
    }
  }

  private selectSasParticipationType(
    sasParticipationType: SasParticipationNames,
  ): void {
    // TODO: Update this synchronisation.
    cy.wait(2000);

    this.editSasParticipationCheckbox().then(($checkbox: JQuery) => {
      if (!$checkbox.is(":checked")) {
        this.editSasParticipationLabel().click();
      }
    });
    this.editSasParticipationViaSelect().select(sasParticipationType);
  }

  private defineEditors(hasEditorSolution: boolean, editors?: string[]): void {
    if (hasEditorSolution) {
      this.hasEditorRadioButtonLabel().click();
      if (editors && editors.length > 0) {
        this.editorsDropdownButton().click();
        editors.forEach((editor: string): void => {
          this.editorsAutocompleteField().clear().type(editor);
          this.editorAutocompleteValueLabel(editor).click();
        });
      }
    } else {
      this.hasNotEditorRadioLabel().click();
      this.sasParticipationSolemnDeclarationLabel().click();
    }
  }

  private defineIndividualSasParticipation(
    hasEditorSolution: boolean,
    editors?: string[],
  ): void {
    this.selectSasParticipationType(SasParticipationNames.INDIVIDUAL);
    this.defineEditors(hasEditorSolution, editors);
  }

  /**
   * The code will not throw an error if some parameters - CPTS name or linked locations - are undefined.
   */
  private defineCptsSasParticipation(
    cptsName?: string,
    cptsLinkedLocations?: string[],
    hasEditorSolution?: boolean,
    editors?: string[],
  ): void {
    this.selectSasParticipationType(SasParticipationNames.CPTS);

    if (cptsName) {
      this.cptsInput().clear().type(cptsName);
      this.healthOfferAutocompleteValue(cptsName).click();
    }
    if (cptsLinkedLocations && cptsLinkedLocations.length > 0) {
      cptsLinkedLocations.forEach((cptsLinkedLocation: string): void => {
        this.cptsLinkedLocationsLabels(cptsLinkedLocation).click();
      });
    }

    if (hasEditorSolution !== undefined) {
      this.defineEditors(hasEditorSolution, editors);
    }
  }

  private defineMspSasParticipation(
    mspName?: string,
    hasEditorSolution?: boolean,
    editors?: string[],
  ): void {
    this.selectSasParticipationType(SasParticipationNames.MSP);

    if (mspName && mspName !== "") {
      this.mspInput().clear().type(mspName);
      this.healthOfferAutocompleteValue(mspName).click();
    }
    if (hasEditorSolution !== undefined) {
      this.defineEditors(hasEditorSolution, editors);
    }
  }

  private defineSosHealthProAssociationParticipation(
    sosDoctorAssociationName?: string,
  ): void {
    this.selectSasParticipationType(SasParticipationNames.SOS);
    if (sosDoctorAssociationName) {
      this.sosDoctorAssociationInput().clear().type(sosDoctorAssociationName);
      this.healthOfferAutocompleteValue(sosDoctorAssociationName).click();
    }
  }

  verifyErrorMessage(expectedMsg: string): void {
    this.errorMessage().contains(expectedMsg);
  }

  verifyParticipantInDashboardList(nomPraticien: string): void {
    cy.get(".effector-list-info")
      .contains(nomPraticien)
      .should("exist")
      .should("be.visible");
  }

  // region Editor time slot display
  private defineEditorTimeSlotDisplay(
    isEditorTimeSlotDisplayed: boolean,
  ): void {
    if (isEditorTimeSlotDisplayed) {
      this.editorTimeSlotDisplayCheckbox().then(($checkbox: JQuery) => {
        if ($checkbox.is(":checked")) {
          this.editorTimeSlotDisplayLabel().click();
        }
      });
    } else {
      // Editor time slot display checkbox will be disabled,
      // if user declare SAS participation with no editor solution,
      // and it will not be present if SAS participation is defined with SOS doctor association.
      cy.get("body").then(($body) => {
        const element = $body.find(this.editorTimeSlotDisplayCheckboxSelector);
        if (element.length > 0) {
          const isDisabled: boolean = element.is(":disabled");
          if (!isDisabled) {
            this.editorTimeSlotDisplayCheckbox().then(($checkbox: JQuery) => {
              if (!$checkbox.is(":checked")) {
                this.editorTimeSlotDisplayLabel().click();
                this.editorTimeSlotDisplaySolemnDeclarationLabel().click();
              }
            });
          }
        }
      });
    }
  }
  // endregion
  // endregion
}
