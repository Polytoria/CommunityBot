import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { userUtils } from '../../utils/userUtils.js'

export async function avatar (message: Message, args: string[]) {
  const userData = await userUtils.getUserDataFromUsername(args[0])

  if (!userData.ID) {
    return message.reply('User not found!')
  }

  const apiURL = 'https://api.polytoria.com/v1/users/getappearance?id=' + userData.ID.toString()

  const response = await axios.get(apiURL, { validateStatus: () => true })
  const data = response.data
  const bodyColors = data.BodyColors
  const wearables = data.Wearables
  const hats = wearables.Hats

  // Make body colors string
  let bodyColorsString: string = ''

  bodyColorsString += 'Head: ' + bodyColors.Head + '\n'
  bodyColorsString += 'Torso: ' + bodyColors.Torso + '\n'
  bodyColorsString += 'Left Arm: ' + bodyColors.LeftArm + '\n'
  bodyColorsString += 'Right Arm: ' + bodyColors.RightArm + '\n'
  bodyColorsString += 'Left Leg: ' + bodyColors.LeftLeg + '\n'
  bodyColorsString += 'Right Leg: ' + bodyColors.RightLeg + '\n'

  let wearablesString = ''
  let studPrice = 0
  let brickPrice = 0

  const embed = new MessageEmbed({
    title: userData.Username + "'s Avatar",
    url: `https://polytoria.com/user/${data.ID}`,
    color: '#ff5454',
    thumbnail: {
      url: `https://polytoria.com/assets/thumbnails/avatars/${data.AvatarHash}.png`
    },
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
      wearablesString += `👒 [${itemData.data.Name}](https://polytoria.com/shop/${itemData.data.ID.toString()})\n`

      // Add to price
      if (itemData.data.Price !== -1) {
        if (itemData.data.Currency === 'Bricks') {
          brickPrice += itemData.data.Price
        } else {
          studPrice += itemData.data.Price
        }
      }
    }
  }

  for (const item of Object.values(wearables)) {
    if (typeof item === 'number') {
      const itemData = await axios.get('https://api.polytoria.com/v1/asset/info?id=' + item, { validateStatus: () => true })
      if (itemData.data.Success) {
        let emoji = '❓'
        switch (itemData.data.Type) {
          case 'Face':
            emoji = '🙂'
            break
          case 'Tshirt':
            emoji = '🎽'
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
          case 'Head':
            emoji = '🗣️'
            break
        }

        wearablesString += `${emoji} [${itemData.data.Name}](https://polytoria.com/shop/${itemData.data.ID.toString()})\n`

        // Add to price
        if (itemData.data.Price !== -1) {
          if (itemData.data.Currency === 'Bricks') {
            brickPrice += itemData.data.Price
          } else {
            studPrice += itemData.data.Price
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
      value: `${brickPrice} Brick(s) ${studPrice} Stud(s)`,
      inline: false
    }
  )

  return await oldMessage.edit({ embeds: [embed] })
}
