import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { userUtils } from '../../utils/userUtils.js'

export async function avatar (message: Message, args: string[]) {
  const userData = await userUtils.getUserDataFromUsername(args.join(' '))

  if (!userData.id) {
    return message.reply('User not found!')
  }

  const apiURL = `https://api.polytoria.com/v1/users/${userData.id.toString()}/avatar`

  const response = await axios.get(apiURL, { validateStatus: () => true })
  const data = response.data
  const bodyColors = data.colors
  const hats = data.assets

  // Make body colors string
  let bodyColorsString: string = ''

  bodyColorsString += 'Head: ' + bodyColors.head + '\n'
  bodyColorsString += 'Torso: ' + bodyColors.torso + '\n'
  bodyColorsString += 'Left Arm: ' + bodyColors.leftArm + '\n'
  bodyColorsString += 'Right Arm: ' + bodyColors.rightArm + '\n'
  bodyColorsString += 'Left Leg: ' + bodyColors.leftLeg + '\n'
  bodyColorsString += 'Right Leg: ' + bodyColors.rightLeg + '\n'

  let wearablesString = ''
  let brickPrice = 0

  const embed = new MessageEmbed({
    title: userData.username + "'s Avatar",
    url: `https://polytoria.com/user/${data.id}`,
    color: '#ff5454',
    fields: [
      {
        name: 'Currently Wearing',
        value: 'Loading...',
        inline: false
      },
      {
        name: 'Body colors',
        value: bodyColorsString,
        inline: false
      },

      {
        name: 'Total Price',
        value: 'Calculating..',
        inline: false
      }
    ]
  })

  const oldMessage = await message.channel.send({ embeds: [embed] })

  for (const item of Object.values(hats)) {
    const itemData = await axios.get('https://api.polytoria.com/v1/asset/info?id=' + item, { validateStatus: () => true })
    if (itemData.data.Success) {
      wearablesString += `👒 [${itemData.data.name}](https://polytoria.com/shop/${itemData.data.id.toString()})\n`

      // Add to price
      if (itemData.data.Price !== -1) {
        if (itemData.data.Currency === 'Bricks') {
          brickPrice += itemData.data.Price
        }
      }
    }
  }

  for (const item of Object.values(hats)) {
    if (typeof item === 'number') {
      const itemData = await axios.get('https://api.polytoria.com/v1/store/' + item, { validateStatus: () => true })
      if (itemData.data.Success) {
        let emoji = '❓'
        switch (itemData.data.type) {
          case 'Face':
            emoji = '🙂'
            break
          case 'Shirt':
            emoji = '👕'
            break
          case 'Pants':
            emoji = '👖'
            break
          case 'Tool':
            emoji = '🥤'
            break
        }

        wearablesString += `${emoji} [${itemData.data.name}](https://polytoria.com/store/${itemData.data.id.toString()})\n`

        // Add to price
        if (itemData.data.Price !== -1) {
          {
            brickPrice += itemData.data.price
          }
        }
      }
    }
  }

  if (wearablesString === '') {
    wearablesString = "User doesn't wear anything."
  }

  embed.setFields(
    {
      name: 'Currently Wearing',
      value: wearablesString,
      inline: false
    },
    {
      name: 'Body colors',
      value: bodyColorsString,
      inline: false
    },
    {
      name: 'Total Price',
      value: `${brickPrice} Brick(s)`,
      inline: false
    }
  )

  return await oldMessage.edit({ embeds: [embed] })
}
