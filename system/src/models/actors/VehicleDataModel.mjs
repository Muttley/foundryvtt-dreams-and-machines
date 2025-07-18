import BookSource from "../items/_types/BookSource.mjs";
import Cover from "../_types/Cover.mjs";
import Description from "../_types/Description.mjs";
import Protection from "../_types/Protection.mjs";
import Truths from "../_types/Truths.mjs";
import VehicleQualities from "../_types/VehicleQualities.mjs";

export default class VehicleDataModel
	extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	get coverHasValue() {
		return this.cover.type.endsWith("_x");
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Cover(),
			...Description(),
			...Protection(),
			...Truths(),

			coin: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),

			passengers: new fields.NumberField({
				initial: 1,
				integer: true,
				min: 0,
				nullable: false,
			}),

			qualities: VehicleQualities(),

			rarity: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),

			scale: new fields.NumberField({
				initial: 0,
				integer: true,
				min: 0,
				nullable: false,
			}),

			speed: new fields.NumberField({
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
