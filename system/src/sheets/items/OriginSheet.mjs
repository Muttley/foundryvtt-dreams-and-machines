import DnMItemSheet from "../DnMItemSheet.mjs";

export default class OriginSheet extends DnMItemSheet {

	activateListeners(html) {
		super.activateListeners(html);

		html.find("[data-action=toggle-attribute-choice]").click(event => {
			event.preventDefault();
			const dataset = event.currentTarget.dataset;
			this.#toggleAttributeChoice(dataset.attributeId);
		});

		html.find("[data-action=toggle-skill-choice]").click(event => {
			event.preventDefault();
			const dataset = event.currentTarget.dataset;
			this.#toggleSkillChoice(dataset.skillId);
		});

		new ContextMenu(html, "[data-menu=archetype]", [
			{
				name: "Labels.Item.Edit",
				icon: '<i class="fas fa-pencil"></i>',
				callback: async i => {
					const uuid = i.data("uuid");
					if (!uuid) {
						return;
					}

					const document = await fromUuid(uuid);
					document?.sheet?.render(true);
				},
			},

			{
				name: "Labels.Item.Delete",
				icon: '<i class="fas fa-trash"></i>',
				callback: async i => {
					const index = Number(i.data("index"));
					if (isNaN(index) || index < 0) {
						return;
					}

					const archetypes = [...this.system.archetypes];
					archetypes.splice(index, 1);

					await this.item.update({
						"system.archetypes": archetypes,
					});
				},
			},
		]);
	}


	async getData(options = {}) {
		const context = await super.getData(options);

		this.#getAttributeData(context);
		this.#getSkillData(context);

		await this.#getSpecialAbilitySelectorConfigs(context);

		return context;
	}


	#getAttributeData(context) {
		const attributes = [];

		for (const [id, name] of Object.entries(CONFIG.DREAMS.ATTRIBUTES)) {
			attributes.push({
				id,
				name,
				selected: this.system.attributeChoices.choices.includes(id),
			});
		}
		context.attributes = attributes.sort(
			(a, b) => a.name.localeCompare(b.name)
		);
	}


	#getSkillData(context) {
		const skills = [];

		for (const [id, name] of Object.entries(CONFIG.DREAMS.SKILLS)) {
			skills.push({
				id,
				name,
				selected: this.system.skillChoices.choices.includes(id),
			});
		}
		context.skills = skills.sort(
			(a, b) => a.name.localeCompare(b.name)
		);
	}


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


	async #toggleAttributeChoice(attributeId) {
		const newChoices = this.#toggleChoice(
			this.system.attributeChoices.choices,
			attributeId
		);

		this.item.update({"system.attributeChoices.choices": newChoices});
	}


	#toggleChoice(currentChoices, choiceId) {
		let newChoices = [];

		if (currentChoices.includes(choiceId)) {
			newChoices = currentChoices.filter(a => a !== choiceId);
		}
		else {
			newChoices = [...currentChoices, choiceId];
		}

		return newChoices;
	}


	async #toggleSkillChoice(skillId) {
		const newChoices = this.#toggleChoice(
			this.system.skillChoices.choices,
			skillId
		);

		this.item.update({"system.skillChoices.choices": newChoices});
	}
}
