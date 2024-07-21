import { DREAMS, SYSTEM_ID, SYSTEM_NAME } from "../config.mjs";

import DnMActor from "../documents/DnMActor.mjs";
import DnMItem from "../documents/DnMItem.mjs";

import * as dialogs from "../dialogs/_module.mjs";

import * as actorDataModels from "../models/actors/_module.mjs";
import * as actorSheets from "../sheets/actors/_module.mjs";

import * as itemDataModels from "../models/items/_module.mjs";
import * as itemSheets from "../sheets/items/_module.mjs";

import { registerCombatTracker } from "../combat/CombatTracker2d20.mjs";
import { registerFonts } from "../fonts.mjs";
import { registerHandlebarsHelpers } from "../handlebars.mjs";

import DnMUtils from "../utils/DnMUtils.mjs";
import Logger from "../utils/Logger.mjs";
import MomentumTracker from "../momentumTracker/MomentumTracker.mjs";

import registerSettings from "../settings.mjs";
import registerTemplates from "../templates.mjs";

import { DnMHooks } from "../system/DnMHooks.mjs";
import DicePrompt from "../dice/DicePrompt.mjs";

export async function initHook() {
	console.debug(`${SYSTEM_NAME} | Running init hook`);

	// Add custom constants for configuration.
	CONFIG.DREAMS = DREAMS;

	globalThis.SYSTEM_ID = SYSTEM_ID;
	globalThis.SYSTEM_NAME = SYSTEM_NAME;

	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	globalThis.dreams = {
		apps: {
			DicePrompt,
			MomentumTracker,
		},
		dialogs,
		logger: Logger,
		utils: DnMUtils,
	};

	registerSettings();

	registerActors();
	registerItems();

	registerCombatTracker();

	registerFonts();
	registerHandlebarsHelpers();
	registerTemplates();

	DnMHooks.attach();
}

/**
 * Handles registration for all Dreams and Machines Actor data models.
 */
function registerActorDataModels() {
	CONFIG.Actor.dataModels.character = actorDataModels.CharacterDataModel;
	CONFIG.Actor.dataModels.majorNPC = actorDataModels.MajorNPCDataModel;
	CONFIG.Actor.dataModels.npc = actorDataModels.NPCDataModel;
}

function registerActors() {
	CONFIG.Actor.documentClass = DnMActor;

	registerActorDataModels();
	registerActorSheets();
}

/**
 * Handles registration for all Dreams and Machines Actor sheets.
 */
function registerActorSheets() {
	Actors.unregisterSheet("core", ActorSheet);

	Actors.registerSheet("dreams-and-machines", actorSheets.CharacterSheet, {
		types: ["character"],
		makeDefault: true,
	});

	Actors.registerSheet("dreams-and-machines", actorSheets.MajorNPCSheet, {
		types: ["majorNPC"],
		makeDefault: true,
	});

	Actors.registerSheet("dreams-and-machines", actorSheets.NPCSheet, {
		types: ["npc"],
		makeDefault: true,
	});
}

/**
 * Handles registration for all Dreams and Machine Item data models.
 */
function registerItemDataModels() {
	CONFIG.Item.dataModels.archetype = itemDataModels.ArchetypeDataModel;
	CONFIG.Item.dataModels.equipment = itemDataModels.EquipmentDataModel;
	CONFIG.Item.dataModels.majorNPCAction = itemDataModels.MajorNPCActionDataModel;
	CONFIG.Item.dataModels.origin = itemDataModels.OriginDataModel;
	CONFIG.Item.dataModels.specialAbility = itemDataModels.SpecialAbilityDataModel;
	CONFIG.Item.dataModels.talent = itemDataModels.TalentDataModel;
	CONFIG.Item.dataModels.temperament = itemDataModels.TemperamentDataModel;
}

/**
 * Handles registration for the DnMItem class, sheets, all data models.
 */
function registerItems() {
	CONFIG.Item.documentClass = DnMItem;

	registerItemDataModels();
	registerItemSheets();
}

/**
 * Handles registration for all Dreams and Machine Item sheets.
 */
function registerItemSheets() {
	Items.unregisterSheet("core", ItemSheet);

	Items.registerSheet("dreams-and-machines", itemSheets.ArchetypeSheet, {
		types: ["archetype"],
		makeDefault: true,
	});

	Items.registerSheet("dreams-and-machines", itemSheets.EquipmentSheet, {
		types: ["equipment"],
		makeDefault: true,
	});

	Items.registerSheet("dreams-and-machines", itemSheets.OriginSheet, {
		types: ["origin"],
		makeDefault: true,
	});

	Items.registerSheet("dreams-and-machines", itemSheets.DnMItemSheet, {
		types: ["specialAbility", "talent", "temperament"],
		makeDefault: true,
	});

	Items.registerSheet("dreams-and-machines", itemSheets.MajorNPCActionSheet, {
		types: ["majorNPCAction"],
		makeDefault: true,
	});
}
