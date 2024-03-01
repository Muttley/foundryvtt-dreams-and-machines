/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"system/templates/**/*.hbs",
		"system/src/**/*.{js,mjs}",
	],
	corePlugins: {
		preflight: false,
	},
	theme: {
		extend: {
			borderWidth: {
				1: "1px",
			},
			fontFamily: {
				"roboto-flex": "'Roboto Flex', sans-serif",
			},
			minHeight: {
				10: "10rem",
				15: "15rem",
				20: "20rem",
			},
			gridRow: {
				"span-7": "span 7 / span 7",
			},
		},
		fontFamily: {
			body: ["Roboto Flex", "sans-serif"],
			sans: ["Roboto Flex", "sans-serif"],
		},
	},
	plugins: [
		require("@tailwindcss/container-queries"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
	],
};
