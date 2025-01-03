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
			classes: ["dnm", "sheet", "item"],
			dragDrop: [
				{
					dragSelector: ".item-list .item",
				},
			],
		};
	}


	get system() {
		return this.item.system;
	}


	get title() {
		return `[${this.item.type}] ${this.item.name}`;
	}


	get template() {
		return `systems/dreams-and-machines/templates/item/${this.item.type}-sheet.hbs`;
	}


	activateListeners(html) {
		super.activateListeners(html);

		html.find("[data-action=open-sheet]").on("click", this.openSheet.bind(this));
	}


	async getData(options = {}) {
		const enrichedDescription = await TextEditor.enrichHTML(
			this.system.description, { async: true }
		);

		const enrichedFields = this.system.enrichedFields ?? {};
		for (let key of Object.keys(enrichedFields)) {
			enrichedFields[key] = await TextEditor.enrichHTML(enrichedFields[key]);
		}

		return {
			...await super.getData(options),
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
