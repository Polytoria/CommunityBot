import fetch from 'node-fetch';
import { Message, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { userUtils } from '../utils/userUtils.js'
import { apiErrorHandler } from '../utils/apiErrorHandler.js'

export async function game(message: Message, _arguments: string[]) {
	const parsed = _arguments[0].replace(/[^0-9]/g,'')
	const apiURL = `https://api.polytoria.com/v1/games/info?id=${parsed}`;

	const response = await fetch(apiURL);
	const data: any = await response.json();
	const errresult = apiErrorHandler.CheckError(response,data)
	if (errresult.HasError == true) return message.channel.send(`${errresult.DisplayText}`)
	
	if (data.Success !== true) return message.channel.send('There was an unexpected error.')

	const userData = await userUtils.getUserData(data.CreatorID)

	const Embed = new MessageEmbed({
		title: data.Name,
		description: data.Description,
		thumbnail: {
			url: `https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`
		},
		color: "#ff5454",
		image: {
			url: `https://polytoria.com//assets//thumbnails//games//${_arguments[0]}.png`
		},
		fields: [
			{
				name: '🗂️ Creator ID 🗂️', value: `${data.CreatorID}`, inline: true
			},
			{
				name: '👷 Creator Name 👷', value: `${userData.Username}`, inline: true
			},
			{
				name: '🎉 Visits 🎉', value: `${data.Visits}`, inline: false
			},
			{
				name: '🔼 Likes 🔼', value: `${data.Likes}`, inline: true,
			},
			{
				name: '🔽 Dislikes 🔽', value: `${data.Dislikes}`, inline: true
			},
			{
				name: '🔥 Created At 🔥', value: `${data.CreatedAt}`, inline: false,
			},
			{
				name: '📦 Updated At 📦', value: `${data.UpdatedAt}`, inline: false
			},
			{
				name: '🟢 Is Active 🟢', value: `${data.IsActive}`, inline: false
			}

		]
	})

	return message.channel.send({
		embeds: [Embed]
	})

}