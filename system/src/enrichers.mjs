export function registerTextEditorEnrichers() {

	CONFIG.TextEditor.enrichers.push({
		// [[check ATTRIBUTE SKILL]]
		// [[request ATTRIBUTE SKILL]]
		pattern: /\[\[(?<command>check|request)\s+(?<attribute>\w+)\s+(?<skill>\w+)\]\]/g,
		enricher: async (match, options) => {
			let { command, attribute, skill } = match.groups;

			// Check for invalid data
			let attributeOk = false;
			let skillOk = false;

			if (Object.keys(CONFIG.DREAMS.ATTRIBUTES).includes(attribute.toLowerCase())) {
				attribute = attribute.toLowerCase();
				attributeOk = true;
			}

			if (Object.keys(CONFIG.DREAMS.SKILLS).includes(skill.toLowerCase())) {
				skill = skill.toLowerCase();
				skillOk = true;
			}

			if (!(attributeOk && skillOk)) return;

			// create replacement html
			const link = document.createElement("a");
			link.className = "skill-roll-request";

			link.dataset.command = command;
			link.dataset.attribute = attribute;
			link.dataset.skill = skill;

			const attributeName = CONFIG.DREAMS.ATTRIBUTES[attribute];
			const skillName = CONFIG.DREAMS.SKILLS[skill];

			const linkText = `${attributeName} + ${skillName}`;

			switch (command) {
				case "check":
					link.innerHTML = `<i class="fa-solid fa-dice-d20"></i>&nbsp;${linkText}`;
					break;
				case "request":
					link.innerHTML = `<i class="fa-solid fa-comment"></i>&nbsp;${linkText}`;
					break;
			}

			return link;
		},
	});

	$("body").on("click", "a.skill-roll-request", _onClick);
}


// Work out which actor to use.  If the user clicking the link is the GM and
// they have tokens selected then use these.
//
// Players always use their own character Actor.
//
async function getActors() {
	let actors = [];

	if (game.user.isGM) {
		for (const token of canvas.tokens.controlled) {
			actors.push(token.actor);
		}
	}
	else {
		actors.push(game.user.character);
	}

	return actors;
}


async function triggerSkillRollRequest(options) {
	const actors = await getActors();

	if (actors.length <= 0) {
		return ui.notifications.warn(
			game.i18n.localize("DNM.Error.NoTokensSelected")
		);
	}

	for (const actor of actors) {

		const rollData = {
			actor: actor,
			attribute: options.attribute,
			fixedFocus: undefined,
			fixedTargetNumber: undefined,
			rollTitle: "",
			skill: options.skill,
		};

		dreams.app.DicePromptV2.promptForRoll(rollData);
	}
}


async function _onClick(event) {
	event.preventDefault();

	const element = event.currentTarget;
	const dataset = foundry.utils.duplicate(element.dataset) ?? {};

	const options = {
		attribute: dataset.attribute,
		difficulty: dataset.difficulty ?? 1,
		skill: dataset.skill,
	};

	dreams.log(options);

	triggerSkillRollRequest(options);
}
