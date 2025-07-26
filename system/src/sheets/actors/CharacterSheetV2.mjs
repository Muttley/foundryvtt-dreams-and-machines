import DnMActorSheetV2 from "../DnMActorSheetV2.mjs";

export default class CharacterSheetV2 extends DnMActorSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
		},
		classes: ["character"],
		form: {
			submitOnChange: true,
		},
		position: {
			width: 700,
		},
	};


	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
			classes: ["character"],
		},
		attributes: {
			template: templatePath("actor/character/attributes-tab"),
			templates: [
				"_shared-partials/number-field",
				"actor/_shared-partials/attributes",
				"actor/_shared-partials/custom-string-list",
				"actor/_shared-partials/skills",
				"actor/character/_partials/spirit",
			].map(path => templatePath(path)),
			classes: ["scrollable"],
		},
		background: {
			template: templatePath("actor/character/background-tab"),
			templates: [
				"actor/_shared-partials/background-item",
				"actor/character/_partials/archetype-goal",
				"actor/character/_partials/attitude",
				"actor/character/_partials/exhaustion",
				"actor/character/_partials/goals",
			].map(path => templatePath(path)),
			classes: ["scrollable"],
		},
		equipment: {
			template: templatePath("actor/character/equipment-tab"),
			templates: [
				"_shared-partials/number-field",
				"actor/_shared-partials/custom-string-list",
				"actor/character/_partials/supply-points",
			].map(path => templatePath(path)),
			classes: ["scrollable"],
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
			classes: ["scrollable"],
		},
	};


	get allowedItems() {
		return [
			"archetype",
			"armor",
			"equipment",
			"glif",
			"nanogram_pattern",
			"origin",
			"talent",
			"temperament",
			"weapon",
		];
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		switch (partId) {
			case "attributes":
				this.getAttributesAndSkillsData(context);
				break;
		}

		return context;
	}
}
