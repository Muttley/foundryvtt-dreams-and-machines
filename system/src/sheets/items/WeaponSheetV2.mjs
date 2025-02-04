import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class WeaponSheet extends DnMItemSheetV2 {

	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		attributes: {
			template: templatePath("item/weapon/attributes-tab"),
			templates: [
				templatePath("item/_shared-partials/category"),
				templatePath("item/_shared-partials/coin"),
				templatePath("item/_shared-partials/rarity"),
				templatePath("item/_shared-partials/supply-point-cost"),
				templatePath("item/_shared-partials/tech-level"),
			],
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

		return context;
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		switch (partId) {
			case "attributes":
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

}
