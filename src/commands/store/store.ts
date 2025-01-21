import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, StringSelectMenuBuilder, ComponentType, BaseInteraction } from 'discord.js'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { fetchOwners, buildOwnersEmbed } from './owners.js'

export async function store (interaction: CommandInteraction) {
  // @ts-expect-error
  const assetID = interaction.options.getInteger('id')

  if (!assetID) {
    return await interaction.reply('Please provide me with a store ID before I can continue!')
  }

  await interaction.deferReply()

  // Fetch store data
  const response = await fetch(`https://api.polytoria.com/v1/store/${assetID}`)
  const errResult = await responseHandler.checkError(response)

  // Handle errors
  if (errResult.hasError && errResult.embed) {
    return await interaction.editReply({ embeds: [errResult.embed] })
  }

  // Parse store data
  const data = await response.json()
  const creator = data.creator

  let thumbnailURL = data.thumbnail

  // Default thumbnail for audio assets
  if (data.type.toLowerCase() === 'audio') {
    thumbnailURL = 'https://c0.ptacdn.com/static/images/placeholders/audio.88cff071.png'
  }

  const creatorLink =
    creator.type === 'user'
      ? `https://polytoria.com/users/${creator.id}`
      : `https://polytoria.com/guilds/${creator.id}`

  const embed = new EmbedBuilder({
    title: data.name + ' ' + (data.isLimited === true ? emojiUtils.star : ''),
    description: data.description === '' ? 'No description set.' : data.description,
    url: `https://polytoria.com/store/${data.id}`,
    thumbnail: {
      url: thumbnailURL
    },
    color: 0xFF5454,
    fields: [
      {
        name: 'Creator',
        value: `[${creator.name}](${creatorLink})`,
        inline: true
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.createdAt),
        inline: true
      }
    ]
  })

  const assetType = data.type.toLowerCase()
  if (!['audio', 'decal', 'mesh', 'achievement'].includes(assetType)) {
    if (data.tags && data.tags.length > 0 && data.tags[0] !== '') {
      embed.setDescription(
        data.description === ''
          ? 'No description set.'
          : data.description + '\n\n**Tags:** ' + data.tags.map((tag: string) => `\`${tag}\``).join(', ')
      )
    }

    embed.addFields(
      {
        name: 'Price',
        value: data.price ? `${emojiUtils.brick} ${data.price.toLocaleString()}` : 'Off-sale',
        inline: true
      },
      {
        name: 'Sales',
        value: data.sales.toLocaleString(),
        inline: true
      }
    )
  }

  const dropdown = new StringSelectMenuBuilder()
    .setCustomId('dropdown_menu')
    .setPlaceholder('Choose a store feature to view!')
    .addOptions([
      {
        label: '👕 Item',
        value: 'item_option'
      },
      {
        label: '💼 Owners',
        value: 'item_owners'
      }
    ])

  const prevButton = new ButtonBuilder()
    .setLabel('Previous')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('prev_button')
    .setDisabled(true)

  const nextButton = new ButtonBuilder()
    .setLabel('Next')
    .setStyle(ButtonStyle.Success)
    .setCustomId('next_button')

  const actionRowDropdown = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(dropdown)

  const reply = await interaction.editReply({
    embeds: [embed],
    components: [actionRowDropdown]
  })

  let ownersPage = 1
  let selectedOption: string = 'item_option'

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.SelectMenu,
    filter: (messageInteraction: BaseInteraction) =>
      messageInteraction.isStringSelectMenu() &&
      messageInteraction.customId === 'dropdown_menu' &&
      messageInteraction.user.id === interaction.user.id,
    time: 60000
  })

  collector.on('collect', async (messageInteraction) => {
    await messageInteraction.deferUpdate()

    selectedOption = messageInteraction.values[0]

    if (selectedOption === 'item_option') {
      await interaction.editReply({
        embeds: [embed],
        components: [actionRowDropdown]
      })
    } else if (selectedOption === 'item_owners') {
      const assetOwners = await fetchOwners(assetID, ownersPage)
      const newOwnersEmbed = buildOwnersEmbed(assetOwners, ownersPage, thumbnailURL)

      // Disable previous button if on first page
      prevButton.setDisabled(ownersPage === 1)
      // Disable next button if on last page
      nextButton.setDisabled(ownersPage === assetOwners.pages)

      await interaction.editReply({
        embeds: [newOwnersEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRowDropdown
        ]
      })
    }
  })

  const prevButtonCollector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (btnInteraction: BaseInteraction) =>
      btnInteraction.isButton() &&
      btnInteraction.customId === 'prev_button' &&
      btnInteraction.user.id === interaction.user.id,
    time: 60000
  })

  prevButtonCollector.on('collect', async (buttonInteraction) => {
    try {
      await buttonInteraction.deferUpdate()

      if (selectedOption === 'item_owners' && ownersPage > 1) {
        ownersPage--
        const assetOwners = await fetchOwners(assetID, ownersPage)
        const newOwnersEmbed = buildOwnersEmbed(assetOwners, ownersPage, thumbnailURL)

        prevButton.setDisabled(ownersPage === 1)
        nextButton.setDisabled(false)

        await interaction.editReply({
          embeds: [newOwnersEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
            actionRowDropdown
          ]
        })
      }
    } catch (error) {
      console.error('Error handling interaction:', error)
    }
  })

  const nextButtonCollector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (btnInteraction: BaseInteraction) =>
      btnInteraction.isButton() &&
      btnInteraction.customId === 'next_button' &&
      btnInteraction.user.id === interaction.user.id,
    time: 60000
  })

  nextButtonCollector.on('collect', async (buttonInteraction) => {
    try {
      await buttonInteraction.deferUpdate()

      if (selectedOption === 'item_owners') {
        ownersPage++
        const assetOwners = await fetchOwners(assetID, ownersPage)
        const newOwnersEmbed = buildOwnersEmbed(assetOwners, ownersPage, thumbnailURL)

        prevButton.setDisabled(false)
        nextButton.setDisabled(ownersPage === assetOwners.pages)

        await interaction.editReply({
          embeds: [newOwnersEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
            actionRowDropdown
          ]
        })
      }
    } catch (error) {
      console.error('Error handling interaction:', error)
    }
  })
}
