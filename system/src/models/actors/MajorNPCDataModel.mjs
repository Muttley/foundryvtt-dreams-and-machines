import CharacterAttributes from "../_types/CharacterAttributes.mjs";
import Skills from "../_types/Skills.mjs";
import Traits from "../_types/Traits.mjs";

export default class ManorNPCDataModel
	extends foundry.abstract.TypeDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...CharacterAttributes(),
			...Skills(),
			...Traits(),

			threat: new fields.SchemaField({
				current: new fields.NumberField({
					initial: 0,
					integer: true,
					nullable: false,
					min: 0,
				}),

				max: new fields.NumberField({
					initial: 0,
					integer: true,
					nullable: false,
					min: 0,
				}),
			}),

			injuries: new fields.SchemaField({
				current: new fields.NumberField({
					initial: 0,
					integer: true,
					nullable: false,
					min: 0,
				}),

				max: new fields.NumberField({
					initial: 0,
					integer: true,
					nullable: false,
					min: 0,
				}),
			}),

			notes: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			description: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),
		};
	}

}
