import { AvailabilityType } from "../../../shared/availability/availabilityType";
import { Availability } from "../../../shared/availability/Availability";
import {
  availabilityKeys,
  editorSlotTimeFormat,
  sasAvailabilityTimeRangeFormat,
} from "../../../shared/availability/availabilityDataConfig";
import {
  ConsultationModality,
  getConsultationModalityLegends,
} from "../../../shared/availability/consultationModality";
import { FiltersComponent } from "./filters.component";
import { DateUtils } from "../../../support/utils/dateUtils";
import { StringUtils } from "../../../support/utils/stringUtils";
import moment from "moment";
import { currentTimeFormatted, ResultsPage } from "../../pages/results.page";
import { PaginationComponent } from "./pagination.component";
import { apiPaths } from "../../../shared/requests/apiPaths";
import { PractitionerSlotsRequests } from "../../../shared/requests/practitionerSlotsRequests";
import { SolrRequests } from "../../../shared/requests/solrRequests";
import {
  PractitionerSlotEntry,
  SolrEntry,
} from "../../../shared/requests/types";
import Chainable = Cypress.Chainable;
import { LoaderComponent } from "./loader.component";

const filtersComponent: FiltersComponent = new FiltersComponent();

export enum ResultsSelectionMode {
  ALL,
  SPECIFIC_ONLY,
  EXCLUDE_SPECIFIC,
}

export enum CardTypes {
  ANY,
  MEDECIN_TRAITANT,
  CPTS,
}

export type CheckOptionsType = {
  typeCheck: CheckCardOptionsValues;
  specialitiesCheck: CheckCardOptionsValues;
};
export enum CheckCardOptionsValues {
  NO_CHECK,
  EXACT,
  INCLUDED,
  NOT_INCLUDED,
  PARTIAL,
}
export const defaultCheckOptions = {
  typeCheck: CheckCardOptionsValues.EXACT,
  specialitiesCheck: CheckCardOptionsValues.EXACT,
};
export const emptyCheckOptions = {
  typeCheck: undefined,
  specialitiesCheck: undefined,
};

/**
 * Page objects of health offer cards on the current result page.
 * A result page contains a maximum of 5 cards.
 */
export class CardComponent {
  //region SELECTORS
  //region Cards
  private static readonly resultListSelector: string = ".search-list";
  private static readonly healthOfferCardSelector: string =
    "[data-cy='search-card']";
  private static readonly preferredDoctorLabel: string =
    ".search-card-preferred-doctor";
  private static readonly cptsSelector: string = ".search-card-cpts";
  private static cptsClusterAccessLink = () =>
    cy.get(".search-card-cpts .cluster-link");
  private static cardList = (
    selectionMode: ResultsSelectionMode = ResultsSelectionMode.ALL,
    cardType: CardTypes = CardTypes.ANY,
    timeout: number = 10000,
  ) =>
    cy.get(this.healthOfferCardSelectorWithOption(selectionMode, cardType), {
      timeout: timeout,
    });

  /**
   * Matching between a card type and a selector
   */
  private static readonly specificCardsSelectorsMap: Map<CardTypes, string> =
    new Map([
      [CardTypes.MEDECIN_TRAITANT, this.preferredDoctorLabel],
      [CardTypes.CPTS, this.cptsSelector],
    ]);

  /**
   * @param cardType - Médecin traitant, CPTS or ANY
   * @param option
   */
  private static healthOfferCardSelectorWithOption = (
    option: ResultsSelectionMode,
    cardType: CardTypes = CardTypes.ANY,
  ): string => {
    const typeCardSelector: string =
      CardComponent.specificCardsSelectorsMap.get(cardType);

    if (cardType === CardTypes.ANY) return this.healthOfferCardSelector;

    switch (option) {
      case ResultsSelectionMode.ALL:
        return this.healthOfferCardSelector;

      case ResultsSelectionMode.EXCLUDE_SPECIFIC:
        return `li:not(:has(${typeCardSelector})) ${this.healthOfferCardSelector}`;

      case ResultsSelectionMode.SPECIFIC_ONLY:
        return `li:has(${typeCardSelector}) ${this.healthOfferCardSelector}`;

      default:
        throw new Error(
          "Non managed healthOfferCardSelector value : " + option,
        );
    }
  };

  // To select cards without LRM results
  private static cardSelectorRegularSearch = (): string => {
    return this.healthOfferCardSelectorWithOption(
      ResultsSelectionMode.EXCLUDE_SPECIFIC,
      CardTypes.MEDECIN_TRAITANT,
    );
  };
  //endregion
  //region Result's data
  private static readonly healthOfferTitleSelector: string =
    // "[data-cy='card-title-label']";
    ".search-card-title-detail h2";
  private static readonly healthOfferAddressSelector: string =
    "[data-cy='card-address-label']";
  private static readonly healthOfferTypeSelector: string =
    "[data-cy='card-type-label']";
  private static readonly resultDistanceSelector: string =
    "[data-cy='card-distance-label']";
  private static readonly sasParticipationIconSelector: string =
    ".sas-icon-cnam";
  private static readonly additionalDataTextSelector: string =
    ".additional-information-content p";
  //endregion
  // region Convention
  private static healthOfferConventionSelector: string = ".list-specialities";
  // endregion
  // region CPTS
  private cptsClusterAccessLinkSelector: string = ".cluster-link";
  // endregion
  //region Availability schedule
  private static scheduleColumnsSelector: string = "[data-cy='agenda-column']";
  static timeSlotSelector: string = "[data-cy='time-slot']";
  static timeWindowSelector: string = "[data-cy='time-window']";
  static editorTimeSlotSelector: string = "[data-cy='editor-time-slot']";
  private static availabilitySelector: string = `${this.timeSlotSelector}, ${this.timeWindowSelector}, ${this.editorTimeSlotSelector}`;
  private static availabilityHoursSelector: string =
    "[data-cy='availability-time']";
  //endregion
  //region Availability's element
  private static availabilityTimeSelector: string = ".slot-header";
  private static patientCounterSelector: string = "[data-cy='patient-counter']";
  private static modalityLetterSelector: string =
    "[data-cy='consultation-modality-letter']";
  private static viewMoreLinkSelector: string =
    "[data-cy='view-more-availability-link']";
  //endregion
  //region Orientation
  private static supernumeraryOrientationButtonSelector: string =
    "[data-cy='supernumerary-button']";
  private static datePicker = () => cy.get("[data-cy='date-input']");
  private static hourSelect = () => cy.get("[data-cy='time-selector']");
  private static addPatientButton = () =>
    cy.get("[data-cy='add-patient-button']");
  private static saveButton = () => cy.get("[data-cy='save-button']");
  private static confirmButton = () => cy.get("[data-cy='confirm-button']");
  private static closeButton = () => cy.get("[data-cy='close-button']");
  //endregion
  //endregion

