import { EmbedBuilder, CommandInteraction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function storeSearch (interaction:CommandInteraction) {
  let searchQuery = ''
  // @ts-expect-error
  const queryInput = interaction.options.getString('query')

  if (queryInput) {
    searchQuery = queryInput
  }

  await interaction.deferReply()

  const response = await axios.get(
    `https://polytoria.com/api/store/items?types[]=hat&types[]=tool&types[]=face&types[]=shirt&types[]=pants&page=1&search=${searchQuery}&sort=createdAt&order=desc&showOffsale=false&collectiblesOnly=false`,
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

  for (const item of data) {
    description += `\`${index}\` [${item.name}](https://polytoria.com/store/${item.id}) ${
    item.isLimited === true ? emojiUtils.star : ''
  }\n`
    index++
  }

  embed.setDescription(description)

  return await interaction.editReply({
    embeds: [embed]
  })
}
