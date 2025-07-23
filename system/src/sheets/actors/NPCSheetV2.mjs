import DnMActorSheetV2 from "../DnMActorSheetV2.mjs";

const TextEditor = foundry.applications.ux.TextEditor.implementation;

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
				"actor/_shared-partials/special-abilities",
				"actor/npc/_partials/attributes",
				"actor/npc/_partials/truth",
				"actor/npc/_partials/weapons",
			].map(path => templatePath(path)),
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	get allowedItems() {
		return [
			"npc_action",
			"special_ability",
			"weapon",
		];
	}


	/** @override */
	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		return context;
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		switch (partId) {
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
