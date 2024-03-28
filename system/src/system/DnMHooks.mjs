import { readyHook } from "../hooks/readyHook.mjs";
import { setupHook } from "../hooks/setupHook.mjs";

export const DnMHooks = {
	attach: () => {
		dreams.logger.debug("Attaching hooks");

		const listeners = [
			readyHook,
			setupHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};
