const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export default class SourceFilterConfig
	extends HandlebarsApplicationMixin(ApplicationV2) {

	filtered = [];

	constructor() {
		super();

		this.filtered = game.settings.get(SYSTEM_ID, "sourceFilters") ?? [];
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		id: "source-filter-config",
		tag: "form",
		window: {
			contentClasses: [
				"standard-form",
			],
			icon: "fa-solid fa-book",
			resizable: true,
			title: "DNM.Settings.SourceFilters.AppTitle",
		},
		position: {
			width: 400,
			height: "auto",
		},
		form: {
			closeOnSubmit: false,
			submitOnChange: true,
			handler: SourceFilterConfig.#onSubmit,
		},
		actions: {
			removeSourceFilter: SourceFilterConfig.removeSourceFilter,
		},
	};

	/** @override */
	static PARTS = {
		form: {
			template: "systems/dreams-and-machines/templates/app/source-filter-config.hbs",
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	};


	async #onChange(event, form, formData) {
		const options = event.target.list.options;
		const value = event.target.value;

		let sourceId = null;
		for (const option of options) {
			if (option.value === value) {
				sourceId = option.getAttribute("data-uuid");
				break;
			}
		}

		if (sourceId === null) return;

		if (this.filtered.includes(sourceId)) return; // No duplicates

		this.filtered.push(sourceId);

		this.filtered.sort((a, b) => a.localeCompare(b));

		return this.render(true);
	}


	static async #onSubmit(event, form, formData) {
		if (event.type === "change") {
			return this.#onChange(event, form, formData);
		}

		game.settings.set(SYSTEM_ID, "sourceFilters", this.filtered);

		return this.close();
	}


	async _prepareContext(options={}) {
		const context = {
			buttons: [{
				icon: "fas fa-save",
				label: "SETUP.SaveConfiguration",
				type: "submit",
			}],
		};

		const sources = await dreams.compendiums.sources();

		context.selectedSources = [];
		for (const source of sources) {
			if (this.filtered.includes(source.uuid)) {
				context.selectedSources.push(source);
			}
		}

		context.hasSelectedSources = context.selectedSources.length > 0;

		context.unselectedSources = sources.map(
			source => ({name: source.name, uuid: source.uuid})
		).filter(source => !this.filtered.includes(source.uuid));

		return context;
	}


	static registerSetting() {
		game.settings.register(SYSTEM_ID, "sourceFilters", {
			name: "DNM.Settings.SourceFilters.Name",
			hint: "DNM.Settings.SourceFilters.Hint",
			config: false,
			scope: "world",
			type: Array,
			requiresReload: true,
			default: [],
		});
	}


	static async removeSourceFilter(event, target) {
		const removeId = target.dataset.uuid;

		const newChoices = [];
		for (const sourceId of this.filtered) {
			if (sourceId === removeId) continue;
			newChoices.push(sourceId);
		}

		this.filtered = newChoices;

		return this.render(true);
	}
}
