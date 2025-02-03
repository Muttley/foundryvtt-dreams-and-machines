const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class ConfigureOrigin
	extends HandlebarsApplicationMixin(ApplicationV2) {

	#firstRun = true;

	constructor(actor, origin) {
		super();

		this.actor = actor;
		this.origin = origin;
		this.originData = origin.toObject();

		this.currentOrigin = actor.origin;
	}


	static DEFAULT_OPTIONS = {
		actions: {},
		form: {
			closeOnSubmit: true,
			submitOnChange: true,
			handler: ConfigureOrigin.#onSubmit,
		},
		tag: "form",
		window: {
			contentClasses: [
				"dreams sheet",
			],
			icon: "fa-solid fa-ballot-check",
			resizable: true,
			title: "DNM.Labels.ConfigureOrigin",
		},
		position: {
			width: 400,
			height: "auto",
		},
	};


	static PARTS = {
		form: {
			template: "systems/dreams-and-machines/templates/app/configure-origin.hbs",
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	};


	get title() {
		return game.i18n.format(
			"DNM.Labels.ConfigureOrigin",
			{
				origin: this.origin?.name ?? game.i18n.localize("DNM.Labels.Unknown"),
			}
		);
	}


	async #onFirstRun() {
		this.#firstRun = false;

		if (this.currentOrigin) {
			// TODO Remove the currentOrigin and any associated Special Abilities
			this.currentOrigin = await this.currentOrigin.delete();
			this.currentOrigin = undefined;
		}
	}

	async _prepareContext() {
		if (this.#firstRun) await this.#onFirstRun();

		const context = {
			buttons: [{
				icon: "fas fa-save",
				label: "SETUP.SaveConfiguration",
				type: "submit",
			}],
		};

		context.origin = this.originData || {};

		return context;
	}


	async #onChange(event, form, formData) {
		dreams.debug("ConfigureOrigin::#onChange");
		return this.render(true);
	}


	static async #onSubmit(event, form, formData) {
		dreams.debug("ConfigureOrigin::#onSubmit");
		if (event.type === "change") {
			return this.#onChange(event, form, formData);
		}

		this.actor.createEmbeddedDocuments("Item", [this.originData]);
		this.close();
	}
}
