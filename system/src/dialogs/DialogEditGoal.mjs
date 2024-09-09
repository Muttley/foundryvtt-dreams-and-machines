export default class DialogEditGoal extends Dialog {

	constructor(dialogData = {}, options = {}) {
		super(dialogData, options);
	}


	static async createDialog({
		actorUuid,
		index = -1,
		type = "shortTerm",
		value = "",
	}) {
		let dialogData = {
			actorUuid,
			index,
			type,
			value,
		};

		const html = await renderTemplate(
			"systems/dreams-and-machines/templates/dialogs/edit-string.hbs",
			dialogData
		);

		const label = index < 0
			? game.i18n.localize("DNM.Labels.Dialog.Add")
			: game.i18n.localize("DNM.Labels.Dialog.Save");

		const title = index < 0
			? game.i18n.localize("DNM.Labels.Actor.AddGoal")
			: game.i18n.localize("DNM.Labels.Actor.EditGoal");

		const dialog = new DialogEditGoal({
			title,
			content: html,
			buttons: {
				edit: {
					icon: '<i class="fas fa-floppy-disk"></i>',
					label,
					callback: async html => {
						const actorUuid = html.find(".actorUuid").val() ?? "";
						const type = html.find(".type").val() ?? "shortTerm";
						const index = parseInt(html.find(".index").val()) ?? -1;

						let value = html.find(".value").val();

						// Strip any leading/trailing spaces
						value = value.replace(/^\s+|\s+$/g, "");

						if (value === "") return; // do nothing

						const actor = await fromUuid(actorUuid);

						const currentGoals = foundry.utils.duplicate(
							actor.system.goals[type]
						) ?? [];

						if (index < 0) {
							// Append new truth
							currentGoals.push(value);
						}
						else if (index <= currentGoals.length) {
							// Replace edited truth
							currentGoals[index] = value;
						}
						else {
							dreams.logger.error("Goal index out of range");
						}

						currentGoals.sort((a, b) => a.localeCompare(b));

						const updateData = {};
						updateData[`system.goals.${type}`] = currentGoals;

						actor.update(updateData);
					},
				},
			},
			default: "edit",
			close: () => { },
		});

		dialog.render(true);
	}
}
