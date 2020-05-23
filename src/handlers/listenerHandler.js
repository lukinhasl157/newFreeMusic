const { readdirSync } = require('fs');
const { resolve } = require('path');

const loadListeners = (path, bot) => {
	const jsFiles = readdirSync(path, { withFileTypes: true })
		.filter(f => f.name.endsWith('.js'));

	for (const file of jsFiles) {
		const fullpath = resolve(path, file.name);
		const listenerName = file.name.replace('.js', '');
		const listener = require(fullpath);

		bot.on(listenerName, listener.run);
	}
	console.log(`Total de eventos carregados: (${jsFiles.length})`);
}

module.exports = { loadListeners };