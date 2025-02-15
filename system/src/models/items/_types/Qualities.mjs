export default function Qualities() {
	const fields = foundry.data.fields;

	return new fields.ArrayField(
		new fields.DocumentUUIDField({
			initial: "",
			nullable: false,
		}),
		{
			initial: [],
			nullable: false,
		}
	);
}
