import { CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import axios from 'axios'
import emojiUtils from '../../utils/emojiUtils.js'

export async function handleSummary (interaction: CommandInteraction) {
  const join = new ButtonBuilder()
    .setLabel('Enroll today!')
    .setURL('https://polytoria.com/event/the-great-divide')
    .setStyle(ButtonStyle.Link)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(join)

  try {
    // Fetching member count from the old API
    const cobrasResponse = await axios.get('https://api.polytoria.co/v1/guilds/641/')
    const phantomsResponse = await axios.get('https://api.polytoria.co/v1/guilds/642/')
    const cobrasMemberCount = cobrasResponse.data.memberCount
    const phantomsMemberCount = phantomsResponse.data.memberCount

    // Fetching points from the new API
    const pointsResponse = await axios.get('https://polytoria.co/api/events/stats')
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

    // Ensure the row is included in the reply
    await interaction.reply({ embeds: [embed], components: [row] })
  } catch (error) {
    console.error('Error fetching event statistics:', error)
    await interaction.reply({ content: 'There was an error fetching the event statistics. Please try again later.', ephemeral: true })
  }
}
