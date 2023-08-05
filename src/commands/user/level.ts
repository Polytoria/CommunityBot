import { Message, MessageEmbed } from 'discord.js'
import { userUtils } from '../../utils/userUtils.js'
import progressBar from 'string-progressbar'
import emojiUtils from '../../utils/emojiUtils.js'

export async function level (message: Message, args: string[]) {
  if (!args[0]) {
    return message.reply('Please tell me the username so I can calculate the level.')
  }
  const userData = await userUtils.getUserDataFromUsername(args.join(' '))

  const levelData = await userUtils.getLevel(userData.id)

  let description = `⭐ ${userData.username}'s level is **${levelData.final} (${levelData.rank})** 🎉`
  description += `\n\n${emojiUtils.forum} Forum level is ${levelData.levels.forum}`
  description += `\n${emojiUtils.shop} Economy level is ${levelData.levels.economy}`
  description += `\n${emojiUtils.users} Fame level is ${levelData.levels.fame}`
  description += `\n\nNoob 🤓 ${progressBar.splitBar(75, levelData.final, 8, '▬', '🟢')[0]} Pro 😎`

  const embed = new MessageEmbed({
    title: userData.username + "'s level",
    url: `https://polytoria.com/users/${userData.id}`,
    description: description,
    color: '#ff5454',
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

  return message.channel.send({ embeds: [embed] })
}
