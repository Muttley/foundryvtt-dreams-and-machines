import Attributes from "../_shared/Attributes.mjs";
import Skills from "../_shared/Skills.mjs";
import Truths from "../_shared/Truths.mjs";

/**
 * Data Model representing a Player Character
 *
 * @mixes {Attributes}
 * @mixes {Skills}
 * @mixes {Traits}
 *
 * @property {string} bond
 * @property {number} coin
 * @property {number} techLevel
 * @property {object} spirit
 * @property {number} spirit.value
 * @property {number} spirit.max
 * @property {number} supplyPoints
 * @property {string} goal
 * @property {string} attitude
 * @property {string} drive
 */
export default class CharacterDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...Attributes(),
			...Skills(),
			...Truths(),

			attitude: new fields.StringField({
				initial: "",
				nullable: false,
			}),

			bond: new fields.StringField({
				initial: "",
				nullable: false,
			}),

			coin: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
			}),

			drive: new fields.StringField({
				initial: "",
				nullable: false,
			}),

			goal: new fields.StringField({
				initial: "",
				nullable: false,
			}),

			growth: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
			}),

			spirit: new fields.SchemaField({
				value: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
				max: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
			}),

			supplyPoints: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
			}),

			techLevel: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
				min: 0,
			}),
		};
	}
}
