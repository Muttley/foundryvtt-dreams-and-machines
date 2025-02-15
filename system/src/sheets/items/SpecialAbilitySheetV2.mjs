import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class SpecialAbilitySheet extends DnMItemSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		position: {
			height: 450,
			width: 400,
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
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	/** @override */
	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		if (!this.tabGroups.primary) this.tabGroups.primary = "description";

		context.tabs = {
			description: {
				cssClass: this.tabGroups.primary === "description" ? "active" : "",
				group: "primary",
				id: "description",
				label: "DNM.Labels.Description",
			},
			source: {
				cssClass: this.tabGroups.primary === "source" ? "active" : "",
				group: "primary",
				id: "source",
				label: "DNM.Labels.Source",
			},
		};

		return context;
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		if (partId === "description") {
			context.enrichedDescription = await TextEditor.enrichHTML(
				this.system.description, { async: true }
			);
		}

		context.tab = context.tabs[partId];

		return context;
	}

}
