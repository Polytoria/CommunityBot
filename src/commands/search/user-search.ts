import { EmbedBuilder, CommandInteraction } from 'discord.js'
import { responseHandler } from '../../utils/responseHandler.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function userSearch (interaction: CommandInteraction) {
  let searchQuery = ''
  // @ts-expect-error
  const queryInput = interaction.options.getString('query')

  if (queryInput) {
    searchQuery = queryInput
  }

  await interaction.deferReply()

  const response = await fetch(
    `https://api.polytoria.com/v1/users?search=${encodeURIComponent(searchQuery)}&limit=15`
  )
  const errResult = await responseHandler.checkError(response)

  if (errResult.hasError && errResult.embed) {
    return await interaction.editReply({ embeds: [errResult.embed] })
  }

  const result = await response.json()
  const data = result.users

  const embed = new EmbedBuilder({
    title: `Search results for "${searchQuery}"`,
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

  embed.setDescription(description || 'No results found.')

  return await interaction.editReply({
    embeds: [embed]
  })
}
