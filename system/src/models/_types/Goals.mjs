/**
 * @typedef {object} CharacterGoals
 *
 * @property {string[]} longTerm
 * @property {string[]} shortTerm
 */

const fields = foundry.data.fields;

/**
 * Data model template providing Goals for Actors.
 *
 * @mixin
 */
const Goals = () => ({
	goals: new fields.SchemaField({
		longTerm: new fields.ArrayField(
			new fields.StringField({
				initial: "",
				nullable: false,
			}),
			{
				initial: [],
				nullable: false,
			}
		),
		shortTerm: new fields.ArrayField(
			new fields.StringField({
				initial: "",
				nullable: false,
			}),
			{
				initial: [],
				nullable: false,
			}
		),
	}),
});

export default Goals;
