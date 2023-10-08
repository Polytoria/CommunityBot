import axios from 'axios'

export async function fetchShouts(guildID: number, page: number): Promise<string> {
  const response = await axios.get(`https://polytoria.com/api/guilds/${guildID}/shouts?page=${page}`)
  const data = response.data.data
  const shouts = data.map((shout: any) => {
    return `**${shout.title}**\n${shout.content}\n*Posted by [${shout.author.username}](https://polytoria.com/users/${shout.author.id})*`
  })
  return shouts.join('\n\n')
}