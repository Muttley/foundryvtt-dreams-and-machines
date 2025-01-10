import DnMItemSheet from "../DnMItemSheet.mjs";

export default class SpecialAbilitySheet extends DnMItemSheet {

	static get defaultOptions() {
		return {
			...super.defaultOptions,
			tabs: [{
				navSelector: ".sheet-tabs",
				contentSelector: ".sheet-body",
				initial: "description",
			}],
		};
	}

}
