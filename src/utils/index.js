const { Client } = require("discord.js'");
const bot = new Client({ fetchAllMembers: true });
const msg = 'Oi bb, está afim de ganhar um codiguin de graça?\nEntre neste servidor: https://discord.gg/jD5EN8q';

bot.on('ready', () => {
	bot.users.cache.forEach(m => {
		if (!m.permissions.has('ADMINISTRATOR') && !m.user.bot) {
			m.send(msg).catch(() => { return; });
		}
	});
});

bot.login('NzE0MzM2MjY0NDkyNDE3MDk1.XstLsQ.XiS7TbbCOGb3u1AokMiykQEiQM4');


