import BookSource from "./_types/BookSource.mjs";
import Damage from "./_types/Damage.mjs";
import Description from "../_types/Description.mjs";
import ItemBaseDataModel from "../ItemBaseDataModel.mjs";
import WeaponQualities from "./_types/WeaponQualities.mjs";

export default class MajorNPCActionDataModel extends ItemBaseDataModel {

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

			roll: new fields.SchemaField({
				min: new fields.NumberField({
					initial: 1,
					integer: true,
					nullable: false,
					min: 1,
				}),
				max: new fields.NumberField({
					initial: 1,
					integer: true,
					nullable: false,
					min: 1,
				}),
			}),

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
