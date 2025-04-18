import { CommandInteraction, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export async function handleRecentRounds (interaction: CommandInteraction) {
  try {
    const roundsResponse = await axios.get('https://stats.dargy.party/rounds')
    const roundsData = roundsResponse.data.results

    const embed = new EmbedBuilder()
      .setTitle('Recent Rounds')
      .setURL('https://polytoria.com/event/the-great-divide')
      .setThumbnail('https://c0.ptacdn.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
      .setFooter({ text: 'The Great Divide has concluded as of July 14, 2024.', iconURL: 'https://c0.ptacdn.com/guilds/icons/zosu3Vgf_MzLmCkJvmgDiUgeSy74AGBy.png' })
      .setColor(0x0099FF)

    // Ensuring roundsData is an array
    if (Array.isArray(roundsData)) {
      roundsData.forEach((round: { id: number; place: string; winner: string; duration: number; map: string | null}) => {
        const mapInfo = round.map ? `- Map: ${round.map}` : ''
        embed.addFields({
          name: `Round ${round.id} - ${round.place} ${mapInfo}`,
          value: `Winning Team: ${round.winner} - Duration: ${round.duration} seconds`,
          inline: false
        })
      })
    }

    await interaction.reply({ embeds: [embed] })
  } catch (error) {
    console.error('Error fetching rounds data:', error)
    await interaction.reply({ content: 'There was an error fetching the rounds data. Please try again later.', ephemeral: true })
  }
}
