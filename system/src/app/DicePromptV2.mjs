import DnMRoller from "../dice/DnMRoller.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class DicePromptV2
	extends HandlebarsApplicationMixin(ApplicationV2) {

	actor = undefined;

	attribute = "";

	complication = 20;

	fixedFocus = undefined;

	fixedTargetNumber = undefined;

	item = undefined;

	numDice = 2;

	rollTitle = "";

	skill = "";

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			setNumberOfDice: this._setNumberOfDice,
		},
		classes: ["dnm", "dice-prompt"],
		form: {
			closeOnSubmit: false,
			submitOnChange: true,
			handler: DicePromptV2.#onSubmit,
		},
		position: {
			width: "auto",
		},
		tag: "form",
		window: {
			resizable: false,
		},
	};


	/** @override */
	static PARTS = {
		form: {
			template: templatePath("app/dice-prompt"),
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	};


	static promptForRoll({
		actor,
		attribute = "",
		fixedFocus,
		fixedTargetNumber,
		item,
		rollTitle = "",
		skill = "",
	} = {}) {
		const prompt = new DicePromptV2();

		prompt.actor = actor;
		prompt.attribute = attribute;
		prompt.fixedFocus = fixedFocus;
		prompt.fixedTargetNumber = fixedTargetNumber;
		prompt.item = item;
		prompt.rollTitle = rollTitle;
		prompt.skill = skill;

		prompt.render({force: true});
	}


	static async #onSubmit(event, form, formData) {
		dreams.debug("DicePromptV2::#onSubmit");
		if (event.type === "change") {
			return this.#onChange(event, form, formData);
		}
		else if (event.type === "submit") {
			this._roll();
		}
	}


	async _roll() {
		let attribute = undefined;
		let skill = undefined;

		if (this.actor.isNotNpc) {

			if (!this.attribute) {
				return ui.notifications.error(
					game.i18n.localize("DNM.Error.NoAttributeSelectedForRolling")
				);
			}

			attribute = {
				label: game.i18n.localize(`DNM.Attributes.${this.attribute.capitalize()}`),
				value: this.actor.system.attributes[this.attribute].value,
			};

			if (this.skill) {
				skill = {
					label: game.i18n.localize(`DNM.Skills.${this.skill.capitalize()}`),
					value: this.actor.system.skills[this.skill],
				};
			}
		}

		DnMRoller.roll({
			actor: this.actor,
			attribute,
			skill,
			item: this.item,
			numDice: this.numDice,
			complicationRange: this.complication,
			fixedTargetNumber: this.fixedTargetNumber,
			rollTitle: this.rollTitle,
			fixedFocus: this.fixedFocus,
		});

		this.close();
	}


	static async _setNumberOfDice(event, target) {
		dreams.debug("DicePromptV2::_setNumberOfDice");

		this.numDice = target.dataset.value
			? parseInt(target.dataset.value)
			: this.numDice;

		this.render({force: true});
	}


	async #onChange(event, form, formData) {
		dreams.debug("DicePromptV2::#onChange");

		this.attribute = formData.object.attribute
			? formData.object.attribute
			: this.attribute;

		this.skill = formData.object.skill
			? formData.object.skill
			: this.skill;

		this.fixedFocus = formData.object.fixedFocus
			? formData.object.fixedFocus
			: this.fixedFocus;

		this.fixedTargetNumber = formData.object.fixedTargetNumber
			? formData.object.fixedTargetNumber
			: this.fixedTargetNumber;

		this.complication = formData.object.complication
			? formData.object.complication
			: this.complication;
	}


	/** @override */
	async _prepareContext() {

		const context = {
			actor: this.actor,
			attribute: this.attribute,
			buttons: [{
				icon: "fas fa-dice-d20",
				cssClass: "dice-prompt-button",
				label: "DNM.Labels.DicePrompt.Roll",
				type: "submit",
			}],
			skill: this.skill,
			fixedTargetNumber: this.fixedTargetNumber,
			fixedFocus: this.fixedFocus,
			numDice: this.numDice,
			isGM: game.user.isGM,
			complication: this.complication,
		};

		let attributes = [];
		let skills = [];

		context.showAttributeSelectors =
			["character", "major_npc"].includes(this.actor?.type);

		if (context.showAttributeSelectors) {
			attributes = Object.entries(this.actor.system.attributes).map(([k, v]) => ({
				name: k,
				label: game.i18n.localize(`DNM.Attributes.${k.capitalize()}`),
				value: v.value,
			}));

			skills = Object.entries(this.actor.system.skills).map(([k, v]) => ({
				name: k,
				label: game.i18n.localize(`DNM.Skills.${k.capitalize()}`),
				value: v,
			}));
		}

		const diceStatuses = [];
		for (let i = 0; i < 5; i++) {
			diceStatuses.push({index: i + 1, active: i < this.numDice});
		}

		context.attributes = attributes;
		context.skills = skills;
		context.diceStatuses = diceStatuses;

		return context;
	}

}
