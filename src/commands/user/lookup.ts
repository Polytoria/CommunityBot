import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ComponentType, BaseInteraction, StringSelectMenuBuilder } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { userUtils } from '../../utils/userUtils.js'

async function fetchWallPosts (userID: number, page: number): Promise<any[]> {
  const response = await axios.get(`https://polytoria.com/api/wall/${userID}?page=${page}`)
  return response.data.data
}

function buildWallPostsEmbed (wallPostsData: any[]): EmbedBuilder {
  const wallPostsEmbed = new EmbedBuilder()
    .setTitle('Wall Posts')
    .setColor('#3498db')

  const wallPostsContent = wallPostsData.map((post: any) => {
    const pinnedEmoji = post.isPinned ? emojiUtils.pin : ''
    const pinnedMessageText = post.isPinned ? '**Pinned Message**' : ''
    const postedAt = dateUtils.atomTimeToDisplayTime(post.postedAt)

    return ` ${pinnedEmoji} ${pinnedMessageText}\n${post.content}\n*Posted by [${post.author.username}](https://polytoria.com/users/${post.author.id})* at ${postedAt}`
  })

  wallPostsEmbed.setDescription(wallPostsContent.join('\n'))
  return wallPostsEmbed
}

export async function lookUp (interaction: CommandInteraction) {
  // @ts-expect-error
  const username = interaction.options.getString('username')
  if (!username || username.length === 0) {
    return await interaction.reply('Please tell me the username so I can make you a card.')
  }

  await interaction.deferReply()

  const userData = await userUtils.getUserDataFromUsername(username)

  if (!userData) {
    return await interaction.editReply('User not found!')
  }

  const lookupResponse = await axios.get(`https://api.polytoria.com/v1/users/find?username=${username}`, {
    validateStatus: (status) => status === 200
  })
  const lookupData = lookupResponse.data

  const errResult = responseHandler.checkError(lookupResponse)

  if (errResult.hasError === true) {
    if (errResult.statusCode === 404) {
      return await interaction.editReply("Couldn't find the requested user. Did you type in the correct username?")
    } else {
      return await interaction.editReply(errResult.displayText)
    }
  }

  const userID = lookupData.id

  const response = await axios.get(`https://api.polytoria.com/v1/users/${userID}`, {
    validateStatus: () => true
  })
  const data = response.data
  let badges = ' '

  const errResult2 = responseHandler.checkError(response)

  if (errResult2.hasError === true) {
    return await interaction.editReply(errResult2.displayText)
  }

  if (data.membershipType === 'plusDeluxe') {
    badges += emojiUtils.plusdeluxe + ' '
  }
  if (data.membershipType === 'plus') {
    badges += emojiUtils.plus + ' '
  }

  const embed = new EmbedBuilder({
    title: data.username + badges,
    url: `https://polytoria.com/users/${data.id}`,
    description: data.description,
    color: 0xFF5454,
    thumbnail: {
      url: data.thumbnail?.avatar
    },
    fields: [
      {
        name: 'User ID',
        value: data.id.toString(),
        inline: true
      },
      {
        name: 'Joined At',
        value: dateUtils.atomTimeToDisplayTime(data.registeredAt),
        inline: true
      },
      {
        name: 'Last seen at',
        value: dateUtils.atomTimeToDisplayTime(data.lastSeenAt),
        inline: true
      },
      {
        name: 'Place Visits',
        value: data.placeVisits.toString(),
        inline: true
      },
      {
        name: 'Profile Views',
        value: data.profileViews.toString(),
        inline: true
      },
      {
        name: 'Forum Posts',
        value: data.forumPosts.toString(),
        inline: true
      },
      {
        name: 'Asset Sales',
        value: data.assetSales.toString(),
        inline: true
      },
      {
        name: 'Networth',
        value: emojiUtils.brick + ' ' + data.netWorth.toString(),
        inline: true
      }
    ]
  })

  const dropdown = new StringSelectMenuBuilder()
    .setCustomId('dropdown_menu')
    .setPlaceholder('Choose a lookup feature to view!')
    .addOptions([
      {
        label: '🧑 User',
        value: 'user_option'
      },
      {
        label: '📝 Wall Posts',
        value: 'wall_posts_option'
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

  let wallPostsPage = 1
  let selectedOption: string = 'user_option'

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

    if (selectedOption === 'user_option') {
      await interaction.editReply({
        embeds: [embed],
        components: [actionRowDropdown]
      })
    } else if (selectedOption === 'wall_posts_option') {
      const wallPostsData = await fetchWallPosts(userID, wallPostsPage)
      const newWallPostsEmbed = buildWallPostsEmbed(wallPostsData)

      await interaction.editReply({
        embeds: [newWallPostsEmbed],
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

      if (selectedOption === 'wall_posts_option' && wallPostsPage > 1) {
        wallPostsPage--
        const wallPostsData = await fetchWallPosts(userID, wallPostsPage)
        const newWallPostsEmbed = buildWallPostsEmbed(wallPostsData)

        await interaction.editReply({
          embeds: [newWallPostsEmbed],
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

      if (selectedOption === 'wall_posts_option') {
        wallPostsPage++
        const wallPostsData = await fetchWallPosts(userID, wallPostsPage)
        const newWallPostsEmbed = buildWallPostsEmbed(wallPostsData)

        await interaction.editReply({
          embeds: [newWallPostsEmbed],
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
