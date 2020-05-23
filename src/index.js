require('dotenv/config');

const { loadCommands } = require('./handlers/commandHandler');
const { loadListeners } = require('./handlers/listenerHandler');
const { Client } = require('discord.js');
const { CommandStore, SongStore } = require('./utils/collections');
const bot = new Client({ fetchAllMembers: true });

bot.commands = new CommandStore();
bot.songs = new SongStore();

bot.login().catch((e) => console.error(e) && process.exit(1));

bot.on('shardReconnecting', () => console.log('Client is reconnecting...'))
bot.on('shardDisconnected', () => console.log('Client is disconnecting...') && process.exit(1));
bot.on('unhandledRejection', (e) => console.error('Uncaught Promise Error:', e));

loadCommands('./src/commands', bot.commands);
loadListeners('./src/listeners', bot);