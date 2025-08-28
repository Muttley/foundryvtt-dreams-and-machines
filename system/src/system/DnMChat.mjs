const renderTemplate = foundry.applications.handlebars.renderTemplate;

export default class DnMChat {

	static async _renderChatMessage(
		actor,
		data,
		template,
		mode
	) {
		const html = await renderTemplate(template, data);

		if (!mode) {
			mode = game.settings.get("core", "rollMode");
		}

		const chatData = {
			content: html,
			flags: { "core.canPopout": true },
			flavor: data.flavor ?? undefined,
			rollMode: mode,
			speaker: ChatMessage.getSpeaker({
				actor: actor,
			}),
			type: data.type ?? CONST.CHAT_MESSAGE_STYLES.OTHER,
			user: game.user.id,
		};

		ChatMessage.applyRollMode(chatData, mode);

		ChatMessage.create(chatData);
	}


	static async renderItemCardMessage(actor, data, template, mode) {
		this._renderChatMessage(actor, data, template, mode);
	}


	static async renderRollMessage(actor, data, mode) {
		this._renderChatMessage(actor, data, templatePath("chat/dice-roll"), mode);
	}

}
