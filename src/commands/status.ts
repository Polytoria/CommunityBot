import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import emojiUtils from '../utils/emojiUtils.js'
import { IStatus } from '../../types/index.js'

const urlToCheck = [
  {
    name: 'Main site',
    url: 'https://polytoria.com/'
  },
  {
    name: 'Internal APIs',
    url: 'https://polytoria.com/api/fetch/catalog/items'
  },
  {
    name: 'Blog',
    url: 'https://blog.polytoria.com/'
  },
  {
    name: 'Corp site',
    url: 'https://corp.polytoria.com/'
  },
  {
    name: 'Docs site',
    url: 'https://docs.polytoria.com/'
  }

]

function statusToEmoji (status: string): string {
  if (status === 'Experiencing Issues') {
    return emojiUtils.warning
  }

  if (status === 'Down') {
    return emojiUtils.error
  }

  if (status === 'Working') {
    return emojiUtils.checkmark
  }

  return '❓'
}

async function checkStatus (url: string): Promise<IStatus> {
  const startTime = new Date().getTime()
  const response = await axios.get(url, { validateStatus: () => true, timeout: 20000 })
  const endTime = new Date().getTime()

  let statusText = 'Unknown'
  const responseTime = endTime - startTime

  if (responseTime > 3000) {
    statusText = 'Experiencing Issues'
  }

  if (response.status.toString().startsWith('5')) {
    statusText = 'Down'
  }

  if (response.status.toString().startsWith('2')) {
    statusText = 'Working'
  }

  return {
    status: statusText,
    statusCode: response.status,
    responseTime: responseTime
  }
}

export async function status (message: Message, args: string[]) {
  const embed = new MessageEmbed({
    title: 'Polytoria Status',
    description: emojiUtils.loading + ' Checking..',
    url: 'https://status.polytoria.com/',
    color: '#ff5454',
    fields: [

    ]
  })

  let index = 0
  for (const item of urlToCheck) {
    embed.fields[index] = {
      name: item.name,
      value: `${emojiUtils.loading} Checking`,
      inline: true
    }
    index++
  }

  const msg = await message.channel.send({ embeds: [embed] })
  const responseTimes = []

  let index2 = 0
  for (const item of urlToCheck) {
    const mainPageStatus = await checkStatus(item.url)

    embed.fields[index2].value = `${statusToEmoji(mainPageStatus.status)} ${mainPageStatus.status}\n\`${mainPageStatus.statusCode}\` \`${mainPageStatus.responseTime}ms\``
    msg.edit({ embeds: [embed] })
    responseTimes.push(mainPageStatus.responseTime)
    index2++
  }

  embed.description = `Average Response time: \`${(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2)}ms\``
  msg.edit({ embeds: [embed] })

  return msg
}
