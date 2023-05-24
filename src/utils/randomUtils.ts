import axios from 'axios'
import { RandomResult } from '../../types/index.d.js'

export class randomUtils {
  public static async randomize (
    api: string,
    vaildFunction: Function,
    generateParams: Function,
    maxTriedCount: number
  ): Promise<RandomResult | null> {
    let resultData
    let triedCount = 0

    while (true) {
      triedCount++

      const response = await axios.get(api, {
        params: generateParams(),
        validateStatus: () => true
      })

      if (response.status !== 404 && response.status !== 400) {
        let testResult = null
        if (vaildFunction.constructor.name === 'AsyncFunction') {
          testResult = await vaildFunction(response)
        } else {
          testResult = vaildFunction(response)
        }

        if (testResult) {
          const data = response.data
          resultData = data
          break
        }
      }

      if (triedCount > maxTriedCount) {
        return null
      }
    }

    const resultReturn: RandomResult = {
      tried: triedCount,
      data: resultData
    }

    return resultReturn
  }

  /**
   * randomInt
   *
   * @summary Random integer
   *
   * @param { number } min Min Number
   * @param { number } max Max Number
   * @returns { number } Randomized Number
   */
  public static randomInt (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min
  }
}
