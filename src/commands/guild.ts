import fetch from 'node-fetch';
import { Message, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { userUtils } from '../utils/userUtils.js'
export async function guild(message: Message, _arguments: string[]) {
	const parsed = _arguments[0].replace(/[^0-9]/g,'')
	const apiURL = `https://api.polytoria.com/v1/guild/info?id=${parsed}`;

	const response = await fetch(apiURL);
	const data: any = await response.json();
	if (data.Success !== true) return message.channel.send('There was an unexpected error.')

	const userData = await userUtils.getUserData(data.CreatorID)

	const Embed = new MessageEmbed({
		title: data.Name,
		description: data.Description,
		thumbnail: {
			url: `${data.Thumbnail}`
		},
		color: "#ff5454",
		fields: [
			{
				name: '🗂️ Creator ID 🗂️', value: `${data.CreatorID}`, inline: true
			},
			{
				name: '👷 Creator Name 👷', value: `${userData.Username}`, inline: true
			},
			{
				name: '🎉 Members 🎉', value: `${data.Members}`, inline: false
			},
			{
				name: '✅ Is Verified ✅', value: `${data.IsVerified}`, inline: true,
			},
			{
				name: '🔥 Created At 🔥', value: `${data.CreatedAt}`, inline: false,
			},
		]
	})

	return message.channel.send({
		embeds: [Embed]
	})

}