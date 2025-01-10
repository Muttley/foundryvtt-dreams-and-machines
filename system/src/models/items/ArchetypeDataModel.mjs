import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import Skills from "../_types/Skills.mjs";

export default class ArchetypeDataModel
	extends foundry.abstract.TypeDataModel {

	/**
	 * Utility method to check that there is at least one piece of starting
	 * gear added.
	 */
	get hasStartingGear() {
		return this.startingGear.length > 0;
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),
			...Skills(),

			goal: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

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

			startingGear: new fields.ArrayField(
				new fields.StringField({
					initial: "",
					nullable: false,
				}),
				{
					initial: [],
					nullable: false,
				}
			),

			startingCoin: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),
		};
	}
}
