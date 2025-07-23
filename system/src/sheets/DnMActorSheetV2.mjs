const {api, sheets} = foundry.applications;

const TextEditor = foundry.applications.ux.TextEditor.implementation;

export default class DnMActorSheetV2
	extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

	_editModeEnabled = false;

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			addItem: this._onAddItem,
			addString: this._onAddString,
			editString: this._onEditString,
			editItem: this._onEditItem,
			onRoll: this._onRoll,
			toggleEditMode: this._onToggleEditMode,
		},
		classes: ["sheet", "dnm", "actor"],
		form: {
			submitOnChange: true,
		},
		position: {
			height: "auto",
			width: 800,
		},
		tag: "form",
		window: {
			resizable: true,
		},
	};


	get allowedItems() {
		return [];
	}


	get system() {
		return this.actor.system;
	}


	static async _onAddItem(event, target) {
		event.preventDefault();

		const type = target.dataset.itemType;
		const typeName = game.i18n.localize(`TYPES.Item.${type}`);

		const name = `${game.i18n.localize("DNM.Labels.New")} ${typeName}`;

		const data = { name, type};

		const [newItem] = await this.actor.createEmbeddedDocuments("Item", [data]);
		newItem.sheet.render(true);
	}


	static async _onAddString(event, target) {
		event.preventDefault();
		const actorUuid = this.actor.uuid;
		const dataset = target.dataset;

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

		dreams.dialog.DialogEditStringV2.createDialog({
			actorUuid,
			currentValues,
			fieldKey: dataset.key,
			title: dataset.tooltip,
		});
	}


	async _onDeleteString(event) {
		if (!this._editModeEnabled) return;

		event.preventDefault();

		const dataset = event.currentTarget.dataset;
		const index = Number(dataset.index);

		let currentValues = [];
		switch (dataset.key) {
			case "system.bonds":
				currentValues = foundry.utils.duplicate(this.system.bonds) ?? [];
				break;
			case "system.goals.longTerm":
				currentValues = foundry.utils.duplicate(this.system.goals.longTerm) ?? [];
				break;
			case "system.goals.shortTerm":
				currentValues = foundry.utils.duplicate(this.system.goals.shortTerm) ?? [];
				break;
			case "system.harms":
				currentValues = foundry.utils.duplicate(this.system.harms) ?? [];
				break;
			case "system.truths":
				currentValues = foundry.utils.duplicate(this.system.truths) ?? [];
				break;
			default:
		}
		currentValues.splice(index, 1);

		const updateData = {};
		updateData[dataset.key] = currentValues;

		this.actor.update(updateData);
	}


	static async _onEditItem(event, target) {
		if (!this._editModeEnabled) return;

		event.preventDefault();

		const {uuid} = target?.dataset ?? undefined;

		if (uuid) {
			(await fromUuid(uuid))?.sheet?.render({force: true});
		}
	}


	static async _onEditString(event, target) {
		if (!this._editModeEnabled) return;

		event.preventDefault();

		const dataset = target.dataset;
		const index = Number(dataset.index);

		let currentValues = [];
		let title = game.i18n.localize("DNM.Labels.EditString");

		switch (dataset.key) {
			case "system.bonds":
				currentValues = foundry.utils.duplicate(this.system.bonds) ?? [];
				title = game.i18n.localize("DNM.Labels.EditBond");
				break;
			case "system.goals.longTerm":
				currentValues = foundry.utils.duplicate(this.system.goals.longTerm) ?? [];
				title = game.i18n.localize("DNM.Labels.EditLongTermGoal");
				break;
			case "system.goals.shortTerm":
				currentValues = foundry.utils.duplicate(this.system.goals.shortTerm) ?? [];
				title = game.i18n.localize("DNM.Labels.EditShortTermGoal");
				break;
			case "system.harms":
				currentValues = foundry.utils.duplicate(this.system.harms) ?? [];
				title = game.i18n.localize("DNM.Labels.EditHarm");
				break;
			case "system.truths":
				currentValues = this.system.truths ?? [];
				title = game.i18n.localize("DNM.Labels.EditTruth");
				break;
			default:
		}

		const value = currentValues[index];

		dreams.dialog.DialogEditStringV2.createDialog({
			actorUuid: this.actor.uuid,
			currentValues,
			fieldKey: dataset.key,
			index,
			title,
			value,
		});
	}


	static async _onRoll(event, target) {
		event.preventDefault();

		const dataset = target.dataset;

		const itemUuid = dataset.uuid;
		const rollType = dataset.type;

		let item = undefined;
		if (itemUuid) {
			item = await fromUuid(itemUuid);
		}

		const rollData = {
			actor: this.actor,
			attribute: "",
			fixedFocus: undefined,
			fixedTargetNumber: undefined,
			item,
			rollTitle: "",
			skill: "",
		};

		switch (rollType) {
			case "default":
				rollData.fixedTargetNumber = this.system.defaultAttribute.attribute;
				rollData.fixedFocus = this.system.defaultAttribute.skill;
				rollData.rollTitle = game.i18n.localize("DNM.Labels.Default");
				break;
			case "main":
				rollData.fixedTargetNumber = this.system.mainAttribute.attribute;
				rollData.fixedFocus = this.system.mainAttribute.skill;
				rollData.rollTitle = this.system.truth;
				break;
			default:
				rollData.attribute = dataset.attribute;
				rollData.skill = dataset.skill;
		}

		dreams.app.DicePrompt.promptForRoll(rollData);
	}


	static async _onToggleEditMode(event, target) {
		event.preventDefault();
		this._editModeEnabled = !this._editModeEnabled;
		await this.submit();
		this.render();
	}


	async _onAddString(event) {
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


	async _onDeleteItem(event) {
		if (!this._editModeEnabled) return;

		event.preventDefault();

		const {uuid} = event.currentTarget?.dataset ?? undefined;

		if (uuid) {
			const item = await fromUuid(uuid);

			if (item) item.delete();
		}
	}


	async _onDropItem(event, data) {
		if (this.allowedItems.includes(data.type)) {
			return super._onDropItem(event, data);
		}
		return false;
	}


	async _onRender(context, options) {
		await super._onRender(context, options);

		const deleteString = this._onDeleteString.bind(this);
		this.element.querySelectorAll(".string-edit").forEach(entry => {
			entry.addEventListener("contextmenu", deleteString);
		});

		const deleteItem = this._onDeleteItem.bind(this);
		this.element.querySelectorAll(".item").forEach(entry => {
			entry.addEventListener("contextmenu", deleteItem);
		});
	}


	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		const data = this.document.toObject(false);
		const isEditable = this.isEditable;

		context.CONFIG = CONFIG.DREAMS;

		context.cssClass = isEditable ? "editable" : "locked";
		context.editable = isEditable;
		context.editModeEnabled = this._editModeEnabled;
		context.editModeDisabled = !this._editModeEnabled;
		context.document = this.document;
		context.data = data;
		context.limited = this.document.limited;
		context.options = this.options;
		context.owner = this.document.isOwner;
		context.title = this.title;

		context.actor = this.actor;
		context.effects = context.data.effects;
		context.items = context.data.items;
		context.systemSource = this.actor.system._source;
		context.systemFields = this.document.system.schema.fields;

		context.system = this.system;

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

		const enrichedFields = this.system.enrichedFields ?? {};
		for (let key of Object.keys(enrichedFields)) {
			enrichedFields[key] = await TextEditor.enrichHTML(
				enrichedFields[key]
			);
		}

		context.enrichedFields = enrichedFields;

		context.allSources = await dreams.compendiums.sources();

		context.inventory = await this._prepareInventory();

		return context;
	}


	getAttributesAndSkillsData(context) {
		context.attributes = [];
		for (const attribute of Object.keys(CONFIG.DREAMS.ATTRIBUTES)) {
			context.attributes.push({
				key: attribute,
				label: CONFIG.DREAMS.ATTRIBUTES[attribute],
				value: this.system.attributes[attribute].value,
			});
		}

		context.skills = [];
		for (const skill of Object.keys(CONFIG.DREAMS.SKILLS)) {
			context.skills.push({
				key: skill,
				label: CONFIG.DREAMS.SKILLS[skill],
				value: this.system.skills[skill],
			});
		}
	}


	async _prepareInventory() {
		const inventory = {};

		for (const item of this.actor.items) {
			if (!inventory[item.type]) {
				inventory[item.type] = [];
			}

			item.enrichedDescription = await TextEditor.enrichHTML(
				this.system.description, { async: true }
			);

			inventory[item.type].push(item);
		}

		return inventory;
	}


	async _prepareActions(context) {
		const actions = [];

		for (const action of this.actor.actions) {
			const enrichedDescription = await TextEditor.enrichHTML(action.system.description);

			const actionData = {
				enrichedDescription,
				name: action.name,
				uuid: action.uuid,
				id: action.id,
			};

			actions.push(actionData);
		}

		return actions;
	}


	async _prepareSpecialAbilities(context) {
		const actions = [];

		for (const specialAbility of this.actor.specialAbilities) {
			const enrichedDescription =
				await TextEditor.enrichHTML(specialAbility.system.description);

			const actionData = {
				enrichedDescription,
				name: specialAbility.name,
				uuid: specialAbility.uuid,
				id: specialAbility.id,
			};

			actions.push(actionData);
		}

		return actions;
	}


	async _prepareWeapons(context) {
		const weapons = [];

		for (const weapon of this.actor.weapons) {
			const weaponData = {
				damage: weapon.system.damage,
				name: weapon.name,
				qualities: [],
				type: CONFIG.DREAMS.WEAPON_TYPES[weapon.system.weaponType],
				uuid: weapon.uuid,
				id: weapon.id,
			};

			for (const key in weapon.system.qualities) {
				const quality = weapon.system.qualities[key] ?? {};

				if (!quality.enabled) continue;

				quality.name = game.i18n.localize(`DNM.QualityName.${key}`);

				weaponData.qualities.push(quality);
			}

			weapons.push(weaponData);
		}

		return weapons;
	}
}
