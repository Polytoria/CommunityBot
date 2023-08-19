import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, BaseInteraction } from 'discord.js'
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

  const embed = new EmbedBuilder()
    .setTitle(data.name + ' ' + (data.isVerified === true ? emojiUtils.checkmark : ''))
    .setDescription(data.description)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .addFields(
      {
        name: 'Creator',
        value: `[${creator.name}](https://polytoria.com/users/${creator.id})`,
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
  const memberUsernames = memberData
    .map((member: any) => `[${member.user.username}](https://polytoria.com/users/${member.user.id})`)
    .join('\n')

  const memberEmbed = new EmbedBuilder()
    .setTitle(data.name + ' - Members ' + (data.isVerified === true ? emojiUtils.checkmark : ''))
    .setDescription(memberUsernames)
    .setThumbnail(data.thumbnail)
    .setColor(data.color)
    .setURL('https://polytoria.com/guilds/' + data.id.toString())

  const guildButton = new ButtonBuilder()
    .setLabel('Guild')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('guild_button')

  const membersButton = new ButtonBuilder()
    .setLabel('Members')
    .setStyle(ButtonStyle.Primary)
    .setCustomId('members_button')

  const nextButton = new ButtonBuilder()
    .setLabel('Next')
    .setStyle(ButtonStyle.Success)
    .setCustomId('next_button')

  const prevButton = new ButtonBuilder()
    .setLabel('Previous')
    .setStyle(ButtonStyle.Danger)
    .setCustomId('prev_button')

  const actionRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setURL(`https://polytoria.com/guilds/${data.id}`)
        .setLabel('View on Polytoria')
        .setStyle(ButtonStyle.Link)
    )
    .addComponents(
      membersButton
    )

  const reply = await message.reply({
    embeds: [embed],
    components: [actionRow]
  })

  let memberPage = 1

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (interaction: BaseInteraction) => (
      interaction.isButton() && interaction.user.id === message.author.id
    ),
    time: 60000
  })

  collector.on('collect', async (interaction) => {
    await interaction.deferUpdate() // Defer the interaction

    if (interaction.customId === 'members_button') {
      membersButton.setDisabled(true)
      nextButton.setDisabled(false)
      prevButton.setDisabled(true)

      await reply.edit({
        embeds: [memberEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
        ]
      })

      const guildButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'guild_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      guildButtonCollector.on('collect', async () => {
        membersButton.setDisabled(false)
        nextButton.setDisabled(true)
        prevButton.setDisabled(true)
        await reply.edit({
          embeds: [embed],
          components: [actionRow]
        })
      })

      const nextButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'next_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      nextButtonCollector.on('collect', async () => {
        const newPage = memberPage + 1
        const newMemberResponse = await axios.get(`https://api.polytoria.com/v1/guilds/${guildID}/members?page=${newPage}&limit=15`)
        const newMemberData = newMemberResponse.data.members
        const newMemberUsernames: string = newMemberData.map((member: any) => member.user.username).join('\n')

        memberPage = newPage
        memberEmbed.setDescription(newMemberUsernames)

        nextButton.setDisabled(false)
        prevButton.setDisabled(false)

        await reply.edit({
          embeds: [memberEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
          ]
        })
      })

      const prevButtonCollector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: (btnInteraction: BaseInteraction) => (
          btnInteraction.isButton() &&
          btnInteraction.customId === 'prev_button' &&
          btnInteraction.user.id === message.author.id
        ),
        time: 60000
      })

      prevButtonCollector.on('collect', async () => {
        if (memberPage > 1) {
          const newPage = memberPage - 1
          const newMemberResponse = await axios.get(`https://api.polytoria.com/v1/guilds/${guildID}/members?page=${newPage}&limit=15`)
          const newMemberData = newMemberResponse.data.members
          const newMemberUsernames: string = newMemberData.map((member: any) => member.user.username).join('\n')

          memberPage = newPage
          memberEmbed.setDescription(newMemberUsernames)

          nextButton.setDisabled(false)
          prevButton.setDisabled(false)

          await reply.edit({
            embeds: [memberEmbed],
            components: [
              new ActionRowBuilder<ButtonBuilder>().addComponents(guildButton, prevButton, nextButton)
            ]
          })
        }
      })
    }
  })

  return reply
}
