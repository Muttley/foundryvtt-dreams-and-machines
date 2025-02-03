import CharacterAttributes from "../_types/CharacterAttributes.mjs";
import Skills from "../_types/Skills.mjs";
import Truths from "../_types/Truths.mjs";

export default class MajorNPCDataModel
	extends foundry.abstract.TypeDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...CharacterAttributes(),
			...Skills(),
			...Truths(),

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
