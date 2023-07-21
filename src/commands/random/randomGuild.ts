import { Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { dateUtils } from '../../utils/dateUtils.js'
import { randomUtils } from '../../utils/randomUtils.js'

export async function randomGuild (message: Message, args: string[]) {
  const randomId = randomUtils.randomInt(1, 507)
  const apiUrl = `https://api.polytoria.com/v1/guilds/${randomId}`

  console.log('API URL:', apiUrl) // Log the API URL to the console

  const randomData = await randomUtils.randomize(
    apiUrl,
    function (response: any) {
      return response.data
    },
    function () {
      return { id: randomId }
    },
    20
  )

  if (randomData == null) {
    return message.channel.send('Guild not found, Please try again..')
  }

  const data = randomData.data
  const creator = data.creator

  const embed = new MessageEmbed()
    .setTitle(data.name + ' ' + (data.isVerified === true ? emojiUtils.checkmark : ''))
    .setDescription(data.description)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .addFields(
      {
        name: 'Creator',
        value: `[${creator.name}](https://polytoria.com/user/${creator.id})`,
        inline: true
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.createdAt),
        inline: true
      },
      {
        name: 'Join Type',
        value: data.joinType.toLocaleString(),
        inline: true
      },
      {
        name: 'Members',
        value: data.memberCount.toLocaleString(),
        inline: true
      },
      {
        name: 'Vault',
        value: emojiUtils.brick + ' ' + data.vaultBalance.toString(),
        inline: true
      }
    )

  if (data.banner !== 'https://c0.ptacdn.com/guilds/banners/default.png') {
    embed.setImage(data.banner)
  }

  // Create the action row and button
  const actionRow = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(`https://polytoria.com/store/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle('LINK')
    )

  return message.reply({
    embeds: [embed],
    components: [actionRow]
  })
}