  //region LOADING
  /**
   * Wait for results indexation to process to display a specific result by reloading the page.
   * If overbooking search was applied, apply it each time it is reload.
   *
   * @param name - Health offer's name.
   * @param address - Health offer's address.
   * @param healthOfferAbsence - If we need to search if it absent.
   * @param overbookingSearch - If you need to apply additional slots filter.
   */
  static waitForResultIndexation(
    name: string,
    address: string,
    healthOfferAbsence: boolean,
    overbookingSearch: boolean = false,
  ): void {
    const maxAttempts: number = 12;
    let attempt: number = 0;

    const checkResults = (): void => {
      cy.get("body").then(($page: JQuery): void => {
        const isPresent: boolean =
          $page.find(
            `${CardComponent.getHealthOfferCardSelector(name, address)}`,
          ).length > 0;
        const conditionMet: boolean = healthOfferAbsence
          ? isPresent
          : !isPresent;

        if (conditionMet) {
          if (attempt < maxAttempts) {
            cy.wait(1000); // Use to await, if not, it will reload the page too many times.
            ResultsPage.reload();

            if (overbookingSearch) {
              filtersComponent.applyOverbookingFilter();
            }

            attempt++;
            checkResults();
          } else {
            const errorMessage: string = healthOfferAbsence
              ? "Expected result is still present after indexation."
              : "Expected result is still absent after indexation.";
            throw new Error(errorMessage);
          }
        }
      });
    };

    checkResults();
  }

  static waitForSasParticipationIndexation(
    name: string,
    address: string,
    sasParticipationMention: string,
  ): void {
    const maxAttempts: number = 15;
    let attempt: number = 0;

    const checkResults = (): void => {
      this.getHealthOfferCard(name, address)
        .find(CardComponent.sasParticipationIconSelector)
        .invoke("text")
        .then((text) => {
          const conditionMet: boolean = sasParticipationMention !== text;

          if (conditionMet) {
            if (attempt < maxAttempts) {
              cy.wait(1000); // Use to await, if not, it will reload the page too many times.
              ResultsPage.reload();

              attempt++;
              checkResults();
            } else {
              assert.fail(
                `SAS participation should be ${sasParticipationMention}`,
              );
            }
          }
        });
    };

    checkResults();
  }

  static checkSasParticipationIndexedCorrectly(
    name: string,
    address: string,
    sasParticipationMention: string,
  ): Cypress.Chainable<boolean> {
    const maxAttempts: number = 15;
    let attempt: number = 0;

    const checkResults = (): Cypress.Chainable<boolean> => {
      return cy
        .get("body")
        .then(($page: JQuery): Cypress.Chainable<boolean> => {
          const isCardPresent: boolean =
            $page.find(
              `${CardComponent.getHealthOfferCardSelector(name, address)}`,
            ).length > 0;

          if (isCardPresent) {
            return this.getHealthOfferCard(name, address)
              .find(CardComponent.sasParticipationIconSelector)
              .invoke("text")
              .then((text) => {
                const isTextCorrect: boolean =
                  text.trim() === sasParticipationMention;

                if (isTextCorrect) {
                  return cy.wrap(true);
                } else if (attempt < maxAttempts) {
                  attempt++;
                  cy.wait(1500);
                  ResultsPage.reload();
                  return checkResults();
                } else {
                  assert.fail(
                    `SAS participation text should be "${sasParticipationMention}" but was "${text.trim()}" after indexation attempts.`,
                  );
                }
              });
          } else if (attempt < maxAttempts) {
            attempt++;
            cy.wait(1500);
            ResultsPage.reload();
            return checkResults();
          } else {
            assert.fail(
              "Expected health offer card is still absent after indexation attempts.",
            );
          }
        });
    };

    return checkResults();
  }

  //endregion
  //region CARD RESULTS
  /**
   * Define health offer card's selector with its name and address.
   *
   * @param name - Health offer's name
   * @param address - Health offer's address
   */
  static getHealthOfferCardSelector(name: string, address: string): string {
    return `${this.healthOfferCardSelector}:has(.search-card-title-detail:contains(${name})):has(*:contains(${address}))`;
  }

  /**
   * Define health offer card's selector with its name and address.
   *
   * @param name - Health offer's name
   * @param address - Health offer's address
   */
  static getHealthOfferCard(name: string, address: string): Cypress.Chainable {
    return cy.get(`${this.getHealthOfferCardSelector(name, address)}`);
  }

  getFirstHealthOfferCard(): Cypress.Chainable {
    return cy.get(CardComponent.healthOfferCardSelector).eq(0);
  }

  //region Sorting
  /**
   * Verify if results are sorted firstly by SAS participation, then by ascending distance.
   * If there is no distance in card, it will verify if distance equals 0 or this one is created by aggregator.
   */
  static checkDistanceSorting(): void {
    let previousDistance: number | null = null;
    let currentDistance: number;
    let isSortedBySasParticipation: boolean = true;

    const verifyCardDistance = (): void => {
      cy.get(
        CardComponent.healthOfferCardSelectorWithOption(
          ResultsSelectionMode.EXCLUDE_SPECIFIC,
          CardTypes.CPTS,
        ),
      ).each(($card: JQuery): void => {
        cy.wrap($card)
          .subElementExists(CardComponent.sasParticipationIconSelector)
          .then((isActualSortedBySasParticipation: boolean): void => {
            if (
              !isSortedBySasParticipation &&
              isActualSortedBySasParticipation
            ) {
              throw new Error(
                "Result should be firstly sorted by SAS participation.",
              );
            } else if (
              isSortedBySasParticipation &&
              !isActualSortedBySasParticipation
            ) {
              previousDistance = null;
            }
            isSortedBySasParticipation = isActualSortedBySasParticipation;
          });

        cy.wrap($card)
          .subElementExists(this.resultDistanceSelector)
          .then((isDistancePresent: boolean): void => {
            if (isDistancePresent) {
              cy.wrap($card)
                .find(this.resultDistanceSelector)
                .invoke("text")
                .then((distance: string): number => {
                  if (distance.match(/^\d+ m$/)) {
                    return parseInt(distance, 10) / 1000;
                  } else {
                    return parseInt(distance, 10);
                  }
                })
                .then((currentDistance: number): void => {
                  if (previousDistance !== null) {
                    expect(
                      currentDistance,
                      "Results are sorted by distance",
                    ).to.be.at.least(previousDistance);
                  }
                  previousDistance = currentDistance;
                });
            } else {
              this.getCardTitle(cy.wrap($card)).then((title: string): void => {
                this.getCardAddress(cy.wrap($card)).then(
                  (address: string): void => {
                    let found: boolean = this.doesDistanceEqualZero(
                      title,
                      address,
                    );
                    if (found) {
                      currentDistance = 0;
                      previousDistance = currentDistance;
                    } else {
                      found = this.isCreatedByAggregator(title, address);
                    }
                    expect(
                      found,
                      "Card without distance is at the same address " +
                        "as search one or is created by aggregator",
                    ).to.be.true;
                  },
                );
              });
            }
          });
      });
      PaginationComponent.goToNextPage().then((hasNextPage: boolean): void => {
        if (hasNextPage) {
          verifyCardDistance();
        }
      });
    };

    verifyCardDistance();
  }

