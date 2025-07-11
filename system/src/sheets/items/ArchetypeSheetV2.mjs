import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class ArchetypeSheet extends DnMItemSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		position: {
			height: "auto",
			width: 600,
		},
	};


	get defaultTab() {
		return "attributes";
	}


	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		attributes: {
			template: templatePath("item/archetype/attributes-tab"),
			templates: [
				"item/_shared-partials/attributes",
				"item/_shared-partials/choice-selector",
				"item/_shared-partials/narrow-text-field",
				"item/_shared-partials/skills",
				"item/_shared-partials/spirit",
				"item/_shared-partials/supply-points",
				"item/_shared-partials/tech-level",
			].map(path => templatePath(path)),
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};

	async _prepareArchetypeAttributes(context) {
		this._getAttributeData(context, this.system.attributeChoices.choices);
		this._getSkillData(context);
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		if (partId === "attributes") await this._prepareArchetypeAttributes(context);

		return context;
	}

}
