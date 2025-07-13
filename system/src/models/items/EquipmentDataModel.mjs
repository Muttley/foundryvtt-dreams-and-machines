import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import PhysicalItem from "./_types/PhysicalItem.mjs";

export default class EquipmentDataModel
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
			...PhysicalItem(),
		};
	}
}
