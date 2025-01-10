import listenOnSocket from "../socket.mjs";

export const readyHook = {
	attach: () => {
		dreams.debug("Attaching ready hook");

		Hooks.once("ready", async () => {
			dreams.debug("Running ready hook");

			new dreams.app.MomentumTracker();
			dreams.app.MomentumTracker.forceRender();

			listenOnSocket();

			dreams.utils.showNewReleaseNotes();
		});
	},
};