  /**
   * If Solr return distance 0 for a result, then the distance is not displayed.
   *
   * @param title - Result's title.
   * @param address - Result's address.
   */
  private static doesDistanceEqualZero(
    title: string,
    address: string,
  ): boolean {
    let found: boolean = false;
    SolrRequests.getResultEntries().forEach((result: SolrEntry): void => {
      if (
        title == result.title &&
        address == result.address &&
        result.distance == 0
      ) {
        found = true;
      }
    });
    return found;
  }

  private static isCreatedByAggregator(
    title: string,
    address: string,
  ): boolean {
    let found: boolean = false;
    PractitionerSlotsRequests.getResultEntries().forEach(
      (result: PractitionerSlotEntry): void => {
        if (
          (title.toLowerCase().includes(result.firstname.toLowerCase()) ||
            title.toLowerCase().includes(result.lastname.toLowerCase())) &&
          address.toLowerCase().includes(result.address.toLowerCase())
        ) {
          found = true;
        }
      },
    );
    return found;
  }

  /**
   * Verify if results order are not the same if you reload the result page :
   * add in an array, title and address from each result card,
   * reload page, do it again in another array and then verify if the arrays are not deeply equal.
   */
  static checkRandomSorting(overbookingSearch: boolean = false): void {
    const initialResults: { title: string; address: string }[] = [];
    const newResults: { title: string; address: string }[] = [];

    const addCardTitleAndAddress = (
      results: { title: string; address: string }[],
    ): void => {
      if (overbookingSearch) {
        filtersComponent.applyOverbookingFilter();
      }

      this.cardList().each(($card: JQuery): void => {
        this.getCardTitleAndAddress($card, results);
      });

      PaginationComponent.goToNextPage().then((hasNextPage: boolean): void => {
        if (hasNextPage) {
          addCardTitleAndAddress(results);
        }
      });
    };

    cy.wrap(initialResults)
      .then((order: { title: string; address: string }[]): void => {
        addCardTitleAndAddress(order);
      })
      .then(() => {
        ResultsPage.reload();
        return cy.wrap(newResults);
      })
      .then((order: { title: string; address: string }[]) => {
        addCardTitleAndAddress(order);
      })
      .then((): void => {
        expect(
          initialResults,
          "New results are not ordered as the first one",
        ).to.not.deep.equal(newResults);
      });
  }

  /**
   * Returns result card's title as a chainable.
   *
   * @param card
   */
  private static getCardTitle(card: Cypress.Chainable): Chainable<string> {
    return card.find(this.healthOfferTitleSelector).invoke("text");
  }

  /**
   * Returns result card's address as a chainable.
   *
   * @param card
   */
  private static getCardAddress(card: Cypress.Chainable): Chainable<string> {
    return card.find(this.healthOfferAddressSelector).invoke("text");
  }

  /**
   * Add result card's title and address in an array.
   *
   * @param card
   * @param resultList - List of result defined by their title and address.
   */
  private static getCardTitleAndAddress(
    card: JQuery,
    resultList: { title: string; address: string }[],
  ): void {
    CardComponent.getCardTitle(cy.wrap(card)).then((title: string): void => {
      CardComponent.getCardAddress(cy.wrap(card)).then(
        (address: string): void => {
          resultList.push({ title, address });
        },
      );
    });
  }

  //endregion

  //region Results presence
  /**
   * Verify if at least one card element is present.
   */
  static oneCardIsPresent(
    lrmOption: ResultsSelectionMode = ResultsSelectionMode.ALL,
    cardType: CardTypes = CardTypes.ANY,
  ): void {
    this.cardList(lrmOption, cardType).should("have.lengthOf.above", 0);
  }

  /**
   * Verify if there is 0 card element present.
   * By default, we search only search results (ie nor LRM nor CPTS)
   */
  static cardsAreAbsent(cardType: CardTypes = CardTypes.ANY): void {
    this.cardList(ResultsSelectionMode.SPECIFIC_ONLY, cardType).should(
      "have.lengthOf",
      0,
    );
  }

  /**
   * Compares the displayed cards list with the expected ones, works only with one page for the moment
   * @param resultsSelectionMode
   * @param cardType
   * @param search
   * @param addresses
   */

  /* WARNING : pour la gestion de la pagination ultérieurement, il faudra s'arrêter dès qu'on a une CARD autre que MT dans la page
    sinon l'appel cardList(LRM) echoue lorsqu'il n'y a plus de CARD MT
    */
  static allCardsArePresent(
    resultsSelectionMode: ResultsSelectionMode = ResultsSelectionMode.ALL,
    cardType: CardTypes = CardTypes.ANY,
    search: string,
    addresses: Array<string>,
  ) {
    type CheckCardItemType = { address: string; found: boolean };
    const cardsCheckList: Array<CheckCardItemType> =
      new Array<CheckCardItemType>();

    this.cardList(resultsSelectionMode, cardType)
      .then(($cardList) => {
        addresses.forEach((elem) =>
          cardsCheckList.push({ found: false, address: elem }),
        );

        cy.wrap($cardList).each(($card) => {
          this.getCardTitle(cy.wrap($card)).then(($title) => {
            // Check with lower case and without accent
            expect(
              StringUtils.removeFrenchCharacters($title).toLowerCase(),
            ).to.contain(
              StringUtils.removeFrenchCharacters(search).toLowerCase(),
            );
            this.getCardAddress(cy.wrap($card)).then(($address) => {
              // search address in the checklist
              const foundIndex: number = cardsCheckList.findIndex(
                (elem) => elem.address.toLowerCase() === $address.toLowerCase(),
              );
              expect(foundIndex >= 0, `Address ${$address} was expected `).to.be
                .true;

              cardsCheckList[foundIndex].found = true; // update the status of the address
            });
          });
        });
      })
      .then(() => {
        // Search addresses which have not been met in cards
        const nonFoundCards: Array<CheckCardItemType> = cardsCheckList.filter(
          (elem) => !elem.found,
        );

        let msg = `List of non found results for ${search}`;
        nonFoundCards.forEach((elem) => (msg += " - " + elem.address + "\n"));
        expect(nonFoundCards.length, `${msg}`).to.be.eq(0);
      });
  }

