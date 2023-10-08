import { Message, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType, BaseInteraction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { fetchMembers } from './GuildMembers.js'
import { fetchStore } from './GuildStore.js'
import { fetchShouts } from './GuildShouts.js'

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
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())

  const storeEmbed = new EmbedBuilder()
    .setTitle(data.name + ' - Store ' + (data.isVerified === true ? emojiUtils.checkmark : ''))
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())

  const shoutsEmbed = new EmbedBuilder()
    .setTitle(data.name + ' - Shouts')
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())

  const dropdown = new StringSelectMenuBuilder()
    .setCustomId('dropdown_menu')
    .setPlaceholder('Choose a guild feature to view!')
    .addOptions([
      {
        label: '🛡️ Guild',
        value: 'guild_option'
      },
      {
        label: '🧑‍🤝‍🧑 Members',
        value: 'members_option'
      },
      {
        label: '🏪 Guild Store',
        value: 'store_option'
      },
      {
        label: '📢 Shouts',
        value: 'shouts_option'
      }
    ])

  const prevButton = new ButtonBuilder()
    .setLabel('Previous')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('prev_button')

  const nextButton = new ButtonBuilder()
    .setLabel('Next')
    .setStyle(ButtonStyle.Success)
    .setCustomId('next_button')

  const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(dropdown)

  const reply = await message.reply({
    embeds: [embed],
    components: [actionRow]
  })

  let storePage = 1
  let memberPage = 1
  let shoutPage = 1

  let selectedOption: string = 'guild_option'

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.SelectMenu,
    filter: (interaction: BaseInteraction) => (
      interaction.isStringSelectMenu() && interaction.customId === 'dropdown_menu' &&
      interaction.user.id === message.author.id
    ),
    time: 60000
  })

  collector.on('collect', async (interaction) => {
    await interaction.deferUpdate()

    selectedOption = interaction.values[0]

    if (selectedOption === 'guild_option') {
      await reply.edit({
        embeds: [embed],
        components: [actionRow]
      })
    } else if (selectedOption === 'members_option') {
      const newMemberUsernames: string = await fetchMembers(guildID, memberPage)
      memberEmbed.setDescription(newMemberUsernames)

      await reply.edit({
        embeds: [memberEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    } else if (selectedOption === 'store_option') {
      const newStoreItems: string = await fetchStore(guildID, storePage)
      storeEmbed.setDescription(newStoreItems)

      await reply.edit({
        embeds: [storeEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    } else if (selectedOption === 'shouts_option') {
      const newShouts: string = await fetchShouts(guildID, shoutPage)
      shoutsEmbed.setDescription(newShouts)

      await reply.edit({
        embeds: [shoutsEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    }
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
    if (selectedOption === 'members_option' && memberPage > 1) {
      memberPage--
      const newMemberUsernames: string = await fetchMembers(guildID, memberPage)
      memberEmbed.setDescription(newMemberUsernames)

      await reply.edit({
        embeds: [memberEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    }
    if (selectedOption === 'shouts_option' && shoutPage > 1) {
      shoutPage--
      const newShouts: string = await fetchShouts(guildID, shoutPage)
      shoutsEmbed.setDescription(newShouts)

      await reply.edit({
        embeds: [shoutsEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    }
    if (selectedOption === 'store_option' && storePage > 1) {
      storePage--
      const newStoreItems: string = await fetchStore(guildID, storePage)
      storeEmbed.setDescription(newStoreItems)

      await reply.edit({
        embeds: [storeEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    }
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
    if (selectedOption === 'members_option') {
      memberPage++
      const newMemberUsernames: string = await fetchMembers(guildID, memberPage)
      memberEmbed.setDescription(newMemberUsernames)

      await reply.edit({
        embeds: [memberEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    }
    if (selectedOption === 'shouts_option') {
      shoutPage++
      const newShouts: string = await fetchShouts(guildID, shoutPage)
      shoutsEmbed.setDescription(newShouts)

      await reply.edit({
        embeds: [shoutsEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    }
    if (selectedOption === 'store_option') {
      storePage++
      const newStoreItems: string = await fetchStore(guildID, storePage)
      storeEmbed.setDescription(newStoreItems)

      await reply.edit({
        embeds: [storeEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRow
        ]
      })
    }
  })

  return reply
}
