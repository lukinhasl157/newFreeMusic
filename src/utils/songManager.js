
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

const dispatcher = async (guildStore, url) => {
	const streamOptions = {
		volume: 1, 
		highWaterMark: 1<<25, 
		type: 'ogg/opus', 
		bitrate: 'auto', 
	};
	guildStore.dispatcher = await guildStore.connection
		.play(await ytdl(url, streamOptions));
}

const play = async (bot, guildStore, channelID, connection, video) => {
	if (!guildStore.connection) {
		guildStore.connection = await connection.join().catch(console.error);
	}

	if (!guildStore.dispatcher) {
		dispatcher(guildStore, video.video_url);
	}

	const channel = bot.channels.cache.get(channelID);

	channel.send(`Tocando agora: ${video.title}`).catch(console.error);
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

const finish = (songStoreGuild) => {
	songStoreGuild.dispatcher.on('finish', () => {
		const { textChannelID } = songStoreGuild.queue.first(),
		const firstSong = songStoreGuild.queue.first();
		
		songsongStoreGuild.queue.delete(firstSong.id);

		if (songStoreGuild.songs.size > 0) {
			return play(bot, songStoreGuild, video, authorID, channelID, memberConnection, video.video_url);
		} else {
			const channel = message.guild.channels.cache.get(textChannelID);

			if (botConnection) botConnection.leave();

			return channel.send('As músicas acabaram.');
		}
	});
}

module.exports = { play, createGuildSettings, finish, setSongInQueue };