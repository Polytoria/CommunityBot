import { Message, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, BaseInteraction, StringSelectMenuOptionBuilder } from 'discord.js'

// Import Random Files
import { randomPlace } from './random/randomPlace.js'
import { randomUser } from './random/randomUser.js'
import { randomGuild } from './random/randomGuild.js'
import { randomStore } from './random/randomStore.js'

export async function random (message: Message, args: any[]) {
  let InitialType: any = null
  if (args.length === 0) {
    const embed = new EmbedBuilder()
      .setTitle('Randomizer!')
      .setColor(0xFF5454)
      .setDescription('Pick an asset type to get a random one! (or specify "place", "user", "guild", or "store" when executing the command)')

    const placeOption = new StringSelectMenuOptionBuilder()
      .setLabel('Place')
      .setDescription('https://polytoria.com/places/')
      .setValue('place')

    const userOption = new StringSelectMenuOptionBuilder()
      .setLabel('User')
      .setDescription('https://polytoria.com/users/')
      .setValue('user')

    const guildOption = new StringSelectMenuOptionBuilder()
      .setLabel('Guild')
      .setDescription('https://polytoria.com/guilds/')
      .setValue('guild')

    const storeOption = new StringSelectMenuOptionBuilder()
      .setLabel('Store')
      .setDescription('https://polytoria.com/store/')
      .setValue('store')

    const selectMenu = new StringSelectMenuBuilder()
      .setPlaceholder('Asset Type...')
      .setCustomId('select')
      .addOptions(
        placeOption,
        userOption,
        guildOption,
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
        update(interaction.values[0], reply)
      }
    })

    const buttonCollector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (interaction: BaseInteraction) => (
        interaction.isButton() && interaction.user.id === message.author.id
      ),
      time: 60000
    })

    buttonCollector.on('collect', async (interaction) => {
      if (interaction.customId === 'redo_button') {
        update(InitialType, reply)
      }
    })
  } else if (args[0]) {
    if (args[0] === 'place' || args[0] === 'user' || args[0] === 'guild' || args[0] === 'store') {
      update(args[0], null)
    } else {
      message.reply('That asset type doesn\'t exist! Please try again...')
    }
  }

  async function update (id: string, reply: any) {
    if (InitialType === null) { InitialType = id }
    let Response: any = null
    switch (id) {
      case 'place':
        Response = await randomPlace(message, args)
        InitialType = 'place'
        break
      case 'user':
        Response = await randomUser(message, args)
        InitialType = 'user'
        break
      case 'guild':
        Response = await randomGuild(message, args)
        InitialType = 'guild'
        break
      case 'store':
        Response = await randomStore(message, args)
        InitialType = 'store'
        break
    }

    if (Response !== null) {
      if (reply !== null) {
        await reply.edit(Response)
      } else {
        message.reply(Response)
      }
    }
  }
}
