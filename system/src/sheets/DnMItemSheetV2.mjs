const {api, sheets} = foundry.applications;

export default class DnMItemSheetV2
	extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {

	_editModeEnabled = false;


	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			editImage: this._onEditImage,
			toggleEditMode: DnMItemSheetV2._onToggleEditMode,
		},
		classes: ["sheet", "dnm", "item"],
		form: {
			submitOnChange: true,
		},
		position: {
			height: 800,
			width: 600,
		},
		tag: "form",
	};


	get system() {
		return this.item.system;
	}


	static async _onToggleEditMode(event, target) {
		event.preventDefault();
		this._editModeEnabled = !this._editModeEnabled;
		await this.submit();
		this.render();
	}


	/**
	 * Handle changing a Document's image.
	 * TODO: Copied from v13 implementation, can be removed after
	 */
	static async _onEditImage(_event, target) {
		if (target.nodeName !== "IMG") {
			throw new Error("The editImage action is available only for IMG elements.");
		}
		const attr = target.dataset.edit;
		const current = foundry.utils.getProperty(this.document._source, attr);
		const defaultArtwork =
			this.document.constructor.getDefaultArtwork?.(this.document._source) ?? {};
		const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
		const fp = new FilePicker({
			current,
			type: "image",
			redirectToRoot: defaultImage ? [defaultImage] : [],
			callback: path => {
				target.src = path;
				if (this.options.form.submitOnChange) {
					const submit = new Event("submit");
					this.element.dispatchEvent(submit);
				}
			},
			top: this.position.top + 40,
			left: this.position.left + 10,
		});
		await fp.browse();
	}


	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);
		// this.#attachContextMenus();
	}


	_onRender(context, options) {}


	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		const isEditable = this.isEditable;

		context.CONFIG = CONFIG.DREAMS;
		context.cssClass = isEditable ? "editable" : "locked";
		context.editable = isEditable;
		context.editModeEnabled = this._editModeEnabled;
		context.editModeDisabled = !this._editModeEnabled;
		context.document = this.document;

		context.systemSource = this.system._source;
		context.systemFields = this.document.system.schema.fields;

		context.system = this.system;

		if (!this.tabGroups.primary) this.tabGroups.primary = "attributes";

		context.tabs = {
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

		context.allSources = await dreams.compendiums.sources();

		return context;
	}

}
