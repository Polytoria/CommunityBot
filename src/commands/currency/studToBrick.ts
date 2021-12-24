import {Message, MessageEmbed} from 'discord.js'

export function studToBrick (message: Message, args: string[]): Promise<Message<boolean>> {
  const studs = parseInt(args[0])
  const bricks = Math.floor(studs / 15)
  const studRemoved = studs % 15

  const embed: MessageEmbed = new MessageEmbed({
    title: 'Studs to Bricks!',
    color: '#ff5454',
    fields: [
      {
        name: 'studs',
        value: studs.toLocaleString(),
        inline: true
     },
      {
        name: 'bricks',
        value: bricks.toLocaleString(),
        inline: true
     }
    ],
    description: `**${studs} <:stud:905987085347983411> ↔️ ${bricks} <:brick:905987077995376640>**`,
    footer: {
      text: studRemoved === 0 ? 'No warnings.' : `⚠ ${studRemoved} studs will be removed while converting.`
   }
 })

  return message.channel.send({embeds: [embed]})
}