  /**
   * checks that only search results are present, and not other specific cards (LRM)
   */
  static onlySearchResultsWithoutLrmArePresent() {
    this.cardList(
      ResultsSelectionMode.EXCLUDE_SPECIFIC,
      CardTypes.MEDECIN_TRAITANT,
    ).should("have.length.above", 0);
  }

  static noSearchResultWithoutLrmIsPresent() {
    this.cardList(
      ResultsSelectionMode.EXCLUDE_SPECIFIC,
      CardTypes.MEDECIN_TRAITANT,
    ).should("have.lengthOf", 0);
  }

  //endregion

  //region Specific result presence

  /**
   * Check health offer is present
   * @param name
   * @param address
   */
  static checkHealthOfferIsPresent(name: string, address: string): void {
    this.getHealthOfferCard(name, address).should("be.visible");
  }

  /**
   * Check the result is present somewhere in all results
   * @param name
   * @param address
   */
  static checkHealthOfferIsPresentOnAllResults(
    name: string,
    address: string,
  ): Chainable<boolean> {
    let found = false;
    cy.get(this.resultListSelector).then((cardList) => {
      if (
        cardList.find(this.getHealthOfferCardSelector(name, address)).length > 0
      ) {
        found = true;
        return found;
      } else {
        PaginationComponent.goToNextPage().then((hasNextPage) => {
          if (hasNextPage === true) {
            this.checkHealthOfferIsPresentOnAllResults(name, address).then(
              (found) => {
                return found;
              },
            );
            return found;
          } else return false;
        });
      }
      return found;
    });
    return cy.wrap(found);
  }

  /**
   * Verify if specific health offer is visible after waiting for indexation.
   *
   * @param name - Health offer's name
   * @param address - Health offer's address
   * @param overbookingSearch - If you need to apply additional slots filter
   */
  static healthOfferIsPresentAfterIndexation(
    name: string,
    address: string,
    overbookingSearch: boolean = false,
  ): void {
    this.waitForResultIndexation(name, address, false, overbookingSearch);
    this.checkHealthOfferIsPresent(name, address);
  }

  /**
   * Check that health offer is not present
   * @param name
   * @param address
   */
  static checkHealthOfferIsAbsent(name: string, address: string): void {
    this.getHealthOfferCard(name, address).should("not.exist");
  }

  /**
   * Verify if specific health offer does not exist after waiting for indexation.
   *
   * @param name - Health offer's name
   * @param address - Health offer's address
   * @param overbookingSearch - If you need to apply additional slots filter
   */
  static healthOfferIsAbsentAfterIndexation(
    name: string,
    address: string,
    overbookingSearch: boolean = false,
  ): void {
    this.waitForResultIndexation(name, address, true, overbookingSearch);
    this.checkHealthOfferIsAbsent(name, address);
  }

  /**
   * Goes through all pages and check that the expected elem is not present
   * @param name
   * @param address
   */
  static checkHealthOfferIsAbsentOnAllResults(
    name: string,
    address: string,
  ): void {
    this.checkHealthOfferIsAbsent(name, address);
    PaginationComponent.goToNextPage().then((hasNextPage) => {
      if (hasNextPage) {
        PaginationComponent.goToNextPage();
        this.checkHealthOfferIsAbsentOnAllResults(name, address);
      }
    });
  }

  // TODO: Modify expectedAvailabilitySelector to be an enum.
  static displayedAvailabilitiesAreExpectedTypeAfterIndexation(
    name: string,
    address: string,
    expectedAvailabilitySelector: string[],
  ) {
    const maxAttempts: number = 12;
    let attempt: number = 0;

    // this.viewMoreAvailabilities(CardComponent.getHealthOfferCard(name, address));
    const checkAdditionalData = () => {
      const expectedAvailabilitySelectors = expectedAvailabilitySelector.map(
        (selector) => selector.replace(/\[data-cy='|']/g, ""),
      );

      return CardComponent.getHealthOfferCard(name, address)
        .find(CardComponent.availabilitySelector)
        .then(($availabilities) => {
          const availabilityTypeIsCorrect = $availabilities
            .toArray()
            .every((availability) => {
              return expectedAvailabilitySelectors.includes(
                availability.getAttribute("data-cy"),
              );
            });

          if (!availabilityTypeIsCorrect && attempt < maxAttempts) {
            attempt++;
            cy.wait(1500);
            ResultsPage.reload();
            checkAdditionalData();
          } else if (!availabilityTypeIsCorrect && attempt >= maxAttempts) {
            return false;
          } else {
            return true;
          }
        });
    };
    return checkAdditionalData();
  }

  static enterInFirstCPTSClusterCard(): void {
    this.cptsClusterAccessLink().click();
  }
  //endregion
  //endregion
  //region AVAILABILITY
  /**
   * Get the appropriate selector based on the availability type.
   *
   * @param availabilityType
   */
  private static getAvailabilitySelector(
    availabilityType: AvailabilityType,
  ): string {
    switch (availabilityType) {
      case AvailabilityType.CRENEAU:
        return this.timeSlotSelector;
      case AvailabilityType.PLAGE:
        return this.timeWindowSelector;
      case AvailabilityType.CRENEAU_EDITEUR:
        return this.editorTimeSlotSelector;
      default:
        throw new Error("Unknown availability type");
    }
  }

  /**
   * Get specific availability from a health offer card.
   *
   * @param availabilityType - Time slot or time window
   * @param availabilityHours - Start time and end time : 'xxhxx - xxhxx'
   * @param day - Schedule day in 'J' or 'J+n' format
   * @param name - Health offer's name
   * @param address - Health offer's address
   */
  static getAvailability(
    availabilityType: AvailabilityType,
    availabilityHours: string,
    day: string,
    name: string,
    address: string,
  ): Cypress.Chainable {
    const availabilitySelector: string =
      this.getAvailabilitySelector(availabilityType);
    const dayNumber: number = this.getCalendarColumnNumber(day);

    if (!availabilityHours.match(sasAvailabilityTimeRangeFormat)) {
      throw new Error(`Time period '${availabilityHours}' is not recognized, 
            please use this format : 'xxhxx - xxhxx'.`);
    }

    return this.getHealthOfferCard(name, address)
      .find(this.scheduleColumnsSelector)
      .eq(dayNumber)
      .find(
        `${availabilitySelector}:has(${this.availabilityHoursSelector}:contains(${availabilityHours}))`,
      );
  }

