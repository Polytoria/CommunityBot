import { Message, MessageEmbed } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'

export async function randomUser (message: Message, args: string[]) {
  const randomData = await randomUtils.randomize('https://api.polytoria.com/v1/users/find', function (response: any) {
    return true
  }, function () {
    return { id: randomUtils.randomInt(1, 20000) }
  }, 20)

  if (randomData == null) {
    return message.channel.send('User not found, Please try again..')
  }

  const data = randomData.data.user

  const embed = new MessageEmbed({
    title: data.username,
    url: `https://polytoria.com/user/${data.id}`,
    description: data.description,
    color: '#ff5454',
    thumbnail: {
      url: `${data.avatarUrl}`
    },
    fields: [
      {
        name: 'User ID',
        value: data.id.toString(),
        inline: true
      },
      {
        name: 'Joined At',
        value: dateUtils.atomTimeToDisplayTime(data.registeredAt),
        inline: true
      },
      {
        name: 'Last seen at',
        value: dateUtils.atomTimeToDisplayTime(data.lastSeenAt),
        inline: true
      }
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
