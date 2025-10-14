import { apiPaths } from "../../../shared/requests/apiPaths";
import Chainable = Cypress.Chainable;

export enum EditionOption {
  NONE,
  CANCEL,
  SAVE,
  CLOSE,
}

export const specialCharToCypressInput: Map<string | RegExp, string> = new Map([
  ["\\n", "{enter}"],
]);

export class AdditionalDataEditionPopInComponent {
  private static readonly popIn = () =>
    cy.get(".ui-widget:has(div:contains('Informations complémentaires'))", {
      timeout: 10000,
    });
  private static readonly textArea = () => cy.get(this.textAreaSelector);
  private static readonly textAreaSelector: string = "#edit-information";
  private static readonly cancelButtonSelector: string = ".btn-cancel";
  private static readonly saveButton = () => cy.get(".form-submit");
  private static readonly closeButton = () =>
    cy.get(".ui-dialog-titlebar-close");
  private static readonly textAreaAlias: string = "textAreaAlias";

  private static readonly selectAllAndClearText: string =
    "{selectall}{backspace}"; // {ctrl+a}

  static content: string;

  private static waitUntilDisappearance() {
    this.popIn().should("not.exist");
  }

  private static save() {
    this.saveButton().click();
    this.waitUntilDisappearance();
  }

  static close() {
    this.closeButton().click();
    this.waitUntilDisappearance();
  }

  static emptyAndSave() {
    this.textArea()
      .click({ force: true })
      .type("{selectall}{backspace}", { delay: 0 })
      .should("have.value", "")
      .trigger("input")
      .trigger("change")
      .blur();

    this.saveButton().should("exist").should("not.be.disabled").click();

    this.waitUntilDisappearance();
  }

  static clearAndUpdate(text: string) {
    this.textArea().clearAndType(text);
    this.save();
  }

  static getText(): Chainable<string> {
    return this.textArea()
      .invoke("val")
      .then((text: string) => {
        return text;
      });
  }

  static clear(option: EditionOption = EditionOption.SAVE) {
    cy.get(this.textAreaSelector).as(this.textAreaAlias).click({ force: true });
    cy.get("@" + this.textAreaAlias).type(this.selectAllAndClearText);
    this.postEditionAction(option);
  }

  /** Reset : if no content is present, nothing to do,
   * else, need to select all and remove
   * Can also be done the same way : add a character, select all, clear => the save will be allowed
   */
  static reset() {
    cy.get(this.textAreaSelector).click({ force: true });

    cy.get(this.textAreaSelector).clear();
    cy.get(this.textAreaSelector).type("A" + this.selectAllAndClearText);

    this.save();
  }

  static append(
    text: string,
    option: EditionOption = EditionOption.SAVE,
  ): void {
    cy.get(this.textAreaSelector).as(this.textAreaAlias).click({ force: true });
    cy.get(this.textAreaSelector).type(
      this.convertSpecialCharactersToCypress(text),
    );

    this.postEditionAction(option);
  }

  static replace(text: string, option: EditionOption = EditionOption.SAVE) {
    this.clear(EditionOption.NONE);
    this.append(this.convertSpecialCharactersToCypress(text), option);
  }

  static cancel() {
    cy.get(this.cancelButtonSelector).click();
  }

  /**
   * Its does not close the dialog.
   */
  static readContent(): Chainable<string> {
    return cy
      .get(this.textAreaSelector)
      .invoke("val")
      .then(
        (text) =>
          (AdditionalDataEditionPopInComponent.content = text as string),
      );
  }

  static checkContent(expectedText: string) {
    // Replace \\n by \n
    expectedText = expectedText.replaceAll("\\n", "\n");

    this.readContent().should("eq", expectedText);
    this.close();
  }

  private static waitBackend() {
    cy.intercept("POST", apiPaths.additionaData.url).as(
      apiPaths.additionaData.alias,
    );
  }

  private static convertSpecialCharactersToCypress(text: string): string {
    Array.from(specialCharToCypressInput.keys()).forEach((key) => {
      text = text.replaceAll(key, specialCharToCypressInput.get(key));
    });
    return text;
  }

  private static postEditionAction(option: EditionOption) {
    switch (option) {
      case EditionOption.SAVE:
        this.waitBackend();
        this.save();
        break;
      case EditionOption.CLOSE:
        this.close();
        break;
      case EditionOption.CANCEL:
        this.cancel();
        break;
      case EditionOption.NONE:
        break;
      default:
        throw new Error("Non supported option in function");
    }
  }
}
