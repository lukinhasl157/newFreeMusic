const { MessageEmbed } = require('discord.js');
const Guild = require('../database/Guild');
const { messageStore } = require('../utils/messages');
const cooldown = new Set();

module.exports = {
	run: async (message) => {
		if (message.author.bot || message.channel.type === 'dm') return;

		const guild = await Guild.findOne({ _id: message.guild.id }).catch(console.error),
			prefixDefault = process.env.PREFIX;

		if (!guild) {
			const newGuild = new Guild({ _id: message.guild.id });
      await newGuild.save().catch(console.error);
		}

		const prefix = (guild && guild.prefix) || prefixDefault;

		if (message.content.toLowerCase().startsWith(prefix)) {
			const args = message.content.slice(prefix.length).split(' '),
				songStore = message.client.songs,
				guildLanguage = messageStore[guild.language],
				songStoreGuild = songStore.get(message.guild.id) || {},
				commandName = args.shift().toLowerCase(),
				command = message.client.commands.get(commandName) ||
					message.client.commands.find(cmd => cmd.aliases.includes(commandName));

			if (command) {
				if (cooldown.has(message.author.id)) {
					const msg = await message.channel.send('Aguarde \`3s\` para executar este comando novamente.');
					return msg.delete({ timeout: 30 * 1000 }).catch(console.error);
				} else {
					Object.defineProperty(message, 'command', { value: command });
					command.run({ 
						bot: message.client,
						songStore,
						songStoreGuild,
						message,
						guild,
						guildLanguage,
						args,
						MessageEmbed,
					});
					cooldown.add(message.author.id);
					setTimeout(() => cooldown.delete(message.author.id), 3000);
				}
			}
		}
	}
}