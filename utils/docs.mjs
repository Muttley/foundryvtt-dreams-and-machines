import fs from "fs";
import { markdown } from "markdown";

import stringify from "json-stable-stringify-pretty";

const docs = [];

function compileDocs(cb) {
	for (const doc of docs) {
		const source = fs.readFileSync(doc.src, "utf8");
		const html = markdown.toHTML(source, "Maruku");

		const journalJson = fs.readFileSync(doc.dst, "utf8");
		const journal = JSON.parse(journalJson);
		journal.text.content = `${html}`;

		let jsonData = stringify(journal, {space: "\t", undef: true});
		jsonData += "\n";

		fs.writeFileSync(doc.dst, jsonData);
	}

	cb();
}
export const compile = compileDocs;
