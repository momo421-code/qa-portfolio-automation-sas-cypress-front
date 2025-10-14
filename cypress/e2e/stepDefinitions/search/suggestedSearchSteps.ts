import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { CardComponent } from "../../../page-objects/components/searchPage/card.component";
import { accountFixtureUtils } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";
import { ResultsPage } from "../../../page-objects/pages/results.page";
import { HealthOfferType } from "../../../shared/healthOffer/healthOfferType";
import { SuggestedFiltersData } from "../../../support/utils/fixtureUtils/suggestedSearchFixtureUtils/suggestedSearchFixtureData";
import { suggestedSearchFixture } from "../../../support/utils/fixtureUtils/suggestedSearchFixtureUtils/suggestedSearchFixtureUtils";

type StepsPractitionerInfosType = {
  userAlias: string;
  fullName: string;
  locationId: string;
};
type StepsFiltersInfosType = {
  name: string;
  types: Array<string>;
  specialties: Array<string>;
};

const suggestedSearchStepsData: {
  practitioner: StepsPractitionerInfosType;
  filter: StepsFiltersInfosType;
} = {
  practitioner: { userAlias: "", fullName: "", locationId: "" },
  filter: { name: undefined, types: [], specialties: [] },
};

//region before
before(() => {
  suggestedSearchFixture.loadData();
});
//endregion

//region steps

Given(/^le filtre de recherche suggérée "(.*)"$/, function (nomFiltre: string) {
  const filter: SuggestedFiltersData =
    suggestedSearchFixture.getFilter(nomFiltre);

  suggestedSearchStepsData.filter = filter as StepsFiltersInfosType;
  console.log(suggestedSearchStepsData);
});

When(
  /^l'utilisateur "([^"]+)" sur la page de résultats "([^"]+)" remontant le lieu d'exercice "([^"]+)" de l'effecteur "(.+)"$/,
  function (
    regulatorAlias: string,
    search: string,
    practitionerLocationId: string,
    practitionerAlias: string,
  ) {
    cy.logInWithSession(regulatorAlias);

    const location: string = accountFixtureUtils.getAddressById(
      practitionerAlias,
      HealthOfferType.PRACTICE_LOCATION,
      practitionerLocationId,
    );

    ResultsPage.navigateToLoadedPage(search, location);
  },
);

//endregion
Then(
  /^tous les résultats ont un type correspondant au filtre de recherche suggérée$/,
  function () {
    CardComponent.checkTypePresentOnAllResults(
      suggestedSearchStepsData.filter.types,
    );
  },
);
