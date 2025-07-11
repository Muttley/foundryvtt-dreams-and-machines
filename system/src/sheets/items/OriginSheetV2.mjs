import DnMItemSheetV2 from "../DnMItemSheetV2.mjs";

export default class OriginSheet extends DnMItemSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		position: {
			height: "auto",
			width: 600,
		},
	};


	get defaultTab() {
		return "attributes";
	}


	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		attributes: {
			template: templatePath("item/origin/attributes-tab"),
			templates: [
				"item/_shared-partials/choice-selector",
				"item/_shared-partials/skills",
				"item/_shared-partials/spirit",
				"item/_shared-partials/supply-point-cost",
				"item/_shared-partials/supply-points",
				"item/_shared-partials/tech-level",
				"item/origin/_partials/attribute-choices",
				"item/origin/_partials/attributes",
				"item/origin/_partials/skill-choices",
				"item/origin/_partials/special-abilities",
			].map(path => templatePath(path)),
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	async #getSpecialAbilitySelectorConfigs(context) {
		const [fixedAbilities, availableFixedAbilities] =
			await dreams.utils.getDedupedSelectedItems(
				await dreams.compendiums.specialAbilities(),
				this.item.system.fixedSpecialAbilities ?? []
			);

		context.fixedAbilitiesConfig = {
			availableItems: availableFixedAbilities,
			choicesKey: "fixedSpecialAbilities",
			isItem: true,
			label: game.i18n.localize("DNM.Labels.SpecialAbilities"),
			prompt: game.i18n.localize("DNM.Labels.SelectSpecialAbility"),
			selectedItems: fixedAbilities,
		};

		const [selectedAbilities, availableAbilities] =
			await dreams.utils.getDedupedSelectedItems(
				await dreams.compendiums.specialAbilities(),
				this.item.system.specialAbilityChoices.choices ?? []
			);

		context.abilityChoicesConfig = {
			availableItems: availableAbilities,
			choicesKey: "specialAbilityChoices.choices",
			isItem: true,
			label: game.i18n.localize("DNM.Labels.SpecialAbilities"),
			prompt: game.i18n.localize("DNM.Labels.SelectSpecialAbility"),
			selectedItems: selectedAbilities,
		};
	}


	async _prepareOriginAttributes(context) {
		this._getAttributeData(context, this.system.attributeChoices.choices);
		this._getSkillData(context);
		await this.#getSpecialAbilitySelectorConfigs(context);
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		if (partId === "attributes") await this._prepareOriginAttributes(context);

		return context;
	}

}
