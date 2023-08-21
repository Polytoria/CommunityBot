import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import axios from 'axios'
import { v4 } from 'uuid'

export async function toolbox (message: Message, args: string[]) {
  let currentPage = 1
  let searchQuery = ''

  if (args[0]) {
    searchQuery = '&search=' + args[0]
  }

  const apiURL = 'https://polytoria.com/api/library?page=1' + searchQuery + '&type=model'

  console.log('API URL:', apiURL)
  const response = await axios.get(apiURL, { validateStatus: () => true })
  const meta = response.data.meta

  // Change Page Function, Fetch current page
  async function changePage (): Promise<string> {
    const apiURL = 'https://polytoria.com/api/library' + '?page=' + currentPage + searchQuery + '&type=model'

    const response = await axios.get(apiURL, { validateStatus: () => true })
    console.log(response.data)
    let resultString: string = ''

    // @ts-expect-error
    response.data.data.forEach((data) => {
      resultString += `[${data.name}](https://polytoria.com/models/${data.id})\n`
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

  const pageNumBtn: ButtonBuilder = new ButtonBuilder().setCustomId(pageNum).setLabel(`Page ${(currentPage).toString()} of ${meta.lastPage.toString()}`).setStyle(ButtonStyle.Secondary)

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
    if (currentPage >= meta.lastPage) {
      rightBtn.setDisabled(true)
      currentPage = meta.lastPage
    } else {
      rightBtn.setDisabled(false)
    }

    if (currentPage <= 1) {
      leftBtn.setDisabled(true)
      currentPage = 1
    } else {
      leftBtn.setDisabled(false)
    }

    // Set Page
    pageNumBtn.setLabel(`Page ${(currentPage).toString()} of ${meta.lastPage.toString()}`)

    // Fetch toolbox
    const toolboxData: string = await changePage()
    embed.setDescription(toolboxData)

    // Update Embed and Button
    const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(leftBtn, pageNumBtn, rightBtn)
    await msg.edit({ embeds: [embed], components: [updatedRow] })
    await i.reply({ content: ' ', ephemeral: true })
  })

  return msg
}
