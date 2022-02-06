import {Message, MessageEmbed} from 'discord.js'
import {randomUtils} from '../../utils/randomUtils.js'
import {RandomResult} from '../../../types'
import axios from 'axios'

export async function deletedRandomCatalog(message: Message, args: string[]) {

	const embed = new MessageEmbed({
		title: "Randomizing, Please wait...",
		image: {
			url: "https://c.tenor.com/Gcq7KQ6zaQEAAAAC/angry-birds-dice-jumpscare.gif",
		},
		color: '#ff5454',
	})

	const oldMessage = await message.channel.send({embeds: [embed]})

	let randomData: RandomResult = {data: "", tried: 0};
	let tried = 0

    while (true) {
		const randomizedID = randomUtils.randomInt(1,20000)
		tried++
		const response = await axios.get("https://polytoria.com/assets/thumbnails/catalog/" + randomizedID + ".png", {validateStatus: () => true})
		
		if (response.status != 404) {
			const response2 = await axios.get("https://api.polytoria.com/v1/asset/info?id=" + randomizedID, {validateStatus: () => true})

			if (response2.status == 400) {
				randomData.data = "https://polytoria.com/assets/thumbnails/catalog/" + randomizedID + ".png"
				randomData.tried = tried
				break
			}

		}

		if (tried >= 20) {
			embed.title = "Randomizer has tried too many times. Please try again."
			embed.setImage("https://c.tenor.com/KOZLvzU0o4kAAAAC/no-results.gif")
			await oldMessage.edit({embeds: [embed]})
			return
		}
	}

	embed.title = "Randomized!"
	embed.setImage(randomData.data)

	return await oldMessage.edit({embeds: [embed]})
}
