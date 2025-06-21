import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class TalentSheet extends DnMItemSheetV2 {

	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		attributes: {
			template: templatePath("item/talent/attributes-tab"),
			templates: [
				templatePath("item/talent/_partials/archetype"),
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


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		if (partId === "attributes") {
			const archetypeItems = await dreams.compendiums.archetypes(false);

			let foundOwnArchetype = this.item.system.archetype
				? false
				: true;

			context.archetypes = [];

			for (const archetype of archetypeItems) {
				console.log(archetype.system);

				if (!foundOwnArchetype) {
					foundOwnArchetype = this.item.system.archetype === archetype.uuid;
				}

				context.archetypes.push({
					uuid: archetype.uuid,
					label: archetype.name,
				});
			}

			if (!foundOwnArchetype) {
				dreams.utils.reportMissingTypeByUuid(
					this.item, "archetype", this.system.archetype
				);

				context.archetypes.push({
					uuid: this.item.system.archetype,
					label: "[Invalid ID]",
				});
			}

			context.archetypes = context.archetypes.sort(
				(a, b) => a.label.localeCompare(b.label)
			);
		}

		return context;
	}

}
