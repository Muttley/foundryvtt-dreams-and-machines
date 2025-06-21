import AttributeBonusChoices from "./_types/AttributeBonusChoices.mjs";
import BookSource from "./_types/BookSource.mjs";
import Configured from "./_types/Configured.mjs";
import Description from "../_types/Description.mjs";
import SkillBonusChoices from "./_types/SkillBonusChoices.mjs";

export default class ArchetypeDataModel
	extends foundry.abstract.TypeDataModel {

	/**
	 * Utility method to check that there is at least one piece of starting
	 * gear added.
	 */
	get hasStartingGear() {
		return this.startingGear.length > 0;
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...AttributeBonusChoices(),
			...BookSource(),
			...Configured(),
			...Description(),
			...SkillBonusChoices(),

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

			startingGear: new fields.ArrayField(
				new fields.StringField({
					initial: "",
					nullable: false,
				}),
				{
					initial: [],
					nullable: false,
				}
			),

			techLevel: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),
		};
	}
}
