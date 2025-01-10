const fields = foundry.data.fields;

const SpecialAbilityChoices = () => ({
	specialAbilityChoices: new fields.SchemaField({
		maxChoices: new fields.NumberField({
			initial: 0,
			integer: true,
			min: 0,
			nullable: false,
		}),
		specialAbilities: new fields.ArrayField(
			new fields.SchemaField({
				uuid: new fields.DocumentUUIDField({
					initial: "",
					nullable: false,
				}),
				selected: new fields.BooleanField({
					initial: false,
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

export default SpecialAbilityChoices;
