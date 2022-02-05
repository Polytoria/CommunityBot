import {Message, MessageEmbed} from 'discord.js'
import {dateUtils} from '../../utils/dateUtils.js'
import {randomUtils} from '../../utils/randomUtils.js'
import {stringUtils} from '../../utils/stringUtils.js'

export async function randomUser(message: Message, args: string[]) {

    const randomData = await randomUtils.randomize('https://api.polytoria.com/v1/users/user',function(response: any) {
        return true
    },function() {
        return {id: randomUtils.randomInt(1,20000)}
    },20)


	if (randomData == null) {
		return message.channel.send("User not found, Please try again..")
	}

    const data = randomData.data

	const embed = new MessageEmbed({
		title: data.Username,
		url: `https://polytoria.com/user/${data.ID}`,
		description: data.Description,
		color: '#ff5454',
		thumbnail: {
			url: `https://polytoria.com/assets/thumbnails/avatars/${data.AvatarHash}.png`
		},
		fields: [
			{
				name: 'User ID',
				value: data.ID.toString(),
				inline: true
			},
			{
				name: 'Rank',
				value: stringUtils.capitalizeString(data.Rank),
				inline: true
			},
			{
				name: 'Membership Type',
				value: stringUtils.capitalizeString(data.MembershipType),
				inline: true
			},
			{
				name: 'Profile Views',
				value: data.ProfileViews.toLocaleString(),
				inline: true
			},
			{
				name: 'Item Sales',
				value: data.ItemSales.toLocaleString(),
				inline: true
			},
			{
				name: 'Forum Posts',
				value: data.ForumPosts.toLocaleString(),
				inline: true
			},
			{
				name: 'Trade value',
				value: data.TradeValue.toLocaleString(),
				inline: true
			},
			{
				name: 'Joined At',
				value: dateUtils.atomTimeToDisplayTime(data.JoinedAt),
				inline: true
			},
			{
				name: 'Last seen at',
				value: dateUtils.atomTimeToDisplayTime(data.LastSeenAt),
				inline: true
			}
		]
	})

	return message.channel.send({embeds: [embed]})
}
