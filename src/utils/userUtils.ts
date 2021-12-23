import fetch from 'node-fetch'

export class userUtils {
	public static async getUserData(id: number): Promise<any> {
		const response = await fetch(`https://api.polytoria.com/v1/users/user?id=${id}`)
		const data: any = await response.json()

		return data
	}
}
