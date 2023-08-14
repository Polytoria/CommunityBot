import { EmbedBuilder, Message } from 'discord.js'

export async function info (message: Message) {
  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xFF5454)
    .setTitle('Polytoria Community Bot')
    .setURL('https://discord.com/api/oauth2/authorize?client_id=905979909049028649&permissions=414464724032&scope=bot')
    .setThumbnail('https://starmanthegamer.com/icon.png')
    .addFields(
      { name: 'Version', value: 'Currently running version: ' },
      { name: 'Invite our Bot', value: 'Tap the title to invite our bot directly to your server!', inline: true },
      { name: 'We are open-sourced!', value: 'https://github.com/Polytoria/Polytoria-Community-Bot', inline: true },
      { name: 'Rewritten by', value: 'Shiggy, DevPixels, baggy, and more!', inline: true }
    )
    .setFooter({ text: 'Thank you for using Polytoria Community Bot!', iconURL: 'https://starmanthegamer.com/icon.png' });

  await message.channel.send({ embeds: [embed] })
}