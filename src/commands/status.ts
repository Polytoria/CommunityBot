import { Message, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import emojiUtils from '../utils/emojiUtils.js'
import { IStatus } from '../../types/index.js'

const urlToCheck = [
  {
    name: 'Main site',
    url: 'https://polytoria.com/'
  },
  {
    name: 'Public APIs',
    url: 'https://api.polytoria.com/v1/users/7348'
  },
  {
    name: 'Blog',
    url: 'https://blog.polytoria.com/'
  },
  {
    name: 'Docs',
    url: 'https://docs.polytoria.com/'
  },
  {
    name: 'Helpdesk',
    url: 'https://help.polytoria.com/'
  }

]

function statusToEmoji (status: string): string {
  if (status === 'Experiencing Issues') {
    return emojiUtils.warning
  }

  if (status === 'Down') {
    return emojiUtils.error
  }

  if (status === 'Forbidden') {
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

  if (response.status.toString().startsWith('4')) {
    statusText = 'Forbidden'
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
  const embed = new EmbedBuilder({
    title: 'Polytoria Status',
    description: emojiUtils.loading + ' Checking..',
    url: 'https://status.polytoria.com/',
    color: 0xFF5454,
    fields: []
  })

  const fieldPromises = urlToCheck.map(async (item) => {
    const mainPageStatus = await checkStatus(item.url)
    return {
      name: item.name,
      value: `${statusToEmoji(mainPageStatus.status)} ${mainPageStatus.status}\n\`${mainPageStatus.statusCode}\` \`${mainPageStatus.responseTime}ms\``,
      inline: true
    }
  })

  const fields = await Promise.all(fieldPromises)
  embed.addFields(fields)

  const msg = await message.reply({ embeds: [embed] })

  const responseTimes = fields.map((field) => {
    const [, , , responseTimeStr] = field.value.split(' ')
    return parseInt(responseTimeStr)
  })

  const averageResponseTime = (
    responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
  ).toFixed(2)

  embed.setDescription(`Average Response time: \`${averageResponseTime}ms\``)
  await msg.edit({ embeds: [embed] })

  return msg
}
