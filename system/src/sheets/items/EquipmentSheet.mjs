import DnMItemSheet from "../DnMItemSheet.mjs";

/**
 * Regexp used for Rating input.
 */
const RATING_INPUT_REGEXP = /(?<label>.*?)(\s(?<rating>\d+))?$/i;

export default class EquipmentSheet extends DnMItemSheet {

	activateListeners(html) {
		super.activateListeners(html);

		html.find('[data-action="add-quality"]').on("keydown", this.addQuality.bind(this));
		html.find('[data-action="delete-quality"]').on("click", this.deleteQuality.bind(this));
	}


	async addQuality(event) {
		if (event.key !== "Enter") {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		/** @type {string} */
		const inputValue = event.target.value;

		/** @type {string} */
		const name = $(event.currentTarget).data("name");

		const match = inputValue.trim().match(RATING_INPUT_REGEXP);
		if (!match) {
			return;
		}

		const label = match.groups.label;
		/** @type {number|null} */
		let rating = Number(match.groups.rating);
		if (isNaN(rating)) {
			rating = null;
		}

		/** @type ItemQuality[] */
		let qualities;
		switch (name) {
			case "system.weapon.damageQualities":
				qualities = [...this.system.weapon.damageQualities];
				break;

			case "system.weapon.qualities":
				qualities = [...this.system.weapon.qualities];
				break;

			default:
				qualities = [...this.system.qualities];
				break;
		}

		await this.item.update({
			[name]: [
				...qualities,
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

		const index = Number(target.data("index"));
		const name = target.data("name");

		/** @type ItemQuality[] */
		let qualities;

		switch (name) {
			case "system.weapon.damageQualities":
				qualities = [...this.system.weapon.damageQualities];
				break;

			case "system.weapon.qualities":
				qualities = [...this.system.weapon.qualities];
				break;

			default:
				qualities = [...this.system.qualities];
				break;
		}
		qualities.splice(index, 1);

		await this.item.update({
			[name]: qualities,
		});
	}
}
