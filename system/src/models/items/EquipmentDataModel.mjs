import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import ItemQualities from "./_types/ItemQualities.mjs";

export default class EquipmentDataModel
	extends foundry.abstract.TypeDataModel {

	/**
	 * Utility for checking for the presence of qualities within Handlebars
	 * templates.
	 *
	 * @returns {boolean} Whether the Item has any Qualities in its list.
	 */
	get hasQualities() {
		return this.allQualities.length > 0;
	}

	/**
	 * Template utility for fetching the last index for damage qualities.
	 */
	get lastDamageQualityIndex() {
		return this.weapon.damageQualities.length - 1;
	}

	/**
	 * Utility for fetching all qualities in a single list.
	 *
	 * @returns {ItemQuality[]}
	 */
	get allQualities() {
		let protection = [];

		if (this.hasProtection) {
			protection = [
				{
					label: game.i18n.localize("DNM.Labels.Protection"),
					rating: this.protection.value,
				},
			];
		}

		return [...this.weapon.qualities, ...protection, ...this.qualities];
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),

			techLevel: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
			}),

			value: new fields.NumberField({
				initial: 0,
				integer: true,
				nullable: false,
			}),

			rarity: new fields.NumberField({
				initial: 1,
				integer: true,
				min: 0,
				nullable: false,
			}),

			supplyPointCost: new fields.StringField({
				initial: "-",
				nullable: false,
			}),

			category: new fields.StringField({
				initial: "",
				nullable: false,
			}),

			quantity: new fields.NumberField({
				initial: 1,
				integer: true,
				min: 0,
				nullable: false,
			}),

			qualities: ItemQualities(),

			hasProtection: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),

			protection: new fields.SchemaField({
				value: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
				breaker: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
			}),

			isWeapon: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),

			weapon: new fields.SchemaField({
				type: new fields.StringField({
					initial: "Melee",
					choices: ["Melee", "Ranged", "MeleeRanged"],
					nullable: false,
				}),

				qualities: ItemQualities(),

				damageQualities: ItemQualities(),
			}),

			isGLIF: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),

			GLIF: new fields.SchemaField({
				complexity: new fields.NumberField({
					initial: 1,
					integer: true,
					min: 0,
					nullable: false,
				}),
			}),
		};
	}
}
