export function registerHandlebarsHelpers() {

	Handlebars.registerHelper("fromConfig", function(arg1, arg2) {
		return CONFIG.DREAMS[arg1][arg2] ? CONFIG.DREAMS[arg1][arg2] : arg2;
	});

	Handlebars.registerHelper("fromSettings", function(arg1) {
		return game.settings.get(SYSTEM_ID, arg1);
	});

	Handlebars.registerHelper("select", function(selected, options) {
		const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected));
		const rgx = new RegExp(` value=["']${escapedValue}["']`);
		const html = options.fn(this);
		return html.replace(rgx, "$& selected");
	});

}
