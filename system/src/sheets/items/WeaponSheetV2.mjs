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
				"item/_shared-partials/category",
				"item/_shared-partials/coin",
				"item/_shared-partials/quantity",
				"item/_shared-partials/rarity",
				"item/_shared-partials/supply-point-cost",
				"item/_shared-partials/tech-level",
				"item/weapon/_partials/damage",
				"item/weapon/_partials/qualities",
				"item/weapon/_partials/type",
			].map(path => templatePath(path)),
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		if (partId === "attributes") await this._prepareWeaponQualities(context);

		return context;
	}


	async _prepareWeaponQualities(context) {
		context.qualities = [];

		for (const key in this.item.system.qualities) {
			const quality = this.item.system.qualities[key] ?? {};

			quality.key = key;
			quality.name = game.i18n.localize(`DNM.QualityName.${key}`);

			context.qualities.push(quality);
		}
	}
}
