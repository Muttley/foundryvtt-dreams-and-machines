import { registerActors } from "./src/actor/DnMActor.mjs";
import { registerCombatTracker } from "./src/combat/combat-tracker.mjs";
import { registerFonts } from "./src/fonts.mjs";
import { registerItems } from "./src/item/DnMItem.mjs";
import registerTemplates from "./src/templates.mjs";

import DicePrompt from "./src/dice/DicePrompt.mjs";

import Exhaustion from "./src/actor/Exhaustion.mjs";

import "./src/momentumTracker/index.mjs";

Hooks.once("init", () => {
	registerActors();
	registerItems();
	registerCombatTracker();

	registerFonts();
	registerTemplates();

	CONFIG.DreamsAndMachines = {
		DicePrompt,
		Exhaustion,
	};
});

// Add the prose class from Tailwind Typography to Journal text entries.
Hooks.on(
	"renderJournalTextPageSheet",
	/**
	 * @param _application
	 * @param html {JQuery}
	 * @param _data
	 */
	(_application, html, _data) => {
		$(html[2]).addClass("prose");
	}
);
