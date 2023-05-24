import { Message, MessageEmbed } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function randomGame (message: Message, args: string[]) {
  const randomData = await randomUtils.randomize('https://api.polytoria.com/v1/places/', function (response: any) {
    return response.data.isActive
  }, function () {
    return { id: randomUtils.randomInt(1, 5200) }
  }, 20)

  if (randomData == null) {
    return message.channel.send('Game not found, Please try again..')
  }

  const data = randomData.data
  const rating = data.rating
  const creator = data.creator

  const embed = new MessageEmbed({
    title: (data.name + ' ' + (data.isFeatured === true ? emojiUtils.star : '')),
    description: data.description,
    thumbnail: {
      url: `${data.icon}`
    },
    url: `https://polytoria.com/places/${data.id}`,
    color: '#ff5454',
    image: {
    },
    fields: [
      {
        name: 'Creator',
        value: `[${creator.name}](https://polytoria.com/user/${creator.id})`,
        inline: true
      },
      {
        name: 'Visits',
        value: data.visits.toLocaleString(),
        inline: true
      },
      {
        name: 'Likes',
        value: rating.likes.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Dislikes',
        value: rating.dislikes.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Genre',
        value: data.genre.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Max Players',
        value: data.maxPlayers.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Playing',
        value: data.playing.toLocaleString() || 'N/A',
        inline: true
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.createdAt),
        inline: true
      },
      {
        name: 'Updated At',
        value: dateUtils.atomTimeToDisplayTime(data.updatedAt),
        inline: true
      }
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
