const fields = foundry.data.fields;

/**
 * Data model template providing a Description used for items.
 *
 * @mixin
 * @property {DocumentUUIDField} uuid UUID of a Special Ability
 * @property {BooleanField} selected Has the ability been selected?
 */
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
