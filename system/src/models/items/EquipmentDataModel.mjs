import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import ItemBaseDataModel from "../ItemBaseDataModel.mjs";
import PhysicalItem from "./_types/PhysicalItem.mjs";

export default class EquipmentDataModel
	extends ItemBaseDataModel {

	static defineSchema() {
		return {
			...BookSource(),
			...Description(),
			...PhysicalItem(),
		};
	}
}
