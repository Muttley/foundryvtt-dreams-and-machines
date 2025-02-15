const fields = foundry.data.fields;

const Damage = () => (
	new fields.SchemaField({
		type: new fields.StringField({
			blank: true,
			initial: "",
			nullable: false,
		}),
		value: new fields.NumberField({
			initial: 1,
			integer: true,
			min: 1,
			nullable: false,
		}),
	})
);

export default Damage;
