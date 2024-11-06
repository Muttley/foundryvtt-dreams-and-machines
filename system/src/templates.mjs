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
	dreams.logger.debug("Pre-loading Templates...");

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
		"systems/dreams-and-machines/templates/item/_partials/description.hbs",
		"systems/dreams-and-machines/templates/item/_partials/header.hbs",
	];

	const paths = {};
	for (const path of partials) {
		const [key] = path.split("/").slice(3).join("/").split(".");
		dreams.logger.debug(`Template name: ${key}`);
		paths[key] = path;
	}

	await loadTemplates(paths);

	dreams.logger.debug("Template Loading Complete.");
}
