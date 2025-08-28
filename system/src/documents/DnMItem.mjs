export default class DnMItem extends Item {

	get chatTemplate() {
		switch (this.type) {
			case "archetype":
			case "armor":
			case "equipment":
			case "glif":
			case "major_npc_action":
			case "nanogram_pattern":
			case "npc_action":
			case "origin":
			case "special_ability":
			case "talent":
			case "temperament":
			case "weapon":
			default:
				return templatePath("chat/item");
		}
	}


	getEnabledQualities() {
		const enabledQualities = [];
		const qualitiesLut = this.type === "armor"
			? CONFIG.DREAMS.ARMOR_QUALITIES
			: CONFIG.DREAMS.WEAPON_QUALITIES;

		const qualities = this.type === "major_npc_action"
			? this.system.weapon.qualities
			: this.system.qualities;

		for (const key of Object.keys(qualities)) {
			const quality = qualities[key];
			if (quality.enabled) {
				quality.name = qualitiesLut[key];
				quality.key = key;

				enabledQualities.push(quality);
			}
		}
		return enabledQualities;
	}


	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		if (data.img === undefined) {
			const icon = `systems/dreams-and-machines/assets/icons/${data.type}.svg`;
			this.updateSource({ img: icon });
		}
	}


	async sendToChat() {
		const data = foundry.utils.duplicate(this);
		delete data.type;

		dreams.chat.renderItemCardMessage(this.actor, data, this.chatTemplate);
	}


	async triggerMajorNpcActionRoll() {
		if (this.type !== "major_npc_action") return;

		if (this.system.hasSkillTest) {
			const rollData = {
				actor: this.actor,
				fixedFocus: undefined,
				fixedTargetNumber: undefined,
				attribute: this.system.skillTest.attribute,
				skill: this.system.skillTest.skill,
				item: this.system.isWeapon ? this : undefined,
				rollTitle: this.name,
			};

			if (this.system.isWeapon) {
				rollData.item.enabledQualities = this.getEnabledQualities();
			}

			await dreams.app.DicePromptV2.promptForRoll(rollData);
		}
	}
}
