import { Message } from 'discord.js'

export function ping (message: Message, _arugments: string[]): Promise<Message<boolean>> {
  return message.channel.send('Pong! 🏓')
}
