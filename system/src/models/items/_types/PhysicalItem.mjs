import Qualities from "./Qualities.mjs";

const fields = foundry.data.fields;

const PhysicalItem = () => ({
	category: new fields.StringField({
		blank: false,
		initial: Object.keys(CONFIG.DREAMS.ITEM_CATEGORIES)[0] ?? "",
		choices: () => {
			return Object.keys(CONFIG.DREAMS.ITEM_CATEGORIES);
		},
		nullable: false,
	}),

	coin: new fields.NumberField({
		initial: 0,
		integer: true,
		min: 0,
		nullable: false,
	}),

	qualities: Qualities(),

	quantity: new fields.NumberField({
		initial: 1,
		integer: true,
		min: 0,
		nullable: false,
	}),

	rarity: new fields.NumberField({
		initial: 1,
		integer: true,
		min: 0,
		nullable: false,
	}),

	supplyPointCost: new fields.NumberField({
		initial: 0,
		integer: true,
		min: 0,
		nullable: false,
	}),

	techLevel: new fields.NumberField({
		initial: 0,
		integer: true,
		min: 0,
		nullable: false,
	}),
});

export default PhysicalItem;


