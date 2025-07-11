import SimpleQuality from "./qualities/SimpleQuality.mjs";

export default function ArmorQualities() {
	const fields = foundry.data.fields;

	const qualities = {};

	Object.keys(CONFIG.DREAMS.ARMOR_QUALITIES).forEach(
		key => qualities[key] = SimpleQuality()
	);

	return new fields.SchemaField(qualities);
}
