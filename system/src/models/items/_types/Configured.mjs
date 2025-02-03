const fields = foundry.data.fields;

const Configured = () => ({
	configured: new fields.BooleanField({
		initial: false,
		nullable: false,
	}),
});

export default Configured;


