import { MessageEmbed, Message } from 'discord.js'

export async function info (message: Message) {
  const embed: MessageEmbed = new MessageEmbed()

  embed.setThumbnail('https://polytoria.com/assets/catalog/12659.png')
  embed.setColor('#fe5953')
  embed.setTitle('Polytoria Community Bot')
  embed.setURL('https://discord.com/api/oauth2/authorize?client_id=905979909049028649&permissions=414464724032&scope=bot')
  embed.addField('Version', 'Running version 2.0.3')
  embed.addField('Invite our Bot', 'Tap the title to invite our bot directly to your server!')
  embed.addField('We are open-sourced!', 'https://github.com/Polytoria/Polytoria-Community-Bot')
  embed.addField('Rewritten by', 'Shiggy, DevPixels, baggy, and more!')
  embed.setFooter('Thanks to all collaberators of the project!')
  await message.channel.send({ embeds: [embed] })
}
