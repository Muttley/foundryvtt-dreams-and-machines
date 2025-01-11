/**
 * @typedef {object} DropData
 * @property {string} uuid
 */

/**
 * Shared base class for all Item Sheets.
 */
export default class DnMItemSheet extends ItemSheet {

	static get defaultOptions() {
		return {
			...super.defaultOptions,
			width: 586,
			classes: ["dnm", "sheet", "item"],
			dragDrop: [
				{
					dragSelector: ".item-list .item",
				},
			],
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "attributes",
			}],
		};
	}


	get system() {
		return this.item.system;
	}


	get title() {
		const itemType = game.i18n.localize(`TYPES.Item.${this.item.type}`);
		return `[${itemType}] ${this.item.name}`;
	}


	get template() {
		return `systems/dreams-and-machines/templates/item/${this.item.type}-sheet.hbs`;
	}


	/**
	 * Deletes an Item/Skill choice from this item, using the data stored
	 * on the target element
	 *
	 * @param {event} Event The triggered event
	 */
	_deleteChoiceItem(event) {
		if (!this.isEditable) return;

		event.preventDefault();
		event.stopPropagation();

		const deleteUuid = $(event.currentTarget).data("uuid");
		const choicesKey = $(event.currentTarget).data("choices-key");

		// handles cases where choicesKey is nested property.
		const currentChoices = choicesKey
			.split(".")
			.reduce((obj, path) => obj ? obj[path]: [], this.item.system);

		const newChoices = [];
		for (const itemUuid of currentChoices) {
			if (itemUuid === deleteUuid) continue;
			newChoices.push(itemUuid);
		}

		const dataKey = `system.${choicesKey}`;
		this.item.update({[dataKey]: newChoices});
	}


	async _onChangeChoiceList(event, choicesKey, isItem) {
		const options = event.target.list.options;
		const value = event.target.value;

		let uuid = null;
		for (const option of options) {
			if (option.value === value) {
				uuid = option.getAttribute("data-uuid");
				break;
			}
		}

		if (uuid === null) return;

		// handles cases where choicesKey is nested property.
		let currentChoices = choicesKey
			.split(".")
			.reduce((obj, path) => obj ? obj[path]: [], this.item.system);

		if (currentChoices.includes(uuid)) return; // No duplicates

		currentChoices.push(uuid);

		const choiceItems = [];
		for (const itemUuid of currentChoices) {
			if (isItem) {
				choiceItems.push(await fromUuid(itemUuid));
			}
			else {
				choiceItems.push(itemUuid);
			}
		}

		if (isItem) {
			choiceItems.sort((a, b) => a.name.localeCompare(b.name));
		}
		else {
			choiceItems.sort((a, b) => a.localeCompare(b));
		}

		const sortedChoiceUuids = isItem
			? choiceItems.map(item => item.uuid)
			: choiceItems;

		const updateData = {};
		updateData[`system.${choicesKey}`] = sortedChoiceUuids;

		return this.item.update(updateData);
	}


	/** @inheritdoc */
	async _onChangeInput(event) {
		const choicesKey = event.currentTarget.dataset.choicesKey;
		const isItem = event.currentTarget.dataset.isItem === "true";

		if (event.target.list && choicesKey) {
			return await this._onChangeChoiceList(event, choicesKey, isItem);
		}

		await super._onChangeInput(event);
	}


	activateListeners(html) {
		super.activateListeners(html);

		html.find("[data-action=open-sheet]").on("click", this.openSheet.bind(this));

		html.find("[data-action=delete-choice]").click(
			event => this._deleteChoiceItem(event)
		);
	}


	async getData(options = {}) {
		const enrichedDescription = await TextEditor.enrichHTML(
			this.system.description, { async: true }
		);

		const enrichedFields = this.system.enrichedFields ?? {};
		for (let key of Object.keys(enrichedFields)) {
			enrichedFields[key] = await TextEditor.enrichHTML(enrichedFields[key]);
		}

		const allSources = await dreams.compendiums.sources();

		return {
			...await super.getData(options),
			allSources,
			system: this.system,
			enrichedDescription,
			CONFIG,
			...enrichedFields,
		};
	}


	async openSheet(event) {
		const uuid = $(event.currentTarget).data("uuid");
		if (!uuid) {
			return;
		}

		const document = await fromUuid(uuid);
		document?.sheet?.render(true);
	}


	async _onDrop(event) {
		/** @type DropData */
		const data = TextEditor.getDragEventData(event);

		switch (data.type) {
			case "ActiveEffect":
				return await this._onDropActiveEffect(event, data);
			case "Actor":
				return await this._onDropActor(event, data);
			case "Item":
				return await this._onDropItem(event, data);
			case "Folder":
				return await this._onDropFolder(event, data);
		}
	}


	/**
	 * Called when an ActiveEffect is dropped on the item sheet.
	 *
	 * @param {DragEvent} _event
	 * @param {DropData} _data
	 * @protected
	 */
	async _onDropActiveEffect(_event, _data) {}


	/**
	 * Called when an Actor is dropped on the item sheet.
	 *
	 * @param {DragEvent} _event
	 * @param {DropData} _data
	 * @protected
	 */
	async _onDropActor(_event, _data) {}


	/**
	 * Called when a Folder is dropped on the item sheet.
	 *
	 * @param {DragEvent} _event
	 * @param {DropData} _data
	 * @protected
	 */
	async _onDropFolder(_event, _data) {}


	/**
	 * Called when an Item is dropped on the item sheet.
	 *
	 * @param {DragEvent} _event
	 * @param {DropData} _data
	 * @protected
	 */
	async _onDropItem(_event, _data) {}

}
