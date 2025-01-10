import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import ItemQualities from "./_types/ItemQualities.mjs";

export default class MajorNPCActionDataModel extends foundry.abstract.TypeDataModel {
	/**
	 * Utility property to get all weapon qualities in one combined array.
	 *
	 * @return ItemQuality[]
	 */
	get weaponQualities() {
		return [...this.weapon.damageQualities, ...this.weapon.qualities];
	}

	/**
	 * Allow chat templates to treat this equivalent to an Equipment item.
	 */
	get isWeapon() {
		return true;
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),

			skillTest: new fields.SchemaField({
				attribute: new fields.StringField({
					initial: "-",
					nullable: false,
					choices: [
						"-",
						"might",
						"quickness",
						"insight",
						"resolve",
					],
				}),

				skill: new fields.StringField({
					initial: "-",
					nullable: false,
					choices: [
						"-",
						"fight",
						"move",
						"operate",
						"sneak",
						"study",
						"survive",
						"talk",
					],
				}),
			}),

			weapon: new fields.SchemaField({
				name: new fields.StringField({
					initial: "",
					nullable: false,
				}),

				type: new fields.StringField({
					initial: "Melee",
					choices: ["Melee", "Ranged"],
					nullable: false,
				}),

				qualities: ItemQualities(),

				damageQualities: ItemQualities(),
			}),
		};
	}
}
