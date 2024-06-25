import axios from 'axios'

export async function fetchShouts (guildID: number, page: number): Promise<string> {
  let allShouts: any[] = []

  async function fetchPage (pageNumber: number) {
    const response = await axios.get(`https://polytoria.co/api/guilds/${guildID}/shouts?page=${pageNumber}`)
    const data = response.data

    if (data.meta) {
      allShouts = allShouts.concat(data.data)

      if (data.meta.nextPage) {
        await fetchPage(data.meta.nextPage)
      }
    }
  }

  await fetchPage(page)

  if (allShouts.length === 0) {
    return "This guild doesn't have any public shouts."
  }

  const shouts = allShouts.map((shout: any) => {
    return `**${shout.title}**\n${shout.content}\n*Posted by [${shout.author.username}](https://polytoria.co/users/${shout.author.id})*`
  })

  return shouts.join('\n\n')
}
