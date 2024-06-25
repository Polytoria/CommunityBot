import axios from 'axios'

export async function fetchStore (id: number, page: number) {
  // Fetch the store data from the API
  const storeResponse = await axios.get(`https://api.polytoria.co/v1/guilds/${id}/store?page=${page}&limit=15`)
  const storeData = storeResponse.data.assets
  const totalAssets = storeResponse.data.total
  const totalPages = storeResponse.data.pages

  // If no store assets are found, return a message
  if (storeData.length === 0) {
    return 'There are no store assets in this guild.'
  }

  // Prepare the store assets list
  const storeItems = storeData
    .map((item: any, index: number) => `\`\`${(index + 1) + (page - 1) * 15}\`\` [${item.name}](https://polytoria.co/store/${item.id})`)
    .join('\n')

  // Format and return the result string
  return `> **Total Assets: ${totalAssets}\n > Page ${page}/${totalPages}**\n\n${storeItems}`
}
