export async function fetchRatelimit (): Promise<{ enabled: boolean, time: number, reason: string }> {
  try {
    const response = await fetch('https://starmanthegamer.com/ratelimit.json')
    if (!response.ok) {
      throw new Error('Failed to fetch ratelimit status')
    }
    const data = await response.json()

    if (data.ratelimit === 'true') {
      return { enabled: true, time: parseInt(data.time), reason: data.reason }
    } else {
      return { enabled: false, time: 0, reason: '' }
    }
  } catch (error) {
    console.error('Error fetching ratelimit status:', error)
    return { enabled: false, time: 0, reason: '' }
  }
}
