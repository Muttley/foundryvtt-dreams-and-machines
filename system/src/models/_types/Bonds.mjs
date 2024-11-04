const fields = foundry.data.fields;

/**
 * Data model template providing Traits for actors.
 *
 * @mixin
 * @property {string[]} bonds
 */
const Bonds = () => ({
	bonds: new fields.ArrayField(
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

export default Bonds;
