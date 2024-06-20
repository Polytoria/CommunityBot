import { CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import axios from 'axios'
import { dateUtils } from '../utils/dateUtils.js'
import emojiUtils from '../utils/emojiUtils.js'

export async function thegreatdivide (interaction: CommandInteraction) {
  const join = new ButtonBuilder()
    .setLabel('Enroll today!')
    .setURL('https://polytoria.com/event/the-great-divide')
    .setStyle(ButtonStyle.Link)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(join)

  // @ts-expect-error
  const roundID = interaction.options.getInteger('id')
  // @ts-expect-error
  const username = interaction.options.getString('username')
  // @ts-expect-error
  const isSummary = interaction.options.getSubcommand() === 'summary'

  if (isSummary) {
    // Fetch data for the summary command
    try {
      // Fetching member count from the old API
      const cobrasResponse = await axios.get('https://api.polytoria.com/v1/guilds/641/')
      const phantomsResponse = await axios.get('https://api.polytoria.com/v1/guilds/642/')

      const cobrasMemberCount = cobrasResponse.data.memberCount
      const phantomsMemberCount = phantomsResponse.data.memberCount

      // Fetching points from the new API
      const pointsResponse = await axios.get('https://polytoria.com/api/events/stats')
      const teamData = pointsResponse.data.teamData
      const cobrasPoints = teamData.cobras.points
      const phantomsPoints = teamData.phantoms.points

      // Format points with commas
      const formattedCobrasPoints = cobrasPoints.toLocaleString()
      const formattedPhantomsPoints = phantomsPoints.toLocaleString()

      // Constructing the embed
      const embed = new EmbedBuilder()
        .setTitle('The Great Divide - Global Statistics')
        .setThumbnail('https://c0.ptacdn.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
        .addFields(
          { name: `${emojiUtils.cobras} Cobras Statistics`, value: `Member Count: ${cobrasMemberCount}\nTeam Points: ${emojiUtils.cobrapoints} ${formattedCobrasPoints}`, inline: false },
          { name: `${emojiUtils.phantoms} Phantom Statistics`, value: `Member Count: ${phantomsMemberCount}\nTeam Points: ${emojiUtils.phantompoints} ${formattedPhantomsPoints}`, inline: false }
        )
        .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

      // Set embed color based on the points
      if (cobrasPoints > phantomsPoints) {
        embed.setColor(0x59AA76) // Cobras have more points
      } else {
        embed.setColor(0x6889FF) // Phantoms have equal or more points
      }

      await interaction.reply({ embeds: [embed], components: [row] })
    } catch (error) {
      console.error('Error fetching event statistics:', error)
      await interaction.reply({ content: 'There was an error fetching the event statistics. Please try again later.', ephemeral: true })
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
          { name: 'Cobras Score', value: roundData.cobrasScore.toLocaleString(), inline: true }, // Comma formatting
          { name: 'Phantoms Score', value: roundData.phantomsScore.toLocaleString(), inline: true }, // Comma formatting
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
    // Look up user by username and get detailed stats from new API
    await interaction.deferReply()

    try {
      // Fetch user ID
      const lookupResponse = await axios.get(`https://api.polytoria.com/v1/users/find?username=${username}`, {
        validateStatus: (status) => status === 200
      })
      const lookupData = lookupResponse.data

      if (!lookupData) {
        return await interaction.editReply('User not found!')
      }

      const userID = lookupData.id

      // Fetch user stats from new API
      const statsResponse = await axios.get(`https://stats.silly.mom/player_stats?id=${userID}`, {
        validateStatus: () => true
      })
      const statsData = statsResponse.data.results[0]

      if (!statsData) {
        return await interaction.editReply('No statistics found for this user.')
      }

      // Fetch points from Polytoria API
      const polytoriaPointsResponse = await axios.get(`https://api.polytoria.com/v1/users/${userID}/greatdivide`, {
        validateStatus: () => true
      })
      const polytoriaData = polytoriaPointsResponse.data

      const getTeamBadge = (team: string): string => {
        if (team === 'phantoms') {
          return emojiUtils.phantoms
        } else if (team === 'cobras') {
          return emojiUtils.cobras
        }
        return ''
      }

      const teamBadge = getTeamBadge(statsData.Team)
      const embedColor = statsData.Team === 'phantoms' ? 0x6889FF : 0x59AA76

      const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle(`The Great Divide - ${statsData.Username}`)
        .setURL(`https://polytoria.com/users/${userID}`)
        .setThumbnail(statsData.Thumbnail)
        .addFields(
          { name: 'Information', value: `> **${statsData.Username} joined the ${statsData.Team} on ${dateUtils.atomTimeToDisplayTime(polytoriaData.joinedAt)}**`, inline: false },
          { name: 'Team', value: `${teamBadge} ${statsData.Team}`, inline: true },
          { name: 'Kills', value: statsData.Kills.toLocaleString(), inline: true },
          { name: 'Deaths', value: statsData.Deaths.toLocaleString(), inline: true },
          { name: 'Unique Kills', value: statsData.UniqueKills.toLocaleString(), inline: true },
          { name: 'Total Points', value: `${emojiUtils.points} ${polytoriaData.points.toLocaleString()}`, inline: true },
          { name: 'Cash Earned', value: statsData.CashEarned.toLocaleString(), inline: true },
          { name: 'Flags Captured', value: statsData.FlagsCaptured.toLocaleString(), inline: true },
          { name: 'Flags Returned', value: statsData.FlagsReturned.toLocaleString(), inline: true },
          { name: 'Airdrops Collected', value: statsData.AirdropsCollected.toLocaleString(), inline: true }
        )
        .setFooter({ text: 'This data has been provided by Dragonism. Thank you for your public API!', iconURL: 'https://c0.ptacdn.com/thumbnails/avatars/609b3d372095b3fa1d7c1ecd6ed41f0eb05ec3f3ba6ba581191b83f17828bf94-icon.png' })

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
