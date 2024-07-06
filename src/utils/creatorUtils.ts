import { ICreator } from '../../types'
import axios from 'axios'
import { userUtils } from './userUtils.js'

export class creatorUtils {
  /**
 * get Display Creator Name
 * @param creator ICreator
 * @returns {Promise<string>} Return display string
 * Example of return string
 * User: Polytoria
 * Guild: Polytoria Staff Guild (Guild)
 */
  public static async getDisplayCreatorName (creator: ICreator): Promise<string> {
    let result: string = ''

    if (creator.creatorType === 'User') {
      const userData = await userUtils.getUserData(creator.creatorID)
      if (userData.Success === false) {
        return 'Invaild user.'
      }
      result = userData.Username
    } else {
      const response = await axios.get('https://api.polytoria.com/v1/guild/info', { params: { id: creator.creatorID } })
      const data = response.data

      result = data.Name + ' (Guild)'
    }

    return result
  }
}
