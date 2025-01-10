const fields = foundry.data.fields;

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
