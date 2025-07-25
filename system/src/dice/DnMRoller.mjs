const renderTemplate = foundry.applications.handlebars.renderTemplate;

export default class DnMRoller {

	static async performRoll(formula) {
		dreams.debug(`Rolling bespoke roll: ${formula}`);

		const roll = new Roll(formula);
		await roll.evaluate();

		if (game.dice3d) {
			const {whisper, blind } = this.getRollModeSettings();
			await game.dice3d.showForRoll(roll, game.user, true, whisper, blind);
		}

		return roll;
	}


	static getRollModeSettings() {
		const rollMode = game.settings.get("core", "rollMode");

		let blind = false;
		let whisper = null;

		switch (rollMode) {
			case "blindroll": {
				blind = true;
			}
			case "gmroll": {
				const gmList = game.users.filter(user => user.isGM);
				const gmIDList = [];
				gmList.forEach(gm => gmIDList.push(gm.id));
				whisper = gmIDList;
				break;
			}
			case "roll": {
				const userList = game.users.filter(user => user.active);
				const userIDList = [];
				userList.forEach(user => userIDList.push(user.id));
				whisper = userIDList;
				break;
			}
			case "selfroll": {
				whisper = [game.user.id];
				break;
			}
			default: {
				break;
			}
		}
		return { whisper, blind };
	}


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
		complicationRange,
		fixedFocus,
		fixedTargetNumber,
		item,
		numDice,
		rollTitle,
		skill,
	}) {
		const targetNumber = fixedTargetNumber ?? attribute.value;
		const skillValue = fixedFocus ?? skill?.value ?? 1;

		const npcRoll = fixedTargetNumber + fixedFocus > 0;

		const roll = await this.performRoll(`${numDice}d20`);

		const result = this.parseRoll({
			roll,
			skillValue,
			targetNumber,
			complicationRange,
		});

		const template = await renderTemplate("systems/dreams-and-machines/templates/chat/dice-roll.hbs", {
			...result,
			attribute: attribute?.label,
			complicationRange,
			isGM: game.user.isGM,
			item,
			npcRoll,
			rollTitle,
			skill: skill?.label,
			skillValue,
			targetNumber,
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
				let isFail = false;

				let tooltip = "";

				if (result.result <= targetNumber) {
					successes += 1;
					isSuccess = true;
					tooltip = "DNM.Roll.Success";
				}
				else {
					isFail = true;
					tooltip = "DNM.Roll.Fail";
				}

				if (result.result <= skillValue) {
					successes += 1;
					isCritical = true;
					tooltip = "DNM.Roll.Critical";
				}

				if (result.result >= complicationRange) {
					complications += 1;
					isComplication = true;
					isFail = false;
					tooltip = "DNM.Roll.Complication";
				}

				results.push({
					face: result.result,
					isComplication,
					isCritical,
					isFail,
					isSuccess,
					tooltip,
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
