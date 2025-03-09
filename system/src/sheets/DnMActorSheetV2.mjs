import DnMItem from "../documents/DnMItem.mjs";

const {api, sheets} = foundry.applications;

export default class DnMActorSheetV2
	extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

	_editModeEnabled = false;

	#dragDrop = this.#createDragDropHandlers();

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			editImage: this._onEditImage,
			onRoll: this._onRoll,
			toggleEditMode: this._onToggleEditMode,
		},
		classes: ["sheet", "dnm", "actor"],
		dragDrop: [{dragSelector: ".draggable", dropSelector: null}],
		form: {
			submitOnChange: true,
		},
		position: {
			// height: 600,
			height: "auto",
			width: 800,
		},
		tag: "form",
	};


	get dragDrop() {
		return this.#dragDrop;
	}


	get system() {
		return this.actor.system;
	}


	#attachContextMenus() {
		// TODO: Change to ContextMenu.create in v13 with jQuery: false
		new ContextMenu(this.element, '[data-menu="item"]', [
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


	#createDragDropHandlers() {
		return this.options.dragDrop.map(d => {
			d.permissions = {
				dragstart: this._canDragStart.bind(this),
				drop: this._canDragDrop.bind(this),
			};
			d.callbacks = {
				dragstart: this._onDragStart.bind(this),
				dragover: this._onDragOver.bind(this),
				drop: this._onDrop.bind(this),
			};
			return new DragDrop(d);
		});
	}


	_canDragDrop(selector) {
		return this.isEditable;
	}


	_canDragStart(selector) {
		return this.isEditable;
	}


	_getEmbeddedDocument(target) {
		const docRow = target.closest("[data-document-class]");

		if (docRow.dataset.documentClass === "Item") {
			return this.actor.items.get(docRow.dataset.itemId);
		}
		else if (docRow.dataset.documentClass === "ActiveEffect") {
			const parent =
				docRow.dataset.parentId === this.actor.id
					? this.actor
					: this.actor.items.get(docRow?.dataset.parentId);

			return parent.effects.get(docRow?.dataset.effectId);
		}
		else {
			return console.warn("Could not find document class");
		}
	}


	/**
	 * Handle changing a Document's image.
	 * TODO: Copied from v13 implementation, can be removed after
	 */
	static async _onEditImage(_event, target) {
		if (target.nodeName !== "IMG") {
			throw new Error("The editImage action is available only for IMG elements.");
		}
		const attr = target.dataset.edit;
		const current = foundry.utils.getProperty(this.document._source, attr);
		const defaultArtwork =
			this.document.constructor.getDefaultArtwork?.(this.document._source) ?? {};
		const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
		const fp = new FilePicker({
			current,
			type: "image",
			redirectToRoot: defaultImage ? [defaultImage] : [],
			callback: path => {
				target.src = path;
				if (this.options.form.submitOnChange) {
					const submit = new Event("submit");
					this.element.dispatchEvent(submit);
				}
			},
			top: this.position.top + 40,
			left: this.position.left + 10,
		});
		await fp.browse();
	}


	_onDragOver(event) {}


	_onDragStart(event) {
		const docRow = event.currentTarget.closest("[data-document-class]");
		if ("link" in event.target.dataset) return;

		// Chained operation
		let dragData = this._getEmbeddedDocument(docRow)?.toDragData();

		if (!dragData) return;

		// Set data transfer
		event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
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
			fixedFocus: 0,
			fixedTargetNumber: 0,
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


	async _onDrop(event) {
		const data = TextEditor.getDragEventData(event);
		const actor = this.actor;

		const allowed = Hooks.call("dropActorSheetData", actor, this, data);

		if (allowed === false) return;

		switch (data.type) {
			case "ActiveEffect":
			case "Actor":
			case "Folder":
				break;
			case "Item":
				return this._onDropItem(event, data);
		}
	}


	async _onDropItem(event, data) {
		if (!this.actor.isOwner) return false;
		const item = await DnMItem.fromDropData(data);

		// Handle item sorting within the same Actor
		if (this.actor.uuid === item.parent?.uuid) return this._onSortItem(event, item);

		// Create the owned item
		return this._onDropItemCreate(item, event);
	}


	async _onDropItemCreate(itemData, event) {
		itemData = itemData instanceof Array ? itemData : [itemData];
		return this.actor.createEmbeddedDocuments("Item", itemData);
	}


	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);
		this.#attachContextMenus();
	}


	_onRender(context, options) {
		this.#dragDrop.forEach(d => d.bind(this.element));
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
		context.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
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

		// Simple npc characters do not have all the attributes and skills of
		// characters or majorNPCs
		if (this.actor.type !== "npc") this.getAttributesAndSkillsData(context);

		context.allSources = await dreams.compendiums.sources();

		return context;
	}


	async _prepareWeapons(context) {
		const weapons = [];

		for (const weapon of this.actor.weapons) {
			const weaponData = {
				name: weapon.name,
				uuid: weapon.uuid,
				type: CONFIG.DREAMS.WEAPON_TYPES[weapon.system.weaponType],
				qualities: [],
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
