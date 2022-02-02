import {Message, MessageEmbed, MessageActionRow, MessageSelectMenu} from 'discord.js'
import axios from 'axios'
import textTable from 'text-table'

export async function leaderboard(message: Message, args: string[]) {
	let currentType = 'networth'

	// Change Page Function, Fetch current page
	async function refreshLeaderboard(): Promise<string> {
		const apiURL = 'https://polytoria.com/api/fetch/leaderboard?c=' + currentType

		const response = await axios.get(apiURL, {validateStatus: () => true})
		let resultTable = []

		resultTable.push(['**#**', '**User**​', '**​Amount**'])

		let counter = 1

		//@ts-expect-error
		response.data.forEach((item) => {
			let counterDisplay: string = counter.toString()

			resultTable.push([counterDisplay, `[${item.username}](https://polytoria.com/user/${item.user_id})`, '`' + item.statistic + '`'])
			counter++
		})

		return textTable(resultTable, {align: ['l', 'l', 'l'], hsep: 'ㅤ'})
	}

	const embed = new MessageEmbed({
		title: 'Leaderboard',
		url: `https://polytoria.com/leaderboard`,
		color: '#ff5454',
		thumbnail: {
			url: `https://polytoria.com/assets/thumbnails/catalog/234.png?v=2`
		},
		description: ''
	})

	// Fetch leaderboard
	const leaderboardData: string = await refreshLeaderboard()
	embed.description = leaderboardData

	// Generate Button ID base on current time
	const buttonID: string = new Date().toString()
	const selectorID: string = 'selector' + buttonID

	// Create Buttons

	const selectMenu = new MessageSelectMenu()
		.setCustomId(selectorID)
		.setPlaceholder('Select Type here..')
		.addOptions([
			{
				label: 'Trade Value',
				value: 'networth',
				emoji: '💰'
			},
			{
				label: 'Forum Posts',
				value: 'posts',
				emoji: '🦆'
			},
			{
				label: 'Comments',
				value: 'comments',
				emoji: '💬'
			},
			{
				label: 'Profile Views',
				value: 'views',
				emoji: '👨‍👩‍👦'
			},
			{
				label: 'Item sales',
				value: 'sales',
				emoji: '👕'
			}
		])
	//.addComponents(selectMenu)

	const row = new MessageActionRow().addComponents(selectMenu)

	const filter = () => true

	// Create Interaction event for 2 minutes
	const collector = message.channel.createMessageComponentCollector({filter, time: 120000})

	// Listen for Button Interaction
	collector.on('collect', async (i) => {
		if (i.user.id !== message.author.id) {
			return
		}

		if (i.customId === selectorID) {
			//@ts-expect-error
			currentType = i.values[0]
		}

		// Fetch leaderboard
		const leaderboardData: string = await refreshLeaderboard()
		embed.description = 'Leaderboards > ' + currentType + '\n\n' + leaderboardData
		embed.url = 'https://polytoria.com/leaderboard?c=' + currentType

		// Update Embed and Button
		await i.update({embeds: [embed], components: [row]})
	})

	return await message.channel.send({embeds: [embed], components: [row]})
}
