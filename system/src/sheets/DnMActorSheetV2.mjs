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
			// editItem: this._onEditItem,
			editString: this._onEditString,
			itemDecrement: this._onItemDecrement,
			itemIncrement: this._onItemIncrement,
			onRoll: this._onRoll,
			showDescription: this._onShowDescription,
			toggleEditMode: this._onToggleEditMode,
			toggleEquipped: this._onToggleEquipped,
			toggleStashed: this._onToggleStashed,
		},
		classes: ["dnm", "actor"],
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


	get tabs() {
		if (!this.tabGroups.primary) {
			this.tabGroups.primary = this.defaultTab;
		}

		switch (this.actor.type) {
			case "character": {
				return {
					attributes: {
						cssClass: this.tabGroups.primary === "attributes" ? "active" : "",
						group: "primary",
						id: "attributes",
						label: "DNM.Labels.Attributes",
					},
					background: {
						cssClass: this.tabGroups.primary === "background" ? "active" : "",
						group: "primary",
						id: "background",
						label: "DNM.Labels.Background",
					},
					equipment: {
						cssClass: this.tabGroups.primary === "equipment" ? "active" : "",
						group: "primary",
						id: "equipment",
						label: "DNM.Labels.Equipment",
					},
					description: {
						cssClass: this.tabGroups.primary === "description" ? "active" : "",
						group: "primary",
						id: "description",
						label: "DNM.Labels.Description",
					},
				};
			}
			case "npc":
			case "vehicle": {
				return {
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
			}
			case "major_npc": {
				return {
					attributes: {
						cssClass: this.tabGroups.primary === "attributes" ? "active" : "",
						group: "primary",
						id: "attributes",
						label: "DNM.Labels.Attributes",
					},
					abilities: {
						cssClass: this.tabGroups.primary === "abilities" ? "active" : "",
						group: "primary",
						id: "abilities",
						label: "DNM.Labels.Abilities",
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
			}
		}

		return {};
	}


	static async _onAddItem(event, target) {
		event.preventDefault();

		const type = target.dataset.itemType;
		const typeName = game.i18n.localize(`TYPES.Item.${type}`);

		const name = `${game.i18n.localize("DNM.Labels.New")} ${typeName}`;

		const data = { name, type};

		const [item] = await this.actor.createEmbeddedDocuments("Item", [data]);
		item.sheet._editModeEnabled = true;
		item.sheet.render({force: true});
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


	_itemContextMenu(html) {
		const canEdit = function(element, actor) {
			let result = false;
			const itemId = element.dataset.itemId;

			if (game.user.isGM) {
				return true;
			}
			else if (actor.isOwner) {
				result = actor.items.find(item => item._id === itemId)
					? true
					: false;
			}

			return result && this.isEditable && this._editModeEnabled;
		}.bind(this);

		const editableItemsMenu = [
			{
				icon: '<i class="fa-solid fa-message"></i>',
				name: "DNM.Labels.SendToChat",
				callback: t => {
					this._onPostItem(t.dataset.itemId);
				},
			},
			{
				icon: '<i class="fa-solid fa-pen-to-square"></i>',
				name: "DNM.Labels.Edit",
				callback: t => {
					this._editOwnedItemById(t.dataset.itemId);
				},
				condition: element => canEdit(element, this.actor),
			},
			{
				icon: '<i class="fa-solid fa-trash"></i>',
				name: "DNM.Labels.Delete",
				callback: t => {
					this._deleteOwnedItemById(t.dataset.itemId);
				},
				condition: element => canEdit(element, this.actor),
			},
		];

		const contextMenu = foundry.applications.ux.ContextMenu.implementation;
		new contextMenu(html, "li.item", editableItemsMenu, {jQuery: false});
	}


	_editOwnedItemById(_itemId) {
		const item = this.actor.items.get(_itemId);
		item.sheet.render(true);
	}


	async _deleteOwnedItemById(_itemId) {
		const item = this.actor.items.get(_itemId);

		const proceed = await foundry.applications.api.DialogV2.confirm({
			window: {
				title: game.i18n.localize("DNM.Labels.Dialog.ConfirmDelete.Title"),
			},
			content: game.i18n.localize("DNM.Labels.Dialog.ConfirmDelete.Prompt"),
			rejectClose: false,
			modal: true,
		});

		if (proceed && item) {
			item.delete();
		}
	}


	_onPostItem(_itemId) {
		const item = this.actor.items.get(_itemId);
		item.sendToChat();
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


	// static async _onEditItem(event, target) {
	// 	if (!this._editModeEnabled) return;

	// 	event.preventDefault();

	// 	const {uuid} = target?.dataset ?? undefined;

	// 	if (uuid) {
	// 		(await fromUuid(uuid))?.sheet?.render({force: true});
	// 	}
	// }


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

		dreams.app.DicePromptV2.promptForRoll(rollData);
	}


	static async _onToggleEditMode(event, target) {
		event.preventDefault();
		this._editModeEnabled = !this._editModeEnabled;
		await this.submit();
		this.render();
	}


	static async _onItemDecrement(event, target) {
		event.preventDefault();

		const dataset = target.dataset;

		const itemUuid = dataset.uuid;

		const item = await fromUuid(itemUuid);

		return item?.update({"system.quantity": Math.max(0, item.system.quantity - 1)});
	}


	static async _onItemIncrement(event, target) {
		event.preventDefault();

		const dataset = target.dataset;

		const itemUuid = dataset.uuid;

		const item = await fromUuid(itemUuid);

		return item?.update({"system.quantity": Math.max(0, item.system.quantity + 1)});
	}


	static async _onToggleEquipped(event, target) {
		event.preventDefault();

		const dataset = target.dataset;

		const itemUuid = dataset.uuid;

		let item = undefined;
		if (itemUuid) {
			item = await fromUuid(itemUuid);
		}

		return item?.update({"system.equipped": !item.system.equipped});
	}


	static async _onToggleStashed(event, target) {
		event.preventDefault();

		const dataset = target.dataset;

		const itemUuid = dataset.uuid;

		let item = undefined;
		if (itemUuid) {
			item = await fromUuid(itemUuid);
		}

		return item?.update({"system.stashed": !item.system.stashed});
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


	// async _onDeleteItem(event) {
	// 	if (!this._editModeEnabled) return;

	// 	event.preventDefault();

	// 	const {uuid} = event.currentTarget?.dataset ?? undefined;
	// 	let item = undefined;
	// 	if (uuid) {
	// 		item = await fromUuid(uuid);
	// 	}

	// 	const proceed = await foundry.applications.api.DialogV2.confirm({
	// 		window: {
	// 			title: game.i18n.localize("DNM.Labels.Dialog.ConfirmDelete.Title"),
	// 		},
	// 		content: game.i18n.localize("DNM.Labels.Dialog.ConfirmDelete.Prompt"),
	// 		rejectClose: false,
	// 		modal: true,
	// 	});

	// 	if (proceed && item) {
	// 		item.delete();
	// 	}
	// }


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

		// const deleteItem = this._onDeleteItem.bind(this);
		// this.element.querySelectorAll(".item").forEach(entry => {
		// 	entry.addEventListener("contextmenu", deleteItem);
		// });
		this._itemContextMenu(this.element);
	}


	static async _onShowDescription(event, target) {
		const em = target.querySelector(".hideable");
		if (!em) return;

		em.classList.toggle("hidden");
	}


	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		// const data = this.document.toObject(false);
		const isEditable = this.isEditable;

		context.isActor = this.documentName === "Actor";
		context.isItem = this.documentName === "Item";

		context.CONFIG = CONFIG.DREAMS;

		context.editModeEnabled = isEditable && this._editModeEnabled;
		context.editModeDisabled = !(isEditable && this._editModeEnabled);

		context.cssClass = isEditable ? "editable" : "locked";
		// context.editable = isEditable;
		context.document = this.document;
		// context.data = data;
		// context.limited = this.document.limited;
		// context.options = this.options;
		// context.owner = this.document.isOwner;
		// context.title = this.title;

		// context.actor = this.actor;
		// context.effects = context.data.effects;
		// context.items = context.data.items;
		// context.systemSource = this.actor.system._source;
		// context.systemFields = this.document.system.schema.fields;

		context.system = this.system;

		if (!this.tabGroups.primary) this.tabGroups.primary = "attributes";

		context.tabs = this.tabs;

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


	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);
		context.tab = context.tabs[partId];
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
		const inventory = {
			equipped: [],
			carried: [],
			stashed: [],
		};

		for (const item of this.actor.items) {
			item.enrichedDescription = await TextEditor.enrichHTML(
				item.system.description, { async: true }
			);

			if (["armor", "weapon"].includes(item.type)) {
				item.enabledQualities = item.getEnabledQualities();
			}


			if (this.actor.type === "character" && item.system.isPhysicalItem) {
				if (item.system.equipped) {
					inventory.equipped.push(item);
				}
				else if (item.system.stashed) {
					inventory.stashed.push(item);
				}
				else {
					inventory.carried.push(item);
				}
			}
			else {
				if (!inventory[item.type]) {
					inventory[item.type] = [];
				}

				inventory[item.type].push(item);
			}
		}

		if (inventory.major_npc_action) {
			inventory.major_npc_action =
				inventory.major_npc_action.sort((a, b) => {
					return a.system.roll.max - b.system.roll.max;
				});

			inventory.major_npc_action =
				inventory.major_npc_action.sort((a, b) => {
					return a.system.roll.min - b.system.roll.min;
				});
		}

		return inventory;
	}

}
