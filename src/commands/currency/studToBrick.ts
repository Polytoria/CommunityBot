import { Message, MessageEmbed } from 'discord.js'
import emojiUtils from '../../utils/emojiUtils.js'

export function studToBrick (message: Message, args: string[]): Promise<Message<boolean>> {
  const studs = parseInt(args[0])
  const bricks = Math.floor(studs / 15)
  const studRemoved = studs % 15

  const embed: MessageEmbed = new MessageEmbed({
    title: 'Studs to Bricks',
    color: '#ff5454',
    description: `**${studs} ${emojiUtils.stud} ↔️ ${bricks} ${emojiUtils.brick}**`,
    footer: {
      text: studRemoved === 0 ? 'All good 👍' : `⚠ ${studRemoved} studs will be removed while converting.`
    }
  })

  return message.channel.send({ embeds: [embed] })
}
