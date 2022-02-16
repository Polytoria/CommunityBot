import { Message, MessageEmbed } from 'discord.js'
import { userUtils } from '../../utils/userUtils.js'
import progressBar from 'string-progressbar'

export async function level (message: Message, args: string[]) {
  if (!args[0]) {
    return message.reply('Please tell me the username so I can calculate the level.')
  }
  const userData = await userUtils.getUserDataFromUsername(args[0])

  const levelData = await userUtils.getLevel(userData.ID)

  let description = `⭐ ${userData.Username}'s Level is **${levelData.final} (${levelData.rank})** 🎉`
  description += `\n\n💬 Forum level is ${levelData.levels.forum}`
  description += `\n💰 Economy level is ${levelData.levels.economy}`
  description += `\n👨‍👩‍👦 Fame level is ${levelData.levels.fame}`
  description += `\n\nNoob 🤓 ${progressBar.splitBar(75, levelData.final, 8, '▬', '🟢')[0]} Pro 😎`

  const embed = new MessageEmbed({
    title: userData.Username + "'s Level",
    url: `https://polytoria.com/user/${userData.ID}`,
    description: description,
    color: '#ff5454',
    thumbnail: {
      url: `https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`
    },
    fields: [
      {
        name: 'Forum Posts',
        value: userData.ForumPosts.toLocaleString(),
        inline: true
      },
      {
        name: 'Friend count',
        value: '~' + levelData.external.friendCountRounded.toLocaleString(),
        inline: true
      },
      {
        name: 'Account Age(Month)',
        value: levelData.external.accountAgeMonth.toLocaleString(),
        inline: true
      },
      {
        name: 'Trade Value',
        value: userData.TradeValue.toLocaleString(),
        inline: true
      },
      {
        name: 'Profile Views',
        value: userData.ProfileViews.toLocaleString(),
        inline: true
      },
      {
        name: 'Item Sales',
        value: userData.ItemSales.toLocaleString(),
        inline: true
      }
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
