import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ButtonInteraction } from 'discord.js'
import axios from 'axios'
import { userUtils } from '../../utils/userUtils.js'
import { v4 } from 'uuid'

export async function friends (interaction: CommandInteraction) {
  // @ts-expect-error
  const username = interaction.options.getString('username')
  if (!username || username.trim().length === 0) {
    return await interaction.reply('Please tell me the username so I can fetch their friends.')
  }

  await interaction.deferReply()

  const userData = await userUtils.getUserDataFromUsername(username.trim())

  if (!userData) {
    return interaction.editReply('User not found!')
  }

  let currentPage = 1

  const apiURL = `https://api.polytoria.com/v1/users/${userData.id.toString()}/friends`
  const response = await axios.get(apiURL, { validateStatus: () => true })

  if (response.status === 403) {
    return interaction.editReply("This user's friends list is private and cannot be viewed.")
  }

  const data = response.data

  if (!data || !data.friends || !Array.isArray(data.friends) || data.friends.length === 0) {
    return interaction.editReply('No friends found for this user.')
  }

  // Change Page Function, Fetch current page
  async function changePage (): Promise<string> {
    const pageURL = `${apiURL}?page=${currentPage}`
    const response = await axios.get(pageURL, { validateStatus: () => true })
    let resultString = ''

    if (response.data && response.data.friends && Array.isArray(response.data.friends)) {
      response.data.friends.forEach((friend: any) => {
        resultString += `[${friend.user.username}](https://polytoria.com/users/${friend.user.id})\n`
      })
    }

    return resultString
  }

  const embed = new EmbedBuilder()
    .setTitle(`${userData.username}'s friends`)
    .setURL(`https://polytoria.com/users/${userData.id}`)
    .setColor(0xFF5454)
    .setThumbnail(userData.thumbnail.avatar)

  // Fetch Friends
  const friendsData = await changePage()
  if (friendsData.trim().length > 0) {
    embed.setDescription(friendsData)
  } else {
    embed.setDescription('No friends found for this user.')
  }

  // Generate Button ID based on current time
  const buttonID = v4()
  const leftBtnID = 'left' + buttonID
  const pageNum = 'page' + buttonID
  const rightBtnID = 'right' + buttonID

  // Create Buttons
  const leftBtn = new ButtonBuilder().setCustomId(leftBtnID).setLabel('◀').setStyle(ButtonStyle.Primary).setDisabled(true)
  const pageNumBtn = new ButtonBuilder().setCustomId(pageNum).setLabel(`Page ${currentPage} of ${data.pages}`).setStyle(ButtonStyle.Secondary).setDisabled(true)
  const rightBtn = new ButtonBuilder().setCustomId(rightBtnID).setLabel('▶').setStyle(ButtonStyle.Primary)

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(leftBtn, pageNumBtn, rightBtn)

  const filter = () => true

  // Create Interaction event for 2 minutes
  // @ts-expect-error
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 })

  const msg = await interaction.editReply({ embeds: [embed], components: [row] })

  // Listen for Button Interaction
  collector.on('collect', async (i: ButtonInteraction) => {
    if (i.user.id !== interaction.user.id) {
      await i.reply({ content: 'You cannot interact with this button.', ephemeral: true })
      return
    }
    // Change page
    if (i.customId === rightBtnID) {
      currentPage++
    } else if (i.customId === leftBtnID) {
      currentPage--
    }

    // Update button state
    if (currentPage >= data.pages) {
      rightBtn.setDisabled(true)
      currentPage = data.pages
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
    pageNumBtn.setLabel(`Page ${currentPage} of ${data.pages}`)

    // Fetch Friends
    const friendsData = await changePage()
    if (friendsData.trim().length > 0) {
      embed.setDescription(friendsData)
    } else {
      embed.setDescription('No friends found for this user.')
    }

    // Update Embed and Button
    const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(leftBtn, pageNumBtn, rightBtn)
    await interaction.editReply({ embeds: [embed], components: [updatedRow] })
    await i.reply({ content: '', ephemeral: true })
  })

  return msg
}
