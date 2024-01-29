import { Message, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function userSearch (message: Message, args: string[]) {
  const serachData = message.content.replace('p!user-search ', '').replace(/ /g, '%20')

  const response = await axios.get(
    `https://api.polytoria.com/v1/users?search=${serachData}&limit=15`,
    { params: {}, validateStatus: () => true }
  )
  const data = response.data.users

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const embed = new EmbedBuilder({
    title: `Search results for "${serachData}"`,
    color: 0xFF5454
  })

  let index = 1
  let description = ''

  for (const user of data) {
    description += `\`${index}\` [${user.username}](https://polytoria.com/users/${user.id}) ${
    user.isStaff === true ? emojiUtils.polytoria : ''
  }\n`
    index++
  }

  embed.setDescription(description)

  return {
    embeds: [embed],
    components: []
  }
}
