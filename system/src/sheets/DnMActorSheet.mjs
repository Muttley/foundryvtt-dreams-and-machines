/**
 * Shared base class for all Actor Sheets.
 */
export default class DnMActorSheet extends ActorSheet {

	static get defaultOptions() {
		return {
			...super.defaultOptions,
			classes: ["dnm", "sheet", "actor"],
		};
	}


	get system() {
		return this.actor.system;
	}


	get template() {
		return `systems/dreams-and-machines/templates/actor/${this.actor.type}-sheet.hbs`;
	}


	/**
	 * @param {JQuery} html
	 */
	activateListeners(html) {
		super.activateListeners(html);

		html.find('[data-action="open-sheet"]').on("click", this.openSheet.bind(this));
		html.find("[data-action=roll]").on("click", this.promptForRoll.bind(this));

		html.find("[data-action=add-goal]").on("click", this.onGoalAdd.bind(this));
		html.find("[data-action=add-truth]").on("click", this.onTruthAdd.bind(this));

		new ContextMenu(html, '[data-menu="goal"]', [
			{
				icon: '<i class="fas fa-pencil"></i>',
				name: "DNM.Labels.Actor.EditGoal",
				callback: t => {
					this.onGoalEdit(t.data());
				},
			},
			{
				icon: '<i class="fas fa-trash"></i>',
				name: "DNM.Labels.Actor.DeleteGoal",
				callback: t => {
					this.onGoalDelete(t.data());
				},
			},
		]);

		new ContextMenu(html, '[data-menu="truth"]', [
			{
				icon: '<i class="fas fa-pencil"></i>',
				name: "DNM.Labels.Actor.EditTruth",
				callback: t => {
					this.onTruthEdit(t.data());
				},
			},
			{
				icon: '<i class="fas fa-trash"></i>',
				name: "DNM.Labels.Actor.DeleteTruth",
				callback: t => {
					this.onTruthDelete(t.data());
				},
			},
		]);

		new ContextMenu(html, '[data-menu="item"]', [
			{
				name: "DNM.Labels.Item.Edit",
				icon: '<i class="fas fa-pencil"></i>',
				callback: async i => {
					const uuid = i.data("uuid");
					if (!uuid) {
						return;
					}

					const item = await fromUuid(uuid);
					item?.sheet?.render(true);
				},
			},
			{
				name: "DNM.Labels.Item.Delete",
				icon: '<i class="fas fa-trash"></i>',
				callback: async i => {
					const uuid = i.data("uuid");
					if (!uuid) {
						return;
					}

					const item = await fromUuid(uuid);
					await item?.delete?.();
				},
			},
		]);
	}


	getData(options = {}) {
		const context = super.getData(options);

		context.system = this.system;

		// Attribute Data
		context.attributes = [];
		for (const attribute of Object.keys(CONFIG.DREAMS.ATTRIBUTES)) {
			context.attributes.push({
				key: attribute,
				name: CONFIG.DREAMS.ATTRIBUTES[attribute],
				value: this.system.attributes[attribute].value,
			});
		}
		context.attributes.sort((a, b) => a.name.localeCompare(b.name));

		// Skills Data
		context.skills = [];
		for (const skill of Object.keys(CONFIG.DREAMS.SKILLS)) {
			context.skills.push({
				key: skill,
				name: CONFIG.DREAMS.SKILLS[skill],
				value: this.system.skills[skill],
			});
		}
		context.skills.sort((a, b) => a.name.localeCompare(b.name));

		return context;
	}


	async onGoalAdd(event) {
		event.preventDefault();

		const data = event.currentTarget.dataset;

		const actorUuid = this.actor.uuid;
		const type = data.type;

		dreams.dialogs.DialogEditGoal.createDialog({actorUuid, type});
	}


	async onGoalDelete(data) {
		const index = data.index;
		const type = data.type;

		const currentValues = foundry.utils.duplicate(
			this.actor.system.goals[type]
		);
		currentValues.splice(index, 1);

		const updateData = {};
		updateData[`system.goals.${type}`] = currentValues;

		this.actor.update(updateData);
	}


	async onGoalEdit(data) {
		const actorUuid = this.actor.uuid;

		const index = data.index;
		const type = data.type;

		const currentValues = foundry.utils.duplicate(
			this.actor.system.goals[type]
		);

		const value = currentValues[index];

		dreams.dialogs.DialogEditGoal.createDialog({actorUuid, type, index, value});
	}

	async onTruthAdd(event) {
		event.preventDefault();
		const actorUuid = this.actor.uuid;

		dreams.dialogs.DialogEditTruth.createDialog({actorUuid});
	}


	async onTruthDelete(data) {
		const currentValues = foundry.utils.duplicate(this.actor.system.truths);
		currentValues.splice(data.index, 1);

		this.actor.update({"system.truths": currentValues});
	}


	async onTruthEdit(data) {
		const actorUuid = this.actor.uuid;

		const currentValues = foundry.utils.duplicate(this.actor.system.truths);

		const index = data.index;
		const value = currentValues[index];

		dreams.dialogs.DialogEditTruth.createDialog({actorUuid, index, value});
	}


	/**
	 * @param {MouseEvent} event
	 */
	async openSheet(event) {
		const target = $(event.currentTarget);

		const uuid = target.data("uuid");
		if (!uuid) {
			return;
		}

		const item = await fromUuid(uuid);
		if (!item) {
			return;
		}

		await item?.sheet?.render(true);
	}


	/**
	 * @param {MouseEvent} event
	 */
	async promptForRoll(event) {
		const target = $(event.currentTarget);

		const attribute = target.data("attribute");
		const skill = target.data("skill");

		const itemUuid = target.data("uuid");
		/** @type DnMItem|undefined */
		let item = undefined;
		if (itemUuid) {
			item = await fromUuid(itemUuid);
		}

		dreams.apps.DicePrompt.promptForRoll({
			actor: this.actor,
			attribute,
			skill,
			item,
		});
	}

}
