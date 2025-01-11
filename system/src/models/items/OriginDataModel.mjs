import BasicAttributes from "./_types/BasicAttributes.mjs";
import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import OriginAttributeChoices from "./_types/OriginAttributeChoices.mjs";
import OriginSkillChoices from "./_types/OriginSkillChoices.mjs";
import Skills from "../_types/Skills.mjs";
import SpecialAbilityChoices from "./_types/SpecialAbilityChoices.mjs";

export default class OriginDataModel extends foundry.abstract.TypeDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BasicAttributes(),
			...BookSource(),
			...Description(),
			...OriginAttributeChoices(),
			...OriginSkillChoices(),
			...Skills(),
			...SpecialAbilityChoices(),

			fixedSpecialAbilities: new fields.ArrayField(
				new fields.DocumentUUIDField({
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
