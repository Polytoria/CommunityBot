import { Message } from 'discord.js'

// Why "_aruments" and not "arguments"?
// Because typescript was going nuts over the fact that "arguments" is a thing, I dont know why.
export function lookUp(
	message: Message,
	_arguments: any[]
): void | Promise<Message<boolean>> {
	if (!_arguments)
		return message.channel.send('We require the username argument!');
	
	
}
