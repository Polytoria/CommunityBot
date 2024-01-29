import { Message, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, BaseInteraction, StringSelectMenuOptionBuilder } from 'discord.js'

// Import Search Files
import { placeSearch } from './search/place-search.js'
import { userSearch } from './search/user-search.js'
import { storeSearch } from './search/store-search.js'
import { toolboxSearch } from './search/toolbox-search.js'

export async function search (message: Message, args: string[]) {
  if (!args[0]) {
    message.reply('Please specify a query so I can search for you.')
  }
  const SearchQuery = args.join(' ')
  console.log(SearchQuery)
  let InitialType: any = null

  const embed = new EmbedBuilder()
    .setTitle('Search!')
    .setColor(0xFF5454)
    .setDescription(`Welcome to the search-er! I\'ll search the great depths of Polytoria for **"${SearchQuery}"**.`)

  const placeOption = new StringSelectMenuOptionBuilder()
    .setLabel('🎮 Places')
    .setDescription('Search places on Polytoria for that query!')
    .setValue('place')

  const userOption = new StringSelectMenuOptionBuilder()
    .setLabel('🗣️ Users')
    .setDescription('Search users on Polytoria for that query!')
    .setValue('user')

  const storeOption = new StringSelectMenuOptionBuilder()
    .setLabel('🏪 Store')
    .setDescription('Search assets in the store on Polytoria for that query!')
    .setValue('store')


  const toolboxOption = new StringSelectMenuOptionBuilder()
    .setLabel('🛠️ Toolbox')
    .setDescription('Search content in the toolbox on Polytoria for that query!')
    .setValue('toolbox')

  const selectMenu = new StringSelectMenuBuilder()
    .setPlaceholder('Search Location...')
    .setCustomId('select')
    .addOptions(
      placeOption,
      userOption,
      storeOption,
      toolboxOption
    )

  const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(
      selectMenu
    )

  const reply = await message.reply({
    embeds: [embed],
    components: [actionRow]
  })

  const selectCollector = reply.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    filter: (interaction: BaseInteraction) => (
      interaction.isStringSelectMenu() && interaction.user.id === message.author.id
    ),
    time: 60000
  })

  selectCollector.on('collect', async (interaction) => {
    if (interaction.customId === 'select') {
      InitialType = interaction.values[0] // Update InitialType here
      await interaction.deferUpdate()
      update(InitialType, reply)
    }
  })

  const buttonCollector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (interaction: BaseInteraction) => (
      interaction.isButton() && interaction.user.id === message.author.id && interaction.customId === 'redo_button'
    ),
    time: 60000
  })

  buttonCollector.on('collect', async (interaction) => {
    if (InitialType !== null) {
      update(InitialType, reply)
      await interaction.deferUpdate()
    }
  })

  async function update (id: string, reply: any) {
    let Response: any = null
    switch (id) {
      case 'place':
        Response = await placeSearch(message, args)
        break
      case 'user':
        Response = await userSearch(message, args)
        break
      case 'store':
        Response = await storeSearch(message, args)
        break
      case 'toolbox':
        Response = await toolboxSearch(message, args)
        break
    }

    if (Response !== null) {
      await reply.edit(Response)
    }
  }
}