  //region Exceeded availability
  /**
   * Verify for each time slots of the first column of each result if its start time is not exceeded,
   * or verify for each time window of the first column of each result if its end time is not exceeded.
   *
   * Show more results in each card if available,
   * and go to next pages if possible.
   *
   * @param availabilityType
   */
  static availabilityTimeIsNotExceeded(
    availabilityType: AvailabilityType,
  ): void {
    const availabilitySelector: string =
      this.getAvailabilitySelector(availabilityType);

    const checkTimeSlots = (): void => {
      this.cardList(ResultsSelectionMode.EXCLUDE_SPECIFIC, CardTypes.CPTS).each(
        ($card: JQuery, index: number): void => {
          if ($card.find(CardComponent.cptsSelector).length == 0) {
            this.viewMoreAvailabilities(this.cardList().eq(index));
            cy.wrap($card)
              .find(this.scheduleColumnsSelector)
              .eq(0)
              .then(($firstColumn: JQuery): void => {
                if ($firstColumn.find(availabilitySelector).length) {
                  cy.wrap($firstColumn)
                    .find(availabilitySelector)
                    .each(($availability: JQuery): void => {
                      this.verifyAvailabilityTime(
                        cy.wrap($availability),
                        availabilityType,
                      );
                    });
                }
              });
          }
        },
      );
      PaginationComponent.goToNextPage().then((hasNextPage: boolean): void => {
        if (hasNextPage) {
          checkTimeSlots();
        }
      });
    };
    checkTimeSlots();
  }

  /**
   * Verify if the availability time is not exceeded:
   * start time for time slot and end time for time window.
   *
   * @param availability
   * @param availabilityType
   */
  private static verifyAvailabilityTime(
    availability: Cypress.Chainable,
    availabilityType: AvailabilityType,
  ): void {
    const currentTimeMoment: moment.Moment =
      DateUtils.convertTimeStringToMoment(currentTimeFormatted);

    availability
      .find(this.availabilityHoursSelector)
      .invoke("text")
      .then((text: string): string => {
        return this.extractAvailabilityTimeText(text, availabilityType);
      })
      .then((timeText: string): void => {
        const timeMoment: moment.Moment =
          DateUtils.convertTimeStringToMoment(timeText);
        const errorMessage: string = `Time slot's ${availabilityType === AvailabilityType.CRENEAU ? "start" : "end"} time: ${timeText} 
        is after actual time ${currentTimeFormatted}`;

        expect(timeMoment.isAfter(currentTimeMoment), errorMessage).to.be.true;
      });
  }

  /**
   * Extract the relevant time text based on availability type:
   * start time for time slot and end time for time window.
   *
   * @param availabilityTime
   * @param availabilityType
   */
  private static extractAvailabilityTimeText(
    availabilityTime: string,
    availabilityType: AvailabilityType,
  ): string {
    switch (availabilityType) {
      case AvailabilityType.CRENEAU:
        return availabilityTime.match(editorSlotTimeFormat)
          ? availabilityTime
          : availabilityTime.match(sasAvailabilityTimeRangeFormat)[1];
      case AvailabilityType.PLAGE:
        return availabilityTime.match(sasAvailabilityTimeRangeFormat)[2];
      default:
        throw new Error("Unknown availability type.");
    }
  }

  //endregion
  //region Calendar
  /**
   * Get the number of the Schedule column corresponding to the given day.
   * Days are represented as 'J' for the current day and 'J+n' for future days (0 ≤ n ≤ 2).
   *
   * @param day - The day string to get the column number for.
   * @private
   */
  private static getCalendarColumnNumber(day: string): number {
    if (day.match("^[Jj]$")) {
      return 0;
    } else if (day.match("^[Jj]\\+[0-2]$")) {
      return parseInt(day.replace(/[Jj]+/, ""));
    } else {
      throw new Error(
        `Day '${day}' is not recognized, please use these formats : 'J' or 'J+n', where 0 ≤ n ≤ 2.`,
      );
    }
  }

  /**
   * Click on view more availability link, in specific health offer card, if it exits.
   *
   * @param healthOfferCard
   */
  private static viewMoreAvailabilities(
    healthOfferCard: Cypress.Chainable,
  ): void {
    cy.clickIfExist(this.viewMoreLinkSelector, healthOfferCard);
  }

  //endregion
  //region Availability presence
  /**
   * Verify if specific health offer has at least one availability.
   *
   * @param name - Health offer's name
   * @param address - Health offer's address
   */
  static healthOfferHasAvailability(name: string, address: string): void {
    this.getHealthOfferCard(name, address)
      .find(this.availabilitySelector)
      .should("have.lengthOf.above", 0);
  }

  /**
   * Check the absence of a specific availability in a health offer card.
   *
   * @param availabilityData
   * @param healthOfferName
   * @param healthOfferAddress
   */
  static availabilityIsAbsent(
    availabilityData: Map<string, string>,
    healthOfferName: string,
    healthOfferAddress: string,
  ): void {
    const availability: Availability = Availability.create(availabilityData);
    this.getAvailability(
      availability.type,
      Availability.getTimeRange(availability),
      availabilityData.get(availabilityKeys.DATE),
      healthOfferName,
      healthOfferAddress,
    ).should("not.exist");
  }

  /**
   * Check the absence of recurrences of a specific availability in a health offer card.
   *
   * @param availabilityData
   * @param healthOfferName
   * @param healthOfferAddress
   */
  static availabilityRecurrencesAreAbsent(
    availabilityData: Map<string, string>,
    healthOfferName: string,
    healthOfferAddress: string,
  ): void {
    StringUtils.getElemAsArray(
      availabilityData.get(availabilityKeys.RECURRENCE_DAYS),
    ).forEach((date: string): void => {
      const availability: Availability = Availability.create(availabilityData);
      this.getAvailability(
        availability.type,
        Availability.getTimeRange(availability),
        date,
        healthOfferName,
        healthOfferAddress,
      ).should("not.exist");
    });
  }

  /**
   * Check the presence of availability for the specified day.
   * Throws an error if availability presence or absence conditions are not met.
   *
   * @param name - Health offer's name
   * @param address - Health offer's address
   * @param day - Schedule day in 'J' or 'J+n' format (0 ≤ n ≤ 2).
   * @param availabilityAbsence - If true, checks for absence of availability, otherwise checks for presence.
   */
  static checkAvailabilityPresenceForDay(
    name: string,
    address: string,
    day: string,
    availabilityAbsence: boolean = false,
  ): void {
    const dayNumber: number = this.getCalendarColumnNumber(day);

    this.getHealthOfferCard(name, address)
      .find(this.scheduleColumnsSelector)
      .eq(dayNumber)
      .then(($scheduleDay: JQuery): void => {
        const availabilityPresence: boolean =
          $scheduleDay.find(`${this.availabilitySelector}`).length > 0;

        if (availabilityPresence && availabilityAbsence) {
          throw new Error(
            `There is still availability in schedule day number ${dayNumber}.`,
          );
        } else if (!availabilityPresence && !availabilityAbsence) {
          throw new Error(
            `There is no availability in day number ${dayNumber}.`,
          );
        }
      });
  }

