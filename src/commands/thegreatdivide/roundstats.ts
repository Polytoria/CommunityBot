import { CommandInteraction, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export async function handleRoundStats (interaction: CommandInteraction, roundID: number) {
  try {
    const roundResponse = await axios.get(`https://stats.dargy.party/rounds/${roundID}`)
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
      .setFooter({ text: 'This data has been provided by dargy. Thank you for your public API!', iconURL: 'https://cdn.polytoria.com/thumbnails/avatars/d8b2237d4e2e5b4acfef5885f722cee8d20ae42f15b7027ac6984ea75314a9be-icon.png' })

    await interaction.reply({ embeds: [embed] })
  } catch (error) {
    console.error('Error fetching round data:', error)
    await interaction.reply({ content: 'There was an error fetching the round data. Please try again later.', ephemeral: true })
  }
}
