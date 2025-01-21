import { EmbedBuilder, CommandInteraction } from 'discord.js'
import { responseHandler } from '../../utils/responseHandler.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function storeSearch (interaction: CommandInteraction) {
  let searchQuery = ''
  // @ts-expect-error
  const queryInput = interaction.options.getString('query')

  if (queryInput) {
    searchQuery = queryInput
  }

  await interaction.deferReply()

  const response = await fetch(
    `https://polytoria.com/api/store/items?types[]=hat&types[]=tool&types[]=face&types[]=shirt&types[]=pants&page=1&search=${encodeURIComponent(searchQuery)}&sort=createdAt&order=desc&showOffsale=false&collectiblesOnly=false`
  )
  const errResult = await responseHandler.checkError(response)

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

  for (const item of data) {
    description += `\`${index}\` [${item.name}](https://polytoria.com/store/${item.id}) ${
      item.isLimited === true ? emojiUtils.star : ''
    }\n`
    index++
  }

  embed.setDescription(description || 'No results found.')

  return await interaction.editReply({
    embeds: [embed]
  })
}
