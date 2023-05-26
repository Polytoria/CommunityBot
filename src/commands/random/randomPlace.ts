import { Message, MessageEmbed } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function randomPlace(message: Message, args: string[]) {
  const randomId = randomUtils.randomInt(1, 5200)
  const apiUrl = `https://api.polytoria.com/v1/places/${randomId}`

  console.log('Fetching data from:', apiUrl)

  const randomData = await randomUtils.randomize(
    apiUrl,
    function (response: any) {
      console.log('Response:', response)
      return response.data
    },
    function () {
      return { id: randomId }
    },
    20
  )

  if (!randomData || !randomData.data) {
    return message.channel.send('Place not found, please try again.')
  }

  const data = randomData.data
  const rating = data.rating
  const creator = data.creator

  const embed = new MessageEmbed({
    title: data.name + (data.isFeatured === true ? emojiUtils.star : ''),
    description: data.description,
    thumbnail: {
      url: `${data.thumbnail}`
    },
    url: `https://polytoria.com/places/${data.id}`,
    color: '#ff5454',
    image: {},
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

  console.log('Embed:', embed)

  return message.channel.send({ embeds: [embed] })
}