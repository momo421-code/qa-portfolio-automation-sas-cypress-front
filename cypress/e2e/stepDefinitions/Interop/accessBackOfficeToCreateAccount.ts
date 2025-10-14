import { When } from "@badeball/cypress-cucumber-preprocessor";
import {
  CreateUserPage,
  ChangeUserPage,
} from "../../../page-objects/components/admin/accessBo";

const createUserPage = new CreateUserPage();
const changeUserPage = new ChangeUserPage();

When("il accède au BO pour créer un compte", () => {
  createUserPage.goToCreateUserPageDirectly();
});

When("il accède au BO pour modifier un compte", () => {
  changeUserPage.goToCreateUserPageDirectly();
});
