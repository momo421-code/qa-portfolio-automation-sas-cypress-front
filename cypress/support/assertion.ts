declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * This command perform a soft assertion.
       * It will check if the actual value equals the expected value.
       * If the assertion fails, the error message is stored in an array for later use.
       */
      softAssert(actual, expected, message: string): Chainable;

      /**
       * A command to throw an error if any soft assertions have failed.
       * It will aggregate all stored error messages and throw a single error.
       */
      softAssertAll(): Chainable;
    }
  }
}

const errors: string[] = [];

Cypress.Commands.add("softAssert", (actual, expected, message: string) => {
  return cy
    .wrap(null, { timeout: Cypress.config("defaultCommandTimeout") })
    .then((): void => {
      try {
        expect(actual).to.equal(expected, message);
      } catch (err) {
        errors.push(`=> ${err.message}`);
      }
    });
});

Cypress.Commands.add("softAssertAll", (): void => {
  if (errors.length > 0) {
    const errorMessage: string = errors.join("\n\n");
    throw new Error(errorMessage);
  }
});
