import { DREAMS, SYSTEM_ID, SYSTEM_NAME } from "../config.mjs";

import DnMActor from "../documents/DnMActor.mjs";
import DnMItem from "../documents/DnMItem.mjs";

import * as dialog from "../dialogs/_module.mjs";

import * as actorDataModels from "../models/actors/_module.mjs";
import * as actorSheets from "../sheets/actors/_module.mjs";

import * as itemDataModels from "../models/items/_module.mjs";
import * as itemSheets from "../sheets/items/_module.mjs";

import * as app from "../app/_module.mjs";

import { registerCombatTracker } from "../combat/CombatTracker2d20V2.mjs";
import { registerFonts } from "../fonts.mjs";
import { registerHandlebarsHelpers } from "../handlebars.mjs";

import DnMCompendiums from "../system/DnMCompendiums.mjs";
import DnMHooks from "../system/DnMHooks.mjs";
import DnMUtils from "../utils/DnMUtils.mjs";
import Logger from "../utils/Logger.mjs";

import registerSettings from "../settings.mjs";
import registerTemplates from "../templates.mjs";


export async function initHook() {
	console.debug(`${SYSTEM_NAME} | Running init hook`);

	// CONFIG.debug.hooks = true;

	// Add custom constants for configuration.
	CONFIG.DREAMS = DREAMS;

	globalThis.SYSTEM_ID = SYSTEM_ID;
	globalThis.SYSTEM_NAME = SYSTEM_NAME;

	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	globalThis.dreams = {
		app,
		compendiums: DnMCompendiums,
		dialog,
		utils: DnMUtils,
		// Logger shortcuts
		debug: Logger.debug,
		error: Logger.error,
		log: Logger.log,
		warn: Logger.warn,
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
	CONFIG.Actor.dataModels.major_npc = actorDataModels.MajorNPCDataModel;
	CONFIG.Actor.dataModels.npc = actorDataModels.NPCDataModel;
	CONFIG.Actor.dataModels.vehicle = actorDataModels.VehicleDataModel;
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
	foundry.documents.collections.Actors.registerSheet(
		"dreams-and-machines",
		actorSheets.CharacterSheet,
		{
			types: ["character"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Actors.registerSheet(
		"dreams-and-machines",
		actorSheets.MajorNPCSheetV2,
		{
			types: ["major_npc"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Actors.registerSheet(
		"dreams-and-machines",
		actorSheets.NPCSheetV2,
		{
			types: ["npc"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Actors.registerSheet(
		"dreams-and-machines",
		actorSheets.VehicleSheetV2,
		{
			types: ["vehicle"],
			makeDefault: true,
		}
	);
}

/**
 * Handles registration for all Dreams and Machine Item data models.
 */
function registerItemDataModels() {
	CONFIG.Item.dataModels.archetype = itemDataModels.ArchetypeDataModel;
	CONFIG.Item.dataModels.armor = itemDataModels.ArmorDataModel;
	CONFIG.Item.dataModels.equipment = itemDataModels.EquipmentDataModel;
	CONFIG.Item.dataModels.glif = itemDataModels.GLIFDataModel;
	CONFIG.Item.dataModels.major_npc_action = itemDataModels.MajorNPCActionDataModel;
	CONFIG.Item.dataModels.nanogram_pattern = itemDataModels.NanogramPatternDataModel;
	CONFIG.Item.dataModels.npc_action = itemDataModels.NPCActionDataModel;
	CONFIG.Item.dataModels.origin = itemDataModels.OriginDataModel;
	CONFIG.Item.dataModels.special_ability = itemDataModels.SpecialAbilityDataModel;
	CONFIG.Item.dataModels.talent = itemDataModels.TalentDataModel;
	CONFIG.Item.dataModels.temperament = itemDataModels.TemperamentDataModel;
	CONFIG.Item.dataModels.weapon = itemDataModels.WeaponDataModel;
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
	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.ArchetypeSheet,
		{
			types: ["archetype"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.ArmorSheet,
		{
			types: ["armor"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.EquipmentSheet,
		{
			types: ["equipment"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.GLIFSheet,
		{
			types: ["glif"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.MajorNPCActionSheet,
		{
			types: ["major_npc_action"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.NanogramPatternSheet,
		{
			types: ["nanogram_pattern"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.NPCActionSheet,
		{
			types: ["npc_action"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.OriginSheet,
		{
			types: ["origin"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.SpecialAbilitySheet,
		{
			types: ["special_ability"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.TalentSheet,
		{
			types: ["talent"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.TemperamentSheet,
		{
			types: ["temperament"],
			makeDefault: true,
		}
	);

	foundry.documents.collections.Items.registerSheet(
		"dreams-and-machines",
		itemSheets.WeaponSheet,
		{
			types: ["weapon"],
			makeDefault: true,
		}
	);
}
