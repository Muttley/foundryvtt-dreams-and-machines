export const SYSTEM_ID = "dreams-and-machines";
export const SYSTEM_NAME = "Dreams and Machines";

export const DREAMS = {};

globalThis.systemPath = path => `systems/${SYSTEM_ID}/${path ?? ""}`;
globalThis.templatePath = path => path ? systemPath(`templates/${path}.hbs`) : systemPath("templates");


DREAMS.ATTRIBUTES = {
	insight: "DNM.Attributes.Insight",
	might: "DNM.Attributes.Might",
	quickness: "DNM.Attributes.Quickness",
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
	fight: "DNM.Skills.Fight",
	move: "DNM.Skills.Move",
	operate: "DNM.Skills.Operate",
	sneak: "DNM.Skills.Sneak",
	study: "DNM.Skills.Study",
	survive: "DNM.Skills.Survive",
	talk: "DNM.Skills.Talk",
};


DREAMS.WEAPON_QUALITIES = {
	ammo: "DNM.QualityName.ammo",
	breaker: "DNM.QualityName.breaker",
	burst: "DNM.QualityName.burst",
	long_ranged: "DNM.QualityName.long_ranged",
	loud: "DNM.QualityName.loud",
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
