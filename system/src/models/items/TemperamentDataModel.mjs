import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";

export default class TemperamentDataModel extends foundry.abstract.TypeDataModel {
	/** @type {{ [key: string]: string}} */
	get enrichedFields() {
		return {
			enrichedSpiritEffect: this.spiritEffect,
			enrichedExhaustionEffect: this.exhaustionEffect,
		};
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),

			spiritEffect: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			exhaustionEffect: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			exhaustionType: new fields.StringField({
				initial: "Despairing",
				choices: Object.keys(CONFIG.DREAMS.EXHAUSTION),
				nullable: false,
			}),
		};
	}
}
