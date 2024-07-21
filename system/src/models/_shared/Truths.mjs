const fields = foundry.data.fields;

/**
 * Data model template providing Truths for actors.
 *
 * @mixin
 * @property {string[]} truths
 */
const Truths = () => ({
	truths: new fields.ArrayField(
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

export default Truths;
