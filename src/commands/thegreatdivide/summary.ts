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
    const cobrasResponse = await axios.get('https://api.polytoria.com/v1/guilds/641/')
    const phantomsResponse = await axios.get('https://api.polytoria.com/v1/guilds/642/')
    const cobrasMemberCount = cobrasResponse.data.memberCount
    const phantomsMemberCount = phantomsResponse.data.memberCount

    // Constructing the embed
    const embed = new EmbedBuilder()
      .setTitle('The Great Divide - Global Statistics')
      .setThumbnail('https://cdn.polytoria.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
      .addFields(
        { name: `${emojiUtils.cobras} Cobras Statistics`, value: `Member Count: ${cobrasMemberCount}\nTeam Points: ${emojiUtils.cobrapoints} 1,150,913`, inline: false },
        { name: `${emojiUtils.phantoms} Phantom Statistics`, value: `Member Count: ${phantomsMemberCount}\nTeam Points: ${emojiUtils.phantompoints} 1,056,682`, inline: false }
      )
      .setFooter({ text: 'The Great Divide has concluded as of July 14, 2024.', iconURL: 'https://cdn.polytoria.com/guilds/icons/zosu3Vgf_MzLmCkJvmgDiUgeSy74AGBy.png' })

    // Set embed color based on the points
    if (cobrasMemberCount > phantomsMemberCount) {
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
