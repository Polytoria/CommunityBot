import { CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
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
  const roundID = interaction.options.getInteger('id')
  // @ts-expect-error
  const username = interaction.options.getString('username')
  // @ts-expect-error
  const isSummary = interaction.options.getSubcommand() === 'summary'

  if (isSummary) {
    // Fetch data for the summary command
    try {
      const cobrasResponse = await axios.get('https://api.polytoria.com/v1/guilds/641/')
      const phantomsResponse = await axios.get('https://api.polytoria.com/v1/guilds/642/')

      const cobrasMemberCount = cobrasResponse.data.memberCount
      const phantomsMemberCount = phantomsResponse.data.memberCount

      const embed = new EmbedBuilder()
        .setTitle('The Great Divide - Global Statistics')
        .setThumbnail('https://c0.ptacdn.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
        .addFields(
          { name: 'Cobras Statistics', value: `Member Count: ${cobrasMemberCount}`, inline: false },
          { name: 'Phantoms Statistics', value: `Member Count: ${phantomsMemberCount}`, inline: false }
        )
        .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

      // Set embed color based on the member count
      if (cobrasMemberCount > phantomsMemberCount) {
        embed.setColor(0x59AA76) // Cobras have more members
      } else {
        embed.setColor(0x6889FF) // Phantoms have equal or more members
      }

      await interaction.reply({ embeds: [embed], components: [row] })
    } catch (error) {
      console.error('Error fetching guild data:', error)
      await interaction.reply({ content: 'There was an error fetching the guild data. Please try again later.', ephemeral: true })
    }
  } else if (roundID) {
    // Fetch and display specific round information
    try {
      const roundResponse = await axios.get(`https://api.polytoria.com/v1/rounds/${roundID}`)
      const roundData = roundResponse.data
      const embedColor = roundData.winningTeam === 'phantoms' ? 0x6889FF : 0x59AA76

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`Round Information - ID: ${roundData.id}`)
        .addFields(
          { name: 'Place', value: roundData.place, inline: true },
          { name: 'Winning Team', value: roundData.winningTeam, inline: true },
          { name: 'Cobras Score', value: roundData.cobrasScore.toString(), inline: true },
          { name: 'Phantoms Score', value: roundData.phantomsScore.toString(), inline: true },
          { name: 'Duration', value: `${roundData.duration} seconds`, inline: true },
          { name: 'Created At', value: dateUtils.atomTimeToDisplayTime(roundData.createdAt), inline: true }
        )
        .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching round data:', error)
      await interaction.reply({ content: 'There was an error fetching the round data. Please try again later.', ephemeral: true })
    }
  } else if (username) {
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
  } else {
    // Fetch and display list of rounds
    try {
      const roundsResponse = await axios.get('https://api.polytoria.com/v1/rounds/')
      const roundsData = roundsResponse.data.rounds

      const embed = new EmbedBuilder()
        .setTitle('Recent Rounds')
        .setURL('https://polytoria.com/event/the-great-divide')
        .setThumbnail('https://c0.ptacdn.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
        .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

      roundsData.forEach((round: { id: number; place: string; winningTeam: string; duration: number; }) => {
        embed.addFields({
          name: `Round ${round.id} - ${round.place}`,
          value: `Winning Team: ${round.winningTeam} - Duration: ${round.duration} seconds`,
          inline: false
        })
      })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching rounds data:', error)
      await interaction.reply({ content: 'There was an error fetching the rounds data. Please try again later.', ephemeral: true })
    }
  }
}
