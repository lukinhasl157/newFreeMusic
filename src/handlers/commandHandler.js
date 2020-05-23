const { readdirSync } = require('fs');
const { resolve } = require('path');

const loadCommands = (path, collection) => {
	const jsFiles = readdirSync(path, { withFileTypes: true })
		.filter(f => f.name.endsWith('.js'));

	for (const file of jsFiles) {
		const fullpath = resolve(path, file.name);
		const commandName = file.name.replace('.js', '');
		const command = require(fullpath);

		collection.set(commandName, command);
	}
	console.log(`Total de comandos carregados: (${jsFiles.length})`);
}

module.exports = { loadCommands };