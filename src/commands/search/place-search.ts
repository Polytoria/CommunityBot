import { Message, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'

export async function placeSearch (message: Message, args: string[]) {
  const searchData = args[0]

  const response = await axios.get(
    `https://polytoria.com/api/places?page=1&search=${searchData}&genre=all&sort=popular`,
    { params: {}, validateStatus: () => true }
  )
  const data = response.data.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const embed = new EmbedBuilder({
    title: `Search results for "${searchData}"`,
    color: 0xFF5454
  })

  let index = 1
  let description = ''

  const topPlaces = data.slice(0, 15)
  for (const place of topPlaces) {
    description += `\`${index}\` [${place.name}](https://polytoria.com/places/${place.id}) ${
      ''
  }\n`
    index++
  }

  embed.setDescription(description)

  return {
    embeds: [embed],
    components: []
  }
}
