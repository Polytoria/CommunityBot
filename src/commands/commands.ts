import { MessageEmbed, Message } from 'discord.js'

export async function commands (message: Message) {
  const embed: MessageEmbed = new MessageEmbed()

  embed.setThumbnail('https://starmanthegamer.com/icon.png')
  embed.setColor('#fe5953')
  embed.setTitle('This command is currently unavailable.')
  embed.addField('What happened?', 'Polytoria has revamped their entire website, and we rely on APIs to access the information we serve to you. With those APIs currently being unavailable, we cannot serve you the requested command.')
  embed.addField('When will this command return?', 'In the future when the API for this command returns.')
  await message.channel.send({ embeds: [embed] })
}
