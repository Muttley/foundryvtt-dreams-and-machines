import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class NanogramPatternSheet extends DnMItemSheetV2 {

	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		attributes: {
			template: templatePath("item/nanogram_pattern/attributes-tab"),
			templates: [
				templatePath("_shared-partials/number-field"),
			],
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	get defaultTab() {
		return "description";
	}

}
