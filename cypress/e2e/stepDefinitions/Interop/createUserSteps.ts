import { When, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { CreateUser } from "../../../page-objects/components/admin/createUser";
const createUser = new CreateUser();

/**
 * Étape : Création du compte utilisateur
 */
When("un compte utilisateur venant d'être créé", (dataTable: DataTable) => {
  const user = dataTable.rowsHash();

  // Récupérer l'email depuis Cypress.env() si placeholder
  let email = user["Courriel"];
  if (email === "<regul1>") email = Cypress.env("regulatorEmails").regul1;
  if (email === "<ioa1>") email = Cypress.env("regulatorEmails").ioa1;

  cy.log("Email utilisé : " + email);

  // Mise à disposition pour d'autres steps
  cy.wrap(email).as("email");
  cy.wrap(email).as("newRegulatorEmail");
  Cypress.env("newRegulatorEmail", email);

  // Actions sur le formulaire
  createUser.fillEmail(email);
  createUser.selectRole(user["Rôle"]);
  createUser.fillLastName(user["Nom"]);
  createUser.fillFirstName(user["Prénom"]);
  createUser.selectTerritory(user["Territoire"], user["Rôle"]);
  createUser.submit();
});

/**
 * Étape : Vérification du message de confirmation
 */
Then("un message de confirmation de création est affiché", () => {
  createUser.verifySuccessMessage();
});
