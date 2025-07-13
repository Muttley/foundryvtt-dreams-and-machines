import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class TemperamentSheet extends DnMItemSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			toggleAttributeChoice: TemperamentSheet._onToggleAttributeChoice,
		},
		position: {
			height: "auto",
			width: 600,
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
			template: templatePath("item/temperament/attributes-tab"),
			templates: [
				"item/_shared-partials/attributes",
				"item/_shared-partials/narrow-text-field",
				"item/_shared-partials/skills",
			].map(path => templatePath(path)),
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	static async _onToggleAttributeChoice(event, target) {
		event.preventDefault();
		const attributeId = target.dataset.attributeId;
		this.item.update({"system.attributeChoices.chosen": attributeId});
	}


	async _prepareTemperamentAttributes(context) {
		const chosen = [this.system.attributeChoices.chosen];
		this._getAttributeData(context, chosen);

		this._getSkillData(context);
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		if (partId === "attributes") await this._prepareTemperamentAttributes(context);

		return context;
	}

}
