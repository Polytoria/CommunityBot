// <reference path="index.d.ts"/>
import { Client } from 'discord.js'
//@ts-ignore
import dotenv from 'dotenv'
import { success } from './utils/log.js'
import commands from './exports.js';
import { IConfiguration, ICommand } from '../types';

// Initialize .env file.
dotenv.config()

const configuration: IConfiguration = {
    token: process.env.TOKEN,
    prefix: 'p!',
    coolDown: 3,
}

const bot: Client<boolean> | Client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_MESSAGES'],
})

bot.on('ready', (client) => {
    success({ context: '[Bot]', message: 'Bot succesfully connected.' })
    bot.user.setActivity({
        type: 'PLAYING',
        url: 'https://api.polytoria.com',
        name: 'Watching Polytoria API 👀',
    })
})

// Check messages sent.
// Soon to be deprecated.
bot.on('message', async (message): Promise<any | void> => {
    if (message.author.bot) return
    if (!message.content.startsWith(configuration.prefix)) return
    if (!message.inGuild) return

    const data = message.content
        .slice(configuration.prefix.length, message.content.length)
        .trim()
        .split(/ +/g)

    const command: any = data[0]
    const argument: any[] = data.splice(1, data.length)

    if(commands.hasOwnProperty(command)){

        const invoke = commands[command];

        if(invoke.constructor.name === "AsyncFunction"){
           await invoke(message, argument )

        } else {
            invoke(message, argument)
        }
    }
    // We will pass the message and argument, as we need the message to reply.
    
})

bot.login(configuration.token)
