import DnMActorSheetV2 from "../DnMActorSheetV2.mjs";

const TextEditor = foundry.applications.ux.TextEditor.implementation;

export default class MajorNPCSheetV2 extends DnMActorSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
		},
		classes: ["npc"],
		form: {
			submitOnChange: true,
		},
		position: {
			width: 700,
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
			template: templatePath("actor/major-npc/attributes-tab"),
			templates: [
				"_shared-partials/number-field",
				"actor/_shared-partials/custom-string-list",
				"actor/_shared-partials/special-abilities",
				"actor/major-npc/_partials/attributes",
				"actor/major-npc/_partials/injuries",
				"actor/major-npc/_partials/major-npc-actions",
				"actor/major-npc/_partials/skills",
				"actor/major-npc/_partials/threat",
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
			"major_npc_action",
			"special_ability",
		];
	}


	async _onDropItem(event, data) {
		const item = await super._onDropItem(event, data);

		if (item && item.type === "major_npc_action") {
			const actions = this.actor.system?.actions ?? [];

			actions.push({actionUuid: item.uuid, min: 1, max: 1});

			actions.sort((a, b) => {
				return a.min - b.min;
			});

			actions.sort((a, b) => {
				return a.max - b.max;
			});

			this.actor.update({"system.actions": actions});
		}
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
			case "attributes":
				this.getAttributesAndSkillsData(context);
				context.specialAbilities = await this._prepareSpecialAbilities(context);
				context.actions = await this._prepareActions(context);
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
