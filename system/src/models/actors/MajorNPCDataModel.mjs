import BookSource from "../items/_types/BookSource.mjs";
import CharacterAttributes from "../_types/CharacterAttributes.mjs";
import Description from "../_types/Description.mjs";
import Skills from "../_types/Skills.mjs";
import Truths from "../_types/Truths.mjs";

export default class MajorNPCDataModel
	extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...CharacterAttributes(),
			...Description(),
			...Skills(),
			...Truths(),

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

		};
	}

}
