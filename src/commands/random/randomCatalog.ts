import {Message, MessageEmbed} from 'discord.js'
import {dateUtils} from '../../utils/dateUtils.js'
import {randomUtils} from '../../utils/randomUtils.js'
import {creatorUtils} from '../../utils/creatorUtils.js'
import {ICreator} from '../../../types'

export async function randomCatalog(message: Message, args: string[]) {

    const randomData = await randomUtils.randomize('https://api.polytoria.com/v1/asset/info',function() {
        return true
    },function() {
        return {id: randomUtils.randomInt(1,20000)}
    },20)


	if (randomData == null) {
		return message.channel.send("Catalog item not found, Please try again..")
	}

    const data = randomData.data

	const creator: ICreator = {
		creatorID: data.CreatorID,
		creatorType: data.CreatorType
	}

	const creatorDisplay: string = await creatorUtils.getDisplayCreatorName(creator)

	const embed = new MessageEmbed({
		title: data.Name,
		description: data.Description,
		url: `https://polytoria.com/shop/${data.ID}`,
		thumbnail: {
			url: data.Thumbnail
		},
		color: '#ff5454',
		fields: [
			{
				name: '👷 Creator Name 👷',
				value: creatorDisplay,
				inline: true
			},
			{
				name: '👕 Type 👕',
				value: data.Type,
				inline: true
			},
			{
				name: '💰 Price 💰',
				value: data.Price.toString(),
				inline: true
			},
			{
				name: '💵 Currency 💵',
				value: data.Currency,
				inline: false
			},
			{
				name: '🔥 Created At 🔥',
				value: dateUtils.atomTimeToDisplayTime(data.CreatedAt),
				inline: true
			}
		]
	})

	return await message.channel.send({embeds: [embed]})
}
