import axios from 'axios'

export class userUtils {
  /**
	 * getUserData
	 *
	 * @summary Get User Data from ID
	 *
	 * @param {number} id Targeted UserID
	 * @returns {Promise<any>} Return User Data
	 */
  public static async getUserData (id: number): Promise<any> {
    const response = await axios.get('https://api.polytoria.com/v1/users/user', { params: { id }, validateStatus: () => true })
    const data = response.data

    return data
  }

  /**
	 * getUserDataFromUsername
	 *
	 * @summary Get User Data from Username
	 *
	 * @param {string} username Targeted User
	 * @returns {Promise<any>} Return User Data
	 */
  public static async getUserDataFromUsername (username: string): Promise<any> {
    const response = await axios.get('https://api.polytoria.com/v1/users/getbyusername', {
      params: { username },
      validateStatus: function (status) {
        return status >= 200 && status < 300 // default
      }
    })
    const data = response.data

    return data
  }
}
