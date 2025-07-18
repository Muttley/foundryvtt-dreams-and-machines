const fields = foundry.data.fields;

export default function SimpleQuality() {
	return new fields.SchemaField({
		enabled: new fields.BooleanField({
			initial: false,
			nullable: false,
		}),
		hasValue: new fields.BooleanField({
			initial: false,
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
