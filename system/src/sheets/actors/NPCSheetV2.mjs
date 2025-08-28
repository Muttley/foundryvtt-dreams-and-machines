import DnMActorSheetV2 from "../DnMActorSheetV2.mjs";

export default class NPCSheetV2 extends DnMActorSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
		},
		classes: ["npc"],
		form: {
			submitOnChange: true,
		},
		position: {
			width: 586,
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
			template: templatePath("actor/npc/attributes-tab"),
			templates: [
				"actor/_shared-partials/actions",
				"actor/_shared-partials/custom-string-list",
				"actor/_shared-partials/special-abilities",
				"actor/npc/_partials/attributes",
				"actor/npc/_partials/truth",
				"actor/npc/_partials/weapons",
			].map(path => templatePath(path)),
			classes: ["scrollable"],
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
			classes: ["scrollable"],
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
			classes: ["scrollable"],
		},
	};


	get allowedItems() {
		return [
			"npc_action",
			"special_ability",
			"weapon",
		];
	}


	// /** @override */
	// async _prepareContext(options={}) {
	// 	const context = await super._prepareContext(options);

	// 	return context;
	// }


	// /** @override */
	// async _preparePartContext(partId, context, options) {
	// 	await super._preparePartContext(partId, context, options);

	// 	context.tab = context.tabs[partId];

	// 	return context;
	// }
}
