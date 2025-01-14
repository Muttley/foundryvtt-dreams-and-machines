/**
 * @typedef {object} ParsedResultFace
 *
 * @property {number} face
 * @property {boolean} isCritical
 * @property {boolean} isSuccess
 * @property {boolean} isComplication
 */

/**
 *
 */
export default class DnMRoller {
	/**
	 * @param {DnMActor} actor
	 *
	 * @param {object} attribute
	 * @param {string} attribute.label
	 * @param {number} attribute.value
	 *
	 * @param {object|undefined} skill
	 * @param {string} skill.label
	 * @param {number} skill.value
	 *
	 * @param {number} numDice
	 * @param {number} complicationRange
	 * @param {number|undefined} fixedTargetNumber A fixed Target Number to use.
	 * @param {number|undefined} fixedFocus A fixed Focus Number to use.
	 * @param {DnMItem|undefined} item An optional item (usually a weapon) to
	 *                                 include along with the roll.
	 */
	static async roll({
		actor,
		attribute,
		skill,
		numDice,
		complicationRange,
		fixedTargetNumber,
		fixedFocus,
		item,
	}) {
		const targetNumber = fixedTargetNumber ?? attribute.value;

		const roll = new Roll(`${numDice}d20`);
		await roll.evaluate();
		const result = this.parseRoll({
			roll,
			skillValue: fixedFocus ?? skill?.value ?? 1,
			targetNumber,
			complicationRange,
		});

		const template = await renderTemplate("systems/dreams-and-machines/templates/chat/dice-roll.hbs", {
			...result,
			attribute: attribute?.label,
			skill: skill?.label,
			isGM: game.user.isGM,
			targetNumber,
			complicationRange,
			fixedTargetNumber,
			fixedFocus,
			item,
		});

		await ChatMessage.create({
			user: game.userId,
			speaker: { actor: actor?.id },
			rollMode: game.settings.get("core", "rollMode"),
			content: template,
			roll,
		});
	}

	/**
	 * @param {Roll} roll
	 * @param {number} skillValue
	 * @param {number} targetNumber
	 * @param {number} complicationRange
	 */
	static parseRoll({ roll, skillValue, targetNumber, complicationRange }) {
		let successes = 0;
		let complications = 0;
		/**
		 * @type {ParsedResultFace[]}
		 */
		const results = [];

		roll.dice.forEach(term => {
			term.results.forEach(result => {
				let isCritical = false;
				let isSuccess = false;
				let isComplication = false;

				if (result.result <= skillValue) {
					successes += 2;
					isCritical = true;
				}
				else if (result.result <= targetNumber) {
					successes += 1;
					isSuccess = true;
				}

				if (result.result >= complicationRange) {
					complications += 1;
					isComplication = true;
				}

				results.push({
					face: result.result,
					isCritical,
					isSuccess,
					isComplication,
				});
			});
		});

		return {
			successes,
			complications,
			results,
		};
	}
}
