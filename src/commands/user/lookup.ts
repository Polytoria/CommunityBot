import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { stringUtils } from '../../utils/stringUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function lookUp (message: Message, args: string[]) {
  let apiURL: string = ''

  switch (args[1]) {
    case 'user':
      apiURL = `https://api.polytoria.com/v1/users/getbyusername?username=${args[0]}`
      break
    case 'id':
      apiURL = `https://api.polytoria.com/v1/users/user?id=${args[0]}`
      break
    default:
      apiURL = `https://api.polytoria.com/v1/users/getbyusername?username=${args[0]}`
      break
  }

  const response = await axios.get(apiURL, { validateStatus: () => true })
  const data = response.data
  let badges = " "

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  if (data.Rank === "ADMINISTRATOR") {
    badges += emojiUtils.polytoria + " "
  }

  if (data.Rank !== "NONE") {
    badges += emojiUtils.star + " "
  }

  const embed = new MessageEmbed({
    title: data.Username + badges,
    url: `https://polytoria.com/user/${data.ID}`,
    description: data.Description,
    color: '#ff5454',
    thumbnail: {
      url: `https://polytoria.com/assets/thumbnails/avatars/${data.AvatarHash}.png`
    },
    fields: [
      {
        name: 'User ID',
        value: data.ID.toString(),
        inline: true
      },
      {
        name: 'Rank',
        value: stringUtils.capitalizeString(data.Rank),
        inline: true
      },
      {
        name: 'Membership Type',
        value: stringUtils.capitalizeString(data.MembershipType),
        inline: true
      },
      {
        name: 'Profile Views',
        value: data.ProfileViews.toLocaleString(),
        inline: true
      },
      {
        name: 'Item Sales',
        value: data.ItemSales.toLocaleString(),
        inline: true
      },
      {
        name: 'Forum Posts',
        value: data.ForumPosts.toLocaleString(),
        inline: true
      },
      {
        name: 'Trade value',
        value: data.TradeValue.toLocaleString(),
        inline: true
      },
      {
        name: 'Joined At',
        value: dateUtils.atomTimeToDisplayTime(data.JoinedAt),
        inline: true
      },
      {
        name: 'Last seen at',
        value: dateUtils.atomTimeToDisplayTime(data.LastSeenAt),
        inline: true
      }
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
