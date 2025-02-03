import BookSource from "../items/_types/BookSource.mjs";
import Description from "../_types/Description.mjs";

export default class NPCDataModel
	extends foundry.abstract.TypeDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),

			truth: new fields.StringField({
				initial: "Truth",
				nullable: false,
			}),

			mainAttribute: new fields.SchemaField({
				attribute: new fields.NumberField({
					initial: 8,
					integer: true,
					min: 0,
					nullable: false,
				}),
				skill: new fields.NumberField({
					initial: 1,
					integer: true,
					min: 0,
					nullable: false,
				}),
			}),

			defaultAttribute: new fields.SchemaField({
				attribute: new fields.NumberField({
					initial: 8,
					integer: true,
					min: 0,
					nullable: false,
				}),
				skill: new fields.NumberField({
					initial: 1,
					integer: true,
					min: 0,
					nullable: false,
				}),
			}),

			specialActions: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

		};
	}

}
