export default class DnMItem extends Item {

	getEnabledQualities() {
		const enabledQualities = [];
		for (const key of Object.keys(this.system.qualities)) {
			const quality = this.system.qualities[key];
			if (quality.enabled) {
				quality.name = CONFIG.DREAMS.WEAPON_QUALITIES[key];
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
}
