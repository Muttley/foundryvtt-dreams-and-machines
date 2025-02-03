/**
 * Shared base class for all Actor Sheets.
 */
export default class DnMActorSheet extends ActorSheet {

	_editModeEnabled = false;


	static get defaultOptions() {
		return {
			...super.defaultOptions,
			classes: ["dnm", "sheet", "actor", "npc"],
		};
	}


	get system() {
		return this.actor.system;
	}


	get template() {
		return `systems/dreams-and-machines/templates/actor/${this.actor.type}-sheet.hbs`;
	}


	async _onToggleEditMode(event) {
		this._editModeEnabled = !this._editModeEnabled;
		await this.submit();
		this.render();
	}


	/**
	 * @param {JQuery} html
	 */
	activateListeners(html) {
		super.activateListeners(html);

		html.find("[data-action=add-string]").on("click", this.onStringAdd.bind(this));
		html.find("[data-action=open-sheet]").on("click", this.openSheet.bind(this));
		html.find("[data-action=roll]").on("click", this.promptForRoll.bind(this));

		html.find("[data-action=toggleEditMode]")
			.click(async event => this._onToggleEditMode(event));

		this.attachContextMenus(html);
	}


	attachContextMenus(html) {
		new ContextMenu(html, '[data-action="edit-string"]', [
			{
				icon: '<i class="fas fa-pencil"></i>',
				name: "DNM.Labels.Edit",
				callback: t => this.onStringEdit(t.data()),
			},
			{
				icon: '<i class="fas fa-trash"></i>',
				name: "DNM.Labels.Delete",
				callback: t => this.onStringDelete(t.data()),
			},
		]);

		new ContextMenu(html, '[data-menu="item"]', [
			{
				name: "DNM.Labels.Edit",
				icon: '<i class="fas fa-pencil"></i>',
				callback: async i => {
					if (!i.data("uuid")) return;

					const uuid = i.data("uuid");

					const item = await fromUuid(uuid);
					item?.sheet?.render(true);
				},
			},
			{
				name: "DNM.Labels.Delete",
				icon: '<i class="fas fa-trash"></i>',
				callback: async i => {
					if (!i.data("uuid")) return;

					const uuid = i.data("uuid");

					const item = await fromUuid(uuid);
					await item?.delete?.();
				},
			},
		]);
	}


	getAttributesAndSkillsData(context) {
		context.attributes = [];
		for (const attribute of Object.keys(CONFIG.DREAMS.ATTRIBUTES)) {
			context.attributes.push({
				key: attribute,
				name: CONFIG.DREAMS.ATTRIBUTES[attribute],
				value: this.system.attributes[attribute].value,
			});
		}
		context.attributes.sort((a, b) => a.name.localeCompare(b.name));

		context.skills = [];
		for (const skill of Object.keys(CONFIG.DREAMS.SKILLS)) {
			context.skills.push({
				key: skill,
				name: CONFIG.DREAMS.SKILLS[skill],
				value: this.system.skills[skill],
			});
		}
		context.skills.sort((a, b) => a.name.localeCompare(b.name));
	}


	async getData(options = {}) {
		const context = super.getData(options);

		context.system = this.system;

		context.editModeEnabled = this._editModeEnabled;
		context.editModeDisabled = !this._editModeEnabled;

		// Simple npc characters do not have all the attributes and skills of
		// characters or majorNPCs
		if (this.actor.type !== "npc") this.getAttributesAndSkillsData(context);

		return context;
	}


	async onStringAdd(event) {
		event.preventDefault();
		const actorUuid = this.actor.uuid;
		const dataset = event.currentTarget.dataset;

		let currentValues = [];
		switch (dataset.key) {
			case "system.bonds":
				currentValues = foundry.utils.duplicate(this.actor.system.bonds) ?? [];
				break;
			case "system.goals.longTerm":
				currentValues = foundry.utils.duplicate(this.actor.system.goals.longTerm) ?? [];
				break;
			case "system.goals.shortTerm":
				currentValues = foundry.utils.duplicate(this.actor.system.goals.shortTerm) ?? [];
				break;
			case "system.harms":
				currentValues = foundry.utils.duplicate(this.actor.system.harms) ?? [];
				break;
			case "system.truths":
				currentValues = foundry.utils.duplicate(this.actor.system.truths) ?? [];
				break;
			default:
		}
		dreams.dialog.DialogEditString.createDialog({
			actorUuid,
			currentValues,
			fieldKey: dataset.key,
			title: dataset.tooltip,
		});
	}


	async onStringDelete(data) {
		let currentValues = [];
		switch (data.key) {
			case "system.bonds":
				currentValues = foundry.utils.duplicate(this.actor.system.bonds) ?? [];
				break;
			case "system.goals.longTerm":
				currentValues = foundry.utils.duplicate(this.actor.system.goals.longTerm) ?? [];
				break;
			case "system.goals.shortTerm":
				currentValues = foundry.utils.duplicate(this.actor.system.goals.shortTerm) ?? [];
				break;
			case "system.harms":
				currentValues = foundry.utils.duplicate(this.actor.system.harms) ?? [];
				break;
			case "system.truths":
				currentValues = foundry.utils.duplicate(this.actor.system.truths) ?? [];
				break;
			default:
		}
		currentValues.splice(data.index, 1);

		const updateData = {};
		updateData[data.key] = currentValues;

		this.actor.update(updateData);
	}


	async onStringEdit(data) {
		const actorUuid = this.actor.uuid;

		let currentValues = [];
		let title = game.i18n.localize("DNM.Labels.EditString");

		switch (data.key) {
			case "system.bonds":
				currentValues = foundry.utils.duplicate(this.actor.system.bonds) ?? [];
				title = game.i18n.localize("DNM.Labels.EditBond");
				break;
			case "system.goals.longTerm":
				currentValues = foundry.utils.duplicate(this.actor.system.goals.longTerm) ?? [];
				title = game.i18n.localize("DNM.Labels.EditLongTermGoal");
				break;
			case "system.goals.shortTerm":
				currentValues = foundry.utils.duplicate(this.actor.system.goals.shortTerm) ?? [];
				title = game.i18n.localize("DNM.Labels.EditShortTermGoal");
				break;
			case "system.harms":
				currentValues = foundry.utils.duplicate(this.actor.system.harms) ?? [];
				title = game.i18n.localize("DNM.Labels.EditHarm");
				break;
			case "system.truths":
				currentValues = this.actor.system.truths ?? [];
				title = game.i18n.localize("DNM.Labels.EditTruth");
				break;
			default:
		}

		const value = currentValues[data.index];

		dreams.dialog.DialogEditString.createDialog({
			actorUuid,
			currentValues,
			fieldKey: data.key,
			index: data.index,
			title,
			value,
		});
	}


	async openSheet(event) {
		const target = $(event.currentTarget);

		const uuid = target.data("uuid");
		if (!uuid) return;

		const item = await fromUuid(uuid);
		if (!item) return;

		await item?.sheet?.render(true);
	}


	async promptForRoll(event) {
		const target = $(event.currentTarget);

		const attribute = target.data("attribute");
		const skill = target.data("skill");

		const itemUuid = target.data("uuid");

		let item = undefined;
		if (itemUuid) {
			item = await fromUuid(itemUuid);
		}

		dreams.app.DicePrompt.promptForRoll({
			actor: this.actor,
			attribute,
			skill,
			item,
		});
	}

}
