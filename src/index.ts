// <reference path="index.d.ts"/>
import { Client, ClientVoiceManager } from 'discord.js'
//@ts-ignore
import dotenv from 'dotenv'
import { success, alert, warning } from './utils/log.js'
import commands from './exports.js';
import { IConfiguration, ICommand } from '../types';

// Initialize .env file.
dotenv.config()

const configuration: IConfiguration = {
    token: process.env.TOKEN,
    prefix: 'p!',
    coolDown: 3,
}

const client = new Client({
    intents: [
        "GUILD_MESSAGES",
        "GUILDS",
        "GUILD_MEMBERS",
    ],
});


client.on('ready', () => {
    success({ context: '[Bot]', message: 'Bot succesfully connected.' })
    //@ts-expect-error
    client.user.setActivity({
        type: 'PLAYING',
        url: 'https://api.polytoria.com',
        name: 'Watching Polytoria API 👀',
    })
    success({ context: '[Bot]', message: 'Bot succesfully started.' })

})

client.on('messageCreate', async (message): Promise<any | void> => {
    if (message.author.bot) return
    if (!message.content.startsWith(configuration.prefix)) return success({ context: '[Server]', message: 'Message logged.' })
    if (!message.inGuild) return alert({ context: '[Server]', message: 'Not in guild.' })
    success({
        context: '[Client]',
        message: "Command Registered."
    })
    const data = message.content
        .slice(configuration.prefix.length, message.content.length)
        .trim()
        .split(/ +/g)

    const command: any = data[0].toLowerCase()
    const argument: any[] = data.splice(1, data.length)
    console.log(argument)
    if (commands.hasOwnProperty(command)) {
        success({
            context: '[Bot]',
            message: 'Running command ' + command
        })
        //@ts-expect-error
        const invoke = commands[command];

        if (invoke.constructor.name === "AsyncFunction") {
            try {
                await invoke(message, argument)
            } catch (err) {
                warning({
                    context: '[Bot]',
                    //@ts-expect-error
                    message: err
                })
            }


        } else {
            console.log("Running function")

            try {
                await invoke(message, argument)
            } catch (err) {
                warning({
                    context: '[Bot]',
                    //@ts-expect-error
                    message: err
                })
            }
        }
    }
    // We will pass the message and argument, as we need the message to reply.

})
success({ context: '[Bot]', message: 'Bot succesfully logged in.' })

client.login(configuration.token)
