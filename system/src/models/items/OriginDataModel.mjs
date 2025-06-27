import BasicAttributes from "./_types/BasicAttributes.mjs";
import BookSource from "./_types/BookSource.mjs";
import Configured from "./_types/Configured.mjs";
import Description from "../_types/Description.mjs";
import AttributeChoices from "./_types/AttributeChoices.mjs";
import SkillChoices from "./_types/SkillChoices.mjs";
import Skills from "../_types/Skills.mjs";
import SpecialAbilityChoices from "./_types/SpecialAbilityChoices.mjs";

export default class OriginDataModel extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...AttributeChoices(),
			...BasicAttributes(),
			...BookSource(),
			...Configured(),
			...Description(),
			...SkillChoices(),
			...Skills(),
			...SpecialAbilityChoices(),

			fixedSpecialAbilities: new fields.ArrayField(
				new fields.DocumentUUIDField({
					blank: true,
					initial: "",
					nullable: false,
				}),
				{
					initial: [],
					nullable: false,
				}
			),

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
				initial: 1,
				integer: true,
				min: 0,
				nullable: false,
			}),

		};
	}
}
