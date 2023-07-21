import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function store (message: Message, args: string[]) {
  const assetID = parseInt(args[0])

  const response = await axios.get(`https://api.polytoria.com/v1/store/${assetID}`, {
    validateStatus: () => true
  })
  const data = response.data
  const creator = data.creator

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  let thumbnailURL = data.thumbnail

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
  if (!['audio', 'decal', 'mesh'].includes(assetType)) {
    embed.fields.push(
      {
        name: 'Price',
        value: emojiUtils.brick + ' ' + data.price.toString(),
        inline: true
      },
      {
        name: 'Sales',
        value: data.sales.toString(),
        inline: true
      }
    )
  }

  // Create the action row and button
  const actionRow = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(`https://polytoria.com/store/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle('LINK')
    )

  return message.reply({
    embeds: [embed],
    components: [actionRow]
  })
}
