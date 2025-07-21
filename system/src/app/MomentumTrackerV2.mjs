import { SYSTEM_ID } from "../config.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class MomentumTrackerV2
	extends HandlebarsApplicationMixin(ApplicationV2) {

	static #instance;

	constructor(options = {}) {
		if (MomentumTrackerV2.#instance) {
			throw new Error("Attempted to create multiple instances of the MomentumTracker singleton.");
		}

		super(options);

		MomentumTrackerV2.#instance = this;
	}

	static get instance() {
		if (!MomentumTrackerV2.#instance) {
			new MomentumTrackerV2(MomentumTrackerV2.DEFAULT_OPTIONS);
		}

		return MomentumTrackerV2.#instance;
	}

	static DEFAULT_OPTIONS = {
		actions: {
			decrementPool: MomentumTrackerV2._onDecrementPool,
			incrementPool: MomentumTrackerV2._onIncrementPool,
		},
		id: "tracker",
		tag: "aside",
		classes: ["dnm", "momentum-tracker"],
		window: {
			frame: false,
			positioned: false,
		},
	};


	static PARTS = {
		tracker: {
			root: true,
			template: templatePath("app/momentum-tracker"),
		},
	};


	/**
	 * Change the counter of (type) by (value)
	 * @param diff  How much to change the counter
	 * @param type  Type of counter, "momentum" or "threat"
	 */
	static async changeCounter(diff, type) {
		this.checkCounterUpdate(diff, type);

		const newValue = game.settings.get(SYSTEM_ID, type) + diff;
		await MomentumTrackerV2.setCounter(newValue, type);
	}


	// Check user entry. Rerender if error is detected to reset to the correct value
	static checkCounterUpdate(value, type) {
		const updateError = {
			counter: "Error updating Counter: Invalid Counter Type",
			value: "Error updating Counter: Invalid Value Type",
		};

		if (type !== "threat" && type !== "momentum") {
			ui.notifications.error(updateError.counter);
			MomentumTrackerV2.instance.render({force: true});
			throw updateError.counter;
		}

		if (!value || Number.isNaN(value)) {
			ui.notifications.error(updateError.value);
			MomentumTrackerV2.instance.render({force: true});
			throw updateError.value;
		}
	}


	/**
	 * Set the counter of (type) to (value)
	 * @param value Value to set counter to
	 * @param type  Type of counter, "momentum" or "threat"
	 */
	static async setCounter(value, type) {
		if (!game.user.isGM) {
			game.socket.emit(`system.${SYSTEM_ID}`, {
				type: "setCounter",
				payload: {value, type},
			});
			return;
		}

		value = Number.parseInt(value);

		value = Math.max(0, value);

		if (type === "momentum") {
			value = Math.min(6, value);
		}
		else {
			value = Math.min(99, value);
		}

		await game.settings.set(SYSTEM_ID, type, value);

		MomentumTrackerV2.instance.render({force: true});

		// Emit socket event for users to rerender their counters
		game.socket.emit(`system.${SYSTEM_ID}`, {type: "updateCounter"});
	}


	static async _onDecrementPool(event, target) {
		const {type} = target?.dataset ?? undefined;

		if (type) MomentumTrackerV2.changeCounter(-1, type);
	}


	static async _onIncrementPool(event, target) {
		const {type} = target?.dataset ?? undefined;

		if (type) MomentumTrackerV2.changeCounter(1, type);
	}

	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);

		// Move the element into the ui-left stack.
		const uiBottom = document.querySelector("#ui-bottom");
		if (!uiBottom) {
			dreams.error("Error: Could not find #ui-bottom!");
			return;
		}

		const hotbar = uiBottom.querySelector("#hotbar");
		if (!hotbar) {
			dreams.warn(
				"Could not find hotbar HTML element, appending Momentum Tracker to end of ui-bottom."
			);
			uiBottom.appendChild(this.element);
			return;
		}

		uiBottom.insertBefore(this.element, hotbar);
	}


	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		context.isGM = game.user.isGM;

		context.threatVisible =
			game.user.isGM || game.settings.get(SYSTEM_ID, "threatVisibleToPlayers");

		context.threat = game.settings.get(SYSTEM_ID, "threat");
		context.momentum = game.settings.get(SYSTEM_ID, "momentum");

		return context;
	}
}
