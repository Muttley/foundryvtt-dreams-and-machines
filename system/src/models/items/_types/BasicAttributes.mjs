const fields = foundry.data.fields;

const BasicAttributes = () => ({
	attributes: new fields.SchemaField({
		insight: new fields.SchemaField({
			value: new fields.NumberField({
				integer: true,
				initial: 6,
				nullable: false,
			}),
		}),
		might: new fields.SchemaField({
			value: new fields.NumberField({
				integer: true,
				initial: 6,
				nullable: false,
			}),
		}),
		quickness: new fields.SchemaField({
			value: new fields.NumberField({
				integer: true,
				initial: 6,
				nullable: false,
			}),
		}),
		resolve: new fields.SchemaField({
			value: new fields.NumberField({
				integer: true,
				initial: 6,
				nullable: false,
			}),
		}),
	}),
});

export default BasicAttributes;
