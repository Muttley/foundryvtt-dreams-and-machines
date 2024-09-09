export default class DialogEditTruth extends Dialog {

	constructor(dialogData = {}, options = {}) {
		super(dialogData, options);
	}


	static async createDialog({actorUuid, index = -1, value = ""}) {
		let dialogData = {
			actorUuid,
			index,
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
			? game.i18n.localize("DNM.Labels.Actor.AddTruth")
			: game.i18n.localize("DNM.Labels.Actor.EditTruth");

		const dialog = new DialogEditTruth({
			title,
			content: html,
			buttons: {
				edit: {
					icon: '<i class="fas fa-floppy-disk"></i>',
					label,
					callback: async html => {
						const actorUuid = html.find(".actorUuid").val() ?? "";
						const index = parseInt(html.find(".index").val()) ?? -1;

						let value = html.find(".value").val();

						// Strip any leading/trailing spaces
						value = value.replace(/^\s+|\s+$/g, "");

						if (value === "") return; // do nothing

						const actor = await fromUuid(actorUuid);

						const currentTruths = foundry.utils.duplicate(
							actor.system.truths
						) ?? [];

						if (index < 0) {
							// Append new truth
							currentTruths.push(value);
						}
						else if (index <= currentTruths.length) {
							// Replace edited truth
							currentTruths[index] = value;
						}
						else {
							dreams.logger.error("Truth index out of range");
						}

						currentTruths.sort((a, b) => a.localeCompare(b));
						actor.update({"system.truths": currentTruths});
					},
				},
			},
			default: "edit",
			close: () => { },
		});

		dialog.render(true);
	}
}
