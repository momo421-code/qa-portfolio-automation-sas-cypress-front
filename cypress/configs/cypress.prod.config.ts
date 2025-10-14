import { defineConfig } from "cypress";
import defaultConfig from "../../cypress.config";

export default defineConfig({
  e2e: {
    ...defaultConfig.e2e,
    baseUrl: "https://sas.sante.fr",
    defaultCommandTimeout: 3000,
    pageLoadTimeout: 10000,
    chromeWebSecurity: false,
    env: {
      environment: "prod",
      environmentName: "production",
      cookies:
        "!eulerian=false!eulerian_cnil=false!sante_adform=false!sante_amnet_pixel=false!sante_azerion=false" +
        "!sante_captify=false!sante_criteo=false!sante_linkedin=false!sante_manageo=false!sante_metapixel=false" +
        "!sante_ogury=false!sante_snappixel=false!drupal_display_mode=false!drupal_dailymotion=false!drupal_soundcloud=false",
      resultPageTimeout: 30000,
      fixtureFile: "accounts/accounts-prod",
      suggestedSearchFiltersFile:
        "suggestedSearchFilters/suggestedSearchFilters",
      lrmOrigin: "TEST-SAMU000",
    },
  },
});
