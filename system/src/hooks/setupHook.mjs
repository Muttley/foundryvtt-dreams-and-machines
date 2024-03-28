export const setupHook = {
	attach: () => {
		dreams.logger.debug("Attaching setup hook");

		Hooks.once("setup", () => {
			dreams.logger.debug("Running setup hook");

			// Go through the CONFIG object and attempt to localize any Strings
			// up front
			for (const obj in CONFIG.DREAMS) {
				if ({}.hasOwnProperty.call(CONFIG.DREAMS, obj)) {
					for (const el in CONFIG.DREAMS[obj]) {
						if ({}.hasOwnProperty.call(CONFIG.DREAMS[obj], el)) {
							if (typeof CONFIG.DREAMS[obj][el] === "string") {
								CONFIG.DREAMS[obj][el] = game.i18n.localize(
									CONFIG.DREAMS[obj][el]
								);
							}
						}
					}
				}
			}
		});
	},
};
