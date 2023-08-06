import { Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function place (message: Message, args: string[]) {
  const placeID = parseInt(args[0])

  if (args.length === 0) {
    return message.reply('Please provide me with a place ID before I can continue!')
  }

  const response = await axios.get(`https://api.polytoria.com/v1/places/${placeID}`, { validateStatus: () => true })
  const data = response.data
  const rating = data.rating
  const creator = data.creator

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  let externalDesc = ''

  if (data.isActive === false) {
    externalDesc += `${emojiUtils.warning}  This place is currently private. Only the creator can join it.\n`
  }

  externalDesc += '\n\n'

  if (data.description === '') {
    externalDesc += '*No description set.*'
  } else {
    externalDesc += data.description
  }

  const embed = new MessageEmbed({
    title: (data.name + ' ' + (data.isFeatured === true ? emojiUtils.star : '')),
    description: externalDesc,
    thumbnail: {
      url: `${data.thumbnail}`
    },
    url: `https://polytoria.com/places/${data.id}`,
    color: '#ff5454',
    image: {
    },
    fields: [
      {
        name: 'Creator',
        value: `[${creator.name}](https://polytoria.com/users/${creator.id})`,
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

  // Create the action row and button
  const actionRow = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(`https://polytoria.com/places/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle('LINK')
    )

  return message.reply({
    embeds: [embed],
    components: [actionRow]
  })
}
