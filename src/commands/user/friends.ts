import { Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import axios from 'axios'
import { userUtils } from '../../utils/userUtils.js'
import { v4 } from 'uuid'

export async function friends (message: Message, args: string[]) {
  const userData = await userUtils.getUserDataFromUsername(args[0])

  if (!userData.ID) {
    return message.reply('User not found!')
  }

  let currentPage = 1

  const apiURL = 'https://api.polytoria.com/v1/users/friends?id=' + userData.ID.toString()

  const response = await axios.get(apiURL, { validateStatus: () => true })
  const data = response.data

  // Change Page Function, Fetch current page
  async function changePage (): Promise<string> {
    const apiURL = 'https://api.polytoria.com/v1/users/friends?id=' + userData.ID.toString() + '&page=' + currentPage

    const response = await axios.get(apiURL, { validateStatus: () => true })
    let resultString: string = ''

    // @ts-expect-error
    response.data.Friends.forEach((item) => {
      resultString += `[${item.Username}](https://polytoria.com/user/${item.ID})\n`
    })

    return resultString
  }

  const embed = new MessageEmbed({
    title: userData.Username + "'s Friends.",
    url: `https://polytoria.com/user/${userData.ID}/friends`,
    color: '#ff5454',
    thumbnail: {
      url: `https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`
    },
    description: ''
  })

  // Fetch Friends
  const friendsData: string = await changePage()
  embed.description = friendsData

  // Generate Button ID base on current time
  const buttonID: string = v4()
  const leftBtnID: string = 'left' + buttonID
  const pageNum: string = 'page' + buttonID
  const rightBtnID: string = 'right' + buttonID

  // Create Buttons
  const leftBtn: MessageButton = new MessageButton().setCustomId(leftBtnID).setLabel('◀').setStyle('PRIMARY').setDisabled(true)

  const pageNumBtn: MessageButton = new MessageButton().setCustomId(pageNum).setLabel(`Page ${currentPage.toString()} of ${data.Pages.toString()}`).setStyle('SECONDARY')

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
    if (currentPage >= data.Pages) {
      rightBtn.setDisabled(true)
      currentPage = data.Pages
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
    pageNumBtn.setLabel(`Page ${currentPage.toString()} of ${data.Pages.toString()}`)

    // Fetch Friends
    const friendsData: string = await changePage()
    embed.description = friendsData

    // Update Embed and Button
    const updatedRow = new MessageActionRow().addComponents(leftBtn).addComponents(pageNumBtn).addComponents(rightBtn)
    await msg.edit({ embeds: [embed], components: [updatedRow] })
    await i.reply({ content: 'Feteched new page for you!', ephemeral: true })
  })

  return msg
}
