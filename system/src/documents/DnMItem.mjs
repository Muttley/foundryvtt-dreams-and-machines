/**
 * Shared base class for all Dreams and Machines item documents.
 */
export default class DnMItem extends Item {
	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);
		if (data.img === undefined) {
			let icon = `systems/dreams-and-machines/assets/icons/${data.type}.svg`;
			this.updateSource({ img: icon });
		}
	}
}
