import { socketEmit, SocketOperation } from "../socket.mjs";

export default class MomentumTracker extends Application {
	/**
	 * @type MomentumTracker|undefined
	 */
	static #instance;

	static get instance() {
		return MomentumTracker.#instance;
	}

	static get defaultOptions() {
		return {
			...super.defaultOptions,
			classes: ["dnm", "momentum-tracker"],
			id: "momentum-tracker",
			popOut: false,
			resizable: false,
			width: "auto",
		};
	}

	get template() {
		return "systems/dreams-and-machines/templates/app/momentum-tracker.hbs";
	}

	/**
	 * @returns {number}
	 */
	get momentum() {
		return game.settings.get(SYSTEM_ID, "momentum");
	}

	/**
	 * @returns {number}
	 */
	get threat() {
		return game.settings.get(SYSTEM_ID, "threat");
	}

	constructor(options = {}) {
		if (MomentumTracker.#instance) {
			throw new Error("Attempted to create multiple instances of the MomentumTracker singleton.");
		}

		super(options);

		MomentumTracker.#instance = this;
	}

	getData(options = {}) {
		return {
			...super.getData(options),
			momentum: this.momentum,
			threat: this.threat,
			isGM: game.user.isGM,
		};
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find('[data-action="increase"]').on("click", this.increase.bind(this));
		html.find('[data-action="decrease"]').on("click", this.decrease.bind(this));
	}

	/**
	 * @param {MouseEvent} event
	 */
	async decrease(event) {
		const target = $(event.currentTarget);
		const type = target.data("type");

		switch (type) {
			case "momentum":
				await MomentumTracker.spendMomentum();
				break;

			case "threat":
				await MomentumTracker.spendThreat();
				break;
		}

		MomentumTracker.forceRender();
	}

	/**
	 * @param {MouseEvent} event
	 */
	async increase(event) {
		const target = $(event.currentTarget);
		const type = target.data("type");

		if (type === "threat" && !game.user.isGM) {
			return;
		}

		if (game.user.isGM) {
			let value = game.settings.get(SYSTEM_ID, type) + 1;

			if (type === "momentum") {
				value = Math.min(value, 6);
			}

			await game.settings.set(SYSTEM_ID, type, value);
			MomentumTracker.forceRender();
		}
		else {
			socketEmit(SocketOperation.PlayerStoreMomentum);
		}

		const chatTemplate = await renderTemplate(`systems/dreams-and-machines/templates/chat/${type}.hbs`, { isGM: game.user.isGM, store: true });
		await ChatMessage.create({
			user: game.userId,
			speaker: {
				actor: game.user.character?.id,
			},
			content: chatTemplate,
			type: CONST.CHAT_MESSAGE_TYPES.OOC,
		});
	}

	static async spendMomentum() {
		if (!MomentumTracker.instance) {
			return;
		}

		const momentum = MomentumTracker.instance.momentum;

		if (momentum === 0) {
			ui.notifications.info(game.i18n.localize("DNM.Notifications.NotEnoughMomentum"));
			return;
		}

		if (game.user.isGM) {
			await game.settings.set(SYSTEM_ID, "momentum", momentum - 1);
			MomentumTracker.forceRender();
		}
		else {
			socketEmit(SocketOperation.PlayerSpendMomentum);
		}

		const chatTemplate = await renderTemplate("systems/dreams-and-machines/templates/chat/momentum.hbs", { isGM: game.user.isGM, store: false });
		await ChatMessage.create({
			user: game.userId,
			speaker: {
				actor: game.user.character?.id,
			},
			content: chatTemplate,
			type: CONST.CHAT_MESSAGE_TYPES.OOC,
		});
	}

	static async spendThreat() {
		if (!MomentumTracker.instance || !game.user.isGM) {
			return;
		}

		const threat = MomentumTracker.instance.threat;

		if (threat === 0) {
			ui.notifications.info(game.i18n.localize("DNM.Notifications.NotEnoughThreat"));
			return;
		}

		await game.settings.set(SYSTEM_ID, "threat", threat - 1);
		MomentumTracker.forceRender();

		const chatTemplate = await renderTemplate("systems/dreams-and-machines/templates/chat/threat.hbs", { store: false });
		await ChatMessage.create({
			user: game.userId,
			speaker: {
				actor: game.user.character?.id,
			},
			content: chatTemplate,
			type: CONST.CHAT_MESSAGE_TYPES.OOC,
		});
	}

	static forceRender() {
		MomentumTracker.#instance?.render(true);
	}
}
