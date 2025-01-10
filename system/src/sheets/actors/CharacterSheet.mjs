import DnMActorSheet from "../DnMActorSheet.mjs";

/**
 * Player Character sheet
 */
export default class CharacterSheet extends DnMActorSheet {

	static get defaultOptions() {
		return {
			...super.defaultOptions,
			classes: ["dnm", "sheet", "actor", "character"],
		};
	}


	get archetype() {
		return this.actor.items.find(i => i.type === "archetype");
	}


	get origin() {
		return this.actor.items.find(i => i.type === "origin");
	}


	get temperament() {
		return this.actor.items.find(i => i.type === "temperament");
	}


	activateListeners(html) {
		super.activateListeners(html);

		html.find("[data-action=increase-quantity]").on("click", this.increaseQuantity.bind(this));
		html.find("[data-action=decrease-quantity]").on("click", this.decreaseQuantity.bind(this));
	}


	async decreaseQuantity(event) {
		const itemUuid = $(event.currentTarget).data("uuid");
		const item = await fromUuid(itemUuid);
		if (!item) {
			return;
		}

		if (item.system.quantity - 1 === 0) {
			await item.delete();
		}
		else {
			await item.update({
				"system.quantity": item.system.quantity - 1,
			});
		}
	}


	async getData(options = {}) {
		const context = await super.getData(options);

		context.archetype = this.archetype;
		context.origin = this.origin;
		context.temperament = this.temperament;

		context.exhausted = this.system.spirit.value <= 0;

		context.talents = await Promise.all(
			this.actor.items
				.filter(i => i.type === "talent")
				.map(
					/**
					 * @param {DnMItem} i
					 */
					async i => ({
						uuid: i.uuid,
						name: i.name,
						description: await TextEditor.enrichHTML(
							i.system.description, { async: true }
						),
					})
				)
		);

		context.equipment = await Promise.all(
			this.actor.items
				.filter(i => i.type === "equipment")
				.map(
					/**
					 * @param {DnMItem} item
					 */
					async item => {
						item.system.description = await TextEditor.enrichHTML(
							item.system.description, { async: true }
						);

						return item;
					}
				)
		);

		context.enrichedAttitude = undefined;
		context.enrichedExhaustion = undefined;
		if (this.temperament) {
			context.enrichedAttitude = await TextEditor.enrichHTML(
				this.temperament.system.spiritEffect, { async: true }
			);

			context.enrichedExhaustion = await TextEditor.enrichHTML(
				this.temperament.system.exhaustionEffect, { async: true }
			);
		}

		context.enrichedArchetypeGoal = undefined;
		if (this.archetype) {
			context.enrichedArchetypeGoal = await TextEditor.enrichHTML(
				this.archetype.system.goal, { async: true }
			);
		}

		return context;
	}


	/**
	 * Handles a change of character Archetype.
	 *
	 * @param {ArchetypeDataModel} archetypeSystem
	 */
	async handleDropArchetype(archetypeSystem) {
		const existingArchetype = this.archetype;

		const spirit = this.system.spirit;
		let supplyPoints = this.system.supplyPoints;
		let coin = this.system.coin;

		// Handle replacing an existing archetype
		if (existingArchetype) {
			// Don't need to un-set the Archetype's skills, since that will be reset anyway.

			// Reduce Spirit, Supply Points, and Coin.
			spirit.value -= existingArchetype.system.spirit;
			spirit.max -= existingArchetype.system.spirit;
			supplyPoints -= existingArchetype.system.supplyPoints;
			coin -= existingArchetype.system.startingCoin;

			// Starting gear is not automatically removed, because that could potentially get messy.

			await existingArchetype?.delete();
		}

		spirit.value += archetypeSystem.spirit;
		spirit.max += archetypeSystem.spirit;
		supplyPoints += archetypeSystem.supplyPoints;
		coin += archetypeSystem.startingCoin;

		spirit.value = Math.max(0, spirit.value);
		spirit.max = Math.max(0, spirit.max);
		supplyPoints = Math.max(0, supplyPoints);
		// coin is allowed to be negative.

		const startingGear = await Promise.all(
			archetypeSystem.startingGear.map(async uuid => {
				const gear = await fromUuid(uuid);
				if (!gear) {
					return;
				}

				return gear.toObject();
			})
		);

		await this.actor.createEmbeddedDocuments("Item", startingGear);

		await this.actor.update({
			"system.skills": archetypeSystem.skills,
			"system.spirit": spirit,
			"system.supplyPoints": supplyPoints,
			"system.coin": coin,
		});
	}


	async increaseQuantity(event) {
		const itemUuid = $(event.currentTarget).data("uuid");
		const item = await fromUuid(itemUuid);
		if (!item) {
			return;
		}

		await item.update({
			"system.quantity": item.system.quantity + 1,
		});
	}


	async _onDropItem(event, data) {
		if (!this.actor.isOwner) return false;
		const item = await Item.implementation.fromDropData(data);

		let applyBackroundItems = false;
		switch (item.type) {
			case "archetype":
				applyBackroundItems = true;
				const existingArchetype = this.archetype;
				if (existingArchetype) await existingArchetype.delete();
				break;

			case "origin":
				applyBackroundItems = true;
				const existingOrigin = this.origin;
				if (existingOrigin) await existingOrigin.delete();
				break;

			case "temperament":
				applyBackroundItems = true;
				const existingTemperament = this.temperament;
				if (existingTemperament) await existingTemperament.delete();
				break;

			default:
				break;
		}

		await super._onDropItem(event, data);

		if (applyBackroundItems) await this.#applyBackroundItems();
	}


	async #applyBackroundItems() {
		await this.#applyOrigin(this.origin?.system);
		await this.#applyArchetype(this.archetype?.system);
		await this.#applyTemperament(this.temperament?.system);
		await this.#applyFinishingTouches();
	}


	async #applyArchetype(archetypeSystem) {
	}


	async #applyFinishingTouches() {}


	async #applyOrigin(originSystem) {
		if (!originSystem) return;

		const attributes = {...this.system.attributes};
		for (const key of Object.keys(attributes)) {
			attributes[key].value = originSystem.attributes[key].value;
		}

		// TODO Handle Attribute choices

		const skills = {...this.system.skills};
		for (const key of Object.keys(skills)) {
			skills[key] = originSystem.skills[key];
		}

		// TODO Handle Skill choices

		const spirit = this.system.spirit;
		spirit.value = Math.max(0, spirit.value);
		spirit.max = Math.max(0, spirit.max);

		const supplyPoints = Math.max(0, originSystem.supplyPoints);

		await this.actor.update({
			"system.attributes": attributes,
			"system.skills": skills,
			"system.techLevel": originSystem.techLevel,
			"system.spirit": spirit,
			"system.supplyPoints": supplyPoints,
		});

		// TODO Handle Special Ability choices
	}


	async #applyTemperament(temperamentSystem) {}
}
