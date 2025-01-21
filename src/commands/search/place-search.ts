import { EmbedBuilder, CommandInteraction } from 'discord.js'
import { responseHandler } from '../../utils/responseHandler.js'

export async function placeSearch (interaction: CommandInteraction) {
  let searchQuery = ''
  // @ts-expect-error
  const queryInput = interaction.options.getString('query')

  if (queryInput) {
    searchQuery = queryInput
  }

  await interaction.deferReply()

  // Fetch data using fetch
  const response = await fetch(
    `https://polytoria.com/api/places?page=1&search=${encodeURIComponent(searchQuery)}&genre=all&sort=popular`
  )
  const errResult = await responseHandler.checkError(response)

  // Handle errors
  if (errResult.hasError && errResult.embed) {
    return await interaction.editReply({ embeds: [errResult.embed] })
  }

  const result = await response.json()
  const data = result.data

  const embed = new EmbedBuilder({
    title: `Search results for "${searchQuery}"`,
    color: 0xFF5454
  })

  let index = 1
  let description = ''

  const topPlaces = data.slice(0, 15)
  for (const place of topPlaces) {
    description += `\`${index}\` [${place.name}](https://polytoria.com/places/${place.id})\n`
    index++
  }

  embed.setDescription(description || 'No results found.')

  return await interaction.editReply({
    embeds: [embed]
  })
}
