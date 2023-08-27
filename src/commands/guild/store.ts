import axios from 'axios'

export async function fetchStore (id: number, page: number) {
  const storeResponse = await axios.get(`https://api.polytoria.com/v1/guilds/${id}/store?page=${page}&limit=15`)
  const storeData = storeResponse.data.assets
  const storeItems = storeData
    .map((item: any, index: number) => '``' + (index + 1) + '``' + ` [${item.name}](https://polytoria.com/store/${item.id})`)
    .join('\n')

  return storeItems
}
