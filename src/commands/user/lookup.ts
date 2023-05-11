import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'

export async function lookUp (message: Message, args: string[]) {
  let apiURL: string = ''

  switch (args[1]) {
    case 'user':
      apiURL = `https://api.polytoria.com/v1/users/find?username=${args.join(' ')}`
      break
    case 'id':
      apiURL = `https://api.polytoria.com/v1/users/find?id=${args.join(' ')}`
      break
    default:
      apiURL = `https://api.polytoria.com/v1/users/find?username=${args.join(' ')}`
      break
  }

  const response = await axios.get(apiURL, { validateStatus: () => true })
  const data = response.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const embed = new MessageEmbed({
    title: data.username,
    url: `https://polytoria.com/user/${data.ID}`,
    description: data.description,
    color: '#ff5454',
    thumbnail: {
      url: `https://c0.ptacdn.com/thumbnails/avatars/${data.avatarUrl}`
    },
    fields: [
      {
        name: 'User ID',
        value: data.ID.toString(),
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
      }
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
