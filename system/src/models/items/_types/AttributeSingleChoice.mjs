const fields = foundry.data.fields;

const AttributeSingleChoice = () => ({
	attributeChoices: new fields.SchemaField({
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
		chosen: new fields.StringField({
			blank: false,
			choices: () => {
				return Object.keys(CONFIG.DREAMS.ATTRIBUTES);
			},
			nullable: false,
		}),
	}),
});

export default AttributeSingleChoice;
