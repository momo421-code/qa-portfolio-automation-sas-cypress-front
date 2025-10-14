import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import { DataTable } from "@cucumber/cucumber";
import { DataTableUtils } from "../../../support/utils/dataTableUtils";
import { ResultsPage } from "../../../page-objects/pages/results.page";
import { accountFixtureUtils } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureUtils";
import {
  LrmUrlParams,
  UrlParamNames,
  UrnValues,
} from "../../../shared/lrm/lrmUrlParams";
import {
  CardComponent,
  CardTypes,
  ResultsSelectionMode,
} from "../../../page-objects/components/searchPage/card.component";
import { PractitionerClass } from "../../../support/utils/fixtureUtils/healthOfferFixtureUtils/accountFixtureData";
import { HealthOfferType } from "../../../shared/healthOffer/healthOfferType";

type LrmStepSharedDataType = {
  practitionerAlias: string;
  practitionerName: string;
  addresses: Array<string>;
};
const lrmStepsSharedData: LrmStepSharedDataType = {
  practitionerAlias: undefined,
  practitionerName: undefined,
  addresses: undefined,
};

/**
 * @param lrmCallMode - in the case we want to test Null or non-default value for origin
 */
When(
  /^l'utilisateur accède à la recherche LRM avec les paramètres(.*)$/,
  function (lrmCallMode: string, data: DataTable) {
    const withWrongOrEmptyOrigin: string =
      " et le paramètre origine erroné ou vide";

    const valuesMap: Map<string, string> = DataTableUtils.convertDataTableToMap(
      data,
      true,
    );

    if (lrmCallMode && lrmCallMode !== withWrongOrEmptyOrigin) {
      throw new Error("Invalid step name : " + lrmCallMode);
    }

    const ignoreNulls: boolean = !lrmCallMode;
    const emptyOriginAllowed: boolean = !ignoreNulls;

    let lrmUrlParamsMap: Map<UrlParamNames, string> = new Map(); // lrmParams to be used to build the URL
    lrmUrlParamsMap = LrmStepsParamHelper.manageParameters(
      valuesMap,
      lrmUrlParamsMap,
      emptyOriginAllowed,
    );

    // build params URL string part
    ResultsPage.lrmNavigateToLoadedPage(
      LrmUrlParams.buildUrl(lrmUrlParamsMap, ignoreNulls),
    );
  },
);

/*
    LRM call but with practitioner found from fixtures
*/
When(
  /^l'utilisateur accède à la recherche LRM du médecin traitant ayant pour alias (.*)$/,
  function (alias: string, data: DataTable) {
    const valuesMap: Map<string, string> = DataTableUtils.convertDataTableToMap(
      data,
      true,
    );

    // Fill LRM parameters from step params
    let lrmUrlParamsMap: Map<UrlParamNames, string> = new Map(); // lrmParams to be used to build the URL
    lrmUrlParamsMap = LrmStepsParamHelper.manageParameters(
      valuesMap,
      lrmUrlParamsMap,
    );

    lrmStepsSharedData.practitionerAlias = alias; // Save the user alias
    const practitionerFullName: string = accountFixtureUtils
      .getUserAccount(alias)
      .getUserFullName();
    lrmStepsSharedData.practitionerName = practitionerFullName;
    lrmUrlParamsMap.set(UrlParamNames.PRACTITIONER, practitionerFullName);

    ResultsPage.lrmNavigateToLoadedPage(LrmUrlParams.buildUrl(lrmUrlParamsMap));
  },
);
When(/^l'utilisateur retourne à l'accueil$/, () => {
  cy.get(".btn-highlight-outline").click();
});
Then(
  /^au moins une card de médecin traitant est présente dans la liste des résultats$/,
  function () {
    CardComponent.oneCardIsPresent(
      ResultsSelectionMode.SPECIFIC_ONLY,
      CardTypes.MEDECIN_TRAITANT,
    );
  },
);

