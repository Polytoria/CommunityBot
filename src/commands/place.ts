import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js'
import { responseHandler } from '../utils/responseHandler.js'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function place (interaction: CommandInteraction) {
  // @ts-expect-error
  const placeID = interaction.options.getInteger('id')

  if (!placeID) {
    return await interaction.reply('Please provide me with a place ID before I can continue!')
  }

  await interaction.deferReply()

  // Fetch data using `fetch`
  const response = await fetch(`https://api.polytoria.com/v1/places/${placeID}`)
  const errResult = await responseHandler.checkError(response)

  // Handle errors
  if (errResult.hasError && errResult.embed) {
    return await interaction.editReply({ embeds: [errResult.embed] })
  }

  // Parse JSON response
  const data = await response.json()
  const rating = data.rating
  const creator = data.creator

  let externalDesc = ''
  let accessMessage = ''

  if (!data.isActive) {
    externalDesc += `${emojiUtils.private} **This place is currently private. Only the creator can join it.**\n`
  } else {
    switch (data.accessType) {
      case 'everyone':
        accessMessage = `${emojiUtils.public} **This place is currently joinable by everyone!**`
        break
      case 'purchase': {
        const accessPrice = data.accessPrice || 0
        accessMessage = `${emojiUtils.brick} **This place requires payment of ${accessPrice.toLocaleString()} bricks.**`
        break
      }
      case 'whitelist':
        accessMessage = `${emojiUtils.request} **This place is currently whitelisted.**`
        break
      default:
        break
    }
  }

  externalDesc += '\n'

  if (!data.description) {
    externalDesc += '*No description set.*'
  } else {
    externalDesc += data.description
  }

  const embed = new EmbedBuilder({
    title: data.name + (data.isFeatured ? ` ${emojiUtils.star}` : ''),
    description: `${accessMessage}\n${externalDesc}`,
    thumbnail: {
      url: `${data.thumbnail}`
    },
    url: `https://polytoria.com/places/${data.id}`,
    color: 0xFF5454,
    fields: [
      {
        name: 'Creator',
        value:
          creator.type === 'guild'
            ? `[${creator.name}](https://polytoria.com/guilds/${creator.id})`
            : `[${creator.name}](https://polytoria.com/users/${creator.id})`,
        inline: true
      },
      { name: 'Visits', value: data.visits.toLocaleString(), inline: true },
      { name: 'Likes', value: rating.likes.toLocaleString() || 'N/A', inline: true },
      { name: 'Dislikes', value: rating.dislikes.toLocaleString() || 'N/A', inline: true },
      { name: 'Genre', value: data.genre || 'N/A', inline: true },
      { name: 'Max Players', value: data.maxPlayers.toLocaleString() || 'N/A', inline: true },
      { name: 'Playing', value: data.playing.toLocaleString() || 'N/A', inline: true },
      { name: 'Created At', value: dateUtils.atomTimeToDisplayTime(data.createdAt), inline: true },
      { name: 'Updated At', value: dateUtils.atomTimeToDisplayTime(data.updatedAt), inline: true }
    ]
  })

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setURL(`https://polytoria.com/places/${data.id}`)
      .setLabel('View on Polytoria')
      .setStyle(ButtonStyle.Link)
  )

  return await interaction.editReply({
    embeds: [embed],
    components: [actionRow]
  })
}
