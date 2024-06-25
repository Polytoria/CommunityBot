import { EmbedBuilder, CommandInteraction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function userSearch (interaction:CommandInteraction) {
  let searchQuery = ''
  // @ts-expect-error
  const queryInput = interaction.options.getString('query')

  if (queryInput) {
    searchQuery = queryInput
  }

  await interaction.deferReply()

  const response = await axios.get(
    `https://api.polytoria.co/v1/users?search=${searchQuery}&limit=15`,
    { params: {}, validateStatus: () => true }
  )
  const data = response.data.users

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

  for (const user of data) {
    description += `\`${index}\` [${user.username}](https://polytoria.co/users/${user.id}) ${
    user.isStaff === true ? emojiUtils.polytoria : ''
  }\n`
    index++
  }

  embed.setDescription(description)

  return await interaction.editReply({
    embeds: [embed]
  })
}
