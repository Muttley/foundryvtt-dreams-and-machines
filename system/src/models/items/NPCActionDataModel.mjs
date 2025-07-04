import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";

export default class NPCActionDataModel
	extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	static defineSchema() {
		return {
			...BookSource(),
			...Description(),
		};
	}
}
