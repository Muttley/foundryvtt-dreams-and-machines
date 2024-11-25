import DnMActorSheet from "../DnMActorSheet.mjs";

export default class MajorNPCSheet extends DnMActorSheet {

	async getData(options = {}) {
		const actions = await Promise.all(
			this.actor.items
				.filter(i => i.type === "majorNPCAction")
				.map(async i => {
					let enrichedDescription = undefined;

					if (i.system.description) {
						enrichedDescription = await TextEditor.enrichHTML(
							i.system.description
						);
					}

					if (i.system.skillTest.attribute !== "-") {
						i.system.skillTest.tn = this.system.attributes[
							i.system.skillTest.attribute
						].value;
					}

					if (i.system.skillTest.skill !== "-") {
						i.system.skillTest.focus = this.system.skills[
							i.system.skillTest.skill
						];
					}

					i.enrichedDescription = enrichedDescription;

					return i;
				})
		);

		const abilities = await Promise.all(
			this.actor.items
				.filter(i => i.type === "specialAbility")
				.map(async i => {
					i.enrichedDescription = await TextEditor.enrichHTML(
						i.system.description, { async: true }
					);
					return i;
				})
		);

		return {
			...super.getData(options),
			enrichedDescription: await TextEditor.enrichHTML(
				this.system.description, { async: true }
			),
			enrichedNotes: await TextEditor.enrichHTML(this.system.notes, { async: true }),
			actions,
			abilities,
		};
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find("[data-action=roll-action]").on("click", this.rollAction.bind(this));
	}


	rollAction(event) {
		const uuid = $(event.currentTarget).data("uuid");
		if (!uuid) {
			return;
		}

		const action = this.actor.items.find(i => i.uuid === uuid);
		if (!action) {
			return;
		}

		const actionSystem = action.system;

		dreams.apps.DicePrompt.promptForRoll({
			actor: this.actor,
			attribute: actionSystem.skillTest.attribute,
			skill: actionSystem.skillTest.skill,
			item: action,
		});
	}
}
