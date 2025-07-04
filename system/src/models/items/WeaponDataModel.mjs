import BookSource from "./_types/BookSource.mjs";
import Damage from "./_types/Damage.mjs";
import Description from "../_types/Description.mjs";
import PhysicalItem from "./_types/PhysicalItem.mjs";
import WeaponQualities from "./_types/WeaponQualities.mjs";

export default class WeaponDataModel extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	get enabledQualities() {
		return this.qualities.filter(q => q.enabled);
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Damage(),
			...Description(),
			...PhysicalItem(),

			qualities: WeaponQualities(),

			weaponType: new fields.StringField({
				initial: Object.keys(CONFIG.DREAMS.WEAPON_TYPES)[0],
				choices: () => {
					return Object.keys(CONFIG.DREAMS.WEAPON_TYPES);
				},
				nullable: false,
			}),
		};
	}
}
