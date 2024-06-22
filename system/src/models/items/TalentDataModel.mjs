import Description from "../_shared/Description.mjs";

/**
 * Data model representing Talents.
 *
 * @mixes ItemDescription
 *
 * @property {string} archetype Archetype the talent is associated with.
 */
export default class TalentDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...Description(),

			archetype: new fields.StringField({
				initial: "",
				nullable: false,
			}),
		};
	}
}
