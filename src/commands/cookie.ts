import {Message} from 'discord.js'

export async function cookie(message: Message, args: any[]): Promise<Message<boolean>> {
	return await message.channel.send('🍪')
}
