const fields = foundry.data.fields;

const Skills = () => ({
	skills: new fields.SchemaField({
		fight: new fields.NumberField({
			initial: 1,
			integer: true,
			nullable: false,
			min: 0,
		}),
		move: new fields.NumberField({
			initial: 1,
			integer: true,
			nullable: false,
			min: 0,
		}),
		operate: new fields.NumberField({
			initial: 1,
			integer: true,
			nullable: false,
			min: 0,
		}),
		sneak: new fields.NumberField({
			initial: 1,
			integer: true,
			nullable: false,
			min: 0,
		}),
		study: new fields.NumberField({
			initial: 1,
			integer: true,
			nullable: false,
			min: 0,
		}),
		survive: new fields.NumberField({
			initial: 1,
			integer: true,
			nullable: false,
			min: 0,
		}),
		talk: new fields.NumberField({
			initial: 1,
			integer: true,
			nullable: false,
			min: 0,
		}),
	}),
});

export default Skills;
