import {defineConfig} from 'cypress'
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import {addCucumberPreprocessorPlugin} from "@badeball/cypress-cucumber-preprocessor";
import {createEsbuildPlugin} from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
    e2e: ({
        viewportWidth: 2560,
        viewportHeight: 1440,
        specPattern: "cypress/e2e/features/**/*.feature",
        watchForFileChanges: false,
        injectDocumentDomain: true,
        chromeWebSecurity: false,
        reporter: 'junit',
        reporterOptions: {
            mochaFile: 'cypress/reports/junit-report.xml',
            outputs: true,
            testCaseSwitchClassnameAndName: true
        },
        env: {
            basic_auth: {username: '', password: ''},
            password: ''
        },
        async setupNodeEvents(
            cypressOn: Cypress.PluginEvents,
            config: Cypress.PluginConfigOptions
        ): Promise<Cypress.PluginConfigOptions> {
            const on = require('cypress-on-fix')(cypressOn)
            await addCucumberPreprocessorPlugin(on, config);
            on(
                "file:preprocessor",
                createBundler({
                    plugins: [createEsbuildPlugin(config)],
                })
            );
            return config;
        },
    }),
});

