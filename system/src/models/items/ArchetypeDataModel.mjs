import AttributeBonusChoices from "./_types/AttributeBonusChoices.mjs";
import BookSource from "./_types/BookSource.mjs";
import Configured from "./_types/Configured.mjs";
import Description from "../_types/Description.mjs";
import SkillBonusChoices from "./_types/SkillBonusChoices.mjs";

export default class ArchetypeDataModel
	extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
			equipment: this.equipment,
			goals: this.goals,
		};
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...AttributeBonusChoices(),
			...BookSource(),
			...Configured(),
			...Description(),
			...SkillBonusChoices(),

			equipment: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			goals: new fields.HTMLField({
				initial: "",
				nullable: false,
			}),

			spirit: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),

			supplyPoints: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),

			techLevel: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),
		};
	}
}
