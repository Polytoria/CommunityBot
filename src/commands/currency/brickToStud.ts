import {Message, MessageEmbed} from 'discord.js'

export function brickToStud(message: Message, args: string[]): Promise<Message<boolean>> {
	const bricks = parseInt(args[0])
	const studs = bricks * 15

	const embed: MessageEmbed = new MessageEmbed({
		title: 'Bricks to Studs!',
		color: '#ff5454',
		fields: [
			{
				name: 'bricks',
				value: bricks.toLocaleString(),
				inline: true
			},
			{
				name: 'studs',
				value: studs.toLocaleString(),
				inline: true
			}
		],
		description: `**${bricks} <:brick:905987077995376640> ↔️ ${studs} <:stud:905987085347983411>**`
	})

	return message.channel.send({embeds: [embed]})
}
