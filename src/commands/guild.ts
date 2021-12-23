import {Message, MessageEmbed} from 'discord.js'
import fetch from 'node-fetch'
import {responseHandler} from '../utils/responseHandler.js'
import {userUtils} from '../utils/userUtils.js'

export async function guild(message: Message, args: string[]) {
	const parsed = args[0].replace(/[^0-9]/g, '')
	const apiURL = `https://api.polytoria.com/v1/guild/info?id=${parsed}`

	const response = await fetch(apiURL)
	const data: any = await response.json()

	const errResult = responseHandler.checkError(response, data)

	if (errResult.HasError == true) {
		return message.channel.send(errResult.DisplayText)
	}

	const userData = await userUtils.getUserData(data.CreatorID)

	const Embed = new MessageEmbed({
		title: data.Name,
		description: data.Description,
		thumbnail: {
			url: data.thumbnail
		},
		color: '#ff5454',
		fields: [
			{
				name: '🗂️ Creator ID 🗂️',
				value: data.CreatorID.toString(),
				inline: true
			},
			{
				name: '👷 Creator Name 👷',
				value: userData.Username,
				inline: true
			},
			{
				name: '🎉 Members 🎉',
				value: data.Members.toLocaleString(),
				inline: false
			},
			{
				name: '✅ Is Verified ✅',
				value: data.IsVerified.toString(),
				inline: true
			},
			{
				name: '🔥 Created At 🔥',
				value: data.CreatedAt,
				inline: false
			}
		]
	})

	return message.channel.send({
		embeds: [Embed]
	})
}
