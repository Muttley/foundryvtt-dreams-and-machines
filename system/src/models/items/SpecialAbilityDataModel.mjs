import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import ItemBaseDataModel from "../ItemBaseDataModel.mjs";

export default class SpecialAbilityDataModel
	extends ItemBaseDataModel {

	static defineSchema() {
		return {
			...BookSource(),
			...Description(),
		};
	}
}
