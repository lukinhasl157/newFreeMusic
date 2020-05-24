
const { QueueStore } = require('./collections');
const ytdl = require('ytdl-core');

const createGuildSettings = (songStore, guildStoreSong, guildID) => {
	if (!guildStoreSong.queue) {
		guildStoreSong.queue = new QueueStore();
		guildStoreSong.id = guildID;
		guildStoreSong.volume = 1;
		guildStoreSong.resumed = null;
		guildStoreSong.dispatcher = null;
		guildStoreSong.repeat = false;
		guildStoreSong.connection = null;
	}
	songStore.set(guildID, guildStoreSong);
}

const dispatcher = async (guildStore) => {
	const { url } = guildStore.queue.first(),
		streamOptions = {
			volume: 1,
			highWaterMark: 1<<25,
			type: 'ogg/opus',
			bitrate: 'auto',
		};

	guildStore.dispatcher = await guildStore.connection
		.play(await ytdl(url, streamOptions));
}

const play = async (bot, guildStore, connection) => {
	const { textChannelID, name } = guildStore.queue.first();
	if (!guildStore.connection) {
		guildStore.connection = await connection.join().catch(console.error);
	}

	if (!guildStore.dispatcher) {
		dispatcher(guildStore);
	}

	const channel = bot.channels.cache.get(textChannelID);

	channel.send(`Tocando agora: ${name}`).catch(console.error);
}

const formatTime = (s) => {
	return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
}

const setSongInQueue = (guildStore, authorID, channelID, video) => {
	guildStore.queue.set(video.video_id, {
		name: video.title,
		url: video.video_url,
		id: video.video_id,
		duration: formatTime(video.length_seconds),
		author: authorID,
		textChannelID: channelID,
	});
}

const finish = (bot, botConnection, songStoreGuild, memberConnection) => {
	setTimeout(() => {
		songStoreGuild.dispatcher.on('finish', () => {
			const { textChannelID } = songStoreGuild.queue.first(),
				firstSong = songStoreGuild.queue.first();

			songStoreGuild.queue.delete(firstSong.id);

			if (songStoreGuild.queue.size > 0) {
				return play(bot, songStoreGuild, memberConnection);
			} else {
				console.log('finish');
				const channel = bot.channels.cache.get(textChannelID);

				if (botConnection) botConnection.leave();

				channel.send('As músicas acabaram.');
			}
		});
	}, 2000);
}

module.exports = { play, createGuildSettings, finish, setSongInQueue };