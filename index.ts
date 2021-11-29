import { Message, Client, MessageEmbed } from 'discord.js'
import dotenv from 'dotenv'

// Initialize .env file.
dotenv.config()

const configuration : IConfiguration = {
    token: process.env.TOKEN,
    prefix: "p!",
    coolDown: 3
}

const bot : Client<boolean> = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MESSAGES"]
})

// Check messages sent.
// Soon to be deprecated.
bot.on('message', (message): any | void =>  {

    if(message.author.bot) return;
    if(!message.content.startsWith(configuration.prefix)) return;
    if(!message.inGuild) return;

    const data = message.content.slice(configuration.prefix.length, message.content.length).trim().split(/ +/g);
   
    const command : string = data[0];
    const argument : any[] = data.splice(1, data.length);

    

})
