// Script to deploy the commands to discord
import dotenv from 'dotenv'
import commandsData from './commandsData.js'
import { REST, Routes } from 'discord.js'

dotenv.config()

const rest = new REST().setToken(process.env.TOKEN!)

async function deploy () {
  try {
    console.log('Deploying commands')

    const commands: any = []

    commandsData.forEach((commandData, index) => {
      commands.push({ ...commandData.data.toJSON(), integration_types: [0, 1], contexts: [0, 1, 2] })
    })

    const data:any = await rest.put(
      // @ts-expect-error
      Routes.applicationCommands(process.env.CLIENTID),
      { body: commands }
    )

    console.log(`Deployed ${data.length} commands`)
  } catch (error) {
    console.log('Failed deployment')
    console.error(error)
  }
}

deploy()
