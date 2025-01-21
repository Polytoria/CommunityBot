export async function fetchStore (id: number, page: number) {
  const response = await fetch(`https://api.polytoria.com/v1/guilds/${id}/store?page=${page}&limit=15`)

  const data = await response.json()
  const storeData = data.assets
  const totalAssets = data.total
  const totalPages = data.pages

  // If no store assets are found, return a message
  if (storeData.length === 0) {
    return 'There are no store assets in this guild.'
  }

  // Prepare the store assets list
  const storeItems = storeData
    .map((item: any, index: number) => `\`\`${(index + 1) + (page - 1) * 15}\`\` [${item.name}](https://polytoria.com/store/${item.id})`)
    .join('\n')

  // Format and return the result string
  return `> **Total Assets: ${totalAssets}\n > Page ${page}/${totalPages}**\n\n${storeItems}`
}
