import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, StringSelectMenuBuilder, ComponentType, BaseInteraction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

async function fetchOwners (itemID: number, page: number): Promise<any[]> {
  const response = await axios.get(`https://api.polytoria.com/v1/store/${itemID}/owners?limit=10&page=${page}`)
  return response.data
}

function buildOwnersEmbed (ownersData: any[], page: number, thumbnail: string): EmbedBuilder {
  const ownersEmbed = new EmbedBuilder()
    .setTitle('Item Owners (' + ownersData.total + ')')
    .setColor('#FF5454')
    .setThumbnail(thumbnail)

  const ownersContent = ownersData.inventories.map((owner: any) => {
    return `Serial #${owner.serial}. [${owner.user.username}](https://polytoria.com/users/${owner.user.id})`
  })

  ownersEmbed.setDescription(`> **Page ${page}/${ownersData.pages} **\n\n` + ownersContent.join('\n'))
  return ownersEmbed
}

export async function store (interaction:CommandInteraction) {
  // @ts-expect-error
  const assetID = interaction.options.getInteger('id')

  if (assetID.length === 0) {
    return await interaction.reply('Please provide me with a store ID before I can continue!')
  }

  await interaction.deferReply()

  const response = await axios.get(`https://api.polytoria.com/v1/store/${assetID}`, {
    validateStatus: () => true
  })
  const data = response.data
  const creator = data.creator

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    if (errResult.statusCode === 404) {
      return await interaction.editReply("Couldn't find the requested store item. Did you type in the correct store ID?")
    } else {
      return await interaction.editReply(errResult.displayText)
    }
  }

  let thumbnailURL = data.thumbnail

  if (data.type.toLowerCase() === 'audio') {
    thumbnailURL = 'https://c0.ptacdn.com/static/images/placeholders/audio.88cff071.png'
  }

  const creatorLink = creator.type === 'user'
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
  if (!['audio', 'decal', 'mesh'].includes(assetType)) {
    if (data.tags && data.tags.length > 0 && data.tags[0] !== '') {
      embed.setDescription(data.description === '' ? 'No description set.' : data.description + '\n\n**Tags:** ' + (data.tags as string[]).map(tag => `\`${tag}\``).join(', '))
    } else {
      embed.setDescription(data.description === '' ? 'No description set.' : data.description)
    }

    embed.addFields(
      {
        name: 'Price',
        value: emojiUtils.brick + ' ' + data.price.toLocaleString(),
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

  const nextButton = new ButtonBuilder()
    .setLabel('Next')
    .setStyle(ButtonStyle.Success)
    .setCustomId('next_button')

  const actionRowDropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(dropdown)

  const reply = await interaction.editReply({
    embeds: [embed],
    components: [actionRowDropdown]
  })

  let ownersPage = 1
  let selectedOption: string = 'item_option'

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.SelectMenu,
    filter: (messageInteraction: BaseInteraction) => (
      messageInteraction.isStringSelectMenu() && messageInteraction.customId === 'dropdown_menu' &&
      messageInteraction.user.id === interaction.user.id
    ),
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
    filter: (btnInteraction: BaseInteraction) => (
      btnInteraction.isButton() &&
      btnInteraction.customId === 'prev_button' &&
      btnInteraction.user.id === interaction.user.id
    ),
    time: 60000
  })

  prevButtonCollector.on('collect', async (buttonInteraction) => {
    try {
      await buttonInteraction.deferUpdate()

      if (selectedOption === 'item_owners' && ownersPage > 1) {
        ownersPage--
        const assetOwners = await fetchOwners(assetID, ownersPage)
        const newOwnersEmbed = buildOwnersEmbed(assetOwners, ownersPage, thumbnailURL)

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
    filter: (btnInteraction: BaseInteraction) => (
      btnInteraction.isButton() &&
      btnInteraction.customId === 'next_button' &&
      btnInteraction.user.id === interaction.user.id
    ),
    time: 60000
  })

  nextButtonCollector.on('collect', async (buttonInteraction) => {
    try {
      await buttonInteraction.deferUpdate()

      if (selectedOption === 'item_owners') {
        ownersPage++
        const assetOwners = await fetchOwners(assetID, ownersPage)
        const newOwnersEmbed = buildOwnersEmbed(assetOwners, ownersPage, thumbnailURL)

        console.log('next button clicked')
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