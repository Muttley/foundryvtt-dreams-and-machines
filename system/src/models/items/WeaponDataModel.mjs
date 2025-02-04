import BookSource from "./_types/BookSource.mjs";
import Description from "../_types/Description.mjs";
import Qualities from "./_types/Qualities.mjs";
import PhysicalItem from "./_types/PhysicalItem.mjs";

export default class WeaponDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),
			...PhysicalItem(),

			damageQualities: Qualities(),

			weaponType: new fields.StringField({
				initial: "Melee",
				choices: ["Melee", "Ranged", "MeleeRanged"],
				nullable: false,
			}),
		};
	}
}
