const { createGuildSettings, play, finish, setSongInQueue, searchSong } = require('../utils/songManager');
const yt = require('scrape-youtube').default;

module.exports = {
	name: 'play',
	aliases: ['tocar'],
	run: async ({ message, guildLanguage, args, songStoreGuild, songStore, bot }) => {
		const memberConnection = message.member.voice.channel,
			botConnection = message.guild.me.voice.channel;

		if (!memberConnection) {
			return message.channel.send(guildLanguage.memberIsNotOnVoiceChannel);
		} else if (botConnection && !botConnection.equals(memberConnection)) {
			return message.channel.send(guildLanguage.botIsAlreadyOnVoiceChannel);
		} else if (!memberConnection.permissionsFor(message.guild.me).has('CONNECT')) {
			return message.channel.send(guildLanguage.botNoPermissionConnect);
		} else if (!memberConnection.permissionsFor(message.guild.me).has('SPEAK')) {
			return message.channel.send(guildLanguage.botNoPermissionSpeak);
		} else if (args.length === 0) {
			return message.channel.send(guildLanguage.noArguments);
		} else {
			const { queue } = songStoreGuild;
				author = message.author,
				channel = message.channel,
				guildID = message.guild.id,
				song = await yt.search(args.join(' '), { limit: 1 }).catch(console.error);

		  if (!song[0]) {
		    return channel.send(guildLanguage.noVideoFound);
		  } else {
	    	createGuildSettings(songStore, songStoreGuild, guildID);
	    	setSongInQueue(songStoreGuild, author.id, channel.id, song[0]);

				if (queue && queue.size > 0 && queue.has(song[0].id)) {
					message.channel.send(guildLanguage.musicAlreadyInQueue);
				} else {
					if (queue && queue.size > 0) {
						message.channel.send(`A música ${song[0].title} foi adicionada na fila!`);
					} else {
						play(bot, songStoreGuild, botConnection, memberConnection)
					}
				}
			}
		}
	}
}