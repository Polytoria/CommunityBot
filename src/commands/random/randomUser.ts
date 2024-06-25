import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function randomUser (interaction: CommandInteraction): Promise<any> {
  const randomId = randomUtils.randomInt(1, 42260)
  const apiUrl = `https://api.polytoria.co/v1/users/${randomId}`

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
    return await randomUser(interaction)
  }

  const data = randomData.data
  const thumbnail = data.thumbnail
  let badges = ' '

  if (data.membershipType === 'plusDeluxe') {
    badges += emojiUtils.plusdeluxe + ' '
  }
  if (data.membershipType === 'plus') {
    badges += emojiUtils.plus + ' '
  }

  const embed = new EmbedBuilder({
    title: data.username + badges,
    url: `https://polytoria.co/users/${data.id}`,
    description: data.description,
    color: 0xFF5454,
    thumbnail: {
      url: `${thumbnail.avatar}`
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
      },
      {
        name: 'Place Visits',
        value: data.placeVisits.toLocaleString(),
        inline: true
      },
      {
        name: 'Profile Views',
        value: data.profileViews.toLocaleString(),
        inline: true
      },
      {
        name: 'Forum Posts',
        value: data.forumPosts.toLocaleString(),
        inline: true
      },
      {
        name: 'Asset Sales',
        value: data.assetSales.toLocaleString(),
        inline: true
      },
      {
        name: 'Networth',
        value: emojiUtils.brick + ' ' + data.netWorth.toLocaleString(),
        inline: true
      }
    ]
  })

  if (data.playing && data.playing.name) {
    const gameLink = `https://polytoria.co/places/${data.playing.placeID}`
    const playingMessage = emojiUtils.playing + `** Currently playing [${data.playing.name}](${gameLink})**`
    embed.setDescription(playingMessage + '\n\n' + data.description)
  }

  const redoButton = new ButtonBuilder()
    .setLabel('Re-do Randomize')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('redo_button')

  const actionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://polytoria.co/users/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle(ButtonStyle.Link),
      redoButton
    )

  return {
    embeds: [embed],
    components: [actionRow]
  }
}
