const { inspect } = require('util');
const value = (l, c) => `\`\`\`${l}\n${String(c).slice(0, 1000) + (c.length >= 1000 ? '...' : '')}\n\`\`\``.replace(process.env.DISCORD_TOKEN, () => '*'.repeat(process.env.DISCRD_TOKEN.length));

module.exports = {
  name: 'eval',
  aliases: ['evaluate', 'code'],
  category: 'Normais',
  description: 'Executar um código',
  run: ({ message, bot, args, guild, MessageEmbed, messageStore, songStore, guildStoreSong }) => {
    const { developers } = require('../utils/devs');

    if (!developers.includes(message.author.id)) {
      return message.channel.send(`**${message.author.username}** | Este comando é exclusivo para desenvolvedores do bot.`);
    } else if (args.length === 0) {
      return message.channel.send(`**${message.author.username}** | Insira um código.`);
    } else {
      const code = args.join(' ').replace(/^```(js|javascript ?\n)?|```$/g, ''),
        embed = new MessageEmbed();
      try {
        const resultEval = eval(code),
          toEval = typeof resultEval === 'string' ? resultEval : inspect(resultEval, { depth: 0 });

        embed.addField('Resultado', value('js', toEval));
        embed.addField('Código', value('js', code));
        embed.addField('Tipo', value('css', typeof resultEval));
        embed.setColor('GREEN');
      } catch (error) {
        embed.addField('Erro', value('js', error));
        embed.addField('Código', value('js', code));
        embed.setColor('RED');
      } finally {
        message.channel.send(embed);
      }
    }
  },
};
