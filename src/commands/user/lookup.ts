import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { userUtils } from '../../utils/userUtils.js'

export async function lookUp (interaction:CommandInteraction) {
  // @ts-expect-error
  const username = interaction.options.getString('username')
  if (!username || username.length === 0) {
    return await interaction.reply('Please tell me the username so I can make you a card.')
  }

  await interaction.deferReply()

  const userData = await userUtils.getUserDataFromUsername(username)

  if (!userData) {
    return await interaction.editReply('User not found!')
  }

  // Get the user ID using the first API
  const lookupResponse = await axios.get(`https://api.polytoria.com/v1/users/find?username=${username}`, {
    validateStatus: (status) => status === 200 // Allow 404 response
  })
  const lookupData = lookupResponse.data

  const errResult = responseHandler.checkError(lookupResponse)

  if (errResult.hasError === true) {
    if (errResult.statusCode === 404) {
      return await interaction.editReply("Couldn't find the requested user. Did you type in the correct username?")
    } else {
      return await interaction.editReply(errResult.displayText)
    }
  }

  const userID = lookupData.id

  // Fetch the rest of the user data using the second API
  const response = await axios.get(`https://api.polytoria.com/v1/users/${userID}`, {
    validateStatus: () => true
  })
  const data = response.data
  let badges = ' '

  const errResult2 = responseHandler.checkError(response)

  if (errResult2.hasError === true) {
    return await interaction.editReply(errResult2.displayText)
  }

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
      url: data.thumbnail?.avatar
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

  const actionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://polytoria.com/users/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle(ButtonStyle.Link)
    )

  return await interaction.editReply({
    embeds: [embed],
    components: [actionRow]
  })
}
