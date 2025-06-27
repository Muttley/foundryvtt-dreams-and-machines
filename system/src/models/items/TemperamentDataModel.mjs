import AttributeSingleChoice from "./_types/AttributeSingleChoice.mjs";
import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import SkillBonusChoices from "./_types/SkillBonusChoices.mjs";

export default class TemperamentDataModel extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			attitude: this.attitude,
			description: this.description,
			drive: this.drive,
			exhaustion: this.exhaustion,
		};
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...AttributeSingleChoice(),
			...BookSource(),
			...Description(),
			...SkillBonusChoices(),

			attitude: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			bonds: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			drive: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			exhaustion: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			exhaustionType: new fields.StringField({
				initial: "Despairing",
				choices: Object.keys(CONFIG.DREAMS.EXHAUSTION),
				nullable: false,
			}),

		};
	}
}
