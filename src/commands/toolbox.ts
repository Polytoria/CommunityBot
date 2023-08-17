import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import axios from 'axios'
import { v4 } from 'uuid'

export async function toolbox (message: Message, args: string[]) {
  let currentPage = 0
  let searchQuery = ''

  if (args[0]) {
    searchQuery = '&q=' + args[0]
  }

  const apiURL = 'https://api.polytoria.com/v1/models/toolbox?page=0' + searchQuery

  const response = await axios.get(apiURL, { validateStatus: () => true })
  const data = response.data

  // Change Page Function, Fetch current page
  async function changePage (): Promise<string> {
    const apiURL = 'https://api.polytoria.com/v1/models/toolbox' + '?page=' + currentPage + searchQuery

    const response = await axios.get(apiURL, { validateStatus: () => true })
    let resultString: string = ''

    // @ts-expect-error
    response.data.Items.forEach((item) => {
      resultString += `[${item.Name}](https://polytoria.com/library/${item.ID})\n`
    })

    return resultString
  }

  const embed = new EmbedBuilder({
    title: 'Toolbox',
    color: 0xFF5454,
    thumbnail: {
      url: 'https://polytoria.com/assets/img/model-temp.png'
    },
    description: ''
  })

  // Fetch toolbox
  const toolboxData: string = await changePage()
  embed.setDescription(toolboxData)

  // Generate Button ID base on current time
  const buttonID: string = v4()
  const leftBtnID: string = 'left' + buttonID
  const pageNum: string = 'page' + buttonID
  const rightBtnID: string = 'right' + buttonID

  // Create Buttons
  const leftBtn: ButtonBuilder = new ButtonBuilder().setCustomId(leftBtnID).setLabel('◀').setStyle(ButtonStyle.Primary).setDisabled(true)

  const pageNumBtn: ButtonBuilder = new ButtonBuilder().setCustomId(pageNum).setLabel(`Page ${(currentPage + 1).toString()} of ${data.Pages.toString()}`).setStyle(ButtonStyle.Secondary)

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
    if (currentPage + 1 >= data.Pages) {
      rightBtn.setDisabled(true)
      currentPage = data.Pages
    } else {
      rightBtn.setDisabled(false)
    }

    if (currentPage + 1 <= 1) {
      leftBtn.setDisabled(true)
      currentPage = 1
    } else {
      leftBtn.setDisabled(false)
    }

    // Set Page
    pageNumBtn.setLabel(`Page ${(currentPage + 1).toString()} of ${data.Pages.toString()}`)

    // Fetch toolbox
    const toolboxData: string = await changePage()
    embed.setDescription(toolboxData)

    // Update Embed and Button
    const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(leftBtn).addComponents(pageNumBtn).addComponents(rightBtn)
    await msg.edit({ embeds: [embed], components: [updatedRow] })
    await i.reply({ content: ' ', ephemeral: true })
  })

  return msg
}
