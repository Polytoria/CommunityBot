import { CommandInteraction, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export async function handleRoundStats (interaction: CommandInteraction, roundID: number) {
  try {
    const roundResponse = await axios.get(`https://stats.silly.mom/rounds/${roundID}`)
    const roundData = roundResponse.data.results[0]
    const embedColor = roundData.winner === 'phantoms' ? 0x6889FF : 0x59AA76

    const cobrasScore = roundData.cobrasScore !== null ? roundData.cobrasScore.toLocaleString() : 'N/A'
    const phantomsScore = roundData.phantomsScore !== null ? roundData.phantomsScore.toLocaleString() : 'N/A'
    const map = roundData.map !== null ? roundData.map : 'N/A'

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`Round Information - ID: ${roundData.id}`)
      .addFields(
        { name: 'Place', value: roundData.place, inline: true },
        { name: 'Winning Team', value: roundData.winner, inline: true },
        { name: 'Cobras Score', value: cobrasScore, inline: true },
        { name: 'Phantoms Score', value: phantomsScore, inline: true },
        { name: 'Duration', value: `${roundData.duration} seconds`, inline: true },
        { name: 'Map', value: map, inline: true }
      )
      .setFooter({ text: 'This data has been provided by dargy. Thank you for your public API!', iconURL: 'https://c0.ptacdn.com/thumbnails/avatars/9dbe39b3e3aac2017aba9c37fcea63fa87800262911b556487050ecda894ab4f-icon.png' })

    await interaction.reply({ embeds: [embed] })
  } catch (error) {
    console.error('Error fetching round data:', error)
    await interaction.reply({ content: 'There was an error fetching the round data. Please try again later.', ephemeral: true })
  }
}
