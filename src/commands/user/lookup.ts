import { Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function lookUp (message: Message, args: string[]) {
  // Check if a username was provided
  if (args.length === 0) {
    return message.reply('You need to type a username for me to lookup!')
  }

  const username = args[0]

  // Get the user ID using the first API
  const lookupResponse = await axios.get(`https://api.polytoria.com/v1/users/find?username=${username}`, {
    validateStatus: () => true
  })
  const lookupData = lookupResponse.data

  const errResult = responseHandler.checkError(lookupResponse)

  if (errResult.hasError === true) {
    return message.reply(errResult.displayText)
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
    return message.reply(errResult2.displayText)
  }

  if (data.membershipType === 'plusDeluxe') {
    badges += emojiUtils.plusdeluxe + ' '
  }
  if (data.membershipType === 'plus') {
    badges += emojiUtils.plus + ' '
  }

  const embed = new MessageEmbed({
    title: data.username + badges,
    url: `https://polytoria.com/user/${data.id}`,
    description: data.description,
    color: '#ff5454',
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

  // Create the action row and button
  const actionRow = new MessageActionRow().addComponents(
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
