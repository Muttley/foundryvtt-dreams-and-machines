const fields = foundry.data.fields;

export default function ValueQuality() {
	return new fields.SchemaField({
		enabled: new fields.BooleanField({
			initial: false,
			nullable: false,
		}),
		hasValue: new fields.BooleanField({
			initial: true,
			nullable: false,
		}),
		value: new fields.NumberField({
			initial: 1,
			integer: true,
			min: 1,
			nullable: false,
		}),
	});
}
