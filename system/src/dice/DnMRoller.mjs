// const renderTemplate = foundry.applications.handlebars.renderTemplate;

export default class DnMRoller {

	static async performRoll(formula) {
		dreams.debug(`Rolling bespoke roll: ${formula}`);

		const roll = new Roll(formula);
		await roll.evaluate();

		if (game.dice3d) {
			const {whisper, blind} = ChatMessage.applyRollMode({}, game.settings.get("core", "rollMode"));
			await game.dice3d.showForRoll(roll, game.user, true, whisper, blind);
		}

		return roll;
	}


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

		const {successes, complications, results} = this.parseRoll({
			roll,
			skillValue,
			targetNumber,
			complicationRange,
		});

		const data = {
			attribute: attribute?.label,
			complicationRange,
			complications,
			isGM: game.user.isGM,
			item,
			npcRoll,
			results,
			rollTitle,
			skill: skill?.label,
			skillValue,
			successes,
			targetNumber,
		};

		dreams.chat.renderRollMessage(actor, data);
	}


	static parseRoll({ roll, skillValue, targetNumber, complicationRange }) {
		let successes = 0;
		let complications = 0;

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
