import globals from "globals";
import pluginJs from "@eslint/js";

export default [
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.all,
	{
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
			strict: ["error", "global"],
			"prefer-destructuring": [
				"error",
				{ array: true, object: true },
				{ enforceForRenamedProperties: false },
			],
			"new-cap": "error",
			"no-invalid-this": "error",
			"prefer-const": "error",
			"func-style": ["error", "expression"],
			"no-new-func": "error",
			"no-unused-vars": "warn",
			"no-console": "warn",
			"func-names": "warn",
			"no-process-exit": "warn",
			"object-shorthand": "warn",
			"class-methods-use-this": "error",
			"no-param-reassign": "error",
			"no-var": "error",
			"prefer-arrow-callback": "warn",
			"prefer-rest-params": "warn",
			"arrow-parens": ["error", "always"],
			"arrow-body-style": ["error", "as-needed"],
			"no-eval": "error",
			"no-implied-eval": "error",
			eqeqeq: "error",
			"no-with": "error",
			"no-plusplus": "error",
		},
	},
];
