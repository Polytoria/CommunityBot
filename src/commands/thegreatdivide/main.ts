import { CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import axios from 'axios'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { handleLeaderboard } from './leaderboard.js' // Import the leaderboard handler
import { handleUserSummary } from './userstats.js' // Import the user summary handler

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
  // @ts-expect-error
  const isLeaderboard = interaction.options.getSubcommand() === 'leaderboard'
  // @ts-expect-error
  const isRound = interaction.options.getSubcommand() === 'round'

  if (isSummary) {
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
          { name: 'Cobras Score', value: roundData.cobrasScore.toLocaleString(), inline: true },
          { name: 'Phantoms Score', value: roundData.phantomsScore.toLocaleString(), inline: true },
          { name: 'Duration', value: `${roundData.duration} seconds`, inline: true },
          { name: 'Created At', value: dateUtils.atomTimeToDisplayTime(roundData.createdAt), inline: true }
        )
        .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching round data:', error)
      await interaction.reply({ content: 'There was an error fetching the round data. Please try again later.', ephemeral: true })
    }
  } else if (isRound) {
    try {
      const roundsResponse = await axios.get('https://api.polytoria.com/v1/rounds/')
      const roundsData = roundsResponse.data.rounds // Access the 'rounds' array inside the response

      const embed = new EmbedBuilder()
        .setTitle('Recent Rounds')
        .setURL('https://polytoria.com/event/the-great-divide')
        .setThumbnail('https://c0.ptacdn.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
        .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })
        .setColor(0x0099FF)

      // Ensuring roundsData is an array
      if (Array.isArray(roundsData)) {
        roundsData.forEach((round: { id: number; place: string; winningTeam: string; duration: number; }) => {
          embed.addFields({
            name: `Round ${round.id} - ${round.place}`,
            value: `Winning Team: ${round.winningTeam} - Duration: ${round.duration} seconds`,
            inline: false
          })
        })
      }

      await interaction.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Error fetching rounds data:', error)
      await interaction.reply({ content: 'There was an error fetching the rounds data. Please try again later.', ephemeral: true })
    }
  } else if (username) {
    // Use the new function from thegreatdivide_user.ts
    await handleUserSummary(interaction, username)
  } else if (isLeaderboard) {
    await handleLeaderboard(interaction)
  }
}
