import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { AggregatorPage } from "../../../page-objects/interop/aggregator.page";
import { DataTable } from "@cucumber/cucumber";

const aggregatorPage = new AggregatorPage();

Given("l'aggrégateur connecté", () => {
  aggregatorPage.loginAs();
});

When("il accède à la liste des comptes régulateurs", () => {
  aggregatorPage.goToRegulatorList();
});

Then("le statut du compte doit être {string}", (expectedStatus: string) => {
  aggregatorPage.verifyStatusInFiche(expectedStatus);
});

Then(
  "le compte avec l'email {string} est visible avec le statut {string}",
  (email: string, statut: string) => {
    const realEmail = email.includes("{{email}}")
      ? Cypress.env("newRegulatorEmail")
      : email;

    let statutAttendu: string;

    switch (statut) {
      case "Créer chez l'éditeur":
        statutAttendu = "to-create";
        break;
      case "Désactivé chez l'éditeur":
        statutAttendu = "disabled";
        break;
      default:
        statutAttendu = statut;
    }

    aggregatorPage.verifyAccountStatus(realEmail, statutAttendu);
  },
);

Then(
  "le compte avec l'email {string} a bien été modifié coté aggrégateur",
  (email: string, dataTable?: DataTable) => {
    const realEmail = email.includes("{{email}}")
      ? Cypress.env("newRegulatorEmail")
      : email;

    // Si des valeurs sont dans Cypress.env(), on les prend, sinon on utilise celles du scénario
    const expectedLastName =
      Cypress.env("newRegulatorLastName") || (dataTable?.rowsHash()?.Nom ?? "");
    const expectedFirstName =
      Cypress.env("newRegulatorFirstName") ||
      (dataTable?.rowsHash()?.Prénom ?? "");

    aggregatorPage.verifyAccountModified(
      realEmail,
      expectedLastName,
      expectedFirstName,
    );
  },
);

Then(
  "le compte avec l'email {string} n'est pas présent dans la liste des régulateurs",
  (email: string) => {
    const realEmail = email.includes("{{email}}")
      ? Cypress.env("newRegulatorEmail")
      : email;

    aggregatorPage.verifyAccountNotPresent(realEmail);
  },
);
