/**
 * Helper function for registering an Actor partial.
 * @param {string} name
 */
// function actorPartial(name) {
// 	return `systems/dreams-and-machines/templates/actor/partials/actor-${name}.hbs`;
// }

/**
 * Define a set of template paths to pre-load.
 *
 * Pre-loaded templates are compiled and cached for fast access when rendering
 *
 * @export
 * @async
 * @returns {Promise}
 */
export default async function registerTemplates() {
	dreams.debug("Pre-loading Templates...");

	const partials = [
		"systems/dreams-and-machines/templates/actor/_partials/background-item.hbs",
		"systems/dreams-and-machines/templates/actor/_partials/custom-string-list.hbs",
		"systems/dreams-and-machines/templates/actor/character/archetype-goal.hbs",
		"systems/dreams-and-machines/templates/actor/character/attitude.hbs",
		"systems/dreams-and-machines/templates/actor/character/attributes.hbs",
		"systems/dreams-and-machines/templates/actor/character/bonds.hbs",
		"systems/dreams-and-machines/templates/actor/character/drives.hbs",
		"systems/dreams-and-machines/templates/actor/character/equipment.hbs",
		"systems/dreams-and-machines/templates/actor/character/exhaustion.hbs",
		"systems/dreams-and-machines/templates/actor/character/goals.hbs",
		"systems/dreams-and-machines/templates/actor/character/harms.hbs",
		"systems/dreams-and-machines/templates/actor/character/meta-currencies.hbs",
		"systems/dreams-and-machines/templates/actor/character/skills.hbs",
		"systems/dreams-and-machines/templates/actor/character/talents.hbs",
		"systems/dreams-and-machines/templates/actor/character/traits.hbs",
		"systems/dreams-and-machines/templates/actor/character/truths.hbs",
		"systems/dreams-and-machines/templates/item/_shared-partials/description-tab.hbs",
		"systems/dreams-and-machines/templates/item/_shared-partials/header.hbs",
		"systems/dreams-and-machines/templates/item/_shared-partials/source-tab.hbs",
		"systems/dreams-and-machines/templates/item/origin/_partials/attribute-choices.hbs",
		"systems/dreams-and-machines/templates/item/origin/_partials/attributes.hbs",
		"systems/dreams-and-machines/templates/item/origin/_partials/skill-choices.hbs",
		"systems/dreams-and-machines/templates/item/origin/_partials/skills.hbs",
		"systems/dreams-and-machines/templates/item/origin/attributes-tab.hbs",
	];

	const paths = {};
	for (const path of partials) {
		const [key] = path.split("/").slice(3).join("/").split(".");
		dreams.debug(`Template name: ${key}`);
		paths[key] = path;
	}

	await loadTemplates(paths);

	dreams.debug("Template Loading Complete.");
}
