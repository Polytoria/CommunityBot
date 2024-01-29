import { Message, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, BaseInteraction, StringSelectMenuOptionBuilder } from 'discord.js'

// Import Random Files
import { randomPlace } from './random/randomPlace.js'
import { randomUser } from './random/randomUser.js'
import { randomGuild } from './random/randomGuild.js'
import { randomStore } from './random/randomStore.js'

export async function random (message: Message, args: any[]) {
  let InitialType: any = null

  const embed = new EmbedBuilder()
    .setTitle('Randomizer!')
    .setColor(0xFF5454)
    .setDescription('Welcome to the randomizer! Pick a feature on Polytoria that you would like us to randomize for you.')

  const placeOption = new StringSelectMenuOptionBuilder()
    .setLabel('🎮 Places')
    .setDescription('Get a random place that is available on Polytoria!')
    .setValue('place')

  const userOption = new StringSelectMenuOptionBuilder()
    .setLabel('🗣️ Users')
    .setDescription('Get a random user that is on Polytoria!')
    .setValue('user')

  const guildOption = new StringSelectMenuOptionBuilder()
    .setLabel('🫂 Guilds')
    .setDescription('Get a random guild that is available on Polytoria!')
    .setValue('guild')

  const storeOption = new StringSelectMenuOptionBuilder()
    .setLabel('🏪 Store')
    .setDescription('Get a random asset that is available on Polytoria!')
    .setValue('store')

  const selectMenu = new StringSelectMenuBuilder()
    .setPlaceholder('Asset Type...')
    .setCustomId('select')
    .addOptions(
      placeOption,
      userOption,
      storeOption
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
        Response = await randomPlace(message, args)
        break
      case 'user':
        Response = await randomUser(message, args)
        break
      case 'guild':
        Response = await randomGuild(message, args)
        break
      case 'store':
        Response = await randomStore(message, args)
        break
    }

    if (Response !== null) {
      await reply.edit(Response)
    }
  }
}
