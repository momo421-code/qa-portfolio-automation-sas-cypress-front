import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginCypress from 'eslint-plugin-cypress/flat';
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
    {files: ["**/*.ts"]},
    {languageOptions: {globals: globals.browser}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginCypress.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        "rules": {
            '@typescript-eslint/no-namespace': 'off',   // Avoid errors for declare global & namespace.
            "@typescript-eslint/no-unused-expressions": "off",  // Avoid errors with expect().
            'cypress/no-unnecessary-waiting': 'off',
            "prettier/prettier": "error"
        }
    }
];