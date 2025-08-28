import DnMActorSheetV2 from "../DnMActorSheetV2.mjs";
import DnMRoller from "../../dice/DnMRoller.mjs";

export default class MajorNPCSheetV2 extends DnMActorSheetV2 {

	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			onRollMajorAction: this._onRollMajorAction,
		},
		classes: ["npc"],
		form: {
			submitOnChange: true,
		},
		position: {
			width: 700,
		},
	};


	/** @override */
	static PARTS = {
		header: {
			template: templatePath("_shared-partials/header"),
		},
		tabs: {
			template: templatePath("_shared-partials/tabs"),
		},
		abilities: {
			template: templatePath("actor/major-npc/abilities-tab"),
			templates: [
				"actor/_shared-partials/special-abilities",
				"actor/major-npc/_partials/major-npc-actions",
				"actor/_shared-partials/custom-string-list",
			].map(path => templatePath(path)),
			classes: ["scrollable"],
		},
		attributes: {
			template: templatePath("actor/major-npc/attributes-tab"),
			templates: [
				"_shared-partials/number-field",
				"actor/_shared-partials/attributes",
				"actor/_shared-partials/custom-string-list",
				"actor/_shared-partials/skills",
				"actor/major-npc/_partials/injuries",
				"actor/major-npc/_partials/threat",
			].map(path => templatePath(path)),
			classes: ["scrollable"],
		},
		description: {
			template: templatePath("_shared-partials/description-tab"),
			classes: ["scrollable"],
		},
		source: {
			template: templatePath("_shared-partials/source-tab"),
		},
	};


	get allowedItems() {
		return [
			"major_npc_action",
			"special_ability",
		];
	}


	static async _onRollMajorAction(event, target) {
		event.preventDefault();
		const [, max] = await this._getMajorNpcActionsRollRange();

		const roll = await DnMRoller.performRoll(`d${max}`);

		const result = parseInt(roll.result);

		const rolledMajorActions = [];
		for (const action of this.actor.majorNpcActions) {
			const rollRange = action.system.roll;

			if (result <= rollRange.max && result >= rollRange.min) {
				rolledMajorActions.push(action);
			}
		}

		for (const action of rolledMajorActions) {
			await action.sendToChat();
			await action.triggerMajorNpcActionRoll();
		}
	}


	/** @override */
	async _prepareContext(options={}) {
		const context = await super._prepareContext(options);

		return context;
	}


	async _getMajorNpcActionsRollRange(context) {
		let min = Infinity;
		let max = -Infinity;

		for (const action of this.actor.majorNpcActions) {
			min = min < action.system.roll.min ? min : action.system.roll.min;
			max = max > action.system.roll.max ? max : action.system.roll.max;
		}

		return [min, max];
	}


	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);

		switch (partId) {
			case "attributes":
				this.getAttributesAndSkillsData(context);
				break;
		}

		return context;
	}
}
