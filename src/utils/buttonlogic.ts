import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, BaseInteraction } from 'discord.js'

export const prevButton = new ButtonBuilder()
  .setLabel('Previous')
  .setStyle(ButtonStyle.Danger)
  .setCustomId('prev_button')

export const nextButton = new ButtonBuilder()
  .setLabel('Next')
  .setStyle(ButtonStyle.Success)
  .setCustomId('next_button')

export const createPrevButtonCollector = (reply: any, interaction: any, actionRowDropdown: ActionRowBuilder<any>, fetchWallPosts: any, buildWallPostsEmbed: any, userID: number, wallPostsPage: number) => {
  return reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (btnInteraction: BaseInteraction) => (
      btnInteraction.isButton() &&
      btnInteraction.customId === 'prev_button' &&
      btnInteraction.user.id === interaction.user.id
    ),
    time: 60000
  }).on('collect', async (buttonInteraction: { deferUpdate: () => any }) => {
    try {
      await buttonInteraction.deferUpdate()

      if (wallPostsPage > 1) {
        wallPostsPage--
        const wallPostsData = await fetchWallPosts(userID, wallPostsPage)
        const newWallPostsEmbed = buildWallPostsEmbed(wallPostsData.data)

        await interaction.editReply({
          embeds: [newWallPostsEmbed],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
            actionRowDropdown
          ]
        })
      }
    } catch (error) {
      console.error('Error handling interaction:', error)
    }
  })
}

export const createNextButtonCollector = (reply: any, interaction: any, actionRowDropdown: ActionRowBuilder<any>, fetchWallPosts: any, buildWallPostsEmbed: any, userID: number, wallPostsPage: number) => {
  return reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter: (btnInteraction: BaseInteraction) => (
      btnInteraction.isButton() &&
      btnInteraction.customId === 'next_button' &&
      btnInteraction.user.id === interaction.user.id
    ),
    time: 60000
  }).on('collect', async (buttonInteraction: { deferUpdate: () => any }) => {
    try {
      await buttonInteraction.deferUpdate()

      wallPostsPage++
      const wallPostsData = await fetchWallPosts(userID, wallPostsPage)
      const newWallPostsEmbed = buildWallPostsEmbed(wallPostsData.data)

      await interaction.editReply({
        embeds: [newWallPostsEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(prevButton, nextButton),
          actionRowDropdown
        ]
      })
    } catch (error) {
      console.error('Error handling interaction:', error)
    }
  })
}
