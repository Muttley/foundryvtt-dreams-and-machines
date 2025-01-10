const fields = foundry.data.fields;

const OriginAttributeChoices = () => ({
	attributeChoices: new fields.SchemaField({
		choiceCount: new fields.NumberField({
			initial: 0,
			integer: true,
			min: 0,
			nullable: false,
		}),
		choices: new fields.ArrayField(
			new fields.StringField({
				blank: false,
				choices: () => {
					return Object.keys(CONFIG.DREAMS.ATTRIBUTES);
				},
				nullable: false,
			}),
			{
				initial: [],
				nullable: false,
			}
		),
		chosen: new fields.ArrayField(
			new fields.StringField({
				blank: false,
				choices: () => {
					return Object.keys(CONFIG.DREAMS.ATTRIBUTES);
				},
				nullable: false,
			}),
			{
				initial: [],
				nullable: false,
			}
		),
		value: new fields.NumberField({
			initial: 0,
			integer: true,
			min: 0,
			nullable: false,
		}),
	}),
});

export default OriginAttributeChoices;
