
import listenOnSocket from "../socket.mjs";


export const readyHook = {
	attach: () => {
		dreams.debug("Attaching ready hook");

		Hooks.once("ready", async () => {
			dreams.debug("Running ready hook");

			dreams.app.MomentumTrackerV2.instance.render({force: true});

			listenOnSocket();

			dreams.utils.showNewReleaseNotes();
		});
	},
};
