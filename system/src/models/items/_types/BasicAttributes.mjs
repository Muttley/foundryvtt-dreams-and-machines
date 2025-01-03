/**
 * @typedef {object} BasicAttributes
 *
 * @property {object} insight
 * @property {number} insight.value
 *
 * @property {object} might
 * @property {number} might.value
 *
 * @property {object} quickness
 * @property {number} quickness.value
 *
 * @property {object} resolve
 * @property {number} resolve.value
 */

const fields = foundry.data.fields;

/**
 * Data model template providing Attributes for items.
 *
 * @mixin
 * @property {BasicAttributes} attributes
 */
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
