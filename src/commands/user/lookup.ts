import fetch from 'node-fetch';
import { Message, MessageEmbed, MessageSelectMenu } from 'discord.js'

var URLPattern = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i');

export async function lookUp(message: Message, _arguments: string[]) {

	let apiURL = `https://api.polytoria.com/v1/games/info?id`;

	if (isNaN(parseInt(_arguments[0]))) {
		if (URLPattern.test(_arguments[0])) { // Check if it were profile URL
			apiURL = "https://api.polytoria.com/v1/users/user?id=" + _arguments[0].replace(/\D/g,'') // Cut string out, we need only ID.
		} else { // If it's not URL, It would be username
			apiURL = "https://api.polytoria.com/v1/users/getbyusername?username=" + _arguments[0]

		}
	} else { // If it's numberic, It would be ID
		apiURL = "https://api.polytoria.com/v1/users/user?id=" + _arguments[0]
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