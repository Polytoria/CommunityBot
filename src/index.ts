// <reference path="index.d.ts"/>
import {Client, ClientVoiceManager} from 'discord.js'
import dotenv from 'dotenv'
import {success, alert, warning} from './utils/log.js'
import commands from './exports.js'
import {IConfiguration, ICommand} from '../types'

// Initialize .env file.
dotenv.config()

const configuration: IConfiguration = {
	token: process.env.TOKEN,
	prefix: 'p!',
	coolDown: 3
}

const client = new Client({
	intents: ['GUILD_MESSAGES', 'GUILDS', 'GUILD_MEMBERS']
})

client.on('ready', () => {
	success({context: '[Bot]', message: 'Bot succesfully connected.'})
	client.user!.setActivity({
		type: 'PLAYING',
		url: 'https://api.polytoria.com',
		name: 'Watching Polytoria API 👀'
	})
	success({context: '[Bot]', message: 'Bot succesfully started.'})
})

client.on('messageCreate', async (message): Promise<any | void> => {
	if (message.author.bot) {
		return
	}

	if (!message.content.startsWith(configuration.prefix)) {
		return success({context: '[Server]', message: 'Message logged.'})
	}

	if (!message.inGuild) {
		return alert({context: '[Server]', message: 'Not in guild.'})
	}

	success({
		context: '[Client]',
		message: 'Command registered.'
	})

	const data = message.content.slice(configuration.prefix.length, message.content.length).trim().split(/ +/g)

	const command: any = data[0]
	const argument: any[] = data.splice(1, data.length)

	if (commands.hasOwnProperty(command)) {
		success({
			context: '[Bot]',
			message: 'Running command ' + command
		})

		//@ts-expect-error
		const invoke = commands[command]

		try {
			if (invoke.constructor.name === 'AsyncFunction') {
				await invoke(message, argument)
			} else {
				invoke(message, argument)
			}
		} catch (err: any) {
			warning({
				context: '[Bot]',
				message: err.toString()
			})
		}
	}
})

success({context: '[Bot]', message: 'Bot succesfully logged in.'})

client.login(configuration.token)
