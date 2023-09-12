import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, BaseInteraction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { fetchMembers } from './GuildMembers.js'
import { fetchStore } from './GuildStore.js'

export async function guild (message: Message, args: string[]): Promise<Message | null> {
  const guildID: number = parseInt(args[0])

  if (args.length === 0) {
    return message.reply('Please provide me with a guild ID before I can continue!')
  }

  const response = await axios.get(`https://api.polytoria.com/v1/guilds/${guildID}`, { validateStatus: () => true })
  const data = response.data
  const creator = data.creator

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  let joinType!: string

  switch (data.joinType) {
    case 'public':
      joinType = '🔓'
      break
    case 'private':
      joinType = '🔒'
      break
    case 'request':
      joinType = '🖐️'
      break
  }

  const embed = new EmbedBuilder()
    .setTitle(data.name + ' ' + (data.isVerified === true ? emojiUtils.checkmark : ''))
    .setDescription(data.description === '' ? 'No description set.' : data.description)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .addFields(
      {
        name: 'Creator',
        value: `[${creator.name}](https://polytoria.com/users/${creator.id})`,
        inline: true
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.createdAt),
        inline: true
      },
      {
        name: 'Join Type',
        value: joinType,
        inline: true
      },
      {
        name: 'Members',
        value: data.memberCount.toLocaleString(),
        inline: true
      },
      {
        name: 'Vault',
        value: emojiUtils.brick + ' ' + data.vaultBalance.toString(),
        inline: true
      }
    )

  if (data.banner !== 'https://c0.ptacdn.com/guilds/banners/default.png') {
    embed.setImage(data.banner)
  }

  const memberEmbed = new EmbedBuilder()
    .setTitle(data.name + ' - Members ' + (data.isVerified === true ? emojiUtils.checkmark : ''))
    .setDescription(await fetchMembers(guildID, 1))
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())

  const storeEmbed = new EmbedBuilder()
    .setTitle(data.name + ' - Store ' + (data.isVerified === true ? emojiUtils.checkmark : ''))
    .setDescription(await fetchStore(guildID, 1))
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())

  const guildButton = new ButtonBuilder()
    .setLabel('Guild')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('guild_button')

  const membersButton = new ButtonBuilder()
    .setLabel('Members')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('members_button')

  const storeButton = new ButtonBuilder()
    .setLabel('Guild Store')
    .setStyle(ButtonStyle.Success)
    .setCustomId('store_button')

  const nextButton = new ButtonBuilder()
    .setLabel('Next')
    .setStyle(ButtonStyle.Success)
    .setCustomId('next_button')

  const prevButton = new ButtonBuilder()
    .setLabel('Previous')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('prev_button')

  const actionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://polytoria.com/guilds/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle(ButtonStyle.Link),
      membersButton,
      storeButton
    )

  const reply = await message.reply({
    embeds: [embed],
    components: [actionRow]
  })

  let memberPage = 1
  let storePage = 1

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (interaction: BaseInteraction) => (
      interaction.isButton() && interaction.user.id === message.author.id
    ),
    time: 60000
  })

  collector.on('collect', async (interaction) => {
    await interaction.deferUpdate() // Defer the interaction

    if (interaction.customId === 'members_button') {
      membersButton.setDisabled(true)
      storeButton.setDisabled(true)
      nextButton.setDisabled(false)
      prevButton.setDisabled(true)

      await reply.edit({
        embeds: [memberEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
        ]
      })

      const guildButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'guild_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      guildButtonCollector.on('collect', async () => {
        membersButton.setDisabled(false)
        storeButton.setDisabled(false)
        nextButton.setDisabled(true)
        prevButton.setDisabled(true)
        await reply.edit({
          embeds: [embed],
          components: [actionRow]
        })
      })

      const nextButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'next_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      nextButtonCollector.on('collect', async () => {
        const newPage = memberPage + 1
        const newMemberUsernames: string = await fetchMembers(guildID, newPage)

        memberPage = newPage
        memberEmbed.setDescription(newMemberUsernames)

        nextButton.setDisabled(false)
        prevButton.setDisabled(false)

        await reply.edit({
          embeds: [memberEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
          ]
        })
      })

      const prevButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'prev_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      prevButtonCollector.on('collect', async () => {
        if (memberPage > 1) {
          const newPage = memberPage - 1
          const newMemberUsernames: string = await fetchMembers(guildID, newPage)

          memberPage = newPage
          memberEmbed.setDescription(newMemberUsernames)

          nextButton.setDisabled(false)
          prevButton.setDisabled(false)

          await reply.edit({
            embeds: [memberEmbed],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
            ]
          })
        }
      })
    }

    if (interaction.customId === 'store_button') {
      membersButton.setDisabled(true)
      storeButton.setDisabled(true)
      nextButton.setDisabled(false)
      prevButton.setDisabled(true)

      await reply.edit({
        embeds: [storeEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
        ]
      })

      const guildButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'guild_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      guildButtonCollector.on('collect', async () => {
        membersButton.setDisabled(false)
        storeButton.setDisabled(false)
        nextButton.setDisabled(true)
        prevButton.setDisabled(true)
        await reply.edit({
          embeds: [embed],
          components: [actionRow]
        })
      })

      const nextButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'next_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      nextButtonCollector.on('collect', async () => {
        const newPage = storePage + 1
        const newStoreItems: string = await fetchStore(guildID, newPage)

        storePage = newPage
        storeEmbed.setDescription(newStoreItems)

        nextButton.setDisabled(false)
        prevButton.setDisabled(false)

        await reply.edit({
          embeds: [storeEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
          ]
        })
      })

      const prevButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'prev_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      prevButtonCollector.on('collect', async () => {
        if (memberPage > 1) {
          const newPage = storePage - 1
          const newStoreItems: string = await fetchStore(guildID, newPage)

          storePage = newPage
          storeEmbed.setDescription(newStoreItems)

          nextButton.setDisabled(false)
          prevButton.setDisabled(false)

          await reply.edit({
            embeds: [storeEmbed],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
            ]
          })
        }
      })
    }
  })

  return reply
}
