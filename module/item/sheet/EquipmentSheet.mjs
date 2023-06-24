import DnMItemSheet from '../DnMItemSheet.mjs';

/**
 * Regexp used for Rating input.
 */
const RATING_INPUT_REGEXP = /(?<label>.*?)(\s(?<rating>\d+))?$/i;

/**
 * Document sheet for carried items and equipment on the character sheet.
 */
export default class EquipmentSheet extends DnMItemSheet {
	/**
	 * Convenience accessor for the item's data model.
	 * This override is purely here for the sake of type-awareness in editors.
	 *
	 * @returns ItemDataModel
	 */
	get system() {
		return super.system;
	}

	static get defaultOptions() {
		return {
			...super.defaultOptions,
			classes: ['dnm', 'sheet', 'item'],
		};
	}

	/**
	 * @param {JQuery} html
	 */
	activateListeners(html) {
		super.activateListeners(html);

		html.find('[data-action="add-quality"]').on('keydown', this.addQuality.bind(this));
		html.find('[data-action="delete-quality"]').on('click', this.deleteQuality.bind(this));
	}

	/**
	 * Watches for the Enter key on the Qualities input field.
	 *
	 * @param {KeyboardEvent} event
	 */
	async addQuality(event) {
		if (event.key !== 'Enter') {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		/** @type {string} */
		const inputValue = event.target.value;

		const match = inputValue.trim().match(RATING_INPUT_REGEXP);
		if (!match) {
			return;
		}

		const label = match.groups.label;
		/** @type {number|null} */
		let rating = +match.groups.rating;
		if (isNaN(rating)) {
			rating = null;
		}

		await this.item.update({
			'system.qualities': [
				...this.system.qualities,
				{
					label,
					rating,
				},
			],
		});
	}

	/**
	 *
	 * @param {Event} event
	 */
	async deleteQuality(event) {
		const target = $(event.currentTarget);

		const index = +target.data('index');

		const qualities = [...this.system.qualities];
		qualities.splice(index, 1);

		await this.item.update({
			'system.qualities': qualities,
		});
	}
}