import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { userUtils } from '../utils/userUtils.js'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function game (message: Message, args: string[]) {
  const gameID = parseInt(args[0])

  const response = await axios.get('https://api.polytoria.com/v1/games/info', { params: { id: gameID }, validateStatus: () => true })
  const data = response.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const userData = await userUtils.getUserData(data.CreatorID)

  let externalDesc = ""

  if (data.IsActive == false) {
    externalDesc += `${emojiUtils.warning} This game is inactive.\n`
  }

  externalDesc += "\n\n"

  if (data.Description == "") {
    externalDesc += "*No description set.*"
  } else {
    externalDesc += data.Description
  }

  const embed = new MessageEmbed({
    title: data.Name,
    description: data.Description,
    thumbnail: {
      url: `https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`
    },
    url: `https://polytoria.com/games/${data.ID}`,
    color: '#ff5454',
    image: {
      url: args[0] == "" ? "https://polytoria.com/assets/img/game_unavail.png" :`https://polytoria.com/assets/thumbnails/games/${args[0]}.png`
    },
    fields: [
      {
        name: 'Creator',
        value: `[${userData.Username}](https://polytoria.com/user/${data.CreatorID})`,
        inline: true
      },
      {
        name: 'Visits',
        value: data.Visits.toLocaleString(),
        inline: true
      },
      {
        name: 'Likes',
        value: data.Likes.toLocaleString(),
        inline: true
      },
      {
        name: 'Dislikes',
        value: data.Dislikes.toLocaleString(),
        inline: true
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.CreatedAt),
        inline: true
      },
      {
        name: 'Updated At',
        value: dateUtils.atomTimeToDisplayTime(data.UpdatedAt),
        inline: true
      },
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
