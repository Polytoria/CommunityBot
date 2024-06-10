import { EmbedBuilder, CommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import axios from 'axios'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function thegreatdivide (interaction: CommandInteraction) {
  const join = new ButtonBuilder()
    .setLabel('Enroll today!')
    .setURL('https://polytoria.com/event/the-great-divide')
    .setStyle(ButtonStyle.Link)

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(join)

  // @ts-expect-error
  const username = interaction.options.getString('username')

  if (!username || username.length === 0) {
    // Fetch and display team member counts
    try {
      const cobrasResponse = await axios.get('https://api.polytoria.com/v1/guilds/641/')
      const phantomsResponse = await axios.get('https://api.polytoria.com/v1/guilds/642/')

      const cobrasMemberCount = cobrasResponse.data.memberCount
      const phantomsMemberCount = phantomsResponse.data.memberCount

      const embed: EmbedBuilder = new EmbedBuilder()
        .setURL('https://polytoria.com/event/the-great-divide')
        .setThumbnail('https://c0.ptacdn.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
        .addFields(
          { name: 'Cobras Statistics', value: `Member Count: ${cobrasMemberCount}`, inline: false },
          { name: 'Phantoms Statistics', value: `Member Count: ${phantomsMemberCount}`, inline: false }
        )
        .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

      if (cobrasMemberCount > phantomsMemberCount) {
        embed.setColor(0x59AA76) // Cobras have more members
      } else {
        embed.setColor(0x6889FF) // Phantoms have equal or more members
      }

      await interaction.reply({ embeds: [embed], components: [row] })
    } catch (error) {
      console.error('Error fetching member counts:', error)
      await interaction.reply({ content: 'There was an error fetching the member counts. Please try again later.', ephemeral: true })
    }
  } else {
    // Look up user by username
    await interaction.deferReply()

    try {
      const lookupResponse = await axios.get(`https://api.polytoria.com/v1/users/find?username=${username}`, {
        validateStatus: (status) => status === 200
      })
      const lookupData = lookupResponse.data

      if (!lookupData) {
        return await interaction.editReply('User not found!')
      }

      const userID = lookupData.id

      const response = await axios.get(`https://api.polytoria.com/v1/users/${userID}/greatdivide`, {
        validateStatus: () => true
      })
      const data = response.data

      const getTeamBadge = (team: string): string => {
        if (team === 'phantoms') {
          return emojiUtils.phantoms
        } else if (team === 'cobras') {
          return emojiUtils.cobras
        }
        return ''
      }

      const teamBadge = getTeamBadge(data.team)
      const embedColor = data.team === 'phantoms' ? 0x6889FF : 0x59AA76

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`The Great Divide - ${lookupData.username}`)
        .setURL(`https://polytoria.com/users/${userID}`)
        .setThumbnail(data.icon)
        .addFields(
          { name: 'Team', value: `${teamBadge} ${data.team}`, inline: true },
          { name: 'Joined', value: dateUtils.atomTimeToDisplayTime(data.joinedAt), inline: true },
          { name: 'Points', value: data.points.toString(), inline: true }
        )
        .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching user data:', error)
      await interaction.editReply({ content: 'There was an error fetching the user data. Please try again later.' })
    }
  }
}
