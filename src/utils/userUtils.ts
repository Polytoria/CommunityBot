import fetch from 'node-fetch'

export class userUtils {
	public static async getUserData(id: number) {
		const url = `https://api.polytoria.com/v1/users/user?id=${id}`
		const response = await fetch(url)
		const data: any = await response.json()

		const finalURL = `https://polytoria.com/assets/thumbnails/avatars/${data.AvatarHash}.png`
		return data
	}
}
