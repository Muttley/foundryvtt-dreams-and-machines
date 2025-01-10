const fields = foundry.data.fields;

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
