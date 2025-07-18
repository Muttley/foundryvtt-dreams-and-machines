import SimpleQuality from "./SimpleQuality.mjs";
import ValueQuality from "./ValueQuality.mjs";

export default function VehicleQualities() {
	const fields = foundry.data.fields;

	const qualities = {};

	Object.keys(CONFIG.DREAMS.VEHICLE_QUALITIES).forEach(
		key => {
			if (key.endsWith("_x")) {
				qualities[key] = ValueQuality();
			}
			else {
				qualities[key] = SimpleQuality();
			}
		}
	);

	return new fields.SchemaField(qualities);
}
