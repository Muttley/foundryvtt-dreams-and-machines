const fields = foundry.data.fields;

/**
 * Data model template providing Traits for actors.
 *
 * @mixin
 * @property {string[]} harms
 */
const Harms = () => ({
	harms: new fields.ArrayField(
		new fields.StringField({
			initial: "",
			nullable: false,
		}),
		{
			initial: [],
			nullable: false,
		}
	),
});

export default Harms;
