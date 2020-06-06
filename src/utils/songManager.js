
const { QueueStore } = require('./collections');
const { messageStore } = require('./messages');
const ytdl = require('ytdl-core-discord');

const createGuildSettings = (songStore, guildStoreSong, guildID) => {
	if (!guildStoreSong.queue) {
		guildStoreSong.queue = new QueueStore();
		guildStoreSong.id = guildID;
		guildStoreSong.volume = 0.5;
		guildStoreSong.resumed = null;
		guildStoreSong.dispatcher = null;
		guildStoreSong.repeat = false;
		guildStoreSong.connection = null;
	}
	songStore.set(guildID, guildStoreSong);
}

const dispatcher = async (guildStore, bot, botConnection, memberConnection) => {
	const { url } = guildStore.queue.first(),
		streamOptions = {
			volume: guildStore.volume,
			type: 'opus',
			bitrate: 'auto',
		};

	guildStore.dispatcher = await guildStore.connection
		.play(await ytdl(url), streamOptions)
		.on('finish', () => {
			finish(bot, botConnection, guildStore, guildStore);
		}).on('error', (e) => console.error(e));
}

const play = async (bot, guildStore, botConnection, memberConnection) => {
	const { textChannelID, name } = guildStore.queue.first(),
		channel = bot.channels.cache.get(textChannelID);

	if (!guildStore.connection) {
		guildStore.connection = await memberConnection.join().catch(console.error);
	}

	if (!guildStore.dispatcher) dispatcher(guildStore, bot, botConnection, memberConnection)
	channel.send(`Now playing: ${name}`);
}

const formatTime = (s) => {
	return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
}

const setSongInQueue = (guildStore, authorID, channelID, video) => {
	guildStore.queue.set(video.id, {
		name: video.title,
		url: video.link,
		thumbnail: video.thumbnail,
		id: video.id,
		duration: formatTime(video.duration),
		author: authorID,
		textChannelID: channelID,
	});
}

const finish = (bot, botConnection, songStoreGuild, memberConnection) => {
	songStoreGuild.dispatcher.on('finish', () => {
		const firstSong = songStoreGuild.queue.first(),
			{ textChannelID } = firstSong;

		songStoreGuild.queue.delete(firstSong.id);

		if (songStoreGuild.queue.size > 0) {
			return play(bot, songStoreGuild, memberConnection);
		} else {
			const channel = bot.channels.cache.get(textChannelID);

			if (botConnection) botConnection.leave();

			channel.send('The song has ended.');
		}
	});
}

module.exports = { play, createGuildSettings, finish, setSongInQueue };