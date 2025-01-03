/**
 * @typedef {object} OriginAttributeChoices
 *
 * @property {number} choiceCount
 * @property {string[]} choices
 * @property {number} value
 */

const fields = foundry.data.fields;

/**
 * @mixin
 * @property {OriginAttributeChoices} attributeChoices
 */
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
		value: new fields.NumberField({
			initial: 0,
			integer: true,
			min: 0,
			nullable: false,
		}),
	}),
});

export default OriginAttributeChoices;
