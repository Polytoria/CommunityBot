import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../utils/responseHandler.js'
import { dateUtils } from '../utils/dateUtils.js'
import { creatorUtils } from '../utils/creatorUtils.js'
import { ICreator } from '../../types'

export async function catalog (message: Message, args: string[]) {
  const assetID = parseInt(args[0])

  const response = await axios.get('https://api.polytoria.com/v1/asset/info', { params: { id: assetID }, validateStatus: () => true })
  const data = response.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const creator: ICreator = {
    creatorID: data.CreatorID,
    creatorType: data.CreatorType
  }

  const creatorDisplay: string = await creatorUtils.getDisplayCreatorName(creator)

  const embed = new MessageEmbed({
    title: data.Name,
    description: data.Description === '' ? 'No description set.' : data.Description,
    url: `https://polytoria.com/shop/${data.ID}`,
    thumbnail: {
      url: data.Thumbnail
    },
    color: '#ff5454',
    fields: [
      {
        name: 'Creator Name',
        value: creatorDisplay,
        inline: true
      },
      {
        name: 'Type',
        value: data.Type,
        inline: true
      },
      {
        name: 'Price',
        value: data.Price.toString(),
        inline: true
      },
      {
        name: 'Currency',
        value: data.Currency,
        inline: false
      },
      {
        name: 'Created At',
        value: dateUtils.atomTimeToDisplayTime(data.CreatedAt),
        inline: true
      }
    ]
  })

  return message.channel.send({
    embeds: [embed]
  })
}
