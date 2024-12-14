import { SYSTEM_ID } from "../config.mjs";

export default class DnMCompendiums {

	static #collectionFromArray(array) {
		const collection = new Collection();
		for (let d of array) {
			collection.set(d._id, d);
		}
		return collection;
	 }

	static async #documents(type, subtype=null, filterSources=true) {
		let sources = [];

		if (filterSources === true) {
			sources = game.settings.get(SYSTEM_ID, "sourceFilters") ?? [];
		}

		const sourcesSet = sources.length !== 0;

		let docs = [];

		// Iterate through the Packs, adding them to the list
		for (let pack of game.packs) {
			if (pack.metadata.type !== type) continue;

			let documents = await pack.getIndex({fields: ["system"]});

			// filter by subtype
			if (subtype !== null) {
				documents = documents.filter(d => d.type === subtype);
			}

			for (const doc of documents) {
				docs.push(doc);
			}
		}

		// filter out non selected sources
		if (sourcesSet) {
			docs = docs.filter(
				d => {
					const source = d.system?.source?.title ?? "";
					return source === "" || sources.includes(source);
				}
			);
		}

		// Dedupe and sort the list alphabetically
		docs = Array.from(new Set(docs)).sort(
			(a, b) => a.name.localeCompare(b.name)
		);

		// return new collection
		return this.#collectionFromArray(docs);
	}


	static async sources() {
		const sources = [];

		for (const source of Object.keys(CONFIG.DREAMS.OFFICIAL_SOURCES)) {
			sources.push({
				uuid: source,
				name: game.i18n.localize(CONFIG.DREAMS.OFFICIAL_SOURCES[source]),
			});
		}

		for (const module of game.modules) {
			if (!module.active) continue;

			const moduleSources = module.flags["dreams-and-machines"]?.sources ?? {};

			for (const moduleSource of Object.keys(moduleSources)) {

				sources.push({
					uuid: moduleSource,
					name: game.i18n.localize(
						moduleSources[moduleSource]
					),
				});
			}
		}

		return sources.sort((a, b) => a.name.localeCompare(b.name));
	}

}
