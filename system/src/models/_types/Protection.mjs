const fields = foundry.data.fields;

const Protection = () => ({
	protection: new fields.SchemaField({
		value: new fields.NumberField({
			initial: 0,
			integer: true,
			min: 0,
			nullable: false,
		}),
		breaker: new fields.NumberField({
			initial: 0,
			integer: true,
			min: 0,
			nullable: false,
		}),
	}),
});

export default Protection;
