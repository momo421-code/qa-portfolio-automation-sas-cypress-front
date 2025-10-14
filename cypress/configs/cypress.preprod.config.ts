import { defineConfig } from "cypress";
import defaultConfig from "../../cypress.config";

export default defineConfig({
  e2e: {
    ...defaultConfig.e2e,
    baseUrl: "https://sas.preproduction.santefr.esante.gouv.fr",
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 20000,
    chromeWebSecurity: false,
    env: {
      environment: "preprod",
      environmentName: "preprod",
      aggregAdminUrl:
        "https://sas-agregateur.preproduction.santefr.esante.gouv.fr/login",
      cookies:
        "!eulerian=false!eulerian_cnil=false!sante_adform=false!sante_amnet_pixel=false!sante_azerion=false" +
        "!sante_captify=false!sante_criteo=false!sante_linkedin=false!sante_manageo=false!sante_metapixel=false" +
        "!sante_ogury=false!sante_snappixel=false!drupal_display_mode=false!drupal_dailymotion=false!drupal_soundcloud=false",
      resultPageTimeout: 70000,
      sasParametersPopInTimeout: 16000,
      availabilityEditionPopInTimeout: 10000,
      fixtureFile: "accounts/accounts",
      suggestedSearchFiltersFile:
        "suggestedSearchFilters/suggestedSearchFilters",
      lrmOrigin: "test-stan",
    },
  },
});
