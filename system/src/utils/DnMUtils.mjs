export default class DnMUtils {

	static foundryMinVersion(version) {
		const majorVersion = parseInt(game.version.split(".")[0]);
		return majorVersion >= version;
	}


	// Work out which actor to use.  If the user clicking the link is the GM and
	// they have tokens selected then use these.
	//
	// Players always use their own character Actor.
	//
	static async getActors() {
		let actors = [];

		if (game.user.isGM) {
			for (const token of canvas.tokens.controlled) {
				actors.push(token.actor);
			}
		}
		else {
			actors.push(game.user.character);
		}

		return actors;
	}


	// Work out the current Actor.
	// If the user is the GM then use the current token they have selected.
	//
	static async getCurrentActor() {
		let actor = null;

		if (game.user.isGM) {
			const controlledTokenCount = canvas.tokens.controlled.length;
			if (controlledTokenCount > 0) {
				if (controlledTokenCount !== 1) {
					return ui.notifications.warn(
						game.i18n.localize("DNM.Error.MoreThanOneTokenSelected")
					);
				}
				else {
					actor = canvas.tokens.controlled[0].actor;
				}
			}
		}
		else {
			actor = game.user.character;
		}

		return actor;
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


	static async reportMissingTypeByUuid(item, missingType, missingUuid) {
		ui.notifications.error(
			game.i18n.format("DNM.Notifications.MissingFromCompendiums", {
				name: item.name,
				type: game.i18n.localize(`TYPES.Item.${item.type}`),
				missingType: game.i18n.localize(`TYPES.Item.${missingType}`),
				missingUuid: missingUuid,
			})
		);
	}

	// If this is a new release, show the release notes to the GM the first time
	// they login
	static async showNewReleaseNotes() {
		if (game.user.isGM) {
			const savedVersion = game.settings.get(SYSTEM_ID, "systemVersion");
			const systemVersion = game.system.version;

			if (systemVersion !== savedVersion) {
				foundry.applications.ui.Hotbar.toggleDocumentSheet(
					CONFIG.DREAMS.JOURNAL_UUIDS.releaseNotes
				);

				game.settings.set(SYSTEM_ID, "systemVersion", systemVersion);
			}
		}
	}
}
