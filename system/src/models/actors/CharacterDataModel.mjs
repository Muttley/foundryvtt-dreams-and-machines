import Attributes from "../_types/Attributes.mjs";
import Goals from "../_types/Goals.mjs";
import Skills from "../_types/Skills.mjs";
import Truths from "../_types/Truths.mjs";

/**
 * Data Model representing a Player Character
 *
 * @mixes {Attributes}
 * @mixes {Goals}
 * @mixes {Skills}
 * @mixes {Traits}
 *
 * @property {string} attitude
 * @property {string} bond
 * @property {number} coin
 * @property {string} drive
 * @property {object} spirit
 * @property {number} spirit.value
 * @property {number} spirit.max
 * @property {number} supplyPoints
 * @property {number} techLevel
 */
export default class CharacterDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...Attributes(),
			...Goals(),
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
