const fields = foundry.data.fields;

const BookSource = () => ({
	source: new fields.StringField({
		blank: true,
		initial: "",
		choices: () => {
			return Object.keys(CONFIG.DREAMS.OFFICIAL_SOURCES);
		},
		nullable: false,
	}),
});

export default BookSource;
