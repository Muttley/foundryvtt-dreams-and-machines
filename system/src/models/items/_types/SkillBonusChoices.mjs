const fields = foundry.data.fields;

const SkillBonusChoices = () => ({
	skillChoices: new fields.SchemaField({
		choices: new fields.ArrayField(
			new fields.StringField({
				blank: false,
				choices: () => {
					return Object.keys(CONFIG.DREAMS.SKILLS);
				},
				nullable: false,
			}),
			{
				initial: [],
				nullable: false,
			}
		),
		values: new fields.ArrayField(
			new fields.SchemaField({
				attribute: new fields.StringField({
					blank: false,
					choices: () => {
						return Object.keys(CONFIG.DREAMS.SKILLS);
					},
					nullable: false,
				}),
				value: new fields.NumberField({
					initial: 0,
					integer: true,
					min: 0,
					nullable: false,
				}),
			}),
			{
				initial: [],
				nullable: false,
			}
		),
	}),
});

export default SkillBonusChoices;
