import { readyHook } from "../hooks/readyHook.mjs";
import { setupHook } from "../hooks/setupHook.mjs";

const DnMHooks = {
	attach: () => {
		dreams.debug("Attaching hooks");

		const listeners = [
			readyHook,
			setupHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};

export default DnMHooks;
