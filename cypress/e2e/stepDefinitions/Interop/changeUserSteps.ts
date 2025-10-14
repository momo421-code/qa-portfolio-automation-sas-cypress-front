import { When, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import { changeUser } from "../../../page-objects/components/admin/changeUser";

// =======================
// WHEN
// =======================
When("un compte utilisateur venant d'être modifié", (dataTable: DataTable) => {
  const user = dataTable.rowsHash();

  // Récupérer email dynamique si placeholder
  let email = user["Courriel"];
  if (email.includes("[heure]")) {
    const now = new Date();
    const timeSuffix = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
    email = email.replace("[heure]", `_${timeSuffix}`);
  }

  cy.wrap(email).as("email");

  // Étapes pour modifier le compte
  changeUser.fillEmail(email);
  changeUser.clickFilterButton();
  changeUser.clickEditLink(email);

  // Remplir les champs si présents dans le DataTable
  changeUser.fillRole(user["Rôle"]);
  changeUser.fillLastName(user["Nom"]);
  changeUser.fillFirstName(user["Prénom"]);
  changeUser.selectTerritory(user["Territoire"]);

  changeUser.submitForm();
});

When(
  "un compte utilisateur {string} venant d'être supprimé",
  (email: string) => {
    // Vérifier si l'email est un placeholder et le remplacer par l'email du cypress.env.json
    if (email === "<regul1>") email = Cypress.env("regulatorEmails").regul1;
    if (email === "<ioa1>") email = Cypress.env("regulatorEmails").ioa1;

    cy.log("Email utilisé : " + email);

    // Sauvegarde pour les autres steps
    cy.wrap(email).as("email");
    Cypress.env("newRegulatorEmail", email);

    // Étape 1 : filtrer par email
    changeUser.fillEmail(email);

    // Étape 2 : cliquer sur "Filtrer"
    changeUser.clickFilterButton();

    // Étape 3 : cliquer sur "Modifier"
    cy.get("li.sas-edit.dropbutton__item.dropbutton-action a", {
      timeout: 20000,
    })
      .should("exist")
      .click();

    // Étape 4 : supprimer le compte
    cy.get("#edit-delete").should("be.visible").click();

    // Étape 5 : soumettre
    changeUser.submitForm();
  },
);

Then("un message de confirmation de modification est affiché", () => {
  changeUser.verifySuccessMessage();
});

Then("un message de confirmation de suppression est affiché", () => {
  changeUser.verifySuccessDeletion();
});
