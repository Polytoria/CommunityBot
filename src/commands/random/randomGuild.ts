import { Message, MessageEmbed } from 'discord.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'
import { userUtils } from '../../utils/userUtils.js'

export async function randomGuild (message: Message, args: string[]) {
  const randomData = await randomUtils.randomize('https://api.polytoria.com/v1/guild/info', function () {
    return true
  }, function () {
    return { id: randomUtils.randomInt(1, 2000) }
  }, 20)

  if (randomData == null) {
    return message.channel.send('Guild not found, Please try again..')
  }

  const data = randomData.data

  const userData = await userUtils.getUserData(randomData.data.CreatorID)

  const Embed = new MessageEmbed({
    title: data.Name,
    description: data.Description,
    thumbnail: {
      url: data.Thumbnail
    },
    url: 'https://polytoria.com/guilds/' + data.ID.toString(),
    color: '#ff5454',
    fields: [
      {
        name: '🗂️ Creator ID 🗂️',
        value: data.CreatorID.toString(),
        inline: true
      },
      {
        name: '👷 Creator Name 👷',
        value: userData.Username,
        inline: true
      },
      {
        name: '🎉 Members 🎉',
        value: data.Members.toLocaleString(),
        inline: true
      },
      {
        name: '✅ Is Verified ✅',
        value: data.IsVerified.toString(),
        inline: true
      },
      {
        name: '🔥 Created At 🔥',
        value: dateUtils.atomTimeToDisplayTime(data.CreatedAt),
        inline: true
      }
    ]
  })

  return message.channel.send({
    embeds: [Embed]
  })
}
