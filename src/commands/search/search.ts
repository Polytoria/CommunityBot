import { CommandInteraction } from 'discord.js'
import { placeSearch } from './place-search.js'
import { storeSearch } from './store-search.js'
import { toolbox } from './toolbox-search.js'
import { userSearch } from './user-search.js'

export async function search (interaction:CommandInteraction) {
  // @ts-expect-error
  const category = interaction.options.getSubcommand()

  if (category == 'place') {
    placeSearch(interaction)
  } else if (category == 'store') {
    storeSearch(interaction)
  } else if (category == 'toolbox') {
    toolbox(interaction)
  } else if (category == 'user') {
    userSearch(interaction)
  } else {
    await interaction.reply('No valid category supplied')
  }
}
