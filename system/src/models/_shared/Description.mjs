const fields = foundry.data.fields;

/**
 * Data model template providing a Description used for items.
 *
 * @mixin
 * @property {string} description User-friendly descriptive string for the item.
 */
const Description = () => ({
	description: new fields.HTMLField({
		initial: "",
		nullable: false,
	}),
});

export default Description;
