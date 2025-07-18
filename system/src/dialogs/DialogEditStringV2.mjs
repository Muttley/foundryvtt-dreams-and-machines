export default class DialogEditStringV2
	extends foundry.applications.api.DialogV2 {

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

		const html = await foundry.applications.handlebars.renderTemplate(
			"systems/dreams-and-machines/templates/dialog/edit-string.hbs",
			dialogData
		);

		const label = index < 0
			? game.i18n.localize("DNM.Labels.Dialog.Add")
			: game.i18n.localize("DNM.Labels.Dialog.Save");

		const dialog = new DialogEditStringV2({
			window: {
				title,
			},
			content: html,
			buttons: [
				{
					action: "edit",
					icon: '<i class="fas fa-floppy-disk"></i>',
					label,
					callback: async (event, button, dialog) => {
						const actorUuid = button.form.elements.actorUuid.value ?? "";
						const index = Number(button.form.elements.index.value ?? -1);

						let value = button.form.elements.value.value ?? "";

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
							dreams.error("Truth index out of range");
						}

						currentValues.sort((a, b) => a.localeCompare(b));

						const updates = {};
						updates[fieldKey] = currentValues;

						await actor.update(updates);
					},
				},
			],
			submit: () => {},
		});

		dialog.render({force: true});
	}
}
