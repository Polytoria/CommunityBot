import axios from 'axios'

export class userUtils {
	public static async getUserData(id: number): Promise<any> {
		const response = await axios.get('https://api.polytoria.com/v1/users/user', {params: {id}})
		const data = response.data

		return data
	}
}
