import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([{
    files: ["**/*.ts"],

    extends: [tseslint.configs.recommended],

    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-namespace": "off",
    },
}]);
