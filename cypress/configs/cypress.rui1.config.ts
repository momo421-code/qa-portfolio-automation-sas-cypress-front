import { defineConfig } from "cypress";
import defaultConfig from "../../cypress.config";

export default defineConfig({
  e2e: {
    ...defaultConfig.e2e,
    baseUrl: "https://sas-rui.ans.kleegroup.com",
    defaultCommandTimeout: 6000,
    pageLoadTimeout: 50000,
    env: {
      environment: "rui",
      environmentName: "recette",
      aggregAdminUrl: "https://sas-agregateur-rui.ans.kleegroup.com/login",
      cookies:
        "!eulerian=false!eulerian_cnil=false!sante_adform=false!sante_amnet_pixel=false!sante_azerion=false" +
        "!sante_captify=false!sante_criteo=false!sante_linkedin=false!sante_manageo=false!sante_metapixel=false" +
        "!sante_ogury=false!sante_snappixel=false!drupal_display_mode=false!drupal_dailymotion=false!drupal_soundcloud=false",
      resultPageTimeout: 20000,
      sasParametersPopInTimeout: 20000,
      availabilityEditionPopInTimeout: 10000,
      fixtureFile: "accounts/accounts",
      suggestedSearchFiltersFile:
        "suggestedSearchFilters/suggestedSearchFilters",
      lrmOrigin: "samu-lrm-test1-authority",
    },
  },
});
