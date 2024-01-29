// <reference path="index.d.ts"/>
import { Client, GatewayIntentBits, ActivityType, Events, Collection, BaseInteraction } from 'discord.js'
import dotenv from 'dotenv'
import { success, warning } from './utils/log.js'
import commandsData from './commandsData.js'
import { IConfiguration } from '../types'

// Initialize .env file.
dotenv.config()

const configuration: IConfiguration = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENTID,
  coolDown: 3
}

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
})

// @ts-expect-error
client.commands = new Collection()

commandsData.forEach((commandData, index) => {
  // @ts-expect-error
  client.commands.set(commandData.data.name, commandData)
})

client.on('ready', () => {
  // @ts-expect-error
  client.user.setActivity(`${client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0)} Users`, { type: ActivityType.Watching })

  setInterval(function () {
    // @ts-expect-error
    client.user.setActivity(`${client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0)} Users`, { type: ActivityType.Watching })
  }, 60000)
})
success({ context: '[Bot]', message: 'Bot succesfully started.' })

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith('p!')) return
  if (!message.inGuild) return

  await message.reply('The Polytoria Community Bot has switched to slash commands!')
})

client.on(Events.InteractionCreate, async (interaction:BaseInteraction) => {
  if (!interaction.isCommand()) {
    return
  }

  // @ts-expect-error
  const command:any = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    interaction.reply("Command doesn't exist")
    return
  }

  success({
    context: '[Client]',
    message: 'Command registered.'
  })

  success({
    context: '[Bot]',
    message: 'Running command ' + command.data.name
  })

  try {
    if (command.constructor.name === 'AsyncFunction') {
      await command.execute(interaction)
    } else {
      command.execute(interaction)
    }
  } catch (error: any) {
    if (interaction.replied) {
      await interaction.followUp('Failed to execute command: ' + error)
    } else {
      await interaction.reply('Failed to execute command: ' + error)
    }
    warning({
      context: '[Bot]',
      message: error.toString()
    })
  }
})

// Handle Promise Rejection
process.on('unhandledRejection', (reason, p) => {
  console.error(reason, 'Unhandled Rejection at Promise', p)
})

process.on('uncaughtException', err => {
  console.error(err)
  process.exit(1)
})

success({ context: '[Bot]', message: 'Bot succesfully logged in.' })

client.login(configuration.token)
