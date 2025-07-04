import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class MajorNPCActionSheet extends DnMItemSheetV2 {

	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		attributes: {
			template: templatePath("item/major_npc_action/attributes-tab"),
			templates: [
				templatePath("item/major_npc_action/_partials/damage"),
				templatePath("item/major_npc_action/_partials/name"),
				templatePath("item/major_npc_action/_partials/qualities"),
				templatePath("item/major_npc_action/_partials/skill-test"),
				templatePath("item/major_npc_action/_partials/type"),
				templatePath("item/major_npc_action/_partials/weapon"),
			],
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	// get defaultTab() {
	// 	return "description";
	// }


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		if (partId === "attributes") await this._prepareWeaponQualities(context);

		return context;
	}


	async _prepareWeaponQualities(context) {
		context.qualities = [];

		for (const key in this.item.system.weapon.qualities) {
			const quality = this.item.system.weapon.qualities[key] ?? {};

			quality.key = key;
			quality.name = game.i18n.localize(`DNM.QualityName.${key}`);

			context.qualities.push(quality);
		}
	}
}
