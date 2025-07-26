const {api, sheets} = foundry.applications;

const TextEditor = foundry.applications.ux.TextEditor.implementation;
export default class DnMItemSheetV2
	extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {

	_editModeEnabled = false;

	_firstRender = true;


	get defaultTab() {
		return "attributes";
	}


	get system() {
		return this.item.system;
	}


	get tabs() {
		if (!this.tabGroups.primary) {
			this.tabGroups.primary = this.defaultTab;
		}

		switch (this.item.type) {
			case "archetype":
			case "armor":
			case "equipment":
			case "glif":
			case "major_npc_action":
			case "nanogram_pattern":
			case "origin":
			case "talent":
			case "temperament":
			case "weapon": {
				return {
					attributes: {
						cssClass: this.tabGroups.primary === "attributes" ? "active" : "",
						group: "primary",
						id: "attributes",
						label: "DNM.Labels.Attributes",
					},
					description: {
						cssClass: this.tabGroups.primary === "description" ? "active" : "",
						group: "primary",
						id: "description",
						label: "DNM.Labels.Description",
					},
					source: {
						cssClass: this.tabGroups.primary === "source" ? "active" : "",
						group: "primary",
						id: "source",
						label: "DNM.Labels.Source",
					},
				};
			}
			case "npc_action":
			case "special_ability": {
				return {
					description: {
						cssClass: this.tabGroups.primary === "description" ? "active" : "",
						group: "primary",
						id: "description",
						label: "DNM.Labels.Description",
					},
					source: {
						cssClass: this.tabGroups.primary === "source" ? "active" : "",
						group: "primary",
						id: "source",
						label: "DNM.Labels.Source",
					},
				};
			}
		}

		return {};
	}


	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			addDamageType: DnMItemSheetV2._onAddDamageType,
			deleteChoice: DnMItemSheetV2._deleteChoiceItem,
			deleteDamageType: DnMItemSheetV2._onDeleteDamageType,
			toggleAttributeChoice: DnMItemSheetV2._onToggleAttributeChoice,
			toggleEditMode: DnMItemSheetV2._onToggleEditMode,
			toggleQuality: DnMItemSheetV2._onToggleQuality,
			toggleSkillChoice: DnMItemSheetV2._onToggleSkillChoice,
		},
		classes: ["dnm", "item"],
		form: {
			closeOnSubmit: false,
			submitOnChange: true,
		},
		position: {
			width: 600,
			height: 500,
		},
		tag: "form",
	};


	static async _deleteChoiceItem(event) {
		if (!(this.isEditable && this._editModeEnabled)) return;

		event.preventDefault();
		event.stopPropagation();

		const deleteUuid = event.target.dataset.uuid ?? undefined;
		const choicesKey = event.target.dataset.choicesKey ?? undefined;

		// handles cases where choicesKey is nested property.
		const currentChoices = choicesKey
			.split(".")
			.reduce((obj, path) => obj ? obj[path]: [], this.item.system);

		const newChoices = [];
		for (const itemUuid of currentChoices) {
			if (itemUuid === deleteUuid) continue;
			newChoices.push(itemUuid);
		}

		const dataKey = `system.${choicesKey}`;
		this.item.update({[dataKey]: newChoices});
	}


	async #toggleAttributeChoice(attributeId) {
		const newChoices = this.#toggleChoice(
			this.system.attributeChoices.choices,
			attributeId
		);

		this.item.update({"system.attributeChoices.choices": newChoices});
	}


	#toggleChoice(currentChoices, choiceId) {
		let newChoices = [];

		if (currentChoices.includes(choiceId)) {
			newChoices = currentChoices.filter(a => a !== choiceId);
		}
		else {
			newChoices = [...currentChoices, choiceId];
		}

		return newChoices;
	}


	async #toggleSkillChoice(skillId) {
		const newChoices = this.#toggleChoice(
			this.system.skillChoices.choices,
			skillId
		);

		this.item.update({"system.skillChoices.choices": newChoices});
	}


	static async _onAddDamageType(event, target) {
		event.preventDefault();

		const damageValues = this.system.damage ?? [];

		damageValues.push({type: "", value: 1});

		const updateData = {};
		updateData[target.dataset.systemKey] = damageValues;

		this.item.update(updateData);
	}


	static async _onDeleteDamageType(event, target) {
		event.preventDefault();

		const dataset = event.target.dataset;
		const index = Number(dataset.index);

		const damageValues = this.system.damage ?? [];

		damageValues.splice(index, 1);

		const updateData = {};
		updateData[target.dataset.systemKey] = damageValues;

		this.item.update(updateData);
	}


	static async _onToggleQuality(event, target) {
		event.preventDefault();

		if (!this._editModeEnabled) return;

		const dataset = event.target.dataset;
		const enabled = dataset.enabled === "true" ? false : true;

		const updateData = {};
		updateData[`${dataset.systemProperty}.${dataset.key}.enabled`] = enabled;

		await this.item.update(updateData);
		this.render();
	}


	async _onRender(context, options) {
		super._onRender(context, options);

		const _onSelectChoiceChange = this._onSelectChoiceChange.bind(this);
		this.element.querySelectorAll("[data-action=selectChoice]").forEach(
			selected => {
				selected.addEventListener("change", _onSelectChoiceChange);
			}
		);

		const _onSelectQualityChange = this._onSelectQualityChange.bind(this);
		this.element.querySelectorAll("[data-action=selectQuality]").forEach(
			element => {
				element.addEventListener("change", _onSelectQualityChange);
			}
		);
	}


	async _onSelectChoiceChange(event) {
		event.preventDefault();
		const options = event.target?.list?.options ?? [];
		const dataset = event.target?.dataset ?? {};

		const isItem = dataset.isItem === "true" ? true : false;

		let uuid = undefined;

		for (const option of options) {
			if (option.value === event.target.value) {
				uuid = option.getAttribute("data-uuid");
				break;
			}
		}

		if (!uuid) return;

		// handles cases where choicesKey is nested property.
		let currentChoices = dataset.choicesKey
			.split(".")
			.reduce((obj, path) => obj ? obj[path]: [], this.item.system);

		if (currentChoices.includes(uuid)) return; // No duplicates

		currentChoices.push(uuid);

		const choiceItems = [];
		for (const itemUuid of currentChoices) {
			if (isItem) {
				choiceItems.push(await fromUuid(itemUuid));
			}
			else {
				choiceItems.push(itemUuid);
			}
		}

		if (isItem) {
			choiceItems.sort((a, b) => a.name.localeCompare(b.name));
		}
		else {
			choiceItems.sort((a, b) => a.localeCompare(b));
		}

		const sortedChoiceUuids = dataset.isItem
			? choiceItems.map(item => item.uuid)
			: choiceItems;

		const updateData = {};
		updateData[`system.${dataset.choicesKey}`] = sortedChoiceUuids;

		return this.item.update(updateData);
	}


	async _onSelectQualityChange(event) {
		event.preventDefault();

		const dataset = event.target.dataset ?? {};

		const options = event.target.list.options;
		const value = event.target.value;

		let qualityKey = null;
		for (const option of options) {
			if (option.value === value) {
				qualityKey = option.getAttribute("data-key");
				break;
			}
		}

		if (qualityKey === null) return;

		const updateData = {};
		updateData[`${dataset.systemProperty}.${qualityKey}.enabled`] = true;

		await this.item.update(updateData);
		this.render();
	}


	static async _onToggleAttributeChoice(event, target) {
		event.preventDefault();
		this.#toggleAttributeChoice(target.dataset.attributeId);
	}


	static async _onToggleEditMode(event, target) {
		event.preventDefault();
		this._editModeEnabled = !this._editModeEnabled;
		await this.submit();
		this.render();
	}


	static async _onToggleSkillChoice(event, target) {
		event.preventDefault();
		this.#toggleSkillChoice(target.dataset.skillId);
	}


	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		context.tab = context.tabs[partId];

		return context;
	}


	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		context.tabs = this.tabs;

		const isEditable = this.isEditable;

		context.CONFIG = CONFIG.DREAMS;
		context.cssClass = isEditable ? "editable" : "locked";
		context.editable = isEditable;

		// Keep sheets unlocked if debug enabled
		const debugEnabled = game.settings.get(SYSTEM_ID, "debugEnabled");

		context.editModeEnabled = debugEnabled ? true : this._editModeEnabled;
		context.editModeDisabled = !context.editModeEnabled;

		context.document = this.document;

		context.systemSource = this.system._source;
		context.systemFields = this.document.system.schema.fields;

		context.system = this.system;

		context.allSources = await dreams.compendiums.sources();

		const enrichedFields = this.system.enrichedFields ?? {};
		for (let key of Object.keys(enrichedFields)) {
			enrichedFields[key] = await TextEditor.enrichHTML(
				enrichedFields[key]
			);
		}

		context.enrichedFields = enrichedFields;

		return context;
	}

	_getAttributeData(context, chosen) {
		context.attributes = [];

		for (const [id, name] of Object.entries(CONFIG.DREAMS.ATTRIBUTES)) {
			context.attributes.push({
				id,
				name,
				selected: chosen.includes(id),
			});
		}
		// context.attributes = attributes.sort(
		// 	(a, b) => a.name.localeCompare(b.name)
		// );
	}


	_getSkillData(context) {
		context.skills = [];

		for (const [id, name] of Object.entries(CONFIG.DREAMS.SKILLS)) {
			context.skills.push({
				id,
				name,
				selected: this.system.skillChoices.choices.includes(id),
			});
		}

		// context.skills = skills.sort(
		// 	(a, b) => a.name.localeCompare(b.name)
		// );
	}

}
