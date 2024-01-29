import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from 'discord.js'

export async function info (interaction:CommandInteraction) {
  const invite = new ButtonBuilder()
    .setLabel('Invite the bot to your server!')
    .setURL('https://discord.com/api/oauth2/authorize?client_id=905979909049028649&permissions=414464724032&scope=bot')
    .setStyle(ButtonStyle.Link)

  const github = new ButtonBuilder()
    .setLabel('GitHub Repository')
    .setURL('https://github.com/Polytoria/CommunityBot')
    .setStyle(ButtonStyle.Link)

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(github, invite)

  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xFF5454)
    .setTitle('Polytoria Community Bot')
    .setURL('https://discord.com/api/oauth2/authorize?client_id=905979909049028649&permissions=414464724032&scope=bot')
    .setThumbnail('https://starmanthegamer.com/icon.png')
    .addFields(
      { name: 'Version', value: `Currently running version: ${process.env.npm_package_version}` },
      { name: 'Contributed by:', value: 'baggy, DevPixels, Index, InsertSoda, and many more!', inline: true }
    )
    .setFooter({ text: 'Thank you for using Polytoria Community Bot!', iconURL: 'https://starmanthegamer.com/icon.png' })

  await interaction.reply({ embeds: [embed], components: [row] })
}
