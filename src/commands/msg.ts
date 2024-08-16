import { CommandInteraction } from 'discord.js'

export async function msg (interaction: CommandInteraction) {
  const allowedUserId = '501889384719581186'

  // Check if the user is eligible
  if (interaction.user.id !== allowedUserId) {
    await interaction.reply({ content: 'You are not eligible to use this command.', ephemeral: true })
    return
  }

  // @ts-expect-error
  const content = interaction.options.getString('content') // Get the content from the command

  if (!content) {
    await interaction.reply({ content: 'Please provide some content to repeat!', ephemeral: true })
    return
  }

  await interaction.reply(content) // Reply with the provided content
}
