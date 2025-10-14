declare global {
  namespace Cypress {
    interface Chainable {
      clickIfExist(
        selector: string,
        parentElement?: Cypress.Chainable,
      ): Chainable<JQuery>;

      clickIfChecked(label: Cypress.Chainable): Chainable<JQuery>;

      clickIfUnchecked(label: Cypress.Chainable): Chainable<JQuery>;

      elementExists(selector: string): Cypress.Chainable<boolean>;

      subElementExists(selector: string): Cypress.Chainable<boolean>;

      openLinkInCurrentWindow(): Chainable<JQuery>;

      clearAndType(text: string): Chainable<JQuery>;

      loginToKeycloakAdmin(): Chainable<JQuery>;
    }
  }
}

Cypress.Commands.add(
  "clickIfExist",
  (
    selector: string,
    parentElement: Cypress.Chainable = cy.get("body"),
  ): void => {
    parentElement.then(($parentEl: JQuery): void => {
      if ($parentEl.find(selector).length) {
        cy.wrap($parentEl).find(selector).click();
      }
    });
  },
);

Cypress.Commands.add(
  "clickIfChecked",
  { prevSubject: "element" },
  ($checkbox: JQuery, label: Cypress.Chainable): void => {
    if ($checkbox.is(":checked")) {
      label.click();
    }
  },
);

Cypress.Commands.add(
  "clickIfUnchecked",
  { prevSubject: "element" },
  ($checkbox: JQuery, label: Cypress.Chainable): void => {
    if ($checkbox.not(":checked")) {
      label.click();
    }
  },
);

Cypress.Commands.add(
  "elementExists",
  (selector: string): Cypress.Chainable<boolean> => {
    return cy.get("body").then(($page: JQuery): boolean => {
      return $page.find(selector).length > 0;
    });
  },
);

Cypress.Commands.add(
  "subElementExists",
  { prevSubject: "element" },
  (subject: JQuery, selector: string): Cypress.Chainable<boolean> => {
    const exists: boolean = subject.find(selector).length > 0;
    return cy.wrap(exists);
  },
);

Cypress.Commands.add(
  "openLinkInCurrentWindow",
  { prevSubject: "element" },
  (element: Cypress.JQueryWithSelector): void => {
    cy.wrap(element).invoke("removeAttr", "target").click();
  },
);

Cypress.Commands.add(
  "clearAndType",
  { prevSubject: "element" },
  (element: Cypress.JQueryWithSelector, text: string): void => {
    cy.wrap(element).clear();
    cy.wrap(element).type(text);
  },
);
