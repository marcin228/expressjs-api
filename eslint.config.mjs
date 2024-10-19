import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {files: ["*.js"], languageOptions: {sourceType: "commonjs"}},
  {ignores: ['node_modules/','.env','.gitignore','.prettierignore','*.log','*.json']},
  {languageOptions: { globals: globals.node }},
  {rules:{
      'indent': ['error', 4],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    }
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
];