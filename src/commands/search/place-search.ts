import { Message, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function placeSearch (message: Message, args: string[]) {
  const serachData = message.content.replace('p!place-search ', '').replace(/ /g, '%20')

  const response = await axios.get(
    `https://polytoria.com/api/places?page=1&search=${serachData}&genre=all&sort=popular`,
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

  const topPlaces = data.slice(0, 15);
  for (const place of topPlaces) {
    description += `\`${index}\` [${place.name}](https://polytoria.com/places/${place.id}) ${
      ''
  }\n`
    index++
  }

  embed.setDescription(description)

  return message.channel.send({
    embeds: [embed]
  })
}
