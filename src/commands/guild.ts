import { Message, MessageEmbed, MessageActionRow, MessageButton, Interaction } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function guild (message: Message, args: string[]): Promise<Message | null> {
  const guildID: number = parseInt(args[0])

  if (args.length === 0) {
    return message.reply('Please provide me with a guild ID before I can continue!')
  }

  const response = await axios.get(`https://api.polytoria.com/v1/guilds/${guildID}`, { validateStatus: () => true })
  const data = response.data
  const creator = data.creator

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

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

  const memberResponse = await axios.get(`https://api.polytoria.com/v1/guilds/${guildID}/members?page=1&limit=15`)
  const memberData = memberResponse.data.members

  const memberUsernames: string = memberData.map((member: any) => member.user.username).join('\n')

  const memberEmbed = new MessageEmbed()
    .setTitle('Members')
    .setDescription(memberUsernames)

  const guildButton = new MessageButton()
    .setLabel('Guild')
    .setStyle('PRIMARY')
    .setCustomId('guild_button')

  const membersButton = new MessageButton()
    .setLabel('Members')
    .setStyle('PRIMARY')
    .setCustomId('members_button')

  const actionRow: MessageActionRow = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setURL(`https://polytoria.com/guilds/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle('LINK')
    )
    .addComponents(
      membersButton
    )

  const reply = await message.reply({
    embeds: [embed],
    components: [actionRow]
  })

  const collector = reply.createMessageComponentCollector({
    componentType: 'BUTTON',
    filter: (interaction: Interaction) => (
      interaction.isButton() && interaction.user.id === message.author.id
    ),
    time: 60000,
    max: 1
  })

  collector.on('collect', async (interaction) => {
    if (interaction.customId === 'members_button') {
      membersButton.setDisabled(true)
      await reply.edit({
        embeds: [memberEmbed],
        components: [
          new MessageActionRow().addComponents(guildButton)
        ]
      })

      const guildButtonCollector = reply.createMessageComponentCollector({
        componentType: 'BUTTON',
        filter: (btnInteraction: Interaction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'guild_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000,
        max: 1
      })

      guildButtonCollector.on('collect', async () => {
        membersButton.setDisabled(false)
        await reply.edit({
          embeds: [embed],
          components: [actionRow]
        })
      })
    }
  })

  return reply
}