  // TODO: SAS-9112
  // static getExpectedEditorSlots(
  //     start: string,
  //     end: string,
  //     duration: number,
  //     isActualDay: boolean,
  //     currentTime?: string
  // ): string[] {
  //   const dataTimeFormat: string = "HH:mm:ss";
  //   const resultTimeFormat: string = "HH[h]mm";
  //
  //   const startTime = moment(start, dataTimeFormat).format(resultTimeFormat);
  //   const endTime = moment(end, dataTimeFormat).format(resultTimeFormat);
  //
  //   const slots: string[] = [];
  //
  //   let currentSlot = moment(startTime, resultTimeFormat);
  //   const finalEndTime = moment(endTime, resultTimeFormat);
  //
  //   while (currentSlot.clone().add(duration, "minutes").isBefore(finalEndTime)) {
  //     if (isActualDay) {
  //       if (currentSlot.isSameOrAfter(currentTime)) {
  //         slots.push(currentSlot.format(resultTimeFormat));
  //       }
  //     } else {
  //       slots.push(currentSlot.format(resultTimeFormat));
  //     }
  //     currentSlot.add(duration, "minutes");
  //   }
  //
  //   return slots;
  // }
  //
  // static getEditorSlots(name: string, address: string) {
  //   this.getHealthOfferCard(name, address)
  //       .find(this.scheduleColumnsSelector)
  //
  // }

  //endregion
  //region Availability's data
  /**
   * Verify if availability has the same data - hours, availability type and consultation modalities,
   * as the ones used for its creation.
   *
   * @param availabilityType
   * @param availabilityHours
   * @param date
   * @param consultationModalities
   * @param healthOfferName
   * @param healthOfferAddress
   */
  static availabilityHasExpectedValues(
    availabilityType: AvailabilityType,
    availabilityHours: string,
    date: string,
    consultationModalities: ConsultationModality[],
    healthOfferName: string,
    healthOfferAddress: string,
  ): void {
    this.viewMoreAvailabilities(
      cy.get(
        this.getHealthOfferCardSelector(healthOfferName, healthOfferAddress),
      ),
    );

    this.getAvailability(
      availabilityType,
      availabilityHours,
      date,
      healthOfferName,
      healthOfferAddress,
    ).then(($availability: JQuery): void => {
      this.availabilityTypeIsExpected(cy.wrap($availability), availabilityType);
      this.consultationModalitiesAreExpected(
        cy.wrap($availability),
        consultationModalities,
      );
    });
  }

  static availabilitiesHasExpectedValues(
    availabilityType: AvailabilityType,
    availabilityHours: string,
    dates: string[],
    consultationModalities: ConsultationModality[],
    healthOfferName: string,
    healthOfferAddress: string,
  ): void {
    dates.forEach((day: string): void => {
      const dayNumber: number = parseInt(day.replace(/[^\d]/g, ""));

      if (dayNumber <= 2) {
        this.availabilityHasExpectedValues(
          availabilityType,
          availabilityHours,
          day,
          consultationModalities,
          healthOfferName,
          healthOfferAddress,
        );
      }
    });
  }

  /**
   * Verify if the type of specific availability is expected.
   *
   * @param availabilityElement
   * @param availabilityType - Type of the modality
   * @private
   */
  private static availabilityTypeIsExpected(
    availabilityElement: Cypress.Chainable,
    availabilityType: AvailabilityType,
  ): void {
    switch (availabilityType) {
      case AvailabilityType.CRENEAU:
        availabilityElement
          .find(this.patientCounterSelector)
          .should("not.exist");
        break;
      case AvailabilityType.PLAGE:
        availabilityElement.find(this.patientCounterSelector).should("exist");
        break;
      default:
        throw new Error(`Availability type ${availabilityType} is not recognized,
                please use '${AvailabilityType.CRENEAU}' or '${AvailabilityType.PLAGE}'.`);
    }
  }

  /**
   * Verify if each consultation modalities are well displayed in the form of a corresponding letter.
   *
   * @param availability - Specific availability
   * @param consultationModalities - List of modalities of availability
   */
  private static consultationModalitiesAreExpected(
    availability: Cypress.Chainable,
    consultationModalities: ConsultationModality[],
  ): void {
    availability
      .find(`${this.modalityLetterSelector}`)
      .then(($modalityLetters: JQuery) => {
        // Extract inner text from each element.
        return Cypress.$.makeArray($modalityLetters).map(
          (modalityLetter: HTMLElement) => modalityLetter.innerText,
        );
      })
      .then((consultationModalityLetters: string[]): void => {
        const consultationModalityLegends: string[] =
          getConsultationModalityLegends(consultationModalities);

        // Verify if there is the expected amount of consultation modality legends.
        cy.wrap(consultationModalityLetters).should(
          "have.length",
          consultationModalityLegends.length,
        );
        // Verify if each letter correspond to expected consultation modalities.
        for (let i: number = 0; i < consultationModalityLetters.length; i++) {
          cy.wrap(consultationModalityLegends).should(
            "include",
            consultationModalityLetters[i],
          );
        }
      });
  }

  //endregion
  //region Availability times
  static checkAvailableInFilterApplication(
    filters: string[],
    currentTime: moment.Moment,
  ): void {
    const checkFilterApplication = (): void => {
      this.cardList(ResultsSelectionMode.EXCLUDE_SPECIFIC, CardTypes.CPTS).each(
        ($card: JQuery): void => {
          let found: boolean = false;

          this.viewMoreAvailabilities(cy.wrap($card));
          cy.wrap(null)
            .then(() => {
              filters.forEach((filter: string) => {
                this.checkAvailabilitiesWithinTimePeriod(
                  cy.wrap($card),
                  filter,
                  currentTime,
                ).then((matchFound: boolean): void => {
                  if (matchFound == true) {
                    found = true;
                    return;
                  }
                });
              });
            })
            .then((): void => {
              expect(found, `Result's availabilities fit in filter time period`)
                .to.be.true;
            });
        },
      );

      PaginationComponent.goToNextPage().then((hasNextPage: boolean): void => {
        if (hasNextPage) {
          checkFilterApplication();
        }
      });
    };
    checkFilterApplication();
  }

