import { EmbedBuilder, CommandInteraction } from 'discord.js'
import { userUtils } from '../../utils/userUtils.js'
import progressBar from 'string-progressbar'
import emojiUtils from '../../utils/emojiUtils.js'

export async function level (interaction:CommandInteraction) {
  // @ts-expect-error
  const username = interaction.options.getString('username')
  if (!username || username.length === 0) {
    return await interaction.reply('Please tell me the username so I can calculate the level.')
  }

  await interaction.deferReply()

  const userData = await userUtils.getUserDataFromUsername(username)

  if (!userData) {
    return await interaction.editReply('User not found!')
  }

  const levelData = await userUtils.getLevel(userData.id)

  let description = `⭐ ${userData.username}'s level is **${levelData.final} (${levelData.rank})** 🎉`
  description += `\n\n${emojiUtils.forum} Forum level is ${levelData.levels.forum}`
  description += `\n${emojiUtils.shop} Economy level is ${levelData.levels.economy}`
  description += `\n${emojiUtils.users} Fame level is ${levelData.levels.fame}`
  description += `\n\nNoob 🤓 ${progressBar.splitBar(75, levelData.final, 8, '▬', '🟢')[0]} Pro 😎`

  const embed = new EmbedBuilder({
    title: userData.username + "'s level",
    url: `https://polytoria.co/users/${userData.id}`,
    description,
    color: 0xFF5454,
    thumbnail: {
      url: userData.thumbnail.avatar
    },
    fields: [
      {
        name: 'Forum Posts',
        value: userData.forumPosts.toLocaleString(),
        inline: true
      },
      {
        name: 'Account Age',
        value: levelData.external.accountAgeMonth.toLocaleString(),
        inline: true
      },
      {
        name: 'Networth',
        value: userData.netWorth.toLocaleString(),
        inline: true
      },
      {
        name: 'Profile Views',
        value: userData.profileViews.toLocaleString(),
        inline: true
      },
      {
        name: 'Item Sales',
        value: userData.assetSales.toLocaleString(),
        inline: true
      }
    ]
  })

  return await interaction.editReply({ embeds: [embed] })
}
