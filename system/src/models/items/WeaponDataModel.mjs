import BookSource from "./_types/BookSource.mjs";
import Damage from "./_types/Damage.mjs";
import Description from "../_types/Description.mjs";
import PhysicalItem from "./_types/PhysicalItem.mjs";
import WeaponQualities from "./_types/WeaponQualities.mjs";

export default class WeaponDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),
			...PhysicalItem(),

			damage: new fields.ArrayField(
				...Damage(),
				{
					initial: [],
					nullable: false,
				}
			),

			// damageQualities: Qualities(),
			qualities: WeaponQualities(),

			weaponType: new fields.StringField({
				initial: "Melee",
				choices: ["Melee", "Ranged", "MeleeRanged"],
				nullable: false,
			}),
		};
	}
}