Then(
  /^tous les lieux d'exercice du médecin traitant sont présents dans la liste de résultats$/,
  function () {
    const userFixtureAccount: PractitionerClass =
      accountFixtureUtils.getUserAccount(
        lrmStepsSharedData.practitionerAlias,
      ) as PractitionerClass;

    CardComponent.allCardsArePresent(
      ResultsSelectionMode.SPECIFIC_ONLY,
      CardTypes.MEDECIN_TRAITANT,
      lrmStepsSharedData.practitionerName,
      userFixtureAccount.getLocationsFullAddressByType([
        HealthOfferType.PRACTICE_LOCATION,
      ]),
    );
  },
);

Then(/^aucun résultat de médecin traitant n'est présent$/, function () {
  CardComponent.cardsAreAbsent(CardTypes.MEDECIN_TRAITANT);
});

Then(
  /^uniquement des résultats de recherche (hors LRM) sont présents$/,
  function () {
    CardComponent.onlySearchResultsWithoutLrmArePresent();
  },
);

//region Steps functions

/**
 * Parameters allowed in Steps
 * Some params are the same as the LRM URL one, they are built from the UrlParamNames enum
 */
enum LrmStepsParamNames {
  ORIGIN = UrlParamNames.ORIGIN,
  PRACTITIONER = UrlParamNames.PRACTITIONER,
  PRACTITIONER_PARAM_TYPE = "practitionerParamType",
  SPECIALTY = UrlParamNames.SPECIALTY,
  SPECIALTY_PARAM_TYPE = "specialtyParamType",
  STREET_NUMBER = UrlParamNames.STREET_NUMBER,
  STREET_NAME = UrlParamNames.STREET_NAME,
  CITY = UrlParamNames.CITY,
  INSEE_CODE = UrlParamNames.INSEE_CODE,
  SEARCHED_LOCALIZATION = "localisationRecherche",
  SEARCHED_SPECIALTY = "specialiteRecherche",
}

/**
 * Values allowed for practitionerType and specialtyType
 * passed to the steps
 */
export enum LrmParamType {
  EMPTY = "",
  ANY = "any", // to have no check on the field
  NAME = "name", // in usual case, no check
  URN = "urn", // to check URN content
  RPPS = "rpps", // to add the practitioner URN to the field
}

/**
 * Check parameters
 * Purpose of the class is just to structure the code
 */
class LrmStepsParamHelper {
  static manageParameters(
    valuesMap: Map<string, string>,
    lrmUrlParamsMap: Map<UrlParamNames, string>,
    emptyOriginAllowed: boolean = false,
  ): Map<UrlParamNames, string> {
    DataTableUtils.checkAllowedParameters(
      valuesMap,
      Array.from(Object.values(LrmStepsParamNames)),
    );
    lrmUrlParamsMap = LrmStepsParamHelper.manageOriginParam(
      valuesMap,
      lrmUrlParamsMap,
      emptyOriginAllowed,
    );
    lrmUrlParamsMap = LrmStepsParamHelper.managePractitionerParams(
      valuesMap,
      lrmUrlParamsMap,
    );
    lrmUrlParamsMap = LrmStepsParamHelper.manageSpecialtyParams(
      valuesMap,
      lrmUrlParamsMap,
    );

    lrmUrlParamsMap = LrmStepsParamHelper.manageOtherParams(
      valuesMap,
      lrmUrlParamsMap,
    );

    return lrmUrlParamsMap;
  }

  /**
   * check if practitioner param is valid in case of URN value
   * if the RPPS is passed, we get the URN + RPPS value
   * @param valuesMap - params coming from step
   * @param lrmUrlParams - params to be passed to the lrm URL builder
   */
  static managePractitionerParams(
    valuesMap: Map<string, string>,
    lrmUrlParams: Map<UrlParamNames, string>,
  ): Map<UrlParamNames, string> {
    let practitioner: string = valuesMap.get(LrmStepsParamNames.PRACTITIONER);
    const practitionerType: string = valuesMap.get(
      LrmStepsParamNames.PRACTITIONER_PARAM_TYPE,
    );

    switch (practitionerType) {
      case LrmParamType.NAME:
      case LrmParamType.ANY:
      case LrmParamType.EMPTY:
      case undefined:
        break;
      case LrmParamType.URN:
        if (!LrmUrlParams.isPractitionerValid(practitioner))
          throw new Error("Invalid practitioner URN");
        break;
      case LrmParamType.RPPS:
        practitioner = LrmUrlParams.getPractitionerWithRpps(practitioner);
        break;
      default:
        throw new Error(
          `Non managed case in LrmParamType for Practitioner : ${practitionerType}`,
        );
    }
    lrmUrlParams.set(UrlParamNames.PRACTITIONER, practitioner);

    return lrmUrlParams;
  }

