import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function catalogSearch (message: Message, args: string[]) {
  const serachData = message.content.replace('p!catalog-search ', '').replace(/ /g, '%20')

  const response = await axios.get('https://api.polytoria.com/v1/asset/catalog', { params: { page: 0, q: serachData }, validateStatus: () => true })
  const data = response.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const embed = new MessageEmbed({
    title: `Search results for "${serachData}"`,
    url: `https://polytoria.com/shop/${data.ID}`,
    color: '#ff5454',
    thumbnail: {
      url: data.Thumbnail
    },
    description: ''
  })

  let index = 1
  for (const item of data) {
    embed.description += `\`${index}\` [${item.name}](https://polytoria.com/shop/${item.id}) ${item.is_limited === 1 ? emojiUtils.star : ''}\n`
    index++
  }

  return message.channel.send({
    embeds: [embed]
  })
}
