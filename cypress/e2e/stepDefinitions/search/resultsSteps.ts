import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { CardComponent } from "../../../page-objects/components/searchPage/card.component";
import { AvailabilityType } from "../../../shared/availability/availabilityType";
import { availabilityData } from "../dashboard/availabilityEditionSteps";
import { overbookingSearch } from "./filtersSteps";
import { DataTable } from "@cucumber/cucumber";
import { DataTableUtils } from "../../../support/utils/dataTableUtils";
import { HealthOfferType } from "../../../shared/healthOffer/healthOfferType";
import { Availability } from "../../../shared/availability/Availability";
import { availabilityKeys } from "../../../shared/availability/availabilityDataConfig";
import { StringUtils } from "../../../support/utils/stringUtils";
import { ResultsPage } from "../../../page-objects/pages/results.page";
import { DateUtils } from "../../../support/utils/dateUtils";
import { accountFixtureUtils } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";
import { LoginPanel } from "../../../page-objects/panels/login.panel";

const cardComponent: CardComponent = new CardComponent();

//region Shared variables
let sharedHealthOfferName: string;
let sharedHealthOfferAddress: string;

/**
 * Returns the address of the health offer.
 * If the health offer type is a guard fix point, it returns an empty string.
 * Otherwise, it returns the shared address.
 */
export function getExpectedResultHealthOfferAddress(
  healthOfferType: HealthOfferType,
  address: string,
): string {
  return healthOfferType === HealthOfferType.SOS_GUARD_FIX_POINT ? "" : address;
}

//endregion
//region RESULTS
Then(/^au moins un résultat est présent$/, function (): void {
  CardComponent.oneCardIsPresent();
});

Then(/^aucun résultat n'est présent$/, function (): void {
  CardComponent.cardsAreAbsent();
});

/**
 * Check the current page and checks there is no card
 */
Then(/^aucun résultat n'est présent sur la page de recherche$/, function () {
  CardComponent.cardsAreAbsent();
});

/**
 * Checks that no search result is present (and LRM Cards can be present)
 */
Then(/^aucun résultat de recherche hors LRM n'est présent$/, function (): void {
  CardComponent.noSearchResultWithoutLrmIsPresent();
});

