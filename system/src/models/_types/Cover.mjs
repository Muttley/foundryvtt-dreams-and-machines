const fields = foundry.data.fields;

const Cover = () => ({
	cover: new fields.SchemaField({
		type: new fields.StringField({
			blank: false,
			initial: Object.keys(CONFIG.DREAMS.VEHICLE_COVER_TYPES)[0],
			choices: () => {
				return Object.keys(CONFIG.DREAMS.VEHICLE_COVER_TYPES);
			},
			nullable: false,
		}),
		value: new fields.NumberField({
			initial: 1,
			integer: true,
			min: 0,
			nullable: false,
		}),
	}),
});

export default Cover;
