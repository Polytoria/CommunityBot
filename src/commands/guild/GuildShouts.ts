export async function fetchShouts (guildID: number, page: number): Promise<string> {
  let allShouts: any[] = []

  async function fetchPage (pageNumber: number) {
    const response = await fetch(`https://polytoria.com/api/guilds/${guildID}/shouts?page=${pageNumber}`)

    const data = await response.json()

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
    return `**${shout.title}**\n${shout.content}\n*Posted by [${shout.author.username}](https://polytoria.com/users/${shout.author.id})*`
  })

  return shouts.join('\n\n')
}
