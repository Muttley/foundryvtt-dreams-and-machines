import CharacterAttributes from "../_types/CharacterAttributes.mjs";
import Bonds from "../_types/Bonds.mjs";
import Goals from "../_types/Goals.mjs";
import Harms from "../_types/Harms.mjs";
import Skills from "../_types/Skills.mjs";
import Truths from "../_types/Truths.mjs";

export default class CharacterDataModel
	extends foundry.abstract.TypeDataModel {

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...CharacterAttributes(),
			...Goals(),
			...Skills(),
			...Truths(),
			...Bonds(),
			...Harms(),

			coin: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
			}),

			growth: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
			}),

			spirit: new fields.SchemaField({
				value: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
				max: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
			}),

			supplyPoints: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
			}),

			techLevel: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
				min: 0,
			}),
		};
	}

}
