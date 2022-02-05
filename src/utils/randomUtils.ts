import axios from 'axios'
import {RandomResult} from '../../types/index.d.js'

export class randomUtils {

	/**
	 * randomize Function
	 * 
	 * @summary Randomize Function for randomizing stuff
	 * 
	 * @param { string } api API Url
	 * @param { Function } vaildFunction Check if vaild, return True if vaild
	 * @param { Function } generateParams Generate random parameter
	 * @param { Number } maxTriedCount Request Limit
	 * @returns { Promise<RandomResult | null> } Result Data
	 */
	public static async randomize(
		api: string,
		vaildFunction: Function,
		generateParams: Function,
		maxTriedCount: number
	): Promise<RandomResult | null> {
		let resultData;
		let triedCount = 0;

		while (true) {
			triedCount++

			const response = await axios.get(api, {params: generateParams(),validateStatus: () => {return true}})

			if (response.status != 404) {	
				if (response.status != 400) {
					const testResult = vaildFunction(response)

					if (testResult == true) {
						const data = response.data
						resultData = data
						break
					}
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
	public static randomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min) ) + min;
	}
}
