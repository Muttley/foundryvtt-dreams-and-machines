import listenOnSocket from "../socket.mjs";

export const readyHook = {
	attach: () => {
		dreams.logger.debug("Attaching ready hook");

		Hooks.once("ready", async () => {
			dreams.logger.debug("Running ready hook");

			new dreams.MomentumTracker();
			dreams.MomentumTracker.forceRender();

			listenOnSocket();
		});
	},
};
