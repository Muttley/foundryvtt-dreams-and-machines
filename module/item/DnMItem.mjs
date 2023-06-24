import ItemDataModel from './data/ItemDataModel.mjs';
import TalentDataModel from './data/TalentDataModel.mjs';
import EquipmentSheet from './sheet/EquipmentSheet.mjs';
import DnMItemSheet from './DnMItemSheet.mjs';

/**
 * Shared base class for all Dreams and Machines item documents.
 */
export class DnMItem extends Item {}

/**
 * Handles registration for the DnMItem class, sheets, all data models.
 */
export function registerItems() {
	CONFIG.Item.documentClass = DnMItem;

	registerDataModels();
	registerSheets();
}

/**
 * Handles registration for all Dreams and Machine Item data models.
 */
function registerDataModels() {
	CONFIG.Item.dataModels.item = ItemDataModel;
	CONFIG.Item.dataModels.originBenefit = TalentDataModel;
	CONFIG.Item.dataModels.talent = TalentDataModel;
}

/**
 * Handles registration for all Dreams and Machine Item sheets.
 */
function registerSheets() {
	Items.unregisterSheet('core', ItemSheet);

	Items.registerSheet('dreams-and-machines', EquipmentSheet, {
		types: ['item'],
		makeDefault: true,
	});

	Items.registerSheet('dreams-and-machines', DnMItemSheet, {
		types: ['originBenefit', 'talent'],
		makeDefault: true,
	});
}