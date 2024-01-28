import { Message, EmbedBuilder, CommandInteraction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'

export async function placeSearch (interaction:CommandInteraction) {
  let searchQuery = ''
  // @ts-expect-error
  const queryInput = interaction.options.getString('query')

  if (queryInput) {
    searchQuery = queryInput
  }

  await interaction.deferReply()

  const response = await axios.get(
    `https://polytoria.com/api/places?page=1&search=${searchQuery}&genre=all&sort=popular`,
    { params: {}, validateStatus: () => true }
  )
  const data = response.data.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return await interaction.editReply(errResult.displayText)
  }

  const embed = new EmbedBuilder({
    title: `Search results for "${searchQuery}"`,
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

  return await interaction.editReply({
    embeds: [embed]
  })
}
