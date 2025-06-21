import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

const TextEditor = foundry.applications.ux.TextEditor.implementation;

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
				templatePath("item/_shared-partials/choice-selector"),
				templatePath("item/_shared-partials/spirit"),
				templatePath("item/_shared-partials/supply-points"),
				templatePath("item/_shared-partials/tech-level"),
				templatePath("item/archetype/_partials/attributes"),
				templatePath("item/archetype/_partials/equipment"),
				templatePath("item/archetype/_partials/goals"),
				templatePath("item/archetype/_partials/skills"),
			],
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};

	async _prepareArchetypeAttributes(context) {
		this._getAttributeData(context);
		this._getSkillData(context);

		context.enrichedGoals = await TextEditor.enrichHTML(
			this.system.goals,
			{ async: true }
		);

		context.enrichedStartingGear = await TextEditor.enrichHTML(
			this.system.startingGear,
			{ async: true }
		);
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		if (partId === "attributes") await this._prepareArchetypeAttributes(context);

		return context;
	}

}
