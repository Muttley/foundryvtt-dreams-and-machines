import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class EquipmentSheet extends DnMItemSheetV2 {

	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		attributes: {
			template: templatePath("item/equipment/attributes-tab"),
			templates: [
				"item/_shared-partials/category",
				"item/_shared-partials/coin",
				"item/_shared-partials/quantity",
				"item/_shared-partials/rarity",
				"item/_shared-partials/supply-point-cost",
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

}
