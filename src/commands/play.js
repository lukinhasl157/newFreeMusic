const { createGuildSettings, play, finish, setSongInQueue, searchSong } = require('../utils/songManager');
const yt = require('scrape-youtube').default;

module.exports = {
	name: 'play',
	aliases: ['tocar'],
	run: async ({ message, guildLanguage, args, songStoreGuild, songStore, bot }) => {
		const memberConnection = message.member.voice.channel,
			botConnection = message.guild.me.voice.channel;

		if (!memberConnection) {
			return message.channel.send(guildLanguage.MemberIsNotOnVoiceChannel);
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
				songs = await yt.search(args.join(' '), { limit: 3 }).catch(console.error);

		  if (songs.length === 0) {
		    return channel.send(guildLanguage.noVideoFound);
		  } else {
				const emojis = ['1️⃣', '2️⃣', '3️⃣', '❌'],
			  	msg = await channel.send('Selecione um número de 1️⃣  a 3️⃣ ' + 
			  	'para selecionar o número corespondente a música \n' +
			    songs.map(i => `[${songs.indexOf(i).toString().split('').map(i => emojis[i])}] - ${i.title}`)
			    	.join('\n'));

			  for (const i of emojis) msg.react(i);

			  let selected = null;
			  const filter = (r, u) => emojis.includes(r.emoji.name) && u.equals(author),
			    collector = msg.createReactionCollector(filter, { max: 1, time: 60 * 1000 });

			  collector.on('collect', async (r) => {
			    msg.delete();
			    switch (r.emoji.name) {
			      case '1️⃣': {
			        selected = songs[0];
			        break;
			      }
			      case '2️⃣': {
			        selected = songs[1];
			        break;
			      }
			      case '3️⃣': {
			        selected = songs[2];
			        break;
			      }
			      case '❌': {
			        selected = false;
			        break;
			      }
			    }
			    
			    if (!selected) {
			      return message.channel.send(guildLanguage.musicSelectionCancelled);
			    } else {
			    	createGuildSettings(songStore, songStoreGuild, guildID);
			    	setSongInQueue(songStoreGuild, author.id, channel.id, selected);

						if (queue && queue.size > 0 && queue.has(song.id)) {
							message.channel.send(guildLanguage.musicAlreadyInQueue);
						} else {
							if (queue && queue.size > 0) {
								message.channel.send(`A música ${song.title} foi adicionada na fila!`);
							} else {
								play(bot, songStoreGuild, botConnection, memberConnection)
							}
						}
					}
			  });
		  }
		}
	}
}