Then(
  /^le résultat "([^"]*)" à "([^"]*)" est présent$/,
  function (name: string, address: string): void {
    sharedHealthOfferName = name;
    sharedHealthOfferAddress = address;

    CardComponent.healthOfferIsPresentAfterIndexation(
      name,
      address,
      overbookingSearch,
    );
  },
);

Then(
  /^le résultat "([^"]*)" à "([^"]*)" est absent$/,
  function (name: string, address: string): void {
    CardComponent.healthOfferIsAbsentAfterIndexation(
      name,
      address,
      overbookingSearch,
    );
  },
);

Then(
  /^le résultat (.*) à (.*) est présent dans l'ensemble des résultats$/,
  function (name: string, address: string) {
    CardComponent.checkHealthOfferIsPresentOnAllResults(name, address);
  },
);

/**
 *  Using fixture file
 **/
Then(
  /^le lieu d'exercice (.+) de l'effecteur (.+) est absent de l'ensemble des résultats$/,
  function (locationId: string, practitionerAlias: string) {
    CardComponent.checkHealthOfferIsAbsentOnAllResults(
      accountFixtureUtils.getFullUserName(practitionerAlias),
      accountFixtureUtils
        .getLocationInfoById(
          practitionerAlias,
          HealthOfferType.PRACTICE_LOCATION,
          locationId,
        )
        .getAddress()
        .getFullAddress(),
    );
  },
);

/**
 *  Using fixture file
 **/
Then(
  /^le lieu d'exercice "(.+)" de l'effecteur "(.+)" est présent dans l'ensemble des résultats$/,
  function (locationId: string, practitionerAlias: string) {
    CardComponent.checkHealthOfferIsPresentOnAllResults(
      accountFixtureUtils.getUserAccount(practitionerAlias).getUserFullName(),
      accountFixtureUtils.getAddressById(
        practitionerAlias,
        HealthOfferType.PRACTICE_LOCATION,
        locationId,
      ),
    );
  },
);

//region Sorting
Then(/^tous les résultats sont triés par distance$/, function (): void {
  CardComponent.checkDistanceSorting();
});

Then(/^tous les résultats sont triés de façon aléatoire$/, function (): void {
  CardComponent.checkRandomSorting(overbookingSearch);
});
//endregion
//endregion
//region AVAILABILITY PRESENCE
Then("le résultat a des disponibilités", function (): void {
  CardComponent.healthOfferHasAvailability(
    sharedHealthOfferName,
    sharedHealthOfferAddress,
  );
});

Then(
  /^les disponibilités de certains jours du calendrier du résultat "([^"]*)" à "([^"]*)" sont absentes$/,
  function (name: string, address: string, days: DataTable): void {
    CardComponent.waitForResultIndexation(
      name,
      address,
      false,
      overbookingSearch,
    );
    DataTableUtils.convertDataTableIntoStringList(days).forEach(
      (day: string): void => {
        CardComponent.checkAvailabilityPresenceForDay(name, address, day, true);
      },
    );
  },
);

Then(
  /^les disponibilités de certains jours du calendrier du résultat "([^"]*)" à "([^"]*)" sont présentes$/,
  function (name: string, address: string, days: DataTable): void {
    CardComponent.waitForResultIndexation(
      name,
      address,
      false,
      overbookingSearch,
    );
    DataTableUtils.convertDataTableIntoStringList(days).forEach(
      (day: string): void => {
        CardComponent.checkAvailabilityPresenceForDay(name, address, day);
      },
    );
  },
);
//endregion
//region AVAILABILITY EXPECTED VALUES
/**
 * Verify if availability has the same data (hours, availability type and consultation modalities)
 * as the ones used for its creation.
 *
 * @param search
 * @param address
 * @param healthOfferType
 * @param isAvailabilityModified - Indicates if availability has been modified.
 */
function availabilityHasExpectedValues(
  search: string,
  address: string,
  healthOfferType: HealthOfferType,
  isAvailabilityModified: boolean = false,
): void {
  const availability: Availability = Availability.create(
    availabilityData,
    isAvailabilityModified,
  );

  CardComponent.availabilityHasExpectedValues(
    availability.type,
    Availability.getTimeRange(availability),
    availabilityData.get(availabilityKeys.DATE),
    availability.consultationModalities,
    search,
    getExpectedResultHealthOfferAddress(healthOfferType, address),
  );
}

/**
 * Verify if availability's recurrences have the same data (hours, availability type and consultation modalities)
 * as the ones used for its creation.
 *
 * @param search
 * @param address
 * @param healthOfferType
 * @param isAvailabilityModified - Indicates if availability has been modified.
 */
function recurringAvailabilitiesHaveExpectedValues(
  search: string,
  address: string,
  healthOfferType: HealthOfferType,
  isAvailabilityModified: boolean = false,
): void {
  const availability: Availability = Availability.create(
    availabilityData,
    isAvailabilityModified,
  );

  CardComponent.availabilitiesHasExpectedValues(
    availability.type,
    Availability.getTimeRange(availability),
    StringUtils.getElemAsArray(
      availabilityData.get(availabilityKeys.RECURRENCE_DAYS),
    ),
    availability.consultationModalities,
    search,
    getExpectedResultHealthOfferAddress(healthOfferType, address),
  );
}

//region Creation
Then(
  /^la disponibilité est visible sur le résultat avec les informations attendues$/,
  function (): void {
    availabilityHasExpectedValues(
      this.search,
      this.address,
      this.healthOfferType,
    );
  },
);

Then(
  /^la disponibilité est visible sur le résultat dans le cluster CPTS avec les informations attendues via le régulateur "([^"]*)"$/,
  function (regulatorAlias: string) {
    LoginPanel.disconnect();
    cy.logIn(regulatorAlias);

    ResultsPage.navigateToLoadedPage(this.search, this.address);
    cardComponent.accessToCptsCluster(this.cpts);
    availabilityHasExpectedValues(
      this.search,
      this.address,
      this.healthOfferType,
    );
  },
);

