import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import pages from './helpPages.js'
import { v4 } from 'uuid'

export async function help (message: Message, args: string[]) {
  let currentPage = 0
  const pagesCount = pages.length

  // Change Page Function, Fetch current page
  function changePage (): any {
    return pages[currentPage]
  }

  const originalHelpData: any = await changePage()
  const embed = new EmbedBuilder({
    title: 'List of available commands',
    color: 0xFF5454,
    description: 'Prefix: `p!`',
    thumbnail: {
      url: 'https://cdn.discordapp.com/icons/587167555068624915/4149b9aea50a0fd41260d71ac743407d.webp?size=128'
    }
  })

  embed.addFields(originalHelpData)

  // Generate Button ID base on current time
  const buttonID: string = v4()
  const leftBtnID: string = 'left' + buttonID
  const pageNum: string = 'page' + buttonID
  const rightBtnID: string = 'right' + buttonID

  // Create Buttons
  const leftBtn: ButtonBuilder = new ButtonBuilder().setCustomId(leftBtnID).setLabel('◀').setStyle(ButtonStyle.Primary).setDisabled(true)

  const pageNumBtn: ButtonBuilder = new ButtonBuilder().setCustomId(pageNum).setLabel(`Page ${currentPage + 1} of ${pagesCount}`).setStyle(ButtonStyle.Secondary)

  const rightBtn: ButtonBuilder = new ButtonBuilder().setCustomId(rightBtnID).setLabel('▶').setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(leftBtn, pageNumBtn, rightBtn)

  const filter = () => true

  // Create Interaction event for 2 minutes
  const collector = message.channel.createMessageComponentCollector({ filter, time: 120000 })

  const msg = await message.channel.send({ embeds: [embed], components: [row] })

  // Listen for Button Interaction
  collector.on('collect', async (i) => {
    if (i.user.id !== message.author.id) {
      await i.reply({ content: ' ', ephemeral: true })
      return
    }
    // Change page
    if (i.customId === rightBtnID) {
      currentPage++
    } else if (i.customId === leftBtnID) {
      currentPage--
    }

    // Update button state
    if (currentPage >= pagesCount - 1) {
      rightBtn.setDisabled(true)
      currentPage = pagesCount - 1
    } else {
      rightBtn.setDisabled(false)
    }

    if (currentPage <= 0) {
      leftBtn.setDisabled(true)
      currentPage = 0
    } else {
      leftBtn.setDisabled(false)
    }

    if (currentPage === 0) {
      embed.data.fields = []
      embed.addFields(originalHelpData)
    } else {
      const helpData: any = changePage()
      embed.data.fields = []
      embed.addFields(helpData)
    }

    // Set Page
    pageNumBtn.setLabel(`Page ${currentPage + 1} of ${pagesCount.toString()}`)

    // Update Embed and Button
    const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(leftBtn, pageNumBtn, rightBtn)
    await msg.edit({ embeds: [embed], components: [updatedRow] })
    await i.reply({ content: ' ', ephemeral: true })
  })

  return msg
}
