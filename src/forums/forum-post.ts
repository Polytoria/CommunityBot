import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js'
import { responseHandler } from '../utils/responseHandler.js'
import { dateUtils } from '../utils/dateUtils.js'

export async function forumpost (interaction: CommandInteraction) {
  // @ts-expect-error
  const forumID = interaction.options.getInteger('id')

  if (!forumID) {
    return await interaction.reply('Please provide a forum ID before I can continue!')
  }

  await interaction.deferReply()

  const response = await fetch(`https://api.polytoria.com/v1/forum/${forumID}`)
  const errResult = await responseHandler.checkError(response)

  if (errResult.hasError && errResult.embed) {
    return await interaction.editReply({ embeds: [errResult.embed] })
  }

  const data = await response.json()

  let statusMessage = ''

  if (data.isPinned) {
    statusMessage += '📌 **This post is pinned.**\n'
  }

  if (data.isLocked) {
    statusMessage += '🔒 **This post is locked.**\n'
  }

  const embed = new EmbedBuilder({
    title: data.title,
    description: `${statusMessage}\n${data.content}`,
    color: parseInt(data.category.color.replace('#', ''), 16),
    author: {
      name: data.author.username,
      iconURL: data.author.avatarIconUrl,
      url: `https://polytoria.com/users/${data.author.id}`
    },
    fields: [
      {
        name: 'Category',
        value: `[${data.category.name}](https://polytoria.com/forum/category/${data.category.id})`,
        inline: true
      },
      {
        name: 'Group',
        value: data.category.group.name,
        inline: true
      },
      {
        name: 'Rating',
        value: data.rating.toString(),
        inline: true
      },
      {
        name: 'Replies',
        value: data.total.toString(),
        inline: true
      },
      {
        name: 'Posted At',
        value: dateUtils.atomTimeToDisplayTime(data.postedAt),
        inline: true
      },
      {
        name: 'Last Bumped At',
        value: dateUtils.atomTimeToDisplayTime(data.bumpedAt),
        inline: true
      }
    ],
    url: `https://polytoria.com/forum/post/${data.id}`
  })

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setURL(`https://polytoria.com/forum/post/${data.id}`)
      .setLabel('View on Polytoria')
      .setStyle(ButtonStyle.Link)
  )

  return await interaction.editReply({
    embeds: [embed],
    components: [actionRow]
  })
}
