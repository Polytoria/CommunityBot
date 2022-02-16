import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { dateUtils } from '../../utils/dateUtils.js'
import { userUtils } from '../../utils/userUtils.js'
import progressBar from 'string-progressbar'

export async function level (message: Message, args: string[]) {
  if (!args[0]) {
    return message.reply('Please tell me the username so I can calculate the level.')
  }
  const userData = await userUtils.getUserDataFromUsername(args[0])

  const joinDateDate = new Date(userData.JoinedAt)
  const currentDate = new Date()

  const accountAgeMonth = dateUtils.monthDifference(joinDateDate, currentDate)

  const userFriends = await axios.get('https://api.polytoria.com/v1/users/friends?id=' + userData.ID)

  const friendCountRounded = 10 * userFriends.data.Pages

  const result = 0 // 60 * ((-1/((1.2*document.getElementById('id3').value/5000)+1)+1));
  const result2 = 12 * ((-1 / ((1 * accountAgeMonth) + 0.4) + 1))
  const result3 = 12 * ((-1 / ((friendCountRounded / 100) + 1) + 1))
  const result4 = 8 * ((-1 / ((userData.ForumPosts / 25) + 1) + 1))
  const result5 = 15 * ((-1 / ((userData.ProfileViews / 1500) + 1) + 1))
  const result6 = 10 * ((-1 / ((userData.TradeValue / 30000) + 1) + 1))
  const result7 = 10 * ((-1 / ((userData.ItemSales / 3) + 1) + 1))

  const final = Math.round(result + result2 + result3 + result4 + result5 + result6 + result7)

  let rank = ''

  if (final > 15) {
    rank = 'Above Average'
    if (final > 50) {
      rank = 'Insane'
      if (final === 69) {
        rank = 'Nice'
      } else if (final > 75) {
        rank = 'God'
      }
    }
  } else {
    rank = 'Noob'
  }

  let description = `⭐ ${userData.Username}'s Level is **${final} (${rank})** 🎉`
  description += `\n\n💬 Forum level is ${Math.round(result4)}`
  description += `\n💰 Economy level is ${Math.round(result6 + result7)}`
  description += `\n👨‍👩‍👦 Fame level is ${Math.round(result3 + result5 + result6)}`
  description += `\n\nNoob 🤓 ${progressBar.splitBar(75, final, 8, '▬', '🟢')[0]} Pro 😎`

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
        value: '~' + friendCountRounded.toLocaleString(),
        inline: true
      },
      {
        name: 'Account Age(Month)',
        value: accountAgeMonth.toLocaleString(),
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
