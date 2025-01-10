export default class DnMUtils {

	static foundryMinVersion(version) {
		const majorVersion = parseInt(game.version.split(".")[0]);
		return majorVersion >= version;
	}


	/**
	 * Creates de-duplicated lists of Selected and Unselected Items.
	 *
	 * @param {allItems} Array A list of all available items
	 * @param {items} Array A list of currently selected items
	 *
	 * @returns {Promise} Promise which represents an array containing both the
	 * selected and unselected skill arrays
	 */
	static async getDedupedSelectedItems(allItems, items) {
		const unselectedItems = [];
		const selectedItems = [];

		allItems.forEach(item => {
			if (!items.includes(item.uuid)) {
				unselectedItems.push(item);
			}
		});

		for (const itemUuid of items) {
			selectedItems.push(await this.getFromUuid(itemUuid));
		}

		selectedItems.sort((a, b) => a.name.localeCompare(b.name));

		return [selectedItems, unselectedItems];
	}


	static async getFromUuid(uuid) {
		const itemObj = await fromUuid(uuid);
		if (itemObj) {
			return itemObj;
		}
		else {
			return {name: "[Invalid ID]", uuid: uuid};
		}
	}


	static getFromUuidSync(uuid) {
		const itemObj =  fromUuidSync(uuid);
		if (itemObj) {
			return itemObj;
		}
		else {
			return {name: "[Invalid ID]", uuid: uuid};
		}
	}


	// If this is a new release, show the release notes to the GM the first time
	// they login
	static async showNewReleaseNotes() {
		if (game.user.isGM) {
			const savedVersion = game.settings.get(SYSTEM_ID, "systemVersion");
			const systemVersion = game.system.version;

			if (systemVersion !== savedVersion) {
				Hotbar.toggleDocumentSheet(
					CONFIG.DREAMS.JOURNAL_UUIDS.releaseNotes
				);

				game.settings.set(SYSTEM_ID, "systemVersion", systemVersion);
			}
		}
	}
}
