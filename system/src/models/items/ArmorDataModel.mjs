import BookSource from "./_types/BookSource.mjs";
import Damage from "./_types/Damage.mjs";
import Description from "../_types/Description.mjs";
import PhysicalItem from "./_types/PhysicalItem.mjs";
import ArmorQualities from "./_types/ArmorQualities.mjs";

export default class ArmorDataModel extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Damage(),
			...Description(),
			...PhysicalItem(),

			protection: new fields.SchemaField({
				value: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
				breaker: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
			}),

			qualities: ArmorQualities(),

		};
	}
}