  /**
   * Checks if any availabilities within the result card match the specified time period from Available In filter.
   *
   * @param card
   * @param filter
   * @param currentTime
   */
  private static checkAvailabilitiesWithinTimePeriod(
    card: Cypress.Chainable,
    filter: string,
    currentTime: moment.Moment,
  ): Cypress.Chainable<boolean> {
    const filterHours: { start: number; end: number } =
      FiltersComponent.getHoursFromAvailableInFilter(filter);
    const filterStartTime: moment.Moment = currentTime
      .clone()
      .add(filterHours.start, "hours");
    const filterEndTime: moment.Moment = currentTime
      .clone()
      .add(filterHours.end, "hours");
    let matchFound: boolean = false;

    const checkColumn = ($columns: JQuery, index: number): void => {
      if (index >= $columns.length) {
        return;
      }

      const $column: JQuery = $columns.eq(index);
      if ($column.find(this.availabilitySelector).length > 0) {
        cy.wrap($column)
          .find(this.availabilitySelector)
          .each((availability: JQuery): void => {
            // TODO: Delete '.eq(0)' when span.slot-header in span.slot-header for editor slots will be deleted.
            const availabilityTimes: string = availability
              .find(this.availabilityHoursSelector)
              .eq(0)
              .text();

            let slotTimes: { startTime: string; endTime: string };
            if (availabilityTimes.match(editorSlotTimeFormat)) {
              slotTimes = {
                startTime: availabilityTimes,
                endTime: availabilityTimes,
              };
            } else {
              slotTimes = this.getTimesFromSasAvailability(availabilityTimes);
            }
            if (
              this.isAvailabilityWithinFilterTime(
                { startTime: slotTimes.startTime, endTime: slotTimes.endTime },
                filterStartTime,
                filterEndTime,
                index,
              )
            ) {
              matchFound = true;
            }
          });
      }
      if (!matchFound) {
        checkColumn($columns, index + 1);
      }
    };
    return card
      .find(this.scheduleColumnsSelector)
      .then(($columns: JQuery): void => {
        checkColumn($columns, 0);
      })
      .then(() => {
        return matchFound;
      });
  }

  /**
   * Could be used for a SAS availability or an editor slot.
   * In the last case, use editor slot time for both startTime and endTime parameters.
   *
   * @param slotTimes
   * @param filterStartTime
   * @param filterEndTime
   * @param day - Agenda day number.
   */
  private static isAvailabilityWithinFilterTime(
    slotTimes: { startTime: string; endTime: string },
    filterStartTime: moment.Moment,
    filterEndTime: moment.Moment,
    day: number,
  ): boolean {
    const slotStartTime: moment.Moment = DateUtils.convertTimeStringToMoment(
      slotTimes.startTime,
    ).add(day, "day");
    const slotEndTime: moment.Moment = DateUtils.convertTimeStringToMoment(
      slotTimes.endTime,
    ).add(day, "day");

    const isSlotStartInsideFilter: boolean = slotStartTime.isBetween(
      filterStartTime,
      filterEndTime,
      undefined,
      "[]",
    );
    const isSlotEndInsideFilter: boolean = slotEndTime.isBetween(
      filterStartTime,
      filterEndTime,
      undefined,
      "[]",
    );
    const isFilterInsideSlot: boolean =
      filterStartTime.isBetween(slotStartTime, slotEndTime, undefined, "[]") &&
      filterEndTime.isBetween(slotStartTime, slotEndTime, undefined, "[]");

    return (
      isSlotStartInsideFilter || isSlotEndInsideFilter || isFilterInsideSlot
    );
  }

  private static getTimesFromSasAvailability(availabilityTimes: string): {
    startTime: string;
    endTime: string;
  } {
    const match: RegExpMatchArray = availabilityTimes.match(
      sasAvailabilityTimeRangeFormat,
    );

    if (match && match.length === 3) {
      const startTime: string = match[1];
      const endTime: string = match[2];
      return { startTime, endTime };
    } else {
      throw new Error("Invalid format for a SAS availability");
    }
  }

  // region Editor slot
  static getFirstAvailabilityLink(name, address) {
    return CardComponent.getHealthOfferCard(name, address)

      .wait(3000)

      .find(
        CardComponent.getAvailabilitySelector(AvailabilityType.CRENEAU_EDITEUR),
      )
      .eq(0)
      .find(this.availabilityTimeSelector)
      .find("a")
      .invoke("attr", "href")
      .then((link) => link);
  }

  // endregion

  //endregion
  //endregion
  //region ORIENTATIONS
  //region Orientation validation
  /**
   * Validate orientation (SAS or supernumerary) by click sequence.
   */
  private static validateOrientation(): void {
    this.saveButton().click();
    this.confirmButton().click();
    this.closeButton().click();
  }

  //endregion

  //region Orientation request
  /**
   * Intercept orientation request.
   */
  private static interceptOrientationRequest(): void {
    cy.intercept("POST", apiPaths.orientation.url).as(
      apiPaths.orientation.alias,
    );
  }

  /**
   * Verify if orientation request is successful and not null.
   */
  static orientationIsValidated(): void {
    cy.wait(`@${apiPaths.orientation.alias}`).then(
      (orientationRequest): void => {
        expect(orientationRequest.response.statusCode).to.eq(200);
        expect(orientationRequest.response.body).to.not.be.null;
      },
    );
  }

  //endregion

  //region SAS ORIENTATION
  /**
   * Direct a patient from a specific availability,
   * and intercept orientation request.
   *
   * @param availabilityType - Time slot or time window
   * @param availabilityHours - Start time and end time : 'xxhxx - xxhxx'
   * @param day - Schedule day 'J' or 'J+n'
   * @param healthOfferName - Health offer's name
   * @param healthOfferAddress - Health offer's address
   * @param orientationTimes - How many times you want to orient this availability
   */
  static directAPatient(
    availabilityType: AvailabilityType,
    availabilityHours: string,
    day: string,
    healthOfferName: string,
    healthOfferAddress: string,
    orientationTimes: number = 1,
    timeSlot?: string,
  ): void {
    this.interceptOrientationRequest();

    for (let i = 0; i < orientationTimes; i++) {
      this.viewMoreAvailabilities(
        this.getHealthOfferCard(healthOfferName, healthOfferAddress),
      );
      this.getAvailability(
        availabilityType,
        availabilityHours,
        day,
        healthOfferName,
        healthOfferAddress,
      )
        .eq(-1)
        .click();
      if (availabilityType == AvailabilityType.PLAGE) {
        if (timeSlot) {
          cy.get("button.current-available-slot").click();
          cy.get("#available-slot-list").contains(timeSlot).click();
        }
        this.addPatientButton().click();
      }

      this.validateOrientation();
    }
  }

  //endregion

