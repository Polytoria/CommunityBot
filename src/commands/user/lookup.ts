import fetch from 'node-fetch';
import { Message, MessageEmbed, MessageSelectMenu } from 'discord.js'

export async function lookUp(message: Message, _arguments: string[]) {

	let apiURL = `https://api.polytoria.com/v1/games/info?id`;

	switch (_arguments[1]) {
		case "user":
			apiURL = `https://api.polytoria.com/v1/users/getbyusername?username=${_arguments[0]}`;
			break;
		case "id":
			apiURL = `https://api.polytoria.com/v1/users/user?id=${_arguments[0]}`;
			break;
		default:
			apiURL = `https://api.polytoria.com/v1/users/getbyusername?username=${_arguments[0]}`;
			break;
	}

	const response = await fetch(apiURL);
	const data: any = await response.json();
	if (data.Success !== true) return message.channel.send('There was an unexpected error.')

	const Embed = new MessageEmbed({
		title: data.Username,
		url: `https://polytoria.com/user/${data.ID}`,
		description: data.Description,
		color: "#ff5454",
		thumbnail: {
			url: `https://polytoria.com/assets/thumbnails/avatars/${data.AvatarHash}.png`
		},
		fields: [
			{
				name: '🗂️ User ID 🗂️', value: `${data.ID}`, inline: true
			},
			{
				name: '🙎‍♂️ Rank 🙎‍♂️', value: `${data.Rank}`, inline: true
			},
			{
				name: '❤ Membership Type ❤', value: `${data.MembershipType}`, inline: false
			},
			{
				name: '📈 Profile Views 📈', value: `${data.ProfileViews}`, inline: true,
			},
			{
				name: '📦 Item Sales 📦', value: `${data.ItemSales}`, inline: true
			},
			{
				name: '💬 Forum Posts 💬', value: `${data.ForumPosts}`, inline: false,
			},
			{
				name: '💰 Trade value 💰', value: `${data.TradeValue}`, inline: false
			},
			{
				name: '🔥 Joined At 🔥', value: `${data.JoinedAt}`, inline: false,
			},
			{
				name: '🟢 Last seen at 🟢', value: `${data.LastSeenAt}`, inline: false
			},

		]
	})

	return message.channel.send({
		embeds: [Embed]
	})

}