Then(
  /^les récurrences de la disponibilité sont visibles sur le résultat avec les informations attendues$/,
  function (): void {
    recurringAvailabilitiesHaveExpectedValues(
      this.search,
      this.address,
      this.healthOfferType,
    );
  },
);
//endregion

//region Modification
Then(
  /^la disponibilité modifiée est visible sur le résultat avec les informations attendues$/,
  function (): void {
    availabilityHasExpectedValues(
      this.search,
      this.address,
      this.healthOfferType,
      true,
    );
  },
);

Then(
  /^les récurrences modifiées de la disponibilité sont visibles sur le résultat avec les informations attendues$/,
  function (): void {
    recurringAvailabilitiesHaveExpectedValues(
      this.search,
      this.address,
      this.healthOfferType,
      true,
    );
  },
);
//endregion
//endregion
//region AVAILABILITY ABSENCE
Then(/^la disponibilité est absente sur le résultat$/, function (): void {
  CardComponent.availabilityIsAbsent(
    availabilityData,
    this.search,
    getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
  );
});

Then(
  /^la disponibilité et ses récurrences sont absentes du résultat$/,
  function (): void {
    CardComponent.availabilityIsAbsent(
      availabilityData,
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
    );
    CardComponent.availabilityRecurrencesAreAbsent(
      availabilityData,
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
    );
  },
);

Then(
  /^les récurrences de la disponibilité sont absentes sur le résultat$/,
  function (): void {
    CardComponent.availabilityRecurrencesAreAbsent(
      availabilityData,
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
    );
  },
);
//endregion
//region AVAILABILITY EXCEEDED HOURS
Then(
  /^les créneaux horaires du jour actuel n'ont pas leur heure de début dépassée$/,
  function (): void {
    CardComponent.availabilityTimeIsNotExceeded(AvailabilityType.CRENEAU);
  },
);

Then(
  /^les plages horaires du jour actuel n'ont pas leur heure de fin dépassée$/,
  function (): void {
    CardComponent.availabilityTimeIsNotExceeded(AvailabilityType.PLAGE);
  },
);

Then(
  /^la plage horaire "([^"]*)" du jour actuel est visible sur le résultat$/,
  function (availabilityHours: string): void {
    CardComponent.getAvailability(
      AvailabilityType.PLAGE,
      availabilityHours,
      "J",
      this.search,
      this.address,
    ).should("be.visible");
  },
);
//endregion
//region ORIENTATION
When(
  /^il oriente un patient sur la plage horaire "([^"]*)" à "([^"]*)" sur le résultat avec le créneau "([^"]*)"$/,
  function (timeWindow: string, day: string, timeSlot: string): void {
    CardComponent.directAPatient(
      AvailabilityType.PLAGE,
      timeWindow,
      day,
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
      1,
      timeSlot,
    );
  },
);

