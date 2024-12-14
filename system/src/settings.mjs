import SourceFilterConfig from "./settings/SourceFilterConfig.mjs";

export default function registerSettings() {
	// -------------------
	//  INTERNAL SETTINGS
	// -------------------
	//
	game.settings.register(SYSTEM_ID, "momentum", {
		name: "Momentum",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "threat", {
		name: "Threat",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	// -------------------
	//  CONTENT FILTERING
	// -------------------
	//
	game.settings.registerMenu(SYSTEM_ID, "sources", {
		name: "DNM.Settings.SourceFilters.Name",
		hint: "DNM.Settings.SourceFilters.Hint",
		label: "DNM.Settings.SourceFilters.ButtonLabel",
		icon: "fa-solid fa-book",
		type: SourceFilterConfig,
		restricted: true,
	});
	SourceFilterConfig.registerSetting();

	// ----------------
	//  DEBUG SETTINGS
	// ----------------
	//
	game.settings.register(SYSTEM_ID, "debugEnabled", {
		name: "Enable/Disable Debug",
		hint: "Enable or Disable additional debug features",
		scope: "world",
		type: Boolean,
		config: true,
		default: false,
		requiresReload: true,
	});

	game.settings.register(SYSTEM_ID, "systemVersion", {
		name: "System Version",
		hint: "Records the current Dreams and Machines system version number (don't modify this unless you know what you are doing)",
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: "",
		type: String,
	});

	game.settings.register(SYSTEM_ID, "schemaVersion", {
		name: "Schema Version",
		hint: "Records the current schema version for the Dreams and Machines system data. (don't modify this unless you know what you are doing)",
		scope: "world",
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: -1,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "migrateSystemCompendiums", {
		name: "Migrate System Compendiums",
		hint: "Perform data migration on the built in Dreams and Machines system compendiums (don't modify this unless you know what you are doing)",
		scope: "world",
		type: Boolean,
		config: game.settings.get(SYSTEM_ID, "debugEnabled"),
		default: false,
		requiresReload: true,
	});
}
