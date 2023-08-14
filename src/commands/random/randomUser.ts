import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function randomUser (message: Message, args: string[]) {
  const randomId = randomUtils.randomInt(1, 37801)
  const apiUrl = `https://api.polytoria.com/v1/users/${randomId}`

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
    return message.channel.send('User not found, Please try again..')
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
    url: `https://polytoria.com/users/${data.id}`,
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
        value: data.placeVisits.toString(),
        inline: true
      },
      {
        name: 'Profile Views',
        value: data.profileViews.toString(),
        inline: true
      },
      {
        name: 'Forum Posts',
        value: data.forumPosts.toString(),
        inline: true
      },
      {
        name: 'Asset Sales',
        value: data.assetSales.toString(),
        inline: true
      },
      {
        name: 'Networth',
        value: emojiUtils.brick + ' ' + data.netWorth.toString(),
        inline: true
      }
    ]
  })

  // Create the action row and button
  const actionRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://polytoria.com/users/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle('LINK')
    )

  return message.reply({
    embeds: [embed],
    components: [actionRow]
  })
}
