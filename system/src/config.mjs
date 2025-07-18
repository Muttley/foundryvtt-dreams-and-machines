export const SYSTEM_ID = "dreams-and-machines";
export const SYSTEM_NAME = "Dreams and Machines";

export const DREAMS = {};

globalThis.systemPath = path => `systems/${SYSTEM_ID}/${path ?? ""}`;
globalThis.templatePath = path => path ? systemPath(`templates/${path}.hbs`) : systemPath("templates");

const TOOLTIP_TEMPLATES = [
	"edit-delete-mouse-controls",
];

DREAMS.ARMOR_QUALITIES = {
	bulky: "DNM.QualityName.bulky",
	environment: "DNM.QualityName.environment",
	handy: "DNM.QualityName.handy",
	mobile: "DNM.QualityName.mobile",
	powered_bed: "DNM.QualityName.powered_bed",
	powered_break: "DNM.QualityName.powered_break",
	scary: "DNM.QualityName.scary",
};


DREAMS.ATTRIBUTES = {
	might: "DNM.Attributes.Might",
	quickness: "DNM.Attributes.Quickness",
	insight: "DNM.Attributes.Insight",
	resolve: "DNM.Attributes.Resolve",
};


DREAMS.EXHAUSTION = {
	Breathless: "DNM.Exhaustion.Breathless",
	Confused: "DNM.Exhaustion.Confused",
	Despairing: "DNM.Exhaustion.Despairing",
	Weary: "DNM.Exhaustion.Weary",
};


DREAMS.ITEM_CATEGORIES = {
	Domestic: "DNM.ItemCategories.Domestic",
	HandMade: "DNM.ItemCategories.HandMade",
	Industrial: "DNM.ItemCategories.Industrial",
	Military: "DNM.ItemCategories.Military",
	Miscellaneous: "DNM.ItemCategories.Miscellaneous",
	Security: "DNM.ItemCategories.Security",
};


DREAMS.JOURNAL_UUIDS = {
	releaseNotes: "Compendium.dreams-and-machines.system_documentation.JournalEntry.8mzM4axnEkXJTu6s",
};


DREAMS.NPC_WEAPON_TYPES = {
	Melee: "DNM.Labels.Weapon.Melee",
	Ranged: "DNM.Labels.Weapon.Ranged",
};


DREAMS.OFFICIAL_SOURCES = {
	EchoesOfAnAncientEnemy: "DNM.Sources.EchoesOfAnAncientEnemy",
	EmertaValo: "DNM.Sources.EmertaValo",
	GamemastersGuide: "DNM.Sources.GamemastersGuide",
	GMToolkit: "DNM.Sources.GMToolkit",
	HandsOnResearch: "DNM.Sources.HandsOnResearch",
	HomeIsWhereTheThreatIs: "DNM.Sources.HomeIsWhereTheThreatIs",
	PlayersGuide: "DNM.Sources.PlayersGuide",
	PoisonedWaters: "DNM.Sources.PoisonedWaters",
	QuickstartGuide: "DNM.Sources.QuickstartGuide",
	ShadowsInTheDaylight: "DNM.Sources.ShadowsInTheDaylight",
	StarterSet: "DNM.Sources.StarterSet",
};


DREAMS.SKILLS = {
	move: "DNM.Skills.Move",
	fight: "DNM.Skills.Fight",
	sneak: "DNM.Skills.Sneak",
	talk: "DNM.Skills.Talk",
	operate: "DNM.Skills.Operate",
	study: "DNM.Skills.Study",
	survive: "DNM.Skills.Survive",
};


DREAMS.VEHICLE_COVER_TYPES = {
	enclosed: "DNM.VehicleCover.enclosed",
	covered_x: "DNM.VehicleCover.covered_x",
	exposed: "DNM.VehicleCover.exposed",
};


DREAMS.VEHICLE_QUALITIES = {
	cumbersome: "DNM.QualityName.cumbersome",
	high_performance: "DNM.QualityName.high_performance",
	hover: "DNM.QualityName.hover",
	resilient_x: "DNM.QualityName.resilient_x",
	rugged: "DNM.QualityName.rugged",
	single_seat: "DNM.QualityName.single_seat",
	tough_x: "DNM.QualityName.tough_x",
};


DREAMS.WEAPON_QUALITIES = {
	ammo: "DNM.QualityName.ammo",
	breaker: "DNM.QualityName.breaker",
	burst: "DNM.QualityName.burst",
	heavy: "DNM.QualityName.heavy",
	long_ranged: "DNM.QualityName.long_ranged",
	loud: "DNM.QualityName.loud",
	mine: "DNM.QualityName.mine",
	non_lethal: "DNM.QualityName.non_lethal",
	powered_bed: "DNM.QualityName.powered_bed",
	powered_break: "DNM.QualityName.powered_break",
	powered_breather: "DNM.QualityName.powered_breather",
	powered_special: "DNM.QualityName.powered_special",
	quiet: "DNM.QualityName.quiet",
	scary: "DNM.QualityName.scary",
};


DREAMS.WEAPON_TYPES = {
	Melee: "DNM.Labels.Weapon.Melee",
	Ranged: "DNM.Labels.Weapon.Ranged",
	MeleeRanged: "DNM.Labels.Weapon.MeleeRanged",
};


export function generateSortedData() {
	dreams.log("Generating sorted config data");
	DREAMS.ATTRIBUTES_SORTED = [];
	for (let attribute in DREAMS.ATTRIBUTES) {
		DREAMS.ATTRIBUTES_SORTED.push({
			key: attribute,
			name: DREAMS.ATTRIBUTES[attribute],
		});
	}
	DREAMS.ATTRIBUTES_SORTED.sort((a, b) => a.name.localeCompare(b.name));


	DREAMS.SKILLS_SORTED = [];
	for (let skill in DREAMS.SKILLS) {
		DREAMS.SKILLS_SORTED.push({
			key: skill,
			name: DREAMS.SKILLS[skill],
		});
	}
	DREAMS.SKILLS_SORTED.sort((a, b) => a.name.localeCompare(b.name));
}


export function renderTooltips() {
	dreams.log("Pre-rendering tooltips");

	DREAMS.TOOLTIPS = {};

	TOOLTIP_TEMPLATES.forEach(async name => {
		dreams.debug(`Pre-rendering tooltip '${name}'`);
		const template = templatePath(`tooltip/${name}`);
		DREAMS.TOOLTIPS[name] = await foundry.applications.handlebars.renderTemplate(template);
	});
}
