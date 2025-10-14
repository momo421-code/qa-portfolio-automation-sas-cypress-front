export class CreateUserPage {
  goToCreateUserPageDirectly() {
    cy.get(".toolbar-icon-sas-config-main").click();
    cy.get(
      'a[href="/admin/sas/users"][title="Gérer les utilisateurs du SAS."]',
    ).click();
    cy.contains("a.admin-item__link", "Ajouter un utilisateur")
      .should("be.visible")
      .click();
  }
}
export class ChangeUserPage {
  goToCreateUserPageDirectly() {
    cy.get(".toolbar-icon-sas-config-main").click();
    cy.get(
      'a[href="/admin/sas/users"][title="Gérer les utilisateurs du SAS."]',
    ).click();
    cy.contains("a.admin-item__link", "SAS - Liste des utilisateurs (admin)")
      .should("be.visible")
      .click();
  }
}
