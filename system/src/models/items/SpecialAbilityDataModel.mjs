import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";

export default class SpecialAbilityDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		// const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),
		};
	}
}
