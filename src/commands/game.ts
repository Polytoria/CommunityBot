import {Message, MessageEmbed} from 'discord.js'
import fetch from 'node-fetch'
import {responseHandler} from '../utils/responseHandler.js'
import {userUtils} from '../utils/userUtils.js'

export async function game(message: Message, args: string[]) {
	const parsed = args[0].replace(/[^0-9]/g, '')
	const apiURL = `https://api.polytoria.com/v1/games/info?id=${parsed}`

	const response = await fetch(apiURL)
	const data: any = await response.json()

	const errResult = responseHandler.checkError(response, data)

	if (errResult.HasError == true) {
		return message.channel.send(errResult.DisplayText)
	}

	const userData = await userUtils.getUserData(data.CreatorID)

	const embed = new MessageEmbed({
		title: data.Name,
		description: data.Description,
		thumbnail: {
			url: `https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`
		},
		color: '#ff5454',
		image: {
			url: `https://polytoria.com//assets//thumbnails//games//${args[0]}.png`
		},
		fields: [
			{
				name: '🗂️ Creator ID 🗂️',
				value: data.CreatorID,
				inline: true
			},
			{
				name: '👷 Creator Name 👷',
				value: userData.Username,
				inline: true
			},
			{
				name: '🎉 Visits 🎉',
				value: data.Visits.toLocaleString(),
				inline: false
			},
			{
				name: '🔼 Likes 🔼',
				value: data.Likes.toLocaleString(),
				inline: true
			},
			{
				name: '🔽 Dislikes 🔽',
				value: data.Dislikes.toLocaleString(),
				inline: true
			},
			{
				name: '🔥 Created At 🔥',
				value: data.CreatedAt,
				inline: false
			},
			{
				name: '📦 Updated At 📦',
				value: data.UpdatedAt,
				inline: false
			},
			{
				name: '🟢 Is Active 🟢',
				value: data.IsActive.toString(),
				inline: false
			}
		]
	})

	return message.channel.send({embeds: [embed]})
}
