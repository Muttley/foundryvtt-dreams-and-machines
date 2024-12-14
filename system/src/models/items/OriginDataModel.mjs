import Attributes from "../_types/Attributes.mjs";
import Description from "../_types/Description.mjs";
import Skills from "../_types/Skills.mjs";
import SpecialAbilityChoices from "../_types/SpecialAbilityChoices.mjs";

/**
 * Data model representing an Origin that can be assigned to a character.
 *
 * @mixes ItemDescription
 *
 * @property {object} attributes Initial Attribute values provided by the Origin
 * @property {number} attributes.insight
 * @property {number} attributes.might
 * @property {number} attributes.quickness
 * @property {number} attributes.resolve
 * @property {object} skills Initial Skill values provided by the Origin
 * @property {number} skills.fight
 * @property {number} skills.move
 * @property {number} skills.operate
 * @property {number} skills.sneak
 * @property {number} skills.study
 * @property {number} skills.survive
 * @property {number} skills.talk
 * @property {number} spirit Spirit points provided by the Origin
 * @property {number} supplyPoints Initial Supply Points provided by the origin
 * @property {number} techLevel Starting Tech Level provided by the Origin
 */
export default class OriginDataModel extends foundry.abstract.TypeDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...Attributes(),
			...Skills(),
			...Description(),
			...SpecialAbilityChoices(),

			fixedSpecialAbilities: new fields.ArrayField(
				new fields.DocumentUUIDField({
					initial: "",
					nullable: false,
				}),
				{
					initial: [],
					nullable: false,
				}
			),

			spirit: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),

			supplyPoints: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),

			techLevel: new fields.NumberField({
				initial: 1,
				integer: true,
				min: 0,
				nullable: false,
			}),

		};
	}
}
