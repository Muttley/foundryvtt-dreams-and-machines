import SimpleQuality from "./qualities/SimpleQuality.mjs";

export default function WeaponQualities() {
	const fields = foundry.data.fields;

	const qualities = {};

	Object.keys(CONFIG.DREAMS.WEAPON_QUALITIES).forEach(
		key => qualities[key] = SimpleQuality()
	);

	return new fields.SchemaField(qualities);
}
