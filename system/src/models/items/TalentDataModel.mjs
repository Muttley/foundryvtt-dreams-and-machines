import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import ItemBaseDataModel from "../ItemBaseDataModel.mjs";

export default class TalentDataModel extends ItemBaseDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),

			archetype: new fields.DocumentUUIDField({
				blank: true,
				initial: "",
				nullable: false,
			}),
		};
	}
}
