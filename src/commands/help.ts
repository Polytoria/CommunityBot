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

  const embed = new EmbedBuilder({
    title: 'List of available commands',
    color: 0xFF5454,
    description: 'Prefix: `p!`',
    thumbnail: {
      url: 'https://cdn.discordapp.com/icons/587167555068624915/4149b9aea50a0fd41260d71ac743407d.webp?size=128'
    }
  })

  // Fetch Friends
  const helpData: any = await changePage()
  embed.addFields = helpData

  // Generate Button ID base on current time
  const buttonID: string = v4()
  const leftBtnID: string = 'left' + buttonID
  const pageNum: string = 'page' + buttonID
  const rightBtnID: string = 'right' + buttonID

  // Create Buttons
  const leftBtn: ButtonBuilder = new ButtonBuilder().setCustomId(leftBtnID).setLabel('◀').setStyle(ButtonStyle.Primary).setDisabled(true)

  const pageNumBtn: ButtonBuilder = new ButtonBuilder().setCustomId(pageNum).setLabel(`Page ${currentPage + 1} of ${pagesCount}`).setStyle(ButtonStyle.Secondary)

  const rightBtn: ButtonBuilder = new ButtonBuilder().setCustomId(rightBtnID).setLabel('▶').setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder().addComponents(leftBtn).addComponents(pageNumBtn).addComponents(rightBtn)

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

    // Set Page
    pageNumBtn.setLabel(`Page ${currentPage + 1} of ${pagesCount.toString()}`)

    // Fetch Help page
    const helpData: any = changePage()
    embed.addFields = helpData

    // Update Embed and Button
    const updatedRow = new ActionRowBuilder().addComponents(leftBtn).addComponents(pageNumBtn).addComponents(rightBtn)
    await msg.edit({ embeds: [embed], components: [updatedRow] })
    await i.reply({ content: ' ', ephemeral: true })
  })

  return msg
}
