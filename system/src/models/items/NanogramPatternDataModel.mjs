import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import ItemBaseDataModel from "../ItemBaseDataModel.mjs";

export default class NanogramPatternDataModel extends ItemBaseDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),

			attribute: new fields.StringField({
				blank: false,
				initial: Object.keys(CONFIG.DREAMS.ATTRIBUTES)[0],
				choices: () => {
					return Object.keys(CONFIG.DREAMS.ATTRIBUTES);
				},
				nullable: false,
			}),

			skill: new fields.StringField({
				blank: false,
				initial: Object.keys(CONFIG.DREAMS.SKILLS)[0],
				choices: () => {
					return Object.keys(CONFIG.DREAMS.SKILLS);
				},
				nullable: false,
			}),

			difficulty: new fields.NumberField({
				initial: 1,
				integer: true,
				min: 0,
				nullable: true,
			}),
		};
	}
}
