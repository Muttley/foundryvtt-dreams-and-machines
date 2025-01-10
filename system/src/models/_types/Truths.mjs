const fields = foundry.data.fields;

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
