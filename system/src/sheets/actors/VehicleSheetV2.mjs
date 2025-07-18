import DnMActorSheetV2 from "../DnMActorSheetV2.mjs";

export default class VehicleSheetV2 extends DnMActorSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			toggleQuality: this._onToggleQuality,
		},
		classes: ["dnm", "sheet", "item"],
		form: {
			submitOnChange: true,
		},
		position: {
			width: 586,
		},
	};


	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		attributes: {
			template: templatePath("actor/vehicle/attributes-tab"),
			templates: [
				"_shared-partials/number-field",
				"actor/_shared-partials/custom-string-list",
				"actor/vehicle/_partials/cover",
				"actor/vehicle/_partials/qualities",
			].map(path => templatePath(path)),
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	static async _onToggleQuality(event, target) {
		event.preventDefault();

		if (!this._editModeEnabled) return;

		const dataset = event.target.dataset;
		const enabled = dataset.enabled === "true" ? false : true;

		const updateData = {};
		updateData[`${dataset.systemProperty}.${dataset.key}.enabled`] = enabled;

		await this.actor.update(updateData);
		this.render();
	}


	/** @override */
	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		return context;
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		switch (partId) {
			case "attributes":
				await this._prepareVehicleQualities(context);
				break;
			case "description":
				context.enrichedDescription = await TextEditor.enrichHTML(
					this.system.description, { async: true }
				);
				break;
		}

		context.tab = context.tabs[partId];

		return context;
	}


	async _prepareVehicleQualities(context) {
		context.qualities = [];

		for (const key in this.actor.system.qualities) {
			const quality = this.actor.system.qualities[key] ?? {};

			quality.key = key;
			quality.name = game.i18n.localize(`DNM.QualityName.${key}`);

			context.qualities.push(quality);
		}
	}
}
