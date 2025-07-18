import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";

export default class GLIFDataModel extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),

			complexity: new fields.NumberField({
				initial: 1,
				integer: true,
				min: 0,
				nullable: false,
			}),
		};
	}
}
