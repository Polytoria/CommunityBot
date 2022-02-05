import {Message, MessageEmbed} from 'discord.js'
import {dateUtils} from '../../utils/dateUtils.js'
import {userUtils} from '../../utils/userUtils.js'
import {randomUtils} from '../../utils/randomUtils.js'

export async function randomGame(message: Message, args: string[]) {

    const randomData = await randomUtils.randomize('https://api.polytoria.com/v1/games/info',function(response: any) {
        return response.data.IsActive
    },function() {
        return {id: randomUtils.randomInt(1,2500)}
    },20)


	if (randomData == null) {
		return message.channel.send("Game not found, Please try again..")
	}

    const data = randomData.data
	const userData = await userUtils.getUserData(randomData.data.CreatorID)

	const embed = new MessageEmbed({
		title: data.Name,
		description: data.Description,
		thumbnail: {
			url: `https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`
		},
        url: `https://polytoria.com/games/${randomData.data.ID}`,
		color: '#ff5454',
		image: {
			url: `https://polytoria.com/assets/thumbnails/games/${data.ID}.png`
		},
		fields: [
			{
				name: 'Creator ID',
				value: data.CreatorID.toLocaleString(),
				inline: true
			},
			{
				name: 'Creator Name',
				value: userData.Username,
				inline: true
			},
			{
				name: 'Visits',
				value: data.Visits.toLocaleString(),
				inline: true
			},
			{
				name: 'Likes',
				value: data.Likes.toLocaleString(),
				inline: true
			},
			{
				name: 'Dislikes',
				value: data.Dislikes.toLocaleString(),
				inline: true
			},
			{
				name: 'Created At',
				value: dateUtils.atomTimeToDisplayTime(data.CreatedAt),
				inline: true
			},
			{
				name: 'Updated At',
				value: dateUtils.atomTimeToDisplayTime(data.UpdatedAt),
				inline: true
			},
			{
				name: 'Is Active',
				value: data.IsActive.toString(),
				inline: true
			}
		]
	})

	return message.channel.send({embeds: [embed]})
}
