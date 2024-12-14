export default class DialogEditString extends Dialog {

	constructor(dialogData = {}, options = {}) {
		super(dialogData, options);
	}

	static async createDialog({
		actorUuid,
		title,
		fieldKey,
		currentValues,
		index = -1,
		value = "",
	}) {
		let dialogData = {
			actorUuid,
			fieldKey,
			index,
			value,
			currentValues,
		};

		const html = await renderTemplate(
			"systems/dreams-and-machines/templates/dialog/edit-string.hbs",
			dialogData
		);

		const label = index < 0
			? game.i18n.localize("DNM.Labels.Dialog.Add")
			: game.i18n.localize("DNM.Labels.Dialog.Save");

		const dialog = new DialogEditString({
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

						if (index < 0) {
							// Append new truth
							currentValues.push(value);
						}
						else if (index <= currentValues.length) {
							// Replace edited truth
							currentValues[index] = value;
						}
						else {
							dreams.logger.error("Truth index out of range");
						}

						currentValues.sort((a, b) => a.localeCompare(b));

						const updates = {};
						updates[fieldKey] = currentValues;

						await actor.update(updates);
					},
				},
			},
			default: "edit",
			close: () => { },
		});

		dialog.render(true);
	}
}
