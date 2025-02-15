const {api, sheets} = foundry.applications;

export default class DnMItemSheetV2
	extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {

	_editModeEnabled = false;


	get system() {
		return this.item.system;
	}


	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			editImage: this._onEditImage,
			toggleEditMode: DnMItemSheetV2._onToggleEditMode,
			toggleQuality: this._onToggleQuality,
		},
		classes: ["sheet", "dnm", "item"],
		form: {
			closeOnSubmit: false,
			submitOnChange: true,
		},
		position: {
			// height: 800,
			height: "auto",
			width: 600,
		},
		tag: "form",
	};


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


	static async _onToggleQuality(event, target) {
		event.preventDefault();

		const dataset = event.target.dataset;
		const enabled = dataset.enabled === "true" ? false : true;

		const updateData = {};
		updateData[`${dataset.systemProperty}.${dataset.key}.enabled`] = enabled;

		await this.item.update(updateData);
		this.render();
	}


	_onRender(context, options) {
		const selectChoice =
			this.element.querySelector("[data-action=selectChoice]");
		if (selectChoice) {
			selectChoice.addEventListener("change", this._onSelectChoiceChange.bind(this));
		}

		const selectQuality =
			this.element.querySelector("[data-action=selectQuality]");
		if (selectQuality) {
			selectQuality.addEventListener("change", this._onSelectQualityChange.bind(this));
		}
	}


	async _onSelectChoiceChange(event) {
		event.preventDefault();

		const dataset = event.currentTarget.dataset ?? {};
		dataset.selected_value = event.currentTarget.value;

		// Dynamically find the method to call for this type of selection
		// change, and then run it if it exists
		//
		const methodName = `_onOptionSelected_${dataset.choicesKey}`;
		if (typeof this[methodName] === "function") {
			await this[methodName](dataset);
			// this.render();
		}
		else {
			dreams.warn(`Unable to handle selection change; Class has no method named ${methodName}`);
		}
	}


	async _onSelectQualityChange(event) {
		event.preventDefault();

		const dataset = event.currentTarget.dataset ?? {};

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


	static async _onToggleEditMode(event, target) {
		event.preventDefault();
		this._editModeEnabled = !this._editModeEnabled;
		await this.submit();
		this.render();
	}


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

		context.allSources = await dreams.compendiums.sources();

		return context;
	}

}
