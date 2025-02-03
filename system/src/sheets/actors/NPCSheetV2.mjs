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
			template: templatePath("actor/_partials/header"),
		},
		tabs: {
			template: templatePath("actor/_partials/tabs"),
		},
		attributes: {
			template: templatePath("actor/npc/attributes-tab"),
			templates: [
				"actor/npc/_partials/actions",
				"actor/npc/_partials/attributes",
				"actor/npc/_partials/special-abilities",
				"actor/npc/_partials/truth",
				"actor/npc/_partials/weapons",
			].map(path => templatePath(path)),
		},
		description: {
			template: templatePath("actor/_partials/description-tab"),
		},
		source: {
			template: templatePath("actor/_partials/source-tab"),
		},
	};


	/** @override */
	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		if (!this.tabGroups.primary) this.tabGroups.primary = "attributes";

		context.tabs = {
			attributes: {
				cssClass: this.tabGroups.primary === "attributes" ? "active" : "",
				group: "primary",
				id: "attributes",
				label: "DNM.Labels.Attributes",
			},
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

		switch (partId) {
			case "attributes":
				context.abilities = this.actor.items.filter(i => i.type === "specialAbility");
				context.enrichedSpecialActions = await TextEditor.enrichHTML(
					this.system.specialActions, { async: true }
				);
				context.weapons = this.actor.weapons;
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
