import { CommandInteraction, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { dateUtils } from '../../utils/dateUtils.js'

export async function handleRoundStats (interaction: CommandInteraction, roundID: number) {
  try {
    const roundResponse = await axios.get(`https://api.polytoria.com/v1/rounds/${roundID}`)
    const roundData = roundResponse.data
    const embedColor = roundData.winningTeam === 'phantoms' ? 0x6889FF : 0x59AA76

    const cobrasScore = roundData.cobrasScore !== null ? roundData.cobrasScore.toLocaleString() : 'N/A'
    const phantomsScore = roundData.phantomsScore !== null ? roundData.phantomsScore.toLocaleString() : 'N/A'
    const map = roundData.map !== null ? roundData.map.toLocaleString() : 'N/A'

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`Round Information - ID: ${roundData.id}`)
      .addFields(
        { name: 'Place', value: roundData.place, inline: true },
        { name: 'Winning Team', value: roundData.winningTeam, inline: true },
        { name: 'Cobras Score', value: cobrasScore, inline: true },
        { name: 'Phantoms Score', value: phantomsScore, inline: true },
        { name: 'Duration', value: `${roundData.duration} seconds`, inline: true },
        { name: 'Created At', value: dateUtils.atomTimeToDisplayTime(roundData.createdAt), inline: true },
        { name: 'Map', value: map, inline: true }
      )
      .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

    await interaction.reply({ embeds: [embed] })
  } catch (error) {
    console.error('Error fetching round data:', error)
    await interaction.reply({ content: 'There was an error fetching the round data. Please try again later.', ephemeral: true })
  }
}
