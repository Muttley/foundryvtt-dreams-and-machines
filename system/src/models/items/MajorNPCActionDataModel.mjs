import BookSource from "./_types/BookSource.mjs";
import Damage from "./_types/Damage.mjs";
import Description from "../_types/Description.mjs";
import WeaponQualities from "./_types/WeaponQualities.mjs";

export default class MajorNPCActionDataModel extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	get hasSkillTest() {
		return this.skillTest.attribute !== "—" && this.skillTest.skill !== "—";
	}

	get isWeapon() {
		return this.hasSkillTest && this.weapon.name !== "" && this.weapon.damage.length > 0;
	}

	static defineSchema() {
		const fields = foundry.data.fields;

		return {
			...BookSource(),
			...Description(),

			skillTest: new fields.SchemaField({
				attribute: new fields.StringField({
					initial: "—",
					nullable: false,
					choices: ["—", ...Object.keys(CONFIG.DREAMS.ATTRIBUTES)],
				}),

				skill: new fields.StringField({
					initial: "—",
					nullable: false,
					choices: ["—", ...Object.keys(CONFIG.DREAMS.SKILLS)],
				}),
			}),

			weapon: new fields.SchemaField({
				name: new fields.StringField({
					initial: "",
					nullable: false,
				}),

				weaponType: new fields.StringField({
					initial: Object.keys(CONFIG.DREAMS.NPC_WEAPON_TYPES)[0],
					choices: () => {
						return Object.keys(CONFIG.DREAMS.NPC_WEAPON_TYPES);
					},
					nullable: false,
				}),

				qualities: WeaponQualities(),

				...Damage(),
			}),
		};
	}
}
