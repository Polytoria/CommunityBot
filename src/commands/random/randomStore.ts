import { Message, MessageEmbed } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function randomStore (message: Message, args: string[]) {
  const randomId = randomUtils.randomInt(7674, 26081)
  const apiUrl = `https://api.polytoria.com/v1/store/${randomId}`

  const randomData = await randomUtils.randomize(
    apiUrl,
    function (response: any) {
      return response.data
    },
    function () {
      return { id: randomId }
    },
    20
  )

  if (randomData == null) {
    return message.channel.send('Store item not found, Please try again..')
  }

  const data = randomData.data
  const creator = data.creator

  let thumbnailURL = data.thumbnail

  // Check if the asset type is "audio" and set a specific link as the thumbnail
  if (data.type.toLowerCase() === 'audio') {
    thumbnailURL = 'https://c0.ptacdn.com/static/images/placeholders/audio.88cff071.png'
  }

  const embed = new MessageEmbed({
    title: data.name + ' ' + (data.isLimited === true ? emojiUtils.star : ''),
    description: data.description === '' ? 'No description set.' : data.description,
    url: `https://polytoria.com/store/${data.id}`,
    thumbnail: {
      url: thumbnailURL
    },
    color: '#ff5454',
    fields: [
      {
        name: 'Creator',
        value: creator.name,
        inline: true
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.createdAt),
        inline: true
      }
    ]
  })

  const assetType = data.type.toLowerCase()
  if (!['audio', 'decal', 'meshes'].includes(assetType)) {
    embed.fields.push(
      {
        name: 'Price',
        value: data.price.toString(),
        inline: true
      },
      {
        name: 'Sales',
        value: data.sales.toString(),
        inline: true
      }
    )
  }

  return await message.channel.send({ embeds: [embed] })
}
