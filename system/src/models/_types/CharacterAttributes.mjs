const fields = foundry.data.fields;

const CharacterAttributes = () => ({
	attributes: new fields.SchemaField({
		insight: new fields.SchemaField({
			value: new fields.NumberField({
				integer: true,
				initial: 7,
				nullable: false,
			}),
			exhaustion: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),
			confused: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),
		}),
		might: new fields.SchemaField({
			value: new fields.NumberField({
				integer: true,
				initial: 7,
				nullable: false,
			}),
			exhaustion: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),
			weary: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),
		}),
		quickness: new fields.SchemaField({
			value: new fields.NumberField({
				integer: true,
				initial: 7,
				nullable: false,
			}),
			exhaustion: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),
			breathless: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),
		}),
		resolve: new fields.SchemaField({
			value: new fields.NumberField({
				integer: true,
				initial: 7,
				nullable: false,
			}),
			exhaustion: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),
			despairing: new fields.BooleanField({
				initial: false,
				nullable: false,
			}),
		}),
	}),
});

export default CharacterAttributes;
