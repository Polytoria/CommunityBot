import { Message, MessageAttachment } from 'discord.js'
import { userUtils } from '../../utils/userUtils.js'
import { stringUtils } from '../../utils/stringUtils.js'
import pkg from 'canvas'
import path from 'path'
const { createCanvas, loadImage, registerFont } = pkg

export async function card (message: Message, args: string[]) {
  if (!args[0]) {
    return message.reply('Please tell me the username so I can make you a card.')
  }
  const userData = await userUtils.getUserDataFromUsername(args.join(' '))

  const canvas = createCanvas(500, 700)
  const ctx = canvas.getContext('2d')

  registerFont(path.resolve(path.dirname('')) + '/assets/fonts/Comfortaa-Bold.ttf', { family: 'comfortaa_bold' })

  const ribbiImg = await loadImage('https://i.imgur.com/4KCSvTb.png')
  ctx.drawImage(ribbiImg, -14.6, 57.7, 354, 174)

  const avatarImg = await loadImage(`https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`)
  ctx.drawImage(avatarImg, 156, 22, 358, 358)

  const topImg = await loadImage('https://i.imgur.com/8PamD2O.png')
  ctx.drawImage(topImg, 0, 227, 497, 471)

  ctx.font = '700 30px comfortaa_bold'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(userData.Username, 28, 340)

  ctx.fillStyle = '#d9d9d9'
  ctx.font = '15px comfortaa_bold'
  ctx.fillText('#' + userData.ID, 28, 362)
  ctx.font = '17px comfortaa_bold'
  ctx.fillStyle = '#ffffff'

  let description = userData.Description
  if (userData.Description === '') {
    description = 'No description set.'
  }

  const lines = stringUtils.getLines(ctx, stringUtils.replaceAll(description, /\r?\n|\r/, ' '), 441)
  let descXPos = 380
  let linescount = 0
  lines.forEach(function (item, index) {
    if (linescount < 2) {
      linescount = linescount + 1
      if (linescount < 2) {
        ctx.fillText(item, 28, descXPos)
      } else {
        ctx.fillText(item + '...', 28, descXPos)
      }
      descXPos = descXPos + 23
    }
  })

  ctx.font = '23px comfortaa_bold'
  ctx.fillStyle = '#ffffff'

  const levelData = await userUtils.getLevel(userData.ID)

  ctx.fillText(levelData.final.toLocaleString(), 45, 505)
  ctx.font = '35px comfortaa_bold'

  ctx.fillText(levelData.final.toLocaleString(), 110, 515)

  ctx.font = '14px comfortaa_bold'
  ctx.fillStyle = '#ffaf45'
  ctx.fillText('???', 213, 513)

  ctx.fillStyle = '#85daff'
  ctx.fillText(levelData.levels.forum.toLocaleString(), 275, 513)

  ctx.fillStyle = '#a03bff'
  ctx.fillText(levelData.levels.economy.toLocaleString(), 337, 513)

  ctx.fillStyle = '#53ff72'
  ctx.fillText(levelData.levels.fame.toLocaleString(), 410, 513)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '35px comfortaa_bold'
  ctx.fillText('~ ' + levelData.external.friendCountRounded, 70, 620)
  ctx.fillText(levelData.external.accountAgeMonth.toLocaleString(), 225, 620)
  ctx.fillText(stringUtils.numberWithCommas(userData.TradeValue), 405, 620)

  ctx.fillStyle = '#2599ff'

  if (levelData.final >= 50) {
    ctx.fillRect(85, 525, 290, 14)
  } else if (levelData.final >= 35) {
    ctx.fillRect(85, 525, 161, 14)
  } else if (levelData.final >= 15) {
    ctx.fillRect(85, 525, 95, 14)
  } else {
    ctx.fillRect(85, 525, 1, 14)
  }

  const attachment = new MessageAttachment(canvas.toBuffer(), 'Card.png')

  return message.channel.send({ files: [attachment] })
}
