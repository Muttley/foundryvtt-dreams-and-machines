import Attributes from "../_types/Attributes.mjs";
import Description from "../_types/Description.mjs";
import Skills from "../_types/Skills.mjs";

/**
 * Data model representing an Origin that can be assigned to a character.
 *
 * @mixes ItemDescription
 *
 * @property {object} attributes Initial for the four attributes provided by the Origin.
 * @property {number} attributes.might
 * @property {number} attributes.quickness
 * @property {number} attributes.insight
 * @property {number} attributes.resolve
 * @property {number} techLevel Starting tech level provided by the Origin
 * @property {number} spirit Spirit points provided by the Origin
 * @property {number} supplyPoints Starting supply points provided by the origin
 * @property {object} benefit Benefit provided by the origin
 * @property {string} benefit.name
 * @property {string} benefit.description
 */
export default class OriginDataModel extends foundry.abstract.TypeDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...Attributes(),
			...Skills(),
			...Description(),

			techLevel: new fields.NumberField({
				initial: 1,
				integer: true,
				min: 0,
				nullable: false,
			}),

			spirit: new fields.NumberField({
				initial: 1,
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

			benefit: new fields.SchemaField({
				name: new fields.StringField({
					initial: "Origin Benefit Name",
					nullable: false,
				}),

				description: new fields.HTMLField({
					initial: "Origin Benefit Description",
					nullable: false,
				}),
			}),
		};
	}
}
