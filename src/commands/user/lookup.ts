import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, CommandInteraction, BaseInteraction, ComponentType, ButtonBuilder } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { userUtils } from '../../utils/userUtils.js'
import { buildWallPostsEmbed } from './wallPosts.js'
import { fetchAvatar, buildAvatarEmbed, buildAvatarComponents } from './avatar.js'
import { createPrevButtonCollector, createNextButtonCollector, prevButton, nextButton } from '../../utils/buttonlogic.js'

async function fetchWallPosts (userID: number, page: number): Promise<{ success: boolean, data: any[] }> {
  const response = await axios.get(`https://polytoria.com/api/wall/${userID}?page=${page}`)
  return response.data
}

export async function lookUp (interaction: CommandInteraction) {
  // @ts-expect-error
  const username = interaction.options.getString('username')
  if (!username || username.length === 0) {
    return await interaction.reply('Please enter a username for me to look up.')
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
        value: data.placeVisits.toLocaleString(),
        inline: true
      },
      {
        name: 'Profile Views',
        value: data.profileViews.toLocaleString(),
        inline: true
      },
      {
        name: 'Forum Posts',
        value: data.forumPosts.toLocaleString(),
        inline: true
      },
      {
        name: 'Asset Sales',
        value: data.assetSales.toLocaleString(),
        inline: true
      },
      {
        name: 'Networth',
        value: emojiUtils.brick + ' ' + data.netWorth.toLocaleString(),
        inline: true
      }
    ]
  })

  if (data.playing && data.playing.name) {
    const gameLink = `https://polytoria.com/places/${data.playing.placeID}`
    const playingMessage = emojiUtils.playing + `** Currently playing [${data.playing.name}](${gameLink})**`
    embed.setDescription(playingMessage + '\n\n' + data.description)
  }

  const dropdown = new StringSelectMenuBuilder()
    .setCustomId('dropdown_menu')
    .setPlaceholder('Choose a lookup feature to view!')
    .addOptions([
      {
        label: '🧑 User',
        value: 'user_option'
      },
      {
        label: '👒 Avatar',
        value: 'user_avatar'
      },
      {
        label: '📝 Wall Posts',
        value: 'wall_posts_option'
      }
    ])

  const actionRowDropdown = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(dropdown)

  const reply = await interaction.editReply({
    embeds: [embed],
    components: [actionRowDropdown]
  })

  const wallPostsPage = 1
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
      if (wallPostsData.success === undefined) {
        const newWallPostsEmbed = buildWallPostsEmbed(wallPostsData.data)

        await interaction.editReply({
          embeds: [newWallPostsEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
            actionRowDropdown
          ]
        })
      } else {
        const errorEmbed = new EmbedBuilder({
          title: 'Wall Posts',
          url: `https://polytoria.com/users/${data.id}`,
          description: "This user's wall is either private or restricted to friends-only.",
          color: 0xFF5454
        })

        await interaction.editReply({
          embeds: [errorEmbed]
        })
      }
    } else if (selectedOption === 'user_avatar') {
      const avatarData = await fetchAvatar(userID)
      const avatarEmbed = buildAvatarEmbed(userData, avatarData)
      const components = buildAvatarComponents(actionRowDropdown)

      await interaction.editReply({
        embeds: [avatarEmbed],
        components
      })
    }
  })

  const prevButtonCollector = createPrevButtonCollector(reply, interaction, actionRowDropdown, fetchWallPosts, buildWallPostsEmbed, userID, wallPostsPage)
  const nextButtonCollector = createNextButtonCollector(reply, interaction, actionRowDropdown, fetchWallPosts, buildWallPostsEmbed, userID, wallPostsPage)

  prevButtonCollector.start()
  nextButtonCollector.start()
}
