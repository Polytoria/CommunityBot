import { CommandInteraction, EmbedBuilder } from 'discord.js'

export async function commands (interaction:CommandInteraction) {
  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xFF5454)
    .setTitle('This command is currently unavailable.')
    .setThumbnail('https://starmanthegamer.com/icon.png')
    .addFields(
      { name: 'What happened?', value: 'Polytoria has revamped their entire website, and we rely on APIs to access the information we serve to you. With those APIs currently being unavailable, we cannot serve you the requested command.' },
      { name: 'When will this command return?', value: 'In the future when the API for this command returns.', inline: true }
    )
    .setFooter({ text: 'Thank you for your patience.', iconURL: 'https://starmanthegamer.com/icon.png' })

  await interaction.reply({ embeds: [embed] })
}
