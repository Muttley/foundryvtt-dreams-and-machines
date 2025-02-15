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
				templatePath("item/_shared-partials/quantity"),
				templatePath("item/_shared-partials/rarity"),
				templatePath("item/_shared-partials/supply-point-cost"),
				templatePath("item/_shared-partials/tech-level"),
				templatePath("item/weapon/_partials/damage"),
				templatePath("item/weapon/_partials/qualities"),
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
				await this._prepareWeaponQualities(context);
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
