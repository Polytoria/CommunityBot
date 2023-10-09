import { Message, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function storeSearch (message: Message, args: string[]) {
  const serachData = message.content.replace('p!store-search ', '').replace(/ /g, '%20')

  const response = await axios.get(
    `https://polytoria.com/api/store/items?types[]=hat&types[]=tool&types[]=face&types[]=shirt&types[]=pants&page=1&search=${serachData}&sort=createdAt&order=desc&showOffsale=false&collectiblesOnly=false`,
    { params: {}, validateStatus: () => true }
  )
  const data = response.data.data

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

  for (const item of data) {
    description += `\`${index}\` [${item.name}](https://polytoria.com/store/${item.id}) ${
    item.isLimited === true ? emojiUtils.star : ''
  }\n`
    index++
  }

  embed.setDescription(description)

  return {
    embeds: [embed],
    components: []
  }
}
