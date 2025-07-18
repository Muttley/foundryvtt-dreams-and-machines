import ArmorQualities from "./_types/ArmorQualities.mjs";
import BookSource from "./_types/BookSource.mjs";
import Damage from "./_types/Damage.mjs";
import Description from "../_types/Description.mjs";
import PhysicalItem from "./_types/PhysicalItem.mjs";
import Protection from "../_types/Protection.mjs";

export default class ArmorDataModel extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	static defineSchema() {
		return {
			...BookSource(),
			...Damage(),
			...Description(),
			...PhysicalItem(),
			...Protection(),

			qualities: ArmorQualities(),
		};
	}
}
