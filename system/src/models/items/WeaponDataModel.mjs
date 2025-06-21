import BookSource from "./_types/BookSource.mjs";
import Damage from "./_types/Damage.mjs";
import Description from "../_types/Description.mjs";
import PhysicalItem from "./_types/PhysicalItem.mjs";
import WeaponQualities from "./_types/WeaponQualities.mjs";

export default class WeaponDataModel extends foundry.abstract.TypeDataModel {

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
				initial: Object.keys(CONFIG.DREAMS.ITEM_CATEGORIES)[0],
				choices: () => {
					return Object.keys(CONFIG.DREAMS.ITEM_CATEGORIES);
				},
				nullable: false,
			}),
		};
	}
}
