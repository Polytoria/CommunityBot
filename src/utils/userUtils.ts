import axios from 'axios'
import { dateUtils } from './dateUtils.js'
import { ILevel } from '../../types/index.js'

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
    const response = await axios.get('https://api.polytoria.com/v1/users/find', { params: { id }, validateStatus: () => true })
    const data = response.data.user

    return data.user
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
    const response = await axios.get('https://api.polytoria.com/v1/users/find', {
      params: { username },
      validateStatus: function (status) {
        return status >= 200 && status < 300 // default
      }
    })

    const user = response.data.user

    return user
  }

  /**
   * getLevel function
   * @param id
   * @returns
   */
  public static async getLevel (id: number): Promise<ILevel> {
    const result: ILevel = {
      final: 0,
      levels: {
        forum: 0,
        economy: 0,
        fame: 0
      },
      rank: 'Noob',
      external: {
        friendCountRounded: 0,
        accountAgeMonth: 0
      }
    }

    const userData = await userUtils.getUserData(id)

    const joinDateDate = new Date(userData.JoinedAt)
    const currentDate = new Date()

    const accountAgeMonth = dateUtils.monthDifference(joinDateDate, currentDate)

    result.external.accountAgeMonth = accountAgeMonth

    const userFriends = await axios.get('https://api.polytoria.com/v1/users/friends?id=' + userData.ID)

    const friendCountRounded = 10 * userFriends.data.Pages

    result.external.friendCountRounded = friendCountRounded

    const result2 = 12 * ((-1 / ((1 * accountAgeMonth) + 0.4) + 1))
    const result3 = 12 * ((-1 / ((friendCountRounded / 100) + 1) + 1))
    const result4 = 8 * ((-1 / ((userData.ForumPosts / 25) + 1) + 1))
    const result5 = 15 * ((-1 / ((userData.ProfileViews / 1500) + 1) + 1))
    const result6 = 10 * ((-1 / ((userData.TradeValue / 30000) + 1) + 1))
    const result7 = 10 * ((-1 / ((userData.ItemSales / 3) + 1) + 1))

    const final = Math.round(result2 + result3 + result4 + result5 + result6 + result7)

    result.final = final

    if (final > 15) {
      result.rank = 'Above Average'
      if (final > 50) {
        result.rank = 'Insane'
        if (final === 69) {
          result.rank = 'Nice'
        } else if (final > 75) {
          result.rank = 'God'
        }
      }
    } else {
      result.rank = 'Noob'
    }

    result.levels.economy = Math.round(result6 + result7)
    result.levels.fame = Math.round(result3 + result5 + result6)
    result.levels.forum = Math.round(result4)

    return result
  }
}
