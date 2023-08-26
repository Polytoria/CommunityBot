import { Message, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType, BaseInteraction } from 'discord.js'
import { randomPlace } from './random/randomPlace.js'
import { randomUser } from './random/randomUser.js'
import { randomGuild } from './random/randomGuild.js'
import { randomStore } from './random/randomStore.js'
import { store } from './store.js'

export async function random (message: Message, args: any[]): Promise<Message<boolean>> {
  let InitialType = null
  if (args.length === 0) {
    const embed = new EmbedBuilder()
      .setTitle('Randomizer!')
      .setDescription('Pick an asset type to get a random one! (or specify "place", "user", "guild", or "store" when executing the command!)')

    const placeButton = new ButtonBuilder()
      .setLabel('Place')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('place_button')

    const userButton = new ButtonBuilder()
      .setLabel('User')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('user_button')

    const guildButton = new ButtonBuilder()
      .setLabel('Guild')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('guild_button')

    const storeButton = new ButtonBuilder()
      .setLabel('Store')
      .setStyle(ButtonStyle.Primary)
      .setCustomId('store_button')

    const actionRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        placeButton,
        userButton,
        guildButton,
        storeButton
      )

    const reply = await message.reply({
      embeds: [embed],
      components: [actionRow]
    })

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (interaction: BaseInteraction) => (
        interaction.isButton() && interaction.user.id === message.author.id
      ),
      time: 60000
    })

    collector.on('collect', async (interaction) => {
      if (InitialType === null) {
        console.log(interaction.customId, interaction.customId.replace('_button', ''))
        update(interaction.customId.replace('_button', ''), reply)
      } else {
        update(InitialType, reply)
      }
    })
  } else if (args[0]) {
    update(args[0], null)
  }

  async function update(id, reply) {
    let Response = null
    switch(id) {
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
      console.log(Response)
      if (reply !== null) {
        await reply.edit(Response)

        /*
        if (Response.components[0]) {
          const resCollector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (interaction: BaseInteraction) => (
              interaction.isButton() && interaction.user.id === message.author.id
            ),
            time: 60000
          })
      
          resCollector.on('collect', async (interaction) => {
            if (interaction.customId === 'redo_button') {
              update(id, reply)
              return
            } 
          })
        }
        */
      } else {
        message.reply(Response)
      }
    } else {
      reply.edit('That asset type doesn\'t exist! Please try again...')
    }
  }
}