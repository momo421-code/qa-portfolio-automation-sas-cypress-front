import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import { HomePage } from "../../../page-objects/pages/home.page";

const homePage: HomePage = new HomePage();

Given("un utilisateur sur la page d'accueil", (): void => {
  homePage.navigateTo();
});

Then(/^l'utilisateur est redirigé vers la page d'accueil$/, function () {
  HomePage.isCurrentPage();
});
