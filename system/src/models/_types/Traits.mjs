const fields = foundry.data.fields;

const Traits = () => ({
	traits: new fields.ArrayField(
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

export default Traits;
