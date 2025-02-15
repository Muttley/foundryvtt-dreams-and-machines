const fields = foundry.data.fields;

const ValueQuality = () => ({
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

export default ValueQuality;
