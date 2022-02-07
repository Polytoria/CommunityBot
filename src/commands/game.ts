import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { userUtils } from '../utils/userUtils.js'
import { dateUtils } from '../utils/dateUtils.js'

export async function game (message: Message, args: string[]) {
  const gameID = parseInt(args[0])

  const response = await axios.get('https://api.polytoria.com/v1/games/info', { params: { id: gameID }, validateStatus: () => true })
  const data = response.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const userData = await userUtils.getUserData(data.CreatorID)

  const embed = new MessageEmbed({
    title: data.Name,
    description: data.Description,
    thumbnail: {
      url: `https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`
    },
    color: '#ff5454',
    image: {
      url: `https://polytoria.com/assets/thumbnails/games/${args[0]}.png`
    },
    fields: [
      {
        name: '🗂️ Creator ID 🗂️',
        value: data.CreatorID.toLocaleString(),
        inline: true
      },
      {
        name: '👷 Creator Name 👷',
        value: userData.Username,
        inline: true
      },
      {
        name: '🎉 Visits 🎉',
        value: data.Visits.toLocaleString(),
        inline: false
      },
      {
        name: '🔼 Likes 🔼',
        value: data.Likes.toLocaleString(),
        inline: true
      },
      {
        name: '🔽 Dislikes 🔽',
        value: data.Dislikes.toLocaleString(),
        inline: true
      },
      {
        name: '🔥 Created At 🔥',
        value: dateUtils.atomTimeToDisplayTime(data.CreatedAt),
        inline: false
      },
      {
        name: '📦 Updated At 📦',
        value: dateUtils.atomTimeToDisplayTime(data.UpdatedAt),
        inline: false
      },
      {
        name: '🟢 Is Active 🟢',
        value: data.IsActive.toString(),
        inline: false
      }
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
