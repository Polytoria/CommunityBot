// <reference path="index.d.ts"/>
import { Client, ClientVoiceManager } from 'discord.js'
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

const client = new Client({
    intents: [
      "DIRECT_MESSAGES",
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
    console.log("OK")
    if (message.author.bot) return
    if (!message.content.startsWith(configuration.prefix)) return alert('Invalid Prefix: ' + message.content)
    if (!message.inGuild) return alert('Not in guild.')
    success({
        context: '[Client]',
        message: "User sent a valid message."
    })
    const data = message.content
        .slice(configuration.prefix.length, message.content.length)
        .trim()
        .split(/ +/g)

    const command: any = data[0]
    const argument: any[] = data.splice(1, data.length)
    console.log("User sent: " + JSON.stringify({
        command: command,
        arguments: argument
    }))
    if(commands.hasOwnProperty(command)){
        console.log("Found command: " + command);

        // @ts-expect-error
        const invoke = commands[command];

        if(invoke.constructor.name === "AsyncFunction"){
           console.log("Running async function")
            await invoke(message, argument )
            
        } else {
            console.log("Running function")

            invoke(message, argument)
        }
    }
    // We will pass the message and argument, as we need the message to reply.
    
})
success({ context: '[Bot]', message: 'Bot succesfully logged in.' })

client.login(configuration.token)
