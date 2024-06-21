import { CommandInteraction, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { dateUtils } from '../../utils/dateUtils.js'
import { handleLeaderboard } from './leaderboard.js' // Import the leaderboard handler
import { handleUserSummary } from './userstats.js' // Import the user summary handler
import { handleSummary } from './summary.js' // Import the summary handler

export async function thegreatdivide (interaction: CommandInteraction) {
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
    await handleSummary(interaction)
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
    await handleUserSummary(interaction, username)
  } else if (isLeaderboard) {
    await handleLeaderboard(interaction)
  }
}
