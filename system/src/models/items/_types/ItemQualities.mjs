export default function ItemQualities() {
	const fields = foundry.data.fields;

	return new fields.ArrayField(
		new fields.SchemaField({
			label: new fields.StringField({
				initial: "New Quality",
				nullable: false,
			}),

			rating: new fields.NumberField({
				initial: null,
				nullable: true,
			}),
		}),
		{
			initial: [],
			nullable: false,
		}
	);
}
