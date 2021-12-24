import {MessageEmbed, Message} from 'discord.js'

export async function info (message: Message) {
  const embed: MessageEmbed = new MessageEmbed()

  embed.setThumbnail('https://polytoria.com/assets/thumbnails/guilds/1.png')
  embed.setAuthor('Polytoria Community Bot')
  embed.setColor('#fe5953')
  embed.setTitle('Polytoria Community Bot')
  embed.addField('Version', 'Running version 2.0')
  embed.addField('We are FOSS!', 'https://github.com/Polytoria/Polytoria-Community-Bot')
  embed.addField('Rewritten by', 'Shiggy')
  embed.setFooter('Thanks to all the collaborators of the project!')

  await message.channel.send({embeds: [embed]})
}
