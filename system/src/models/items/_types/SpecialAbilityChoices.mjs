const fields = foundry.data.fields;

const SpecialAbilityChoices = () => ({
	specialAbilityChoices: new fields.SchemaField({
		maxChoices: new fields.NumberField({
			initial: 0,
			integer: true,
			min: 0,
			nullable: false,
		}),
		selected: new fields.ArrayField(
			new fields.DocumentUUIDField({
				initial: "",
				nullable: false,
			}),
			{
				initial: [],
				nullable: false,
			}
		),
		choices: new fields.ArrayField(
			new fields.DocumentUUIDField({
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

export default SpecialAbilityChoices;
