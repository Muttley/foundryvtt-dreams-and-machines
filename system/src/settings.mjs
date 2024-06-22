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
}