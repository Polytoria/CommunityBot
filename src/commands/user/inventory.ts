import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ButtonInteraction } from 'discord.js'
import axios from 'axios'
import { userUtils } from '../../utils/userUtils.js'
import { v4 } from 'uuid'

export async function inventory (interaction:CommandInteraction) {
  // @ts-expect-error
  const username = interaction.options.getString('username')
  if (!username || username.length === 0) {
    return await interaction.reply('Please tell me the username so I can fetch their inventory.')
  }

  await interaction.deferReply()

  const userData = await userUtils.getUserDataFromUsername(username)

  if (!userData) {
    return interaction.editReply('User not found!')
  }

  let currentPage = 1

  const apiURL = `https://api.polytoria.com/v1/users/${userData.id.toString()}/inventory`

  const response = await axios.get(apiURL, { validateStatus: () => true })

  if (response.status === 403) {
    return interaction.editReply("This user's inventory is private, and cannot be viewed.")
  }

  const data = response.data

  // Change Page Function, Fetch current page
  async function changePage (): Promise<string> {
    const apiURL = `https://api.polytoria.com/v1/users/${userData.id.toString()}/inventory?page=${currentPage}`

    const response = await axios.get(apiURL, { validateStatus: () => true })
    let resultString: string = ''

    // @ts-expect-error
    response.data.data.forEach((item) => {
      resultString += `[${item.asset.name}](https://polytoria.com/store/${item.id})\n`
    })

    return resultString
  }

  const embed = new EmbedBuilder({
    title: userData.username + "'s Inventory.",
    url: `https://polytoria.com/users/${userData.id}/inventory`,
    color: 0xFF5454,
    thumbnail: {
      url: userData.thumbnail.avatar
    },
    description: ''
  })

  // Fetch Inventory
  const inventoryData: string = await changePage()
  embed.setDescription(inventoryData)

  // Generate Button ID base on current time
  const buttonID: string = v4()
  const leftBtnID: string = 'left' + buttonID
  const pageNum: string = 'page' + buttonID
  const rightBtnID: string = 'right' + buttonID

  // Create Buttons
  const leftBtn: ButtonBuilder = new ButtonBuilder().setCustomId(leftBtnID).setLabel('◀').setStyle(ButtonStyle.Primary).setDisabled(true)

  const pageNumBtn: ButtonBuilder = new ButtonBuilder().setCustomId(pageNum).setLabel(`Page ${data.meta.currentPage.toString()} of ${data.meta.lastPage.toString()}`).setStyle(ButtonStyle.Secondary).setDisabled(true)

  const rightBtn: ButtonBuilder = new ButtonBuilder().setCustomId(rightBtnID).setLabel('▶').setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(leftBtn, pageNumBtn, rightBtn)

  const filter = () => true

  // Create Interaction event for 2 minutes
  // @ts-expect-error
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 })

  const msg = await interaction.editReply({ embeds: [embed], components: [row] })

  // Listen for Button Interaction
  collector.on('collect', async (i:ButtonInteraction) => {
    if (i.user.id !== interaction.user.id) {
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
    if (currentPage >= data.meta.lastPage) {
      rightBtn.setDisabled(true)
      currentPage = data.meta.lastPage
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
    pageNumBtn.setLabel(`Page ${data.meta.currentPage.toString()} of ${data.meta.lastPage.toString()}`)

    // Fetch Inventory
    const inventoryData: string = await changePage()
    embed.setDescription(inventoryData)

    // Update Embed and Button
    const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(leftBtn, pageNumBtn, rightBtn)
    await interaction.editReply({ embeds: [embed], components: [updatedRow] })
    await i.reply({ content: ' ', ephemeral: true })
  })

  return msg
}
