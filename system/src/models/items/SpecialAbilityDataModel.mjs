import Description from "../_types/Description.mjs";

/**
 * Data model representing Special Abilities.
 *
 * @mixes ItemDescription
 *
 * @property {string} archetype Archetype the talent is associated with.
 */
export default class SpecialAbilityDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		// const fields = foundry.data.fields;

		return {
			...Description(),
		};
	}
}
