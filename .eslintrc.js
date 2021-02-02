module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.json",
    "sourceType": "module"
  },
  "plugins": [
    "only-warn",
    "eslint-plugin-import",
    "@typescript-eslint",
  ],
  "ignorePatterns": [
    ".eslintrc.js"
  ],
  "rules": {
    "no-multi-spaces": "warn",
    "no-shadow": "warn",
    "comma-dangle": "warn",
    "comma-spacing": "warn",
    "comma-style": "warn",
    "eol-last": "warn",
    "no-multiple-empty-lines": "warn",
    "no-tabs": "warn",
    "no-trailing-spaces": "warn",
    "quotes": ["warn", "single"],
    "semi": "warn",
    "space-before-blocks": "warn",
    "prefer-spread": "warn",
    "sort-imports": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off"
  }
};
