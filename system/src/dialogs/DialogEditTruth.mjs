export default class DialogEditTruth extends Dialog {

	constructor(dialogData = {}, options = {}) {
		super(dialogData, options);
	}


	static async createDialog({actorUuid, index = -1, truth = ""}) {
		let dialogData = {
			actorUuid,
			truth,
			index,
		};

		const html = await renderTemplate(
			"systems/dreams-and-machines/templates/dialogs/edit-truth.hbs",
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

						let truth = html.find(".truth").val();

						// Strip any leading/trailing spaces
						truth = truth.replace(/^\s+|\s+$/g, "");

						if (truth === "") return; // do nothing

						const actor = await fromUuid(actorUuid);

						const currentTruths = foundry.utils.duplicate(
							actor.system.truths
						) ?? [];

						if (index < 0) {
							// Append new truth
							currentTruths.push(truth);
						}
						else if (index <= currentTruths.length) {
							// Replace edited truth
							currentTruths[index] = truth;
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
