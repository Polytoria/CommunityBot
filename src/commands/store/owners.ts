import { EmbedBuilder } from 'discord.js'

export async function fetchOwners (itemID: number, page: number): Promise<{ total: number, inventories: { serial: number, user: { username: string, id: number } }[], pages: number }> {
  const response = await fetch(`https://api.polytoria.com/v1/store/${itemID}/owners?limit=10&page=${page}`)

  const data = await response.json()
  return data
}

// Function to build the owners embed
export function buildOwnersEmbed (ownersData: { total: number, inventories: { serial: number, user: { username: string, id: number } }[], pages: number }, page: number, thumbnail: string): EmbedBuilder {
  const ownersEmbed = new EmbedBuilder()
    .setTitle('Item Owners (' + ownersData.total + ')')
    .setColor('#FF5454')
    .setThumbnail(thumbnail)

  const ownersContent = ownersData.inventories.map((owner) => {
    return `Serial #${owner.serial}. [${owner.user.username}](https://polytoria.com/users/${owner.user.id})`
  })

  ownersEmbed.setDescription(`> **Page ${page}/${ownersData.pages} **\n\n` + ownersContent.join('\n'))
  return ownersEmbed
}
