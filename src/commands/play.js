const ytdl = require('ytdl-core');
const { createGuildSettings, play, finish, setSongInQueue } = require('../utils/songManager');

module.exports = {
	name: 'play',
	aliases: ['tocar'],
	run: async ({ message, messageStore, args, songStoreGuild, songStore, bot }) => {
		const memberConnection = message.member.voice.channel,
			botConnection = message.guild.me.voice.channel;

		if (!memberConnection) {
			return message.channel.send(messageStore.MemberIsNotOnVoiceChannel);
		} else if (botConnection && !botConnection.equals(memberConnection)) {
			return message.channel.send(messageStore.botIsAlreadyOnVoiceChannel);
		} else if (!memberConnection.permissionsFor(message.guild.me).has('CONNECT')) {
			return message.channel.send(messageStore.botNoPermissionConnect);
		} else if (!memberConnection.permissionsFor(message.guild.me).has('SPEAK')) {
			return message.channel.send(messageStore.botNoPermissionSpeak);
		} else if (args.length === 0) {
			return message.channel.send(messageStore.noArguments);
		} else {
			const { queue } = songStoreGuild;

			if (queue && queue.size > 0 && queue.map(i => i.url).includes(args[0])) {
				return message.channel.send(messageStore.musicAlreadyInQueue);
			} else {
				const video = await ytdl.getInfo(args[0]).catch(() => null);

				if (!video) {
					return message.channel.send(messageStore.noVideoFound);
				} else {
					const authorID = message.author.id,
						channelID = message.channel.id,
						{ video_url } = video;

					if (queue && queue.size > 0) {
						setSongInQueue(songStoreGuild, authorID, channelID, video);
						return message.channel.send(`A música ${video.title} foi adicionada na fila!`);
					} else {
						createGuildSettings(songStore, songStoreGuild, message.guild.id);
						setSongInQueue(songStoreGuild, authorID, channelID, video);
						play(bot, songStoreGuild, channelID, memberConnection, video);
						finish(bot, botConnection, songStoreGuild, video);
					}
				}
			}
		}
	}
}