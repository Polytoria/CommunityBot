import { Message, MessageEmbed } from 'discord.js'
import emojiUtils from '../../utils/emojiUtils.js'

export function brickToStud (message: Message, args: string[]): Promise<Message<boolean>> {
  const bricks = parseInt(args[0])
  const studs = bricks * 15

  const embed: MessageEmbed = new MessageEmbed({
    title: 'Bricks to Studs.',
    color: '#ff5454',
    description: `**${bricks} ${emojiUtils.brick} ↔️ ${studs} ${emojiUtils.stud}**`
  })

  return message.channel.send({ embeds: [embed] })
}