  /**
   ** check if specialty value is valid in case of URN value
   *
   * @param valuesMap - params coming from step
   * @param lrmUrlParams - params to be passed to the lrm URL builder
   */
  static manageSpecialtyParams(
    valuesMap: Map<string, string>,
    lrmUrlParams: Map<UrlParamNames, string>,
  ): Map<UrlParamNames, string> {
    const specialtyValue: string = valuesMap.get(LrmStepsParamNames.SPECIALTY);
    const specialtyType: string = valuesMap.get(
      LrmStepsParamNames.SPECIALTY_PARAM_TYPE,
    );

    switch (specialtyType) {
      case LrmParamType.NAME:
      case LrmParamType.ANY:
      case LrmParamType.EMPTY:
        break;
      case LrmParamType.URN:
        if (!LrmUrlParams.isSpecialtyValid(specialtyValue))
          throw new Error(
            "Invalid specialty URN. Got " +
              specialtyValue +
              " instead of one of " +
              Array.from(Object.keys(UrnValues)),
          );
        break;
      default:
        throw new Error(
          `Non managed case in LrmParamType for Specialty : ${specialtyType}`,
        );
    }
    lrmUrlParams.set(UrlParamNames.SPECIALTY, specialtyValue);

    return lrmUrlParams;
  }

  /**
   * manageOriginParam - if the value is empty, but empty is not allowed,
   * we get the default value. If it's empty and allowed, an empty origin is added to urlParams
   * In other cases, the value is kept as is for urlParams
   * @param valuesMap
   * @param lrmUrlParamsMap
   * @param emptyAllowed - if emptyOrigin is allowed
   */
  static manageOriginParam(
    valuesMap: Map<string, string>,
    lrmUrlParamsMap: Map<UrlParamNames, string>,
    emptyAllowed: boolean = false,
  ): Map<UrlParamNames, string> {
    if (!valuesMap.get(LrmStepsParamNames.ORIGIN) && !emptyAllowed)
      lrmUrlParamsMap.set(
        UrlParamNames.ORIGIN,
        LrmUrlParams.getDefaultOrigin(),
      );
    else
      lrmUrlParamsMap.set(
        UrlParamNames.ORIGIN,
        valuesMap.get(LrmStepsParamNames.ORIGIN),
      );

    return lrmUrlParamsMap;
  }

  /**
   * makes a mapping between steps param names and lrm url params
   * then assign values to lrm url params
   * @param valuesMap - params coming from step
   * @param lrmUrlParamsMap - params to be passed to the lrm URL builder
   */
  static manageOtherParams(
    valuesMap: Map<string, string>,
    lrmUrlParamsMap: Map<UrlParamNames, string>,
  ): Map<UrlParamNames, string> {
    const paramsList: Map<LrmStepsParamNames, UrlParamNames> = new Map([
      [LrmStepsParamNames.STREET_NUMBER, UrlParamNames.STREET_NUMBER],
      [LrmStepsParamNames.STREET_NAME, UrlParamNames.STREET_NAME],
      [LrmStepsParamNames.CITY, UrlParamNames.CITY],
      [LrmStepsParamNames.INSEE_CODE, UrlParamNames.INSEE_CODE],
    ]);

    Array.from(paramsList.keys()).forEach((elem) => {
      lrmUrlParamsMap.set(paramsList.get(elem), valuesMap.get(elem));
    });
    return lrmUrlParamsMap;
  }
}
