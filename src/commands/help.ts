import { Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import pages from './helpPages.js'
import { v4 } from 'uuid'

export async function help (message: Message, args: string[]) {
  let currentPage = 0
  const pagesCount = pages.length

  // Change Page Function, Fetch current page
  function changePage (): any {
    return pages[currentPage]
  }

  const embed = new MessageEmbed({
    title: 'List of available commands',
    color: '#ff5454',
    description: 'Prefix: `p!`',
    thumbnail: {
      url: 'https://cdn.discordapp.com/icons/587167555068624915/4149b9aea50a0fd41260d71ac743407d.webp?size=128'
    }
  })

  // Fetch Friends
  const helpData: any = await changePage()
  embed.fields = helpData

  // Generate Button ID base on current time
  const buttonID: string = v4()
  const leftBtnID: string = 'left' + buttonID
  const pageNum: string = 'page' + buttonID
  const rightBtnID: string = 'right' + buttonID

  // Create Buttons
  const leftBtn: MessageButton = new MessageButton().setCustomId(leftBtnID).setLabel('◀').setStyle('PRIMARY').setDisabled(true)

  const pageNumBtn: MessageButton = new MessageButton().setCustomId(pageNum).setLabel(`Page ${currentPage + 1} of ${pagesCount}`).setStyle('SECONDARY')

  const rightBtn: MessageButton = new MessageButton().setCustomId(rightBtnID).setLabel('▶').setStyle('PRIMARY')

  const row = new MessageActionRow().addComponents(leftBtn).addComponents(pageNumBtn).addComponents(rightBtn)

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
    embed.fields = helpData

    // Update Embed and Button
    const updatedRow = new MessageActionRow().addComponents(leftBtn).addComponents(pageNumBtn).addComponents(rightBtn)
    await msg.edit({ embeds: [embed], components: [updatedRow] })
    await i.reply({ content: 'Feteched new page for you!', ephemeral: true })
  })

  return msg
}
