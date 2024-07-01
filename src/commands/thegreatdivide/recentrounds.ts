import { CommandInteraction, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export async function handleRecentRounds (interaction: CommandInteraction) {
  try {
    const roundsResponse = await axios.get('https://api.polytoria.co/v1/rounds/')
    const roundsData = roundsResponse.data.rounds

    const embed = new EmbedBuilder()
      .setTitle('Recent Rounds')
      .setURL('https://polytoria.co/event/the-great-divide')
      .setThumbnail('https://c0.ptacdn.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
      .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })
      .setColor(0x0099FF)

    // Ensuring roundsData is an array
    if (Array.isArray(roundsData)) {
      roundsData.forEach((round: { id: number; place: string; winningTeam: string; duration: number; map: string | null }) => {
        const mapInfo = round.map ? `- Map: ${round.map}` : ''
        embed.addFields({
          name: `Round ${round.id} - ${round.place} ${mapInfo}`,
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
}
