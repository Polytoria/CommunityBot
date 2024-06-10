import { EmbedBuilder, CommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import axios from 'axios'

export async function thegreatdivide (interaction: CommandInteraction) {
  const join = new ButtonBuilder()
    .setLabel('Enroll today!')
    .setURL('https://polytoria.com/event/the-great-divide')
    .setStyle(ButtonStyle.Link)

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(join)

  try {
    const cobrasResponse = await axios.get('https://api.polytoria.com/v1/guilds/641/')
    const phantomsResponse = await axios.get('https://api.polytoria.com/v1/guilds/642/')

    const cobrasMemberCount = cobrasResponse.data.memberCount
    const phantomsMemberCount = phantomsResponse.data.memberCount

    const embed: EmbedBuilder = new EmbedBuilder()
      .setColor(0xFF5454)
      .setTitle('The Great Divide')
      .setURL('https://polytoria.com/event/the-great-divide')
      .setThumbnail('https://c0.ptacdn.com/static/assets/events/great-divide-assets/logo.d7df4fce.png')
      .addFields(
        { name: 'Cobras Statistics', value: `Member Count: ${cobrasMemberCount}`, inline: false },
        { name: 'Phantoms Statistics', value: `Member Count: ${phantomsMemberCount}`, inline: false }
      )
      .setFooter({ text: 'Not already enrolled in a team? Join the phantoms!', iconURL: 'https://c0.ptacdn.com/guilds/icons/bbLypENoqMEipAPsPK5h-kLSaysV6VGB.png' })

    await interaction.reply({ embeds: [embed], components: [row] })
  } catch (error) {
    console.error('Error fetching member counts:', error)
    await interaction.reply({ content: 'There was an error fetching the member counts. Please try again later.', ephemeral: true })
  }
}