When(
  /^il oriente un patient sur le créneau horaire "([^"]*)" à "([^"]*)" sur le résultat$/,
  function (timeSlot: string, day: string): void {
    CardComponent.directAPatient(
      AvailabilityType.CRENEAU,
      timeSlot,
      day,
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
    );
  },
);

When(
  /^il oriente un patient de façon surnuméraire à "([^"]*)" le "([^"]*)" sur le résultat$/,
  function (startTime: string, day: string): void {
    CardComponent.directPatientExtra(
      startTime,
      day,
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
      true,
    );
  },
);

When(
  "il oriente un patient de façon surnuméraire sans renseigner de date",
  function (): void {
    cardComponent.navigateToFirstOrientationPopIn();
  },
);

When(
  "il oriente un patient de façon surnuméraire à la date du jour sans renseigner d'horaire",
  function (): void {
    cardComponent.navigateToFirstOrientationPopIn();
    cardComponent.indicateTodaysDate();
  },
);

Then("l'orientation ne peut pas être enregistrée", function (): void {
  cardComponent.orientationCannotBeValidated();
});

Then("il ne peut pas renseigner un horaire passé", function (): void {
  const nextSlot: string = DateUtils.roundUpToNextSlot(
    DateUtils.getCurrentTimeFormatted(),
  );
  const previousSlot: string = DateUtils.roundUpToPreviousSlot(
    DateUtils.getCurrentTimeFormatted(),
  );
  cardComponent.orientationNextSlotIs(nextSlot);
  cardComponent.orientationPreviousSlotIsNotAvailable(previousSlot);
});
Then("l'orientation ne peut pas être enregistrée sans date", function (): void {
  cardComponent.orientationCannotBeValidatedWithoutDate();
});

Then("l'orientation SAS a été enregistrée", function (): void {
  CardComponent.orientationIsValidated();
});

//endregion
//region MESSAGES
Then(
  /^la page de résultats s'affiche avec un message d'erreur SAMU$/,
  function () {
    ResultsPage.isMainErrorPresent();
  },
);

Then(/^le message de médecin traitant non trouvé est présent$/, function () {
  ResultsPage.preferredPractitionerIsUnknown();
});
//endregion
//region SAS PARTICIPATION
Then(
  /^la participation au SAS est visible sur le résultat$/,
  function (): void {
    const healthOfferCard: Cypress.Chainable = CardComponent.getHealthOfferCard(
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
    );
    CardComponent.checkSasParticipation(healthOfferCard);
  },
);

Then(
  /^le résultat a la mention de la participation au SAS(.*)$/,
  function (label: string): void {
    const defaultSasParticipationMention: string =
      "Accepte de prendre des patients en sus de ses disponibilités";
    const cptsSasParticipationMention: string = `${defaultSasParticipationMention} via la CPTS`;
    const mspSasParticipationMention: string = `${defaultSasParticipationMention} via une MSP`;

    const card: Cypress.Chainable = CardComponent.getHealthOfferCard(
      this.search,
      getExpectedResultHealthOfferAddress(this.healthOfferType, this.address),
    );

    switch (label.trimStart()) {
      case "via CPTS":
        CardComponent.waitForSasParticipationIndexation(
          this.search,
          this.address,
          cptsSasParticipationMention,
        );
        CardComponent.checkSasParticipationLabel(
          card,
          cptsSasParticipationMention,
        );
        break;
      case "via MSP":
        CardComponent.waitForSasParticipationIndexation(
          this.search,
          this.address,
          mspSasParticipationMention,
        );
        CardComponent.checkSasParticipationLabel(
          card,
          mspSasParticipationMention,
        );
        break;
      default:
        CardComponent.waitForSasParticipationIndexation(
          this.search,
          getExpectedResultHealthOfferAddress(
            this.healthOfferType,
            this.address,
          ),
          defaultSasParticipationMention,
        );
        CardComponent.checkSasParticipationLabel(
          card,
          defaultSasParticipationMention,
        );
        break;
    }
  },
);

Then(
  /^le résultat après indexation a la mention de la participation au SAS(.*)$/,
  function (label: string) {
    const defaultSasParticipationMention: string =
      "Accepte de prendre des patients en sus de ses disponibilités";
    const cptsSasParticipationMention: string = `${defaultSasParticipationMention} via la CPTS`;
    const mspSasParticipationMention: string = `${defaultSasParticipationMention} via une MSP`;

    switch (label.trim()) {
      case "via CPTS":
        CardComponent.checkSasParticipationIndexedCorrectly(
          this.search,
          this.address,
          cptsSasParticipationMention,
        ).should("eq", true);
        break;
      case "via MSP":
        CardComponent.checkSasParticipationIndexedCorrectly(
          this.search,
          this.address,
          mspSasParticipationMention,
        ).should("eq", true);
        break;
      default:
        CardComponent.checkSasParticipationIndexedCorrectly(
          this.search,
          this.address,
          defaultSasParticipationMention,
        ).should("eq", true);
        break;
    }
  },
);
//endregion
