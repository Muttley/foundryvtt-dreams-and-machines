export default class ItemBaseDataModel
	extends foundry.abstract.TypeDataModel {

	get enrichedFields() {
		return {
			description: this.description,
		};
	}

	get isPhysicalItem() {
		return [
			"armor",
			"equipment",
			"weapon",
		].includes(this.parent.type);
	}

}