  //region SUPERNUMERARY ORIENTATION
  /**
   * Direct patient from supernumerary orientation,
   * and intercept orientation request.
   *
   * @param startTime - Orientation start time : 'xxhxx'
   * @param day - Schedule day 'J' or 'J+n'
   * @param healthOfferName - Health offer's name
   * @param healthOfferAddress - Health offer's address
   * @param onFirstCard - if true, when multiple cards are displayed, select the first one
   */
  static directPatientExtra(
    startTime: string,
    day: string,
    healthOfferName: string,
    healthOfferAddress: string,
    onFirstCard: boolean = false,
  ): void {
    this.interceptOrientationRequest();
    if (onFirstCard) {
      this.getHealthOfferCard(healthOfferName, healthOfferAddress)
        .find(this.supernumeraryOrientationButtonSelector)
        .eq(0)
        .click();
    } else {
      this.getHealthOfferCard(healthOfferName, healthOfferAddress)
        .find(this.supernumeraryOrientationButtonSelector)
        .click();
    }

    this.datePicker().type(DateUtils.getRelativeDateForDatePicker(day));

    if (startTime.match("^(\\d{2})h(\\d{2})$")) {
      this.hourSelect().select(startTime);
    } else {
      throw new Error(`Availability's start time '${startTime}' is not recognized, 
            please use this format : 'xxhxx'.`);
    }

    this.validateOrientation();
  }

  navigateToFirstOrientationPopIn(): void {
    CardComponent.interceptOrientationRequest();
    this.getFirstHealthOfferCard()
      .find(CardComponent.supernumeraryOrientationButtonSelector)
      .click();
  }

  indicateTodaysDate(): void {
    const day: string = DateUtils.getDateFromToday("J", "YYYY-MM-DD");
    CardComponent.datePicker().type(day);
  }

  orientationCannotBeValidated(): void {
    CardComponent.saveButton().should("be.disabled");
  }

  orientationCannotBeValidatedWithoutDate(): void {
    CardComponent.datePicker().then(($date) => {
      expect($date.val()).to.equal("");
    });
    this.orientationCannotBeValidated();
  }

  orientationNextSlotIs(slot: string): void {
    CardComponent.hourSelect().select(0).should("have.value", slot);
  }

  orientationPreviousSlotIsNotAvailable(slot: string): void {
    cy.get(`select option:contains('${slot}')`).should("not.exist");
  }

  //endregion
  //endregion
  //region HEALTH OFFER'S DETAILS
  /**
   * Check on current results page if results have expected type.
   *
   * @param values - Result's type(s)
   */
  static checkTypePresentOnCurrentResults(values: string[]): Cypress.Chainable {
    return cy
      .get(this.cardSelectorRegularSearch())
      .each(($elem: JQuery<HTMLElement>) => {
        const typeText = $elem.find(this.healthOfferTypeSelector).text().trim();

        const matchFound = values.some((expected) =>
          typeText.includes(expected),
        );

        expect(
          matchFound,
          `Le type "${typeText}" n'est pas dans la liste autorisée : ${values.join(", ")}`,
        ).to.be.true;
      });
  }

  static checkTypePresentOnAllResults(values: string[]): void {
    this.checkTypePresentOnCurrentResults(values).then(() => {
      PaginationComponent.goToNextPage().then((hasNextPage) => {
        if (hasNextPage) {
          // Optionnel : attendre le chargement
          cy.wait(500);
          this.checkTypePresentOnAllResults(values);
        }
      });
    });
  }

  /**
   * Check convention values on the available results - no pagination
   * @param values - values allowed for the card
   * @param absentAllowed - true if convention can be null
   */
  static checkConventionPresentOnCurrentResults(
    values: Array<string>,
    absentAllowed: boolean = false,
  ): void {
    cy.get(this.healthOfferCardSelector).each(($elem: JQuery): void => {
      const text: string = $elem
        .find(this.healthOfferConventionSelector)
        .text();

      if (text.length === 0)
        expect(
          absentAllowed,
          "It is expected to have no convention on the result",
        ).to.be.true;
      else {
        if (values.length > 0) expect(text).to.be.oneOf(values);
        else expect(text).to.be.empty;
      }
    });
  }

  /**
   * Reuse the checkConventionPresentOnCurrentResults to go through all pages
   * At least one result must be present
   * @param values
   * @param [absentAllowed=false]
   */
  static checkConventionPresentOnAllResults(
    values: Array<string>,
    absentAllowed: boolean = false,
  ): void {
    this.checkConventionPresentOnCurrentResults(values, absentAllowed);

    PaginationComponent.goToNextPage().then((hasNextPage) => {
      if (hasNextPage) {
        this.checkConventionPresentOnAllResults(values, absentAllowed);
      }
    });
  }

  static checkAdditionalDataIndexedCorrectly(
    healthOfferCardSelector: string,
    additionalData: string,
    shouldDataBePresent: boolean,
  ): Cypress.Chainable<boolean> {
    const maxAttempts: number = 10;
    let attempt: number = 0;

    const checkAdditionalData = (): Cypress.Chainable<boolean> => {
      return cy
        .get(healthOfferCardSelector)
        .then(($card: JQuery): Cypress.Chainable<boolean> => {
          const additionalInfoExists: boolean =
            $card.find(CardComponent.additionalDataTextSelector).length > 0;
          const additionalInfoTextCorrect: boolean = additionalInfoExists
            ? $card
                .find(CardComponent.additionalDataTextSelector)
                .text()
                .trim() === additionalData
            : false;

          const conditionMet = shouldDataBePresent
            ? additionalInfoTextCorrect
            : !additionalInfoExists;

          if (!conditionMet && attempt < maxAttempts) {
            attempt++;
            cy.wait(1500);
            ResultsPage.reload();
            return checkAdditionalData();
          } else if (!conditionMet && attempt >= maxAttempts) {
            const errorMessage: string = shouldDataBePresent
              ? "Additional info is not the one expected after indexation."
              : "Additional info is still present after indexation.";
            assert.fail(errorMessage);
          } else {
            return cy.wrap(conditionMet);
          }
        });
    };

    return checkAdditionalData();
  }

  //region SAS participation
  static checkSasParticipation(card: Cypress.Chainable): void {
    //TODO: suggestion: renommer en checkSasParticipationIsPresent
    card.find(CardComponent.sasParticipationIconSelector).should("be.visible");
  }

  static checkSasParticipationLabel(
    card: Cypress.Chainable,
    label: string,
  ): void {
    card
      .find(CardComponent.sasParticipationIconSelector)
      .invoke("text")
      .then((actualLabel: string): void => {
        expect(actualLabel).eq(label);
      });
  }

  //endregion
  //endregion
  // region CPTS
  accessToCptsCluster(cptsName: string) {
    CardComponent.getHealthOfferCard(cptsName, "")
      .find(this.cptsClusterAccessLinkSelector)
      .click();
    LoaderComponent.waitForDisappearing();
  }
  // endregion
}
