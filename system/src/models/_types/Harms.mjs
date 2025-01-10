const fields = foundry.data.fields;

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
