/**
 * Shared base class for all Dreams and Machines actor documents.
 *
 * @property {EmbeddedCollection} items
 * @property {object} system
 * @property {string} type
 */
export default class DnMActor extends Actor {

	async _preCreate(data, options, user) {
		await super._preCreate(data, options, user);

		// Set some Token defaults
		//
		const prototypeToken = {
			actorLink: false,
			disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
			name: data.name, // Set token name to actor name
			sight: {
				enabled: true,
			},
			texture: foundry.utils.duplicate(this.prototypeToken.texture),
		};

		if (["character", "majorNPC"].includes(this.type)) {
			prototypeToken.actorLink = true;
		}

		if (this.type === "character") {
			prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
		}

		const update = {prototypeToken};
		if (!data.img) {
			const image = `systems/dreams-and-machines/assets/icons/${data.type}.svg`;
			const token = `systems/dreams-and-machines/assets/tokens/${data.type}.webp`;

			update.img = image;
			update.prototypeToken.texture = {
				src: token,
			};
		}

		await this.updateSource(update);
	}

}
