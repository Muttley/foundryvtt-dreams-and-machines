const fields = foundry.data.fields;

const Description = () => ({
	description: new fields.HTMLField({
		initial: "",
		nullable: false,
	}),
});

export default Description;
