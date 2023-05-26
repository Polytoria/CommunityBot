import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'

export async function lookUp (message: Message, args: string[]) {
  const userID = parseInt(args[0])

  const response = await axios.get(`https://api.polytoria.com/v1/users/${userID}`, { validateStatus: () => true })
  const data = response.data
  const thumbnail = data.thumbnail

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const embed = new MessageEmbed({
    title: data.username,
    url: `https://polytoria.com/user/${data.id}`,
    description: data.description,
    color: '#ff5454',
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
        value: data.netWorth.toString(),
        inline: true
      }
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
