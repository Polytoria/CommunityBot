import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { userUtils } from '../utils/userUtils.js'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function guild (message: Message, args: string[]): Promise<Message<boolean>> {
  const guildID = parseInt(args[0])

  const response = await axios.get('https://api.polytoria.com/v1/guilds/info', { params: { id: guildID }, validateStatus: () => true })
  const data = response.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const userData = await userUtils.getUserData(data.CreatorID)

  const Embed = new MessageEmbed({
    title: data.Name + ' ' + (data.IsVerified === true ? emojiUtils.checkmark : ''),
    description: data.Description,
    url: 'https://polytoria.com/guilds/' + data.ID.toString(),
    thumbnail: {
      url: data.Thumbnail
    },
    color: '#ff5454',
    fields: [
      {
        name: 'Creator',
        value: `[${userData.Username}](https://polytoria.com/user/${data.CreatorID})`,
        inline: true
      },
      {
        name: 'Members',
        value: data.Members.toLocaleString(),
        inline: true
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.CreatedAt),
        inline: false
      }
    ]
  })

  return message.channel.send({
    embeds: [Embed]
  })
}
